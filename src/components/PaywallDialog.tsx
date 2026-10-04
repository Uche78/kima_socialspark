"use client";

import Link from "next/link";

/** Shown when an allowance runs out. kind: guest → sign up; free → choose a plan; limit → paid plan exhausted. */
export function PaywallDialog({ kind, message, onClose }: { kind: "signup" | "upgrade" | "limit"; message: string; onClose: () => void }) {
  const title = kind === "signup" ? "Keep creating with a free account" : kind === "upgrade" ? "Choose a plan to keep creating" : "You've reached this month's allowance";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="card w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-brand">{title}</h2>
        <p className="mt-2 text-sm text-muted">{message}</p>
        <div className="mt-6 flex justify-end gap-2">
          <button className="btn-ghost" onClick={onClose}>Not now</button>
          {kind === "signup" ? (
            <Link href="/login" className="btn-primary rounded-full">Create free account</Link>
          ) : (
            <Link href="/pricing" className="btn-primary rounded-full">{kind === "limit" ? "See plans" : "Choose a plan"}</Link>
          )}
        </div>
      </div>
    </div>
  );
}
