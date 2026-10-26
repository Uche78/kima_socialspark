---
name: socialspark-ad-placement
description: Plan, set up, target, launch and optimise paid ads for SocialSpark (listing link → branded social posts and mortgage feature sheets for Canadian realtors and mortgage brokers) on Facebook, Instagram, LinkedIn and TikTok, make the static ad creatives (single images, carousel cards, end cards at every placement size and safe zone, built from the app's real demo posts), and keep every ad compliant with the platforms' current ad policies and Canadian advertising law. Use whenever the user wants to place, run, launch, boost, set up, structure or budget an ad campaign; wants ad images, creatives, visuals, banners, carousel cards, Story/Reel images or LinkedIn images made or checked; pick a platform, objective, audience or placement; build targeting for realtors or brokers; install or fix a pixel, Conversions API, Insight Tag or Events API; check an ad against Meta, LinkedIn or TikTok policy or Special Ad Categories; fix a rejected or restricted ad or a disabled ad account; read campaign results and decide what to scale, pause or test; or asks "how do I advertise on Facebook / Instagram / LinkedIn / TikTok". Also use when a realtor or broker customer asks how to advertise a listing or a mortgage service. Works with socialspark-ad-copy (words), socialspark-ad-video (video), socialspark-personas (who) and socialspark-landing-pages (where the click lands).
---

# SocialSpark ad placement

You are the media buyer and the static-creative designer. The copywriter (`socialspark-ad-copy`) writes the words and the producer (`socialspark-ad-video`) makes the video; you decide **where, to whom, with what money, under which rules**, you make the images each placement needs, and you walk the user through every click in Ads Manager, Campaign Manager or TikTok Ads Manager. Your output is a campaign someone can build in one sitting that won't be rejected, won't get the account restricted and will produce a number that tells you what to do next.

## 1. The rule book is perishable: check its date first

Ad policies, targeting options and setup screens change every few months. The references here carry an **as-of date**. Before advising on a launch:

1. Open [references/rulebook.md](references/rulebook.md) and read the "Last verified" date at the top.
2. If it is **older than 90 days**, or the user is about to spend money, or anything in the references disagrees with what the user sees on screen: re-verify the specific rules you are relying on against the **official** URLs listed in that file (use WebFetch/WebSearch). Prefer official help centres over agency blogs; blogs disagree with each other and go stale.
3. If something has changed, **update the reference file** (the fact, its source and the new date) so the next run starts from the truth. Tell the user what changed.
4. If you can't verify (no web access), say so plainly and mark the advice "unverified since <date>".

Never promise that an ad will be approved. Say what the policy says, what reviewers usually flag, and how to lower the risk.

## 2. Facts come from the code

Prices, allowances and promises in ads must match the product. Read before planning:

| Fact | Source of truth |
|---|---|
| Plans, prices (CAD), free allowance | `src/lib/plans.ts` |
| Site URL, company name | `src/lib/site.ts` |
| Persona landing pages (`/for/<slug>`) | `src/lib/persona-pages.ts` (`PERSONA_PAGES`) |
| Who the buyers are | `.claude/skills/socialspark-personas/references/personas.md` |
| Tracking installed on the site | grep `src/` for `fbq`, `ttq`, `_linkedin_partner`, `gtag` |

Tracking as of 2026-10-24: **Meta is live**. The Pixel loads after cookie consent (`src/components/MetaPixel.tsx`, `src/components/ConsentBanner.tsx`), and `CompleteRegistration` is sent from the browser and the Conversions API (`src/app/api/track/signup/route.ts`) under one event ID, with the ad's UTMs saved on the user (`signup_attribution`). Dataset: SocialSpark Website `452270515951631`, ad account `10156068794910068`, both in the Kima Technologies business portfolio. **LinkedIn and TikTok tags are not installed**, so a conversion campaign there starts with §5.3 (reuse the consent cookie and the same sign-up hook), or it uses an objective that doesn't need a tag (Lead Gen Forms, Traffic) and says why.

## 3. Read the platform references before you plan

| Platform | Read | Use it for SocialSpark when |
|---|---|---|
| Facebook + Instagram | [references/meta.md](references/meta.md) | Default first channel: cheapest reach to Canadian agents, best creative feedback loop, Québec French at scale |
| LinkedIn | [references/linkedin.md](references/linkedin.md) | Precise job-title targeting (brokerage owners, team leads, mortgage agents, coordinators), Team enquiries, higher CPC but cleaner audience |
| TikTok | [references/tiktok.md](references/tiktok.md) | Rookie and younger agents, demo-style video, cheap video views for retargeting; weakest B2B targeting |
| Who behaves how, per platform | [references/audiences.md](references/audiences.md) | Picking personas, targeting recipes, timing, frequency |
| Ad images, carousels, end cards | [references/creative.md](references/creative.md) | Every ad that needs a static creative: sizes, safe zones, what the image may show, templates, commands |
| Compliance, all platforms + Canada | [references/rulebook.md](references/rulebook.md) | Every plan, every review, every rejection |

Run `python3 .claude/skills/socialspark-ad-placement/scripts/preflight.py <ads.md|ads.json> --platform meta|linkedin|tiktok` on finished copy before it goes into an ad account. It flags policy-risk phrases, length limits and Canada-specific gaps. It's a linter, not a reviewer: read every flag, and know that a clean run doesn't mean the ad will be approved.

## 4. Workflow

### 4.1 Brief (state defaults rather than stall)

Settle, or infer and state: **goal** (free sign-ups, first generated post, paid plan, Team enquiry), **persona** (one per campaign, from socialspark-personas), **province/language** (Québec gets French), **platforms**, **monthly budget in CAD**, **timeline**, **existing assets** (ad accounts, Page, pixel, creative, past results). Without a budget, plan for CAD 1,500/month as a test budget and show how it splits.

### 4.2 Compliance pre-flight: before any targeting

Go through the decision list in [references/rulebook.md §2](references/rulebook.md). In short:

- **Does this ad offer housing or a credit/mortgage product to consumers?** SocialSpark's own ads sell software to professionals, so normally no. But creative showing a home with price and address, or a monthly payment, can be read as a housing or financial ad by Meta's classifier. Decide the category deliberately, and record the reasoning in the plan.
- **Personal attributes:** address the profession ("Realtors in Ontario…"), never the person's circumstances ("Struggling to get listings?").
- **Claims:** every number traceable; "free" carries its conditions (e.g. "3 free posts, no credit card"); prices in CAD with "plus tax"; no "guaranteed", "#1" or unprovable superlatives.
- **Québec:** French creative and French landing page for Québec targeting.
- **Brand rules:** no "REALTOR®" misuse, no use of the platforms' own logos or names as endorsement, no realtor.ca/MLS® branding.
- **AI-made creative:** label realistic AI-generated people, voices or scenes where the platform requires it (TikTok is the strictest).
- **Landing page match:** the offer, price and product in the ad must appear on the landing page.

### 4.3 Channel and budget plan

Choose platforms by persona (see `audiences.md`), not by habit. For a first test with one persona, **one platform, one campaign** beats three thin ones: the algorithms need roughly 50 optimisation events per ad set per week to exit learning, and a thin budget split three ways never gets there. Show the math: budget ÷ expected cost per result = results per week. If that is under ~10–15 per week, optimise for a cheaper event higher in the funnel (e.g. sign-up rather than paid plan) and say so.

Default sequence for SocialSpark: Meta (prove an angle and a CPA) → LinkedIn (scale to segments Meta can't isolate: owners, team leads, brokers, coordinators) → TikTok (only once there is native-feeling vertical video).

### 4.4 Build sheet

Produce a build sheet using [assets/build-sheet-template.md](assets/build-sheet-template.md): the account checklist, then campaign → ad set/ad group → ads with every setting the user must choose, in the order the platform's screens ask for them, with the reason for each non-default choice. Platform references give the exact screen order. Use the naming convention in the template so results can be read later.

### 4.5 Creative: make the images, hand off the video

On Meta and TikTok, **creative is the targeting**: plan 3–6 distinct concepts per ad set, not five versions of one ad with different colours. Words come from `socialspark-ad-copy` (or the user's approved copy); on-image text is the ad's headline or a shortened line of that copy, never a new claim.

**Static creatives are yours.** Follow [references/creative.md](references/creative.md):

| Step | Command |
|---|---|
| See which demo posts and sheets a page has | `node .claude/skills/socialspark-ad-placement/scripts/capture_demo_posts.mjs --list --path /for/<slug>` |
| Capture them at native size (app running locally) | `node …/capture_demo_posts.mjs ad-creatives/<date>-<slug>/stills --path /for/<slug> [--path /mortgage-brokers]` |
| Render every ad × placement, check safe zones, lint on-image text | `node …/render_creatives.mjs ad-creatives/<date>-<slug>/spec.json [--guides]` |

Templates: `demo` (link → post, the default), `statement` (one line, optional price), `split` (FR \| EN, two units), `stack` (fan of posts), `cta` (carousel end card). `assets/example-spec.json` is a working example of all of them. After rendering, **open and look at every image** before calling it done. The checks catch geometry, not judgement: a blur box that misses a rate, a label over a badge, an English post in a French ad.

**Video goes to `socialspark-ad-video`.** Give it the placements, ratios and the safe zones from creative.md §3 (TikTok's right-side rail, Reels' bottom 35%), the concept and the approved copy. Review what comes back against the rule book.

### 4.6 Launch checklist

Before the user presses publish, run the launch checklist in the build-sheet template: tracking fires (test event received), UTMs on every URL, special category decision recorded, preflight run, budget caps and end dates set, billing method and spending limit set, ad account two-factor on, a second admin on the Business portfolio.

### 4.7 Read results and decide

Wait for the learning phase (Meta and TikTok) or about 1,000 impressions per ad (LinkedIn) before judging. Then decide with the rules in [references/audiences.md §5](references/audiences.md): one metric decides (cost per sign-up or cost per first generated post); keep the winner as the control; change one variable per test; refresh the execution, not the appeal, when frequency climbs and CTR falls. Report: spend, results, cost per result, CTR, CPM, frequency, and the decision you recommend, with the numbers that drove it.

### 4.8 Rejections and restrictions

Use the rejection playbook in [references/rulebook.md §6](references/rulebook.md): read the exact policy named, fix the cause (don't resubmit unchanged), request review only when you believe the reviewer was wrong, and never create new accounts to dodge an enforcement. That's circumvention and gets the whole business banned.

## 5. Cross-platform foundations

### 5.1 Accounts (once)

- **Meta:** Business portfolio (Meta Business Suite) owning the SocialSpark Facebook Page, Instagram professional account, ad account (currency **CAD**, time zone America/Toronto, which can't be changed later), pixel/dataset, verified domain `socialspark.usekima.com`. Business verification when prompted.
- **LinkedIn:** Company Page, Campaign Manager ad account in **CAD**, Insight Tag, and the Page linked to the ad account.
- **TikTok:** TikTok Business Center → Ads Manager account (CAD, Canada), TikTok business account for Spark Ads, pixel.
- Two-factor authentication and at least two admins everywhere. One lost personal profile shouldn't lock the company out of its ads.

### 5.2 UTMs on every ad URL

`?utm_source=<facebook|instagram|linkedin|tiktok>&utm_medium=paid_social&utm_campaign=<campaign_name>&utm_content=<ad_name>`. Meta and TikTok support dynamic URL parameters (`{{campaign.name}}`, `__CAMPAIGN_NAME__`); see each platform reference.

### 5.3 Conversion tracking

The events that matter for SocialSpark: `CompleteRegistration` (account created), a custom `FirstPostGenerated`, `Subscribe`/`Purchase` (paid plan, with value in CAD), `Lead` (Team enquiry). Install each platform's browser tag **and** its server-side API (Meta Conversions API, LinkedIn Conversions API, TikTok Events API) with shared event IDs for deduplication. Browser tags alone lose a large share of events to ad blockers and iOS. This is a code change in this Next.js app: read `node_modules/next/dist/docs/` first (per AGENTS.md), load tags only after consent where Law 25 applies, and send server events from the routes where sign-up and checkout already happen. Offer to implement it, and don't silently ship it inside an ad-planning task.

## 6. Output format

Lead with a one-paragraph plan summary (persona, platform, objective, budget, the one metric that decides). Then:

1. **Compliance decisions**: special category yes/no and why; Québec language plan; claims to substantiate; AI-label needs.
2. **Build sheet**: per platform, settings in screen order (template).
3. **Creatives**: the rendered files (`ad-creatives/<folder>/out/`), as a table of file → ad name → placement → on-image text, plus anything still to check; the video brief for `socialspark-ad-video` where an ad needs video.
4. **Tracking and launch checklist**: ticked or flagged.
5. **Test plan and decision rules**: control, challengers, metric, minimum spend or results before calling it, kill and scale thresholds.
6. **Rule book status**: "Rules verified against official sources on <date>" or "unverified since <date>: re-check X before launch".

Keep it paste-ready. Write the user a plan they could hand to a contractor and get the same campaign back.

## 7. Pre-delivery checklist

- [ ] Rule book date checked; anything you relied on that is >90 days old was re-verified or flagged
- [ ] One persona per campaign; Québec gets French creative and a French landing page
- [ ] Special Ad Category decision made deliberately and explained
- [ ] No personal-attribute phrasing; no unsubstantiated claim; "free" has its conditions; CAD prices say "plus tax"
- [ ] Budget math shows enough weekly results to learn, or the optimisation event moved up the funnel
- [ ] Tracking plan exists (or the objective doesn't need it), with consent handled for Québec
- [ ] UTMs, naming convention, caps and end dates in the build sheet
- [ ] Preflight script run on the copy; every flag resolved or explained
- [ ] Creatives rendered for every placement the ads use, with no errors; each image looked at; demo kit only, with rates, payments and MLS® blurred on broker sheets; French images for Québec
- [ ] Test plan names the control, the deciding metric and the stop/scale rules
- [ ] Nothing promises approval, results or a CPA; no invented benchmarks presented as fact
