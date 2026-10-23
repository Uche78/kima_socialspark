import type { createAdminClient } from "@/lib/supabase/server";

/** Tokens one Claude call used (from its response), for working out what posts and imports cost. */
export type AiUsage = {
  model: string;
  input_tokens: number;
  output_tokens: number;
  cache_read_tokens: number;
  cache_write_tokens: number;
  duration_ms: number;
};

type ResponseUsage = { input_tokens: number; output_tokens: number; cache_read_input_tokens?: number | null; cache_creation_input_tokens?: number | null };

export function usageOf(response: { model: string; usage: ResponseUsage }, startedAt: number): AiUsage {
  const u = response.usage;
  return {
    model: response.model,
    input_tokens: u.input_tokens,
    output_tokens: u.output_tokens,
    cache_read_tokens: u.cache_read_input_tokens ?? 0,
    cache_write_tokens: u.cache_creation_input_tokens ?? 0,
    duration_ms: Date.now() - startedAt,
  };
}

/** Filled in as soon as Claude replies, so the caller can record usage even if the reply is then rejected. */
export type UsageMeter = { usage: AiUsage | null };

/** What the call was for. A post or regeneration is a caption; an import reads a listing page. */
export type AiUsageKind = "import" | "post" | "regen";

/**
 * Saves one Claude call's usage (service role; users can't read it). Best effort: a failure here
 * must never fail the import or post it belongs to.
 */
export async function recordAiUsage(
  admin: ReturnType<typeof createAdminClient>,
  row: { user_id: string; kind: AiUsageKind; post_type?: string | null; listing_id?: string | null; job_id?: string | null; usage: AiUsage },
) {
  const { usage, ...rest } = row;
  const { error } = await admin.from("ai_usage").insert({ ...rest, ...usage });
  if (error) console.error("ai usage not recorded", error.message);
}
