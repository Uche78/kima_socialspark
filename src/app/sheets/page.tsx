import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { readSheetConfig, type FeatureSheet } from "@/lib/feature-sheet";
import type { Listing, Profile } from "@/lib/types";
import { SheetsPicker } from "./SheetsPicker";

// Private or utility page: keep it out of search results.
export const metadata = { title: "Feature sheets", robots: { index: false, follow: false } };

/** All of a broker's feature sheets: open one in the builder, or print several together as one PDF. */
export default async function SheetsPage() {
  const { supabase, user } = await getUser();
  if (!user) redirect("/");
  const [{ data: profile }, { data }, { data: listings }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single<Profile>(),
    supabase.from("feature_sheets").select("*, listing:listings(*)").order("updated_at", { ascending: false }).limit(200),
    supabase.from("listings").select("id, address, city").order("created_at", { ascending: false }).limit(50),
  ]);
  if (!profile) redirect("/");
  const sheets = ((data ?? []) as (FeatureSheet & { listing: Listing | null })[])
    .filter((s) => s.listing)
    .map((s) => ({ ...s, config: readSheetConfig(s.config) })) as (FeatureSheet & { listing: Listing })[];
  return (
    <div className="mx-auto w-full max-w-[1900px] px-4 lg:w-[96%] lg:px-0">
      <SheetsPicker sheets={sheets} profile={profile} listings={(listings ?? []) as Pick<Listing, "id" | "address" | "city">[]} />
    </div>
  );
}
