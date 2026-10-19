import { FAQ } from "@/lib/faq";
import { FREE_LIMITS, PAID_PLANS } from "@/lib/plans";
import { COMPANY, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

// llms.txt (llmstxt.org): a plain-language summary for AI assistants and answer engines.
export const dynamic = "force-static";

export function GET() {
  const s = PAID_PLANS.starter;
  const p = PAID_PLANS.professional;
  const body = `# ${SITE_NAME}

> ${SITE_DESCRIPTION}

${SITE_NAME} is made by [${COMPANY.name}](${COMPANY.url}), a Canadian company.

## What it does
- Paste a listing link from a brokerage or agent website on the [home page](${SITE_URL}/); ${SITE_NAME} imports the price, details, features and photos.
- Choose a platform (Instagram, Facebook Pages or LinkedIn), a format (single image or carousel) and a post type (Just Listed, Open House, Price Reduced, Coming Soon, Sold or Featured Property).
- Get branded images with the agent's name and brokerage, plus a caption written in the agent's voice, in English, Québec French or bilingual.
- Edit, download, publish now or schedule. Nothing is posted without the agent's action.
- REALTOR.ca blocks automated tools; agents can copy and paste the listing page instead.

## [Pricing](${SITE_URL}/pricing) (CAD, plus applicable tax)
- Free: ${FREE_LIMITS.registered} posts in total, one-time, no credit card.
- ${s.name}: ${s.price}/month: ${s.posts} new posts and ${s.regens} regenerations a month.
- ${p.name}: ${p.price}/month: ${p.posts} new posts and ${p.regens} regenerations a month.
- A single image or a full carousel counts as one post. Edits, downloads and publishing are free. Monthly allowances reset each billing cycle. Cancel anytime.

## Frequently asked questions
${FAQ.map((f) => `### ${f.q}\n${f.a}`).join("\n\n")}

## Links
- [Home](${SITE_URL}/): what SocialSpark does, how it works, examples and FAQ
- [Pricing](${SITE_URL}/pricing): plans and what counts as a post
- [Privacy policy](${COMPANY.url}/privacy/)
- [Terms of service](${COMPANY.url}/terms/)
- [Contact](mailto:${COMPANY.email})
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
