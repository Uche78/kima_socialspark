// Brand colour presets (colours only; brokers upload their own logo) and colours taken from a logo.

export type BrandColors = { primary: string; secondary: string; accent: string };

/** Network presets use colours published on each network's own website. */
export const COLOR_PRESETS: Record<string, BrandColors & { label: string }> = {
  navy_gold: { label: "Navy & gold (default)", primary: "#0f2a44", secondary: "#ffffff", accent: "#d4a24c" },
  charcoal_copper: { label: "Charcoal & copper", primary: "#2b2d31", secondary: "#ffffff", accent: "#c27a46" },
  forest_sand: { label: "Forest & sand", primary: "#1f3d2b", secondary: "#ffffff", accent: "#d9c08f" },
  burgundy_cream: { label: "Burgundy & cream", primary: "#5a1a2b", secondary: "#ffffff", accent: "#e8d5b0" },
  teal_coral: { label: "Teal & coral", primary: "#0e4f5c", secondary: "#ffffff", accent: "#f08a6c" },
  dlc: { label: "Dominion Lending Centres blue", primary: "#004282", secondary: "#ffffff", accent: "#d4a24c" },
  mortgage_architects: { label: "Mortgage Architects blue", primary: "#008cbf", secondary: "#ffffff", accent: "#5b5b5b" },
};

const hex = (r: number, g: number, b: number) => `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`;

/** Relative luminance (0 dark – 1 light). */
export function luminance(color: string) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(color.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function darken(color: string, factor: number) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(color.slice(i, i + 2), 16) * factor);
  return hex(r, g, b);
}

/**
 * Picks brand colours from logo pixels (RGBA): the most common saturated colour becomes the
 * primary (darkened until white text reads on it), the next distinct one the accent.
 */
export function colorsFromPixels(data: Uint8ClampedArray | Uint8Array): BrandColors | null {
  const counts = new Map<string, { n: number; r: number; g: number; b: number }>();
  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
    if (a < 200) continue;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    if (max > 235 && min > 225) continue; // white background
    if (max - min < 28) continue; // greys and black carry no brand colour
    const key = `${r >> 4},${g >> 4},${b >> 4}`;
    const c = counts.get(key) ?? { n: 0, r: 0, g: 0, b: 0 };
    c.n++; c.r += r; c.g += g; c.b += b;
    counts.set(key, c);
  }
  const ranked = [...counts.values()].sort((x, y) => y.n - x.n).map((c) => ({ n: c.n, color: hex(c.r / c.n, c.g / c.n, c.b / c.n) }));
  if (!ranked.length) return null;
  let primary = ranked[0].color;
  for (let i = 0; i < 6 && luminance(primary) > 0.18; i++) primary = darken(primary, 0.85);
  const distance = (a: string, b: string) => [1, 3, 5].reduce((d, i) => d + Math.abs(parseInt(a.slice(i, i + 2), 16) - parseInt(b.slice(i, i + 2), 16)), 0);
  const accent = ranked.slice(1).find((c) => c.n > ranked[0].n * 0.05 && distance(c.color, ranked[0].color) > 120)?.color ?? "#d4a24c";
  return { primary, secondary: "#ffffff", accent };
}

/** Loads a logo (same-origin or CORS-enabled URL) and picks its colours. Browser only. */
export async function colorsFromLogo(url: string): Promise<BrandColors | null> {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = url;
  await img.decode();
  const scale = Math.min(1, 200 / Math.max(img.naturalWidth, img.naturalHeight));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return colorsFromPixels(ctx.getImageData(0, 0, canvas.width, canvas.height).data);
}
