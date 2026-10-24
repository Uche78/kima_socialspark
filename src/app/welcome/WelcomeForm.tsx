"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trackMeta } from "@/components/MetaPixel";
import { createClient } from "@/lib/supabase/client";
import { PROVINCES, titleForRole } from "@/lib/broker";
import type { Role } from "@/lib/types";

const CHOICES: { role: Role; title: string; body: string }[] = [
  { role: "realtor", title: "Realtor", body: "Branded Instagram, Facebook and LinkedIn posts from your listings, written in your voice." },
  { role: "mortgage_broker", title: "Mortgage broker", body: "Feature sheets that show what a listing costs each month at different down payments, plus posts to share them." },
];

export function WelcomeForm({ initialRole, initialProvince, currentTitle, next }: { initialRole: Role; initialProvince: string | null; currentTitle: string | null; next: string }) {
  const router = useRouter();
  const [role, setRole] = useState<Role>(initialRole);
  const [province, setProvince] = useState(initialProvince ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const broker = role === "mortgage_broker";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (broker && !province) return setError("Choose your province. Your title and the fine print on your sheets depend on it.");
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return router.replace("/login");
    const title = titleForRole(role, province, currentTitle);
    const { error } = await supabase
      .from("profiles")
      .update({ role, role_chosen: true, title, ...(broker ? { province } : {}) })
      .eq("id", auth.user.id);
    if (error) {
      setBusy(false);
      return setError("Couldn't save that. Please try again.");
    }
    // Sign-up is complete: tell Meta from the browser and the server under one event ID, so it counts once.
    // Both only happen with ad-tracking consent (the pixel isn't loaded without it; the route checks too).
    trackMeta("CompleteRegistration", { content_name: role }, `reg_${auth.user.id}`);
    void fetch("/api/track/signup", { method: "POST", keepalive: true }).catch(() => {});
    router.replace(next);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="mt-8 space-y-6">
      <div role="radiogroup" aria-label="I am a" className="grid gap-4 sm:grid-cols-2">
        {CHOICES.map((c) => {
          const active = role === c.role;
          return (
            <button
              key={c.role}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setRole(c.role)}
              className={`rounded-2xl bg-white p-6 text-left ring-1 transition ${active ? "ring-2 ring-[#141414]" : "ring-black/10 hover:ring-black/30"}`}
            >
              <span className="flex items-center justify-between gap-3">
                <span className="font-[family-name:var(--font-heading)] text-xl font-semibold tracking-[-0.02em] text-[#141414]">{c.title}</span>
                <span aria-hidden className={`grid h-5 w-5 place-items-center rounded-full border-2 ${active ? "border-[#141414]" : "border-black/25"}`}>
                  {active && <span className="h-2.5 w-2.5 rounded-full bg-[#141414]" />}
                </span>
              </span>
              <span className="mt-2 block text-sm leading-relaxed text-[#141414]/70">{c.body}</span>
            </button>
          );
        })}
      </div>

      {broker && (
        <label className="block">
          <span className="label">Province where you&apos;re licensed</span>
          <select className="input" value={province} onChange={(e) => setProvince(e.target.value)}>
            <option value="">Choose…</option>
            {Object.entries(PROVINCES).map(([code, name]) => (
              <option key={code} value={code}>{name}</option>
            ))}
          </select>
        </label>
      )}

      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      <button className="inline-flex h-14 w-full items-center justify-center rounded-full bg-[#141414] px-8 text-base font-medium text-white transition hover:bg-black disabled:opacity-60" disabled={busy}>
        {busy ? "Setting up…" : "Continue"}
      </button>
    </form>
  );
}
