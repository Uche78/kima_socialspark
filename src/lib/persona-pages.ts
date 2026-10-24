// Persona landing pages, served at /for/<slug> and listed in the sitemap. One entry per page, each
// written for one persona in .claude/skills/socialspark-personas/references/personas.md by the
// socialspark-landing-pages skill. Every claim must be true of the product today (see that skill).

import type { PlanHighlight } from "@/components/pricing/PricingPlans";
import type { Locale } from "@/lib/landing-i18n";
import { FREE_LIMITS, PAID_PLANS, type BillingInterval } from "./plans";
import type { Language } from "@/lib/types";

const TP = PAID_PLANS.top_producer;
const PRO = PAID_PLANS.professional;
const FREE = FREE_LIMITS.registered;

type Item = { title: string; body: string };

type BasePage = {
  /** URL: /for/<slug>. The search phrase the reader types, e.g. "social-media-for-top-producing-realtors". */
  slug: string;
  /** The persona's number in personas.md. */
  persona: number;
  /** Realtors get example posts and a realtor guest session; brokers get the feature sheet and a broker session. */
  audience: "realtor" | "broker";
  /** The page's language (default "en"). French pages need their slug in FRENCH_PERSONA_SLUGS (landing-i18n.ts). Pages for the same persona in both languages are linked with hreflang. */
  locale?: Locale;
  /**
   * Dollar figures in the copy that aren't plan prices, each with its source, e.g. a sourced competitor cost or a
   * format example. Plan prices come from PAID_PLANS in template strings; the test rejects any other figure.
   */
  figures?: { text: string; source: string }[];
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
  | { kind: "posts"; ids: string[]; language?: Language }
  | { kind: "platforms"; language?: Language }
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
  /** The example post (demo-posts.ts id) beside the hero, when the default detached house is the wrong picture (e.g. condos). */
  heroPost?: string;
  /** The language of the example posts on the page (default: the page's locale). Visuals can override it. */
  demoLanguage?: Language;
  /** The button text between reasons, e.g. "See your next listing as a post". It scrolls to the hero form. */
  cta: string;
  /** 7–10 reasons, most compelling first, the plan last. */
  reasons: { label: string; title: string; body: string; visual?: ReasonVisual }[];
  /** Real proof only. Empty sections are hidden; the example posts always show. */
  proof: { heading: string; testimonials: Testimonial[]; stats: Stat[]; founder: Founder | null };
  /** SocialSpark against the reader's current way (never a named competitor). */
  /** `oursNo`: a row SocialSpark deliberately doesn't do (shown with a dash, not a tick). Candour makes the rest believable. */
  comparison: { heading: string; ours: string; theirs: string; rows: { label: string; ours: string; theirs: string; oursNo?: true }[] };
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
  15: { highlight: "professional", interval: "month" },
  16: { highlight: "professional", interval: "month" },
  17: { highlight: "top_producer", interval: "year" },
  18: { highlight: "professional", interval: "year" },
  19: { highlight: "professional", interval: "month" },
  20: { highlight: "team", interval: "month" },
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
    description: "7 reasons top producing realtors can post every listing the day it goes live: every stage, in your brand and voice, without adding staff.",
  },
  hero: {
    eyebrow: "For top producing realtors",
    headline: "7 reasons top producing realtors can post every listing the day it goes live",
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
    description: "10 reasons condo realtors can post five units before lunch: each led by its own features, with Price Reduced posts and 3D tour links.",
  },
  hero: {
    eyebrow: "For condo & pre-sale realtors",
    headline: "10 reasons condo realtors can post five units before lunch",
    sub: "Five condos this week? Paste each listing link. SocialSpark reads the condo fee, the unit's features and its best photos and builds a branded post for Instagram, Facebook and LinkedIn.",
  },
  heroPost: "ig-harbour",
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
      title: "The details condo buyers compare, read from the listing.",
      body: "SocialSpark reads the monthly condo fee, property tax, size and the features the listing names, like parking, a locker or the view, and gives them to the caption. You check and edit any detail first, and it never invents one.",
      visual: { kind: "posts", ids: ["li-harbour"] },
    },
    {
      label: "Same building",
      title: "Five units in one building, five different posts.",
      body: "Each post is written from that unit's own details and photos. Choose up to three features to lead with: the corner view on one, the second parking spot on another. Want a different angle? Ask for a new version.",
      visual: { kind: "screen", step: 2 },
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
      body: "Tease the best features and invite people to message you before the unit hits the market. Add what the listing page doesn't say, like the occupancy date or assignment terms, in your notes, and the caption works it in. Selling a new-build unit to a first-time buyer? Add the HST rebate details there too. No listing page yet? Enter the details yourself.",
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
      label: "Québec",
      title: "Québec French and bilingual posts from the same link.",
      body: "English, Québec French or both, written the way a Québec agent would write them (“Nouvelle inscription”), not translated word for word. One link, both markets.",
    },
    {
      label: "The plan",
      title: `${TP.posts} posts a month covers ${Math.floor(TP.posts / 6)} units at three stages.`,
      body: `Just Listed, Price Reduced and Sold on two platforms is 6 posts a unit, so Top Producer's ${TP.posts} posts a month cover ${Math.floor(TP.posts / 6)} units, with every feature included. Try it on your next unit first, free.`,
      visual: { kind: "plan" },
    },
  ],
  proof: { heading: "Made with SocialSpark", testimonials: [], stats: [], founder: null },
  comparison: {
    heading: "SocialSpark or a template per unit?",
    ours: "SocialSpark",
    theirs: "A template per unit",
    rows: [
      { label: "Condo fee and unit details", ours: "Read from the listing", theirs: "Retyped for every unit" },
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
      { q: "Can I post pre-sales and assignments?", a: "Yes. Paste the listing link, paste the page itself, or enter the details yourself. Add what the page doesn't say, like occupancy dates or assignment terms, in your notes. Check your regulator's and the builder's rules before advertising an assignment." },
      { q: "Is the Top Producer plan enough for my volume?", a: `Just Listed, Price Reduced and Sold on two platforms is 6 posts a unit, so Top Producer's ${TP.posts} posts cover ${Math.floor(TP.posts / 6)} units a month. Running a team that posts more? Use the Team enquiry under the plans.` },
      { q: "Does it work with REALTOR.ca?", a: "REALTOR.ca blocks automated tools, so use “Copy and paste the page”: open the listing, select all, copy, and paste it into SocialSpark. Brokerage and agent websites work with just the link." },
      { q: "Will it post something without me?", a: "Never. A post goes out only when you click Publish now or choose a time to schedule it, and you can edit every caption and image first." },
    ],
  },
  planFit: `Just Listed, Price Reduced and Sold on two platforms is 6 posts a unit, so Top Producer's ${TP.posts} cover ${Math.floor(TP.posts / 6)} units a month.`,
  close: { heading: "Your next unit, posted before lunch.", sub: "Paste the link and see your first post in under a minute." },
};

// Pages 5, 7 (FR and EN) and 13: the user's copy from marketing/landing-pages/top-producer-personas.md.
// Plan prices and the free-post count are filled in from plans.ts so they can't go stale.
const OUTSOURCED_COST = { text: "$400", source: "One Canadian brokerage's social content plan: RE/MAX River City digital marketing (personas.md [9])" };
const QC_PRICE_FORMAT = { text: "649 000 $", source: "Québec French price format the caption prompt follows (src/lib/generate.ts)" };

