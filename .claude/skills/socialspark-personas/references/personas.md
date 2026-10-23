# SocialSpark: 20 buyer personas

Written 2026-10-22, plan fit re-assessed 2026-10-23. **Hypotheses, not research:** none of this comes from interviews or usage data yet. Names are illustrative. Plan facts are from `src/lib/plans.ts` at the time of writing (CAD, monthly allowances on both billing intervals):

| Plan | Monthly | Yearly (= 10 months) | Posts / regens a month |
|---|---|---|---|
| Free | — | — | 3 total (1 as a guest) |
| Starter | $14.99 | $149.90 | 10 / 5 |
| Pro | $24.99 | $249.90 | 20 / 10 |
| Top Producer | $49.99 | $499.90 | 50 / 25 |
| Team | Contact sales (`src/lib/team.ts`, `/api/team-enquiry`) | — | Promises seats, one invoice, shared brand kit: **not built in the product yet** |

"Post" = one platform, one single image or carousel. A listing posted to two platforms across its life is often 6–10 posts, so Starter ≈ 1 listing a month, Pro ≈ 2–3, Top Producer ≈ 5–8.

## Fit at a glance

| # | Persona | Segment | Pays? | Likely plan | Billing | Tier |
|---|---|---|---|---|---|---|
| 1 | Tuesday-Night Canva Agent | Realtor, solo | Self | Pro (Starter to start) | Monthly → yearly | 1 |
| 2 | The Hungry Rookie | Realtor, new | Self | Free → Starter | Monthly | 2 |
| 3 | The Top Producer | Realtor, high volume | Self / assistant | Top Producer | Yearly | 1 |
| 4 | The Team Lead | Realtor team | Team budget | Team (sales) | Annual invoice | 2 (fulfilment gap) |
| 5 | The Marketing Coordinator | Team staff | Not the payer | Top Producer or Team | Boss decides | 2 |
| 6 | Le courtier immobilier québécois | Realtor, Québec | Self | Starter → Pro | Monthly → yearly | 1 |
| 7 | The Bilingual Border Agent | Realtor, bilingual market | Self | Pro → Top Producer | Yearly | 1 |
| 8 | The Part-Timer | Realtor, side business | Self, in bursts | Starter, on and off | Monthly only | 3 |
| 9 | The Luxury Specialist | Realtor, high-end | Self | Pro | Yearly | 2 |
| 10 | The Condo & Pre-Sale Specialist | Realtor, urban condos | Self | Top Producer | Monthly → yearly | 1 |
| 11 | The Small-Town & Cottage Agent | Realtor, rural/recreational | Self | Starter | Yearly | 2 |
| 12 | The Reluctant Veteran | Realtor, 20+ years | Self (or adult child sets up) | Starter | Yearly | 2 |
| 13 | The Agent Who Fired Their VA | Realtor, cost-cutting | Self | Pro or Top Producer | Yearly | 2 |
| 14 | The Independent Brokerage Owner | Managing broker | Brokerage | Team (sales) | Annual invoice | 2 (fulfilment gap) |
| 15 | The Relocation & Newcomer Agent | Realtor, community niche | Self | Starter | Monthly | 3 |
| 16 | The Referral-Hungry Mortgage Agent | Mortgage, early career | Self | Starter → Pro | Monthly | 1 |
| 17 | The Realtor-Network Broker | Mortgage, established | Self | Pro → Top Producer | Yearly | 1 |
| 18 | Le courtier hypothécaire québécois | Mortgage, Québec | Self | Pro | Yearly | 1 |
| 19 | The First-Time-Buyer Broker | Mortgage, FTHB niche | Self | Pro | Monthly → yearly | 1 |
| 20 | The Bank Mobile Mortgage Specialist | Mortgage, lender-employed | Self, if allowed | Starter | Monthly | 3 (compliance) |

Tier 1 = strong pain, clear pay trigger, product fits today. Tier 2 = good fit with a caveat. Tier 3 = possible, but blocked by a gap, low volume or a gatekeeper. Changes from the first version: personas 3 and 10 moved up (Top Producer removes their cap); 4 and 14 moved from "blocked" to "sales-led, but the promised Team features must be delivered".

