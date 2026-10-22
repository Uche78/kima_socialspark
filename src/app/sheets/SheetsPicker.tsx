"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ScaledSlide } from "@/components/ScaledSlide";
import { SlideCanvas } from "@/components/SlideCanvas";
import { PDF_SIZE } from "@/components/useSheetExports";
import { LocalTime } from "@/components/LocalTime";
import { ImportForm } from "@/components/ImportForm";
import { designForSheet, sheetSlide, type FeatureSheet } from "@/lib/feature-sheet";
import { formatCurrency } from "@/lib/mortgage";
import { dataUrlBytes, jpegsToPdf } from "@/lib/pdf";
import { downloadBlob, renderSlide } from "@/lib/render";
import type { Language, Listing, Profile } from "@/lib/types";

type Sheet = FeatureSheet & { listing: Listing };

/** Language tag on each sheet, so English, French and bilingual versions are easy to tell apart. */
const LANGUAGE_TAGS: Record<Language, { label: string; className: string }> = {
  en: { label: "English", className: "bg-black/[0.06] text-foreground" },
  fr: { label: "Français", className: "bg-blue-100 text-blue-900" },
  bilingual: { label: "Bilingual", className: "bg-amber-100 text-amber-900" },
};

/** Sheet grid with live thumbnails. Tick sheets to download them together as one PDF. */
export function SheetsPicker({ sheets, profile, listings }: { sheets: Sheet[]; profile: Profile; listings: Pick<Listing, "id" | "address" | "city">[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [newFor, setNewFor] = useState(listings[0]?.id ?? "");
  const [adding, setAdding] = useState(false);
  const refs = useRef<Record<string, HTMLDivElement | null>>({});

  const toggle = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const chosen = sheets.filter((s) => selected.includes(s.id));

  async function download() {
    setBusy("pdf");
    setMessage(null);
    try {
      const pages = [];
      for (const s of chosen) {
        const node = refs.current[s.id];
        if (!node) throw new Error("A sheet isn't ready yet. Try again in a moment.");
        pages.push({ jpeg: dataUrlBytes(await renderSlide(node, PDF_SIZE.w, PDF_SIZE.h)), width: PDF_SIZE.w, height: PDF_SIZE.h });
      }
      downloadBlob(new Blob([jpegsToPdf(pages) as BlobPart], { type: "application/pdf" }), `feature-sheets-${new Date().toISOString().slice(0, 10)}.pdf`);
      setMessage({ ok: true, text: `Downloaded ${pages.length} sheet${pages.length === 1 ? "" : "s"} as one PDF (letter size).` });
    } catch (e) {
      setMessage({ ok: false, text: e instanceof Error ? e.message : "Couldn't make the PDF." });
    } finally {
      setBusy(null);
    }
  }

  async function build() {
    if (!newFor) return;
    setBusy("new");
    const res = await fetch("/api/sheets", { method: "POST", body: JSON.stringify({ listing_id: newFor }) });
    const json = await res.json().catch(() => ({}));
    if (json.id) return router.push(`/sheets/${json.id}`);
    setMessage({ ok: false, text: json.error ?? "Couldn't create the sheet." });
    setBusy(null);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Feature sheets</h1>
          <p className="mt-1 text-sm text-muted">Building sheets is free. Download them as PDFs, or create a post from any sheet.</p>
          <p className="mt-1 text-sm text-muted">Need another version of a sheet, with a different realtor or language? Open it and click Duplicate.</p>
        </div>
        <button className="btn-primary" onClick={() => setAdding((a) => !a)} aria-expanded={adding}>
          {adding ? "Close" : "+ New sheet"}
        </button>
      </div>

      {adding && (
        <div className="card space-y-5 p-5">
          <div>
            <h2 className="font-semibold">Paste a listing link</h2>
            <p className="mb-3 text-sm text-muted">From a brokerage or agent website. The sheet opens in the Sheet Builder.</p>
            <ImportForm />
          </div>
          {listings.length > 0 && (
            <div className="border-t border-border pt-5">
              <h2 className="font-semibold">Or choose a listing you&apos;ve already added</h2>
              <div className="mt-3 flex flex-wrap items-end gap-2">
                <label className="block min-w-0 flex-1 sm:max-w-md">
                  <span className="sr-only">Listing</span>
                  <select className="input w-full" value={newFor} onChange={(e) => setNewFor(e.target.value)}>
                    {listings.map((l) => <option key={l.id} value={l.id}>{[l.address, l.city].filter(Boolean).join(", ") || "Untitled listing"}</option>)}
                  </select>
                </label>
                <button className="btn-secondary" onClick={build} disabled={!!busy}>{busy === "new" ? "Creating…" : "Build sheet"}</button>
              </div>
            </div>
          )}
        </div>
      )}
      {message && <div className={`rounded-lg p-3 text-sm ${message.ok ? "bg-green-50 text-green-900" : "bg-red-50 text-red-800"}`}>{message.text}</div>}

      {sheets.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <button className="btn-ghost" onClick={() => setSelected(selected.length === sheets.length ? [] : sheets.map((s) => s.id))}>
            {selected.length === sheets.length ? "Clear selection" : "Select all"}
          </button>
          <button className="btn-secondary" onClick={download} disabled={!!busy || chosen.length === 0}>
            {busy === "pdf" ? "Preparing PDF…" : `Download ${chosen.length || ""} selected as one PDF`.replace("  ", " ")}
          </button>
        </div>
      )}

      {sheets.length === 0 ? (
        <div className="card p-8 text-center text-sm text-muted">
          No feature sheets yet. Click <strong>+ New sheet</strong> and paste a listing link to build your first one.
        </div>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {sheets.map((s) => {
            const on = selected.includes(s.id);
            return (
              <li key={s.id} className={`card overflow-hidden ${on ? "ring-2 ring-brand" : ""}`}>
                <Link href={`/sheets/${s.id}`} className="block bg-black/[0.03] p-3">
                  <ScaledSlide width={1080} height={1350} maxWidth={2000} initialWidth={320} className="rounded-md shadow-sm">
                    <SlideCanvas slide={sheetSlide(s)} listing={s.listing} profile={profile} design={designForSheet(profile, s.config)} mortgage={null} language={s.language} postType="feature_sheet" width={1080} height={1350} index={0} total={1} />
                  </ScaledSlide>
                </Link>
                <div className="flex items-start gap-3 p-3 text-sm">
                  <input type="checkbox" className="mt-1 h-4 w-4" aria-label="Select for PDF" checked={on} onChange={() => toggle(s.id)} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Link href={`/sheets/${s.id}`} className="min-w-0 truncate font-medium hover:underline">{s.listing.address || "Untitled listing"}</Link>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${LANGUAGE_TAGS[s.language].className}`}>{LANGUAGE_TAGS[s.language].label}</span>
                    </div>
                    <div className="text-muted">
                      {s.listing.price != null ? formatCurrency(s.listing.price) : "No price"} · {s.config.scenarios.length} scenarios
                      {s.config.realtor ? ` · with ${s.config.realtor.full_name}` : ""}
                    </div>
                    <div className="text-xs text-muted">Updated <LocalTime iso={s.updated_at} /></div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <div aria-hidden style={{ position: "fixed", left: -100_000, top: 0, pointerEvents: "none" }}>
        {chosen.map((s) => (
          <SlideCanvas
            key={s.id}
            ref={(el) => { refs.current[s.id] = el; }}
            slide={sheetSlide(s)}
            listing={s.listing}
            profile={profile}
            design={designForSheet(profile, s.config)}
            mortgage={null}
            language={s.language}
            postType="feature_sheet"
            width={PDF_SIZE.w}
            height={PDF_SIZE.h}
            index={0}
            total={1}
          />
        ))}
      </div>
    </div>
  );
}
