"use client";

import { usePathname, useRouter } from "next/navigation";

/**
 * Header call to action for signed-out visitors. On the home page it jumps to the listing link
 * field in the hero and focuses it; anywhere else it goes to the home page.
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
        const input = pathname === "/" ? document.querySelector<HTMLInputElement>('main input[type="url"]') : null;
        if (!input) return router.push("/");
        input.scrollIntoView({ behavior: "smooth", block: "center" });
        input.focus({ preventScroll: true });
      }}
    >
      Try it for free
    </button>
  );
}
