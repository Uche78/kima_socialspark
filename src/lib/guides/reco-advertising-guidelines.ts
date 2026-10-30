import { FREE_LIMITS } from "../plans";
import type { Guide } from "./index";

export const recoAdvertisingGuidelines: Guide = {
  slug: "reco-advertising-guidelines",
  keyword: "reco advertising guidelines",
  alsoAnswers: [
    "reco advertising rules",
    "reco social media advertising rules",
    "reco bulletin 5.1",
    "what are reco's advertising rules",
    "realtor social media rules ontario",
  ],
  audience: "realtor",
  cluster: "Rules and compliance",
  meta: {
    title: "RECO Advertising Guidelines: Rules for Ontario Realtors",
    description: "What RECO requires in your advertising as an Ontario realtor: brokerage ID, permitted terms, social media rules, sold-listing consent and penalties.",
  },
  h1: "RECO advertising guidelines for Ontario realtors, explained bulletin by bulletin",
  dek: "What RECO's own bulletins require for brokerage identification, permitted terms, social media, sold listings and the penalties for getting it wrong.",
  answer:
    "RECO requires every Ontario real estate ad, including social media, to clearly show the brokerage name and the agent's RECO-registered name and title, with no nicknames. REALTOR® is reserved for CREA members. Advertising a property as sold needs the parties' written consent, with start and end dates. Personal Real Estate Corporations can't advertise on their own. Breaking these rules can mean a fine of up to $50,000 for an agent or $100,000 for a brokerage.",
  published: "2026-10-30",
  updated: "2026-10-30",
  sections: [
    {
      heading: "What RECO's advertising rules cover, and why they reach social media",
      blocks: [
        {
          type: "p",
          text: "RECO (the Real Estate Council of Ontario) regulates every registrant under the Trust in Real Estate Services Act, or TRESA, which took effect December 1, 2023. Its advertising rules sit in a set of numbered bulletins, each covering one part of advertising: identification, permitted terms, online advertising, and advertising a sold property.",
        },
        {
          type: "p",
          text: "A post about a listing is advertising under TRESA, the same as a yard sign or a newspaper ad. RECO's [Bulletin 5.3](https://www.reco.on.ca/agents-and-brokerages/reco-bulletins/reco-bulletin-5-3-advertising-online/) says this directly: the same advertising requirements apply online and on social media as everywhere else, and a brokerage is responsible for every agent's advertising it employs, including on websites and social accounts it doesn't manage itself.",
        },
        {
          type: "tip",
          label: "Not legal advice",
          text: "This guide explains what RECO's bulletins say. Your brokerage's compliance officer and RECO have the final word on your specific post.",
        },
      ],
    },
    {
      heading: "How to identify yourself and your brokerage in every ad",
      blocks: [
        {
          type: "p",
          text: "[RECO Bulletin 5.1](https://www.reco.on.ca/agents-and-brokerages/reco-bulletins/reco-bulletin-5-1-advertising-requirements/) sets the baseline every other bulletin builds on.",
        },
        {
          type: "steps",
          items: [
            { title: "Name the brokerage, clearly and prominently", body: "Every ad must show the brokerage's name as registered with RECO, with the descriptor \"brokerage\" or \"real estate brokerage\". Bulletin 5.1 warns against a brokerage name in small text under a large personal logo: it still has to be prominent, not just present." },
            { title: "Use your registered name, not a nickname", body: "If an ad names you, use the exact name RECO has on file. \"Jon\" for a RECO-registered \"Jonathan\" isn't allowed, even if that's what your clients call you." },
            { title: "Pair your name with a permitted term", body: "Every mention of you needs one of the terms in the table below, matching your registration category. Teams get no exception: each member is named with their own registered term, and the brokerage still has to appear." },
            { title: "Make every claim checkable", body: "Sales volume, rankings and awards must be factually correct and verifiable; a comparative claim like \"top producer in the office\" needs a stated basis, and a team award must say the result is shared and give the team's size." },
          ],
        },
        {
          type: "example",
          label: "A compliant sign-off",
          text: "Jane Doe, REALTOR® | ABC Realty Inc.\n\nListing courtesy of XYZ Realty Inc. (if it's another brokerage's listing)",
        },
      ],
    },
    {
      heading: "The exact terms you're allowed to use",
      blocks: [
        {
          type: "p",
          text: "[RECO Bulletin 5.2](https://www.reco.on.ca/agents-and-brokerages/reco-bulletins/reco-bulletin-5-2-permitted-terms/) lists the only descriptors each registration category can advertise under.",
        },
        {
          type: "table",
          caption: "Permitted terms by registration category",
          head: ["Registration", "Permitted terms"],
          rows: [
            ["Salesperson", "Salesperson, real estate salesperson, sales representative, real estate agent, real estate sales representative, or REALTOR®/REALTOR® salesperson (CREA members only)"],
            ["Broker", "Broker, real estate broker, broker real estate agent, or REALTOR® broker (CREA members only)"],
            ["Broker of record", "Broker of record, specifically, with no substitute term"],
            ["Personal Real Estate Corporation (PREC)", "None: a PREC can't advertise, or represent itself as trading in real estate, under its own name"],
          ],
        },
        {
          type: "tip",
          label: "REALTOR® isn't a job title",
          text: "REALTOR® is a [CREA trademark](https://www.crea.ca/cafe/everything-you-need-to-know-about-creas-trademarks-2/) that identifies CREA members, capitalized with the ® symbol on first use. A RECO-registered salesperson who isn't a CREA member can't use it, in a post or anywhere else.",
        },
      ],
    },
    {
      heading: "The rules for social media specifically",
      blocks: [
        {
          type: "p",
          text: "Bulletin 5.3 adds rules aimed at exactly how social media works, beyond \"the same rules apply online\":",
        },
        {
          type: "list",
          items: [
            "**A mixed personal and business account still counts.** If you post real estate content from a personal account, every one of those posts has to meet the same advertising requirements as your business account.",
            "**Your brokerage has to be readily visible on the profile itself**, not just somewhere in a post: in the account's bio, display name or cover image, so it's accessible without reading every caption.",
            "**A team website or page still needs the employing brokerage's name prominently displayed**, so a team name alone doesn't read as its own brokerage.",
            "**You're responsible for a third-party-managed site, too.** Handing your website to a marketing company doesn't shift the duty to keep it current and accurate off you or your brokerage.",
            "**A link to another site needs to say so.** If you link out to a site you're not affiliated with, say that, so the link doesn't imply an endorsement that isn't there.",
          ],
        },
      ],
    },
    {
      heading: "How to advertise a sold listing without breaking consent rules",
      blocks: [
        {
          type: "p",
          text: "[RECO Bulletin 5.4](https://www.reco.on.ca/agents-and-brokerages/reco-bulletins/reco-bulletin-5-4-advertising-sold-property) covers advertising that a property has sold, including a Sold post, a sign rider or a caption that mentions the result.",
        },
        {
          type: "table",
          caption: "Written consent needed to advertise a sold property",
          head: ["What the ad shows", "Before closing", "After closing"],
          rows: [
            ["Just that the property sold, no price or terms", "Seller's consent", "Buyer's consent"],
            ["The price or any terms of the deal", "Both seller's and buyer's consent", "Both seller's and buyer's consent"],
          ],
        },
        {
          type: "steps",
          items: [
            { title: "Decide what the post actually shows", body: "\"Sold!\" with no price needs less consent than \"Sold over asking\" or any number. Check the table above against exactly what your caption and image say." },
            { title: "Get it in writing, with dates", body: "Bulletin 5.4 requires the consent to state the date it takes effect and the date it expires. A verbal \"sure, go ahead\" from a past client doesn't meet this." },
            { title: "Route contact through the other side's agent", body: "If the other party is represented, reach them through their agent unless you already have their direct consent to contact them." },
            { title: "Take the post down by the expiry date", body: "Bulletin 5.3 extends this to online content directly: a photo or video can't stay up past the date in the written consent. A Sold post from eighteen months ago, still live on a profile grid, is a common way agents fall out of compliance without posting anything new." },
          ],
        },
      ],
    },
    {
      heading: "Do RECO's rules cover testimonials and client photos?",
      blocks: [
        {
          type: "p",
          text: "Not under a bulletin of their own, but two existing rules reach them directly. Bulletin 5.1's accuracy requirement means a testimonial has to be genuine and not cherry-picked to mislead; Bulletin 5.3's consent requirement means a client's name or photo in a review post needs their written consent, the same as a buyer's or seller's name in a Sold post.",
        },
        {
          type: "p",
          text: "In practice: ask before you post a client's quote with their name or photo attached, and don't publish a testimonial that implies a result (\"got us $50,000 over asking\") without the same consent a Sold post would need for that number.",
        },
      ],
    },
    {
      heading: "What happens if you break RECO's advertising rules",
      blocks: [
        {
          type: "p",
          text: "RECO's Discipline and Appeals Committee can act on any contravention of TRESA or its regulations, which includes the advertising bulletins. For conduct on or after December 1, 2023, a panel can order a fine of up to $50,000 for a salesperson or broker, or up to $100,000 for a brokerage, on top of required education, conditions on your registration, or suspension or revocation of it.",
        },
        {
          type: "p",
          text: "Most advertising complaints start small: a competing agent, a past client or a member of the public flags a post to RECO, often over a missing brokerage name or an unconsented Sold claim. Fixing the post doesn't make the complaint disappear once it's filed, which is why catching these before posting is cheaper than catching them after.",
        },
      ],
    },
    {
      heading: "Mistakes that trigger a RECO complaint",
      blocks: [
        {
          type: "list",
          items: [
            "**The brokerage name is there, but too small to read.** Bulletin 5.1's \"clearly and prominently\" standard is about what a viewer actually notices, not what's technically present.",
            "**A nickname instead of the registered name.** Even one that's been on your business cards for years isn't a substitute for what's on file with RECO.",
            "**REALTOR® used by a non-CREA-member registrant**, often copied from a template without checking.",
            "**A Sold post left up past the consent's expiry date.** The post didn't change; the clock ran out on it.",
            "**A PREC's name used as if it were the registrant**, instead of the individual's RECO-registered name and brokerage.",
            "**A personal account posting listings with no brokerage anywhere on the profile**, even though every post is, functionally, real estate advertising.",
          ],
        },
      ],
    },
    {
      heading: "How to keep every SocialSpark post RECO-compliant",
      blocks: [
        {
          type: "p",
          text: "SocialSpark can't make a post compliant on your behalf, since compliance depends on your registration, your brokerage's policy and what's actually in the post. What it does is remove the easiest ways to miss the baseline:",
        },
        {
          type: "steps",
          items: [
            { title: "Set your name, title and brokerage once", body: "In your profile: your full name, your registration title and your brokerage name. Every post pulls from there, so you're not retyping it and risking a typo or an old brokerage name." },
            { title: "Every image shows your details", body: "The post design renders your name, brokerage and contact details on the image itself, not buried only in the caption." },
            { title: "Every caption ends with your sign-off", body: "Generated captions close with your identification on its own line, for example \"Jane Doe, REALTOR® | ABC Realty Inc.\", and add \"Listing courtesy of\" when the listing belongs to another brokerage." },
            { title: "Review before you publish", body: "Nothing goes out automatically. Check the post against the rules above, particularly consent for a Sold post, before you click publish." },
          ],
        },
        {
          type: "visual",
          visual: { kind: "screen", step: 2, caption: "Setting the post language and type in SocialSpark; the name, title and brokerage come from the saved profile." },
        },
        {
          type: "p",
          text: `Your first ${FREE_LIMITS.registered} listings are free, with ${FREE_LIMITS.captionsPerListing} posts each and no credit card. For the caption and image details themselves, see [just listed post ideas](/guides/just-listed-post-ideas) or [the plans](/pricing) if you post often.`,
        },
      ],
    },
  ],
  faq: [
    {
      q: "Do RECO's advertising rules apply to my personal Instagram account?",
      a: "Yes. RECO Bulletin 5.3 says a mixed personal and business account still has to meet the same advertising requirements for every post about trading in real estate, not just on a dedicated business account.",
    },
    {
      q: "Can I use a nickname instead of my RECO-registered name in a post?",
      a: "No. Bulletin 5.1 requires the exact name registered with RECO, with no short forms or nicknames, even one your clients already know you by.",
    },
    {
      q: "Can a Personal Real Estate Corporation (PREC) advertise under its own name?",
      a: "No. RECO Bulletin 5.2 says a PREC can't advertise, or otherwise represent itself as trading in real estate, on its own; advertising still runs under the individual's RECO-registered name and brokerage.",
    },
    {
      q: "Do I need written consent for a testimonial or a client's photo?",
      a: "RECO has no bulletin specifically on testimonials, but a client's name or photo in a post needs their written consent under Bulletin 5.3, and the claim in the testimonial still has to meet Bulletin 5.1's accuracy rule.",
    },
    {
      q: "Can I call myself a REALTOR® if I'm not a CREA member?",
      a: "No. REALTOR® is a CREA trademark limited to CREA members in good standing. A RECO-registered salesperson or broker who isn't a CREA member uses a different permitted term instead.",
    },
    {
      q: "How long can a listing photo or video stay online after I get consent?",
      a: "Only until the expiry date stated in the written consent. RECO Bulletin 5.3 says the content has to come down by then, and a brokerage is expected to actively check for and remove what's expired.",
    },
    {
      q: "What's the maximum fine for breaking RECO's advertising rules?",
      a: "Up to $50,000 for a salesperson or broker, or $100,000 for a brokerage, for conduct on or after December 1, 2023, on top of possible education requirements, conditions or suspension.",
    },
  ],
  related: ["just-listed-post-ideas", "real-estate-captions-for-instagram", "open-house-social-media-post"],
  cta: {
    heading: "See your name, title and brokerage on every post",
    sub: "Paste a listing link. SocialSpark puts your registered name, title and brokerage on the image and ends the caption with your sign-off, ready to review before you publish.",
  },
  sources: [
    { label: "RECO Bulletin 5.1: Advertising requirements", url: "https://www.reco.on.ca/agents-and-brokerages/reco-bulletins/reco-bulletin-5-1-advertising-requirements/" },
    { label: "RECO Bulletin 5.2: Permitted terms", url: "https://www.reco.on.ca/agents-and-brokerages/reco-bulletins/reco-bulletin-5-2-permitted-terms/" },
    { label: "RECO Bulletin 5.3: Advertising online", url: "https://www.reco.on.ca/agents-and-brokerages/reco-bulletins/reco-bulletin-5-3-advertising-online/" },
    { label: "RECO Bulletin 5.4: Advertising sold property", url: "https://www.reco.on.ca/agents-and-brokerages/reco-bulletins/reco-bulletin-5-4-advertising-sold-property/" },
    { label: "RECO: Discipline and Appeals Committee, a registrant's guide (for offences after 1 December 2023)", url: "https://www.reco.on.ca/enforcement/if-you-are-the-subject-of-a-complaint/if-you-are-involved-in-a-discipline-hearing/registrant-guide-to-discipline-appeal-hearings/" },
    { label: "CREA: Everything you need to know about CREA's trademarks", url: "https://www.crea.ca/cafe/everything-you-need-to-know-about-creas-trademarks-2/" },
  ],
  figures: [
    { text: "$50,000", source: "RECO: Discipline and Appeals Committee, a registrant's guide (for offences after 1 December 2023)" },
    { text: "$100,000", source: "RECO: Discipline and Appeals Committee, a registrant's guide (for offences after 1 December 2023)" },
  ],
};
