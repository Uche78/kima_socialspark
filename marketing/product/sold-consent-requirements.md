# Requirements: written consent for Sold posts

For: the agent implementing this in the SocialSpark repo. Read `AGENTS.md` first: this Next.js version differs from what you know, so check `node_modules/next/dist/docs/` before writing route or page code.

## Why

SocialSpark makes **Sold** posts (`post_type: "sold"`). Advertising a property as sold needs the parties' written consent, and the app never asks for it. It also puts the listing's asking price on Sold designs by default, which readers will take as the sale price.

The rule, verified against [RECO Bulletin 5.4: Advertising sold properties](https://www.reco.on.ca/agents-and-brokerages/reco-bulletins/reco-bulletin-5-4-advertising-sold-property) (Ontario):

- An ad can't identify the property, the parties or the agreement's contents without written consent, and that consent must state the date it takes effect and the date it expires.
- Saying a property is sold needs the **seller's** consent before closing and the **buyer's** consent after closing.
- Showing the **price or other terms** needs **both** the seller's and the buyer's consent, before or after closing.
- It applies to the buyer's brokerage as well as the seller's, so a Sold post about someone else's listing (the "local market update" framing in `src/lib/generate.ts`) still needs consent: the photos and address identify the property.

Other provinces have their own rules. The app must not claim to know them, and must not claim that a post is compliant.

## How it works today

| What | Where |
|---|---|
| Post type chips, including Sold | `src/app/listings/[id]/CreatePostCard.tsx` (`LISTING_POST_TYPES`, `submit()` → `onGenerate`) |
| Request validation, job creation | `src/app/api/posts/generate/route.ts` |
| Post insert and design defaults: `show_price: listing.price != null` for every post type | `src/lib/generation-job.ts` (around line 158) |
| Caption rules for Sold | `src/lib/generate.ts`, "Post type: the goal of each post", **Sold** bullet |
| Price toggle and the existing brokerage-name warning (the pattern to copy) | `src/app/posts/[id]/PostEditor.tsx` (design toggles around line 556, amber notice below them) |
| Publish now | `src/app/api/posts/[id]/publish/route.ts` |
| Schedule | `src/app/api/posts/[id]/schedule/route.ts` |
| Scheduled publishing | `src/lib/publish/run.ts` (`publishPostById`), called from `src/app/api/cron/publish-due/route.ts` and `netlify/functions/publish-scheduled.mts` |
| Posts table | `supabase/migrations/20260930120000_init.sql` (`public.posts`) |

## Requirements

### R1. Record consent on the post

Add a nullable `sale_consent jsonb` column to `public.posts` in a new migration (`supabase/migrations/20261027120000_sale_consent.sql`, following the existing naming), shaped:

```json
{ "confirmed_at": "2026-10-27T14:02:11Z", "covers_price": false }
```

- `confirmed_at`: when the user confirmed they have written consent to advertise the sale.
- `covers_price`: whether that consent also covers showing the price (both parties).
- `null` means not confirmed. Don't backfill existing rows.
- Add the field to the `Post` type in `src/lib/types.ts`.
- Existing RLS policies on `posts` must still let users update their own rows' `sale_consent` and no one else's. Check the policies; don't loosen them.
- Write the migration file only. Don't apply it to the production Supabase project; the user will.

### R2. Ask when creating a Sold post

In `CreatePostCard.tsx`, when the selected post type is **Sold**, show this block under the options and require the first checkbox before **Create** works:

> ☐ **I have written consent to advertise this sale.** In Ontario, RECO requires the seller's consent before closing and the buyer's after, with the dates it's valid. Other provinces have their own rules; check your regulator's.
>
> ☐ My consent also covers showing the price (both the seller and the buyer agreed).

- The second checkbox is unticked by default and only enabled once the first is ticked.
- With the first unticked, the Create button is disabled, with the reason shown next to it: "Confirm consent to create a Sold post."
- Switching to another post type hides the block and doesn't send consent.
- Send `sale_consent: { covers_price }` with the request only for Sold. The server sets `confirmed_at`, not the client.
- Use the app's existing form styles (the checkbox rows in the same component).

### R3. Enforce it on the server

In `src/app/api/posts/generate/route.ts`:

- For `post_type: "sold"`, a new post without `sale_consent` gets `400` with `{ "error": "Confirm you have written consent to advertise this sale.", "code": "sale_consent_required" }`. Check this before the paywall check, so no allowance is used.
- Store `sale_consent` with `confirmed_at` set to the server's current time on the new post (pass it through `JobParams` to the insert in `generation-job.ts`).
- Regenerating an existing Sold post keeps its stored `sale_consent`; it doesn't ask again.

### R4. No price on Sold posts without price consent

- `generation-job.ts`: for Sold, `show_price` is `true` only when `sale_consent.covers_price` is true; otherwise `false`. Other post types are unchanged.
- `generate.ts`, Sold bullet: replace "Don't state a sale price, terms, days on market or "over asking" unless they're in the data" with a rule that the caption never states any price (asking or sale), terms, days on market or "over asking" unless the request says price consent was given. Add that flag to the prompt the same way other request facts are passed (look at how `include_tour` or the mortgage estimate reach the prompt). Keep the rest of the bullet, including the other-brokerage market-update rule.
- `PostEditor.tsx`: on a Sold post whose consent doesn't cover price, the **Price** toggle is disabled with the hint "Needs both parties' consent". If `sale_consent` is null, see R5.

### R5. Block publishing and scheduling until confirmed

Sold posts created before this change have no `sale_consent`.

- `publish/route.ts` and `schedule/route.ts`: for a Sold post with `sale_consent` null, return `409` with `{ "error": "Confirm you have written consent to advertise this sale, then publish again.", "code": "sale_consent_required" }`, before claiming or changing the post.
- `publishPostById` in `src/lib/publish/run.ts`: same check, so already-scheduled Sold posts without consent fail with that message as their `error` instead of publishing. The existing failure path (status `failed` and whatever notification it sends) applies.
- `PostEditor.tsx`: on a Sold post with `sale_consent` null, show an amber notice in the style of the brokerage-name warning, with the R2 checkboxes and a **Confirm** button. It saves `sale_consent` (with `confirmed_at` set server-side: add a small authenticated endpoint, `POST /api/posts/[id]/sale-consent`, rather than writing the timestamp from the browser). After confirming, Publish now and Schedule work.
- Downloads stay available: they happen in the browser and the app can't police them. Show the notice there too, but don't block downloading.
- Before shipping, count the Sold posts that are `scheduled` with no consent (read-only query) and report the number to the user, since those will fail at their scheduled time until confirmed.

### R6. Correct the published guide

`src/lib/guides/just-listed-post-ideas.ts`:

- FAQ "What do I write in a Sold post?": replace the answer with: "A Sold post speaks to future sellers: tell the short story of the result and invite people to talk about their own home. Advertising a sale needs written consent. In Ontario, RECO requires the seller's before closing, the buyer's after, and both to show the price or terms. Check your own regulator's rules."
- The rules section list: add, after the brokerage-name bullet: "**Get written consent before a Sold post.** In Ontario, [RECO Bulletin 5.4](https://www.reco.on.ca/agents-and-brokerages/reco-bulletins/reco-bulletin-5-4-advertising-sold-property) requires the parties' written consent, with the dates it's valid, to advertise a property as sold: the seller's before closing, the buyer's after, and both to show the price."
- Add RECO Bulletin 5.4 to `sources`.
- Set `updated` to the day you make the change (it's a change in substance).
- `npx vitest run src/lib/guides.test.ts` must still pass (word limits, no stray dollar amounts).

## Out of scope

- Storing the consent document or its dates. The app records that the user confirmed; the document stays with the brokerage.
- Province-specific rules beyond Ontario's example.
- Any change to other post types.
- Print formats (see `marketing/product/print-marketing.md`).

## Acceptance checks

1. Creating a Sold post without ticking consent: the button is disabled in the UI, and a direct `POST /api/posts/generate` with `post_type: "sold"` and no `sale_consent` returns 400 `sale_consent_required` and uses no allowance.
2. Sold post created with consent, price not covered: no price on any slide, no price in the caption, Price toggle disabled in the editor.
3. Sold post created with price consent: price shown as today, Price toggle usable.
4. An existing Sold draft with no consent: Publish now and Schedule return 409 `sale_consent_required`; the editor shows the notice; after Confirm, both work.
5. A scheduled Sold post with no consent fails at its time with the consent message and isn't published.
6. Just Listed, Open House, Price Reduced, Coming Soon, Featured and feature sheets behave exactly as before.
7. Regenerating a Sold post keeps its consent and price setting.
8. Guests (anonymous users) get the same check at creation.

## Verify

1. `npx next typegen && npx tsc --noEmit -p .` and `npx eslint src`.
2. `npx vitest run`. Add unit tests for any pure helper you introduce, such as one deciding `show_price` from post type and consent, and for the API's 400 and 409 responses if the existing tests make that practical.
3. Run the app (the `run` skill, or `npx next dev` on a free port) and walk through checks 1–4 in the browser; screenshot the create form with the consent block and the editor notice.
4. Report what changed, the migration to apply, the count from R5, and any check you couldn't run.

Don't commit, push or apply the migration unless the user asks.
