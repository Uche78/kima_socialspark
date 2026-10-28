// Sections shared by the two audience landing pages (/ for realtors, /mortgage-brokers for brokers), below
// their heroes: a plain summary with trust chips, a feature grid, the rules built into the output, a
// "now what?" scenario, a comparison with the reader's current way, and the FAQ. Each page passes its own copy.

import { FormCta } from "./FormCta";

export const WRAP = "mx-auto w-full min-w-0 max-w-[1600px] px-4 lg:w-[90%] lg:px-0";
export const EYEBROW = "text-[11px] font-semibold uppercase tracking-[0.2em] text-[#141414]/70 sm:text-xs";
export const H2 = "mt-3 font-[family-name:var(--font-heading)] tracking-[-0.02em] text-3xl font-medium leading-tight text-[#141414] sm:text-5xl";

/** What the product is, in one paragraph an answer engine can quote, and the objections answered as chips. */
export function Summary({ text, chips }: { text: string; chips: string[] }) {
  return (
    <section className={WRAP} aria-label="What it is">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-lg leading-relaxed text-[#141414]/80 sm:text-xl">{text}</p>
        <ul className="mt-8 flex flex-wrap justify-center gap-2.5">
          {chips.map((c) => (
            <li key={c} className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-[#141414] ring-1 ring-black/10">
              <span className="text-[#d4a24c]" aria-hidden>
                ✓
              </span>
              {c}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** What's included: one specific fact per card, its kicker the number or noun that matters. */
export function FeatureGrid({ id, eyebrow, heading, items }: { id: string; eyebrow: string; heading: string; items: { kicker: string; title: string; body: string }[] }) {
  return (
    <section className={WRAP} aria-labelledby={id}>
      <div className="max-w-3xl">
        <p className={EYEBROW}>{eyebrow}</p>
        <h2 id={id} className={H2}>
          {heading}
        </h2>
      </div>
      <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((f) => (
          <li key={f.title} className="rounded-2xl bg-white p-6 ring-1 ring-black/10 sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b8862f]">{f.kicker}</p>
            <h3 className="mt-3 font-[family-name:var(--font-heading)] text-xl font-semibold tracking-[-0.02em] text-[#141414]">{f.title}</h3>
            <p className="mt-2 leading-relaxed text-[#141414]/70">{f.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** The rules built into the output: the reasons on the left, the checklist every post or sheet passes on the right. */
export function RulesPanel({
  id,
  eyebrow,
  heading,
  sub,
  points,
  card,
}: {
  id: string;
  eyebrow: string;
  heading: string;
  sub: string;
  points: { title: string; body: string }[];
  card: { title: string; items: string[]; note: string };
}) {
  return (
    <section className="bg-[#0f2a44] py-20 text-white sm:py-28" aria-labelledby={id}>
      <div className={`${WRAP} grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16`}>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d4a24c] sm:text-xs">{eyebrow}</p>
          <h2 id={id} className="mt-3 font-[family-name:var(--font-heading)] text-3xl font-medium leading-tight tracking-[-0.02em] sm:text-5xl">
            {heading}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-white/70">{sub}</p>
          <dl className="mt-10 grid gap-7 sm:grid-cols-2">
            {points.map((p) => (
              <div key={p.title} className="border-t border-white/15 pt-5">
                <dt className="font-semibold">{p.title}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-white/70">{p.body}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="self-center rounded-3xl bg-white p-6 text-[#141414] shadow-2xl sm:p-8">
          <p className={EYEBROW}>{card.title}</p>
          <ul className="mt-5 space-y-3.5">
            {card.items.map((i) => (
              <li key={i} className="flex gap-3 leading-snug">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#d4a24c] text-[11px] font-bold text-white" aria-hidden>
                  ✓
                </span>
                {i}
              </li>
            ))}
          </ul>
          <p className="mt-6 border-t border-black/10 pt-5 text-sm leading-relaxed text-[#141414]/60">{card.note}</p>
        </div>
      </div>
    </section>
  );
}

/** One real moment in the reader's week: how it goes today, then with SocialSpark, then a call to action. */
export function Scenario({ id, heading, today, withUs, cta }: { id: string; heading: string; today: string; withUs: string; cta: string }) {
  return (
    <section className={WRAP} aria-labelledby={id}>
      <div className="mx-auto max-w-4xl">
        <h2 id={id} className={`${H2} text-center`}>
          {heading}
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 ring-1 ring-black/10 sm:p-8">
            <p className={EYEBROW}>The usual way</p>
            <p className="mt-3 leading-relaxed text-[#141414]/70">{today}</p>
          </div>
          <div className="rounded-3xl bg-[#eeebe4] p-6 sm:p-8">
            <p className={EYEBROW}>With SocialSpark</p>
            <p className="mt-3 leading-relaxed text-[#141414]">{withUs}</p>
          </div>
        </div>
        <div className="mt-8 text-center">
          <FormCta>{cta}</FormCta>
        </div>
      </div>
    </section>
  );
}

/** SocialSpark against the reader's current way (never a named competitor). Rows stack into two columns on phones. */
export function CompareTable({ id, heading, theirs, rows }: { id: string; heading: string; theirs: string; rows: { label: string; ours: string; theirs: string }[] }) {
  return (
    <section className={WRAP} aria-labelledby={id}>
      <h2 id={id} className={`${H2} text-center`}>
        {heading}
      </h2>
      <div className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-3xl bg-white ring-1 ring-black/10">
        <table className="block w-full text-left text-sm sm:table sm:text-base">
          <thead className="block sm:table-header-group">
            <tr className="grid grid-cols-2 border-b border-black/10 sm:table-row">
              <th scope="col" className="hidden p-4 font-medium text-[#141414]/60 sm:table-cell sm:p-5">
                <span className="sr-only">Compared</span>
              </th>
              <th scope="col" className="bg-[#0f2a44] p-4 font-semibold text-white sm:p-5">
                SocialSpark
              </th>
              <th scope="col" className="p-4 font-semibold text-[#141414]/70 sm:p-5">
                {theirs}
              </th>
            </tr>
          </thead>
          <tbody className="block sm:table-row-group">
            {rows.map((r) => (
              <tr key={r.label} className="grid grid-cols-2 border-b border-black/5 last:border-0 sm:table-row">
                <th scope="row" className="col-span-2 px-4 pb-2 pt-4 align-top font-semibold text-[#141414] sm:table-cell sm:p-5 sm:font-medium">
                  {r.label}
                </th>
                <td className="bg-[#0f2a44]/[0.04] p-4 pt-3 align-top text-[#141414] sm:p-5">
                  <span className="mr-1.5 text-[#d4a24c]">✓</span>
                  {r.ours}
                </td>
                <td className="p-4 pt-3 align-top text-[#141414]/60 sm:p-5">{r.theirs}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function FaqList({ id, heading, items }: { id: string; heading: string; items: { q: string; a: string }[] }) {
  return (
    <div className="mx-auto max-w-3xl">
      <h2 id={id} className="text-center font-[family-name:var(--font-heading)] text-3xl font-medium tracking-[-0.02em] text-[#141414] sm:text-4xl">
        {heading}
      </h2>
      <div className="mt-8 divide-y divide-border border-y border-border">
        {items.map((f) => (
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
  );
}
