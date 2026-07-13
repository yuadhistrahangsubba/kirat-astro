import { describe, expect, it } from "vitest";

import { meanLunarNodeLongitude, meanLunarSouthNodeLongitude } from "./lunar-node";

describe("meanLunarNodeLongitude", () => {
  it("returns a value in [0, 360)", () => {
    const jd = 2452067.802; // reference chart's birth JD
    const longitude = meanLunarNodeLongitude(jd);
    expect(longitude).toBeGreaterThanOrEqual(0);
    expect(longitude).toBeLessThan(360);
  });

  it("regresses (moves backward) over time, since the mean node has a ~18.6-year retrograde cycle", () => {
    const jdEarlier = 2451545.0; // J2000.0
    const jdLater = jdEarlier + 365.25 * 5; // 5 years later
    const earlier = meanLunarNodeLongitude(jdEarlier);
    const later = meanLunarNodeLongitude(jdLater);
    // Moving forward in time, the mean node's longitude decreases (regresses).
    const delta = ((earlier - later + 540) % 360) - 180; // signed shortest delta, forward-positive
    expect(delta).toBeGreaterThan(0);
  });
});

describe("meanLunarSouthNodeLongitude", () => {
  it("Ketu is always exactly 180 degrees from Rahu", () => {
    const jd = 2452067.802;
    const rahu = meanLunarNodeLongitude(jd);
    const ketu = meanLunarSouthNodeLongitude(jd);
    const diff = Math.abs(rahu - ketu);
    expect(Math.min(diff, 360 - diff)).toBeCloseTo(180, 9);
  });
});
