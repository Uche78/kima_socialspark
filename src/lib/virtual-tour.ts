// Virtual tour links: 3D walkthroughs (Matterport, iGUIDE…) and video tours (YouTube, Vimeo…).
// Detected on import from known providers only, so random page links never end up in posts.

const MAX_CANDIDATES = 8;

type Rule = { host: RegExp; path?: RegExp };

const TOUR_RULES: Rule[] = [
  { host: /(^|\.)matterport\.com$/, path: /^\/(show|discover\/space|models)\b/ },
  { host: /(^|\.)mpembed\.com$/ },
  { host: /(^|\.)youriguide\.com$/ },
  { host: /(^|\.)goiguide\.com$/ },
  { host: /(^|\.)youtube\.com$/, path: /^\/(watch|embed|shorts|live)\b/ },
  { host: /(^|\.)youtube-nocookie\.com$/, path: /^\/embed\b/ },
  { host: /^youtu\.be$/ },
  { host: /^vimeo\.com$/, path: /^\/\d+/ },
  { host: /^player\.vimeo\.com$/, path: /^\/video\/\d+/ },
  { host: /(^|\.)kuula\.co$/, path: /^\/(share|post)\b/ },
  { host: /(^|\.)cloudpano\.com$/, path: /^\/tours?\b/ },
  { host: /(^|\.)zillow\.com$/, path: /^\/view-(imx|3d-home)\b/ },
  { host: /(^|\.)tourbuilder\.ca$/ },
  { host: /(^|\.)virtualtourcafe\.com$/ },
  { host: /(^|\.)tourwizard\.net$/ },
  { host: /(^|\.)vht\.com$/ },
  // Photographers' own tour sites: "tours.example.com", "example-virtualtours.com", "/virtual-tour/123".
  { host: /(^|[.-])(tours?|vtours?|virtualtours?)([.-]|$)|virtualtour/ },
  { host: /./, path: /\/(virtual-?tours?|vtours?|3d-?tours?)(\/|$)/i },
];

/** Normalizes a URL and returns it if it's http(s), else null. */
export function cleanTourUrl(raw: string | null | undefined): string | null {
  if (!raw) return null;
  try {
    const u = new URL(raw.trim().replace(/&amp;/g, "&").replace(/\\\//g, "/"));
    if (u.protocol !== "https:" && u.protocol !== "http:") return null;
    u.hash = "";
    return u.toString();
  } catch {
    return null;
  }
}

export function isTourUrl(raw: string, pageHost?: string): boolean {
  const url = cleanTourUrl(raw);
  if (!url) return false;
  const u = new URL(url);
  const host = u.hostname.replace(/^www\./, "");
  if (pageHost && host === pageHost.replace(/^www\./, "")) return false; // the listing site's own pages
  if (/\.(jpe?g|png|webp|gif|svg|css|js|ico)$/i.test(u.pathname)) return false;
  return TOUR_RULES.some((r) => r.host.test(host) && (!r.path || r.path.test(u.pathname)));
}

/** Tour-looking links anywhere in a page's HTML (iframes, links, inline scripts) or pasted text. */
export function findTourLinks(html: string, pageHost?: string): string[] {
  const text = html.replace(/\\u002F/gi, "/").replace(/\\\//g, "/").replace(/&amp;/g, "&");
  const found: string[] = [];
  for (const m of text.matchAll(/https?:\/\/[^\s"'<>()\\]+/gi)) {
    const url = m[0].replace(/[.,;:!?]+$/, "");
    if (isTourUrl(url, pageHost)) found.push(cleanTourUrl(url)!);
  }
  return [...new Set(found)].slice(0, MAX_CANDIDATES);
}
