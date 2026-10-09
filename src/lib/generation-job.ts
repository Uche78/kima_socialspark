import { createClient } from "@supabase/supabase-js";
import { ClaudeRefusalError } from "./claude";
import { generatePost } from "./generate";
import { paywallFor } from "./paywall";
import type { AllowanceKind } from "./plans";
import { cleanTourUrl } from "./virtual-tour";
import { PLATFORM_SPECS, type Aspect, type Design, type Language, type Listing, type MortgageInputs, type Platform, type PostFormat, type PostType, type Profile, type TextMode } from "./types";

/** Validated generation settings, stored on the job. */
export type JobParams = {
  platform: Platform;
  format: PostFormat;
  post_type: PostType;
  language: Language;
  focus: string[];
  notes: string;
  text_mode: TextMode;
  include_contact_slide: boolean;
  include_tour: boolean;
  mortgage: MortgageInputs | null;
  template: Design["template"];
  aspect: Aspect | null;
};

export type GenerationJob = {
  id: string;
  user_id: string;
  listing_id: string;
  kind: AllowanceKind;
  is_guest: boolean;
  params: JobParams;
  status: "queued" | "running" | "done" | "failed";
  post_id: string | null;
  error: string | null;
  paywall: "signup" | "upgrade" | "limit" | null;
};

function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error("Supabase environment variables are missing.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

/**
 * Writes the post, then uses one allowance, then saves it. The allowance is used only when the
 * post was actually written, so failures and timeouts never cost the user anything.
 */
export async function runGenerationJob(jobId: string) {
  const admin = adminClient();
  const now = () => new Date().toISOString();

  // Claim the job so a retried trigger can't run it twice.
  const { data: job } = await admin
    .from("generation_jobs")
    .update({ status: "running", updated_at: now() })
    .eq("id", jobId)
    .eq("status", "queued")
    .select("*")
    .maybeSingle<GenerationJob>();
  if (!job) return { ok: false as const, error: "Job not found or already started." };

  const fail = async (error: string, paywall: GenerationJob["paywall"] = null) => {
    await admin.from("generation_jobs").update({ status: "failed", error, paywall, updated_at: now() }).eq("id", job.id);
    return { ok: false as const, error };
  };

  const p = job.params;
  const [{ data: listing }, { data: profile }] = await Promise.all([
    admin.from("listings").select("*").eq("id", job.listing_id).eq("user_id", job.user_id).maybeSingle<Listing>(),
    admin.from("profiles").select("*").eq("id", job.user_id).maybeSingle<Profile>(),
  ]);
  if (!listing || !profile) return fail("Listing not found.");

  let generated;
  try {
    generated = await generatePost({
      listing,
      profile,
      platform: p.platform,
      format: p.format,
      postType: p.post_type,
      language: p.language,
      focus: p.focus,
      notes: p.notes,
      textMode: p.text_mode,
      includeContactSlide: p.format === "carousel" && p.include_contact_slide,
      tourUrl: p.include_tour ? cleanTourUrl(listing.virtual_tour_url) : null,
      mortgage: p.mortgage,
    });
  } catch (e) {
    console.error("generation failed", job.id, e);
    return fail(e instanceof ClaudeRefusalError || e instanceof Error ? e.message : "Generation failed. Please try again.");
  }

  // Use the allowance now that there's a post to show for it (atomic; rechecks the limit).
  const { data: quota, error: quotaError } = await admin
    .rpc("consume_generation_for", { p_user: job.user_id, p_guest: job.is_guest, p_kind: job.kind })
    .single<{ allowed: boolean; used: number; lim: number; is_guest: boolean; plan: string; resets_at: string | null }>();
  if (quotaError || !quota) return fail("Couldn't check your plan. Please try again.");
  if (!quota.allowed) {
    const { error, paywall } = paywallFor({ isGuest: quota.is_guest, plan: quota.plan, lim: quota.lim, resetsAt: quota.resets_at }, job.kind);
    return fail(error, paywall);
  }

  const design: Design = {
    template: p.template ?? "classic",
    aspect: p.aspect && PLATFORM_SPECS[p.platform].aspects.includes(p.aspect) ? p.aspect : PLATFORM_SPECS[p.platform].defaultAspect,
    text_mode: p.text_mode,
    primary: profile.brand_primary,
    secondary: profile.brand_secondary,
    accent: profile.brand_accent,
    show_logo: profile.include_logo && !!profile.logo_path,
    show_headshot: profile.include_headshot && !!profile.headshot_path,
    show_contact: profile.include_contact,
    show_brokerage: true,
    show_price: listing.price != null,
  };

  const { data: post, error } = await admin
    .from("posts")
    .insert({
      user_id: job.user_id,
      listing_id: listing.id,
      platform: p.platform,
      format: p.format,
      post_type: p.post_type,
      language: p.language,
      highlights: p.notes || null,
      focus: p.focus,
      focused_on: generated.focusedOn,
      caption: generated.caption,
      hashtags: generated.hashtags,
      slides: generated.slides,
      design,
      mortgage: p.mortgage,
    })
    .select("id")
    .single();
  if (error || !post) {
    await admin.rpc("refund_generation", { p_user: job.user_id, p_kind: job.kind });
    return fail("Couldn't save the post. Please try again.");
  }

  await admin.from("generation_jobs").update({ status: "done", post_id: post.id, updated_at: now() }).eq("id", job.id);
  return { ok: true as const, postId: post.id };
}
