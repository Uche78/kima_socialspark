import { createHmac, timingSafeEqual } from "node:crypto";

// Signed, expiring links for sharing a listing with a mortgage broker (no database row needed).
// Server only: the key is derived from the Supabase service key.

export type SharePayload = { listingId: string; fromUser: string; toEmail: string; expires: number };

export const SHARE_DAYS = 30;

function key() {
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!secret) throw new Error("SUPABASE_SECRET_KEY is not set");
  return createHmac("sha256", secret).update("socialspark:listing-share:v1").digest();
}

const sign = (body: string) => createHmac("sha256", key()).update(body).digest("base64url");

export function createShareToken(p: Omit<SharePayload, "expires">, now = Date.now()): string {
  const body = Buffer.from(JSON.stringify({ l: p.listingId, u: p.fromUser, e: p.toEmail.toLowerCase(), x: now + SHARE_DAYS * 86_400_000 })).toString("base64url");
  return `${body}.${sign(body)}`;
}

/** The payload if the token is authentic and unexpired, else null. */
export function readShareToken(token: string, now = Date.now()): SharePayload | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = Buffer.from(sign(body));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const j = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as { l: string; u: string; e: string; x: number };
    if (typeof j.l !== "string" || typeof j.u !== "string" || typeof j.x !== "number" || j.x < now) return null;
    return { listingId: j.l, fromUser: j.u, toEmail: j.e, expires: j.x };
  } catch {
    return null;
  }
}
