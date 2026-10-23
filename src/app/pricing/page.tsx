import Link from "next/link";
import { getUser } from "@/lib/supabase/server";
import { PricingPlans } from "@/components/pricing/PricingPlans";
import { FREE_LIMITS, PAID_PLANS, PLAN_FEATURES, usageFrom, type EntitlementRow } from "@/lib/plans";

const { starter: S, professional: P, top_producer: T } = PAID_PLANS;
export const metadata = {
  title: "Pricing",
  description: `Try ${FREE_LIMITS.registered} SocialSpark posts free, no credit card. ${S.name} ${S.price}/month, ${P.name} ${P.price}/month and ${T.name} ${T.price}/month (CAD, plus tax), or pay yearly and get two months free. Every plan includes every feature.`,
  alternates: { canonical: "/pricing" },
};

export default async function PricingPage({ searchParams }: PageProps<"/pricing">) {
  const { supabase, user } = await getUser();
  const signedIn = !!user && !user.is_anonymous;
  const { data: ent } = user ? await supabase.from("entitlements").select("*").eq("user_id", user.id).maybeSingle<EntitlementRow>() : { data: null };
  const usage = usageFrom(ent, !!user?.is_anonymous);
  const { billing, interval } = await searchParams;

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4">
      <div className="text-center">
        <h1 className="font-[family-name:var(--font-heading)] tracking-[-0.02em] text-3xl text-brand sm:text-4xl">Simple pricing for busy agents</h1>
        <p className="mt-2 text-muted">
          Try {FREE_LIMITS.registered} posts free, no credit card.{" "}
          {!signedIn && (
            <Link href="/login" className="font-medium text-foreground underline underline-offset-2">
              Create a free account
            </Link>
          )}
        </p>
        <p className="mt-1 text-sm text-muted">Every plan includes every feature. Choose the allowance that fits how often you post.</p>
        {billing === "cancelled" && <p className="mt-3 text-sm text-muted">Checkout was cancelled. You haven&apos;t been charged.</p>}
      </div>

      <PricingPlans mode="pricing" signedIn={signedIn} currentPlan={usage.paid ? usage.plan : "free"} initialInterval={interval === "year" ? "year" : "month"} />

      <div className="card p-6">
        <h2 className="font-semibold">Included in every plan</h2>
        <ul className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          {PLAN_FEATURES.map((f) => <li key={f} className="flex gap-2"><span className="text-brand">✓</span>{f}</li>)}
        </ul>
        <p className="mt-4 text-xs text-muted">
          A single image or a complete carousel counts as one post. Regenerating a post uses a regeneration. Failed generations don&apos;t count.
          Allowances reset every month, on yearly plans too, and don&apos;t roll over. No automatic overage charges. Cancel any time.
          Free: guests can preview {FREE_LIMITS.guest} post; a free account gets {FREE_LIMITS.registered} in total, one time.
        </p>
      </div>
    </div>
  );
}
