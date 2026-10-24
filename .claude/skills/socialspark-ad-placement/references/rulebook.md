# Ad rule book: platforms + Canada

**Last verified: 2026-10-24.** Re-verify anything you rely on if this date is more than 90 days old, before real money is spent, or when the user's screen disagrees with this file. Then update the fact, its source and this date.

Confidence tags: **[official]** = read on the platform's or regulator's own page; **[reported]** = consistent across several secondary sources, not confirmed on an official page; **[check]** = sources conflict, so verify before relying on it.

## Contents
1. Official sources to re-verify against
2. Pre-flight decision list (run for every campaign)
3. Platform policies that bite SocialSpark
4. Canadian law
5. Customer use: realtors and brokers advertising listings or mortgages
6. Rejection and restriction playbook
7. Change log

---

## 1. Official sources

| What | URL |
|---|---|
| Meta Advertising Standards (index) | https://transparency.meta.com/policies/ad-standards/ |
| Meta Special Ad Categories (help) | https://www.facebook.com/business/help/298000447747885 |
| Meta audiences for housing / employment / financial | https://www.facebook.com/business/help/2220749868045706 |
| Meta Special Ad Category (Marketing API) | https://developers.facebook.com/docs/marketing-api/audiences/special-ad-category |
| Meta GenAI transparency in ads | https://about.fb.com/news/2025/02/gen-ai-transparency-metas-ads-products/ |
| LinkedIn Advertising Policies | https://www.linkedin.com/legal/ads-policy |
| LinkedIn Marketing API recent changes (targeting changes show up here first) | https://learn.microsoft.com/en-us/linkedin/marketing/integrations/recent-changes |
| TikTok Advertising Policies (index) | https://ads.tiktok.com/help/article/tiktok-advertising-policies-ad-creatives-landing-page |
| TikTok financial services policy | https://ads.tiktok.com/help/article/tiktok-ads-policy-financial-services |
| TikTok Branded Content Policy | https://www.tiktok.com/legal/page/global/bc-policy/en |
| TikTok Smart+ campaign setup | https://ads.tiktok.com/help/article/how-to-create-a-campaign-in-the-upgraded-smart-experience |
| Competition Bureau: deceptive marketing | https://competition-bureau.canada.ca/deceptive-marketing-practices |
| CASL (anti-spam) | https://crtc.gc.ca/eng/internet/anti.htm |
| Québec Charter of the French language (OQLF, business) | https://www.oqlf.gouv.qc.ca/ |
| Québec Law 25 (CAI) | https://www.cai.gouv.qc.ca/ |
| CREA trademarks (REALTOR®, MLS®) | https://www.crea.ca/trademarks/ |
| RECO advertising bulletins (Ontario) | https://www.reco.on.ca/ (Bulletins 5.1, 5.3) |

Meta's help-centre pages often render empty to fetch tools. When they do, use the Marketing API docs or the Transparency Center, or ask the user to paste the page text.

---

## 2. Pre-flight decision list

Answer each one in the plan. A "yes" or "unsure" needs a written decision.

