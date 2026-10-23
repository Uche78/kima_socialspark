// Persona landing pages, served at /for/<slug> and listed in the sitemap. One entry per page, each
// written for one persona in .claude/skills/socialspark-personas/references/personas.md by the
// socialspark-landing-pages skill. Every claim must be true of the product today (see that skill).

import type { PlanHighlight } from "@/components/pricing/PricingPlans";
import type { BillingInterval } from "@/lib/plans";

type Item = { title: string; body: string };

type BasePage = {
  /** URL: /for/<slug>. The search phrase the reader types, e.g. "social-media-for-top-producing-realtors". */
  slug: string;
  /** The persona's number in personas.md. */
  persona: number;
  /** Realtors get example posts and a realtor guest session; brokers get the feature sheet and a broker session. */
  audience: "realtor" | "broker";
  /** Who the page is for, as structured data's audience, e.g. "Top producing real estate agents in Canada". */
  reader: string;
  /** <title> (the layout appends " | SocialSpark") and meta description. */
  meta: { title: string; description: string };
  /** Their objections, answered. Shown as the FAQ and published as FAQPage structured data. */
  objections: { heading: string; items: { q: string; a: string }[] };
  /** One line under the pricing heading on why their plan (PERSONA_PLAN) fits, with the volume math. No prices. */
  planFit: string;
  close: { heading: string; sub: string };
};

/** The section-by-section page: hero, before/after, how it works, pains taken, pricing, FAQ. */
export type SectionsPage = BasePage & {
  layout: "sections";
  hero: { eyebrow: string; headline: string; sub: string; reassurance: string };
  /** Their week today, then the same week with SocialSpark: concrete, in their words. */
  pain: { heading: string; today: string[]; after: string[] };
  /** Three steps, link to finished post, with the detail this persona cares about. */
  steps: { heading: string; items: [Item, Item, Item] };
  /** The "pains taken": specific, true facts about how SocialSpark does the work. */
  facts: { eyebrow: string; heading: string; items: Item[] };
};

/** Real product imagery for a reason: example posts (demo-posts.ts ids), the platforms trio, an app screen, the sheet, or the plan. */
export type ReasonVisual =
  | { kind: "posts"; ids: string[] }
  | { kind: "platforms" }
  | { kind: "screen"; step: 1 | 2 | 3 }
  | { kind: "sheet" }
  | { kind: "plan" };

/** A real customer's words, used with their permission. Never written by us. */
export type Testimonial = { quote: string; name: string; role: string; brokerage: string; city: string; photo?: string; permission: true };
/** A real, published figure with where it came from and when. */
export type Stat = { value: string; label: string; source: string; asOf: string };
export type Founder = { name: string; role: string; story: string; photo?: string };

/** The listicle: "N reasons <reader> should…", each reason backed by a fact and real output, then proof, comparison and the offer. */
export type ListiclePage = BasePage & {
  layout: "listicle";
  /** The big promise. Starts with the number of reasons when it's an "N reasons" headline. */
  hero: { eyebrow: string; headline: string; sub: string };
  /** The button text between reasons, e.g. "See your next listing as a post". It scrolls to the hero form. */
  cta: string;
  /** 7–10 reasons, most compelling first, the plan last. */
  reasons: { label: string; title: string; body: string; visual?: ReasonVisual }[];
  /** Real proof only. Empty sections are hidden; the example posts always show. */
  proof: { heading: string; testimonials: Testimonial[]; stats: Stat[]; founder: Founder | null };
  /** SocialSpark against the reader's current way (never a named competitor). */
  comparison: { heading: string; ours: string; theirs: string; rows: { label: string; ours: string; theirs: string }[] };
  /** The offer package around the highlighted plan; the plan's allowance, features and guarantees are filled in from plans.ts. */
  offer: { heading: string; sub: string };
};

export type PersonaPage = SectionsPage | ListiclePage;

/**
 * The plan each persona settles on, marked "Most popular" on their page, and the billing preselected.
 * From the fit table in personas.md: an upgrade path's destination ("Starter → Pro" is Pro), Team for the
 * team and brokerage buyers, and yearly only where the table says yearly outright.
 */
