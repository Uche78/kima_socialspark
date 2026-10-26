# Build sheet: Meta wave 1 (sign-ups by persona)

**Prepared:** 2026-10-24 · **Rules verified:** 2026-10-24 (socialspark-ad-placement rule book)
**Ad account:** 10156068794910068 (Kima Technologies Inc., CAD) · **Dataset:** SocialSpark Website 452270515951631
**Goal:** free sign-up · **Deciding metric:** cost per CompleteRegistration, per persona (cross-check Supabase `signup_attribution.utm_content`, then first post generated)
**Budget:** CAD 50/day total (40 realtors + 10 brokers), 4 weeks, account limit CA$1,600

## Compliance decisions

| Item | Decision | Reason |
|---|---|---|
| Special Ad Category | None (both campaigns) | Software sold to licensed professionals, not housing or credit offered to the viewer. Brokers run as their own campaign so a Financial Products flag can't affect the realtor ads. |
| Housing look | Demo listings only in creative (made-up address and price, or your own listing with the address blurred) | Real addresses and prices can trigger Meta's Housing classifier; showing another brokerage's listing needs their consent |
| Mortgage ads (P17) | No rate, payment amount or approval language anywhere, including the image | Keeps it a software ad, not a financial-product ad |
| Québec | French ads only in the Outaouais; English ad sets exclude Québec | Charter of the French language |
| "Under a minute" | Timed by Kima (confirmed 2026-10-24) | Competition Act: performance claims tested first |
| "$400 for around 40 posts" | Keep the source (one Canadian brokerage's content plan) on file with a date; always "one brokerage", never "a content package" in general | Comparative price claim must be substantiated |
| Creative enhancements | Text improvements and generated text/backgrounds OFF | Meta-rewritten copy could add unapproved claims or mix languages |

## Campaign 1: `SS_META_LEADS_SIGNUP_REALTORS_2026-11`

Objective **Leads** · Special Ad Categories: none · Advantage campaign budget **CAD 40/day** · Highest volume

| Setting (every ad set) | Value |
|---|---|
| Conversion location | Website |
| Performance goal / event | Maximise conversions · SocialSpark Website · CompleteRegistration |
| Attribution | 7-day click |
| Schedule | Start on launch day; end after 4 weeks |
| Audience | Advantage+ audience, minimum age 25, suggestions: real estate agent / real estate broker interests |
| Placements | Advantage+ placements |

### Ad set `EN_CA-exQC_National`
Location: Canada, **exclude Québec**. Language: blank.

| Ad name | Page | Text options (from your copy, with fixes) | Headline | Description | Creative |
|---|---|---|---|---|---|
| `p3-A` | /for/social-media-for-top-producing-realtors | A short · medium · long | Every listing posted the day it lists | 3 free posts. No credit card. | Demo listing link → finished carousel |
| `p3-B` | same | B short · medium · long (fix: free condition) | Your assistant: paste, check, schedule | 3 free posts. No credit card. | Screen recording: paste → post → scheduled |
| `p5-A` | /for/listing-posts-for-real-estate-marketing-coordinators | A short · medium · long | Clear the listing post backlog this week | 3 free posts. No credit card. | Dark, link → Open House post (`p5-A_meta-*.jpg`) |
| `p5-B` | same | B short · medium · long (fix: "one brokerage") | 50 listing posts a month for $49.99 | Plus tax. Try 3 posts free. | Finished post, "50 posts a month · $49.99" |
| `p13-A` | /for/real-estate-social-media-manager-alternative | A short · medium · long | 50 listing posts for $49.99 a month | Plus tax. Try 3 posts free. | Finished post, "$49.99 / month · 50 posts" |
| `p13-B` | same | B short · medium · long (fix: free condition) | No waiting on anyone's turnaround | 3 free posts. No credit card. | Phone clock 4:00 → 4:01 p.m. |
| `p10-A` | /for/social-media-posts-for-condo-realtors | A short · medium · long | Five condos? Five posts before lunch. | 3 free posts. No credit card. | Link → Harbour St condo post (`p10-A_meta-*.jpg`) |
| `p10-C` | same | C short · medium (fix: free condition) · long (fixes: free condition, "written to describe the unit") | Five units, one building, five posts | 3 free posts. No credit card. | Two posts of one condo, labelled by lead feature (`p10-C_meta-*.jpg`) |

### Ad set `EN_Ottawa-Moncton`
Location: Ottawa (+25 km) and Moncton (+25 km), **exclude Québec** (the Ottawa radius reaches Gatineau). Ad set **minimum spend CAD 6/day**.

| Ad name | Page | Text options | Headline | Description | Creative |
|---|---|---|---|---|---|
| `p7-en-A` | /for/bilingual-real-estate-social-media-posts | A short · medium · long | English, French or both, from one link | 3 free posts. No credit card. | Demo listing as one bilingual post |
| `p7-en-B` | same | B short · medium (fixes) · long (fixes) | Québec French, not a translation | 3 free posts. No credit card. | Real French caption, readable at feed size |

### Ad set `FR_Outaouais`
Location: Gatineau (+40 km), **exclude Ontario** (the radius reaches Ottawa). Language: **French (all)**. Ad set **minimum spend CAD 6/day**.

| Ad name | Page | Text options | Headline | Description | Creative |
|---|---|---|---|---|---|
| `p7-fr-A` | /for/publications-immobilieres-bilingues | A court · moyen · long | Un lien. Français, anglais ou les deux. | 3 publications gratuites | Inscription de démonstration, publication bilingue |
| `p7-fr-B` | same | B court · moyen (corrections) · long (corrections) | Du français d'ici, pas de la traduction | 3 publications gratuites | Vrai texte en français, lisible |

CTA button for every ad: **Get offer** (chosen 2026-10-24; "Try for free" isn't offered by Meta). Meta shows its French label to people using Facebook in French. Test against Sign up later, on the winning angle only.

## Campaign 2: `SS_META_LEADS_SIGNUP_BROKERS_2026-11`

Same settings as Campaign 1, budget **CAD 10/day**.

### Ad set `EN_CA-exQC_Brokers`
Location: Canada, exclude Québec (no French broker copy yet). Audience suggestions: mortgage broker / mortgage agent interests.

| Ad name | Page | Text options | Headline | Description | Creative |
|---|---|---|---|---|---|
| `p17-A` | /mortgage-brokers | A short · medium · long | A sheet for every partner listing | Building sheets is free. | Demo feature sheet beside its listing link; no rate legible at feed size |
| `p17-B` | same | B short · medium · long | Sheets co-branded with your realtors | Building sheets is free. | Co-branded sheet + printed PDF stack |

Creative files for every ad: `ad-creatives/2026-10-24-wave1/out/<ad>_meta-4x5.jpg` (feeds) and `<ad>_meta-9x16.jpg` (Stories/Reels).

## URL parameters (every ad)

`utm_source={{site_source_name}}&utm_medium=paid_social&utm_campaign=<p3|p5|p13|p7-en|p7-fr|p17>&utm_content={{ad.name}}`

## Held for wave 2 (challengers)

- All **C** angles: p3-C, p5-C, p7-C (the plan maths: better for retargeting), p13-C, p17-C (needs more realtors using "Send to my mortgage broker").
- **P10-B (Price Reduced)**: its lead is a GTHA-only Urbanation figure (Q1 2026). Hold for a Toronto-targeted test, after checking for newer figures. P10-A and P10-C run in wave 1 (condo page fixed 2026-10-24).

## Launch checklist

- [ ] Fixes below applied to the copy
- [ ] Demo listing creative made in 4:5 and 9:16 for every ad
- [ ] Live site shows the cookie banner; Events Manager shows PageView and CompleteRegistration (Browser + Server)
- [ ] `META_TEST_EVENT_CODE` is NOT set on Netlify
- [ ] Privacy policy at usekima.com/privacy mentions the Meta Pixel, Conversions API and withdrawing consent
- [ ] Text improvements / generated text OFF on every ad
- [ ] End dates set; each ad's preview checked in every placement

## Test plan

- **Control:** none yet. Wave 1 finds the first winner per persona.
- **Read:** day 3 (delivery and rejections only, no edits), day 7, day 14.
- **Call it:** ≥ 30 sign-ups per ad, or 3× target cost per sign-up spent, or 2 weeks. Ads Meta barely spends on (< 10% of the ad set) are inconclusive, not losers.
- **Kill:** an ad at 2–3× target cost per sign-up with no sign-ups. **Scale:** steady cost per sign-up for 7 days → +20% budget every 2–3 days.
- The two geo ad sets and the broker campaign are too small to exit Meta's learning phase at this spend. Judge them on cost per sign-up over the full 4 weeks.
