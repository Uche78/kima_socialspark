import type { SupabaseClient } from "@supabase/supabase-js";
import { runGenerationJob } from "./generation-job";
import { siteUrl } from "./oauth";

/**
 * Hands a job to the Netlify background function (up to 15 minutes; normal requests are cut off
 * at 30 s, shorter than some generations). On a local machine it runs in this process instead.
 */
export async function queueGeneration(admin: SupabaseClient, jobId: string) {
  const base = siteUrl();
  if (base.includes("localhost") || base.includes("127.0.0.1")) {
    void runGenerationJob(jobId).catch((e) => console.error("generation job", jobId, e));
    return;
  }
  try {
    const res = await fetch(`${base}/.netlify/functions/generate-post-background`, {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.CRON_SECRET}`, "Content-Type": "application/json" },
      body: JSON.stringify({ jobId }),
    });
    if (res.status !== 202 && !res.ok) throw new Error(`HTTP ${res.status}`);
  } catch (e) {
    const message = e instanceof Error ? e.message : "unknown error";
    await admin.from("generation_jobs").update({ status: "failed", error: `Couldn't start writing the post (${message}). Please try again.`, updated_at: new Date().toISOString() }).eq("id", jobId);
    throw e;
  }
}
