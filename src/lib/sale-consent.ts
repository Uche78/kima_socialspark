// Written consent for Sold posts. Advertising a property as sold needs the parties' written consent
// (in Ontario, RECO Bulletin 5.4: the seller's before closing, the buyer's after, and both to show the
// price or terms). The app records that the user confirmed it; it doesn't judge whether a post complies.

import type { PostType } from "./types";

export type SaleConsent = {
  /** When the user confirmed they have written consent (set by the server, never the browser). */
  confirmed_at: string;
  /** The consent also covers showing the price (both the seller and the buyer agreed). */
  covers_price: boolean;
};

export const SALE_CONSENT_CODE = "sale_consent_required";
export const SALE_CONSENT_CREATE_ERROR = "Confirm you have written consent to advertise this sale.";
export const SALE_CONSENT_PUBLISH_ERROR = "Confirm you have written consent to advertise this sale, then publish again.";

/** Only Sold posts need sale consent. */
export function needsSaleConsent(postType: PostType | string): boolean {
  return postType === "sold";
}

/** A Sold post can't be published or scheduled until its consent is recorded. */
export function saleConsentMissing(post: { post_type: PostType | string; sale_consent?: SaleConsent | null }): boolean {
  return needsSaleConsent(post.post_type) && !post.sale_consent;
}

/** Whether the post's design may show the price: Sold posts only with both parties' consent. */
export function priceAllowed(postType: PostType | string, consent: SaleConsent | null | undefined): boolean {
  return !needsSaleConsent(postType) || !!consent?.covers_price;
}

/** The default "Price" toggle for a new post. Unchanged for other post types. */
export function defaultShowPrice(postType: PostType | string, hasPrice: boolean, consent: SaleConsent | null | undefined): boolean {
  return hasPrice && priceAllowed(postType, consent);
}

/** Reads `{ covers_price }` sent by the browser (anything else means no consent). */
export function readConsentRequest(raw: unknown): { covers_price: boolean } | null {
  if (!raw || typeof raw !== "object") return null;
  return { covers_price: (raw as { covers_price?: unknown }).covers_price === true };
}

/** Consent as stored on a post: the timestamp always comes from the server. */
export function confirmedNow(covers_price: boolean, now = new Date()): SaleConsent {
  return { confirmed_at: now.toISOString(), covers_price };
}
