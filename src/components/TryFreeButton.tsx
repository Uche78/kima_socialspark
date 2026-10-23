"use client";

import { usePathname, useRouter } from "next/navigation";

/**
 * Header call to action for signed-out visitors. On the landing pages (including the persona pages at
 * /for/<slug>) it jumps to the listing link field in the hero and focuses it; anywhere else it goes home.
 */
export function TryFreeButton({ className }: { className: string }) {
  const pathname = usePathname();
  const router = useRouter();
  if (pathname === "/login") return null;
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        const landing = pathname === "/" || pathname === "/mortgage-brokers" || pathname.startsWith("/for/");
        const input = landing ? document.querySelector<HTMLInputElement>('main input[type="url"]') : null;
        if (!input) return router.push("/");
        input.scrollIntoView({ behavior: "smooth", block: "center" });
        input.focus({ preventScroll: true });
      }}
    >
      Try it for free
    </button>
  );
}
