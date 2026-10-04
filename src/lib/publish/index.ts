import type { SupabaseClient } from "@supabase/supabase-js";
import { fullCaption } from "../caption";
import { publicMediaUrl } from "../photos";
import type { Post } from "../types";
import { reconnectMessage } from "../connection-expiry";
import { deleteFacebookPost, MetaError, publishFacebook, publishInstagram } from "./meta";
import { deleteLinkedInPost, LinkedInAuthError, publishLinkedIn } from "./linkedin";


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
    if (!token) throw new Error(reconnectMessage(post.platform));
    if (token.expires_at && new Date(token.expires_at) < new Date()) throw new Error(reconnectMessage(post.platform, token.expires_at));

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
    // Meta code 190 = token expired or revoked; LinkedIn answers 401.
    const needsReconnect = (e instanceof MetaError && e.code === 190) || e instanceof LinkedInAuthError;
    const message = needsReconnect ? reconnectMessage(post.platform) : e instanceof Error ? e.message : "Publishing failed.";
    await admin.from("posts").update({ status: "failed", error: message }).eq("id", post.id);
    return { ok: false as const, error: message };
  }
}

/**
 * Removes a published post from Facebook or LinkedIn and returns it to draft in SocialSpark.
 * Instagram's API doesn't allow deleting posts, so those must be removed in the Instagram app.
 */
export async function unpublishPost(admin: SupabaseClient, post: Post) {
  if (post.platform === "instagram") throw new Error("Instagram doesn't let apps delete posts. Delete it in the Instagram app.");
  if (!post.external_post_id || !post.social_account_id) throw new Error("This post has no record of where it was published.");

  const { data: account } = await admin.from("social_accounts").select("id, user_id, platform").eq("id", post.social_account_id).single();
  if (!account || account.user_id !== post.user_id) throw new Error("The account this was published to is no longer connected. Delete it on the platform.");
  const { data: token } = await admin.from("social_tokens").select("access_token").eq("social_account_id", account.id).single();
  if (!token) throw new Error("Reconnect the account, then try again.");

  if (post.platform === "facebook") await deleteFacebookPost(post.external_post_id, token.access_token);
  else await deleteLinkedInPost(post.external_post_id, token.access_token);

  await admin
    .from("posts")
    .update({ status: "draft", published_at: null, external_post_id: null, external_url: null, error: null })
    .eq("id", post.id);
}
