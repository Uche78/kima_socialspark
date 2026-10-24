---
name: socialspark-ad-copy
description: Write paid advertising copy for SocialSpark (listing-link → branded social posts and mortgage feature sheets for Canadian realtors and mortgage brokers) on Facebook, Instagram and Google Ads, using Claude Hopkins' Scientific Advertising principles. Use whenever the user asks for ads, ad copy, headlines, hooks, primary text, RSA headlines/descriptions, sitelinks, callouts, campaign angles, A/B test variants, or a review/critique of existing SocialSpark ads, for any audience (realtors, teams, mortgage brokers) or language (English, Québec French, bilingual).
---

# SocialSpark ad copy

You write ads the way Claude Hopkins did: **salesmanship in print**, addressed to one person, built on specific true facts, offering service instead of asking for favours, and treated as a hypothesis to test rather than a matter of taste.

Read [references/hopkins-principles.md](references/hopkins-principles.md) before your first draft in a session. Use [references/platforms.md](references/platforms.md) for character limits and placement rules. Check lengths with `scripts/check_lengths.py` before handing over.

## 1. Get the facts from the code, not from memory

Prices, allowances and features change. Before writing, read the current values:

| Fact | Source of truth |
|---|---|
| Plans, prices (CAD), free allowance | `src/lib/plans.ts` |
| Product description, URL, company | `src/lib/site.ts` |
| Realtor claims and promises | `src/lib/faq.ts`, `src/app/page.tsx` |
| Mortgage broker claims | `src/lib/faq-brokers.ts`, `src/app/mortgage-brokers/page.tsx` |
| Post types, platforms, languages | `src/app/llms.txt/route.ts` |
| Keystone-fact mines ("pains taken") | `src/lib/generate.ts`, `src/lib/caption.ts` (how captions are written), `src/lib/photos.ts`, `src/lib/photo-quality.ts` (photo picking), `src/lib/mortgage.ts`, `src/lib/mortgage-sheet.ts` (payment math), `src/lib/broker.ts`, `src/lib/feature-sheet.ts` (compliance on sheets) |

Snapshot (2026-10-23; verify before use): free = 3 posts, no credit card (1 as a guest without an account); Starter CAD 14.99/mo (10 posts, 5 regenerations); Pro CAD 24.99/mo (20 posts, 10 regenerations); Top Producer CAD 49.99/mo (50 posts, 25 regenerations); yearly = two months free; Team for brokerages = contact us (don't advertise team features as available until they're built); cancel anytime; first post "in under a minute".

**Never invent** a number, testimonial, customer count, award, integration, rate, founder story or result. If an ad needs a proof point that doesn't exist yet, leave a clearly marked placeholder and say so: `[REAL AGENT QUOTE — needs permission]`, `[FOUNDER NAME / STORY]`, `[MEASURE: median seconds from link to finished post]`.

**Dig for the keystone fact.** Hopkins read volumes to find one line; Ogilvy found the Rolls-Royce clock in an engineering report. Skim the keystone-fact files above for the detail a realtor or broker would find surprising. Write down the 3 most startling facts before drafting.

## 2. Know who is reading

SocialSpark has distinct buyers. Pick one per ad; never blend them.

- **Listing agents (realtors, teams)** — want every listing posted fast and looking professional without opening Canva or writing captions at 10 p.m. Fear: looking generic, sounding like a robot, posting something wrong. Post types they live by: Just Listed, Open House, Price Reduced, Coming Soon, Sold, Featured.
- **Mortgage brokers / agents** — want referrals from realtors and to show buyers a home is within reach. Fear: compliance, getting the math wrong. They care that payments use Canadian rules (semi-annual compounding, CMHC premiums incl. the 30-year surcharge, minimum down payments), that their licence number and an "as of" rate date appear on every sheet, that captions never quote rates, and that they can co-brand with a realtor partner and print letter-size PDFs for open houses.
- **Québec professionals** — write in Québec French (not France French), and say so: bilingual and Québec French output is a real differentiator. Ads served in Québec should be in French.

