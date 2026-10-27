import { GuideCard } from "@/components/guides/GuideArticle";
import { GUIDES } from "@/lib/guides";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const TITLE = "Social media guides for Canadian realtors";
const DESCRIPTION =
  "Practical, answer-first guides for Canadian realtors and mortgage brokers: listing posts, captions, open houses, Instagram, Facebook and LinkedIn, and the advertising rules that apply.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/guides" },
  openGraph: { title: `${TITLE} | ${SITE_NAME}`, description: DESCRIPTION, url: "/guides" },
};

const WRAP = "mx-auto w-full min-w-0 max-w-[1600px] px-4 lg:w-[90%] lg:px-0";

export default function GuidesIndex() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/guides#page`,
    url: `${SITE_URL}/guides`,
    name: TITLE,
    description: DESCRIPTION,
    inLanguage: "en-CA",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    hasPart: GUIDES.map((g) => ({ "@type": "Article", headline: g.h1, url: `${SITE_URL}/guides/${g.slug}`, dateModified: g.updated })),
  };

  return (
    <div className={`${WRAP} pb-24 pt-10 sm:pb-32 sm:pt-14`}>
      <div className="max-w-3xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#141414]/70 sm:text-xs">Guides</p>
        <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-medium leading-[1.1] tracking-[-0.02em] text-[#000103]/90 sm:text-5xl">{TITLE}</h1>
        <p className="mt-5 text-lg leading-relaxed text-[#141414]/70">
          Each guide answers one question first, then shows the how: what to write, what to post and which rules apply in Canada. Written by the team behind {SITE_NAME}.
        </p>
      </div>
      {/* One grid, newest first; each card names its cluster. */}
      <ul className="mt-12 grid gap-5 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
        {GUIDES.map((g) => (
          <li key={g.slug}>
            <GuideCard guide={g} />
          </li>
        ))}
      </ul>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </div>
  );
}
