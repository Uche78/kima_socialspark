// Plans and allowances. Enforced in the database by consume_generation_for() (captions) and
// consume_import_for() (listing imports), see supabase/migrations/20261029120000_free_limits.sql;
// mirrored here for display.
// Plan IDs are stable (Stripe metadata and the database use them); names are what people see.

export type PlanId = "free" | "starter" | "professional" | "top_producer";
export type PaidPlanId = Exclude<PlanId, "free">;
export type AllowanceKind = "post" | "regen";

/**
 * Free plan, lifetime: listing imports (guests 1, accounts 3), and captions per listing (new posts and
 * rewrites alike). Everything else on those listings is free: sheets, edits, downloads, PDFs, publishing.
 */
export const FREE_LIMITS = { guest: 1, registered: 3, captionsPerListing: 2 } as const;

export type BillingInterval = "month" | "year";

/** Paid plans, smallest first. Yearly costs 10 months (two months free); allowances are monthly either way. */
export const PAID_PLAN_IDS: PaidPlanId[] = ["starter", "professional", "top_producer"];

export const PAID_PLANS: Record<PaidPlanId, { name: string; price: string; yearly: string; yearlyPerMonth: string; posts: number; regens: number; forWho: string }> = {
  starter: { name: "Starter", price: "$14.99", yearly: "$149.90", yearlyPerMonth: "$12.49", posts: 10, regens: 5, forWho: "For getting started" },
  professional: { name: "Pro", price: "$24.99", yearly: "$249.90", yearlyPerMonth: "$20.83", posts: 20, regens: 10, forWho: "For an active agent" },
  top_producer: { name: "Top Producer", price: "$49.99", yearly: "$499.90", yearlyPerMonth: "$41.66", posts: 50, regens: 25, forWho: "For high-volume listing agents" },
};

/** Included in every paid plan (the pricing page and the offer on persona landing pages). */
export const PLAN_FEATURES = [
  "Full-quality property photos and optional personal branding",
  "Single images and carousels",
  "Captions and publishing to Facebook, Instagram and LinkedIn",
  "English, French (Québec) and bilingual content",
  "Just Listed, Open House, Price Reduced, Coming Soon, Sold and Featured Property posts",
  "Mortgage feature sheets, PDFs and Stories for mortgage brokers",
];

/** PLAN_FEATURES in Québec French, same order, for French landing pages. */
export const PLAN_FEATURES_FR = [
  "Photos de la propriété en pleine qualité et image de marque personnelle en option",
  "Images uniques et carrousels",
  "Textes et publication sur Facebook, Instagram et LinkedIn",
  "Contenu en anglais, en français (Québec) et bilingue",
  "Publications Nouvelle inscription, Visite libre, Prix réduit, Bientôt disponible, Vendu et Propriété en vedette",
  "Fiches hypothécaires, PDF et Stories pour les courtiers hypothécaires",
];

/** The next plan up, for "upgrade" prompts (null on the biggest plan). */
export function nextPlan(plan: PlanId): PaidPlanId | null {
  if (plan === "free") return "starter";
  const i = PAID_PLAN_IDS.indexOf(plan);
  return PAID_PLAN_IDS[i + 1] ?? null;
}

/** The entitlements row fields the app reads. */
export type EntitlementRow = {
  plan: string | null;
  generations_used?: number | null;
  imports_used?: number | null;
  period_posts_used?: number | null;
  period_regens_used?: number | null;
  period_end?: string | null;
  allowance_end?: string | null;
  billing_interval?: string | null;
  subscription_status?: string | null;
  cancel_at_period_end?: boolean | null;
};

export type Usage = {
  plan: PlanId;
  paid: boolean;
  isGuest: boolean;
  /** Paid: this month's new posts. Free: captions written for one listing (new posts and rewrites share it). */
  posts: { used: number; limit: number };
  /** Paid users only; null when regenerations draw from the same pool as posts. */
  regens: { used: number; limit: number } | null;
  resetsAt: string | null;
  cancelAtPeriodEnd: boolean;
  /** Paid plans: billed monthly or yearly. */
  interval: BillingInterval | null;
  /** Paid plans: when the subscription renews or ends (yearly plans renew once a year). */
  renewsAt: string | null;
  /** Free plan: listing imports used of the lifetime limit. Null on paid plans (unlimited). */
  imports: { used: number; limit: number } | null;
};

/**
 * The user's allowances. On the free plan, captions are counted per listing: pass that listing's free
 * captions used (from free_caption_usage) wherever a caption could be written for it.
 */
export function usageFrom(e: EntitlementRow | null | undefined, isGuest: boolean, listingCaptionsUsed = 0): Usage {
  const plan = (e?.plan ?? "free") as PlanId;
  const active = e?.subscription_status === "active" || e?.subscription_status === "trialing";
  const inPeriod = !e?.period_end || new Date(e.period_end).getTime() > Date.now();
  if (plan !== "free" && plan in PAID_PLANS && active && inPeriod) {
    const p = PAID_PLANS[plan];
    // A month of allowance that has ended resets on the next post (in the database); show it as reset now.
    const window = monthlyWindow(e?.allowance_end ?? e?.period_end ?? null);
    return {
      plan,
      paid: true,
      isGuest: false,
      posts: { used: window.expired ? 0 : (e?.period_posts_used ?? 0), limit: p.posts },
      regens: { used: window.expired ? 0 : (e?.period_regens_used ?? 0), limit: p.regens },
      resetsAt: window.end,
      cancelAtPeriodEnd: !!e?.cancel_at_period_end,
      interval: e?.billing_interval === "year" ? "year" : "month",
      renewsAt: e?.period_end ?? null,
      imports: null,
    };
  }
  return {
    plan: "free",
    paid: false,
    isGuest,
    posts: { used: listingCaptionsUsed, limit: FREE_LIMITS.captionsPerListing },
    regens: null,
    resetsAt: null,
    cancelAtPeriodEnd: false,
    interval: null,
    renewsAt: null,
    imports: { used: e?.imports_used ?? 0, limit: isGuest ? FREE_LIMITS.guest : FREE_LIMITS.registered },
  };
}

/** Free listing imports left (null = unlimited, on a paid plan). */
export function importsLeft(u: Usage): number | null {
  return u.imports ? Math.max(u.imports.limit - u.imports.used, 0) : null;
}

/** The current month of allowance: rolls an ended window forward a month at a time, like the database. */
function monthlyWindow(end: string | null): { end: string | null; expired: boolean } {
  if (!end) return { end: null, expired: false };
  const d = new Date(end);
  if (d.getTime() > Date.now()) return { end, expired: false };
  const day = d.getUTCDate();
  for (let n = 1; n < 1200; n++) {
    const next = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + n, 1, d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds()));
    next.setUTCDate(Math.min(day, new Date(Date.UTC(next.getUTCFullYear(), next.getUTCMonth() + 1, 0)).getUTCDate()));
    if (next.getTime() > Date.now()) return { end: next.toISOString(), expired: true };
  }
  return { end: null, expired: true };
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
