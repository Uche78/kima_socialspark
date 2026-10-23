#!/usr/bin/env node
// Screen-records the SocialSpark app from a JSON shot list, at full device resolution.
//
//   node record_app.mjs <shots.json> <out.mp4>
//   node record_app.mjs --login [--base http://localhost:3000] [--state .auth/state.json]
//        Opens a visible browser on /login. Sign in with the email code; the session is saved
//        for later recordings (shots.json → "storageState"). Without it, recordings run as a guest.
//
// shots.json:
// {
//   "baseUrl": "http://localhost:3000",
//   "viewport": { "width": 390, "height": 844 },   // phone (default) — or 1440×900 for desktop
//   "deviceScaleFactor": 3,                         // 390×3 = 1170 px wide: crisp at 1080
//   "storageState": ".auth/state.json",             // optional, from --login
//   "cursor": "touch",                              // "touch" (tap rings) | "pointer" (arrow) | "none"
//   "steps": [
//     { "goto": "/" },
//     { "wait": 800 },
//     { "click": "role=button[name=\"Try it free\"]" },
//     { "type": { "selector": "input[type=url]", "text": "https://…", "delay": 45 } },
//     { "press": "Enter" },
//     { "waitFor": "text=Caption", "timeout": 120000 },
//     { "mark": "post-ready" },
//     { "scroll": { "y": 600, "duration": 1200 } },          // or { "to": "<selector>" }
//     { "hover": "text=Modern" },
//     { "upload": { "selector": "input[type=file]", "files": ["/abs/headshot.jpg"] } },
//     { "screenshot": { "path": "stills/slide1.png", "selector": "[data-slide]" } },
//     { "download": { "click": "role=button[name=\"Download\"]", "saveAs": "stills/post.zip" } },
//     { "eval": "document.body.dataset.demo = '1'" }
//   ]
// }
//
// Writes <out.mp4> (30 fps, H.264) and <out>.timeline.json: every step and mark in footage time
// ("start"/"end", "marks") for cutting, and in wall-clock time ("realStart"/"realEnd", "realMarks").
// Use the real times for any on-screen or spoken speed claim (e.g. link → post duration).
// "slowmo" (default 4 at 3x, 2 at 2x) trades recording time for full-resolution 30 fps.
// Routes with outward effects (publish, schedule, email sharing, billing, social connect) are blocked.

import { chromium } from "playwright";
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const opt = (name, fallback) => { const i = argv.indexOf(name); return i >= 0 ? argv[i + 1] : fallback; };

// Never let a recording publish, schedule, email, bill or connect anything.
const BLOCKED = [
  /\/api\/posts\/[^/]+\/(publish|schedule|unpublish)/,
  /\/api\/listings\/[^/]+\/share/,
  /\/api\/billing\//,
  /\/api\/connect\//,
  /\/api\/cron\//,
  /checkout\.stripe\.com/,
];

if (argv[0] === "--login") {
  const base = opt("--base", "http://localhost:3000");
  const statePath = resolve(opt("--state", join(HERE, ".auth/state.json")));
  mkdirSync(dirname(statePath), { recursive: true });
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ viewport: { width: 1280, height: 860 } });
  const page = await context.newPage();
  await page.goto(base + "/login");
  console.log("Sign in in the browser window (email code). Waiting up to 10 minutes…");
  await page.waitForURL((u) => !u.pathname.startsWith("/login") && !u.pathname.startsWith("/auth"), { timeout: 600_000 });
  await page.waitForLoadState("networkidle");
  await context.storageState({ path: statePath });
  await browser.close();
  console.log(`Session saved to ${statePath}`);
  process.exit(0);
}

