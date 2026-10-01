import { NextResponse } from "next/server";
import { getUser } from "@/lib/supabase/server";
import { extractListing, ExtractionBlockedError, fetchListingPage } from "@/lib/extract";
import { copyPhotosToStorage } from "@/lib/photos";
import { upgradePhotoUrls } from "@/lib/photo-quality";
import { ClaudeRefusalError } from "@/lib/claude";

export const maxDuration = 60;

export async function POST(request: Request) {
  const { supabase, user } = await getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { url } = (await request.json().catch(() => ({}))) as { url?: string };
  if (!url) return NextResponse.json({ error: "Paste a listing link first." }, { status: 400 });

  let page;
  try {
    page = await fetchListingPage(url);
  } catch (e) {
    const blocked = e instanceof ExtractionBlockedError;
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Couldn't open that page.", manualEntry: true, blocked },
      { status: 422 },
    );
  }

  let extracted;
  try {
    extracted = await extractListing(page);
  } catch (e) {
    const message = e instanceof ClaudeRefusalError || e instanceof Error ? e.message : "Extraction failed.";
    return NextResponse.json({ error: message, manualEntry: true }, { status: 422 });
  }

  const { listing: l, photoUrls } = extracted;
  if (!l.is_property_listing) {
    return NextResponse.json(
      { error: "That page doesn't look like a single property listing.", manualEntry: true },
      { status: 422 },
    );
  }

  const { data: row, error } = await supabase
    .from("listings")
    .insert({
      user_id: user.id,
      source_url: page.url.toString(),
      source_site: page.url.hostname.replace(/^www\./, ""),
      address: l.address,
      city: l.city,
      province: l.province?.toUpperCase().slice(0, 2) ?? null,
      postal_code: l.postal_code,
      price: l.price,
      transaction_type: l.transaction_type,
      property_type: l.property_type,
      bedrooms: l.bedrooms,
      bathrooms: l.bathrooms,
      square_feet: l.square_feet,
      lot_size: l.lot_size,
      year_built: l.year_built ? Math.round(l.year_built) : null,
      mls_number: l.mls_number,
      description: l.description,
      features: l.features.slice(0, 15),
      listing_brokerage: l.listing_brokerage,
      open_house: l.open_house,
      extraction_notes: l.notes,
    })
    .select("id")
    .single();
  if (error || !row) return NextResponse.json({ error: error?.message ?? "Couldn't save listing." }, { status: 500 });

  // Swap the page's resized copies for the largest versions the photo CDN offers.
  const photos = await copyPhotosToStorage(supabase, user.id, row.id, await upgradePhotoUrls(photoUrls));
  const partial = photos.length === 0 || !l.address || l.price == null;
  await supabase
    .from("listings")
    .update({ photos, extraction_status: partial ? "partial" : "complete" })
    .eq("id", row.id);

  return NextResponse.json({ id: row.id });
}
