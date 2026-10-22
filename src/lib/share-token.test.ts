import { beforeAll, describe, expect, it } from "vitest";
import { createShareToken, readShareToken, SHARE_DAYS } from "./share-token";

beforeAll(() => {
  process.env.SUPABASE_SECRET_KEY = "test-secret";
});

const p = { listingId: "11111111-1111-1111-1111-111111111111", fromUser: "22222222-2222-2222-2222-222222222222", toEmail: "Broker@Example.ca" };

describe("share tokens", () => {
  it("round-trips and lower-cases the email", () => {
    const r = readShareToken(createShareToken(p));
    expect(r?.listingId).toBe(p.listingId);
    expect(r?.fromUser).toBe(p.fromUser);
    expect(r?.toEmail).toBe("broker@example.ca");
  });
  it("rejects a tampered token", () => {
    const t = createShareToken(p);
    const [body, sig] = t.split(".");
    const forged = Buffer.from(JSON.stringify({ ...JSON.parse(Buffer.from(body, "base64url").toString()), l: "other" })).toString("base64url");
    expect(readShareToken(`${forged}.${sig}`)).toBeNull();
    expect(readShareToken(`${body}.${sig.slice(0, -2)}xx`)).toBeNull();
    expect(readShareToken("garbage")).toBeNull();
  });
  it("expires after the share window", () => {
    const now = Date.now();
    const t = createShareToken(p, now);
    expect(readShareToken(t, now + (SHARE_DAYS - 1) * 86_400_000)).not.toBeNull();
    expect(readShareToken(t, now + (SHARE_DAYS + 1) * 86_400_000)).toBeNull();
  });
});
