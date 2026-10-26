import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient, getUser } from "@/lib/supabase/server";
import { sendMetaEvent } from "@/lib/meta-capi";
import { metaRequestContext } from "@/lib/meta-request";
import { SITE_URL } from "@/lib/site";

/**
 * Called by the app each time a new post finishes writing. If it was the visitor's first ever post
 * (guest or signed in), and they allowed ad tracking, Meta gets a server-side FirstPostGenerated; the
 * response tells the browser to send the same event with the same ID, so Meta counts it once.
 * It happens far more often than sign-ups, so campaigns can optimise for it when sign-ups are sparse.
 */
export async function POST(req: NextRequest) {
  const { supabase, user } = await getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  // Once per person: a guest who later creates an account keeps the same user and this flag.
  if (user.user_metadata?.first_post_tracked_at) return NextResponse.json({ first: false });

  // First = exactly one finished new-post job. Regenerations don't count, and deleting a post doesn't reset it.
  const admin = createAdminClient();
  const { data: jobs, count } = await admin
    .from("generation_jobs")
    .select("params", { count: "exact" })
    .eq("user_id", user.id)
    .eq("status", "done")
    .eq("kind", "post")
    .limit(1);
  if ((count ?? 0) === 0) return NextResponse.json({ first: false });
  await supabase.auth.updateUser({ data: { first_post_tracked_at: new Date().toISOString() } });
  // Accounts that already had posts before this event existed: mark them and stop checking.
  if ((count ?? 0) > 1) return NextResponse.json({ first: false });

  const ctx = metaRequestContext(req);
  if (!ctx.consented) return NextResponse.json({ first: false });

  const params = (jobs?.[0]?.params ?? {}) as { post_type?: string; platform?: string };
  const eventId = `fpg_${user.id}`;
  const customData = { content_name: params.post_type ?? null, content_category: params.platform ?? null, is_guest: !!user.is_anonymous, ...ctx.adData };
  await sendMetaEvent({
    eventName: "FirstPostGenerated",
    eventId,
    eventSourceUrl: req.headers.get("referer") ?? `${SITE_URL}/listings`,
    // Guests have no email yet; the hashed user ID still links this to their later sign-up.
    user: { email: user.is_anonymous ? null : user.email, externalId: user.id, ip: ctx.ip, userAgent: ctx.userAgent, fbc: ctx.fbc, fbp: ctx.fbp },
    customData,
  });
  return NextResponse.json({ first: true, event_id: eventId, data: customData });
}
