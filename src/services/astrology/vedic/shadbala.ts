import { angularSeparation } from "../transits";
import { CLASSICAL_GRAHAS, type ClassicalGraha, debilitationOf } from "./dignity";

/**
 * A deliberately partial Shadbala ("six-fold strength"). Classical
 * Shadbala sums six components — Sthana Bala (of which Uccha/exaltation
 * strength is one sub-part), Dig Bala, Kala Bala, Chesta Bala,
 * Naisargika Bala, and Drik Bala. This module implements three of them:
 *
 *   - Uccha Bala (exaltation strength) — well-defined from longitude alone.
 *   - Dig Bala (directional strength) — approximated from whole-sign house
 *     placement rather than exact cusp degrees (see `digBala` below).
 *   - Naisargika Bala (fixed natural strength) — a static classical table.
 *
 * Deliberately NOT implemented: Kala Bala (needs Panchang-based time-lord
 * math — Paksha/Tribhaga/Abda/Masa/Vara/Hora/Ayana Bala), Chesta Bala
 * (needs a planet's instantaneous speed/retrograde state, which this
 * ephemeris layer doesn't expose), and the rest of Sthana Bala beyond
 * Uccha (Saptavargaja, Ojayugma, Kendra, Drekkana Bala). Each of those
 * needs real additional machinery this codebase doesn't have yet — this
 * is a genuine subset, not a full Shadbala with a misleading name, which
 * is why every result is tagged `scope: "basic"`.
 */
export type BasicShadbalaScope = "basic";

export interface BasicShadbalaResult {
  uchchaBala: number;
  digBala: number;
  naisargikaBala: number;
  totalShashtiamsa: number;
  totalRupas: number;
  system: "Parashari";
  scope: BasicShadbalaScope;
}

/** Classical Naisargika (natural) Bala — a fixed strength ranking independent of any chart, in Shashtiamsas (max 60). */
export const NAISARGIKA_BALA: Record<ClassicalGraha, number> = {
  Sun: 60,
  Moon: 51.43,
  Venus: 42.86,
  Jupiter: 34.29,
  Mercury: 25.71,
  Mars: 17.14,
  Saturn: 8.57,
};

/** The whole-sign house each planet is classically strongest in (Dig Bala max); the opposite house is where it's weakest (Dig Bala 0). */
const STRONG_HOUSE: Record<ClassicalGraha, number> = {
  Sun: 10,
  Mars: 10,
  Moon: 4,
  Venus: 4,
  Jupiter: 1,
  Mercury: 1,
  Saturn: 7,
};

function circularHouseDistance(a: number, b: number): number {
  const diff = Math.abs(a - b);
  return diff > 6 ? 12 - diff : diff;
}

/**
 * Uccha Bala: strength from exaltation, scaled 0 (exactly at the
 * debilitation point) to 60 (exactly at the exaltation point) — the
 * classical formula is the angular separation from the debilitation
 * point, in degrees, divided by 3.
 */
function uchchaBala(planet: ClassicalGraha, siderealLongitude: number): number {
  const debilitation = debilitationOf(planet);
  const debilitationLongitude = debilitation.signIndex * 30 + debilitation.degree;
  return angularSeparation(siderealLongitude, debilitationLongitude) / 3;
}

/**
 * Dig Bala: directional strength, approximated from whole-sign house
 * placement rather than the classical exact-cusp-degree formula (which
 * needs the true house cusp, not just which house a planet falls in).
 * Scaled 60 at the planet's strong house down to 0 at the exactly
 * opposite (weak) house, 10 shashtiamsa per house-step between them —
 * a defensible simplification given this package already treats whole
 * sign houses as 30-degree blocks everywhere else (see astronomy/houses.ts).
 */
function digBala(planet: ClassicalGraha, house: number): number {
  const distanceFromStrong = circularHouseDistance(house, STRONG_HOUSE[planet]);
  return 60 - distanceFromStrong * 10;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/** Basic (3-of-6) Shadbala for one graha. `house` is optional — omit it (e.g. when birth time isn't exact) and Dig Bala is simply 0 rather than guessed. */
export function calculateBasicShadbala(
  planet: ClassicalGraha,
  siderealLongitude: number,
  house?: number,
): BasicShadbalaResult {
  const uchcha = uchchaBala(planet, siderealLongitude);
  const dig = house !== undefined ? digBala(planet, house) : 0;
  const naisargika = NAISARGIKA_BALA[planet];
  const total = uchcha + dig + naisargika;

  return {
    uchchaBala: round2(uchcha),
    digBala: round2(dig),
    naisargikaBala: naisargika,
    totalShashtiamsa: round2(total),
    totalRupas: round2(total / 60),
    system: "Parashari",
    scope: "basic",
  };
}

/** Every classical graha ranked strongest-first by total basic Shadbala. */
export function rankByShadbala(results: Record<ClassicalGraha, BasicShadbalaResult>): ClassicalGraha[] {
  return [...CLASSICAL_GRAHAS].sort((a, b) => results[b].totalShashtiamsa - results[a].totalShashtiamsa);
}
