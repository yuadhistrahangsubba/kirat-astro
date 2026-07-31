import { normalize360 } from "./tables";

/**
 * Ayanamsha (tropical → sidereal offset) systems, ported from the reference
 * Kirat Calendar app: a general-precession polynomial anchored to each
 * system's reference epoch/value. The Lahiri model here intentionally
 * differs from the linear one in src/services/astrology/ayanamsa/lahiri.ts —
 * the calendar must reproduce the reference app's boundary times.
 */
function precessionArcsec(tCenturies: number): number {
	return 5029.0966 * tCenturies + 1.11113 * tCenturies * tCenturies - 0.000006 * tCenturies ** 3;
}

function julianDayUt(year: number, month: number, day: number): number {
	let y = year;
	let m = month;
	if (m <= 2) {
		y -= 1;
		m += 12;
	}
	const a = Math.floor(y / 100);
	const b = 2 - a + Math.floor(a / 4);
	return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524.5;
}

function ayanamshaFromRef(jdDate: number, jdRef: number, valueAtRefDeg: number): number {
	const td = (jdDate - 2451545.0) / 36525.0;
	const tr = (jdRef - 2451545.0) / 36525.0;
	const deltaDeg = (precessionArcsec(td) - precessionArcsec(tr)) / 3600.0;
	return normalize360(valueAtRefDeg + deltaDeg);
}

const JD_FAGAN_BRADLEY_REF = julianDayUt(1950, 1, 1);
const JD_LAHIRI_REF = julianDayUt(1956, 3, 21);
const JD_RAMAN_REF = julianDayUt(389, 3, 21);
const JD_KRISHNAMURTI_REF = julianDayUt(1900, 1, 1);
const JD_YUKTESHWAR_REF = julianDayUt(499, 3, 21);

export function lahiriAyanamshaDeg(jd: number): number {
	return ayanamshaFromRef(jd, JD_LAHIRI_REF, 23 + 15 / 60 + 0.658 / 3600);
}

export type AyanamshaKey =
	| "tropical"
	| "lahiri"
	| "raman"
	| "kp"
	| "yukteshwar"
	| "faganbradley"
	| "truechitra"
	| "truepushya";

export interface AyanamshaSystem {
	key: AyanamshaKey;
	label: string;
	calc: (jd: number) => number;
}

export const AYANAMSHA_SYSTEMS: AyanamshaSystem[] = [
	{ key: "tropical", label: "Tropical (0° Ayanamsha)", calc: () => 0 },
	{ key: "lahiri", label: "Lahiri (standard, Chitrapaksha)", calc: lahiriAyanamshaDeg },
	{ key: "raman", label: "Raman (B.V. Raman)", calc: (jd) => ayanamshaFromRef(jd, JD_RAMAN_REF, 0) },
	{ key: "kp", label: "Krishnamurti (KP)", calc: (jd) => ayanamshaFromRef(jd, JD_KRISHNAMURTI_REF, 22.363889) },
	{
		key: "yukteshwar",
		label: "Shri Yukteshwar",
		calc: (jd) => normalize360(((jd - JD_YUKTESHWAR_REF) / 365.2425) * (54 / 3600)),
	},
	{
		key: "faganbradley",
		label: "Fagan / Bradley",
		calc: (jd) => ayanamshaFromRef(jd, JD_FAGAN_BRADLEY_REF, 24 + 2 / 60 + 31.36 / 3600),
	},
	// True Chitra Paksha keeps Spica at exactly 180° sidereal; reference value
	// derived from Spica's J2000 ecliptic longitude (203.8415° − 180°).
	{ key: "truechitra", label: "True Chitra Paksha (Spica)", calc: (jd) => ayanamshaFromRef(jd, 2451545.0, 23.841462) },
	// True Pushya Paksha keeps Delta Cancri at 106° sidereal (128.7220° − 106°).
	{
		key: "truepushya",
		label: "True Pushya Paksha (Delta Cancri)",
		calc: (jd) => ayanamshaFromRef(jd, 2451545.0, 22.721989),
	},
];

export function ayanamshaSystem(key: AyanamshaKey): AyanamshaSystem {
	return AYANAMSHA_SYSTEMS.find((s) => s.key === key) ?? (AYANAMSHA_SYSTEMS[1] as AyanamshaSystem);
}
