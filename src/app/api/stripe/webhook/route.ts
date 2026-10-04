import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/server";
import { stripe, syncSubscription } from "@/lib/stripe";

/**
 * Stripe webhook: keeps entitlements in step with subscriptions (subscribe, renew, upgrade,
 * downgrade, cancel, failed payment). Configure in Stripe → Developers → Webhooks.
 */
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");
  if (!secret || !signature) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(await request.text(), signature, secret);
  } catch (e) {
    console.error("stripe webhook signature", e);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const admin = createAdminClient();
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode === "subscription" && session.subscription) {
          const subId = typeof session.subscription === "string" ? session.subscription : session.subscription.id;
          await syncSubscription(admin, await stripe().subscriptions.retrieve(subId));
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
      case "customer.subscription.paused":
      case "customer.subscription.resumed":
        await syncSubscription(admin, event.data.object as Stripe.Subscription);
        break;
      case "invoice.paid":
      case "invoice.payment_failed": {
        // Renewals and failed payments: re-read the subscription so period and status are current.
        const invoice = event.data.object as Stripe.Invoice & { subscription?: string | Stripe.Subscription | null };
        const parentSub = (invoice as unknown as { parent?: { subscription_details?: { subscription?: string } } }).parent?.subscription_details?.subscription;
        const subId = parentSub ?? (typeof invoice.subscription === "string" ? invoice.subscription : invoice.subscription?.id);
        if (subId) await syncSubscription(admin, await stripe().subscriptions.retrieve(subId));
        break;
      }
    }
  } catch (e) {
    console.error("stripe webhook handling", event.type, e);
    return NextResponse.json({ error: "Webhook handling failed" }, { status: 500 }); // Stripe will retry
  }
  return NextResponse.json({ received: true });
}