/** Persona 5, The Marketing Coordinator. */
const MARKETING_COORDINATORS: ListiclePage = {
  layout: "listicle",
  slug: "listing-posts-for-real-estate-marketing-coordinators",
  persona: 5,
  audience: "realtor",
  reader: "Marketing coordinators at Canadian real estate teams and top producers' offices",
  figures: [OUTSOURCED_COST],
  meta: {
    title: "Listing Post Tool for Marketing Coordinators",
    description: `Marketing coordinators: turn each listing link into a branded Instagram, Facebook or LinkedIn post and caption in the agent's voice. ${FREE} free posts.`,
  },
  hero: {
    eyebrow: "For real estate marketing coordinators",
    headline: "8 reasons marketing coordinators can clear the listing post backlog",
    sub: "Paste a listing link. SocialSpark builds the branded post and a caption in your agent's voice for Instagram, Facebook and LinkedIn. You check it, then schedule it or download it for your own scheduler.",
  },
  heroPost: "ig-oakridge",
  cta: "See the next listing as a post",
  reasons: [
    {
      label: "Backlog",
      title: "Every listing in the queue, posted this week.",
      body: "Paste the link from the brokerage or agent website. SocialSpark pulls in the price, details and photos, and the branded post and caption are ready in under a minute. Check it, then paste the next one.",
      visual: { kind: "screen", step: 1 },
    },
    {
      label: "Every stage",
      title: "One link covers the listing's whole life.",
      body: "Coming Soon, Just Listed, Open House, Price Reduced, Sold and Featured Property, all from the same link, each written and sized for Instagram, Facebook and LinkedIn. Schedule the Open House post the day the listing goes live.",
      visual: { kind: "posts", ids: ["li-laurier", "ig-oakridge", "fb-maple", "ig-maple"] },
    },
    {
      label: "Their brand",
      title: "Every post looks like it came from the same office.",
      body: "The agent's name, brokerage, contact details and colours go on every image automatically. No template to hunt for, no logo to resize, no price to retype.",
      visual: { kind: "posts", ids: ["ig-harbour", "fb-oakridge"] },
    },
    {
      label: "Their voice",
      title: "Captions that sound like your agent, not a template.",
      body: "In Brand & voice, pick a tone and paste a few of the agent's past posts. SocialSpark follows that style, leads with the selling points that matter, and skips “stunning”, “nestled” and “must-see” unless that's how they write.",
      visual: { kind: "screen", step: 3 },
    },
    {
      label: "Your tools",
      title: "Schedule it here, or use the scheduler you already have.",
      body: "Publish to Instagram, Facebook or LinkedIn now, or schedule a time. Prefer your own scheduler? Download the images as JPEG or ZIP and copy the caption.",
      visual: { kind: "screen", step: 2 },
    },
    {
      label: "Your judgement",
      title: "You stay the editor.",
      body: "SocialSpark makes the first draft. You change any word or photo, choose what goes out, and decide when. Nothing posts without a click. Edits and downloads are always free.",
    },
    {
      label: "Made for Canada",
      title: "Written for Canadian listings.",
      body: "Captions describe the home, never the ideal buyer, which Canadian human rights codes prohibit, and never invent walk times or school names. English, Québec French or both. Account and listing data are stored in Canada.",
    },
    {
      label: "The plan",
      title: `${TP.posts} listing posts a month for ${TP.price}.`,
      body: `The Top Producer plan is ${TP.price} a month plus tax for ${TP.posts} posts, with every feature included. That's at least 4 listings at every stage on two platforms. For comparison, one Canadian brokerage's social content plan is about $400 a month for around 40 posts. Make ${FREE} free posts on a real listing and show your boss the result.`,
      visual: { kind: "plan" },
    },
  ],
  proof: { heading: "Made with SocialSpark", testimonials: [], stats: [], founder: null },
  comparison: {
    heading: "SocialSpark or building every post by hand?",
    ours: "SocialSpark",
    theirs: "By hand",
    rows: [
      { label: "A finished post", ours: "Under a minute from the link", theirs: "Template, retyping, caption, every time" },
      { label: "Every listing stage", ours: "Six post types from one link", theirs: "Rebuilt for each stage" },
      { label: "Instagram, Facebook, LinkedIn", ours: "Written and sized for each", theirs: "One caption pasted everywhere" },
      { label: "The agent's brand", ours: "Same name, brokerage and colours every time", theirs: "Depends on the template" },
      { label: "The caption", ours: "In the agent's voice, edited by you", theirs: "Written from scratch" },
      { label: "Scheduling", ours: "From the post, or downloaded for your tool", theirs: "Export, upload, schedule" },
      { label: "Fair-housing wording", ours: "Describes the home, never the buyer", theirs: "Up to whoever writes it" },
    ],
  },
  offer: { heading: "Everything the listing posts need, in one plan", sub: `Start with ${FREE} free posts on a real listing, no credit card. Then show your boss.` },
  objections: {
    heading: "Questions marketing coordinators ask",
    items: [
      { q: "What's the fastest way to make listing posts for a real estate agent?", a: "Start from the listing link instead of a blank template. SocialSpark, a Canadian web app, turns a listing link into a branded post and caption for Instagram, Facebook or LinkedIn in under a minute, which you then check, edit and schedule." },
      { q: "How do I get my boss to pay for SocialSpark?", a: `Show them a real result. Make ${FREE} free posts on one of their listings, no credit card needed. The Top Producer plan is ${TP.price} a month plus tax for ${TP.posts} posts, and it cancels in a couple of clicks.` },
      { q: "Will SocialSpark replace my job?", a: "No. It makes the first draft of each listing post. You decide what goes out, edit anything, and choose when it posts, and the content that isn't a listing post stays yours." },
      { q: "Can I use my own scheduler?", a: "Yes. Download the images as JPEG or ZIP and copy the caption into the tool you already use. You can also publish or schedule from SocialSpark to Instagram, Facebook and LinkedIn." },
      { q: "Can I manage several agents from one account?", a: "Today one account carries one agent's branding. Team accounts with a seat for each agent are planned; ask about them with the Team enquiry under the plans." },
      { q: "What counts as a post?", a: "A single image or a whole carousel counts as one post. Asking for a new version uses a regeneration. Edits, downloads and publishing are always free, and a post that fails to generate never counts." },
      { q: "Does it work with REALTOR.ca?", a: "REALTOR.ca blocks automated tools, so use “Copy and paste the page”: open the listing, select all, copy, and paste it into SocialSpark. Brokerage and agent websites work with just the link." },
      { q: "Will SocialSpark post anything without me?", a: "Never. A post goes out only when you click Publish now or choose a time to schedule it." },
    ],
  },
  planFit: `Every post type on two platforms is at most 12 posts a listing, so Top Producer's ${TP.posts} cover at least 4 listings in full each month.`,
  close: { heading: "The listing posts, handled. Back to the work only you can do.", sub: "Paste a listing link and see the first post in under a minute." },
};

