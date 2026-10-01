// Post-generation allowances. Keep in sync with consume_generation() in supabase/migrations.
export const GUEST_POST_LIMIT = 3;
export const FREE_POST_LIMIT = 10;

export type Usage = { used: number; limit: number | null };

export function usageFor(plan: string | null | undefined, used: number, isGuest: boolean): Usage {
  return { used, limit: plan === "pro" ? null : isGuest ? GUEST_POST_LIMIT : FREE_POST_LIMIT };
}
