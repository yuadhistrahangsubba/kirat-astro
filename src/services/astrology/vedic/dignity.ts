import type { DashaPlanet } from "./dasha";
import { RASHI_LORDS } from "./lords";

/** The 7 classical grahas dignity/Naisargika-Maitri rules apply to. Rahu/Ketu are excluded on purpose — their dignity and friendship assignments vary across traditions with no single agreed table, and this codebase doesn't guess on contested classical points (see errors.ts's CalculationNotImplementedError philosophy). */
export type ClassicalGraha = Exclude<DashaPlanet, "Rahu" | "Ketu">;

export const CLASSICAL_GRAHAS: readonly ClassicalGraha[] = [
  "Sun",
  "Moon",
  "Mars",
  "Mercury",
  "Jupiter",
  "Venus",
  "Saturn",
];

/** Sign indices a planet rules (0=Aries..11=Pisces, matching ZODIAC_SIGNS/RashiPlacement.signIndex). */
export const OWN_SIGNS: Record<ClassicalGraha, readonly number[]> = {
  Sun: [4], // Leo
  Moon: [3], // Cancer
  Mars: [0, 7], // Aries, Scorpio
  Mercury: [2, 5], // Gemini, Virgo
  Jupiter: [8, 11], // Sagittarius, Pisces
  Venus: [1, 6], // Taurus, Libra
  Saturn: [9, 10], // Capricorn, Aquarius
};

/**
 * Classical exact exaltation point per planet (sign + degree within it).
 * Debilitation is always the same degree in the exactly opposite sign —
 * `debilitationOf()` below derives it rather than duplicating the table.
 * Note Mercury's exaltation point (Virgo 15°) falls inside its own sign
 * — a real, commonly-noted classical coincidence ("Swakshetra Uccha"),
 * not a data error; `classifyDignity` reports it as "exalted" since
 * that's the stronger of the two simultaneously-true dignities.
 */
export const EXALTATION: Record<ClassicalGraha, { signIndex: number; degree: number }> = {
  Sun: { signIndex: 0, degree: 10 }, // Aries 10°
  Moon: { signIndex: 1, degree: 3 }, // Taurus 3°
  Mars: { signIndex: 9, degree: 28 }, // Capricorn 28°
  Mercury: { signIndex: 5, degree: 15 }, // Virgo 15°
  Jupiter: { signIndex: 3, degree: 5 }, // Cancer 5°
  Venus: { signIndex: 11, degree: 27 }, // Pisces 27°
  Saturn: { signIndex: 6, degree: 20 }, // Libra 20°
};

export function debilitationOf(planet: ClassicalGraha): { signIndex: number; degree: number } {
  const exaltation = EXALTATION[planet];
  return { signIndex: (exaltation.signIndex + 6) % 12, degree: exaltation.degree };
}

export type FriendshipGrade = "friend" | "enemy" | "neutral";

/**
 * Classical Naisargika (Permanent) Maitri — the fixed 7x7 planetary
 * friendship table every Parashari dignity/Ashtakavarga-adjacent
 * calculation is built on. Standard across BPHS-derived software; not
 * specific to any one reference report.
 */
export const PERMANENT_FRIENDSHIP: Record<ClassicalGraha, Record<ClassicalGraha, FriendshipGrade>> = {
  Sun: { Sun: "friend", Moon: "friend", Mars: "friend", Mercury: "neutral", Jupiter: "friend", Venus: "enemy", Saturn: "enemy" },
  Moon: { Sun: "friend", Moon: "friend", Mars: "neutral", Mercury: "friend", Jupiter: "neutral", Venus: "neutral", Saturn: "neutral" },
  Mars: { Sun: "friend", Moon: "friend", Mars: "friend", Mercury: "enemy", Jupiter: "friend", Venus: "neutral", Saturn: "neutral" },
  Mercury: { Sun: "friend", Moon: "enemy", Mars: "neutral", Mercury: "friend", Jupiter: "neutral", Venus: "friend", Saturn: "neutral" },
  Jupiter: { Sun: "friend", Moon: "friend", Mars: "friend", Mercury: "enemy", Jupiter: "friend", Venus: "enemy", Saturn: "neutral" },
  Venus: { Sun: "enemy", Moon: "enemy", Mars: "neutral", Mercury: "friend", Jupiter: "neutral", Venus: "friend", Saturn: "friend" },
  Saturn: { Sun: "enemy", Moon: "enemy", Mars: "enemy", Mercury: "friend", Jupiter: "neutral", Venus: "friend", Saturn: "friend" },
};

export type PlanetDignity = "exalted" | "debilitated" | "own" | "friendly" | "enemy" | "neutral";

/**
 * Short narrative phrase per dignity, designed to slot into "It's
 * {phrase} in {sign}" without a doubled "in" — see interpretation/domains.ts.
 */
export const DIGNITY_PHRASE: Record<PlanetDignity, string> = {
  exalted: "exalted",
  debilitated: "debilitated",
  own: "at home",
  friendly: "comfortably placed",
  enemy: "uncomfortably placed",
  neutral: "neutrally placed",
};

function isClassicalGraha(planet: DashaPlanet): planet is ClassicalGraha {
  return planet !== "Rahu" && planet !== "Ketu";
}

/**
 * A planet's sign-level dignity — exaltation/debilitation/own-sign checked
 * first (they override everything else), falling back to its Naisargika
 * friendship with the occupied sign's own lord. Returns "neutral" for
 * Rahu/Ketu (see ClassicalGraha's doc comment for why they're excluded
 * from real dignity classification) rather than guessing.
 */
export function classifyDignity(planet: DashaPlanet, signIndex: number): PlanetDignity {
  if (!isClassicalGraha(planet)) return "neutral";

  if (EXALTATION[planet].signIndex === signIndex) return "exalted";
  if (debilitationOf(planet).signIndex === signIndex) return "debilitated";
  if (OWN_SIGNS[planet].includes(signIndex)) return "own";

  const signLord = RASHI_LORDS[signIndex] as DashaPlanet;
  if (!isClassicalGraha(signLord)) return "neutral";

  const grade = PERMANENT_FRIENDSHIP[planet][signLord];
  if (grade === "friend") return "friendly";
  if (grade === "enemy") return "enemy";
  return "neutral";
}