/** Persona 7, The Bilingual Border Agent: French page for Gatineau and Québec. English twin below. */
const BILINGUAL_AGENTS_FR: ListiclePage = {
  layout: "listicle",
  locale: "fr",
  slug: "publications-immobilieres-bilingues",
  persona: 7,
  audience: "realtor",
  reader: "Courtiers immobiliers bilingues au Québec et dans la région d'Ottawa–Gatineau",
  figures: [QC_PRICE_FORMAT],
  meta: {
    title: "Publications immobilières bilingues",
    description: "Collez le lien de l'inscription : publication à votre image, texte en français d'ici, en anglais ou bilingue, pour Instagram, Facebook et LinkedIn.",
  },
  hero: {
    eyebrow: "Pour les courtiers immobiliers bilingues",
    headline: "7 raisons de publier vos inscriptions en français et en anglais d'un seul lien",
    sub: "Collez le lien de l'inscription. SocialSpark crée la publication à votre image avec un texte en français d'ici, en anglais ou bilingue, pour Instagram, Facebook et LinkedIn. Vous vérifiez, puis vous publiez.",
  },
  heroPost: "ig-maple",
  demoLanguage: "fr",
  cta: "Voir ma prochaine inscription en publication",
  reasons: [
    {
      label: "Deux langues",
      title: "Un lien, deux langues, en moins d'une minute.",
      body: "Choisissez un texte bilingue dans une seule publication, ou deux publications séparées, une en français et une en anglais. Le texte sur l'image suit aussi, par exemple « Backs onto the ravine | Adossée au ravin ».",
      visual: { kind: "platforms", language: "bilingual" },
    },
    {
      label: "Français d'ici",
      title: "Du français québécois, pas de la traduction.",
      body: "SocialSpark écrit comme un courtier d'ici : « Nouvelle inscription », « Visite libre », « chambres à coucher », « pi² », « 649 000 $ ». L'accroche et l'appel à l'action sont adaptés, pas traduits mot à mot.",
      visual: { kind: "screen", step: 3 },
    },
    {
      label: "Votre image",
      title: "Votre nom, votre agence, vos couleurs.",
      body: "Chaque image porte votre nom, votre agence, vos coordonnées et vos couleurs, dans les deux langues, à chaque inscription.",
      visual: { kind: "posts", ids: ["ig-harbour", "fb-oakridge"] },
    },
    {
      label: "Votre ton",
      title: "Un texte qui vous ressemble.",
      body: "Dans Brand & voice, choisissez un ton et collez quelques-unes de vos anciennes publications. SocialSpark suit votre style et évite les clichés comme « magnifique » ou « à ne pas manquer », sauf si vous les utilisez.",
    },
    {
      label: "Tout le cycle",
      title: "De Bientôt disponible à Vendu.",
      body: "Six types de publications à partir du même lien : Bientôt disponible, Nouvelle inscription, Visite libre, Prix réduit, Vendu et Propriété en vedette. Planifiez la Visite libre dès le premier jour.",
      visual: { kind: "posts", ids: ["li-laurier", "ig-oakridge", "fb-maple", "ig-maple"] },
    },
    {
      label: "Au Canada",
      title: "Pensé pour le Canada, des deux côtés de la rivière.",
      body: "Le texte décrit la propriété, jamais l'acheteur idéal, ce que les chartes des droits interdisent. Il n'invente ni distances à pied ni noms d'écoles. Vos données sont hébergées au Canada, et rien n'est publié sans votre clic.",
    },
    {
      label: "Le forfait",
      title: "Le calcul honnête avant de choisir.",
      body: `Un texte bilingue compte pour une publication; deux langues séparées, pour deux. Nouvelle inscription et Vendu sur deux plateformes, en deux publications séparées : 8 publications par propriété. Top Producer (${TP.posts} par mois) en couvre 6. Un texte bilingue vous suffit ? Pro (${PRO.posts} par mois) couvre 5 propriétés. Deux mois gratuits en paiement annuel.`,
      visual: { kind: "plan" },
    },
  ],
  proof: { heading: "Créé avec SocialSpark", testimonials: [], stats: [], founder: null },
  comparison: {
    heading: "SocialSpark ou la traduction à la main ?",
    ours: "SocialSpark",
    theirs: "À la main",
    rows: [
      { label: "Le texte en français", ours: "Écrit en français d'ici", theirs: "Traduit de l'anglais" },
      { label: "Deux langues", ours: "Bilingue ou séparé, d'un seul lien", theirs: "Deux textes à écrire" },
      { label: "Une publication finie", ours: "Moins d'une minute à partir du lien", theirs: "Gabarit, prix retapé, texte" },
      { label: "Instagram, Facebook, LinkedIn", ours: "Écrit et formaté pour chacun", theirs: "Le même texte partout" },
      { label: "Votre image", ours: "Même nom, agence et couleurs", theirs: "Selon le gabarit" },
      { label: "Libellé conforme", ours: "Décrit la propriété, jamais l'acheteur", theirs: "Selon qui écrit" },
    ],
  },
  offer: { heading: "Tout ce qu'il faut pour publier dans les deux langues", sub: `Commencez avec ${FREE} publications gratuites, sans carte de crédit. Passez à un forfait quand chaque inscription sort à temps.` },
  objections: {
    heading: "Questions des courtiers bilingues",
    items: [
      { q: "Est-ce du vrai français québécois ?", a: "Oui. SocialSpark écrit directement en français québécois, comme un courtier d'ici : « Nouvelle inscription », « Visite libre », « pi² », « 649 000 $ ». Le texte n'est pas traduit mot à mot de l'anglais." },
      { q: "Un texte bilingue compte-t-il pour une ou deux publications ?", a: "Pour une. Un texte bilingue dans une seule publication compte pour une publication. Une publication en français et une autre en anglais comptent pour deux." },
      { q: "Quel forfait choisir pour publier dans les deux langues ?", a: `Avec des publications séparées en français et en anglais, Top Producer (${TP.posts} par mois) couvre 6 propriétés à Nouvelle inscription et Vendu sur deux plateformes. Avec un texte bilingue, Pro (${PRO.posts} par mois) en couvre 5.` },
      { q: "Est-ce que ça fonctionne avec REALTOR.ca et les sites d'agences ?", a: "Les sites d'agences et de courtiers fonctionnent avec le lien. REALTOR.ca bloque les outils automatisés : ouvrez l'inscription, sélectionnez tout, copiez, puis collez la page dans SocialSpark." },
      { q: "SocialSpark publie-t-il sans moi ?", a: "Jamais. Une publication part seulement quand vous cliquez sur Publier ou choisissez une heure, et vous pouvez modifier chaque mot et chaque image avant." },
      { q: "L'application est-elle en français ?", a: "L'application est en anglais; vos publications sont en français, en anglais ou bilingues, selon votre choix." },
      { q: "Où sont mes données ?", a: "Votre compte et vos inscriptions sont hébergés au Canada. La rédaction des textes utilise des fournisseurs d'IA aux États-Unis. Vos données ne sont jamais vendues." },
      { q: "Puis-je annuler en tout temps ?", a: "Oui, en quelques clics dans Plan & billing. Votre forfait reste actif jusqu'à la fin de la période payée." },
    ],
  },
  planFit: `Deux langues séparées, deux plateformes, Nouvelle inscription et Vendu : 8 publications par propriété. Les ${TP.posts} de Top Producer en couvrent 6 par mois.`,
  close: { heading: "Votre prochaine inscription, dans les deux langues.", sub: "Collez le lien et voyez votre première publication en moins d'une minute." },
};

