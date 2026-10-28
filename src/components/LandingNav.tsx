"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// Section links for signed-out visitors on the two audience landing pages; the anchors are the sections' heading ids.
// The guides show the realtor page's, linking back to it. Persona pages (/for/) get none: they're one-goal pages.
const SECTIONS: Record<string, { href: string; label: string }[]> = {
  "/": [
    { href: "#how-it-works", label: "How it works" },
    { href: "#whats-included", label: "Features" },
    { href: "#rules", label: "Rules" },
    { href: "#compare", label: "Compare" },
    { href: "#pricing-summary", label: "Pricing" },
    { href: "#faq", label: "FAQ" },
  ],
  "/mortgage-brokers": [
    { href: "#broker-how", label: "How it works" },
    { href: "#broker-features", label: "Features" },
    { href: "#broker-rules", label: "The math" },
    { href: "#broker-compare", label: "Compare" },
    { href: "#pricing-summary", label: "Pricing" },
    { href: "#broker-faq", label: "FAQ" },
  ],
};

/** The section links for a page: its own, or on the guides the realtor page's, linking back to it. */
function sectionsFor(pathname: string) {
  if (pathname === "/guides" || pathname.startsWith("/guides/")) return SECTIONS["/"].map((i) => ({ ...i, href: `/${i.href}` }));
  return SECTIONS[pathname];
}

/** True on the pages with section links. Below lg their Sign in moves into the ☰ menu. */
export function isLandingWithSections(pathname: string) {
  return !!sectionsFor(pathname);
}

/** Where Sign in goes: from the broker page, sign-up starts with Mortgage broker selected. */
export function loginHref(pathname: string) {
  return pathname === "/mortgage-brokers" ? "/login?role=mortgage_broker" : "/login";
}

/** The section links inline in the header (from lg). */
export function LandingNav({ linkClassName }: { linkClassName: string }) {
  const items = sectionsFor(usePathname());
  if (!items) return null;
  return (
    <>
      {items.map((i) => (
        <Link key={i.href} href={i.href} className={linkClassName}>
          {i.label}
        </Link>
      ))}
    </>
  );
}

/** Below lg: a ☰ menu with the section links and Sign in. "Try it for free" stays in the bar. */
export function LandingMenu() {
  const pathname = usePathname();
  const items = sectionsFor(pathname);
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

  if (!items) return null;
  return (
    <div ref={ref} className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="ml-1 flex h-11 w-11 items-center justify-center rounded-lg text-foreground transition hover:bg-black/5"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>
      {open && (
        <nav aria-label="Menu" className="card absolute inset-x-3 top-14 z-50 overflow-hidden py-1 shadow-xl">
          {items.map((i) => (
            <Link key={i.href} href={i.href} onClick={() => setOpen(false)} className="block px-5 py-3.5 text-base text-foreground hover:bg-black/5">
              {i.label}
            </Link>
          ))}
          <div className="mx-5 my-1 border-t border-border" />
          <Link href={loginHref(pathname)} onClick={() => setOpen(false)} className="block px-5 py-3.5 text-base font-semibold text-brand hover:bg-black/5">
            Sign in
          </Link>
        </nav>
      )}
    </div>
  );
}
