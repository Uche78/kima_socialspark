import { FAQ } from "@/lib/faq";
import { FREE_LIMITS, PAID_PLANS } from "@/lib/plans";
import { COMPANY, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

const price = (p: string) => p.replace(/[^0-9.]/g, "");

/**
 * schema.org JSON-LD for search engines and AI answer engines: who makes SocialSpark,
 * what it is and costs, and the FAQ shown on the page.
 */
export function HomeStructuredData() {
  const org = { "@type": "Organization", "@id": `${SITE_URL}/#org`, name: COMPANY.name, url: COMPANY.url, email: COMPANY.email };
  const monthly = (name: string, amount: string, description: string) => ({
    "@type": "Offer",
    name,
    description,
    price: price(amount),
    priceCurrency: "CAD",
    priceSpecification: { "@type": "UnitPriceSpecification", price: price(amount), priceCurrency: "CAD", billingDuration: "P1M", valueAddedTaxIncluded: false },
    url: `${SITE_URL}/pricing`,
  });
  const graph = [
    org,
    { "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: SITE_URL, name: SITE_NAME, description: SITE_DESCRIPTION, inLanguage: "en-CA", publisher: { "@id": `${SITE_URL}/#org` } },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#app`,
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "Real estate marketing",
      operatingSystem: "Web browser",
      inLanguage: ["en-CA", "fr-CA"],
      areaServed: { "@type": "Country", name: "Canada" },
      audience: { "@type": "BusinessAudience", audienceType: "Real estate agents and brokerages" },
      featureList: [
        "Imports listing details and photos from a listing link",
        "Instagram, Facebook and LinkedIn posts, single image or carousel",
        "Just Listed, Open House, Price Reduced, Coming Soon, Sold and Featured Property posts",
        "English, Québec French and bilingual captions",
        "Agent branding on every image",
        "Publish now or schedule",
      ],
      publisher: { "@id": `${SITE_URL}/#org` },
      offers: [
        { "@type": "Offer", name: "Free", price: "0", priceCurrency: "CAD", description: `${FREE_LIMITS.registered} posts to try, no credit card`, url: `${SITE_URL}/pricing` },
        monthly(PAID_PLANS.starter.name, PAID_PLANS.starter.price, `${PAID_PLANS.starter.posts} new posts and ${PAID_PLANS.starter.regens} regenerations a month`),
        monthly(PAID_PLANS.professional.name, PAID_PLANS.professional.price, `${PAID_PLANS.professional.posts} new posts and ${PAID_PLANS.professional.regens} regenerations a month`),
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];
  return (
    <script
      type="application/ld+json"
      // Escape "<" so no string can close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c") }}
    />
  );
}
