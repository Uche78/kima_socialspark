"use client";

/**
 * The two Sold-post consent checkboxes, used when creating a Sold post and in the editor for older ones.
 * The second is only available once the first is ticked.
 */
export function SaleConsentFields({
  consent,
  onConsent,
  price,
  onPrice,
  disabled = false,
  className = "",
}: {
  consent: boolean;
  onConsent: (v: boolean) => void;
  price: boolean;
  onPrice: (v: boolean) => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <div className={`space-y-2 rounded-lg border border-border p-3 text-sm ${className}`}>
      <label className="flex items-start gap-2">
        <input
          type="checkbox"
          name="sale_consent"
          className="mt-1"
          disabled={disabled}
          checked={consent}
          onChange={(e) => {
            onConsent(e.target.checked);
            if (!e.target.checked) onPrice(false);
          }}
        />
        <span>
          <strong>I have written consent to advertise this sale.</strong> In Ontario, RECO requires the seller&apos;s consent before closing and the
          buyer&apos;s after, with the dates it&apos;s valid. Other provinces have their own rules; check your regulator&apos;s.
        </span>
      </label>
      <label className={`flex items-start gap-2 ${consent ? "" : "opacity-50"}`}>
        <input type="checkbox" name="sale_price_consent" className="mt-1" disabled={disabled || !consent} checked={consent && price} onChange={(e) => onPrice(e.target.checked)} />
        <span>My consent also covers showing the price (both the seller and the buyer agreed).</span>
      </label>
    </div>
  );
}
