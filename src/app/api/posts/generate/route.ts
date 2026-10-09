import { NextResponse } from "next/server";
import { createAdminClient, getUser } from "@/lib/supabase/server";
import { MAX_FOCUS } from "@/lib/generate";
import type { JobParams } from "@/lib/generation-job";
import { queueGeneration } from "@/lib/generation-queue";
import { paywallFor } from "@/lib/paywall";
import { remaining, usageFrom, type AllowanceKind, type EntitlementRow } from "@/lib/plans";
import type { Design, Language, Listing, MortgageInputs, Platform, PostFormat, PostType, Profile, Aspect, TextMode } from "@/lib/types";
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
  };

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
