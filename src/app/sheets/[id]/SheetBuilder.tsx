"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import { ScaledSlide } from "@/components/ScaledSlide";
import { SlideCanvas } from "@/components/SlideCanvas";
import { PDF_SIZE } from "@/components/useSheetExports";
import { Chips } from "@/components/Chips";
import { LocalTime } from "@/components/LocalTime";
import {
  FEE_LABELS,
  FOOTER_SHAPES,
  FREQUENCIES,
  RENT_DISPLAYS,
  SHADINGS,
  type FeeLabel,
  type FooterShape,
  type MortgageSettings,
  type PartnerRealtor,
  type ScenarioDefault,
  type Shading,
} from "@/lib/broker";
import { designForSheet, sheetConfigFrom, sheetProblems, sheetSlide, type FeatureSheet, type SheetConfig } from "@/lib/feature-sheet";
import { MAX_SCENARIOS, parseDownPayment, type PaymentFrequency, type RentDisplay } from "@/lib/mortgage-sheet";
import { dataUrlBytes, jpegsToPdf } from "@/lib/pdf";
import { downloadBlob, renderSlide } from "@/lib/render";
import { isLowRes } from "@/lib/media";
import { PLATFORM_SPECS, statusLabel, type Language, type Listing, type Post, type Profile } from "@/lib/types";

type SheetPost = Pick<Post, "id" | "platform" | "format" | "status" | "created_at" | "scheduled_at" | "published_at">;
type Props = { initialSheet: FeatureSheet; initialListing: Listing; profile: Profile; realtors: PartnerRealtor[]; posts: SheetPost[] };

const LISTING_FIELDS = ["price", "monthly_fee", "property_tax_yearly", "monthly_rent"] as const;
type ListingField = (typeof LISTING_FIELDS)[number];

