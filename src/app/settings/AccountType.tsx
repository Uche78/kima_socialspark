"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PROVINCES, titleForRole } from "@/lib/broker";
import type { Profile, Role } from "@/lib/types";

const NAMES: Record<Role, string> = { realtor: "Realtor", mortgage_broker: "Mortgage broker" };

/**
 * Switch between Realtor and Mortgage broker (chosen on the welcome step). Rarely used, so it sits at the
 * bottom of Settings and asks first: switching changes titles, menus and what pasting a link does.
 */
export function AccountType({ profile, onSwitched }: { profile: Pick<Profile, "id" | "role" | "province" | "title">; onSwitched: (p: Pick<Profile, "role" | "province" | "title">) => void }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [province, setProvince] = useState(profile.province ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const to: Role = profile.role === "mortgage_broker" ? "realtor" : "mortgage_broker";
  const needsProvince = to === "mortgage_broker" && !profile.province;

  async function switchRole() {
    if (needsProvince && !province) return setError("Choose your province. Your title and the fine print on your sheets depend on it.");
    setBusy(true);
    setError(null);
    const next = { role: to, province: to === "mortgage_broker" ? province || profile.province : profile.province, title: titleForRole(to, province || profile.province, profile.title) };
    const { error } = await createClient().from("profiles").update(next).eq("id", profile.id);
    setBusy(false);
    if (error) return setError("Couldn't switch. Please try again.");
    onSwitched(next);
    setConfirming(false);
    router.refresh(); // menus (Sheets) depend on the role
  }

  return (
    <section id="account-type" className="card scroll-mt-24 space-y-3 p-5 text-sm">
      <h2 className="font-semibold">Account type</h2>
      <p>
        You&apos;re using SocialSpark as a <strong>{NAMES[profile.role].toLowerCase()}</strong>.{" "}
        {!confirming && (
          <button type="button" className="font-medium underline underline-offset-2" onClick={() => setConfirming(true)}>
            Switch to {NAMES[to].toLowerCase()}
          </button>
        )}
      </p>
      {confirming && (
        <div className="space-y-3 rounded-lg bg-amber-50 p-4 text-amber-950">
          <p className="font-medium">Switch to a {NAMES[to].toLowerCase()} account?</p>
          {to === "realtor" ? (
            <ul className="list-disc space-y-1 pl-5">
              <li>Your feature sheets, rates and partners are kept, but hidden while you&apos;re a realtor.</li>
              <li>Pasting a link creates social posts instead of a feature sheet.</li>
              <li>Your title changes to REALTOR® unless you typed your own.</li>
            </ul>
          ) : (
            <ul className="list-disc space-y-1 pl-5">
              <li>You&apos;ll get feature sheets, broker titles and mortgage rate settings.</li>
              <li>Pasting a link opens the Sheet Builder instead of the listing page.</li>
              <li>Your listings, posts and partners stay as they are.</li>
            </ul>
          )}
          {needsProvince && (
            <label className="block max-w-xs">
              <span className="label">Province where you&apos;re licensed</span>
              <select className="input" value={province} onChange={(e) => setProvince(e.target.value)}>
                <option value="">Choose…</option>
                {Object.entries(PROVINCES).map(([code, name]) => (
                  <option key={code} value={code}>{name}</option>
                ))}
              </select>
            </label>
          )}
          {error && <p className="text-red-800">{error}</p>}
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn-primary" onClick={switchRole} disabled={busy}>
              {busy ? "Switching…" : `Switch to ${NAMES[to].toLowerCase()}`}
            </button>
            <button type="button" className="btn-ghost" onClick={() => { setConfirming(false); setError(null); }} disabled={busy}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
