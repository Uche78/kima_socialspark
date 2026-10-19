import { preload } from "react-dom";
import { DEMO_POSTS } from "./demo-posts";
import { PlatformPostCard } from "./PlatformPostCard";

const byId = Object.fromEntries(DEMO_POSTS.map((p) => [p.id, p]));

// Entrance order (ms after load): the big cards nearest the headline first, then outward.
const DELAY: Record<string, number> = {
  "ig-harbour": 250,
  "ig-oakridge": 400,
  "fb-oakridge": 550,
  "li-laurier": 700,
  "li-harbour": 850,
  "ig-maple": 1000,
  "fb-maple": 1150,
};

// Desktop: cards scattered around the panel's right and lower edges (bleeding off them),
// leaving the top-left for the headline. Positions are % of the panel.
const LAYOUT: { id: string; left: string; top: string; width: string }[] = [
  { id: "fb-maple", left: "0%", top: "71%", width: "17%" },
  { id: "li-harbour", left: "20%", top: "78%", width: "18%" },
  { id: "ig-oakridge", left: "41%", top: "66%", width: "17%" },
  { id: "ig-harbour", left: "62%", top: "-8%", width: "17%" },
  { id: "fb-oakridge", left: "62%", top: "56%", width: "17%" },
  { id: "li-laurier", left: "83%", top: "9%", width: "17%" },
  { id: "ig-maple", left: "83%", top: "62%", width: "17%" },
];

/** The post cards for the home page hero. `children` is the headline and import form. */
export function HeroShowcase({ children }: { children: React.ReactNode }) {
  // The first card's photo is the largest thing on a phone's first screen: fetch it right away.
  const first = DEMO_POSTS[0];
  preload(first.listing.photos[first.slide.photo_index ?? 0].url, { as: "image", fetchPriority: "high" });
  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#eeebe4] lg:h-[clamp(780px,56vw,920px)]">
      <div className="relative z-10 px-5 pb-8 pt-10 sm:px-10 sm:pt-14 lg:max-w-[58%] lg:px-[5%] lg:pt-[5.5%]">{children}</div>

      {/* Desktop: scattered cards */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        {LAYOUT.map(({ id, ...pos }) => (
          <div key={id} className="hero-rise absolute" style={{ ...pos, animationDelay: `${DELAY[id] ?? 300}ms` }}>
            <PlatformPostCard post={byId[id]} />
          </div>
        ))}
      </div>

      {/* Phones and tablets: a swipeable row under the text */}
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-8 [scrollbar-width:none] sm:px-10 lg:hidden">
        {DEMO_POSTS.map((p, i) => (
          <div key={p.id} className="hero-rise w-[230px] shrink-0 snap-start" style={{ animationDelay: `${250 + i * 120}ms` }}>
            <PlatformPostCard post={p} />
          </div>
        ))}
      </div>
    </div>
  );
}
