# Gap brief: real estate marketing plan

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

1. **No actual copy-paste weekly schedule tied to a realtor's real workload.** Every page gives monthly themes or a vague "3x a week"; none gives a Monday/Wednesday/weekend table a solo agent can just follow. → "A weekly social media schedule you can copy" (table).
2. **No Canadian context.** All six pages are U.S.-centric (HousingWire: Boston/Keller Williams; The Close: U.S. holidays only; InboundREM: MLS/Census Bureau/WSJ). None mention Canadian provincial advertising regulators or Canadian holidays. → "The Canadian rules a marketing plan has to follow" section, citing RECO Bulletin 5.1 and CREA's trademark rules (already verified sources from prior guides), plus a note to calendar around Canadian, not American, observances.
3. **The plan is never tied to the listing lifecycle.** All six treat "social media" as one generic bucket; none structure the week around Just Listed → Open House → Price Reduced → Sold, which is the one thing a listing-based tool like SocialSpark can actually automate. → weekly schedule section + internal links to the four listing-stage guides.
4. **"What do I post with no new listing?" is unanswered.** None of the six pages address the realtor's actual weekly problem: most weeks there's no new listing to announce. → dedicated "What to post when you have no new listing" section with concrete, verifiable ideas (reposting an active listing as Featured Property, a local fact, a past-sale story, a Q&A).
5. **No budget-free version for a new or part-time agent.** HousingWire and InboundREM assume a budget and often a team/CRM/hired help; none scale the plan down to one listing a month. → "How the plan changes for a new agent, a busy one, or a team" section, linking to the new-agent and part-time-realtor persona pages.
6. **Mortgage brokers are absent from every page.** → one FAQ answer tying the same weekly cadence to feature sheets, linking `/mortgage-brokers`.

## Fact-check

| Claim | Source | Exact words | Result |
|---|---|---|---|
| HousingWire frames the plan as 9 steps, ending in content planning and tracking results | HousingWire, https://www.housingwire.com/articles/real-estate-marketing-plan/ | Headlines: "Set clear goals for your business" … "Plan your content ahead of time" … "Track your results and make smart adjustments" | Used, paraphrased as 9 steps in the guide's first section |
| HousingWire suggests planning content in 90-day/quarterly chunks | HousingWire, same URL | "I suggest planning out your next 90 days. Sit down once a quarter with a cup of coffee and get your creative juices flowing." | Used, kept as "once a quarter" |
| Reallyo's 3-3-3 rule: post 3x/week, across 3 content types, engage with 3 accounts per post | Reallyo, https://www.reallyo.com/blog/real-estate-social-media-marketing | "post 3 times a week, across 3 content types, and engage with 3 other accounts for every post" | Used as the frequency baseline, cited inline |
| Reallyo's 50/30/20 content mix | Reallyo, same URL | "50% value or education, 30% personal and relatable, 20% promotional" | Used as the content-mix guidance, cited inline |
| RECO requires the brokerage name clearly and prominently identified in every ad, including social media | RECO Bulletin 5.1 and 5.3, https://www.reco.on.ca/agents-and-brokerages/reco-bulletins/reco-bulletin-5-1-advertising-requirements/ and .../reco-bulletin-5-3-advertising-online/ | "clearly and prominently identified"; Bulletin 5.3 applies the same requirements online | Already verified for prior guides; reused, cited inline |
| REALTOR® is a CREA trademark, first use in capitals with the ® symbol | CREA, https://www.crea.ca/cafe/everything-you-need-to-know-about-creas-trademarks-2/ | CREA asks that the first use be in capital letters with the ® symbol | Already verified for prior guides; reused |
| SocialSpark generates Just Listed, Open House, Price Reduced, Coming Soon, Sold, Featured Property and Mortgage Feature Sheet posts, on Instagram, Facebook and LinkedIn only | Code: `src/lib/types.ts` (`POST_TYPES`, `Platform`) | `POST_TYPES` lists exactly those 7 keys; `Platform = "instagram" \| "facebook" \| "linkedin"` | Used; guide does not claim Pinterest, TikTok or YouTube support (not in `Platform`), and does not claim an automated "market update" or "local fact" post type (not in `POST_TYPES`) |
| Free plan: 3 listing imports (registered), 2 captions per listing | Code: `src/lib/plans.ts` (`FREE_LIMITS`) | `FREE_LIMITS = { guest: 1, registered: 3, captionsPerListing: 2 }` | Used, same wording as other guides |
| New-agent and part-time-realtor persona pages exist at those slugs | Code: `src/lib/persona-pages.ts` | slugs `social-media-posts-for-new-real-estate-agents`, `listing-posts-for-part-time-realtors`, `social-media-for-top-producing-realtors` | Verified before linking |

Every claim above is sourced; nothing in the guide is left as "probably true." Canadian-holiday scheduling advice in the guide is phrased generally (don't calendar around American holidays) and makes no specific date claims, so it needed no external source.
