import type { SupabaseClient } from "@supabase/supabase-js";
import { fullCaption } from "../caption";
import { publicMediaUrl } from "../photos";
import type { Post } from "../types";
import { publishFacebook, publishInstagram } from "./meta";
import { publishLinkedIn } from "./linkedin";


class PublishCancelled extends Error {}

/**
 * Publishes a post using the service-role client (reads server-only tokens)
 * and records the outcome on the post row.
 */
export async function publishPost(admin: SupabaseClient, post: Post) {
  try {
    if (!post.social_account_id) throw new Error("No social account selected.");
    if (!post.image_paths.length) throw new Error("Post images haven't been rendered yet.");

    const { data: account } = await admin
      .from("social_accounts")
      .select("id, user_id, platform, external_id, account_name")
      .eq("id", post.social_account_id)
      .single();
    if (!account || account.user_id !== post.user_id) throw new Error("Social account not found.");
    if (account.platform !== post.platform) throw new Error("Selected account doesn't match the post's platform.");

    const { data: token } = await admin
      .from("social_tokens")
      .select("access_token, expires_at")
      .eq("social_account_id", account.id)
      .single();
    if (!token) throw new Error("Account needs to be reconnected.");
    if (token.expires_at && new Date(token.expires_at) < new Date()) throw new Error("Account connection expired. Please reconnect.");

    const imageUrls = post.image_paths.map((p) => publicMediaUrl(admin, p));
    const text = fullCaption(post);

    // If the user cancelled while photos were uploading, stop before anything becomes visible.
    const beforeGoLive = async () => {
      const { data } = await admin.from("posts").select("status").eq("id", post.id).single();
      if (data?.status !== "publishing") throw new PublishCancelled();
    };

    let result: { id: string; url: string | null };
    if (post.platform === "facebook") result = await publishFacebook(account.external_id, token.access_token, imageUrls, text, beforeGoLive);
    else if (post.platform === "instagram") result = await publishInstagram(account.external_id, token.access_token, imageUrls, text, beforeGoLive);
    else result = await publishLinkedIn(account.external_id, token.access_token, imageUrls, text, post.slides[0]?.headline ?? "Property photo", beforeGoLive);

    await admin
      .from("posts")
      .update({
        status: "published",
        published_at: new Date().toISOString(),
        external_post_id: result.id,
        external_url: result.url,
        error: null,
      })
      .eq("id", post.id);
    return { ok: true as const, ...result };
  } catch (e) {
    if (e instanceof PublishCancelled) return { ok: false as const, error: "Publishing was cancelled." };
    const message = e instanceof Error ? e.message : "Publishing failed.";
    await admin.from("posts").update({ status: "failed", error: message }).eq("id", post.id);
    return { ok: false as const, error: message };
  }
}
