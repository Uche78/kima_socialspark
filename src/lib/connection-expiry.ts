// Connection expiry. LinkedIn tokens last ~60 days with no self-serve refresh, so agents reconnect.

import type { Platform } from "./types";

/** Settings starts warning this many days before a connection expires. */
export const EXPIRY_WARN_DAYS = 10;

export const PLATFORM_LABEL: Record<Platform, string> = { facebook: "Facebook", instagram: "Instagram", linkedin: "LinkedIn" };

/** Where the "Reconnect" button for an account goes. */
export const connectUrl = (platform: Platform) => (platform === "linkedin" ? "/api/connect/linkedin/start" : "/api/connect/meta/start");

/** Whole days until `iso` (negative once passed), or null when the connection doesn't expire. */
export function daysUntil(iso: string | null | undefined, now = Date.now()) {
  if (!iso) return null;
  return Math.floor((new Date(iso).getTime() - now) / 86_400_000);
}

export function formatDay(iso: string) {
  return new Date(iso).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric", timeZone: "America/Toronto" });
}

/** Shown on a post when publishing fails because the account must be reconnected. */
export function reconnectMessage(platform: Platform, expiredAt?: string | null) {
  const label = PLATFORM_LABEL[platform];
  const what = expiredAt ? `expired on ${formatDay(expiredAt)}` : "has expired or was removed";
  return `Your ${label} connection ${what}. Reconnect ${label} in ${RECONNECT_HINT}, then publish again.`;
}

/** Marker the post editor looks for to offer a link to Settings. */
export const RECONNECT_HINT = "Settings → Connected accounts";
