import { calculateAscendant } from "./astronomy/ascendant";
import { normalizeDegrees } from "./astronomy/angles";
import { calendarDateDiff } from "./astronomy/date-diff";
import { calculateHouseCusps } from "./astronomy/houses";
import { julianCenturiesSinceJ2000, toJulianDay } from "./astronomy/julian-date";
import { meanObliquityOfEcliptic } from "./astronomy/obliquity";
import { localSiderealTime } from "./astronomy/sidereal-time";
import { calculateSunriseSunset } from "./astronomy/sunrise-sunset";
import { localToUtc } from "./astronomy/timezone";
import { lahiriAyanamsa } from "./ayanamsa/lahiri";
import { meanLunarNodeLongitude, meanLunarSouthNodeLongitude } from "./ephemeris/lunar-node";
import { MeeusEphemerisProvider } from "./ephemeris/provider";
import type { CelestialBody } from "./ephemeris/types";
import { calculateMoonPhase } from "./moon-phase";
import { navamsaFromSiderealLongitude } from "./vedic/navamsa";
import { placeBody } from "./placements";
import type { BirthInput, ChartResult, Grahas } from "./types";
import {
  calculateAntardasha,
  calculateMahadashaTheoreticalSpans,
  calculateVimshottariDasha,
} from "./vedic/dasha";
import { calculatePanchang } from "./vedic/panchang";
import { rashiFromSiderealLongitude } from "./vedic/rashi";
import { nakshatraFromSiderealLongitude } from "./vedic/nakshatra";
import { tropicalZodiacSign } from "./western/zodiac-sign";

export { PlanetNotSupportedError, CalculationNotImplementedError } from "./errors";
export { ascLord, nakshatraLord, rasiLord, starLord } from "./vedic/lords";
export type * from "./types";

const AYANAMSA_NAME = "Lahiri (Chitrapaksha)";

const GRAHA_BODIES: readonly CelestialBody[] = ["mars", "mercury", "jupiter", "venus", "saturn"];
const OUTER_ONLY_BODIES: readonly CelestialBody[] = ["uranus", "neptune", "pluto"];

const ephemeris = new MeeusEphemerisProvider();

/**
 * Computes the full birth chart this engine supports: all 9 classical
 * grahas (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, and the
 * lunar nodes Rahu/Ketu) plus Uranus/Neptune/Pluto for completeness,
 * Panchang, Navamsa, Vimshottari Mahadasha+Antardasha, Moon phase, and
 * — only when an exact birth time is known — the Ascendant, houses, and
 * a whole-sign house number on every placement.
 */
