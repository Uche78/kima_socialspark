# SocialSpark ad copy: Top Producer plan personas

Personas 3, 5, 7, 10, 13 and 17 from `.claude/skills/socialspark-personas/references/personas.md`. Written 2026-10-23 with the `socialspark-ad-copy` skill.

## Before you paste

**Placeholders to replace**

| Token | Replace with | Until then |
|---|---|---|
| `⟦TIME⟧` | The measured time from listing link to finished post, e.g. "40–60 seconds" | "under a minute" / « moins d'une minute » (the site's current claim). Google assets already use "under a minute" and are marked †. Keep any replacement to 14 characters or fewer, or recheck lengths. |
| `⟦PROOF⟧` | A real customer's quote with name, brokerage and city, used with written permission | Delete the line. Never run an ad with the token in it. |

**Facts used, and where they come from**

- Plans (`src/lib/plans.ts`): Top Producer $49.99/month or $499.90/year (two months free), 50 posts and 25 new versions a month. Pro $24.99/month, 20 posts. Free: 3 posts, no credit card. Prices in CAD, plus tax.
- Plan maths, always shown with its base:
  - Every post type on two platforms is at most 12 posts a listing, so 50 posts covers at least 4 listings in full.
  - For condos, Just Listed, Price Reduced and Sold on two platforms is 6 posts a unit, so 50 posts covers 8 units.
- Product facts: `src/lib/faq.ts`, `src/lib/faq-brokers.ts`, `src/lib/generate.ts` (voice, clichés, fair housing, tours, Québec French, bilingual), `src/lib/extract.ts` (condo fee, tax), `src/components/ShareWithBroker.tsx` (Send to broker).
- Market facts, from personas.md Sources:
  - $400 a month for about 40 posts: a Canadian brokerage's social content plan [9].
  - GTHA new-condo sales at a 35-year low in Q1 2026, with a record 4,295 completed unsold units (Urbanation) [7].
  - Ontario's full HST rebate for first-time buyers of new homes runs to March 2027 [21].

**Deliberately left out**

- **"64% of Gatineau residents are bilingual" [23].** The source is JLR's 2018 report, eight years old, and it tells a Gatineau agent something they already know. It stays a targeting reason, not ad copy.
- **"$800 a month for a VA" [9].** The source is a single case study and the currency is unclear. Ads ask "What did your VA cost?" instead, so the reader supplies the number.
- **"5–8 listings a month".** This is an estimate. The ads use the provable "at least 4 listings in full."
- **HST rebate amounts or eligibility.** That would be tax advice and it goes out of date. Ads say agents can add rebate details in their notes.

**Destinations**

| Persona | Send ads to | Status |
|---|---|---|
| 3 Top Producer | `/for/social-media-for-top-producing-realtors` | Live (uncommitted) |
| 5 Marketing Coordinator | `/` | Needs a landing page |
| 7 Bilingual Border Agent | `/` | Needs a landing page, ideally in French. French ads that land on an English page are a Bill 96 risk in Québec and lose readers. |
| 10 Condo & Pre-Sale | `/for/social-media-posts-for-condo-realtors` | Exists. Its plan highlight needs a decision (see the end). |
| 13 Agent Who Fired Their VA | `/` | Needs a landing page |
| 17 Realtor-Network Broker | `/mortgage-brokers` | Live |

**Meta policy notes**

- Condo and mortgage creative that shows homes, prices or monthly payments may be classified under Meta's **Housing** special ad category, which limits targeting. Frame every ad as software for agents and brokers.
- No ad here quotes a mortgage rate or a payment amount.

---

## 3. The Top Producer

**Reader:** a high-volume listing agent (GTA, Greater Vancouver, Calgary) with an assistant; four listings a week. **Plan:** Top Producer, yearly. **CTA button:** Sign Up.

### Angle A: Same-day posting

**Headline:** Every listing posted the day it lists

**Short**
> Top producers: paste the listing link. Your branded Just Listed post and caption are ready in ⟦TIME⟧.

**Medium**
> Four listings this week? Paste each link.
>
> SocialSpark builds the Just Listed carousel and caption in your brand and your voice, for Instagram, Facebook and LinkedIn, in ⟦TIME⟧.
>
> Try it free on your next listing. No credit card.

**Long**
> Top producers: how many of last month's listings got a post at every stage?
>
> Paste a listing link from your brokerage or agent website. SocialSpark pulls in the price, details and photos and builds a branded post and caption in ⟦TIME⟧.
>
> → Six post types from one link: Coming Soon, Just Listed, Open House, Price Reduced, Sold, Featured
> → Written and sized for Instagram, Facebook and LinkedIn
> → Your name, brokerage and colours on every image
> → Captions that follow your tone and your past posts
> → Nothing goes out until you click Publish or Schedule
>
> ⟦PROOF⟧
>
> The Top Producer plan is 50 posts a month with every feature, enough for at least 4 listings at every stage on two platforms. Pay yearly and two months are free.
>
> Start with 3 free posts on your next listing. No credit card.

**Creative:** a real Just Listed carousel beside the listing link it came from.

### Angle B: The assistant

**Headline:** Your assistant: paste, check, schedule

**Short**
> Four listings a week, one assistant? With SocialSpark they paste the link, check the post and schedule it.

**Medium**
> Your assistant shouldn't rebuild the same template four times a week.
>
> They paste the listing link. SocialSpark builds the branded post and caption in ⟦TIME⟧. They check it and schedule it to Instagram, Facebook or LinkedIn.
>
> The same look on every listing. Nothing posts without a click.

**Long**
> Four listings a week is a lot of posts for one assistant: Coming Soon, Just Listed, Open House, Price Reduced, Sold, on two or three platforms each.
>
> With SocialSpark, your assistant pastes the listing link and the post is built in ⟦TIME⟧: your photos, your name and brokerage, your colours, and a caption in your voice.
>
> No template to find. No price to retype. No caption to write at 10 p.m. after a showing. They check it, edit anything they like, and schedule it.
>
> ⟦PROOF⟧
>
> Top Producer: 50 posts a month, every feature included, two months free when you pay yearly. Keep your assistant on the work only people can do.
>
> Try it on your next listing, free.

