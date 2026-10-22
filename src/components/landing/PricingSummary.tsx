import Link from "next/link";
import { FREE_LIMITS, PAID_PLANS } from "@/lib/plans";

const EYEBROW = "text-[11px] font-semibold uppercase tracking-[0.2em] text-[#141414]/70 sm:text-xs";
const H2 = "mt-3 font-[family-name:var(--font-heading)] tracking-[-0.02em] text-3xl font-medium leading-tight text-[#141414] sm:text-5xl";

/** The same plans and prices on both landing pages (realtors and mortgage brokers). */
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
      <div className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-3">
        <PlanCard name="Free" price="$0" note="One-time" lines={[`${FREE_LIMITS.registered} posts to try it out`, "Every platform and language", "Feature sheets for brokers"]} />
        <PlanCard
          name={PAID_PLANS.starter.name}
          price={PAID_PLANS.starter.price}
          note="per month"
          lines={[`${PAID_PLANS.starter.posts} new posts a month`, `${PAID_PLANS.starter.regens} regenerations a month`, "Unlimited edits and publishing"]}
        />
        <PlanCard
          name={PAID_PLANS.professional.name}
          price={PAID_PLANS.professional.price}
          note="per month"
          highlight
          lines={[`${PAID_PLANS.professional.posts} new posts a month`, `${PAID_PLANS.professional.regens} regenerations a month`, "Unlimited edits and publishing"]}
        />
      </div>
      <p className="mt-6 text-center">
        <Link href="/pricing" className="text-sm font-medium text-[#141414] underline underline-offset-4">
          Compare plans in detail
        </Link>
      </p>
    </>
  );
}

function PlanCard({ name, price, note, lines, highlight }: { name: string; price: string; note: string; lines: string[]; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl bg-white p-6 ring-1 ${highlight ? "ring-2 ring-[#0f2a44]" : "ring-black/10"}`}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-[#141414]">{name}</h3>
        {highlight && <span className="rounded-full bg-[#0f2a44] px-2.5 py-0.5 text-xs font-semibold text-white">Most popular</span>}
      </div>
      <p className="mt-3">
        <span className="font-[family-name:var(--font-heading)] tracking-[-0.02em] text-4xl text-[#141414]">{price}</span>
        <span className="text-sm text-[#141414]/60"> {note}</span>
      </p>
      <ul className="mt-5 space-y-2 text-sm text-[#141414]/80">
        {lines.map((l) => (
          <li key={l} className="flex gap-2">
            <span className="text-[#d4a24c]">✓</span>
            {l}
          </li>
        ))}
      </ul>
    </div>
  );
}
