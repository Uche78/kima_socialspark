"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { BillingInterval, PaidPlanId } from "@/lib/plans";

/** Starts Stripe Checkout for a plan, or opens the billing portal for existing subscribers. */
export function PlanButton({ plan, interval = "month", label, className, signedIn }: { plan: PaidPlanId | "portal"; interval?: BillingInterval; label: string; className: string; signedIn: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function go() {
    if (!signedIn) return router.push("/login?next=/pricing");
    setBusy(true);
    setError(null);
    const res = await fetch(plan === "portal" ? "/api/billing/portal" : "/api/billing/checkout", {
      method: "POST",
      body: plan === "portal" ? undefined : JSON.stringify({ plan, interval }),
    });
    const json = await res.json().catch(() => ({}));
    if (json.url) return (window.location.href = json.url);
    if (json.manage) {
      const portal = await fetch("/api/billing/portal", { method: "POST" }).then((r) => r.json());
      if (portal.url) return (window.location.href = portal.url);
    }
    setError(json.error ?? "Something went wrong.");
    setBusy(false);
  }

  return (
    <div>
      <button className={className} onClick={go} disabled={busy}>
        {busy ? "Opening…" : label}
      </button>
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
    </div>
  );
}
