import { describe, expect, it } from "vitest";
import { DEMO_POSTS } from "../components/hero/demo-posts";
import { PERSONA_PAGES, PERSONA_PLAN, type PersonaPage } from "./persona-pages";

// The copy rules from .claude/skills/socialspark-landing-pages, checked for every persona page.

const HYPE = /\b(game[- ]chang\w*|supercharg\w*|effortless\w*|unlock\w*|elevat(e|es|ed|ing)|seamless\w*|revolutionar\w*|cutting[- ]edge|next[- ]level|world[- ]class|best[- ]in[- ]class)\b|introducing|accept no substitutes|don't settle|the #1/i;

/** Every string a visitor reads on the page. */
function copy(p: PersonaPage) {
  const shared = [p.reader, p.meta.title, p.meta.description, ...Object.values(p.hero), p.objections.heading, ...p.objections.items.flatMap((i) => [i.q, i.a]), p.planFit, p.close.heading, p.close.sub];
  if (p.layout === "sections") {
    return [
      ...shared,
      p.pain.heading,
      ...p.pain.today,
      ...p.pain.after,
      p.steps.heading,
      ...p.steps.items.flatMap((i) => [i.title, i.body]),
      p.facts.eyebrow,
      p.facts.heading,
      ...p.facts.items.flatMap((i) => [i.title, i.body]),
    ];
  }
  return [
    ...shared,
    p.cta,
    ...p.reasons.flatMap((r) => [r.label, r.title, r.body]),
    p.proof.heading,
    p.comparison.heading,
    p.comparison.ours,
    p.comparison.theirs,
    ...p.comparison.rows.flatMap((r) => [r.label, r.ours, r.theirs]),
    p.offer.heading,
    p.offer.sub,
  ];
}

describe("persona pages", () => {
  it("have unique, URL-friendly slugs and one page per persona", () => {
    const slugs = PERSONA_PAGES.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of slugs) expect(s).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    const personas = PERSONA_PAGES.map((p) => p.persona);
    expect(new Set(personas).size).toBe(personas.length);
  });

  it("map every persona to a plan", () => {
    for (const p of PERSONA_PAGES) expect(PERSONA_PLAN[p.persona], `persona ${p.persona}`).toBeDefined();
    for (let n = 1; n <= 20; n++) expect(PERSONA_PLAN[n], `persona ${n}`).toBeDefined();
  });

  it("fit search results and the page layout", () => {
    for (const p of PERSONA_PAGES) {
      const at = `/for/${p.slug}`;
      expect(p.meta.title.length, `${at} title (the layout adds " | SocialSpark")`).toBeLessThanOrEqual(46);
      expect(p.meta.description.length, `${at} description`).toBeGreaterThanOrEqual(70);
      expect(p.meta.description.length, `${at} description`).toBeLessThanOrEqual(160);
      expect(p.hero.headline.length, `${at} headline`).toBeLessThanOrEqual(80);
      expect(p.hero.sub.split(/\s+/).length, `${at} hero sub`).toBeLessThanOrEqual(45);
      expect(p.objections.items.length, `${at} objections`).toBeGreaterThanOrEqual(4);
      expect(p.objections.items.length, `${at} objections`).toBeLessThanOrEqual(8);
      if (p.layout === "sections") {
        for (const list of [p.pain.today, p.pain.after]) {
          expect(list.length, `${at} pain`).toBeGreaterThanOrEqual(3);
          expect(list.length, `${at} pain`).toBeLessThanOrEqual(5);
        }
        expect([3, 6], `${at} facts (a row of 3 on desktop)`).toContain(p.facts.items.length);
      }
    }
  });

  it("listicles keep their promise: the count matches, every reason is backed, proof is real", () => {
    const demoIds = new Set(DEMO_POSTS.map((d) => d.id));
    for (const p of PERSONA_PAGES) {
      if (p.layout !== "listicle") continue;
      const at = `/for/${p.slug}`;
      expect(p.reasons.length, `${at} reasons`).toBeGreaterThanOrEqual(7);
      expect(p.reasons.length, `${at} reasons`).toBeLessThanOrEqual(10);
      const n = p.hero.headline.match(/^(\d+)\s/)?.[1];
      if (n) expect(Number(n), `${at}: headline count vs reasons`).toBe(p.reasons.length);
      expect(new Set(p.reasons.map((r) => r.title)).size, `${at}: duplicate reason`).toBe(p.reasons.length);
      for (const r of p.reasons) {
        expect(r.label.split(/\s+/).length, `${at}: reason label "${r.label}"`).toBeLessThanOrEqual(3);
        expect(r.body.split(/\s+/).length, `${at}: reason "${r.title}" body`).toBeLessThanOrEqual(70);
        if (r.visual?.kind === "posts") for (const id of r.visual.ids) expect(demoIds.has(id), `${at}: demo post ${id}`).toBe(true);
        if (r.visual?.kind === "plan") expect(PERSONA_PLAN[p.persona].highlight, `${at}: plan visual on a Team page`).not.toBe("team");
        if (r.visual?.kind === "sheet") expect(p.audience, `${at}: sheet visual`).toBe("broker");
      }
      expect(p.comparison.rows.length, `${at} comparison`).toBeGreaterThanOrEqual(4);
      expect(p.comparison.rows.length, `${at} comparison`).toBeLessThanOrEqual(8);
      for (const t of p.proof.testimonials) {
        expect(t.permission, `${at}: testimonial from ${t.name}`).toBe(true);
        for (const field of [t.quote, t.name, t.role, t.brokerage, t.city]) expect(field.trim(), `${at}: testimonial from ${t.name}`).not.toBe("");
      }
      for (const st of p.proof.stats) expect(st.source.trim() && st.asOf.trim(), `${at}: stat "${st.label}" needs a source and date`).toBeTruthy();
    }
  });

  it("keep prices in the pricing component and ship no placeholders or hype", () => {
    for (const p of PERSONA_PAGES) {
      const lines = [...copy(p), ...(p.layout === "listicle" ? p.proof.testimonials.map((t) => t.quote) : [])];
      for (const line of lines) {
        // Prices change in src/lib/plans.ts; the pricing component shows them, the copy doesn't repeat them.
        expect(line, `/for/${p.slug}: no prices in copy`).not.toMatch(/\$\s?\d|\d\s?\$/);
        expect(line, `/for/${p.slug}: unresolved placeholder`).not.toMatch(/\[[A-Z]/);
        expect(line, `/for/${p.slug}: hype or boast`).not.toMatch(HYPE);
      }
    }
  });
});