export const PERSONA_PLAN: Record<number, { highlight: PlanHighlight; interval: BillingInterval }> = {
  1: { highlight: "professional", interval: "month" },
  2: { highlight: "starter", interval: "month" },
  3: { highlight: "top_producer", interval: "year" },
  4: { highlight: "team", interval: "month" },
  5: { highlight: "top_producer", interval: "month" },
  6: { highlight: "professional", interval: "month" },
  7: { highlight: "top_producer", interval: "year" },
  8: { highlight: "starter", interval: "month" },
  9: { highlight: "professional", interval: "year" },
  10: { highlight: "top_producer", interval: "month" },
  11: { highlight: "starter", interval: "year" },
  12: { highlight: "starter", interval: "year" },
  13: { highlight: "top_producer", interval: "year" },
  14: { highlight: "team", interval: "month" },
  15: { highlight: "starter", interval: "month" },
  16: { highlight: "professional", interval: "month" },
  17: { highlight: "top_producer", interval: "year" },
  18: { highlight: "professional", interval: "year" },
  19: { highlight: "professional", interval: "month" },
  20: { highlight: "starter", interval: "month" },
};

/** Persona 3, The Top Producer. Search phrase: "social media for top producing realtors". */
const TOP_PRODUCERS: ListiclePage = {
  layout: "listicle",
  slug: "social-media-for-top-producing-realtors",
  persona: 3,
  audience: "realtor",
  reader: "Top producing real estate agents in Canada",
  meta: {
    title: "Social Media for Top Producing Realtors",
    description: "7 reasons top producing realtors get every listing posted the day it goes live: every stage, in your brand and voice, without adding staff.",
  },
  hero: {
    eyebrow: "For top producing realtors",
    headline: "7 reasons top producing realtors get every listing posted the day it goes live",
    sub: "Paste a listing link. SocialSpark builds the Just Listed carousel, the Open House post and the Sold post in your brand and your voice, for Instagram, Facebook and LinkedIn, without adding staff.",
  },
  cta: "See your next listing as a post",
  reasons: [
    {
      label: "Speed",
      title: "Your listing is posted the day it goes live.",
      body: "Paste the link from your brokerage or agent website. SocialSpark pulls in the price, details and photos, and the branded post and caption are ready in under a minute. No more waiting two days for someone to have a free afternoon.",
      visual: { kind: "screen", step: 1 },
    },
    {
      label: "Your voice",
      title: "Captions that sound like you, not a template.",
      body: "In Brand & voice, pick a tone and paste a few of your past posts. SocialSpark follows your style, leads with the selling points that matter most, and skips the clichés buyers scroll past. No “stunning”, “nestled” or “must-see”, unless that's how you write.",
      visual: { kind: "screen", step: 3 },
    },
    {
      label: "Your brand",
      title: "Your name is the brand. Every post looks like you.",
      body: "Your name, brokerage and contact details on every image, in your colours. The same polished look on every listing, whether you or your assistant makes the post, with your brokerage name already on it.",
      visual: { kind: "posts", ids: ["ig-harbour", "fb-oakridge"] },
    },
    {
      label: "Every stage",
      title: "Six post types cover a listing's whole life.",
      body: "Coming Soon, Just Listed, Open House, Price Reduced, Sold and Featured Property, all from the same link, each written and sized for Instagram, Facebook and LinkedIn. Schedule the Open House post on day one, so it goes out even on your busiest weekend.",
      visual: { kind: "posts", ids: ["li-laurier", "ig-oakridge", "fb-maple", "ig-maple"] },
    },
    {
      label: "Your assistant",
      title: "Your assistant schedules posts instead of designing them.",
      body: "Whoever runs your marketing pastes the link, checks the post and schedules it. No template to find, no price to retype, no caption to write at 10 p.m. after a showing. Nothing goes out until someone clicks Publish now or Schedule, and every word and image can be edited first.",
      visual: { kind: "screen", step: 2 },
    },
    {
      label: "Made for Canada",
      title: "Built for Canadian real estate, not adapted to it.",
      body: "Captions in English, Québec French or both, written the way a Québec agent would write them, not translated word for word. They describe the home, never the ideal buyer, which human rights codes prohibit. And your account and listings are stored in Canada.",
    },
    {
      label: "The plan",
      title: "50 posts a month covers 4 or more listings at every stage.",
      body: "Six post types on two platforms is at most 12 posts a listing, and not every listing needs a Price Reduced or Open House post. Top Producer's 50 posts a month cover at least 4 listings in full, with every feature included and two months free when you pay yearly. Try it on your next listing first, free.",
      visual: { kind: "plan" },
    },
  ],
  proof: { heading: "Made with SocialSpark", testimonials: [], stats: [], founder: null },
  comparison: {
    heading: "SocialSpark or by hand?",
    ours: "SocialSpark",
    theirs: "By hand",
    rows: [
      { label: "A finished post", ours: "Under a minute from the link", theirs: "Template, retyping, caption, every time" },
      { label: "Every listing stage", ours: "Six post types from one link", theirs: "Rebuilt for each stage" },
      { label: "Instagram, Facebook, LinkedIn", ours: "Written and sized for each", theirs: "One caption pasted everywhere" },
      { label: "Photos", ours: "The largest version the site serves", theirs: "Whatever was downloaded" },
      { label: "Your brand", ours: "Same name, brokerage and colours every time", theirs: "Depends who made it" },
      { label: "Québec French", ours: "Built in, or bilingual", theirs: "A separate translation" },
      { label: "Fair-housing wording", ours: "Describes the home, never the buyer", theirs: "Up to whoever writes it" },
    ],
  },
  offer: { heading: "Everything a top producer needs, in one plan", sub: "Start with free posts on your next listing. Upgrade when every listing is going out on time." },
  objections: {
    heading: "Questions top producers ask",
    items: [
      { q: "My assistant already does this. Why would I need it?", a: "Keep your assistant. SocialSpark makes them faster: they paste the link, check the post and schedule it, instead of building it in a design tool and writing the caption from scratch." },
      { q: "Is the Top Producer plan enough for my volume?", a: "Every post type on two platforms is at most 12 posts a listing (6 types × 2), so Top Producer's 50 cover at least 4 listings a month in full, and more when a listing skips a stage like Price Reduced. Running a team that posts more? Use the Team enquiry under the plans." },
      { q: "Will it post something wrong?", a: "Never on its own. A post goes out only when you click Publish now or choose a time to schedule it, and you can edit every caption and image first." },
      { q: "Will the posts sound like me?", a: "Yes. In Brand & voice, choose a tone and paste a few of your past posts. SocialSpark follows your style, and you can edit every caption before it goes out." },
      { q: "Does it work with REALTOR.ca?", a: "REALTOR.ca blocks automated tools, so use “Copy and paste the page”: open the listing, select all, copy, and paste it into SocialSpark. Brokerage and agent websites work with just the link." },
      { q: "What counts as a post?", a: "A single image or a whole carousel counts as one post. Asking for a new version uses a regeneration. Edits, downloads and publishing are always free, and a post that fails to generate never counts." },
      { q: "Can I cancel anytime?", a: "Yes. Cancel from Plan & billing in a couple of clicks. Your plan stays active until the end of the billing period." },
    ],
  },
  planFit: "Every stage on two platforms is at most 12 posts a listing. Top Producer's 50 cover at least 4 listings in full, and more when a listing skips a stage.",
  close: { heading: "Your next listing, posted the day it goes live.", sub: "Paste the link and see your first post in under a minute." },
};

