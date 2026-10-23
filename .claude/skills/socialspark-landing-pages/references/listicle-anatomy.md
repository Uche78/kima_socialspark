# Listicle anatomy: "N reasons <reader> should…"

The listicle layout (`layout: "listicle"`, rendered by `src/components/landing/ListicleLanding.tsx`) is modelled on high-converting e-commerce "reasons why" pages (e.g. She's Birdie's "10 Reasons Why the College Safety Bundle…"). It reads like a blog post, which suits search traffic, and sells like a sales letter: every reason is a small, self-contained argument with its own proof.

It must contain all five of these, in this order of importance:

1. **A big benefit or promise:** the headline.
2. **Specific facts about SocialSpark:** one per reason, true and checkable in the code.
3. **Unique positioning:** what only SocialSpark does for *this* reader (Canadian, Québec French, fair-housing wording, platform-specific posts, mortgage math for brokers).
4. **Proof:** real testimonials, a real founder, real numbers, and always real product output.
5. **A good offer package:** the plan that fits them, everything included, and the risk taken off them.

The test (`src/lib/persona-pages.test.ts`) enforces the limits in brackets.

## Page order

| # | Section | Field(s) | Job |
|---|---|---|---|
| 1 | Promise (hero) | `hero.eyebrow`, `hero.headline`, `hero.sub` + form + trust chips + `proof.stats` | Pick out the reader, make the big promise, offer the free sample now |
| 2 | Reasons 01–N | `reasons[]`, CTA button (`cta`) after reasons 3 and 6 | Build the case one fact at a time; give a buy point every few reasons |
| 3 | Proof | `proof.heading`, `proof.testimonials`, `proof.founder` + example posts (always) | Show it's real |
| 4 | Comparison | `comparison` | Position against how they do it today |
| 5 | Offer package | `offer.heading`, `offer.sub` + plan allowance, features and guarantees (from `plans.ts`) | Make the deal concrete and risk-free |
| 6 | Pricing | `planFit` + `PricingPlans` with their plan "Most popular" and billing preselected | Let them pick, nudged toward their plan |
| 7 | Objections | `objections` | Remove the last reasons to wait |
| 8 | Close | `close` + form | One more chance to act |

## 1. The promise

- `meta.title` [≤ 46 chars] and `slug` are the **search phrase** the reader types, chosen like a blog post's keyword: specific to the persona, with real search intent, and not competing with `/` or `/mortgage-brokers`. Examples: `social-media-for-top-producing-realtors`, `condo-realtor-instagram-posts`, `mortgage-broker-feature-sheets-for-realtors`. Use Canadian terms ("realtor", "mortgage agent", "Level 2").
- `hero.eyebrow`: the reader in 2–5 words; it renders as a navy pill with gold text.
- `hero.headline` [≤ 80 chars]: the big promise, as **"N reasons <reader> should <change in behaviour>"**. N must equal the number of reasons (the test checks a leading number). The behaviour change is the reward in disguise ("stop making listing posts by hand", "send every partner a feature sheet"). Write 15–25 candidates (the `socialspark-ad-copy` headline process); keep the runners-up as A/B challengers.
- `hero.sub` [≤ 45 words]: how it works in one breath, and the outcome in their terms.
- The template adds the form and four trust chips (free posts from `FREE_LIMITS`, no credit card, nothing posts without your click, data stored in Canada). Don't repeat them in copy.
- `proof.stats` appear under the chips **only if real** (see Proof).

## 2. The reasons

[7–10 reasons; label ≤ 3 words; body ≤ 70 words; titles unique]

Each reason is `label` (a 1–3 word category, shown next to the gold number), `title` (the benefit, as a full sentence) and `body` (the specific fact that proves it), with an optional `visual` showing real output.

