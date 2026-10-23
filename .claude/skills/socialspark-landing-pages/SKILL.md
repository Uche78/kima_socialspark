---
name: socialspark-landing-pages
description: Build a converting, single-persona sales landing page for SocialSpark (listing-link → branded social posts for Canadian realtors, mortgage feature sheets for brokers) at /for/<slug>, either a listicle ("10 reasons <persona> should…", with proof, specific facts, unique positioning, a comparison and an offer package) or a section-based page, written for one persona from socialspark-personas, with copy from socialspark-ad-copy's Hopkins rules, SocialSpark branding, and the site's real pricing component highlighting the plan that fits that persona as "Most popular". Use whenever the user asks for a landing page, sales page, listicle, "reasons why" page, persona page, campaign or ad destination page, SEO landing page, "a page for <persona or segment>", or to review, rewrite or A/B test an existing /for/ page.
---

# SocialSpark persona landing pages

One page, one persona, one action. Each page sells SocialSpark to a single persona from the `socialspark-personas` skill, and every line exists to get that reader to paste a listing link into the form (the free sample). The pricing section is the site's own `PricingPlans` component, with the plan that fits the persona marked **Most popular** and their billing preselected.

This skill works with two others. Use them, don't paraphrase them:

- **`socialspark-personas`** decides *who* the page is for: their trigger moment, their words, their objections, the plan they'll pay for. Load it first.
- **`socialspark-ad-copy`** decides *how it's said*: Hopkins' rules, the headline process, the banned words, the keystone facts. Load it before drafting, and read its `references/hopkins-principles.md`.

## 0. Pick the layout

| Layout | Use it for | Reference |
|---|---|---|
| **`listicle`** (default) | Search traffic and cold ad traffic: a blog-style "N reasons <reader> should…" page with proof, specific facts, unique positioning, a comparison and an offer package | [references/listicle-anatomy.md](references/listicle-anatomy.md) |
| `sections` | Warm traffic that already knows the problem: hero, before/after, how it works, pains taken, pricing | [references/page-anatomy.md](references/page-anatomy.md) |

Default to the listicle unless the user asks otherwise. Both can exist for one persona as an A/B test (different slugs). Read the layout's reference before drafting, and [references/persona-map.md](references/persona-map.md) for the slug idea, plan and blockers.

## 1. How the pages are built

| Piece | File | What it does |
|---|---|---|
| Page entries | `src/lib/persona-pages.ts` → `PERSONA_PAGES` | All the copy for each page, typed `ListiclePage` or `SectionsPage`. **This is the file you write.** |
| Plan per persona | `src/lib/persona-pages.ts` → `PERSONA_PLAN` | Plan marked "Most popular" and billing preselected, for all 20 personas |
| Listicle template | `src/components/landing/ListicleLanding.tsx` | Promise, numbered reasons with real visuals and CTAs, proof, comparison, offer package, pricing, objections, close |
| Sections template | `src/components/landing/PersonaLanding.tsx` | Hero, before/after, how it works, pains taken, pricing, objections, close |
| Route | `src/app/for/[slug]/page.tsx` | Static, indexed, canonical; WebPage, FAQPage and (listicle) ItemList JSON-LD; unknown slugs are 404s |
| Pricing | `PricingSummary` → `PricingPlans` (`highlight`, `initialInterval`) | Same cards, toggle and Team banner as `/pricing`; `highlight: "team"` features the Team banner above the cards |
| Offer facts | `src/lib/plans.ts` → `PAID_PLANS`, `PLAN_FEATURES`, `FREE_LIMITS` | Allowances, features and the free offer, rendered by the templates (never typed into copy) |
| Real visuals | `src/components/hero/demo-posts.ts`, `public/landing/step-*.webp`, `SheetExample` | Example posts with the real designs, real app screens, the feature sheet |
| Discovery | `src/app/sitemap.ts`, `src/app/llms.txt/route.ts` | Every entry is listed automatically |
| Copy rules | `src/lib/persona-pages.test.ts` | Lengths, counts, the headline's N matching the reasons, real demo ids, testimonial permission, stat sources, no prices, no placeholders, no hype words |

A new page is normally **one new entry in `PERSONA_PAGES` and nothing else**. Don't fork a template for one persona. If a persona really needs something new, add it to the template as an optional field so every page can use it.

**Prices never go in the copy.** The components read `src/lib/plans.ts`, so the page stays right when prices change. Copy can name a plan and its post allowance (in `planFit`, for example), but no dollar amounts; the test enforces this.

## 2. Facts and proof: only what's true

Every claim on the page must be true today. Use the fact sources tables in both companion skills (plans, FAQ, landing pages, `llms.txt`, and the keystone-fact files `generate.ts`, `caption.ts`, `photos.ts`, `photo-quality.ts`, `mortgage-sheet.ts`, `feature-sheet.ts`, `broker.ts`). The existing `src/app/page.tsx`, `src/components/landing/LandingSections.tsx`, `src/app/mortgage-brokers/page.tsx` and `src/lib/faq*.ts` show which claims are already approved for public copy. Reuse their wording where it fits.

