---
name: socialspark-personas
description: Buyer personas for SocialSpark (listing-link → branded social posts for Canadian realtors, and mortgage feature sheets for mortgage brokers). Use whenever the user asks who SocialSpark is for, who will pay, ideal customer profile (ICP), buyer or user personas, jobs-to-be-done, segmentation, targeting, positioning, messaging by audience, pricing or plan fit for a segment, which persona a feature serves, onboarding or interview scripts for a segment, or when another task (ads, landing pages, emails, feature prioritisation) needs to pick one specific reader first.
---

# SocialSpark buyer personas

SocialSpark sells to people whose income depends on being seen: Canadian listing agents, and the mortgage brokers who want those agents' referrals. The 20 personas in [references/personas.md](references/personas.md) are the working model of who uses it, who pays, and why. Read that file before answering any persona, targeting or positioning question.

## 1. Facts first, from the code

Personas are only useful if what they're promised is true. Before tying a persona to a feature or a price, check the current values:

| Fact | Source of truth |
|---|---|
| Plans, prices (CAD), allowances | `src/lib/plans.ts` |
| Realtor promises | `src/lib/faq.ts`, `src/app/page.tsx` |
| Broker promises | `src/lib/faq-brokers.ts`, `src/app/mortgage-brokers/page.tsx` |
| Roles, provinces, titles | `src/lib/broker.ts`, `src/lib/types.ts`, `src/app/welcome/` |
| Realtor ↔ broker features | `src/app/partners/`, "Send to broker" on listing cards, `src/app/shared/` |
| Post types, platforms, languages | `src/app/llms.txt/route.ts` |

Snapshot (2026-10-23; verify): Free = 3 posts, no card (1 as a guest); Starter $14.99/mo = 10 posts + 5 regenerations; Pro $24.99/mo = 20 + 10 (plan id `professional`); Top Producer $49.99/mo = 50 + 25; yearly = 10× monthly (two months free), allowances still monthly; Team = contact sales from the pricing page (`src/lib/team.ts`), promising seats, one invoice and a shared brand kit that aren't built in the product yet. One post = one platform's single image or carousel; broker sheets, PDFs and Stories are free, only the caption costs a post.

**Volume math matters.** A typical listing goes through 3–5 moments (Coming Soon, Just Listed, Open House, Price Reduced, Sold), and each platform is its own post. One listing posted to Instagram and Facebook is often 6–10 posts: Starter ≈ 1 listing a month, Pro ≈ 2–3, Top Producer ≈ 5–8. Use this to match a persona to a plan and to monthly vs yearly billing.

## 2. Rules for using the personas

1. **They are hypotheses, not research.** Nothing in `personas.md` comes from customer interviews or usage data. Never present a persona detail as a measured fact, a statistic or a quote. If a task needs proof, say what to measure (see §4).
2. **One persona per piece of work.** An ad, a landing section, an email or an interview script speaks to one person. Name them at the top.
3. **User ≠ payer.** Several personas use the product but don't hold the card (assistants, coordinators, team members). Say who uses it, who pays, and who can veto it.
4. **Separate "will use" from "will pay".** A persona who loves the free posts but has no reason to subscribe is a funnel risk, not a customer. Every persona file entry states its pay trigger; keep that distinction in your answer.
5. **Respect the regulated ones.** Mortgage personas buy because of compliance details (licence number, "as of" date, disclaimer, Canadian payment math, no rates in captions). Never promise them that SocialSpark makes them compliant, and never suggest it sets or recommends rates.
6. **Québec is its own market.** Québec personas get Québec French, not translated English, and the regulator context (OACIQ for brokers, AMF for mortgage brokers).
7. **Don't invent features.** If a persona needs something SocialSpark doesn't do (team seats and brand kit beyond the sales promise, MLS/DDF auto-import, Instagram Reels video, multi-language beyond EN/FR), flag it as a gap, don't imply it exists.

## 3. Workflow

1. **Identify the job.** Targeting, messaging, pricing, roadmap, onboarding, interviews or sales? Note what decision the answer feeds.
2. **Pick personas.** Use the fit table at the top of `personas.md`. For acquisition work, start with the Tier 1 personas; for roadmap work, include personas blocked by a gap.
3. **Pull their entry** and adapt: their trigger moment, the one-line message, objections and the answer to each, where to reach them.
4. **Tie to product truth.** Map each claim to a source file in §1. Mark anything that needs a real proof point with a placeholder, e.g. `[REAL BROKER QUOTE — needs permission]`.
5. **Hand off.** For ad copy, pass the chosen persona to the `socialspark-ad-copy` skill (its headline must "pick out the reader"). For a landing page, pass it to `socialspark-landing-pages`, which builds `/for/<slug>` with the persona's plan highlighted (`PERSONA_PLAN` in `src/lib/persona-pages.ts`; if you change a persona's likely plan here, update that map too). For roadmap questions, list which personas a feature unlocks or upgrades to a paid plan.

## 4. Validating and updating the personas

The personas should be replaced by evidence as it arrives. When asked to validate or refresh them:

- **Product data (Supabase, read-only queries):** `profiles.role` and `profiles.province` give the realtor/broker and regional mix; entitlements show plan and usage against limits (who hits 10 or 20 and upgrades or churns); listing and post counts per user show volume tiers; language choice shows the Québec and bilingual share; partner and "Send to broker" activity shows the realtor–broker loop. Never export personal data into the persona file; use aggregates only.
- **Interviews:** ask about the last listing they marketed: what they posted, where, who made it, how long it took, what it cost, what they'd have done without it. Ask brokers how they get realtor referrals today.
- **Update the file:** move personas between tiers, add a "Validated by" line with the source and date, and delete personas the evidence rules out.

## 5. Output format

For a persona question, answer with the personas involved, each as:

```
### <#>. <Persona name> — <role, place>
Who: one or two sentences.
Uses SocialSpark for: the jobs, mapped to real features.
Pays because: the trigger and the plan that fits (with volume math).
Watch out for: the main objection or product gap.
```

For a broad "who should we target" question, lead with a ranked shortlist and a one-line reason each, then the detail.
