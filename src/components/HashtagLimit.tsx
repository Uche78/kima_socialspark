import { countHashtags } from "@/lib/caption";
import { PLATFORM_SPECS, type Post } from "@/lib/types";

/** "N / 5 hashtags (Instagram's limit)" under the hashtag field, counting tags typed into the caption too. Red when over. */
export function HashtagLimit({ post }: { post: Pick<Post, "platform" | "caption" | "hashtags"> }) {
  const max = PLATFORM_SPECS[post.platform].maxHashtags;
  if (max == null) return null;
  const n = countHashtags(post);
  const over = n - max;
  return (
    <span className={`mt-1 block text-xs ${over > 0 ? "font-medium text-red-700" : "text-muted"}`}>
      {n} / {max} hashtags ({PLATFORM_SPECS[post.platform].label}&apos;s limit)
      {over > 0 && (
        <>
          . {PLATFORM_SPECS[post.platform].label} allows up to {max} hashtags in a caption. Remove {over} to publish.
        </>
      )}
    </span>
  );
}