/** Persona 7, The Bilingual Border Agent: English page for Ottawa and Moncton. French twin above. */
const BILINGUAL_AGENTS_EN: ListiclePage = {
  layout: "listicle",
  slug: "bilingual-real-estate-social-media-posts",
  persona: 7,
  audience: "realtor",
  reader: "Bilingual real estate agents in Ottawa–Gatineau, Montréal and New Brunswick",
  figures: [QC_PRICE_FORMAT],
  meta: {
    title: "Bilingual Real Estate Social Media Posts",
    description: `Paste a listing link and get a branded post with captions in English, Québec French or both, for Instagram, Facebook and LinkedIn. ${FREE} free posts.`,
  },
  hero: {
    eyebrow: "For bilingual real estate agents",
    headline: "7 reasons bilingual agents can post in English and French from one link",
    sub: "Paste a listing link. SocialSpark builds a branded post with captions in English, Québec French or both, for Instagram, Facebook and LinkedIn. You check it, then post it.",
  },
  heroPost: "ig-maple",
  demoLanguage: "bilingual",
  cta: "See your next listing in both languages",
  reasons: [
    {
      label: "Two languages",
      title: "One link, two languages, in under a minute.",
      body: "Choose one bilingual caption in a single post, or two separate posts, one English and one French. On-image text follows too: “Backs onto the ravine | Adossée au ravin”.",
      visual: { kind: "platforms" },
    },
    {
      label: "Real Québec French",
      title: "Québec French, not a translation.",
      body: "SocialSpark writes the way a Québec agent does: “Nouvelle inscription”, “Visite libre”, “chambres à coucher”, “pi²”, prices like “649 000 $”. The hook and call to action are adapted, not translated word for word.",
      visual: { kind: "screen", step: 3 },
    },
    {
      label: "Your brand",
      title: "Your name, brokerage and colours, in both languages.",
      body: "Every image carries your name, brokerage, contact details and colours, on every listing, whichever language you post in.",
      visual: { kind: "posts", ids: ["ig-harbour", "fb-oakridge"] },
    },
    {
      label: "Your voice",
      title: "Captions that sound like you.",
      body: "In Brand & voice, pick a tone and paste a few of your past posts. SocialSpark follows your style and skips the clichés unless that's how you write.",
    },
    {
      label: "Every stage",
      title: "Coming Soon to Sold.",
      body: "Six post types from the same link: Coming Soon, Just Listed, Open House, Price Reduced, Sold and Featured Property. Schedule the Open House post on day one.",
      visual: { kind: "posts", ids: ["li-laurier", "ig-oakridge", "fb-maple", "ig-maple"] },
    },
    {
      label: "Made for Canada",
      title: "Built for both sides of the river.",
      body: "Captions describe the home, never the ideal buyer, which Canadian human rights codes prohibit, and never invent walk times or school names. Your data is stored in Canada, and nothing posts without your click.",
    },
    {
      label: "The plan",
      title: "The honest count before you pick a plan.",
      body: `One bilingual caption is one post; separate languages are two. Just Listed and Sold on two platforms as separate posts is 8 posts a listing, so Top Producer (${TP.posts} a month) covers 6. Happy with bilingual captions? Pro (${PRO.posts} a month) covers 5 listings. Two months free when you pay yearly.`,
      visual: { kind: "plan" },
    },
  ],
  proof: { heading: "Made with SocialSpark", testimonials: [], stats: [], founder: null },
  comparison: {
    heading: "SocialSpark or translating by hand?",
    ours: "SocialSpark",
    theirs: "By hand",
    rows: [
      { label: "The French caption", ours: "Written in Québec French", theirs: "Translated from English" },
      { label: "Two languages", ours: "Bilingual or separate, from one link", theirs: "Two captions to write" },
      { label: "A finished post", ours: "Under a minute from the link", theirs: "Template, retyping, caption" },
      { label: "Instagram, Facebook, LinkedIn", ours: "Written and sized for each", theirs: "One caption pasted everywhere" },
      { label: "Your brand", ours: "Same name, brokerage and colours", theirs: "Depends on the template" },
      { label: "Fair-housing wording", ours: "Describes the home, never the buyer", theirs: "Up to whoever writes it" },
    ],
  },
  offer: { heading: "Everything you need to post in both languages", sub: `Start with ${FREE} free posts, no credit card. Upgrade when every listing goes out in both languages.` },
  objections: {
    heading: "Questions bilingual agents ask",
    items: [
      { q: "Is the French real Québec French?", a: "Yes. SocialSpark writes Québec French directly, the way a local agent would: “Nouvelle inscription”, “Visite libre”, “pi²”, “649 000 $”. It isn't translated word for word from English." },
      { q: "Does a bilingual caption count as one post or two?", a: "One. A bilingual caption in a single post counts as one post. A French post and a separate English post count as two." },
      { q: "Which plan do I need to post in both languages?", a: `With separate English and French posts, Top Producer (${TP.posts} a month) covers 6 listings at Just Listed and Sold on two platforms. With bilingual captions, Pro (${PRO.posts} a month) covers 5.` },
      { q: "Does it work with REALTOR.ca and brokerage sites?", a: "Brokerage and agent websites work with just the link. REALTOR.ca blocks automated tools, so open the listing, select all, copy, and paste the page into SocialSpark." },
      { q: "Will SocialSpark post anything without me?", a: "Never. A post goes out only when you click Publish now or choose a time to schedule it, and you can edit every word and image first." },
      { q: "Where is my data stored?", a: "Your account and listings are stored in Canada. Post writing uses AI providers in the United States. We never sell your data." },
      { q: "Can I cancel anytime?", a: "Yes. Cancel from Plan & billing in a couple of clicks. Your plan stays active until the end of the billing period." },
    ],
  },
  planFit: `Separate languages, two platforms, Just Listed and Sold: 8 posts a listing. Top Producer's ${TP.posts} cover 6 listings a month.`,
  close: { heading: "Your next listing, in both languages.", sub: "Paste the link and see your first post in under a minute." },
};

