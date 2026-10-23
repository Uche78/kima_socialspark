"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { PROVINCES } from "@/lib/broker";
import { TEAM_AUDIENCES, TEAM_SIZES } from "@/lib/team";

/** "Brokerage or team?" banner under the plan cards, with a short enquiry form (emailed to sales). */
export function TeamBanner() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="mx-auto mt-8 flex max-w-5xl flex-col gap-4 rounded-2xl bg-[#0f2a44] px-6 py-6 text-white sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d4a24c]">Team</p>
          <p className="mt-1 text-lg font-semibold">Brokerage or team?</p>
          <p className="text-sm text-white/75">Seats for every agent, one invoice and a shared brand kit.</p>
        </div>
        <button type="button" className="inline-flex h-12 shrink-0 items-center justify-center rounded-full bg-white px-6 font-medium text-[#141414] transition hover:bg-white/90" onClick={() => setOpen(true)}>
          Talk to us →
        </button>
      </div>
      {open && <TeamEnquiryDialog onClose={() => setOpen(false)} />}
    </>
  );
}

function TeamEnquiryDialog({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", company: "", agents: "5–10", audience: "realtors", province: "", message: "", website: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch("/api/team-enquiry", { method: "POST", body: JSON.stringify(form) });
    const json = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) return setError(json.error ?? "Couldn't send that. Please try again.");
    setSent(true);
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-4" onClick={() => !busy && onClose()}>
      <div role="dialog" aria-modal="true" aria-labelledby="team-enquiry-title" className="max-h-[92svh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-white p-6 sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
        <h2 id="team-enquiry-title" className="font-[family-name:var(--font-heading)] text-2xl font-medium tracking-[-0.02em] text-brand">
          Plans for teams and brokerages
        </h2>
        {sent ? (
          <>
            <p className="mt-3 rounded-lg bg-green-50 p-3 text-sm text-green-900">Thanks! We&apos;ll get back to you within one business day.</p>
            <div className="mt-5 flex justify-end">
              <button type="button" className="btn-primary" onClick={onClose}>Done</button>
            </div>
          </>
        ) : (
          <form onSubmit={send} className="mt-1 space-y-3">
            <p className="text-sm text-muted">Tell us a bit about your team and we&apos;ll get back to you within one business day.</p>
            <label className="block">
              <span className="label">Your name</span>
              <input className="input" required maxLength={120} autoComplete="name" value={form.name} onChange={set("name")} />
            </label>
            <label className="block">
              <span className="label">Email</span>
              <input className="input" type="email" required autoComplete="email" value={form.email} onChange={set("email")} />
            </label>
            <label className="block">
              <span className="label">Team or brokerage</span>
              <input className="input" required maxLength={160} autoComplete="organization" value={form.company} onChange={set("company")} />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="label">Number of agents</span>
                <select className="input" value={form.agents} onChange={set("agents")}>
                  {TEAM_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="label">Province</span>
                <select className="input" value={form.province} onChange={set("province")}>
                  <option value="">Choose…</option>
                  {Object.entries(PROVINCES).map(([code, name]) => <option key={code} value={code}>{name}</option>)}
                </select>
              </label>
            </div>
            <fieldset>
              <legend className="label">We are</legend>
              <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
                {Object.entries(TEAM_AUDIENCES).map(([value, label]) => (
                  <label key={value} className="flex items-center gap-2">
                    <input type="radio" name="audience" value={value} checked={form.audience === value} onChange={set("audience")} />
                    {label}
                  </label>
                ))}
              </div>
            </fieldset>
            <label className="block">
              <span className="label">Anything else? (optional)</span>
              <textarea className="input min-h-20" maxLength={2000} value={form.message} onChange={set("message")} />
            </label>
            {/* Hidden from people; bots fill it in. */}
            <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" value={form.website} onChange={set("website")} />
            {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
            <div className="flex justify-end gap-2 pt-1">
              <button type="button" className="btn-ghost" onClick={onClose} disabled={busy}>Cancel</button>
              <button className="btn-primary" disabled={busy}>{busy ? "Sending…" : "Send"}</button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body,
  );
}