**Creative:** screen recording: link pasted → post appears → scheduled for Saturday's open house.

### Angle C: Brand and voice

**Headline:** Every post in your brand and your voice

**Short**
> Your name is the brand. SocialSpark puts it, your brokerage and colours on every listing post, with captions in your voice.

**Medium**
> Paste a few of your past posts once. SocialSpark follows your tone, leads with the selling points that matter, and skips "stunning" and "nestled" unless that's how you write.
>
> Every image carries your name, brokerage and colours.
>
> See it on your next listing, free.

**Long**
> When your name is the brand, every listing post is an ad for you.
>
> SocialSpark keeps them consistent:
> → Your name, brokerage, contact details and colours on every image, whoever makes the post
> → Captions that follow the tone and past posts you give it in Brand & voice
> → No "stunning", "nestled" or "must-see" unless you write that way
> → It describes the home, never the ideal buyer, as Canadian human rights codes require
> → English, Québec French or both
>
> ⟦PROOF⟧
>
> Top Producer covers at least 4 listings a month at every stage on two platforms. Paste your next listing link and see the post free.

**Creative:** three posts from different listings side by side, all in one brand.

### Google Search

**Headlines (15)**

1. Social Media for Top Agents (27)
2. Listing Posts for Top Agents (28)
3. Paste a Link, Get a Post (24)
4. Posted the Day It Goes Live (27)
5. Every Listing, Every Stage (26)
6. 6 Post Types From One Link (26)
7. Your Brand on Every Post (24)
8. Captions in Your Own Voice (26)
9. Your Assistant Schedules It (27)
10. Nothing Posts Without You (25)
11. Ready in Under a Minute (23) †
12. Top Producer Plan: 50 Posts (27)
13. Instagram, Facebook, LinkedIn (29)
14. Try 3 Posts Free, No Card (25)
15. Two Months Free Paid Yearly (27)

**Descriptions (4)**

1. Paste a listing link. Get a branded post and caption in your voice in under a minute. (85) †
2. Coming Soon to Sold: six post types for Instagram, Facebook and LinkedIn from one link. (87)
3. Top Producer plan: 50 posts a month, every feature, two months free when paid yearly. (85)
4. Your assistant pastes the link and schedules the post. Nothing goes out without a click. (88)

**Paths:** /top-producers /free

**Sitelinks**

- **7 Reasons for Top Agents** (24): Every listing posted the day (28) / it goes live, at every stage (28)
- **See Example Posts** (17): Just Listed, Open House, Sold (29) / For Instagram, Facebook, LinkedIn (33)
- **Plans and Pricing** (17): Top Producer: 50 posts a month (30) / Two months free when paid yearly (32)
- **How It Works** (12): Paste a link, check, schedule (29) / Edit every word before it posts (31)

**Callouts:** 3 Free Posts, No Card (21) · Cancel Anytime (14) · Québec French Built In (22) · Data Stored in Canada (21) · Schedule Posts Ahead (20) · Edit Every Word (15)

**Structured snippet:** Just Listed · Open House · Price Reduced · Coming Soon · Sold · Featured Property

**Keywords:** social media for top producing realtors · real estate listing post generator · just listed instagram post · realtor social media posts · listing marketing for realtors
**Negatives:** jobs · hiring · salary · course · training · free template · canva · realtor.ca login · zillow

**Test plan:** Test the three headlines first. Decide on cost per first generated post, with at least 30 conversions per variant before calling a winner. Then test long against short primary text on the winning angle.

---

## 5. The Marketing Coordinator

**Reader:** the coordinator who makes the listing posts for a top producer or team. They use the product; the boss pays. **Plan:** Top Producer, monthly. **CTA button:** Sign Up.

### Angle A: Clear the backlog

**Headline:** Clear the listing post backlog this week

**Short**
> Coordinators: paste each listing link and the branded post and caption are ready in ⟦TIME⟧. Then the next one.

**Medium**
> Six listings waiting for posts?
>
> Paste each link. SocialSpark pulls in the price, details and photos and builds the post and caption in your agent's brand and voice, in ⟦TIME⟧. You check it and schedule it.
>
> Try it free on the next listing. No credit card.

**Long**
> Six listings waiting, an open house on Saturday, and a Sold post nobody has made yet.
>
> Paste each listing link. In ⟦TIME⟧ you have a branded post and a caption in your agent's voice, ready to check.
>
> → Six post types: Coming Soon, Just Listed, Open House, Price Reduced, Sold, Featured
> → Schedule to Instagram, Facebook or LinkedIn, or download the images and caption for the scheduler you already use
> → Your agent's name, brokerage and colours on every image
> → Edit any word or photo. Edits and downloads are always free.
>
> ⟦PROOF⟧
>
> When it's time to ask: Top Producer is 50 listing posts a month for $49.99 plus tax.
>
> Start with 3 free posts. No credit card.

**Creative:** a queue of listings, each going from link to finished post.

### Angle B: The case for your boss

**Headline:** 50 listing posts a month for $49.99

**Short**
> The case for your boss: 50 branded listing posts a month for $49.99 plus tax. A content package can run about $400.

**Medium**
> Need to make the case to your boss?
>
> SocialSpark's Top Producer plan is 50 listing posts a month for $49.99 plus tax. A brokerage social content package can cost about $400 a month for around 40 posts.
>
> Make one free post on a real listing first, then show them.