/** Persona 13, The Agent Who Fired Their VA. */
const OUTSOURCING_AGENTS: ListiclePage = {
  layout: "listicle",
  slug: "real-estate-social-media-manager-alternative",
  persona: 13,
  audience: "realtor",
  reader: "Canadian real estate agents who outsourced listing posts to a VA or content service",
  figures: [OUTSOURCED_COST],
  meta: {
    title: "Real Estate Social Media Manager Alternative",
    description: `Paid a VA or content service for listing posts? SocialSpark makes them from a listing link: ${TP.posts} posts a month for ${TP.price} plus tax. Try ${FREE} free.`,
  },
  hero: {
    eyebrow: "For agents who outsourced their listing posts",
    headline: `7 reasons to bring your listing posts back in-house for ${TP.price} a month`,
    sub: `Paste a listing link. SocialSpark builds the branded post and a caption in your voice for Instagram, Facebook and LinkedIn. ${TP.posts} posts a month, no one to wait on, and you approve every one.`,
  },
  heroPost: "fb-oakridge",
  cta: "See your next listing as a post",
  reasons: [
    {
      label: "The cost",
      title: `${TP.posts} listing posts a month for ${TP.price}.`,
      body: `What did your VA or content package cost? One Canadian brokerage's social content plan is about $400 a month for around 40 posts. SocialSpark's Top Producer plan is ${TP.price} a month plus tax for ${TP.posts}.`,
    },
    {
      label: "No waiting",
      title: "Listing live at 4 p.m.? Posted tonight.",
      body: "Paste the link from your brokerage or agent website. SocialSpark pulls in the price, details and photos, and the branded post and caption are ready in under a minute. No one else's turnaround to wait on.",
      visual: { kind: "screen", step: 1 },
    },
    {
      label: "Every stage",
      title: "Schedule the whole listing on day one.",
      body: "Coming Soon, Just Listed, Open House, Price Reduced, Sold and Featured Property, all from the same link. Schedule the Open House post when you list, so your feed doesn't go quiet on a busy weekend.",
      visual: { kind: "posts", ids: ["li-laurier", "ig-oakridge", "fb-maple", "ig-maple"] },
    },
    {
      label: "Your voice",
      title: "Captions that sound like you, not a contractor.",
      body: "In Brand & voice, pick a tone and paste a few of your past posts. SocialSpark follows your style and skips “stunning”, “nestled” and “must-see” unless that's how you write. Edit any word before it goes out.",
      visual: { kind: "screen", step: 3 },
    },
    {
      label: "Your brand",
      title: "The same look on every listing.",
      body: "Your name, brokerage, contact details and colours on every image, every time. No briefing anyone on your brand again.",
      visual: { kind: "posts", ids: ["ig-harbour", "fb-oakridge"] },
    },
    {
      label: "Candour",
      title: "Listing posts only. On purpose.",
      body: "SocialSpark isn't a social media manager. It won't reply to comments, answer DMs or film stories. It does the listing posts, the part most agents outsource first. If that's what you were paying for, this does it.",
    },
    {
      label: "The plan",
      title: `${TP.posts} posts covers at least 4 listings at every stage.`,
      body: `Every post type on two platforms is at most 12 posts a listing, so Top Producer's ${TP.posts} cover at least 4 listings in full. Fewer listings? Pro's ${PRO.posts} posts cover 5 at Just Listed and Sold. Pay yearly and two months are free. Try ${FREE} posts free first.`,
      visual: { kind: "plan" },
    },
  ],
  proof: { heading: "Made with SocialSpark", testimonials: [], stats: [], founder: null },
  comparison: {
    heading: "SocialSpark or an outsourced social service?",
    ours: "SocialSpark",
    theirs: "Outsourced",
    rows: [
      { label: "Monthly cost", ours: `${TP.price} plus tax for ${TP.posts} posts`, theirs: "About $400 for 40 posts at one Canadian brokerage" },
      { label: "Turnaround", ours: "Under a minute from the link", theirs: "Their schedule" },
      { label: "Captions", ours: "In your voice, edited by you", theirs: "Depends on the writer" },
      { label: "Your brand", ours: "Same every time, automatically", theirs: "Briefed and checked" },
      { label: "Comments, DMs, stories", ours: "Not included", theirs: "Often included", oursNo: true },
      { label: "Cancelling", ours: "A couple of clicks in Plan & billing", theirs: "Per their terms" },
    ],
  },
  offer: { heading: "Your listing posts, without the retainer", sub: `Start with ${FREE} free posts on your next listing, no credit card. Cancel anytime.` },
  objections: {
    heading: "Questions agents ask before they stop outsourcing",
    items: [
      { q: "How much does a real estate social media manager cost in Canada?", a: `It varies by provider and scope. One Canadian brokerage's social content plan is about $400 a month for around 40 posts. SocialSpark's Top Producer plan is ${TP.price} a month plus tax for ${TP.posts} listing posts, without comments, DMs or stories.` },
      { q: "Is SocialSpark a social media manager?", a: "No. SocialSpark makes listing posts: a branded image or carousel and caption from each listing link, for every stage from Coming Soon to Sold. It doesn't reply to comments, answer DMs or create stories." },
      { q: "Will the posts sound like me?", a: "Yes. In Brand & voice, choose a tone and paste a few of your past posts. SocialSpark follows your style, and you can edit every caption before it goes out." },
      { q: "Should I choose Top Producer or Pro?", a: `It depends on your listing count. Top Producer's ${TP.posts} posts a month cover at least 4 listings with every post type on two platforms. Pro's ${PRO.posts} cover 5 listings at Just Listed and Sold.` },
      { q: "Can I cancel anytime?", a: "Yes. Cancel from Plan & billing in a couple of clicks. Your plan stays active until the end of the billing period." },
      { q: "Will SocialSpark post anything without me?", a: "Never. A post goes out only when you click Publish now or choose a time to schedule it." },
      { q: "Does it work with REALTOR.ca?", a: "REALTOR.ca blocks automated tools, so use “Copy and paste the page”: open the listing, select all, copy, and paste it into SocialSpark. Brokerage and agent websites work with just the link." },
    ],
  },
  planFit: `Every post type on two platforms is at most 12 posts a listing. Top Producer's ${TP.posts} cover at least 4 listings in full; Pro's ${PRO.posts} cover 5 at Just Listed and Sold.`,
  close: { heading: "Your listing posts, back in your hands.", sub: `Paste a link and see your first post in under a minute. ${FREE} free posts, no credit card.` },
};

const STARTER = PAID_PLANS.starter;

