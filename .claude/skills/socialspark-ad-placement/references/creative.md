# Ad creatives: images, carousels, end cards

**Last verified: 2026-10-24.** Placement sizes and safe zones change; when a number matters, confirm it on the platform's help pages and update the `FORMATS` table in `scripts/render_creatives.mjs` and this file together.

This skill makes the **static** creative: single images, carousel cards and end cards for Meta, LinkedIn and TikTok. **Video** is `socialspark-ad-video` (it records the real app, writes VO and cuts every ratio); hand it the placements and safe zones from §3. **Words** come from `socialspark-ad-copy`; on-image text is a shortened form of the ad's own copy, never new claims.

## Contents
1. The two rules
2. Source material: the demo kit
3. Placements, sizes and safe zones
4. What the image may and may not show
5. Concepts → templates
6. Workflow and commands
7. Uploading per platform

---

## 1. The two rules

1. **The product in the picture is real.** Every post or sheet in a creative is a capture of the app's own renderer (`capture_demo_posts.mjs`) or a real export/recording. Never draw a fake post, a fake app screen or an invented feature.
2. **No real listing, person or brokerage without written permission.** Use the demo kit. Its agent, brokerage, broker and listings are made up and its photos are CC0, so there's nothing to clear.

## 2. Source material: the demo kit

`src/components/hero/demo-posts.ts`: agent **Jordan Lee, Northline Realty** (phone 416-555-…), broker **Priya Shah, Northline Mortgages**, realtor partner **Alex Morgan, Lakeview Realty**; listings at 48 Oakridge Dr (Oakville), 1205–88 Harbour St (Toronto), 17 Maple Lane (Stouffville), 302 Laurier Ave (Ottawa). Photos: `public/hero/CREDITS.md` (CC0). A search on 2026-10-24 found no real Canadian brokerage called Northline Realty; re-check before a big campaign.

Capture them from the running app (no sign-in, no posts used):

```
node .claude/skills/socialspark-ad-placement/scripts/capture_demo_posts.mjs --list --path /for/<slug>      # what's there
node .claude/skills/socialspark-ad-placement/scripts/capture_demo_posts.mjs ad-creatives/<date>-<slug>/stills \
     --path /for/social-media-for-top-producing-realtors --path /mortgage-brokers --path /for/publications-immobilieres-bilingues
```

| Page | Gives you |
|---|---|
| `/for/<english persona slug>` | HD covers of every post type: Just Listed, Open House, Price Reduced, Coming Soon, Sold, Featured, in 4:5, 1:1 and LinkedIn 1200² |
| `/for/publications-immobilieres-bilingues` | The same in Québec French, plus bilingual ("JUST LISTED \| NOUVELLE INSCRIPTION") |
| `/mortgage-brokers` | Feature sheet (`-0`) and payment scenarios (`-1`) |
| `/` | SD versions (sharp enough for 1080 wide) |

Captures are covers (slide 1). For a carousel of inner slides, record or export from the app (`socialspark-ad-video/references/app-capture.md`).

Known soft spot: the demo agent's title reads "REALTOR®", a CREA mark, on a made-up person. Low risk in a product demo, but don't make it the focus of a creative, and don't crop in on it.

## 3. Placements, sizes and safe zones

The `format` keys are what `render_creatives.mjs` takes. Safe zone = where **words and logos** may sit; pictures may run outside it (on 9:16, images go down to the 20% line, behind the caption area).

| Format key | Size | Where it runs | Text-safe zone |
|---|---|---|---|
| `meta-4x5` | 1080×1350 | Facebook/Instagram feeds (the default image) | 6% all round |
| `meta-1x1` | 1080×1080 | Feeds, right column, Marketplace, search | 6% |
| `meta-1.91x1` | 1200×628 | Meta's "Horizontal" crop: right column, search results | 8% top/bottom, 5% sides |
| `meta-9x16` | 1080×1920 | Stories and Reels (shared asset) | top 14%, **bottom 35%** (Reels UI), sides 6% |
| `carousel-1x1` | 1080×1080 | Meta carousel cards (2–10; 4:5 also allowed) | 6% |
| `li-1x1` | 1200×1200 | LinkedIn single image: best on mobile | 6% |
| `li-1.91x1` | 1200×627 | LinkedIn single image: desktop-first | 8% top/bottom, 5% sides |
| `li-4x5` | 1080×1350 | LinkedIn vertical image, mobile only [check accepted size: LinkedIn documents 720×900] | 6% |
| `tiktok-9x16` | 1080×1920 | TikTok image/carousel ads where offered (main feed is video-first) [check availability in Canada] | top 8%, bottom 25%, right 13% (buttons), left 6% |

File limits: Meta images JPG/PNG up to 30 MB; LinkedIn single image 5 MB, carousel cards 10 MB; the renderer writes JPEG q92 (about 0.3–1 MB).

## 4. What the image may and may not show

