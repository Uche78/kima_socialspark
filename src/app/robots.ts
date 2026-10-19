import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Private app areas stay out of search; public pages (home, pricing, llms.txt) are open,
// including to AI assistants' crawlers so they can answer questions about SocialSpark.
// /login is linked from every page, so it's crawlable but kept out of results with a noindex tag
// (a robots.txt block would hide that tag and be reported as an error by Bing).
const PRIVATE = ["/api/", "/auth/", "/settings", "/listings", "/posts"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      { userAgent: ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Google-Extended", "Applebot-Extended"], allow: "/", disallow: PRIVATE },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
