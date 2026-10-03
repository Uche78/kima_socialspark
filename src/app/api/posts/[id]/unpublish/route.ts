import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient, getUser } from "@/lib/supabase/server";
import { unpublishPost } from "@/lib/publish";
import type { Post } from "@/lib/types";

/** Deletes a published post from Facebook or LinkedIn and returns it to draft. */
export async function POST(_req: NextRequest, ctx: RouteContext<"/api/posts/[id]/unpublish">) {
  const { id } = await ctx.params;
  const { supabase, user } = await getUser();
  if (!user || user.is_anonymous) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  // Ownership is checked through RLS before the service client touches tokens.
  const { data: post } = await supabase.from("posts").select("*").eq("id", id).eq("status", "published").maybeSingle<Post>();
  if (!post) return NextResponse.json({ error: "Post not found or not published." }, { status: 404 });

  try {
    await unpublishPost(createAdminClient(), post);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Couldn't remove the post." }, { status: 502 });
  }
}