/** Persona 2, The Hungry Rookie. The user's copy. */
const NEW_AGENTS: ListiclePage = {
  layout: "listicle",
  slug: "social-media-posts-for-new-real-estate-agents",
  persona: 2,
  audience: "realtor",
  reader: "New real estate agents in Canada, in their first or second year",
  meta: {
    title: "Social Media Posts for New Real Estate Agents",
    description: `New agents: turn a listing link into a branded Instagram, Facebook or LinkedIn post that looks established. ${FREE} free posts, no credit card.`,
  },
  hero: {
    eyebrow: "For new real estate agents",
    headline: "7 reasons your first listing can look like a top producer's",
    sub: "Paste a listing link. SocialSpark builds a branded post and caption with your name and brokerage, for Instagram, Facebook and LinkedIn. Pay only in the months you have a listing.",
  },
  heroPost: "ig-maple",
  cta: "See your first listing as a post",
  reasons: [
    {
      label: "Looks established",
      title: "Your first listing, posted like a top producer's.",
      body: "Paste the link from your brokerage or agent website. SocialSpark pulls in the price, details and photos and builds a designed, branded post in under a minute. No templates to learn, no design skills needed.",
      visual: { kind: "screen", step: 1 },
    },
    {
      label: "Your brand",
      title: "Your name and brokerage on every image.",
      body: "Add your headshot, brokerage and colours once. Every post carries your name, brokerage and colours, and your headshot can close each carousel on the contact slide, so your feed looks consistent from the very first listing, and it shows the brokerage name advertising rules ask for.",
      visual: { kind: "posts", ids: ["ig-harbour", "fb-oakridge"] },
    },
    {
      label: "No listings yet",
      title: "Open houses and Featured posts count too.",
      body: "Hosting a colleague's open house? Make the Open House post. Showcasing a property you're helping with? Featured Property positions you as the local expert. Get the listing agent's OK and permission for the photos first.",
      visual: { kind: "posts", ids: ["fb-maple", "li-harbour"] },
    },
    {
      label: "Your voice",
      title: "Captions that sound like you, not a template.",
      body: "Pick a tone and paste a few of your past posts, even if it's only a handful. SocialSpark follows your style, leads with the selling points that matter, and skips the tired clichés buyers scroll past.",
      visual: { kind: "screen", step: 3 },
    },
    {
      label: "Every stage",
      title: "Coming Soon to Sold, from one link.",
      body: "Six post types cover a listing's whole life: Coming Soon, Just Listed, Open House, Price Reduced, Sold and Featured Property, each written and sized for Instagram, Facebook and LinkedIn.",
      visual: { kind: "posts", ids: ["li-laurier", "ig-oakridge", "fb-maple", "ig-maple"] },
    },
    {
      label: "No mistakes",
      title: "Nothing posts without your click.",
      body: "Captions use only facts from the listing and your notes. They describe the home, never the ideal buyer, which Canadian human rights codes prohibit. Edit any word, then publish when you're ready.",
    },
    {
      label: "The plan",
      title: "Pay in the months you have a listing.",
      body: `Starter is ${STARTER.price} a month plus tax for ${STARTER.posts} posts: enough for one listing on two platforms from Coming Soon to Sold. Subscribe the month you list and cancel in a couple of clicks when you're between listings. Start with ${FREE} free posts.`,
      visual: { kind: "plan" },
    },
  ],
  proof: { heading: "Made with SocialSpark", testimonials: [], stats: [], founder: null },
  comparison: {
    heading: "SocialSpark or a free template?",
    ours: "SocialSpark",
    theirs: "A free template",
    rows: [
      { label: "A finished post", ours: "Under a minute from the link", theirs: "Find a template, retype, write a caption" },
      { label: "Your brand", ours: "Name, brokerage and colours, every time", theirs: "Added by hand" },
      { label: "The caption", ours: "Written from the listing, in your voice", theirs: "From scratch" },
      { label: "Every listing stage", ours: "Six post types from one link", theirs: "Rebuilt for each stage" },
      { label: "Instagram, Facebook, LinkedIn", ours: "Written and sized for each", theirs: "Resized by hand" },
      { label: "Fair-housing wording", ours: "Describes the home, never the buyer", theirs: "Up to you" },
    ],
  },
  offer: { heading: "Everything your first listing needs", sub: `Start with ${FREE} free posts, no credit card. Subscribe the month you list, cancel when it sells.` },
  objections: {
    heading: "Questions new agents ask",
    items: [
      { q: "What should a new real estate agent post on social media?", a: "Post every stage of each listing you have (Coming Soon, Just Listed, Open House, Price Reduced, Sold), and the open houses and Featured Properties you help with, with the listing agent's permission. SocialSpark, a Canadian web app, turns a listing link into a branded post for each in under a minute." },
      { q: "I don't have listings yet. Is it useful?", a: `Yes, for open houses you host and Featured Property posts, with the listing agent's OK and permission for the photos. The ${FREE} free posts let you try it before you pay anything.` },
      { q: "Do I need design skills?", a: "No. Paste a listing link and SocialSpark designs the post with your name, brokerage and colours. You can change text, photos and colours if you want to." },
      { q: "Can I use the listing photos?", a: "Listing photos usually belong to the photographer. Make sure you have permission, usually from your brokerage or the photographer, or upload your own." },
      { q: "Can I cancel when I don't have a listing?", a: "Yes. Cancel from Plan & billing in a couple of clicks. Your plan stays active until the end of the billing period, and you can subscribe again the month you list." },
      { q: "Will SocialSpark post anything without me?", a: "Never. A post goes out only when you click Publish now or choose a time to schedule it." },
      { q: "Does it work with REALTOR.ca?", a: "REALTOR.ca blocks automated tools, so use “Copy and paste the page”: open the listing, select all, copy, and paste it into SocialSpark. Brokerage and agent websites work with just the link." },
    ],
  },
  planFit: `Five post types on two platforms is ${STARTER.posts} posts, so Starter covers one listing from Coming Soon to Sold.`,
  close: { heading: "Your first listing deserves to look like a top producer's.", sub: `Paste the link and see your first post in under a minute. ${FREE} free posts, no credit card.` },
};

/** Persona 8, The Part-Timer. The user's copy. */
const PART_TIME_REALTORS: ListiclePage = {
  layout: "listicle",
  slug: "listing-posts-for-part-time-realtors",
  persona: 8,
  audience: "realtor",
  reader: "Part-time real estate agents in Canada with a few deals a year",
  meta: {
    title: "Listing Posts for Part-Time Realtors",
    description: "Got a listing this month? Paste the link and get branded Instagram, Facebook and LinkedIn posts. Subscribe for the listing, cancel when it sells.",
  },
  hero: {
    eyebrow: "For part-time realtors",
    headline: "7 reasons part-time agents can market a listing like a full-timer",
    sub: "Paste a listing link. SocialSpark builds the branded post and caption for Instagram, Facebook and LinkedIn in under a minute. Subscribe the month you list, cancel when it sells.",
  },
  heroPost: "fb-maple",
  cta: "See your listing as a post",
  reasons: [
    {
      label: "No learning curve",
      title: "Nothing to learn for one listing.",
      body: "No design tool, no templates, no tutorials. Paste the link from your brokerage or agent website and the post is ready in under a minute. That's the whole process.",
      visual: { kind: "screen", step: 1 },
    },
    {
      label: "Do it justice",
      title: "A friend's listing, posted properly.",
      body: "Your name, brokerage and colours on a designed post, with a caption that leads with the home's best selling points. The kind of post that makes a friend glad they listed with you.",
      visual: { kind: "posts", ids: ["ig-harbour", "fb-oakridge"] },
    },
    {
      label: "Every stage",
      title: "Coming Soon to Sold, from the same link.",
      body: "One listing, every stage: Coming Soon, Just Listed, Open House, Price Reduced and Sold. Schedule the Open House post on day one, so it goes out even when you're at your other job.",
      visual: { kind: "posts", ids: ["li-laurier", "ig-oakridge", "fb-maple", "ig-maple"] },
    },
    {
      label: "Scheduling",
      title: "Post while you're at work.",
      body: "Pick a time and SocialSpark publishes to Instagram, Facebook or LinkedIn then. Or post right away. Either way, nothing goes out until you've approved it.",
      visual: { kind: "screen", step: 2 },
    },
    {
      label: "Your voice",
      title: "It sounds like you, even if you rarely post.",
      body: "Pick a tone and paste a few of your past posts. SocialSpark follows your style. Edit any word before it goes out.",
      visual: { kind: "screen", step: 3 },
    },
    {
      label: "Safe by design",
      title: "No surprises.",
      body: "Captions use only facts from the listing and your notes, describe the home rather than the buyer, and never invent walk times or school names. Nothing posts without your click.",
    },
    {
      label: "The plan",
      title: "Pay for the month you list. Cancel when it sells.",
      body: `Starter is ${STARTER.price} a month plus tax for ${STARTER.posts} posts: one listing on two platforms from Coming Soon to Sold. Cancel in a couple of clicks, and your plan stays active until the end of the month you paid for. Start with ${FREE} free posts, no credit card.`,
      visual: { kind: "plan" },
    },
  ],
  proof: { heading: "Made with SocialSpark", testimonials: [], stats: [], founder: null },
  comparison: {
    heading: "SocialSpark or learning a design tool?",
    ours: "SocialSpark",
    theirs: "A design tool",
    rows: [
      { label: "Time to learn", ours: "None: paste a link", theirs: "Templates, tutorials, practice" },
      { label: "A finished post", ours: "Under a minute from the link", theirs: "An evening" },
      { label: "The caption", ours: "Written from the listing", theirs: "Written by you" },
      { label: "Every listing stage", ours: "Six post types from one link", theirs: "Rebuilt for each stage" },
      { label: "Posting during work hours", ours: "Scheduled ahead", theirs: "Posted when you get home" },
    ],
  },
  offer: { heading: "Everything one listing needs, for one month", sub: `Start with ${FREE} free posts, no credit card. Subscribe when you list, cancel when it sells.` },
  objections: {
    heading: "Questions part-time agents ask",
    items: [
      { q: "Is there a social media tool for realtors I can use only when I have a listing?", a: "Yes. SocialSpark's Starter plan is month to month: subscribe the month you list, cancel in a couple of clicks when it sells, and your plan stays active until the end of the period you paid for." },
      { q: "How much does it cost for one listing?", a: `Starter is ${STARTER.price} a month plus tax for ${STARTER.posts} posts, enough for one listing on two platforms from Coming Soon to Sold. Your first ${FREE} posts are free, no credit card.` },
      { q: "Do I need to learn anything?", a: "No. Paste a listing link and SocialSpark builds the designed post and caption. You can edit anything, but you don't have to." },
      { q: "Can I schedule posts while I'm at my other job?", a: "Yes. Choose a time and SocialSpark publishes to Instagram, Facebook or LinkedIn then. Nothing goes out unless you scheduled or published it." },
      { q: "Will SocialSpark post anything without me?", a: "Never. A post goes out only when you click Publish now or choose a time to schedule it." },
      { q: "Does it work with REALTOR.ca?", a: "REALTOR.ca blocks automated tools, so use “Copy and paste the page”: open the listing, select all, copy, and paste it into SocialSpark. Brokerage and agent websites work with just the link." },
    ],
  },
  planFit: `Five post types on two platforms is ${STARTER.posts} posts, so Starter covers your listing from Coming Soon to Sold.`,
  close: { heading: "Got a listing this month? Make it look like you do this every day.", sub: `Paste the link and see your first post in under a minute. ${FREE} free posts, no credit card.` },
};

