"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { isLandingWithSections, loginHref } from "./LandingNav";

/**
 * Header link to /login; hidden on the login page itself, where it would be redundant.
 * From the mortgage broker page, the welcome step after sign-up starts with Mortgage broker selected.
 * `signedOut`: hidden on the persona landing pages (/for/<slug>), where the only call to action is the
 * listing form. Guests still see it there ("Save your work"), since it turns their trial into an account.
 * On the pages with section links it moves into the ☰ menu below lg (LandingMenu), for signed-out visitors.
 */
export function LoginLink({ className, children, signedOut = false }: { className: string; children: ReactNode; signedOut?: boolean }) {
  const pathname = usePathname();
  if (pathname === "/login" || (signedOut && pathname.startsWith("/for/"))) return null;
  const inMenu = signedOut && isLandingWithSections(pathname);
  return (
    <Link href={loginHref(pathname)} className={inMenu ? `${className} max-lg:hidden` : className}>
      {children}
    </Link>
  );
}
