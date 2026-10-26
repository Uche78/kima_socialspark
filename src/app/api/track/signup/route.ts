import { NextResponse, type NextRequest } from "next/server";
import { getUser } from "@/lib/supabase/server";
import { sendMetaEvent } from "@/lib/meta-capi";
import { metaRequestContext } from "@/lib/meta-request";
import { SITE_URL } from "@/lib/site";

/**
 * Called once by /welcome when a new account finishes sign-up. With ad-tracking consent, it keeps the
 * ad that brought them (on the user's metadata, for our own reporting) and sends Meta a server-side
 * CompleteRegistration that the browser pixel's event (same event ID) is deduplicated against.
 */
export async function POST(req: NextRequest) {
  const { supabase, user } = await getUser();
  if (!user || user.is_anonymous) return NextResponse.json({ error: "Sign in first." }, { status: 401 });

  // Once per account, and only for accounts that actually finished the welcome step.
  if (user.user_metadata?.signup_tracked_at) return NextResponse.json({ ok: true, skipped: "already" });
  const { data: profile } = await supabase.from("profiles").select("role, role_chosen").eq("id", user.id).maybeSingle<{ role: string; role_chosen: boolean }>();
  if (!profile?.role_chosen) return NextResponse.json({ error: "Finish setting up first." }, { status: 409 });

  const ctx = metaRequestContext(req);
  if (!ctx.consented) {
    await supabase.auth.updateUser({ data: { signup_tracked_at: new Date().toISOString() } });
    return NextResponse.json({ ok: true, skipped: "no consent" });
  }

  const sent = await sendMetaEvent({
    eventName: "CompleteRegistration",
    eventId: `reg_${user.id}`,
    eventSourceUrl: req.headers.get("referer") ?? `${SITE_URL}/welcome`,
    user: { email: user.email, externalId: user.id, ip: ctx.ip, userAgent: ctx.userAgent, fbc: ctx.fbc, fbp: ctx.fbp },
    customData: { content_name: profile.role, ...ctx.adData },
  });

  await supabase.auth.updateUser({
    data: { signup_tracked_at: new Date().toISOString(), ...(ctx.attribution ? { signup_attribution: ctx.attribution } : {}) },
  });
  return NextResponse.json({ ok: true, sent });
}
