# Requirements: free plan limits (3 listings, 2 captions each)

For: the agent implementing this in the SocialSpark repo, and the user to approve first. Read `AGENTS.md` first: this Next.js version differs from what you know, so check `node_modules/next/dist/docs/` before writing route or page code.

Decisions agreed with the user on 2026-10-29 (replaces the earlier "pool of 5" and "10 imports" drafts). Nothing here is built yet.

## Why

Today the free plan limits only captions (3 in total), and everything else is unlimited: feature sheets, PDFs, Stories, downloads, publishing and listing imports. Imports are the most expensive Claude call, and brokers' main product (the sheet) never reaches the paywall.

## The rule

**Free plan (accounts), lifetime, not monthly:**
- **3 listing imports.**
- **2 captions per listing** (a new post or a rewrite each uses one), so at most 6 in total.
- **Unlimited, for those listings:** feature sheets (new and duplicates), edits, downloads, PDFs, Stories, publishing and (later) sharing.
- The paywall sits on **importing a 4th listing** and **writing a 3rd caption on a listing**.
- No watermark. Deleting a listing or post gives nothing back.

**Guests (no account):** 1 listing import, 2 captions on it. Creating an account carries both into the free plan's totals (so 2 more imports).

**Paid plans: unchanged** (10 / 20 / 50 posts a month plus regenerations, monthly or yearly), with **unlimited imports and sheets**.

### What counts (free plan)

| Action | Counts as |
|---|---|
| Import a listing (link, or "Copy and paste the page") | 1 of 3 imports |
| A failed import (page unreadable, not a listing, error) | nothing |
| Listing added from a realtor's shared link (brokers) | **nothing** (keeps the referral loop open) |
| New post on a listing (caption written) | 1 of that listing's 2 captions |
| Rewrite ("Try another version", "Change focus", "Rewrite caption") | 1 of that listing's 2 captions |
| Caption on a post made from a feature sheet | 1 of that listing's 2 captions |
| A caption that fails to generate | nothing (refunded, as today) |
| New sheet, duplicate sheet | nothing |
| Edit, download, PDF, Story, publish, share | nothing |
| Delete a listing or post | nothing back |

## Where it's enforced

On the **server**: at import, and when a caption is written. Everything else on an imported listing is free, so downloads, PDFs and sheets need no lock.

| What | Where today |
|---|---|
| Free limits shown in the app | `src/lib/plans.ts` (`FREE_LIMITS = { guest: 1, registered: 3 }`) |
| Free caption limit enforced (all captions, total) | `consume_generation_for` in `supabase/migrations/20261026120000_top_producer_yearly.sql`; refunds in `refund_generation` |
| Caption requests (new, rewrite, sheet captions) | `src/app/api/posts/generate/route.ts` (paywall pre-check), `src/lib/generation-job.ts` (uses the allowance after writing) |
| Listing import | `src/app/api/listings/import/route.ts` |
| Listing from a shared link | `src/app/api/shared/[token]/route.ts` (stays free) |
| Paywall messages | `src/lib/paywall.ts` |

### Requirements

**R1. Counters (schema migration).** Write the migration file only; the user applies it. There are no real users yet, so no backfill or data conversion: new columns start at 0.
- `entitlements.imports_used integer not null default 0`, with a server-only function that atomically uses one free import (refuses at the limit: guests 1, accounts 3; paid plans aren't counted) and one that refunds a failed import.
- Captions per listing: `listings.free_captions_used integer not null default 0`. `consume_generation_for` gets the listing id: free accounts and guests use one of that listing's 2 (refusing at 2) instead of the old total of 3; paid plans are unchanged. `refund_generation` gives a free caption back to the listing.

**R2. Imports.** `POST /api/listings/import` uses one free import for free accounts and guests **before** calling Claude, and refunds it if the import fails. At the limit: `402` with the paywall message, and Claude isn't called. Paid plans: no check.

**R3. Captions.** The generate API's paywall pre-check and the job's allowance use the listing's 2 free captions on the free plan (new posts, rewrites and sheet captions alike). At the limit: `402` with the paywall message, and nothing is generated. Paid plans: unchanged.

**R4. Paywall and counts.** Messages at each limit, e.g.:
- "You've imported 3 listings on the free plan. Choose a plan to add more. Everything you've made stays yours to edit, download and publish."
- "You've written 2 captions for this listing on the free plan. Choose a plan for more posts. You can still edit, download and publish the ones you have."

Show what's left where the app shows usage today: "N of 3 free listings" (the import box, the Get started checklist, Settings → Plan & billing) and "N of 2 free captions left for this listing" (the create form and the post editor's rewrite buttons). The import box says when imports are used up, before the user pastes a link.

**R5. Copy.** Update everything that describes the old free limits so the site promises what the app does (e.g. "Try 3 listings free, with 2 posts each"). Files found today:
`src/lib/plans.ts`, `src/lib/paywall.ts`, `src/lib/faq.ts`, `src/lib/faq-brokers.ts`, `src/lib/broker-copy.ts`, `src/lib/home-copy.ts`, `src/lib/persona-pages.ts`, `src/lib/guides/*.ts` (four guides), `src/components/GettingStarted.tsx`, `src/components/StructuredData.tsx`, `src/components/guides/GuideArticle.tsx`, `src/components/landing/ListicleLanding.tsx`, `src/components/landing/PricingSummary.tsx`, `src/app/pricing/page.tsx`, `src/app/llms.txt/route.ts`, `src/app/sheets/SheetsPicker.tsx`, `src/app/listings/[id]/FeatureSheetForm.tsx`, `src/app/posts/[id]/SheetPostPanel.tsx`, and the French copy (`src/lib/landing-i18n.ts`, French pages). Re-search before finishing; this list may grow.

## Acceptance checks

1. A new free account imports 3 listings; the 4th is refused before Claude is called. A failed import doesn't use one.
2. On each listing it writes 2 captions (any mix of new posts, rewrites and sheet captions); the 3rd is refused and nothing is generated. A failed caption doesn't use one.
3. On those listings, sheets (new and duplicates), edits, downloads, PDFs, Stories and publishing are unlimited.
4. A broker's listing from a realtor's shared link doesn't use an import, even with none left; its captions follow the 2-per-listing rule.
5. Deleting a listing or post gives nothing back.
6. Guests: 1 import with 2 captions; after signing up, the totals carry over (2 imports left).
7. Paid plans: unlimited imports and sheets; captions count exactly as before.
8. No page on the site still describes the old free limits.

## Verify

`npx next typegen && npx tsc --noEmit -p .`, `npx eslint src`, `npx vitest run` (tests for any pure helpers), a production build, and a browser walk-through of checks 1–6 with a throwaway account. Report the migration to apply.

Don't commit or push unless the user asks.
