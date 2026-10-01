"use client";

import { useRef } from "react";
import JSZip from "jszip";
import { SlideCanvas, type SlideCanvasProps } from "@/components/SlideCanvas";
import { fullCaption } from "@/lib/caption";
import { dataUrlToBlob, downloadBlob, renderSlide } from "@/lib/render";
import { aspectOf, PLATFORM_SPECS, type Listing, type Post, type Profile } from "@/lib/types";

export function slideSize(post: Pick<Post, "platform" | "format" | "design">) {
  return PLATFORM_SPECS[post.platform].sizes[aspectOf(post)];
}

/** Props shared by every SlideCanvas of a post (everything except slide + index). */
export function canvasPropsFor(post: Post, listing: Listing, profile: Profile): Omit<SlideCanvasProps, "slide" | "index"> {
  const size = slideSize(post);
  return {
    listing,
    profile,
    design: post.design,
    mortgage: post.mortgage,
    language: post.language,
    postType: post.post_type,
    width: size.w,
    height: size.h,
    total: post.slides.length,
  };
}

/**
 * Off-screen, full-size copies of a post's slides plus helpers to render them
 * to JPEG and download them. Render `targets` somewhere in the component.
 */
export function usePostExport(post: Post, listing: Listing, profile: Profile) {
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const size = slideSize(post);
  const props = canvasPropsFor(post, listing, profile);

  const targets = (
    <div aria-hidden style={{ position: "fixed", left: -100_000, top: 0, pointerEvents: "none" }}>
      {post.slides.map((s, i) => (
        <SlideCanvas key={i} ref={(el) => { refs.current[i] = el; }} {...props} slide={s} index={i} />
      ))}
    </div>
  );

  async function renderAll() {
    const out: string[] = [];
    for (let i = 0; i < post.slides.length; i++) {
      const node = refs.current[i];
      if (!node) throw new Error("Slide not ready yet.");
      out.push(await renderSlide(node, size.w, size.h));
    }
    return out;
  }

  /** Downloads a JPEG (single) or ZIP of JPEGs + caption.txt (carousel), and copies the caption. */
  async function download() {
    const images = await renderAll();
    const caption = fullCaption(post);
    const base = (listing.address || "listing").replace(/[^\w-]+/g, "-").toLowerCase();
    if (images.length === 1) {
      downloadBlob(await dataUrlToBlob(images[0]), `${base}-${post.platform}.jpg`);
    } else {
      const zip = new JSZip();
      for (let i = 0; i < images.length; i++) zip.file(`${String(i + 1).padStart(2, "0")}.jpg`, await dataUrlToBlob(images[i]));
      zip.file("caption.txt", caption);
      downloadBlob(await zip.generateAsync({ type: "blob" }), `${base}-${post.platform}.zip`);
    }
    await navigator.clipboard.writeText(caption).catch(() => {});
  }

  return { targets, renderAll, download, size, canvasProps: props };
}
