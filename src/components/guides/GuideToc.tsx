"use client";

import { useEffect, useState } from "react";

export type TocItem = { id: string; label: string };

/**
 * The guide's "On this page" list: a dot per section on a thin rail, with the section in view marked in gold.
 * Without JavaScript it's a plain list of anchor links.
 */
export function GuideToc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const headings = items.map((i) => document.getElementById(i.id)).filter((el): el is HTMLElement => !!el);
    // The section you're reading is the last one whose heading has passed the top third of the screen.
    // Checked on scroll (once per frame), so jumps and fast scrolling land on the right item too.
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight / 3;
      const passed = headings.filter((h) => h.getBoundingClientRect().top <= line);
      setActive((passed.at(-1) ?? headings[0])?.id);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [items]);

  return (
    <ol className="relative border-l border-black/10">
      {items.map((item) => {
        const on = item.id === active;
        return (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={on ? "location" : undefined}
              onClick={() => setActive(item.id)}
              className={`relative -ml-px flex border-l-2 py-1.5 pl-5 text-sm leading-snug transition ${on ? "border-[#d4a24c] font-medium text-[#141414]" : "border-transparent text-[#141414]/65 hover:border-black/25 hover:text-[#141414]"}`}
            >
              <span aria-hidden className={`absolute left-2 top-[0.85em] h-1.5 w-1.5 rounded-full ${on ? "bg-[#d4a24c]" : "bg-[#141414]/25"}`} />
              {item.label}
            </a>
          </li>
        );
      })}
    </ol>
  );
}