/** Persona 10, The Condo & Pre-Sale Specialist. Search phrase: "social media posts for condo realtors". */
const CONDO_REALTORS: ListiclePage = {
  layout: "listicle",
  slug: "social-media-posts-for-condo-realtors",
  persona: 10,
  audience: "realtor",
  reader: "Condo and pre-sale real estate agents in Canada",
  meta: {
    title: "Social Media Posts for Condo Realtors",
    description: "10 reasons condo realtors should stop building posts one unit at a time: condo fees and unit details written in, Price Reduced posts and 3D tour links.",
  },
  hero: {
    eyebrow: "For condo & pre-sale realtors",
    headline: "10 reasons condo realtors should stop building posts one unit at a time",
    sub: "Five condos this week? Paste each listing link. SocialSpark writes the condo fee, the unit's features and its best photos into a branded post for Instagram, Facebook and LinkedIn. Five posts before lunch.",
  },
  cta: "See your next unit as a post",
  reasons: [
    {
      label: "Volume",
      title: "Five units this week. Five posts before lunch.",
      body: "Paste the link from your brokerage or agent website. SocialSpark pulls in the price, condo fee, details and photos, and the branded post and caption are ready in under a minute. Then the next unit.",
      visual: { kind: "screen", step: 1 },
    },
    {
      label: "Unit details",
      title: "The condo fee and the unit's features, written in for you.",
      body: "SocialSpark reads the monthly condo fee, property tax, size and the features the listing names, like parking, a locker or the view, and works them into the caption. You check and edit any detail first, and it never invents one.",
      visual: { kind: "screen", step: 2 },
    },
    {
      label: "Same building",
      title: "Five units in one building, five different posts.",
      body: "Each post is written from that unit's own details and photos. Choose up to three features to lead with: the corner view on one, the second parking spot on another. Want a different angle? Ask for a new version.",
      visual: { kind: "posts", ids: ["li-harbour", "ig-harbour"] },
    },
    {
      label: "Price Reduced",
      title: "Price Reduced posts that sell the new number.",
      body: "When the market slows, price changes pile up. The Price Reduced post leads with what the new price now gets a buyer, and never states or guesses the old price. Update the price on the listing and make the post.",
      visual: { kind: "posts", ids: ["ig-harbour"] },
    },
    {
      label: "Pre-sale",
      title: "Coming Soon posts that start the DMs early.",
      body: "Tease the best features and invite people to message you before the unit hits the market. Add what the listing page doesn't say, like the occupancy date or assignment terms, in your notes, and the caption works it in. No listing page yet? Enter the details yourself.",
      visual: { kind: "posts", ids: ["li-laurier"] },
    },
    {
      label: "3D tours",
      title: "Your 3D tour, in the right place on every platform.",
      body: "When the listing has a Matterport, iGUIDE or video tour, Facebook and LinkedIn captions include the exact link. On Instagram, where links in captions don't work, the caption asks people to DM “TOUR” instead.",
    },
    {
      label: "Three audiences",
      title: "Instagram for buyers. LinkedIn for investors.",
      body: "A swipeable Instagram carousel with the hook in the first line, a local, conversational Facebook post, and a LinkedIn update written for professionals, relocating employees and investors, with a soft referral ask.",
      visual: { kind: "platforms" },
    },
    {
      label: "Fair housing",
      title: "Never “perfect for young professionals”.",
      body: "Condo captions often describe the buyer. Canadian human rights codes prohibit that, so SocialSpark describes the unit instead: the layout, the light, the fees. It also never invents walk times, school names or neighbourhood claims.",
    },
    {
      label: "Montréal",
      title: "Québec French and bilingual posts from the same link.",
      body: "English, Québec French or both, written the way a Québec agent would write them (“Nouvelle inscription”), not translated word for word. One link, both markets.",
    },
    {
      label: "The plan",
      title: "A plan sized for condo volume.",
      body: "Several units a month, each with Just Listed, Price Reduced and Sold posts on two platforms, outgrows the smaller plans fast. Top Producer was made for that volume, with every feature included. Try it on your next unit first, free.",
      visual: { kind: "plan" },
    },
  ],
  proof: { heading: "Made with SocialSpark", testimonials: [], stats: [], founder: null },
  comparison: {
    heading: "SocialSpark or a template per unit?",
    ours: "SocialSpark",
    theirs: "A template per unit",
    rows: [
      { label: "Condo fee and unit details", ours: "Read from the listing and written in", theirs: "Retyped for every unit" },
      { label: "Five units, one building", ours: "Each post led by that unit's own features", theirs: "The same words, five times" },
      { label: "Price Reduced", ours: "Leads with what the new price gets", theirs: "Rebuilt by hand" },
      { label: "3D tour links", ours: "Placed right for each platform", theirs: "Copied in by hand" },
      { label: "Instagram, Facebook, LinkedIn", ours: "Written and sized for each", theirs: "One caption pasted everywhere" },
      { label: "Fair-housing wording", ours: "Describes the unit, never the buyer", theirs: "Up to whoever writes it" },
    ],
  },
  offer: { heading: "Everything a condo specialist needs, in one plan", sub: "Try it on your next unit free. Upgrade when every unit is going out on time." },
  objections: {
    heading: "Questions condo agents ask",
    items: [
      { q: "My listings all look the same. Won't the posts?", a: "Each post is written from that unit's own details and photos, and you can choose up to three features to lead with. For a different angle on the same unit, ask for a new version." },
      { q: "Will it get the condo fee right?", a: "It reads the fee from the listing page, and you can check and edit every detail before you make a post. Captions only use facts from the listing and your notes." },
      { q: "Can I post pre-sales and assignments?", a: "Yes. Paste the listing link, paste the page itself, or enter the details yourself. Add what the page doesn't say, like occupancy dates or assignment terms, in your notes." },
      { q: "Is the Top Producer plan enough for my volume?", a: "A unit posted to two platforms across its life is usually 6 to 10 posts, so Top Producer covers about 5 to 8 units a month at every stage. Running a team that posts more? Use the Team enquiry under the plans." },
      { q: "Does it work with REALTOR.ca?", a: "REALTOR.ca blocks automated tools, so use “Copy and paste the page”: open the listing, select all, copy, and paste it into SocialSpark. Brokerage and agent websites work with just the link." },
      { q: "Will it post something without me?", a: "Never. A post goes out only when you click Publish now or choose a time to schedule it, and you can edit every caption and image first." },
    ],
  },
  planFit: "A unit posted to two platforms at Just Listed, Price Reduced and Sold is 6 or more posts. Top Producer's 50 cover about 5 to 8 units a month.",
  close: { heading: "Your next unit, posted before lunch.", sub: "Paste the link and see your first post in under a minute." },
};

export const PERSONA_PAGES: PersonaPage[] = [TOP_PRODUCERS, CONDO_REALTORS];

export function personaPage(slug: string) {
  return PERSONA_PAGES.find((p) => p.slug === slug);
}
