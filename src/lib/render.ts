"use client";

import { toJpeg } from "html-to-image";

/** Renders a full-size slide node to a JPEG data URL (Instagram requires JPEG). */
export async function renderSlide(node: HTMLElement, width: number, height: number) {
  await document.fonts.ready;
  // No backgroundColor option: html-to-image applies it to the slide root and would override the design's background.
  const opts = { width, height, pixelRatio: 1, quality: 0.92 };
  // First pass warms html-to-image's font/image cache; some browsers drop images on the first render.
  await toJpeg(node, opts).catch(() => null);
  return toJpeg(node, opts);
}

export async function dataUrlToBlob(dataUrl: string) {
  return (await fetch(dataUrl)).blob();
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
