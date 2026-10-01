"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Header link to /login; hidden on the login page itself, where it would be redundant. */
export function LoginLink({ className, children }: { className: string; children: ReactNode }) {
  if (usePathname() === "/login") return null;
  return (
    <Link href="/login" className={className}>
      {children}
    </Link>
  );
}
