import { describe, expect, it } from "vitest";

import { findSadesatiPeriodAt, findSadesatiPeriods } from "./sadesati";

const DAY_MS = 24 * 60 * 60 * 1000;

function daysApart(a: Date, b: Date): number {
  return Math.abs(a.getTime() - b.getTime()) / DAY_MS;
}

describe("findSadesatiPeriods", () => {
  it("returns chronologically ordered, non-overlapping periods with valid phases", () => {
    const periods = findSadesatiPeriods(8, new Date(Date.UTC(2001, 5, 7)), 30);
    expect(periods.length).toBeGreaterThan(0);

    for (let i = 0; i < periods.length; i++) {
      const period = periods[i]!;
      expect(period.startDate.getTime()).toBeLessThan(period.endDate.getTime());
      expect(["rising", "peak", "setting", "dhaiya-4th", "dhaiya-8th"]).toContain(period.phase);
      if (i > 0) {
        expect(period.startDate.getTime()).toBeGreaterThanOrEqual(periods[i - 1]!.endDate.getTime());
      }
    }
  });

  it("findSadesatiPeriodAt finds the period covering a given moment, or undefined outside all of them", () => {
    const periods = findSadesatiPeriods(8, new Date(Date.UTC(2001, 5, 7)), 30);
    const covered = findSadesatiPeriodAt(periods, new Date(Date.UTC(2018, 0, 1)));
    expect(covered).toBeDefined();
    expect(covered?.phase).toBe("peak");

    const uncovered = findSadesatiPeriodAt(periods, new Date(Date.UTC(2010, 0, 1)));
    expect(uncovered).toBeUndefined();
  });

  /**
   * Ground-truth regression check against AstroSage's own free Kundli
   * report for this exact birth (7 June 2001, 13:15 local (UTC+6),
   * Tsirang, Bhutan — Moon in Sagittarius). AstroSage's Sadesati table
   * lists these same periods, including the real Saturn-retrograde
   * double-back through Scorpio/Sagittarius in 2017. A day or two of
   * drift is expected — this engine's Lahiri ayanamsa is an explicitly
   * documented linear approximation (see ayanamsa/lahiri.ts), not
   * nutation-corrected to match one specific software's exact value.
   */
  it("matches AstroSage's reference Sadesati table for a real birth, within a couple of days", () => {
    const birthUtc = new Date(Date.UTC(2001, 5, 7, 7, 15, 0)); // 13:15 local, UTC+6
    const periods = findSadesatiPeriods(8, birthUtc, 25); // Moon in Sagittarius (index 8)

    const expected = [
      { phase: "dhaiya-8th", signIndex: 3, start: "2004-09-06", end: "2005-01-13" },
      { phase: "dhaiya-8th", signIndex: 3, start: "2005-05-26", end: "2006-10-31" },
      { phase: "dhaiya-8th", signIndex: 3, start: "2007-01-11", end: "2007-07-15" },
      { phase: "rising", signIndex: 7, start: "2014-11-03", end: "2017-01-26" },
      { phase: "peak", signIndex: 8, start: "2017-01-27", end: "2017-06-20" },
      { phase: "rising", signIndex: 7, start: "2017-06-21", end: "2017-10-26" },
      { phase: "peak", signIndex: 8, start: "2017-10-27", end: "2020-01-23" },
      { phase: "setting", signIndex: 9, start: "2020-01-24", end: "2022-04-28" },
      { phase: "setting", signIndex: 9, start: "2022-07-13", end: "2023-01-17" },
    ] as const;

    expect(periods.length).toBeGreaterThanOrEqual(expected.length);

    expected.forEach((exp, i) => {
      const actual = periods[i]!;
      expect(actual.phase).toBe(exp.phase);
      expect(actual.shaniRashiSignIndex).toBe(exp.signIndex);
      expect(daysApart(actual.startDate, new Date(exp.start))).toBeLessThanOrEqual(2);
      expect(daysApart(actual.endDate, new Date(exp.end))).toBeLessThanOrEqual(2);
    });
  });
});
