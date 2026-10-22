import { notFound, redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { usageFrom, type EntitlementRow } from "@/lib/plans";
import type { Listing, Post, Profile } from "@/lib/types";
import { PARTNER_COLUMNS, partnerKindFor, type PartnerRealtor } from "@/lib/broker";
import type { FeatureSheet } from "@/lib/feature-sheet";
import { ListingWorkspace } from "./ListingWorkspace";

// Private or utility page: keep it out of search results.
export const metadata = { title: "Listing", robots: { index: false, follow: false } };

export default async function ListingPage({ params }: PageProps<"/listings/[id]">) {
  const { id } = await params;
  const { supabase, user } = await getUser();
  if (!user) redirect("/");

  const [{ data: listing }, { data: profile }, { data: posts }, { data: entitlement }] = await Promise.all([
    supabase.from("listings").select("*").eq("id", id).maybeSingle<Listing>(),
    supabase.from("profiles").select("*").eq("id", user.id).single<Profile>(),
    supabase.from("posts").select("*").eq("listing_id", id).order("created_at", { ascending: false }).returns<Post[]>(),
    supabase.from("entitlements").select("*").eq("user_id", user.id).maybeSingle<EntitlementRow>(),
  ]);
  if (!listing || !profile) notFound();

  // Brokers' partner realtors (for co-branding sheets), or realtors' partner brokers (for sending listings).
  const { data: realtors } = !user.is_anonymous
    ? await supabase.from("partner_realtors").select(PARTNER_COLUMNS).eq("kind", partnerKindFor(profile.role)).order("full_name").returns<PartnerRealtor[]>()
    : { data: [] as PartnerRealtor[] };
  const { data: sheets } =
    profile.role === "mortgage_broker"
      ? await supabase.from("feature_sheets").select("*").eq("listing_id", id).order("updated_at", { ascending: false }).returns<FeatureSheet[]>()
      : { data: [] as FeatureSheet[] };

  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 lg:w-[90%] lg:px-0">
      <ListingWorkspace
        key={listing.id}
        listing={listing}
        profile={profile}
        posts={posts ?? []}
        realtors={realtors ?? []}
        sheets={sheets ?? []}
        usage={usageFrom(entitlement, !!user.is_anonymous)}
      />
    </div>
  );
}
