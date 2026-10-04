"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Props = { name: string | null; email: string | null; avatarUrl: string | null };

function initials(name: string | null, email: string | null) {
  const source = name?.trim() || email?.split("@")[0] || "";
  // Use only the parts with letters, so "maya.chen.2024@…" gives "MC", not "M2".
  const parts = source.split(/[\s._+-]+/).map((p) => p.replace(/[^\p{L}]/gu, "")).filter(Boolean);
  const letters = parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : (parts[0] ?? "").slice(0, 2);
  return letters.toUpperCase() || "?";
}

/** Avatar button in the header with the signed-in user's menu. */
export function AccountMenu({ name, email, avatarUrl }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  async function signOut() {
    await createClient().auth.signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  const avatar = (size: string) =>
    avatarUrl ? (
      <img src={avatarUrl} alt="" className={`${size} rounded-full object-cover`} />
    ) : (
      <span className={`${size} flex items-center justify-center rounded-full bg-brand text-xs font-semibold text-white`}>{initials(name, email)}</span>
    );

  return (
    <div ref={ref} className="relative ml-2">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Account menu"
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center rounded-full ring-offset-2 transition hover:ring-2 hover:ring-brand/30 focus-visible:ring-2 focus-visible:ring-brand"
      >
        {avatar("h-10 w-10")}
      </button>
      {open && (
        <div role="menu" className="card absolute right-0 top-11 z-50 w-64 overflow-hidden py-1 shadow-lg">
          <div className="flex items-center gap-3 border-b border-border px-4 py-3">
            {avatar("h-10 w-10 shrink-0")}
            <div className="min-w-0">
              {name && <div className="truncate text-sm font-semibold">{name}</div>}
              <div className="truncate text-xs text-muted">{email}</div>
            </div>
          </div>
          <Link role="menuitem" href="/settings" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm hover:bg-black/5">Brand &amp; voice</Link>
          <Link role="menuitem" href="/settings#accounts" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm hover:bg-black/5">Connected accounts</Link>
          <Link role="menuitem" href="/settings#billing" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm hover:bg-black/5">Plan &amp; billing</Link>
          <button role="menuitem" onClick={signOut} className="block w-full border-t border-border px-4 py-2 text-left text-sm text-red-700 hover:bg-black/5">
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