**Long**
> Here's the one-line case for your boss: 50 branded listing posts a month for $49.99 plus tax.
>
> For comparison, one Canadian brokerage's social content plan is about $400 a month for around 40 posts.
>
> What the $49.99 covers:
> → A branded post and caption from each listing link, in ⟦TIME⟧
> → Six post types across the listing's life
> → Instagram, Facebook and LinkedIn, scheduled or downloaded
> → Captions in your agent's voice, edited by you before anything goes out
> → Cancel anytime from Plan & billing
>
> ⟦PROOF⟧
>
> Don't ask them to take our word for it. Make 3 free posts on a real listing and put the result on their desk.

**Creative:** a finished post with "50 posts a month · $49.99" in the corner. No competitor names.

### Angle C: Time for your own work

**Headline:** More time for the content only you make

**Short**
> Listing posts take ⟦TIME⟧ each. Spend the hours on the videos and market updates only you can make.

**Medium**
> The listing posts don't need your creativity. Your video tours, market updates and launch plans do.
>
> Paste a listing link and SocialSpark builds the branded post and caption in ⟦TIME⟧. You check it, schedule it, and move on.
>
> Try it on the next listing, free.

**Long**
> You were hired to market listings, not to retype prices into the same template.
>
> SocialSpark takes the repetitive part:
> → Paste a listing link, get a branded post and caption in ⟦TIME⟧
> → Every post type from Coming Soon to Sold
> → Scheduling, or downloads for your own scheduler
>
> Your judgement still shapes every post: edit any word or image before it goes out.
>
> ⟦PROOF⟧
>
> The listing posts get done. The rest of your week goes to the work only you can do.
>
> Start with 3 free posts. No credit card.

**Creative:** split screen: the finished post on the left, the coordinator's own video edit on the right.

### Google Search

**Headlines (15)**

1. Clear the Listing Post Backlog (30)
2. Real Estate Marketing Tool (26)
3. Paste a Link, Get a Post (24)
4. Every Listing Posted on Time (28)
5. Same Brand on Every Listing (27)
6. 50 Listing Posts a Month (24)
7. $49.99 a Month, Plus Tax (24)
8. Schedule or Download Posts (26)
9. Download for Your Scheduler (27)
10. Captions in the Agent's Voice (29)
11. Edit Every Caption and Photo (28)
12. 6 Post Types From One Link (26)
13. Instagram, Facebook, LinkedIn (29)
14. Try 3 Posts Free, No Card (25)
15. Ready in Under a Minute (23) †

**Descriptions (4)**

1. Paste each listing link. A branded post and caption are ready in under a minute. (80) †
2. Top Producer plan: 50 listing posts a month for $49.99 plus tax. Every feature included. (88)
3. Schedule to Instagram, Facebook or LinkedIn, or download images and caption to post. (84)
4. Captions follow the agent's tone and past posts. Edit anything before it goes out. (82)

**Paths:** /marketing /listing-posts

**Sitelinks**

- **See Example Posts** (17): Just Listed, Open House, Sold (29) / Branded with the agent's details (32)
- **Plans and Pricing** (17): Top Producer: 50 posts a month (30) / $49.99 a month, plus tax (24)
- **How It Works** (12): Paste a link, check, schedule (29) / Or download for your scheduler (30)
- **Brand and Voice** (15): Pick a tone, paste past posts (29) / Captions follow the agent's style (33)

**Callouts:** 3 Free Posts, No Card (21) · Cancel Anytime (14) · JPEG or ZIP Downloads (21) · Schedule Posts Ahead (20) · Edits Are Always Free (21) · Data Stored in Canada (21)

**Structured snippet:** Just Listed · Open House · Price Reduced · Coming Soon · Sold · Featured Property

**Keywords:** real estate marketing coordinator tools · listing post generator · real estate social media content tool · just listed post maker · real estate instagram post generator
**Negatives:** jobs · job · salary · hiring · internship · course · free template · canva

**Test plan:** A against B is the important test: does the coordinator respond to their own pain or to the budget case? Measure cost per sign-up, with at least 30 per variant.

---

## 7. The Bilingual Border Agent

**Reader:** a fully bilingual agent in Ottawa–Gatineau, the Montréal West Island or Moncton. **Plan:** Top Producer, yearly. Pro fits if one bilingual caption per post is enough. **CTA button:** Sign Up / S'inscrire.

**Language:** run the French ads in Gatineau and the Outaouais, and the English ads in Ottawa and Moncton. A bilingual audience can see both.

**The honest count:** one bilingual caption is one post. Separate English and French posts are two. Just Listed and Sold on two platforms is 4 posts a listing bilingual, or 8 as separate languages. So Top Producer's 50 cover 6 listings with separate languages, and Pro's 20 cover 5 with bilingual captions.

### Angle A: One link, both languages

**FR headline:** Un lien. Français, anglais ou les deux.

**FR short**
> Collez le lien de l'inscription : publication à votre image, en français, en anglais ou les deux, en ⟦TIME⟧.

**FR medium**
> Vos clients lisent en français et en anglais. Vos publications aussi.
>
> Collez le lien de l'inscription. SocialSpark crée la publication à votre image avec un texte bilingue, ou deux publications séparées, pour Instagram, Facebook et LinkedIn.
>
> Essayez-le sur votre prochaine inscription. Aucune carte de crédit.

**FR long**
> Vous vendez des deux côtés de la rivière. Vos publications devraient suivre.
>
> Collez le lien de votre inscription. En ⟦TIME⟧, SocialSpark crée une publication à votre image :
> → Un texte bilingue dans une seule publication, ou des publications séparées en français et en anglais
> → Le français d'ici : « Nouvelle inscription », « Visite libre », pas une traduction mot à mot
> → Votre nom, votre agence et vos couleurs sur chaque image
> → Six types : Bientôt sur le marché, Nouvelle inscription, Visite libre, Prix réduit, Vendu, Propriété en vedette
> → Rien n'est publié sans votre clic
>
> ⟦PROOF⟧
>
> Forfait Top Producer : 50 publications par mois. Deux mois gratuits en paiement annuel.
>
> 3 publications gratuites pour commencer. Aucune carte de crédit.

