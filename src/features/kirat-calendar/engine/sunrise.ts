/**
 * NOAA solar-position sunrise/sunset solver, ported verbatim from the
 * reference Kirat Calendar app so that every sunrise-anchored Panchanga
 * time matches the reference output. The two-pass solveDay refines the
 * solar-noon estimate before computing the hour angle.
 */

export interface Place {
	name: string;
	country?: string;
	lat: number;
	lon: number;
	timezone: string;
}

/** The reference app's default place; also matches this repo's dashboard OBSERVER. */
export const DEFAULT_PLACE: Place = {
	name: "Thimphu",
	country: "Bhutan",
	lat: 27.472792,
	lon: 89.639286,
	timezone: "Asia/Thimphu",
};

const toRad = (d: number) => (d * Math.PI) / 180;
const toDeg = (r: number) => (r * 180) / Math.PI;

function norm360(x: number): number {
	let v = x % 360;
	if (v < 0) v += 360;
	return v;
}

function julianDayUT0(year: number, month: number, day: number): number {
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

const julianCentury = (jd: number) => (jd - 2451545.0) / 36525.0;
const geomMeanLongSun = (t: number) => norm360(280.46646 + t * (36000.76983 + 0.0003032 * t));
const geomMeanAnomalySun = (t: number) => 357.52911 + t * (35999.05029 - 0.0001537 * t);
const eccentricityEarthOrbit = (t: number) => 0.016708634 - t * (0.000042037 + 0.0000001267 * t);

function sunEqOfCenter(t: number): number {
	const m = toRad(geomMeanAnomalySun(t));
	return (
		Math.sin(m) * (1.914602 - t * (0.004817 + 0.000014 * t)) +
		Math.sin(2 * m) * (0.019993 - 0.000101 * t) +
		Math.sin(3 * m) * 0.000289
	);
}

function sunApparentLong(t: number): number {
	const trueLong = geomMeanLongSun(t) + sunEqOfCenter(t);
	const omega = 125.04 - 1934.136 * t;
	return trueLong - 0.00569 - 0.00478 * Math.sin(toRad(omega));
}

function meanObliquityEcliptic(t: number): number {
	const sec = 21.448 - t * (46.815 + t * (0.00059 - t * 0.001813));
	return 23 + (26 + sec / 60) / 60;
}

function obliquityCorrected(t: number): number {
	const omega = 125.04 - 1934.136 * t;
	return meanObliquityEcliptic(t) + 0.00256 * Math.cos(toRad(omega));
}

function sunDeclination(t: number): number {
	const e = toRad(obliquityCorrected(t));
	const lambda = toRad(sunApparentLong(t));
	return toDeg(Math.asin(Math.sin(e) * Math.sin(lambda)));
}

function equationOfTime(t: number): number {
	const eps = toRad(obliquityCorrected(t));
	const l0 = toRad(geomMeanLongSun(t));
	const e = eccentricityEarthOrbit(t);
	const m = toRad(geomMeanAnomalySun(t));
	let y = Math.tan(eps / 2);
	y *= y;
	const etime =
		y * Math.sin(2 * l0) -
		2 * e * Math.sin(m) +
		4 * e * y * Math.sin(m) * Math.cos(2 * l0) -
		0.5 * y * y * Math.sin(4 * l0) -
		1.25 * e * e * Math.sin(2 * m);
	return toDeg(etime) * 4; // minutes
}

function hourAngleSunrise(latDeg: number, decDeg: number): { arg: number; ha: number } {
	const lat = toRad(latDeg);
	const dec = toRad(decDeg);
	const arg = Math.cos(toRad(90.833)) / (Math.cos(lat) * Math.cos(dec)) - Math.tan(lat) * Math.tan(dec);
	return { arg, ha: Math.acos(Math.min(1, Math.max(-1, arg))) };
}

export interface SolvedDay {
	jd0: number;
	eqTime: number;
	noSunrise: boolean;
	noSunset: boolean;
	solarNoonFrac: number;
	sunriseFrac: number;
	sunsetFrac: number;
}

export function solveDay(
	year: number,
	month: number,
	day: number,
	lat: number,
	lon: number,
	tzHours: number,
): SolvedDay {
	const jd0 = julianDayUT0(year, month, day);

	function pass(jdForT: number) {
		const t = julianCentury(jdForT);
		const eqTime = equationOfTime(t);
		const dec = sunDeclination(t);
		const { arg, ha } = hourAngleSunrise(lat, dec);
		const haDeg = toDeg(ha);
		const solarNoonFrac = (720 - 4 * lon - eqTime + tzHours * 60) / 1440;
		return { eqTime, dec, arg, haDeg, solarNoonFrac };
	}

	const p1 = pass(jd0 + 0.5);
	const utNoonFrac = p1.solarNoonFrac - tzHours / 24;
	const p2 = pass(jd0 + utNoonFrac);

	return {
		jd0,
		eqTime: p2.eqTime,
		noSunrise: p2.arg > 1,
		noSunset: p2.arg < -1,
		solarNoonFrac: p2.solarNoonFrac,
		sunriseFrac: p2.solarNoonFrac - (p2.haDeg * 4) / 1440,
		sunsetFrac: p2.solarNoonFrac + (p2.haDeg * 4) / 1440,
	};
}

/** Numeric UTC offset (hours) of an IANA timezone at a given instant, via Intl. */
export function utcOffsetHours(timeZone: string, dateObj: Date): number {
	const utcDate = new Date(dateObj.toLocaleString("en-US", { timeZone: "UTC" }));
	const tzDate = new Date(dateObj.toLocaleString("en-US", { timeZone }));
	return (tzDate.getTime() - utcDate.getTime()) / 3600000;
}

export interface DayInfo {
	tz: number;
	day: SolvedDay;
	/** Julian Day (UT-based, per the reference app) of the sunrise instant, or null above the polar circle. */
	jdeSunrise: number | null;
	jdeSolarNoon: number;
}

export function getDayInfo(y: number, mo: number, d: number, place: Place): DayInfo {
	const refDate = new Date(Date.UTC(y, mo - 1, d, 12, 0, 0));
	const tz = utcOffsetHours(place.timezone, refDate);
	const day = solveDay(y, mo, d, place.lat, place.lon, tz);

	const jdeSunrise = day.noSunrise ? null : day.jd0 + day.sunriseFrac - tz / 24;
	const jdeSolarNoon = day.jd0 + day.solarNoonFrac - tz / 24;

	return { tz, day, jdeSunrise, jdeSolarNoon };
}

export function addOneDay(y: number, mo: number, d: number): { y: number; mo: number; d: number } {
	const dt = new Date(Date.UTC(y, mo - 1, d + 1));
	return { y: dt.getUTCFullYear(), mo: dt.getUTCMonth() + 1, d: dt.getUTCDate() };
}

/** Julian Day for an exact local date+time at `place` (not just sunrise). */
export function jdFromLocalDateTime(
	y: number,
	mo: number,
	d: number,
	hh: number,
	mm: number,
	ss: number,
	place: Place,
): number {
	const refDate = new Date(Date.UTC(y, mo - 1, d, 12, 0, 0));
	const tz = utcOffsetHours(place.timezone, refDate);
	const jd0 = julianDayUT0(y, mo, d);
	const fracOfDay = (hh + mm / 60 + ss / 3600) / 24;
	return jd0 + fracOfDay - tz / 24;
}

/** Julian Day at 00:00 Universal Time on a calendar date. */
export function jdAtUtMidnight(y: number, mo: number, d: number): number {
	return julianDayUT0(y, mo, d);
}

/**
 * The current real-world time expressed as "hours since baseYMD's midnight"
 * in the place's local civil time — the same 24+ domain slot start/end
 * hours use, so current-slot checks are direct comparisons.
 */
export function getNowInPlaceHours(baseYMD: { y: number; mo: number; d: number }, timezone: string): number {
	const nowUTC = new Date();
	const tzOffsetHours = utcOffsetHours(timezone, nowUTC);
	const nowPlace = new Date(nowUTC.getTime() + tzOffsetHours * 3600000);
	const dayDiff = Math.round(
		(Date.UTC(nowPlace.getUTCFullYear(), nowPlace.getUTCMonth(), nowPlace.getUTCDate()) -
			Date.UTC(baseYMD.y, baseYMD.mo - 1, baseYMD.d)) /
			86400000,
	);
	const hourOfDay = nowPlace.getUTCHours() + nowPlace.getUTCMinutes() / 60 + nowPlace.getUTCSeconds() / 3600;
	return dayDiff * 24 + hourOfDay;
}
