import Image from "next/image";
import Link from "next/link";
import { ImportForm } from "@/components/ImportForm";
import { PlatformPostCard } from "@/components/hero/PlatformPostCard";
import { SAME_LISTING_POSTS } from "@/components/hero/demo-posts";
import { PricingSummary } from "./PricingSummary";
import { CompareTable, EYEBROW, FaqList, FeatureGrid, H2, RulesPanel, Scenario, Summary, WRAP } from "./HomeBlocks";
import { FAQ } from "@/lib/faq";
import { FREE_LIMITS } from "@/lib/plans";

const STEPS = [
  {
    title: "Paste a listing link",
    body: "SocialSpark pulls in the price, details and photos from a brokerage or agent website. No typing.",
    image: "/landing/step-1-import-v3.webp",
    alt: "SocialSpark listing page showing imported photos, price and property details",
  },
  {
    title: "Choose your post",
    body: "Pick the platform, post type and language: English, Québec French or both.",
    image: "/landing/step-2-create-v3.webp",
    alt: "Create a post panel with platform, format, language and post type options",
  },
  {
    title: "Publish or schedule",
    body: "Get branded images and a caption in your voice in under a minute. Edit, then post or schedule.",
    image: "/landing/step-3-publish-v3.webp",
    alt: "Post editor with a branded Instagram slide, caption and Publish now and Schedule buttons",
  },
];

const FEATURES = [
  {
    kicker: "6 post types",
    title: "Every stage of the listing",
    body: "Coming Soon, Just Listed, Open House, Price Reduced, Sold and Featured Property, all from the same link.",
  },
  {
    kicker: "Your brand",
    title: "Your name on every image",
    body: "Your name, brokerage and contact details on the images, in your colours, so every post is clearly yours.",
  },
  {
    kicker: "Your voice",
    title: "Captions that sound like you",
    body: "Pick a tone and paste a few of your past posts. SocialSpark follows your style, and you can edit every word.",
  },
  {
    kicker: "Québec French",
    title: "Written in French, not translated",
    body: "Posts in English, Québec French or both, written the way a Québec agent would write them (“Nouvelle inscription”, “649 000 $”).",
  },
  {
    kicker: "The listing photos",
    title: "The sharpest shot on the cover",
    body: "SocialSpark looks at the listing photos and keeps low-resolution ones off the cover. Or upload your own.",
  },
  {
    kicker: "Publish or schedule",
    title: "Posted from the same screen",
    body: "Connect Instagram, Facebook and LinkedIn, then publish now or pick a time. Or download the images and caption.",
  },
  {
    kicker: "Virtual tours",
    title: "The tour link, placed right",
    body: "A clickable link on Facebook and LinkedIn. On Instagram, where links don't work, a line asking people to DM you for it.",
  },
  {
    kicker: "Free edits",
    title: "Change it as often as you like",
    body: "Edits, downloads and publishing never use your allowance, and a post that fails to generate never counts.",
  },
  {
    kicker: "Stored in Canada",
    title: "Your listings stay yours",
    body: "Your account and listings are stored in Canada, and we never sell your data.",
  },
];

