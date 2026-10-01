import { NextResponse, type NextRequest } from "next/server";
import { getUser } from "@/lib/supabase/server";

const STUCK_AFTER_MS = 5 * 60 * 1000;

/**
 * Reopens a published (or stuck) post as an editable draft so it can be changed
 * and published again. The copy already on the platform is not touched.
 */
export async function POST(_req: NextRequest, ctx: RouteContext<"/api/posts/[id]/reopen">) {
  const { id } = await ctx.params;
  const { supabase, user } = await getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { data: post } = await supabase.from("posts").select("status, updated_at").eq("id", id).maybeSingle();
  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

  const stuck = post.status === "publishing" && Date.now() - new Date(post.updated_at).getTime() > STUCK_AFTER_MS;
  if (post.status !== "published" && post.status !== "failed" && !stuck) {
    return NextResponse.json({ error: "This post is already editable." }, { status: 409 });
  }

  const { error } = await supabase
    .from("posts")
    .update({ status: "draft", published_at: null, external_post_id: null, external_url: null, scheduled_at: null, error: null })
    .eq("id", id)
    .eq("status", post.status); // don't clobber a concurrent change
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
