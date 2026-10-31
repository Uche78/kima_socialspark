import { FREE_LIMITS } from "../plans";
import type { Guide } from "./index";

export const realEstateMarketingPlan: Guide = {
  slug: "real-estate-marketing-plan",
  keyword: "real estate marketing plan",
  alsoAnswers: [
    "real estate marketing schedule",
    "real estate marketing calendar",
    "social media marketing plan for realtors",
    "real estate marketing plan template",
    "weekly marketing plan for realtors",
  ],
  audience: "realtor",
  cluster: "Listing marketing",
  meta: {
    title: "Real Estate Marketing Plan: A Weekly Schedule to Copy",
    description: "What a real estate marketing plan needs, a weekly social media schedule you can copy, and how often Canadian realtors should actually post.",
  },
  h1: "A real estate marketing plan for Canadian realtors, with a weekly posting schedule",
  dek: "What a marketing plan needs to include, a weekly social media schedule you can copy, and how it changes for a new agent, a busy one, or a team.",
  answer:
    "A real estate marketing plan sets what you'll actually do every week, not just what you hope to do: your audience, your channels, a budget, and a schedule you'll keep. For social media, that means three posts a week as a baseline, split across a listing, something local or useful, and a weekend reminder, each on a fixed day so it survives a busy week. Scale it down to one post a week for a single listing a month, or up for a full pipeline.",
  published: "2026-10-31",
  updated: "2026-10-31",
  sections: [
    {
      heading: "What a real estate marketing plan needs to include",
      blocks: [
        {
          type: "p",
          text: "Most templates for a real estate marketing plan ask for the same handful of things, in roughly this order: who you're trying to reach, the one message you want them to remember, which channels you'll actually run, a budget, and how you'll check what's working. [HousingWire's marketing-plan guide](https://www.housingwire.com/articles/real-estate-marketing-plan/) lays this out as nine steps, starting with a clear goal and ending with tracking results and adjusting.",
        },
        {
          type: "list",
          items: [
            "**Your audience and area.** The listings, price range and neighbourhoods you actually work, not \"everyone looking to buy or sell.\"",
            "**One message.** What you want someone to remember about working with you, stated plainly enough to repeat in a caption.",
            "**Your channels.** For most Canadian agents, that's Instagram, Facebook and LinkedIn; pick what your audience actually uses, not every platform that exists.",
            "**A schedule.** The part every plan needs and most skip: which day, which post, every week.",
            "**A way to check what worked.** Which posts got messages, not just likes.",
          ],
        },
        {
          type: "tip",
          label: "Plan in chunks, not all at once",
          text: "HousingWire's own suggestion is to plan content a quarter at a time: \"sit down once a quarter … and get your creative juices flowing,\" then work from that for the next 90 days instead of starting from nothing each week.",
        },
      ],
    },
    {
      heading: "A weekly social media schedule you can copy",
      blocks: [
        {
          type: "p",
          text: "The baseline most sources agree on is three posts a week. [Reallyo's \"3-3-3 rule\"](https://www.reallyo.com/blog/real-estate-social-media-marketing) puts it simply: post three times a week, across three content types, and engage with three other accounts for every post you make. Three content types beats three of the same post, because a feed of only listings reads as an ad, not an agent.",
        },
        {
          type: "table",
          caption: "A three-post weekly schedule",
          head: ["Day", "Post", "Why this day"],
          rows: [
            ["Monday", "A listing: new, a price change, or an existing active listing reposted as Featured Property", "Early in the week, while people are planning weekend viewings"],
            ["Wednesday", "Local or useful content: a market stat you've checked, a neighbourhood fact, a buying or selling tip", "Keeps you visible to people who aren't actively buying or selling yet"],
            ["Friday or Saturday", "An open house reminder, a sold update, or a client story (with consent)", "Timed to the weekend, when most showings and open houses happen"],
          ],
        },
        {
          type: "p",
          text: "Reallyo also suggests a 50/30/20 split for the posts themselves: about half useful or educational, 30% personal and relatable, and 20% promotional. A feed that's all promotion reads as advertising; one that's never promotional never asks for the business.",
        },
        {
          type: "visual",
          visual: {
            kind: "posts",
            ids: ["ig-maple", "li-laurier"],
            caption: "A Sold update and a Coming Soon teaser, made with SocialSpark: two of the three weekly post types that keep a feed from being only listings.",
          },
        },
      ],
    },
    {
      heading: "How often should you post on social media?",
      blocks: [
        {
          type: "p",
          text: "Three times a week is the floor, not the ceiling. If you've got more than one listing moving at once, Open House, Price Reduced and Sold posts for each one fill extra days without inventing content: a single active listing can carry three or four posts across its time on the market before it needs new material.",
        },
        {
          type: "p",
          text: "Posting less than three times a week is where most plans actually fail, not from a lack of ideas but because nothing forces the post to happen on a specific day. Pick fixed days (Monday, Wednesday, Saturday, or whatever fits your week) and treat them the way you'd treat a showing: booked in advance, not squeezed in if there's time.",
        },
      ],
    },
    {
      heading: "What to post when you have no new listing",
      blocks: [
        {
          type: "p",
          text: "Most weeks don't have a new listing in them, and that's the week a plan without a schedule falls apart. A few options that don't need a new listing to work:",
        },
        {
          type: "list",
          items: [
            "**Repost an active listing as a Featured Property.** Same listing, a different angle and caption, without implying it's new.",
            "**A local fact you've checked**, not a guess: a new business opening, a transit change, a park reopening.",
            "**A past sale's story**, with the parties' consent to reference it, aimed at the next seller rather than the last buyer.",
            "**Answer a question you actually get**, like what a specific fee covers or how showings work in your market.",
          ],
        },
        {
          type: "tip",
          label: "Keep it checkable",
          text: "Every one of these still has to be a fact you've verified, not a guess dressed up as local knowledge. \"The new café on Main opens next month\" needs the same care as a listing's square footage.",
        },
      ],
    },
    {
      heading: "How the plan changes for a new agent, a busy one, or a team",
      blocks: [
        {
          type: "p",
          text: "The three-post schedule above assumes a steady flow of listings and content. Most agents don't start there.",
        },
        {
          type: "list",
          items: [
            "**New or part-time, with one listing a month:** one post a week is enough. Get three or four angles out of that one listing instead of forcing new content, and reuse the same caption across Instagram and Facebook with small changes. See [social media posts for new real estate agents](/for/social-media-posts-for-new-real-estate-agents) or [listing posts for part-time realtors](/for/listing-posts-for-part-time-realtors).",
            "**Busy, with several listings a month:** the full weekly schedule above, with a listing post most weeks instead of filler content.",
            "**A team or a top producer:** the same schedule run across more listings and more platforms at once; batching captions ahead of the week matters more than adding new content types. See [social media for top-producing realtors](/for/social-media-for-top-producing-realtors).",
          ],
        },
        {
          type: "p",
          text: "A mortgage broker's version of this plan runs on the same weekly cadence, with a feature sheet in place of a listing post: see [mortgage broker marketing](/mortgage-brokers).",
        },
      ],
    },
    {
      heading: "The Canadian rules a marketing plan has to follow",
      blocks: [
        {
          type: "p",
          text: "A posting schedule doesn't change what counts as advertising. Every post in your plan is still subject to your provincial regulator's rules, the same as a sign or a print ad.",
        },
        {
          type: "list",
          items: [
            "**Name your brokerage, clearly and prominently, on every post.** In Ontario, [RECO Bulletin 5.1](https://www.reco.on.ca/agents-and-brokerages/reco-bulletins/reco-bulletin-5-1-advertising-requirements/) requires it, and [Bulletin 5.3](https://www.reco.on.ca/agents-and-brokerages/reco-bulletins/reco-bulletin-5-3-advertising-online/) applies the same requirement to social media, including a personal account you also post listings from. For the full set of rules, see [RECO advertising guidelines](/guides/reco-advertising-guidelines).",
            "**Write REALTOR® correctly.** It's a [CREA trademark](https://www.crea.ca/cafe/everything-you-need-to-know-about-creas-trademarks-2/) for members, not a job title; capitals and the ® symbol on first use.",
            "**Calendar around Canadian observances, not American ones**, if you're planning content by month. A U.S. holiday calendar doesn't match Canadian Thanksgiving, Victoria Day or Canada Day.",
          ],
        },
      ],
    },
    {
      heading: "How to turn this week's plan into posts from a listing link",
      blocks: [
        {
          type: "p",
          text: "A schedule only works if filling each day's slot is fast enough to actually happen. SocialSpark writes the post from the listing itself, so Monday's listing post doesn't turn into an hour with a photo editor:",
        },
        {
          type: "steps",
          items: [
            { title: "Paste the listing link", body: "From your brokerage or agent website. SocialSpark imports the price, details, features and photos. REALTOR.ca blocks automated tools, so for those listings, copy and paste the page instead." },
            { title: "Pick the day's post type", body: "Just Listed, Open House, Price Reduced, Coming Soon, Sold or Featured Property, whichever slot it's filling this week, for Instagram, Facebook or LinkedIn." },
            { title: "Edit, then publish or schedule", body: "You get a branded image and a caption in your voice. Change anything, download it, or schedule it for the day you picked. Nothing goes out without your click." },
          ],
        },
        {
          type: "visual",
          visual: { kind: "screen", step: 2, caption: "Choosing the post type and platform for this week's slot in SocialSpark." },
        },
        {
          type: "p",
          text: `Your first ${FREE_LIMITS.registered} listings are free, with ${FREE_LIMITS.captionsPerListing} posts each and no credit card, enough to run a few weeks of the schedule above. See [the plans](/pricing) if you're posting every week.`,
        },
      ],
    },
  ],
  faq: [
    {
      q: "How many social media posts should a real estate marketing plan include each week?",
      a: "Three is the baseline most sources agree on, split across a listing post, something local or useful, and a weekend reminder or update. Busy agents with several listings moving can add more without inventing content, by posting each listing's stages separately.",
    },
    {
      q: "What's the difference between a marketing plan, a marketing schedule and a marketing calendar?",
      a: "A plan sets the strategy: your audience, message, channels and budget. A schedule or calendar is the execution: which specific days you post what. A plan without a schedule rarely survives a busy week.",
    },
    {
      q: "What should I post when I don't have a new listing?",
      a: "Repost an active listing as a Featured Property with a new angle, share a local fact you've checked, tell a past sale's story with consent, or answer a question clients actually ask you.",
    },
    {
      q: "Does a real estate marketing plan need a budget?",
      a: "Most templates include one, even a small one, since it forces a choice between channels instead of trying to run all of them. If you're only using organic social media and your own time, that budget can be nothing but the time itself.",
    },
    {
      q: "Do mortgage brokers need a different marketing plan?",
      a: "The same weekly cadence works, with a mortgage feature sheet in place of a listing post. The channels, schedule and content mix stay the same.",
    },
    {
      q: "What Canadian rules does my social media schedule need to follow?",
      a: "Every post is still advertising under your provincial regulator's rules: your brokerage name has to be clearly shown, REALTOR® is reserved for CREA members, and a Sold post needs the parties' written consent. See RECO advertising guidelines for Ontario's specifics.",
    },
  ],
  related: ["just-listed-post-ideas", "real-estate-facebook-post-ideas", "reco-advertising-guidelines"],
  cta: {
    heading: "Fill this week's slot in minutes",
    sub: "Paste a listing link and pick the post type this week's schedule calls for. SocialSpark writes the caption and lays out the image, ready to review.",
  },
  sources: [
    { label: "HousingWire: Build Your Real Estate Marketing Plan in 9 Steps (+ Template)", url: "https://www.housingwire.com/articles/real-estate-marketing-plan/" },
    { label: "Reallyo: Real Estate Social Media Marketing: 30 Ideas & the 3-3-3 Rule", url: "https://www.reallyo.com/blog/real-estate-social-media-marketing" },
    { label: "RECO Bulletin 5.1: Advertising requirements", url: "https://www.reco.on.ca/agents-and-brokerages/reco-bulletins/reco-bulletin-5-1-advertising-requirements/" },
    { label: "RECO Bulletin 5.3: Advertising online", url: "https://www.reco.on.ca/agents-and-brokerages/reco-bulletins/reco-bulletin-5-3-advertising-online/" },
    { label: "CREA: Everything you need to know about CREA's trademarks", url: "https://www.crea.ca/cafe/everything-you-need-to-know-about-creas-trademarks-2/" },
  ],
};
