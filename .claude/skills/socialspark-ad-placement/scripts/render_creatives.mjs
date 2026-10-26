#!/usr/bin/env node
// Renders static ad creatives from ../templates at every placement size, checks them, and writes JPEGs.
//
// usage: node render_creatives.mjs <spec.json> [--only <name>] [--guides]
//
// spec.json:
// {
//   "out": "out",                                   // relative to the spec file
//   "creatives": [
//     { "name": "p3-A", "template": "demo", "lang": "en",
//       "formats": ["meta-4x5", "meta-9x16", "li-1x1"],
//       "data": { "headline": "…", "link": "yourbrokerage.ca/listings/48-oakridge", "images": ["stills/x.png"], "chip": "…" } }
//   ]
// }
// Image paths in data are relative to the spec file. Per-format overrides: "byFormat": { "meta-9x16": { "headline": "…" } }.
//
// Checks per image (errors fail the run): text inside the placement's safe zone; text not clipped; type not too small.
// Warnings: heavy on-image text. Then the on-image text of every creative goes through preflight.py for its platform.
// --guides also writes <name>_<format>_guides.png with the unsafe bands shaded, for a human look.

import { createRequire } from "node:module";
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname, isAbsolute } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";

const here = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const { chromium } = require(resolve(here, "../../socialspark-ad-video/scripts/node_modules/playwright"));
const templates = resolve(here, "../templates");

// Placement sizes and text-safe zones (fractions of height for t/b, width for l/r). See references/creative.md.
export const FORMATS = {
  "meta-4x5": { w: 1080, h: 1350, platform: "meta", safe: { t: 0.06, b: 0.06, l: 0.06, r: 0.06 } },
  "meta-1x1": { w: 1080, h: 1080, platform: "meta", safe: { t: 0.06, b: 0.06, l: 0.06, r: 0.06 } },
  // Stories and Reels share the 9:16 asset under Advantage+ placements; Reels' UI covers more, so use its zone.
  "meta-9x16": { w: 1080, h: 1920, platform: "meta", safe: { t: 0.14, b: 0.35, l: 0.06, r: 0.06 } },
  // Right column, search results and other horizontal Meta placements (the "Horizontal" crop in Ads Manager).
  "meta-1.91x1": { w: 1200, h: 628, platform: "meta", safe: { t: 0.08, b: 0.08, l: 0.05, r: 0.05 } },
  "li-1x1": { w: 1200, h: 1200, platform: "linkedin", safe: { t: 0.06, b: 0.06, l: 0.06, r: 0.06 } },
  "li-1.91x1": { w: 1200, h: 627, platform: "linkedin", safe: { t: 0.08, b: 0.08, l: 0.05, r: 0.05 } },
  "li-4x5": { w: 1080, h: 1350, platform: "linkedin", safe: { t: 0.06, b: 0.06, l: 0.06, r: 0.06 } },
  "tiktok-9x16": { w: 1080, h: 1920, platform: "tiktok", safe: { t: 0.08, b: 0.25, l: 0.06, r: 0.13 } },
  "carousel-1x1": { w: 1080, h: 1080, platform: "meta", safe: { t: 0.06, b: 0.06, l: 0.06, r: 0.06 } },
};

const argv = process.argv.slice(2);
const specPath = argv.find((a) => !a.startsWith("--") && argv[argv.indexOf(a) - 1] !== "--only");
if (!specPath) {
  console.error("usage: render_creatives.mjs <spec.json> [--only <name>] [--guides]");
  process.exit(1);
}
const only = argv.includes("--only") ? argv[argv.indexOf("--only") + 1] : null;
const guides = argv.includes("--guides");
const specDir = dirname(resolve(specPath));
const spec = JSON.parse(readFileSync(specPath, "utf8"));
const outDir = resolve(specDir, spec.out || "out");
mkdirSync(outDir, { recursive: true });

const fileUrl = (p) => (/^(https?|file|data):/.test(p) ? p : pathToFileURL(isAbsolute(p) ? p : resolve(specDir, p)).href);
function resolveImages(data) {
  const d = structuredClone(data);
  if (Array.isArray(d.images)) {
    d.images = d.images.map((im) => {
      const o = typeof im === "string" ? { src: im } : im;
      const local = !/^(https?|file|data):/.test(o.src);
      if (local && !existsSync(resolve(specDir, o.src))) throw new Error(`image not found: ${o.src}`);
      return { ...o, src: fileUrl(o.src) };
    });
  }
  return d;
}

const browser = await chromium.launch();
let errors = 0;
const onImage = [];
const report = [];

