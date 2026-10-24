import Link from "next/link";
import { COMPANY, SALES_EMAIL, SITE_NAME } from "@/lib/site";
import { CookieSettingsButton } from "./ConsentBanner";
import { FooterShell } from "./FooterShell";

const COLUMNS: { title: string; links: { label: string; href: string; external?: boolean }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "For realtors", href: "/" },
      { label: "For mortgage brokers", href: "/mortgage-brokers" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign in", href: "/login" },
      { label: "Brand & voice", href: "/settings" },
      { label: "Partners", href: "/partners" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Kima", href: COMPANY.url, external: true },
      { label: "Contact us", href: `mailto:${SALES_EMAIL}`, external: true },
      { label: "Privacy policy", href: `${COMPANY.url}/privacy/`, external: true },
      { label: "Terms of service", href: `${COMPANY.url}/terms/`, external: true },
    ],
  },
];

/** Site footer: product, account and company links, plus the REALTOR® trademark notice the site's wording needs. */
export function Footer() {
  return (
    <FooterShell>
      <footer className="border-t border-border bg-[#eeebe4]/60">
        <div className="mx-auto w-full max-w-[1600px] px-4 py-12 lg:w-[90%] lg:px-0">
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
            <div className="col-span-2 max-w-sm md:col-span-1">
              <Link href="/" className="font-[family-name:var(--font-display)] text-xl font-semibold text-brand">
                Social<span className="text-accent">Spark</span>
              </Link>
              <p className="mt-3 text-sm leading-relaxed text-[#141414]/70">
                Branded social posts and mortgage feature sheets from a listing link, for Canadian realtors and mortgage brokers. In English, Québec French or both.
              </p>
            </div>
            {COLUMNS.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#141414]/60">{col.title}</h2>
                <ul className="mt-3 space-y-2 text-sm">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      {l.external ? (
                        <a href={l.href} className="text-[#141414]/80 hover:text-[#141414] hover:underline" {...(l.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}>
                          {l.label}
                        </a>
                      ) : (
                        <Link href={l.href} className="text-[#141414]/80 hover:text-[#141414] hover:underline">
                          {l.label}
                        </Link>
                      )}
                    </li>
                  ))}
                  {col.title === "Company" && (
                    <li>
                      <CookieSettingsButton />
                    </li>
                  )}
                </ul>
              </nav>
            ))}
          </div>

          <div className="mt-10 space-y-2 border-t border-black/10 pt-6 text-xs leading-relaxed text-[#141414]/60">
            <p>
              © {new Date().getFullYear()} {COMPANY.name} {SITE_NAME} is made in Canada.
            </p>
            <p>
              The trademarks REALTOR®, REALTORS® and the REALTOR® logo are controlled by The Canadian Real Estate Association (CREA) and identify real estate
              professionals who are members of CREA. {SITE_NAME} is not affiliated with or endorsed by CREA.
            </p>
          </div>
        </div>
      </footer>
    </FooterShell>
  );
}
