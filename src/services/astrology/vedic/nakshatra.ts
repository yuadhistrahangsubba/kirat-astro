import { normalizeDegrees } from "../astronomy/angles";

export const NAKSHATRAS = [
  "Ashwini",
  "Bharani",
  "Krittika",
  "Rohini",
  "Mrigashira",
  "Ardra",
  "Punarvasu",
  "Pushya",
  "Ashlesha",
  "Magha",
  "Purva Phalguni",
  "Uttara Phalguni",
  "Hasta",
  "Chitra",
  "Swati",
  "Vishakha",
  "Anuradha",
  "Jyeshtha",
  "Mula",
  "Purva Ashadha",
  "Uttara Ashadha",
  "Shravana",
  "Dhanishta",
  "Shatabhisha",
  "Purva Bhadrapada",
  "Uttara Bhadrapada",
  "Revati",
] as const;

export const NAKSHATRA_SPAN = 360 / 27; // 13°20'
export const PADA_SPAN = NAKSHATRA_SPAN / 4; // 3°20'

export interface NakshatraPlacement {
  index: number; // 0-26
  name: string;
  /** 1-4, the quarter of the nakshatra — used for finer compatibility/timing rules. */
  pada: number;
  degreesInNakshatra: number;
}

/** Which of the 27 nakshatras a sidereal longitude (almost always the Moon's) falls in. */
export function nakshatraFromSiderealLongitude(siderealLongitude: number): NakshatraPlacement {
  const normalized = normalizeDegrees(siderealLongitude);
  const index = Math.floor(normalized / NAKSHATRA_SPAN);
  const degreesInNakshatra = normalized - index * NAKSHATRA_SPAN;
  const pada = Math.floor(degreesInNakshatra / PADA_SPAN) + 1;

  return {
    index,
    name: NAKSHATRAS[index] as string,
    pada,
    degreesInNakshatra,
  };
}
