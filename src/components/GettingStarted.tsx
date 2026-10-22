import Link from "next/link";
import { SheetExample } from "@/components/landing/SheetExample";
import { PlatformPostCard } from "@/components/hero/PlatformPostCard";
import { DEMO_POSTS } from "@/components/hero/demo-posts";

export type SetupState = {
  broker: boolean;
  hasLicence: boolean;
  hasRates: boolean;
  hasLogo: boolean;
  hasHeadshot: boolean;
  hasPartner: boolean;
  hasSocial: boolean;
  /** Posts left on their plan (a caption uses one). */
  postsLeft: number;
};

/** "Missing: headshot" when one of a two-part step is done (all or nothing needs no note). */
const onlyMissing = (a: [boolean, string], b: [boolean, string]) => (a[0] === b[0] ? undefined : a[0] ? b[1] : a[1]);

type Step = {
  title: string;
  body: string;
  done: boolean;
  href?: string;
  action?: string;
  optional?: boolean;
  missing?: string;
};

function stepsFor(s: SetupState): Step[] {
  const photos: Step = {
    title: "Add your logo and headshot",
    body: s.broker ? "They appear on every sheet and post. Without a headshot, the sheet shows your initials." : "They appear on every post, with your brand colours.",
    done: s.hasLogo && s.hasHeadshot,
    missing: onlyMissing([s.hasLogo, "logo"], [s.hasHeadshot, "headshot"]),
    href: "/settings#branding",
    action: "Add in Settings",
  };
  const paste: Step = {
    title: "Paste a listing link",
    body: s.broker ? "Use the box above. The listing opens in the Sheet Builder, ready to edit." : "Use the box above. You'll choose the platform and post type next.",
    done: false,
  };
  if (s.broker) {
    return [
      {
        title: "Add your licence number and rates",
        body: "Your licence is on every sheet, and your rates set the payments. You can change rates on any sheet later.",
        done: s.hasLicence && s.hasRates,
        missing: onlyMissing([s.hasLicence, "licence number"], [s.hasRates, "rates"]),
        href: s.hasLicence ? "/settings#rates" : "/settings#about",
        action: "Add in Settings",
      },
      photos,
      {
        title: "Add a partner realtor",
        body: "Co-brand sheets with a realtor's photo, contact details and a QR code to their website.",
        done: s.hasPartner,
        href: "/partners",
        action: "Add a partner",
        optional: true,
      },
      paste,
    ];
  }
  return [
    photos,
    {
      title: "Connect Instagram, Facebook or LinkedIn",
      body: "Publish and schedule from SocialSpark. You can also download posts and share them yourself.",
      done: s.hasSocial,
      href: "/settings#accounts",
      action: "Connect",
      optional: true,
    },
    paste,
  ];
}

/** Signed-in accounts with no listings yet: what to do first, and an example of the result. */
export function GettingStarted(s: SetupState) {
  const steps = stepsFor(s);
  const done = steps.filter((x) => x.done).length;
  return (
    // Desktop: the checklist card stretches to the example's height, so the example can be shown large.
    <section className="mx-auto grid w-full min-w-0 max-w-[1600px] gap-8 px-4 lg:w-[90%] lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-stretch lg:px-0">
      <div className="flex flex-col rounded-3xl bg-white p-6 ring-1 ring-black/10 sm:p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-medium tracking-[-0.02em] text-[#141414]">Get started</h2>
          <span className="text-sm text-muted">
            {done} of {steps.length} done
          </span>
        </div>
        <p className="mt-1 text-sm text-muted">
          {s.postsLeft} free {s.postsLeft === 1 ? "post" : "posts"} left.{" "}
          {s.broker ? "Building sheets, PDFs and Story images are always free." : "Edits and publishing are always free."}
        </p>
        <ol className="mt-6 flex flex-1 flex-col justify-between divide-y divide-border">
          {steps.map((step, i) => (
            <li key={step.title} className="flex flex-1 flex-col justify-center py-5 first:pt-0 last:pb-0">
              <div className="flex gap-4">
                <span
                  aria-hidden
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-semibold ${step.done ? "bg-emerald-600 text-white" : "bg-[#141414] text-white"}`}
                >
                  {step.done ? "✓" : i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className={`font-semibold ${step.done ? "text-muted line-through decoration-black/30" : "text-[#141414]"}`}>
                    {step.title}
                    {step.optional && <span className="ml-2 text-xs font-normal text-muted no-underline">Optional</span>}
                    <span className="sr-only">{step.done ? " (done)" : ""}</span>
                  </h3>
                  {!step.done && (
                    <>
                      <p className="mt-1 text-sm leading-relaxed text-[#141414]/70">{step.body}</p>
                      {step.missing && <p className="mt-1 text-xs font-medium text-amber-800">Still missing: {step.missing}</p>}
                      {step.href && (
                        <Link href={step.href} className="btn-secondary mt-3 inline-flex">
                          {step.action}
                        </Link>
                      )}
                    </>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div>
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#141414]/60">{s.broker ? "Example feature sheet" : (
            <>
              Example post<span className="hidden sm:inline">s</span>
            </>
          )}</p>
        {s.broker ? (
          <SheetExample initialWidth={680} />
        ) : (
          // Phones: just the first post, full width.
          <div className="grid items-start gap-6 sm:grid-cols-2">
            {DEMO_POSTS.slice(0, 2).map((p, i) => (
              <div key={p.id} className={i > 0 ? "hidden sm:block" : undefined}>
                <PlatformPostCard post={p} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
