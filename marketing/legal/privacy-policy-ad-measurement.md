# Privacy policy section: Advertising cookies and measurement (SocialSpark)

Add this as a new section of the Kima Technologies privacy policy at usekima.com/privacy. Drafted 2026-10-24 to match the SocialSpark code (`src/components/ConsentBanner.tsx`, `src/components/MetaPixel.tsx`, `src/app/api/track/signup/route.ts`). Not legal advice: have counsel check it, and publish a French version (reviewed by a native Québec French speaker) alongside it.

Fill in the two placeholders: [NAME, TITLE] and, if different, the contact email.

---

## Advertising cookies and measurement on SocialSpark

We advertise SocialSpark on Facebook and Instagram. To learn which of our ads bring people to SocialSpark, and to help Meta show our ads to people likely to find them useful, the SocialSpark website (socialspark.usekima.com) can use Meta's advertising tools. **We only use them if you agree.**

### Your choice

When you first visit SocialSpark, we ask whether we may use advertising cookies. You can choose **Allow** or **No thanks**; both are equally easy, and SocialSpark works the same either way.

- **If you choose No thanks, or don't choose:** no advertising cookies are set, the Meta Pixel is not loaded, and we send nothing about your visit or your account to Meta.
- **If you choose Allow:** we use the tools described below.

We remember your choice in a cookie called `ss_consent` for one year. You can change your mind at any time with **Cookie settings** at the bottom of every SocialSpark page. If you withdraw your consent, the page reloads and the Meta Pixel stops loading from then on. Cookies that Meta has already set stay in your browser until they expire or you clear them.

### What we use, and what is shared, if you allow it

**1. Meta Pixel (in your browser).** A piece of code from Meta Platforms, Inc. that records which SocialSpark pages you visit, when you make your first post, and when you create an account. Meta receives your browser's information (such as IP address, browser type and device), the page address, and Meta's own cookies (`_fbp`, `_fbc`), which can link your visit to an ad you clicked on Facebook or Instagram.

**2. Meta Conversions API (from our server).** When you make your first post (even as a guest, before you have an account) and when you create a SocialSpark account, our server also tells Meta, so the count is accurate even if an ad blocker stopped the Pixel. We send:
- your email address (once you have an account) and your SocialSpark account ID, **hashed** (turned into a one-way code with SHA-256) before they leave our server, so Meta can match them to a Meta account but we don't send them in readable form;
- your IP address and browser information;
- Meta's click and browser identifiers (`_fbc`, `_fbp`), if present;
- for a first post: the type of post and the platform it was made for, and whether you were a guest; for an account: the page where you signed up and whether you chose "Realtor" or "Mortgage broker";
- which of our ads and landing pages brought you (the campaign and ad names in the link).

The browser and server messages carry the same event ID, so Meta counts each one once.

**3. Which ad brought you (our own records).** When you arrive from one of our ads, the link carries labels such as `utm_campaign` and `utm_content`, and sometimes Meta's click ID (`fbclid`). Before you choose, these stay only in your browser tab and are not sent anywhere. If you allow advertising cookies, we keep them in a cookie called `ss_attr` for up to 90 days, and when you create an account we save them with your account (the landing page, the ad labels, the click ID and the time you arrived). We use this only to see which ads and pages lead to sign-ups.

We do not send Meta the content of your listings, posts, captions, feature sheets or brand settings, and we never sell your personal information.

### Why we do this

- To measure which ads, pages and messages lead people to create an account, so we spend our advertising budget on what works.
- To let Meta optimise delivery of our ads and build audiences of people similar to those who sign up. Meta uses the information it receives under its own [Business Tools Terms](https://www.facebook.com/legal/terms/businesstools) and [Privacy Policy](https://www.facebook.com/privacy/policy). You can see and control how businesses share activity with Meta in your Facebook or Instagram settings, under **Your activity off Meta technologies**.

### Where it goes and how long we keep it

Your SocialSpark account and listings are stored in Canada. Information sent to Meta is processed by Meta Platforms, Inc. and its affiliates, including in the United States, where it may be accessible to authorities under the laws there.

| What | How long |
|---|---|
| `ss_consent` (your choice) | 1 year |
| `ss_attr` (which ad brought you) | up to 90 days, in your browser |
| Ad information saved with your account | as long as your account exists; deleted when you delete your account |
| Meta's cookies (`_fbp`, `_fbc`) and data Meta receives | set by Meta's own terms |

### Questions and your rights

You can ask us what personal information we hold about you, ask us to correct it, or withdraw your consent at any time. The person in charge of the protection of personal information at Kima Technologies Inc. is Uche Emeni, Founder, uche@usekima.com.

If you're not satisfied with our answer, you can contact the Office of the Privacy Commissioner of Canada, or, if you live in Québec, the Commission d'accès à l'information du Québec.
