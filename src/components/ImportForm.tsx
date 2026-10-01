"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

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

  async function createManual() {
    setBusy(true);
    try {
      await ensureSession();
      router.push(`/listings/new${url ? `?source_url=${encodeURIComponent(url.trim())}` : ""}`);
      router.refresh(); // the header is in the layout; refresh it so it reflects the new guest session
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setBusy(false);
    }
  }

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
          className="h-14 w-full rounded-full sm:flex-1 border border-white/25 bg-white/10 px-6 text-base text-[#f3f1ec] placeholder:text-[#f3f1ec]/50 outline-none backdrop-blur-sm transition focus:border-white/60 focus:bg-white/15 disabled:opacity-60"
          type="url"
          required
          aria-label="Listing link"
          placeholder="Paste a listing link from a brokerage or agent's website"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={busy}
        />
        <button
          className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[#f3f1ec] px-8 text-base font-medium text-[#141414] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
          disabled={busy}
        >
          {busy ? "Retrieving listing…" : <>Get listing <span aria-hidden>→</span></>}
        </button>
      </form>
      {busy && <p className="mt-3 text-sm text-[#f3f1ec]/70">Reading the page and collecting photos. This usually takes 15–40 seconds.</p>}
      {realtorCa && !busy && (
        <div role="status" className="mt-3 rounded-2xl border border-amber-200/40 bg-black/50 p-3 text-sm text-[#f3f1ec] backdrop-blur-sm">
          REALTOR.ca doesn&apos;t allow automatic retrieval yet. Try the same listing on the brokerage&apos;s or agent&apos;s website, or{" "}
          <button type="button" className="font-semibold underline underline-offset-2" onClick={createManual}>
            enter it manually
          </button>
          .
        </div>
      )}
      {error && (
        <div className="mt-3 rounded-2xl border border-red-300/40 bg-red-950/60 p-3 text-sm text-red-100 backdrop-blur-sm">
          {error}
          {offerManual && (
            <button type="button" className="ml-2 font-semibold underline" onClick={createManual} disabled={busy}>
              Enter details manually
            </button>
          )}
        </div>
      )}
      <button type="button" className="mt-2 py-2.5 text-sm text-[#f3f1ec]/70 underline underline-offset-4 hover:text-[#f3f1ec]" onClick={createManual} disabled={busy}>
        No link? Enter a listing manually
      </button>
    </div>
  );
}
