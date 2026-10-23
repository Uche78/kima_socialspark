"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Hides the footer in the Sheet Builder, a full-screen workspace with its own scrolling panels. */
export function FooterShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (/^\/sheets\/[^/]+$/.test(pathname)) return null;
  return children;
}
