import type { Post } from "./types";

/** Asks for confirmation, then deletes the listing (and its posts and files). Returns true if deleted. */
export async function confirmAndDeleteListing(id: string, posts: Pick<Post, "status">[]): Promise<{ deleted: boolean; error?: string }> {
  const scheduled = posts.filter((p) => p.status === "scheduled").length;
  const message =
    `Delete this listing${posts.length ? ` and its ${posts.length} post${posts.length === 1 ? "" : "s"}` : ""}?` +
    (scheduled ? ` ${scheduled} scheduled post${scheduled === 1 ? " will" : "s will"} be cancelled.` : "") +
    " Photos and images will be removed too. This can't be undone.";
  if (!window.confirm(message)) return { deleted: false };

  const res = await fetch(`/api/listings/${id}`, { method: "DELETE" });
  if (!res.ok) return { deleted: false, error: (await res.json().catch(() => ({}))).error ?? "Couldn't delete the listing." };
  return { deleted: true };
}
