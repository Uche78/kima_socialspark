# Capturing the SocialSpark app

Everything on screen is the real app. This file covers how to run it, what to record, and ready shot lists. **Selectors drift:** before recording, check the labels against the components named below (grep for the button text) and run a quick `--draft` take.

## Setup

1. **Run the app locally:** `npm run dev` in the repo root. Note the port it prints. Other projects on this machine may hold 3000, and the recorder refuses any page that isn't SocialSpark. Set `"baseUrl"` in each shots file.
2. **Session:**
   - **Guest** (no `storageState`): the import form signs in anonymously. That's enough for the realtor demo (guests get the free allowance in `src/lib/plans.ts`), and it's the honest "try it free" experience.
   - **Signed in:** `node record_app.mjs --login --base http://localhost:<port>` opens a window. The person signs in with their email code, and the session is saved to `scripts/.auth/state.json` (git-ignored). Use this for branding, voice samples, broker sheets, partners and Settings. Use a **demo account**, never a customer's.
3. **Demo profile:** fill Brand & voice with a **fictional** agent (name, brokerage, headshot, colours, 2–3 past posts for voice), or a real one who has given written permission. A real agent's name, face or listing in an ad needs their consent, and their brokerage's.
4. **Demo listing:** the link you paste on camera must be the link that really imports. Options, best first:
   - a public listing whose agent/brokerage has agreed to appear in the ad
   - a demo listing page on a domain the person controls (realistic markup with CC0 photos), so the real import runs on a real URL

   REALTOR.ca blocks automated import (`isRealtorCa` in `src/components/ImportForm.tsx`), so don't use it on camera. Never paste one link and import another off-camera.
5. **Generations cost real allowance and API calls.** Generate once per take you need, then reuse the result: record the editor and export shots from the saved post at `/posts/<id>`.

## Safety built into the recorder

Blocked during recording: `/api/posts/*/publish|schedule|unpublish`, `/api/listings/*/share` (sends email), `/api/billing/*`, `/api/connect/*`, `/api/cron/*`, Stripe checkout. To show publishing, record up to the Publish button or dialog and cut. Never fake a "Published" state. The Next.js dev badge is hidden automatically.

## What's in the app (sources to check labels)

| Screen | Route | Component | On-camera moments |
|---|---|---|---|
| Home / import | `/` | `src/components/ImportForm.tsx` | URL field (`input[type=url]`), "Get listing →", realtor/broker toggle, example posts in the hero |
| Broker landing | `/mortgage-brokers` | `src/app/mortgage-brokers/page.tsx` | broker import → straight into a new sheet |
| Listing workspace | `/listings/<id>` | `src/app/listings/[id]/CreatePostCard.tsx`, `ListingEditor.tsx`, `LatestResult.tsx` | photos pulled from the listing; chips: Platform, Format (Single image / Carousel), Size, Design (Classic / Modern / Minimal), Language (English / Français (QC) / bilingual), Post type; "Generate post"; "Writing your … post…" skeleton; "Your new post" |
| Post editor | `/posts/<id>` | `src/app/posts/[id]/PostEditor.tsx` | slides, Template chips, edit headline/text/photos/colours, branding toggles, Caption, "Copy caption", "Download", and for sheets "Download PDF" / "Story (9:16)"; Publish/Schedule (blocked) |
| Sheet Builder (brokers) | `/sheets/<id>` | `src/app/sheets/[id]/SheetBuilder.tsx`, `src/components/FeatureSheet.tsx` | price, down-payment scenarios, "Rates as of", amortization, co-branded realtor, PDF, create post from sheet |
| Posts list | `/posts` | `src/app/posts/page.tsx` | a full grid of finished posts (good for the "every listing" beat) |
| Brand & voice | `/settings` | `src/app/settings/page.tsx` | headshot, colours, writing samples (the "sounds like you" proof) |
| Partners | `/partners` | `src/app/partners/page.tsx` | broker ↔ realtor co-branding |

