import { normalizeDegrees, signFromLongitude } from "../astronomy/angles";
import { namedSignFromLongitude, type ZodiacPlacement } from "../constants";

const PADAS_PER_SIGN = 9;
const PADA_SPAN = 30 / PADAS_PER_SIGN; // 3°20'

/**
 * Which sign a rashi's Navamsa cycle starts from, counting the rashi
 * itself as position 1 — the classical rule: movable (chara) signs
 * start their 9-part cycle in themselves, fixed (sthira) signs start
 * from the 9th sign from themselves, dual (dwiswabhava) signs from the
 * 5th. `signIndex % 3` already encodes this: 0 = movable, 1 = fixed,
 * 2 = dual, since the zodiac alternates in exactly that pattern
 * starting from Aries.
 */
function navamsaStartOffset(signIndex: number): number {
  const category = signIndex % 3;
  if (category === 0) return 0; // movable — starts in itself
  if (category === 1) return 8; // fixed — 9th from itself (itself = 1st)
  return 4; // dual — 5th from itself
}

/**
 * The Navamsa (D9) sign a sidereal longitude falls into — each 30° rashi
 * is divided into 9 padas of 3°20', and which sign each pada maps to
 * depends on the parent rashi's movable/fixed/dual category (see
 * `navamsaStartOffset`), cycling forward one sign per pada from there.
 */
export function navamsaFromSiderealLongitude(siderealLongitude: number): ZodiacPlacement {
  const { signIndex, degreesInSign } = signFromLongitude(siderealLongitude);
  const padaIndex = Math.floor(degreesInSign / PADA_SPAN);

  const navamsaSignIndex = (signIndex + navamsaStartOffset(signIndex) + padaIndex) % 12;

  // The Navamsa chart only records which sign a body falls in, not a
  // finer sub-degree — reuse the sign-name lookup with 0° so the shape
  // matches ZodiacPlacement without implying false precision.
  return namedSignFromLongitude(normalizeDegrees(navamsaSignIndex * 30));
}
