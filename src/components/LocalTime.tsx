"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/**
 * Shows a timestamp in the viewer's own time zone (with its abbreviation, e.g. "EDT").
 * Server-rendered pages would otherwise format it in the server's zone (UTC on Netlify).
 */
export function LocalTime({ iso, className }: { iso: string; className?: string }) {
  const text = useSyncExternalStore(
    noop,
    () => formatLocal(iso),
    () => null, // nothing on the server; filled in by the browser
  );
  return (
    <time dateTime={iso} className={className}>
      {text ?? " "}
    </time>
  );
}

export function formatLocal(iso: string) {
  return new Date(iso).toLocaleString([], { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZoneName: "short" });
}
