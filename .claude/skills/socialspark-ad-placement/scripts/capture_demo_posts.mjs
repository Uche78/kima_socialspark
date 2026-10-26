#!/usr/bin/env node
// Captures the site's demo posts and feature sheets at their native size (e.g. 1080×1350), for use inside ad creatives.
// They are the made-up agent, broker and listings in src/components/hero/demo-posts.ts, with CC0 photos
// (public/hero/CREDITS.md), drawn by the app's real SlideCanvas: the real product, with no real listing in it.
// No sign-in and no posts used.
//
// usage: node capture_demo_posts.mjs <out_dir> [--base http://localhost:3000] [--path /for/<slug>]... [--fr]
//   --path   page(s) to capture from (default "/"; persona pages /for/<slug> use HD photos; /mortgage-brokers has the sheets)
//   --list   only print what each page has (index, size), don't save
// Output: <out_dir>/<page>-<n>-<w>x<h>.png, plus index.json describing each capture.

import { createRequire } from "node:module";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
// Playwright is installed once for the video skill; reuse it rather than install a second copy.
const { chromium } = require(resolve(here, "../../socialspark-ad-video/scripts/node_modules/playwright"));

const argv = process.argv.slice(2);
const out = argv.find((a, i) => !a.startsWith("--") && !(argv[i - 1] || "").match(/^--(base|path)$/));
const base = (argv[argv.indexOf("--base") + 1] && argv.includes("--base") ? argv[argv.indexOf("--base") + 1] : "http://localhost:3000").replace(/\/$/, "");
const paths = argv.flatMap((a, i) => (a === "--path" ? [argv[i + 1]] : []));
const listOnly = argv.includes("--list");
if (!out && !listOnly) {
  console.error("usage: capture_demo_posts.mjs <out_dir> [--base URL] [--path /for/<slug>]... [--list]");
  process.exit(1);
}
if (!paths.length) paths.push("/");
if (out) mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 });
const index = [];

for (const path of paths) {
  const res = await page.goto(base + path, { waitUntil: "networkidle" });
  if (!res || !res.ok()) {
    console.error(`${path}: HTTP ${res?.status()} (is the app running at ${base}?)`);
    continue;
  }
  await page.evaluate(() => document.fonts.ready);
  // Dismiss the cookie banner so it can't sit over anything (choice not saved: this browser is thrown away).
  await page.evaluate(() => document.querySelector('[aria-label="Cookies"]')?.remove());

  // ScaledSlide renders each slide at native size inside a scale() transform. Find the visible ones.
  const found = await page.evaluate(() => {
    const slides = [...document.querySelectorAll("div")].filter(
      (d) => d.style.transform.startsWith("scale(") && d.style.width.endsWith("px") && d.parentElement?.offsetParent !== null,
    );
    return slides.map((d, i) => {
      d.dataset.capture = String(i);
      const text = (d.innerText || "").replace(/\s+/g, " ").trim().slice(0, 90);
      return { i, w: parseInt(d.style.width), h: parseInt(d.style.height), text };
    });
  });

  const slug = path === "/" ? "home" : path.replace(/^\/(for\/)?/, "").replace(/\//g, "-");
  for (const f of found) {
    const file = `${slug}-${f.i}-${f.w}x${f.h}.png`;
    console.log(`${listOnly ? "" : "→ "}${file}  ${f.text}`);
    if (listOnly) continue;
    await page.setViewportSize({ width: Math.max(1600, f.w), height: Math.max(1000, f.h) });
    // Clone at full size into a clean layer above the page, so no card frame, clipping or scaling touches it.
    await page.evaluate(({ i }) => {
      const src = document.querySelector(`[data-capture="${i}"]`);
      const layer = document.createElement("div");
      layer.id = "__capture";
      layer.style.cssText = "position:fixed;left:0;top:0;z-index:2147483647;background:#fff";
      const clone = src.cloneNode(true);
      clone.style.transform = "none";
      clone.style.position = "relative";
      layer.appendChild(clone);
      document.body.appendChild(layer);
    }, f);
    await page.evaluate(() => Promise.all([...document.querySelectorAll("#__capture img")].map((img) => img.decode().catch(() => {}))));
    await page.locator("#__capture > div").screenshot({ path: resolve(out, file) });
    await page.evaluate(() => document.getElementById("__capture")?.remove());
    index.push({ file, page: path, width: f.w, height: f.h, text: f.text });
  }
}

if (out && !listOnly) writeFileSync(resolve(out, "index.json"), JSON.stringify(index, null, 2));
await browser.close();
console.log(listOnly ? "" : `${index.length} capture(s) in ${out}. Look at each one before using it.`);
