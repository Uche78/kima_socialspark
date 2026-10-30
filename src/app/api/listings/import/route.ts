import { NextResponse } from "next/server";
import { createAdminClient, getUser } from "@/lib/supabase/server";
import { recordAiUsage, type UsageMeter } from "@/lib/ai-usage";
import { extractListing, ExtractionBlockedError, fetchListingPage, MAX_PASTED_CHARS, pastedListingPage } from "@/lib/extract";
import { copyPhotosToStorage } from "@/lib/photos";
import { upgradePhotoUrls } from "@/lib/photo-quality";
import { ClaudeRefusalError } from "@/lib/claude";
import { importPaywall } from "@/lib/paywall";

export const maxDuration = 60;

export async function POST(request: Request) {
  const { supabase, user } = await getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  // Either a link to fetch, or a page the user copied in their own browser (`html`).
  const { url, html } = (await request.json().catch(() => ({}))) as { url?: string; html?: string };
  if (!url && !html) return NextResponse.json({ error: "Paste a listing link first." }, { status: 400 });
  if (html && html.length > MAX_PASTED_CHARS) {
    return NextResponse.json({ error: "That page is too large to import. Try copying just the listing page." }, { status: 413 });
  }

  let page;
  let sourceKnown = true;
  try {
    if (html) {
      const pasted = pastedListingPage(html, url);
      page = pasted;
      sourceKnown = pasted.known;
    } else {
      page = await fetchListingPage(url!);
    }
  } catch (e) {
    const blocked = e instanceof ExtractionBlockedError;
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Couldn't open that page.", manualEntry: true, blocked },
      { status: 422 },
    );
  }

  // Free plan: use one listing import (guests 1, accounts 3) before Claude reads the page. Paid plans: unlimited.
  // Any failure from here on gives it back.
  const admin = createAdminClient();
  const isGuest = !!user.is_anonymous;
  const { data: quota, error: quotaError } = await admin.rpc("consume_import_for", { p_user: user.id, p_guest: isGuest }).single<{ allowed: boolean }>();
  if (quotaError || !quota) {
    console.error("import quota", quotaError?.message);
    return NextResponse.json({ error: "Couldn't check your plan. Please try again." }, { status: 500 });
  }
  if (!quota.allowed) return NextResponse.json({ ...importPaywall(isGuest), code: "import_limit" }, { status: 402 });
  const refund = () => admin.rpc("refund_import", { p_user: user.id });

  let extracted;
  const meter: UsageMeter = { usage: null };
  try {
    extracted = await extractListing(page, meter);
  } catch (e) {
    await refund();
    const message = e instanceof ClaudeRefusalError || e instanceof Error ? e.message : "Extraction failed.";
    return NextResponse.json({ error: message, manualEntry: true }, { status: 422 });
  } finally {
    // Recorded whether or not the page turned out to be a listing: the call cost the same.
    if (meter.usage) await recordAiUsage(admin, { user_id: user.id, kind: "import", usage: meter.usage });
  }

  const { listing: l, photoUrls, tourUrl } = extracted;
  if (!l.is_property_listing) {
    await refund();
    return NextResponse.json(
      { error: "That page doesn't look like a single property listing.", manualEntry: true },
      { status: 422 },
    );
  }

  const { data: row, error } = await supabase
    .from("listings")
    .insert({
      user_id: user.id,
      source_url: sourceKnown ? page.url.toString() : null,
      source_site: sourceKnown ? page.url.hostname.replace(/^www\./, "") : null,
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
      virtual_tour_url: tourUrl,
      monthly_fee: l.monthly_fee > 0 ? Math.round(l.monthly_fee * 100) / 100 : null,
      property_tax_yearly: l.property_tax_yearly > 0 ? Math.round(l.property_tax_yearly) : null,
      extraction_notes: l.notes,
    })
    .select("id")
    .single();
  if (error || !row) {
    await refund();
    return NextResponse.json({ error: error?.message ?? "Couldn't save listing." }, { status: 500 });
  }

  // Swap the page's resized copies for the largest versions the photo CDN offers.
  const photos = await copyPhotosToStorage(supabase, user.id, row.id, await upgradePhotoUrls(photoUrls));
  const partial = photos.length === 0 || !l.address || l.price == null;
  await supabase
    .from("listings")
    .update({ photos, extraction_status: partial ? "partial" : "complete" })
    .eq("id", row.id);

  // Mortgage brokers go straight to the Sheet Builder.
  const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle<{ role: string }>();
  return NextResponse.json({ id: row.id, broker: me?.role === "mortgage_broker" });
}
