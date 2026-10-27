// One line icon per guide cluster (the clusters in the content engine's topic map), drawn on a 24px grid.
// Unknown clusters get the document icon.

const PATHS: Record<string, string[]> = {
  "Listing posts": ["M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"],
  "Captions and copy": ["M4 5h16v11H9l-5 4z", "M8 9h8", "M8 12h5"],
  Platforms: ["M8 3h8a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z", "M11 18h2"],
  Hashtags: ["M10 4 8 20", "M16 4l-2 16", "M4 9h16", "M3 15h16"],
  "Bilingual and French": ["M3 5h11v8H7l-4 3z", "M17 9h4v8h-3v3l-4-3h-4v-2"],
  "Rules and compliance": ["M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6z", "m9 12 2 2 4-4"],
  "Listing marketing": ["M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1z", "M15 9a3 3 0 0 1 0 6", "M18 6a7 7 0 0 1 0 12"],
  "Condos and property types": ["M5 21V4h9v17", "M14 9h5v12", "M3 21h18", "M8 8h3", "M8 12h3", "M8 16h3"],
  "Mortgage brokers": ["M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z", "M8 7h8", "M8 11h.01", "M12 11h.01", "M16 11h.01", "M8 15h.01", "M12 15h.01", "M16 15h.01"],
  "Teams and coordinators": ["M16 20v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1", "M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", "M22 20v-1a4 4 0 0 0-3-3.9", "M16 4.1a3 3 0 0 1 0 5.8"],
};
const DOCUMENT = ["M6 3h8l4 4v14H6z", "M14 3v4h4", "M9 12h6", "M9 16h6"];

export function GuideIcon({ cluster, className = "h-5 w-5" }: { cluster: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      {(PATHS[cluster] ?? DOCUMENT).map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
