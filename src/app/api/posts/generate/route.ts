import { NextResponse } from "next/server";
import { createAdminClient, getUser } from "@/lib/supabase/server";
import { cleanTourUrl } from "@/lib/virtual-tour";
import { generatePost, MAX_FOCUS } from "@/lib/generate";
import { ClaudeRefusalError } from "@/lib/claude";
import type { AllowanceKind } from "@/lib/plans";
import type { Design, Language, Listing, MortgageInputs, Platform, PostFormat, PostType, Profile, Aspect, TextMode } from "@/lib/types";
import { PLATFORM_SPECS, POST_TYPES } from "@/lib/types";

export const maxDuration = 60;

type Body = {
  listing_id: string;
  platform: Platform;
  format: PostFormat;
  post_type: PostType;
  language: Language;
  /** Features to lead with (optional, max 3). */
  focus?: string[];
  /** Agent's notes: facts not in the listing. */
  notes?: string;
  /** Older clients sent free text here; treated as notes. */
  highlights?: string;
  include_contact_slide?: boolean;
  include_tour?: boolean;
  mortgage?: MortgageInputs | null;
  template?: Design["template"];
  /** Set when regenerating an existing post ("Try another version", "Change focus"). */
  regenerate_of?: string;
  aspect?: Aspect;
  text_mode?: TextMode;
};

export async function POST(request: Request) {
  const { supabase, user } = await getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const body = (await request.json().catch(() => null)) as Body | null;
  if (
    !body?.listing_id ||
    !["instagram", "facebook", "linkedin"].includes(body.platform) ||
    !["single", "carousel"].includes(body.format) ||
    !(body.post_type in POST_TYPES) ||
    !["en", "fr", "bilingual"].includes(body.language)
  ) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const [{ data: listing }, { data: profile }] = await Promise.all([
    supabase.from("listings").select("*").eq("id", body.listing_id).single<Listing>(),
    supabase.from("profiles").select("*").eq("id", user.id).single<Profile>(),
  ]);
  if (!listing || !profile) return NextResponse.json({ error: "Listing not found" }, { status: 404 });

  // A regeneration rewrites an existing post of this listing; anything else is a new post.
  let kind: AllowanceKind = "post";
  if (body.regenerate_of) {
    const { data: original } = await supabase.from("posts").select("id").eq("id", body.regenerate_of).eq("listing_id", listing.id).maybeSingle();
    if (!original) return NextResponse.json({ error: "Post to regenerate not found." }, { status: 404 });
    kind = "regen";
  }

  // Paywall: atomically use one allowance (enforced in the database).
  const { data: quota, error: quotaError } = await supabase.rpc("consume_generation", { p_kind: kind }).single<{
    allowed: boolean;
    used: number;
    lim: number;
    is_guest: boolean;
    plan: string;
    kind: AllowanceKind;
    resets_at: string | null;
  }>();
  if (quotaError || !quota) return NextResponse.json({ error: "Couldn't check your plan." }, { status: 500 });
  if (!quota.allowed) {
    const resets = quota.resets_at ? new Date(quota.resets_at).toLocaleDateString("en-CA", { month: "long", day: "numeric" }) : null;
    const what = kind === "regen" ? "regenerations" : "new posts";
    const [error, paywall] = quota.is_guest
      ? ["You've used your free preview. Create a free account to get 2 more generations.", "signup"]
      : quota.plan === "free"
        ? ["You've used your 3 free generations. Choose a plan to keep creating.", "upgrade"]
        : [`You've used this month's ${quota.lim} ${what}${resets ? `. They reset on ${resets}` : ""}. Upgrade for more, or wait for your renewal.`, "limit"];
    return NextResponse.json({ error, paywall, plan: quota.plan, resets_at: quota.resets_at }, { status: 402 });
  }

  const focus = (Array.isArray(body.focus) ? body.focus : [])
    .filter((f): f is string => typeof f === "string")
    .map((f) => f.trim().slice(0, 120))
    .filter(Boolean)
    .slice(0, MAX_FOCUS);
  const notes = String(body.notes ?? body.highlights ?? "").trim().slice(0, 1000);

  // Single images have one slide, so "cover only" is the same as text on the photo.
  const requested = body.text_mode && ["all", "cover", "none"].includes(body.text_mode) ? body.text_mode : PLATFORM_SPECS[body.platform].defaultTextMode;
  const textMode: TextMode = body.format === "single" && requested === "cover" ? "all" : requested;

  const mortgage = profile.role === "mortgage_broker" && body.mortgage?.enabled ? body.mortgage : null;
  const includeContact = body.include_contact_slide ?? profile.include_contact;

  let generated;
  try {
    generated = await generatePost({
      listing,
      profile,
      platform: body.platform,
      format: body.format,
      postType: body.post_type,
      language: body.language,
      focus,
      notes,
      textMode,
      includeContactSlide: body.format === "carousel" && includeContact,
      tourUrl: body.include_tour === false ? null : cleanTourUrl(listing.virtual_tour_url),
      mortgage,
    });
  } catch (e) {
    await refund(user.id, kind);
    const message = e instanceof ClaudeRefusalError || e instanceof Error ? e.message : "Generation failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  const design: Design = {
    template: body.template ?? "classic",
    aspect: body.aspect && PLATFORM_SPECS[body.platform].aspects.includes(body.aspect) ? body.aspect : PLATFORM_SPECS[body.platform].defaultAspect,
    text_mode: textMode,
    primary: profile.brand_primary,
    secondary: profile.brand_secondary,
    accent: profile.brand_accent,
    show_logo: profile.include_logo && !!profile.logo_path,
    show_headshot: profile.include_headshot && !!profile.headshot_path,
    show_contact: profile.include_contact,
    show_brokerage: true,
    show_price: listing.price != null,
  };

  const { data: post, error } = await supabase
    .from("posts")
    .insert({
      user_id: user.id,
      listing_id: listing.id,
      platform: body.platform,
      format: body.format,
      post_type: body.post_type,
      language: body.language,
      highlights: notes || null,
      focus,
      focused_on: generated.focusedOn,
      caption: generated.caption,
      hashtags: generated.hashtags,
      slides: generated.slides,
      design,
      mortgage,
    })
    .select("id")
    .single();
  if (error) {
    await refund(user.id, kind);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: post.id, kind, remaining: quota.lim - quota.used });
}

/** Failed generations shouldn't count against the user's allowance. */
async function refund(userId: string, kind: AllowanceKind) {
  try {
    await createAdminClient().rpc("refund_generation", { p_user: userId, p_kind: kind });
  } catch (e) {
    console.error("refund_generation failed", e);
  }
}
