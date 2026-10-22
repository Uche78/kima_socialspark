import { NextResponse } from "next/server";
import { createAdminClient, getUser } from "@/lib/supabase/server";
import { MAX_FOCUS } from "@/lib/generate";
import type { JobParams } from "@/lib/generation-job";
import { queueGeneration } from "@/lib/generation-queue";
import { paywallFor } from "@/lib/paywall";
import { remaining, usageFrom, type AllowanceKind, type EntitlementRow } from "@/lib/plans";
import { readMortgageSettings, type PartnerRealtor } from "@/lib/broker";
import { readSheetConfig, sheetConfigFrom, type SheetConfig } from "@/lib/feature-sheet";
import type { Design, Language, Listing, MortgageInputs, Platform, Post, PostFormat, PostType, Profile, Aspect, TextMode } from "@/lib/types";
import { PLATFORM_SPECS, POST_TYPES } from "@/lib/types";

/**
 * Starts writing a post. Generation runs as a background job (it can take longer than the 30 s
 * a request gets); the client watches the job and loads the post when it's done.
 */

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
  /** Feature sheets: per-sheet settings (defaults to the broker's saved ones) and an optional saved realtor. */
  sheet?: unknown;
  realtor_id?: string | null;
  /** Posts made from a saved sheet (Sheet Builder). */
  sheet_id?: string;
  sheet_headline?: string;
  sheet_photo_index?: number | null;
  /** Write (or rewrite) the caption of an existing sheet post: the first caption uses a post, rewrites a regeneration. */
  post_id?: string;
};

export async function POST(request: Request) {
  const { supabase, user } = await getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const body = (await request.json().catch(() => null)) as Body | null;

  // Captioning a draft sheet post: everything comes from the post itself.
  let target: Post | null = null;
  if (body?.post_id) {
    const { data } = await supabase.from("posts").select("*").eq("id", body.post_id).maybeSingle<Post>();
    if (!data || data.post_type !== "feature_sheet") return NextResponse.json({ error: "Post not found." }, { status: 404 });
    if (data.status === "published" || data.status === "publishing") return NextResponse.json({ error: "This post is already published." }, { status: 409 });
    target = data;
    const cover = data.slides[0];
    Object.assign(body, {
      listing_id: data.listing_id,
      platform: data.platform,
      format: data.format,
      post_type: "feature_sheet",
      language: data.language,
      aspect: data.design.aspect,
      sheet: data.design.sheet,
      sheet_headline: cover?.headline ?? "",
      sheet_photo_index: cover?.photo_index ?? null,
    });
  }

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

  // Mortgage feature sheets: brokers only; start from the sheet sent, or the broker's saved defaults.
  let sheet: SheetConfig | null = null;
  if (body.post_type === "feature_sheet") {
    if (profile.role !== "mortgage_broker") return NextResponse.json({ error: "Feature sheets are for mortgage broker accounts." }, { status: 403 });
    if (!listing.price) return NextResponse.json({ error: "Add the listing price first. The sheet's payments are based on it." }, { status: 400 });
    if (body.sheet) sheet = readSheetConfig(body.sheet);
    else {
      const { data: realtor } = body.realtor_id
        ? await supabase.from("partner_realtors").select("*").eq("id", body.realtor_id).maybeSingle<PartnerRealtor>()
        : { data: null };
      sheet = sheetConfigFrom(readMortgageSettings(profile.mortgage_settings), realtor);
    }
  }

  // A regeneration rewrites an existing post of this listing; anything else is a new post.
  let kind: AllowanceKind = target?.caption.trim() ? "regen" : "post";
  if (body.regenerate_of) {
    const { data: original } = await supabase.from("posts").select("id").eq("id", body.regenerate_of).eq("listing_id", listing.id).maybeSingle();
    if (!original) return NextResponse.json({ error: "Post to regenerate not found." }, { status: 404 });
    kind = "regen";
  }

  // Paywall pre-check only: the allowance is used when the post is actually written (see generation-job).
  const { data: entitlement } = await supabase.from("entitlements").select("*").eq("user_id", user.id).maybeSingle<EntitlementRow>();
  const isGuest = !!user.is_anonymous;
  const usage = usageFrom(entitlement, isGuest);
  if (remaining(usage, kind) <= 0) {
    const pool = kind === "regen" && usage.regens ? usage.regens : usage.posts;
    const { error, paywall } = paywallFor({ isGuest, plan: usage.plan, lim: pool.limit, resetsAt: usage.resetsAt }, kind);
    return NextResponse.json({ error, paywall, plan: usage.plan, resets_at: usage.resetsAt }, { status: 402 });
  }

  // One post at a time per user, so double clicks don't run (and bill) twice.
  const admin = createAdminClient();
  const since = new Date(Date.now() - 5 * 60_000).toISOString();
  const { data: busy } = await admin
    .from("generation_jobs")
    .select("id")
    .eq("user_id", user.id)
    .in("status", ["queued", "running"])
    .gte("created_at", since)
    .limit(1);
  if (busy?.length) return NextResponse.json({ error: "A post is already being written. Wait for it to finish, then try again." }, { status: 409 });

  const focus = (Array.isArray(body.focus) ? body.focus : [])
    .filter((f): f is string => typeof f === "string")
    .map((f) => f.trim().slice(0, 120))
    .filter(Boolean)
    .slice(0, MAX_FOCUS);
  const notes = String(body.notes ?? body.highlights ?? "").trim().slice(0, 1000);

  // Single images have one slide, so "cover only" is the same as text on the photo.
  const requested = body.text_mode && ["all", "cover", "none"].includes(body.text_mode) ? body.text_mode : PLATFORM_SPECS[body.platform].defaultTextMode;
  const textMode: TextMode = body.format === "single" && requested === "cover" ? "all" : requested;

  const params: JobParams = {
    platform: body.platform,
    format: body.format,
    post_type: body.post_type,
    language: body.language,
    focus,
    notes,
    text_mode: textMode,
    include_contact_slide: body.include_contact_slide ?? profile.include_contact,
    include_tour: body.include_tour !== false,
    mortgage: profile.role === "mortgage_broker" && body.mortgage?.enabled ? body.mortgage : null,
    template: body.template ?? "classic",
    aspect: body.aspect ?? null,
    sheet,
    sheet_id: null as string | null,
    sheet_headline: typeof body.sheet_headline === "string" ? body.sheet_headline.slice(0, 80) : "",
    sheet_photo_index: Number.isInteger(body.sheet_photo_index) ? body.sheet_photo_index! : null,
  };
  if (target) {
    params.target_post_id = target.id;
    params.sheet_id = target.sheet_id ?? null;
  }
  if (sheet && body.sheet_id && !target) {
    const { data: own } = await supabase.from("feature_sheets").select("id").eq("id", body.sheet_id).maybeSingle();
    if (own) params.sheet_id = own.id;
  }

  const { data: job, error } = await admin
    .from("generation_jobs")
    .insert({ user_id: user.id, listing_id: listing.id, kind, is_guest: isGuest, params })
    .select("id")
    .single();
  if (error || !job) return NextResponse.json({ error: "Couldn't start writing the post. Please try again." }, { status: 500 });

  try {
    await queueGeneration(admin, job.id);
  } catch {
    return NextResponse.json({ error: "Couldn't start writing the post. Please try again." }, { status: 502 });
  }
  return NextResponse.json({ job_id: job.id, kind }, { status: 202 });
}
