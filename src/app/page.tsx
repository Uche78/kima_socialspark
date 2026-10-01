import Image from "next/image";
import { getUser } from "@/lib/supabase/server";
import { ImportForm } from "@/components/ImportForm";
import { ListingCard } from "@/components/ListingCard";
import type { Listing, Post } from "@/lib/types";
import heroPhoto from "../../public/hero.jpg";

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const POINTS = ["Instagram, Facebook & LinkedIn", "In your voice", "With your branding"];

export default async function Home() {
  const { supabase, user } = await getUser();
  const listings: (Listing & { posts: Pick<Post, "status" | "platform">[] })[] = user
    ? ((await supabase.from("listings").select("*, posts(status, platform)").order("created_at", { ascending: false }).limit(24)).data ?? [])
    : [];

  // New visitors (no listings): the hero fills the screen and nothing follows it, so cancel
  // the layout's bottom padding. Returning users keep a shorter hero so their listings peek in.
  const heroOnly = listings.length === 0;

  return (
    <div className={heroOnly ? "-mb-24" : "space-y-10"}>
      {/* Hero: full-bleed photo under the transparent header (main's top padding is cancelled with -mt-6). */}
      <section className={`relative -mt-6 flex items-center ${heroOnly ? "min-h-svh" : "sm:min-h-[640px] lg:min-h-[810px]"} overflow-hidden bg-[#050505]`}>
        <Image src={heroPhoto} alt="" fill priority placeholder="blur" sizes="100vw" className="object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/80 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay" style={{ backgroundImage: NOISE }} />

        <div className="relative mx-auto w-full min-w-0 max-w-[1600px] px-4 pb-14 pt-28 sm:pb-20 sm:pt-36 lg:w-[90%] lg:px-0 lg:pt-40">
          <div className="max-w-4xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] sm:text-xs sm:tracking-[0.25em] text-[#f3f1ec]/80">For realtors &amp; mortgage brokers</p>
            <h1 className="mt-4 font-[family-name:var(--font-display)] text-[clamp(1.6rem,9vw,2.25rem)] font-medium [overflow-wrap:anywhere] sm:mt-6 leading-[1.08] text-[#f3f1ec] sm:text-6xl lg:text-[4rem]">
              Turn a listing link into <br className="hidden sm:block" />
              <em className="font-normal">
                <span className="sm:whitespace-nowrap">ready-to-publish</span> social posts.
              </em>
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#f3f1ec]/75 sm:mt-6 sm:text-xl">
              Paste a link from a brokerage site or an agent&apos;s website. We&apos;ll pull in the details and photos so you can
              create Instagram, Facebook and LinkedIn posts in your voice, with your branding.
            </p>
            <div className="mt-7 max-w-2xl sm:mt-10">
              <ImportForm />
            </div>
            <ul className="mt-10 flex flex-col gap-2 text-xs uppercase sm:mt-14 sm:text-sm tracking-wide text-[#f3f1ec]/70 sm:flex-row sm:gap-10">
              {POINTS.map((p) => (
                <li key={p} className="flex items-center gap-3">
                  <span className="h-1 w-1 rounded-full bg-[#f3f1ec]/70" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {listings.length > 0 && (
        <section className="mx-auto max-w-6xl px-4">
          <h2 className="mb-3 text-lg font-semibold">Your listings</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map(({ posts, ...l }) => (
              <ListingCard key={l.id} listing={l} posts={posts} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
