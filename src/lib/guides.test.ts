import { describe, expect, it } from "vitest";
import { DEMO_POSTS } from "../components/hero/demo-posts";
import { dollarAmounts, HYPE, PLACEHOLDER, SLOP } from "./copy-rules";
import { GUIDES, guideLinks, guideText, headingId, plain, wordCount } from "./guides";
import { PERSONA_PAGES } from "./persona-pages";
import { PAID_PLANS } from "./plans";

// The quality rules from .claude/skills/socialspark-content-engine, checked for every guide.

const PAGES = new Set(["/", "/pricing", "/mortgage-brokers", "/guides", ...GUIDES.map((g) => `/guides/${g.slug}`), ...PERSONA_PAGES.map((p) => `/for/${p.slug}`)]);
const DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Words of a search phrase that carry meaning, cut to a stem so "posts" matches "post". */
function stems(phrase: string) {
  const stop = new Set(["a", "an", "the", "to", "for", "of", "in", "on", "and", "or", "how", "what", "is", "do", "you", "your", "with", "my"]);
  return phrase.toLowerCase().split(/[^a-z0-9é]+/).filter((w) => w && !stop.has(w)).map((w) => w.slice(0, 5));
}

describe("guides", () => {
  it("have unique slugs and one guide per search phrase, distinct from the persona pages", () => {
    const slugs = GUIDES.map((g) => g.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of slugs) expect(s).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    const keywords = GUIDES.map((g) => g.keyword.toLowerCase().trim());
    expect(new Set(keywords).size, "two guides target the same search phrase (they'd compete)").toBe(keywords.length);
    for (const g of GUIDES) expect(PERSONA_PAGES.some((p) => p.slug === g.slug), `/guides/${g.slug} reuses a /for/ slug`).toBe(false);
  });

  it("fit search results and put the search phrase where it counts", () => {
    for (const g of GUIDES) {
      const at = `/guides/${g.slug}`;
      expect(g.meta.title.length, `${at} title`).toBeLessThanOrEqual(60);
      expect(g.meta.description.length, `${at} description`).toBeGreaterThanOrEqual(70);
      expect(g.meta.description.length, `${at} description`).toBeLessThanOrEqual(160);
      const title = (g.meta.title + " " + g.h1).toLowerCase();
      for (const w of stems(g.keyword)) expect(title, `${at}: "${w}…" from the search phrase is missing from the title and H1`).toContain(w);
      expect(plain(g.answer).toLowerCase(), `${at}: the short answer should use the search phrase's words`).toContain(stems(g.keyword)[0]);
    }
  });

  it("answer first, go deep enough to be useful, and stay readable", () => {
    for (const g of GUIDES) {
      const at = `/guides/${g.slug}`;
      const answerWords = plain(g.answer).split(/\s+/).length;
      expect(answerWords, `${at}: short answer`).toBeGreaterThanOrEqual(35);
      expect(answerWords, `${at}: short answer`).toBeLessThanOrEqual(90);
      expect(wordCount(g), `${at}: words`).toBeGreaterThanOrEqual(1000);
      expect(wordCount(g), `${at}: words (split it into two guides)`).toBeLessThanOrEqual(3500);
      expect(g.sections.length, `${at}: sections`).toBeGreaterThanOrEqual(4);
      expect(g.sections.length, `${at}: sections`).toBeLessThanOrEqual(10);
      expect(g.faq.length, `${at}: FAQ`).toBeGreaterThanOrEqual(3);
      expect(g.faq.length, `${at}: FAQ`).toBeLessThanOrEqual(8);
      expect(new Set(g.sections.map((s) => headingId(s.heading))).size, `${at}: duplicate heading`).toBe(g.sections.length);
      for (const s of g.sections) {
        expect(s.blocks.length, `${at}: "${s.heading}" is empty`).toBeGreaterThan(0);
        for (const b of s.blocks) {
          if (b.type === "p") expect(plain(b.text).split(/\s+/).length, `${at}: a paragraph in "${s.heading}" runs long`).toBeLessThanOrEqual(120);
          if (b.type === "table") for (const r of b.rows) expect(r.length, `${at}: table row in "${s.heading}"`).toBe(b.head.length);
        }
      }
    }
  });

  it("are dated honestly", () => {
    const today = new Date().toISOString().slice(0, 10);
    for (const g of GUIDES) {
      const at = `/guides/${g.slug}`;
      expect(g.published, `${at} published`).toMatch(DATE);
      expect(g.updated, `${at} updated`).toMatch(DATE);
      expect(g.updated >= g.published, `${at}: updated before published`).toBe(true);
      expect(g.updated <= today, `${at}: dated in the future`).toBe(true);
    }
  });

  it("link only to real pages, and every guide is linked from another (no orphans)", () => {
    const demoIds = new Set(DEMO_POSTS.map((d) => d.id));
    for (const g of GUIDES) {
      const at = `/guides/${g.slug}`;
      for (const href of guideLinks(g)) {
        if (href.startsWith("#")) continue;
        if (href.startsWith("/")) expect(PAGES.has(href.split("#")[0]), `${at} links to ${href}, which isn't a page`).toBe(true);
        else expect(href, `${at}: external links use https`).toMatch(/^https:\/\//);
        expect(href, `${at} links to itself`).not.toBe(at);
      }
      for (const r of g.related) {
        expect(GUIDES.some((o) => o.slug === r), `${at}: related guide ${r}`).toBe(true);
        expect(r, `${at} lists itself as related`).not.toBe(g.slug);
      }
      for (const s of g.sources) expect(s.url, `${at}: source ${s.label}`).toMatch(/^https:\/\//);
      for (const b of g.sections.flatMap((s) => s.blocks)) {
        if (b.type === "visual" && b.visual.kind === "posts") for (const id of b.visual.ids) expect(demoIds.has(id), `${at}: demo post ${id}`).toBe(true);
      }
    }
    if (GUIDES.length > 1) {
      for (const g of GUIDES) {
        const inbound = GUIDES.filter((o) => o !== g && (guideLinks(o).some((h) => h.split("#")[0] === `/guides/${g.slug}`) || o.related.includes(g.slug)));
        expect(inbound.length, `/guides/${g.slug} is an orphan: link to it from a related guide`).toBeGreaterThan(0);
      }
    }
  });

  it("only name current plan prices or sourced figures, and ship no placeholders, hype or filler", () => {
    const planPrices = Object.values(PAID_PLANS).flatMap((p) => [p.price, p.yearly, p.yearlyPerMonth]);
    for (const g of GUIDES) {
      const at = `/guides/${g.slug}`;
      for (const f of g.figures ?? []) expect(f.source.trim(), `${at}: figure ${f.text} needs a source`).not.toBe("");
      for (const line of [g.meta.title, g.meta.description, ...guideText(g)]) {
        for (const amount of dollarAmounts(line)) {
          const ok = planPrices.includes(amount) || (g.figures ?? []).some((f) => f.text.includes(amount));
          expect(ok, `${at}: "${amount}" is neither a current plan price nor a sourced figure (in "${line.slice(0, 60)}…")`).toBe(true);
        }
        // Checked on what the reader sees: "[anchor](href)" link markup isn't a placeholder.
        const text = plain(line);
        expect(text, `${at}: unresolved placeholder`).not.toMatch(PLACEHOLDER);
        expect(text, `${at}: hype or boast`).not.toMatch(HYPE);
        expect(text, `${at}: filler phrase`).not.toMatch(SLOP);
      }
    }
  });
});
