import { normalizeDegrees } from "./astronomy/angles";
import { toJulianDay } from "./astronomy/julian-date";
import { lahiriAyanamsa } from "./ayanamsa/lahiri";
import { meanLunarNodeLongitude } from "./ephemeris/lunar-node";
import { MeeusEphemerisProvider } from "./ephemeris/provider";
import type { ChartResult, Grahas } from "./types";

/** Sidereal (Lahiri) longitude, in degrees, of each classical graha. */
export type GrahaLongitudes = Grahas<number>;

const ephemeris = new MeeusEphemerisProvider();
const BODIES = ["sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn"] as const;

/**
 * Where the nine grahas stand in the sidereal zodiac at an instant — the
 * lightweight counterpart to computeChart for visuals that only need
 * positions (no houses, dasha or panchang).
 */
export function grahaLongitudesAt(at: Date): GrahaLongitudes {
  const jd = toJulianDay(at);
  const ayanamsa = lahiriAyanamsa(jd);
  const sidereal = (tropical: number) => normalizeDegrees(tropical - ayanamsa);

  const result = {} as GrahaLongitudes;
  for (const body of BODIES) result[body] = sidereal(ephemeris.getPosition(body, jd).longitudeDegrees);
  result.rahu = sidereal(meanLunarNodeLongitude(jd));
  result.ketu = normalizeDegrees(result.rahu + 180);
  return result;
}

/** The same shape, read off a computed birth chart. */
export function grahaLongitudesFromChart(chart: ChartResult): GrahaLongitudes {
  return {
    sun: chart.sun.siderealLongitude,
    moon: chart.moon.siderealLongitude,
    mars: chart.mars.siderealLongitude,
    mercury: chart.mercury.siderealLongitude,
    jupiter: chart.jupiter.siderealLongitude,
    venus: chart.venus.siderealLongitude,
    saturn: chart.saturn.siderealLongitude,
    rahu: chart.rahu.siderealLongitude,
    ketu: chart.ketu.siderealLongitude,
  };
}
