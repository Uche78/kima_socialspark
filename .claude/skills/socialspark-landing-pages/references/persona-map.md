# Persona → page map

The plan and billing columns mirror `PERSONA_PLAN` in `src/lib/persona-pages.ts`; that is the source of truth, so update both together. The rule agreed for choosing them: highlight the plan the persona **settles on** (the destination of an upgrade path like "Starter → Pro"), feature the **Team banner** for the team and brokerage buyers, and preselect **yearly** only where the personas fit table says yearly outright ("Monthly → yearly" starts on monthly, since yearly is offered after a first good month).

Slugs are starting ideas; pick the final one as a search phrase (see listicle-anatomy.md §1) and check it against `PERSONA_PAGES`.

| # | Persona | Tier | Audience | Suggested slug | Highlight | Billing | Blocker / note |
|---|---|---|---|---|---|---|---|
| 1 | Tuesday-Night Canva Agent | 1 | realtor | `listing-agents` | Pro | Monthly | Starter for a trial month, then Pro at 1–2 listings a month across two platforms |
| 2 | The Hungry Rookie | 2 | realtor | `new-realtors` | Starter | Monthly | Burst user: never push yearly |
| 3 | The Top Producer | 1 | realtor | `social-media-for-top-producing-realtors` (**built**, listicle) | Top Producer | Yearly | Plan is named after them; 4+ listings × 4 stages × 2 platforms is 30+ posts |
| 4 | The Team Lead | 2 | realtor | `real-estate-teams` | Team banner | n/a | **Team not built**: promise only what the banner says; call to action is "Talk to us" |
| 5 | The Marketing Coordinator | 2 | realtor | `real-estate-marketing-coordinators` | Top Producer | Monthly | Not the payer: give them the one-line case for their boss |
| 6 | Le courtier immobilier québécois | 1 | realtor | `courtiers-immobiliers` | Pro | Monthly | **Needs a Québec French page** (locale work first, see SKILL.md §3) |
| 7 | The Bilingual Border Agent | 1 | realtor | `bilingual-realtors` | Top Producer | Yearly | Pro covers single bilingual captions; Top Producer when posting each language separately |
| 8 | The Part-Timer | 3 | realtor | `part-time-realtors` | Starter | Monthly | Tier 3; "cancel after Sold" is the selling point; never yearly |
| 9 | The Luxury Specialist | 2 | realtor | `luxury-realtors` | Pro | Yearly | Output quality is everything: the hero visual and photo-picking facts carry the page |
| 10 | The Condo & Pre-Sale Specialist | 1 | realtor | `condo-realtors` | Top Producer | Monthly | Price Reduced posts pile up; volume passes Pro's 20 |
| 11 | The Small-Town & Cottage Agent | 2 | realtor | `cottage-realtors` | Starter | Yearly | Long listing life, steady year-round |
| 12 | The Reluctant Veteran | 2 | realtor | `experienced-realtors` | Starter | Yearly | Low-tech: emphasise "no Instagram skills needed", one decision then done |
| 13 | The Agent Who Fired Their VA | 2 | realtor | `realtor-assistant-alternative` | Top Producer | Yearly | Compares against a person's wage, not Canva |
| 14 | The Independent Brokerage Owner | 2 | realtor | `brokerages` | Team banner | n/a | **Team not built**: seats, admin view and brand kit are promised, not delivered |
| 15 | The Relocation & Newcomer Agent | 3 | realtor | `newcomer-community-realtors` | Starter | Monthly | Tier 3: no languages beyond EN/FR; validate before building |
| 16 | The Referral-Hungry Mortgage Agent | 1 | broker | `mortgage-agents` | Pro | Monthly | Sheets, PDFs and Stories free; captions use the plan |
| 17 | The Realtor-Network Broker | 1 | broker | `mortgage-broker-realtor-partners` | Top Producer | Yearly | `planFit` must say Top Producer is for brokers too (its card reads "For high-volume listing agents") |
| 18 | Le courtier hypothécaire québécois | 1 | broker | `courtiers-hypothecaires` | Pro | Yearly | **Needs a Québec French page**; AMF context |
| 19 | The First-Time-Buyer Broker | 1 | broker | `first-time-buyer-mortgage-brokers` | Pro | Monthly | About 3 sheets a week posted ≈ 13 posts a month |
| 20 | The Bank Mobile Mortgage Specialist | 3 | broker | `bank-mortgage-specialists` | Starter | Monthly | Tier 3: only after employer compliance allows third-party tools |

## Suggested build order

1. Tier 1 English: 3, 10, 1, 16, 17, 19, 7 (the highest pay intent and clearest plan fit first).
2. Tier 1 French, after locale support: 6, 18.
3. Tier 2: 9, 13, 12, 11, 2, 5, then 4 and 14 once Team fulfilment is decided.
4. Tier 3 only on request: 8, 15, 20.