export function computeChart(input: BirthInput): ChartResult {
  const timeConfidence: "exact" | "date-only" = input.birthTime ? "exact" : "date-only";
  const birthUtc = localToUtc(input.birthDate, input.birthTime ?? "12:00", input.timezone);

  const julianDayUtc = toJulianDay(birthUtc);
  const ayanamsaDegrees = lahiriAyanamsa(julianDayUtc);

  let vedicCusps: readonly number[] | undefined;
  let siderealTimeDegrees: number | undefined;
  let tropicalAscendant: number | undefined;
  let siderealAscendant: number | undefined;
  let houses: ChartResult["houses"];

  if (timeConfidence === "exact") {
    const t = julianCenturiesSinceJ2000(julianDayUtc);
    const obliquity = meanObliquityOfEcliptic(t);
    const lst = localSiderealTime(julianDayUtc, input.longitude);
    siderealTimeDegrees = lst;
    tropicalAscendant = calculateAscendant(lst, input.latitude, obliquity);
    siderealAscendant = normalizeDegrees(tropicalAscendant - ayanamsaDegrees);

    houses = {
      western: calculateHouseCusps(tropicalAscendant, "equal"),
      vedic: calculateHouseCusps(siderealAscendant, "whole-sign"),
    };
    vedicCusps = houses.vedic.cusps;
  }

  const place = (tropicalLongitude: number) => placeBody(tropicalLongitude, ayanamsaDegrees, vedicCusps);

  const sun = place(ephemeris.getPosition("sun", julianDayUtc).longitudeDegrees);
  const moon = place(ephemeris.getPosition("moon", julianDayUtc).longitudeDegrees);

  const [mars, mercury, jupiter, venus, saturn] = GRAHA_BODIES.map((body) =>
    place(ephemeris.getPosition(body, julianDayUtc).longitudeDegrees),
  ) as [ReturnType<typeof place>, ReturnType<typeof place>, ReturnType<typeof place>, ReturnType<typeof place>, ReturnType<typeof place>];

  const [uranus, neptune, pluto] = OUTER_ONLY_BODIES.map((body) =>
    place(ephemeris.getPosition(body, julianDayUtc).longitudeDegrees),
  ) as [ReturnType<typeof place>, ReturnType<typeof place>, ReturnType<typeof place>];

  const rahu = place(meanLunarNodeLongitude(julianDayUtc));
  const ketu = place(meanLunarSouthNodeLongitude(julianDayUtc));

  const grahas: Grahas<(typeof sun)> = { sun, moon, mars, mercury, jupiter, venus, saturn, rahu, ketu };

  const navamsa: ChartResult["navamsa"] = {
    sun: navamsaFromSiderealLongitude(sun.siderealLongitude),
    moon: navamsaFromSiderealLongitude(moon.siderealLongitude),
    mars: navamsaFromSiderealLongitude(mars.siderealLongitude),
    mercury: navamsaFromSiderealLongitude(mercury.siderealLongitude),
    jupiter: navamsaFromSiderealLongitude(jupiter.siderealLongitude),
    venus: navamsaFromSiderealLongitude(venus.siderealLongitude),
    saturn: navamsaFromSiderealLongitude(saturn.siderealLongitude),
    rahu: navamsaFromSiderealLongitude(rahu.siderealLongitude),
    ketu: navamsaFromSiderealLongitude(ketu.siderealLongitude),
    uranus: navamsaFromSiderealLongitude(uranus.siderealLongitude),
    neptune: navamsaFromSiderealLongitude(neptune.siderealLongitude),
    pluto: navamsaFromSiderealLongitude(pluto.siderealLongitude),
    ascendant: siderealAscendant !== undefined ? navamsaFromSiderealLongitude(siderealAscendant) : undefined,
  };

  const panchang = calculatePanchang({
    sunSiderealLongitude: sun.siderealLongitude,
    moonSiderealLongitude: moon.siderealLongitude,
    localDateISO: input.birthDate,
  });

  const displayMahadashas = calculateVimshottariDasha(moon.siderealLongitude, birthUtc);
  const theoreticalMahadashas = calculateMahadashaTheoreticalSpans(moon.siderealLongitude, birthUtc);
  const vimshottariDasha = displayMahadashas.map((period, i) => ({
    ...period,
    antardasha: calculateAntardasha(theoreticalMahadashas[i]!),
  }));
  const dashaBalanceAtBirth = calendarDateDiff(birthUtc, displayMahadashas[0]!.endDate);

  const moonPhase = calculateMoonPhase(moon.tropicalLongitude, sun.tropicalLongitude);
  const { sunrise, sunset } = calculateSunriseSunset(input.birthDate, input.timezone, input.latitude, input.longitude);

  const result: ChartResult = {
    julianDayUtc,
    ayanamsaDegrees,
    ayanamsaName: AYANAMSA_NAME,
    siderealTimeDegrees,
    timeConfidence,
    ...grahas,
    uranus,
    neptune,
    pluto,
    houses,
    navamsa,
    panchang,
    vimshottariDasha,
    dashaBalanceAtBirth,
    moonPhase,
    sunrise,
    sunset,
  };

  if (tropicalAscendant !== undefined && siderealAscendant !== undefined) {
    result.ascendant = {
      tropicalLongitude: tropicalAscendant,
      siderealLongitude: siderealAscendant,
      rashi: rashiFromSiderealLongitude(siderealAscendant),
      nakshatra: nakshatraFromSiderealLongitude(siderealAscendant),
      westernSign: tropicalZodiacSign(tropicalAscendant),
    };
  }

  return result;
}
