"use client";

import Link from "next/link";
import { useState } from "react";
import { SlideCanvas } from "@/components/SlideCanvas";
import { ScaledSlide } from "@/components/ScaledSlide";
import { usePostExport } from "@/components/usePostExport";
import { FocusChips } from "@/components/FocusChips";
import { MAX_FOCUS } from "@/lib/focus";
import { fullCaption } from "@/lib/caption";
import { PLATFORM_SPECS, POST_TYPES, type Listing, type Post, type Profile } from "@/lib/types";

const PREVIEW_WIDTH = 400;

/** Loading placeholder shown while Claude writes the post. */
export function LatestResultSkeleton({ label }: { label: string }) {
  return (
    <section className="card p-5">
      <div className="mb-4 flex items-center gap-3">
        <span className="h-3 w-3 animate-pulse rounded-full bg-accent" />
        <h2 className="text-lg font-semibold">Writing your {label}…</h2>
        <span className="text-sm text-muted">usually 15–30 seconds</span>
      </div>
      <div className="flex flex-col gap-5 md:flex-row">
        <div className="aspect-[4/5] w-full max-w-[400px] animate-pulse rounded-xl bg-black/5" />
        <div className="flex-1 space-y-3">
          {[90, 100, 80, 95, 60, 85, 70].map((w, i) => (
            <div key={i} className="h-3 animate-pulse rounded bg-black/5" style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>
    </section>
  );
}

type Props = {
  post: Post;
  listing: Listing;
  profile: Profile;
  /** Whether this post was just generated (vs. the most recent existing one). */
  fresh: boolean;
  remaining: number | null;
  generating: boolean;
  /** Regenerate with the same settings, optionally with a new focus. */
  onRegenerate: (focus?: string[]) => void;
};

/** Preview + quick actions for the newest post. Full editing lives on the post page. */
export function LatestResult({ post, listing, profile, fresh, remaining, generating, onRegenerate }: Props) {
  const [active, setActive] = useState(0);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [changingFocus, setChangingFocus] = useState(false);
  const [newFocus, setNewFocus] = useState<string[]>(post.focus ?? []);
  const cost = remaining != null ? ` (uses 1 of ${remaining} left)` : "";
  const { targets, download, size, canvasProps } = usePostExport(post, listing, profile);
  const slide = post.slides[active] ?? post.slides[0];
  const caption = fullCaption(post);

  async function run(label: string, fn: () => Promise<void>, done: string) {
    setBusy(label);
    setMessage(null);
    try {
      await fn();
      setMessage(done);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <section className="card p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold">{fresh ? "Your new post" : "Latest post"}</h2>
          <div className="text-sm text-muted">
            {PLATFORM_SPECS[post.platform].label} · {post.format === "carousel" ? `Carousel (${post.slides.length} slides)` : "Single image"} · {POST_TYPES[post.post_type]} · {post.language.toUpperCase()}
          </div>
        </div>
        <Link href={`/posts/${post.id}`} className="btn-primary">Open in editor →</Link>
      </div>

      {post.focused_on?.length > 0 && (
        <div className="mb-4 rounded-lg bg-black/[0.03] p-3">
          <div className="flex flex-wrap items-center gap-1.5 text-sm">
            <span className="text-muted">{post.focus?.length ? "Focused on (your pick):" : "Claude focused on:"}</span>
            {post.focused_on.map((f) => (
              <span key={f} className="rounded-full bg-white px-2.5 py-0.5 text-xs font-medium shadow-sm">{f}</span>
            ))}
            {listing.features.length > 0 && (
              <button type="button" className="ml-1 text-sm font-medium text-brand underline" onClick={() => setChangingFocus(!changingFocus)}>
                {changingFocus ? "Cancel" : "Change focus"}
              </button>
            )}
          </div>
          {changingFocus && (
            <div className="mt-3 space-y-3 border-t border-border pt-3">
              <p className="text-xs text-muted">Pick up to {MAX_FOCUS} features for the next version to lead with.</p>
              <FocusChips features={listing.features} selected={newFocus} onChange={setNewFocus} max={MAX_FOCUS} />
              <button
                className="btn-primary"
                disabled={!newFocus.length || generating || remaining === 0}
                onClick={() => onRegenerate(newFocus)}
              >
                Write a new version with this focus{cost}
              </button>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col gap-6 md:flex-row">
        <div className="w-full min-w-0 md:w-[400px] md:shrink-0">
          <div className="relative">
            <ScaledSlide width={size.w} height={size.h} maxWidth={PREVIEW_WIDTH} className="rounded-xl border border-border">
              {slide && <SlideCanvas {...canvasProps} slide={slide} index={active} />}
            </ScaledSlide>
            {post.slides.length > 1 && (
              <>
                <button aria-label="Previous slide" disabled={active === 0} onClick={() => setActive(active - 1)} className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-2.5 py-1 shadow disabled:opacity-0">‹</button>
                <button aria-label="Next slide" disabled={active === post.slides.length - 1} onClick={() => setActive(active + 1)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-2.5 py-1 shadow disabled:opacity-0">›</button>
              </>
            )}
          </div>
          {post.slides.length > 1 && (
            <div className="mt-2 flex justify-center gap-1.5">
              {post.slides.map((_, i) => (
                <button key={i} aria-label={`Slide ${i + 1}`} onClick={() => setActive(i)} className={`h-1.5 w-1.5 rounded-full ${i === active ? "bg-brand" : "bg-black/20"}`} />
              ))}
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <span className="label">Caption</span>
          <div className="max-h-80 flex-1 overflow-y-auto whitespace-pre-wrap rounded-lg border border-border bg-white p-3 text-sm leading-relaxed">
            {caption}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button className="btn-secondary" disabled={!!busy} onClick={() => run("copy", () => navigator.clipboard.writeText(caption), "Caption copied.")}>
              Copy caption
            </button>
            <button className="btn-secondary" disabled={!!busy} onClick={() => run("download", download, "Downloaded. The caption is copied too.")}>
              {busy === "download" ? "Preparing…" : "Download"}
            </button>
            <button className="btn-ghost" disabled={!!busy || generating || remaining === 0} onClick={() => onRegenerate()}>
              ↻ Try another version{cost}
            </button>
          </div>
          {message && <p className="mt-2 text-sm text-muted">{message}</p>}
        </div>
      </div>
      {targets}
    </section>
  );
}
