"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { mediaUrl, uniqueSuffix } from "@/lib/media";
import { formatPhone, isValidEmail, isValidPhone, normalizeEmail } from "@/lib/contact-format";
import { Chips } from "@/components/Chips";
import { LocalTime } from "@/components/LocalTime";
import { PlanButton } from "@/components/PlanButton";
import { PAID_PLANS, type Usage } from "@/lib/plans";
import { connectUrl, daysUntil, EXPIRY_WARN_DAYS, formatDay } from "@/lib/connection-expiry";
import { PLATFORM_SPECS, TONE_PRESETS, type Profile, type SocialAccount } from "@/lib/types";

type Props = {
  profile: Profile;
  accounts: SocialAccount[];
  isGuest: boolean;
  usage: Usage;
  billingSuccess: boolean;
  connected: string | null;
  connectError: string | null;
};

const MAX_SAMPLES = 5;

export function SettingsForm({ profile: initial, accounts, isGuest, usage, billingSuccess, connected, connectError }: Props) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [p, setP] = useState(initial);
  const [now] = useState(() => Date.now());
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  // Show validation errors only after the user leaves a field (or tries to save).
  const [touched, setTouched] = useState<{ phone?: boolean; email?: boolean }>({});
  const phoneError = !isValidPhone(p.phone) ? "Enter a 10-digit phone number, e.g. (416) 555-0142." : null;
  const emailError = !isValidEmail(p.email) ? "Enter a valid email address, e.g. you@brokerage.ca." : null;

  function set<K extends keyof Profile>(k: K, v: Profile[K]) {
    setP((cur) => ({ ...cur, [k]: v }));
    setDirty(true);
  }

  async function save() {
    if (phoneError || emailError) {
      setTouched({ phone: true, email: true });
      return;
    }
    setSaving(true);
    const { id, ...fields } = p;
    const { error } = await supabase
      .from("profiles")
      .update({ ...fields, writing_samples: fields.writing_samples.filter((s) => s.trim()) })
      .eq("id", id);
    setSaving(false);
    setMsg(error ? error.message : "Saved.");
    if (!error) {
      setDirty(false);
      router.refresh(); // header avatar shows the saved name
    }
  }

  async function uploadAsset(kind: "logo" | "headshot", file: File | undefined) {
    if (!file) return;
    const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const path = `${p.id}/brand/${kind}-${uniqueSuffix()}.${ext}`;
    const { error } = await supabase.storage.from("media").upload(path, file, { contentType: file.type });
    if (error) return setMsg(error.message);
    const key = kind === "logo" ? "logo_path" : "headshot_path";
    const old = p[key];
    setP((cur) => ({ ...cur, [key]: path }));
    await supabase.from("profiles").update({ [key]: path }).eq("id", p.id);
    if (old) await supabase.storage.from("media").remove([old]);
    if (kind === "headshot") router.refresh(); // header avatar uses the headshot
  }

  async function disconnect(id: string) {
    await supabase.from("social_accounts").delete().eq("id", id);
    router.refresh();
  }

  const text = (k: keyof Profile, label: string, placeholder = "") => (
    <label className="block">
      <span className="label">{label}</span>
      <input className="input" placeholder={placeholder} value={(p[k] as string) ?? ""} onChange={(e) => set(k, (e.target.value || null) as never)} />
    </label>
  );

  return (
    <div className="mx-auto px-4 max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Brand &amp; voice</h1>
        <button className="btn-primary" onClick={save} disabled={!dirty || saving || !!phoneError || !!emailError}>{saving ? "Saving…" : dirty ? "Save changes" : "Saved"}</button>
      </div>
      {msg && <div className="rounded-lg bg-black/5 p-3 text-sm">{msg}</div>}

      <section className="card space-y-4 p-5">
        <h2 className="font-semibold">About you</h2>
        <Chips label="I am a" value={p.role} onChange={(v) => set("role", v)} options={{ realtor: "Realtor", mortgage_broker: "Mortgage broker" }} />
        <div className="grid gap-3 sm:grid-cols-2">
          {text("full_name", "Full name")}
          {text("title", "Title", p.role === "mortgage_broker" ? "Mortgage Agent Level 2" : "REALTOR®")}
          {text("brokerage_name", "Brokerage")}
          {text("license_number", p.role === "mortgage_broker" ? "Licence # (required on posts)" : "Licence / registration #")}
          <label className="block">
            <span className="label">Phone</span>
            <input
              className={`input ${touched.phone && phoneError ? "border-red-400 focus:border-red-500 focus:ring-red-200" : ""}`}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="(416) 555-0142"
              value={p.phone ?? ""}
              onChange={(e) => set("phone", formatPhone(e.target.value) || null)}
              onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
              aria-invalid={!!(touched.phone && phoneError)}
            />
            {touched.phone && phoneError && <span className="mt-1 block text-xs text-red-700">{phoneError}</span>}
          </label>
          <label className="block">
            <span className="label">Email</span>
            <input
              className={`input ${touched.email && emailError ? "border-red-400 focus:border-red-500 focus:ring-red-200" : ""}`}
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@brokerage.ca"
              value={p.email ?? ""}
              onChange={(e) => set("email", e.target.value.replace(/\s/g, "") || null)}
              onBlur={() => {
                setTouched((t) => ({ ...t, email: true }));
                if (p.email && normalizeEmail(p.email) !== p.email) set("email", normalizeEmail(p.email));
              }}
              aria-invalid={!!(touched.email && emailError)}
            />
            {touched.email && emailError && <span className="mt-1 block text-xs text-red-700">{emailError}</span>}
          </label>
          {text("website", "Website")}
        </div>
        <p className="text-xs text-muted">
          Your brokerage name{p.role === "mortgage_broker" ? " and licence number appear" : " appears"} on posts by default, as most provincial regulators require.
        </p>
      </section>

      <section className="card space-y-4 p-5">
        <h2 className="font-semibold">Branding</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {(["logo", "headshot"] as const).map((kind) => {
            const path = kind === "logo" ? p.logo_path : p.headshot_path;
            return (
              <div key={kind}>
                <span className="label">{kind === "logo" ? "Logo" : "Headshot"}</span>
                <div className="flex items-center gap-3">
                  <div className={`flex h-20 w-20 items-center justify-center overflow-hidden border border-border bg-black/5 ${kind === "headshot" ? "rounded-full" : "rounded-lg"}`}>
                    {path && <img src={mediaUrl(path)!} alt="" className={kind === "headshot" ? "h-full w-full object-cover" : "max-h-full max-w-full object-contain"} />}
                  </div>
                  <label className="btn-secondary cursor-pointer">
                    {path ? "Replace" : "Upload"}
                    <input type="file" hidden accept="image/png,image/jpeg,image/webp" onChange={(e) => uploadAsset(kind, e.target.files?.[0])} />
                  </label>
                </div>
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-3 gap-3">
          {(
            [
              ["brand_primary", "Primary"],
              ["brand_secondary", "Secondary"],
              ["brand_accent", "Accent"],
            ] as const
          ).map(([k, label]) => (
            <label key={k} className="block">
              <span className="label">{label}</span>
              <input type="color" className="h-10 w-full cursor-pointer rounded-lg border border-border" value={p[k]} onChange={(e) => set(k, e.target.value)} />
            </label>
          ))}
        </div>
        <div>
          <span className="label">Include by default</span>
          <div className="flex flex-wrap gap-4 text-sm">
            <label className="flex items-center gap-2"><input type="checkbox" checked={p.include_logo} onChange={(e) => set("include_logo", e.target.checked)} /> Logo</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={p.include_headshot} onChange={(e) => set("include_headshot", e.target.checked)} /> Headshot</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={p.include_contact} onChange={(e) => set("include_contact", e.target.checked)} /> Contact details</label>
          </div>
        </div>
      </section>

      <section className="card space-y-4 p-5">
        <h2 className="font-semibold">Your voice</h2>
        <Chips label="Tone" value={p.tone_preset as keyof typeof TONE_PRESETS} onChange={(v) => set("tone_preset", v)} options={TONE_PRESETS} />
        <Chips label="Default language" value={p.default_language} onChange={(v) => set("default_language", v)} options={{ en: "English", fr: "Français (QC)", bilingual: "Bilingual" }} />
        <label className="block">
          <span className="label">Style notes</span>
          <textarea
            className="input min-h-20"
            placeholder="e.g. I always sign off with 'Let's find your home.' No more than two emojis. I mention walkability a lot."
            value={p.tone_notes ?? ""}
            onChange={(e) => set("tone_notes", e.target.value || null)}
          />
        </label>
        <div>
          <span className="label">Examples of your writing (paste past posts you liked)</span>
          <div className="space-y-2">
            {p.writing_samples.map((s, i) => (
              <div key={i} className="flex gap-2">
                <textarea className="input min-h-20" value={s} onChange={(e) => set("writing_samples", p.writing_samples.map((x, j) => (j === i ? e.target.value : x)))} />
                <button className="btn-ghost self-start text-red-700" onClick={() => set("writing_samples", p.writing_samples.filter((_, j) => j !== i))}>Remove</button>
              </div>
            ))}
            {p.writing_samples.length < MAX_SAMPLES && (
              <button className="btn-secondary" onClick={() => set("writing_samples", [...p.writing_samples, ""])}>+ Add example</button>
            )}
          </div>
        </div>
      </section>

      <section id="accounts" className="card space-y-4 p-5">
        <h2 className="font-semibold">Connected accounts</h2>
        {connected && <div className="rounded-lg bg-green-50 p-3 text-sm text-green-900">Connected successfully.</div>}
        {connectError && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800">Couldn&apos;t connect: {connectError.replaceAll("_", " ")}</div>}
        {isGuest ? (
          <p className="text-sm text-muted"><Link href="/login" className="underline">Create a free account</Link> to connect social accounts.</p>
        ) : (
          <>
            {accounts.length > 0 && (
              <ul className="divide-y divide-border rounded-lg border border-border">
                {accounts.map((a) => {
                  const days = daysUntil(a.expires_at, now);
                  const expired = days !== null && days < 0;
                  const expiring = days !== null && !expired && days <= EXPIRY_WARN_DAYS;
                  return (
                    <li key={a.id} className="px-3 py-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          {a.avatar_url && <img src={a.avatar_url} alt="" className="h-6 w-6 rounded-full" />}
                          <strong>{PLATFORM_SPECS[a.platform].label}</strong> {a.account_name}
                        </span>
                        <button className="btn-ghost text-red-700" onClick={() => disconnect(a.id)}>Disconnect</button>
                      </div>
                      {(expired || expiring) && a.expires_at && (
                        <div className={`mt-1 flex flex-wrap items-center justify-between gap-2 rounded-md px-2.5 py-1.5 ${expired ? "bg-red-50 text-red-800" : "bg-amber-50 text-amber-900"}`}>
                          <span>
                            {expired
                              ? `Connection expired on ${formatDay(a.expires_at)}. Posts to this account will fail until you reconnect.`
                              : days === 0
                                ? "Connection expires today. Reconnect to keep publishing."
                                : `Connection expires in ${days} day${days === 1 ? "" : "s"} (${formatDay(a.expires_at)}). Reconnect to keep publishing.`}
                          </span>
                          <a href={connectUrl(a.platform)} className="font-semibold underline">Reconnect</a>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
            <div className="flex flex-wrap gap-2">
              <a href="/api/connect/meta/start" className="btn-secondary">Connect Facebook &amp; Instagram</a>
              <a href="/api/connect/linkedin/start" className="btn-secondary">Connect LinkedIn</a>
            </div>
            <p className="text-xs text-muted">
              Instagram requires a Business or Creator account linked to a Facebook Page. Facebook posting is to Pages.
            </p>
          </>
        )}
      </section>

      <section id="billing" className="card scroll-mt-24 p-5 text-sm">
        <h2 className="mb-2 font-semibold">Plan &amp; billing</h2>
        {billingSuccess && (
          <p className="mb-3 rounded-lg bg-green-50 px-3 py-2 text-green-800">
            Thanks for subscribing! It can take a few seconds for your plan to show here. Refresh if it hasn&apos;t updated.
          </p>
        )}
        {usage.paid ? (
          <div className="space-y-1.5">
            <p>
              <strong>{PAID_PLANS[usage.plan as keyof typeof PAID_PLANS].name}</strong> · {PAID_PLANS[usage.plan as keyof typeof PAID_PLANS].price} CAD/month plus tax
            </p>
            <p>New posts: {Math.min(usage.posts.used, usage.posts.limit)} of {usage.posts.limit} used this month</p>
            {usage.regens && <p>Regenerations: {Math.min(usage.regens.used, usage.regens.limit)} of {usage.regens.limit} used this month</p>}
            {usage.resetsAt && (
              <p className="text-muted">
                {usage.cancelAtPeriodEnd ? "Your plan ends on " : "Allowances reset and your plan renews on "}
                <LocalTime iso={usage.resetsAt} dateOnly />.
              </p>
            )}
            <div className="pt-2">
              <PlanButton plan="portal" label="Manage billing" className="btn-secondary rounded-full" signedIn />
            </div>
          </div>
        ) : (
          <div className="space-y-1.5">
            <p>
              <strong>{isGuest ? "Guest" : "Free"}</strong>: {Math.min(usage.posts.used, usage.posts.limit)} of {usage.posts.limit} free generations used.
            </p>
            <p className="text-muted">Free generations don&apos;t reset. Paid plans start at {PAID_PLANS.starter.price} CAD/month.</p>
            <div className="pt-2">
              <Link href={isGuest ? "/login" : "/pricing"} className="btn-primary rounded-full">
                {isGuest ? "Create a free account" : "Choose a plan"}
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
