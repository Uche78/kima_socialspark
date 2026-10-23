import Link from "next/link";
import { FREE_LIMITS } from "@/lib/plans";
import { PricingPlans } from "@/components/pricing/PricingPlans";

const EYEBROW = "text-[11px] font-semibold uppercase tracking-[0.2em] text-[#141414]/70 sm:text-xs";
const H2 = "mt-3 font-[family-name:var(--font-heading)] tracking-[-0.02em] text-3xl font-medium leading-tight text-[#141414] sm:text-5xl";

/** The same plans and prices on both landing pages (realtors and mortgage brokers). Free is the headline, not a card. */
export function PricingSummary() {
  return (
    <>
      <div className="mx-auto max-w-3xl text-center">
        <p className={EYEBROW}>Pricing</p>
        <h2 id="pricing-summary" className={H2}>
          Try {FREE_LIMITS.registered} posts free. No credit card.
        </h2>
        <p className="mt-4 text-lg text-[#141414]/70">Upgrade when you&apos;re ready. Every plan includes every feature, for realtors and mortgage brokers. Prices in CAD, plus tax.</p>
      </div>
      <div className="mt-10">
        <PricingPlans mode="landing" />
      </div>
      <p className="mt-6 text-center">
        <Link href="/pricing" className="text-sm font-medium text-[#141414] underline underline-offset-4">
          Compare plans in detail
        </Link>
      </p>
    </>
  );
}
