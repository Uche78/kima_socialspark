# Sections anatomy: what each section must do

For `layout: "sections"` pages. (For the listicle, see [listicle-anatomy.md](listicle-anatomy.md).) The template (`src/components/landing/PersonaLanding.tsx`) renders the sections below in this order, from the fields of one `PersonaPage` entry. Each section has one job in moving the reader toward pasting a link. The limits in brackets are enforced by `src/lib/persona-pages.test.ts`.

The order follows how a half-interested agent decides: *is this for me?* (hero) → *do I have this problem?* (before/after) → *is it easy?* (steps) → *is it any good?* (pains taken) → *what does it cost me?* (pricing) → *what's the catch?* (objections) → *fine, let me try* (close).

## `meta`: the search result

- `title` [≤ 46 chars; the layout adds " | SocialSpark"]: the persona's search phrase plus the reward. "Social media posts for condo realtors", not "SocialSpark for condo specialists".
- `description` [70–160 chars]: a specific promise plus the free offer. Written for the person scanning Google results, so it states the job and the reader.

## `hero`: is this for me? (the first screen)

- `eyebrow`: picks out the reader in 2–5 words. "For condo & pre-sale agents". (The JSON-LD audience comes from `reader`.)
- `headline` [≤ 80 chars]: the winner of the headline process. It picks out the reader (or the eyebrow does) and carries the main reward in concrete terms. If there's a winning ad for this persona, this restates its promise.
- `sub` [≤ 45 words]: how it works in one breath, plus 1–2 keystone facts. Paste link → what they get → in their brand/voice → ready to post.
- `reassurance`: the risk reversal under the form. The free-post count from `FREE_LIMITS`, "no credit card", plus the persona's biggest fear answered ("Nothing posts without your click.", "Sheets and PDFs are always free."). The template adds a "See pricing" link after it.

The template provides: the import form (with a broker guest session for broker pages), the realtor post showcase or the broker feature sheet. Don't describe the visual in copy.

## `pain`: do I have this problem?

- `heading`: names their situation in their words. "Five new condos, one evening, zero posts."
- `today` [3–5 lines]: the real week now, from the persona's "Today" and "Pains and triggers". Concrete moments, not adjectives: "Retype the price, unit number and fees into last month's Canva template."
- `after` [3–5 lines]: the same week with SocialSpark, line for line where possible. Each line maps to a real feature.

Rewards, not fear: "after" should make them want the result; "today" should make them nod, not panic.

## `steps`: is it easy?

- `heading`: the promise in time terms ("From listing link to posted in under a minute.") only when the claim is in the approved copy.
- `items` [exactly 3]: paste link → choose → publish/print/send, each with the detail this persona cares about (a condo agent: unit, fees and photos imported; a luxury agent: the photographer's photos chosen, not cropped thumbnails; a broker: their rates and up to four down payments).

## `facts`: is it any good? (the pains taken)

- `eyebrow` + `heading`: the persona's standard. "Built for brokers" / "Numbers you can stand behind."
- `items` [3 or 6]: the keystone facts, each a short title and 1–2 sentences. Specific and verifiable from the code: how photos are picked, voice learning, Canadian mortgage rules, licence and "as of" date on every sheet, Québec French phrasing, platform-specific formats, data stored in Canada, nothing posts without approval. Lead with the most surprising one.

## `planFit`: what does it cost me?

One sentence, shown in bold under the pricing heading, explaining why the highlighted plan suits *them*, with the volume math from the personas skill. No dollar amounts.

- Realtor: "Most condo agents post 4–6 listings a month at every stage. That's what Top Producer's 50 posts are for."
- Broker: say the plan is for brokers too ("Top Producer isn't just for listing agents: 20+ partner listings a month fit its 50 posts.").
- Team: "Running a team? Tell us how many agents, and we'll set you up." (points at the featured Team banner).

The highlighted plan and preselected billing come from `PERSONA_PLAN`; the copy must agree with them.

## `objections`: what's the catch?

- `heading`: in their voice: "Questions condo agents ask".
- `items` [4–8]: the persona's objections from `personas.md`, then the generic ones that still apply to them. Questions phrased as they'd ask them ("Will it post something without me?"); answers short, direct, specific, honest about limits (REALTOR.ca links, what counts as a post). Reuse approved answers from `src/lib/faq.ts` / `faq-brokers.ts` where they fit. These become FAQPage structured data, so each answer must stand alone.

## `close`: fine, let me try

- `heading`: the reward again, in a fresh way, tied to their next listing. "Your next listing is one link away."
- `sub`: the offer and the time: "Paste a listing link and see your first post in under a minute."

The template repeats the import form here.

## Before you write the entry: the brief

Write this in working notes and show it to the user if they want to review it before the copy:

```
Persona: #<n> <name>, tier <t>   Slug: /for/<slug>   Audience: realtor|broker
Reader in one line:
Trigger moment:
Main reward (headline appeal):
Keystone facts (★ = most surprising): ★ … ★ … ★ … · … · …
Objections to answer:
Plan: <PERSONA_PLAN> because <volume math>
Ads pointing here: <winning headline or "none">
```
