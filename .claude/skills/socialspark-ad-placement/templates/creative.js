// Shared setup for the static ad templates. window.__DATA is injected by render_creatives.mjs:
// { width, height, safe: {t,b,l,r} (fractions), lang, theme, ...the creative's own fields }.
// Every element that shows words gets data-text, so the renderer can check it sits inside the safe zone.
const D = window.__DATA || {};
const W = D.width || 1080;
const H = D.height || 1350;
// 1% of the shorter side; wide banners (1.91:1) scale from their width so type stays readable.
const u = Math.max(Math.min(W, H) / 100, W / 150);
const ratio = W / H;
const shape = ratio < 0.7 ? "tall" : ratio < 0.95 ? "portrait" : ratio < 1.25 ? "square" : "wide";
const safe = D.safe || { t: 0.06, b: 0.06, l: 0.06, r: 0.06 };

document.documentElement.lang = D.lang === "fr" ? "fr-CA" : "en-CA";
document.body.classList.add(shape);
document.body.classList.add(D.theme || window.DEFAULT_THEME || "light");
const css = document.documentElement.style;
css.setProperty("--u", `${u}px`);
css.setProperty("--st", `${safe.t * H}px`);
css.setProperty("--sb", `${safe.b * H}px`);
css.setProperty("--sl", `${safe.l * W}px`);
css.setProperty("--sr", `${safe.r * W}px`);
// Lowest edge for pictures on 9:16 (Stories' own bottom band); text keeps to the stricter --sb.
css.setProperty("--mb", `${Math.min(safe.b, 0.2) * H}px`);
const tall = shape === "tall";
const wide = shape === "wide";

/** On 9:16, fill the whole screen with a blurred copy of the first image, so the bands kept clear of text don't look empty. */
function tallBackdrop(images) {
  if (!tall || D.backdrop === false || !(images || []).length) return;
  document.body.classList.replace("light", "dark");
  backdrop(images[0]);
}

/** The frame that holds everything, inside the placement's safe zone. */
function frame() {
  return el("div", tall ? "frame tall" : "frame", null, document.body);
}

/** Offer chip + wordmark. */
function foot(parent) {
  const f = el("div", "foot", null, parent);
  if (D.chip) el("div", "chip", D.chip, f);
  wordmark(f);
  return f;
}

function el(tag, cls, text, parent, html = false) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null && text !== "") {
    if (html) e.innerHTML = text;
    else e.textContent = text;
    e.dataset.text = "";
  }
  if (parent) parent.appendChild(e);
  return e;
}

function wordmark(parent, cls = "") {
  return el("div", `wordmark ${cls}`, "Social<span>Spark</span>", parent, true);
}

/** Blurred, darkened copy of an image behind everything: fills a tall frame's unsafe bands with colour, not text. */
function backdrop(spec) {
  const src = typeof spec === "string" ? spec : spec?.src;
  if (!src) return;
  const b = el("div", "backdrop", null, document.body);
  b.style.backgroundImage = `url("${src}")`;
  document.body.insertBefore(b, document.body.firstChild);
}

/** An image in a rounded, shadowed frame. spec: "path" or { src, label, blur: [[x,y,w,h], ...] as fractions of the image }. */
function shot(spec, parent) {
  const o = typeof spec === "string" ? { src: spec } : spec;
  const wrap = el("div", "shot", null, parent);
  const img = el("img", "", null, wrap);
  img.src = o.src;
  for (const [x, y, w, h] of o.blur || []) {
    const b = el("div", "blur", null, wrap);
    Object.assign(b.style, { left: `${x * 100}%`, top: `${y * 100}%`, width: `${w * 100}%`, height: `${h * 100}%` });
  }
  if (o.label) el("div", "label", o.label, wrap);
  wrap._img = img;
  return wrap;
}

const linkIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/></svg>';
function pill(text, parent) {
  const p = el("div", "pill", null, parent);
  p.innerHTML = linkIcon;
  el("span", "", text, p);
  return p;
}
function arrow(parent, dir = "down") {
  const a = el("div", "arrow", null, parent);
  const path = dir === "down" ? "M12 4v15M5 12l7 7 7-7" : "M4 12h15M12 5l7 7-7 7";
  a.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="${path}"/></svg>`;
  return a;
}

/** Shrink a text element until it fits in maxLines. */
function fitText(e, maxLines) {
  if (!e) return;
  let size = parseFloat(getComputedStyle(e).fontSize);
  const lines = () => e.getBoundingClientRect().height / parseFloat(getComputedStyle(e).lineHeight);
  while (lines() > maxLines + 0.2 && size > u * 2.4) {
    size *= 0.95;
    e.style.fontSize = `${size}px`;
  }
}

const aspectOf = (wrap) => (wrap._img.naturalWidth || 1080) / (wrap._img.naturalHeight || 1350);

/** Place one or more shots inside their .media box: "single" (contain, centred), "row" (side by side), "column" (stacked), "fan". */
function placeShots(media, shots, mode = "single", gapU = 2.5) {
  const bw = media.clientWidth;
  const bh = media.clientHeight;
  const gap = gapU * u;
  const n = shots.length;
  if (!n) return;
  const put = (s, x, y, w, h, rot = 0, z = 1) => Object.assign(s.style, { left: `${x}px`, top: `${y}px`, width: `${w}px`, height: `${h}px`, transform: rot ? `rotate(${rot}deg)` : "", zIndex: z });
  const contain = (a, cw, ch) => (cw / ch > a ? [ch * a, ch] : [cw, cw / a]);

  if (mode === "fan" && n > 1) {
    const a = aspectOf(shots[0]);
    const [w, h] = contain(a, bw * (n > 3 ? 0.46 : 0.56), bh * 0.88);
    const step = n > 1 ? (bw - w) / (n - 1) : 0;
    const mid = (n - 1) / 2;
    shots.forEach((s, i) => put(s, i * step, (bh - h) / 2 + Math.abs(i - mid) * u * 1.5, w, h, (i - mid) * (n > 3 ? 4 : 5), 10 - Math.round(Math.abs(i - mid) * 2)));
    return;
  }
  if (mode === "column") {
    const ch = (bh - gap * (n - 1)) / n;
    let y = 0;
    shots.forEach((s) => { const [w, h] = contain(aspectOf(s), bw, ch); put(s, (bw - w) / 2, y + (ch - h) / 2, w, h); y += ch + gap; });
    return;
  }
  if (n > 1) {
    const cw = (bw - gap * (n - 1)) / n;
    const sizes = shots.map((s) => contain(aspectOf(s), cw, bh));
    let x = 0;
    shots.forEach((s, i) => { const [w, h] = sizes[i]; put(s, x + (cw - w) / 2, (bh - h) / 2, w, h); x += cw + gap; });
    return;
  }
  const [w, h] = contain(aspectOf(shots[0]), bw, bh);
  put(shots[0], (bw - w) / 2, (bh - h) / 2, w, h);
}
