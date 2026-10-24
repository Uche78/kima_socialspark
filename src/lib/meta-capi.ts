// Meta Conversions API: server-side events that pair with the browser pixel's (same event_id → counted once).
// Server only. Docs: https://developers.facebook.com/docs/marketing-api/conversions-api

import { createHash } from "node:crypto";

const sha256 = (v: string) => createHash("sha256").update(v).digest("hex");

export type MetaUserData = {
  email?: string | null;
  externalId?: string | null;
  ip?: string | null;
  userAgent?: string | null;
  fbc?: string | null;
  fbp?: string | null;
};

/** Meta's user_data: identifiers normalised and SHA-256 hashed; click/browser IDs, IP and user agent sent as-is. */
export function buildUserData(u: MetaUserData) {
  const data: Record<string, string | string[]> = {};
  if (u.email) data.em = [sha256(u.email.trim().toLowerCase())];
  if (u.externalId) data.external_id = [sha256(u.externalId)];
  if (u.ip) data.client_ip_address = u.ip;
  if (u.userAgent) data.client_user_agent = u.userAgent;
  if (u.fbc) data.fbc = u.fbc;
  if (u.fbp) data.fbp = u.fbp;
  return data;
}

export type MetaEvent = {
  eventName: string;
  eventId: string;
  eventSourceUrl: string;
  user: MetaUserData;
  customData?: Record<string, unknown>;
  /** Seconds since epoch; defaults to now. */
  eventTime?: number;
};

/** Sends one website event. Returns false (and logs) instead of throwing: tracking must never break sign-up. */
export async function sendMetaEvent(e: MetaEvent): Promise<boolean> {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const token = process.env.META_CAPI_ACCESS_TOKEN;
  if (!pixelId || !token) return false;

  const body: Record<string, unknown> = {
    data: [
      {
        event_name: e.eventName,
        event_time: e.eventTime ?? Math.floor(Date.now() / 1000),
        event_id: e.eventId,
        event_source_url: e.eventSourceUrl,
        action_source: "website",
        user_data: buildUserData(e.user),
        ...(e.customData ? { custom_data: e.customData } : {}),
      },
    ],
  };
  // Set while testing so events show under Events Manager → Test events.
  if (process.env.META_TEST_EVENT_CODE) body.test_event_code = process.env.META_TEST_EVENT_CODE;

  const version = process.env.META_GRAPH_VERSION || "v23.0";
  try {
    const res = await fetch(`https://graph.facebook.com/${version}/${pixelId}/events?access_token=${encodeURIComponent(token)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) console.error("meta capi", res.status, (await res.text()).slice(0, 500));
    return res.ok;
  } catch (err) {
    console.error("meta capi", err instanceof Error ? err.message : err);
    return false;
  }
}
