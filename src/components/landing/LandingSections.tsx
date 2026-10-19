import Image from "next/image";
import Link from "next/link";
import { ImportForm } from "@/components/ImportForm";
import { PlatformPostCard } from "@/components/hero/PlatformPostCard";
import { SAME_LISTING_POSTS } from "@/components/hero/demo-posts";
import { FREE_LIMITS, PAID_PLANS } from "@/lib/plans";
import { FAQ } from "@/lib/faq";

const WRAP = "mx-auto w-full min-w-0 max-w-[1600px] px-4 lg:w-[90%] lg:px-0";
const EYEBROW = "text-[11px] font-semibold uppercase tracking-[0.2em] text-[#141414]/70 sm:text-xs";
const H2 = "mt-3 font-[family-name:var(--font-heading)] tracking-[-0.02em] text-3xl font-medium leading-tight text-[#141414] sm:text-5xl";

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

const BENEFITS = [
  {
    title: "Québec French and bilingual posts",
    body: "Written the way a Québec agent would write it (“Nouvelle inscription”, “649 000 $”), not translated word for word.",
  },
  {
    title: "Your brand on every post",
    body: "Your name, brokerage and contact details on the images, in your colours. Helps you follow advertising rules like showing your brokerage.",
  },
  {
    title: "Made for each platform",
    body: "Instagram carousels that make people swipe, Facebook albums of up to 20 photos, and LinkedIn posts written for referral partners.",
  },
  {
    title: "Sounds like you",
    body: "Pick a tone and add a few of your past posts. Every caption follows your style, and it never describes the “ideal buyer”, which human rights codes prohibit.",
  },
];


/** The rest of the landing page for new visitors: how it works, why SocialSpark, pricing, FAQ and a final call to action. */
export function LandingSections() {
  return (
    <>
      {/* 1. How it works */}
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

      {/* 2. Built for Canadian real estate */}
      <section className="bg-[#0f2a44] py-20 text-white sm:py-28" aria-labelledby="built-for">
        <div className={WRAP}>
          <div className="max-w-4xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d4a24c] sm:text-xs">Built for Canadian real estate</p>
            <h2 id="built-for" className="mt-3 font-[family-name:var(--font-heading)] tracking-[-0.02em] text-3xl font-medium leading-tight sm:text-5xl">
              One listing. Three platforms. Each written the way it should be.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-white/70">
              A generic AI tool gives you one caption. SocialSpark writes a scroll-stopping Instagram carousel, a local Facebook post and a
              professional LinkedIn update, each with images sized and designed for that platform.
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

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((b) => (
              <div key={b.title} className="border-t border-white/15 pt-5">
                <h3 className="font-semibold">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Pricing, FAQ, final call to action */}
      <section className={WRAP} aria-labelledby="pricing-summary">
        <div className="mx-auto max-w-3xl text-center">
          <p className={EYEBROW}>Pricing</p>
          <h2 id="pricing-summary" className={H2}>
            Try {FREE_LIMITS.registered} posts free. No credit card.
          </h2>
          <p className="mt-4 text-lg text-[#141414]/70">Upgrade when you&apos;re ready. Both plans include every feature. Prices in CAD, plus tax.</p>
        </div>
        <div className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-3">
          <PlanCard name="Free" price="$0" note="One-time" lines={[`${FREE_LIMITS.registered} posts to try it out`, "Every platform and language", "No credit card needed"]} />
          <PlanCard
            name={PAID_PLANS.starter.name}
            price={PAID_PLANS.starter.price}
            note="per month"
            lines={[`${PAID_PLANS.starter.posts} new posts a month`, `${PAID_PLANS.starter.regens} regenerations a month`, "Unlimited edits and publishing"]}
          />
          <PlanCard
            name={PAID_PLANS.professional.name}
            price={PAID_PLANS.professional.price}
            note="per month"
            highlight
            lines={[`${PAID_PLANS.professional.posts} new posts a month`, `${PAID_PLANS.professional.regens} regenerations a month`, "Unlimited edits and publishing"]}
          />
        </div>
        <p className="mt-6 text-center">
          <Link href="/pricing" className="text-sm font-medium text-[#141414] underline underline-offset-4">
            Compare plans in detail
          </Link>
        </p>

        <div className="mx-auto mt-24 max-w-3xl">
          <h2 className="text-center font-[family-name:var(--font-heading)] tracking-[-0.02em] text-3xl font-medium text-[#141414] sm:text-4xl">Questions agents ask</h2>
          <div className="mt-8 divide-y divide-border border-y border-border">
            {FAQ.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium text-[#141414] [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="text-2xl leading-none text-[#141414]/40 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 leading-relaxed text-[#141414]/70">{f.a}</p>
              </details>
            ))}
          </div>
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

function PlanCard({ name, price, note, lines, highlight }: { name: string; price: string; note: string; lines: string[]; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl bg-white p-6 ring-1 ${highlight ? "ring-2 ring-[#0f2a44]" : "ring-black/10"}`}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-[#141414]">{name}</h3>
        {highlight && <span className="rounded-full bg-[#0f2a44] px-2.5 py-0.5 text-xs font-semibold text-white">Most popular</span>}
      </div>
      <p className="mt-3">
        <span className="font-[family-name:var(--font-heading)] tracking-[-0.02em] text-4xl text-[#141414]">{price}</span>
        <span className="text-sm text-[#141414]/60"> {note}</span>
      </p>
      <ul className="mt-5 space-y-2 text-sm text-[#141414]/80">
        {lines.map((l) => (
          <li key={l} className="flex gap-2">
            <span className="text-[#d4a24c]">✓</span>
            {l}
          </li>
        ))}
      </ul>
    </div>
  );
}
