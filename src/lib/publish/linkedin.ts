import { mapLimit } from "./limit";

// LinkedIn Posts API (versioned REST). Personal posting needs the
// "Share on LinkedIn" + "Sign In with LinkedIn using OpenID Connect" products.

const apiVersion = () => process.env.LINKEDIN_API_VERSION || "202509";

export const LINKEDIN_SCOPES = "openid profile w_member_social";

/** LinkedIn rejected the token (expired after ~60 days, or revoked): the member must reconnect. */
export class LinkedInAuthError extends Error {}

function headers(token: string, extra: Record<string, string> = {}) {
  return {
    Authorization: `Bearer ${token}`,
    "LinkedIn-Version": apiVersion(),
    "X-Restli-Protocol-Version": "2.0.0",
    ...extra,
  };
}

export function linkedinAuthUrl(state: string, redirectUri: string) {
  const u = new URL("https://www.linkedin.com/oauth/v2/authorization");
  u.searchParams.set("response_type", "code");
  u.searchParams.set("client_id", process.env.LINKEDIN_CLIENT_ID!);
  u.searchParams.set("redirect_uri", redirectUri);
  u.searchParams.set("state", state);
  u.searchParams.set("scope", LINKEDIN_SCOPES);
  return u.toString();
}

export async function linkedinExchangeCode(code: string, redirectUri: string) {
  const res = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      client_id: process.env.LINKEDIN_CLIENT_ID!,
      client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
    }),
  });
  const tok = await res.json();
  if (!res.ok) throw new Error(`LinkedIn: ${tok.error_description ?? res.status}`);

  const me = await fetch("https://api.linkedin.com/v2/userinfo", { headers: { Authorization: `Bearer ${tok.access_token}` } }).then((r) =>
    r.json(),
  );
  return {
    external_id: `urn:li:person:${me.sub}`,
    account_name: me.name as string,
    avatar_url: (me.picture as string) ?? null,
    access_token: tok.access_token as string,
    refresh_token: (tok.refresh_token as string) ?? null,
    expires_at: new Date(Date.now() + (tok.expires_in ?? 5184000) * 1000).toISOString(),
  };
}

/** Escapes LinkedIn "little text" reserved characters and turns #tags into hashtag elements. */
export function toLittleText(text: string) {
  const escaped = text.replace(/[\\|{}@[\]()<>*_~]/g, (c) => `\\${c}`);
  return escaped.replace(/#([\p{L}\p{N}_]+)/gu, (_, tag) => `{hashtag|\\#|${tag}}`);
}

async function uploadImage(token: string, owner: string, imageUrl: string) {
  const init = await fetch("https://api.linkedin.com/rest/images?action=initializeUpload", {
    method: "POST",
    headers: headers(token, { "Content-Type": "application/json" }),
    body: JSON.stringify({ initializeUploadRequest: { owner } }),
  });
  const initJson = await init.json();
  if (init.status === 401) throw new LinkedInAuthError(initJson.message ?? "Unauthorized");
  if (!init.ok) throw new Error(`LinkedIn image init: ${initJson.message ?? init.status}`);
  const { uploadUrl, image } = initJson.value as { uploadUrl: string; image: string };

  const bytes = await fetch(imageUrl).then((r) => r.arrayBuffer());
  const put = await fetch(uploadUrl, { method: "PUT", headers: { Authorization: `Bearer ${token}` }, body: bytes });
  if (!put.ok) throw new Error(`LinkedIn image upload: HTTP ${put.status}`);
  return image;
}

export async function publishLinkedIn(authorUrn: string, token: string, imageUrls: string[], commentary: string, altText: string, beforeGoLive: () => Promise<void> = async () => {}) {
  const images = await mapLimit(imageUrls.slice(0, 9), 5, (url) => uploadImage(token, authorUrn, url));

  const content =
    images.length === 1
      ? { media: { id: images[0], altText } }
      : { multiImage: { images: images.map((id) => ({ id, altText })) } };

  await beforeGoLive();
  const res = await fetch("https://api.linkedin.com/rest/posts", {
    method: "POST",
    headers: headers(token, { "Content-Type": "application/json" }),
    body: JSON.stringify({
      author: authorUrn,
      commentary: toLittleText(commentary),
      visibility: "PUBLIC",
      distribution: { feedDistribution: "MAIN_FEED", targetEntities: [], thirdPartyDistributionChannels: [] },
      content,
      lifecycleState: "PUBLISHED",
      isReshareDisabledByAuthor: false,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    if (res.status === 401) throw new LinkedInAuthError(err.message ?? "Unauthorized");
    throw new Error(`LinkedIn: ${err.message ?? `HTTP ${res.status}`}`);
  }
  const id = res.headers.get("x-restli-id") ?? "";
  return { id, url: id ? `https://www.linkedin.com/feed/update/${id}` : null };
}

/** Deletes a post published through SocialSpark. Already-deleted posts count as success. */
export async function deleteLinkedInPost(postUrn: string, token: string) {
  const res = await fetch(`https://api.linkedin.com/rest/posts/${encodeURIComponent(postUrn)}`, {
    method: "DELETE",
    headers: headers(token),
  });
  if (res.ok || res.status === 404 || res.status === 410) return;
  const err = await res.json().catch(() => ({}));
  throw new Error(`LinkedIn: ${err.message ?? `HTTP ${res.status}`}`);
}
