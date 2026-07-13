import { normalizeDegrees } from "../astronomy/angles";
import { julianCenturiesSinceJ2000 } from "../astronomy/julian-date";

/**
 * Mean lunar ascending node (Rahu) tropical longitude. Formula: Meeus,
 * "Astronomical Algorithms" (2nd ed.), ch. 47 — the secular polynomial
 * for the Moon's mean ascending node, the same "Mean Node" convention
 * Vedic software defaults to (as opposed to the "True Node", which
 * oscillates around the mean by a few degrees due to lunar perturbations
 * and needs the full lunar theory to compute).
 */
export function meanLunarNodeLongitude(julianDay: number): number {
  const t = julianCenturiesSinceJ2000(julianDay);
  const meanNode =
    125.0445479 - 1934.1362891 * t + 0.0020754 * t ** 2 + t ** 3 / 467441 - t ** 4 / 60616000;
  return normalizeDegrees(meanNode);
}

/** Ketu (the descending node) is always exactly opposite Rahu on the ecliptic. */
export function meanLunarSouthNodeLongitude(julianDay: number): number {
  return normalizeDegrees(meanLunarNodeLongitude(julianDay) + 180);
}
