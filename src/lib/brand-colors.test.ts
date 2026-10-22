import { describe, expect, it } from "vitest";
import { colorsFromPixels, luminance } from "./brand-colors";

const pixels = (spec: [number, number, number, number][]) => new Uint8ClampedArray(spec.flatMap(([r, g, b, n]) => Array.from({ length: n }, () => [r, g, b, 255]).flat()));

describe("colorsFromPixels", () => {
  it("picks the main logo colour as primary and a distinct second colour as accent, ignoring white", () => {
    const c = colorsFromPixels(pixels([[255, 255, 255, 500], [0, 66, 130, 300], [227, 24, 55, 80]]))!;
    expect(c.primary).toBe("#004282");
    expect(c.accent).toBe("#e31837");
  });
  it("darkens a light primary so white text stays readable", () => {
    const c = colorsFromPixels(pixels([[120, 200, 255, 100]]))!;
    expect(luminance(c.primary)).toBeLessThanOrEqual(0.18);
  });
  it("returns null for a black-and-white logo", () => {
    expect(colorsFromPixels(pixels([[0, 0, 0, 100], [255, 255, 255, 100]]))).toBeNull();
  });
});