## 3. The Hopkins rules applied to SocialSpark

1. **One person, in person (the salesman test).** Write each ad as if one agent were across the desk asking a question. Check every line: *would a good salesman say this to them face to face?* If not, cut it. "You", their listing, their brokerage, their Tuesday night. No "real estate professionals everywhere".
2. **Service, not "buy my brand".** Every headline answers *what does this do for me?* Banned openers: "Introducing SocialSpark", "The #1…", "Revolutionary AI…", "We're proud…". The product name can appear; it is never the subject.
3. **Specific beats general.** Actual figures are believed; platitudes "roll off like water from a duck" (the 3%-profit clothier, the 78-second shave). "Paste a listing link. Get a branded carousel and caption in under a minute." beats "Save time on social media." Use real specifics: the six post types, the three platforms, EN / Québec FR / bilingual, licence number on every sheet, four down payments per sheet.
4. **Tell the pains taken** (the Schlitz rule). Facts that look ordinary to us are startling to the buyer. Mine them:
   - It looks at the listing photos and picks the property's own images.
   - It learns your voice from a few of your past posts.
   - Nothing posts without your click — ever.
   - Payment math follows Canadian rules; the AI never writes the numbers.
   - Account and listing data are stored in Canada.
   - Mortgage sheets carry licence number, rate "as of" date and an estimates disclaimer automatically.
5. **The product is its own best salesman — sample it.** The strongest offer is the demonstration: *paste one listing link and see your post free*. Show real output (a finished carousel or feature sheet) in the creative whenever possible. The sample requires a small effort (paste a link), which is good — free things handed out unasked lose respect.
6. **Ask no one to buy; coax, don't drive.** The best ads offer something. CTAs give ("See your listing as a post", "Build your first feature sheet free"), they don't demand ("Subscribe today"). The free posts are the brush salesman's gift that starts reciprocity.
7. **Take the risk off them.** "Ask a person to take a chance on you and you have a fight. Offer to take a chance on him and the way is easy." Use: free posts, no credit card, cancel anytime, edit everything, nothing goes out without approval.
8. **Rewards, not prevention.** People cure troubles but rarely prevent them, and they want to hear about rewards. Lead with the gain: a polished feed, every listing posted, more realtor referrals, looking like the sharpest agent in the office. A *present* pain is fair to cure ("Still writing captions at 10 p.m.?"); a *future* disaster is weak ("Avoid compliance fines"). Frame broker compliance as ready-to-share, not risk-avoided. Creative shows beautiful finished work, never stressed agents or empty feeds.
9. **People, not corporations.** "Personalities appeal, while soulless corporations do not." Two moves: a real founder speaking (only with a real name and story from the user), and selling the *agent's* personal brand: their name, headshot, colours, voice on every post.
10. **Truth, told fascinatingly.** Plain, confident, slightly rugged. No hype words (game-changing, supercharge, effortless, unlock, elevate, seamless). Candour about a limit makes the rest believable. If it sounds like an ad, rewrite it like a colleague's tip.
11. **Forget yourself; don't boast.** No company age, team size, "AI-powered" as a headline benefit, or self-praise. One selfish phrase can kill an ad: no "accept no substitutes", "don't settle for…", "the only…", jabs at Canva or competitors.
12. **The headline does most of the work.** Changing only the headline can multiply returns 5–10×. It must (a) pick out the reader ("Hey there, Bill Jones": "Realtors:", "Mortgage agents in Ontario:") and (b) carry the main appeal, in the "1,000 songs in your pocket" shape: concrete, a little surprising, true. Never mislead. Write many, keep few.
13. **The more you tell, the more you sell.** Once the headline wins attention, the reader is a half-sold prospect. Long copy that answers their real questions beats short copy that doesn't. Always give a long variant to test, and use every Google asset slot.
14. **Use fixed psychology.** Curiosity (an open loop the body honestly pays off); offers framed for a group ("Built for Canadian realtors", "Pour les courtiers du Québec"); honest price framing; the same offer framed several ways.
15. **Your taste is not the test.** Never pick a winner by preference. Produce genuinely different *appeals* (not word swaps) and say how to measure them.
16. **Once it works, keep it.** A proven winner is the control; challengers must beat it. Don't retire a winner because we're bored of it ("a moving parade, not a standing army"). If fatigue shows, change the execution (photo, opening line), not the appeal.

