"use client";

import { useState } from "react";

const VISIBLE = 10;

/** Multi-select chips for the listing features a post should lead with. */
export function FocusChips({
  features,
  selected,
  onChange,
  max,
}: {
  features: string[];
  selected: string[];
  onChange: (next: string[]) => void;
  max: number;
}) {
  const [showAll, setShowAll] = useState(false);
  // Keep any selected feature visible even if it's past the fold.
  const shown = showAll ? features : [...new Set([...features.slice(0, VISIBLE), ...selected])];
  const full = selected.length >= max;

  function toggle(f: string) {
    onChange(selected.includes(f) ? selected.filter((x) => x !== f) : full ? selected : [...selected, f]);
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {shown.map((f) => {
        const on = selected.includes(f);
        return (
          <button
            key={f}
            type="button"
            onClick={() => toggle(f)}
            disabled={!on && full}
            aria-pressed={on}
            className={`${on ? "chip chip-active" : "chip"} text-xs disabled:cursor-not-allowed disabled:opacity-40`}
          >
            {on ? "✓ " : ""}
            {f}
          </button>
        );
      })}
      {features.length > VISIBLE && (
        <button type="button" className="px-2 text-xs text-muted underline" onClick={() => setShowAll(!showAll)}>
          {showAll ? "Show fewer" : `+${features.length - VISIBLE} more`}
        </button>
      )}
    </div>
  );
}
