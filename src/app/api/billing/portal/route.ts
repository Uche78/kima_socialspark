import { NextResponse } from "next/server";
import { createAdminClient, getUser } from "@/lib/supabase/server";
import { siteUrl } from "@/lib/oauth";
import { stripe } from "@/lib/stripe";

/** Opens Stripe's customer portal: change plan, update card, cancel, invoices. */
export async function POST() {
  const { user } = await getUser();
  if (!user || user.is_anonymous) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { data: ent } = await createAdminClient().from("entitlements").select("stripe_customer_id").eq("user_id", user.id).single();
  if (!ent?.stripe_customer_id) return NextResponse.json({ error: "No billing account yet. Choose a plan first." }, { status: 404 });

  try {
    const session = await stripe().billingPortal.sessions.create({
      customer: ent.stripe_customer_id,
      return_url: `${siteUrl()}/settings#billing`,
    });
    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("portal", e);
    return NextResponse.json({ error: e instanceof Error ? e.message : "Couldn't open billing." }, { status: 502 });
  }
}
