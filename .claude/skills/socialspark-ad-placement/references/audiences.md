# Audiences and behaviour

Who SocialSpark's buyers are comes from `socialspark-personas/references/personas.md`. Read it first. This file maps those personas to **platforms, targeting, timing and decision rules**. Like the personas, the behaviour notes are **working hypotheses** from how the trade works, not measured data. Replace them with your own breakdowns as results come in, and record what you learn in §6.

## 1. Persona → platform map

| Persona (tier) | First platform | Why | Second | Landing page |
|---|---|---|---|---|
| 1 Tuesday-Night Canva Agent (T1) | Meta | Lives on FB/IG for their own listings; evening scrolling | TikTok | `/for/…` matching persona, else `/` |
| 3 Top Producer (T1) | Meta | Runs IG as a brand; a busy assistant may be the one clicking | LinkedIn (+ coordinator) | `/for/social-media-for-top-producing-realtors` |
| 5 Marketing Coordinator (T2) | LinkedIn | Job title is targetable; does the work, boss pays | Meta | `/for/listing-posts-for-real-estate-marketing-coordinators` |
| 6 Courtier immobilier québécois (T1) | Meta (FR) | French Meta reach is large and cheap | LinkedIn (FR) | `/for/publications-immobilieres-bilingues` |
| 7 Bilingual Border Agent (T1) | Meta (EN + FR) | Ottawa–Gatineau, West Island, Moncton | — | `/for/bilingual-real-estate-social-media-posts` |
| 2 Hungry Rookie (T2) | TikTok / Meta | Learns marketing from creators; price-sensitive | — | `/for/social-media-posts-for-new-real-estate-agents` |
| 10 Condo & Pre-Sale (T1) | Meta | High listing volume, urban, IG-heavy | TikTok | `/for/social-media-posts-for-condo-realtors` |
| 13 Fired Their VA (T1) | Meta | Cost comparison resonates in-feed | LinkedIn | `/for/real-estate-social-media-manager-alternative` |
| 11 Small-Town & Cottage (T2) | Meta (Facebook > IG) | Facebook dominates rural markets | — | `/for/social-media-for-cottage-and-rural-realtors` |
| 12 Reluctant Veteran (T2) | Meta (Facebook) | Facebook, not TikTok; referral-minded | — | `/for/social-media-for-experienced-realtors` |
| 8 Part-Timer (T3) | Meta | Low volume, cheap test only | — | `/for/listing-posts-for-part-time-realtors` |
| 4 Team Lead, 14 Brokerage Owner, 20 Mortgage Principal (T2) | LinkedIn | Title/seniority targeting; Team enquiries | Meta retargeting | pricing → Team enquiry |
| 16 Referral-Hungry Mortgage Agent, 17 Realtor-Network Broker, 19 FTHB Broker (T1) | Meta + LinkedIn | Brokers are on both; LinkedIn for titles | — | `/mortgage-brokers` |
| 18 Courtier hypothécaire québécois (T1) | Meta (FR) / LinkedIn (FR) | AMF-regulated; French | — | `/mortgage-brokers` (FR when available) |

Check `src/lib/persona-pages.ts` for the current slugs; pages get added. If the persona has no page, say so and suggest one via `socialspark-landing-pages`.

## 2. How agents and brokers behave on each platform (hypotheses)

- **Work pattern:** agents work evenings and weekends; listings go live Thursday–Friday ahead of weekend open houses; posting chores pile up Sunday night and weekday evenings. → Don't daypart early tests; check the hour-of-day breakdown after 2–3 weeks. Expect evening and Sunday-night strength for "post your listing" angles.
- **Seasonality (Canada):** spring market (Mar–Jun) is busiest, with a smaller fall push (Sep–Nov); December and late summer are quiet. Busy agents have pain and no time; quiet months have time to try tools. Test both messages: "post this weekend's listings in minutes" (spring) vs "set up your brand before spring" (Dec–Feb).
- **Meta:** agents scroll as both consumers *and* professionals; their feed is full of other agents' listings, so they recognise a well-made Just Listed post instantly. Showing *finished output* is the strongest hook. They're sceptical of "AI" hype and protective of their personal brand and voice.
- **LinkedIn:** opened during business hours on desktop and mobile; brokerage owners and brokers read longer posts; tone must be professional. Owners care about consistency across agents, brand control and cost per agent; coordinators care about volume and time.
- **TikTok:** newer agents treat it as a classroom; they respond to peers showing their workflow, not brand polish. High share of home-buyers in real-estate interests, so qualify hard in the hook.
- **Québec:** French-first everywhere; English ads read as "not for me" and may breach the Charter. OACIQ (real estate) and AMF (mortgage) context matters to them.
- **Mortgage brokers:** compliance-anxious; they respond to "licence number and 'as of' date on every sheet" and co-branding with realtor partners; never to rates.

## 3. Budget allocation for a first test (CAD 1,500/month default)

| Stage | Split | Purpose |
|---|---|---|
| Weeks 1–4 | 100% Meta, one persona, EN (+ FR ad set if Québec is in scope) | Find a winning angle and a real cost per sign-up |
| Weeks 5–8 | 70% Meta (scale winner), 30% LinkedIn (owners or brokers) | Test a high-value segment |
| Week 9+ | Add TikTok only with 3+ native vertical videos | Test a cheaper top of funnel |

Always keep ~10–20% for retargeting once audiences exceed ~1,000 people.

## 4. Frequency and fatigue guide

| Audience | Healthy 7-day frequency | Refresh when |
|---|---|---|
| Meta prospecting | 1.5–3 | CTR down ~30% from its peak and CPA rising |
| Meta retargeting | ≤ 3/week | Comments turn negative ("I keep seeing this") |
| LinkedIn small B2B audiences | 2–4 | CTR halves; every 4–6 weeks regardless |
| TikTok | n/a: refresh by time | Every 1–3 weeks |

Refresh the **execution** (opening line, first frame, photo, presenter), not the **appeal**, while the appeal still converts.

## 5. Decision rules

1. **One deciding metric** per campaign, set before launch: cost per sign-up, or better, **cost per first generated post** (activation). Paid conversion is the long-term truth; check it monthly by source.
2. **Minimum evidence before calling a test:** each variant ≥ ~30 conversions, *or* spent ≥ 3× target CPA, *or* 2 weeks, whichever comes first. With less, say "inconclusive", not "winner".
3. **Control vs challenger:** the current winner stays live; challengers must beat it on the deciding metric with comparable spend.
4. **Change one thing at a time** when you need to know why (Meta A/B test, separate ad groups on TikTok, separate campaigns on LinkedIn).
5. **Kill:** an ad at 2–3× target CPA with zero conversions. **Scale:** stable CPA for 7 days → +20% budget every 2–3 days.
6. **Lead quality beats lead cost:** compare sign-up → first post → paid by platform before moving budget.
7. **Don't trust platform attribution blindly:** compare platform-reported conversions with sign-ups in Supabase by UTM source. Use the gap to discount platform numbers.

## 6. Learned results log

Record measured findings here (date, platform, persona, what was tested, result, spend). This is how the hypotheses above become facts.

| Date | Platform | Persona | Test | Result | Spend (CAD) |
|---|---|---|---|---|---|
| — | — | — | No campaigns run yet | — | — |
