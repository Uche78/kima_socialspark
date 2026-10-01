import { NextResponse, type NextRequest } from "next/server";
import { getUser } from "@/lib/supabase/server";

export async function POST(req: NextRequest, ctx: RouteContext<"/api/posts/[id]/schedule">) {
  const { id } = await ctx.params;
  const { supabase, user } = await getUser();
  if (!user || user.is_anonymous) return NextResponse.json({ error: "Create an account to schedule posts." }, { status: 401 });

  const { scheduled_at, social_account_id } = (await req.json().catch(() => ({}))) as {
    scheduled_at?: string;
    social_account_id?: string;
  };
  const when = scheduled_at ? new Date(scheduled_at) : null;
  if (!when || Number.isNaN(when.getTime()) || when.getTime() < Date.now() + 60_000) {
    return NextResponse.json({ error: "Pick a time at least a minute in the future." }, { status: 400 });
  }
  if (!social_account_id) return NextResponse.json({ error: "Choose an account to post to." }, { status: 400 });

  const [{ data: post }, { data: account }] = await Promise.all([
    supabase.from("posts").select("platform, image_paths, status").eq("id", id).single(),
    supabase.from("social_accounts").select("platform").eq("id", social_account_id).single(),
  ]);
  if (!post || !account) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (account.platform !== post.platform) return NextResponse.json({ error: "That account is for a different platform." }, { status: 400 });
  if (!post.image_paths?.length) return NextResponse.json({ error: "Save the design before scheduling." }, { status: 400 });
  if (post.status === "published" || post.status === "publishing") return NextResponse.json({ error: "Already published." }, { status: 409 });

  const { error } = await supabase
    .from("posts")
    .update({ status: "scheduled", scheduled_at: when.toISOString(), social_account_id, error: null })
    .eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, ctx: RouteContext<"/api/posts/[id]/schedule">) {
  const { id } = await ctx.params;
  const { supabase, user } = await getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  await supabase.from("posts").update({ status: "draft", scheduled_at: null }).eq("id", id).eq("status", "scheduled");
  return NextResponse.json({ ok: true });
}
