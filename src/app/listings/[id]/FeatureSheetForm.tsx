"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ScaledSlide } from "@/components/ScaledSlide";
import { SlideCanvas } from "@/components/SlideCanvas";
import { designForSheet, readSheetConfig, sheetSlide, type FeatureSheet } from "@/lib/feature-sheet";
import type { Listing, Profile } from "@/lib/types";

/** Brokers on a listing: its feature sheets, and a button to build a new one in the Sheet Builder (free). */
export function FeatureSheetForm({ listing, profile, sheets }: { listing: Listing; profile: Profile; sheets: FeatureSheet[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function build() {
    setBusy(true);
    setError(null);
    const res = await fetch("/api/sheets", { method: "POST", body: JSON.stringify({ listing_id: listing.id }) });
    const json = await res.json().catch(() => ({}));
    if (json.id) return router.push(`/sheets/${json.id}`);
    setError(json.error ?? "Couldn't create the sheet.");
    setBusy(false);
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">
        Build the sheet first: set the rates and scenarios and see it live. Building is free. When it&apos;s ready, download the PDF or create a post from it.
      </p>
      {sheets.length > 0 && (
        <ul className="grid gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {sheets.map((s) => (
            <li key={s.id}>
              <Link href={`/sheets/${s.id}`} className="block rounded-lg bg-black/[0.03] p-2 transition hover:bg-black/[0.06]">
                <ScaledSlide width={1080} height={1350} maxWidth={2000} initialWidth={200} className="rounded shadow-sm">
                  <SlideCanvas slide={sheetSlide(s)} listing={listing} profile={profile} design={designForSheet(profile, readSheetConfig(s.config))} mortgage={null} language={s.language} postType="feature_sheet" width={1080} height={1350} index={0} total={1} />
                </ScaledSlide>
                <span className="mt-1.5 block text-center text-xs font-medium">Open in builder</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
        <button className="btn-primary h-11 px-8" onClick={build} disabled={busy}>{busy ? "Opening…" : sheets.length ? "Build another sheet" : "Build feature sheet"}</button>
        {!listing.price && <span className="text-sm text-amber-800">Add the price in the builder to see payments.</span>}
        {error && <span className="text-sm text-red-700">{error}</span>}
      </div>
    </div>
  );
}