| Rule | Why |
|---|---|
| Frame every listing as **the product's output**: the link → post arrow, a fan of posts, the SocialSpark wordmark. Never a bare full-bleed house photo with a price. | A home + price + address on its own reads as a housing ad to Meta's classifier (Special Ad Category, targeting restrictions). |
| **Broker creatives: blur every rate, payment and dollar figure in a sheet's table, and the MLS® number** (`blur` boxes in the spec; `p17-A` in the example spec has working coordinates for `mortgage-brokers-1`). | Keeps it a software ad, not a financial-product offer; MLS® is a CREA mark. |
| "Free" on the image carries its condition ("3 free posts · No credit card"; "Building sheets is free"). A price carries "plus tax". | Competition Act: general impression, no drip pricing. |
| The chip states a **fact**, never an instruction: no "Sign up", "Click here", "Try now" in a button shape, and no fake play buttons. | Meta and LinkedIn reject non-working buttons; the platform's CTA button does that job. |
| No Facebook, Instagram, LinkedIn or TikTok logos, and no mock-ups of their feeds or apps. Naming the platforms in body copy is fine; in LinkedIn ads, don't name LinkedIn at all. | Platform brand policies (implied endorsement). |
| On-image words: **≤ 16 on 9:16, ≤ 28 elsewhere**, no ALL CAPS sentences, ≤ 1 emoji (none on LinkedIn). | Heavy text delivers worse and draws LinkedIn rejections; the renderer warns. |
| **Québec ads: French image text and French posts** (from the French page). An English post may appear only as the "EN" half of a bilingual demonstration. | Charter of the French language. |
| No AI-generated people, homes or voices in static creatives. If one is ever used, switch on the platform's AI disclosure (mandatory on TikTok for realistic AIGC). | Platform AI-label rules; Competition Act (fake customers). |
| Before/after shows the **workflow** (Canva timeline vs one link), never results (followers, sales, days on market). | Unsubstantiated performance claims. |
| Speed shown in a creative ("4:00 → 4:01 p.m.") matches the measured time. | Competition Act: the claim must be tested (done 2026-10-24: under a minute). |

## 5. Concepts → templates

Templates live in `templates/` (brand tokens from the video skill's `brand.css`). Each adapts to 9:16, 4:5, 1:1 and 1.91:1.

| Template | Use it for | Data |
|---|---|---|
| `demo` | The demonstration: listing link → finished post. Default first concept for every realtor and broker persona. | `eyebrow?`, `headline`, `sub?`, `link` (generic, e.g. `yourbrokerage.ca/listings/…`), `images` (1–2), `chip` |
| `statement` | One line + optional price: cost comparison (P5-B, P13-A), candour (P13-C), the honest count (P7-C) | `headline`, `price: {amount, note}` (note includes "plus tax"), `images` (0–3, fanned), `chip` |
| `split` | Two things compared: FR \| EN (P7), two units in one building (P10-C), post beside the coordinator's own work (P5-C) | `headline`, `images: [{src,label},{src,label}]`, `chip` |
| `stack` | Several posts fanned: one brand across listings (P3-C), six post types, volume (P10-A) | `headline`, `images` (3–5 different posts), `chip` |
| `cta` | Last card of a carousel, or a plain brand card | `headline` (offer), `sub` (risk reversal), `url` |

Always set `link` to a **generic** address (`yourbrokerage.ca/…`, `partnerbrokerage.ca/…`), never a real brokerage's domain. Keep it under ~40 characters; the 1.91:1 layout truncates longer ones.

**Carousel recipe (Meta, LinkedIn):** cards 1–5 = different demo post covers (`carousel-1x1`, each just the capture, or `demo` with a short headline per card), last card = `cta`. Card 1 must work alone: it's the only one many people see.

## 6. Workflow and commands

1. **Brief per ad**: persona, angle, platform(s), language. The build sheet's ad rows are the list.
2. **Pick the concept** (§5) that shows the angle's promise. One concept per ad; a different appeal is a different ad, not a variant.
3. **Capture stills** (§2) into `ad-creatives/<yyyy-mm-dd>-<slug>/stills/` (git-ignored).
4. **Write `spec.json`** in that folder: one entry per ad, every format its placements need (Meta: `meta-4x5` + `meta-9x16`; LinkedIn: `li-1x1` + `li-1.91x1`; carousels: `carousel-1x1`). On-image text is the ad's headline or a shortened line of its approved copy, plus the offer chip. `assets/example-spec.json` is a working example covering every template.
5. **Render and check:**
   ```
   node .claude/skills/socialspark-ad-placement/scripts/render_creatives.mjs ad-creatives/<folder>/spec.json [--guides]
   ```
   It writes `out/<ad>_<format>.jpg`, fails on text outside the safe zone or clipped text, warns on small type and heavy text, then runs every creative's on-image words through `preflight.py` for its platform. `--guides` adds `_guides.png` files with the unsafe bands shaded.
6. **Look at every image yourself** (open each JPEG). The checks can't see a blur box that misses a number, a badge covered by a label, a headline that's technically inside the zone but cramped, or a French post in an English ad. Fix the spec and re-render until each one is right.
7. **Deliver**: a table mapping every file to its ad name and placement (from the build sheet), the on-image text, and anything the person must still check.

Needs the app running locally (`npm run dev`, default `http://localhost:3000`) for captures, and the video skill's Playwright install (`cd .claude/skills/socialspark-ad-video/scripts && npm install`, once).

## 7. Uploading per platform

- **Meta**: upload the 4:5, 9:16, 1:1 and 1.91:1 files, select the 4:5 one, and on the **Crop** step **Replace** each placement's crop (Square, Vertical, Horizontal) with its matching file. Never accept Meta's own crop or "Crop and expand": it pushes text into the Reels band. Under Advantage+ creative, leave "visual touch-ups" on if you like, but turn off text overlays, generated backgrounds and image expansion: they redraw your safe-zone layout. Carousels: upload each card in order, with the `cta` card last.
- **LinkedIn**: one image per single-image ad. Use `li-1x1` (mobile-heavy audiences) or `li-1.91x1`; make two ads to test them. Carousel ads: 2–10 cards at 1080×1080.
- **TikTok**: main-feed ads are video (`socialspark-ad-video`, 9:16, the TikTok safe zone above). Use `tiktok-9x16` stills only for image/carousel formats your account offers, and keep the right-side button rail clear.
