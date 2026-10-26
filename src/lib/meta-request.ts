// What a server-side Meta event needs from the visitor's request: consent, network and browser details,
// Meta's click/browser IDs and the ad that brought them. Server only.

import type { NextRequest } from "next/server";
import { ATTRIBUTION_COOKIE, CONSENT_COOKIE, fbcFromFbclid, parseAttribution } from "./consent";

export function metaRequestContext(req: NextRequest) {
  const attribution = parseAttribution(req.cookies.get(ATTRIBUTION_COOKIE)?.value);
  return {
    consented: req.cookies.get(CONSENT_COOKIE)?.value === "granted",
    attribution,
    ip: req.headers.get("x-nf-client-connection-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    userAgent: req.headers.get("user-agent"),
    fbc: req.cookies.get("_fbc")?.value ?? (attribution?.fbclid ? fbcFromFbclid(attribution.fbclid, attribution.ts) : null),
    fbp: req.cookies.get("_fbp")?.value ?? null,
    /** The ad's labels, for custom_data. */
    adData: attribution ? { landing_page: attribution.path, utm_campaign: attribution.utm_campaign, utm_content: attribution.utm_content } : {},
  };
}