**Proof is real or absent.** Testimonials, founder story and usage numbers have typed slots (`proof.testimonials`, `proof.founder`, `proof.stats`) that stay hidden while empty. Fill them only with what the user supplies: a customer's own words with their permission, the founder's own story, figures with a source and date that the user approved. Never invent, combine or "improve" a quote, a name, a number, a rating, a press mention or a logo. Until real proof exists, the page's proof is the product itself: real app screens and example posts drawn with the real designs, labelled as examples. Ask the user for proof at the start of every page; list what's missing in the hand-off.

Product gaps from the personas skill (team seats and brand kit, MLS/DDF import, Reels video, languages other than English and French) are never implied. New offers (discounts, bonuses, money-back guarantees) don't go on a page until they exist in Stripe and `plans.ts`.

## 3. SocialSpark branding

Pages render inside the site layout (the SocialSpark wordmark header, "Try it for free", the footer with the CREA notice), so they're on-brand by default. Inside the page, use only the site's brand system, the same classes as the existing landing pages:

| Token | Value | Use |
|---|---|---|
| Navy (`--brand`) | `#0f2a44` | Dark sections, the highlighted plan's ring, the eyebrow pill, "Most popular" badges |
| Gold (`--accent`) | `#d4a24c` | Reason numbers, ✓ ticks, eyebrows on navy, Yearly savings |
| Cream | `#eeebe4` | Hero and offer panels, visual backdrops |
| Ink | `#141414` / `#000103` at 90% | Text, primary buttons (rounded-full, black) |
| Page | `#f7f6f3` (`--background`) | Body background |
| Headings | Montserrat, `font-[family-name:var(--font-heading)]`, weight 500–600, `tracking-[-0.02em]` | All headings and big numbers |
| Body | Inter (`--font-sans`) | Everything else |
| Playfair Display (`--font-display`) | | The logo and post designs only. Never for page copy |

Shapes: `rounded-3xl` panels, `rounded-2xl` cards, `rounded-full` buttons and chips. Eyebrows: 11–12px uppercase, `tracking-[0.2em]`. Write the name **SocialSpark** (one word, capital S twice); "Top Producer", "Pro" and "Starter" exactly as in `plans.ts`. Visuals come only from the real product (§1); no stock photos of people, no AI-generated imagery, no competitor screenshots.

## 4. Workflow