---

## Realtors

### 1. Tuesday-Night Canva Agent — solo listing agent, suburban Ontario or BC

**Who they are.** "Priya", 6–12 years licensed, 12–25 listings a year, on a big franchise or a mid-size independent brokerage. Runs their business alone or with a part-time admin. Has an Instagram with a few hundred to a couple thousand followers, a Facebook business page, and a LinkedIn they barely touch. Their brand matters to them: they paid for a headshot and a logo.

**Today.** Every new listing means opening Canva, finding last month's template, dropping in photos, retyping the price and features, writing a caption, then doing it again for the open house and again for Sold. It happens after showings, usually at night. Sometimes the Sold post never gets made.

**Goals.** Post every listing at every stage, look as polished as the big teams, get seller leads from people who see their listings.

**Pains and triggers.** A new listing goes live and they're already behind. They see a competitor's consistent feed. A seller asks "where will you market my home?"

**Why they'd use SocialSpark.** Paste the listing link from their brokerage site and get the Just Listed carousel and caption for Instagram, Facebook or LinkedIn in their voice (Brand & voice learns from past posts), with their name, brokerage and colours. Six post types cover the whole listing life. Scheduling means the Open House post can be set up on day one.

**Why they'd pay.** The free 3 posts run out on their first listing. At 1–2 listings a month across two platforms they need 10–20 posts: Starter for a trial month, then Pro once they post every stage. Busy spring months can push them toward Top Producer; a yearly Pro plan ($249.90, two months free) suits them once the habit sticks. Either is less than an hour of their time, and they can mention "every listing gets professional social posts" in listing presentations.

**Objections.** "AI captions sound fake" → voice samples, edit everything. "Will it post something wrong?" → nothing posts without their click. "REALTOR.ca links don't work" → copy-paste the page, or use their brokerage link.

**Reach them.** Instagram and Facebook ads, realtor Facebook groups, brokerage training nights, Google searches like "listing post template".

**Message that lands.** "Paste your listing link. Your Just Listed post is ready before your coffee is."

---

### 2. The Hungry Rookie — first- or second-year agent, any major market

**Who they are.** "Jordan", 24–35, licensed under two years, maybe a career-changer. Has 0–6 listings a year, so most of their posts are about other people's listings (shared with permission), open houses they host for senior agents, and Featured Property posts. Very online, but money is tight and the brokerage desk fee comes first.

**Today.** Free Canva, phone photos, captions copied from other agents. Their feed looks amateur and they know it.

**Goals.** Look established before they are. Build a following that turns into their first clients.

**Pains and triggers.** Their first listing. Hosting an open house for a colleague. Seeing peers who started with them look more professional.

**Why they'd use SocialSpark.** Free posts with no card: a polished first post costs nothing. Featured Property and Open House post types fit their reality. Branded templates make a small agent look like a real business.

**Why they'd pay.** When they land a listing and want to post it properly at every stage. Starter is the natural plan. Risk: they may cycle through free accounts or wait for listings to subscribe.