/** Persona 11, The Small-Town & Cottage Agent. The user's copy. */
const COTTAGE_RURAL_REALTORS: ListiclePage = {
  layout: "listicle",
  slug: "social-media-for-cottage-and-rural-realtors",
  persona: 11,
  audience: "realtor",
  reader: "Cottage, rural and small-town real estate agents in Canada",
  figures: [{ text: "61%", source: "Royal LePage 2026 recreational property report via CP24 and Canadian Mortgage Trends (personas.md [17])" }],
  meta: {
    title: "Social Media for Cottage and Rural Realtors",
    description: "Cottage and rural agents: Facebook albums of up to 20 photos, Featured posts to re-promote slow listings, and tour links, all from one listing link.",
  },
  hero: {
    eyebrow: "For cottage, rural and small-town realtors",
    headline: "7 reasons cottage and rural agents can keep long listings in front of buyers",
    sub: "Paste a listing link. SocialSpark builds a Facebook album of up to 20 photos, or an Instagram carousel, with a caption that sells the property, in under a minute. Re-promote it anytime with a Featured post.",
  },
  heroPost: "fb-maple",
  cta: "See your next listing as a post",
  reasons: [
    {
      label: "Every photo",
      title: "The whole property, in a 20-photo Facebook album.",
      body: "Waterfront, dock, acreage, the view from the deck: a Facebook album shows up to 20 photos in a grid. SocialSpark asks the listing site for the largest version of each photo, so the shoot looks as sharp as it did.",
      visual: { kind: "posts", ids: ["fb-maple", "fb-oakridge"] },
    },
    {
      label: "Long listings",
      title: "Re-promote a slow listing without starting over.",
      body: "61% of cottage-country agents report longer days on market (Royal LePage, 2026). The Featured Property post puts the listing back in your followers' feeds with a fresh angle, from the same link, whenever you want.",
      visual: { kind: "posts", ids: ["li-harbour", "ig-harbour"] },
    },
    {
      label: "The caption",
      title: "More than one line under a phone photo.",
      body: "SocialSpark writes a caption that sells the life and proves it with facts from the listing, like Saturday mornings on the south-facing deck, backed by the deck that's actually there. It never invents distances, school names or neighbourhood claims.",
      visual: { kind: "screen", step: 3 },
    },
    {
      label: "Tours",
      title: "Your 3D or video tour, in the right place.",
      body: "When the listing has a Matterport, iGUIDE or video tour, Facebook and LinkedIn captions include the exact link. On Instagram, where caption links don't work, the caption asks people to DM “TOUR” instead. City buyers can walk through before they drive up.",
    },
    {
      label: "Every stage",
      title: "Coming Soon to Sold, from one link.",
      body: "Coming Soon, Just Listed, Open House, Price Reduced, Sold and Featured Property, all from the same link, for Facebook, Instagram and LinkedIn.",
      visual: { kind: "posts", ids: ["li-laurier", "ig-oakridge", "fb-maple", "ig-maple"] },
    },
    {
      label: "Simple",
      title: "Paste a link. Click post.",
      body: "No design tool to learn. Your name, brokerage and colours go on every image automatically. Check the post, then publish or schedule it. Nothing goes out without your click.",
      visual: { kind: "screen", step: 1 },
    },
    {
      label: "The plan",
      title: "One plan for the whole year.",
      body: `Starter is ${STARTER.yearly} a year plus tax, two months free, for ${STARTER.posts} posts a month: one listing on two platforms from Coming Soon to Sold, every month. Busy spring market? You can move up to Pro anytime from Plan & billing. Try ${FREE} posts free first.`,
      visual: { kind: "plan" },
    },
  ],
  proof: { heading: "Made with SocialSpark", testimonials: [], stats: [], founder: null },
  comparison: {
    heading: "SocialSpark or a phone photo and a line?",
    ours: "SocialSpark",
    theirs: "Phone photo and a line",
    rows: [
      { label: "Photos", ours: "Up to 20 in a Facebook album, at full size", theirs: "One or two" },
      { label: "The caption", ours: "Sells the property with real facts", theirs: "One line" },
      { label: "Your brand", ours: "Name, brokerage and colours on every image", theirs: "None" },
      { label: "Virtual tour", ours: "Linked, or “DM TOUR” on Instagram", theirs: "Often left out" },
      { label: "Re-promoting", ours: "A Featured post from the same link", theirs: "Repost the same photo" },
      { label: "Time", ours: "Under a minute from the link", theirs: "Quick, but it shows" },
    ],
  },
  offer: { heading: "Everything a long listing needs, all year", sub: `Start with ${FREE} free posts, no credit card. Pay yearly and two months are free.` },
  objections: {
    heading: "Questions cottage and rural agents ask",
    items: [
      { q: "How should I market a cottage listing on social media?", a: "Show the whole property and keep it visible. Post a Facebook album with up to 20 photos, link the virtual tour, and re-promote with a Featured post while the listing is active. SocialSpark, a Canadian web app, makes each of these from the listing link." },
      { q: "How do I re-promote a listing that's been on the market a while?", a: "Make a Featured Property post from the same listing link. It showcases the home with a fresh angle and positions you as the local expert, without rebuilding anything." },
      { q: "How many photos can I post?", a: "Facebook album posts show up to 20 photos in a grid. Instagram carousels suit a shorter set. You can reorder, remove or upload photos before you post." },
      { q: "I'm not a tech person. Is this for me?", a: "Yes. Paste the listing link, check the post, and click Publish now or pick a time. There's no design tool to learn." },
      { q: "Is yearly billing worth it?", a: `If you list year-round, yes: Starter yearly is ${STARTER.yearly} plus tax, which is two months free. Pay monthly if your listings are seasonal.` },
      { q: "Will SocialSpark post anything without me?", a: "Never. A post goes out only when you click Publish now or choose a time to schedule it." },
      { q: "Does it work with REALTOR.ca?", a: "REALTOR.ca blocks automated tools, so use “Copy and paste the page”: open the listing, select all, copy, and paste it into SocialSpark. Brokerage and agent websites work with just the link." },
    ],
  },
  planFit: `Five post types on two platforms is ${STARTER.posts} posts, so Starter covers one listing from Coming Soon to Sold each month.`,
  close: { heading: "That cottage deserves more than a phone photo on Facebook.", sub: `Paste the link and see your first post in under a minute. ${FREE} free posts, no credit card.` },
};

