import Image from "next/image";
import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { ImportForm } from "@/components/ImportForm";
import { PlatformPostCard } from "@/components/hero/PlatformPostCard";
import { DEMO_POSTS as DEMO_POSTS_SD, hdPost, localizedPost } from "@/components/hero/demo-posts";
import { SCREENS } from "@/components/landing/ListicleLanding";
import { SheetExample } from "@/components/landing/SheetExample";
import { guide as guideBySlug, headingId, plain, wordCount, type Guide, type GuideBlock, type GuideVisual } from "@/lib/guides";
import { LANDING_TEXT } from "@/lib/landing-i18n";
import { FREE_LIMITS } from "@/lib/plans";
import { GuideIcon } from "./GuideIcon";
import { GuideToc } from "./GuideToc";
import { RichText } from "./RichText";

// One centred column for the whole article, so the "On this page" rail sits beside the text on any screen width.
const ARTICLE = "mx-auto w-full min-w-0 max-w-6xl px-4 sm:px-6";
const EYEBROW = "text-[11px] font-semibold uppercase tracking-[0.2em] text-[#141414]/70 sm:text-xs";
const H2 = "scroll-mt-24 font-[family-name:var(--font-heading)] text-2xl font-medium leading-tight tracking-[-0.02em] text-[#141414] sm:text-3xl";
const BODY = "text-[17px] leading-[1.75] text-[#141414]/80";

const byId = Object.fromEntries(DEMO_POSTS_SD.map(hdPost).map((p) => [p.id, p]));

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-CA", { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${iso}T00:00:00Z`));
}

