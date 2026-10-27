import { describe, expect, it } from "vitest";
import { confirmedNow, defaultShowPrice, needsSaleConsent, priceAllowed, readConsentRequest, saleConsentMissing } from "./sale-consent";

const consent = (covers_price: boolean) => ({ confirmed_at: "2026-10-27T14:02:11.000Z", covers_price });

describe("sale consent", () => {
  it("only Sold posts need it", () => {
    expect(needsSaleConsent("sold")).toBe(true);
    for (const t of ["just_listed", "open_house", "price_reduced", "coming_soon", "featured", "feature_sheet"]) expect(needsSaleConsent(t)).toBe(false);
  });

  it("blocks publishing a Sold post until consent is recorded", () => {
    expect(saleConsentMissing({ post_type: "sold", sale_consent: null })).toBe(true);
    expect(saleConsentMissing({ post_type: "sold" })).toBe(true);
    expect(saleConsentMissing({ post_type: "sold", sale_consent: consent(false) })).toBe(false);
    expect(saleConsentMissing({ post_type: "just_listed", sale_consent: null })).toBe(false);
  });

  it("shows the price on a Sold post only with both parties' consent", () => {
    expect(defaultShowPrice("sold", true, null)).toBe(false);
    expect(defaultShowPrice("sold", true, consent(false))).toBe(false);
    expect(defaultShowPrice("sold", true, consent(true))).toBe(true);
    expect(defaultShowPrice("sold", false, consent(true))).toBe(false);
    expect(priceAllowed("sold", consent(false))).toBe(false);
  });

  it("leaves other post types' price default unchanged", () => {
    expect(defaultShowPrice("just_listed", true, null)).toBe(true);
    expect(defaultShowPrice("price_reduced", true, null)).toBe(true);
    expect(defaultShowPrice("open_house", false, null)).toBe(false);
  });

  it("reads only covers_price from the browser, and only true counts", () => {
    expect(readConsentRequest(undefined)).toBeNull();
    expect(readConsentRequest(null)).toBeNull();
    expect(readConsentRequest("yes")).toBeNull();
    expect(readConsentRequest({})).toEqual({ covers_price: false });
    expect(readConsentRequest({ covers_price: "true" })).toEqual({ covers_price: false });
    expect(readConsentRequest({ covers_price: true, confirmed_at: "1999-01-01" })).toEqual({ covers_price: true });
  });

  it("stamps the time on the server", () => {
    const now = new Date("2026-10-27T14:02:11Z");
    expect(confirmedNow(true, now)).toEqual({ confirmed_at: "2026-10-27T14:02:11.000Z", covers_price: true });
  });
});
