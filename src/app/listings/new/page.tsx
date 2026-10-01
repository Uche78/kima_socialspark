import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { describeSourceUrl } from "@/lib/listing-fields";
import type { Listing } from "@/lib/types";
import { ListingEditor } from "../[id]/ListingEditor";

// Manual entry: an unsaved draft that only becomes a listing when the user clicks Save listing.
export default async function NewListingPage({ searchParams }: PageProps<"/listings/new">) {
  const { user } = await getUser();
  if (!user) redirect("/");
  const { source_url } = await searchParams;
  const source = describeSourceUrl(typeof source_url === "string" ? source_url : null);

  const draft: Listing = {
    id: "",
    user_id: user.id,
    source_url: source.source_url,
    source_site: source.source_site,
    extraction_status: "manual",
    extraction_notes: null,
    address: source.address,
    city: null,
    province: null,
    postal_code: null,
    price: null,
    transaction_type: "sale",
    property_type: null,
    bedrooms: null,
    bathrooms: null,
    square_feet: null,
    lot_size: null,
    year_built: null,
    mls_number: null,
    description: null,
    features: [],
    listing_brokerage: null,
    open_house: null,
    photos: [],
    created_at: "",
  };

  return (
    <div className="mx-auto max-w-3xl px-4">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <Link href="/" className="text-sm text-muted hover:underline">← All listings</Link>
          <h1 className="mt-1 text-2xl font-semibold">New listing</h1>
        </div>
        <Link href="/" className="btn-ghost">Cancel</Link>
      </div>
      <ListingEditor listing={draft} isDraft />
    </div>
  );
}
