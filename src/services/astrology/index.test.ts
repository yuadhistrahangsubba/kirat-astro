import { describe, expect, it } from "vitest";

import { computeChart } from "./index";

describe("computeChart", () => {
  const withTime = {
    birthDate: "1998-04-12",
    birthTime: "06:15",
    timezone: "Asia/Thimphu",
    latitude: 27.4712,
    longitude: 89.6339,
  };

  it("places Sun and Moon with real sidereal and tropical signs", () => {
    const chart = computeChart(withTime);
    expect(chart.sun.rashi.signName).toBeTruthy();
    expect(chart.sun.westernSign.signName).toBeTruthy();
    expect(chart.moon.nakshatra.name).toBeTruthy();
    expect(chart.timeConfidence).toBe("exact");
  });

  it("computes an ascendant and both house systems when birth time is known", () => {
    const chart = computeChart(withTime);
    expect(chart.ascendant).toBeDefined();
    expect(chart.ascendant!.tropicalLongitude).toBeGreaterThanOrEqual(0);
    expect(chart.ascendant!.tropicalLongitude).toBeLessThan(360);
    expect(chart.houses?.western.cusps).toHaveLength(12);
    expect(chart.houses?.vedic.cusps).toHaveLength(12);
  });

  it("omits ascendant and houses entirely when birth time is unknown, rather than guessing", () => {
    const chart = computeChart({ ...withTime, birthTime: undefined });
    expect(chart.timeConfidence).toBe("date-only");
    expect(chart.ascendant).toBeUndefined();
    expect(chart.houses).toBeUndefined();
  });

  it("still computes Sun/Moon/Panchang/Dasha even without an exact time", () => {
    const chart = computeChart({ ...withTime, birthTime: undefined });
    expect(chart.sun.rashi.signName).toBeTruthy();
    expect(chart.panchang.tithi.name).toBeTruthy();
    expect(chart.vimshottariDasha.length).toBeGreaterThan(0);
  });

  it("places every classical graha plus the outer planets", () => {
    const chart = computeChart(withTime);
    for (const body of ["mars", "mercury", "jupiter", "venus", "saturn", "rahu", "ketu"] as const) {
      expect(chart[body].rashi.signName).toBeTruthy();
      expect(chart[body].house).toBeGreaterThanOrEqual(1);
      expect(chart[body].house).toBeLessThanOrEqual(12);
    }
    for (const body of ["uranus", "neptune", "pluto"] as const) {
      expect(chart[body].rashi.signName).toBeTruthy();
    }
  });

  it("Ketu sits exactly opposite Rahu", () => {
    const chart = computeChart(withTime);
    const diff = Math.abs(chart.rahu.siderealLongitude - chart.ketu.siderealLongitude);
    expect(Math.min(diff, 360 - diff)).toBeCloseTo(180, 5);
  });

  it("computes a Navamsa sign for every graha, the outer planets, and the ascendant", () => {
    const chart = computeChart(withTime);
    expect(chart.navamsa.sun.signName).toBeTruthy();
    expect(chart.navamsa.ketu.signName).toBeTruthy();
    expect(chart.navamsa.uranus.signName).toBeTruthy();
    expect(chart.navamsa.neptune.signName).toBeTruthy();
    expect(chart.navamsa.pluto.signName).toBeTruthy();
    expect(chart.navamsa.ascendant?.signName).toBeTruthy();
  });

  it("builds Antardasha sub-periods inside every Mahadasha, and a birth Dasha balance", () => {
    const chart = computeChart(withTime);
    expect(chart.vimshottariDasha).toHaveLength(9);
    for (const mahadasha of chart.vimshottariDasha) {
      expect(mahadasha.antardasha).toHaveLength(9);
    }
    expect(chart.dashaBalanceAtBirth.years).toBeGreaterThanOrEqual(0);
  });

  it("computes sunrise/sunset for the birth date and location even without an exact time", () => {
    const chart = computeChart({ ...withTime, birthTime: undefined });
    expect(chart.sunrise).toBeInstanceOf(Date);
    expect(chart.sunset).toBeInstanceOf(Date);
  });

  it("produces a sensible Julian day and ayanamsa for a known date", () => {
    const chart = computeChart(withTime);
    expect(chart.julianDayUtc).toBeGreaterThan(2450000); // sometime after 1995
    expect(chart.ayanamsaDegrees).toBeGreaterThan(23);
    expect(chart.ayanamsaDegrees).toBeLessThan(25);
  });
});