for (const c of spec.creatives) {
  if (only && c.name !== only) continue;
  for (const fmtName of c.formats || ["meta-4x5"]) {
    const fmt = FORMATS[fmtName];
    if (!fmt) { console.error(`${c.name}: unknown format ${fmtName}`); errors++; continue; }
    const data = { ...resolveImages({ ...c.data, ...(c.byFormat?.[fmtName] || {}) }), lang: c.lang || "en", width: fmt.w, height: fmt.h, safe: fmt.safe, format: fmtName };
    const page = await browser.newPage({ viewport: { width: fmt.w, height: fmt.h }, deviceScaleFactor: 1 });
    await page.addInitScript((d) => { window.__DATA = d; }, data);
    const tpl = resolve(templates, `${c.template}.html`);
    if (!existsSync(tpl)) { console.error(`${c.name}: no template ${c.template}`); errors++; await page.close(); continue; }
    await page.goto(pathToFileURL(tpl).href, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => Promise.all([...document.images].map((img) => img.decode().catch(() => {}))));
    await page.evaluate(() => window.layout && window.layout());
    await page.evaluate(() => document.fonts.ready);

    const qc = await page.evaluate(({ safe, w, h }) => {
      const box = { left: safe.l * w - 1, right: w - safe.r * w + 1, top: safe.t * h - 1, bottom: h - safe.b * h + 1 };
      const minPx = Math.max(Math.min(w, h) * 0.024, w * 0.02);
      const issues = [];
      const texts = [];
      for (const e of document.querySelectorAll("[data-text]")) {
        const r = e.getBoundingClientRect();
        const t = e.textContent.replace(/\s+/g, " ").trim(); // as written, not as text-transform shows it
        if (!t) continue;
        texts.push({ cls: e.className, text: t });
        if (r.left < box.left || r.right > box.right || r.top < box.top || r.bottom > box.bottom)
          issues.push(["ERROR", `text outside the safe zone: "${t.slice(0, 40)}"`]);
        if (e.scrollWidth > e.clientWidth + 2 && getComputedStyle(e).textOverflow !== "ellipsis")
          issues.push(["ERROR", `text clipped: "${t.slice(0, 40)}"`]);
        const fs = parseFloat(getComputedStyle(e).fontSize);
        if (fs < minPx) issues.push(["WARN", `small type (${Math.round(fs)}px < ${Math.round(minPx)}px): "${t.slice(0, 40)}"`]);
      }
      const words = texts.filter((t) => !/wordmark/.test(t.cls)).reduce((n, t) => n + t.text.split(" ").length, 0);
      return { issues, texts, words };
    }, { safe: fmt.safe, w: fmt.w, h: fmt.h });

    const limit = fmt.h / fmt.w > 1.5 ? 16 : 28;
    if (qc.words > limit) qc.issues.push(["WARN", `${qc.words} words on the image (aim for ≤ ${limit}); move detail into the primary text`]);

    const file = resolve(outDir, `${c.name}_${fmtName}.jpg`);
    await page.screenshot({ path: file, type: "jpeg", quality: 92 });
    if (guides) {
      await page.evaluate(({ safe }) => {
        const g = document.createElement("div");
        g.style.cssText = `position:fixed;inset:0;z-index:99999;pointer-events:none;border-style:solid;border-color:rgba(220,40,40,.35);
          border-width:${safe.t * 100}vh ${safe.r * 100}vw ${safe.b * 100}vh ${safe.l * 100}vw`;
        document.body.appendChild(g);
      }, { safe: fmt.safe });
      await page.screenshot({ path: file.replace(/\.jpg$/, "_guides.png") });
    }
    await page.close();

    const errs = qc.issues.filter((i) => i[0] === "ERROR").length;
    errors += errs;
    console.log(`${errs ? "✗" : "✓"} ${c.name}_${fmtName}.jpg (${fmt.w}×${fmt.h})`);
    for (const [sev, msg] of qc.issues) console.log(`    ${sev.padEnd(5)} ${msg}`);
    report.push({ file: `${c.name}_${fmtName}.jpg`, format: fmtName, ...qc });
    const key = `${c.name} (on-image, ${fmt.platform})`;
    if (!onImage.some((o) => o.name === key)) {
      onImage.push({ name: key, platform: fmt.platform, language: c.lang || "en", image_text: qc.texts.filter((t) => !/wordmark/.test(t.cls)).map((t) => t.text).join(" · ") });
    }
  }
}
await browser.close();

writeFileSync(resolve(outDir, "report.json"), JSON.stringify(report, null, 2));
const onImagePath = resolve(outDir, "on-image-text.json");
writeFileSync(onImagePath, JSON.stringify(onImage, null, 2));
console.log("\nOn-image text through the copy checker:");
const pre = spawnSync("python3", [resolve(here, "preflight.py"), onImagePath], { encoding: "utf8" });
process.stdout.write(pre.stdout || pre.stderr || "");
console.log(`\n${report.length} image(s) in ${outDir}, ${errors} error(s). Look at every image before it goes into an ad account.`);
process.exit(errors ? 1 : 0);
