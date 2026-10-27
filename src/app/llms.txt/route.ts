import { FAQ } from "@/lib/faq";
import { GUIDES } from "@/lib/guides";
import { BROKER_FAQ } from "@/lib/faq-brokers";
import { PERSONA_PAGES } from "@/lib/persona-pages";
import { FREE_LIMITS, PAID_PLAN_IDS, PAID_PLANS } from "@/lib/plans";
import { COMPANY, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

// llms.txt (llmstxt.org): a plain-language summary for AI assistants and answer engines.
export const dynamic = "force-static";

export function GET() {
  const body = `# ${SITE_NAME}

> ${SITE_DESCRIPTION}

${SITE_NAME} is made by [${COMPANY.name}](${COMPANY.url}), a Canadian company.

## What it does
- Paste a listing link from a brokerage or agent website on the [home page](${SITE_URL}/); ${SITE_NAME} imports the price, details, features and photos.
- Choose a platform (Instagram, Facebook Pages or LinkedIn), a format (single image or carousel) and a post type (Just Listed, Open House, Price Reduced, Coming Soon, Sold or Featured Property).
- Get branded images with the agent's name and brokerage, plus a caption written in the agent's voice, in English, Québec French or bilingual.
- Edit, download, publish now or schedule. Nothing is posted without the agent's action.
- REALTOR.ca blocks automated tools; agents can copy and paste the listing page instead.

## [For mortgage brokers](${SITE_URL}/mortgage-brokers)
Mortgage brokers turn a listing link into a branded mortgage feature sheet: monthly payments at up to four down payments (with CMHC premiums, property tax and condo fees), their own rates with an "as of" date, their licence number and an optional co-branded realtor. Sheets can be posted, scheduled, downloaded as Stories or printed as letter-size PDFs.

${BROKER_FAQ.map((f) => `### ${f.q}\n${f.a}`).join("\n\n")}

## [Pricing](${SITE_URL}/pricing) (CAD, plus applicable tax)
- Free: ${FREE_LIMITS.registered} posts in total, one-time, no credit card.
${PAID_PLAN_IDS.map((id) => {
  const p = PAID_PLANS[id];
  return `- ${p.name}: ${p.price}/month, or ${p.yearly}/year (two months free): ${p.posts} new posts and ${p.regens} regenerations a month.`;
}).join("\n")}
- Teams and brokerages: seats, one invoice and a shared brand kit; contact us from the pricing page.
- A single image or a full carousel counts as one post. Edits, downloads and publishing are free, and mortgage feature sheets, PDFs and Stories are free to build. Allowances reset every month, on yearly plans too. Cancel anytime.

## Frequently asked questions
${FAQ.map((f) => `### ${f.q}\n${f.a}`).join("\n\n")}

## Links
- [Home](${SITE_URL}/): what SocialSpark does, how it works, examples and FAQ
- [Mortgage brokers](${SITE_URL}/mortgage-brokers): mortgage feature sheets
- [Pricing](${SITE_URL}/pricing): plans and what counts as a post
${PERSONA_PAGES.map((p) => `- [${p.meta.title}](${SITE_URL}/for/${p.slug}): ${p.meta.description}\n`).join("")}- [Guides](${SITE_URL}/guides): answer-first guides for Canadian realtors and mortgage brokers
${GUIDES.map((g) => `- [${g.h1}](${SITE_URL}/guides/${g.slug}): ${g.meta.description}\n`).join("")}- [Privacy policy](${COMPANY.url}/privacy/)
- [Terms of service](${COMPANY.url}/terms/)
- [Contact](mailto:${COMPANY.email})
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
