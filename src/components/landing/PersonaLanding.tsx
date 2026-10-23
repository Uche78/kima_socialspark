import { ImportForm } from "@/components/ImportForm";
import { HeroShowcase } from "@/components/hero/HeroShowcase";
import { PricingSummary } from "./PricingSummary";
import { SheetExample } from "./SheetExample";
import { PERSONA_PLAN, type SectionsPage } from "@/lib/persona-pages";

const WRAP = "mx-auto w-full min-w-0 max-w-[1600px] px-4 lg:w-[90%] lg:px-0";
const EYEBROW = "text-[11px] font-semibold uppercase tracking-[0.2em] text-[#141414]/70 sm:text-xs";
const H1 = "mt-4 font-[family-name:var(--font-heading)] text-[clamp(1.9rem,8vw,2.4rem)] font-medium leading-[1.1] tracking-[-0.02em] text-[#000103]/90 [overflow-wrap:anywhere] sm:text-6xl lg:text-[3.3rem] 2xl:text-[4rem]";
const H2 = "mt-3 font-[family-name:var(--font-heading)] text-3xl font-medium leading-tight tracking-[-0.02em] text-[#141414] sm:text-5xl";

/**
 * The section-by-section landing page for one persona (src/lib/persona-pages.ts, layout "sections"): hero with the import form, their week
 * before and after, how it works, the pains taken, pricing with their plan (PERSONA_PLAN) highlighted, objections and a close.
 */
export function PersonaLanding({ page }: { page: SectionsPage }) {
  const role = page.audience === "broker" ? "mortgage_broker" : undefined;
  const { hero, pain, steps, facts, objections, close } = page;
  const plan = PERSONA_PLAN[page.persona];

  const heroText = (
    <>
      <p className={`${EYEBROW} sm:tracking-[0.25em]`}>{hero.eyebrow}</p>
      <h1 className={H1}>{hero.headline}</h1>
      <p className="mt-5 max-w-xl text-base leading-relaxed text-[#141414]/70 sm:text-lg">{hero.sub}</p>
      <div className="mt-8 max-w-xl">
        <ImportForm role={role} />
      </div>
      <p className="mt-2 text-sm text-[#141414]/60">
        {hero.reassurance}{" "}
        <a href="#pricing" className="underline underline-offset-4">See pricing</a>
      </p>
    </>
  );

  return (
    <div className="space-y-24 sm:space-y-32">
      {/* Hero */}
      <section className={WRAP}>
        {page.audience === "broker" ? (
          <div className="grid items-center gap-10 overflow-hidden rounded-3xl bg-[#eeebe4] px-5 py-10 sm:px-10 sm:py-14 lg:grid-cols-[1.1fr_1fr] lg:px-[5%]">
            <div>{heroText}</div>
            <div className="mx-auto w-full max-w-[460px]">
              <SheetExample />
            </div>
          </div>
        ) : (
          <HeroShowcase>{heroText}</HeroShowcase>
        )}
      </section>

      {/* Their week, before and after */}
      <section className={WRAP} aria-labelledby="persona-pain">
        <h2 id="persona-pain" className={`${H2} mx-auto max-w-3xl text-center`}>{pain.heading}</h2>
        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2">
          {[
            { label: "Today", lines: pain.today, mark: "–", box: "bg-white ring-1 ring-black/10", tick: "text-[#141414]/40" },
            { label: "With SocialSpark", lines: pain.after, mark: "✓", box: "bg-[#eeebe4]", tick: "text-[#d4a24c]" },
          ].map((c) => (
            <div key={c.label} className={`rounded-3xl p-6 sm:p-8 ${c.box}`}>
              <p className={EYEBROW}>{c.label}</p>
              <ul className="mt-5 space-y-3 text-[#141414]/80">
                {c.lines.map((l) => (
                  <li key={l} className="flex gap-3">
                    <span className={c.tick}>{c.mark}</span>
                    {l}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className={WRAP} aria-labelledby="persona-how">
        <div className="mx-auto max-w-3xl text-center">
          <p className={EYEBROW}>How it works</p>
          <h2 id="persona-how" className={H2}>{steps.heading}</h2>
        </div>
        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.items.map((s, i) => (
            <li key={s.title} className="rounded-3xl bg-[#eeebe4] p-6">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[#141414] text-sm font-semibold text-white">{i + 1}</span>
              <h3 className="mt-4 font-[family-name:var(--font-heading)] text-xl font-semibold tracking-[-0.02em] text-[#141414]">{s.title}</h3>
              <p className="mt-2 leading-relaxed text-[#141414]/70">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* The pains taken */}
      <section className="bg-[#0f2a44] py-20 text-white sm:py-28" aria-labelledby="persona-facts">
        <div className={WRAP}>
          <div className="max-w-4xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d4a24c] sm:text-xs">{facts.eyebrow}</p>
            <h2 id="persona-facts" className="mt-3 font-[family-name:var(--font-heading)] text-3xl font-medium leading-tight tracking-[-0.02em] sm:text-5xl">{facts.heading}</h2>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {facts.items.map((f) => (
              <div key={f.title} className="border-t border-white/15 pt-5">
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing, with their plan highlighted */}
      <section id="pricing" className={`${WRAP} scroll-mt-24`} aria-labelledby="pricing-summary">
        <PricingSummary highlight={plan.highlight} initialInterval={plan.interval} fit={page.planFit} />
      </section>

      {/* Objections */}
      <section className={WRAP} aria-labelledby="persona-faq">
        <div className="mx-auto max-w-3xl">
          <h2 id="persona-faq" className="text-center font-[family-name:var(--font-heading)] text-3xl font-medium tracking-[-0.02em] text-[#141414] sm:text-4xl">{objections.heading}</h2>
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

      {/* Final call to action */}
      <section className={WRAP}>
        <div className="rounded-3xl bg-[#eeebe4] px-5 py-12 text-center sm:px-10 sm:py-16">
          <h2 className="font-[family-name:var(--font-heading)] text-3xl font-medium tracking-[-0.02em] text-[#141414] sm:text-5xl">{close.heading}</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-[#141414]/70">{close.sub}</p>
          <div className="mx-auto mt-8 max-w-2xl text-left">
            <ImportForm role={role} />
          </div>
        </div>
      </section>
    </div>
  );
}
