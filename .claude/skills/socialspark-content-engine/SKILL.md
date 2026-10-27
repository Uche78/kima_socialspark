---
name: socialspark-content-engine
description: SocialSpark's content marketing and conversion engine. Every day it reads Google Search Console and Keyword Planner through the gum CLI, finds the search phrases SocialSpark is shown for but not clicked on (impressions with no clicks, page 2+ positions, low CTR) or has demand but no page for, and then does exactly one thing well: writes one new answer-first guide at /guides/<slug>, refreshes a guide that's close to page 1, or rewrites a title that's losing clicks. It adds internal links from pages that already earn traffic, verifies, publishes per the configured mode, and logs and checks results. Use whenever the user asks for SEO, content marketing, blog posts, articles, guides, "write a guide about…", keyword research, Search Console or Keyword Planner analysis, "what should we write next", striking-distance keywords, internal linking, refreshing or auditing guides, the daily content run, or scheduling it. For /for/ sales pages use socialspark-landing-pages instead.
---

# SocialSpark content engine

The loop, once a day: **data → one decision → one excellent page → links into it → publish → measure.** One guide a day at most, and none on a day when nothing clears the bar. Google rewards a steady trickle of pages that fully answer one question; it punishes a flood of thin ones. Quality is the strategy, not a constraint on it.

Works with:
- **`socialspark-personas`**: who the reader is (their words, their week). A guide is written for one persona's question.
- **`socialspark-ad-copy`**: the voice (Hopkins: specific facts over adjectives, no hype). Its banned words apply.
- **`socialspark-landing-pages`**: owns `/for/` pages. Guides may link *to* a `/for/` page; never edit a `/for/` page to link out (one-goal rule).

## 1. The pieces

| Piece | File | What it does |
|---|---|---|
| Guides | `src/lib/guides/<slug>.ts`, registered in `src/lib/guides/index.ts` → `GUIDES` | One file per guide, typed `Guide`. **This is what you write.** |
| Template | `src/components/guides/GuideArticle.tsx`, `RichText.tsx` | Breadcrumbs, the short answer, sections, the import form after section 2 and after the FAQ, sources, related guides, table of contents |
| Routes | `src/app/guides/page.tsx`, `src/app/guides/[slug]/page.tsx` | Index grouped by cluster; static article pages with Article, BreadcrumbList and FAQPage JSON-LD |
| Discovery | `src/app/sitemap.ts` (real `updated` dates), `src/app/llms.txt/route.ts`, footer "Guides" link | Automatic for every entry |
| Quality gate | `src/lib/guides.test.ts` (+ `src/lib/copy-rules.ts`) | Title/description lengths, the keyword in title+H1 and the answer, 1,000–3,500 words, 4–10 sections, 3–8 FAQs, honest dates, internal links resolve, no orphans, one guide per keyword, no stray prices, no hype, no filler phrases |
| Config | `marketing/seo/config.json` | GSC property, Ads customer id, geo/languages, thresholds, relevant/excluded terms, seed keywords, `publish_mode` |
| Data | `marketing/seo/data/<date>/` (gitignored) | Raw gum output and `opportunities.json` |
| Log | `marketing/seo/guide-log.md` | Every decision, why, links added, and check-in results |
| Scripts | `scripts/pull.py`, `scripts/analyse.py` | Pull (read-only gum calls); rank opportunities, find link sources, check a guide |

First run on a machine: follow [references/setup.md](references/setup.md) (gum install, OAuth, Ads developer token, config). If gum isn't set up, say so and stop the data steps. You can still write a guide the user asks for, from the topic map and seed keywords, and log it as "unverified demand".

## 2. The daily run

