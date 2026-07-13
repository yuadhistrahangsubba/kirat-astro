import { DASHA_SEQUENCE, type DashaPlanet } from "./dasha";
import type { NakshatraPlacement } from "./nakshatra";
import type { RashiPlacement } from "./rashi";

/** Ruling planet of each of the 12 rashis, index-aligned with ZODIAC_SIGNS/RashiPlacement.signIndex. */
export const RASHI_LORDS: readonly DashaPlanet[] = [
  "Mars", // Aries
  "Venus", // Taurus
  "Mercury", // Gemini
  "Moon", // Cancer
  "Sun", // Leo
  "Mercury", // Virgo
  "Venus", // Libra
  "Mars", // Scorpio
  "Jupiter", // Sagittarius
  "Saturn", // Capricorn
  "Saturn", // Aquarius
  "Jupiter", // Pisces
];

/**
 * Which of the 9 Vimshottari lords rules a given nakshatra — the same
 * `index % 9` cycle `calculateVimshottariDasha` already uses internally
 * for the Moon's nakshatra, exposed here as a named, reusable lookup so
 * the Traditional-table "Star Lord" field (for Sun, Moon, or Ascendant)
 * doesn't need its own copy of the rule.
 */
export function nakshatraLord(nakshatraIndex: number): DashaPlanet {
  return DASHA_SEQUENCE[nakshatraIndex % 9] as DashaPlanet;
}

export function rasiLord(rashi: RashiPlacement): DashaPlanet {
  return RASHI_LORDS[rashi.signIndex] as DashaPlanet;
}

export function starLord(nakshatra: NakshatraPlacement): DashaPlanet {
  return nakshatraLord(nakshatra.index);
}

/** Alias — the Ascendant's rashi lord is called out by name in most Panchang software. */
export const ascLord = rasiLord;
