"use client";

import Link from "next/link";
import { useState } from "react";
import { createPortal } from "react-dom";
import type { PartnerRealtor } from "@/lib/broker";

/** A listing sent to a broker (the latest one shows on the listing card). */
export type ListingShare = { to_email: string; to_name: string | null; created_at: string };

/** Realtors send a listing to their mortgage broker, who can add it and make a feature sheet. */
export function ShareWithBroker({
  listingId,
  brokers = [],
  label = "Send to my mortgage broker",
  className = "btn-ghost text-sm",
  onSent,
}: {
  listingId: string;
  brokers?: PartnerRealtor[];
  label?: string;
  className?: string;
  onSent?: (share: ListingShare) => void;
}) {
  const withEmail = brokers.filter((b) => b.email);
  const [open, setOpen] = useState(false);
  // A saved partner's id, or "" for someone else (type an email).
  const [partnerId, setPartnerId] = useState(withEmail[0]?.id ?? "");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setResult(null);
    const to = partnerId ? withEmail.find((b) => b.id === partnerId)?.email ?? "" : email;
    const res = await fetch(`/api/listings/${listingId}/share`, { method: "POST", body: JSON.stringify({ email: to, note }) });
    const json = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) return setResult({ ok: false, text: json.error ?? "Couldn't send it." });
    if (json.share) onSent?.(json.share);
    const name = partnerId ? withEmail.find((b) => b.id === partnerId)?.full_name : to;
    setResult({ ok: true, text: `Sent to ${name}. They'll get a link to add this listing and create a mortgage feature sheet.` });
    setEmail("");
    setNote("");
  }

  return (
    <>
      <button type="button" className={className} onClick={() => { setOpen(true); setResult(null); }}>
        {label}
      </button>
      {open &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-4" onClick={() => !busy && setOpen(false)}>
            <form onSubmit={send} className="w-full max-w-md rounded-t-2xl bg-white p-6 sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
              <h2 className="font-[family-name:var(--font-heading)] text-2xl font-medium tracking-[-0.02em] text-brand">Send to your mortgage broker</h2>
              <p className="mt-1 text-sm text-muted">
                We&apos;ll email them this listing. With one click they can add it to SocialSpark and create a mortgage feature sheet showing buyers the monthly
                payments, co-branded with you.
              </p>
              {withEmail.length > 0 && (
                <label className="mt-4 block">
                  <span className="label">Send to</span>
                  <select className="input" value={partnerId} onChange={(e) => setPartnerId(e.target.value)}>
                    {withEmail.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.full_name}
                        {b.brokerage_name ? ` · ${b.brokerage_name}` : ""}
                      </option>
                    ))}
                    <option value="">Someone else…</option>
                  </select>
                </label>
              )}
              {!partnerId && (
                <label className="mt-4 block">
                  <span className="label">Broker&apos;s email</span>
                  <input className="input" type="email" required autoFocus placeholder="broker@example.ca" value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>
              )}
              <p className="mt-1 text-xs text-muted">
                <Link href="/partners" className="underline">Manage your partner brokers</Link>
              </p>
              <label className="mt-3 block">
                <span className="label">Note (optional)</span>
                <textarea className="input min-h-20" maxLength={500} placeholder="e.g. Can you make a feature sheet for Saturday's open house?" value={note} onChange={(e) => setNote(e.target.value)} />
              </label>
              {result && <p className={`mt-3 rounded-lg p-3 text-sm ${result.ok ? "bg-green-50 text-green-900" : "bg-red-50 text-red-800"}`}>{result.text}</p>}
              <div className="mt-5 flex justify-end gap-2">
                <button type="button" className="btn-ghost" onClick={() => setOpen(false)} disabled={busy}>
                  {result?.ok ? "Done" : "Cancel"}
                </button>
                <button className="btn-primary" disabled={busy}>{busy ? "Sending…" : "Send"}</button>
              </div>
            </form>
          </div>,
          document.body,
        )}
    </>
  );
}