1. **Pick the persona** (the user's choice, or recommend from the fit table, Tier 1 first). Check [references/persona-map.md](references/persona-map.md) for a **blocker** before writing anything:
   - **Québec personas (6, 18)** need Québec French pages. The templates, pricing component and `ImportForm` are English-only, and `<html lang>` is `en-CA`. Stop and tell the user. A French page first needs a `locale` on `PersonaPage`, French labels in `PricingPlans` / `PricingSummary` / `TeamBanner` / both templates, `inLanguage: "fr-CA"` in the JSON-LD and a `lang="fr-CA"` wrapper. Do that only with their go-ahead; never ship an English page to these personas.
   - **Team personas (4, 14)** are sold but not delivered: the page may only promise what the Team banner already promises (seats, one invoice, a shared brand kit, "Talk to us"). No `plan` visual. Persona 5 is not the payer, so the page arms them with the case for their boss.
   - **Tier 3 (8, 15, 20):** build only if the user asks after hearing the caveat.
2. **Ask for proof** (§2): real testimonials from people like this persona, the founder story, approved usage numbers. Proceed without them; the slots stay empty.
3. **Pick the keyword and slug.** The search phrase this persona types, used in the slug and `meta.title` (see the listicle reference). Check it doesn't compete with `/`, `/mortgage-brokers` or another `/for/` page.
4. **Pull the persona entry** from `socialspark-personas/references/personas.md`: who they are, today, goals, triggers, why they'd use it, why they'd pay, objections, the message that lands. Their words become the page's words.
5. **Mine the facts.** Following `socialspark-ad-copy` §1, list 8–12 specific, true facts that matter to *this* persona and mark the 3 most surprising. For a listicle, these become the reasons; decide the unique-positioning ones (what only SocialSpark does for them).
6. **Message match.** If ads already point at this persona, the headline restates the winning ad's promise. If none do, offer to brief `socialspark-ad-copy` with this page's angle and URL afterwards.
7. **Headlines first.** Run the ad-copy headline process: 15–25 candidates across at least three appeals, pick one, keep the runners-up as A/B challengers.
8. **Write the entry**, section by section, per the layout's reference.
9. **Check the plan fit.** `PERSONA_PLAN[n]` already holds the persona's plan. Write `planFit` with the volume math from the personas skill. If the evidence has changed, change `PERSONA_PLAN` and the map reference together, and say so.
10. **Verify** (§6), then hand off (§7).

## 5. Copy rules

All of `socialspark-ad-copy` §3 and its checklist apply. On top of that, for a page:

- **One goal.** The only actions are the import form, the CTA buttons that scroll to it, and the plan cards. No secondary offers, newsletter boxes or links to other personas' pages.
- **The header doesn't compete.** On `/for/` pages, signed-out visitors see no "Sign in" (`LoginLink`, `signedOut`), and the header's "Try it for free" scrolls to and focuses the hero form instead of leaving for the home page (`TryFreeButton`). Guests who have already started still see "Save your work", because it turns their trial into an account. Keep it that way: never add header links, banners or pop-ups to these pages. The footer (legal links, CREA notice) stays.
- **The form is the offer.** Every call to action gives something away ("See your next listing as a post", "Build your first sheet free"). The risk reversal (free posts, no credit card, nothing posts without their click, cancel anytime) is rendered by the templates from the code; don't hand-type the numbers.
- **Their words, their week.** Use the persona's vocabulary (listing presentation, Just Listed, open house, partner realtors, Level 2, pre-sale) and their real moments (10 p.m. after showings, the day a listing goes live).
- **Rewards and present pains, not fear.** No compliance scare copy for brokers; "ready to share" beats "avoid fines".
- **The more you tell, the more you sell, but scannably.** Long is fine when each block answers a question this persona has. Short sentences, concrete nouns, one fact per reason.
- **No fake urgency or fake proof.** No countdowns, "only X spots", invented counts, star ratings, press logos or badges.
- **Comparisons are against their current way, never a named competitor.**
- **Brokers:** never imply SocialSpark sets, recommends or quotes rates, or that it makes anyone compliant.
- **Canadian English** (colour, licence, centre); prices in CAD only via the component.

## 6. Verify before handing over

1. `npx next typegen && npx tsc --noEmit -p .` and `npx eslint src/lib/persona-pages.ts`.
2. `npx vitest run src/lib/persona-pages.test.ts`. Fix the copy, not the test. Change a rule only if the user agrees.
3. Render it: open `/for/<slug>` on the running dev server (check `lsof -iTCP -sTCP:LISTEN` for its port; use the `run` skill if none is running; if a new slug 404s, touch `src/app/for/[slug]/page.tsx` so the static params reload). Screenshot at 1440px and 390px, **scrolling the page first** so lazy images load (Playwright is in `.claude/skills/socialspark-ad-video/scripts/node_modules`). Check:
   - the headline wraps cleanly, and the form and trust chips are on the first phone screen;
   - every visual shows real output, uncropped and not blank;
   - **images are sharp on retina**: at `deviceScaleFactor: 2`, compare each image's real source pixels (decode `currentSrc`; Next/Image's `naturalWidth` is srcset-scaled and misleading) against its drawn size × 2, allowing for `object-fit: cover` cropping. Anything above about 1.2× upscaled looks soft. Demo posts on these pages use `hdPost()` / `withHdPhotos()` (the 1024px `public/hero/*-hd.webp`); the 640px originals are only for the home page's fast mobile hero. Give `next/image` an honest `sizes` value. New photos must be CC0, unwatermarked and at least 2× their largest drawn size, with the source recorded in `public/hero/CREDITS.md`;
   - there's no horizontal scroll (`document.documentElement.scrollWidth` equals the viewport width), and the comparison table fits at 390px;
   - the right plan says **Most popular**, comes first on phones, and the toggle shows the persona's billing;
   - the CTAs scroll to the form, and the FAQ items open;
   - **one-goal check**, in a fresh signed-out browser: the header has no "Sign in", "Try it for free" stays on the page and focuses the hero form, and every other clickable element leads to the form, the plans (`/pricing`), the Team enquiry, or the footer.
4. Confirm `/for/<slug>` appears in `/sitemap.xml`, and that `/pricing`, `/` and `/mortgage-brokers` still highlight Pro.
5. Re-read every line against the checklist in `socialspark-ad-copy` §6 and the salesman test.

## 7. Hand-off

Reply with:

```
Page: /for/<slug>: persona #<n> <name> (<tier>), <listicle|sections>
Search phrase: <keyword>, title: <meta.title>
Plan highlighted: <plan>, <monthly|yearly> preselected. Why: <volume math>
Headline: <chosen>. Challengers: <2–3 alternates, different appeals>
Unique positioning used: <the reasons/rows only SocialSpark can claim>
Proof on the page: <real output / testimonials / founder / stats>. Missing: <what the user should send>
Test plan: <what to A/B first (the headline), the one metric (visitor → first generated post, then → paid plan), and the minimum traffic before calling it>
Ads: <suggest briefing socialspark-ad-copy with this URL and angle, or note message match with existing ads>
```

Don't commit unless asked. When asked to build several pages, do them one persona at a time, each through the full workflow; don't batch-write near-identical copy.
