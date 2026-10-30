import { FREE_LIMITS, nextPlan, PAID_PLANS, type AllowanceKind, type PlanId } from "./plans";

export type PaywallKind = "signup" | "upgrade" | "limit";

const KEEP = "Everything you've made stays yours to edit, download and publish.";

/** The message and dialog shown when an allowance is used up. On the free plan, captions are per listing. */
export function paywallFor(q: { isGuest: boolean; plan: string; lim: number; resetsAt: string | null }, kind: AllowanceKind): { error: string; paywall: PaywallKind } {
  if (q.isGuest) {
    return {
      error: `You've written the ${FREE_LIMITS.captionsPerListing} free captions for this listing. Create a free account to add ${FREE_LIMITS.registered - FREE_LIMITS.guest} more listings, with ${FREE_LIMITS.captionsPerListing} captions each.`,
      paywall: "signup",
    };
  }
  if (q.plan === "free") return { error: `You've written the ${FREE_LIMITS.captionsPerListing} free captions for this listing. Choose a plan for more posts. ${KEEP}`, paywall: "upgrade" };
  const resets = q.resetsAt ? new Date(q.resetsAt).toLocaleDateString("en-CA", { month: "long", day: "numeric" }) : null;
  const what = kind === "regen" ? "regenerations" : "new posts";
  const up = nextPlan(q.plan as PlanId);
  const more = up ? `Upgrade to ${PAID_PLANS[up].name} for ${kind === "regen" ? PAID_PLANS[up].regens : PAID_PLANS[up].posts} a month, or wait` : "Wait";
  return {
    error: `You've used this month's ${q.lim} ${what}${resets ? `. They reset on ${resets}` : ""}. ${more} for your allowance to reset.`,
    paywall: "limit",
  };
}

/** The message when the free plan's listing imports are used up (guests: their one listing). */
export function importPaywall(isGuest: boolean): { error: string; paywall: PaywallKind } {
  if (isGuest) {
    return {
      error: `You've added your free preview listing. Create a free account to add ${FREE_LIMITS.registered - FREE_LIMITS.guest} more, with ${FREE_LIMITS.captionsPerListing} captions each.`,
      paywall: "signup",
    };
  }
  return { error: `You've added ${FREE_LIMITS.registered} listings on the free plan. Choose a plan to add more. ${KEEP}`, paywall: "upgrade" };
}
