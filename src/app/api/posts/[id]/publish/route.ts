import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient, getUser } from "@/lib/supabase/server";
import { queuePublish } from "@/lib/publish/queue";
import type { Post } from "@/lib/types";

export const maxDuration = 60;

export async function POST(req: NextRequest, ctx: RouteContext<"/api/posts/[id]/publish">) {
  const { id } = await ctx.params;
  const { supabase, user } = await getUser();
  if (!user || user.is_anonymous) return NextResponse.json({ error: "Create an account to publish." }, { status: 401 });

  const { social_account_id, override_schedule } = (await req.json().catch(() => ({}))) as {
    social_account_id?: string;
    /** Required to publish a scheduled post now (the user confirmed replacing the schedule). */
    override_schedule?: boolean;
  };

  const { data: current } = await supabase.from("posts").select("status, scheduled_at").eq("id", id).maybeSingle();
  if (current?.status === "scheduled" && !override_schedule) {
    return NextResponse.json(
      { error: "This post is scheduled. Cancel the schedule, or confirm publishing it now instead.", scheduled_at: current.scheduled_at },
      { status: 409 },
    );
  }

  // Ownership check through RLS, then claim the post so it can't double-publish. A post stuck on
  // "publishing" for over 5 minutes (e.g. the publisher was cut off) can be claimed again.
  const stuckBefore = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  const { data: claimed } = await supabase
    .from("posts")
    .update({ status: "publishing", social_account_id: social_account_id ?? undefined, scheduled_at: null, error: null })
    .eq("id", id)
    .or(`status.in.(draft,failed,scheduled),and(status.eq.publishing,updated_at.lt.${stuckBefore})`)
    .select("*")
    .maybeSingle<Post>();
  if (!claimed) return NextResponse.json({ error: "Post not found or already publishing." }, { status: 409 });

  // Publishing runs in a background function (large albums take longer than a request may run).
  // The editor polls the post's status until it's published or failed.
  try {
    const { queued } = await queuePublish(createAdminClient(), [claimed.id]);
    return NextResponse.json({ ok: true, queued }, { status: 202 });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "Couldn't start publishing." }, { status: 502 });
  }
}
