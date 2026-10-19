import { getUser } from "@/lib/supabase/server";
import { ImportForm } from "@/components/ImportForm";
import { ListingCard } from "@/components/ListingCard";
import { HeroShowcase } from "@/components/hero/HeroShowcase";
import { LandingSections } from "@/components/landing/LandingSections";
import { HomeStructuredData } from "@/components/StructuredData";
import type { Listing, Post } from "@/lib/types";

export default async function Home() {
  const { supabase, user } = await getUser();
  const { data, count } = user
    ? await supabase
        .from("listings")
        .select("*, posts(status, platform)", { count: "exact" })
        .order("created_at", { ascending: false })
        .limit(24)
    : { data: null, count: 0 };
  const listings = (data ?? []) as (Listing & { posts: Pick<Post, "status" | "platform">[] })[];
  const totalListings = count ?? listings.length;

  // People who already have listings came to work: give them a slim welcome bar instead of
  // the marketing hero (whose example posts could be mistaken for their own).
  const returning = listings.length > 0;
  const { data: profile } =
    returning && user && !user.is_anonymous
      ? await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .maybeSingle<{ full_name: string | null }>()
      : { data: null };
  const firstName = profile?.full_name?.trim().split(/\s+/)[0];

  return (
    <div className={returning ? "space-y-12" : "space-y-24 sm:space-y-32"}>
      {returning ? (
        <section className="mx-auto w-full min-w-0 max-w-[1600px] px-4 lg:w-[90%] lg:px-0">
          <div className="rounded-3xl bg-[#eeebe4] px-5 py-7 sm:px-10 sm:py-9 lg:px-[5%]">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
              <div className="lg:max-w-md">
                <h1 className="font-[family-name:var(--font-heading)] tracking-[-0.02em] text-3xl font-medium text-[#141414] sm:text-4xl">
                  {firstName ? `Welcome back, ${firstName}` : "Welcome back"}
                </h1>
                <p className="mt-2 text-[#141414]/70">
                  Paste a listing link to create your next posts.
                </p>
              </div>
              <div className="w-full lg:max-w-2xl">
                <ImportForm />
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="mx-auto w-full min-w-0 max-w-[1600px] px-4 lg:w-[90%] lg:px-0">
          <HeroShowcase>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#141414]/60 sm:text-xs sm:tracking-[0.25em]">
              For Canadian realtors
            </p>
            <h1 className="mt-4 font-[family-name:var(--font-heading)] tracking-[-0.02em] text-[clamp(1.9rem,8vw,2.4rem)] font-medium leading-[1.1] text-[#000103]/90 [overflow-wrap:anywhere] sm:mt-5 sm:text-6xl lg:text-[3.3rem] 2xl:text-[4rem]">
              Turn a listing link into ready-to-publish social posts.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#141414]/70 sm:mt-5 sm:text-lg">
              <span className="sm:hidden">
                Just paste your listing link. Get branded Instagram, Facebook,
                and LinkedIn posts with your listing&apos;s details and photos,
                written in your voice.
              </span>
              <span className="hidden sm:inline">
                Just paste your listing link. Get branded Instagram, Facebook,
                and LinkedIn posts with your listing&apos;s details and photos,
                written in your voice.
              </span>
            </p>
            <div className="mt-7 max-w-xl sm:mt-8">
              <ImportForm />
            </div>
          </HeroShowcase>
        </section>
      )}

      {!returning && <LandingSections />}
      {!returning && <HomeStructuredData />}

      {listings.length > 0 && (
        <section className="mx-auto w-full min-w-0 max-w-[1600px] px-4 lg:w-[90%] lg:px-0">
          {/* Same width as the panel above. */}
          <div className="mb-5 border-b border-border pb-4">
            <h2 className="flex items-center gap-3 text-2xl font-semibold">
              Your listings
              <span className="rounded-full bg-black/[0.06] px-2.5 py-0.5 text-sm font-medium text-muted">
                {totalListings}
              </span>
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {listings.map(({ posts, ...l }) => (
              <ListingCard key={l.id} listing={l} posts={posts} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
