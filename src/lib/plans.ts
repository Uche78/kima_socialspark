// Plans and allowances. Enforced by consume_generation() in the database
// (supabase/migrations/20261004120000_paid_plans.sql); mirrored here for display.

export type PlanId = "free" | "starter" | "professional";
export type PaidPlanId = Exclude<PlanId, "free">;
export type AllowanceKind = "post" | "regen";

export const FREE_LIMITS = { guest: 1, registered: 3 } as const;

export const PAID_PLANS: Record<PaidPlanId, { name: string; price: string; posts: number; regens: number }> = {
  starter: { name: "Starter", price: "$14.99", posts: 10, regens: 5 },
  professional: { name: "Professional", price: "$24.99", posts: 20, regens: 10 },
};

/** The entitlements row fields the app reads. */
export type EntitlementRow = {
  plan: string | null;
  generations_used: number | null;
  period_posts_used?: number | null;
  period_regens_used?: number | null;
  period_end?: string | null;
  subscription_status?: string | null;
  cancel_at_period_end?: boolean | null;
};

export type Usage = {
  plan: PlanId;
  paid: boolean;
  isGuest: boolean;
  /** Free users: one lifetime pool of attempts (new posts and regenerations both count). */
  posts: { used: number; limit: number };
  /** Paid users only; null when regenerations draw from the same pool as posts. */
  regens: { used: number; limit: number } | null;
  resetsAt: string | null;
  cancelAtPeriodEnd: boolean;
};

export function usageFrom(e: EntitlementRow | null | undefined, isGuest: boolean): Usage {
  const plan = (e?.plan ?? "free") as PlanId;
  const active = e?.subscription_status === "active" || e?.subscription_status === "trialing";
  const inPeriod = !e?.period_end || new Date(e.period_end).getTime() > Date.now();
  if ((plan === "starter" || plan === "professional") && active && inPeriod) {
    const p = PAID_PLANS[plan];
    return {
      plan,
      paid: true,
      isGuest: false,
      posts: { used: e?.period_posts_used ?? 0, limit: p.posts },
      regens: { used: e?.period_regens_used ?? 0, limit: p.regens },
      resetsAt: e?.period_end ?? null,
      cancelAtPeriodEnd: !!e?.cancel_at_period_end,
    };
  }
  return {
    plan: "free",
    paid: false,
    isGuest,
    posts: { used: e?.generations_used ?? 0, limit: isGuest ? FREE_LIMITS.guest : FREE_LIMITS.registered },
    regens: null,
    resetsAt: null,
    cancelAtPeriodEnd: false,
  };
}

/** How many of an allowance are left (free users share one pool for both kinds). */
export function remaining(u: Usage, kind: AllowanceKind) {
  const pool = kind === "regen" && u.regens ? u.regens : u.posts;
  return Math.max(pool.limit - pool.used, 0);
}

/** Local update after a successful generation, mirroring the database. */
export function withUsed(u: Usage, kind: AllowanceKind): Usage {
  if (kind === "regen" && u.regens) return { ...u, regens: { ...u.regens, used: u.regens.used + 1 } };
  return { ...u, posts: { ...u.posts, used: u.posts.used + 1 } };
}
