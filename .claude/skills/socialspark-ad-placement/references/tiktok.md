# TikTok

**Last verified: 2026-10-24.** TikTok renames campaign types often (e.g. Smart+ was upgraded in 2025–2026). Trust the user's screen and update this file.

## Contents
1. When TikTok, and for whom
2. One-time setup
3. Campaign types and objectives
4. Step-by-step build in TikTok Ads Manager
5. Targeting
6. Creative: the part that decides everything
7. Reading results

---

## 1. When TikTok, and for whom

TikTok has the weakest professional targeting of the four platforms (no job titles), but cheap video reach and a big community of real estate creators ("RealtorTok"). Many newer agents learn marketing there. It works for SocialSpark when:

- The persona is the **Hungry Rookie**, a younger **Tuesday-Night Canva Agent**, or a **Condo Specialist** in Toronto, Vancouver or Montréal.
- You have **native-feeling vertical video**: a real agent (or founder) on camera, screen recording of the link → post flow, a trending-but-licensed sound. Polished brand ads tend to underperform there.
- You want cheap **video-viewer pools** to retarget later on TikTok (or to inform Meta tests).

Status in Canada: ads run normally; the 2024 wind-down order was reversed in 2026 (rulebook §3.3).

## 2. One-time setup

1. **TikTok Business Center** (business.tiktok.com): create the business (Kima Technologies Inc.), then an **Ads Manager account**: country Canada, currency **CAD**, time zone Toronto (permanent). Add billing.
2. **TikTok business account** for SocialSpark (to post organically and authorise Spark Ads); link it in Business Center → Assets → TikTok accounts.
3. **Pixel + Events API:** Assets → Events → Web events. Map `CompleteRegistration`, `Subscribe` and a custom `FirstPostGenerated`. Not installed yet (SKILL.md §5.3); Law 25 consent for Québec.
4. Two admins, two-factor on.

## 3. Campaign types and objectives

Objectives are grouped into **Awareness** (Reach), **Consideration** (Traffic, Video views, Community interaction, Lead generation) and **Conversion** (Sales/Website conversions, App promotion).

Setup types:
- **Smart+ campaign:** TikTok automates targeting, placement, bidding and creative combinations. Supported for Sales, Lead Generation, App Promotion and, in the upgraded version, Traffic **[official help, versions differ]**. Good default once the pixel has events.
- **Manual campaign:** full control. Use it for the first tests and for Québec/French separation.
- **Search campaign:** ads in TikTok search results (keywords like "real estate marketing", "listing video"). Small volume in Canada; test later.

| Goal | Objective | Optimise for |
|---|---|---|
| Sign-ups (pixel live) | Sales → Website conversions (or Lead generation → Website) | `CompleteRegistration` |
| Before the pixel | Traffic | Landing page views or clicks |
| Retargeting pool | Video views | 6-second views / 15-second views |
| Enquiries | Lead generation | Instant form (privacy policy required) |

## 4. Step-by-step build in TikTok Ads Manager

**Campaign**
1. Ads Manager → **Create** → choose setup (Manual / Smart+) and objective.
2. Name (convention in the build-sheet template); campaign budget optimisation on/off; daily or lifetime budget. Reported minimums are about USD 50/day per campaign and USD 20/day per ad group **[check CAD amounts in the account]**.

**Ad group**
3. **Optimisation location:** Website, with pixel and event selected.
4. **Placements:** TikTok only to start (turn off Pangle/Global App Bundle, which bring poor B2B traffic). Placements can't be changed after the ad group is created, so test them in separate ad groups.
5. **Audience:** location (provinces), **age 25+** (TikTok skews young, and licensed agents are adults), language (French for the Québec ad group), then targeting (§5). Leave "Targeting expansion" on only for broad tests.
6. **Budget and schedule:** start/end dates; dayparting rarely matters here.
7. **Bidding:** Maximum delivery to start; Cost cap once you know your CPA. Expect a learning phase of ~50 conversions.

**Ad**
8. **Identity:** the SocialSpark TikTok account, or **Spark Ads** (authorise an existing organic post by code: from the post, Ad settings → Generate code). Spark Ads from a real agent customer (with their written agreement and a paid-partnership disclosure) usually beat brand-account ads.
9. **Creative:** upload 9:16 video; add **ad text** (≤ 100 characters; keep emojis out, since some placements reject them) and a CTA.
10. **AI disclosure toggle:** turn on if the video contains realistic AI-generated people, voices or scenes (TikTok's rule is the broadest of the four platforms).
11. **Music:** only sounds from the **Commercial Music Library** or licensed audio. Trending personal sounds aren't cleared for ads and cause rejections or muting.
12. **Destination URL** with UTMs (TikTok macros: `utm_campaign=__CAMPAIGN_NAME__&utm_content=__CID_NAME__`).
13. **Submit.** Review is usually within 24 hours; the ad's language must match the targeted location's language (French ads to Québec ad groups).

## 5. Targeting

TikTok has no job-title targeting, so the hook does the targeting.

- **Broad + strong hook (default):** Canada/provinces, 25–54, no interests; the first 2 seconds must say "this is for listing agents" ("Realtors: stop making listing posts in Canva").
- **Interests & behaviours** as a second test: interests around *Real estate*, *Business services*, *Marketing*; behaviours: video interactions with real estate or small-business creators; hashtags such as #realtor, #realestateagent, #realtorlife, #courtierimmobilier. Expect a mix of agents and home-buyers. Buyers are wasted spend, so judge by sign-up quality (first post generated), not CTR.
- **Custom audiences:** video viewers (6 s / 15 s / 100%), profile engagers, website visitors (pixel + consent), customer file (consent).
- **Lookalikes** from paying customers once ≥ 1,000 matched users.

## 6. Creative: the part that decides everything

| Spec | Value |
|---|---|
| Ratio / resolution | 9:16, 1080×1920 (minimum 540×960) |
| Length | 5–60 s allowed in-feed; 20–35 s is the sweet spot for a demo |
| Safe zone | Keep text and faces out of the right ~140 px (buttons), bottom ~400 px (caption/CTA) and top ~130 px |
| Sound | On by default on TikTok; voice-over or talking head beats music-only for B2B |
| Captions | Burned-in or auto-captions; many still watch muted |

Patterns to test (hypotheses):
- **"POV: it's 10 p.m. and you still haven't posted the new listing"** → screen recording → finished carousel in seconds.
- **Talking head (real agent or founder)**: "I paste the listing link and this is what I get." Then show it.
- **Before/after of the *workflow*** (Canva timeline vs one link). Don't show before/after "results" (followers, sales); that's an unsubstantiated performance claim.
- **Québec:** fully French VO and on-screen text, not subtitles over English.

Make 3–5 distinct concepts per ad group and refresh every 1–3 weeks. TikTok creative fatigues faster than Meta's. Production specs and VO are in `socialspark-ad-video`.

## 7. Reading results

- Leading signals: 2-s and 6-s view rates (hook strength), average watch time, CTR, CPM.
- Deciding metric: cost per sign-up and the sign-up → first-post rate. TikTok can bring cheap sign-ups that never activate; compare activation by source before scaling.
- Don't edit an ad group in learning; duplicate it to change targeting.
- Kill an ad with a weak 2-s view rate after ~1,000–2,000 impressions; keep testing hooks on the same body.