/** The rest of the landing page for new visitors, below the hero. */
export function LandingSections() {
  return (
    <>
      <Summary
        text="SocialSpark is a web app for Canadian realtors. Paste the link to a listing on a brokerage or agent website, and it writes the Instagram, Facebook and LinkedIn posts for it: branded images made from the listing photos and a caption in your voice, in English, Québec French or both. You review the post, then publish it or schedule it."
        chips={["Nothing posts without your click", `${FREE_LIMITS.registered} free posts, no credit card`, "Cancel anytime", "Data stored in Canada"]}
      />

      {/* How it works */}
      <section className={WRAP} aria-labelledby="how-it-works">
        <div className="mx-auto max-w-3xl text-center">
          <p className={EYEBROW}>How it works</p>
          <h2 id="how-it-works" className={H2}>
            From listing link to ready-to-post in under a minute.
          </h2>
        </div>
        <ol className="mt-12 grid gap-6 sm:mt-16 md:grid-cols-3 lg:gap-8">
          {STEPS.map((s, i) => (
            <li key={s.title} className="flex flex-col rounded-3xl bg-[#eeebe4] p-4 sm:p-5">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-white shadow-[0_14px_36px_-18px_rgba(15,42,68,0.45)] ring-1 ring-black/5">
                <Image src={s.image} alt={s.alt} fill sizes="(min-width: 768px) 30vw, 92vw" className="object-cover object-top" />
              </div>
              <div className="px-1 pb-2 pt-5">
                <div className="flex items-center gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#141414] text-sm font-semibold text-white">{i + 1}</span>
                  <h3 className="font-[family-name:var(--font-heading)] text-xl font-semibold tracking-[-0.02em] text-[#141414]">{s.title}</h3>
                </div>
                <p className="mt-3 leading-relaxed text-[#141414]/70">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* One listing, three platforms */}
      <section className="bg-[#0f2a44] py-20 text-white sm:py-28" aria-labelledby="built-for">
        <div className={WRAP}>
          <div className="max-w-4xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d4a24c] sm:text-xs">Built for Canadian real estate</p>
            <h2 id="built-for" className="mt-3 font-[family-name:var(--font-heading)] tracking-[-0.02em] text-3xl font-medium leading-tight sm:text-5xl">
              One listing. Three platforms. Each written the way it should be.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-white/70">
              A generic writing tool gives you one caption. SocialSpark writes an Instagram carousel with a reason to swipe, a local Facebook post with up to 20 photos and a
              LinkedIn update for referral partners, each with images sized and designed for that platform.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {SAME_LISTING_POSTS.map((p) => (
              <div key={p.id}>
                <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/60">
                  {p.platform === "instagram" ? "Instagram" : p.platform === "facebook" ? "Facebook" : "LinkedIn"}
                </p>
                <PlatformPostCard post={p} captionLines={5} className="mx-auto max-w-[380px] text-[12px]" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <FeatureGrid id="whats-included" eyebrow="What you get" heading="Everything a listing post needs, from one link." items={FEATURES} />

      <Scenario
        id="now-what"
        heading="The listing went live today. It's 9 p.m. Now what?"
        today="Download the photos. Open a template. Retype the price, the address and the room count. Write a caption, then rewrite it for Facebook and again for LinkedIn. Resize everything for Instagram. Then do it all again on Saturday for the open house."
        withUs="Paste the listing link and pick Just Listed. Read the caption, change a word if you want, and schedule it for 8 a.m. On Saturday, open the same listing and pick Open House. The details, photos and your branding are already there."
        cta="See your listing as a post"
      />

      <RulesPanel
        id="rules"
        eyebrow="Canadian rules, written in"
        heading="Rules you don't have to remember."
        sub="Every caption is written to the advertising rules Canadian agents work under. You still read every post before it goes out, and nothing posts until you click."
        points={[
          { title: "Your brokerage, every time", body: "Each caption ends with your name and brokerage. On another brokerage's listing it adds “Listing courtesy of” and their name." },
          { title: "The home, never the buyer", body: "Captions describe the property, never who should live there, so no “perfect for young families”. Human rights codes prohibit it." },
          { title: "Sold posts with consent", body: "A Sold post needs your confirmation of written consent to advertise the sale, and shows the price only if both parties agreed. Someone else's sale becomes a market update." },
          { title: "No invented urgency", body: "No “won't last”, no “multiple offers expected”, no “guaranteed” and no claims about future value. Urgency comes only from real dates and prices." },
        ]}
        card={{
          title: "Checked on every post",
          items: [
            "Your name and brokerage on the caption",
            "“Listing courtesy of” on others' listings",
            "Describes the home, not the buyer",
            "Sold posts only with written consent",
            "No made-up urgency or guarantees",
            "Instagram hashtags capped at 5, Instagram's limit",
          ],
          note: "SocialSpark helps you follow the rules; it doesn't replace your own review or your regulator's guidance.",
        }}
      />

      <CompareTable
        id="compare"
        heading="SocialSpark or a template and a chatbot?"
        theirs="Template + chatbot"
        rows={[
          { label: "A finished post", ours: "Under a minute from the link", theirs: "Template, retyping, prompting, pasting" },
          { label: "Listing details", ours: "Read from the listing page", theirs: "Copied in by hand" },
          { label: "Instagram, Facebook, LinkedIn", ours: "Written and sized for each", theirs: "One caption, resized by hand" },
          { label: "Your brand", ours: "Same name, brokerage and colours every time", theirs: "Rebuilt in every template" },
          { label: "Québec French", ours: "Written in Québec French, or bilingual", theirs: "Translated, then checked" },
          { label: "Fair-housing wording", ours: "Describes the home, never the buyer", theirs: "Up to whoever checks" },
          { label: "Sold posts", ours: "No price without both parties' consent", theirs: "Up to you to remember" },
          { label: "Posting", ours: "Publish or schedule from the same screen", theirs: "Download, then post in each app" },
        ]}
      />

      {/* Pricing, FAQ, final call to action */}
      <section className={WRAP} aria-labelledby="pricing-summary">
        <PricingSummary />

        <Link
          href="/mortgage-brokers"
          className="mx-auto mt-14 flex max-w-3xl flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#0f2a44] px-6 py-5 text-white transition hover:bg-[#0b2035]"
        >
          <span>
            <span className="block font-semibold">Mortgage broker?</span>
            <span className="text-sm text-white/75">Turn listings into branded mortgage feature sheets with your rates and licence.</span>
          </span>
          <span className="font-semibold text-[#d4a24c]">See feature sheets →</span>
        </Link>

        <div className="mt-24">
          <FaqList id="faq" heading="Questions agents ask" items={FAQ} />
        </div>

        <div className="mt-24 rounded-3xl bg-[#eeebe4] px-5 py-12 text-center sm:px-10 sm:py-16">
          <h2 className="font-[family-name:var(--font-heading)] tracking-[-0.02em] text-3xl font-medium text-[#141414] sm:text-5xl">Your next listing post is one link away.</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-[#141414]/70">Paste a listing link and see your first post in under a minute.</p>
          <div className="mx-auto mt-8 max-w-2xl text-left">
            <ImportForm />
          </div>
        </div>
      </section>
    </>
  );
}
