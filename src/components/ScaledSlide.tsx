"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

/**
 * Shows a full-size slide (e.g. 1080×1350) scaled down to fit the available
 * width, up to `maxWidth`. Keeps the slide's aspect ratio so nothing overflows
 * on small screens.
 */
export function ScaledSlide({
  width,
  height,
  maxWidth,
  className = "",
  children,
}: {
  width: number;
  height: number;
  maxWidth: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState<number | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setShown(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`relative w-full overflow-hidden ${className}`}
      style={{ maxWidth, aspectRatio: `${width} / ${height}` }}
    >
      {shown != null && (
        <div style={{ transform: `scale(${shown / width})`, transformOrigin: "top left", width, height, position: "absolute", left: 0, top: 0 }}>
          {children}
        </div>
      )}
    </div>
  );
}
