"use client";

import { SlideCanvas } from "@/components/SlideCanvas";
import { ScaledSlide } from "@/components/ScaledSlide";
import { PLATFORM_SPECS } from "@/lib/types";
import { DEMO_AGENT, demoDesign, demoProfile, type DemoPost } from "./demo-posts";

/** A demo post shown the way each platform's feed frames it. */
export function PlatformPostCard({ post, className = "", captionLines = 2 }: { post: DemoPost; className?: string; captionLines?: 2 | 5 }) {
  const clamp = captionLines === 5 ? "line-clamp-5" : "line-clamp-2";
  const size = PLATFORM_SPECS[post.platform].sizes[post.aspect];
  const image = (
    <ScaledSlide width={size.w} height={size.h} maxWidth={2000} initialWidth={230}>
      <SlideCanvas
        slide={post.slide}
        index={0}
        total={post.slides}
        listing={post.listing}
        profile={demoProfile}
        design={demoDesign(post)}
        mortgage={null}
        language="en"
        postType={post.postType}
        width={size.w}
        height={size.h}
      />
    </ScaledSlide>
  );

  return (
    <article
      aria-hidden
      className={`overflow-hidden rounded-2xl bg-white text-[11px] leading-snug text-[#141414] shadow-[0_10px_30px_-12px_rgba(15,42,68,0.35)] ring-1 ring-black/5 ${className}`}
    >
      {post.platform === "instagram" && <Instagram post={post} image={image} clamp={clamp} />}
      {post.platform === "facebook" && <Facebook post={post} image={image} clamp={clamp} />}
      {post.platform === "linkedin" && <LinkedIn post={post} image={image} clamp={clamp} />}
    </article>
  );
}

function Avatar({ ring }: { ring?: boolean }) {
  return (
    <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#0f2a44] text-[10px] font-semibold text-[#d4a24c] ${ring ? "ring-2 ring-pink-500 ring-offset-1" : ""}`}>
      {DEMO_AGENT.initials}
    </span>
  );
}

function Dots({ count }: { count: number }) {
  if (count <= 1) return null;
  return (
    <div className="flex justify-center gap-1">
      {Array.from({ length: Math.min(count, 5) }, (_, i) => (
        <span key={i} className={`h-1 w-1 rounded-full ${i === 0 ? "bg-sky-500" : "bg-black/20"}`} />
      ))}
    </div>
  );
}

function Instagram({ post, image, clamp }: { post: DemoPost; image: React.ReactNode; clamp: string }) {
  return (
    <>
      <header className="flex items-center gap-2 px-2.5 py-2">
        <Avatar ring />
        <div className="min-w-0 flex-1">
          <div className="truncate font-semibold">{DEMO_AGENT.handle}</div>
          <div className="truncate text-[10px] text-black/60">{post.listing.city}, Ontario</div>
        </div>
        <span className="text-black/60">•••</span>
      </header>
      {image}
      <div className="space-y-1.5 px-2.5 pb-3 pt-2">
        <div className="flex items-center gap-3 text-[15px]">
          <span>♡</span>
          <span>💬</span>
          <span>➤</span>
          <span className="flex-1"><Dots count={post.slides} /></span>
          <span>🔖</span>
        </div>
        <div className="font-semibold">{post.likes.toLocaleString("en-CA")} likes</div>
        <p className={clamp}>
          <span className="font-semibold">{DEMO_AGENT.handle}</span> {post.caption}
        </p>
      </div>
    </>
  );
}

function Facebook({ post, image, clamp }: { post: DemoPost; image: React.ReactNode; clamp: string }) {
  return (
    <>
      <header className="flex items-center gap-2 px-3 pt-2.5">
        <Avatar />
        <div className="min-w-0 flex-1">
          <div className="truncate font-semibold">{DEMO_AGENT.name}, {DEMO_AGENT.title}</div>
          <div className="text-[10px] text-black/60">2h · 🌐</div>
        </div>
        <span className="text-black/60">•••</span>
      </header>
      <div className="px-3 py-2">
        <p className={clamp}>{post.caption}</p>
      </div>
      {image}
      <div className="flex items-center justify-between px-3 py-1.5 text-[10px] text-black/55">
        <span>👍❤️ {post.likes}</span>
        <span>{post.comments} comments</span>
      </div>
      <div className="mx-3 flex justify-around border-t border-black/10 py-1.5 text-[10px] font-semibold text-black/60">
        <span>Like</span>
        <span>Comment</span>
        <span>Share</span>
      </div>
    </>
  );
}

function LinkedIn({ post, image, clamp }: { post: DemoPost; image: React.ReactNode; clamp: string }) {
  return (
    <>
      <header className="flex items-start gap-2 px-3 pt-2.5">
        <Avatar />
        <div className="min-w-0 flex-1">
          <div className="truncate font-semibold">
            {DEMO_AGENT.name} <span className="font-normal text-black/60">· 1st</span>
          </div>
          <div className="truncate text-[10px] text-black/55">{DEMO_AGENT.title} at {DEMO_AGENT.brokerage}</div>
          <div className="text-[10px] text-black/60">1d · 🌐</div>
        </div>
      </header>
      <div className="px-3 py-2">
        <p className={clamp}>{post.caption}</p>
      </div>
      {image}
      <div className="px-3 py-1.5 text-[10px] text-black/55">
        👍💡 {post.likes} · {post.comments} comments
      </div>
      <div className="mx-3 flex justify-around border-t border-black/10 py-1.5 text-[10px] font-semibold text-black/60">
        <span>Like</span>
        <span>Comment</span>
        <span>Repost</span>
        <span>Send</span>
      </div>
    </>
  );
}