**EN headline:** English, French or both, from one link

**EN short**
> Paste a listing link. Get a branded post with the caption in English, Québec French or both, in ⟦TIME⟧.

**EN medium**
> Your clients read in English and French. Your posts can too.
>
> Paste the listing link. SocialSpark builds a branded post with a bilingual caption, or separate English and French posts, for Instagram, Facebook and LinkedIn.
>
> Try it free on your next listing. No credit card.

**EN long**
> You sell on both sides of the river. Your posts should too.
>
> Paste a listing link. In ⟦TIME⟧, SocialSpark builds a branded post:
> → One bilingual caption in a single post, or separate English and French posts
> → Québec French the way a Québec agent writes it ("Nouvelle inscription", "Visite libre"), not translated word for word
> → Your name, brokerage and colours on every image
> → Six post types, Coming Soon to Sold
> → Nothing goes out without your click
>
> ⟦PROOF⟧
>
> Top Producer: 50 posts a month, two months free when you pay yearly.
>
> Start with 3 free posts. No credit card.

**Creative:** the same listing as one bilingual post, with on-image text like "Backs onto the ravine | Adossée au ravin".

### Angle B: Real Québec French

**FR headline:** Du français d'ici, pas de la traduction

**FR short**
> « Nouvelle inscription », « Visite libre », « 649 000 $ » : SocialSpark écrit comme un courtier d'ici.

**FR medium**
> La plupart des outils vous donnent du français de France ou une traduction raide.
>
> SocialSpark écrit vos textes en français québécois, comme un courtier d'ici les écrirait : « Nouvelle inscription », « chambres à coucher », « pi² ».
>
> Voyez le résultat sur votre prochaine inscription, gratuitement.

**FR long**
> Vos clients voient tout de suite quand un texte a été traduit.
>
> SocialSpark écrit directement en français québécois :
> → « Nouvelle inscription », « Visite libre », « chambres à coucher », « pi² », « 649 000 $ »
> → L'accroche et l'appel à l'action adaptés, pas traduits mot à mot
> → Le texte suit votre ton et vos anciennes publications
> → Il décrit la propriété, jamais l'acheteur idéal, comme l'exigent les chartes des droits
> → Vos données sont hébergées au Canada
>
> ⟦PROOF⟧
>
> Collez le lien de votre prochaine inscription. 3 publications gratuites, aucune carte de crédit.

**EN headline:** Québec French, not a translation

**EN short**
> "Nouvelle inscription", "Visite libre", "649 000 $". SocialSpark writes French like a Québec agent, not a translator.

**EN medium**
> Most tools give you France French or a stiff translation.
>
> SocialSpark writes Québec French the way an agent from here would: "Nouvelle inscription", "chambres à coucher", "pi²". English, French or both from the same link.
>
> See it on your next listing, free.

**EN long**
> Your French-speaking clients notice a translated caption right away.
>
> SocialSpark writes Québec French directly:
> → "Nouvelle inscription", "Visite libre", "chambres à coucher", "pi²", prices like "649 000 $"
> → The hook and call to action adapted, not translated word for word
> → Captions that follow your tone and past posts
> → It describes the home, never the ideal buyer
> → Your data is stored in Canada
>
> ⟦PROOF⟧
>
> Paste your next listing link. 3 free posts, no credit card.

**Creative:** a real French caption, readable at feed size. The FR caption is the proof.

### Angle C: Separate posts, the honest count

**FR headline:** FR et EN séparés ? 50 par mois.

**FR short**
> Une publication en français et une en anglais, ça double le compte. Top Producer : 50 publications par mois.

**FR medium**
> Publier en français et en anglais séparément double le nombre de publications.
>
> Nouvelle inscription et Vendu, sur deux plateformes, dans les deux langues : 8 publications par propriété. Le forfait Top Producer en couvre 6 par mois. Un texte bilingue dans une seule publication ? Pro suffit souvent.
>
> Commencez avec 3 publications gratuites.

**FR long**
> Le calcul honnête, avant de choisir un forfait :
> → Un texte bilingue = 1 publication
> → Français et anglais séparés = 2 publications
> → Nouvelle inscription et Vendu sur deux plateformes, séparés : 8 publications par propriété
>
> Top Producer, 50 publications par mois : 6 propriétés avec des publications séparées. Si un texte bilingue vous suffit, le forfait Pro (20 par mois) couvre 5 propriétés.
>
> Chaque forfait inclut toutes les fonctions. Les modifications, téléchargements et publications sont toujours gratuits.
>
> ⟦PROOF⟧
>
> Essayez sur votre prochaine inscription. Aucune carte de crédit.

**EN headline:** Separate EN and FR posts? 50 a month

**EN short**
> Separate English and French posts double your count. Top Producer covers 50 posts a month, every feature included.

**EN medium**
> Posting English and French separately doubles the count.
>
> Just Listed and Sold on two platforms in both languages is 8 posts a listing. Top Producer covers 6 listings a month. Happy with one bilingual caption per post? Pro is often enough.
>
> Start with 3 free posts.

**EN long**
> The honest maths, before you pick a plan:
> → One bilingual caption = 1 post
> → Separate English and French posts = 2 posts
> → Just Listed and Sold on two platforms, separate languages: 8 posts a listing
>
> Top Producer, 50 posts a month: 6 listings with separate languages. If a bilingual caption is enough, Pro (20 a month) covers 5 listings.
>
> Every plan includes every feature. Edits, downloads and publishing are always free.
>
> ⟦PROOF⟧
>
> Try it on your next listing. No credit card.

**Creative:** two posts for one listing, FR and EN, with "1 lien → 2 publications".

### Google Search (English)

**Headlines (15)**

