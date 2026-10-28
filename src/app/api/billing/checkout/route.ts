import { NextResponse } from "next/server";
import { createAdminClient, getUser } from "@/lib/supabase/server";
import { siteUrl } from "@/lib/oauth";
import { priceIdFor, stripe } from "@/lib/stripe";
import { PAID_PLAN_IDS, type BillingInterval, type PaidPlanId } from "@/lib/plans";

/** Starts Stripe Checkout for a plan, billed monthly or yearly. Prices are CAD, plus applicable tax. */
export async function POST(request: Request) {
  const { user } = await getUser();
  if (!user || user.is_anonymous) return NextResponse.json({ error: "Create a free account first.", signup: true }, { status: 401 });

  const { plan, interval = "month" } = (await request.json().catch(() => ({}))) as { plan?: PaidPlanId; interval?: BillingInterval };
  if (!plan || !PAID_PLAN_IDS.includes(plan) || (interval !== "month" && interval !== "year")) return NextResponse.json({ error: "Unknown plan." }, { status: 400 });

  const admin = createAdminClient();
  const { data: ent } = await admin.from("entitlements").select("stripe_customer_id, stripe_subscription_id, subscription_status").eq("user_id", user.id).single();

  // Already subscribed: plan changes go through the billing portal (prorated by Stripe).
  if (ent?.stripe_subscription_id && ["active", "trialing", "past_due"].includes(ent.subscription_status ?? "")) {
    return NextResponse.json({ error: "You already have a subscription. Use Manage billing to change plans.", manage: true }, { status: 409 });
  }

  try {
    let customerId = ent?.stripe_customer_id ?? null;
    if (!customerId) {
      const customer = await stripe().customers.create({ email: user.email ?? undefined, metadata: { user_id: user.id, app: "socialspark" } });
      customerId = customer.id;
      await admin.from("entitlements").update({ stripe_customer_id: customerId }).eq("user_id", user.id);
    }

    const base = siteUrl();
    const session = await stripe().checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      client_reference_id: user.id,
      line_items: [{ price: priceIdFor(plan, interval), quantity: 1 }],
      subscription_data: { metadata: { user_id: user.id, app: "socialspark", plan } },
      allow_promotion_codes: true,
      billing_address_collection: "required", // province determines GST/HST/QST
      customer_update: { address: "auto", name: "auto" },
      automatic_tax: { enabled: process.env.STRIPE_AUTOMATIC_TAX === "true" },
      // Through the welcome step: new accounts choose Realtor or Mortgage broker after paying; others pass straight on.
      success_url: `${base}/welcome?next=${encodeURIComponent("/settings?billing=success#billing")}`,
      cancel_url: `${base}/pricing?billing=cancelled`,
    });
    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("checkout", e);
    return NextResponse.json({ error: e instanceof Error ? e.message : "Couldn't start checkout." }, { status: 502 });
  }
}
