import { readMortgageSettings, type PartnerRealtor } from "@/lib/broker";
import { sheetConfigFrom } from "@/lib/feature-sheet";
import type { Listing, Profile } from "@/lib/types";

/** A new feature sheet for a listing: the broker's saved defaults, co-branded with `realtor` if given. */
export function newSheetRow(profile: Profile, listing: Pick<Listing, "id" | "photos">, realtor: PartnerRealtor | null) {
  return {
    user_id: profile.id,
    listing_id: listing.id,
    language: profile.province === "QC" ? ("fr" as const) : profile.default_language,
    headline: "",
    photo_index: listing.photos.length ? 0 : null,
    config: sheetConfigFrom(readMortgageSettings(profile.mortgage_settings), realtor),
  };
}
