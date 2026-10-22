import { notFound, redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { PARTNER_COLUMNS, type PartnerRealtor } from "@/lib/broker";
import { readSheetConfig, type FeatureSheet } from "@/lib/feature-sheet";
import type { Listing, Post, Profile } from "@/lib/types";
import { SheetBuilder } from "./SheetBuilder";

export const metadata = { title: "Sheet Builder", robots: { index: false, follow: false } };

export default async function SheetBuilderPage({ params }: PageProps<"/sheets/[id]">) {
  const { id } = await params;
  const { supabase, user } = await getUser();
  if (!user) redirect("/");

  const { data: sheet } = await supabase.from("feature_sheets").select("*").eq("id", id).maybeSingle<FeatureSheet>();
  if (!sheet) notFound();
  const [{ data: listing }, { data: profile }, { data: realtors }, { data: posts }] = await Promise.all([
    supabase.from("listings").select("*").eq("id", sheet.listing_id).single<Listing>(),
    supabase.from("profiles").select("*").eq("id", user.id).single<Profile>(),
    supabase.from("partner_realtors").select(PARTNER_COLUMNS).eq("kind", "realtor").order("full_name").returns<PartnerRealtor[]>(),
    supabase.from("posts").select("id, platform, format, status, created_at, scheduled_at, published_at").eq("sheet_id", id).order("created_at", { ascending: false }).returns<Pick<Post, "id" | "platform" | "format" | "status" | "created_at" | "scheduled_at" | "published_at">[]>(),
  ]);
  if (!listing || !profile) notFound();

  return (
    <div className="mx-auto w-full max-w-[2400px] px-4 lg:-mb-24 lg:-mt-6 lg:w-[98%] lg:overflow-hidden lg:px-0">
      <SheetBuilder
        initialSheet={{ ...sheet, config: readSheetConfig(sheet.config) }}
        initialListing={listing}
        profile={profile}
        realtors={realtors ?? []}
        posts={posts ?? []}
      />
    </div>
  );
}
