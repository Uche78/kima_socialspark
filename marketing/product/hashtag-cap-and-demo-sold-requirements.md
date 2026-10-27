# Requirements: Instagram's 5-hashtag cap, and the demo Sold post

For: the agent implementing this in the SocialSpark repo. Read `AGENTS.md` first: this Next.js version differs from what you know, so check `node_modules/next/dist/docs/` before writing route or page code.

**Start after the Sold consent work** (`marketing/product/sold-consent-requirements.md`) is committed. Both tasks touch the same files (`src/lib/generate.ts`, `src/app/posts/[id]/PostEditor.tsx`, the publish and schedule routes), and part B uses its helper `priceAllowed()` from `src/lib/sale-consent.ts`. If that work isn't committed when you start, stop and say so rather than editing around it.

---

## A. Instagram allows at most 5 hashtags

### Why

Instagram caps a caption at **five hashtags**, on posts and Reels. It announced this on December 18, 2025 from its @creators account on Threads: "Instagram will gradually update the number of hashtags that you can include in a caption for a reel or post to five." ([Social Media Today](https://www.socialmediatoday.com/news/instagram-implements-new-limits-on-hashtag-use/808309/)). The cap counts every hashtag in the caption, wherever it sits.

SocialSpark still tells the model to write **5–10** Instagram hashtags, so most Instagram posts it writes can go over the cap. What Instagram does with a caption over the cap through the API (reject the post, or drop tags) isn't documented in anything we've read; check Meta's Instagram Graph API docs for content publishing, and say what you found. The requirements below hold either way: never send more than five.

### How it works today

| What | Where |
|---|---|
| Instagram spec: `hashtagTarget: "5-10 targeted hashtags"` | `src/lib/types.ts`, `PLATFORM_SPECS.instagram` |
| Playbook line: "Hashtags: 5-10, mixing neighbourhood or city tags…" | `src/lib/generate.ts`, Platform playbooks, **Instagram** bullet |
| The spec's target passed to the model | `src/lib/generate.ts` (`Platform: … ${spec.hashtagTarget} …`) |
| Hashtags cleaned after generation (strip `#` and spaces), no count limit | `src/lib/generate.ts` (`hashtags: out.hashtags.map(…)`) |
| Caption + hashtags joined for publishing | `src/lib/caption.ts`, `fullCaption()` |
| Hashtag field in the editor (space separated, no limit) | `src/app/posts/[id]/PostEditor.tsx`, "Hashtags (space separated)" |
| Instagram publishing | `src/lib/publish/meta.ts`, via `src/lib/publish/run.ts` |

Facebook (0–3) and LinkedIn (3–5) are unchanged.

### Requirements

**A1. Ask for at most five.**
- `src/lib/types.ts`: add `maxHashtags?: number` to the platform spec type and set `maxHashtags: 5` for Instagram only. Change Instagram's `hashtagTarget` to `"3-5 targeted hashtags (Instagram allows at most 5)"`.
- `src/lib/generate.ts`, Instagram playbook bullet: replace "Hashtags: 5-10, mixing neighbourhood or city tags, property-type tags and a few niche real estate tags." with "Hashtags: 3-5 (Instagram allows at most 5): the city or neighbourhood, the property type and the post type, plus the agent's own tag if their style uses one." Keep the "No generic spam tags" sentence.
- Also tell the model not to put hashtags in the caption text itself (the schema already says "WITHOUT hashtags"; make the playbook consistent).

**A2. Enforce it after generation.** In `src/lib/generate.ts`, where hashtags are cleaned: remove duplicates (case-insensitive, keep the first), then keep only the first `spec.maxHashtags` when the platform has one. Put this in a small pure helper (for example `capHashtags(tags, max)` in `src/lib/caption.ts`) and use it for new posts and regenerations alike.

**A3. Count what Instagram counts.** Add a helper in `src/lib/caption.ts` that counts the hashtags in the full published caption: the hashtag list plus any `#tag` the user typed into the caption text. The pattern must match how hashtags are written (`#` followed by letters or digits, including accented letters like `#québec`), and must not count `#` in things like "Unit #4" if that's practical (a `#` followed by digits only isn't a hashtag on Instagram).

**A4. Show the limit in the editor.** In `PostEditor.tsx`, for Instagram posts only: under the Hashtags field, show `N / 5 hashtags (Instagram's limit)` using the A3 count, red when over five, with: "Instagram allows up to 5 hashtags in a caption. Remove N to publish." Don't block typing.

**A5. Don't publish over the limit.** For Instagram posts whose A3 count is over five:
- `publish` and `schedule` routes return `409` with `{ "error": "Instagram allows up to 5 hashtags in a caption. Remove some, then publish again.", "code": "too_many_hashtags" }`, before claiming or changing the post.
- `publishPostById` (scheduled publishing) fails the post with that message instead of sending it.
- Don't trim silently at publish time: the user chose those tags and should choose which go.
- Before shipping, count (read-only) the Instagram posts that are `draft` or `scheduled` with more than five hashtags and report the number, since the scheduled ones will fail until edited.

**A6. Copy that states the old range.** Search the repo for other places that tell users or models "5-10" or similar for Instagram hashtags (`git grep -n -i "hashtag"`), outside the guides, and fix any you find. The guides are already corrected on branch `guides/real-estate-captions-for-instagram` (Just Listed guide FAQ and table); don't edit them again here.

### Acceptance checks
1. A new Instagram post (single and carousel, English, French, bilingual) never has more than five hashtags, and none repeat.
2. Facebook and LinkedIn posts are generated as before.
3. Editing an Instagram post to six hashtags (in the field, or one typed into the caption plus five in the field) shows the red count, and Publish now and Schedule return 409 `too_many_hashtags`; at five, both work.
4. A scheduled Instagram post with six hashtags fails with the message instead of publishing.
5. "Unit #4" in a caption doesn't count as a hashtag.

---

## B. The demo Sold post shows what the Sold rules forbid

### Why

The site's demo Sold post (`ig-maple`) shows the headline **"Sold in 6 Days"**, the subtext **"Thank you to my Maple Lane clients"**, and the price. Under the Sold consent work, a Sold post shows no price without both parties' consent, and `src/lib/generate.ts` tells captions never to state days on market without it. The demo shows visitors the opposite of what the product now does, on the home page and four landing pages.

### Where it appears

| What | Where |
|---|---|
| The post: `slide: { headline: "Sold in 6 Days", subtext: "Thank you to my Maple Lane clients" }` | `src/components/hero/demo-posts.ts`, `ig-maple` in `DEMO_POSTS` |
| Its French text: "Vendu en 6 jours", "Merci à mes clients de Maple Lane" | `src/components/hero/demo-posts.ts`, the French overrides (`"ig-maple": { … }`) |
| Demo design: `show_price: true` for every demo post | `src/components/hero/demo-posts.ts`, `demoDesign()` |
| Home page hero | `src/components/hero/HeroShowcase.tsx` |
| Landing pages: in the posts visual on four `/for/` pages, and as `heroPost` on two (the French and bilingual pages) | `src/lib/persona-pages.ts` |

### Requirements

**B1. New text.**
- English: headline **"Just Sold on Maple Lane"**, subtext **"Thinking of selling? Let's talk."**
- French: headline **« Vendu sur Maple Lane »**, subtext **« Vous pensez vendre? Parlons-en. »** Follow the punctuation style the file's other French strings use.
- Leave the caption as it is ("Thinking of selling in Stouffville? Let's talk about what your home could get." and its French version): it states no price, terms or days on market.

**B2. No price on demo Sold posts.** In `demoDesign()`, set `show_price` with `priceAllowed(p.postType, null)` from `src/lib/sale-consent.ts`, so Sold demo posts never show a price and every other demo post keeps it.

**B3. Check it everywhere it shows.** Render `/`, and the `/for/` pages that use `ig-maple` (grep `persona-pages.ts` for the slugs), at 1440 and 390 px:
- the new headline fits the slide without wrapping awkwardly in the `minimal` template, at the hero's small size and in the landing pages' larger cards;
- no price appears on the Sold post, in English or French;
- the other demo posts are unchanged.

Screenshot each. Playwright is in `.claude/skills/socialspark-ad-video/scripts/node_modules`.

**B4.** `npx vitest run src/lib/persona-pages.test.ts` still passes (it checks demo post ids, not text).

### Acceptance checks
1. Nowhere on the site does the Sold demo post show "6 days", a price, or a thank-you to clients.
2. All other demo posts look exactly as before.

---

## Out of scope

- Facebook and LinkedIn hashtag rules.
- Reels or other formats SocialSpark doesn't make.
- Changing the guides (done on the guide branch).

## Verify

1. `npx next typegen && npx tsc --noEmit -p .` and `npx eslint src`.
2. `npx vitest run`. Add unit tests for `capHashtags` and the hashtag counter (A2, A3), including duplicates, accented tags and "Unit #4".
3. Run the app and walk through the acceptance checks for A and B; include the screenshots.
4. Report what changed, what Meta's docs say about captions over the cap, the count from A5, and any check you couldn't run.

Don't commit or push unless the user asks.
