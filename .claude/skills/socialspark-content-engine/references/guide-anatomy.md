# Guide anatomy

The model is a reference article written by someone who does this work every week: it answers the question in the first screen, then shows how, with things the reader can copy. Fields are typed in `src/lib/guides/index.ts`; the example is `src/lib/guides/just-listed-post-ideas.ts`.

## Fields, in reading order

| Field | Rule |
|---|---|
| `slug` | The search phrase, kebab-case, short: `open-house-instagram-post`. Never changed after publishing (it's the URL). |
| `keyword` | The one phrase it's built to rank for. Unique across guides (the test checks). |
| `alsoAnswers` | Variants and follow-up queries from Search Console/Keyword Planner that this guide answers. Each needs a real answer somewhere in the guide. |
| `cluster` | One from [topic-map.md](topic-map.md). Groups guides on `/guides`. |
| `meta.title` | ≤ 60 characters, shown as is. Starts with the keyword's words, then the promise: "Open House Instagram Posts: 8 Ideas and Captions". A year only if the content really changes yearly. |
| `meta.description` | 70–160 characters. What the reader will be able to do after reading. No "Learn about…". |
| `h1` | Can be longer and more natural than the title; contains the keyword's words. |
| `dek` | One line: what's covered. |
| `answer` | 35–90 words. The complete answer in plain sentences, quotable on its own. No "In this guide…". |
| `sections` | 4–10. Headings are the questions or steps a reader scans for. Paragraphs ≤ 120 words. |
| `faq` | 3–8 real follow-up questions (Search Console queries and "People also ask"), answered in 1–3 sentences. Published as FAQPage. |
| `related` | 2–3 sibling guides (once they exist). |
| `cta` | Heading and one line for the import-form panel, specific to this guide's job. |
| `sources` | Every outside fact's primary source (regulator, CREA, platform help centre), https. |
| `figures` | Any dollar amount that isn't a plan price, with its source. Plan prices come from `PAID_PLANS` in template strings. |

## Blocks

`p`, `list`, `steps` (numbered, with a title each), `table` (head + rows, first cell is the row header), `tip` (a navy aside: a rule, a test, a common mistake), `example` (a copyable sample like a caption, line breaks kept), `visual` (real product imagery: `posts` with demo-posts ids, `screen` 1–3, `sheet`; every visual has a caption saying what it is).

Inline in any text: `[anchor](/guides/other-slug)`, `[anchor](https://source)` and `**bold**`. Nothing else is parsed.

## The shape that works

1. **The short answer** (the `answer` field).
2. **Why or what**: the goal of the thing (what an Open House post has to do), one short section.
3. **The how**: steps, with the reasoning a pro would give.
4. **Examples to copy**: 2–4 `example` blocks, per platform or per situation. This is what gets bookmarked and linked.
5. **Ideas or variations**: a numbered list when the query is "ideas" or "examples"; match the number to the heading.
6. **Platform or province differences**: a table.
7. **The rules in Canada**, when the topic touches advertising: brokerage identification, REALTOR® usage, photo rights, human rights (describe the home, not the buyer), no value promises. Cite the regulator. Never present it as legal advice; say the brokerage and regulator have the final word.
8. **Mistakes**: what makes it fail.
9. **How to do it with SocialSpark**: one section, near the end. Steps that match the app, a `screen` or `posts` visual, the free posts from `FREE_LIMITS`, and a link to `/pricing` or the matching `/for/` page.

Not every guide needs every part; a narrow question gets a shorter guide. 1,000 words is the floor because below that a "how to" can't show examples, not a target to pad to.

## Writing rules

- **Canadian English** (colour, neighbourhood, licence as a noun, centre). Canadian examples: Oakville, Centretown, GO station, CMHC, MLS® System, REALTOR®.
- **Specific beats general.** "A new roof in 2024" not "well maintained". Numbers where they're true.
- **Every product claim is true today**, checked in code. Gaps that must never be implied: MLS/DDF import, Reels or video, team seats in the app, languages other than English and French.
- **Every outside claim has a source you read.** Regulators differ by province: name the province, or say "check your regulator".
- **Examples are clearly examples.** Use the demo listings' facts (Oakville 5-bed with a saltwater pool, etc.) or none. No real agents', brokerages' or listings' names. Sample sign-offs use "Jane Doe, REALTOR® | ABC Realty Inc.".
- **No filler.** The test blocks the usual tells ("delve", "in today's fast-paced", "it's important to note", "in conclusion"), and the ad-copy skill's hype words. Beyond the test: no sentence that restates the heading, no intro that promises what's coming, no closing summary.
- **Brokers:** never imply SocialSpark sets or recommends rates or makes anyone compliant.
- **French guides** aren't supported by the template yet (it's English chrome and `en-CA`). If French demand shows up (Keyword Planner `fr` file), tell the user; adding a `locale` field is a template change, not a one-off.

