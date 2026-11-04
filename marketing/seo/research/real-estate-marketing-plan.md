# Gap brief: real estate marketing plan

## 2026-11-04 refresh

Cannibalisation check: today's top Keyword Planner rows were all "marketing plan" variants with weak product fit (property management marketing plan, real estate SMMA, property marketing strategy, tom ferry/mike ferry marketing plan, home marketing plan — scores 15–37.5, none about a realtor's own listing). The one with real fit, "listing marketing plan" (score 22.5; variants "marketing plan for listing a home", "listing presentation marketing plan"), is ≥50% the same question as this guide's keyword, so per the skill's cannibalisation rule it's a refresh, not a new guide. Confirmed via search that the actual intent is different from the published guide's weekly-posting-cadence angle: it's what to put in the marketing plan section of a listing presentation, used to win a listing before you have one. Added as a new section plus one FAQ; nothing else in the guide changed.

Pages read for the refresh (WebSearch then WebFetch, 5 pages): Matterport, HeyGen, Tom Ferry, SlideModel and WisePelican came up for "listing presentation marketing plan" generally; read in full: Virtuance, ShowingTime, Launchlisting, RealAnalytica and AgentWealthHustle (listed below). None are Canadian; none mention RECO/CREA rules; all assume the example shown is this seller's own home, which an agent doesn't have yet at the presentation stage. RealAnalytica's "show real examples, don't just promise" point and Launchlisting's stage checklist were the two gaps worth adding; AgentWealthHustle was mostly generic marketing-textbook material (SWOT, buyer personas) not specific to a listing presentation, so it wasn't used.

