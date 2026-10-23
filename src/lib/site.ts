// Public facts about the site, shared by metadata, structured data, robots, sitemap and llms.txt.

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://socialspark.usekima.com").replace(/\/$/, "");
export const SITE_NAME = "SocialSpark";
export const SITE_TITLE = "SocialSpark — Turn listing links into social media posts for realtors";
export const SITE_DESCRIPTION =
  "SocialSpark turns a property listing link into ready-to-publish Instagram, Facebook and LinkedIn posts for Canadian realtors: branded images and captions in your voice, in English, Québec French or both.";
export const COMPANY = { name: "Kima Technologies Inc.", url: "https://usekima.com", email: "legal@usekima.com" };
/** Where Team and brokerage enquiries from the pricing section are sent. */
export const SALES_EMAIL = "uche@usekima.com";
