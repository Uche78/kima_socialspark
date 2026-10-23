# Placements, specs and compliance

Platform specs change. When a number matters and you have web access, confirm it against the platform's current help pages.

## Deliverables

| Placement | Ratio | Size | Length | Notes |
|---|---|---|---|---|
| Instagram/Facebook Reels, Stories | 9:16 | 1080×1920 | 15–45 s (Stories: segments of ≤ 60 s each) | **The master.** Safe zones below. |
| Facebook/Instagram feed | 4:5 | 1080×1350 | 15–45 s | Re-render graphics at size; recordings via `phone`/`blur` fit |
| Square (feed, Marketplace, some partner placements) | 1:1 | 1080×1080 | 15–30 s | Optional |
| YouTube in-stream / LinkedIn / site | 16:9 | 1920×1080 | 15–60 s | Use desktop recordings. YouTube skippable: brand + value in the first 5 s. |
| YouTube Shorts / TikTok | 9:16 | 1080×1920 | 15–45 s | Same as the Reels master; check overlays against each app's UI |

File: H.264 High, yuv420p, 30 fps, AAC 48 kHz stereo 192 kbps, MP4 with faststart, < 4 GB. `assemble.py` and `qc.py` produce and check this.

## Safe zones (9:16)

Keep text and key UI out of:
- **top 14%** (~270 px): profile name, "Sponsored", close button
- **bottom 20%** (~380 px): caption, CTA button, the like/comment rail (right ~12% in Reels)
- **sides 6%**

`templates/brand.css` defines `--safe-top`, `--safe-bottom` and `--safe-side`. Captions sit just above the bottom zone, and supers centre in the middle band. For `fit: "phone"`, keep the screen within ~80% of frame height (`"phone": {"height": 0.80, "y": 0.47}`) so captions can overlap the lower part of the phone without hitting the CTA.

For 4:5 and 1:1 the zones are smaller. Keep ~6% margins all round, and keep text off the bottom 10% on Instagram.

## Text and captions

- Burn captions into every version (most feed video plays muted). Also give the platform an SRT if the person wants native captions. `captions.json` has everything needed to write one.
- Captions ≥ 52 px on 1080-wide (template default), supers 80–100 px, nothing under 36 px.
- Contrast: white on navy plate, navy on cream. Never text straight on busy photos.

## Compliance

- **Meta Special Ad Category: Housing.** Ads showing homes for sale, prices or mortgage payments can be treated as housing ads, which restricts targeting (no age/gender/postal-code targeting, wider radius). Frame the spot clearly as software for agents and brokers. Note in the delivery that the advertiser may need to declare the category, and that the targeting plan must allow for it.
- **Competition Act (Canada):** claims true and not misleading in their general impression, *including what the editing implies*. Time compression must not suggest a speed the product doesn't deliver. Free offers state their material conditions on screen ("3 free posts · No credit card"). Prices in CAD, "plus tax" where a price appears.
- **Québec (Charter of the French Language):** advertising aimed at Québec is in French. Make native French versions (VO, supers, captions, end card), not English with French subtitles.
- **Mortgage content:** never imply SocialSpark sets, suggests or guarantees rates or approvals. Payment figures on screen come from the app's calculations, with the sheet's "rates as of" date and disclaimer visible. Don't speak rates in the VO.
- **People and listings:** written permission for any real person, voice, listing, brokerage name or logo. REALTOR® and MLS® are CREA trademarks. Use "realtors"/"agents" generically in lower case, and don't imply CREA endorsement.
- **Platform UI:** don't imitate Instagram/Facebook interface elements (fake like buttons, notifications) in graphics. Showing the app's own preview of a post is fine.
- **Music, voices, photos:** licensed for advertising, with the licence or source logged in `brief.md`. Edge/`say` voices never ship.
