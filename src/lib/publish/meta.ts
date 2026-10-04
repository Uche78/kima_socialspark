import { mapLimit } from "./limit";

// Meta Graph API: Facebook Pages + Instagram professional accounts.
// Requires app review for pages_manage_posts and instagram_content_publish.

const version = () => process.env.META_GRAPH_VERSION || "v23.0";
const graph = (path: string) => `https://graph.facebook.com/${version()}${path}`;

export const META_SCOPES = [
  "pages_show_list",
  "pages_read_engagement",
  "pages_manage_posts",
  "business_management",
  "instagram_basic",
  "instagram_content_publish",
].join(",");

/** A Graph API error, with Meta's code and whether Meta says retrying may help. */
export class MetaError extends Error {
  constructor(message: string, readonly code?: number, readonly subcode?: number, readonly transient = false) {
    super(message);
  }
}

// Meta's generic "unknown"/"service" errors and rate limits; its docs say to retry these.
const TRANSIENT_CODES = new Set([1, 2, 4, 17, 32, 341, 613]);

async function call<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.error) {
    const e = json.error ?? {};
    const code = typeof e.code === "number" ? e.code : undefined;
    const subcode = typeof e.error_subcode === "number" ? e.error_subcode : undefined;
    const transient = e.is_transient === true || (code !== undefined && TRANSIENT_CODES.has(code)) || res.status >= 500;
    const ref = [code !== undefined && `code ${code}${subcode ? `/${subcode}` : ""}`, e.fbtrace_id && `trace ${e.fbtrace_id}`].filter(Boolean).join(", ");
    throw new MetaError(`Meta: ${e.message ?? `HTTP ${res.status}`}${ref ? ` (${ref})` : ""}`, code, subcode, transient);
  }
  return json as T;
}

/** Labels an error with the step that failed, e.g. "uploading photo 7 of 20". */
async function step<T>(label: string, fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof MetaError) {
      const hint = err.transient ? ". This is usually temporary on Meta's side. Please try publishing again." : "";
      throw new MetaError(`${err.message.replace(/^Meta: /, `Meta (${label}): `)}${hint}`, err.code, err.subcode, err.transient);
    }
    throw err;
  }
}

/**
 * Retries calls Meta marks as temporary. Only for steps that are safe to repeat
 * (unpublished uploads, containers, status checks), never the call that makes a post visible.
 */
async function retrying<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
  for (let i = 1; ; i++) {
    try {
      return await fn();
    } catch (err) {
      if (!(err instanceof MetaError) || !err.transient || i >= attempts) throw err;
      console.warn(`Meta transient error, retry ${i}/${attempts - 1}: ${err.message}`);
      await new Promise((r) => setTimeout(r, 1500 * i * i));
    }
  }
}

function post<T>(path: string, params: Record<string, string>) {
  return call<T>(graph(path), { method: "POST", body: new URLSearchParams(params) });
}

export function metaAuthUrl(state: string, redirectUri: string) {
  const u = new URL(`https://www.facebook.com/${version()}/dialog/oauth`);
  u.searchParams.set("client_id", process.env.META_APP_ID!);
  u.searchParams.set("redirect_uri", redirectUri);
  u.searchParams.set("state", state);
  u.searchParams.set("scope", META_SCOPES);
  u.searchParams.set("response_type", "code");
  return u.toString();
}

export type MetaConnectedAccount = {
  platform: "facebook" | "instagram";
  external_id: string;
  account_name: string;
  account_type: string;
  avatar_url: string | null;
  access_token: string;
};

/** Exchanges the OAuth code and returns every Page (and linked Instagram account) the user manages. */
export async function metaExchangeCode(code: string, redirectUri: string): Promise<MetaConnectedAccount[]> {
  const id = process.env.META_APP_ID!;
  const secret = process.env.META_APP_SECRET!;
  const short = await call<{ access_token: string }>(
    graph(`/oauth/access_token?client_id=${id}&redirect_uri=${encodeURIComponent(redirectUri)}&client_secret=${secret}&code=${encodeURIComponent(code)}`),
  );
  const long = await call<{ access_token: string }>(
    graph(`/oauth/access_token?grant_type=fb_exchange_token&client_id=${id}&client_secret=${secret}&fb_exchange_token=${short.access_token}`),
  );
  // Page tokens derived from a long-lived user token do not expire.
  const pages = await call<{
    data: {
      id: string;
      name: string;
      access_token: string;
      picture?: { data?: { url?: string } };
      instagram_business_account?: { id: string; username?: string; profile_picture_url?: string };
    }[];
  }>(
    graph(
      `/me/accounts?fields=id,name,access_token,picture{url},instagram_business_account{id,username,profile_picture_url}&limit=100&access_token=${long.access_token}`,
    ),
  );

  const accounts: MetaConnectedAccount[] = [];
  for (const p of pages.data) {
    accounts.push({
      platform: "facebook",
      external_id: p.id,
      account_name: p.name,
      account_type: "page",
      avatar_url: p.picture?.data?.url ?? null,
      access_token: p.access_token,
    });
    if (p.instagram_business_account) {
      accounts.push({
        platform: "instagram",
        external_id: p.instagram_business_account.id,
        account_name: p.instagram_business_account.username ?? `${p.name} (Instagram)`,
        account_type: "ig_business",
        avatar_url: p.instagram_business_account.profile_picture_url ?? null,
        access_token: p.access_token,
      });
    }
  }
  return accounts;
}

