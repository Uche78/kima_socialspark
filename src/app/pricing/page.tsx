import Link from "next/link";
import { getUser } from "@/lib/supabase/server";
import { PlanButton } from "@/components/PlanButton";
import { FREE_LIMITS, PAID_PLANS, usageFrom, type EntitlementRow, type PaidPlanId } from "@/lib/plans";

export const metadata = { title: "Pricing — SocialSpark" };

const FEATURES = [
  "Full-quality property photos and optional personal branding",
  "Single images and carousels",
  "Captions and publishing to Facebook, Instagram and LinkedIn",
  "English, French (Québec) and bilingual content",
  "Just Listed, Open House, Price Reduced, Coming Soon, Sold and Featured Property posts",
];

export default async function PricingPage({ searchParams }: PageProps<"/pricing">) {
  const { supabase, user } = await getUser();
  const signedIn = !!user && !user.is_anonymous;
  const { data: ent } = user ? await supabase.from("entitlements").select("*").eq("user_id", user.id).maybeSingle<EntitlementRow>() : { data: null };
  const usage = usageFrom(ent, !!user?.is_anonymous);
  const { billing } = await searchParams;

  const card = (id: PaidPlanId, highlight = false) => {
    const p = PAID_PLANS[id];
    const current = usage.paid && usage.plan === id;
    return (
      <div className={`card flex flex-col p-6 ${highlight ? "border-2 border-brand" : ""}`}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{p.name}</h2>
          {highlight && <span className="rounded-full bg-brand px-2.5 py-0.5 text-xs font-semibold text-white">Most popular</span>}
        </div>
        <div className="mt-3">
          <span className="font-[family-name:var(--font-display)] text-4xl text-brand">{p.price}</span>
          <span className="text-muted"> CAD/month</span>
          <div className="text-xs text-muted">plus applicable tax</div>
        </div>
        <ul className="mt-5 space-y-2 text-sm">
          <li><strong>{p.posts} new posts</strong> a month</li>
          <li><strong>{p.regens} regenerations</strong> a month (new versions of a post)</li>
          <li className="text-muted">Edits, downloads and publishing are always unlimited</li>
        </ul>
        <div className="mt-6 pt-2">
          {current ? (
            <PlanButton plan="portal" label="Manage billing" className="btn-secondary h-11 w-full rounded-full" signedIn={signedIn} />
          ) : usage.paid ? (
            <PlanButton plan="portal" label={`Switch to ${p.name}`} className="btn-secondary h-11 w-full rounded-full" signedIn={signedIn} />
          ) : (
            <PlanButton plan={id} label={signedIn ? `Choose ${p.name}` : "Create an account to subscribe"} className="btn-primary h-11 w-full rounded-full" signedIn={signedIn} />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4">
      <div className="text-center">
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-brand sm:text-4xl">Simple pricing for busy agents</h1>
        <p className="mt-2 text-muted">Both plans include every feature. Choose the allowance that fits how often you post.</p>
        {billing === "cancelled" && <p className="mt-3 text-sm text-muted">Checkout was cancelled. You haven&apos;t been charged.</p>}
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div className="card flex flex-col p-6">
          <h2 className="text-xl font-semibold">Free</h2>
          <div className="mt-3">
            <span className="font-[family-name:var(--font-display)] text-4xl text-brand">$0</span>
          </div>
          <ul className="mt-5 space-y-2 text-sm">
            <li><strong>Guest:</strong> preview {FREE_LIMITS.guest} post, no account needed</li>
            <li><strong>Free account:</strong> {FREE_LIMITS.registered} generations in total, including your guest preview</li>
            <li className="text-muted">One-time allowance, doesn&apos;t reset</li>
          </ul>
          <div className="mt-auto pt-6">
            {signedIn ? (
              <span className="block text-center text-sm text-muted">{usage.paid ? "Included with your plan" : "Your current plan"}</span>
            ) : (
              <Link href="/login" className="btn-secondary h-11 w-full rounded-full">Create a free account</Link>
            )}
          </div>
        </div>
        {card("starter")}
        {card("professional", true)}
      </div>

      <div className="card p-6">
        <h2 className="font-semibold">Included in both paid plans</h2>
        <ul className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          {FEATURES.map((f) => <li key={f} className="flex gap-2"><span className="text-brand">✓</span>{f}</li>)}
        </ul>
        <p className="mt-4 text-xs text-muted">
          A single image or a complete carousel counts as one post. Regenerating a post uses a regeneration. Failed generations
          don&apos;t count. Monthly allowances reset each billing cycle and don&apos;t roll over. No automatic overage charges. Cancel any time.
        </p>
      </div>
    </div>
  );
}
