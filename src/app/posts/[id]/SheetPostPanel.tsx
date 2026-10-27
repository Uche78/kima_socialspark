"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Chips } from "@/components/Chips";
import { designForSheet, readSheetConfig, sheetPostSlides, type FeatureSheet } from "@/lib/feature-sheet";
import { ASPECT_LABELS, PLATFORM_SPECS, type Aspect, type Platform, type Post, type PostFormat, type Profile } from "@/lib/types";
import { reportPostWritten } from "@/components/MetaPixel";
import { HashtagLimit } from "@/components/HashtagLimit";

export type Destination = Platform | "story";

type Props = {
  post: Post;
  profile: Profile;
  sheet: FeatureSheet | null;
  remaining: number;
  locked: boolean;
  destination: Destination;
  onDestination: (d: Destination) => void;
  /** Replaces the post locally (and marks nothing dirty: option changes save immediately). */
  onPost: (p: Post) => void;
  onStory: () => void;
  storyBusy: boolean;
  onCaptionChange: (caption: string) => void;
  onHashtagsChange: (tags: string[]) => void;
};

/**
 * The post page for a feature sheet: choose where it goes, the format and size (preview updates live),
 * then write the caption. Writing the caption is the only step that uses a post.
 */
export function SheetPostPanel({ post, profile, sheet, remaining, locked, destination, onDestination, onPost, onStory, storyBusy, onCaptionChange, onHashtagsChange }: Props) {
  const supabase = useMemo(() => createClient(), []);
  const [notes, setNotes] = useState(post.highlights ?? "");
  const [writing, setWriting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [writtenFor, setWrittenFor] = useState<Platform | null>(post.caption.trim() ? post.platform : null);
  const hasCaption = !!post.caption.trim();
  const isStory = destination === "story";
  const spec = PLATFORM_SPECS[post.platform];

  /** Saves option changes straight away (drafts only). */
  async function persist(next: Post) {
    onPost(next);
    await supabase.from("posts").update({ platform: next.platform, format: next.format, slides: next.slides, design: next.design, language: next.language }).eq("id", next.id);
  }

  function chooseDestination(d: Destination) {
    onDestination(d);
    if (d === "story" || d === post.platform) return;
    const aspects = PLATFORM_SPECS[d].aspects;
    const aspect = aspects.includes(post.design.aspect ?? "portrait") ? post.design.aspect : PLATFORM_SPECS[d].defaultAspect;
    void persist({ ...post, platform: d, design: { ...post.design, aspect } });
  }

  function chooseFormat(format: PostFormat) {
    if (format === post.format) return;
    const cover = post.slides[0];
    void persist({ ...post, format, slides: sheetPostSlides(format, cover?.headline ?? "", cover?.photo_index ?? null, post.language) });
  }

  // "Update from sheet": the sheet changed since this draft was made.
  const sheetConfig = sheet ? readSheetConfig(sheet.config) : null;
  const outOfDate =
    !!sheet &&
    !locked &&
    (JSON.stringify(sheetConfig) !== JSON.stringify(readSheetConfig(post.design.sheet)) ||
      sheet.language !== post.language ||
      (post.slides[0]?.headline ?? "") !== sheet.headline ||
      (post.slides[0]?.photo_index ?? 0) !== (sheet.photo_index ?? 0));
  function updateFromSheet() {
    if (!sheet || !sheetConfig) return;
    const slides = sheetPostSlides(post.format, sheet.headline, sheet.photo_index, sheet.language).map((s, i) => (i > 0 && post.slides[i] ? { ...s, headline: post.slides[i].headline, subtext: post.slides[i].subtext } : s));
    void persist({ ...post, language: sheet.language, slides, design: { ...designForSheet(profile, sheetConfig), aspect: post.design.aspect } });
  }

  async function writeCaption() {
    setWriting(true);
    setError(null);
    try {
      const res = await fetch("/api/posts/generate", { method: "POST", body: JSON.stringify({ post_id: post.id, notes }) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Couldn't start writing.");
      const deadline = Date.now() + 4 * 60_000;
      while (Date.now() < deadline) {
        await new Promise((r) => setTimeout(r, 2000));
        const { data } = await supabase.from("generation_jobs").select("status, error").eq("id", json.job_id).maybeSingle<{ status: string; error: string | null }>();
        if (data?.status === "done") {
          const { data: fresh } = await supabase.from("posts").select("*").eq("id", post.id).single<Post>();
          if (fresh) onPost(fresh);
          setWrittenFor(post.platform);
          if (json.kind === "post") reportPostWritten();
          return;
        }
        if (data?.status === "failed") throw new Error(data.error ?? "Couldn't write the caption. You weren't charged.");
      }
      throw new Error("This is taking longer than usual. Refresh in a minute. You won't be charged if it doesn't finish.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setWriting(false);
    }
  }

  const aspects = PLATFORM_SPECS[post.platform].aspects;

  return (
    <div className="space-y-5">
      {outOfDate && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          <span>The sheet has changed since this post was started.</span>
          <button className="btn-secondary" onClick={updateFromSheet}>Update from sheet</button>
        </div>
      )}

      <fieldset disabled={locked || writing} className="space-y-4">
        <Chips label="Where" value={destination} onChange={chooseDestination} options={{ instagram: "Instagram", facebook: "Facebook", linkedin: "LinkedIn", story: "Story (download)" }} />
        {!isStory && (
          <>
            <Chips label="Format" value={post.format} onChange={chooseFormat} options={{ single: "Single sheet", carousel: "Carousel (3 slides)" }} />
            {aspects.length > 1 && (
              <Chips
                label="Size"
                value={post.design.aspect ?? spec.defaultAspect}
                onChange={(aspect: Aspect) => void persist({ ...post, design: { ...post.design, aspect } })}
                options={Object.fromEntries(aspects.map((a) => [a, ASPECT_LABELS[a]])) as Record<Aspect, string>}
              />
            )}
          </>
        )}
      </fieldset>

      {isStory ? (
        <div className="space-y-3 rounded-lg bg-black/[0.03] p-4 text-sm">
          <p className="text-muted">
            A 1080×1920 image for Instagram or Facebook Stories. Add it in the app. Stories don&apos;t have captions, so this is free.
          </p>
          <button className="btn-primary" onClick={onStory} disabled={storyBusy}>{storyBusy ? "Preparing…" : "Download Story"}</button>
        </div>
      ) : !hasCaption ? (
        <div className="space-y-3 border-t border-border pt-4">
          <label className="block">
            <span className="label">Details for the caption (optional)</span>
            <textarea
              className="input min-h-20"
              maxLength={1000}
              disabled={writing}
              placeholder="e.g. open house Saturday 2–4 pm, ask about the 30-year amortization"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <button className="btn-primary h-11 px-6" onClick={writeCaption} disabled={writing || remaining === 0}>
              {writing ? "Writing the caption…" : `Write ${spec.label} caption`}
            </button>
            <span className="text-xs text-muted">
              Uses 1 post · {remaining} left. {remaining === 0 && <Link href="/pricing" className="underline">See plans</Link>}
            </span>
          </div>
          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
        </div>
      ) : (
        <div className="space-y-4 border-t border-border pt-4">
          {writtenFor && writtenFor !== post.platform && (
            <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">This caption was written for {PLATFORM_SPECS[writtenFor].label}. Rewrite it for {spec.label} below if you like.</p>
          )}
          <label className="block">
            <span className="label">Caption</span>
            <textarea className="input min-h-64 font-[inherit] leading-relaxed" disabled={locked} value={post.caption} onChange={(e) => onCaptionChange(e.target.value)} />
            <span className={`text-xs ${post.caption.length > spec.captionLimit ? "text-red-700" : "text-muted"}`}>
              {post.caption.length} / {spec.captionLimit} characters
            </span>
          </label>
          <label className="block">
            <span className="label">Hashtags (space separated)</span>
            <input
              className="input"
              disabled={locked}
              value={post.hashtags.map((h) => `#${h}`).join(" ")}
              onChange={(e) => onHashtagsChange(e.target.value.split(/\s+/).map((h) => h.replace(/^#/, "")).filter(Boolean))}
            />
            <HashtagLimit post={post} />
          </label>
          {!locked && (
            <div className="flex flex-wrap items-center gap-3">
              <button className="btn-ghost" onClick={writeCaption} disabled={writing}>{writing ? "Rewriting…" : "↻ Rewrite caption"}</button>
              <span className="text-xs text-muted">Uses a regeneration.</span>
            </div>
          )}
          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
        </div>
      )}
    </div>
  );
}
