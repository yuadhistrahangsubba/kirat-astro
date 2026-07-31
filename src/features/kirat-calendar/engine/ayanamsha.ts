import { normalize360 } from "./tables";

/**
 * Lahiri (Chitrapaksha) ayanamsha, ported from the reference Kirat Calendar
 * app: general-precession polynomial anchored to the value 23°15′0.658″ at
 * 1956-03-21 00:00. This intentionally differs from the linear model in
 * src/services/astrology/ayanamsa/lahiri.ts — the calendar must reproduce
 * the reference app's boundary times, so it uses the reference formula.
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

const JD_LAHIRI_REF = julianDayUt(1956, 3, 21);
const LAHIRI_VALUE_AT_REF = 23 + 15 / 60 + 0.658 / 3600;

export function lahiriAyanamshaDeg(jd: number): number {
	const td = (jd - 2451545.0) / 36525.0;
	const tr = (JD_LAHIRI_REF - 2451545.0) / 36525.0;
	const deltaDeg = (precessionArcsec(td) - precessionArcsec(tr)) / 3600.0;
	return normalize360(LAHIRI_VALUE_AT_REF + deltaDeg);
}