| Page read | Used |
|---|---|
| [Virtuance](https://www.virtuance.com/blog/listing-presentation-guide/) | Confirmed the "channels, not a promise" framing matches other pages; not quoted directly |
| [ShowingTime](https://showingtime.com/lo/real-estate-listing-marketing-plan-guide) | Confirmed general channel list; not quoted directly |
| [Launchlisting](https://www.launchlisting.com/blog/the-listing-marketing-plan) | Quoted for the stage checklist |
| [RealAnalytica](https://www.realanalytica.com/blog/real-estate-listing-presentation) | Quoted for "closes more listings" and "show real examples" |
| [AgentWealthHustle](https://agentwealthhustle.com/real-estate-listing-marketing-plan/) | Read, not used (generic marketing-textbook content, nothing listing-presentation-specific) |

### Fact-check (refresh)

| Claim | Source | Exact words | Result |
|---|---|---|---|
| The marketing plan section is what wins the listing, ahead of price | [RealAnalytica](https://www.realanalytica.com/blog/real-estate-listing-presentation) | "The marketing plan section closes more listings than the pricing section. Sellers price-shop multiple agents; they hire the one who shows them exactly how the home will reach buyers." | Confirmed |
| Show real examples instead of describing them | RealAnalytica | "Show real examples of past marketing collateral if you have it. Sellers want to see the polish, not just hear about it." | Confirmed |
| Stage checklist: Just Listed, Week 2 Promotion, Open House, Price Update, Under Contract, Sold | [Launchlisting](https://www.launchlisting.com/blog/the-listing-marketing-plan) | "Just Listed, Week 2 Promotion, Open House, Price Update, Under Contract, Sold" | Confirmed |
| Channels: MLS, a site, social, email, direct mail | Virtuance, ShowingTime (consistent across both) | Virtuance: "a pricing proposal, professional real estate photography, a virtual 3d tour, a direct mail campaign, social sharing"; ShowingTime: MLS/aggregators, a dedicated webpage, social platforms, video | Confirmed; stated at the level common to both, not either page's specific list |
| Brokerage name has to appear on an example post the same as a live one | [Bulletin 5.1](https://www.reco.on.ca/agents-and-brokerages/reco-bulletins/reco-bulletin-5-1-advertising-requirements/), already verified for this guide's first draft | "Agents are prohibited from advertising in any manner unless the brokerage is clearly and prominently identified." | Confirmed; same source reused, not reopened |
| A referenced sale needs the consent the Sold rule requires | [Bulletin 5.4](https://www.reco.on.ca/agents-and-brokerages/reco-bulletins/reco-bulletin-5-4-advertising-sold-property/), already verified for this guide's first draft | "The consent must be clear and include the date on which the consent takes effect and the date on which the consent expires." | Confirmed; same source reused, not reopened |
| Example post ids and types | `src/components/hero/demo-posts.ts` | `ig-oakridge`: `postType: "just_listed"`; `fb-maple`: `postType: "open_house"` | Confirmed |
| "You don't have this seller's listing yet" / use a past sale or similar listing instead | None | Our own reasoning from the product's import flow (no listing link exists for an unsigned listing), not from any source | Stated as our advice, not a cited fact |


Opportunity: Keyword Planner family "real estate social marketing" (score 882.5), ~310 searches/mo in Canada across 9 phrasings (real estate marketing strategy, real estate marketing plan, real estate marketing schedule, real estate social network, real estate marketing calendar, pinterest real estate marketing, real estate marketing proposal, real estate marketing goals), 2,910/mo US (tiebreak). Deferred from the 2026-10-30 run in favour of the RECO guide; top-scored opportunity again today with 0 Search Console rows (site not yet indexed). Chosen as "listing marketing plan" and "real estate marketing plan"/"real estate marketing schedule" are explicit seed keywords, and the cluster is in the topic map ("Listing marketing": how to market a listing on social media, listing marketing plan, posting schedule for a listing).

Primary keyword chosen for the page: **real estate marketing plan** (the seed phrase realtors actually type), with the schedule/calendar variants answered inside via `alsoAnswers` and a dedicated weekly-schedule section, since that's the part none of the ranking pages execute well.

## Pages read

1. [HousingWire: Build Your Real Estate Marketing Plan in 9 Steps (+ Template)](https://www.housingwire.com/articles/real-estate-marketing-plan/)
2. [The Close: The Complete Real Estate Marketing Calendar & Holiday Guide](https://theclose.com/real-estate-marketing-calendar-holiday-guide/)
3. [Jason Fox: Master 2025 with This Essential Real Estate Marketing Schedule](https://www.jasonfox.me/real-estate-marketing-schedule/)
4. [Avenue HQ: What to Post on Social Media as a Realtor (weekly social media plan)](https://avenuehq.com/blog/weekly-social-media-plan)
5. [Reallyo: Real Estate Social Media Marketing: 30 Ideas & the 3-3-3 Rule](https://www.reallyo.com/blog/real-estate-social-media-marketing)
6. [InboundREM: 2025 Real Estate Marketing Plan (Strategies + Calendar)](https://inboundrem.com/real-estate-marketing-plan-strategies-calendar/)

(Placester's social media scheduling guide returned HTTP 403 and couldn't be read; not counted among the pages used.)

## Table stakes all of them cover

- A marketing plan should set goals, identify the target client/area, pick channels, set a budget, and track results (HousingWire, InboundREM).
- A content calendar organized by month or theme (HousingWire's 90-day planning, The Close's and Jason Fox's month-by-month themes).
- Posting 3+ times a week on Facebook/Instagram is the common baseline (Jason Fox, Reallyo, Avenue HQ).
- Mix of content types: educational, local, listing, personal (all six pages in some form).

## Missing opportunities (what none of them do well) → where it lands in the guide

1. **Weekly schedules exist, but none follows the agent's listings.** Corrected in review: Avenue HQ gives a day-by-day calendar and Reallyo a Monday, Wednesday, Friday one, both built on generic content themes. → "A weekly social media schedule you can copy" (table), built around what the agent's listings are doing that week.
2. **No Canadian context.** All six pages are U.S.-centric (HousingWire: Boston/Keller Williams; The Close: U.S. holidays only; InboundREM: MLS/Census Bureau/WSJ). None mention Canadian provincial advertising regulators or Canadian holidays. → "The Canadian rules a marketing plan has to follow" section, citing RECO Bulletin 5.1 and CREA's trademark rules (already verified sources from prior guides), plus a note to calendar around Canadian, not American, observances.
3. **The plan is never tied to the listing lifecycle.** All six treat "social media" as one generic bucket; none structure the week around Just Listed → Open House → Price Reduced → Sold, which is the one thing a listing-based tool like SocialSpark can actually automate. → weekly schedule section + internal links to the four listing-stage guides.
4. **"What do I post with no new listing?" is unanswered.** None of the six pages address the realtor's actual weekly problem: most weeks there's no new listing to announce. → dedicated "What to post when you have no new listing" section with concrete, verifiable ideas (reposting an active listing as Featured Property, a local fact, a past-sale story, a Q&A).
5. **No budget-free version for a new or part-time agent.** HousingWire and InboundREM assume a budget and often a team/CRM/hired help; none scale the plan down to one listing a month. → "How the plan changes for a new agent, a busy one, or a team" section, linking to the new-agent and part-time-realtor persona pages.
6. **Mortgage brokers are absent from every page.** → one FAQ answer tying the same weekly cadence to feature sheets, linking `/mortgage-brokers`.

## Sources left out

Reallyo sells a competing listing post and caption tool, and says of its 3-3-3 and 50/30/20 rules: "None has an official source; they circulate among social media coaches". The guide doesn't link to it or use those rules. Three posts a week is stated as our suggestion, with no official number.

## Fact-check

The run's first table had 9 rows, marked two claims "already verified for prior guides" and left out general statements and product claims. This one was redone in review with every source reopened.

| Claim | Source | Exact words | Result |
|---|---|---|---|
| HousingWire's plan has nine steps, from goals to tracking results | [HousingWire](https://www.housingwire.com/articles/real-estate-marketing-plan/) | "1. Set clear goals for your business" … "9. Track your results and make smart adjustments" | Confirmed |
| HousingWire suggests planning a quarter at a time | HousingWire | "I do suggest planning out your next 90 days. Sit down once a quarter with a cup of coffee and get your creative juices flowing." | Confirmed |
| HousingWire's template includes a budget | HousingWire | "7. Create a realistic marketing budget" | Confirmed; "most templates" cut |
| Three posts a week is the agreed baseline | [Reallyo](https://www.reallyo.com/blog/real-estate-social-media-marketing) | "None has an official source; they circulate among social media coaches" | Corrected: now our suggestion, "no official number" |
| 3-3-3 and 50/30/20 rules | Reallyo, as above | Same | Cut |
| RECO: brokerage clearly and prominently identified | [Bulletin 5.1](https://www.reco.on.ca/agents-and-brokerages/reco-bulletins/reco-bulletin-5-1-advertising-requirements/) | "Agents are prohibited from advertising in any manner unless the brokerage is clearly and prominently identified." | Confirmed; marked as Ontario |
| The same requirements apply on social media | [Bulletin 5.3](https://www.reco.on.ca/agents-and-brokerages/reco-bulletins/reco-bulletin-5-3-advertising-online/) | "While social media platforms may seem less formal, the same advertising requirements apply." | Confirmed |
| This includes a personal account also used for listings | Bulletin 5.3 | "Agents using a social media account for both personal and professional purposes" "must ensure both accounts and each message relating to trading in real estate comply with advertising requirements." | Confirmed |
| REALTOR® form | [CREA](https://www.crea.ca/cafe/everything-you-need-to-know-about-creas-trademarks-2/) | "all letters must be capitalized followed by the registered trademark symbol and provide a trademark statement." | Corrected: "on first use" isn't CREA's wording. Same error fixed in the just-listed, open house and Facebook guides. Raises a compliance flag |
| REALTOR® identifies CREA members, not a job title | CREA | "should never be used as a synonym to describe a real estate professional, salesperson or broker" | Confirmed |
| Sold posts need written consent with dates (Ontario) | [Bulletin 5.4](https://www.reco.on.ca/agents-and-brokerages/reco-bulletins/reco-bulletin-5-4-advertising-sold-property/) | "The consent must be clear and include the date on which the consent takes effect and the date on which the consent expires." | Confirmed; added as a cited rule and limited to Ontario |
| "Every post is under your provincial regulator's rules", with Ontario's rules listed | None | Not in any source for other provinces | Corrected: the rules are marked as Ontario's |
| "For most Canadian agents, that's Instagram, Facebook and LinkedIn" | None | Not in any source | Cut |
| "The part … most skip" | None | Not in any source | Cut |
| "Most showings and open houses happen" on the weekend | None | Not in any source | Cut |
| "Posting less than three times a week is where most plans actually fail" | None | Not in any source | Cut |
| "Most weeks don't have a new listing" | None | Not in any source | Softened to "some weeks" |
| "Most agents don't start there" | None | Not in any source | Cut |
| Brokers' "channels, schedule and content mix stay the same" | None | Not in any source | Cut |
| Reusing one caption across Instagram and Facebook | `src/lib/guides/real-estate-captions-for-instagram.ts` | "The same listing needs a different caption again on Facebook" | Corrected: it contradicted our own guide |
| Free listings "enough to run a few weeks" | `src/lib/plans.ts` | `FREE_LIMITS = { guest: 1, registered: 3, captionsPerListing: 2 }` | Corrected: 6 posts is two weeks at this pace, so it's now "enough to try the schedule" |
| Post types and platforms | `src/lib/types.ts` | `POST_TYPES`, `Platform = "instagram" \| "facebook" \| "linkedin"` | Confirmed |
| REALTOR.ca needs copy and paste | `src/lib/faq.ts:30` | "REALTOR.ca blocks automated tools, so use “Copy and paste the page”" | Confirmed |
| Edit, download, publish or schedule; nothing posts without a click | `src/lib/faq.ts:6,18` | "You can edit, download, publish or schedule them." "A post goes out only when you click Publish now or choose a time to schedule it." | Confirmed |
| Example post types in the visual | `src/components/hero/demo-posts.ts:204,219` | `ig-maple` `postType: "sold"`; `li-laurier` `postType: "coming_soon"` | Confirmed; the caption's claim that they aren't listing posts was cut |

Our own advice, stated as advice and not as fact: the day-by-day schedule, a fixed-day habit, and one post a week at one listing a month.