**Order:**
1. The headline benefit, proven (speed, the day it goes live).
2–5. The core product facts, the most surprising first. Use the keystone facts from `socialspark-ad-copy` §1.
6–8. Their specific worries and situation (their assistant, their brand, their photographer, their partners, their compliance).
9. Unique positioning or control (made for Canada, nothing posts without your click).
Last: **the plan**, as the offer reason (Birdie's "Pick 3, Pay for 2"): why their plan was made for them, with `visual: { kind: "plan" }`. No prices; the card renders the allowance from `plans.ts`.

**Rules:**
- **One fact per reason, and it must be specific:** a number, a named post type, a named platform, a named rule. "Six post types cover a listing's whole life", not "Covers all your needs".
- **The title is a benefit; the body is the proof.** Read the titles alone, top to bottom: they should make the whole argument.
- **Don't pad to reach 10.** Seven strong reasons beat ten with filler; change N in the headline to match.
- **Visuals show real output only:**
  - `{ kind: "screen", step: 1 | 2 | 3 }`: the real app (1 = imported listing, 2 = Create a post options, 3 = editor with Publish now and Schedule).
  - `{ kind: "posts", ids: [...] }`: example posts from `src/components/hero/demo-posts.ts`, drawn with the real designs. Pick ids that match the reason (stages: `li-laurier` Coming Soon, `ig-oakridge` Just Listed, `fb-maple` Open House, `ig-harbour` Price Reduced, `ig-maple` Sold, `li-harbour` Featured).
  - `{ kind: "platforms" }`: the same listing on Instagram, Facebook and LinkedIn: side by side from tablet width, one platform per swipe on phones.
  - `{ kind: "sheet" }`: the mortgage feature sheet (broker pages only).
  - `{ kind: "plan" }`: the highlighted plan's card (not on Team pages).
  - Give about half the reasons a visual; text-only reasons give the page rhythm. Visuals alternate sides automatically.
- CTA buttons ("`cta` →", scrolling to the hero form) appear after reasons 3 and 6. Write `cta` as something they get: "See your next listing as a post", "Build a sheet for a partner's listing".

## 3. Proof

Proof is what makes a listicle believable, and it is the one place where a made-up word does the most damage. **Only real proof goes on the page.** When a slot has nothing real, it stays empty and the section hides it; the example posts always show.

| Slot | What qualifies | What the user must provide |
|---|---|---|
| `proof.testimonials` | A real customer's own words about SocialSpark, lightly trimmed for length only | Quote, name, role, brokerage, city, optional headshot (in `public/`), and confirmation they gave permission (`permission: true`) |
| `proof.founder` | The real founder's name, role, story and photo | The founder's own story; write it in their voice from what they tell you, and have them approve it |
| `proof.stats` | Real usage figures from the product database | The figure, its source (query or dashboard) and `asOf` date; the user approves publishing it |
| Example posts (always) | Demo posts drawn with SocialSpark's real designs, labelled as examples for sample listings | Nothing |

- **Testimonials:** choose 3 (or 6) that answer this persona's objections, from people like them (a top producer quoting a top producer). Never edit meaning, combine quotes or invent a name. Don't add star ratings or review counts unless they come from a real review platform.
- **Stats:** good ones are concrete and recent: posts created, listings imported, agents in a province, median seconds from link to post. Round down, never up. Gather them read-only from the SocialSpark Supabase project (`NEXT_PUBLIC_SUPABASE_URL` in `.env.local`), aggregates only, for example:

  ```sql
  -- Guests (anonymous sessions) aren't agents: count signed-up accounts only.
  select count(*) filter (where p.status = 'published') as published_posts,
         count(*) as posts_created,
         count(distinct p.user_id) filter (where not u.is_anonymous) as agents
  from public.posts p join auth.users u on u.id = p.user_id;
  ```

  Show the numbers to the user and publish only what they approve.
- **No press logos, "as seen in", awards or trust badges** unless the user shows they're real.

## 4. Comparison

[4–8 rows]

`comparison.ours` is "SocialSpark"; `comparison.theirs` is **how this reader does it today**: "By hand", "Your assistant in Canva", "A generic AI chatbot", "Your bank's rate sheet". **Never a named competitor** (`socialspark-ad-copy` rule 11). Each row has a short label, SocialSpark's specific answer (gets a gold ✓), and an honest, non-mocking description of the alternative. Include at least two rows of unique positioning (Québec French, fair-housing wording, Canadian mortgage math, platform-specific posts). No price row; pricing has its own section.

## 5. Offer package

`offer.heading` names the package for the reader ("Everything a top producer needs, in one plan"); `offer.sub` is one line on how to start (free first, upgrade when it works). The template fills in the rest from the code, so it stays true when plans change:
- the highlighted plan's monthly posts and regenerations (`PAID_PLANS`), or the Team promise on Team pages;
- every feature in `PLAN_FEATURES` (the mortgage line only on broker pages), plus unlimited edits and scheduling;
- the guarantees: free posts with no credit card (`FREE_LIMITS`), cancel anytime, yearly = two months free.

Don't invent bonuses, discounts, deadlines or guarantees (such as money-back). If the user wants a new offer, it must exist in Stripe and `plans.ts` first; then add it to the template so it renders from code.

## 6–8. Pricing, objections, close

The same as the sections layout ([page-anatomy.md](page-anatomy.md)): `planFit` with the volume math, 4–8 objections in the reader's words (they also become FAQPage structured data), and a close that restates the promise for their next listing. The listicle's reasons are also published as `ItemList` structured data, so reason titles must stand alone.
