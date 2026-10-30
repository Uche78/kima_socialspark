// Guides, served at /guides/<slug> and listed in the sitemap and llms.txt. One file per guide in this folder,
// written by the socialspark-content-engine skill for a search phrase that Search Console or Keyword Planner
// shows real demand for. Every claim about SocialSpark must be true of the product today; every other fact
// needs a source in `sources`.

import type { Language } from "@/lib/types";
import { justListedPostIdeas } from "./just-listed-post-ideas";
import { openHouseSocialMediaPost } from "./open-house-social-media-post";
import { realEstateCaptionsForInstagram } from "./real-estate-captions-for-instagram";
import { realEstateFacebookPostIdeas } from "./real-estate-facebook-post-ideas";
import { recoAdvertisingGuidelines } from "./reco-advertising-guidelines";

/**
 * Text with inline links and emphasis: [anchor text](/guides/other-guide) or [text](https://…), and **bold**.
 * Internal links must point at a real page (the guides test checks them).
 */
export type Rich = string;

/** Real product imagery: example posts (demo-posts.ts ids), an app screen, or the mortgage feature sheet. */
export type GuideVisual =
  | { kind: "posts"; ids: string[]; language?: Language; caption: string }
  | { kind: "screen"; step: 1 | 2 | 3; caption: string }
  | { kind: "sheet"; caption: string };

export type GuideBlock =
  | { type: "p"; text: Rich }
  | { type: "list"; items: Rich[] }
  /** Numbered steps, each with a short title. */
  | { type: "steps"; items: { title: string; body: Rich }[] }
  | { type: "table"; caption: string; head: string[]; rows: Rich[][] }
  /** A highlighted aside: a rule to remember, a common mistake. */
  | { type: "tip"; label: string; text: Rich }
  /** A sample the reader can copy, like a caption. Shown in a box, line breaks kept. */
  | { type: "example"; label: string; text: string }
  | { type: "visual"; visual: GuideVisual };

export type GuideSection = { heading: string; blocks: GuideBlock[] };

export type Guide = {
  /** URL: /guides/<slug>. Usually the search phrase, e.g. "just-listed-post-ideas". */
  slug: string;
  /** The search phrase this guide is written to rank for. One guide per phrase across the site. */
  keyword: string;
  /** Close variants and follow-up questions it also answers (from Search Console or Keyword Planner). */
  alsoAnswers: string[];
  /** Who it's written for: realtors get the realtor import form, brokers the broker one. */
  audience: "realtor" | "broker";
  /** Topic cluster from the skill's topic map; groups guides on /guides. */
  cluster: string;
  /** <title> (shown as is, no " | SocialSpark") and meta description. */
  meta: { title: string; description: string };
  h1: string;
  /** One line under the H1. */
  dek: string;
  /** The answer, first: the paragraph an answer engine would quote. */
  answer: Rich;
  /** ISO dates (YYYY-MM-DD). `updated` changes only when the content does. */
  published: string;
  updated: string;
  sections: GuideSection[];
  faq: { q: string; a: string }[];
  /** Other guides to read next (slugs). */
  related: string[];
  /** The panel around the import form: what the reader gets by trying it on their listing. */
  cta: { heading: string; sub: string };
  /** Where outside facts come from (regulators, platforms). Shown at the end of the guide. */
  sources: { label: string; url: string }[];
  /** Dollar figures in the copy that aren't plan prices, each with its source. */
  figures?: { text: string; source: string }[];
};

/** Newest first. Add a guide by importing its file here. */
export const GUIDES: Guide[] = [justListedPostIdeas, realEstateCaptionsForInstagram, realEstateFacebookPostIdeas, openHouseSocialMediaPost, recoAdvertisingGuidelines].sort((a, b) =>
  b.published.localeCompare(a.published),
);

export function guide(slug: string) {
  return GUIDES.find((g) => g.slug === slug);
}

/** Every Rich string in a guide, in reading order. */
export function guideText(g: Guide): string[] {
  const block = (b: GuideBlock): string[] => {
    switch (b.type) {
      case "p":
        return [b.text];
      case "list":
        return b.items;
      case "steps":
        return b.items.flatMap((i) => [i.title, i.body]);
      case "table":
        return [b.caption, ...b.head, ...b.rows.flat()];
      case "tip":
        return [b.label, b.text];
      case "example":
        return [b.label, b.text];
      case "visual":
        return [b.visual.caption];
    }
  };
  return [g.h1, g.dek, g.answer, ...g.sections.flatMap((s) => [s.heading, ...s.blocks.flatMap(block)]), ...g.faq.flatMap((f) => [f.q, f.a]), g.cta.heading, g.cta.sub];
}

/** Plain words a reader sees (link markup and ** removed). */
export function plain(text: Rich) {
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\*\*/g, "");
}

export function wordCount(g: Guide) {
  return guideText(g).reduce((n, t) => n + plain(t).split(/\s+/).filter(Boolean).length, 0);
}

/** The hrefs a guide links to, in the body and FAQ. */
export function guideLinks(g: Guide) {
  return guideText(g).flatMap((t) => [...t.matchAll(/\]\(([^)\s]+)\)/g)].map((m) => m[1]));
}

/** Anchor id for a section heading (used by the table of contents). */
export function headingId(heading: string) {
  return heading
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
