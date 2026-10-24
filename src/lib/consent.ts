// Ad-tracking consent (Québec Law 25: tracking that profiles people is off until they opt in).
// The choice lives in a first-party cookie so the server can honour it too. Client and server safe.

export const CONSENT_COOKIE = "ss_consent";
/** First-touch ad attribution (landing page, UTMs, fbclid), written only after consent. */
export const ATTRIBUTION_COOKIE = "ss_attr";
/** Landing details held in this tab until the visitor chooses; never sent anywhere. */
export const LANDING_STORAGE_KEY = "ss_landing";
/** Fired on window when the choice changes, or to reopen the banner ("Cookie settings"). */
export const CONSENT_EVENT = "ss:consent";
export const OPEN_CONSENT_EVENT = "ss:open-consent";

export type Consent = "granted" | "denied";

const YEAR = 60 * 60 * 24 * 365;

export type Attribution = {
  /** Landing path, e.g. /for/social-media-posts-for-condo-realtors */
  path: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fbclid?: string;
  /** When they landed (ms since epoch). */
  ts: number;
};

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid"] as const;

/** The landing details worth keeping from a URL, or null when it carries no ad parameters. */
export function attributionFromUrl(url: URL, now = Date.now()): Attribution | null {
  const a: Attribution = { path: url.pathname, ts: now };
  let any = false;
  for (const k of UTM_KEYS) {
    const v = url.searchParams.get(k);
    if (v) {
      a[k] = v.slice(0, 200);
      any = true;
    }
  }
  return any ? a : null;
}

export function parseAttribution(raw: string | undefined | null): Attribution | null {
  if (!raw) return null;
  try {
    const a = JSON.parse(decodeURIComponent(raw)) as Attribution;
    return a && typeof a.path === "string" && typeof a.ts === "number" ? a : null;
  } catch {
    return null;
  }
}

/** Meta's click ID cookie format, for when the pixel never got to set _fbc itself. */
export function fbcFromFbclid(fbclid: string, ts: number) {
  return `fb.1.${ts}.${fbclid}`;
}

// --- Browser helpers ---

function readCookie(name: string) {
  if (typeof document === "undefined") return undefined;
  return document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

function writeCookie(name: string, value: string, maxAge: number) {
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${value}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
}

export function readConsent(): Consent | null {
  const v = readCookie(CONSENT_COOKIE);
  return v === "granted" || v === "denied" ? v : null;
}

export function setConsent(value: Consent) {
  writeCookie(CONSENT_COOKIE, value, YEAR);
  if (value === "granted") persistAttribution();
  else writeCookie(ATTRIBUTION_COOKIE, "", 0);
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

/** Remember this tab's ad landing (first touch wins) until the visitor makes a choice. */
export function rememberLanding() {
  try {
    if (sessionStorage.getItem(LANDING_STORAGE_KEY)) return;
    const a = attributionFromUrl(new URL(location.href));
    if (a) sessionStorage.setItem(LANDING_STORAGE_KEY, JSON.stringify(a));
  } catch {
    // Storage blocked: attribution is a nice-to-have.
  }
}

/** With consent, move the remembered landing into a cookie the sign-up route can read. */
export function persistAttribution() {
  if (readConsent() !== "granted" || readCookie(ATTRIBUTION_COOKIE)) return;
  let raw: string | null = null;
  try {
    raw = sessionStorage.getItem(LANDING_STORAGE_KEY);
  } catch {
    return;
  }
  if (raw) writeCookie(ATTRIBUTION_COOKIE, encodeURIComponent(raw), 60 * 60 * 24 * 90);
}
