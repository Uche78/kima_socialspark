"use client";

import Link from "next/link";

export function PaywallDialog({ kind, message, onClose }: { kind: "signup" | "upgrade"; message: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="card w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-brand">
          {kind === "signup" ? "Keep creating with a free account" : "Upgrade to SocialSpark Pro"}
        </h2>
        <p className="mt-2 text-sm text-muted">{message}</p>
        <div className="mt-6 flex justify-end gap-2">
          <button className="btn-ghost" onClick={onClose}>Not now</button>
          {kind === "signup" ? (
            <Link href="/login" className="btn-primary">Create free account</Link>
          ) : (
            <button className="btn-primary" disabled title="Billing is coming soon">Upgrade (coming soon)</button>
          )}
        </div>
      </div>
    </div>
  );
}