/** Persona 12, The Reluctant Veteran. The user's copy (no age references, by the copy's own rule). */
const EXPERIENCED_REALTORS: ListiclePage = {
  layout: "listicle",
  slug: "social-media-for-experienced-realtors",
  persona: 12,
  audience: "realtor",
  reader: "Experienced, referral-based real estate agents in Canada",
  meta: {
    title: "Social Media for Experienced Realtors",
    description: `Your listings, posted properly, without learning Instagram. Captions in your voice, and nothing posts without your click. ${FREE} free posts.`,
  },
  hero: {
    eyebrow: "For experienced realtors",
    headline: "7 reasons experienced realtors can post every listing without learning Instagram",
    sub: "Paste a listing link. SocialSpark builds a professional post and a caption in your own voice, for Facebook, Instagram and LinkedIn. You read it, change anything you like, and nothing posts until you click.",
  },
  heroPost: "fb-oakridge",
  cta: "See your next listing as a post",
  reasons: [
    {
      label: "Listing presentations",
      title: "Show sellers exactly how their home will be marketed.",
      body: "Bring finished posts from your recent listings to your next presentation: a designed Just Listed post, an Open House post, a Sold post, all carrying your name and brokerage. Your experience, with marketing to match.",
      visual: { kind: "posts", ids: ["fb-oakridge", "fb-maple", "ig-maple"] },
    },
    {
      label: "Your voice",
      title: "It writes the way you do.",
      body: "Paste a few of your past posts or listing descriptions. SocialSpark follows your tone and leaves out the clichés, so the caption reads like you wrote it. Change any word before it goes anywhere.",
      visual: { kind: "screen", step: 3 },
    },
    {
      label: "Control",
      title: "Nothing posts without your click.",
      body: "SocialSpark never posts on its own. A post goes out only when you click Publish now or choose a time. Until then it's a draft only you can see.",
    },
    {
      label: "Simple",
      title: "One link. One click.",
      body: "No design tool, no Instagram tricks to learn. Paste the link from your brokerage or agent website, read the post, click Publish now. That's all of it.",
      visual: { kind: "screen", step: 1 },
    },
    {
      label: "Accurate",
      title: "Your facts, not invented ones.",
      body: "Captions use only what's in the listing and your notes. They never invent measurements, school names or walk times, and they describe the home, never the ideal buyer, which Canadian human rights codes prohibit.",
    },
    {
      label: "Every stage",
      title: "Coming Soon to Sold, from one link.",
      body: "Coming Soon, Just Listed, Open House, Price Reduced, Sold and Featured Property, each designed with your name, brokerage and colours, for Facebook, Instagram and LinkedIn.",
      visual: { kind: "posts", ids: ["li-laurier", "ig-oakridge", "fb-maple", "ig-maple"] },
    },
    {
      label: "The plan",
      title: "One decision for the year.",
      body: `Starter is ${STARTER.yearly} a year plus tax, two months free, for ${STARTER.posts} posts a month: one listing on two platforms from Coming Soon to Sold, every month. Decide once, then just paste links. Try ${FREE} posts free first.`,
      visual: { kind: "plan" },
    },
  ],
  proof: { heading: "Made with SocialSpark", testimonials: [], stats: [], founder: null },
  comparison: {
    heading: "SocialSpark or learning social media yourself?",
    ours: "SocialSpark",
    theirs: "Learning it yourself",
    rows: [
      { label: "What to learn", ours: "Paste a link", theirs: "Design tools, sizes, hashtags" },
      { label: "The caption", ours: "In your voice, from the listing", theirs: "Written from scratch" },
      { label: "Who posts", ours: "Only you, when you click", theirs: "You, once you've worked it out" },
      { label: "Your brand", ours: "Name, brokerage and colours, automatically", theirs: "Added by hand" },
      { label: "Accuracy", ours: "Facts from the listing only", theirs: "Up to you" },
      { label: "In a listing presentation", ours: "Finished examples to show", theirs: "Plans to describe" },
    ],
  },
  offer: { heading: "Everything your listings need, decided once", sub: `Start with ${FREE} free posts, no credit card. Pay yearly and two months are free.` },
  objections: {
    heading: "Questions experienced agents ask",
    items: [
      { q: "How can an experienced realtor improve their social media without learning it?", a: "Start from the listing link. SocialSpark, a Canadian web app, turns it into a designed post and a caption in your own voice for Facebook, Instagram or LinkedIn, and posts it only when you click." },
      { q: "I don't trust AI to post for me. Does it?", a: "No. SocialSpark never posts on its own. You read every caption, change anything, and the post goes out only when you click Publish now or schedule it." },
      { q: "Will it sound like me?", a: "Yes. Paste a few of your past posts or listing descriptions, and SocialSpark follows your tone. You can edit every word." },
      { q: "Can I use it in listing presentations?", a: "Yes. Make posts for your recent listings and show sellers exactly how their home will look on social media, with your name and brokerage on every image." },
      { q: "Can someone in my office set it up for me?", a: "Yes. Sign in once together: SocialSpark emails you a one-time code, no password, and your assistant or office administrator adds your branding and voice samples. After that, it's paste a link and click." },
      { q: "Is yearly billing worth it?", a: `If you list most months, yes: Starter yearly is ${STARTER.yearly} plus tax, which is two months free, and one decision for the year.` },
      { q: "Does it work with REALTOR.ca?", a: "REALTOR.ca blocks automated tools, so use “Copy and paste the page”: open the listing, select all, copy, and paste it into SocialSpark. Brokerage and agent websites work with just the link." },
    ],
  },
  planFit: `Five post types on two platforms is ${STARTER.posts} posts, so Starter covers one listing from Coming Soon to Sold each month.`,
  close: { heading: "Your listings, posted properly, without learning Instagram.", sub: `Paste the link and see your first post in under a minute. ${FREE} free posts, no credit card.` },
};

export const PERSONA_PAGES: PersonaPage[] = [TOP_PRODUCERS, CONDO_REALTORS, MARKETING_COORDINATORS, BILINGUAL_AGENTS_FR, BILINGUAL_AGENTS_EN, OUTSOURCING_AGENTS, NEW_AGENTS, PART_TIME_REALTORS, COTTAGE_RURAL_REALTORS, EXPERIENCED_REALTORS];

export function personaPage(slug: string) {
  return PERSONA_PAGES.find((p) => p.slug === slug);
}