1. Bilingual Real Estate Posts (27)
2. English, French, or Both (24)
3. One Link, Two Languages (23)
4. Real Québec French Captions (27)
5. Bilingual Listing Posts (23)
6. For Ottawa–Gatineau Agents (26)
7. Paste a Link, Get a Post (24)
8. Bilingual Caption, One Post (27)
9. Or Separate EN and FR Posts (27)
10. Your Brand on Every Post (24)
11. 6 Post Types From One Link (26)
12. Instagram, Facebook, LinkedIn (29)
13. Nothing Posts Without You (25)
14. Try 3 Posts Free, No Card (25)
15. Data Stored in Canada (21)

**Descriptions (4)**

1. Paste a listing link. Get a branded post with English and Québec French captions. (81)
2. One bilingual caption counts as one post. Prefer separate EN and FR posts? Make both. (85)
3. Written the way a Québec agent writes: Nouvelle inscription, Visite libre. Not translated. (90)
4. Top Producer plan: 50 posts a month. Two months free when you pay yearly. (73)

**Paths:** /bilingual /free

**Sitelinks**

- **See Example Posts** (17): Just Listed, Open House, Sold (29) / In English, French or both (26)
- **Plans and Pricing** (17): Top Producer: 50 posts a month (30) / Two months free when paid yearly (32)
- **How It Works** (12): Paste a link, pick a language (29) / Edit every word before it posts (31)
- **Brand and Voice** (15): Pick a tone, paste past posts (29) / Captions follow your style (26)

**Callouts:** 3 Free Posts, No Card (21) · Cancel Anytime (14) · Québec French Built In (22) · Data Stored in Canada (21) · Schedule Posts Ahead (20) · Edit Every Word (15)

**Structured snippet:** English · Québec French · Bilingual

**Keywords (EN):** bilingual real estate posts · french real estate captions · ottawa realtor social media · bilingual listing post · quebec french real estate marketing
**Negatives (EN):** jobs · translation services · translator · course · free template

### Google Search (French)

**Headlines (15)**

1. Publications bilingues (22)
2. Français, anglais ou les deux (29)
3. Un lien, deux langues (21)
4. En français d'ici (17)
5. Pour les courtiers de Gatineau (30)
6. Collez un lien, c'est prêt (26)
7. Bilingue en une publication (27)
8. Ou FR et EN séparés (19)
9. Votre image, chaque fois (24)
10. 6 types de publications (23)
11. Instagram, Facebook, LinkedIn (29)
12. Rien ne part sans votre clic (28)
13. 3 publications gratuites (24)
14. Aucune carte de crédit (22)
15. Données hébergées au Canada (27)

**Descriptions (4)**

1. Collez le lien de l'inscription : publication à votre image et texte en français d'ici. (87)
2. Une légende bilingue compte pour une publication. Ou faites-les séparées, FR et EN. (83)
3. Écrit comme un courtier québécois : Nouvelle inscription, Visite libre. Pas traduit. (84)
4. Forfait Top Producer : 50 publications par mois. Deux mois gratuits à l'année. (78)

**Paths:** /bilingue /essai

**Sitelinks**

- **Exemples de publications** (24): Nouvelle inscription, Vendu (27) / En français, anglais ou les deux (32)
- **Forfaits et prix** (16): Top Producer : 50 publications (30) / Deux mois gratuits à l'année (28)
- **Comment ça marche** (17): Un lien, puis la langue (23) / Modifiez tout avant de publier (30)
- **Votre style** (11): Choisissez un ton (17) / Collez d'anciennes publications (31)

**Callouts:** 3 publications gratuites (24) · Annulez en tout temps (21) · Français du Québec (18) · Données au Canada (17) · Publications planifiées (23) · Tout est modifiable (19)

**Structured snippet:** Français · Anglais · Bilingue

**Keywords (FR):** publication immobilière bilingue · publication instagram courtier immobilier · marketing courtier immobilier gatineau · texte inscription immobilière · nouvelle inscription instagram
**Negatives (FR):** emploi · formation · traduction · traducteur · gabarit gratuit

**Test plan:** Run French and English as separate campaigns; don't compare them with each other. Within each language, test B (proof of the French) against A first. B is the clearest differentiator in personas.md. Measure cost per first generated post.

---

## 10. The Condo & Pre-Sale Specialist

**Reader:** a resale condo and assignment agent in downtown Toronto, Vancouver, Calgary or Montréal, with many units. **Plan:** Top Producer, monthly then yearly. Pro fits in a slow month. **CTA button:** Sign Up.

### Angle A: Volume

**Headline:** Five condos? Five posts before lunch.

**Short**
> Five condos this week? Paste each listing link. The branded post and caption are ready in ⟦TIME⟧. Then the next unit.

**Medium**
> Five units, five posts, one morning.
>
> Paste each listing link. SocialSpark reads the unit's price, size, condo fee and photos and builds a branded post and caption in your voice, in ⟦TIME⟧.
>
> Try it free on your next unit. No credit card.

**Long**
> Condo agents post more than anyone: more units, more price changes, more open houses.
>
> Paste each listing link. In ⟦TIME⟧ SocialSpark builds a branded post and caption from that unit's own details:
> → Condo fee, property tax, size and the features the listing names, like parking or a locker
> → Coming Soon, Just Listed, Open House, Price Reduced and Sold, from the same link
> → Matterport and iGUIDE tour links placed right for each platform
> → Nothing posts until you click
>
> ⟦PROOF⟧
>
> Top Producer: 50 posts a month covers 8 units at Just Listed, Price Reduced and Sold on two platforms.
>
> Start with 3 free posts. No credit card.

**Creative:** five finished posts from five units in a row.

### Angle B: Price Reduced, the new price

**Headline:** Sell the new price, not the old one

**Short**
> Price change on a unit? The Price Reduced post leads with what the new price gets a buyer, and never states the old one.

