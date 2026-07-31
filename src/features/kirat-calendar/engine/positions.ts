import * as Astronomy from "astronomy-engine";

import { lahiriAyanamshaDeg } from "./ayanamsha";
import { normalize360 } from "./tables";

// astronomy-engine numbers dates in UT days since J2000.0 (JD 2451545.0) —
// same convention as src/services/astrology/ephemeris/engine-bodies.ts.
const J2000_JULIAN_DAY = 2451545.0;

export interface Positions {
	jd: number;
	/** Apparent geocentric (tropical, true equinox of date) ecliptic longitudes. */
	sunApparentLon: number;
	moonApparentLon: number;
	ayanamshaDeg: number;
	sunSiderealLon: number;
	moonSiderealLon: number;
}

/**
 * Sun & Moon apparent + sidereal (Lahiri) longitudes at a Julian Day.
 * The reference app evaluates its own VSOP87/ELP2000 series here; this port
 * delegates to astronomy-engine (already a dependency, arc-second accurate
 * from the same underlying theories), keeping the ~1 MB series tables out
 * of the bundle. Agreement with the reference is within arc-seconds, i.e.
 * well under a minute on any ending time.
 */
export function computePositions(jd: number): Positions {
	const ut = jd - J2000_JULIAN_DAY;

	// GeoVector + Ecliptic → apparent geocentric ecliptic-of-date longitude
	// (aberration + nutation applied), matching sunApparentGeocentric /
	// computeMoon in the reference app.
	const sunEcliptic = Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body.Sun, ut, true));
	const moonEcliptic = Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body.Moon, ut, true));

	const sunApparentLon = normalize360(sunEcliptic.elon);
	const moonApparentLon = normalize360(moonEcliptic.elon);

	const ayanamshaDeg = lahiriAyanamshaDeg(jd);

	return {
		jd,
		sunApparentLon,
		moonApparentLon,
		ayanamshaDeg,
		sunSiderealLon: normalize360(sunApparentLon - ayanamshaDeg),
		moonSiderealLon: normalize360(moonApparentLon - ayanamshaDeg),
	};
}
