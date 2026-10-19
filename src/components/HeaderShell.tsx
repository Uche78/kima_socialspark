"use client";

import type { ReactNode } from "react";

/**
 * On the home page the header floats transparently over the hero photo;
 * everywhere else it's the regular white bar. Children style themselves
 * with `group-data-[overlay=true]:` variants.
 */
export function HeaderShell({ children }: { children: ReactNode }) {
  // The home hero used to be a full-bleed photo under a transparent header; it's now a light
  // panel, so the header is the regular white bar everywhere (overlay styles kept for reuse).
  const overlay = false;
  return (
    <header
      data-overlay={overlay}
      className={`group z-30 ${overlay ? "absolute inset-x-0 top-0 bg-transparent" : "relative border-b border-border bg-white"}`}
    >
      {children}
    </header>
  );
}
