"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LocalTime } from "./LocalTime";
import { ShareWithBroker, type ListingShare } from "./ShareWithBroker";
import type { PartnerRealtor } from "@/lib/broker";
import { confirmAndDeleteListing } from "@/lib/delete-listing";
import { formatCurrency } from "@/lib/mortgage";
import { PLATFORM_SPECS, type Listing, type Platform, type Post } from "@/lib/types";

/** `brokers` is set for realtors with an account: the card then offers "Send to broker" (and shows the last send). */
export function ListingCard({
  listing,
  posts,
  brokers,
  lastShare = null,
}: {
  listing: Listing;
  posts: Pick<Post, "status" | "platform">[];
  brokers?: PartnerRealtor[];
  lastShare?: ListingShare | null;
}) {
  const router = useRouter();
  const [sent, setSent] = useState(lastShare);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const byPlatform = (Object.keys(PLATFORM_SPECS) as Platform[])
    .map((platform) => [platform, posts.filter((p) => p.platform === platform).length] as const)
    .filter(([, n]) => n > 0);

  async function remove(e: React.MouseEvent) {
    e.preventDefault();
    setDeleting(true);
    const result = await confirmAndDeleteListing(listing.id, posts);
    if (result.deleted) router.refresh();
    else {
      setDeleting(false);
      setError(result.error ?? null);
    }
  }

  return (
    <div className={`card group relative overflow-hidden transition hover:shadow-md ${deleting ? "opacity-50" : ""}`}>
      <Link href={`/listings/${listing.id}`} className="block">
        <div className="aspect-[4/3] bg-black/5">
          {listing.photos[0] && <img src={listing.photos[0].url} alt="" className="h-full w-full object-cover" />}
        </div>
        <div className="p-4">
          <div className="font-medium">{listing.address || "Untitled listing"}</div>
          <div className="text-sm text-muted">
            {[listing.city, listing.province].filter(Boolean).join(", ")}
            {listing.price != null && ` · ${formatCurrency(listing.price)}`}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
            {posts.length === 0 ? (
              <span className="text-muted">No posts yet</span>
            ) : (
              <>
                <span className="font-medium">{posts.length} post{posts.length === 1 ? "" : "s"}</span>
                {byPlatform.map(([platform, n]) => (
                  <span key={platform} className="rounded-full bg-black/5 px-2 py-0.5">
                    {PLATFORM_SPECS[platform].label} {n}
                  </span>
                ))}
              </>
            )}
          </div>
          {error && <div className="mt-1 text-sm text-red-700">{error}</div>}
        </div>
      </Link>
      {/* Outside the card link: a button inside a link would open the listing too. */}
      {brokers && (
        <div className="flex min-h-11 items-center justify-between gap-3 border-t border-border px-4 py-1.5">
          {sent && (
            <span className="min-w-0 flex-1 truncate text-xs text-muted" title={`Sent to ${sent.to_name ?? sent.to_email}`}>
              <span className="text-emerald-700">✓</span> Sent to {sent.to_name?.trim().split(/\s+/)[0] || sent.to_email} · <LocalTime iso={sent.created_at} short />
            </span>
          )}
          <ShareWithBroker
            listingId={listing.id}
            brokers={brokers}
            label={sent ? "Send again" : "Send to broker →"}
            onSent={setSent}
            className={`shrink-0 rounded-md px-2 py-1.5 font-medium transition hover:bg-black/5 ${sent ? "-mr-2 text-xs text-muted" : "-ml-2 text-sm text-brand"}`}
          />
        </div>
      )}
      <button
        onClick={remove}
        disabled={deleting}
        aria-label={`Delete ${listing.address || "listing"}`}
        className="absolute right-2 top-2 rounded-md bg-white/90 px-3 py-2.5 text-xs font-medium sm:px-2.5 sm:py-1 text-red-700 shadow-sm transition hover:bg-white"
      >
        {deleting ? "Deleting…" : "Delete"}
      </button>
    </div>
  );
}
