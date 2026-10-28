// The path from "Choose a plan" to paying: /subscribe?plan=…&interval=… carries the choice through
// sign-in (as the `next` page) and straight into Stripe Checkout, so nobody picks a plan twice.

import { PAID_PLAN_IDS, type BillingInterval, type PaidPlanId } from "./plans";

export type PlanChoice = { plan: PaidPlanId; interval: BillingInterval };

/** Where a plan button sends people: checkout if signed in, sign-in first otherwise. */
export function subscribePath({ plan, interval }: PlanChoice): string {
  return `/subscribe?plan=${plan}&interval=${interval}`;
}

/** The plan and billing interval from /subscribe's query, or null if they aren't valid. */
export function readPlanChoice(params: { plan?: string | null; interval?: string | null }): PlanChoice | null {
  const plan = PAID_PLAN_IDS.find((p) => p === params.plan);
  if (!plan) return null;
  return { plan, interval: params.interval === "year" ? "year" : "month" };
}

/** The plan being bought, when a sign-in's `next` page is /subscribe (so sign-in can say what it's for). */
export function planChoiceFromNext(next: string | null | undefined): PlanChoice | null {
  if (!next?.startsWith("/subscribe?")) return null;
  const q = new URLSearchParams(next.slice("/subscribe?".length));
  return readPlanChoice({ plan: q.get("plan"), interval: q.get("interval") });
}
