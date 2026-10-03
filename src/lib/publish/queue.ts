import type { SupabaseClient } from "@supabase/supabase-js";
import { siteUrl } from "../oauth";
import { publishPostById } from "./run";

/**
 * Hands claimed posts (status "publishing") to the Netlify background function, which can run
 * for up to 15 minutes; a normal request is cut off after a few seconds, too short for large
 * albums. On a local machine (no Netlify) they're published inline instead.
 */
export async function queuePublish(admin: SupabaseClient, postIds: string[]): Promise<{ queued: boolean }> {
  if (!postIds.length) return { queued: false };
  const base = siteUrl();
  if (base.includes("localhost") || base.includes("127.0.0.1")) {
    for (const id of postIds) await publishPostById(id);
    return { queued: false };
  }

  try {
    const res = await fetch(`${base}/.netlify/functions/publish-post-background`, {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.CRON_SECRET}`, "Content-Type": "application/json" },
      body: JSON.stringify({ postIds }),
    });
    // Background functions answer 202 straight away and keep running.
    if (res.status !== 202 && !res.ok) throw new Error(`Background publisher returned HTTP ${res.status}`);
    return { queued: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Couldn't start publishing.";
    await admin.from("posts").update({ status: "failed", error: `Couldn't start publishing: ${message}` }).in("id", postIds);
    throw e;
  }
}
