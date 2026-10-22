/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { createAdminClient, getUser } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/mortgage";
import { readShareToken } from "@/lib/share-token";
import type { Listing, Profile } from "@/lib/types";
import { AddSharedListing } from "./AddSharedListing";

export const metadata = { title: "Shared listing", robots: { index: false, follow: false } };

/** Landing page for a listing a realtor shared with a mortgage broker. */
export default async function SharedListingPage({ params }: PageProps<"/shared/[token]">) {
  const { token } = await params;
  const share = readShareToken(token);
  const admin = createAdminClient();
  const [{ data: listing }, { data: sender }] = share
    ? await Promise.all([
        admin.from("listings").select("address, city, province, price, bedrooms, bathrooms, photos").eq("id", share.listingId).eq("user_id", share.fromUser).maybeSingle<Pick<Listing, "address" | "city" | "province" | "price" | "bedrooms" | "bathrooms" | "photos">>(),
        admin.from("profiles").select("full_name, brokerage_name").eq("id", share.fromUser).maybeSingle<Pick<Profile, "full_name" | "brokerage_name">>(),
      ])
    : [{ data: null }, { data: null }];
  const { supabase, user } = await getUser();
  const signedIn = !!user && !user.is_anonymous;
  const { data: me } = signedIn ? await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle<Pick<Profile, "role">>() : { data: null };

  if (!share || !listing) {
    return (
      <div className="mx-auto max-w-md px-4">
        <div className="card p-8 text-center">
          <h1 className="text-xl font-semibold">This link has expired</h1>
          <p className="mt-2 text-sm text-muted">Shared listings stay available for 30 days, or the realtor may have removed it. Ask them to send it again.</p>
          <Link href="/" className="btn-primary mt-6 rounded-full">Go to SocialSpark</Link>
        </div>
      </div>
    );
  }

  const where = [listing.address, listing.city, listing.province].filter(Boolean).join(", ");
  const photo = listing.photos[0]?.url;
  return (
    <div className="mx-auto max-w-lg px-4">
      <div className="card overflow-hidden">
        {photo && <img src={photo} alt={`Photo of ${where}`} className="aspect-[16/10] w-full object-cover" />}
        <div className="space-y-4 p-6">
          <p className="text-sm text-muted">
            <strong className="text-foreground">{sender?.full_name ?? "A realtor"}</strong>
            {sender?.brokerage_name ? ` (${sender.brokerage_name})` : ""} shared this listing with you.
          </p>
          <div>
            <h1 className="text-2xl font-semibold">{where || "Shared listing"}</h1>
            <p className="text-muted">
              {[listing.price != null ? formatCurrency(listing.price) : null, listing.bedrooms != null ? `${listing.bedrooms} beds` : null, listing.bathrooms != null ? `${listing.bathrooms} baths` : null]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
          {signedIn ? (
            <AddSharedListing token={token} broker={me?.role === "mortgage_broker"} realtorName={sender?.full_name ?? null} />
          ) : (
            <>
              <Link href={`/login?next=${encodeURIComponent(`/shared/${token}`)}&role=mortgage_broker`} className="btn-primary h-12 w-full rounded-full text-base">
                Sign in to add it to your listings
              </Link>
              <p className="text-xs text-muted">New to SocialSpark? Enter your email on the next page to create a free account.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
