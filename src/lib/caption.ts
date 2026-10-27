import { PLATFORM_SPECS, type Post } from "./types";

export const TOO_MANY_HASHTAGS_CODE = "too_many_hashtags";
export const TOO_MANY_HASHTAGS_ERROR = "Instagram allows up to 5 hashtags in a caption. Remove some, then publish again.";

export function fullCaption(post: Pick<Post, "caption" | "hashtags">) {
  const tags = post.hashtags.map((h) => `#${h}`).join(" ");
  return tags ? `${post.caption}\n\n${tags}` : post.caption;
}

/**
 * Cleans generated hashtags: strips "#" and spaces, drops duplicates (case-insensitive, first wins),
 * and keeps at most `max` when the platform has a cap (Instagram: 5).
 */
export function capHashtags(tags: string[], max?: number): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of tags) {
    const tag = raw.replace(/^#+/, "").replace(/\s+/g, "");
    const key = tag.toLocaleLowerCase();
    if (!tag || seen.has(key)) continue;
    seen.add(key);
    out.push(tag);
  }
  return max == null ? out : out.slice(0, max);
}

// A hashtag: "#" then letters, digits or underscores (accented letters too, e.g. #québec), with at least
// one letter, since "#4" in "Unit #4" isn't a hashtag. Not counted inside words or links ("a#b", "/#top").
const HASHTAG = /(?<![\p{L}\p{N}_/&#])#[\p{L}\p{N}_]*\p{L}[\p{L}\p{N}_]*/gu;

/** How many hashtags Instagram would count in the published caption: the hashtag list plus any typed into the caption. */
export function countHashtags(post: Pick<Post, "caption" | "hashtags">): number {
  return fullCaption(post).match(HASHTAG)?.length ?? 0;
}

/** Over the platform's hashtag cap (Instagram: 5)? Publishing refuses rather than trimming: the user picks which go. */
export function tooManyHashtags(post: Pick<Post, "platform" | "caption" | "hashtags">): boolean {
  const max = PLATFORM_SPECS[post.platform]?.maxHashtags;
  return max != null && countHashtags(post) > max;
}