1. **Is the ad offering housing to consumers?** Homes for sale or rent, listings, open houses, home insurance, appraisals. *SocialSpark's own ads sell software to professionals, so the answer is normally no.* Risk: creative that shows a listing photo with price and address, an "Open House Saturday" graphic or a payment sheet can look like a housing ad to Meta's classifier. **Mitigation:** show the product doing the work (the link → the finished post, the app UI, the agent's branding) instead of a home offered to the viewer; keep prices and addresses on sample posts fictional or blurred; headline addresses agents ("For listing agents…"). If Meta still flags it, choose between reworking the creative and declaring Housing (accepting the targeting limits in §3.1). Never declare a category falsely to dodge review, and never leave out a category that genuinely applies.
2. **Is it offering a credit or financial product to consumers?** Mortgages, loans, credit. *Broker-facing SocialSpark ads sell software to brokers, so normally no.* But copy or creative showing payments, rates or "get pre-approved" reads as a mortgage ad. Keep rates and payments out of the creative; frame the ad as a tool for the broker's marketing. **[reported]** Meta's Financial Products and Services category excludes B2B-only financial products; SocialSpark isn't a financial product at all, but this helps if a reviewer is confused.
3. **Does any line assert or imply something about the viewer** (finances, health, age, struggles, criminal record, religion, sexuality, ethnicity)? Rewrite to address the profession or the situation. "Realtors: post every listing in a minute" is fine. "Behind on your listings?" sits near the line. "Broke after a slow quarter?" is out.
4. **Is every claim substantiated?** Numbers from `src/lib/plans.ts` and the FAQ; "under a minute" only if measured; no customer counts, ratings or testimonials that don't exist.
5. **Is "free" honest?** State the material condition near the claim: "3 free posts, no credit card." If the trial converts to paid, say so.
6. **Prices:** CAD, "plus tax", and the price shown must be obtainable (no drip pricing).
7. **Québec in the targeting?** French creative and a French landing page (`/for/publications-immobilieres-bilingues` or another FR page). English-only ads to Québec risk breaching the Charter.
8. **Trademarks:** no Meta, Instagram, LinkedIn or TikTok logos implying endorsement ("post to Instagram" as a plain description is fine); REALTOR® only as CREA intends (see §4.5); no MLS® or realtor.ca branding; no competitors' marks in a way that implies affiliation.
9. **AI-generated content:** realistic AI people, voices or scenes → enable the platform's AI disclosure (mandatory on TikTok for realistic AIGC **[reported]**; Meta auto-labels "AI info" for its own tools and some third-party tools **[official, Feb 2025]**). Real screen recordings of the app and real photos don't need it. Don't present AI actors as real customers. That's deceptive under the Competition Act whether or not it's labelled.
10. **Landing page match:** the product, offer and price in the ad appear on the landing page; the page loads fast on mobile, has a privacy policy link and works with the Back button (LinkedIn requires the last two **[official]**).
11. **Lead forms:** privacy policy URL required on all three platforms; ask for the minimum (name, email, brokerage, province); add an *unchecked* CASL consent box if you'll send marketing email.

---

## 3. Platform policies that bite SocialSpark

### 3.1 Meta (Facebook, Instagram, Messenger, Audience Network)

- **Special Ad Categories:** Housing, Employment, Financial Products and Services (replaced "Credit", required since January 2025 **[official API docs]**), plus Social issues/elections/politics. Housing ads must self-identify in **the US, Canada and certain parts of Europe** **[official, Transparency Center]**. For credit/financial in Canada, sources disagree on how much of the full category applies **[check]**.
- **What a declared category does to targeting** **[reported, consistent]:** age locked to 18–65+; all genders; no postal-code targeting and no location exclusions; cities and pins expand to a minimum ~15-mile (~25 km) radius; no detailed-targeting exclusions; lookalikes removed. Whether saved audiences and custom-audience use survive is **[check]**.
- **Personal attributes** **[official]:** ads must not assert or imply race, religion, beliefs, age, sexual orientation, gender identity, disability, health, financial status, union membership, criminal record or name, directly or indirectly.
- **Prohibited commercial practices / deceptive content** **[official]:** no misleading claims, fake urgency, fake buttons or UI, bait-and-switch.
- **Relevance and landing page** **[official]:** what's in the ad must be what's on the landing page.
- **Lead ads** **[official]:** some data requests are restricted (financial details, IDs, health); always a privacy policy link.
- **Financial and insurance products** **[official]:** 18+ targeting; no direct requests for financial information; may require authorisation. Not SocialSpark, but relevant to broker customers (§5).
- **Detailed targeting** **[reported]:** in-ad-set detailed-targeting exclusions were removed (2025); many interests were retired, and ad sets still using them had to be edited by 15 January 2026; with Advantage+ Audience, interests act as suggestions, not limits. Custom-audience exclusions still work.
- **Canada news block (Online News Act):** news links and news outlets' content can't be shared or boosted in Canada. Don't link ads to news articles about SocialSpark; link to our own pages.
- **Account integrity:** one real person per profile, no account rentals, no new accounts to dodge an enforcement (circumvention). Repeated rejections lower the account's standing, so fix the creative rather than resubmitting it unchanged.

### 3.2 LinkedIn [official, policy revised 18 Nov 2025]

- **Restricted:** financial services, including lending, mortgages, credit, investments and insurance. Not SocialSpark, but relevant to broker customers.
- **Prohibited:** fraud and deceptive claims, *including misleading claims about competitors*; discrimination based on personal attributes; affiliate advertising; political ads; incomplete ads.
- **Targeting:** may not target on sensitive data (political opinions, ethnic origin, health, religion, sexual orientation, union membership, criminal records, **income**) unless the law allows it. Must comply with laws on housing, credit and employment.
- **Claims:** must be factually supported; prices and offers must be easy to find from the ad's landing page; no false implied affiliation; disclose partnerships.
- **Link behaviour:** display-URL domain = destination domain; every click goes to the same landing page; no pop-ups; Back button must work; HTTPS for sensitive info; no "zombie cookies".
- **LinkedIn brand:** only "Find me on LinkedIn" per its trademark rules; otherwise don't reference LinkedIn or imply affiliation. *So no "LinkedIn-ready posts" in a LinkedIn ad's headline; describe it as "posts for your professional network" or name the post types.* (Saying the product posts to LinkedIn in body copy is lower risk but still a reviewer judgment.) **[check]**
- **Editorial:** professional language, correct spelling and grammar, no excessive emojis, no excessive capitals, no unrelated hashtags, supported languages only (English and French are supported).
- **Matched Audiences** **[official API changelog]:** from August 2026, max 1,000 DMP segments per ad account; legacy geo targeting removed 31 Aug 2026 (Bing geo only). Minimum audience size: historically 300 members; one source reports a rise to 1,000 **[check]**.

### 3.3 TikTok

- **Ads policy index** last updated August 2025 **[official]**; Branded Content Policy published 4 Aug 2026, effective 31 Aug 2026 **[official]**.
- **AI-generated content:** a label is required on realistic AI-generated ad content (realistic people, scenes, voices); TikTok auto-labels uploads that carry C2PA Content Credentials; there's a disclosure toggle in the upload flow **[reported, timing check]**. Real app screen recordings and real photos generally don't need it.
- **Financial services:** market-specific; must hold local licences; 18+ only **[official]**. Not SocialSpark, but relevant to broker customers.
- **Creative norms reviewers enforce** **[reported]:** ad language must match the targeted market's language; no exaggerated or "guaranteed" results; no misleading before/after; landing page must work on mobile, match the ad and not auto-download; music must come from the Commercial Music Library or be licensed. Personal music or trending sounds aren't cleared for ads.
- **Canada status:** the November 2024 wind-down order against TikTok Technology Canada was set aside (Jan 2026), and in March 2026 Ottawa let TikTok keep operating under binding undertakings **[reported, news]**. Ads run in Canada; TikTok Shop isn't available in Canada.

---

## 4. Canadian law

### 4.1 Competition Act (Competition Bureau)
- False or misleading representations are prohibited in their **general impression**, not just their literal words (civil s.74.01, criminal s.52). Fine print can't cure a misleading headline.
- **Drip pricing** is expressly deceptive (2022 amendments): the advertised price must be attainable, so no unavoidable fees added later. Government taxes may be added, so say "plus tax".
- **Performance claims** ("in under a minute", "saves 5 hours a week") need adequate and proper testing *before* the claim is made.
- **Testimonials and reviews** must be genuine, from real users, and typical, or say otherwise; disclose any incentive. No AI or stock "customers".
- **"Free"** must state material conditions clearly.
- Penalties are severe (for a first corporate civil breach, up to the greater of CAD 10M or 3× the benefit **[reported]**).
- **Comparative ads** ("cheaper than a VA", "unlike Canva") are allowed if true, current and substantiated. LinkedIn still prohibits *misleading* competitor claims, and Meta reviewers dislike attacks; prefer "instead of" framing without naming the competitor.

### 4.2 CASL (anti-spam)
Applies to **electronic messages**, not to ads themselves: LinkedIn Message/Conversation Ads, follow-up emails to lead-form leads, Messenger or DM sequences. A lead-form inquiry gives **implied consent for 6 months**, limited to that inquiry. For newsletters or ongoing marketing, use an **express, unchecked** consent box with SocialSpark's identity and an unsubscribe mechanism. Every commercial email needs sender ID, contact details and a working unsubscribe.

### 4.3 Privacy (PIPEDA, Québec Law 25)
- Lead forms and pixels collect personal information, so a privacy policy must explain what's collected, why and for how long.
- **Québec (Law 25):** technology that identifies, locates or profiles a person (ad pixels, retargeting) must be **off by default** with opt-in consent. SocialSpark has no consent banner yet (2026-10-24). Until it does, don't load pixels for Québec visitors, or don't launch retargeting there.
- Customer-list uploads (Custom/Matched Audiences) need a lawful basis: consent covering advertising use. Don't upload scraped agent directories or brokerage rosters.

### 4.4 Québec Charter of the French language (Bill 96)
Commercial advertising aimed at Québec must be in French; another language may accompany it but may not be more prominent. Produce native Québec French creative (from `socialspark-ad-copy`), run it in its own ad set targeted to Québec, and send it to a French landing page. A bilingual ad is acceptable when French is at least equally prominent. Contracts and the purchase flow should also be available in French.

### 4.5 CREA trademarks
REALTOR®, REALTORS® and MLS® are CREA trademarks identifying CREA members and CREA-member services. The SocialSpark site carries a notice (`src/components/Footer.tsx`). In ads: don't use the REALTOR® logo, don't imply CREA affiliation or endorsement, and don't use MLS® or realtor.ca branding. CREA's guidance discourages "realtor" as a generic word for any agent. Existing copy uses "realtors" heavily; it's low risk for a software vendor addressing members, but "real estate agents" is the safer choice for headlines **[check CREA guidance if challenged]**.

---

## 5. Customer use: realtors and brokers advertising listings or mortgages

When a SocialSpark customer asks how to run ads for their *own* listings or mortgage services:

- **Listing, open house or "homes in X" ads on Meta → Housing Special Ad Category is mandatory in Canada.** Expect the targeting limits in §3.1; no age, gender or postal-code targeting and no exclusions; use broader geography and let the creative do the targeting.
- **Mortgage-service ads → Financial Products and Services on Meta [check Canada scope]; restricted on LinkedIn; licence-gated on TikTok.**
- **Provincial rules on top:** real estate ads must clearly and prominently identify the **brokerage** (RECO in Ontario, and equivalents such as BCFSA, RECA, OACIQ); mortgage ads must show the **brokerage name and licence number** (FSRA in Ontario, BCFSA, AMF in Québec); rates need an "as of" date and conditions. Advertising a listing requires the seller's consent; the brokerage is responsible for agents' ads.
- **Fair housing:** no copy or targeting that prefers or excludes protected groups ("perfect for young professionals", "adults only", "ideal for a family" can all draw complaints).

---

## 6. Rejection and restriction playbook

1. **Read the exact policy named** in the rejection (Meta: Account Quality; LinkedIn: the rejection email/Campaign Manager; TikTok: the ad's rejection reason). Rejections are often for one element: the image text, the landing page or one phrase.
2. **Diagnose against this file:** personal attributes? undeclared housing/financial look? unsubstantiated claim? landing-page mismatch? trademark? AI label? language mismatch?
3. **Fix the cause, then resubmit as an edit.** Resubmitting unchanged ads, or copying them into new ad sets, lowers account standing.
4. **Request a review** only when you can say in one sentence why the ad complies ("This is B2B software for licensed agents; the house in the creative is a sample post, not a housing offer").
5. **Account restricted or disabled:** use the platform's appeal (Meta Account Quality; LinkedIn support; TikTok's appeal in Ads Manager). Keep business verification documents ready. **Never** open a new account to keep running. That's circumvention, and it can ban the business, the people and the domain.
6. Log the rejection and the fix in the campaign notes; if it reveals a rule this file doesn't cover, add it here with today's date.

---

## 7. Change log

- 2026-10-24: File created. Verified against Meta Transparency Center ad-standards index, LinkedIn Advertising Policies (rev. 18 Nov 2025), LinkedIn Marketing API recent changes (2026-09), TikTok policy index (Aug 2025), TikTok Branded Content Policy (eff. 31 Aug 2026), news on TikTok Canada (Jan and Mar 2026). Meta help-centre pages on Special Ad Categories wouldn't render to the fetch tool; those items are tagged [reported]/[check].
