"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PastePageDialog } from "./PastePageDialog";

async function ensureSession() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  if (data.user) return;
  const { error } = await supabase.auth.signInAnonymously();
  if (error) throw new Error("Couldn't start a guest session. " + error.message);
}

/** REALTOR.ca blocks automated retrieval (until CREA DDF® access is in place). */
function isRealtorCa(raw: string) {
  try {
    const host = new URL(raw.trim()).hostname.toLowerCase();
    return host === "realtor.ca" || host.endsWith(".realtor.ca");
  } catch {
    return false;
  }
}

export function ImportForm() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offerManual, setOfferManual] = useState(false);
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasteBusy, setPasteBusy] = useState(false);
  const [pasteError, setPasteError] = useState<string | null>(null);

  /** Imports a page the user copied in their own browser. */
  async function importPasted(content: string) {
    setPasteError(null);
    setPasteBusy(true);
    try {
      await ensureSession();
      const res = await fetch("/api/listings/import", {
        method: "POST",
        body: JSON.stringify({ html: content, url: url.trim() || undefined }),
      });
      const json = await res.json();
      if (!res.ok) {
        setPasteError(json.error ?? "Couldn't read that page.");
        setPasteBusy(false);
        return;
      }
      router.push(`/listings/${json.id}`);
      router.refresh();
    } catch (e) {
      setPasteError(e instanceof Error ? e.message : "Something went wrong.");
      setPasteBusy(false);
    }
  }

  const pasteLink = (label: string) => (
    <button type="button" className="font-semibold underline underline-offset-2" onClick={() => setPasteOpen(true)}>
      {label}
    </button>
  );

  const realtorCa = isRealtorCa(url);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOfferManual(false);
    if (realtorCa) return; // explained inline below the field; nothing to retrieve
    setBusy(true);
    try {
      await ensureSession();
      const res = await fetch("/api/listings/import", { method: "POST", body: JSON.stringify({ url: url.trim() }) });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Couldn't retrieve that listing.");
        setOfferManual(!!json.manualEntry);
        setBusy(false);
        return;
      }
      router.push(`/listings/${json.id}`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setBusy(false);
    }
  }

  // Styled to sit on the dark home-page hero photo.
  return (
    <div>
      <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
        <input
          className="h-14 w-full rounded-full border border-black/15 bg-white px-6 text-base text-[#141414] placeholder:text-[#141414]/45 outline-none transition focus:border-[#141414]/50 disabled:opacity-60 sm:flex-1"
          type="url"
          required
          aria-label="Listing link"
          placeholder="Paste a listing link from a brokerage or agent's website"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={busy}
        />
        <button
          className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[#141414] px-8 text-base font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
          disabled={busy}
        >
          {busy ? "Retrieving listing…" : <>Get listing <span aria-hidden>→</span></>}
        </button>
      </form>
      {busy && <p className="mt-3 text-sm text-[#141414]/65">Reading the page and collecting photos. This usually takes 15–40 seconds.</p>}
      {realtorCa && !busy && (
        <div role="status" className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          REALTOR.ca doesn&apos;t allow automatic retrieval yet. {pasteLink("Copy and paste the page instead")}, or try the same listing on
          the brokerage&apos;s or agent&apos;s website.
        </div>
      )}
      {error && (
        <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {error}
          {offerManual && (
            <>
              {" "}
              {pasteLink("Copy and paste the page instead")}.
            </>
          )}
        </div>
      )}
      <div className="mt-2 flex flex-wrap gap-x-6">
        <button type="button" className="hidden py-2.5 text-sm text-[#141414]/65 underline underline-offset-4 hover:text-[#141414] sm:inline-block" onClick={() => setPasteOpen(true)} disabled={busy}>
          Site blocked? Copy and paste the page
        </button>
      </div>
      {pasteOpen && (
        <PastePageDialog
          sourceUrl={url.trim()}
          busy={pasteBusy}
          error={pasteError}
          onImport={importPasted}
          onClose={() => {
            setPasteOpen(false);
            setPasteError(null);
          }}
        />
      )}
    </div>
  );
}
