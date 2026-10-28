import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { PlanButton } from "@/components/PlanButton";
import { PAID_PLANS, usageFrom, type EntitlementRow, type PaidPlanId } from "@/lib/plans";
import { readPlanChoice, subscribePath } from "@/lib/subscribe";
import { StartCheckout } from "./StartCheckout";

// Private or utility page: keep it out of search results.
export const metadata = { title: "Subscribe", robots: { index: false, follow: false } };

/**
 * One stop between "Choose a plan" and Stripe: sign in first if needed (the plan rides along), then
 * straight to checkout. Subscribers are sent to billing instead of a second subscription.
 */
export default async function SubscribePage({ searchParams }: { searchParams: Promise<{ plan?: string; interval?: string }> }) {
  const choice = readPlanChoice(await searchParams);
  if (!choice) redirect("/pricing");

  const { supabase, user } = await getUser();
  // Guests too: subscribing needs an account (their work comes with them when they add an email).
  if (!user || user.is_anonymous) redirect(`/login?next=${encodeURIComponent(subscribePath(choice))}`);

  const { data: ent } = await supabase.from("entitlements").select("*").eq("user_id", user.id).maybeSingle<EntitlementRow>();
  const usage = usageFrom(ent, false);
  const p = PAID_PLANS[choice.plan];

  return (
    <div className="mx-auto max-w-md px-4">
      <div className="card p-8 text-center">
        {usage.paid ? (
          <>
            <h1 className="font-[family-name:var(--font-heading)] text-2xl tracking-[-0.02em] text-brand">You&apos;re on {PAID_PLANS[usage.plan as PaidPlanId].name}</h1>
            <p className="mt-2 text-sm text-muted">
              {usage.plan === choice.plan ? "You already have this plan." : `To switch to ${p.name}, use Manage billing. Stripe prorates the change.`}
            </p>
            <div className="mt-6 flex flex-col items-center gap-3">
              <PlanButton plan="portal" label="Manage billing" className="btn-primary h-11 w-full rounded-full" signedIn />
              <Link href="/" className="text-sm text-muted underline">Back to SocialSpark</Link>
            </div>
          </>
        ) : (
          <StartCheckout choice={choice} name={p.name} price={choice.interval === "year" ? `${p.yearly} CAD/year` : `${p.price} CAD/month`} />
        )}
      </div>
    </div>
  );
}