**Medium**
> GTHA new-condo sales hit a 35-year low in Q1 2026, with a record number of finished units unsold (Urbanation). Units need more than one push.
>
> Update the price, pick Price Reduced, and SocialSpark writes the post around what the new number now buys. It never states or guesses the old price.

**Long**
> In Q1 2026, GTHA new-condo sales hit a 35-year low, with a record 4,295 completed units unsold (Urbanation). For condo agents that means more price changes, and every one deserves a post.
>
> SocialSpark's Price Reduced post:
> → Leads with what the new price now gets a buyer
> → Never states or guesses the previous price
> → Uses that unit's own features and photos, not a generic "price drop" graphic
>
> Selling a new-build unit to a first-time buyer? Add the HST rebate details in your notes and the caption can work them in. You check every word before it posts.
>
> ⟦PROOF⟧
>
> Top Producer covers 8 units a month at three stages on two platforms. Try it free on your next price change.

**Creative:** a Price Reduced post leading with the feature ("Two parking spots, now $X").

### Angle C: Five units, one building

**Headline:** Five units, one building, five posts

**Short**
> Same building, same floor plan? Each post is written from that unit's own details: the view, the parking, the locker.

**Medium**
> Five units in one tower shouldn't read like one post copied five times.
>
> SocialSpark writes each from that unit's own details and photos. Pick up to three features to lead with: the corner view on one, the second parking spot on another.
>
> See your next unit as a post, free.

**Long**
> Five units in one building. Same amenities, same lobby, similar layouts. Buyers scroll past posts that look identical.
>
> SocialSpark writes every post from that unit's own listing:
> → Choose up to three features to lead with: the view, the floor, parking, a locker
> → Its own photos, its own condo fee and size
> → Want another angle? Ask for a new version (25 a month on Top Producer)
> → It describes the unit, never the ideal buyer, so no "perfect for young professionals"
>
> ⟦PROOF⟧
>
> Paste your next unit's link. 3 free posts, no credit card.

**Creative:** two posts from the same building with different lead features.

**Note:** Angle A's "five posts before lunch" is a scene, not a measured claim. Once `⟦TIME⟧` is measured, check that it still holds.

### Google Search

**Headlines (15)**

1. Condo Listing Posts (19)
2. Posts for Condo Realtors (24)
3. Five Condos? Five Posts. (24)
4. Paste a Link, Get a Post (24)
5. Each Unit's Own Features (24)
6. Price Reduced Posts Built In (28)
7. Condo Fee Read From Listing (27)
8. Coming Soon and Sold Posts (26)
9. 3D Tour Links Placed Right (26)
10. Never Describes the Buyer (25)
11. Up to 3 Features to Lead With (29)
12. Ready in Under a Minute (23) †
13. Try 3 Posts Free, No Card (25)
14. Québec French Built In (22)
15. Nothing Posts Without You (25)

**Descriptions (4)**

1. Paste each unit's link. Condo fee, size, features and photos are read from the listing. (87)
2. Five units in one building get five different posts, each led by that unit's features. (86)
3. Price Reduced posts lead with what the new price gets, and never state the old price. (85)
4. Top Producer: 50 posts a month covers 8 units at 3 stages on 2 platforms. Try 3 free. (85)

**Paths:** /condos /free

**Sitelinks**

- **Why Condo Agents Use It** (23): Five units, five different posts (32) / Each led by its own features (28)
- **See Example Posts** (17): Just Listed, Price Reduced, Sold (32) / For Instagram, Facebook, LinkedIn (33)
- **Plans and Pricing** (17): Top Producer: 50 posts a month (30) / Every feature included (22)
- **How It Works** (12): Paste a link, check, schedule (29) / Edit every word before it posts (31)

**Callouts:** 3 Free Posts, No Card (21) · Cancel Anytime (14) · 3D Tour Links Included (22) · Fair-Housing Wording (20) · Data Stored in Canada (21) · Schedule Posts Ahead (20)

**Structured snippet:** Coming Soon · Just Listed · Open House · Price Reduced · Sold

**Keywords:** social media posts for condo realtors · condo listing instagram post · condo realtor marketing · price reduced real estate post · condo marketing toronto realtor
**Negatives:** for sale · for rent · rent · rental · apartment · buy · mls · floor plans · assignment sale listings · jobs

**Test plan:** B against A first. The market context in B is the most specific thing these agents have heard this year, but it can read as bad news, so the data decides. Refresh the Q1 2026 figure the quarter Urbanation publishes a new one, and stop running B if the data no longer supports it.

---

## 13. The Agent Who Fired Their VA

**Reader:** a mid-career agent who paid a VA or content service for listing posts and cancelled it to save money. **Plan:** Top Producer, yearly. Pro fits at moderate volume. **CTA button:** Sign Up.

### Angle A: Compare the cost

**Headline:** 50 listing posts for $49.99 a month

**Short**
> Paid a VA or a content package for listing posts? Top Producer is 50 a month for $49.99 plus tax. Try 3 free first.

**Medium**
> What did your VA or content package cost each month?
>
> SocialSpark's Top Producer plan is 50 listing posts a month for $49.99 plus tax. One Canadian brokerage's social content plan is about $400 for around 40.
>
> Try 3 posts free. No credit card.

**Long**
> What did your VA or content package cost each month? One Canadian brokerage's social content plan is about $400 for around 40 posts.
>
> SocialSpark does the listing posts for $49.99 a month plus tax:
> → Paste a listing link, get a branded post and caption in ⟦TIME⟧
> → Coming Soon to Sold, for Instagram, Facebook and LinkedIn
> → Captions in your voice, from a few of your past posts
> → Schedule ahead, or post now
>
> To be clear: it does listing posts. It won't answer your DMs or film your stories.
>
> ⟦PROOF⟧
>
> Pay yearly and two months are free. Cancel anytime. Start with 3 free posts.

**Creative:** a finished post with "$49.99 / month · 50 posts".

### Angle B: No waiting

