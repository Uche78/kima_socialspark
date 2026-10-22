import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient, getUser } from "@/lib/supabase/server";
import { PARTNER_COLUMNS, type PartnerRealtor } from "@/lib/broker";
import { EDITABLE_LISTING_FIELDS } from "@/lib/listing-fields";
import { newSheetRow } from "@/lib/new-sheet";
import { readShareToken } from "@/lib/share-token";
import type { Listing, Photo, Profile } from "@/lib/types";

/**
 * Adds a listing a realtor shared to the signed-in user's account: copies the listing and its photos
 * (so it keeps working if the realtor deletes theirs). When a broker adds it, the broker and realtor become each other's partners,
 * and the broker goes straight to a feature sheet co-branded with that realtor (`sheet_id`).
 */
export async function POST(_req: NextRequest, ctx: RouteContext<"/api/shared/[token]">) {
  const { token } = await ctx.params;
  const { user } = await getUser();
  if (!user || user.is_anonymous) return NextResponse.json({ error: "Sign in to add this listing." }, { status: 401 });
  const share = readShareToken(token);
  if (!share) return NextResponse.json({ error: "This link has expired or isn't valid. Ask the realtor to send it again." }, { status: 410 });
  if (share.fromUser === user.id) return NextResponse.json({ error: "This is your own listing." }, { status: 400 });

  const admin = createAdminClient();
  const [{ data: src }, { data: sender }] = await Promise.all([
    admin.from("listings").select("*").eq("id", share.listingId).eq("user_id", share.fromUser).maybeSingle<Listing>(),
    admin.from("profiles").select("*").eq("id", share.fromUser).maybeSingle<Profile>(),
  ]);
  if (!src) return NextResponse.json({ error: "The realtor has removed this listing." }, { status: 404 });

  // Already added? Send them to it instead of making a copy.
  let dupe = admin.from("listings").select("id, photos").eq("user_id", user.id).limit(1);
  dupe = src.source_url ? dupe.eq("source_url", src.source_url) : dupe.eq("address", src.address ?? "").eq("price", src.price ?? -1);
  const { data: existing } = await dupe.maybeSingle<Pick<Listing, "id" | "photos">>();
  if (existing) return NextResponse.json({ id: existing.id, existing: true, sheet_id: await brokerSheet(admin, user.id, user.email, share.fromUser, sender, existing) });

  const fields = Object.fromEntries(EDITABLE_LISTING_FIELDS.map((k) => [k, src[k]]));
  const { data: created, error } = await admin
    .from("listings")
    .insert({ ...fields, user_id: user.id, source_url: src.source_url, source_site: src.source_site, extraction_status: src.extraction_status, photos: [] })
    .select("id")
    .single();
  if (error || !created) return NextResponse.json({ error: "Couldn't add the listing." }, { status: 500 });

  // Copy photos into this user's folder.
  const photos: Photo[] = [];
  for (const [i, p] of src.photos.entries()) {
    const ext = p.path.split(".").pop() || "jpg";
    const path = `${user.id}/listings/${created.id}/${String(i).padStart(2, "0")}.${ext}`;
    const { error: copyError } = await admin.storage.from("media").copy(p.path, path);
    if (copyError) continue;
    photos.push({ ...p, path, url: admin.storage.from("media").getPublicUrl(path).data.publicUrl });
  }
  await admin.from("listings").update({ photos }).eq("id", created.id);

  return NextResponse.json({ id: created.id, sheet_id: await brokerSheet(admin, user.id, user.email, share.fromUser, sender, { id: created.id, photos }) });
}

/**
 * Brokers only: links both sides as partners (once), so the broker can co-brand with the realtor and the
 * realtor can send future listings, then returns the broker's latest sheet for the listing or a new one
 * co-branded with that realtor. Null for realtors (or if the sheet couldn't be made: they get the listing).
 */
async function brokerSheet(
  admin: ReturnType<typeof createAdminClient>,
  userId: string,
  userEmail: string | undefined,
  senderId: string,
  sender: Profile | null,
  listing: Pick<Listing, "id" | "photos">,
): Promise<string | null> {
  const { data: me } = await admin.from("profiles").select("*").eq("id", userId).maybeSingle<Profile>();
  if (me?.role !== "mortgage_broker") return null;

  let realtor: PartnerRealtor | null = null;
  if (sender) {
    const senderEmail = sender.email ? undefined : (await admin.auth.admin.getUserById(senderId)).data.user?.email;
    realtor = await addPartner(admin, userId, "realtor", sender, senderEmail);
  }
  await addPartner(admin, senderId, "broker", me, userEmail);

  const { data: sheet } = await admin.from("feature_sheets").select("id").eq("user_id", userId).eq("listing_id", listing.id).order("updated_at", { ascending: false }).limit(1).maybeSingle();
  if (sheet) return sheet.id;
  const { data: created } = await admin.from("feature_sheets").insert(newSheetRow(me, listing, realtor)).select("id").single();
  return created?.id ?? null;
}

/**
 * Saves a SocialSpark user as someone's partner, unless a partner with the same email or name exists. Returns the partner.
 * New accounts may not have a name yet: their email stands in (the owner can edit it on the Partners page).
 */
async function addPartner(admin: ReturnType<typeof createAdminClient>, ownerId: string, kind: "realtor" | "broker", person: Profile, fallbackEmail?: string): Promise<PartnerRealtor | null> {
  const email = (person.email || fallbackEmail || "").toLowerCase() || null;
  const name = person.full_name?.trim() || email;
  if (!name) return null;
  const { data: mine } = await admin.from("partner_realtors").select(PARTNER_COLUMNS).eq("user_id", ownerId).eq("kind", kind).returns<PartnerRealtor[]>();
  const match = mine?.find((p) => (email && p.email?.toLowerCase() === email) || p.full_name.trim().toLowerCase() === name.toLowerCase());
  if (match) return match;
  let headshot: string | null = null;
  if (person.headshot_path) {
    const target = `${ownerId}/partners/${Date.now()}.${person.headshot_path.split(".").pop() || "jpg"}`;
    if (!(await admin.storage.from("media").copy(person.headshot_path, target)).error) headshot = target;
  }
  const { data } = await admin
    .from("partner_realtors")
    .insert({
      user_id: ownerId,
      kind,
      full_name: name,
      title: person.title,
      brokerage_name: person.brokerage_name,
      license_number: person.license_number,
      phone: person.phone,
      email,
      website: person.website,
      headshot_path: headshot,
    })
    .select(PARTNER_COLUMNS)
    .single<PartnerRealtor>();
  return data ?? null;
}