### Step 0: Is the site indexed?
```bash
gum read searchconsole.sitemaps.list --format json --args '{"siteUrl":"https://socialspark.usekima.com/"}'
```
If `indexed` is 0 (or far below `submitted`), there's no ranking data to act on yet. Spend the run on discovery instead: inspect the home page and the newest guide (step 9's command); "URL is unknown to Google" on a new site just means it hasn't been crawled, so check that indexed pages link to it (`usekima.com/socialspark/` does) and ask the user to click **Request indexing** for `/` and `/guides` in Search Console's URL Inspection (there's no API for it). A guide can still be written from Keyword Planner demand, but check-ins are meaningless until pages are indexed.

### Step 1: Pull
```bash
python3 .claude/skills/socialspark-content-engine/scripts/pull.py
```
It pulls Search Console query×page for the last 28 days and the 28 before (ending 3 days ago, final data), pages for 28 days, and Keyword Planner historical metrics and ideas for the seed keywords (Canada, English and French). On the first run, open one output file to confirm gum's JSON envelope parses (`analyse.py` searches for `rows` / keyword items anywhere in it).

### Step 2: Rank
```bash
python3 .claude/skills/socialspark-content-engine/scripts/analyse.py opportunities
```
Four actions come back, scored by missed clicks (impressions × (1 − CTR), weighted up for positions 8–25, plus Canadian search volume):

| Action | Signal | What you do |
|---|---|---|
| `new` | Impressions with no page written for the query (the home page ranks at 40 by accident), a sales page only, or Keyword Planner demand with nothing on the site | Write a new guide (step 4) |
| `refresh` | A guide targets it and sits at positions 4–20 | Improve that guide: answer the exact query in a section or FAQ, add the variant to `alsoAnswers`, sharpen the title, add links to it. Bump `updated` |
| `title` | Page 1 but CTR under a third of the usual for that position | Rewrite `meta.title` / `meta.description` to match the searcher's intent. For `/`, `/pricing` or `/for/` pages, propose the change to the user, don't make it |
| (nothing) | No row clears the thresholds | Publish nothing. Log "no action". A gap day is better than a filler guide |

### Step 3: Choose one
Take the top row unless something below beats it on **fit**. Fit means the searcher's problem is one SocialSpark solves, or a step on the way to it: listing posts, captions, platforms, open houses, the rules for realtor advertising, mortgage feature sheets. "Realtor salary" has volume and zero fit. Use the clusters in [references/topic-map.md](references/topic-map.md). Before writing, check cannibalisation: if an existing guide is ≥50% the same question, refresh it instead of writing a new one. Say in one line what you picked and why (the numbers).

For a `new` guide, validate demand if it came from Search Console alone:
```bash
python3 .claude/skills/socialspark-content-engine/scripts/pull.py --kp "open house instagram post" "open house post ideas"
```

### Step 4: Research, then write
1. **Read what ranks.** Search the exact phrase (WebSearch, Canada-relevant) and skim the top results. Note what they all cover (table stakes), what they get wrong or leave out for Canadian agents (your angle), and what format wins (steps, examples, table).
2. **Gather facts.** Product facts only from the code: `src/lib/generate.ts` (post types, platform playbooks, compliance rules the captions follow), `src/lib/types.ts` (platforms, limits), `src/lib/plans.ts`, `src/lib/faq*.ts`, `src/lib/mortgage*.ts`, `src/lib/feature-sheet.ts`. Outside facts (regulators, CREA, platform rules) only from a primary source you've read, listed in `sources`. If you can't verify it, don't say it.
3. **Write the guide** following [references/guide-anatomy.md](references/guide-anatomy.md): the answer first, then the how, with real examples the reader can copy, then how SocialSpark does it (one section, near the end, factual). Copy `src/lib/guides/just-listed-post-ideas.ts` as the shape. Values import relatively (`../plans`), because vitest has no `@/` alias.
4. **Register it** in `src/lib/guides/index.ts` (`import` + add to the `GUIDES` array).

### Step 5: Link into it (this is what makes Google prioritise it)
```bash
python3 .claude/skills/socialspark-content-engine/scripts/analyse.py links "<the new guide's keyword>"
```
This lists pages that already earn impressions for related queries. Then:
- Add **2–4 contextual links** to the new guide from the top existing guides in that list, in a sentence where the reader would want it, with descriptive anchor text (the topic, not "click here"). Bump nothing else in those guides; a link edit doesn't change `updated`.
- Add the new guide to those guides' `related`, and set the new guide's `related` to 2–3 siblings.
- Link out from the new guide to 1–3 relevant pages: sibling guides, `/pricing`, `/mortgage-brokers`, or the one `/for/` page that matches the reader.
- **Never** add links to `/for/` pages (one-goal pages). Links from `/` or the header need the user's OK; propose them in the hand-off if the home page is the main traffic source for the cluster.
- The test fails on orphans (once there are two guides), broken internal links and self-links.

### Step 6: Verify
1. `npx next typegen && npx tsc --noEmit -p .` and `npx eslint src/lib/guides src/components/guides src/app/guides`.
2. `npx vitest run src/lib/guides.test.ts`. Fix the copy, not the test; change a rule only with the user's agreement.
3. Render `/guides/<slug>` on the dev server (check `lsof -iTCP -sTCP:LISTEN`; start one with `npx next dev -p <port>` if none; if the new slug 404s, touch `src/app/guides/[slug]/page.tsx`). Screenshot at 1440 and 390 px after scrolling (Playwright lives in `.claude/skills/socialspark-ad-video/scripts/node_modules`; run scripts from the repo root). Check: no horizontal scroll, tables scroll inside their box on phones, visuals show real posts, both import forms work, the header's "Try it for free" focuses the first form.
4. Re-read it as the reader: does the first screen answer the question? Would a busy agent copy something from it today? Anything a competitor's page says that this one should? Cut any sentence that's there to fill space.

### Step 7: Publish (per `publish_mode` in the config)
- **`review`** (default): create a branch `guides/<slug>`, commit the guide, the link edits and the log entry, and stop. Tell the user what to review. Don't push unless they say so.
- **`auto`**: only when the user has set it in the config themselves. Commit to `main` and push (Netlify deploys). After the deploy is live, resubmit the sitemap:
  ```bash
  gum write searchconsole.sitemaps.submit --allow-write --args '{"siteUrl":"https://socialspark.usekima.com/","feedpath":"https://socialspark.usekima.com/sitemap.xml"}'
  ```
  Don't use the Indexing API: Google limits it to job postings and livestream pages.
- Either way, end commit messages with the attribution lines from the system reminder.

### Step 8: Log
Append a row to `marketing/seo/guide-log.md`: date, action, URL, keyword, the evidence (impressions, position, volume), links added from, and leave the check-in columns empty.

### Step 9: Check in (every run, before choosing)
For each logged guide at about 4, 14 and 28 days old:
```bash
python3 .claude/skills/socialspark-content-engine/scripts/analyse.py checkin <slug>
gum read searchconsole.urlInspection.index.inspect --format json --args '{"body":{"inspectionUrl":"https://socialspark.usekima.com/guides/<slug>","siteUrl":"https://socialspark.usekima.com/"}}'
```
Not indexed after 7 days: check it's in the sitemap and linked from at least two pages that are indexed. Impressions but position > 10 at 28 days: that's tomorrow's `refresh`. Write the result in the log's check-in columns. Rankings move over weeks; don't rewrite a guide that's under 28 days old unless it has a factual error.

## 3. Conversion

A guide earns its place when readers paste a listing link. The template already places the import form after section 2 and after the FAQ, with the free-trial reassurance from the code. Your part:
- The `cta` speaks to the guide's job ("See your next listing as an Open House post"), not a generic "Try SocialSpark".
- The "how to do it with SocialSpark" section is one section, near the end, factual, with a real visual. The rest of the guide must be useful to someone who never signs up; that's what earns links and rankings.
- Broker guides set `audience: "broker"` so the form starts a broker session.
- Measuring: Search Console gives clicks per guide. Sign-ups and first posts by landing page are in GA4 (Reports → Engagement → Landing page, filtered to `/guides/`) for visitors who allowed cookies. gum has no Analytics API, so ask the user for those numbers at the 28-day check-in, or offer to add a first-touch landing-page field to sign-up tracking.

## 4. Running it every day

The run needs gum's local credentials, so it runs on the user's machine, not in a cloud routine. Options, in order:
1. In an open Claude Code session: `/loop 24h /socialspark-content-engine daily run`.
2. Unattended: a launchd job running `claude -p "/socialspark-content-engine daily run" --permission-mode acceptEdits` at 7:00 in the repo. Template and steps in [references/setup.md](references/setup.md). Set it up only when the user asks. In `review` mode it leaves a branch per day to approve.

## 5. Hand-off

```
Today: <new|refresh|title|no action>: <URL>
Why: "<query>": <impressions> impressions, position <n>, CTR <x%>, <volume>/mo in Canada (<source>)
Angle: what the top results miss that this guide covers
Links added from: <pages>; links out to: <pages>
Checks: tests ✓, types ✓, lint ✓, rendered at 1440/390 ✓
Published: <branch guides/<slug>, awaiting review | pushed to main, sitemap resubmitted>
Check-ins: <guide: indexed? impressions, position at 4/14/28 days>
Needs you: <claims to confirm, home page link proposal, GA4 numbers>
```
