#!/usr/bin/env node
// Renders an HTML motion-graphics page to video, frame by frame, so timing is exact.
//
// Page contract (see ../templates/):
//   - CSS animations / transitions / Web Animations are paused and seeked automatically.
//   - Optionally define window.seek(t) (seconds) for JS-driven scenes; it may return a promise.
//   - window.__DATA holds the JSON passed with --data (captions, copy, colours).
//
// Usage:
//   node render_html.mjs <page.html> <out.mp4|out.mov> --duration 5 [--width 1080 --height 1920 --fps 30]
//        [--alpha]            transparent background → ProRes 4444 .mov (for overlays)
//        [--data data.json]   injected as window.__DATA
//        [--set key=value]    merged into window.__DATA (repeatable), e.g. --set headline="Just listed"
//        [--still 2.5]        write a single PNG at t=2.5s instead of a video (for checking frames)

import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { readFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { pathToFileURL } from "node:url";

function parseArgs(argv) {
  const args = { _: [], set: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) { args._.push(a); continue; }
    const key = a.slice(2);
    if (key === "alpha") { args.alpha = true; continue; }
    const val = argv[++i];
    if (key === "set") args.set.push(val);
    else args[key] = val;
  }
  return args;
}

const args = parseArgs(process.argv.slice(2));
const [input, output] = args._;
if (!input || !output) {
  console.error("usage: render_html.mjs <page.html> <out> --duration <s> [--width --height --fps --alpha --data --set k=v --still t]");
  process.exit(1);
}
const width = Number(args.width ?? 1080);
const height = Number(args.height ?? 1920);
const fps = Number(args.fps ?? 30);
const duration = Number(args.duration ?? 5);
const frames = Math.round(duration * fps);

let data = args.data ? JSON.parse(readFileSync(args.data, "utf8")) : {};
for (const kv of args.set) {
  const i = kv.indexOf("=");
  data[kv.slice(0, i)] = kv.slice(i + 1);
}
data = { ...data, width, height, fps, duration };

mkdirSync(dirname(resolve(output)), { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
await page.addInitScript((d) => { window.__DATA = d; window.__RENDERING = true; }, data);
await page.goto(pathToFileURL(resolve(input)).href, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
// Let images decode before the first frame.
await page.evaluate(() => Promise.all([...document.images].map((img) => img.decode().catch(() => {}))));

async function seek(t) {
  await page.evaluate(async (t) => {
    if (typeof window.seek === "function") await window.seek(t);
    for (const a of document.getAnimations()) {
      a.pause();
      a.currentTime = t * 1000;
    }
  }, t);
}

if (args.still !== undefined) {
  await seek(Number(args.still));
  await page.screenshot({ path: output, omitBackground: !!args.alpha });
  await browser.close();
  console.log(`wrote ${output}`);
  process.exit(0);
}

const encode = args.alpha
  ? ["-c:v", "prores_ks", "-profile:v", "4444", "-pix_fmt", "yuva444p10le", "-vendor", "apl0"]
  : ["-c:v", "libx264", "-preset", "slow", "-crf", "14", "-pix_fmt", "yuv420p"];
const ff = spawn("ffmpeg", [
  "-y", "-loglevel", "error",
  "-f", "image2pipe", "-framerate", String(fps), "-c:v", "png", "-i", "-",
  ...encode, "-r", String(fps), output,
], { stdio: ["pipe", "inherit", "inherit"] });
const ffDone = new Promise((res, rej) => ff.on("close", (code) => (code === 0 ? res() : rej(new Error(`ffmpeg exited ${code}`)))));

for (let f = 0; f < frames; f++) {
  await seek(f / fps);
  const png = await page.screenshot({ omitBackground: !!args.alpha, type: "png" });
  if (!ff.stdin.write(png)) await new Promise((r) => ff.stdin.once("drain", r));
  if (f % (fps * 2) === 0) process.stdout.write(`\r${input}: frame ${f}/${frames}`);
}
ff.stdin.end();
await ffDone;
await browser.close();
process.stdout.write(`\r${input}: ${frames} frames → ${output}\n`);
if (!existsSync(output)) process.exit(1);
