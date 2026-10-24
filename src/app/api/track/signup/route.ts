import { NextResponse, type NextRequest } from "next/server";
import { getUser } from "@/lib/supabase/server";
import { ATTRIBUTION_COOKIE, CONSENT_COOKIE, fbcFromFbclid, parseAttribution } from "@/lib/consent";
import { sendMetaEvent } from "@/lib/meta-capi";
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

  if (req.cookies.get(CONSENT_COOKIE)?.value !== "granted") {
    await supabase.auth.updateUser({ data: { signup_tracked_at: new Date().toISOString() } });
    return NextResponse.json({ ok: true, skipped: "no consent" });
  }

  const attribution = parseAttribution(req.cookies.get(ATTRIBUTION_COOKIE)?.value);
  const fbc = req.cookies.get("_fbc")?.value ?? (attribution?.fbclid ? fbcFromFbclid(attribution.fbclid, attribution.ts) : null);

  const sent = await sendMetaEvent({
    eventName: "CompleteRegistration",
    eventId: `reg_${user.id}`,
    eventSourceUrl: req.headers.get("referer") ?? `${SITE_URL}/welcome`,
    user: {
      email: user.email,
      externalId: user.id,
      ip: req.headers.get("x-nf-client-connection-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
      userAgent: req.headers.get("user-agent"),
      fbc,
      fbp: req.cookies.get("_fbp")?.value ?? null,
    },
    customData: {
      content_name: profile.role,
      ...(attribution ? { landing_page: attribution.path, utm_campaign: attribution.utm_campaign, utm_content: attribution.utm_content } : {}),
    },
  });

  await supabase.auth.updateUser({
    data: { signup_tracked_at: new Date().toISOString(), ...(attribution ? { signup_attribution: attribution } : {}) },
  });
  return NextResponse.json({ ok: true, sent });
}
