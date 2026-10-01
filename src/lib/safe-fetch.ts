import { lookup } from "node:dns/promises";
import net from "node:net";

// Fetches user-supplied URLs server-side. Rejects non-http(s) schemes and any
// host that resolves to a private, loopback, or link-local address (SSRF guard).

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "en-CA,en;q=0.9,fr-CA;q=0.8",
};

function isPrivateIp(ip: string): boolean {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split(".").map(Number);
    return (
      a === 0 ||
      a === 10 ||
      a === 127 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      a >= 224
    );
  }
  const v6 = ip.toLowerCase();
  if (v6.startsWith("::ffff:")) return isPrivateIp(v6.slice(7));
  return v6 === "::1" || v6 === "::" || v6.startsWith("fc") || v6.startsWith("fd") || v6.startsWith("fe80");
}

export async function assertPublicUrl(raw: string): Promise<URL> {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error("That doesn't look like a valid URL.");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error("Only http(s) links are supported.");
  const addresses = await lookup(url.hostname, { all: true }).catch(() => {
    throw new Error("Couldn't reach that website.");
  });
  if (addresses.some((a) => isPrivateIp(a.address))) throw new Error("That address isn't allowed.");
  return url;
}

/** Fetch with manual redirect handling so every hop is re-checked. */
export async function safeFetch(raw: string, init: RequestInit = {}, maxRedirects = 5): Promise<Response> {
  let current = raw;
  for (let i = 0; i <= maxRedirects; i++) {
    const url = await assertPublicUrl(current);
    const res = await fetch(url, {
      ...init,
      headers: { ...BROWSER_HEADERS, ...(init.headers ?? {}) },
      redirect: "manual",
      signal: init.signal ?? AbortSignal.timeout(20_000),
    });
    if (res.status >= 300 && res.status < 400 && res.headers.get("location")) {
      current = new URL(res.headers.get("location")!, url).toString();
      continue;
    }
    return res;
  }
  throw new Error("Too many redirects.");
}