**Headline:** No waiting on anyone's turnaround

**Short**
> Listing live at 4 p.m.? Paste the link and the branded post and caption are ready in ⟦TIME⟧. Post it tonight.

**Medium**
> No more waiting two days for a post while the listing goes stale.
>
> Paste the listing link. SocialSpark builds the branded post and caption in ⟦TIME⟧. Check it, schedule it, done.
>
> Try it free on your next listing.

**Long**
> The listing went live Tuesday. The post showed up Thursday.
>
> With SocialSpark there's no one to wait for:
> → Paste the link, get the post and caption in ⟦TIME⟧
> → Schedule the Open House post the day you list
> → Your name, brokerage and colours on every image
> → Edit anything before it goes out
>
> ⟦PROOF⟧
>
> Top Producer: 50 posts a month, enough for at least 4 listings at every stage on two platforms. Two months free when you pay yearly.
>
> Start with 3 free posts. No credit card.

**Creative:** a phone clock showing 4:00 p.m. → 4:01 p.m. Use only times consistent with the measured `⟦TIME⟧`.

### Angle C: Candour

**Headline:** Listing posts only. Done properly.

**Short**
> SocialSpark won't answer your DMs or film your stories. It does listing posts: every listing, every stage, in your brand.

**Medium**
> We'll be straight with you: SocialSpark isn't a social media manager.
>
> It does one job. Paste a listing link and get a branded post and caption in your voice, for every stage from Coming Soon to Sold.
>
> If that's the part you paid someone for, try it free.

**Long**
> We'll be straight with you: SocialSpark isn't a social media manager. It won't reply to comments, answer DMs or film stories.
>
> It does the listing posts, the part most agents outsource first:
> → A branded post and caption from each listing link, in ⟦TIME⟧
> → Six post types across the listing's life
> → Instagram, Facebook and LinkedIn, scheduled ahead
> → Captions that follow your tone, edited by you before anything goes out
>
> ⟦PROOF⟧
>
> Top Producer is $49.99 a month plus tax, two months free yearly. Try 3 posts free first.

**Creative:** plain text card, "Listing posts. That's it.", over a finished carousel.

### Google Search

**Headlines (15)**

1. Skip the Social Media Retainer (30)
2. Listing Posts Without a VA (26)
3. Paste a Link, Get a Post (24)
4. $49.99 for 50 Listing Posts (27)
5. No Waiting on Turnaround (24)
6. Post the Day It Goes Live (25)
7. Your Brand on Every Post (24)
8. Captions in Your Own Voice (26)
9. Schedule Posts Ahead (20)
10. 6 Post Types From One Link (26)
11. Instagram, Facebook, LinkedIn (29)
12. Cancel Anytime (14)
13. Try 3 Posts Free, No Card (25)
14. Two Months Free Paid Yearly (27)
15. Nothing Posts Without You (25)

**Descriptions (4)**

1. Content packages can run about $400 a month for 40 posts. Top Producer: 50 for $49.99. (86)
2. Paste a listing link. Branded post and caption in your voice in under a minute. (79) †
3. Listing posts only: no stories, replies or DMs. Every listing posted, at every stage. (85)
4. Six post types for Instagram, Facebook and LinkedIn. Edit anything before it posts. (83)

**Paths:** /listing-posts /pricing

**Sitelinks**

- **See Example Posts** (17): Just Listed, Open House, Sold (29) / In your brand and voice (23)
- **Plans and Pricing** (17): Top Producer: 50 posts a month (30) / $49.99 a month, plus tax (24)
- **How It Works** (12): Paste a link, check, schedule (29) / Ready in under a minute (23) †
- **Brand and Voice** (15): Pick a tone, paste past posts (29) / Captions follow your style (26)

**Callouts:** 3 Free Posts, No Card (21) · Cancel Anytime (14) · No Contract to Sign (19) · Data Stored in Canada (21) · Schedule Posts Ahead (20) · Edit Every Word (15)

**Structured snippet:** Just Listed · Open House · Price Reduced · Coming Soon · Sold · Featured Property

**Keywords:** real estate social media manager · real estate virtual assistant social media · realtor social media management cost · outsource real estate social media · listing post service
**Negatives:** jobs · hiring · salary · career · become a · course · training · freelance work

**Test plan:** C is the riskiest and most distinctive angle. Run it against A, and measure paid conversions, not only sign-ups, because the price-led A may attract people who never pay.

---

## 17. The Realtor-Network Broker

**Reader:** an established mortgage broker with 10–30 realtor partners who expect feature sheets. **Plan:** Top Producer, yearly. Pro fits with fewer than about 20 active partners. **CTA button:** Sign Up. **Destination:** `/mortgage-brokers`.

**The honest plan pitch:** sheets, PDFs and Story images are free on every plan. Only the caption for a social post uses a post. Top Producer is for brokers who post a sheet for most partner listings; the Top Producer card says "for high-volume listing agents", so these ads say it fits brokers too.

**Compliance:** no rates, payments or approval language in any ad.

### Angle A: A sheet for every partner listing

**Headline:** A sheet for every partner listing

**Short**
> Mortgage brokers: paste a partner's listing link and get a branded feature sheet with payments at up to four down payments.

**Medium**
> Every partner listing deserves a sheet. Not just the ones you had time for.
>
> Paste the listing link. SocialSpark builds a mortgage feature sheet with your rates, your licence number and payments at up to four down payments.
>
> Building sheets is free. Try it on your next partner listing.

**Long**
> Ten to thirty realtor partners, and each one expects a sheet. Spreadsheet, Canva, PDF, email, for every listing.
>
> With SocialSpark, paste the listing link and the sheet is built:
> → Payments at up to four down payments, with CMHC premiums, property tax and condo fees
> → Canadian maths: semi-annual compounding, the 30-year surcharge, legal minimum down payments raised automatically
> → Your own rates with their "as of" date. The AI never writes the numbers.
> → Your brokerage name and licence number, and an estimates disclaimer, on every sheet
>
> ⟦PROOF⟧
>
> Sheets, PDFs and Story images are free on every plan. Posting them with a caption uses a post: Top Producer gives you 50 a month.
>
> Start free. No credit card.

