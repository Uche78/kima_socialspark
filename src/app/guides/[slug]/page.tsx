import { notFound } from "next/navigation";
import { GuideArticle } from "@/components/guides/GuideArticle";
import { GUIDES, guide as guideBySlug } from "@/lib/guides";
import { guideJsonLd } from "@/lib/guides/schema";

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

  return (
    <>
      <GuideArticle guide={g} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(guideJsonLd(g)).replace(/</g, "\\u003c") }} />
    </>
  );
}
