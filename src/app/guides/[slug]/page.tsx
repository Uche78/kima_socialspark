import { notFound } from "next/navigation";
import { GuideArticle } from "@/components/guides/GuideArticle";
import { GUIDES, guide as guideBySlug, plain } from "@/lib/guides";
import { COMPANY, SITE_NAME, SITE_URL } from "@/lib/site";

// Guides: one per file in src/lib/guides, built at build time; other slugs are 404s.
export const dynamicParams = false;

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps<"/guides/[slug]">) {
  const g = guideBySlug((await params).slug);
  if (!g) return {};
  const { title, description } = g.meta;
  const url = `/guides/${g.slug}`;
  return {
    // Guide titles carry the search phrase, so they're shown whole, without the " | SocialSpark" suffix.
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: { type: "article", title, description, url, publishedTime: g.published, modifiedTime: g.updated },
  };
}

export default async function GuidePage({ params }: PageProps<"/guides/[slug]">) {
  const g = guideBySlug((await params).slug);
  if (!g) notFound();

  const url = `${SITE_URL}/guides/${g.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: g.h1,
        description: g.meta.description,
        abstract: plain(g.answer),
        datePublished: g.published,
        dateModified: g.updated,
        inLanguage: "en-CA",
        mainEntityOfPage: url,
        url,
        keywords: [g.keyword, ...g.alsoAnswers].join(", "),
        about: { "@id": `${SITE_URL}/#app` },
        isPartOf: { "@id": `${SITE_URL}/#website` },
        author: { "@type": "Organization", name: `${SITE_NAME} team`, url: SITE_URL },
        publisher: { "@type": "Organization", name: COMPANY.name, url: COMPANY.url },
        image: `${SITE_URL}/opengraph-image`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Guides", item: `${SITE_URL}/guides` },
          { "@type": "ListItem", position: 3, name: g.h1, item: url },
        ],
      },
      { "@type": "FAQPage", "@id": `${url}#faq`, mainEntity: g.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    ],
  };

  return (
    <>
      <GuideArticle guide={g} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
