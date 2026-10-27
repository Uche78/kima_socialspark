// Copy rules shared by the public-page tests (persona pages, guides). See the socialspark-ad-copy skill.

/** Hype and boasts SocialSpark copy never uses. */
export const HYPE =
  /\b(game[- ]chang\w*|supercharg\w*|effortless\w*|unlock\w*|elevat(e|es|ed|ing)|seamless\w*|revolutionar\w*|cutting[- ]edge|next[- ]level|world[- ]class|best[- ]in[- ]class)\b|introducing|accept no substitutes|don't settle|the #1/i;

/** Filler that marks machine-written articles. Guides are written to be read, not to fill a page. */
export const SLOP =
  /\b(delve|delving|tapestry|embark\w*|realm|unleash\w*|harness the power|look no further|in today's (fast-paced|digital|competitive)|ever-evolving|navigat(e|ing) the (world|landscape)|landscape of|it's (important|worth) (to note|noting)|in conclusion|in summary|without further ado|at the end of the day|dive (deep|into)|deep dive|plethora|myriad|whether you're a seasoned)\b/i;

/** Dollar amounts in a line of copy, in English ("$14.99") and French ("649 000 $") formats. */
export function dollarAmounts(line: string) {
  return (line.match(/\$\s?\d[\d,.]*\d|\d[\d\s ,.]*\d\s?\$|\$\s?\d/g) ?? []).map((a) => a.trim());
}

/** An unresolved placeholder left in copy, like "[CITY]" or "⟦…⟧". */
export const PLACEHOLDER = /\[[A-Z]|⟦/;