const [shotsPath, outPath] = argv;
if (!shotsPath || !outPath) {
  console.error("usage: record_app.mjs <shots.json> <out.mp4>  |  record_app.mjs --login");
  process.exit(1);
}
const shots = JSON.parse(readFileSync(shotsPath, "utf8"));
const base = (shots.baseUrl || "http://localhost:3000").replace(/\/$/, "");
const viewport = shots.viewport || { width: 390, height: 844 };
const dpr = shots.deviceScaleFactor ?? (viewport.width < 600 ? 3 : 2);
const fps = shots.fps || 30;
const cursorMode = shots.cursor || (viewport.width < 600 ? "touch" : "pointer");
// Headless Chromium renders device-scale frames in software: ~15 fps at 2x, ~8 fps at 3x.
// So the page runs in slow motion (CSS animations via CDP, our cursor/typing/scroll by the same
// factor) and the footage is sped back up, giving smooth 30 fps at full resolution.
// App timers (setTimeout) and network waits still run in real time, so they play back faster.
const slow = shots.slowmo ?? (dpr >= 3 ? 4 : dpr >= 2 ? 2 : 1);
const relTo = (p) => resolve(dirname(resolve(shotsPath)), p);

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport,
  deviceScaleFactor: dpr,
  isMobile: viewport.width < 600,
  hasTouch: false, // mouse events drive the visible cursor; the app's layout follows the viewport width
  locale: shots.locale || "en-CA",
  timezoneId: shots.timezone || "America/Toronto",
  storageState: shots.storageState ? relTo(shots.storageState) : undefined,
});
await context.route("**/*", (route) => {
  const url = route.request().url();
  if (BLOCKED.some((re) => re.test(url))) {
    console.warn(`blocked during recording: ${url}`);
    return route.abort("blockedbyclient");
  }
  return route.continue();
});

// Visible cursor / tap indicator. Real input events from Playwright move it.
await context.addInitScript((mode) => {
  const css = `
    #__adc{position:fixed;left:0;top:0;z-index:2147483647;pointer-events:none;transition:opacity .2s}
    #__adc.pointer{width:22px;height:22px;margin:-2px 0 0 -3px;background:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M3 2l7.5 19 2.6-7.9L21 10.5z' fill='%2316202b' stroke='white' stroke-width='1.6' stroke-linejoin='round'/></svg>") no-repeat;filter:drop-shadow(0 1px 2px rgba(0,0,0,.35))}
    #__adc.touch{width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;background:rgba(15,42,68,.18);border:2px solid rgba(255,255,255,.9);box-shadow:0 2px 10px rgba(0,0,0,.25);opacity:.0}
    #__adc.touch.show{opacity:1}
    .__adr{position:fixed;z-index:2147483646;pointer-events:none;width:60px;height:60px;margin:-30px 0 0 -30px;border-radius:50%;border:3px solid #d4a24c;animation:__adr .5s ease-out forwards}
    @keyframes __adr{from{transform:scale(.3);opacity:1}to{transform:scale(1.4);opacity:0}}`;
  const mount = () => {
    if (document.getElementById("__adc")) return;
    const s = document.createElement("style"); s.textContent = css; document.head.appendChild(s);
    // Hide the Next.js dev-mode badge and error overlay launcher.
    const hide = document.createElement("style"); hide.textContent = "nextjs-portal{display:none!important}"; document.head.appendChild(hide);
    if (mode === "none") return;
    const c = document.createElement("div"); c.id = "__adc"; c.className = mode; document.body.appendChild(c);
    let last = null;
    try { last = JSON.parse(sessionStorage.getItem("__adc") || "null"); } catch {}
    if (last) c.style.transform = `translate(${last.x}px,${last.y}px)`;
    addEventListener("mousemove", (e) => {
      c.style.transform = `translate(${e.clientX}px,${e.clientY}px)`;
      try { sessionStorage.setItem("__adc", JSON.stringify({ x: e.clientX, y: e.clientY })); } catch {}
    }, true);
    addEventListener("mousedown", (e) => {
      c.classList.add("show");
      const r = document.createElement("div"); r.className = "__adr";
      r.style.left = e.clientX + "px"; r.style.top = e.clientY + "px";
      document.body.appendChild(r); setTimeout(() => r.remove(), 600);
    }, true);
    addEventListener("mouseup", () => setTimeout(() => c.classList.remove("show"), 250), true);
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount); else mount();
}, cursorMode);

const page = await context.newPage();
page.setDefaultTimeout(30_000 * slow);
const W = (ms) => page.waitForTimeout(ms * slow);

