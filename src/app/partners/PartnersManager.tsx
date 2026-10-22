"use client";
/* eslint-disable @next/next/no-img-element */

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { brokerTitles, PARTNER_COLUMNS, REALTOR_TITLES, type PartnerKind, type PartnerRealtor } from "@/lib/broker";
import { formatPhone, isValidEmail, isValidPhone } from "@/lib/contact-format";
import { mediaUrl, uniqueSuffix } from "@/lib/media";

type Draft = Omit<PartnerRealtor, "id"> & { id?: string };

const COPY: Record<PartnerKind, { noun: string; add: string; empty: string }> = {
  realtor: { noun: "realtor", add: "+ Add realtor", empty: "No partner realtors yet. Add the realtors you co-brand feature sheets with." },
  broker: { noun: "mortgage broker", add: "+ Add mortgage broker", empty: "No partner brokers yet. Add the mortgage brokers you send listings to." },
};

/** Create, edit and remove partners. Each one saves on its own. */
export function PartnersManager({ userId, initial, kind, province }: { userId: string; initial: PartnerRealtor[]; kind: PartnerKind; province: string | null }) {
  const supabase = useMemo(() => createClient(), []);
  const titles = kind === "realtor" ? REALTOR_TITLES : brokerTitles(province);
  const empty: Draft = { kind, full_name: "", title: titles[0], brokerage_name: null, license_number: null, phone: null, email: null, website: null, headshot_path: null };
  const [list, setList] = useState(initial);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const copy = COPY[kind];

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft((d) => (d ? { ...d, [k]: v } : d));
  const otherTitle = draft && draft.title !== null && !titles.includes(draft.title);

  async function save() {
    if (!draft) return;
    if (!draft.full_name.trim()) return setError(`Add the ${copy.noun}'s name.`);
    if (draft.phone && !isValidPhone(draft.phone)) return setError("Check the phone number.");
    if (draft.email && !isValidEmail(draft.email)) return setError("Check the email address.");
    setBusy(true);
    setError(null);
    const { id, ...fields } = draft;
    const row = { ...fields, kind, full_name: fields.full_name.trim(), email: fields.email?.trim().toLowerCase() || null };
    const res = id
      ? await supabase.from("partner_realtors").update(row).eq("id", id).select(PARTNER_COLUMNS).single<PartnerRealtor>()
      : await supabase.from("partner_realtors").insert({ ...row, user_id: userId }).select(PARTNER_COLUMNS).single<PartnerRealtor>();
    setBusy(false);
    if (res.error || !res.data) return setError(res.error?.message ?? "Couldn't save.");
    const saved = res.data;
    setList((l) => (id ? l.map((r) => (r.id === id ? saved : r)) : [...l, saved]).sort((a, b) => a.full_name.localeCompare(b.full_name)));
    setDraft(null);
  }

  async function remove(r: PartnerRealtor) {
    if (!window.confirm(`Remove ${r.full_name} from your partners?`)) return;
    const { error } = await supabase.from("partner_realtors").delete().eq("id", r.id);
    if (error) return setError(error.message);
    setList((l) => l.filter((x) => x.id !== r.id));
  }

  async function uploadPhoto(file: File | undefined) {
    if (!file || !draft) return;
    const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const path = `${userId}/partners/${uniqueSuffix()}.${ext}`;
    setBusy(true);
    const { error } = await supabase.storage.from("media").upload(path, file, { contentType: file.type });
    setBusy(false);
    if (error) return setError(error.message);
    set("headshot_path", path);
  }

  const input = (k: "full_name" | "brokerage_name" | "license_number" | "phone" | "email" | "website", label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <label className="block">
      <span className="label">{label}</span>
      <input
        className="input"
        value={(draft?.[k] as string) ?? ""}
        onChange={(e) => set(k, (k === "phone" ? formatPhone(e.target.value) : e.target.value) || (k === "full_name" ? "" : null))}
        {...props}
      />
    </label>
  );

  return (
    <div className="space-y-4">
      {!draft && (
        <div className="flex justify-end">
          <button type="button" className="btn-primary" onClick={() => { setDraft({ ...empty }); setError(null); }}>
            {copy.add}
          </button>
        </div>
      )}

      {draft && (
        <div className="card space-y-3 p-5">
          <h2 className="font-semibold">{draft.id ? `Edit ${draft.full_name || copy.noun}` : `New ${copy.noun}`}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {input("full_name", "Name", { required: true, autoFocus: true })}
            <label className="block">
              <span className="label">Title</span>
              <select className="input" value={otherTitle ? "__other" : draft.title ?? ""} onChange={(e) => set("title", e.target.value === "__other" ? "" : e.target.value)}>
                {titles.map((t) => <option key={t} value={t}>{t}</option>)}
                <option value="__other">Other…</option>
              </select>
              {otherTitle && <input className="input mt-2" placeholder="Title" value={draft.title ?? ""} onChange={(e) => set("title", e.target.value)} />}
            </label>
            {input("brokerage_name", "Brokerage")}
            {input("license_number", kind === "broker" ? "Licence #" : "Registration / licence # (optional)")}
            {input("phone", "Phone", { type: "tel", inputMode: "tel" })}
            {input("email", "Email", { type: "email" })}
            {input("website", "Website")}
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            {draft.headshot_path && <img src={mediaUrl(draft.headshot_path)!} alt="" className="h-12 w-12 rounded-full object-cover" />}
            <label className="btn-secondary cursor-pointer">
              {draft.headshot_path ? "Change photo" : "Add photo"}
              <input type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => uploadPhoto(e.target.files?.[0])} />
            </label>
            {draft.headshot_path && <button type="button" className="btn-ghost" onClick={() => set("headshot_path", null)}>Remove photo</button>}
          </div>
          <p className="text-xs text-muted">Get your partner&apos;s permission before using their name, photo and contact details on posts and feature sheets.</p>
          {error && <p className="text-sm text-red-700">{error}</p>}
          <div className="flex justify-end gap-2">
            <button type="button" className="btn-ghost" onClick={() => setDraft(null)} disabled={busy}>Cancel</button>
            <button type="button" className="btn-primary" onClick={save} disabled={busy}>{busy ? "Saving…" : `Save ${copy.noun}`}</button>
          </div>
        </div>
      )}

      {list.length === 0 && !draft ? (
        <div className="card p-8 text-center text-sm text-muted">{copy.empty}</div>
      ) : (
        list.length > 0 && (
          <ul className="card divide-y divide-border">
            {list.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm">
                <span className="flex min-w-0 items-center gap-3">
                  {r.headshot_path ? (
                    <img src={mediaUrl(r.headshot_path)!} alt="" className="h-11 w-11 shrink-0 rounded-full object-cover" />
                  ) : (
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-black/5 font-semibold">{r.full_name.slice(0, 1)}</span>
                  )}
                  <span className="min-w-0">
                    <span className="block truncate font-semibold">{r.full_name}</span>
                    <span className="block truncate text-muted">
                      {[r.title, r.brokerage_name, r.license_number ? `Lic. ${r.license_number}` : null].filter(Boolean).join(" · ")}
                    </span>
                    {(r.phone || r.email) && <span className="block truncate text-muted">{[r.phone, r.email].filter(Boolean).join(" · ")}</span>}
                  </span>
                </span>
                <span className="flex shrink-0 gap-1">
                  <button type="button" className="btn-ghost" onClick={() => { setDraft({ ...r }); setError(null); }}>Edit</button>
                  <button type="button" className="btn-ghost text-red-700" onClick={() => remove(r)}>Remove</button>
                </span>
              </li>
            ))}
          </ul>
        )
      )}
      {error && !draft && <p className="text-sm text-red-700">{error}</p>}
    </div>
  );
}
