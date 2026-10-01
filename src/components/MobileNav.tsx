"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Item = { href: string; label: string };

/** ☰ menu for small screens; the full nav is shown inline from the md breakpoint. */
export function MobileNav({ items }: { items: Item[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on Escape or a tap outside; links close it themselves when tapped.
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

  if (!items.length) return null;
  return (
    <div ref={ref} className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="ml-1 flex h-11 w-11 items-center justify-center rounded-lg text-foreground transition hover:bg-black/5 group-data-[overlay=true]:text-[#f3f1ec] group-data-[overlay=true]:hover:bg-white/10"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>
      {open && (
        <nav aria-label="Menu" className="card absolute inset-x-3 top-14 z-50 overflow-hidden py-1 shadow-xl">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              onClick={() => setOpen(false)}
              className={`block px-5 py-3.5 text-base hover:bg-black/5 ${pathname === item.href ? "font-semibold text-brand" : "text-foreground"}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