// Capture loop: CDP screenshots at full device resolution (~27 fps at 3x), timestamped.
// (Page.startScreencast only delivers CSS-pixel frames, too soft for 1080p.)
const frameDir = join(tmpdir(), `ss-rec-${Date.now()}`);
mkdirSync(frameDir, { recursive: true });
const frames = [];
const cdp = await context.newCDPSession(page);
const clip = { x: 0, y: 0, width: viewport.width, height: viewport.height, scale: dpr };
const slowAnimations = () => cdp.send("Animation.enable").then(() => cdp.send("Animation.setPlaybackRate", { playbackRate: 1 / slow })).catch(() => {});
page.on("domcontentloaded", slowAnimations);
await slowAnimations();
let capturing = true;
const captureLoop = (async () => {
  while (capturing) {
    try {
      const t = Date.now() / 1000;
      const shot = cdp.send("Page.captureScreenshot", { format: "jpeg", quality: 92, optimizeForSpeed: true, clip });
      const { data } = await Promise.race([shot, new Promise((_, no) => setTimeout(() => no(new Error("capture timeout")), 2000))]);
      const file = join(frameDir, `f${String(frames.length).padStart(6, "0")}.jpg`);
      writeFileSync(file, Buffer.from(data, "base64"));
      frames.push({ file, t });
    } catch {
      await new Promise((r) => setTimeout(r, 30)); // mid-navigation; try again
    }
  }
})();

const timeline = { viewport, deviceScaleFactor: dpr, slowmo: slow, steps: [], marks: {}, realMarks: {} };
let t0 = null;
const real = () => (t0 === null ? 0 : Date.now() / 1000 - t0);
const now = () => real() / slow; // time in the finished footage

let cursor = { x: viewport.width / 2, y: viewport.height * 0.6 };
const ease = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
async function glide(x, y) {
  const dist = Math.hypot(x - cursor.x, y - cursor.y);
  const n = Math.max(8, Math.min(40, Math.round(dist / 12)));
  for (let i = 1; i <= n; i++) {
    const p = ease(i / n);
    await page.mouse.move(cursor.x + (x - cursor.x) * p, cursor.y + (y - cursor.y) * p);
    await W(14);
  }
  cursor = { x, y };
}
async function smoothScrollBy(dy, ms = 900) {
  ms *= slow;
  await page.evaluate(([dy, ms]) => new Promise((done) => {
    const start = scrollY, t0 = performance.now();
    const e = (p) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);
    // performance.now(), not the rAF timestamp: the slowed animation timeline also slows the latter.
    const tick = () => { const p = Math.min(1, (performance.now() - t0) / ms); scrollTo(0, start + dy * e(p)); p < 1 ? requestAnimationFrame(tick) : done(); };
    requestAnimationFrame(tick);
  }), [dy, ms]);
}
async function bringIntoView(loc) {
  const box = await loc.boundingBox();
  if (!box) return;
  const margin = viewport.height * 0.18;
  if (box.y < margin) await smoothScrollBy(box.y - margin);
  else if (box.y + box.height > viewport.height - margin) await smoothScrollBy(box.y + box.height - viewport.height + margin);
}
async function target(selector) {
  const loc = page.locator(selector).first();
  await loc.waitFor({ state: "visible" });
  await bringIntoView(loc);
  const box = await loc.boundingBox();
  return { loc, x: box.x + box.width / 2, y: box.y + box.height / 2 };
}

