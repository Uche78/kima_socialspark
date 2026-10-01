import { imageSize } from "image-size";
import { safeFetch } from "./safe-fetch";

// Listing pages usually embed resized copies of their photos (e.g. "_lg.jpg" at
// 500px, "?d=l" at 1024px) while the same CDN serves a much larger original.
// We try a few common ways of asking for the bigger file, measure what actually
// comes back, and use whichever transform yields the most pixels.

const PROBE_BYTES = 128 * 1024;
/** Only switch if the alternative is meaningfully bigger (by pixel area). */
const MIN_GAIN = 1.15;

const SIZE_PARAMS = ["width", "w", "height", "h", "d", "size", "resize", "fit", "crop", "dpr", "maxwidth", "maxheight", "mw", "mh", "class", "impolicy"];
const SIZE_SUFFIX = /[_-](?:xs|s|sm|small|m|md|med|medium|l|lg|large|t|th|thumb|thumbnail|preview|\d{2,4}x\d{2,4})(?=\.(?:jpe?g|png|webp)$)/i;

type Transform = { name: string; apply: (u: URL) => URL | null };

const clone = (u: URL) => new URL(u.toString());

const TRANSFORMS: Transform[] = [
  {
    name: "strip-size-params",
    apply: (u) => {
      const n = clone(u);
      let changed = false;
      for (const p of SIZE_PARAMS) {
        if (n.searchParams.has(p)) {
          n.searchParams.delete(p);
          changed = true;
        }
      }
      return changed ? n : null;
    },
  },
  { name: "strip-query", apply: (u) => (u.search ? Object.assign(clone(u), { search: "" }) : null) },
  {
    // Raise (or add) a width parameter and drop other size hints that would override it
    // (e.g. "?class=medium"). Only chosen if the CDN actually returns more pixels.
    name: "max-width-param",
    apply: (u) => {
      const p = ["width", "w"].find((k) => u.searchParams.has(k)) ?? "width";
      const n = clone(u);
      for (const k of SIZE_PARAMS) if (k !== p) n.searchParams.delete(k);
      n.searchParams.set(p, "4000");
      return n;
    },
  },
  {
    name: "strip-size-suffix",
    apply: (u) => {
      if (!SIZE_SUFFIX.test(u.pathname)) return null;
      const n = clone(u);
      n.pathname = n.pathname.replace(SIZE_SUFFIX, "");
      return n;
    },
  },
  {
    name: "strip-size-suffix-and-query",
    apply: (u) => {
      if (!SIZE_SUFFIX.test(u.pathname)) return null;
      const n = clone(u);
      n.pathname = n.pathname.replace(SIZE_SUFFIX, "");
      n.search = "";
      return n;
    },
  },
];

/** Reads just enough of an image to get its pixel dimensions. */
export async function probeDimensions(url: string): Promise<{ width: number; height: number } | null> {
  try {
    const res = await safeFetch(url, { headers: { Range: `bytes=0-${PROBE_BYTES - 1}`, Accept: "image/avif,image/webp,image/*;q=0.8" } });
    if (!res.ok || !(res.headers.get("content-type") ?? "").startsWith("image/") || !res.body) return null;
    const reader = res.body.getReader();
    const chunks: Uint8Array[] = [];
    let total = 0;
    while (total < PROBE_BYTES) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      total += value.length;
    }
    await reader.cancel().catch(() => {});
    const buf = new Uint8Array(total);
    let o = 0;
    for (const c of chunks) {
      buf.set(c, o);
      o += c.length;
    }
    const { width, height } = imageSize(buf);
    return width && height ? { width, height } : null;
  } catch {
    return null;
  }
}

export type PhotoSource = { url: string; fallback?: string };

/**
 * Returns each photo URL rewritten to its largest available variant, with the
 * original kept as a fallback in case a particular photo doesn't have one.
 */
export async function upgradePhotoUrls(urls: string[]): Promise<PhotoSource[]> {
  if (!urls.length) return [];
  let sample: URL;
  try {
    sample = new URL(urls[0]);
  } catch {
    return urls.map((url) => ({ url }));
  }

  const base = await probeDimensions(sample.toString());
  const baseArea = base ? base.width * base.height : 0;

  const tried = new Set([sample.toString()]);
  const results = await Promise.all(
    TRANSFORMS.map(async (t) => {
      const next = t.apply(sample)?.toString();
      if (!next || tried.has(next)) return null;
      tried.add(next);
      const dims = await probeDimensions(next);
      return dims ? { t, area: dims.width * dims.height } : null;
    }),
  );
  const best = results
    .filter((r): r is { t: Transform; area: number } => !!r && r.area > baseArea * MIN_GAIN)
    .sort((a, b) => b.area - a.area)[0];
  if (!best) return urls.map((url) => ({ url }));

  return urls.map((url) => {
    try {
      const upgraded = best.t.apply(new URL(url))?.toString();
      return upgraded && upgraded !== url ? { url: upgraded, fallback: url } : { url };
    } catch {
      return { url };
    }
  });
}

/** Pixel dimensions of a fully downloaded image, or null. */
export function measure(buf: ArrayBuffer): { width: number; height: number } | null {
  try {
    const { width, height } = imageSize(new Uint8Array(buf));
    return width && height ? { width, height } : null;
  } catch {
    return null;
  }
}

