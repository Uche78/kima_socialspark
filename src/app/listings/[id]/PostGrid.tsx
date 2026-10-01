"use client";

import Link from "next/link";
import { SlideCanvas } from "@/components/SlideCanvas";
import { canvasPropsFor, slideSize } from "@/components/usePostExport";
import { PLATFORM_SPECS, POST_TYPES, type Listing, type Post, type Profile } from "@/lib/types";

const THUMB_WIDTH = 180;

const STATUS_STYLE: Record<Post["status"], string> = {
  draft: "bg-black/5 text-muted",
  scheduled: "bg-blue-50 text-blue-800",
  publishing: "bg-amber-50 text-amber-800",
  published: "bg-green-50 text-green-800",
  failed: "bg-red-50 text-red-800",
};

/** Every post made for this listing, newest first. Clicking one opens the post editor. */
export function PostGrid({ posts, listing, profile }: { posts: Post[]; listing: Listing; profile: Profile }) {
  if (!posts.length) return null;
  return (
    <section className="card p-5">
      <h2 className="mb-4 text-lg font-semibold">Posts for this listing ({posts.length})</h2>
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${THUMB_WIDTH}px, 1fr))` }}>
        {posts.map((post) => {
          const size = slideSize(post);
          const scale = THUMB_WIDTH / size.w;
          return (
            <Link key={post.id} href={`/posts/${post.id}`} className="group block">
              <div className="overflow-hidden rounded-lg border border-border transition group-hover:shadow-md" style={{ width: THUMB_WIDTH, height: size.h * scale }}>
                <div style={{ transform: `scale(${scale})`, transformOrigin: "top left", width: size.w, height: size.h, pointerEvents: "none" }}>
                  {post.slides[0] && <SlideCanvas {...canvasPropsFor(post, listing, profile)} slide={post.slides[0]} index={0} />}
                </div>
              </div>
              <div className="mt-2 text-sm font-medium group-hover:underline">
                {PLATFORM_SPECS[post.platform].label} · {post.format === "carousel" ? `${post.slides.length} slides` : "Single"}
              </div>
              <div className="flex items-center justify-between gap-2 text-xs text-muted">
                <span>{POST_TYPES[post.post_type]} · {post.language.toUpperCase()}</span>
                <span className={`rounded-full px-2 py-0.5 font-medium ${STATUS_STYLE[post.status]}`}>{post.status}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
