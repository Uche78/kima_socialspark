# SocialSpark: 20 buyer personas

Written 2026-10-22. Plan fit re-assessed 2026-10-23. Rebuilt on desk research 2026-10-23: market sizes, regulation, market conditions and agent behaviour from public sources (numbered in [Sources](#sources)).

**What's evidence and what's hypothesis.** Market facts carry a source number like [4]. Personas, names, motives and scenarios are still **hypotheses**: no SocialSpark customer has been interviewed and no usage data has been analysed. Several behaviour figures are US (NAR) data because no Canadian equivalent was found; they're marked "US". Validate with §4 of SKILL.md before treating any persona as proven.

## Plans (from `src/lib/plans.ts`, CAD)

| Plan | Monthly | Yearly (= 10 months) | Posts / regens a month |
|---|---|---|---|
| Free | — | — | 3 total (1 as a guest) |
| Starter | $14.99 | $149.90 | 10 / 5 |
| Pro | $24.99 | $249.90 | 20 / 10 |
| Top Producer | $49.99 | $499.90 | 50 / 25 |
| Team | Contact sales (`src/lib/team.ts`) | — | Promises seats, one invoice, shared brand kit: **not built yet** |

One post = one platform's single image or carousel. A listing posted to two platforms across its life is often 6–10 posts, so Starter ≈ 1 listing a month, Pro ≈ 2–3, Top Producer ≈ 5–8. Broker sheets, PDFs and Stories are free; only captions use a post.

## The market in brief

- **Realtors: about 155,000–160,000** CREA members [1], over half in Ontario. **Québec: about 16,000** OACIQ brokers [5].
- **Most agents do few deals.** In the GTA, roughly a third of agents closed none in a year and many more closed one or two [2]. Ontario works out to about 3 transactions per member [2]. Membership is shrinking in Ontario: TRREB's renewal drop in early 2024 was the steepest since 1991 [16]. *So the paying base is the active minority, and volume, not headcount, decides the plan.*
- **The market is balanced and slower.** As of September 2026: 4.9 months of inventory, sales-to-new-listings ratio 48.8%, prices down about 3% year over year [11]. In cottage country, 61% of agents report longer days on market [17]. *Listings live longer and need more posts each (Price Reduced, Open House again, Featured), which pushes agents up the plans.*
- **Toronto condos are at a historic low.** Q1 2026 GTHA new-condo sales hit a 35-year low, with a record 4,295 completed unsold units (≈92 months of supply). Resale is 38% cheaper per square foot than new [7]. Ontario's full HST rebate for first-time buyers of new homes (to March 2027) adds a new message to market [21].
- **Luxury is slow.** GTA $3M+ sales are down about 17% (Jan–Apr 2026), and West Vancouver $4M+ is down 25% with about 2.3 years of supply [20].
- **Agents already use social and AI.** US data: 87% use Facebook, 62% Instagram, 48% LinkedIn [4]; 56% use AI to create social posts, and accuracy is the top AI concern (63%) [18]. Most spend only 1–4 hours a week on social [13]. *AI isn't the selling point; accuracy, their own voice and approval are.*
- **Outsourcing is the real price comparison.** A Canadian brokerage's social content plan costs $400/month for about 40 posts, and full-time VAs with social duties are listed at about $800/month [9].
- **Mortgage brokers are growing, and realtors feed them.** Ontario (June 2025): 3,059 brokers, 5,235 Level 2 and 9,923 Level 1 agents in 1,162 brokerages [3]. Brokers handled 38% of mortgages in 2025 and 48% for recent first-time buyers [6]. Realtor referrals were 34.9% of brokers' business in 2026, a three-year high [6].
- **Regulators require name and licence on ads.** FSRA requires the brokerage name and licence number in advertising [8]. RECO counts social posts as advertising that must name the brokerage [10]. BCFSA and the AMF publish social media rules for mortgage licensees [19].
- **Policy creates first-time-buyer content.** Since 15 Dec 2024, all first-time buyers can get 30-year insured amortization, and the insured price cap is $1.5M [12].
- **Photos belong to the photographer** by default under Canadian copyright law. Reusing them needs a written licence [15]. This comes up for every persona who reposts old or inherited listings.

## Fit at a glance

| # | Persona | Segment | Plan | Billing | Tier |
|---|---|---|---|---|---|
| 1 | Tuesday-Night Canva Agent | Realtor, solo | Pro | Monthly → yearly | 1 |
| 2 | The Hungry Rookie | Realtor, new | Starter | Monthly | 2 |
| 3 | The Top Producer | Realtor, high volume | Top Producer | Yearly | 1 |
| 4 | The Team Lead | Realtor team | Team | Annual invoice | 2 (fulfilment gap) |
| 5 | The Marketing Coordinator | Team staff (boss pays) | Top Producer | Monthly | 2 |
| 6 | Le courtier immobilier québécois | Realtor, Québec | Pro | Monthly → yearly | 1 |
| 7 | The Bilingual Border Agent | Realtor, bilingual market | Top Producer | Yearly | 1 |
| 8 | The Part-Timer | Realtor, side business | Starter | Monthly, on and off | 3 |
| 9 | The Luxury Specialist | Realtor, high-end | Pro | Yearly | 2 |
| 10 | The Condo & Pre-Sale Specialist | Realtor, urban condos | Top Producer | Monthly → yearly | 1 |
| 11 | The Small-Town & Cottage Agent | Realtor, rural/recreational | Starter | Yearly | 2 |
| 12 | The Reluctant Veteran | Realtor, 20+ years | Starter | Yearly | 2 |
| 13 | The Agent Who Fired Their VA | Realtor, cost-cutting | Top Producer | Yearly | 1 |
| 14 | The Independent Brokerage Owner | Realtor brokerage | Team | Annual invoice | 2 (fulfilment gap) |
| 15 | The Expired-Listing Specialist *(new)* | Realtor, relists | Pro | Monthly | 1 |
| 16 | The Referral-Hungry Mortgage Agent | Mortgage, early career | Pro | Monthly | 1 |
| 17 | The Realtor-Network Broker | Mortgage, established | Top Producer | Yearly | 1 |
| 18 | Le courtier hypothécaire québécois | Mortgage, Québec | Pro | Yearly | 1 |
| 19 | The First-Time-Buyer Broker | Mortgage, FTHB niche | Pro | Monthly → yearly | 1 |
| 20 | The Mortgage Brokerage Principal *(new)* | Mortgage brokerage | Team | Annual invoice | 2 (fulfilment gap) |

Tier 1 = strong pain, clear pay trigger, product fits today. Tier 2 = good fit with a caveat. Tier 3 = possible but low volume. Personas 15 and 20 replace the Relocation & Newcomer Agent and the Bank Mobile Mortgage Specialist (see [Watch list](#watch-list-not-targets-today)).

## Personas by plan

| Plan | Personas | Common thread |
|---|---|---|
| **Free** | Everyone's entry point | The 3 posts are the demo. Paying starts the day a listing goes live. |
| **Starter** $14.99 · 10 posts | 2 Rookie, 8 Part-Timer, 11 Small-Town & Cottage, 12 Veteran | About 1 listing a month; price-sensitive or low-tech. 11 and 12 suit yearly; 2 and 8 never do. |
| **Pro** $24.99 · 20 posts | 1 Tuesday-Night, 6 Québec realtor, 9 Luxury, 15 Expired-Listing, 16 Referral-Hungry broker, 18 Québec broker, 19 First-Time-Buyer broker | 2–3 listings a month, or a few broker sheets a week. The core plan. |
| **Top Producer** $49.99 · 50 posts | 3 Top Producer, 5 Coordinator, 7 Bilingual, 10 Condo, 13 Fired-the-VA, 17 Network broker | 5–8 listings a month, two languages, or a large realtor network. Volume and speed matter, not price. |
| **Team** (sales) | 4 Team Lead, 14 Brokerage Owner, 20 Mortgage Brokerage Principal | Seats, one invoice, consistent compliant branding. Promised on the pricing page, not built. |

`PERSONA_PLAN` in `src/lib/persona-pages.ts` mirrors this table. Change both together.

---

## Realtors

### 1. Tuesday-Night Canva Agent — solo listing agent, suburban Ontario or BC

**Plan: Pro** · billed monthly, yearly once the habit sticks · fallback: Starter for a quiet month.

**Who they are.** "Priya", 6–12 years licensed, 12–25 listings a year, at a franchise or mid-size independent. Works alone or with a part-time admin. Has a professional headshot and logo, an Instagram with a few hundred to a few thousand followers, and a Facebook page.

**Problems and scenarios.**
- A listing goes live Thursday. Between showings and offers, the Just Listed post gets built in Canva at 10 p.m., then rebuilt for the open house, again for the price change and again for Sold. Usually the Sold post never happens.
- Listings now sit longer [11], so one listing means more posts than it did two years ago.
- At a listing presentation the seller asks, "How will you market my home online?" Their honest answer is "I'll post it when I can."
- They've tried ChatGPT for captions but don't trust it with facts. Accuracy is agents' top AI worry [18].

**How SocialSpark helps.** Paste the brokerage listing link and get a branded carousel and caption for Instagram, Facebook or LinkedIn in under a minute. The caption follows their tone and past posts (Brand & voice). It covers six post types across the listing's life (Coming Soon → Sold), and scheduling sets up the Open House post on day one. Details come from the listing and are editable, and nothing posts without their click.

**Why they'd pay.** The 3 free posts run out on the first listing. 1–2 listings a month × 4–5 stages × 2 platforms is 10–20 posts, which is Pro. For an agent working from about one transaction's commission a month, $24.99 is trivial. The benefit they can sell is "every listing gets professional social posts at every stage," said in the listing presentation.

**Objections.** "AI captions sound fake" → voice samples, and every word is editable. "Will it get details wrong?" → it uses the listing's own details, and you approve before anything posts. "REALTOR.ca links fail" → paste the page, or use the brokerage link.

**Reach them.** Facebook and Instagram ads, realtor Facebook groups, brokerage training nights, "just listed post template" searches.

**Message that lands.** "Paste your listing link. Your Just Listed post is ready before your coffee is."

---

### 2. The Hungry Rookie — first- or second-year agent, any major market

**Plan: Starter** · billed monthly · fallback: Free until the first listing.

**Who they are.** "Jordan", 24–35, licensed under two years, often a career-changer. Few or no listings of their own, so they host colleagues' open houses and post Featured Properties (with permission). Very online, money tight, desk fees first.

**Problems and scenarios.**
- They're competing in a field where about a third of agents close nothing in a year [2]. The ones who survive look established before they are.
- Their first listing comes from a family friend. They want it to look like a top producer's, but have only free Canva templates and phone photos.
- In the US, about half of agents who closed their first deal in 2022 closed none in 2023 [16]. Rookies are anxious about every dollar.

**How SocialSpark helps.** A professional, branded post for the cost of pasting a link. Open House and Featured Property types fit their reality. The free posts let them see the result before paying.

**Why they'd pay.** The day they get a listing. 10 posts covers one listing across two platforms, so Starter, monthly.

**Objections.** "Another subscription?" → subscribe the month you have a listing, cancel in two clicks. "I don't have listings" → host open houses and Featured posts for colleagues, with the listing agent's OK and photo permission [15].

**Reach them.** Instagram and TikTok, licensing-course and new-agent groups, brokerage onboarding.

**Message that lands.** "Your first listing deserves to look like your fiftieth."

---

### 3. The Top Producer — high-volume listing agent, GTA, Greater Vancouver, Calgary

**Plan: Top Producer** · billed yearly · fallback: Team once they add agents.

**Who they are.** "Marc", 40–55, 50+ listings a year, a buyer's agent or two and an assistant. They are the small minority who carry the mean transaction count [2]. Their name is the brand.

**Problems and scenarios.**
- Four listings hit MLS in one week. The assistant is buried in paperwork, so Just Listed posts show up three days late and one Open House post never goes out. A seller notices.
- Longer days on market [11] mean each listing needs a second wave of posts (Price Reduced, Featured, a second open house), which multiplies the assistant's work.
- Recruiting season: their feed is the team's résumé, and gaps look like decline.

**How SocialSpark helps.** It makes the assistant much faster: link in, branded post out, scheduled across platforms, with the same templates every time so the brand stays consistent. LinkedIn posts reach their professional referral network.

**Why they'd pay.** 4+ listings a month × 4–5 stages × 2 platforms is 30–40+ posts, which is the Top Producer plan, named for them. Price doesn't matter to them. Yearly ($499.90) is one less invoice to approve.

**Objections.** "My assistant does this" → it gives your assistant the hours back. "Is 50 enough?" → about 5–8 listings a month at every stage; past that, Team.

**Reach them.** Through their assistant, LinkedIn, top-producer events, coaching programs.

**Message that lands.** "Every listing posted the day it goes live, at every stage, without adding staff."

---

### 4. The Team Lead — leads a 4–10 agent team

**Plan: Team** · annual invoice (sales-led) · fallback: one Top Producer account run by a coordinator until Team features exist.

**Who they are.** "Sandra", runs a team under a franchise brokerage, owns the team brand and marketing budget. No Canadian figure exists for the share of agents on teams; in the US it was about a quarter [22].

**Problems and scenarios.**
- Each agent posts differently. One leaves the brokerage name off a post, which RECO treats as an advertising problem [10].
- A new agent joins and needs to look "on brand" by week one.
- The team's marketing person is the bottleneck for every listing post.

**How SocialSpark helps.** The same templates and branding for every listing, so any agent can produce a consistent post. Posts carry the agent's name and brokerage.

**Why they'd pay.** From the team marketing budget, as one line item. The Team banner ("seats for every agent, one invoice and a shared brand kit") is aimed at them.

**Product gap.** Seats, a shared brand kit and central billing are promised, not built. Decide a per-agent price and how the first deal is fulfilled before taking calls.

**Reach them.** LinkedIn, team-lead coaching programs, brokerage leadership events.

**Message that lands.** "Every agent on your team, one look, without a designer."

---

### 5. The Marketing Coordinator — staff at a team or top producer's office

**Plan: Top Producer** · billed monthly on the boss's card · fallback: Team if they work for a team.

**Who they are.** "Alex", 25–35, salaried or contract. Does social, listing launches, print and some admin. Uses the product daily but doesn't hold the card.

**Problems and scenarios.**
- Three listings go live in one week, and each needs the same five posts rebuilt from scratch.
- The boss asks "is the Sold post up?" weekly.
- Their real ambition (video, market updates, client stories) never gets time.

**How SocialSpark helps.** Fast, editable first drafts of every listing post, scheduling, and downloads for their existing scheduler. Their judgement still shapes the final post.

**Why they'd pay.** They don't. They champion it to persona 3 or 4. Give them a one-line case for the boss: "50 listing posts a month for $49.99, against a social content package that costs $400 [9]."

**Objections.** "Will it replace me?" → it takes the repetitive part, not the job.

**Reach them.** Real-estate marketing communities, Instagram, LinkedIn job titles.

**Message that lands.** "The listing posts are done. Go make the content only you can."

---

### 6. Le courtier immobilier québécois — Montréal, Québec City, Gatineau, the regions

**Plan: Pro** · billed monthly, yearly once loyal · fallback: Starter for 1 listing a month.

**Who they are.** "Geneviève", one of about 16,000 OACIQ-licensed brokers [5], 8–20 listings a year, works in French. Most social tools give them France French or stilted translations.

**Problems and scenarios.**
- They try an English-first tool and get "Juste listé" style copy that their clients would mock.
- Bill 96 made French the default language for real estate documents [14]. Their whole working day is in French, and their marketing needs to match. (We found no OACIQ rule that specifically covers social posts.)
- Facebook is their main channel, and posts must read like a Québécois neighbour wrote them.

**How SocialSpark helps.** Captions written natively in Québec French, or bilingual. Same branding and speed as English users. Account data is stored in Canada.

**Why they'd pay.** Few tools do Québec French well, so once it works, switching costs are high. 2 listings a month at every stage is Pro.

**Objections.** "Is the French really Québécois?" → show a real sample in the ad. "Centris links?" → test this; if Centris blocks tools, the copy-paste path applies.

**Reach them.** French-language Meta ads served in Québec, Québec agent Facebook groups, real estate board events.

**Message that lands.** "Vos publications Inscrit, Visite libre et Vendu, en français d'ici, en une minute."

---

### 7. The Bilingual Border Agent — Ottawa–Gatineau, Montréal West Island, Moncton

**Plan: Top Producer** · billed yearly · fallback: Pro if one bilingual caption per post is enough.

**Who they are.** "Daniel", fully bilingual, often selling across the Ottawa River or in officially bilingual New Brunswick. In Gatineau, about 64% of residents are bilingual [23].

**Problems and scenarios.**
- Ottawa buyers cross into Gatineau for lower prices, while Gatineau sellers want to reach them [23]. Every listing needs both languages.
- Writing every caption twice doubles their posting work.
- A francophone seller asks why their listing was posted only in English.

**How SocialSpark helps.** Bilingual captions in one post, or separate English and Québec French posts from the same listing link. This is SocialSpark's clearest differentiator.

**Why they'd pay.** Separate EN and FR posts double the count: 2–3 listings × 5 stages × 2 platforms × 2 languages goes well past 20, so Top Producer. Pro if one bilingual caption per post is enough.

**Objections.** "Is the French good enough?" → sample it.

**Reach them.** Bilingual geo-targeted ads in border regions, Ottawa and Outaouais boards, LinkedIn.

**Message that lands.** "One listing link. English, French, or both, in the same minute."

---

### 8. The Part-Timer — agent with a day job or semi-active licence

**Plan: Starter** · billed monthly only, on and off · fallback: Free between listings.

**Who they are.** "Chris", a teacher, nurse or retiree who keeps a licence for 1–4 deals a year from friends and family. This is a large group: many agents close only one or two deals a year [2].

**Problems and scenarios.**
- A friend lists with them. They want to do it justice but won't learn design tools for one listing.
- Every monthly fee feels heavy against an income that comes in bursts.

**How SocialSpark helps.** Free posts, no card, no learning curve: link in, post out.

**Why they'd pay.** Only during a listing: Starter for a month or two, then cancel. Never yearly.

**Objections.** "I only need it twice a year" → subscribe that month, cancel in two clicks.

**Reach them.** Facebook, word of mouth from agent friends.

**Message that lands.** "Got a listing this month? Make it look like you do this every day."

---

### 9. The Luxury Specialist — $2M+ homes, Toronto, Vancouver, Muskoka, Montréal

**Plan: Pro** · billed yearly · fallback: none; volume is low, care is high.

**Who they are.** "Victoria", sells high-end homes with professional photographers and stagers, and guards their image. Referrers are executives and professionals, so LinkedIn matters.

**Problems and scenarios.**
- GTA $3M+ sales are down about 17% and West Vancouver $4M+ down 25%, with about 2.3 years of supply [20]. Luxury listings now sit for months, and sellers expect the marketing to keep going.
- A designer's turnaround delays the launch post by a week.
- Template tools look cheap next to their photography.

**How SocialSpark helps.** The Minimal template lets the photography lead. Good photo picking, text on photos optional, LinkedIn posting, everything editable. Featured and Price Reduced posts keep a slow listing visible without a designer.

**Why they'd pay.** Price is trivial; the output has to be beautiful. Few listings but long ones, so Pro, likely yearly.

**Objections.** "Templates look templated" → show luxury examples in the creative. They may keep a designer for the launch and use SocialSpark for everything after.

**Reach them.** LinkedIn, Instagram, luxury brokerage divisions.

**Message that lands.** "Let your photographer's work speak. The post is ready when the photos are."

---

### 10. The Condo & Pre-Sale Specialist — downtown Toronto, Vancouver, Calgary, Montréal

**Plan: Top Producer** · billed monthly, then yearly · fallback: Pro in a slow month.

**Who they are.** "Kevin", sells resale condos and assignments, often to investors and first-time buyers. Many units, lower prices, high posting volume.

**Problems and scenarios.**
- GTHA new-condo sales hit a 35-year low in Q1 2026, with a record 4,295 completed unsold units [7]. Their investor clients are trying to sell assignments into a glut, so every unit needs repeated pushes and frequent Price Reduced posts.
- Resale condos are 38% cheaper per square foot than new [7], and they need to tell buyers that, unit by unit.
- New messages appear constantly. Ontario's full HST rebate for first-time buyers of new homes (to March 2027) [21] and 30-year amortization for new builds [12] change what a unit "really costs."
- Five units in one building look identical, and posts need to tell them apart (floor, view, parking, locker, fees).

**How SocialSpark helps.** It imports each unit's details, condo fee and photos, and writes captions around each unit's own features. Price Reduced and Coming Soon types are built in. It pairs with persona 19 for "what it costs a month" feature sheets.

**Why they'd pay.** 4–6 active units × several Price Reduced and Open House rounds × 2 platforms is well past 20, so Top Producer.

**Objections.** "My listings all look the same" → captions use each unit's own details and photos.

**Reach them.** Instagram, investor communities, "condo realtor" searches. They already have a landing page (`/for/social-media-posts-for-condo-realtors`).

**Message that lands.** "Five condos this week? Five posts before lunch."

---

### 11. The Small-Town & Cottage Agent — rural Ontario, Prairies, Atlantic, BC Interior

**Plan: Starter** · billed yearly · fallback: Pro in spring market.

**Who they are.** "Doug", sells acreages, cottages and small-town homes. Facebook Pages and community groups are their channel.

**Problems and scenarios.**
- Cottage prices are forecast to rise about 4% in 2026 on tight supply, but 61% of agents say days on market are up [17]. Each listing has a long life and needs re-promotion.
- City buyers want to see the waterfront property before the spring rush, so posts need to reach Toronto or Calgary, not just the local group.
- They post phone photos with a one-line caption because there's no time for more.

**How SocialSpark helps.** Facebook posts and 20-photo albums suit property-heavy listings. Virtual tour links are picked up. Featured Property re-promotes a slow listing without new effort.

**Why they'd pay.** Fewer listings, longer lives. Starter covers most months, and steady year-round business suits yearly ($149.90).

**Objections.** "I'm not a tech person" → paste a link, click post.

**Reach them.** Rural geo-targeted Facebook ads, regional boards.

**Message that lands.** "That cottage deserves more than a phone photo on Facebook."

---

### 12. The Reluctant Veteran — 20+ years in, referral-based

**Plan: Starter** · billed yearly · fallback: none.

**Who they are.** "Linda", 55–68, built a business on referrals. Social media feels foreign. Ontario's membership shrinkage is partly long-time agents leaving [16], and the ones who stay must keep up.

**Problems and scenarios.**
- They lose a listing presentation to a younger agent "because of marketing."
- A grandchild points out their Instagram hasn't been updated in a year.
- They fear posting something wrong, or AI posting for them.

**How SocialSpark helps.** Almost no skill needed, captions in their own voice, and nothing posts without their click.

**Why they'd pay.** To stop losing presentations on marketing. Starter, yearly: one decision, then never think about it again. Low churn if it just works.

**Objections.** "I don't trust AI" → you approve every word. "I'll never set it up" → one link, one click.

**Reach them.** Facebook, office managers, their assistants or family, email.

**Message that lands.** "Your listings, posted properly, without learning Instagram."

---

### 13. The Agent Who Fired Their VA — cost-conscious mid-career agent

**Plan: Top Producer** · billed yearly · fallback: Pro if volume is moderate.

**Who they are.** "Ravi", has paid a VA or freelance social manager for listing posts. With prices down about 3% and sales slower [11], the retainer hurts.

**Problems and scenarios.**
- They're paying a few hundred dollars a month for a content package, about $400 for 40 posts [9], or up to about $800 for a VA [9].
- The contractor's turnaround slips during a busy week, and the feed goes quiet after they cancel.

**How SocialSpark helps.** The same deliverable (branded listing posts plus captions) in minutes, with scheduling, for a fraction of the cost.

**Why they'd pay.** They compare it with the person they paid, not with Canva: $49.99 for 50 posts against roughly $400 for 40. Pro if their volume is moderate.

**Objections.** "My VA also did stories and replies" → SocialSpark does listing posts, not community management. Say so.

**Reach them.** Cost-saving Meta ads, "real estate social media manager" searches.

**Message that lands.** "The listing posts you used to outsource, done in a minute, for a fraction of the retainer."

---

### 14. The Independent Brokerage Owner — managing broker, 10–60 agents

**Plan: Team** · annual invoice (sales-led) · fallback: none until seats exist.

**Who they are.** "Faisal", owns a local independent and competes with franchises and cloud brokerages for agents.

**Problems and scenarios.**
- They lose an agent to a brokerage that offers a bigger tech stack.
- They're responsible for agents' advertising: RECO requires every social post to name the brokerage [10], and BCFSA has similar rules [10]. Agents freelance their own posts and get it wrong.
- Agent numbers are falling in Ontario [16], so keeping productive agents matters more.

**How SocialSpark helps.** Posts always carry the brokerage name. Consistent templates. A tool to mention when recruiting.

**Why they'd pay.** As a brokerage perk, through the Team enquiry (sizes up to 51+). Highest potential value of any realtor persona.

**Product gap.** Seats, an admin view and a shared brand kit are promised, not built, and there's no published per-agent price.

**Reach them.** LinkedIn, direct outreach, provincial association events.

**Message that lands.** "A listing-post tool you can offer every agent you recruit."

---

### 15. The Expired-Listing Specialist — wins listings that expired with another agent *(new)*

**Plan: Pro** · billed monthly · fallback: Top Producer in a busy relisting month.

**Who they are.** "Tanya", 5–15 years in, built a pipeline on calling sellers whose listings expired unsold. In a balanced, slower market (4.9 months of inventory, falling prices [11]) and with longer days on market [17], expired listings are plentiful.

**Problems and scenarios.**
- An expired seller's first complaint is "my last agent didn't market it." Winning the listing means showing a better marketing plan in the first call.
- Once relisted, the home needs a reset: "back on the market" (Coming Soon), Just Listed with a new photo order, an Open House, and often a Price Reduced. That's many posts for one property.
- They can't reuse the previous agent's photos without the photographer's licence [15], so they shoot new ones.

**How SocialSpark helps.**
- **In the listing presentation:** paste the expired listing link and show the seller a branded draft post right then. A free post makes the pitch.
- **Once relisted:** every stage's post from one link.

**Why they'd pay.** 2–3 relistings a month at every stage, so Pro. The demo in the presentation is the pay trigger, because it wins listings.

**Objections.** "Can I use the old photos?" → only with the photographer's permission; use new photos or upload your own.

**Reach them.** Expired-listing coaching communities and scripts, Facebook groups, prospecting-tool audiences.

**Message that lands.** "Show the seller their home on Instagram before you hang up."

---

## Mortgage brokers

### 16. The Referral-Hungry Mortgage Agent — Ontario Level 2, BC submortgage broker, 1–4 years in

**Plan: Pro** · billed monthly · fallback: Starter for the first months.

**Who they are.** "Tyler", one of about 15,000 licensed mortgage agents in Ontario alone (9,923 Level 1, 5,235 Level 2 [3]). Commission-only, and their pipeline depends on realtor referrals, which were 34.9% of brokers' business in 2026 [6].

**Problems and scenarios.**
- Realtors get pitched by brokers weekly, and "can I buy you a coffee?" no longer works.
- Their own social posts are generic rate graphics, which FSRA's advertising rules make risky without the brokerage name and licence [8].
- A slow month, and no realtor has sent a deal in weeks.

**How SocialSpark helps.** A co-branded mortgage feature sheet for a realtor's listing, offered as a gift. It shows the realtor's photo, contact details and QR code beside the broker's, with monthly payments at four down payments using Canadian rules, printable for the open house. Every sheet carries their brokerage name, licence number, rate "as of" date and a disclaimer. Captions never quote rates.

**Why they'd pay.** Sheets, PDFs and Stories are free; only social captions use posts. Once they're posting sheets for several realtors' listings, that's 10–20 captions a month: Pro. One referral pays for years of it.

**Objections.** "Is this compliant?" → the licence, date and disclaimer are automatic, but you review against your regulator. "Will realtors want it?" → ask first, then send a finished sheet.

**Reach them.** LinkedIn, broker Facebook groups, brokerage training, "mortgage feature sheet" searches.

**Message that lands.** "Stop asking realtors for coffee. Send them a finished feature sheet for their listing."

---

### 17. The Realtor-Network Broker — established broker with 10–30 realtor partners

**Plan: Top Producer** · billed yearly · fallback: Pro with fewer than about 20 active partners.

**Who they are.** "Natalie", 8–15 years in. Already sends feature sheets, built in Excel and Canva by an assistant. Partners expect them. Co-branded open-house flyers with payment scenarios are standard practice in the US loan-officer market [24], and Canadian tools for them are scarce.

**Problems and scenarios.**
- Every partner listing needs a sheet: payment math in a spreadsheet, design in Canva, PDF export, email. Some partners get one, some don't.
- Rates move, and last month's sheets are stale.
- A partner mentions another broker's sheets look better.

**How SocialSpark helps.**
- **Sheets from a link:** paste the listing link and get a sheet with Canadian math (CMHC premiums including the 30-year surcharge, semi-annual compounding, legal minimum down payments).
- **Partners:** co-branding with saved partners, and bulk open-house PDFs, one page per home.
- **Listings come to them:** realtors who use SocialSpark can send listings directly with "Send to broker."

**Why they'd pay.** Captions for 20+ partner listings a month is more than 20 posts: Top Producer. It protects relationships worth far more than the fee. Yearly.

**Objections.** "My spreadsheet is custom" → you enter your own rates; the AI never writes the numbers. Note that the Top Producer card says "for high-volume listing agents," so broker pages should say it fits them too.

**Reach them.** LinkedIn, broker network conferences, their own realtor partners who already use SocialSpark.

**Message that lands.** "Every partner listing gets a feature sheet the day it goes live."

---

### 18. Le courtier hypothécaire québécois — AMF-regulated, Montréal, Québec City, Laval

**Plan: Pro** · billed yearly · fallback: Top Producer with a large partner network.

**Who they are.** "Mathieu", regulated by the AMF since mortgage brokerage moved there in May 2020 [19]. Works in French with mostly francophone realtor partners.

**Problems and scenarios.**
- Feature sheet tools are English and Ontario-centric, so they build French sheets by hand.
- The AMF's social media guidance requires information that is true, verifiable and objective [19], so a sloppy sheet is a professional risk.
- A partner needs a sheet for Saturday's visite libre.

**How SocialSpark helps.** Titles and fine print follow the province. Sheets and captions in Québec French or bilingual, Canadian payment math, co-branding with francophone realtors (persona 6).

**Why they'd pay.** Few alternatives, and partners come to rely on the sheets. Pro, yearly.

**Objections.** "Is the fine print right for Québec?" → it follows the province, but you review against AMF rules.

**Reach them.** French-language Québec ads, Québec broker networks, LinkedIn.

**Message that lands.** "Vos fiches hypothécaires en français d'ici, co-signées avec vos courtiers immobiliers."

---

### 19. The First-Time-Buyer Broker — specializes in first-time buyers, any province

**Plan: Pro** · billed monthly, then yearly · fallback: Top Producer if posting daily.

**Who they are.** "Aisha", her niche is the 48% of recent first-time buyers who use a broker [6]. Their marketing is education.

**Problems and scenarios.**
- Buyers don't know that since Dec 2024 every first-time buyer can get a 30-year insured mortgage, or that the insured cap is now $1.5M [12]. They assume they can't afford anything.
- Ontario's HST rebate on new homes for first-time buyers [21] is confusing, and buyers ask what a specific unit would cost.
- They explain the same down-payment and insurance math in DMs over and over.

**How SocialSpark helps.** Feature sheets show the real monthly cost of a real listing at four down payments, including the minimum, insurance premiums (with the 30-year surcharge), property tax and condo fees. Content built on real listings, compliant by design.

**Why they'd pay.** Three sheets a week posted with captions is about 13 posts a month: Pro. Daily posting moves them to Top Producer.

**Objections.** "I can't advertise rates loosely" → your own rates with an "as of" date and disclaimer; captions never quote rates or payments.

**Reach them.** Instagram and TikTok, first-time-buyer webinars, partner condo agents (persona 10).

**Message that lands.** "Show your buyers what that home really costs each month."

---

### 20. The Mortgage Brokerage Principal — owns or runs a mortgage brokerage, 10–50 agents *(new)*

**Plan: Team** · annual invoice (sales-led) · fallback: none until seats exist.

**Who they are.** "Hassan", principal broker at one of Ontario's 1,162 mortgage brokerages [3], or a BC or Québec equivalent. Responsible for supervising agents, including their advertising.

**Problems and scenarios.**
- Agent counts grew about 21% from 2019 to 2025 [3]. Many new agents post whatever they like, and the brokerage answers for ads missing its name or licence number [8].
- They want their whole shop to win realtor referrals [6], but each agent builds sheets differently, or not at all.
- Recruiting: they compete for agents on tools and support.

**How SocialSpark helps.** Every agent's sheets carry the brokerage name, licence number, "as of" date and disclaimer automatically. Canadian payment math is the same for everyone. The Team enquiry form already offers "Mortgage brokers" as an audience.

**Why they'd pay.** As brokerage infrastructure: compliance consistency plus a referral engine for every agent. Team.

**Product gap.** Seats, an admin view, shared branding and central billing aren't built. And they'll ask whether they can review agents' sheets before they go out.

**Reach them.** LinkedIn, Mortgage Professionals Canada events, broker network conferences.

**Message that lands.** "Every agent's feature sheet carries your brokerage name and licence number."

---

## Watch list (not targets today)

- **Relocation & Newcomer Agent** (was 15). Real demand: 48% of newcomers who intend to buy plan to within two years [25]. But these agents' clients often want Punjabi, Mandarin, Tagalog and other languages, which SocialSpark doesn't support. Revisit if more languages ship.
- **Bank Mobile Mortgage Specialist** (was 20). Same referral need as broker persona 16, but bank employees are typically governed by employer social media and marketing policies, and third-party tools usually need approval. Revisit if a lender asks.
- **US agents.** Payment math, titles, regulators and data residency are all Canadian.
- **FSBO sellers.** No brokerage or licence to brand; low lifetime value.
- **Property managers and rentals.** Post types and captions are sale-focused.
- **Builders' marketing departments.** They have agencies; the HST-rebate push [21] could make them worth a look later.

## Patterns across the personas

- **A slower market sells more posts per listing.** With longer days on market [11][17], listings need second and third waves of posts. That's the strongest argument for Pro over Starter and Top Producer over Pro, and a good ad angle: "listings are sitting longer; keep them visible."
- **Accuracy and approval beat "AI."** Agents already use AI (56% for social posts, US [18]) and worry most about accuracy. Lead with "uses the listing's own details, nothing posts without you."
- **The real price comparison is a person, not Canva.** About $400/month for 40 posts from an agency [9] against $49.99 for 50.
- **Compliance is a feature brokers buy.** Name and licence on ads are mandatory [8][10]. Sheets that carry them automatically sell to personas 16–20, and to the realtor brokerage owner (14).
- **The realtor–broker loop is the growth engine.** Realtor referrals are 34.9% of broker business [6]. Every broker sending sheets to realtors is distribution to realtors, and "Send to broker" works the other way.
- **Team is sold but not delivered** (personas 4, 14, 20). Before enquiries arrive, set a per-agent price and decide how to fulfil the first deal.
- **Québec and bilingual personas (6, 7, 18)** have the fewest alternatives and the clearest differentiation.

## Sources

1. CREA, membership (≈160,000; ≈155,000 in an Apr 2026 release): [crea.ca](https://crea.ca/who-we-are/realtor-association-community), [Wikipedia](https://en.wikipedia.org/wiki/Canadian_Real_Estate_Association)
2. Agent transaction counts: [Real Estate Magazine (TRREB 2017)](https://realestatemagazine.ca/many-transactions-average-toronto-realtor-2017/), [getwhatyouwant.ca (2022)](https://www.getwhatyouwant.ca/how-many-homes-has-your-agent-sold-the-2022-edition), [examace.ca](https://examace.ca/how-much-do-real-estate-agents-make-ontario), [rochstgeorges.ca (Ottawa)](https://www.rochstgeorges.ca/blog/the-silent-truth-most-ottawa-realtors-sell-fewer-homes-than-you-think/)
3. FSRA, Mortgage Brokering Sector Supervision Plan 2025–26: [fsrao.ca](https://www.fsrao.ca/industry/mortgage-brokering/regulatory-framework/supervision/mortgage-brokering-sector-supervision-plan-2025-26)
4. NAR technology and social media data (US): [nar.realtor](https://www.nar.realtor/news/real-estate-news/technology/technology-realtors-use-the-most), [HousingWire](https://www.housingwire.com/articles/realtors-still-get-most-of-their-leads-from-facebook/)
5. Québec brokers ≈16,000: [Centris blog (Jan 2024)](https://www.centris.ca/fr/blogue/immobilier/programme-de-formation-continue-votre-courtier-se-forme-chaque-annee), [OACIQ annual report 2025](https://www.oaciq.com/media/2x1b3evl/ra-oaciq-2025.pdf)
6. Broker share and referral sources: [Canadian Mortgage Trends (MPC 2026)](https://www.canadianmortgagetrends.com/2026/07/mortgage-broker-share-rises-to-38-hits-48-among-recent-first-time-buyers-mpc/), [MPC report](https://mortgageproscan.ca/docs/default-source/marcomms/consumer-reports/2026-mpc_the-broker-advantage_en.pdf), [CMP Brokers on Lenders 2026](https://www.mpamag.com/ca/best-in-mortgage/best-mortgage-lenders-in-canada-according-to-brokers-brokers-on-lenders/586484)
7. Toronto condo market Q1 2026 (Urbanation): [CP24](https://www.cp24.com/local/toronto/2026/04/17/toronto-condo-market-hits-35-year-low-as-sales-continue-to-plunge-with-no-new-project-launches/), [MPA](https://www.mpamag.com/ca/mortgage-industry/market-updates/torontos-condo-market-hits-rock-bottom-as-unsold-units-pile-up/572743), [Real Estate Magazine](https://realestatemagazine.ca/no-new-condo-projects-launch-in-q1-as-toronto-market-hits-a-wall/)
8. FSRA mortgage advertising disclosure: [FSRA consultation summary](https://fsrao.ca/mortgage-brokering-consultation-summary-report), [MPA](https://www.mpamag.com/ca/mortgage-industry/industry-trends/fsra-proposes-new-advertising-guidelines-for-mortgage-brokers/521938)
9. Outsourced social costs: [RE/MAX River City digital marketing](https://rivercityrealestate.ca/agentdir=48413/digital.html), [VA case study](https://somewhere.com/post/how-a-real-estate-broker-hired-a-virtual-assistant-social-media-manager-for-800-month)
10. Realtor advertising rules: [RECO Bulletin 5.1](https://www.reco.on.ca/getmedia/fc6d0358-a8a1-4e6b-bfaa-2b8c312e1c3b/RECO-Bulletin-5-1-Advertising-requirements.pdf), [RECO Bulletin 5.3](https://www.reco.on.ca/getmedia/398b2b0c-2c20-4bec-a8d9-d88fc9e03d18/RECO-Bulletin-5-3-Advertising-online.pdf), [BCFSA advertising guidelines](https://www.bcfsa.ca/industry-resources/real-estate-professional-resources/knowledge-base/guidelines/advertising-guidelines)
11. CREA national statistics, Sept 2026: [creastats.crea.ca](https://creastats.crea.ca/), [homiesai.com (Aug 2026)](https://www.homiesai.com/research/canada-housing-stats-august-2026)
12. Mortgage reforms (30-year amortization, $1.5M cap): [Department of Finance](https://www.canada.ca/en/department-finance/news/2024/09/government-announces-boldest-mortgage-reforms-in-decades-to-unlock-homeownership-for-more-canadians.html), [Ratehub](https://ratehub.ca/blog/breaking-news-30-year-amortizations-for-all-first-time-home-buyers-insured-mortgages-up-to-1-5-million)
13. Agent time on social: [RISMedia](https://blog.rismedia.com/?p=11777), [PA Realtors](https://www.parealtors.org/blog/realtors-and-social-media-use/)
14. Bill 96 and real estate: [OACIQ](https://www.oaciq.com/en/oaciq/press-release/press-releases/bill-96-and-amendment-to-the-civil-code-of-quebec-new-obligations-having-an-impact-on-the-practice-o/)
15. Listing photo copyright: [BCREA](https://www.bcrea.bc.ca/legally-speaking/legal-use-of-photographs-in-real-estate-transactions-597/), [CREA Café](https://www.crea.ca/cafe/re-using-listing-photographs-easy-eh/)
16. Agent attrition: [Globe and Mail (TRREB membership)](https://www.theglobeandmail.com/real-estate/article-realtor-numbers-drop-at-canadas-largest-real-estate-board), [Inman (Relitix, US)](https://www.inman.com/2026/05/14/new-agents-say-how-theyre-surviving/)
17. Royal LePage 2026 recreational property report: [CP24](https://www.cp24.com/news/canada/2026/03/26/vacation-home-prices-expected-to-rise-again-this-year-royal-lepage-report/), [Canadian Mortgage Trends](https://www.canadianmortgagetrends.com/2026/03/vacation-home-prices-expected-to-rise-again-this-year-royal-lepage-report/)
18. AI adoption (US): [NAR Digital Age report](https://www.nar.realtor/reports/real-estate-in-a-digital-age), [Inman](https://www.inman.com/2026/01/29/so-pretty-much-everyone-in-real-estate-is-using-ai-now/), [The Close](https://theclose.com/news-agent-ai-social-media/)
19. Mortgage social media rules: [AMF](https://lautorite.qc.ca/en/professionals/representatives/rules-of-conduct-and-rules-governing-the-pursuit-of-activities-as-a-representative/responsible-use-of-social-media-in-mortgage-brokerage), [BCFSA](https://www.bcfsa.ca/industry-resources/mortgage-broker-resources/msa-landing-page/mortgage-broker-knowledge-base/mortgage-services-regulatory-index/guideline-on-social-media-conduct-mortgage-services-licensees), [Blakes (AMF transfer)](https://www.blakes.com/fr-ca/perspectives/transfert-de-l-encadrement-du-courtage-hypothecaire-a-l-autorite-des-marches-financiers/)
20. Luxury market 2026: [Sotheby's West Vancouver release](https://www.bnnbloomberg.ca/press-releases/2026/09/29/20-years-reveal-a-changing-luxury-market-as-west-vancouver-prices-double/), [Storeys](https://storeys.com/211-dunvegan-road-neighbourhood-record/)
21. Ontario HST rebate on new homes: [Global News](https://globalnews.ca/news/11514391/ontario-sales-tax-rebate-new-homes), [Osler](https://www.osler.com/?p=115417), [Mondaq](https://www.mondaq.com/canada/real-estate/1801464/ontario-expanded-hst-relief-for-new-housing-what-buyers-need-to-know-in-2026)
22. Teams (US): [NAR](https://www.nar.realtor/magazine/real-estate-news/commentary/teams-attract-roughly-a-quarter-of-agents)
23. Gatineau bilingualism and Ottawa–Gatineau buyers: [JLR 2018](https://solutions.jlr.ca/hubfs/Etudes_et_rapports/2018-JLR-Real-Estate-Portrait-Gatineau.pdf?hsLang=en), [Ottawa Business Journal](https://obj.ca/widening-price-gap-increases-gatineaus-attractiveness-to-ottawa-residents/)
24. Co-branded open house flyers (US loan officers): [Mortgage Coach](https://support.mortgagecoach.com/hc/en-us/articles/9600220487191-Creating-an-Open-House-Flyer), [ijungo](https://ijungo.com/printpub-co-marketing-with-realtors/)
25. Royal LePage 2026 newcomer survey: [Royal LePage](https://www.royallepage.ca/en/realestate/royal-lepage-2026-canadian-newcomers), [MPA](https://www.mpamag.com/ca/mortgage-industry/industry-trends/most-newcomer-canadians-want-to-own-a-home-but-cant-save-fast-enough/591990)
