"use client";

import { useRef } from "react";
import { SlideCanvas } from "@/components/SlideCanvas";
import { dataUrlBytes, jpegsToPdf } from "@/lib/pdf";
import { dataUrlToBlob, downloadBlob, renderSlide } from "@/lib/render";
import type { Listing, Post, Profile, Slide } from "@/lib/types";

/** Letter at 200 dpi (8.5 × 11 in) and a 9:16 story. */
export const PDF_SIZE = { w: 1700, h: 2200 };
export const STORY_SIZE = { w: 1080, h: 1920 };

/** The whole-sheet slide for a post: its "sheet" slide, or one built from a carousel's cover. */
export function sheetSlideOf(post: Post): Slide {
  const sheet = post.slides.find((s) => s.kind === "sheet");
  if (sheet) return sheet;
  const cover = post.slides[0];
  return { kind: "sheet", headline: cover?.headline ?? "", subtext: "", photo_index: cover?.photo_index ?? 0 };
}

/** Off-screen letter and story renders of a feature sheet, plus their downloads. Render `targets`. */
export function useSheetExports(post: Post, listing: Listing, profile: Profile) {
  const pdfRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const slide = sheetSlideOf(post);
  const common = { slide, listing, profile, design: post.design, mortgage: null, language: post.language, postType: post.post_type, index: 0, total: 1 };
  const base = `${(listing.address || "listing").replace(/[^\w-]+/g, "-").toLowerCase()}-feature-sheet`;

  const targets = (
    <div aria-hidden style={{ position: "fixed", left: -100_000, top: 0, pointerEvents: "none" }}>
      <SlideCanvas ref={pdfRef} {...common} width={PDF_SIZE.w} height={PDF_SIZE.h} />
      <SlideCanvas ref={storyRef} {...common} width={STORY_SIZE.w} height={STORY_SIZE.h} />
    </div>
  );

  async function downloadPdf() {
    if (!pdfRef.current) throw new Error("The sheet isn't ready yet.");
    const jpeg = await renderSlide(pdfRef.current, PDF_SIZE.w, PDF_SIZE.h);
    const pdf = jpegsToPdf([{ jpeg: dataUrlBytes(jpeg), width: PDF_SIZE.w, height: PDF_SIZE.h }]);
    downloadBlob(new Blob([pdf as BlobPart], { type: "application/pdf" }), `${base}.pdf`);
  }

  async function downloadStory() {
    if (!storyRef.current) throw new Error("The sheet isn't ready yet.");
    const jpeg = await renderSlide(storyRef.current, STORY_SIZE.w, STORY_SIZE.h);
    downloadBlob(await dataUrlToBlob(jpeg), `${base}-story.jpg`);
  }

  return { targets, downloadPdf, downloadStory };
}
