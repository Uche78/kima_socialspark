import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient, getUser } from "@/lib/supabase/server";
import { publishPost } from "@/lib/publish";
import type { Post } from "@/lib/types";

export const maxDuration = 60;

export async function POST(req: NextRequest, ctx: RouteContext<"/api/posts/[id]/publish">) {
  const { id } = await ctx.params;
  const { supabase, user } = await getUser();
  if (!user || user.is_anonymous) return NextResponse.json({ error: "Create an account to publish." }, { status: 401 });

  const { social_account_id } = (await req.json().catch(() => ({}))) as { social_account_id?: string };

  // Ownership check through RLS, then claim the post so it can't double-publish.
  const { data: claimed } = await supabase
    .from("posts")
    .update({ status: "publishing", social_account_id: social_account_id ?? undefined, error: null })
    .eq("id", id)
    .in("status", ["draft", "failed", "scheduled"])
    .select("*")
    .maybeSingle<Post>();
  if (!claimed) return NextResponse.json({ error: "Post not found or already publishing." }, { status: 409 });

  const result = await publishPost(createAdminClient(), claimed);
  return NextResponse.json(result, { status: result.ok ? 200 : 502 });
}