**Objections.** "I can't afford another subscription" → cancel anytime, subscribe for the month you have a listing. "I don't have listings yet" → Featured Property and open houses for colleagues (with the listing agent's OK).

**Reach them.** TikTok and Instagram, licensing-course communities, new-agent Facebook groups, brokerage onboarding.

**Message that lands.** "Your first listing deserves to look like your fiftieth."

---

### 3. The Top Producer — high-volume listing agent, GTA, Greater Vancouver or Calgary

**Who they are.** "Marc", 40–55, 50+ listings a year, a buyer agent or two and an assistant. Their name is the brand. Social media is already handled, somewhat: an assistant or contractor makes posts, but it's slow and uneven.

**Today.** A listing goes live and the post appears two or three days later, if the assistant isn't on transaction paperwork. Open House posts get skipped on busy weekends.

**Goals.** Speed and consistency at scale. Every listing announced the day it goes live. Protect the brand they spent years building.

**Pains and triggers.** A seller noticing their listing wasn't posted. The assistant going on vacation. Recruiting season, when the feed is the team's résumé.

**Why they'd use SocialSpark.** It makes the assistant five times faster: link in, branded post out, scheduled. Consistent templates keep the brand uniform. LinkedIn posts reach their professional referral network.

**Why they'd pay.** Price is irrelevant to them; time and consistency aren't. 4+ listings a month × 4 stages × 2 platforms is 30+ posts, which is why the **Top Producer plan** ($49.99, 50 posts) exists, and it's named after them. They're the likeliest yearly buyer ($499.90). Only the very largest (8+ listings a month) would still hit 50, and they usually have a team (persona 4).

**Objections.** "My assistant already does this" → it makes your assistant faster, not redundant. "Is 50 enough?" → about 5–8 listings a month at every stage; beyond that, Team.

**Reach them.** Their assistant, usually. LinkedIn, industry conferences, brokerage top-producer events, referrals from other agents.

**Message that lands.** "Every listing posted the day it goes live, at every stage, without adding staff."

---

### 4. The Team Lead — leads a 4–10 agent team

**Who they are.** "Sandra", runs a team under a franchise brokerage, splits commission with team agents, owns the team brand and marketing budget. Cares about team brand consistency more than any single post.

**Today.** Each agent posts their own way, or the team's marketing person bottlenecks everything. Brand rules exist in a PDF nobody follows.

**Goals.** One consistent team look across every agent's listings. Content volume that makes the team look bigger.

**Pains and triggers.** A team member's off-brand post. Onboarding a new agent. Annual marketing budget review.

**Why they'd use SocialSpark.** Templates and branding produce a consistent look. Every agent can generate posts without design skills.

**Why they'd pay.** Out of the team marketing budget, as one line item. The pricing page's Team banner ("Seats for every agent, one invoice and a shared brand kit") speaks directly to them, and the enquiry form captures team size and province. **Fulfilment gap:** seats, a shared brand kit and central billing aren't built yet, so the first Team deals would be handled by hand (separate accounts, one manual invoice) or need the features built. Until then, the realistic fallback is one Top Producer account run by a coordinator (persona 5).

**Objections.** "How do I control the brand across accounts?" → promised on the banner, not built. "Who owns the accounts if an agent leaves?" → not solved yet. "What does it cost per agent?" → no published Team price; decide one before the first call.

**Reach them.** LinkedIn, team-lead masterminds and coaching programs, brokerage leadership events.

**Message that lands.** "Every agent on your team, one look, without a designer."

---

### 5. The Marketing Coordinator — staff at a team or busy agent's office

**Who they are.** "Alex", 25–35, salaried or contractor, does social, listing launches, print, and some admin for a team or top producer. Uses the product every day but doesn't own the card.

**Today.** Lives in Canva and a content calendar. Rebuilds the same listing posts over and over. Gets asked "is the Sold post up yet?" weekly.

**Goals.** Clear the backlog. Spend time on content that actually needs them (videos, market updates, client stories) instead of listing posts.

**Pains and triggers.** Three listings going live in one week. A new boss who wants daily posting.

**Why they'd use SocialSpark.** Bulk speed on repetitive listing posts; scheduling; editable output so their judgement still shows; downloads to drop into their existing scheduler.

**Why they'd pay.** They don't; they champion it to their boss (personas 3 or 4). For a top producer the ask is Top Producer at $49.99; for a team it's the Team enquiry. Pitch to them as a tool that makes them look good, and give them a one-line case for the boss.

**Objections.** "Will it replace me?" → it takes the repetitive part, not the job. "Our brand is custom" → colours, logo, photos and text are all editable.

**Reach them.** Real-estate marketing communities, Instagram, Canva-alternative searches, LinkedIn job titles.

**Message that lands.** "The listing posts are done. Go make the content only you can."

---

### 6. Le courtier immobilier québécois — francophone broker, Montréal, Québec City, Gatineau or the regions

**Who they are.** "Geneviève", courtier immobilier résidentiel under the OACIQ, 8–20 listings a year, works entirely in French. Most English tools give them France French or awkward translations, or nothing.

**Today.** Writes captions themselves in French, or translates English tools' output and fixes it. Design work in Canva.

**Goals.** Posts that sound like a Québécois broker, not a translation. Professional look on Facebook (very strong in Québec) and Instagram.

**Pains and triggers.** Trying an English-first tool and seeing "Juste listé" type output. A new listing in a hot market.

**Why they'd use SocialSpark.** Québec French captions written natively, plus bilingual output for mixed areas. Same link-to-post speed and branding as English users. Data stored in Canada.

**Why they'd pay.** Few alternatives do Québec French properly, so the switching cost is high once it works. Starter at first, Professional when they post every stage.

**Objections.** "Is the French actually Québécois?" → show a real sample in the ad. "Does it work with Centris links?" → test this; if Centris blocks automated tools like REALTOR.ca does, the copy-paste path applies.

**Reach them.** French-language Facebook and Instagram ads served in Québec, Québec real-estate Facebook groups, local real-estate boards' events.

**Message that lands.** "Vos publications Inscrit, Visite libre et Vendu, en français d'ici, en une minute."

---

### 7. The Bilingual Border Agent — Ottawa–Gatineau, Montréal West Island, Moncton, Eastern Ontario

**Who they are.** "Daniel", fully bilingual, serves both anglophone and francophone buyers, often across a provincial border. Posting in only one language loses half their audience; posting twice doubles the work.

**Today.** Writes one caption in English and another in French, or one awkward mixed caption, or skips French.

**Goals.** Reach both language communities with every listing, without doing everything twice.

**Pains and triggers.** A francophone seller asking for French marketing. Doing two captions per listing every time.

**Why they'd use SocialSpark.** Bilingual output in one post, or separate EN and Québec FR versions. It's one of SocialSpark's clearest differentiators.

**Why they'd pay.** A single bilingual caption is one post, but agents who want separate English and French posts double their load and hit 20 fast. Pro for bilingual captions; Top Producer if they post each language separately.

**Objections.** "Is the French good enough for my francophone clients?" → sample it; Québec French, not France French.

**Reach them.** Geo-targeted bilingual ads in border regions, Ottawa and Gatineau real-estate boards, LinkedIn.

**Message that lands.** "One listing link. English, French, or both, in the same minute."

---

### 8. The Part-Timer — agent with a day job or semi-active licence

**Who they are.** "Chris", a teacher, nurse or retiree who keeps a licence and does 2–6 deals a year, mostly from friends and family. Doesn't want another monthly bill.

**Today.** Posts listings on their personal Facebook. Sometimes nothing.

**Goals.** Look professional on the few listings they have; not waste money in the months they don't.

**Pains and triggers.** A friend lists with them and they want to do it justice.

**Why they'd use SocialSpark.** Free posts and no card. Link in, post out, with almost no learning curve.

**Why they'd pay.** Only during a listing: subscribe to Starter for a month, cancel after Sold. Never yearly: $149.90 is more than the 2–3 months they'd actually use. Low lifetime value, but "cancel anytime" is exactly what gets them to pay at all.

**Objections.** "I only need it twice a year" → subscribe that month, cancel in two clicks.

**Reach them.** Facebook, word of mouth from agent friends, brokerage newsletters.

**Message that lands.** "Got a listing this month? Make it look like you do this every day."

---

### 9. The Luxury Specialist — $2M+ homes, Toronto, Vancouver, Muskoka, Montréal

**Who they are.** "Victoria", sells high-end homes, works with professional photographers and stagers, guards their image carefully. Their buyers and referrers include executives, lawyers and other professionals, so LinkedIn matters.

**Today.** Pays a designer for listing launch materials. Social posts are slow because every one is custom.

**Goals.** Social posts that match the quality of the photography. Reach high-net-worth networks.

**Pains and triggers.** A designer's turnaround holding up a launch. Template tools that look cheap.

**Why they'd use SocialSpark.** The Minimal template and good photo picking let the photography carry the post. LinkedIn posting. Text-on-photo is optional. Everything is editable.

**Why they'd pay.** Price is trivial for them. They'll pay if the output is beautiful enough; if not, nothing else matters. Few listings, so Pro covers them; likely yearly, since they don't watch small subscriptions.

**Objections.** "Templates look templated" → show luxury output in the creative. "I need custom" → they may keep a designer for hero pieces and use SocialSpark for Open House, Price Reduced and Sold.

**Reach them.** LinkedIn, Instagram, luxury real-estate networks and franchise luxury divisions.

**Message that lands.** "Let your photographer's work speak. The post is ready when the photos are."

---

### 10. The Condo & Pre-Sale Specialist — downtown Toronto, Vancouver, Calgary, Montréal

**Who they are.** "Kevin", sells resale condos and assignments, many units a year at lower prices than detached homes, often to investors and first-time buyers. High listing volume means high posting volume.

**Today.** Many similar listings, each needing its own post. Condo fees and building amenities have to be in every caption.

**Goals.** Speed through volume. Captions that get unit specifics (floor, view, parking, locker, fees) right.

**Pains and triggers.** Five units live in one building. Market slowdowns that make Price Reduced posts frequent.

**Why they'd use SocialSpark.** Extraction pulls details from the listing page, Claude writes specifics in. Price Reduced and Coming Soon types are core to a slower condo market.

**Why they'd pay.** Volume pushes them past Pro's 20 posts; Top Producer (50) fits a busy condo month, especially when Price Reduced posts pile up.

**Objections.** "My listings all look the same" → captions use each unit's details and photos.

**Reach them.** Instagram, investor-focused communities, Google search.

**Message that lands.** "Five condos this week? Five posts before lunch."

---

### 11. The Small-Town & Cottage Agent — rural Ontario, Alberta, Nova Scotia, BC Interior

**Who they are.** "Doug", sells acreages, farms, cottages and small-town homes. Local Facebook groups and community pages are their main channel. Listings sit longer, so they post the same property several times.

**Today.** Phone posts to Facebook, sometimes with a typed caption. Little design.

**Goals.** Reach the whole town and the city buyers looking for a cottage.

**Pains and triggers.** A cottage listing ahead of spring market. A slow listing that needs a fresh push (Price Reduced, Featured).

**Why they'd use SocialSpark.** Facebook Pages posts and 20-photo albums suit property-heavy listings. Virtual tour links get picked up and mentioned. Featured Property lets them re-promote a listing that's been sitting.

**Why they'd pay.** Fewer listings but more posts per listing over a longer life. Starter usually covers it, and steady year-round listings make yearly Starter ($149.90) a fit.

**Objections.** "I'm not a tech person" → paste a link, click post. "My board's listings are only on REALTOR.ca" → copy-paste the page.

**Reach them.** Facebook ads with rural geo-targeting, regional real-estate boards.

**Message that lands.** "That cottage deserves more than a phone photo on Facebook."

---

### 12. The Reluctant Veteran — 20+ years in, referral-based

**Who they are.** "Linda", 55–68, built a business on referrals and repeat clients. Knows social media matters now but finds it uncomfortable. Often their adult child or a younger colleague sets them up.

**Today.** Posts rarely, or pays a family member to do it. Embarrassed by how thin their online presence looks next to younger agents.

**Goals.** Show past clients and their sphere they're still active and successful, with minimal effort.

**Pains and triggers.** A seller choosing a younger agent "because of marketing." A grandchild or assistant telling them their Instagram is empty.

**Why they'd use SocialSpark.** Almost no skill required. Captions in their own voice (they paste a few old posts or emails). Nothing posts without their click, so they never fear an accident.

**Why they'd pay.** To stop losing listing presentations on marketing. Starter, steady and loyal once set up; low churn if it just works. Good yearly candidate: one decision, then no more thinking about it.

**Objections.** "I don't trust AI" → you approve every word. "I'll never figure out the setup" → one link, one click; offer a short guided start.

**Reach them.** Facebook, brokerage office managers, their own assistants or family, email.

**Message that lands.** "Your listings, posted properly, without learning Instagram."

---

### 13. The Agent Who Fired Their VA — cost-conscious mid-career agent

**Who they are.** "Ravi", has paid a virtual assistant or freelance social media manager for listing posts. Market slowed, commissions dropped, and the retainer now hurts. Wants the output without the monthly cost.

**Today.** Either still paying and resenting it, or stopped and their feed went quiet.

**Goals.** Keep the posting cadence clients noticed, at a fraction of the cost.

**Pains and triggers.** A slow quarter. A contractor's price increase. The contractor's turnaround slipping.

**Why they'd use SocialSpark.** Same deliverable (branded listing posts plus captions), produced in minutes, with scheduling.

**Why they'd pay.** The comparison isn't Canva, it's the person they were paying, so even Top Producer at $49.99 is an easy decision. Pro if their volume is moderate.

**Objections.** "My VA also did stories and engagement" → SocialSpark covers listing posts, not community management; be honest about that.

**Reach them.** Facebook and Instagram ads with a cost-saving angle, Google searches for "real estate social media manager".

**Message that lands.** "The listing posts you used to outsource, done in a minute, for less than lunch."

---

### 14. The Independent Brokerage Owner — managing broker, 10–60 agents

**Who they are.** "Faisal", owns a local independent brokerage. Competes with franchises for agents by offering better tools and support. Has a small marketing budget and a brand to protect.

**Today.** Agents use whatever they want; brokerage branding on social is inconsistent. Recruiting pitch lacks a marketing tool story.

**Goals.** A recruiting and retention perk ("we give you a listing post tool"). Consistent brokerage branding on agent posts.

**Pains and triggers.** Losing an agent to a franchise with a bigger tech stack. A regulator or board reminder about advertising rules (brokerage name on ads).

**Why they'd use SocialSpark.** Brokerage name appears on posts; templates make agents look consistent.

**Why they'd pay.** Only if they can buy for the brokerage, which is what the Team enquiry is for (sizes go up to 51+ agents, and the form covers realtor, mortgage or mixed brokerages). Highest potential value of any persona. **Fulfilment gap:** seats, an admin view and a shared brand kit are promised on the pricing page but not built; a brokerage deal will expect them.

**Objections.** "Can I manage seats and brand centrally?" → promised, not built. "Per-agent price?" → not published; needs a number before sales calls.

**Reach them.** LinkedIn, direct outreach, provincial real-estate association events.

**Message that lands.** "A listing-post tool you can offer every agent you recruit."

---

### 15. The Relocation & Newcomer Agent — serves a cultural or immigrant community, GTA, Vancouver, Calgary

**Who they are.** "Mei" or "Harpreet", serves a specific community, often newcomers to Canada, through WhatsApp, WeChat, Facebook and Instagram. Their community trusts them partly because they look established.

**Today.** Posts in English and shares on messaging apps; some write a second caption in their community's language by hand.

**Goals.** Look professional to clients who are new to Canadian real estate. Share listings fast in community channels.

**Pains and triggers.** A batch of newcomer clients arriving for spring market.

**Why they'd use SocialSpark.** Polished English posts; downloadable images to share in WhatsApp and WeChat groups.

**Why they'd pay.** Starter, if the English (or French) output is enough. **Gap:** no languages beyond English and French. Validate before targeting.

**Objections.** "My clients read Punjabi / Mandarin / Tagalog" → not supported today.

**Reach them.** Community associations, multicultural media, Facebook and Instagram ads by language interest.

**Message that lands.** "Professional listing posts you can share in every group chat."

---

## Mortgage brokers

### 16. The Referral-Hungry Mortgage Agent — Ontario Level 2, BC submortgage broker, 1–4 years in

**Who they are.** "Tyler", licensed mortgage agent at a brokerage, eats what they kill. Their pipeline depends on realtor referrals they don't have yet. Knows realtors are flooded with brokers asking to "grab a coffee."

**Today.** Cold coffees, generic rate posts (which compliance may not love), and favours for realtors in the hope of referrals.

**Goals.** Become the broker realtors call. Give realtors something useful instead of asking for something.

**Pains and triggers.** A slow month. A realtor accepting a coffee and then sending the deal elsewhere.

**Why they'd use SocialSpark.** A co-branded mortgage feature sheet for a realtor's listing is a gift: the realtor's photo, contact and QR code next to the broker's, monthly payments at four down payments, printable for the open house. Partners are saved once. It's the "give first" pitch a new broker needs.

**Why they'd pay.** Sheets, PDFs and Stories are free; captions for social posts use the plan. Once they're making sheets for several realtors' listings and posting them, Starter then Professional. The first referral pays for years of it.

**Objections.** "Is this compliant?" → licence number, rate "as of" date and disclaimer on every sheet, no rates in captions; they still review against their regulator. "Will realtors want this?" → ask permission, then send them a finished sheet.

**Reach them.** LinkedIn, mortgage broker Facebook groups, brokerage training, Google searches like "mortgage feature sheet template".

**Message that lands.** "Stop asking realtors for coffee. Send them a finished feature sheet for their listing."

---

### 17. The Realtor-Network Broker — established broker with 10–30 realtor partners

**Who they are.** "Natalie", 8–15 years in, a solid book of realtor referral partners. Already sends feature sheets, made by an assistant or in Excel and Canva, and it's a time sink. Partners expect them.

**Today.** Every partner listing means a manual sheet: payment calcs in a spreadsheet, design in Canva, PDF export, email. Some partners get them, some don't.

**Goals.** A sheet for every partner listing, the same day, without assistant hours. Keep partners loyal.

**Pains and triggers.** A partner mentioning another broker's sheets. Rate changes that make old sheets stale.

**Why they'd use SocialSpark.** Paste the listing link, get a sheet with Canadian math (CMHC premiums incl. 30-year surcharge, semi-annual compounding, minimum down payments enforced), partner co-branding, open-house PDFs in bulk (one page per home). When realtors on SocialSpark use "Send to broker", listings come to them directly.

**Why they'd pay.** Sheets, PDFs and Stories are free, so only social captions count. Posting a sheet for most partner listings means Pro, or Top Producer with 20+ partners. The value is protecting referral relationships worth far more than the subscription; a yearly plan matches how they think about partner tools. Note: Top Producer is labelled "For high-volume listing agents", so brokers may not see it as theirs; broker-facing copy should say who it's for.

**Objections.** "My spreadsheet is customized" → their own rates with "as of" date; the AI never writes the numbers. "I need more captions" → Top Producer gives 50; sheets themselves are always free.

**Reach them.** LinkedIn, broker networks and franchise conferences, their own realtor partners who already use SocialSpark.

**Message that lands.** "Every partner listing gets a feature sheet the day it goes live."

---

### 18. Le courtier hypothécaire québécois — AMF-regulated, Montréal, Québec City, Laval

**Who they are.** "Mathieu", courtier hypothécaire under the AMF, works in French with realtor partners who are mostly francophone. Feature sheet tools are mostly English or Ontario-centric.

**Today.** Builds French sheets manually, or uses English tools and translates.

**Goals.** French sheets and posts that look native, with Québec titles and fine print.

**Pains and triggers.** A realtor partner asking for a sheet for a Saturday visite libre.

**Why they'd use SocialSpark.** Titles follow the province; sheets and captions in Québec French or bilingual; Canadian payment math; co-branding with francophone realtors (who may also use SocialSpark in French, persona 6).

**Why they'd pay.** Few alternatives; once their partners rely on the sheets, switching costs are high. Pro, likely yearly.

**Objections.** "Is the fine print right for Québec?" → it follows the province, but they review against AMF rules themselves.

**Reach them.** French-language ads in Québec, Québec mortgage broker associations and networks, LinkedIn.

**Message that lands.** "Vos fiches hypothécaires en français d'ici, co-signées avec vos courtiers immobiliers."

---

### 19. The First-Time-Buyer Broker — specializes in first-time buyers, any province

**Who they are.** "Aisha", their niche is buyers who think they can't afford a home. Their marketing is education: what 5% down actually means, what CMHC insurance costs, what a 30-year amortization changes.

**Today.** Explains the same math over and over in DMs and calls. Social content is generic "rates are moving" posts.

**Goals.** Show buyers a specific home is within reach. Turn "I can't afford it" into a pre-approval appointment.

**Pains and triggers.** Spring market. Policy changes (insured amortization and price-cap rules) that buyers don't understand.

**Why they'd use SocialSpark.** Feature sheets show the real monthly cost of a real listing at four down payments, including 5% down and insurance premiums, with property tax and condo fees. That's the most persuasive first-time-buyer content there is, and it's done in minutes.

**Why they'd pay.** They want to post a few sheets a week on Instagram (Stories downloads are free, only captions count). Three a week is about 13 posts a month: Pro.

**Objections.** "I can't advertise rates loosely" → sheets show their own rates with an "as of" date and disclaimer; captions never quote rates or payments.

**Reach them.** Instagram and TikTok, first-time-buyer webinars, LinkedIn.

**Message that lands.** "Show your buyers what that home really costs each month, at 5% down."

---

### 20. The Bank Mobile Mortgage Specialist — employed by a bank or credit union

**Who they are.** "Jason", a mobile mortgage specialist at a big bank or credit union, paid partly on volume, depends on realtor referrals just like a broker. But their employer controls marketing tightly.

**Today.** Uses employer-approved templates, if any. Personal social posting about rates is often restricted.

**Goals.** Realtor referrals; standing out from brokers who can offer more lenders.

**Pains and triggers.** Brokers winning realtor relationships with better marketing.

**Why they'd use SocialSpark.** The same co-branded feature sheet "gift" for realtors, printable for open houses.

**Why they'd pay.** Only if their employer's compliance allows third-party marketing tools, which many won't. Starter at most.

**Objections.** "Compliance won't approve this" → often true; don't target until someone confirms otherwise.

**Reach them.** LinkedIn, but low priority.

**Message that lands.** "Give your realtor partners a feature sheet for every listing." (Only after compliance is confirmed.)

---

## Who is *not* a target (today)

- **US agents.** Payment math, titles, regulators and data residency are Canadian. Turn away politely.
- **FSBO sellers.** No brokerage or licence to brand; low lifetime value; posts would show "agent" framing.
- **Property managers and rental listings.** Post types and captions are sale-focused.
- **New-construction builders' marketing departments.** Have agencies and their own brand systems; possible later.

## Patterns across the personas

- **Pay trigger = a listing.** For most realtors, the moment to sell is the day a listing goes live. Ads and emails timed to listing activity should beat generic ones.
- **Top Producer closes the volume gap** for personas 3, 10 and some of 7, 13 and 17. Watch who upgrades from Pro and who hits 50; that tells you whether the cap is right.
- **Yearly billing fits committed, steady users** (1, 3, 9, 11, 12, 17, 18) and never fits burst users (2, 8). Offer yearly after a first good month, not on day one.
- **Team is now sold, but not yet delivered** (personas 4, 5, 14). The pricing page promises seats, one invoice and a shared brand kit; none are in the product. Decide a per-agent price and how the first deal gets fulfilled before enquiries arrive.
- **Plan names lean realtor.** "Top Producer" and "For an active agent" don't speak to mortgage brokers (16–19); broker pages and ads should say which plan fits a broker.
- **The realtor–broker loop is the growth engine.** Personas 1, 6 and 16–18 feed each other through Partners and "Send to broker": every broker who sends sheets to realtors is a distribution channel to realtors, and vice versa.
- **Québec and bilingual personas (6, 7, 18)** have the fewest alternatives and are the clearest differentiated segment.