/** A guide at /guides/<slug>: the answer first, the sections, the import form, FAQ, sources and what to read next. */
export function GuideArticle({ guide }: { guide: Guide }) {
  const role = guide.audience === "broker" ? "mortgage_broker" : undefined;
  const minutes = Math.max(1, Math.round(wordCount(guide) / 230));
  const related = guide.related.map(guideBySlug).filter((g): g is Guide => !!g);
  const trust = LANDING_TEXT.en.page.trust(FREE_LIMITS.registered);
  const toc = [...guide.sections.map((s) => ({ id: headingId(s.heading), label: plain(s.heading) })), { id: "faq", label: "Frequently asked questions" }];

  const tryIt = (id?: string) => (
    <div id={id} className="scroll-mt-28 rounded-3xl bg-[#eeebe4] px-5 py-8 sm:px-8 sm:py-10">
      <p className="inline-flex rounded-full bg-[#0f2a44] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d4a24c]">Try it on your listing</p>
      <h2 className="mt-4 font-[family-name:var(--font-heading)] text-2xl font-medium leading-tight tracking-[-0.02em] text-[#141414] sm:text-3xl">{guide.cta.heading}</h2>
      <p className={`mt-3 ${BODY}`}>{guide.cta.sub}</p>
      <div className="mt-6">
        <ImportForm role={role} />
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#141414]/65">
        {trust.map((t) => (
          <li key={t} className="flex gap-1.5">
            <span className="text-[#d4a24c]">✓</span>
            {t}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <article className="pb-24 sm:pb-32">
      <header className={`${ARTICLE} pt-6 sm:pt-10`}>
        <nav aria-label="Breadcrumb" className="text-sm text-[#141414]/60">
          <ol className="flex flex-wrap gap-1.5">
            <li><Link href="/" className="hover:underline">Home</Link> /</li>
            <li><Link href="/guides" className="hover:underline">Guides</Link> /</li>
            <li aria-current="page" className="text-[#141414]/80">{guide.h1}</li>
          </ol>
        </nav>
        <div className="mt-8 max-w-4xl">
          <p className={EYEBROW}>{guide.cluster}</p>
          <h1 className="mt-4 font-[family-name:var(--font-heading)] text-[clamp(2rem,7vw,2.6rem)] font-medium leading-[1.1] tracking-[-0.02em] text-[#000103]/90 [overflow-wrap:anywhere] sm:text-5xl">{guide.h1}</h1>
          <p className="mt-5 text-lg leading-relaxed text-[#141414]/70 sm:text-xl">{guide.dek}</p>
          <p className="mt-5 text-sm text-[#141414]/60">
            By the SocialSpark team · Updated <time dateTime={guide.updated}>{formatDate(guide.updated)}</time> · {minutes} min read
          </p>
        </div>
      </header>

      <div className={`${ARTICLE} mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_250px] lg:gap-14`}>
        <div className="min-w-0 max-w-3xl space-y-14">
          <section aria-label="The short answer" className="rounded-3xl border-l-4 border-[#d4a24c] bg-white px-5 py-6 shadow-[0_1px_0_rgba(0,0,0,0.04)] sm:px-8">
            <p className={EYEBROW}>The short answer</p>
            <p className={`mt-3 ${BODY} text-[#141414]/90`}>
              <RichText text={guide.answer} />
            </p>
          </section>

          {/* Phones and tablets: the section list, folded under the answer (the rail is desktop only). */}
          <details className="group rounded-2xl bg-white px-5 py-4 ring-1 ring-black/5 lg:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
              <span className={EYEBROW}>On this page</span>
              <span className="text-lg leading-none text-[#d4a24c] transition group-open:rotate-45" aria-hidden>+</span>
            </summary>
            <ol className="mt-4 space-y-2.5">
              {toc.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="flex gap-3 text-[15px] leading-snug text-[#141414]/75 hover:text-[#141414]">
                    <span aria-hidden className="mt-[0.5em] h-1.5 w-1.5 shrink-0 rounded-full bg-[#d4a24c]" />
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </details>

          {guide.sections.map((s, i) => (
            <Fragment key={s.heading}>
              <section aria-labelledby={headingId(s.heading)} className="space-y-5">
                <h2 id={headingId(s.heading)} className={H2}>{s.heading}</h2>
                {s.blocks.map((b, j) => <Block key={j} block={b} />)}
              </section>
              {/* The form after the second section, where the reader has the idea and wants to see it done. */}
              {i === 1 && tryIt("start")}
            </Fragment>
          ))}

          <section aria-labelledby="faq" className="space-y-4">
            <h2 id="faq" className={H2}>Frequently asked questions</h2>
            <div className="divide-y divide-black/10 rounded-2xl bg-white ring-1 ring-black/5">
              {guide.faq.map((f) => (
                <details key={f.q} className="group px-5 py-4 sm:px-6">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-medium text-[#141414]">
                    {f.q}
                    <span className="mt-0.5 text-[#d4a24c] transition group-open:rotate-45" aria-hidden>+</span>
                  </summary>
                  <p className={`mt-3 ${BODY}`}>{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          {guide.sections.length > 1 && tryIt()}

          {guide.sources.length > 0 && (
            <section aria-labelledby="sources">
              <h2 id="sources" className={EYEBROW}>Sources</h2>
              <ul className="mt-3 space-y-1.5 text-sm text-[#141414]/70">
                {guide.sources.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noopener" className="underline underline-offset-2 hover:text-[#141414]">{s.label}</a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="hidden lg:block">
          <nav aria-label="On this page" className="sticky top-24">
            <p className={EYEBROW}>On this page</p>
            <div className="mt-4">
              <GuideToc items={toc} />
            </div>
          </nav>
        </aside>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related" className={`${ARTICLE} mt-20`}>
          <h2 id="related" className={H2}>Keep reading</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((g) => (
              <li key={g.slug}>
                <GuideCard guide={g} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}

/** A guide on /guides and under "Keep reading": icon, cluster, title, one line, and the link pinned to the bottom. */
export function GuideCard({ guide }: { guide: Guide }) {
  return (
    <Link
      href={`/guides/${guide.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white p-6 ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-24px_rgba(15,42,68,0.45)] hover:ring-[#0f2a44]/25 sm:p-7"
    >
      <span aria-hidden className="absolute right-0 top-0 h-9 w-9 bg-[#d4a24c] [clip-path:polygon(0_0,100%_0,100%_100%)]" />
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eeebe4] text-[#0f2a44] ring-1 ring-[#0f2a44]/10">
        <GuideIcon cluster={guide.cluster} />
      </span>
      <span className="mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0f2a44]/80">{guide.cluster}</span>
      <span className="mt-2 font-[family-name:var(--font-heading)] text-lg font-medium leading-snug tracking-[-0.01em] text-[#141414]">{guide.h1}</span>
      <span className="mt-3 flex-1 text-[15px] leading-relaxed text-[#141414]/65">{guide.dek}</span>
      <span className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-[#0f2a44]">
        Read the guide <span aria-hidden className="inline-block transition group-hover:translate-x-0.5">→</span>
      </span>
    </Link>
  );
}

function Block({ block }: { block: GuideBlock }) {
  switch (block.type) {
    case "p":
      return <p className={BODY}><RichText text={block.text} /></p>;
    case "list":
      return (
        <ul className={`space-y-2 ${BODY}`}>
          {block.items.map((t) => (
            <li key={t} className="flex gap-3">
              <span className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-[#d4a24c]" aria-hidden />
              <span><RichText text={t} /></span>
            </li>
          ))}
        </ul>
      );
    case "steps":
      return (
        <ol className="space-y-5">
          {block.items.map((s, i) => (
            <li key={s.title} className="flex gap-4">
              <span className="font-[family-name:var(--font-heading)] text-2xl font-semibold leading-none tracking-[-0.02em] text-[#d4a24c]">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <p className="font-semibold text-[#141414]">{s.title}</p>
                <p className={`mt-1 ${BODY}`}><RichText text={s.body} /></p>
              </div>
            </li>
          ))}
        </ol>
      );
    case "table":
      return (
        <>
          {/* Phones: one card per row, each value under its column name, so nothing scrolls sideways. */}
          <figure className="space-y-3 sm:hidden">
            <figcaption className="text-sm text-[#141414]/60">{block.caption}</figcaption>
            {block.rows.map((r, i) => (
              <div key={i} className="rounded-2xl bg-white px-4 py-4 ring-1 ring-black/5">
                <p className="font-semibold text-[#141414]"><RichText text={r[0]} /></p>
                <dl className="mt-2 space-y-2">
                  {r.slice(1).map((c, j) => (
                    <div key={j}>
                      <dt className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#141414]/55">{block.head[j + 1]}</dt>
                      <dd className="text-[15px] leading-relaxed text-[#141414]/80"><RichText text={c} /></dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </figure>
          <div className="hidden overflow-x-auto rounded-2xl bg-white ring-1 ring-black/5 sm:block">
            <table className="w-full text-left text-[15px]">
              <caption className="px-5 pt-4 text-left text-sm text-[#141414]/60">{block.caption}</caption>
              <thead>
                <tr className="border-b border-black/10">
                  {block.head.map((h) => <th key={h} scope="col" className="px-5 py-3 font-semibold text-[#141414]">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((r, i) => (
                  <tr key={i} className="border-b border-black/5 last:border-0 align-top">
                    {r.map((c, j) => (j === 0 ? <th key={j} scope="row" className="px-5 py-3 font-medium text-[#141414]"><RichText text={c} /></th> : <td key={j} className="px-5 py-3 text-[#141414]/75"><RichText text={c} /></td>))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      );
    case "tip":
      return (
        <div className="rounded-2xl bg-[#0f2a44] px-5 py-5 text-white sm:px-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d4a24c]">{block.label}</p>
          <p className="mt-2 text-[16px] leading-relaxed text-white/90 [&_a]:text-white"><RichText text={block.text} /></p>
        </div>
      );
    case "example":
      return (
        <figure className="rounded-2xl border border-dashed border-[#0f2a44]/30 bg-white px-5 py-5 sm:px-6">
          <figcaption className={EYEBROW}>{block.label}</figcaption>
          <p className="mt-3 whitespace-pre-line text-[16px] leading-relaxed text-[#141414]/85">{block.text}</p>
        </figure>
      );
    case "visual":
      return <Visual visual={block.visual} />;
  }
}

function Visual({ visual }: { visual: GuideVisual }) {
  const figure = (body: ReactNode) => (
    <figure className="space-y-3">
      {body}
      <figcaption className="text-sm text-[#141414]/60">{visual.caption}</figcaption>
    </figure>
  );
  switch (visual.kind) {
    case "posts":
      return figure(
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto rounded-3xl bg-[#eeebe4] p-4 [scrollbar-width:none] sm:p-5">
          {visual.ids.map((id) => (
            <div key={id} className="w-[220px] shrink-0 snap-start">
              <PlatformPostCard post={localizedPost(byId[id], visual.language ?? "en")} />
            </div>
          ))}
        </div>,
      );
    case "screen": {
      const s = SCREENS[visual.step];
      return figure(
        <div className="rounded-3xl bg-[#eeebe4] p-4 sm:p-6">
          <Image
            src={s.src}
            alt={s.alt.en}
            width={s.width}
            height={s.height}
            sizes={s.height > s.width ? "340px" : "(min-width: 1024px) 700px, 92vw"}
            className={`mx-auto h-auto w-full rounded-2xl bg-white ring-1 ring-black/5 ${s.height > s.width ? "max-w-[340px]" : ""}`}
          />
        </div>,
      );
    }
    case "sheet":
      return figure(
        <div className="mx-auto w-full max-w-[420px]">
          <SheetExample hd />
        </div>,
      );
  }
}
