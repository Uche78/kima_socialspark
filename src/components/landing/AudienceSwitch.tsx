import Link from "next/link";

const OPTIONS = [
  { key: "realtor", href: "/", label: "For realtors" },
  { key: "broker", href: "/mortgage-brokers", label: "For mortgage brokers" },
] as const;

/** Top of both landing pages: one product, two audiences. */
export function AudienceSwitch({ current, className = "" }: { current: (typeof OPTIONS)[number]["key"]; className?: string }) {
  return (
    <nav aria-label="Who SocialSpark is for" className={`flex w-fit rounded-full bg-white p-1 ring-1 ring-black/10 ${className}`}>
      {OPTIONS.map((o) =>
        o.key === current ? (
          <span key={o.key} aria-current="page" className="rounded-full bg-[#141414] px-4 py-2 text-sm font-medium text-white">
            {o.label}
          </span>
        ) : (
          <Link key={o.key} href={o.href} className="rounded-full px-4 py-2 text-sm font-medium text-[#141414]/70 transition hover:bg-black/5 hover:text-[#141414]">
            {o.label}
          </Link>
        ),
      )}
    </nav>
  );
}