/** Called right before the step that makes a post visible; throws if the user cancelled. */
export type BeforeGoLive = () => Promise<void>;

export async function publishFacebook(pageId: string, token: string, imageUrls: string[], message: string, beforeGoLive: BeforeGoLive = async () => {}) {
  if (imageUrls.length === 1) {
    await beforeGoLive();
    const res = await step("publishing the photo", () =>
      post<{ id: string; post_id?: string }>(`/${pageId}/photos`, { url: imageUrls[0], caption: message, access_token: token }),
    );
    const postId = res.post_id ?? res.id;
    return { id: postId, url: `https://www.facebook.com/${postId}` };
  }
  // Upload unpublished photos a few at a time (order preserved), then attach them to one post.
  const media = await mapLimit(imageUrls, 5, async (url, i) => {
    const photo = await step(`uploading photo ${i + 1} of ${imageUrls.length}`, () =>
      retrying(() => post<{ id: string }>(`/${pageId}/photos`, { url, published: "false", access_token: token })),
    );
    return { media_fbid: photo.id };
  });
  await beforeGoLive();
  const res = await step("creating the post", () =>
    post<{ id: string }>(`/${pageId}/feed`, { message, attached_media: JSON.stringify(media), access_token: token }),
  );
  return { id: res.id, url: `https://www.facebook.com/${res.id}` };
}

async function waitForContainer(containerId: string, token: string) {
  for (let i = 0; i < 20; i++) {
    const s = await retrying(() => call<{ status_code: string }>(graph(`/${containerId}?fields=status_code&access_token=${token}`)));
    if (s.status_code === "FINISHED") return;
    if (s.status_code === "ERROR" || s.status_code === "EXPIRED") throw new Error(`Instagram: media processing ${s.status_code}`);
    await new Promise((r) => setTimeout(r, 1500));
  }
  throw new Error("Instagram: media processing timed out");
}

/** Instagram requires JPEG images hosted at public URLs. */
export async function publishInstagram(igUserId: string, token: string, imageUrls: string[], caption: string, beforeGoLive: BeforeGoLive = async () => {}) {
  // Containers aren't visible until media_publish, so creating them is safe to retry.
  let containerId: string;
  if (imageUrls.length === 1) {
    containerId = (
      await step("uploading the photo", () =>
        retrying(() => post<{ id: string }>(`/${igUserId}/media`, { image_url: imageUrls[0], caption, access_token: token })),
      )
    ).id;
  } else {
    const urls = imageUrls.slice(0, 10);
    const children = await mapLimit(urls, 5, async (url, i) =>
      (
        await step(`uploading photo ${i + 1} of ${urls.length}`, () =>
          retrying(() => post<{ id: string }>(`/${igUserId}/media`, { image_url: url, is_carousel_item: "true", access_token: token })),
        )
      ).id,
    );
    await step("processing the photos", () => Promise.all(children.map((c) => waitForContainer(c, token))));
    containerId = (
      await step("preparing the carousel", () =>
        retrying(() =>
          post<{ id: string }>(`/${igUserId}/media`, { media_type: "CAROUSEL", children: children.join(","), caption, access_token: token }),
        ),
      )
    ).id;
  }
  await step("processing the post", () => waitForContainer(containerId, token));
  await beforeGoLive();
  const published = await step("publishing the post", () =>
    post<{ id: string }>(`/${igUserId}/media_publish`, { creation_id: containerId, access_token: token }),
  );
  const link = await call<{ permalink?: string }>(graph(`/${published.id}?fields=permalink&access_token=${token}`)).catch(() => ({}) as { permalink?: string });
  return { id: published.id, url: link.permalink ?? null };
}

/** Deletes a Page post published through SocialSpark. Already-deleted posts count as success. */
export async function deleteFacebookPost(postId: string, token: string) {
  const res = await fetch(graph(`/${postId}?access_token=${encodeURIComponent(token)}`), { method: "DELETE" });
  const json = await res.json().catch(() => ({}));
  if (res.ok && json.success !== false) return;
  // Error 100 / subcode 33: the object no longer exists (already deleted on Facebook).
  if (json.error?.code === 100) return;
  throw new Error(`Facebook: ${json.error?.message ?? `HTTP ${res.status}`}`);
}
