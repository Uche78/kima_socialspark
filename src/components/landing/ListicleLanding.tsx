import Image from "next/image";
import { Fragment } from "react";
import { ImportForm } from "@/components/ImportForm";
import { PlatformPostCard } from "@/components/hero/PlatformPostCard";
import { DEMO_POSTS as DEMO_POSTS_SD, SAME_LISTING_POSTS as SAME_LISTING_POSTS_SD, hdPost, localizedPost } from "@/components/hero/demo-posts";
import { PricingSummary } from "./PricingSummary";
import { SheetExample } from "./SheetExample";
import { FREE_LIMITS, PAID_PLANS, PLAN_FEATURES, PLAN_FEATURES_FR } from "@/lib/plans";
import { LANDING_TEXT, type Locale } from "@/lib/landing-i18n";
import type { Language } from "@/lib/types";
import { PERSONA_PLAN, type ListiclePage, type ReasonVisual } from "@/lib/persona-pages";

const WRAP = "mx-auto w-full min-w-0 max-w-[1600px] px-4 lg:w-[90%] lg:px-0";
const NARROW = "mx-auto w-full min-w-0 max-w-6xl px-4";
const EYEBROW = "text-[11px] font-semibold uppercase tracking-[0.2em] text-[#141414]/70 sm:text-xs";
const H2 = "font-[family-name:var(--font-heading)] text-3xl font-medium leading-tight tracking-[-0.02em] text-[#141414] sm:text-5xl";

const SCREENS = {
  1: { src: "/landing/step-1-import-v3.webp", width: 722, height: 1060, alt: { en: "SocialSpark listing page showing imported photos, price and property details", fr: "Page d'inscription dans SocialSpark avec les photos, le prix et les détails importés" } },
  2: { src: "/landing/step-2-create-v3.webp", width: 1400, height: 1052, alt: { en: "Create a post panel with platform, format, language and post type options", fr: "Panneau de création avec la plateforme, le format, la langue et le type de publication" } },
  3: { src: "/landing/step-3-publish-v3.webp", width: 1400, height: 1050, alt: { en: "Post editor with a branded Instagram slide, caption and Publish now and Schedule buttons", fr: "Éditeur avec une image Instagram à votre image, le texte et les boutons Publish now et Schedule" } },
} as const;

const PLATFORM = { instagram: "Instagram", facebook: "Facebook", linkedin: "LinkedIn" } as const;
// Posts here are drawn up to 400px wide, so they use the 1024px photos (sharp on retina screens).
const DEMO_POSTS = DEMO_POSTS_SD.map(hdPost);
const SAME_LISTING_POSTS = SAME_LISTING_POSTS_SD.map(hdPost);
const byId = Object.fromEntries(DEMO_POSTS.map((p) => [p.id, p]));

/**
 * The listicle landing page (src/lib/persona-pages.ts, layout "listicle"): a big "N reasons" promise with the
 * import form, numbered reasons backed by real product output, proof, a comparison with doing it by hand,
 * the offer package around the persona's plan (PERSONA_PLAN), pricing, objections and a close.
 */
