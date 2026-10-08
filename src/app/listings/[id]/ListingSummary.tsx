"use client";
/* eslint-disable @next/next/no-img-element */

import { formatCurrency } from "@/lib/mortgage";
import type { Listing } from "@/lib/types";
import { cleanTourUrl } from "@/lib/virtual-tour";

const STRIP_COUNT = 4; // cover + 4 thumbnails = 5 photos, then "+n"

/** Compact, read-only view of the listing. Editing happens in the side panel. */
export function ListingSummary({ listing, onEdit }: { listing: Listing; onEdit: () => void }) {
  const [cover, ...rest] = listing.photos;
  const strip = rest.slice(0, STRIP_COUNT);
  const more = rest.length - strip.length;
  const facts = [
    listing.bedrooms != null && ["Beds", String(listing.bedrooms)],
    listing.bathrooms != null && ["Baths", String(listing.bathrooms)],
    listing.square_feet != null && ["Sq ft", new Intl.NumberFormat("en-CA").format(listing.square_feet)],
    listing.property_type && ["Type", listing.property_type],
    listing.mls_number && ["MLS®", listing.mls_number],
    listing.year_built && ["Built", String(listing.year_built)],
  ].filter(Boolean) as [string, string][];
  const tourUrl = cleanTourUrl(listing.virtual_tour_url);
  const missing = [!listing.price && "price", !listing.bedrooms && "bedrooms", !listing.photos.length && "photos"].filter(Boolean);

  return (
    <section className="card overflow-hidden">
      <button onClick={onEdit} className="block aspect-[4/3] w-full bg-black/5" aria-label="Edit photos">
        {cover && <img src={cover.url} alt="" className="h-full w-full object-cover" />}
      </button>
      {strip.length > 0 && (
        <div className="grid grid-cols-4 gap-1 p-1">
          {strip.map((p, i) => (
            <button key={p.path} onClick={onEdit} className="relative aspect-square overflow-hidden rounded bg-black/5" aria-label="Edit photos">
              <img src={p.url} alt="" className="h-full w-full object-cover" />
              {i === strip.length - 1 && more > 0 && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-sm font-semibold text-white">+{more}</span>
              )}
            </button>
          ))}
        </div>
      )}
      <div className="space-y-4 p-5">
        <div>
          {listing.price != null && (
            <div className="text-2xl font-semibold text-brand">
              {formatCurrency(listing.price)}
              {listing.transaction_type === "rent" && <span className="text-base font-normal text-muted">/month</span>}
            </div>
          )}
          <div className="text-sm text-muted">{[listing.address, listing.city, listing.province, listing.postal_code].filter(Boolean).join(", ")}</div>
        </div>
        {facts.length > 0 && (
          <dl className="grid grid-cols-3 gap-x-3 gap-y-2 text-sm">
            {facts.map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs uppercase tracking-wide text-muted">{k}</dt>
                <dd className="font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        )}
        {listing.description && (
          <p className="line-clamp-3 text-sm leading-relaxed text-foreground/80" title={listing.description}>
            {listing.description}
          </p>
        )}
        {listing.features.length > 0 && (
          <ul className="flex flex-wrap gap-1.5">
            {listing.features.slice(0, 8).map((f) => (
              <li key={f} className="rounded-full bg-black/5 px-2.5 py-1 text-xs">{f}</li>
            ))}
            {listing.features.length > 8 && <li className="px-1 py-1 text-xs text-muted">+{listing.features.length - 8} more</li>}
          </ul>
        )}
        {listing.listing_brokerage && <div className="text-xs text-muted">Listed by {listing.listing_brokerage}</div>}
        {tourUrl && (
          <a href={tourUrl} target="_blank" rel="noreferrer" className="inline-block text-sm font-medium text-brand underline">
            Virtual tour ↗
          </a>
        )}
        {missing.length > 0 && (
          <div className="rounded-lg bg-amber-50 p-2.5 text-xs text-amber-900">Missing: {missing.join(", ")}. Add them for better posts.</div>
        )}
        <button className="btn-secondary w-full" onClick={onEdit}>Edit details &amp; photos</button>
      </div>
    </section>
  );
}