## Found, quoted and cited: SEO, GEO, AEO

Every guide is written for three kinds of reader: Google's results (SEO), AI assistants that cite sources, like ChatGPT, Claude and Perplexity (GEO), and direct answers such as AI Overviews and voice (AEO). The rules below cover all three; `src/lib/guides.test.ts` enforces those marked ✓.

**SEO**
- ✓ The search phrase's words are in the title, H1, short answer and at least one section heading. The slug is the phrase.
- One search intent per guide. If the top pages answer a different question from the phrase, write for what they show searchers want.
- ✓ At least 2 internal links in the text and 2 related guides, with anchor text naming the topic.
- Beat the top pages on substance: the gap brief's missing opportunities are the reason to rank.

**AEO**
- ✓ The short answer starts with the answer, in plain sentences, and makes sense quoted alone.
- ✓ At least 2 headings are the questions a reader asks, or "How to…". Use the words from Keyword Planner, Search Console and the ranking pages.
- The first sentence under each heading answers that heading on its own, with no "this" or "it" pointing back to earlier text.
- ✓ FAQ questions end in a question mark and answers run 80 words at most.
- Define a term the first time it appears, in one plain sentence ("A Coming Soon post is…").

**GEO**
- ✓ Cite outside facts next to the claim, with an inline link, and list at least 2 sources. Name the regulator or platform in the sentence ("RECO's Bulletin 5.1 says…").
- ✓ Include a table or numbered steps. Assistants lift these cleanly.
- Be specific enough to be worth citing: numbers, limits, dates and province-by-province differences, each one true and sourced.
- Name things in full each time they matter: SocialSpark, RECO, Instagram, Ontario. An assistant may quote one paragraph without the rest.
- State facts in one clear sentence each, so they survive being quoted on their own. Keep `updated` honest; assistants favour fresh pages.

**Schema.** `src/lib/guides/schema.ts` builds the schema.org JSON-LD from the guide, so there's nothing to fill in, but what you write decides what it contains:

| Type | Comes from |
|---|---|
| `Organization`, `WebSite`, `BreadcrumbList` | The site and the guide's URL |
| `WebPage` with `speakable` | `meta`, the H1 and the short answer |
| `Article` with `citation` | `h1`, `answer`, dates, `keyword`, `alsoAnswers`, `cluster`, `audience`, `sources` |
| `FAQPage` | `faq` |
| `HowTo` | Each section whose heading starts "How to" and has a `steps` block. Give a real procedure that heading; a list of tips isn't a how-to |

Markup must describe what's visible on the page. Never add a type for content the page doesn't show, and no `Review` or `AggregateRating` without real, permitted reviews.

## Refreshing a guide

Change what the data says is missing: the query it ranks 8–20 for gets its own section or FAQ, the variant goes in `alsoAnswers`, the title leads with the words people search. Set `updated` to today only when the content changed in substance (not for a link or a typo). Never change the slug.
