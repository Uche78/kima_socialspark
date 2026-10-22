import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { AudienceSwitch } from "@/components/landing/AudienceSwitch";
import { ImportForm } from "@/components/ImportForm";
import { GettingStarted, type SetupState } from "@/components/GettingStarted";
import { ListingCard } from "@/components/ListingCard";
import type { ListingShare } from "@/components/ShareWithBroker";
import { HeroShowcase } from "@/components/hero/HeroShowcase";
import { LandingSections } from "@/components/landing/LandingSections";
import { HomeStructuredData } from "@/components/StructuredData";
import { PARTNER_COLUMNS, readMortgageSettings, type PartnerRealtor } from "@/lib/broker";
import { remaining, usageFrom, type EntitlementRow } from "@/lib/plans";
import type { Listing, Post, Profile } from "@/lib/types";

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

  const { data: profile } =
    user && !user.is_anonymous
      ? await supabase
          .from("profiles")
          .select("full_name, role, role_chosen, license_number, logo_path, headshot_path, mortgage_settings")
          .eq("id", user.id)
          .maybeSingle<Pick<Profile, "full_name" | "role" | "role_chosen" | "license_number" | "logo_path" | "headshot_path" | "mortgage_settings">>()
      : { data: null };
  // New accounts choose Realtor or Mortgage broker before anything else.
  if (profile && !profile.role_chosen) redirect("/welcome");
  const broker = profile?.role === "mortgage_broker";

  // People who already have listings, or an account, came to work: give them a slim welcome bar
  // instead of the marketing hero (whose example posts could be mistaken for their own).
  const returning = listings.length > 0 || !!profile;
  const setup = profile && listings.length === 0 ? await setupState(supabase, user!.id, profile, broker) : null;
  // Realtors with an account can send a listing to a mortgage broker from its card: their saved brokers, loaded once.
  const { data: partnerBrokers } =
    profile?.role === "realtor" && listings.length > 0
      ? await supabase.from("partner_realtors").select(PARTNER_COLUMNS).eq("kind", "broker").order("full_name").returns<PartnerRealtor[]>()
      : { data: null };
  const { data: shareRows } =
    profile?.role === "realtor" && listings.length > 0
      ? await supabase.from("listing_shares").select("listing_id, to_email, to_name, created_at").in("listing_id", listings.map((l) => l.id)).order("created_at", { ascending: false })
      : { data: null };
  // Newest first, so the first row per listing is its latest send.
  const lastShares = new Map<string, ListingShare>();
  for (const { listing_id, ...share } of (shareRows ?? []) as (ListingShare & { listing_id: string })[]) if (!lastShares.has(listing_id)) lastShares.set(listing_id, share);
  const firstName = profile?.full_name?.trim().split(/\s+/)[0];

  return (
    <div className={returning ? "space-y-12" : "space-y-24 sm:space-y-32"}>
      {returning ? (
        <section className="mx-auto w-full min-w-0 max-w-[1600px] px-4 lg:w-[90%] lg:px-0">
          <div className="rounded-3xl bg-[#eeebe4] px-5 py-7 sm:px-10 sm:py-9 lg:px-[5%]">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
              <div className="lg:max-w-md">
                <h1 className="font-[family-name:var(--font-heading)] tracking-[-0.02em] text-3xl font-medium text-[#141414] sm:text-4xl">
                  {listings.length === 0 ? (firstName ? `Welcome, ${firstName}` : "Welcome") : firstName ? `Welcome back, ${firstName}` : "Welcome back"}
                </h1>
                <p className="mt-2 text-[#141414]/70">
                  {broker ? "Paste a listing link to build a feature sheet." : "Paste a listing link to create your next posts."}
                </p>
              </div>
              <div className="w-full lg:max-w-2xl">
                <ImportForm />
                {setup && (
                  <p className="mt-1 text-sm text-[#141414]/65">
                    <strong className="font-semibold text-[#141414]/80">Tip:</strong> use the listing page on a brokerage or agent website. REALTOR.ca blocks automatic retrieval, so
                    use the brokerage&apos;s copy of the listing, or &ldquo;Copy and paste the page&rdquo;.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="mx-auto w-full min-w-0 max-w-[1600px] px-4 lg:w-[90%] lg:px-0">
          <AudienceSwitch current="realtor" className="mb-4" />
          <HeroShowcase>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#141414]/70 sm:text-xs sm:tracking-[0.25em]">
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

      {setup && <GettingStarted {...setup} />}
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
              <ListingCard key={l.id} listing={l} posts={posts} brokers={profile?.role === "realtor" ? (partnerBrokers ?? []) : undefined} lastShare={lastShares.get(l.id) ?? null} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

/** What a new account has set up so far, for the Get started checklist. */
async function setupState(
  supabase: Awaited<ReturnType<typeof getUser>>["supabase"],
  userId: string,
  profile: Pick<Profile, "license_number" | "logo_path" | "headshot_path" | "mortgage_settings">,
  broker: boolean,
): Promise<SetupState> {
  const [{ count: partners }, { count: social }, { data: entitlement }] = await Promise.all([
    supabase.from("partner_realtors").select("id", { count: "exact", head: true }),
    supabase.from("social_accounts").select("id", { count: "exact", head: true }),
    supabase.from("entitlements").select("*").eq("user_id", userId).maybeSingle<EntitlementRow>(),
  ]);
  const { rates } = readMortgageSettings(profile.mortgage_settings);
  return {
    broker,
    hasLicence: !!profile.license_number?.trim(),
    hasRates: [rates.insured.fixed, rates.insured.variable, rates.conventional.fixed, rates.conventional.variable].some((r) => r !== null),
    hasLogo: !!profile.logo_path,
    hasHeadshot: !!profile.headshot_path,
    hasPartner: (partners ?? 0) > 0,
    hasSocial: (social ?? 0) > 0,
    postsLeft: remaining(usageFrom(entitlement, false), "post"),
  };
}
