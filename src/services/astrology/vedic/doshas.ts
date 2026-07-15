import { normalizeDegrees } from "../astronomy/angles";
import type { ClassicalGraha } from "./dignity";

/** Whole-sign house (1-12) `targetSignIndex` falls in, counted from `referenceSignIndex` as house 1 — the same convention `houseForLongitude` uses for whole-sign cusps, but for sign-to-sign counting (e.g. "Mars's house from the Moon") rather than longitude-to-cusp lookup. */
function wholeSignHouseFrom(referenceSignIndex: number, targetSignIndex: number): number {
  return ((targetSignIndex - referenceSignIndex + 12) % 12) + 1;
}

const MANGLIK_HOUSES = new Set([1, 2, 4, 7, 8, 12]);

export type ManglikScope = "lagna" | "moon";

export interface ManglikResult {
  isManglik: boolean;
  /** Which reference frame(s) triggered it. "lagna" only appears when an ascendant sign is given (needs an exact birth time); "moon" never needs one. */
  presentIn: ManglikScope[];
  marsHouseFromMoon: number;
  marsHouseFromLagna?: number;
  system: "Parashari";
}

/**
 * Manglik (Kuja) Dosha: Mars in the 1st, 2nd, 4th, 7th, 8th, or 12th
 * house counted from the Lagna, or from the Moon — the standard
 * dual-frame check (some traditions add a third check from Venus; not
 * included here since it's less universally agreed).
 */
export function checkManglikDosha(
  marsSignIndex: number,
  moonSignIndex: number,
  ascendantSignIndex?: number,
): ManglikResult {
  const marsHouseFromMoon = wholeSignHouseFrom(moonSignIndex, marsSignIndex);
  const presentIn: ManglikScope[] = [];
  if (MANGLIK_HOUSES.has(marsHouseFromMoon)) presentIn.push("moon");

  let marsHouseFromLagna: number | undefined;
  if (ascendantSignIndex !== undefined) {
    marsHouseFromLagna = wholeSignHouseFrom(ascendantSignIndex, marsSignIndex);
    if (MANGLIK_HOUSES.has(marsHouseFromLagna)) presentIn.push("lagna");
  }

  return { isManglik: presentIn.length > 0, presentIn, marsHouseFromMoon, marsHouseFromLagna, system: "Parashari" };
}

export type KalsarpaArc = "rahu-to-ketu" | "ketu-to-rahu";

/**
 * The 12 traditionally-cited Kalsarpa Yoga names, by which house Rahu
 * occupies from the Lagna. Commonly cited across Vedic software, but
 * naming is cosmetic — it never changes whether the Dosha itself is
 * present, only what it's called.
 */
const KALSARPA_TYPE_BY_RAHU_HOUSE: Record<number, string> = {
  1: "Anant",
  2: "Kulik",
  3: "Vasuki",
  4: "Shankhpal",
  5: "Padma",
  6: "Mahapadma",
  7: "Takshak",
  8: "Karkotak",
  9: "Shankhachuda",
  10: "Ghatak",
  11: "Vishdhar",
  12: "Sheshnag",
};

export interface KalsarpaResult {
  isKalsarpa: boolean;
  /** Which of the two 180-degree arcs (split by the Rahu-Ketu axis) every classical graha fell within. */
  arc?: KalsarpaArc;
  /** Only populated when Kalsarpa is present and a Lagna-relative Rahu house is supplied. */
  typeName?: string;
  system: "Parashari";
}

function isWithinForwardArc(longitude: number, arcStartLongitude: number): boolean {
  return normalizeDegrees(longitude - arcStartLongitude) <= 180;
}

/**
 * Kalsarpa Dosh: every one of the 7 classical grahas falls within one of
 * the two 180-degree arcs the Rahu-Ketu axis splits the zodiac into —
 * i.e. no graha "escapes" to the far side of the node axis.
 */
export function checkKalsarpaDosha(
  grahaLongitudes: Record<ClassicalGraha, number>,
  rahuLongitude: number,
  ketuLongitude: number,
  rahuHouseFromLagna?: number,
): KalsarpaResult {
  const longitudes = Object.values(grahaLongitudes);
  const allInRahuArc = longitudes.every((lon) => isWithinForwardArc(lon, rahuLongitude));
  const allInKetuArc = longitudes.every((lon) => isWithinForwardArc(lon, ketuLongitude));

  const arc: KalsarpaArc | undefined = allInRahuArc ? "rahu-to-ketu" : allInKetuArc ? "ketu-to-rahu" : undefined;

  if (!arc) return { isKalsarpa: false, system: "Parashari" };

  const typeName = rahuHouseFromLagna !== undefined ? KALSARPA_TYPE_BY_RAHU_HOUSE[rahuHouseFromLagna] : undefined;
  return { isKalsarpa: true, arc, typeName, system: "Parashari" };
}