try {
  for (const step of shots.steps || []) {
    const [kind] = Object.keys(step);
    const v = step[kind];
    const entry = { step: kind, arg: typeof v === "string" ? v : undefined, start: now(), realStart: real() };
    if (kind === "goto") {
      await page.goto(base + v, { waitUntil: "networkidle" });
      // Another app can be on the same port; refuse to record the wrong product.
      if (!shots.allowOtherSite && !/SocialSpark/i.test((await page.title()) + (await page.content()).slice(0, 20000)))
        throw new Error(`${base + v} is not SocialSpark (title: "${await page.title()}"). Check the port.`);
      await slowAnimations();
      if (t0 === null) t0 = Date.now() / 1000, (entry.start = 0), (entry.realStart = 0);
    } else if (kind === "wait") {
      await W(v);
    } else if (kind === "click" || kind === "hover") {
      const { loc, x, y } = await target(v);
      await glide(x, y);
      await W(kind === "click" ? 180 : 400);
      if (kind === "click") { await page.mouse.down(); await W(90); await page.mouse.up(); }
      void loc;
      await W(step.pause ?? 350);
    } else if (kind === "type") {
      const { x, y } = await target(v.selector);
      await glide(x, y);
      await page.mouse.down(); await page.mouse.up();
      if (v.clear) await page.locator(v.selector).first().fill("");
      await page.keyboard.type(v.text, { delay: (v.delay ?? 45) * slow });
      await W(300);
    } else if (kind === "fill") {
      await page.locator(v.selector).first().fill(v.text);
    } else if (kind === "press") {
      await page.keyboard.press(v);
    } else if (kind === "waitFor") {
      await page.locator(v).first().waitFor({ state: step.state || "visible", timeout: (step.timeout ?? 120_000) + 30_000 * slow });
    } else if (kind === "scroll") {
      if (v.to) await bringIntoView(page.locator(v.to).first());
      else await smoothScrollBy(v.y, v.duration ?? 900);
      await W(200);
    } else if (kind === "upload") {
      await page.locator(v.selector).first().setInputFiles(v.files.map(relTo));
    } else if (kind === "screenshot") {
      const path = relTo(v.path);
      mkdirSync(dirname(path), { recursive: true });
      if (v.selector) await page.locator(v.selector).first().screenshot({ path });
      else await page.screenshot({ path });
    } else if (kind === "download") {
      // Click something that downloads (e.g. the post editor's Download) and keep the file.
      const { x, y } = await target(v.click);
      await glide(x, y);
      const dl = page.waitForEvent("download", { timeout: 60_000 * slow });
      await page.mouse.down(); await page.mouse.up();
      const path = relTo(v.saveAs);
      mkdirSync(dirname(path), { recursive: true });
      await (await dl).saveAs(path);
    } else if (kind === "eval") {
      await page.evaluate(v);
    } else if (kind === "mark") {
      timeline.marks[v] = now();
      timeline.realMarks[v] = real();
    } else {
      throw new Error(`unknown step: ${kind}`);
    }
    entry.end = now();
    entry.realEnd = real();
    timeline.steps.push(entry);
    if (kind !== "mark") console.log(`${entry.start.toFixed(2)}s  ${kind} ${entry.arg ?? ""}`);
  }
  await W(500);
} catch (err) {
  console.error(`step failed at ${now().toFixed(2)}s: ${err.message}`);
  await page.screenshot({ path: outPath.replace(/\.\w+$/, "") + ".error.png" }).catch(() => {});
  process.exitCode = 1;
} finally {
  capturing = false;
  await captureLoop;
  const tEnd = Date.now() / 1000;
  await browser.close();

  // Variable-rate frames → constant-fps video via the concat demuxer.
  const usable = frames.filter((f) => t0 === null || f.t >= t0 - 0.5);
  if (usable.length) {
    let list = "ffconcat version 1.0\n";
    usable.forEach((f, i) => {
      const next = i + 1 < usable.length ? usable[i + 1].t : tEnd;
      list += `file '${f.file}'\nduration ${Math.max(0.001, (next - f.t) / slow).toFixed(4)}\n`;
    });
    list += `file '${usable[usable.length - 1].file}'\n`;
    const listFile = join(frameDir, "list.ffconcat");
    writeFileSync(listFile, list);
    // Shift the timeline so 0 = first frame; even dimensions for H.264.
    const offset = t0 === null ? 0 : (usable[0].t - t0) / slow;
    for (const s of timeline.steps) { s.start -= offset; s.end -= offset; }
    for (const k of Object.keys(timeline.marks)) timeline.marks[k] -= offset;
    timeline.duration = (tEnd - usable[0].t) / slow;
    mkdirSync(dirname(resolve(outPath)), { recursive: true });
    const r = spawnSync("ffmpeg", ["-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", listFile,
      "-vf", `fps=${fps},scale=trunc(iw/2)*2:trunc(ih/2)*2:in_range=full:out_range=tv,format=yuv420p`, "-c:v", "libx264", "-preset", "slow", "-crf", "15",
      "-pix_fmt", "yuv420p", "-movflags", "+faststart", outPath], { stdio: "inherit" });
    if (r.status !== 0) process.exitCode = 1;
    writeFileSync(outPath.replace(/\.\w+$/, "") + ".timeline.json", JSON.stringify(timeline, null, 2));
    console.log(`${usable.length} frames, ${timeline.duration.toFixed(1)}s → ${outPath}`);
  } else {
    console.error("no frames captured");
    process.exitCode = 1;
  }
  rmSync(frameDir, { recursive: true, force: true });
}
