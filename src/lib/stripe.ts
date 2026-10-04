import Stripe from "stripe";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { PaidPlanId } from "./plans";

let client: Stripe | null = null;

export function stripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  client ??= new Stripe(key);
  return client;
}

/** Price IDs configured in the environment (Stripe dashboard → product → price). */
export function priceIdFor(plan: PaidPlanId) {
  const id = plan === "starter" ? process.env.STRIPE_PRICE_STARTER : process.env.STRIPE_PRICE_PROFESSIONAL;
  if (!id) throw new Error(`Stripe price for ${plan} is not configured`);
  return id;
}

/** Access is assigned from the subscription's price ID, never from client input or metadata alone. */
export function planForPrice(priceId: string | null | undefined): PaidPlanId | null {
  if (!priceId) return null;
  if (priceId === process.env.STRIPE_PRICE_STARTER) return "starter";
  if (priceId === process.env.STRIPE_PRICE_PROFESSIONAL) return "professional";
  return null;
}

/**
 * Writes a subscription's state to the user's entitlements. Monthly counters reset whenever
 * Stripe reports a new billing period (renewal), and also when the plan changes.
 */
export async function syncSubscription(admin: SupabaseClient, sub: Stripe.Subscription) {
  const userId = sub.metadata?.user_id;
  const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;

  // Find the entitlement row: by user id from metadata, or by the Stripe customer.
  const { data: row } = userId
    ? await admin.from("entitlements").select("user_id, plan, period_start").eq("user_id", userId).maybeSingle()
    : await admin.from("entitlements").select("user_id, plan, period_start").eq("stripe_customer_id", customerId).maybeSingle();
  if (!row) {
    console.error("stripe sync: no entitlement row for subscription", sub.id, customerId);
    return;
  }

  const item = sub.items.data[0];
  const priceId = item?.price?.id ?? null;
  const plan = planForPrice(priceId);
  const live = (sub.status === "active" || sub.status === "trialing") && plan !== null;
  // Billing periods live on subscription items in current Stripe API versions.
  const periodStart = item?.current_period_start ? new Date(item.current_period_start * 1000).toISOString() : null;
  const periodEnd = item?.current_period_end ? new Date(item.current_period_end * 1000).toISOString() : null;

  const newPeriod = !row.period_start || !periodStart || new Date(row.period_start).getTime() !== new Date(periodStart).getTime();
  const planChanged = live && row.plan !== plan;

  await admin
    .from("entitlements")
    .update({
      plan: live ? plan : "free",
      stripe_customer_id: customerId,
      stripe_subscription_id: sub.status === "canceled" ? null : sub.id,
      stripe_price_id: priceId,
      subscription_status: sub.status,
      cancel_at_period_end: !!sub.cancel_at_period_end,
      period_start: periodStart,
      period_end: periodEnd,
      ...(live && (newPeriod || planChanged) ? { period_posts_used: 0, period_regens_used: 0 } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", row.user_id);
}
