import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { attributionFromUrl, fbcFromFbclid, parseAttribution } from "./consent";
import { buildUserData } from "./meta-capi";

describe("attributionFromUrl", () => {
  it("keeps the landing path and ad parameters", () => {
    const a = attributionFromUrl(new URL("https://x.ca/for/social-media-posts-for-condo-realtors?utm_source=facebook&utm_content=P10_Condo_v1&fbclid=abc&other=1"), 1000);
    expect(a).toEqual({ path: "/for/social-media-posts-for-condo-realtors", utm_source: "facebook", utm_content: "P10_Condo_v1", fbclid: "abc", ts: 1000 });
  });

  it("ignores visits that didn't come from an ad", () => {
    expect(attributionFromUrl(new URL("https://x.ca/pricing"))).toBeNull();
  });
});

describe("parseAttribution", () => {
  it("round-trips the cookie value and rejects junk", () => {
    const a = { path: "/", utm_source: "instagram", ts: 5 };
    expect(parseAttribution(encodeURIComponent(JSON.stringify(a)))).toEqual(a);
    expect(parseAttribution("%7Bnope")).toBeNull();
    expect(parseAttribution(undefined)).toBeNull();
  });
});

describe("Meta user data", () => {
  it("hashes the normalised email and user ID, and passes click IDs through", () => {
    const d = buildUserData({ email: "  Agent@Brokerage.CA ", externalId: "user-1", fbc: fbcFromFbclid("abc", 1000), ip: "1.2.3.4" });
    expect(d.em).toEqual([createHash("sha256").update("agent@brokerage.ca").digest("hex")]);
    expect(d.external_id).toEqual([createHash("sha256").update("user-1").digest("hex")]);
    expect(d.fbc).toBe("fb.1.1000.abc");
    expect(d.client_ip_address).toBe("1.2.3.4");
    expect(d).not.toHaveProperty("fbp");
  });
});
