import { ImportForm } from "@/components/ImportForm";
import { AudienceSwitch } from "@/components/landing/AudienceSwitch";
import { PricingSummary } from "@/components/landing/PricingSummary";
import { SheetExample } from "@/components/landing/SheetExample";
import { BROKER_FAQ } from "@/lib/faq-brokers";
import { FREE_LIMITS } from "@/lib/plans";
import { COMPANY, SITE_NAME, SITE_URL } from "@/lib/site";

const TITLE = "Mortgage feature sheets for Canadian brokers";
const DESCRIPTION =
  "Turn any listing link into a branded mortgage feature sheet: monthly payments at different down payments with your rates, licence and a co-branded realtor. Post it, schedule it or print it as a PDF.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/mortgage-brokers" },
  openGraph: { title: `${TITLE} | ${SITE_NAME}`, description: DESCRIPTION, url: "/mortgage-brokers" },
};

const WRAP = "mx-auto w-full min-w-0 max-w-[1600px] px-4 lg:w-[90%] lg:px-0";
const EYEBROW = "text-[11px] font-semibold uppercase tracking-[0.2em] text-[#141414]/70 sm:text-xs";
const H2 = "mt-3 font-[family-name:var(--font-heading)] text-3xl font-medium leading-tight tracking-[-0.02em] text-[#000103]/90 sm:text-5xl";

const STEPS = [
  { title: "Paste a listing link", body: "SocialSpark pulls in the price, photos, condo fees and property tax from a brokerage or agent website." },
  { title: "Your rates, your scenarios", body: "Set your rates once. Each sheet shows up to four scenarios, like 5%, 10% and 20% down, and you can change them anytime." },
  { title: "Post, print or send", body: "Publish or schedule to Instagram, Facebook and LinkedIn, download a Story, or print a letter-size PDF for the open house." },
];

const FEATURES = [
  { title: "Canadian mortgage math, done right", body: "Minimum down payment tiers, CMHC premiums with the 30-year surcharge, semi-annual compounding and the stress test for the optional minimum income." },
  { title: "Compliance built in", body: "Your brokerage and licence number, the rate's \"as of\" date and a disclaimer on every sheet. Captions never quote rates or payments." },
  { title: "Co-brand with realtors", body: "Save partner realtors once and add them to any sheet with QR codes to both your websites. A simple way to win referrals." },
  { title: "Edit the numbers for free", body: "Change a rate or scenario and the sheet updates instantly. Only writing a new caption uses an allowance." },
  { title: "English, Québec French or both", body: "Sheets and captions in the language your clients read, with titles that follow your province." },
  { title: "Open house ready", body: "Select several sheets and download them as one PDF, one page per home." },
];

export default function MortgageBrokersPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/mortgage-brokers#page`,
        url: `${SITE_URL}/mortgage-brokers`,
        name: TITLE,
        description: DESCRIPTION,
        inLanguage: "en-CA",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#app` },
        audience: { "@type": "BusinessAudience", audienceType: "Mortgage brokers and agents in Canada" },
        publisher: { "@type": "Organization", name: COMPANY.name, url: COMPANY.url },
      },
      { "@type": "FAQPage", "@id": `${SITE_URL}/mortgage-brokers#faq`, mainEntity: BROKER_FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    ],
  };

  return (
    <div className="space-y-24 sm:space-y-32">
      {/* Hero */}
      <section className={WRAP}>
        <AudienceSwitch current="broker" className="mb-4" />
        <div className="grid items-center gap-10 overflow-hidden rounded-3xl bg-[#eeebe4] px-5 py-10 sm:px-10 sm:py-14 lg:grid-cols-[1.1fr_1fr] lg:px-[5%]">
          <div>
            <p className={`${EYEBROW} sm:tracking-[0.25em]`}>For Canadian mortgage brokers</p>
            <h1 className="mt-4 font-[family-name:var(--font-heading)] text-[clamp(1.9rem,8vw,2.4rem)] font-medium leading-[1.1] tracking-[-0.02em] text-[#000103]/90 [overflow-wrap:anywhere] sm:text-6xl lg:text-[3.3rem] 2xl:text-[4rem]">
              Turn any listing into a mortgage feature sheet.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[#141414]/70 sm:text-lg">
              Paste a listing link. SocialSpark builds a branded sheet showing what the home costs each month at different down payments, with your rates,
              your licence and a co-branded realtor. Ready to post, print or send.
            </p>
            <div className="mt-8 max-w-xl">
              <ImportForm role="mortgage_broker" />
            </div>
            <p className="mt-2 text-sm text-[#141414]/60">
              {FREE_LIMITS.registered} posts free, no credit card. Building sheets and PDFs are always free.{" "}
              <a href="#pricing" className="underline underline-offset-4">See pricing</a>
            </p>
          </div>
          <div className="mx-auto w-full max-w-[460px]">
            <SheetExample />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className={WRAP} aria-labelledby="broker-how">
        <div className="mx-auto max-w-3xl text-center">
          <p className={EYEBROW}>How it works</p>
          <h2 id="broker-how" className={H2}>From listing link to feature sheet in under a minute.</h2>
        </div>
        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.title} className="rounded-3xl bg-[#eeebe4] p-6">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[#141414] text-sm font-semibold text-white">{i + 1}</span>
              <h3 className="mt-4 font-[family-name:var(--font-heading)] text-xl font-semibold tracking-[-0.02em] text-[#141414]">{s.title}</h3>
              <p className="mt-2 leading-relaxed text-[#141414]/70">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Features + carousel example */}
      <section className="bg-[#0f2a44] py-20 text-white sm:py-28" aria-labelledby="broker-features">
        <div className={`${WRAP} grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]`}>
          <div className="mx-auto w-full max-w-[420px] rounded-[1.75rem] bg-white p-2.5 shadow-2xl">
            <SheetExample kind="scenarios" headline="What It Costs Each Month" initialWidth={400} />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d4a24c] sm:text-xs">Built for brokers</p>
            <h2 id="broker-features" className="mt-3 font-[family-name:var(--font-heading)] text-3xl font-medium leading-tight tracking-[-0.02em] sm:text-5xl">
              Numbers you can stand behind.
            </h2>
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              {FEATURES.map((f) => (
                <div key={f.title} className="border-t border-white/15 pt-5">
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className={`${WRAP} scroll-mt-24`} aria-labelledby="pricing-summary">
        <PricingSummary />
      </section>

      {/* FAQ */}
      <section className={WRAP} aria-labelledby="broker-faq">
        <div className="mx-auto max-w-3xl">
          <h2 id="broker-faq" className="text-center font-[family-name:var(--font-heading)] text-3xl font-medium tracking-[-0.02em] text-[#141414] sm:text-4xl">Questions brokers ask</h2>
          <div className="mt-8 divide-y divide-border border-y border-border">
            {BROKER_FAQ.map((f) => (
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
          <h2 className="font-[family-name:var(--font-heading)] text-3xl font-medium tracking-[-0.02em] text-[#141414] sm:text-5xl">Your next referral starts with a sheet.</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-[#141414]/70">Paste a listing link and see your first feature sheet in under a minute.</p>
          <div className="mx-auto mt-8 max-w-2xl text-left">
            <ImportForm role="mortgage_broker" />
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </div>
  );
}
