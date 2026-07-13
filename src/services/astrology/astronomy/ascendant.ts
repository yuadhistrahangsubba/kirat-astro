import { normalizeDegrees, toDegrees, toRadians } from "./angles";

/**
 * Ecliptic longitude of the Ascendant (the zodiac degree rising on the
 * eastern horizon at the given moment and place).
 *
 * Formula (standard in astrological-astronomy references, e.g. Duffett-Smith,
 * "Practical Astronomy with your Calculator"):
 *
 *   tan(Asc) = cos(RAMC) / -(sin(RAMC)*cos(ε) + tan(φ)*sin(ε))
 *
 * where RAMC is the local sidereal time (= RA of the meridian), φ is
 * geographic latitude, and ε is the obliquity of the ecliptic.
 *
 * Sign convention verified independently at the degenerate case φ=0,
 * ε=0: with no axial tilt, the rising point on the celestial equator has
 * hour angle H = -90° (6h before meridian transit), i.e. RA = RAMC +
 * 90°, so Asc = RAMC + 90°. This module's formula reduces to exactly
 * that at φ=ε=0 (see ascendant.test.ts) — that's what pins down the
 * sign that distinguishes the Ascendant from the Descendant (they
 * differ by exactly 180°, and a full numerator+denominator sign flip
 * silently swaps one for the other since atan2(-y,-x) = atan2(y,x)±180).
 */
export function calculateAscendant(
  localSiderealTimeDegrees: number,
  latitudeDegrees: number,
  obliquityDegrees: number,
): number {
  const ramc = toRadians(localSiderealTimeDegrees);
  const phi = toRadians(latitudeDegrees);
  const epsilon = toRadians(obliquityDegrees);

  const numerator = Math.cos(ramc);
  const denominator = -(Math.sin(ramc) * Math.cos(epsilon) + Math.tan(phi) * Math.sin(epsilon));

  return normalizeDegrees(toDegrees(Math.atan2(numerator, denominator)));
}
