import { notFound } from "next/navigation";
import { ListicleLanding } from "@/components/landing/ListicleLanding";
import { PersonaLanding } from "@/components/landing/PersonaLanding";
import { PERSONA_PAGES, personaPage } from "@/lib/persona-pages";
import { COMPANY, SITE_NAME, SITE_URL } from "@/lib/site";

// Persona landing pages: one per entry in src/lib/persona-pages.ts, built at build time; other slugs are 404s.
export const dynamicParams = false;

export function generateStaticParams() {
  return PERSONA_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/for/[slug]">) {
  const page = personaPage((await params).slug);
  if (!page) return {};
  const { title, description } = page.meta;
  const url = `/for/${page.slug}`;
  return { title, description, alternates: { canonical: url }, openGraph: { title: `${title} | ${SITE_NAME}`, description, url } };
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
        inLanguage: "en-CA",
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
      {page.layout === "listicle" ? <ListicleLanding page={page} /> : <PersonaLanding page={page} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
