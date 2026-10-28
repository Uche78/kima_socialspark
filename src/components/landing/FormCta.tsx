"use client";

/** A call to action in the middle of a landing page: scrolls to the page's first listing link field and focuses it. */
export function FormCta({ children, tone = "dark" }: { children: React.ReactNode; tone?: "dark" | "light" }) {
  return (
    <button
      type="button"
      className={`inline-flex h-12 items-center justify-center rounded-full px-7 font-medium transition ${
        tone === "dark" ? "bg-[#141414] text-white hover:bg-black" : "bg-white text-[#141414] hover:bg-white/90"
      }`}
      onClick={() => {
        const input = document.querySelector<HTMLInputElement>('main input[type="url"]');
        if (!input) return;
        input.scrollIntoView({ behavior: "smooth", block: "center" });
        input.focus({ preventScroll: true });
      }}
    >
      {children} →
    </button>
  );
}
