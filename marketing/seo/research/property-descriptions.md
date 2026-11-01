# Gap brief: property descriptions

**Chosen:** 2026-11-01, action `new`, slug `property-descriptions`, keyword "property descriptions". Top-scored opportunity (score 195 vs. 37.5 for the next row): 30 searches/mo in Canada, 720/mo US tiebreak, nothing on the site for it, no cannibalisation with existing guides (captions and marketing-plan guides cover adjacent but distinct questions). Fits the "Captions and copy" cluster's seed question "listing description to caption".

## Pages read (6)

1. [HousingWire: Creative real estate listing descriptions + examples](https://www.housingwire.com/articles/creative-real-estate-listing-descriptions-examples/)
2. [SharpLaunch: 13 property description tips](https://www.sharplaunch.com/blog/property-descriptions)
3. [theBrokerList: How to write a property description](https://blog.thebrokerlist.com/how-to-write-a-property-description/)
4. [Hooquest: 6 real estate listing description examples with template](https://hooquest.com/listing-descriptions/)
5. [Realtyna: How to write compelling property descriptions](https://realtyna.com/blog/how-to-write-compelling-property-descriptions/)
6. [AgentCrate: Free property description template](https://www.agentcrate.com/free-property-description-template)

## Table stakes (all six cover this)

- A headline/strong first sentence naming the property's best feature.
- A structured order (room by room, or overview → details → area → call to action).
- List bed/bath/sqft/lot and name upgrades with their year.
- Turn features into benefits, not just a spec list.
- A call to action at the end.
- Proofread; avoid generic filler.

## Missing opportunities (what none of the six give a Canadian agent)

| # | Gap | Where it lands in the guide |
|---|---|---|
| 1 | No Canadian regulatory source for the fair-housing language point — US pages cite the US Fair Housing Act ("walking distance," "master bedroom," "family") with no Canadian equivalent | "The rules a property description has to follow in Canada" section, sourced to Ontario's Human Rights Code s.2(1) (OHRC) and OHRC's fair-housing-ad fact sheet, opened this run |
| 2 | No mention that copying someone else's description (even a competing brokerage's own listing) is a professional breach, not just a copyright nuisance | Same rules section, sourced to RECO Bulletin 5.3 ("verbatim property descriptions created by someone else requires the written consent of the owner... plagiarism and scraping are unethical"), opened this run |
| 3 | No resolution of the conflicting length advice (SharpLaunch: 80–150 words; Realtyna: 175–350 words) — both stated as a rule with no reasoning | "How long should a property description be?" section: the real constraint is the real estate board's character limit (HousingWire's Massachusetts example), not a universal word count; told the reader to check their own board |
| 4 | No Canadian field checklist — none mention condo/strata maintenance fees or property tax, which Canadian condo buyers expect and which SocialSpark's own listing import treats as standard fields (`monthly_fee`, `property_tax_yearly` in `src/lib/types.ts`) | A tip in the "how to write" steps, flagged as our own observation, not an outside claim |
| 5 | None show how a full property description differs from — or feeds — a short social caption. This is the product tie-in and the reason a SocialSpark user reads this guide at all | New "How to turn a property description into a social caption" section (product fact: `generate.ts` passes the imported `description` field to the caption generator as context), and cross-links both ways with [real estate captions for Instagram](/guides/real-estate-captions-for-instagram) |
| 6 | None give a scannable feature→benefit lookup; Realtyna states the principle narratively but no table | A 4-row table block |
| 7 | No Canadian example (CAD pricing format isn't tested here since the guide avoids dollar figures per the site's copy rules; examples use Canadian cities, sq ft, a condo maintenance fee mentioned without a number) | Two full example descriptions (a detached home, a condo), reusing the demo-listing facts already established in sibling guides (Oakville 5-bed saltwater pool; Harbour Street condo soaker tub) for site-wide consistency |

A guide that only restated the six pages' structure would have no reason to outrank them for a Canadian reader; items 1, 2 and 5 are the ones that make it worth reading.

## Fact-check

| Claim | Source | Exact words | Result |
|---|---|---|---|
| Ontario's Human Rights Code gives everyone equal treatment in "occupancy of accommodation" | [OHRC: Relevant Code provisions](https://www.ohrc.on.ca/en/policy-discrimination-and-language/relevant-code-provisions), opened this run | "Every person has a right to equal treatment with respect to the occupancy of accommodation, without discrimination because of race, ancestry, place of origin, colour, ethnic origin, citizenship, creed, sex, sexual orientation, age, marital status, family status, disability or the receipt of public assistance." (s.2(1)) | Used verbatim in substance; guide paraphrases and links the source |
| OHRC tells advertisers to describe the unit, not the tenant; phrases like "perfect for young families" or "ideal for a single professional" read as a preference for a protected group | [OHRC: Writing a fair rental housing ad (fact sheet)](https://www.ohrc.on.ca/en/writing-fair-rental-housing-ad-fact-sheet), opened this run | Fact sheet lists "Seeking mature couple," "Ideal for quiet couple," "Suitable for single professional," "Perfect for female student" as problem phrases and advises describing the unit, not the tenant | Confirmed. Scoped correctly in the guide: the fact sheet is written for **rental** ads; the guide says agents extend the same test to a sale description, and doesn't claim the fact sheet itself covers sales |
| Verbatim property descriptions written by someone else need the owner's written consent; copying/scraping is unethical | [RECO Bulletin 5.3: Advertising online](https://www.reco.on.ca/agents-and-brokerages/reco-bulletins/reco-bulletin-5-3-advertising-online/), opened this run (same source cited in the 2026-10-30 compliance flag; re-opened today) | "Using images, logos, and verbatim property descriptions created by someone else requires the written consent of the owner." / "Plagiarism and scraping are unethical." | Confirmed verbatim |
| If a shared listing's content is used with consent, the post must credit the originating brokerage | [RECO Bulletin 5.3](https://www.reco.on.ca/agents-and-brokerages/reco-bulletins/reco-bulletin-5-3-advertising-online/), opened this run | "If consent has been given to share another brokerage's listing, any post featuring that listing must give credit to and include the name and contact information of the originating brokerage." | Confirmed verbatim |
| All advertising must name the brokerage; agents can't advertise unless the brokerage is clearly and prominently identified | [RECO Bulletin 5.1: Advertising requirements](https://www.reco.on.ca/agents-and-brokerages/reco-bulletins/reco-bulletin-5-1-advertising-requirements/), opened this run | "All advertising must include the name of the brokerage." / "Agents are prohibited from advertising in any manner unless the brokerage is clearly and prominently identified." | Confirmed verbatim |
| Advertising statements must be factually correct, accurate and verifiable | [RECO Bulletin 5.1](https://www.reco.on.ca/agents-and-brokerages/reco-bulletins/reco-bulletin-5-1-advertising-requirements/), opened this run | "Are all statements factually correct, accurate, and verifiable? You must say what you mean and mean what you say." | Confirmed verbatim |
| MLS systems cap how long a public-remarks field can be, and the limit varies by board (used only as an illustration, not a Canadian number) | [HousingWire](https://www.housingwire.com/articles/creative-real-estate-listing-descriptions-examples/), opened this run | Article notes Massachusetts MLS allows 1,000 characters and recommends shorthand ("W/D," "w/") to fit | Confirmed. No Canadian board's limit was found from a primary source this run (search returned only US board help pages), so the guide names this as a US example and tells the reader to check their own board rather than stating a Canadian number |
| SocialSpark imports the listing's public remarks verbatim and up to 15 features, and passes them to the caption generator as context | `src/lib/types.ts` line 29 (`description: z.string().nullable().describe("The listing's public remarks, verbatim")`), line 30 (features, up to 15); `src/lib/generate.ts` `describeListing()`, lines 122–145 | Code reads exactly as described | Confirmed against the code |
| SharpLaunch recommends 80–150 words for the main description | [SharpLaunch](https://www.sharplaunch.com/blog/property-descriptions), opened this run | "keep the main description between 80 and 150 words" | Confirmed, attributed to SharpLaunch specifically, not stated as a universal rule |
| Realtyna recommends 175–350 words | [Realtyna](https://realtyna.com/blog/how-to-write-compelling-property-descriptions/), opened this run | Article gives a 175–350 word range | Confirmed, attributed to Realtyna specifically |

Every claim about SocialSpark and every outside rule stated in the guide is sourced in this table; nothing is left as "probably true." No new compliance flag was opened: the one open risk this research touches (importing another brokerage's photos and description without checking permission) is already logged under 2026-10-30 in `marketing/seo/compliance-flags.md`, and this guide's reading of RECO Bulletin 5.3 confirms it rather than adding anything new.