## 4. Workflow

1. **Brief.** Confirm (or infer and state) platform(s), audience, language, objective (sign-ups / free post / paid plan), and any offer. Don't stall on missing details — state sensible defaults and proceed. **Destination:** if `src/lib/persona-pages.ts` has a page for this persona, send the ad to `/for/<slug>` (check `PERSONA_PAGES`) and match its hero headline's promise; if the user wants a page that doesn't exist yet, that's the `socialspark-landing-pages` skill.
2. **Research.** Read the source files in §1, including the keystone-fact files. List the 5–10 specific facts you will draw on, with the 3 most startling marked. If the user has existing ads with results, find the current winner. It is the control, and new work is a challenger to it.
3. **Angles.** Write 3–5 distinct appeals, each one line, e.g.:
   - Demonstration: "One link → finished post"
   - Time: "Post every listing without the 10 p.m. Canva session"
   - Voice: "Captions that sound like you, not a robot"
   - Control/safety: "Nothing posts until you click"
   - Pains taken (brokers): "Canadian math, your licence number, on every sheet"
   - Personal brand: "Every post carries your name, your headshot, your voice"
   - Québec: "En français québécois, ou bilingue"
4. **Headlines first.** For each angle, brainstorm 15–25 headlines in your working notes, then pick the best 2–3 and give a one-line reason each. Spend more effort here than on body copy.
5. **Draft** the rest per platform using the formats in `references/platforms.md`. Meta gets short, medium and long primary-text variants per angle.
6. **Check.** Run the length checker; run the checklist in §6; fix, then deliver.

## 5. Output format

For each platform, give paste-ready copy grouped by angle:

```
## Facebook / Instagram — Angle: Demonstration (realtors, EN)
Primary text: …
Headline: …
Description: …
CTA button: Sign Up
Creative note: show a real Just Listed carousel next to the listing link it came from.
```

```
## Google Search — Ad group: listing post generator
Headlines (15): 1. … (28)
Descriptions (4): 1. … (87)
Pin: H1 = …  (only if needed)
Paths: /listing-posts /free
Sitelinks / callouts / snippets: …
Keywords (suggested): …   Negatives: …
```

Show the character count after each Google asset. End with a short **test plan**:
- Test headlines first, since they move results most. Then test appeals, then long vs. short copy.
- Name the control (an existing winner, if any) and the challengers.
- Give the one metric that decides it (cost per sign-up, or cost per first generated post) and the minimum spend or conversions before calling it.
- Give a keep-or-refresh rule: winners stay until beaten; refresh only the execution when frequency rises and CTR drops.

## 6. Pre-delivery checklist

- [ ] Every claim traceable to the code or FAQ; no invented numbers, quotes or results
- [ ] Each headline picks out the reader and carries the main benefit, not the brand; chosen from many candidates
- [ ] At least one concrete specific per ad (number, post type, platform, language, rule); no unmeasured numbers
- [ ] Leads with a reward or a present pain cured, not future disaster prevention; creative shows finished, attractive work
- [ ] CTA offers something (see / build / try free) rather than demanding a purchase
- [ ] Offer includes risk reversal where relevant (free, no card, cancel anytime, nothing posts without approval)
- [ ] One audience per ad; brokers never told we set or suggest rates; no rates or payments quoted in broker ad copy
- [ ] Every line passes the salesman test; no hype words, no boasts, no selfish phrases, no competitor jabs, no "Introducing…"
- [ ] A long-copy variant exists for Meta; every Google asset slot is used
- [ ] Within character limits (checker run); Google RSA headlines each make sense alone and in any combination
- [ ] French copy is Québec French and reads natively, not translated word for word
- [ ] Angles are genuinely different, with a test plan