## Viewports

- **9:16 masters:** phone, `{"width": 390, "height": 844}`, `deviceScaleFactor` 3 (1170 px wide), `cursor: "touch"`. Place it with `fit: "phone"` (screen ~80% of frame height) or `blur`/`cover` for full-bleed moments.
- **16:9 and desktop proof:** `{"width": 1440, "height": 900}`, `deviceScaleFactor` 2, `cursor: "pointer"`.
- Recording runs in slow motion (`slowmo` 4 at 3×, 2 at 2×) so that full-resolution frames stay smooth. A take lasts several times longer than the footage. Typing and scrolls come out at the speeds you set. App timers and network waits play back faster, which is fine since you cut them anyway.

## Shot list: realtor demonstration (structure A)

Record as separate takes, so each can be re-shot alone.

**Take 1: link → listing** (`templates/shots_realtor_demo.json` is a starting file)
```json
{ "baseUrl": "http://localhost:3001", "viewport": {"width": 390, "height": 844}, "deviceScaleFactor": 3, "cursor": "touch",
  "steps": [
    {"goto": "/"}, {"wait": 700}, {"mark": "home"},
    {"type": {"selector": "input[type=url]", "text": "https://<demo-listing-url>", "delay": 35}},
    {"wait": 300}, {"mark": "pasted"},
    {"click": "role=button[name=/Get listing/]"},
    {"waitFor": "text=Generate post", "timeout": 120000}, {"mark": "listing-ready"},
    {"wait": 900},
    {"scroll": {"y": 500, "duration": 1400}}, {"wait": 800}
  ] }
```
For a speed claim, type rather than paste (a paste is an instant jump; trim it in the edit).

**Take 2: choose and generate** (signed in or guest, from `/listings/<id>`)
Tap `Carousel`, `Just Listed` and `Modern` (chips), then `Generate post`. Wait for `text=Your new post`, mark `post-ready`, pause 1.5 s, swipe or scroll the slides. `realMarks["post-ready"] − realMarks["generate"]` is the honest generation time.

**Take 3: the editor** (from `/posts/<id>`)
Switch templates Classic → Modern → Minimal (pause 1.2 s on each), scroll to Caption, hover on the voice-matched lines, then `download` the post into `stills/`.

**Take 4: pains-taken close-ups**
`/settings` (headshot, colours, writing samples). On the listing, set Language to Français (QC) and generate a French version, so the bilingual beat shows real output. Then the posts grid `/posts`.

## Shot list: mortgage broker (structure D)

Signed-in broker account (role mortgage_broker; check the welcome step). Steps: `/mortgage-brokers` → paste link → the Sheet Builder opens → scroll the down-payment scenarios → close-ups on the licence line, "Rates as of" date and disclaimer → co-branded realtor → `Download PDF` and `Story (9:16)` via `download` steps into `stills/`. Rates on screen are whatever the demo account entered. Super and VO never present them as an offer.

## Stills and exports

- `download` the post's JPEG/ZIP (unzip into `stills/post/`) and the sheet PDF/story. These are pixel-perfect finished work for `showcase.html`, punch-ins and the end-card preview.
- `screenshot` steps (with a `selector`) grab a specific element at device resolution.
- PDF → image: `pdftoppm -png -r 200 sheet.pdf stills/sheet` if poppler is installed; otherwise screenshot the sheet preview.

## Common problems

| Symptom | Fix |
|---|---|
| "is not SocialSpark" | Wrong port. Check `npm run dev` output. |
| Step times out | Label changed. Grep the component, update the selector; the failed frame is saved as `<out>.error.png`. |
| Import fails on the link | The site blocks bots. Use another permitted listing; don't swap links off-camera. |
| Paywall dialog appears | The guest or free allowance is used up. Use the demo account or reset the demo data. |
| Text looks soft in the cut | Check `deviceScaleFactor` (3 on phone) and avoid zooming > 1.3× on UI. |
