import { NextResponse } from "next/server";
import { getUser } from "@/lib/supabase/server";
import { PARTNER_COLUMNS, type PartnerRealtor } from "@/lib/broker";
import { readSheetConfig, type FeatureSheet } from "@/lib/feature-sheet";
import { newSheetRow } from "@/lib/new-sheet";
import type { Listing, Profile } from "@/lib/types";

/**
 * Creates a feature sheet (free: only posts use an allowance). Starts from the broker's saved defaults,
 * co-branded with the partner realtor whose brokerage matches the listing's. `from` duplicates a sheet.
 */
export async function POST(request: Request) {
  const { supabase, user } = await getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const body = (await request.json().catch(() => ({}))) as { listing_id?: string; from?: string };

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single<Profile>();
  if (profile?.role !== "mortgage_broker") return NextResponse.json({ error: "Feature sheets are for mortgage broker accounts." }, { status: 403 });

  if (body.from) {
    const { data: src } = await supabase.from("feature_sheets").select("*").eq("id", body.from).maybeSingle<FeatureSheet>();
    if (!src) return NextResponse.json({ error: "Sheet not found." }, { status: 404 });
    const { data, error } = await supabase
      .from("feature_sheets")
      .insert({ user_id: user.id, listing_id: src.listing_id, language: src.language, headline: src.headline, photo_index: src.photo_index, config: readSheetConfig(src.config) })
      .select("id")
      .single();
    if (error || !data) return NextResponse.json({ error: error?.message ?? "Couldn't duplicate the sheet." }, { status: 500 });
    return NextResponse.json({ id: data.id });
  }

  const { data: listing } = await supabase.from("listings").select("*").eq("id", body.listing_id ?? "").maybeSingle<Listing>();
  if (!listing) return NextResponse.json({ error: "Listing not found." }, { status: 404 });

  const brokerage = listing.listing_brokerage?.trim().toLowerCase();
  const { data: realtors } = await supabase.from("partner_realtors").select(PARTNER_COLUMNS).eq("kind", "realtor").returns<PartnerRealtor[]>();
  const realtor = (brokerage && realtors?.find((r) => r.brokerage_name?.trim().toLowerCase() === brokerage)) || null;

  const { data, error } = await supabase.from("feature_sheets").insert(newSheetRow(profile, listing, realtor)).select("id").single();
  if (error || !data) return NextResponse.json({ error: error?.message ?? "Couldn't create the sheet." }, { status: 500 });
  return NextResponse.json({ id: data.id });
}