export function ListicleLanding({ page }: { page: ListiclePage }) {
  const role = page.audience === "broker" ? "mortgage_broker" : undefined;
  const plan = PERSONA_PLAN[page.persona];
  const { hero, reasons, proof, comparison, offer, objections, close } = page;
  const locale = page.locale ?? "en";
  const T = LANDING_TEXT[locale].page;
  // Example posts in the page's language (French and bilingual posts are written like SocialSpark writes them).
  const demoLanguage = page.demoLanguage ?? locale;
  const examples = DEMO_POSTS.map((p) => localizedPost(p, demoLanguage));
  const cta = (
    <div className="flex justify-center">
      <a href="#start" className="inline-flex h-12 items-center justify-center rounded-full bg-[#141414] px-7 font-medium text-white transition hover:bg-black">
        {page.cta} →
      </a>
    </div>
  );

  return (
    <div className="space-y-24 sm:space-y-32">
      {/* The promise */}
      <section className={WRAP}>
        <div className="grid items-center gap-10 overflow-hidden rounded-3xl bg-[#eeebe4] px-5 py-10 sm:px-10 sm:py-14 lg:grid-cols-[1.2fr_1fr] lg:px-[5%]">
          <div>
            <p className="inline-flex rounded-full bg-[#0f2a44] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d4a24c] sm:text-xs">{hero.eyebrow}</p>
            <h1 className="mt-5 font-[family-name:var(--font-heading)] text-[clamp(1.9rem,8vw,2.4rem)] font-medium leading-[1.1] tracking-[-0.02em] text-[#000103]/90 [overflow-wrap:anywhere] sm:text-5xl 2xl:text-6xl">
              {hero.headline}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[#141414]/70 sm:text-lg">{hero.sub}</p>
            <div id="start" className="mt-8 max-w-xl scroll-mt-28">
              <ImportForm role={role} locale={locale} />
            </div>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#141414]/65">
              {/* The risk reversal under the hero form: always true, always from the code. */}
              {T.trust(FREE_LIMITS.registered).map((t) => (
                <li key={t} className="flex gap-1.5">
                  <span className="text-[#d4a24c]">✓</span>
                  {t}
                </li>
              ))}
            </ul>
            {proof.stats.length > 0 && (
              <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-t border-black/10 pt-6">
                {proof.stats.map((s) => (
                  <div key={s.label}>
                    <dt className="sr-only">{s.label}</dt>
                    <dd className="font-[family-name:var(--font-heading)] text-3xl font-medium tracking-[-0.02em] text-[#0f2a44]">{s.value}</dd>
                    <dd className="text-sm text-[#141414]/65">{s.label}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
          <div className="mx-auto w-full max-w-[400px]">
            {page.audience === "broker" ? <SheetExample hd /> : <PlatformPostCard post={localizedPost((page.heroPost && byId[page.heroPost]) || SAME_LISTING_POSTS[0], demoLanguage)} captionLines={5} />}
          </div>
        </div>
      </section>

      {/* The reasons */}
      <section className={NARROW} aria-label={T.reasons(reasons.length)}>
        <ol className="space-y-20 sm:space-y-28">
          {reasons.map((r, i) => (
            <Fragment key={r.title}>
              <li className={r.visual ? "grid items-center gap-8 md:grid-cols-2 md:gap-14" : "mx-auto max-w-3xl"}>
                <div className={r.visual && i % 2 === 1 ? "md:order-2" : ""}>
                  <p className="flex items-baseline gap-3">
                    <span className="font-[family-name:var(--font-heading)] text-4xl font-semibold tracking-[-0.02em] text-[#d4a24c] sm:text-5xl">{String(i + 1).padStart(2, "0")}</span>
                    <span className={EYEBROW}>{r.label}</span>
                  </p>
                  <h2 className="mt-3 font-[family-name:var(--font-heading)] text-2xl font-medium leading-tight tracking-[-0.02em] text-[#141414] sm:text-4xl">{r.title}</h2>
                  <p className="mt-4 text-lg leading-relaxed text-[#141414]/70">{r.body}</p>
                </div>
                {r.visual && <Visual visual={r.visual} highlight={plan.highlight} locale={locale} demoLanguage={demoLanguage} />}
              </li>
              {(i === 2 || i === 5) && i < reasons.length - 1 && <li className="list-none">{cta}</li>}
            </Fragment>
          ))}
        </ol>
      </section>

      {/* Proof: real customers when we have them, real output always */}
      <section className="bg-[#0f2a44] py-20 text-white sm:py-28" aria-labelledby="listicle-proof">
        <div className={WRAP}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d4a24c] sm:text-xs">{T.proof}</p>
          <h2 id="listicle-proof" className="mt-3 font-[family-name:var(--font-heading)] text-3xl font-medium leading-tight tracking-[-0.02em] sm:text-5xl">{proof.heading}</h2>

          {proof.testimonials.length > 0 && (
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {proof.testimonials.map((t) => (
                <figure key={t.name} className="flex flex-col rounded-3xl bg-white p-6 text-[#141414]">
                  <p className="text-[#d4a24c]" aria-hidden>“</p>
                  <blockquote className="flex-1 text-lg leading-relaxed">{t.quote}</blockquote>
                  <figcaption className="mt-6 flex items-center gap-3">
                    {t.photo && <Image src={t.photo} alt="" width={44} height={44} className="h-11 w-11 rounded-full object-cover" />}
                    <span>
                      <span className="block font-semibold">{t.name}</span>
                      <span className="text-sm text-[#141414]/60">
                        {t.role}, {t.brokerage} · {t.city}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}

          {proof.founder && (
            <div className="mt-12 flex max-w-4xl flex-col gap-6 rounded-3xl bg-white/5 p-6 ring-1 ring-white/15 sm:flex-row sm:items-center sm:p-8">
              {proof.founder.photo && <Image src={proof.founder.photo} alt={proof.founder.name} width={112} height={112} className="h-28 w-28 shrink-0 rounded-full object-cover" />}
              <div>
                <p className="text-lg leading-relaxed text-white/85">{proof.founder.story}</p>
                <p className="mt-4 font-semibold">
                  {proof.founder.name} <span className="font-normal text-white/60">· {proof.founder.role}</span>
                </p>
              </div>
            </div>
          )}

          <p className="mt-12 text-sm text-white/60">{T.examples}</p>
          <div className="mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none]">
            {examples.map((p) => (
              <div key={p.id} className="w-[230px] shrink-0 snap-start">
                <PlatformPostCard post={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison with the reader's current way */}
      <section className={NARROW} aria-labelledby="listicle-compare">
        <h2 id="listicle-compare" className={`${H2} text-center`}>{comparison.heading}</h2>
        <div className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-3xl bg-white ring-1 ring-black/10">
          {/* On phones each row is a 2-column grid with its label spanning above the answers, so the
              answers get half the width instead of a third; from sm up it's a regular table. */}
          <table className="block w-full text-left text-sm sm:table sm:text-base">
            <thead className="block sm:table-header-group">
              <tr className="grid grid-cols-2 border-b border-black/10 sm:table-row">
                <th scope="col" className="hidden p-4 font-medium text-[#141414]/60 sm:table-cell sm:p-5"><span className="sr-only">{T.compared}</span></th>
                <th scope="col" className="bg-[#0f2a44] p-4 font-semibold text-white sm:p-5">{comparison.ours}</th>
                <th scope="col" className="p-4 font-semibold text-[#141414]/70 sm:p-5">{comparison.theirs}</th>
              </tr>
            </thead>
            <tbody className="block sm:table-row-group">
              {comparison.rows.map((r) => (
                <tr key={r.label} className="grid grid-cols-2 border-b border-black/5 last:border-0 sm:table-row">
                  <th scope="row" className="col-span-2 px-4 pt-4 pb-2 align-top font-semibold text-[#141414] sm:table-cell sm:p-5 sm:font-medium">{r.label}</th>
                  <td className="bg-[#0f2a44]/[0.04] p-4 pt-3 align-top text-[#141414] sm:p-5">
                    {/* A row SocialSpark deliberately doesn't do gets a dash, not a tick. */}
                    <span className={`mr-1.5 ${r.oursNo ? "text-[#141414]/40" : "text-[#d4a24c]"}`}>{r.oursNo ? "–" : "✓"}</span>
                    {r.ours}
                  </td>
                  <td className="p-4 pt-3 align-top text-[#141414]/60 sm:p-5">{r.theirs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* The offer package, then the plans with theirs highlighted */}
      <section id="pricing" className={`${WRAP} scroll-mt-24`} aria-labelledby="pricing-summary">
        <div className="mx-auto mb-16 max-w-4xl rounded-3xl bg-[#eeebe4] p-6 sm:p-10">
          <p className={EYEBROW}>{T.offer}</p>
          <h2 className="mt-3 font-[family-name:var(--font-heading)] text-2xl font-medium tracking-[-0.02em] text-[#141414] sm:text-4xl">{offer.heading}</h2>
          <p className="mt-3 text-lg text-[#141414]/70">{offer.sub}</p>
          <ul className="mt-6 grid gap-2.5 text-[#141414]/85 sm:grid-cols-2">
            {[...offerAllowance(plan.highlight, locale), ...(locale === "fr" ? PLAN_FEATURES_FR : PLAN_FEATURES).filter((_, i) => page.audience === "broker" || i !== PLAN_FEATURES.length - 1), ...T.extras].map((l) => (
              <li key={l} className="flex gap-2">
                <span className="text-[#d4a24c]">✓</span>
                {l}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-2 border-t border-black/10 pt-6">
            {T.guarantees(FREE_LIMITS.registered).map((g) => (
              <span key={g} className="rounded-full bg-white px-3 py-1.5 text-sm font-medium text-[#141414] ring-1 ring-black/10">{g}</span>
            ))}
          </div>
        </div>
        <PricingSummary highlight={plan.highlight} initialInterval={plan.interval} fit={page.planFit} locale={locale} />
      </section>

      {/* Objections */}
      <section className={WRAP} aria-labelledby="listicle-faq">
        <div className="mx-auto max-w-3xl">
          <h2 id="listicle-faq" className="text-center font-[family-name:var(--font-heading)] text-3xl font-medium tracking-[-0.02em] text-[#141414] sm:text-4xl">{objections.heading}</h2>
          <div className="mt-8 divide-y divide-border border-y border-border">
            {objections.items.map((f) => (
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
      </section>

      {/* Close */}
      <section className={WRAP}>
        <div className="rounded-3xl bg-[#eeebe4] px-5 py-12 text-center sm:px-10 sm:py-16">
          <h2 className={H2}>{close.heading}</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-[#141414]/70">{close.sub}</p>
          <div className="mx-auto mt-8 max-w-2xl text-left">
            <ImportForm role={role} locale={locale} />
          </div>
        </div>
      </section>
    </div>
  );
}

/** The highlighted plan's monthly allowance, from plans.ts. */
function offerAllowance(highlight: (typeof PERSONA_PLAN)[number]["highlight"], locale: Locale) {
  const T = LANDING_TEXT[locale].page;
  if (highlight === "team") return [T.teamAllowance];
  const p = PAID_PLANS[highlight];
  return [T.allowance(p.name, p.posts, p.regens)];
}

function Visual({ visual, highlight, locale, demoLanguage }: { visual: ReasonVisual; highlight: (typeof PERSONA_PLAN)[number]["highlight"]; locale: Locale; demoLanguage: Language }) {
  const T = LANDING_TEXT[locale];
  const language = ("language" in visual && visual.language) || demoLanguage;
  switch (visual.kind) {
    case "screen": {
      const s = SCREENS[visual.step];
      // Whole screenshot, uncropped: the tall import screen sits narrower so it doesn't tower over the text.
      return (
        <div className="rounded-3xl bg-[#eeebe4] p-4 sm:p-6">
          <Image
            src={s.src}
            alt={s.alt[locale]}
            width={s.width}
            height={s.height}
            sizes={s.height > s.width ? "340px" : "(min-width: 1280px) 560px, (min-width: 768px) 45vw, 92vw"}
            className={`mx-auto h-auto w-full rounded-2xl bg-white shadow-[0_24px_60px_-24px_rgba(15,42,68,0.5)] ring-1 ring-black/5 ${s.height > s.width ? "max-w-[340px]" : ""}`}
          />
        </div>
      );
    }
    case "posts":
      return (
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto rounded-3xl bg-[#eeebe4] p-4 [scrollbar-width:none] sm:p-5">
          {visual.ids.map((id) => (
            <div key={id} className="w-[200px] shrink-0 snap-start">
              <PlatformPostCard post={localizedPost(byId[id], language)} />
            </div>
          ))}
        </div>
      );
    case "platforms":
      return (
        // Phones: one platform at a time, swiped sideways (the next card peeks in). Wider: all three side by side.
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto rounded-3xl bg-[#0f2a44] p-4 [scrollbar-width:none] md:grid md:grid-cols-3 md:overflow-visible md:p-5">
          {SAME_LISTING_POSTS.map((p) => localizedPost(p, language)).map((p) => (
            <div key={p.id} className="w-[80%] min-w-0 shrink-0 snap-center md:w-auto">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/60">{PLATFORM[p.platform]}</p>
              <PlatformPostCard post={p} className="md:text-[10px]" />
            </div>
          ))}
        </div>
      );
    case "sheet":
      return (
        <div className="mx-auto w-full max-w-[420px]">
          <SheetExample hd />
        </div>
      );
    case "plan": {
      if (highlight === "team") return null;
      const p = PAID_PLANS[highlight];
      return (
        <div className="mx-auto w-full max-w-sm rounded-3xl bg-white p-8 ring-2 ring-[#0f2a44]">
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold text-[#141414]">{p.name}</p>
            <span className="rounded-full bg-[#0f2a44] px-2.5 py-0.5 text-xs font-semibold text-white">{T.pricing.mostPopular}</span>
          </div>
          <p className="mt-4 font-[family-name:var(--font-heading)] text-5xl font-medium tracking-[-0.02em] text-[#141414]">{p.posts}</p>
          <p className="text-[#141414]/60">
            {T.page.planPosts} {p.regens} {T.page.planRegens}
          </p>
          <p className="mt-4 text-sm text-[#141414]/70">
            {locale === "fr" ? LANDING_TEXT.fr.pricing.forWho[highlight] : p.forWho}. {T.page.everyFeature}
          </p>
          <a href="#pricing" className="mt-6 inline-flex text-sm font-medium text-[#141414] underline underline-offset-4">{T.page.seePrice}</a>
        </div>
      );
    }
  }
}
