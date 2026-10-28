"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { trackGa } from "@/components/GoogleAnalytics";
import type { PlanChoice } from "@/lib/subscribe";

/** Opens Stripe Checkout for the chosen plan as soon as the page loads (once, even in development). */
export function StartCheckout({ choice, name, price }: { choice: PlanChoice; name: string; price: string }) {
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);

  async function start() {
    setError(null);
    trackGa("begin_checkout", { plan: choice.plan, interval: choice.interval });
    const res = await fetch("/api/billing/checkout", { method: "POST", body: JSON.stringify(choice) });
    const json = await res.json().catch(() => ({}));
    if (json.url) {
      window.location.href = json.url;
      return;
    }
    setError(json.error ?? "Couldn't open checkout. Please try again.");
  }

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void start();
  });

  return (
    <>
      <h1 className="font-[family-name:var(--font-heading)] text-2xl tracking-[-0.02em] text-brand">Start the {name} plan</h1>
      <p className="mt-1 text-sm text-muted">{price}, plus tax. Cancel anytime.</p>
      {error ? (
        <div className="mt-6 space-y-3">
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>
          <button className="btn-primary h-11 w-full rounded-full" onClick={() => void start()}>
            Try again
          </button>
          <Link href="/pricing" className="block text-sm text-muted underline">See all plans</Link>
        </div>
      ) : (
        <p className="mt-6 text-sm text-muted">Taking you to secure checkout…</p>
      )}
    </>
  );
}
