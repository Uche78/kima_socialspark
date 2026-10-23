"use client";

import Link from "next/link";
import { useState } from "react";
import { PlanButton } from "@/components/PlanButton";
import { PAID_PLAN_IDS, PAID_PLANS, type BillingInterval, type PaidPlanId, type PlanId } from "@/lib/plans";
import { TeamBanner } from "./TeamEnquiry";

/** The plan marked "Most popular": a paid plan, or "team" to feature the Team banner instead of a card. */
export type PlanHighlight = PaidPlanId | "team";

/** Phones: the highlighted plan first, then the rest from the biggest down. */
const PHONE_ORDER = ["order-1", "order-2", "order-3"];

/**
 * Monthly/Yearly toggle, the three paid plans and the Team banner. The same on /pricing and the landing
 * pages; on the landing pages the buttons lead to /pricing, where checkout starts. Persona landing pages
 * (/for/<slug>) highlight the plan that fits their reader; everywhere else it's Pro.
 */
export function PricingPlans({
  mode,
  signedIn = false,
  currentPlan = "free",
  initialInterval = "month",
  highlight = "professional",
}: {
  mode: "landing" | "pricing";
  signedIn?: boolean;
  currentPlan?: PlanId;
  initialInterval?: BillingInterval;
  highlight?: PlanHighlight;
}) {
  const [interval, setBilling] = useState<BillingInterval>(initialInterval);
  const paid = currentPlan !== "free";
  const phoneOrder = [...PAID_PLAN_IDS].reverse().sort((a, b) => Number(b === highlight) - Number(a === highlight));

  return (
    <div>
      <div className="flex justify-center">
        <div role="radiogroup" aria-label="Billing" className="inline-flex rounded-full bg-white p-1 ring-1 ring-black/10">
          {(["month", "year"] as const).map((i) => (
            <button
              key={i}
              type="button"
              role="radio"
              aria-checked={interval === i}
              onClick={() => setBilling(i)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${interval === i ? "bg-[#141414] text-white" : "text-[#141414]/70 hover:text-[#141414]"}`}
            >
              {i === "month" ? "Monthly" : (
                <>
                  Yearly <span className={interval === i ? "text-[#d4a24c]" : "text-emerald-700"}>· 2 months free</span>
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      {highlight === "team" && <TeamBanner featured />}

      <div className="mx-auto mt-8 grid max-w-5xl gap-5 md:grid-cols-3">
        {PAID_PLAN_IDS.map((id) => {
          const p = PAID_PLANS[id];
          const highlighted = id === highlight;
          const current = paid && currentPlan === id;
          return (
            <div key={id} className={`flex flex-col ${PHONE_ORDER[phoneOrder.indexOf(id)]} md:order-none`}>
              <div className={`flex flex-1 flex-col rounded-2xl bg-white p-6 ${highlighted ? "ring-2 ring-[#0f2a44]" : "ring-1 ring-black/10"}`}>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-[#141414]">{p.name}</h3>
                  {current ? (
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-900">Your plan</span>
                  ) : (
                    highlighted && <span className="rounded-full bg-[#0f2a44] px-2.5 py-0.5 text-xs font-semibold text-white">Most popular</span>
                  )}
                </div>
                <p className="mt-3">
                  <span className="font-[family-name:var(--font-heading)] text-4xl tracking-[-0.02em] text-[#141414]">{interval === "year" ? p.yearlyPerMonth : p.price}</span>
                  <span className="text-sm text-[#141414]/60"> /month</span>
                </p>
                <p className="mt-1 text-xs text-[#141414]/60">{interval === "year" ? `Billed ${p.yearly} CAD yearly, plus tax` : "CAD, billed monthly, plus tax"}</p>
                <p className="mt-3 text-sm text-[#141414]/70">{p.forWho}</p>
                <ul className="mt-4 space-y-2 text-sm text-[#141414]/80">
                  {[`${p.posts} posts a month`, `${p.regens} regenerations a month`, "Unlimited edits and publishing", ...(id === "top_producer" ? ["Best value per post"] : [])].map((l) => (
                    <li key={l} className="flex gap-2">
                      <span className="text-[#d4a24c]">✓</span>
                      {l}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-6">
                  {mode === "landing" ? (
                    <Link
                      href={`/pricing${interval === "year" ? "?interval=year" : ""}`}
                      className={`inline-flex h-11 w-full items-center justify-center rounded-full text-sm font-medium transition ${highlighted ? "bg-[#141414] text-white hover:bg-black" : "border border-black/15 bg-white text-[#141414] hover:bg-black/5"}`}
                    >
                      Choose {p.name}
                    </Link>
                  ) : current ? (
                    <PlanButton plan="portal" label="Manage billing" className="btn-secondary h-11 w-full rounded-full" signedIn={signedIn} />
                  ) : paid ? (
                    <PlanButton plan="portal" label={`Switch to ${p.name}`} className="btn-secondary h-11 w-full rounded-full" signedIn={signedIn} />
                  ) : (
                    <PlanButton
                      plan={id}
                      interval={interval}
                      label={signedIn ? `Choose ${p.name}` : "Create an account to subscribe"}
                      className={`${highlighted ? "btn-primary" : "btn-secondary"} h-11 w-full rounded-full`}
                      signedIn={signedIn}
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {highlight !== "team" && <TeamBanner />}
    </div>
  );
}
