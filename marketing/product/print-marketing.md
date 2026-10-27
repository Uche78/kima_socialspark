# Print marketing: postcards, door hangers, flyers

Status: idea, not on the roadmap. Raised by the content engine's product ideas list (search demand SocialSpark doesn't serve), assessed with the socialspark-personas skill on 2026-10-27.

## The demand

Keyword Planner, average monthly searches, October 2026:

| Product | Canada | US |
|---|---|---|
| Open house flyers | 70 | 1,300 |
| Door hangers | 70 | 590 |
| Just Sold / Just Listed postcards | 50 | 740 |
| Flyer templates | 20 | 320 |
| Brochure templates | 20 | 140 |

The demand is clearly bigger than for social post topics (10–30 a month per family in Canada). These are searches, not proof anyone would pay.

## Who would pay (personas)

Agents with a neighbourhood, a community or an older client base. The ranking is reasoned from the personas, not measured: there's no Canadian survey of what agents spend on print. Response-rate figures (about 4–5% for direct mail against 0.12% for email) come from a US vendor (4over4).

| # | Persona | Piece | Why | Plan effect |
|---|---|---|---|---|
| 11 | Small-town & cottage agent | Just Sold postcards, community flyers | Print still reaches the whole town; older, local audience | Starter → Pro |
| 12 | Reluctant veteran | Just Sold postcards to sphere and past clients | How they've always marketed | Starter → Pro |
| 3 | Top producer | Monthly farm postcards, Just Listed/Sold drops | Already pays a designer or printer monthly | More reason to go yearly |
| 1 | Tuesday-night Canva agent | Just Listed/Sold cards to the 100–200 homes around a listing | Same Canva-at-night pain, in print | Firmly Pro |
| 15 | Expired-listing specialist | Door hangers on the expired listing's street | Makes "I'll market it properly" concrete in the pitch | Pro |
| 6 | Courtier immobilier québécois | Accroche-portes, Vendu cards in French | Few print tools do Québec French | Pro |
| 2 | Hungry rookie | Door hangers | Hand-delivered while door-knocking, no postage | A reason to pay at all |

Weaker: condo specialists (buildings restrict delivery; buyers are online), luxury (want premium brochures), bilingual agents (print adds nothing special).

Broker angle: an open house flyer could carry the partner broker's co-branded payment table, which already exists as the feature sheet. That widens the realtor–broker loop (personas 16, 17).

## Rules that shape it

- **Sold advertising needs written consent (Ontario).** [RECO Bulletin 5.4](https://www.reco.on.ca/agents-and-brokerages/reco-bulletins/reco-bulletin-5-4-advertising-sold-property): consent in writing with the dates it starts and expires. Saying "sold" needs the seller's consent before closing and the buyer's after; price or other terms need both, any time. It applies to the buyer's brokerage too. Other provinces have their own rules.
- **Brokerage name on every piece**: RECO counts print as advertising ([Bulletin 5.1](https://www.reco.on.ca/getmedia/fc6d0358-a8a1-4e6b-bfaa-2b8c312e1c3b/RECO-Bulletin-5-1-Advertising-requirements.pdf)).
- **Photo licences may not cover print**: the photographer owns listing photos by default, and an MLS or online licence may not extend to print runs (BCREA guidance, per the personas assessment).
- **Postage is the agent's real cost**: Canada Post Neighbourhood Mail was 18.4¢ a piece in 2025, with a 2026 increase announced (per the personas assessment; check the current price sheet). 500 cards cost far more to mail and print than a month of Pro, so the design is an easy add.

## A gap that exists today

The Sold post flow has no consent check. The caption prompt (`src/lib/generate.ts`, Sold post type) avoids the price unless it's in the listing data, but nothing asks whether the agent has the consent RECO 5.4 requires. That applies to Sold social posts now, not only to print.

## What building it would take

- Formats: postcard (6×4 and 6×9 in), door hanger (about 4.25×11 in, hook cut-out marked), letter-size flyer.
- Print-ready export: `src/lib/pdf.ts` only does letter size today; print shops need bleed, crop marks and 300 dpi.
- A QR code to the listing or the agent's site (exists for broker partners).
- A consent checkbox on Sold designs, price off by default.
- Counting: one print design = one post, all its sizes free, like broker sheets.

## Before deciding

Talk to five agents from personas 11, 12 and 1: do they mail or drop print today, what do they pay, and would they use it from SocialSpark?
