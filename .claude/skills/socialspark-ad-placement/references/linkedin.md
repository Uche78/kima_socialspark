# LinkedIn

**Last verified: 2026-10-24.** Campaign Manager changes quietly; the Marketing API "recent changes" page (rulebook §1) usually announces targeting changes first.

## Contents
1. When LinkedIn, and for whom
2. One-time setup
3. Objectives and formats
4. Step-by-step build in Campaign Manager
5. Targeting recipes
6. Creative specs
7. Bidding, budget, reading results

---

## 1. When LinkedIn, and for whom

LinkedIn is expensive per click (often several times Meta's CPC; measure your own) but it's the only one of the four platforms that can reliably target **job titles, seniority, company and industry**. Use it for segments Meta can't isolate:

- **Independent Brokerage Owner, Team Lead, Mortgage Brokerage Principal:** the Team plan and enquiries (high value, low volume).
- **Marketing Coordinator:** the user who isn't the payer (show the boss-facing benefit).
- **Realtor-Network Broker, Referral-Hungry Mortgage Agent:** brokers are more active on LinkedIn than most agents.

Not the place for mass realtor sign-ups on a small budget. Many residential agents are inactive on LinkedIn.

## 2. One-time setup

1. **Company Page** for SocialSpark (or Kima Technologies with a SocialSpark showcase page).
2. **Campaign Manager** (linkedin.com/campaignmanager) → Create account: name, **currency CAD** (permanent), associate the Company Page. Add billing.
3. **Insight Tag** on the site + **Conversions API** for server events (sign-up, subscribe). Define conversions in Campaign Manager → Analyze → Conversion tracking. Not installed yet (SKILL.md §5.3).
4. **Account roles:** at least two Account Managers.
5. **Lead Gen Form defaults:** privacy policy URL (required), thank-you message and link.

## 3. Objectives and formats

| Goal | Objective | Format |
|---|---|---|
| Team/brokerage enquiries | **Lead generation** | Single image or Document ad + Lead Gen Form (pre-filled from profile) |
| Self-serve sign-ups | **Website conversions** | Single image, video, carousel |
| Seed a retargeting pool | **Engagement** or **Video views** | Video, Thought Leader Ads |
| Credibility with owners | **Brand awareness** | Thought Leader Ad (a founder or customer post sponsored) |

- **Thought Leader Ads:** sponsor a real person's post (e.g. the founder explaining why they built SocialSpark). They need that member's approval; they often get higher engagement because they read as a person, not a brand. Never sponsor a fake or AI persona.
- **Document ads:** a PDF carousel ("5 listing posts made from one link"), optionally gated with a Lead Gen Form.
- **Message / Conversation Ads:** land in the inbox. CASL applies to the follow-up, and they feel intrusive to agents; use sparingly, only to warm audiences.
- **Accelerate:** LinkedIn's AI campaign builder (auto targeting and creative suggestions). Fine for a first look; review every AI-written line against the rule book before launch.
- **One objective per campaign.** If you need awareness and leads, build two campaigns in a Campaign Group.

## 4. Step-by-step build in Campaign Manager

1. **Create → Campaign group** (name, optional total budget and dates).
2. **Create campaign** → choose objective.
3. **Audience:**
   - **Location:** Canada, or specific provinces (Bing-geo locations; legacy geo was retired 31 Aug 2026). Choose "Permanent or recent location".
   - **Profile language:** English for EN campaigns; **French** for the Québec campaign. LinkedIn targets by *profile language*, so many Québec members have English profiles. Run FR creative to Québec location regardless of profile language, or run both and compare.
   - **Targeting facets** (§5); keep **Audience expansion OFF** for precise B2B segments, and keep **LinkedIn Audience Network OFF** at first (it often brings low-quality clicks).
   - **Forecast panel:** aim for an audience of at least ~20,000 for Sponsored Content where possible. Canadian real estate segments are smaller, so accept 5k–20k, and never go below the platform minimum (300 historically; check).
4. **Format and placement.**
5. **Budget and schedule:** daily budget in CAD (minimum is low, about USD/CAD 10/day **[check]**, but plan ≥ CAD 50/day per campaign to learn anything); start/end dates.
6. **Bidding:** start with **Maximum delivery**; move to **Cost cap** once you know the CPA you'll pay.
7. **Conversion tracking:** attach the conversions (sign-up, subscribe).
8. **Ads:** create 3–4 ads per campaign (each a different angle); add **UTMs** in the destination URL; for Lead Gen, select or create the form: 3–5 fields (first name, last name, email, company, plus one qualifier such as "How many agents?"), privacy policy URL, and an **unchecked** custom checkbox for marketing consent (CASL).
9. **Review and launch.** Review is usually within 24 hours.
10. **Lead sync:** export leads from Campaign Manager or connect a CRM, and respond within a day, because enquiry intent fades fast.

## 5. Targeting recipes

Combine facets with AND between groups (e.g. Job title AND Industry) and OR inside a group.

| Segment | Recipe |
|---|---|
| Brokerage owners / managing brokers | Job titles: Broker of Record, Managing Broker, Broker Owner, Brokerage Owner, Principal Broker · Industry: Real Estate · Seniority: Owner, Partner, Director |
| Team leads | Job titles: Team Lead (Real Estate), Real Estate Team Leader · Industry: Real Estate · or Skills: Real Estate + Team Leadership |
| Marketing coordinators | Job titles: Marketing Coordinator, Real Estate Marketing Coordinator, Listing Coordinator, Real Estate Assistant · Industry: Real Estate |
| Mortgage agents / brokers | Job titles: Mortgage Agent, Mortgage Broker, Mortgage Specialist, Mortgage Advisor, Courtier hypothécaire · Industry: Financial Services / Real Estate · Exclude employers: the big banks if you want independents only (optional) |
| Realtors (broad) | Job titles: Real Estate Agent, Realtor, Sales Representative (Real Estate), Real Estate Broker, Courtier immobilier · Industry: Real Estate |
| Retargeting | Matched Audiences: website visitors (Insight Tag + consent), video viewers, Lead Gen Form openers, Company Page visitors |

- Use **Job titles** for precision, **Job functions + Seniority** for scale; don't stack both.
- Exclude existing customers (contact list) and your own employees.
- Upload customer lists only with consent covering advertising.
- Don't target sensitive data (rulebook §3.2), and income isn't a facet you may use.

## 6. Creative specs

| Format | Specs |
|---|---|
| Single image | 1200×627 (1.91:1), 1200×1200 (1:1, best on mobile), 720×900 (4:5, mobile only); JPG/PNG ≤ 5 MB |
| Intro text | ≤ 150 characters visible before "see more" (600 max) |
| Headline | ≤ 70 characters recommended (200 max) |
| Carousel | 2–10 cards, 1080×1080; card headline ≤ 45 characters |
| Video | 3 s–30 min; 15–30 s works best; captions on (SRT upload); 1:1 or 4:5 for mobile feed, 16:9 OK |
| Document ad | PDF up to ~300 pages (keep it to 5–10); first page must hook |
| Lead Gen Form | Headline ≤ 60, details ≤ 160 characters; up to 12 custom questions (use few) |

Tone: professional, specific and plain. No emoji strings, no ALL CAPS, no hype. Correct spelling is a policy requirement here, not a style choice. Don't reference LinkedIn itself in headlines (brand policy).

## 7. Bidding, budget, reading results

- Judge an ad after ~1,000 impressions and the campaign after it has spent ~2–3× target CPA.
- Key reads: CTR (single image Sponsored Content usually lands around 0.4–0.6%, so treat below ~0.3% as weak **[reported benchmark; replace with your own]**), cost per lead, lead → qualified call rate (from the CRM), cost per sign-up.
- Use **Demographics** reporting (job title, seniority, company) to see who actually clicked, then tighten.
- Refresh ads every 4–6 weeks in small audiences; frequency builds fast when the audience is under 50k.
