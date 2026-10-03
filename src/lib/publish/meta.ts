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

async function call<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.error) {
    throw new Error(`Meta: ${json.error?.message ?? `HTTP ${res.status}`}`);
  }
  return json as T;
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

export async function publishFacebook(pageId: string, token: string, imageUrls: string[], message: string) {
  if (imageUrls.length === 1) {
    const res = await post<{ id: string; post_id?: string }>(`/${pageId}/photos`, {
      url: imageUrls[0],
      caption: message,
      access_token: token,
    });
    const postId = res.post_id ?? res.id;
    return { id: postId, url: `https://www.facebook.com/${postId}` };
  }
  // Upload unpublished photos a few at a time (order preserved), then attach them to one post.
  const media = await mapLimit(imageUrls, 5, async (url) => {
    const photo = await post<{ id: string }>(`/${pageId}/photos`, { url, published: "false", access_token: token });
    return { media_fbid: photo.id };
  });
  const res = await post<{ id: string }>(`/${pageId}/feed`, {
    message,
    attached_media: JSON.stringify(media),
    access_token: token,
  });
  return { id: res.id, url: `https://www.facebook.com/${res.id}` };
}

async function waitForContainer(containerId: string, token: string) {
  for (let i = 0; i < 20; i++) {
    const s = await call<{ status_code: string }>(graph(`/${containerId}?fields=status_code&access_token=${token}`));
    if (s.status_code === "FINISHED") return;
    if (s.status_code === "ERROR" || s.status_code === "EXPIRED") throw new Error(`Instagram: media processing ${s.status_code}`);
    await new Promise((r) => setTimeout(r, 1500));
  }
  throw new Error("Instagram: media processing timed out");
}

/** Instagram requires JPEG images hosted at public URLs. */
export async function publishInstagram(igUserId: string, token: string, imageUrls: string[], caption: string) {
  let containerId: string;
  if (imageUrls.length === 1) {
    containerId = (await post<{ id: string }>(`/${igUserId}/media`, { image_url: imageUrls[0], caption, access_token: token })).id;
  } else {
    const children = await mapLimit(imageUrls.slice(0, 10), 5, async (url) =>
      (await post<{ id: string }>(`/${igUserId}/media`, { image_url: url, is_carousel_item: "true", access_token: token })).id,
    );
    await Promise.all(children.map((c) => waitForContainer(c, token)));
    containerId = (
      await post<{ id: string }>(`/${igUserId}/media`, {
        media_type: "CAROUSEL",
        children: children.join(","),
        caption,
        access_token: token,
      })
    ).id;
  }
  await waitForContainer(containerId, token);
  const published = await post<{ id: string }>(`/${igUserId}/media_publish`, { creation_id: containerId, access_token: token });
  const link = await call<{ permalink?: string }>(graph(`/${published.id}?fields=permalink&access_token=${token}`)).catch(() => ({}) as { permalink?: string });
  return { id: published.id, url: link.permalink ?? null };
}
