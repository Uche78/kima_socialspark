import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import type { Rich } from "@/lib/guides";

const LINK = "font-medium text-[#0f2a44] underline decoration-[#d4a24c] decoration-2 underline-offset-4 hover:decoration-[#0f2a44]";

/** Guide text: [anchor](href) links (internal ones through next/link) and **bold**. Nothing else is parsed. */
export function RichText({ text }: { text: Rich }) {
  const out: ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*/g;
  let last = 0;
  for (const m of text.matchAll(re)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const [, anchor, href, bold] = m;
    if (bold) out.push(<strong key={m.index} className="font-semibold text-[#141414]">{bold}</strong>);
    else if (href.startsWith("/") || href.startsWith("#"))
      out.push(<Link key={m.index} href={href} className={LINK}>{anchor}</Link>);
    else
      out.push(
        <a key={m.index} href={href} className={LINK} target="_blank" rel="noopener">
          {anchor}
        </a>,
      );
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <Fragment>{out}</Fragment>;
}
