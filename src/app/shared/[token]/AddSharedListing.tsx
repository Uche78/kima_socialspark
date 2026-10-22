"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AddSharedListing({ token, broker, realtorName }: { token: string; broker: boolean; realtorName: string | null }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function add() {
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/shared/${token}`, { method: "POST" });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json.id) {
      setError(json.error ?? "Couldn't add the listing.");
      setBusy(false);
      return;
    }
    // Brokers go straight to a sheet co-branded with the realtor who shared it.
    router.push(json.sheet_id ? `/sheets/${json.sheet_id}` : `/listings/${json.id}`);
  }

  return (
    <div>
      <button className="btn-primary h-12 w-full rounded-full text-base" onClick={add} disabled={busy}>
        {busy ? "Adding…" : broker ? "Create the feature sheet" : "Add to my listings"}
      </button>
      <p className="mt-2 text-xs text-muted">
        {broker
          ? `We'll copy the listing and its photos to your account, save ${realtorName ?? "the realtor"} as a partner and open a sheet co-branded with them.`
          : "We'll copy the listing and its photos to your account."}
      </p>
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
    </div>
  );
}
