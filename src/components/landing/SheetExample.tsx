"use client";

import { ScaledSlide } from "@/components/ScaledSlide";
import { SlideCanvas } from "@/components/SlideCanvas";
import { DEMO_BROKER, DEMO_SHEET_DESIGN, DEMO_SHEET_LISTING, withHdPhotos } from "@/components/hero/demo-posts";
import type { Slide } from "@/lib/types";

/** An example mortgage feature sheet (made-up broker, realtor and listing), drawn with the real sheet design. `hd`: sharper photos. */
export function SheetExample({ kind = "sheet", headline = "Corner Suite, Lake Views", width = 1080, height = 1350, initialWidth = 420, hd = false }: { kind?: Slide["kind"]; headline?: string; width?: number; height?: number; initialWidth?: number; hd?: boolean }) {
  return (
    <ScaledSlide width={width} height={height} maxWidth={2000} initialWidth={initialWidth} className="rounded-2xl shadow-[0_24px_60px_-24px_rgba(15,42,68,0.5)] ring-1 ring-black/5">
      <SlideCanvas
        slide={{ kind, headline, subtext: "", photo_index: 0 }}
        listing={hd ? withHdPhotos(DEMO_SHEET_LISTING) : DEMO_SHEET_LISTING}
        profile={DEMO_BROKER}
        design={DEMO_SHEET_DESIGN}
        mortgage={null}
        language="en"
        postType="feature_sheet"
        width={width}
        height={height}
        index={0}
        total={1}
      />
    </ScaledSlide>
  );
}
