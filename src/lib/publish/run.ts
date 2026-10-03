import { createClient } from "@supabase/supabase-js";
import type { Post } from "../types";
import { publishPost } from "./index";

/**
 * Publishes an already-claimed post (status "publishing") by id. Used by the Netlify
 * background function, which has no request context, so it builds its own service client.
 */
export async function publishPostById(postId: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error("Supabase environment variables are missing.");
  const admin = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

  const { data: post } = await admin.from("posts").select("*").eq("id", postId).maybeSingle<Post>();
  if (!post) return { ok: false as const, error: "Post not found." };
  if (post.status !== "publishing") return { ok: false as const, error: `Post is ${post.status}, not publishing.` };
  return publishPost(admin, post);
}
