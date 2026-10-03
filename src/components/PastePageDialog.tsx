"use client";

import { useEffect, useState } from "react";

type Captured = { content: string; isHtml: boolean; chars: number; images: number };

function summarize(content: string, isHtml: boolean): Captured {
  // Distinct photo links in the copied page (a rough count; the importer picks the listing's own).
  const images = isHtml ? new Set(content.match(/https?:[^"'\s<>()]+?\.(?:jpe?g|png|webp)/gi) ?? []).size : 0;
  return { content, isHtml, chars: content.length, images };
}

const isMac = () => typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

/**
 * Lets the user copy a listing page in their own browser and paste it here.
 * Captures the clipboard's HTML (which includes photo links), not just the text.
 */
export function PastePageDialog({
  sourceUrl,
  busy,
  error,
  onImport,
  onClose,
}: {
  sourceUrl: string;
  busy: boolean;
  error: string | null;
  onImport: (content: string) => void;
  onClose: () => void;
}) {
  const [captured, setCaptured] = useState<Captured | null>(null);
  // The dialog only renders after a click, so the platform is always known here.
  const [mac] = useState(isMac);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !busy && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [busy, onClose]);

  function onPaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const html = e.clipboardData.getData("text/html");
    const text = e.clipboardData.getData("text/plain");
    // Dev-tools "Copy outerHTML" arrives as plain text that is itself HTML.
    const content = html || text;
    if (!content.trim()) return;
    setCaptured(summarize(content, !!html || /^\s*</.test(text)));
  }

  const key = (k: string) => (
    <kbd className="rounded border border-border bg-black/5 px-1.5 py-0.5 font-mono text-xs">{mac ? `⌘${k}` : `Ctrl+${k}`}</kbd>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4" onClick={() => !busy && onClose()}>
      <div
        role="dialog"
        aria-label="Paste the listing page"
        className="max-h-[92svh] w-full max-w-xl overflow-y-auto rounded-t-2xl bg-white p-5 text-foreground shadow-2xl sm:rounded-2xl sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-brand">Paste the listing page</h2>
            <p className="mt-1 text-sm text-muted">For sites that block automatic retrieval, like REALTOR.ca. Copy the page in your browser and paste it here.</p>
          </div>
          <button className="btn-ghost -mr-2 -mt-1" onClick={onClose} disabled={busy} aria-label="Close">✕</button>
        </div>

        <ol className="mt-5 space-y-3 text-sm">
          {[
            <>Open the listing page in another tab{sourceUrl ? <> (<a href={sourceUrl} target="_blank" rel="noreferrer" className="text-brand underline">open it</a>)</> : null}. Scroll down so the whole page loads.</>,
            <>Click on a blank area of the page, then press {key("A")} to select everything.</>,
            <>Press {key("C")} to copy.</>,
            <>Come back here, click the box below and press {key("V")} to paste.</>,
            <>Click <strong>Import listing</strong>.</>,
          ].map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-semibold text-white">{i + 1}</span>
              <span className="pt-0.5">{step}</span>
            </li>
          ))}
        </ol>

        <textarea
          aria-label="Paste the copied page here"
          className={`mt-5 h-28 w-full resize-none rounded-xl border-2 border-dashed p-4 text-center text-sm outline-none transition focus:border-brand ${
            captured ? "border-green-500 bg-green-50 text-green-900" : "border-border bg-black/[0.02] text-muted"
          }`}
          readOnly
          value={
            captured
              ? `✓ Page captured (${Math.round(captured.chars / 1000)}k characters${captured.isHtml ? `, ${captured.images} image${captured.images === 1 ? "" : "s"} found` : ", text only"}). Paste again to replace it.`
              : `Click here and press ${mac ? "⌘V" : "Ctrl+V"} to paste the page`
          }
          onPaste={onPaste}
        />
        <p className="mt-2 text-xs text-muted">
          This brings in the listing details and the photos shown on the page. Photos tucked inside a gallery slider may not all come
          through. You can upload more after importing, or use the steps below.
        </p>
        <details className="mt-3 rounded-xl border border-border px-4 py-3 text-sm">
          <summary className="cursor-pointer font-medium">Get every photo (advanced, Chrome or Edge on a computer)</summary>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-muted">
            <li>On the listing page, right-click anywhere and choose <strong>Inspect</strong>. A developer panel opens.</li>
            <li>In the <strong>Elements</strong> tab, scroll to the very top and right-click the first line, <code className="rounded bg-black/5 px-1">&lt;html&gt;</code>.</li>
            <li>Choose <strong>Copy</strong> → <strong>Copy outerHTML</strong>.</li>
            <li>Come back here, click the box above and press {key("V")}. Then click <strong>Import listing</strong>.</li>
          </ol>
        </details>
        {captured && !captured.isHtml && (
          <p className="mt-2 text-xs text-amber-800">Only text was captured, so photos won&apos;t come through. You can upload them after importing.</p>
        )}
        {error && <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span />
          <button className="btn-primary h-11 whitespace-nowrap rounded-full px-6" disabled={!captured || busy} onClick={() => captured && onImport(captured.content)}>
            {busy ? "Importing…" : "Import listing"}
          </button>
        </div>
        {busy && <p className="mt-3 text-sm text-muted">Reading the page and collecting photos. This usually takes 15–40 seconds.</p>}
      </div>
    </div>
  );
}
