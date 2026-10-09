import type { AllowanceKind } from "./plans";

export type PaywallKind = "signup" | "upgrade" | "limit";

/** The message and dialog shown when an allowance is used up. */
export function paywallFor(q: { isGuest: boolean; plan: string; lim: number; resetsAt: string | null }, kind: AllowanceKind): { error: string; paywall: PaywallKind } {
  if (q.isGuest) return { error: "You've used your free preview. Create a free account to get 2 more generations.", paywall: "signup" };
  if (q.plan === "free") return { error: "You've used your 3 free generations. Choose a plan to keep creating.", paywall: "upgrade" };
  const resets = q.resetsAt ? new Date(q.resetsAt).toLocaleDateString("en-CA", { month: "long", day: "numeric" }) : null;
  const what = kind === "regen" ? "regenerations" : "new posts";
  return {
    error: `You've used this month's ${q.lim} ${what}${resets ? `. They reset on ${resets}` : ""}. Upgrade for more, or wait for your renewal.`,
    paywall: "limit",
  };
}