**Creative:** a finished feature sheet beside the listing link it came from. No rate visible at feed size.

### Angle B: Co-branded with your partners

**Headline:** Sheets co-branded with your realtors

**Short**
> Save a realtor partner once: photo, contact details, QR code to their site. Add them to any sheet in one click.

**Medium**
> Your partners want to share sheets that show their name too.
>
> Save each realtor once with their photo, contact details and a QR code to their website, then co-brand any sheet. Print open-house PDFs in bulk, one page per home.
>
> Building sheets is free. Try it today.

**Long**
> The sheets that get shared are the ones that make your realtor partner look good too.
>
> SocialSpark co-brands every sheet:
> → Save each partner once: photo, contact details, QR code to their website
> → Add them to any sheet in one click (with their permission)
> → Download letter-size PDFs for open houses, several homes at once, one page per home
> → Story images for Instagram and Facebook
> → Your licence number and rate date on every sheet
>
> ⟦PROOF⟧
>
> Sheets, PDFs and Stories are free on every plan. Top Producer covers 50 social posts a month.
>
> Start free. No credit card.

**Creative:** a co-branded sheet showing broker and realtor side by side, plus a printed PDF stack.

### Angle C: Listings come to you

**Headline:** Partners send listings. You send sheets.

**Short**
> Realtors on SocialSpark can send you a listing in one click. Open it and the feature sheet is a minute away.

**Medium**
> Stop chasing partners for listing links.
>
> Realtors who use SocialSpark can send a listing straight to you with "Send to my mortgage broker." Open it, build the sheet with your own rates, and send it back.
>
> Try it free on the next one.

**Long**
> The best referrals start with a realtor sending you a listing.
>
> With SocialSpark:
> → Your partners who use SocialSpark click "Send to my mortgage broker" on any listing
> → You open it and build a feature sheet with your own rates and licence
> → Co-brand it with that realtor, then send it back, post it or print it
>
> Partners who don't use SocialSpark? Paste their listing link yourself. It works the same.
>
> ⟦PROOF⟧
>
> Sheets are free on every plan. Top Producer covers 50 social posts a month for brokers who post every partner listing.
>
> Start free. No credit card.

**Creative:** the "Send to my mortgage broker" button → a broker's inbox → a finished sheet.

**Note:** "the feature sheet is a minute away" in C's short text relies on the site's "under a minute" claim for brokers. Replace it with the measured figure once `⟦TIME⟧` exists.

### Google Search

**Headlines (15)**

1. Mortgage Feature Sheets (23)
2. Feature Sheets From a Link (26)
3. Paste a Link, Get a Sheet (25)
4. Co-Branded With Your Realtors (29)
5. A Sheet for Every Partner (25)
6. Canadian Payment Math Built In (30)
7. CMHC Premiums Calculated (24)
8. Your Licence on Every Sheet (27)
9. Open House PDFs in Bulk (23)
10. Partners Send You Listings (26)
11. Sheets and PDFs Are Free (24)
12. Your Rates, Your As-Of Date (27)
13. For Canadian Mortgage Brokers (29)
14. Try It Free, No Card (20)
15. Top Producer Fits Brokers Too (29)

**Descriptions (4)**

1. Paste a partner's link. Get a branded sheet with payments at up to 4 down payments. (83)
2. CMHC premiums, semi-annual compounding, minimum down payments. AI never writes numbers. (87)
3. Co-brand with saved realtor partners. Print one letter-size PDF per home for open houses. (89)
4. Partners on SocialSpark send you listings in one click. Only social captions use a post. (88)

**Paths:** /mortgage /feature-sheets

**Sitelinks**

- **For Mortgage Brokers** (20): Sheets from a listing link (26) / With your rates and licence (27)
- **See a Feature Sheet** (19): Payments at up to 4 down payments (33) / Taxes and condo fees included (29)
- **Plans and Pricing** (17): Sheets and PDFs free on all plans (33) / Top Producer: 50 posts a month (30)
- **Realtor Partners** (16): Save partners once (18) / Co-brand any sheet (18)

**Callouts:** Sheets Free on All Plans (24) · Letter-Size PDFs (16) · Story Images Included (21) · Québec French Built In (22) · Data Stored in Canada (21) · Licence on Every Sheet (22)

**Structured snippet:** CMHC Premiums · Property Tax · Condo Fees · 30-Year Amortization

**Keywords:** mortgage feature sheet · mortgage broker realtor co-marketing · open house mortgage flyer · mortgage payment flyer for realtors · listing feature sheet
**Negatives:** calculator · best rates · mortgage rates · apply · pre approval · jobs · course · free template

**Test plan:** B against A first. Brokers may value the relationship more than the time saved. Measure cost per first sheet built, then the share of those brokers who post a caption, since that's what moves them to Top Producer.

---

## Overall test plan

1. **Headlines first.** For each persona, run the three angles' headlines with the same primary text. Changing the headline moves results most.
2. **Then the winning angle's copy length:** short against long.
3. **Decision metric:** cost per first generated post, or per first sheet for persona 17. Use at least 30 conversions per variant before calling a winner. For #5 and #13, also track paid conversion.
4. **Keep winners.** A winning ad becomes the control, and challengers must beat it. When frequency rises and CTR falls, change the image or the first line, not the angle.
5. **Label every ad** `persona-angle-length`, for example `p13-C-long`, in the UTM, so results trace back to the appeal.

## Decisions

**Persona 10's plan: Top Producer** (decided 2026-10-23). The earlier condo page draft that highlighted Professional is scrapped. The ads and `PERSONA_PLAN[10]` both say Top Producer.
