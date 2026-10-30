import type { SupabaseClient } from "@supabase/supabase-js";

/** Free captions already written for a listing (free plan: 2 per listing). The server keeps the count. */
export async function freeCaptionsUsed(supabase: SupabaseClient, listingId: string): Promise<number> {
  const { data } = await supabase.from("free_caption_usage").select("used").eq("listing_id", listingId).maybeSingle<{ used: number }>();
  return data?.used ?? 0;
}
