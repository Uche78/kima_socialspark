# Meta: Facebook + Instagram

**Last verified: 2026-10-24.** Screen names drift. If the user's Ads Manager shows something different, trust their screen, adapt, and update this file.

## Contents
1. When Meta, and for whom
2. One-time setup
3. Choosing the objective (with and without a pixel)
4. Campaign structure for SocialSpark
5. Step-by-step build in Ads Manager
6. Targeting recipes
7. Creative specs and placements
8. Retargeting without breaking privacy law
9. Reading results
10. Boost button vs Ads Manager

---

## 1. When Meta, and for whom

Meta is the default first channel. Almost every Canadian agent runs a business Facebook Page and an Instagram account, and many already boost their own listings, so they're used to ads appearing there. CPMs are low relative to LinkedIn, the creative feedback loop is fast, and Québec French ads reach Québec agents at scale. Weaknesses: no reliable job-title targeting (interests are broad hints), and housing-looking creative can be misclassified.

Best personas: Tuesday-Night Canva Agent, Hungry Rookie, Top Producer, Condo Specialist, Le courtier immobilier québécois, Bilingual Border Agent, Agent Who Fired Their VA, Referral-Hungry Mortgage Agent, First-Time-Buyer Broker.

## 2. One-time setup

1. **Business portfolio** at business.facebook.com. Add the SocialSpark Facebook Page and connect the Instagram professional account (Settings → Accounts → Instagram accounts).
2. **Ad account:** Settings → Accounts → Ad accounts → Add → Create. Currency **CAD**, time zone **America/Toronto** (you can't change either later without a new account). Add a payment method and set an **account spending limit** as a safety cap.
3. **Business verification** (Security Centre) using Kima Technologies Inc. documents; needed for some features and appeals.
4. **Domain verification:** Brand safety → Domains → add `socialspark.usekima.com` (DNS TXT record, or meta-tag in the root layout).
5. **Dataset (pixel) + Conversions API:** Events Manager → Connect data → Web. Not installed yet (see SKILL.md §5.3). Events: `CompleteRegistration`, custom `FirstPostGenerated`, `Subscribe` (value + currency CAD), `Lead` (Team enquiry). Send each from both browser and server with the same `event_id`. Verify in Events Manager → Test events, and aim for an Event Match Quality of "Good" or better (send hashed email server-side).
6. **People:** at least two admins with two-factor on; agencies get Partner access, never your login.

## 3. Choosing the objective

| Goal | Objective | Conversion location | Optimise for | Needs pixel? |
|---|---|---|---|---|
| Free sign-ups (default) | **Leads** | Website | `CompleteRegistration` | Yes |
| Activated users | **Leads** or **Sales** | Website | `FirstPostGenerated` (once ≥ ~50/week) | Yes |
| Paid plans | **Sales** | Website | `Subscribe`/`Purchase` with value | Yes, and enough volume |
| Team/brokerage enquiries | **Leads** | Instant forms | Leads (or "Conversion leads" with CRM feedback) | No |
| Before tracking exists | **Traffic** | Website | Link clicks | No (landing page views need the pixel) |
| Cheap retargeting pool | **Engagement** | Video | ThruPlay / 2-sec views | No |

Rule: optimise for the deepest event that will happen ~50 times per ad set per week at your budget. At CAD 50/day and a hypothetical CAD 15 cost per sign-up, that's ~23 sign-ups/week, so optimise sign-ups, not paid plans. Don't quote cost-per-result figures as benchmarks; measure your own.

Instant forms bring high volume and low intent. For self-serve sign-ups send people to the site; use forms only for Team enquiries, with "Higher intent" (review screen) enabled.

## 4. Campaign structure for SocialSpark

Consolidate. Meta's delivery system (Andromeda retrieval + ranking) now picks audiences from the creative, so creative diversity is the main lever and fragmented ad sets starve the algorithm **[reported, widely]**.

```
Campaign: SS_META_LEADS_SIGNUP_EN_2026-11        (Advantage+ / campaign budget on)
 ├─ Ad set: EN_CA-exQC_Broad_AdvAudience          (Canada minus Québec, English)
 │    └─ 3–6 ads, each a distinct concept (demo, time saved, voice, control, personal brand…)
 └─ Ad set: FR_QC_Broad_AdvAudience               (Québec, French; optional separate campaign for budget control)
      └─ 3–6 French-native ads
```

- One campaign per objective; one ad set per **language/market**, not per interest.
- Separate brokers from realtors only when the creative and landing page differ (they should): run brokers as their own campaign or ad set, with broker creative → `/mortgage-brokers`.
- Test with Meta's **A/B test** tool (or separate campaigns) only when you need a clean read on one variable; otherwise let the ads compete inside the ad set.

## 5. Step-by-step build in Ads Manager

**Campaign level**
1. Ads Manager → **+ Create** → choose objective (§3). If offered, keep the **Advantage+** setup (Meta's automated campaign) unless you need manual control.
2. **Campaign name:** naming convention from the build-sheet template.
3. **Special Ad Categories:** declare only if the pre-flight (rulebook §2) says the ad offers housing, employment or financial products. For SocialSpark's software ads, leave blank and record why.
4. **Campaign budget (Advantage campaign budget):** daily budget in CAD. Bid strategy **Highest volume** to start; add a **cost per result goal** only once you know your real CPA.

**Ad set level**
5. **Conversion location** and **performance goal** (§3); select the dataset and the event.
6. **Attribution:** 7-day click, 1-day view by default. Consider **7-day click only** for a B2B sign-up so view-throughs don't flatter results; keep it consistent across tests.
7. **Schedule:** start date; set an **end date** on tests.
8. **Audience:** see §6. Location by province; for the Québec ad set, also set **Language: French (all)**.
9. **Placements:** Advantage+ placements (all) to start. Exclude Audience Network if lead quality is poor (check sign-ups → first post by placement in the breakdown).

**Ad level**
10. **Identity:** SocialSpark Facebook Page + Instagram account.
11. **Format:** single image/video, carousel (great for "link → 5 finished slides"), or Flexible format (Meta picks the best combination from several images/videos).
12. **Creative:** upload per-placement versions (4:5 feed, 9:16 Stories/Reels). Add up to 5 primary texts and 5 headlines only if each is a genuinely different appeal.
13. **Advantage+ creative enhancements:** review them one by one. **Turn OFF text improvements/generation** and anything that rewrites copy or generates backgrounds or people. Generated text can introduce unsubstantiated claims or personal-attribute phrasing you never approved, and it breaks French/English separation. Visual touch-ups, brightness and music are lower risk; keep only those you're happy for Meta to vary.
14. **AI disclosure:** if the creative contains realistic AI-generated people, voices or scenes, use the AI disclosure option where available. Real screen recordings don't need it.
15. **Destination:** website URL (persona page `/for/<slug>` when one exists), **URL parameters:** `utm_source={{site_source_name}}&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_content={{ad.name}}`.
16. **CTA button:** Sign up / Get started / Learn more (test only if you've nothing better to test).
17. **Tracking:** dataset ticked under Website events.
18. **Review** the preview in every placement (check the safe zones), then **Publish**. Review usually takes minutes to 24 hours.

## 6. Targeting recipes

Meta has no dependable job-title targeting (work-title targeting was mostly retired); interests are hints that Advantage+ Audience can go beyond. So:

- **Default: Advantage+ Audience with suggestions.** Location (provinces), language for Québec, age minimum 25 as a control (licensed agents are adults, and it trims students), and audience suggestions: interests around real estate *as a profession* (e.g. "Real estate broker", "Real estate agent", "Multiple listing service", "Canva", "Mortgage broker" for brokers). Check each still exists in the picker; retired interests break ad sets.
- **Let the creative qualify the viewer.** The first frame and first line should only make sense to an agent ("Your new listing, posted before you leave the driveway"). That does more targeting than any interest.
- **Custom audiences** (strong): site visitors (once pixel + consent exist), Facebook/Instagram engagers, video viewers (50%+), and customer lists with consent. Use **exclusions** for existing customers on acquisition campaigns.
- **Lookalikes:** seed from paying customers (≥ 100 people, ideally 1,000+), Canada 1–3%. Under Advantage+ they become suggestions.
- **Never** use exclusions or targeting that proxy protected traits, even on non-SAC campaigns.

## 7. Creative specs and placements

| Placement | Ratio | Pixels | Notes |
|---|---|---|---|
| Feed (FB, IG) | 4:5 (or 1:1) | 1080×1350 | Best default for images and carousels |
| Stories, Reels | 9:16 | 1080×1920 | Keep text out of the top ~14% and bottom ~35% (Reels UI) |
| Carousel | 1:1 or 4:5 | 1080×1080 / 1080×1350 | 2–10 cards; card 1 must work alone |
| Video | 9:16 for Reels/Stories, 4:5 for feed | — | Hook in 0–2 s, captions burned in (most watch muted), 15–45 s |

Copy: primary text, first ~125 characters visible; headline ≤ 40 (27 shows reliably); description is often hidden. Full rules are in `socialspark-ad-copy/references/platforms.md`. Image text: no hard limit any more, but heavy text reads as an ad and delivers worse; keep overlays to ≤ ~8 words.

What wins for SocialSpark (hypotheses to test, not facts): the **demonstration** (paste link → finished branded carousel), the agent's **own branding** on the output, the **Tuesday-night** scene, **Québec French** output shown on screen.

## 8. Retargeting without breaking privacy law

- Engagement and video-view audiences are built on Meta and need no site pixel or consent banner. Start there.
- Website retargeting needs the pixel, and Québec's Law 25 needs opt-in consent first. Until a consent banner exists, exclude Québec from website-visitor retargeting or don't load the pixel for Québec visitors.
- Keep retargeting windows short (7–30 days) and frequency under ~3/week; agents notice and get annoyed.

## 9. Reading results

- **Learning phase:** don't edit budgets by more than ~20% at a time or change targeting/creative during the first ~50 conversions or 7 days, because edits reset learning.
- **Breakdown → By delivery → Placement / Age / Region** to find where sign-ups come from; act only on meaningful volume.
- **Signals of fatigue:** frequency > ~3 (prospecting, 7 days) with CTR falling and CPA rising → new execution of the same winning appeal.
- **Kill rule (default):** an ad that spends 2–3× target CPA with zero results gets paused; the ad set keeps running.
- **Scale rule:** stable CPA for 7 days → raise budget 20% every 2–3 days, or duplicate into a fresh campaign with a higher budget for large jumps.

## 10. Boost button vs Ads Manager

Boosting a Page or Instagram post is fine for engagement, but it hides most settings (objective, placements, enhancements, UTMs). For anything measured, build in Ads Manager. A strong organic post can be used there as an existing post (keeps the social proof).
