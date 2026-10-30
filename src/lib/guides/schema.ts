import { COMPANY, SITE_NAME, SITE_URL } from "../site";
import { headingId, plain, wordCount, type Guide } from "./index";

// The schema.org JSON-LD for a guide page, for search engines and AI answer engines. Everything in it is built from
// what the page shows, so a new guide gets it all without extra fields. The site-wide nodes are repeated here, so
// every "@id" reference resolves on the page itself.

/** A section headed "How to …" with a `steps` block is published as a HowTo. */
function howTos(g: Guide, url: string) {
  return g.sections.flatMap((s) => {
    if (!/^how to /i.test(s.heading)) return [];
    const steps = s.blocks.flatMap((b) => (b.type === "steps" ? b.items : []));
    if (!steps.length) return [];
    const id = headingId(s.heading);
    return [
      {
        "@type": "HowTo",
        "@id": `${url}#${id}`,
        name: plain(s.heading),
        step: steps.map((item, i) => ({ "@type": "HowToStep", position: i + 1, name: plain(item.title), text: plain(item.body), url: `${url}#${id}` })),
      },
    ];
  });
}

export function guideJsonLd(g: Guide) {
  const url = `${SITE_URL}/guides/${g.slug}`;
  const image = `${SITE_URL}/opengraph-image`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#org`,
        name: COMPANY.name,
        url: COMPANY.url,
        logo: { "@type": "ImageObject", url: `${SITE_URL}/logo-mark.png`, width: 512, height: 512 },
      },
      { "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: SITE_URL, name: SITE_NAME, inLanguage: "en-CA", publisher: { "@id": `${SITE_URL}/#org` } },
      {
        "@type": "WebPage",
        "@id": `${url}#page`,
        url,
        name: g.meta.title,
        description: g.meta.description,
        inLanguage: "en-CA",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        breadcrumb: { "@id": `${url}#breadcrumb` },
        primaryImageOfPage: { "@type": "ImageObject", url: image },
        datePublished: g.published,
        dateModified: g.updated,
        mainEntity: { "@id": `${url}#article` },
        // The parts to read aloud: the question and the short answer (data-speakable in GuideArticle).
        speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", "[data-speakable]"] },
      },
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: g.h1,
        description: g.meta.description,
        abstract: plain(g.answer),
        datePublished: g.published,
        dateModified: g.updated,
        inLanguage: "en-CA",
        mainEntityOfPage: { "@id": `${url}#page` },
        url,
        keywords: [g.keyword, ...g.alsoAnswers].join(", "),
        articleSection: g.cluster,
        wordCount: wordCount(g),
        isAccessibleForFree: true,
        about: { "@type": "Thing", name: g.keyword },
        mentions: { "@type": "SoftwareApplication", name: SITE_NAME, url: SITE_URL, applicationCategory: "BusinessApplication" },
        audience: { "@type": "BusinessAudience", audienceType: g.audience === "broker" ? "Mortgage brokers in Canada" : "Real estate agents in Canada" },
        spatialCoverage: { "@type": "Country", name: "Canada" },
        citation: g.sources.map((s) => ({ "@type": "CreativeWork", name: s.label, url: s.url })),
        isPartOf: { "@id": `${SITE_URL}/#website` },
        author: { "@type": "Organization", name: `${SITE_NAME} team`, url: SITE_URL },
        publisher: { "@id": `${SITE_URL}/#org` },
        image,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Guides", item: `${SITE_URL}/guides` },
          { "@type": "ListItem", position: 3, name: g.h1, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        isPartOf: { "@id": `${url}#page` },
        mainEntity: g.faq.map((f) => ({ "@type": "Question", name: plain(f.q), acceptedAnswer: { "@type": "Answer", text: plain(f.a) } })),
      },
      ...howTos(g, url),
    ],
  };
}
