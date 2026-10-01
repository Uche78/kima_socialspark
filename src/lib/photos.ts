import type { SupabaseClient } from "@supabase/supabase-js";
import { safeFetch } from "./safe-fetch";
import { measure, type PhotoSource } from "./photo-quality";
import type { Photo } from "./types";

const MAX_PHOTOS = 40;
const MAX_BYTES = 15 * 1024 * 1024;
const MIN_WIDTH = 300; // smaller than this is an icon or thumbnail, not a listing photo
const EXT: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

export function publicMediaUrl(supabase: SupabaseClient, path: string) {
  return supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
}

/**
 * Copies listing photos into our own storage so they can be rendered into
 * designs (no cross-origin issues) and handed to social platforms later.
 */
export async function copyPhotosToStorage(
  supabase: SupabaseClient,
  userId: string,
  listingId: string,
  sources: PhotoSource[],
): Promise<Photo[]> {
  const results: (Photo | null)[] = new Array(Math.min(sources.length, MAX_PHOTOS)).fill(null);
  let next = 0;

  async function worker() {
    while (next < results.length) {
      const i = next++;
      const { url, fallback } = sources[i];
      for (const source of fallback ? [url, fallback] : [url]) {
        try {
          const res = await safeFetch(source, { headers: { Accept: "image/avif,image/webp,image/*;q=0.8" } });
          const type = (res.headers.get("content-type") ?? "").split(";")[0].trim();
          if (!res.ok || !EXT[type]) continue;
          const buf = await res.arrayBuffer();
          if (buf.byteLength > MAX_BYTES) continue;
          const dims = measure(buf);
          if (!dims || dims.width < MIN_WIDTH) continue; // skip icons and thumbnails
          const path = `${userId}/listings/${listingId}/${String(i).padStart(2, "0")}.${EXT[type]}`;
          const { error } = await supabase.storage.from("media").upload(path, buf, { contentType: type, upsert: true });
          if (error) continue;
          results[i] = { path, url: publicMediaUrl(supabase, path), source_url: source, ...dims };
          break;
        } catch {
          /* try the fallback, or skip this photo */
        }
      }
    }
  }

  await Promise.all(Array.from({ length: 6 }, worker));
  return results.filter((p): p is Photo => p !== null);
}
