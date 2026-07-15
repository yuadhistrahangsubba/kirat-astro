import * as Astronomy from "astronomy-engine";

import { normalizeDegrees } from "../astronomy/angles";
import type { CelestialBody, EclipticPosition } from "./types";

// astronomy-engine numbers dates in UT days since the J2000.0 epoch —
// the same epoch (JD 2451545.0) every other formula in this package is
// already anchored to, so this is a pure offset, not a new time system.
const J2000_JULIAN_DAY = 2451545.0;

const BODY_MAP: Partial<Record<CelestialBody, Astronomy.Body>> = {
  moon: Astronomy.Body.Moon,
  mercury: Astronomy.Body.Mercury,
  venus: Astronomy.Body.Venus,
  mars: Astronomy.Body.Mars,
  jupiter: Astronomy.Body.Jupiter,
  saturn: Astronomy.Body.Saturn,
  uranus: Astronomy.Body.Uranus,
  neptune: Astronomy.Body.Neptune,
  pluto: Astronomy.Body.Pluto,
};

/**
 * Apparent geocentric ecliptic longitude/latitude for any body astronomy-engine
 * supports beyond the Sun (which keeps its own hand-written Meeus series —
 * see provider.ts for why that one seam still exists). `GeoVector` gives the
 * geocentric J2000-equatorial position; `Ecliptic` converts that to
 * true-ecliptic-of-date angles, matching the "tropical longitude of date"
 * convention every other EclipticPosition in this package already uses.
 *
 * The Moon is included here (not hand-derived) because astronomy-engine's
 * ELP2000-82b-derived series is arc-second accurate, versus the ~1-degree
 * worst case of a hand-written 6-term series — and Moon position is the
 * single most load-bearing number in a Vedic chart: it drives Rashi,
 * Nakshatra, Panchang, and every Vimshottari Dasha start date.
 */
export function engineBodyPosition(body: CelestialBody, julianDay: number): EclipticPosition {
  const engineBody = BODY_MAP[body];
  if (!engineBody) {
    throw new RangeError(`engineBodyPosition() does not handle "${body}"`);
  }

  const ut = julianDay - J2000_JULIAN_DAY;
  const vector = Astronomy.GeoVector(engineBody, ut, true);
  const ecliptic = Astronomy.Ecliptic(vector);

  return {
    longitudeDegrees: normalizeDegrees(ecliptic.elon),
    latitudeDegrees: ecliptic.elat,
  };
}
