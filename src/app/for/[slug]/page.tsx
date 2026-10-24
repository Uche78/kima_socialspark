import { notFound } from "next/navigation";
import { ListicleLanding } from "@/components/landing/ListicleLanding";
import { PersonaLanding } from "@/components/landing/PersonaLanding";
import { PERSONA_PAGES, personaPage, type PersonaPage as Page } from "@/lib/persona-pages";
import { COMPANY, SITE_NAME, SITE_URL } from "@/lib/site";

// Persona landing pages: one per entry in src/lib/persona-pages.ts, built at build time; other slugs are 404s.
export const dynamicParams = false;

export function generateStaticParams() {
  return PERSONA_PAGES.map((p) => ({ slug: p.slug }));
}

const LANG = { en: "en-CA", fr: "fr-CA" } as const;

/** The same persona's page in the other language, if there is one (linked with hreflang). */
function twin(page: Page) {
  return PERSONA_PAGES.find((p) => p.persona === page.persona && (p.locale ?? "en") !== (page.locale ?? "en"));
}

export async function generateMetadata({ params }: PageProps<"/for/[slug]">) {
  const page = personaPage((await params).slug);
  if (!page) return {};
  const { title, description } = page.meta;
  const url = `/for/${page.slug}`;
  const other = twin(page);
  const languages = other ? { [LANG[page.locale ?? "en"]]: url, [LANG[other.locale ?? "en"]]: `/for/${other.slug}` } : undefined;
  return {
    title,
    description,
    alternates: { canonical: url, languages },
    openGraph: { title: `${title} | ${SITE_NAME}`, description, url, locale: LANG[page.locale ?? "en"].replace("-", "_") },
  };
}

export default async function PersonaPage({ params }: PageProps<"/for/[slug]">) {
  const page = personaPage((await params).slug);
  if (!page) notFound();

  const url = `${SITE_URL}/for/${page.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#page`,
        url,
        name: page.meta.title,
        description: page.meta.description,
        inLanguage: LANG[page.locale ?? "en"],
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#app` },
        audience: { "@type": "BusinessAudience", audienceType: page.reader },
        publisher: { "@type": "Organization", name: COMPANY.name, url: COMPANY.url },
      },
      ...(page.layout === "listicle"
        ? [{ "@type": "ItemList", "@id": `${url}#reasons`, name: page.hero.headline, itemListElement: page.reasons.map((r, i) => ({ "@type": "ListItem", position: i + 1, name: r.title, description: r.body })) }]
        : []),
      { "@type": "FAQPage", "@id": `${url}#faq`, mainEntity: page.objections.items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    ],
  };

  return (
    <>
      {/* The site layout is en-CA; a French page marks its own content as fr-CA. */}
      <div lang={LANG[page.locale ?? "en"]}>{page.layout === "listicle" ? <ListicleLanding page={page} /> : <PersonaLanding page={page} />}</div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
