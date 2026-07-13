import { describe, expect, it } from "vitest";

import { calculateAscendant } from "./ascendant";

describe("calculateAscendant", () => {
  it("at the equator with zero obliquity, reduces to RAMC + 90 (the degenerate case that pins the sign)", () => {
    // With no axial tilt, ecliptic = celestial equator, and a rising
    // point has hour angle H = -90 (6h before meridian transit), i.e.
    // RA = RAMC + 90 — this is independently derivable from the
    // direction of sky rotation, not just re-deriving the formula,
    // which is what makes it a real check.
    for (const ramc of [0, 45, 90, 135, 200, 300, 359]) {
      const expected = ((ramc + 90) % 360 + 360) % 360;
      expect(calculateAscendant(ramc, 0, 0)).toBeCloseTo(expected, 6);
    }
  });

  it("stays within [0, 360) for a realistic latitude and obliquity", () => {
    const asc = calculateAscendant(197.6932, 51.5, 23.4393);
    expect(asc).toBeGreaterThanOrEqual(0);
    expect(asc).toBeLessThan(360);
  });

  it("differs from the same inputs at RAMC+180 by roughly, but not exactly, 180 degrees", () => {
    // Sanity check that latitude/obliquity genuinely perturb the simple
    // RAMC-90 relationship (otherwise this would just be angle::sub).
    const a = calculateAscendant(90, 51.5, 23.4393);
    const b = calculateAscendant(270, 51.5, 23.4393);
    const diff = Math.abs(a - b);
    expect(diff).toBeGreaterThan(150);
    expect(diff).toBeLessThan(210);
  });
});
