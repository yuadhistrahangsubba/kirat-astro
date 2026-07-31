import * as Astronomy from "astronomy-engine";

import { normalize360 } from "./tables";

const J2000_JULIAN_DAY = 2451545.0;

/** Same ten bodies and order as the reference app's Planets/Ephemeris tabs. */
const BODY_ORDER: { key: string; label: string; body: Astronomy.Body }[] = [
	{ key: "sun", label: "Sun", body: Astronomy.Body.Sun },
	{ key: "moon", label: "Moon", body: Astronomy.Body.Moon },
	{ key: "mercury", label: "Mercury", body: Astronomy.Body.Mercury },
	{ key: "venus", label: "Venus", body: Astronomy.Body.Venus },
	{ key: "mars", label: "Mars", body: Astronomy.Body.Mars },
	{ key: "jupiter", label: "Jupiter", body: Astronomy.Body.Jupiter },
	{ key: "saturn", label: "Saturn", body: Astronomy.Body.Saturn },
	{ key: "uranus", label: "Uranus", body: Astronomy.Body.Uranus },
	{ key: "neptune", label: "Neptune", body: Astronomy.Body.Neptune },
	{ key: "pluto", label: "Pluto", body: Astronomy.Body.Pluto },
];

export interface BodyPosition {
	key: string;
	label: string;
	/** Apparent geocentric tropical longitude minus the given ayanamsha. */
	siderealLon: number;
	eclipticLat: number;
	raDeg: number;
	decDeg: number;
	distanceAu: number;
}

/**
 * Apparent geocentric positions of all ten bodies at a Julian Day, with the
 * given ayanamsha applied — the reference app evaluates VSOP87 series here;
 * this delegates to astronomy-engine (same underlying theories).
 */
export function computeBodyPositions(jd: number, ayanamshaDeg: number): BodyPosition[] {
	const ut = jd - J2000_JULIAN_DAY;
	return BODY_ORDER.map(({ key, label, body }) => {
		const vector = Astronomy.GeoVector(body, ut, true);
		const ecliptic = Astronomy.Ecliptic(vector);
		const equatorial = Astronomy.EquatorFromVector(vector);
		return {
			key,
			label,
			siderealLon: normalize360(ecliptic.elon - ayanamshaDeg),
			eclipticLat: ecliptic.elat,
			raDeg: equatorial.ra * 15, // sidereal hours → degrees
			decDeg: equatorial.dec,
			distanceAu: vector.Length(),
		};
	});
}
