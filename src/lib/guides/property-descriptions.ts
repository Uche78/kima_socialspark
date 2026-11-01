import { FREE_LIMITS } from "../plans";
import type { Guide } from "./index";

export const propertyDescriptions: Guide = {
  slug: "property-descriptions",
  keyword: "property descriptions",
  alsoAnswers: [
    "how to write a property description",
    "property description examples",
    "property description template",
    "listing description examples",
    "real estate description examples",
    "what to include in a property description",
  ],
  audience: "realtor",
  cluster: "Captions and copy",
  meta: {
    title: "Property Descriptions: How to Write One, With Examples",
    description: "A room-by-room structure, two Canadian examples to copy, the words that break human rights rules, and how to turn the same description into a social caption.",
  },
  h1: "How to write a property description, with Canadian examples",
  dek: "What to include, two full examples to copy, the words that break Canada's human rights rules, and how to turn the same description into a social caption.",
  answer:
    "A property description leads with the home's single strongest feature, then moves room by room through the facts a buyer compares — bedrooms, bathrooms, square footage, upgrades with their year — before closing with the neighbourhood and a clear next step. Keep it to the character limit your real estate board sets, describe the property rather than the kind of person who'd live there, and save a shorter, punchier version for social media.",
  published: "2026-11-01",
  updated: "2026-11-01",
  sections: [
    {
      heading: "What a property description has to do",
      blocks: [
        {
          type: "p",
          text: "A property description is read by more people than any caption you'll write for the same listing: it runs on the MLS® System, your brokerage's website, the portals that pull from it, and every other agent deciding whether to show it to their buyer. It has one job: get a qualified buyer to book a showing, without promising anything the home doesn't deliver.",
        },
        {
          type: "p",
          text: "That's different from a social caption, which gets a few seconds and a photo doing most of the work. A property description gets read by someone already looking, so it can carry more detail: the upgrade dates, the lot size, the school catchment if you've checked it. Write it once, well, and the caption becomes the five-second version of it.",
        },
      ],
    },
    {
      heading: "How to write a property description",
      blocks: [
        {
          type: "steps",
          items: [
            { title: "Gather the facts before you write", body: "At the listing appointment, ask the seller what they'd miss most about the home — it's often the detail a buyer would otherwise never learn, like a furnace replaced in 2023 or a neighbour who waves at everyone." },
            { title: "Pick one hook for the first sentence", body: "The feature a buyer would mention to a friend: a heated saltwater pool, a finished basement with its own entrance, a kitchen renovated last year. Not \"Welcome home\" — that fits every listing." },
            { title: "Move through the home in a logical order", body: "Front to back, or floor by floor, the way a showing actually goes. A reader who's mentally walking through the house won't lose track of which room you mean." },
            { title: "Turn each feature into a benefit", body: "A pool is a feature; swimming every evening in July is the benefit. State the fact, then the one line on why it matters, and stop there." },
            { title: "Name the neighbourhood specifics you've checked", body: "The park at the end of the street, the transit stop, the drive to the highway. Skip anything you haven't verified yourself." },
            { title: "Put anything a buyer needs to know up front", body: "A sold-as-is condition or a pending assessment belongs in its own short line, not buried after the kitchen description, so nobody books a showing on a false impression." },
            { title: "Cut it to your board's character limit", body: "Every MLS system caps the public-remarks field, and the cap differs by board. Write long first, then cut the sentence that repeats a fact already on the listing (price, address) rather than the one carrying your hook." },
            { title: "Read it back as a buyer would", body: "Out loud, once. A sentence that trips when spoken usually reads as filler on the page too." },
          ],
        },
        {
          type: "tip",
          label: "For a condo",
          text: "Mention the monthly maintenance fee and what it covers (heat, water, the gym), and the yearly property tax if you have it. Canadian condo buyers weigh these against the price; a description that skips them gets the \"what's the fee?\" message instead of a showing.",
        },
      ],
    },
    {
      heading: "Property description examples to copy",
      blocks: [
        {
          type: "p",
          text: "These use the same demo listings as the rest of this site's guides, so you can compare the long-form description below to the short Instagram caption in [real estate captions for Instagram](/guides/real-estate-captions-for-instagram). Swap in your own facts and keep the shape: hook, room by room, neighbourhood, call to action.",
        },
        {
          type: "example",
          label: "Detached home, Oakville",
          text: "Saturday mornings start at the heated saltwater pool in this 5-bedroom, 4.5-bathroom home on a quiet Oakville street, with 3,850 sq. ft. to spread out in.\n\nThe main floor opens from a kitchen built for hosting — gas range, an island that seats five — through to a family room with a gas fireplace and a walk-out to the backyard and pool deck. Upstairs, the primary suite has a five-piece ensuite and a walk-in closet, and three more bedrooms share two renovated bathrooms (new in 2024).\n\nThe finished basement has a separate entrance, suited to a home office or a teenager's own space. Ten minutes to the GO station, and a five-minute walk to the elementary school.\n\nBook a private showing to see the backyard in person.",
        },
        {
          type: "example",
          label: "Condo, Harbour Street",
          text: "A corner suite on Toronto's waterfront, with lake views from both the living room and the primary bedroom.\n\n940 sq. ft., 2 bedrooms and 2 bathrooms, with a soaker tub in the primary ensuite and a walk-out balcony off the living room. The kitchen has quartz counters and stainless appliances, updated in 2023.\n\nThe building's monthly maintenance fee covers heat, water and access to the gym and rooftop terrace. A five-minute walk to Union Station.\n\nAsk for the floor plan, or book a showing to see the view at sunset.",
        },
      ],
    },
    {
      heading: "Turning a feature into a benefit",
      blocks: [
        {
          type: "p",
          text: "A feature is what the home has. A benefit is what the buyer gets from it. Most first drafts list features and stop; the second pass adds the benefit in the same sentence.",
        },
        {
          type: "table",
          caption: "Feature, and the benefit worth naming next to it",
          head: ["Feature", "Benefit to mention instead of just the feature"],
          rows: [
            ["A heated saltwater pool", "Swim through the summer without the chlorine smell or sting"],
            ["A finished basement with a separate entrance", "Rent it out, or give a teenager their own space"],
            ["South-facing windows", "Light through the afternoon, and lower heating bills in winter"],
            ["A detached garage", "Room for a workshop, not just a second car"],
          ],
        },
      ],
    },
    {
      heading: "How long should a property description be?",
      blocks: [
        {
          type: "p",
          text: "There's no single right number: guides disagree because they're measuring the wrong thing. SharpLaunch recommends 80 to 150 words for the main description; Realtyna recommends 175 to 350. Both are reasonable, because the real limit isn't a word count — it's the character cap your MLS board sets on the public-remarks field, which varies by board (HousingWire notes one US board allows 1,000 characters and recommends shorthand like \"w/\" for \"with\" to fit more in).",
        },
        {
          type: "p",
          text: "Check your own board's limit before you write, not after. Then aim to finish before a buyer would skim to the photos: once the hook, the key facts and the neighbourhood are in, a longer description rarely wins more showings than a tighter one.",
        },
      ],
    },
    {
      heading: "The rules a property description has to follow in Canada",
      blocks: [
        {
          type: "p",
          text: "A property description is advertising, so the same rules apply as to a sign, a print ad or a social caption. Your brokerage and provincial regulator have the final word; these are the ones that catch agents most often.",
        },
        {
          type: "list",
          items: [
            "**Describe the property, not the person.** Ontario's Human Rights Code gives everyone equal treatment in [\"the occupancy of accommodation\"](https://www.ohrc.on.ca/en/policy-discrimination-and-language/relevant-code-provisions). The Ontario Human Rights Commission's guide to [writing a fair housing ad](https://www.ohrc.on.ca/en/writing-fair-rental-housing-ad-fact-sheet) (written for rental ads, but the same test is the safe one for a sale description) flags phrases like \"ideal for a single professional\" or \"perfect for young families\" as describing the occupant instead of the home, however warmly they were meant. \"Three bedrooms on one floor\" is fine; \"perfect for a growing family\" isn't.",
            "**Write your own description.** [RECO Bulletin 5.3](https://www.reco.on.ca/agents-and-brokerages/reco-bulletins/reco-bulletin-5-3-advertising-online/) says using \"verbatim property descriptions created by someone else requires the written consent of the owner,\" and calls plagiarism and scraping unethical. That includes copying a colleague's or a competing brokerage's wording for the same or a similar listing.",
            "**Credit the source if you do reuse one with consent.** The same bulletin requires any post featuring another brokerage's listing, used with consent, to \"give credit to and include the name and contact information of the originating brokerage.\"",
            "**Make every statement checkable.** [RECO Bulletin 5.1](https://www.reco.on.ca/agents-and-brokerages/reco-bulletins/reco-bulletin-5-1-advertising-requirements/) asks: \"Are all statements factually correct, accurate, and verifiable? You must say what you mean and mean what you say.\" A square footage you haven't confirmed, or a school you haven't checked the catchment for, doesn't belong in the description.",
            "**Name the brokerage wherever the description is published.** RECO Bulletin 5.1 requires \"the name of the brokerage\" in all advertising; agents \"are prohibited from advertising in any manner unless the brokerage is clearly and prominently identified.\" The MLS record carries it automatically; your own website or a reposted PDF needs it added.",
          ],
        },
      ],
    },
    {
      heading: "How to turn a property description into a social caption",
      blocks: [
        {
          type: "p",
          text: "The description above is too long for Instagram or Facebook, and it repeats what the photo already shows. A caption needs one hook and two or three facts, not the whole walkthrough. SocialSpark uses the property description you've already written to write that shorter version, in your voice:",
        },
        {
          type: "steps",
          items: [
            { title: "Paste the listing link", body: "SocialSpark imports the price, bedrooms, bathrooms, square footage, the features list and the public-remarks description itself, exactly as the listing shows them." },
            { title: "Choose the platform and post type", body: "Instagram, Facebook or LinkedIn; Just Listed, Open House or any other post type. The caption is written from the imported description and features, pulling out the hook and two or three supporting facts, following the formula in [real estate captions for Instagram](/guides/real-estate-captions-for-instagram)." },
            { title: "Edit and post", body: "Change any word, then publish or schedule. Nothing goes out without your click." },
          ],
        },
        {
          type: "visual",
          visual: { kind: "screen", step: 1, caption: "Pasting a listing link in SocialSpark: the imported price, details and description, ready to turn into a post." },
        },
        {
          type: "p",
          text: `Your first ${FREE_LIMITS.registered} listings are free, with ${FREE_LIMITS.captionsPerListing} posts each and no credit card. For the week's other posts beyond the caption, see [a real estate marketing plan](/guides/real-estate-marketing-plan).`,
        },
      ],
    },
  ],
  faq: [
    {
      q: "What's the difference between a property description and a listing caption?",
      a: "The property description is the longer write-up on the MLS® System and your website; a caption is the short version for one social post. Write the description first, then pull one hook and a couple of facts out of it for the caption.",
    },
    {
      q: "Can I copy my property description into my social media caption?",
      a: "You can, but it's usually too long and repeats what the photo already shows. Pull out the hook and two or three facts instead; see the caption formula in [real estate captions for Instagram](/guides/real-estate-captions-for-instagram).",
    },
    {
      q: "How long should a property description be?",
      a: "Long enough for the hook, the key facts and the neighbourhood, short enough to fit your MLS board's character limit for the public-remarks field. The limit, not a word count, is the real constraint, and it varies by board.",
    },
    {
      q: "What words should I avoid in a property description?",
      a: "Anything that describes the buyer instead of the home: \"perfect for young families,\" \"ideal for a single professional,\" \"quiet couple.\" Ontario's Human Rights Commission flags these as signalling a preference for one group over another.",
    },
    {
      q: "Do I need to name the brokerage in a property description?",
      a: "Yes, wherever it's published. The MLS record shows it automatically; a copy on your own website or a reposted flyer needs it added. In Ontario, RECO requires the brokerage to be clearly and prominently identified in all advertising.",
    },
  ],
  related: ["real-estate-captions-for-instagram", "just-listed-post-ideas", "real-estate-marketing-plan"],
  cta: {
    heading: "Turn your property description into a post",
    sub: "Paste a link to one of your listings. SocialSpark pulls in the description and details you've already written and turns them into a caption in your voice, ready to edit.",
  },
  sources: [
    { label: "Ontario Human Rights Commission: Relevant Code provisions (s.2(1))", url: "https://www.ohrc.on.ca/en/policy-discrimination-and-language/relevant-code-provisions" },
    { label: "Ontario Human Rights Commission: Writing a fair rental housing ad (fact sheet)", url: "https://www.ohrc.on.ca/en/writing-fair-rental-housing-ad-fact-sheet" },
    { label: "RECO Bulletin 5.3: Advertising online", url: "https://www.reco.on.ca/agents-and-brokerages/reco-bulletins/reco-bulletin-5-3-advertising-online/" },
    { label: "RECO Bulletin 5.1: Advertising requirements", url: "https://www.reco.on.ca/agents-and-brokerages/reco-bulletins/reco-bulletin-5-1-advertising-requirements/" },
    { label: "HousingWire: Creative real estate listing descriptions + examples", url: "https://www.housingwire.com/articles/creative-real-estate-listing-descriptions-examples/" },
    { label: "SharpLaunch: 13 property description tips to attract more buyers and tenants", url: "https://www.sharplaunch.com/blog/property-descriptions" },
    { label: "Realtyna: How to write compelling property descriptions", url: "https://realtyna.com/blog/how-to-write-compelling-property-descriptions/" },
  ],
};
