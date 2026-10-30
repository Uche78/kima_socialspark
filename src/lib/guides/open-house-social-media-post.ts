import { FREE_LIMITS } from "../plans";
import type { Guide } from "./index";

export const openHouseSocialMediaPost: Guide = {
  slug: "open-house-social-media-post",
  keyword: "open house social media post",
  alsoAnswers: [
    "open house social media post examples",
    "open house instagram post",
    "open house facebook post",
    "how to promote an open house on social media",
    "open house post ideas",
  ],
  audience: "realtor",
  cluster: "Listing posts",
  meta: {
    title: "Open House Social Media Post: Ideas and Examples",
    description:
      "What to put in an Open House social post, a timeline from save-the-date to thank-you, examples for Instagram, Facebook and LinkedIn, and Canada's ad rules.",
  },
  h1: "Open house social media post ideas for Canadian realtors, with examples",
  dek: "What belongs in an Open House post, a timeline that gets more than one look, examples for every platform, and the Canadian rules to follow.",
  answer:
    "A good Open House post states the date, time and address plainly, pulled straight from the listing, so no one shows up at the wrong time. Lead the caption with one reason to stop by, not the address, then ask people to come by, save the post, or bring a friend who's looking. Post more than once: a save-the-date days before, a reminder the morning of, and a short recap after, so the open house gets seen more than once.",
  published: "2026-10-29",
  updated: "2026-10-29",
  sections: [
    {
      heading: "What an Open House post has to do",
      blocks: [
        {
          type: "p",
          text: "An Open House post has one job: get a specific person to a specific address at a specific time. That's different from a Just Listed post, which only has to earn a message. Here the reader has to actually act on a schedule, so the post has to make the time and place impossible to miss, then give them a reason worth clearing an hour for.",
        },
        {
          type: "p",
          text: "The reason doesn't have to be dramatic. A real feature works better than hype: the wraparound porch, the renovated kitchen, the fact that this is the first time a unit on this floor has come up in years. State it, then get out of the way of the date and time.",
        },
        {
          type: "tip",
          label: "The screenshot test",
          text: "Could someone screenshot your post and still have everything they need an hour before the open house: the address, the day, the start and end time? If any of those only live in a comment reply, move it into the caption.",
        },
      ],
    },
    {
      heading: "What to put on the post",
      blocks: [
        {
          type: "p",
          text: "Put the facts a visitor needs on the image itself, large enough to read on a phone, not buried in the caption:",
        },
        {
          type: "list",
          items: [
            "**The date and time**, exactly as the listing or your notes have it. Never guess or round a time to make the post sound better.",
            "**The address or at least the street and city.** Buyers decide whether it's worth the drive before they read anything else.",
            "**An Open House label**, so it reads differently from a Just Listed or Price Reduced post at a glance.",
            "**Bedrooms, bathrooms and square footage**, the numbers a buyer screens for before they'll plan a visit.",
            "**Your name, brokerage and how to reach you**, which is also a rule in most provinces (see below).",
          ],
        },
        {
          type: "p",
          text: "If the listing data doesn't have a confirmed time yet, don't invent one. Say the date and invite people to message you for the hours, and post the full details as soon as they're confirmed.",
        },
        {
          type: "visual",
          visual: {
            kind: "posts",
            ids: ["fb-maple"],
            caption: "An Open House post made with SocialSpark: the day and time up front, the home's details, and the agent's name and brokerage on the image.",
          },
        },
      ],
    },
    {
      heading: "How to write the caption",
      blocks: [
        {
          type: "steps",
          items: [
            { title: "Lead with the reason, not the address", body: "The image already states the address and time. Open the caption with the one detail that makes this open house worth the drive: the porch, the view, the renovation." },
            { title: "Repeat the day and time in words", body: "Even though it's on the image, say it again in the caption: \"Saturday and Sunday, 2 to 4 PM.\" Some platforms crop images differently in the feed, and people share captions without the photo." },
            { title: "Ask people to come, save the post, or share it", body: "\"Stop by\", \"save this for Saturday\", or \"tag someone who's looking\" all work. Skip asking for an RSVP unless you actually need one; many Canadian open houses are drop-in." },
            { title: "Sign off with your name and brokerage", body: "On its own line, e.g. \"Jane Doe, REALTOR® | ABC Realty Inc.\" If you're hosting for another brokerage's listing, add \"Listing courtesy of\" and its name." },
          ],
        },
        {
          type: "p",
          text: "Skip the words every open house post uses: don't miss out, won't last, your dream home. A detail a visitor can actually check when they walk in does more. For the caption formula behind every post type, including hashtags, see [real estate captions for Instagram](/guides/real-estate-captions-for-instagram).",
        },
        {
          type: "example",
          label: "Example: Instagram",
          text: "Come see the wraparound porch everyone on Maple Lane talks about. 🏡\n\nOpen house Saturday and Sunday, 2 to 4 PM. 4 bedrooms, 3 baths, 2,400 sq. ft. in Stouffville.\n\nSave this post, or send it to a friend who's looking.\n\nJane Doe, REALTOR® | ABC Realty Inc.",
        },
        {
          type: "example",
          label: "Example: Facebook",
          text: "Open house this Saturday and Sunday, 2 to 4 PM, on Maple Lane in Stouffville.\n\n4 bedrooms, 3 baths, 2,400 sq. ft., and the wraparound porch everyone on the street already asks about.\n\nStop by, or message me and I'll save you a time to walk through quietly.\n\nJane Doe, REALTOR® | ABC Realty Inc.",
        },
        {
          type: "example",
          label: "Example: LinkedIn",
          text: "Hosting the open house for a colleague's listing this weekend: a four-bedroom home on Maple Lane in Stouffville, Saturday and Sunday, 2 to 4 PM.\n\nKnow someone relocating to the area? I'd be glad to walk them through it.\n\nJane Doe, REALTOR® | ABC Realty Inc. | Listing courtesy of XYZ Realty",
        },
      ],
    },
    {
      heading: "A posting timeline, not one post",
      blocks: [
        {
          type: "p",
          text: "One post the morning of the open house only reaches whoever happens to be scrolling right then. A short timeline across the week reaches people more than once, at the moment each one is useful:",
        },
        {
          type: "steps",
          items: [
            { title: "The save-the-date", body: "Three or four days before, with the day and time but less urgency: \"This one's open Saturday and Sunday, 2 to 4.\" Gives people time to plan around it." },
            { title: "The morning-of reminder", body: "Same facts, more immediate: \"Today, 2 to 4 PM.\" This is the post most likely to convert someone already free that day." },
            { title: "The last-call post", body: "An hour or two before closing, for anyone nearby: \"Still open until 4 if you want to swing by.\"" },
            { title: "The recap", body: "After the open house, a short note that it's still available and showings can be booked, with one new detail from the day if there's one worth sharing (strong turnout, a question people kept asking)." },
          ],
        },
        {
          type: "p",
          text: "If you're hosting for a colleague who can't make it, the LinkedIn example above shows how to frame it: you're the host, not the listing agent, and the post credits the listing brokerage.",
        },
      ],
    },
    {
      heading: "How the post changes on Instagram, Facebook and LinkedIn",
      blocks: [
        {
          type: "table",
          caption: "Open House posts by platform",
          head: ["", "Instagram", "Facebook", "LinkedIn"],
          rows: [
            ["Who's reading", "Buyers scrolling on their phone", "Local homeowners and their networks", "Professionals, relocating employees, referral partners"],
            ["Lead with", "The visual hook, then the time", "The time, with a line of neighbourhood context", "Who the home suits, and that you're hosting for a colleague if you are"],
            ["Ask for", "A save or a share", "A message, a comment, or to stop by", "A referral, no hard sell"],
            ["RSVP needed", "No: say \"stop by\"", "No: say \"stop by\" or \"message me\"", "No: a soft invitation is enough"],
            ["Hashtags", "Up to 5 (Instagram's limit)", "0 to 3", "3 to 5 professional ones"],
          ],
        },
        {
          type: "p",
          text: "Post the reminder and the save-the-date on whichever platforms you use; they don't need to be identical. A Facebook reminder can carry more neighbourhood detail than the Instagram version of the same day.",
        },
      ],
    },
    {
      heading: "The rules for Open House posts in Canada",
      blocks: [
        {
          type: "p",
          text: "An Open House post is advertising, the same as a sign on the lawn. Your brokerage and provincial regulator have the final word; these are the ones that catch agents most often.",
        },
        {
          type: "list",
          items: [
            "**Name your brokerage, clearly.** In Ontario, [RECO's advertising bulletin](https://www.reco.on.ca/getmedia/fc6d0358-a8a1-4e6b-bfaa-2b8c312e1c3b/RECO-Bulletin-5-1-Advertising-requirements.pdf) requires the brokerage name in all advertising, including social media. Other provinces have similar rules. For the full set of RECO's advertising rules, see [RECO advertising guidelines](/guides/reco-advertising-guidelines).",
            "**Only host and post what you're allowed to.** If it's a colleague's or another brokerage's listing, follow your board's and regulator's rules on consent, credit the listing brokerage, and don't make it look like your own listing.",
            "**Write REALTOR® correctly.** It's a CREA trademark for members, not a job title; [CREA asks](https://www.crea.ca/cafe/everything-you-need-to-know-about-creas-trademarks-2/) for capitals and the ® symbol on first use.",
            "**Describe the home, not the visitor.** Human rights laws prohibit discriminatory housing ads. \"Four bedrooms on two floors\" is fine; \"perfect for a young family\" isn't.",
            "**No promises about value.** Skip \"guaranteed\" or \"best investment\", and don't predict what the home will be worth.",
            "**Get the time right, every time.** Posting a wrong date or time isn't just a bad look: it sends people to a closed door.",
          ],
        },
      ],
    },
    {
      heading: "Mistakes that make Open House posts fall flat",
      blocks: [
        {
          type: "list",
          items: [
            "**Posting once, the morning of.** Anyone who missed that one post never hears about it. A save-the-date earlier in the week catches people who'd have made plans.",
            "**Burying the time in the caption.** If the date and time aren't on the image, a screenshot or a quick scroll loses them.",
            "**Leading with the address instead of the reason.** The address is a fact to check, not a hook; lead with what makes the visit worth it.",
            "**Asking for an RSVP nobody needs.** It adds friction most Canadian open houses don't require. Only ask if you genuinely need a headcount.",
            "**Forgetting the recap.** A post the day after, saying the home is still available, reaches the people who meant to come but didn't make it.",
          ],
        },
      ],
    },
    {
      heading: "How to make an Open House post from a listing link",
      blocks: [
        {
          type: "p",
          text: "Writing the save-the-date, the reminder and the recap for every open house is the part that gets skipped on a busy week. SocialSpark does the first draft from the listing itself:",
        },
        {
          type: "steps",
          items: [
            { title: "Paste the listing link", body: "From your brokerage or agent website. SocialSpark imports the price, details, features and photos. REALTOR.ca blocks automated tools, so for those listings, copy and paste the page instead." },
            { title: "Choose Open House", body: "Pick the platform, a single image or a carousel, and English, Québec French or both. The open house date and time come from the listing data when it's there." },
            { title: "Edit, then publish or schedule", body: "You get a branded image with the date, time and your contact details, and a caption ready to adapt into the save-the-date, the reminder and the recap. Nothing goes out without your click." },
          ],
        },
        {
          type: "visual",
          visual: { kind: "screen", step: 2, caption: "Choosing the Open House post type and format in SocialSpark." },
        },
        {
          type: "p",
          text: `Your first ${FREE_LIMITS.registered} listings are free, with ${FREE_LIMITS.captionsPerListing} posts each and no credit card. See [the plans](/pricing) if you run open houses often, or go back to [Just Listed post ideas](/guides/just-listed-post-ideas) for the post that comes before it.`,
        },
      ],
    },
  ],
  faq: [
    {
      q: "What should I put in an Open House social media post?",
      a: "The date, time and address on the image, plus your name and brokerage. In the caption, lead with one real reason to stop by, repeat the day and time in words, and ask people to come by, save the post, or share it.",
    },
    {
      q: "How many times should I post about one open house?",
      a: "At least three: a save-the-date a few days before, a reminder the morning of, and a short recap after. Each reaches people at a different moment, instead of relying on one post to do all the work.",
    },
    {
      q: "Do I need to include the exact time on the post?",
      a: "Yes, and it has to be the confirmed time from the listing or your own notes, never a guess. If the time isn't confirmed yet, post the date only and invite people to message you for the hours.",
    },
    {
      q: "Can I post about an open house I'm hosting for another agent's listing?",
      a: "Yes, with your board's and regulator's rules on consent followed, and the listing brokerage credited in the post, for example \"Listing courtesy of XYZ Realty\". Don't make it look like your own listing.",
    },
    {
      q: "Do I need to ask for an RSVP?",
      a: "Most Canadian open houses are drop-in, so no. Only ask for an RSVP if you actually need a headcount; otherwise \"stop by\" or \"message me\" is enough.",
    },
    {
      q: "How many hashtags should an Open House post have?",
      a: "On Instagram, up to 5, which is now the most Instagram allows: the city, the neighbourhood, the property type and #OpenHouse. On Facebook, 0 to 3. On LinkedIn, 3 to 5 professional ones.",
    },
  ],
  related: ["just-listed-post-ideas", "real-estate-facebook-post-ideas", "real-estate-captions-for-instagram", "reco-advertising-guidelines"],
  cta: {
    heading: "See your next open house as a ready-to-post invite",
    sub: "Paste a link to one of your listings. SocialSpark lays out the date, time and details with your name and brokerage, and writes a caption ready to edit.",
  },
  sources: [
    { label: "RECO Bulletin 5.1: Advertising requirements", url: "https://www.reco.on.ca/getmedia/fc6d0358-a8a1-4e6b-bfaa-2b8c312e1c3b/RECO-Bulletin-5-1-Advertising-requirements.pdf" },
    { label: "CREA: Everything you need to know about CREA's trademarks", url: "https://www.crea.ca/cafe/everything-you-need-to-know-about-creas-trademarks-2/" },
    { label: "Social Media Today: Instagram implements new limits on hashtag use (December 2025)", url: "https://www.socialmediatoday.com/news/instagram-implements-new-limits-on-hashtag-use/808309/" },
  ],
};
