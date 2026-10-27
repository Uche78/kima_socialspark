import type { MetadataRoute } from "next";
import { GUIDES } from "@/lib/guides";
import { PERSONA_PAGES } from "@/lib/persona-pages";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/mortgage-brokers`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/guides`, lastModified: GUIDES[0] ? new Date(GUIDES[0].updated) : now, changeFrequency: "daily", priority: 0.7 },
    // A guide's lastModified is its real update date, so search engines recrawl it when the content changes.
    ...GUIDES.map((g) => ({ url: `${SITE_URL}/guides/${g.slug}`, lastModified: new Date(g.updated), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...PERSONA_PAGES.map((p) => {
      // A persona's French and English pages point at each other (hreflang).
      const twin = PERSONA_PAGES.find((o) => o.persona === p.persona && (o.locale ?? "en") !== (p.locale ?? "en"));
      const lang = (q: typeof p) => ((q.locale ?? "en") === "fr" ? "fr-CA" : "en-CA");
      return {
        url: `${SITE_URL}/for/${p.slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.7,
        ...(twin ? { alternates: { languages: { [lang(p)]: `${SITE_URL}/for/${p.slug}`, [lang(twin)]: `${SITE_URL}/for/${twin.slug}` } } } : {}),
      };
    }),
  ];
}
