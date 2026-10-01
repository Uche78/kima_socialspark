import { cookies } from "next/headers";
import { randomBytes } from "node:crypto";

export const PROVIDERS = ["meta", "linkedin"] as const;
export type Provider = (typeof PROVIDERS)[number];

export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || process.env.URL || "http://localhost:3000").replace(/\/$/, "");
}

export function redirectUri(provider: Provider) {
  return `${siteUrl()}/api/connect/${provider}/callback`;
}

const cookieName = (p: Provider) => `oauth_state_${p}`;

export async function createState(provider: Provider) {
  const state = randomBytes(24).toString("hex");
  (await cookies()).set(cookieName(provider), state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });
  return state;
}

export async function verifyState(provider: Provider, state: string | null) {
  const store = await cookies();
  const expected = store.get(cookieName(provider))?.value;
  store.delete(cookieName(provider));
  return !!state && !!expected && state === expected;
}