/** Build a feature sheet: controls on the left, a large live preview on the right. Edits save automatically. */
export function SheetBuilder({ initialSheet, initialListing, profile, realtors, posts }: Props) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [sheet, setSheet] = useState(initialSheet);
  const [listing, setListing] = useState(initialListing);
  const [saveState, setSaveState] = useState<"saved" | "saving" | "error">("saved");
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const exportRef = useRef<HTMLDivElement>(null);
  const [exportSize, setExportSize] = useState<{ w: number; h: number } | null>(null);

  const config = sheet.config;
  const design = useMemo(() => designForSheet(profile, config), [profile, config]);
  const slide = sheetSlide(sheet);
  const size = PDF_SIZE;
  const problems = sheetProblems(listing, config);

  // Autosave the sheet (debounced).
  const firstSheet = useRef(true);
  useEffect(() => {
    if (firstSheet.current) {
      firstSheet.current = false;
      return;
    }
    setSaveState("saving");
    const t = setTimeout(async () => {
      const { error } = await supabase
        .from("feature_sheets")
        .update({ language: sheet.language, headline: sheet.headline, photo_index: sheet.photo_index, config: sheet.config })
        .eq("id", sheet.id);
      setSaveState(error ? "error" : "saved");
    }, 700);
    return () => clearTimeout(t);
  }, [sheet, supabase]);

  // Autosave listing costs (shared with the listing and its other sheets).
  const firstListing = useRef(true);
  useEffect(() => {
    if (firstListing.current) {
      firstListing.current = false;
      return;
    }
    setSaveState("saving");
    const t = setTimeout(async () => {
      const patch = Object.fromEntries(LISTING_FIELDS.map((k) => [k, listing[k]]));
      const { error } = await supabase.from("listings").update(patch).eq("id", listing.id);
      setSaveState(error ? "error" : "saved");
    }, 700);
    return () => clearTimeout(t);
  }, [listing, supabase]);

  const setConfig = (patch: Partial<SheetConfig>) => setSheet((s) => ({ ...s, config: { ...s.config, ...patch } }));
  const setListingField = (k: ListingField, raw: string) => {
    const n = raw === "" ? null : Number(raw);
    setListing((l) => ({ ...l, [k]: n != null && Number.isFinite(n) && n >= 0 ? n : null }));
  };

  async function run(label: string, fn: () => Promise<string | void>) {
    setBusy(label);
    setMessage(null);
    try {
      const text = await fn();
      if (text) setMessage({ ok: true, text });
    } catch (e) {
      setMessage({ ok: false, text: e instanceof Error ? e.message : "Something went wrong." });
    } finally {
      setBusy(null);
    }
  }

  /** Renders the sheet off-screen at a full size and returns a JPEG data URL. */
  async function renderAt(w: number, h: number) {
    setExportSize({ w, h });
    await new Promise((r) => setTimeout(r, 400));
    if (!exportRef.current) throw new Error("The sheet isn't ready yet.");
    const jpeg = await renderSlide(exportRef.current, w, h);
    setExportSize(null);
    return jpeg;
  }

  const base = `${(listing.address || "listing").replace(/[^\w-]+/g, "-").toLowerCase()}-feature-sheet`;
  const onPdf = () =>
    run("pdf", async () => {
      const jpeg = await renderAt(PDF_SIZE.w, PDF_SIZE.h);
      downloadBlob(
        new Blob([jpegsToPdf([{ jpeg: dataUrlBytes(jpeg), width: PDF_SIZE.w, height: PDF_SIZE.h }]) as BlobPart], { type: "application/pdf" }),
        `${base}.pdf`,
      );
      return "PDF downloaded (letter size).";
    });
  /** Starts a post from this sheet (a free draft) and opens it to choose where it goes and write the caption. */
  const onCreatePost = () =>
    run("post", async () => {
      const res = await fetch(`/api/sheets/${sheet.id}/post`, { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Couldn't start the post.");
      router.push(`/posts/${json.id}`);
    });
  const onDuplicate = () =>
    run("duplicate", async () => {
      const res = await fetch("/api/sheets", { method: "POST", body: JSON.stringify({ from: sheet.id }) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Couldn't duplicate.");
      router.push(`/sheets/${json.id}`);
    });
  const onSaveDefaults = () =>
    run("defaults", async () => {
      const { realtor: _r, ...settings } = config; // eslint-disable-line @typescript-eslint/no-unused-vars
      const { error } = await supabase.from("profiles").update({ mortgage_settings: settings }).eq("id", profile.id);
      if (error) throw new Error(error.message);
      return "Saved as your defaults. New sheets will start with these settings.";
    });
  const onDelete = () =>
    run("delete", async () => {
      if (!window.confirm("Delete this sheet? Posts already made from it are kept.")) return;
      const { error } = await supabase.from("feature_sheets").delete().eq("id", sheet.id);
      if (error) throw new Error(error.message);
      router.push("/sheets");
    });

  const realtorId = config.realtor ? (realtors.find((r) => r.full_name === config.realtor!.full_name)?.id ?? "__current") : "";
  const where = [listing.address, listing.city].filter(Boolean).join(", ") || "Untitled listing";

  return (
    <div>
      {/* Desktop: a full-height workspace under the header. Controls scroll on their own; the sheet stays fixed. */}
      <div className="grid grid-cols-1 gap-6 lg:h-[calc(100svh-3.5rem-1px)] lg:grid-cols-[minmax(360px,460px)_1fr] lg:gap-8">
        {/* Controls */}
        <div className="order-2 min-w-0 space-y-3 pb-8 lg:order-1 lg:overflow-y-auto lg:overscroll-contain lg:py-5 lg:pl-4 lg:pr-3">
          {/* Title and actions */}
          <div className="space-y-3">
            <div className="min-w-0">
              <div className="flex flex-wrap gap-x-4 text-sm text-muted">
                <Link href="/sheets" className="hover:underline">
                  ← All sheets
                </Link>
                <Link href={`/listings/${listing.id}`} className="hover:underline">
                  Listing details
                </Link>
              </div>
              <h1 className="mt-1 truncate text-2xl font-semibold">{where}</h1>
              <p className="text-sm text-muted">
                Feature sheet ·{" "}
                <span className={saveState === "error" ? "text-red-700" : ""}>
                  {saveState === "saving" ? "Saving…" : saveState === "error" ? "Couldn't save. Check your connection." : "All changes saved"}
                </span>
              </p>
            </div>
            <div className="flex flex-wrap gap-2 [&>button]:flex-1">
              <button className="btn-secondary" onClick={onDuplicate} disabled={!!busy}>
                {busy === "duplicate" ? "Copying…" : "Duplicate"}
              </button>
              <button className="btn-secondary" onClick={onPdf} disabled={!!busy}>
                {busy === "pdf" ? "Preparing…" : "Download PDF"}
              </button>
              <button className="btn-primary" onClick={onCreatePost} disabled={!!busy || !listing.price}>
                Create post
              </button>
            </div>
          </div>
          {message && <div className={`rounded-lg p-3 text-sm ${message.ok ? "bg-green-50 text-green-900" : "bg-red-50 text-red-800"}`}>{message.text}</div>}
          {problems.length > 0 && (
            <ul className="list-disc space-y-0.5 rounded-lg border border-amber-200 bg-amber-50 py-3 pl-8 pr-3 text-sm text-amber-900">
              {problems.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          )}

          <Section title="Property" defaultOpen>
            <label className="block">
              <span className="label">Headline (optional)</span>
              <input
                className="input"
                maxLength={60}
                placeholder="e.g. Room to Grow in Stanley Park"
                value={sheet.headline}
                onChange={(e) => setSheet((s) => ({ ...s, headline: e.target.value }))}
              />
            </label>
            <div>
              <span className="label">Photo</span>
              <div className="grid grid-cols-5 gap-2">
                {listing.photos.map((p, i) => (
                  <button
                    key={p.path}
                    type="button"
                    onClick={() => setSheet((s) => ({ ...s, photo_index: i }))}
                    className={`relative aspect-square overflow-hidden rounded-md border-2 ${(sheet.photo_index ?? 0) === i ? "border-brand" : "border-transparent"}`}
                  >
                    <img src={p.url} alt="" className="h-full w-full object-cover" />
                    {isLowRes(p) && (
                      <span className="absolute inset-x-0 bottom-0 bg-amber-500/90 text-center text-[9px] font-semibold text-white">LOW-RES</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Money label="Purchase price" value={listing.price} onChange={(v) => setListingField("price", v)} />
              <Money label="Property tax (yearly)" value={listing.property_tax_yearly} onChange={(v) => setListingField("property_tax_yearly", v)} />
              <Money label={`${FEE_LABELS[config.feeLabel]} (monthly)`} value={listing.monthly_fee} onChange={(v) => setListingField("monthly_fee", v)} />
              <label className="block">
                <span className="label">Call the fee</span>
                <select className="input" value={config.feeLabel} onChange={(e) => setConfig({ feeLabel: e.target.value as FeeLabel })}>
                  {Object.entries(FEE_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </label>
              <Money label="Rental income (monthly)" value={listing.monthly_rent} onChange={(v) => setListingField("monthly_rent", v)} />
              <label className="block">
                <span className="label">Show rent as</span>
                <select className="input" value={config.rentDisplay} onChange={(e) => setConfig({ rentDisplay: e.target.value as RentDisplay })}>
                  {Object.entries(RENT_DISPLAYS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <p className="text-xs text-muted">Price and costs are saved to the listing, so they apply to its other sheets too.</p>
          </Section>

          <Section title="Rates & payments" defaultOpen>
            <RatesTable value={config.rates} onChange={(rates) => setConfig({ rates })} />
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="label">Rates as of</span>
                <input className="input" type="date" value={config.ratesAsOf ?? ""} onChange={(e) => setConfig({ ratesAsOf: e.target.value || null })} />
              </label>
              <label className="block">
                <span className="label">Payment frequency</span>
                <select className="input" value={config.frequency} onChange={(e) => setConfig({ frequency: e.target.value as PaymentFrequency })}>
                  {Object.entries(FREQUENCIES).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="space-y-2 text-sm">
              <Check label="Show the rate on the sheet" checked={config.showRate} onChange={(v) => setConfig({ showRate: v })} />
              <Check label="Show minimum household income" checked={config.showMinimumIncome} onChange={(v) => setConfig({ showMinimumIncome: v })} />
              <Check
                label="First-time buyer or new build (30-year insured)"
                checked={config.firstTimeOrNewBuild}
                onChange={(v) => setConfig({ firstTimeOrNewBuild: v })}
              />
            </div>
          </Section>

          <Section title={`Scenarios (${config.scenarios.length} of ${MAX_SCENARIOS})`} defaultOpen>
            <Scenarios value={config.scenarios} onChange={(scenarios) => setConfig({ scenarios })} />
          </Section>

          <Section title="Co-branded realtor" summary={config.realtor?.full_name ?? "None"}>
            <select
              className="input"
              value={realtorId}
              onChange={(e) => {
                if (e.target.value === "__current") return;
                const r = realtors.find((x) => x.id === e.target.value) ?? null;
                setConfig({ realtor: sheetConfigFrom(config, r).realtor });
              }}
            >
              <option value="">No realtor</option>
              {realtorId === "__current" && <option value="__current">{config.realtor!.full_name}</option>}
              {realtors.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.full_name}
                  {r.brokerage_name ? ` · ${r.brokerage_name}` : ""}
                </option>
              ))}
            </select>
            <Link href="/partners" className="text-xs underline">
              Manage partner realtors
            </Link>
          </Section>

          <Section title="Language" summary={{ en: "English", fr: "Français (QC)", bilingual: "Bilingual" }[sheet.language]}>
            <Chips
              label=""
              value={sheet.language}
              onChange={(language: Language) => setSheet((s) => ({ ...s, language }))}
              options={{ en: "English", fr: "Français (QC)", bilingual: "Bilingual" }}
            />
          </Section>

          <Section title="Design">
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="label">Footer colour</span>
                <select
                  className="input"
                  value={config.footer.color}
                  onChange={(e) => setConfig({ footer: { ...config.footer, color: e.target.value as "white" | "brand" } })}
                >
                  <option value="white">White</option>
                  <option value="brand">Brand colour</option>
                </select>
              </label>
              <label className="block">
                <span className="label">Footer shape</span>
                <select
                  className="input"
                  value={config.footer.shape}
                  onChange={(e) => setConfig({ footer: { ...config.footer, shape: e.target.value as FooterShape } })}
                >
                  {Object.entries(FOOTER_SHAPES).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="label">Photo</span>
                <select className="input" value={config.shading} onChange={(e) => setConfig({ shading: e.target.value as Shading })}>
                  {Object.entries(SHADINGS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="block">
              <span className="label">Footer line (optional)</span>
              <input
                className="input"
                maxLength={120}
                placeholder="e.g. Get pre-approved before you book a showing"
                value={config.footer.line}
                onChange={(e) => setConfig({ footer: { ...config.footer, line: e.target.value } })}
              />
            </label>
            <div className="space-y-2 text-sm">
              <Check
                label="Accent stripe on the footer"
                checked={config.footer.stripe}
                onChange={(v) => setConfig({ footer: { ...config.footer, stripe: v } })}
              />
              <Check label="QR codes to your and the realtor's websites" checked={config.showQr} onChange={(v) => setConfig({ showQr: v })} />
            </div>
            <p className="text-xs text-muted">
              Colours, logo and headshot come from{" "}
              <Link href="/settings" className="underline">
                Brand &amp; voice
              </Link>
              .
            </p>
          </Section>

          <Section title="Disclaimer">
            <textarea
              className="input min-h-16"
              maxLength={500}
              placeholder="Added after the standard disclaimer"
              value={config.disclaimer}
              onChange={(e) => setConfig({ disclaimer: e.target.value })}
            />
            <p className="text-xs text-muted">Every sheet always shows your brokerage and licence number, the rate&apos;s date and the standard disclaimer.</p>
          </Section>

          {posts.length > 0 && (
            <Section title={`Posts from this sheet (${posts.length})`} defaultOpen>
              <ul className="divide-y divide-border text-sm">
                {posts.map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-2 py-2">
                    <Link href={`/posts/${p.id}`} className="font-medium hover:underline">
                      {PLATFORM_SPECS[p.platform].label} {p.format === "carousel" ? "carousel" : "post"}
                    </Link>
                    <span className="text-muted">
                      {statusLabel(p as Post)} · <LocalTime iso={p.published_at ?? p.scheduled_at ?? p.created_at} />
                    </span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-sm">
            <button className="btn-ghost" onClick={onSaveDefaults} disabled={!!busy}>
              {busy === "defaults" ? "Saving…" : "Save these settings as my defaults"}
            </button>
            <button className="btn-ghost text-red-700" onClick={onDelete} disabled={!!busy}>
              Delete sheet
            </button>
          </div>
        </div>

        {/* Live preview: the sheet at its natural (letter) layout, as wide as the column. Where it's posted sets the final size. */}
        <div className="order-1 flex min-w-0 items-start justify-center lg:order-2 lg:h-full lg:overflow-y-auto lg:overscroll-contain lg:py-4">
          <div className="w-full" style={{ maxWidth: `calc(120svh * ${size.w / size.h})` }}>
            <ScaledSlide width={size.w} height={size.h} maxWidth={4000} className="rounded-xl border border-border bg-white shadow-sm">
              <SlideCanvas
                slide={slide}
                listing={listing}
                profile={profile}
                design={design}
                mortgage={null}
                language={sheet.language}
                postType="feature_sheet"
                width={size.w}
                height={size.h}
                index={0}
                total={1}
              />
            </ScaledSlide>
          </div>
        </div>
      </div>

      {/* Full-size render target for downloads */}
      {exportSize && (
        <div aria-hidden style={{ position: "fixed", left: -100_000, top: 0, pointerEvents: "none" }}>
          <SlideCanvas
            ref={exportRef}
            slide={slide}
            listing={listing}
            profile={profile}
            design={design}
            mortgage={null}
            language={sheet.language}
            postType="feature_sheet"
            width={exportSize.w}
            height={exportSize.h}
            index={0}
            total={1}
          />
        </div>
      )}


    </div>
  );
}

// ---------------------------------------------------------------------------
// Controls
// ---------------------------------------------------------------------------

function Section({ title, summary, defaultOpen = false, children }: { title: string; summary?: string; defaultOpen?: boolean; children: ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="card overflow-hidden">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="font-semibold">{title}</span>
        <span className="flex min-w-0 items-center gap-2 text-sm text-muted">
          {!open && summary && <span className="truncate">{summary}</span>}
          <span className={`text-lg leading-none transition ${open ? "rotate-180" : ""}`} aria-hidden>
            ⌄
          </span>
        </span>
      </button>
      {open && <div className="space-y-3 border-t border-border px-4 pb-4 pt-3">{children}</div>}
    </section>
  );
}

function Money({ label, value, onChange }: { label: string; value: number | null; onChange: (raw: string) => void }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      <input className="input" type="number" min={0} inputMode="decimal" value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}

function RatesTable({ value, onChange }: { value: MortgageSettings["rates"]; onChange: (v: MortgageSettings["rates"]) => void }) {
  const rows = [
    ["insured", "Insured (under 20% down)"],
    ["conventional", "Conventional (20%+ down)"],
  ] as const;
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="grid grid-cols-[1fr_5.5rem_5.5rem] gap-2 bg-black/[0.03] px-3 py-2 text-xs font-medium text-muted">
        <span>Rates (%)</span>
        <span>Fixed</span>
        <span>Variable</span>
      </div>
      {rows.map(([group, label]) => (
        <div key={group} className="grid grid-cols-[1fr_5.5rem_5.5rem] items-center gap-2 border-t border-border px-3 py-2 text-sm">
          <span>{label}</span>
          {(["fixed", "variable"] as const).map((type) => (
            <input
              key={type}
              className="input"
              type="number"
              step="0.01"
              min={0}
              max={25}
              inputMode="decimal"
              aria-label={`${label} ${type} rate`}
              value={value[group][type] ?? ""}
              onChange={(e) => {
                const n = e.target.value === "" ? null : Number(e.target.value);
                onChange({ ...value, [group]: { ...value[group], [type]: n != null && Number.isFinite(n) ? n : null } });
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function Scenarios({ value, onChange }: { value: ScenarioDefault[]; onChange: (v: ScenarioDefault[]) => void }) {
  const set = (i: number, patch: Partial<ScenarioDefault>) => onChange(value.map((s, j) => (j === i ? { ...s, ...patch } : s)));
  const move = (i: number, to: number) => {
    const next = [...value];
    [next[i], next[to]] = [next[to], next[i]];
    onChange(next);
  };
  return (
    <div className="space-y-2">
      {value.map((s, i) => (
        <div key={i} className="grid grid-cols-[auto_1fr_6.5rem_6rem_auto] items-center gap-2">
          <div className="flex flex-col">
            <button type="button" className="px-1 text-xs leading-none text-muted hover:text-foreground disabled:opacity-25" aria-label={`Move scenario ${i + 1} up`} disabled={i === 0} onClick={() => move(i, i - 1)}>
              ▲
            </button>
            <button type="button" className="px-1 text-xs leading-none text-muted hover:text-foreground disabled:opacity-25" aria-label={`Move scenario ${i + 1} down`} disabled={i === value.length - 1} onClick={() => move(i, i + 1)}>
              ▼
            </button>
          </div>
          <input
            className={`input ${parseDownPayment(s.down) ? "" : "border-red-400"}`}
            aria-label={`Scenario ${i + 1} down payment`}
            placeholder="20 or $60,000"
            value={s.down}
            onChange={(e) => set(i, { down: e.target.value })}
          />
          <select
            className="input"
            aria-label={`Scenario ${i + 1} amortization`}
            value={s.amortizationYears}
            onChange={(e) => set(i, { amortizationYears: Number(e.target.value) })}
          >
            {[15, 20, 25, 30].map((y) => (
              <option key={y} value={y}>
                {y} yrs
              </option>
            ))}
          </select>
          <select
            className="input"
            aria-label={`Scenario ${i + 1} rate`}
            value={s.rateType}
            onChange={(e) => set(i, { rateType: e.target.value as "fixed" | "variable" })}
          >
            <option value="fixed">Fixed</option>
            <option value="variable">Variable</option>
          </select>
          <button
            type="button"
            className="btn-ghost px-2 text-red-700"
            aria-label={`Remove scenario ${i + 1}`}
            disabled={value.length <= 1}
            onClick={() => onChange(value.filter((_, j) => j !== i))}
          >
            ✕
          </button>
        </div>
      ))}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted">Down payment as a percent (20) or dollars ($60,000). Below the legal minimum is raised automatically. Use ▲▼ to set the order on the sheet.</p>
        {value.length < MAX_SCENARIOS && (
          <button type="button" className="btn-secondary" onClick={() => onChange([...value, { down: "20", amortizationYears: 25, rateType: "fixed" }])}>
            + Add
          </button>
        )}
      </div>
    </div>
  );
}
