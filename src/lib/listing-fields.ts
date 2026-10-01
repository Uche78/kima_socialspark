import type { Listing } from "./types";

/** Listing columns a user may set directly. */
export const EDITABLE_LISTING_FIELDS = [
  "address",
  "city",
  "province",
  "postal_code",
  "price",
  "transaction_type",
  "property_type",
  "bedrooms",
  "bathrooms",
  "square_feet",
  "lot_size",
  "year_built",
  "mls_number",
  "description",
  "features",
  "listing_brokerage",
  "open_house",
] as const satisfies readonly (keyof Listing)[];

export function pickEditable(input: Record<string, unknown>) {
  return Object.fromEntries(EDITABLE_LISTING_FIELDS.filter((k) => k in input).map((k) => [k, input[k]]));
}

/** Source-site info plus a starting address from REALTOR.ca-style URLs (/real-estate/<id>/<address-slug>). */
export function describeSourceUrl(sourceUrl: string | null | undefined) {
  if (!sourceUrl) return { source_url: null, source_site: null, address: null };
  try {
    const u = new URL(sourceUrl);
    const site = u.hostname.replace(/^www\./, "");
    const m = site === "realtor.ca" && u.pathname.match(/^\/real-estate\/\d+\/([^/]+)/);
    const address = m ? m[1].split("-").map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w)).join(" ") : null;
    return { source_url: u.toString(), source_site: site, address };
  } catch {
    return { source_url: null, source_site: null, address: null };
  }
}
