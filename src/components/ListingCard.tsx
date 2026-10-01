"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { confirmAndDeleteListing } from "@/lib/delete-listing";
import { formatCurrency } from "@/lib/mortgage";
import { PLATFORM_SPECS, type Listing, type Platform, type Post } from "@/lib/types";

export function ListingCard({ listing, posts }: { listing: Listing; posts: Pick<Post, "status" | "platform">[] }) {
  const router = useRouter();
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
