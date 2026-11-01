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

Corrected in review: SharpLaunch and theBrokerList are written mainly for commercial real estate. HousingWire and Hooquest both warn about US fair housing wording, and HousingWire already says MLS length limits apply, so gap 3 is a clearer answer, not a new one.

A guide that only restated the six pages' structure would have no reason to outrank them for a Canadian reader; items 1, 2 and 5 are the ones that make it worth reading.

## Fact-check

The run's first table had 10 rows and left out general statements, sample copy and the screenshot. This one was redone in review with every source reopened.

| Claim | Source | Exact words | Result |
|---|---|---|---|
| Ontario's Code covers occupancy of accommodation | [OHRC: Relevant Code provisions](https://www.ohrc.on.ca/en/policy-discrimination-and-language/relevant-code-provisions) | "Every person has a right to equal treatment with respect to the occupancy of accommodation," (s.2(1)) | Confirmed. The page doesn't mention buying or selling |
| OHRC flags "perfect for young families" | [OHRC fact sheet](https://www.ohrc.on.ca/en/writing-fair-rental-housing-ad-fact-sheet) | Not on the page | Corrected: an invented attribution, removed |
| OHRC flags occupant phrases and says to describe the unit | OHRC fact sheet | "Ideal for quiet couple"; "Suitable for single professional"; "Describe the unit, not the tenant" | Corrected to these exact phrases |
| The fact sheet covers rentals only | OHRC fact sheet | Selling, buying and agents aren't mentioned | Confirmed; the guide says applying it to sales is our reading |
| "The words that break Canada's human rights rules" | OHRC pages above | Ontario sources on rental ads only | Corrected: "the wording to avoid" |
| Verbatim descriptions need written consent; plagiarism and scraping are unethical | [RECO Bulletin 5.3](https://www.reco.on.ca/agents-and-brokerages/reco-bulletins/reco-bulletin-5-3-advertising-online/) | "Using images, logos, and verbatim property descriptions created by someone else requires the written consent of the owner." "Plagiarism and scraping are unethical." | Confirmed |
| This covers a colleague's or competing brokerage's wording | Bulletin 5.3, as above | Doesn't name them | Corrected: marked as our reading |
| Credit for another brokerage's listing | Bulletin 5.3 | "must give credit to" "and include the name and contact information of the originating brokerage." | Confirmed |
| Brokerage named in all advertising | [RECO Bulletin 5.1](https://www.reco.on.ca/agents-and-brokerages/reco-bulletins/reco-bulletin-5-1-advertising-requirements/) | "All advertising must include the name of the brokerage." "Agents are prohibited from advertising in any manner unless the brokerage is clearly and prominently identified." | Confirmed; marked as Ontario |
| Statements must be verifiable | Bulletin 5.1 | "Are all statements factually correct, accurate, and verifiable? You must say what you mean and mean what you say." | Confirmed |
| Length limits on MLS descriptions | [HousingWire](https://www.housingwire.com/articles/creative-real-estate-listing-descriptions-examples/) | "Most MLSs will only allow you a certain number of words or characters. In Massachusetts, where I sell, we only get 1000 characters" | Corrected: "every MLS" became "most", quoted |
| Shorthand to fit more in | HousingWire | "shorthand such as “W/D” instead of “washer and dryer” or “w/” instead of spelling out the word “with.”" | Confirmed |
| 80 to 150 words | [SharpLaunch](https://www.sharplaunch.com/blog/property-descriptions) | "keep the main description between 80 and 150 words"; "your commercial real estate website" | Corrected: labelled as commercial real estate advice; "both are reasonable" cut |
| 175 to 350 words | [Realtyna](https://realtyna.com/blog/how-to-write-compelling-property-descriptions/) | "typically ranging from 175 to 350 words" | Confirmed |
| "The MLS record carries [the brokerage] automatically" | None | Not in any source | Cut, in the section and the FAQ |
| "Read by more people than any caption"; "portals that pull from it" | None | Not in any source | Cut |
| "The ones that catch agents most often" | None | Not in any source | Cut |
| "A longer description rarely wins more showings" | None | Not in any source | Cut |
| "Most first drafts list features and stop" | None | Not in any source | Cut |
| Condo buyers' behaviour and the "what's the fee?" message | None | Not in any source | Cut; kept as advice |
| Saltwater pool "without the chlorine smell or sting"; south windows mean "lower heating bills" | None | Not in any source, and unverifiable by the guide's own 5.1 rule | Cut |
| Basement: "Rent it out" | None | Not in any source; implies a use that may not be legal for the home | Cut |
| Teenager's space, in the Oakville example and table | Guide's own rule | "Describe the unit, not the tenant" | Corrected: it described the occupant |
| "Renovated bathrooms (new in 2024)" on the Oakville demo | `public/landing/step-1-import-v3.webp` | "Built 2019" | Cut |
| Demo facts: 5 beds, 4.5 baths, 3,850 sq. ft.; 2 beds, 2 baths, 940 sq. ft. | `src/components/hero/demo-posts.ts:81,86` | `bedrooms: 5, bathrooms: 4.5, square_feet: 3850`; `bedrooms: 2, bathrooms: 2, square_feet: 940` | Confirmed; other details are made up, and the guide now says so |
| The import keeps the description verbatim and passes it to the caption | `src/lib/types.ts:29`; `src/lib/generate.ts:139` | `The listing's public remarks, verbatim`; `["Description", l.description]` | Confirmed |
| Caption pulls out "two or three supporting facts" | `src/lib/generate.ts:68` | "Lead with the property's single strongest hook." | Corrected: the prompt doesn't say two or three |
| Step 1 screenshot shows the description | `public/landing/step-1-import-v3.webp` | Shows photos, price, address, beds, baths, sq ft, type, built | Corrected the caption |
| Publish or schedule; nothing posts without a click | `src/lib/faq.ts:18` | "A post goes out only when you click Publish now or choose a time to schedule it." | Confirmed |
| Free plan | `src/lib/plans.ts` | `FREE_LIMITS = { guest: 1, registered: 3, captionsPerListing: 2 }` | Confirmed |

Our own advice, stated as advice and not as fact: the writing steps, the order of the description, and the feature and benefit pairs.

## Checking SocialSpark against these rules

- Caption prompt: `src/lib/generate.ts:57` already says to describe the property and never the ideal buyer. No flag.
- Sample captions: "Another family is moving into Maple Lane" (Instagram and Facebook guides) and "room around it for the whole family" (just-listed and Facebook guides) described occupants. Fixed in this branch.
- Listing import: the "Plagiarism and scraping" and "verbatim property descriptions" lines in Bulletin 5.3 reconfirm the open 2026-10-30 flag. The guide's step now says "your own listing". The product still has no check.
