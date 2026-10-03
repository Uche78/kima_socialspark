import { NextResponse, type NextRequest } from "next/server";
import { getUser } from "@/lib/supabase/server";

/**
 * Cancels publishing: puts a "publishing" post back to draft. The publisher checks the status
 * right before the post goes live, so this stops it unless it has already reached that step.
 */
export async function POST(_req: NextRequest, ctx: RouteContext<"/api/posts/[id]/cancel">) {
  const { id } = await ctx.params;
  const { supabase, user } = await getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { data } = await supabase
    .from("posts")
    .update({ status: "draft", error: null })
    .eq("id", id)
    .eq("status", "publishing")
    .select("id")
    .maybeSingle();
  if (!data) return NextResponse.json({ error: "This post isn't publishing any more. Refresh to see its status." }, { status: 409 });
  return NextResponse.json({ ok: true });
}
