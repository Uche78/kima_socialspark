"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Header link to /login; hidden on the login page itself, where it would be redundant.
 * From the mortgage broker page, the welcome step after sign-up starts with Mortgage broker selected.
 */
export function LoginLink({ className, children }: { className: string; children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/login") return null;
  return (
    <Link href={pathname === "/mortgage-brokers" ? "/login?role=mortgage_broker" : "/login"} className={className}>
      {children}
    </Link>
  );
}
