import type { Post } from "./types";

export function fullCaption(post: Pick<Post, "caption" | "hashtags">) {
  const tags = post.hashtags.map((h) => `#${h}`).join(" ");
  return tags ? `${post.caption}\n\n${tags}` : post.caption;
}
