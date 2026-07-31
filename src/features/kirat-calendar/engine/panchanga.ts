import type { PanchangaDay } from "../types";
import { calcMoonPadas, computeMoonZonePeriod, computeTong, type MoonPada, type TongResult, type ZonePeriod } from "./periods";
import { computePositions, type Positions } from "./positions";
import { addOneDay, getDayInfo, type DayInfo, type Place } from "./sunrise";
import {
	chrangDirection,
	ENGLISH_DAY_NAMES,
	GULAKAI_KALA_PARTS,
	hangsamResidenceName,
	KIRAT_DAY_NAMES,
	KIRAT_TITLUM_NAMES,
	LABHRANG,
	LAMIKKHOK,
	MANGYUK,
	mapKarana,
	midhungResidenceName,
	normalize360,
	pick,
	RESIDENCE_RESULT,
	SAMYUK,
	SENLENDAT_CYCLE,
	SENLENDAT_RESULTS,
	singlabaDirection,
	YAMAGANDA_KALA_PARTS,
	YEM_PHAKMURA_PARTS,
	YENYEM_CYCLE,
	YENYEM_INFO,
	ZODIAC,
	ZODIAC_SYMBOLS,
} from "./tables";
import { getKiratMonthYearLabel, gregorianToKirat, type KiratDate } from "./yele";

const pad2 = (n: number) => String(n).padStart(2, "0");

/**
 * Generic ending-moment solver, ported from the reference app: given the
 * driving longitude at sunrise, the span of one unit (12° Tithi, 6° Karana,
 * 360/27° Nakshatra/Yoga, 30° Rashi) and the relevant daily motion, returns
 * the active unit's index and hours-from-sunrise until its boundary.
 */
function calcEndingMoment(currentDeg: number, spanDeg: number, motionPerDay: number) {
	const segments = Math.round(360 / spanDeg);
	const idx = Math.min(Math.floor(currentDeg / spanDeg), segments - 1);
	const endingLongitude = (idx + 1) * spanDeg;
	const remaining = endingLongitude - currentDeg;
	const endingMomentHours = motionPerDay > 0 ? (remaining / motionPerDay) * 24 : NaN;
	return { idx, endingLongitude, remaining, endingMomentHours };
}

function fwdDiff(next: number, current: number): number {
	let diff = next - current;
	if (diff < 0) diff += 360;
	return diff;
}

interface DayContext {
	info: DayInfo;
	jde: number;
	pos: Positions;
}

// Consecutive days share contexts (day N's "tomorrow" is day N+1's "today"),
// so a year render reuses ~2/3 of these — worth memoizing per place+date.
const contextCache = new Map<string, DayContext>();

function contextFor(y: number, mo: number, d: number, place: Place): DayContext {
	const key = `${place.lat},${place.lon},${place.timezone}|${y}-${mo}-${d}`;
	const cached = contextCache.get(key);
	if (cached) return cached;
	const info = getDayInfo(y, mo, d, place);
	const jde = info.jdeSunrise !== null ? info.jdeSunrise : info.jdeSolarNoon;
	const ctx = { info, jde, pos: computePositions(jde) };
	contextCache.set(key, ctx);
	return ctx;
}

export interface DayCellInfo {
	mangyukSerial: number;
	mangyukName: string;
	lamikkhokSerial: number;
	lamikkhokName: string;
}

/**
 * The Mangyuk and Lamikkhok governing a date's sunrise — just the current
 * indexes, for calendar day cells. Mirrors the reference app's
 * calMangyukLamikkhokFor: no tomorrow positions needed, since the index
 * only depends on the day's own longitudes.
 */
export function computeDayCellInfo(y: number, mo: number, d: number, place: Place): DayCellInfo | null {
	try {
		const { pos } = contextFor(y, mo, d, place);
		const LD = normalize360(pos.moonApparentLon - pos.sunApparentLon);
		const lamikkhok = pick(LAMIKKHOK, calcEndingMoment(LD, 12, 1).idx);
		const mangyuk = pick(MANGYUK, calcEndingMoment(normalize360(pos.moonSiderealLon), 360 / 27, 1).idx);
		return {
			mangyukSerial: mangyuk.n,
			mangyukName: mangyuk.name,
			lamikkhokSerial: lamikkhok.n,
			lamikkhokName: lamikkhok.name,
		};
	} catch {
		return null;
	}
}

/** One Panchanga limb: the value at sunrise, its ending, and tomorrow's value. */
export interface LimbDetail {
	serial: number;
	name: string;
	/** Hours from the sunrise reference until the boundary (NaN when unknown). */
	endingMomentHours: number;
	nextSerial: number;
	nextName: string;
}

export interface SignDetail {
	/** 0-based sign index (0 = Aries/Anam). */
	idx: number;
	kiratName: string;
	westernName: string;
	symbol: string;
	degInSign: number;
	endingMomentHours: number;
	/** True when the sign boundary falls within this Kirat day. */
	changes: boolean;
}

export interface ResidenceDetail {
	currentName: string;
	nextName: string;
	changes: boolean;
	/** Hours from sunrise until the change (only meaningful when `changes`). */
	endingMomentHours: number;
	result?: string;
	nextResult?: string;
}

export interface TimeWindow {
	/** Hours from the base date's midnight (24+ domain). */
	startHours: number;
	endHours: number;
}

/**
 * The full structured Yenlon dataset for one Kirat day — the numeric
 * counterpart of the reference app's `currentPanchangaData`, from which
 * both the PanchangaDay string-bag and the Yenlon details view render.
 */
export interface YenlonDetail {
	baseYMD: { y: number; mo: number; d: number };
	/** Sunrise (or solar-noon fallback) in hours from the base date's midnight. */
	refHours: number;
	weekdayIdx: number;
	englishDay: string;
	kiratDayName: string;
	labhrang: string;
	kiratDate: KiratDate | null;
	monthLabel: string;

	tithi: LimbDetail;
	nak: LimbDetail;
	yoga: LimbDetail;
	karana: LimbDetail;
	/** The karana following the sunrise karana, ending within this day. */
	karana2: { serial: number; name: string; endingMomentHours: number };
	sunMangyuk: { serial: number; name: string };
	moonSign: SignDetail;
	sunSign: SignDetail;

	noSunrise: boolean;
	noSunset: boolean;
	sunriseFrac: number;
	sunsetFrac: number;
	solarNoonFrac: number;
	dayDurationHours: number;
	nightDurationHours: number;
	totalKiratDayHours: number;
	ayanamshaDeg: number;
	julianDay: number;

	moonPadas: MoonPada[];
	inauspicious: {
		yemPhakmura: TimeWindow | null;
		gulakaiKala: TimeWindow | null;
		yamagandaKala: TimeWindow | null;
		tong: TongResult | null;
		saran: ZonePeriod | null;
		nganet: ZonePeriod | null;
	};
	residence: {
		midhung: ResidenceDetail;
		hangsam: ResidenceDetail;
		chrang: ResidenceDetail;
		singlaba: ResidenceDetail;
	};
}

/**
 * Computes a full Kirat Yenlon day, mirroring the reference app's
 * onCalculate(): positions at this sunrise, the next, and the one after
 * (so every "next" value is tomorrow's actual sunrise value, correct even
 * across a skipped Tithi/Karana), then every derived term as raw numbers.
 */
export function computeYenlonDetail(y: number, mo: number, d: number, place: Place): YenlonDetail {
	const today = contextFor(y, mo, d, place);
	const tmr = addOneDay(y, mo, d);
	const tomorrow = contextFor(tmr.y, tmr.mo, tmr.d, place);
	const day3 = addOneDay(tmr.y, tmr.mo, tmr.d);
	const dayAfter = contextFor(day3.y, day3.mo, day3.d, place);

	const sunMotion = fwdDiff(tomorrow.pos.sunApparentLon, today.pos.sunApparentLon);
	const moonMotion = fwdDiff(tomorrow.pos.moonApparentLon, today.pos.moonApparentLon);
	const sunMotionTomorrow = fwdDiff(dayAfter.pos.sunApparentLon, tomorrow.pos.sunApparentLon);
	const moonMotionTomorrow = fwdDiff(dayAfter.pos.moonApparentLon, tomorrow.pos.moonApparentLon);

	const refFrac = today.info.jdeSunrise !== null ? today.info.day.sunriseFrac : today.info.day.solarNoonFrac;
	const refHours = refFrac * 24;
	const nakSpan = 360 / 27;

	// Lamikkhok (Tithi) & Khok (Karana) — driven by Moon−Sun elongation
	const LD = normalize360(today.pos.moonApparentLon - today.pos.sunApparentLon);
	const DMD = moonMotion - sunMotion;
	const tithiCalc = calcEndingMoment(LD, 12, DMD);
	const tithi = pick(LAMIKKHOK, tithiCalc.idx);
	const karanaCalc = calcEndingMoment(LD, 6, DMD);
	const karana = mapKarana(karanaCalc.idx + 1);
	// Second karana of the day (the one after the sunrise karana), with its own ending
	const karana2 = mapKarana(((karanaCalc.idx + 1) % 60) + 1);
	const karana2EndHours = DMD > 0 ? ((karanaCalc.endingLongitude + 6 - LD) / DMD) * 24 : NaN;

	// Mangyuk (Nakshatra) & Samyuk (Yoga)
	const moonSidNorm = normalize360(today.pos.moonSiderealLon);
	const nakCalc = calcEndingMoment(moonSidNorm, nakSpan, moonMotion);
	const nak = pick(MANGYUK, nakCalc.idx);
	const sumSid = normalize360(today.pos.sunSiderealLon + today.pos.moonSiderealLon);
	const yogaCalc = calcEndingMoment(sumSid, nakSpan, sunMotion + moonMotion);
	const yoga = pick(SAMYUK, yogaCalc.idx);

	// Tomorrow's values at its own sunrise (correct across skipped elements)
	const LDt = normalize360(tomorrow.pos.moonApparentLon - tomorrow.pos.sunApparentLon);
	const DMDt = moonMotionTomorrow - sunMotionTomorrow;
	const tithiTomorrow = pick(LAMIKKHOK, calcEndingMoment(LDt, 12, DMDt).idx);
	const karanaTomorrow = mapKarana(calcEndingMoment(LDt, 6, DMDt).idx + 1);
	const nakTomorrow = pick(
		MANGYUK,
		calcEndingMoment(normalize360(tomorrow.pos.moonSiderealLon), nakSpan, moonMotionTomorrow).idx,
	);
	const sumSidT = normalize360(tomorrow.pos.sunSiderealLon + tomorrow.pos.moonSiderealLon);
	const yogaTomorrow = pick(SAMYUK, calcEndingMoment(sumSidT, nakSpan, sunMotionTomorrow + moonMotionTomorrow).idx);

	// Sun Mangyuk — the Sun's own Nakshatra; its boundary is usually days away
	const sunNakCalc = calcEndingMoment(normalize360(today.pos.sunSiderealLon), nakSpan, sunMotion);
	const sunNak = pick(MANGYUK, sunNakCalc.idx);

	const labhrangName = moonSidNorm < 180 ? LABHRANG.waxing : LABHRANG.waning;
	const weekdayIdx = new Date(y, mo - 1, d).getDay();

	// Day/night durations — the Kirat day runs sunrise → next sunrise
	const dayDurationHours =
		today.info.jdeSunrise !== null && !today.info.day.noSunset
			? (today.info.day.sunsetFrac - today.info.day.sunriseFrac) * 24
			: NaN;
	const totalKiratDayHours =
		today.info.jdeSunrise !== null && tomorrow.info.jdeSunrise !== null
			? (tomorrow.info.jdeSunrise - today.info.jdeSunrise) * 24
			: (tomorrow.info.jdeSolarNoon - today.info.jdeSolarNoon) * 24;
	const nightDurationHours = isFinite(dayDurationHours) ? totalKiratDayHours - dayDurationHours : NaN;

	// Moon / Sun signs (sidereal, 30° each) with transition times when inside this Kirat day
	const sunSidNorm = normalize360(today.pos.sunSiderealLon);
	const singlaCalc = calcEndingMoment(moonSidNorm, 30, moonMotion);
	const sunSignCalc = calcEndingMoment(sunSidNorm, 30, sunMotion);
	const signDetail = (calc: ReturnType<typeof calcEndingMoment>, sidNorm: number): SignDetail => ({
		idx: calc.idx,
		kiratName: pick(KIRAT_TITLUM_NAMES, calc.idx),
		westernName: pick(ZODIAC, calc.idx),
		symbol: pick(ZODIAC_SYMBOLS, calc.idx),
		degInSign: sidNorm - calc.idx * 30,
		endingMomentHours: calc.endingMomentHours,
		changes: isFinite(calc.endingMomentHours) && calc.endingMomentHours <= totalKiratDayHours,
	});
	const moonSign = signDetail(singlaCalc, moonSidNorm);
	const sunSign = signDetail(sunSignCalc, sunSidNorm);

	// Inauspicious windows — 1/8th of Day Duration from weekday-specific parts
	const window = (parts: number[]): TimeWindow | null => {
		if (!isFinite(dayDurationHours) || dayDurationHours <= 0) return null;
		const startHours = refHours + dayDurationHours * pick(parts, weekdayIdx);
		return { startHours, endHours: startHours + dayDurationHours * 0.125 };
	};

	// Yangdhok residences/directions. Midhung — scenario A: Lamikkhok changes
	// before next sunrise → recalc with the next Lamikkhok, same weekday.
	// Scenario B: it continues past next sunrise → same Lamikkhok, next weekday.
	const weekdayNumber = weekdayIdx + 1;
	const lamikkhokChanges = isFinite(tithiCalc.endingMomentHours) && tithiCalc.endingMomentHours <= totalKiratDayHours;
	const midhungCurrent = midhungResidenceName(weekdayNumber, tithi.n);
	const midhungNext = lamikkhokChanges
		? midhungResidenceName(weekdayNumber, tithiTomorrow.n)
		: midhungResidenceName((weekdayNumber % 7) + 1, tithi.n);
	const residenceDetail = (currentName: string, nextName: string, endingMomentHours: number): ResidenceDetail => ({
		currentName,
		nextName,
		changes: currentName !== nextName,
		endingMomentHours,
		result: RESIDENCE_RESULT[currentName],
		nextResult: RESIDENCE_RESULT[nextName],
	});
	const hangsamCurrent = hangsamResidenceName(tithi.n);
	const chrangCurrent = chrangDirection(tithi.n);
	const singlabaCurrent = singlabaDirection(moonSign.idx + 1);

	return {
		baseYMD: { y, mo, d },
		refHours,
		weekdayIdx,
		englishDay: pick(ENGLISH_DAY_NAMES, weekdayIdx),
		kiratDayName: pick(KIRAT_DAY_NAMES, weekdayIdx),
		labhrang: labhrangName,
		kiratDate: gregorianToKirat(y, mo, d),
		monthLabel: getKiratMonthYearLabel(y, mo),

		tithi: {
			serial: tithi.n,
			name: tithi.name,
			endingMomentHours: tithiCalc.endingMomentHours,
			nextSerial: tithiTomorrow.n,
			nextName: tithiTomorrow.name,
		},
		nak: {
			serial: nak.n,
			name: nak.name,
			endingMomentHours: nakCalc.endingMomentHours,
			nextSerial: nakTomorrow.n,
			nextName: nakTomorrow.name,
		},
		yoga: {
			serial: yoga.n,
			name: yoga.name,
			endingMomentHours: yogaCalc.endingMomentHours,
			nextSerial: yogaTomorrow.n,
			nextName: yogaTomorrow.name,
		},
		karana: {
			serial: karana.khokIndex + 1,
			name: karana.name,
			endingMomentHours: karanaCalc.endingMomentHours,
			nextSerial: karanaTomorrow.khokIndex + 1,
			nextName: karanaTomorrow.name,
		},
		karana2: { serial: karana2.khokIndex + 1, name: karana2.name, endingMomentHours: karana2EndHours },
		sunMangyuk: { serial: sunNak.n, name: sunNak.name },
		moonSign,
		sunSign,

		noSunrise: today.info.jdeSunrise === null,
		noSunset: today.info.day.noSunset,
		sunriseFrac: today.info.day.sunriseFrac,
		sunsetFrac: today.info.day.sunsetFrac,
		solarNoonFrac: today.info.day.solarNoonFrac,
		dayDurationHours,
		nightDurationHours,
		totalKiratDayHours,
		ayanamshaDeg: today.pos.ayanamshaDeg,
		julianDay: today.jde,

		moonPadas: calcMoonPadas(moonSidNorm, moonMotion),
		inauspicious: {
			yemPhakmura: window(YEM_PHAKMURA_PARTS),
			gulakaiKala: window(GULAKAI_KALA_PARTS),
			yamagandaKala: window(YAMAGANDA_KALA_PARTS),
			tong: computeTong(sunSidNorm, sunMotion),
			saran: computeMoonZonePeriod(moonSidNorm, moonMotion, 280),
			nganet: computeMoonZonePeriod(moonSidNorm, moonMotion, 300),
		},
		residence: {
			midhung: residenceDetail(
				midhungCurrent,
				midhungNext,
				lamikkhokChanges ? tithiCalc.endingMomentHours : totalKiratDayHours,
			),
			hangsam: residenceDetail(
				hangsamCurrent,
				lamikkhokChanges ? hangsamResidenceName(tithiTomorrow.n) : hangsamCurrent,
				tithiCalc.endingMomentHours,
			),
			chrang: residenceDetail(
				chrangCurrent,
				lamikkhokChanges ? chrangDirection(tithiTomorrow.n) : chrangCurrent,
				tithiCalc.endingMomentHours,
			),
			singlaba: residenceDetail(
				singlabaCurrent,
				moonSign.changes ? singlabaDirection(((moonSign.idx + 1) % 12) + 1) : singlabaCurrent,
				singlaCalc.endingMomentHours,
			),
		},
	};
}

/* ---------- PanchangaDay string formatting (legacy field names) ---------- */

/** "HH:MM" in the 24+ hour system (times past midnight keep counting: 28:30). */
function fmt24Plus(absHours: number): string {
	if (!isFinite(absHours)) return "";
	const totalMin = Math.round(absHours * 60);
	return `${pad2(Math.floor(totalMin / 60))}:${pad2(totalMin % 60)}`;
}

/** "A to B" range in 24+ "HH:MM". */
const fmtRange = (startHours: number, endHours: number) => `${fmt24Plus(startHours)} to ${fmt24Plus(endHours)}`;

/** "05:08:36 AM" / "19:00:29 PM" — 24h clock with an AM/PM suffix, as the reference dataset prints. */
function fmtClockAmPm(fracOfDay: number): string {
	const totalSec = Math.round((((fracOfDay % 1) + 1) % 1) * 86400);
	const hh = Math.floor(totalSec / 3600);
	const mm = Math.floor((totalSec % 3600) / 60);
	const ss = totalSec % 60;
	return `${pad2(hh)}:${pad2(mm)}:${pad2(ss)} ${hh >= 12 ? "PM" : "AM"}`;
}

function fmtDuration(hoursDecimal: number): string {
	if (!isFinite(hoursDecimal)) return "";
	const totalSec = Math.round(hoursDecimal * 3600);
	const h = Math.floor(totalSec / 3600);
	const m = Math.floor((totalSec % 3600) / 60);
	const s = totalSec % 60;
	return `${h} Hours ${pad2(m)} Minutes ${pad2(s)} Seconds`;
}

/** "(NN) Name" with the ending time appended when one is known. */
function limbValue(n: number, name: string, refHours: number, endingMomentHours: number): string {
	const upto = isFinite(endingMomentHours) ? ` upto ${fmt24Plus(refHours + endingMomentHours)}` : "";
	return `(${pad2(n)}) ${name}${upto}`;
}

/** "♐ Phanam - Sagittarius", optionally with an "upto" when the sign changes within the Kirat day. */
function signValue(signIdx0: number, uptoAbsHours: number | null): string {
	const base = `${pick(ZODIAC_SYMBOLS, signIdx0)} ${pick(KIRAT_TITLUM_NAMES, signIdx0)} - ${pick(ZODIAC, signIdx0)}`;
	return uptoAbsHours !== null ? `${base} upto ${fmt24Plus(uptoAbsHours)}` : base;
}

/**
 * Formats a YenlonDetail into the PanchangaDay string-bag the existing
 * components read (exact field names from the legacy static dataset).
 */
export function computePanchangaDay(y: number, mo: number, d: number, place: Place): PanchangaDay {
	const detail = computeYenlonDetail(y, mo, d, place);
	const { refHours, weekdayIdx, dayDurationHours, nightDurationHours } = detail;

	const out: PanchangaDay = {};

	if (detail.kiratDate) {
		out.KiratDate = `${detail.kiratDate.monthName} ${detail.kiratDate.kiratDay}, ${detail.kiratDate.kiratYear}`;
	}
	if (detail.monthLabel) out.KiratMonthYear = detail.monthLabel;

	out.day = detail.englishDay;
	out.KiratDay = detail.kiratDayName;
	out.Labhrang = detail.labhrang;
	out.tLamikkhok = `${detail.labhrang}-${detail.tithi.name}`;

	out.Lamikkhok = limbValue(detail.tithi.serial, detail.tithi.name, refHours, detail.tithi.endingMomentHours);
	out.nextL = `(${pad2(detail.tithi.nextSerial)}) ${detail.tithi.nextName}`;
	out.Mangyuk = limbValue(detail.nak.serial, detail.nak.name, refHours, detail.nak.endingMomentHours);
	out.nextM = `(${pad2(detail.nak.nextSerial)}) ${detail.nak.nextName}`;
	out.Samyuk = limbValue(detail.yoga.serial, detail.yoga.name, refHours, detail.yoga.endingMomentHours);
	out.nextS = `(${pad2(detail.yoga.nextSerial)}) ${detail.yoga.nextName}`;
	out.Khok = limbValue(detail.karana.serial, detail.karana.name, refHours, detail.karana.endingMomentHours);
	out.Khok2 = limbValue(detail.karana2.serial, detail.karana2.name, refHours, detail.karana2.endingMomentHours);
	out.nextK = `(${pad2(detail.karana.nextSerial)}) ${detail.karana.nextName}`;

	out.moonSign = signValue(
		detail.moonSign.idx,
		detail.moonSign.changes ? refHours + detail.moonSign.endingMomentHours : null,
	);
	if (detail.moonSign.changes) out.nextmoonS = signValue((detail.moonSign.idx + 1) % 12, null);
	out.sunSign = signValue(
		detail.sunSign.idx,
		detail.sunSign.changes ? refHours + detail.sunSign.endingMomentHours : null,
	);
	if (detail.sunSign.changes) out.nextsunS = signValue((detail.sunSign.idx + 1) % 12, null);
	out.SunMangyuk = `(${pad2(detail.sunMangyuk.serial)}) ${detail.sunMangyuk.name}`;

	// Astronomical data
	if (!detail.noSunrise) out.SunRise = fmtClockAmPm(detail.sunriseFrac);
	if (!detail.noSunset) out.SunSet = fmtClockAmPm(detail.sunsetFrac);
	if (isFinite(dayDurationHours)) out.dayDuration = fmtDuration(dayDurationHours);
	if (isFinite(nightDurationHours)) out.nightDuration = fmtDuration(nightDurationHours);

	// Inauspicious timings
	const { yemPhakmura, gulakaiKala, yamagandaKala } = detail.inauspicious;
	if (yemPhakmura) out.YemPhakmura = fmtRange(yemPhakmura.startHours, yemPhakmura.endHours);
	if (gulakaiKala) out.GulikaKala = fmtRange(gulakaiKala.startHours, gulakaiKala.endHours);
	if (yamagandaKala) out.YamagandaKala = fmtRange(yamagandaKala.startHours, yamagandaKala.endHours);

	// Yangdhok residences/directions
	const residenceStr = (r: ResidenceDetail) => {
		const upto = r.changes ? ` upto ${fmt24Plus(refHours + r.endingMomentHours)}` : "";
		return `${r.currentName}${upto}${r.result ? ` (${r.result})` : ""}`;
	};
	out.MidhungYangdhok = residenceStr(detail.residence.midhung);
	out.HangsamYangdhok = residenceStr(detail.residence.hangsam);
	const chrang = detail.residence.chrang;
	out.ChrangYangdhok = chrang.changes
		? `${chrang.currentName} upto ${fmt24Plus(refHours + chrang.endingMomentHours)}`
		: chrang.currentName;
	const singlaba = detail.residence.singlaba;
	out.SinglaYangdhok = singlaba.changes
		? `${singlaba.currentName} upto ${fmt24Plus(refHours + singlaba.endingMomentHours)}`
		: singlaba.currentName;

	// Senlendat — 12 Day + 12 Night slots; run starts at cycle index (weekday*3)%7
	const senlendatStart = (weekdayIdx * 3) % 7;
	if (isFinite(dayDurationHours) && dayDurationHours > 0) {
		const dayLen = dayDurationHours / 12;
		for (let i = 0; i < 12; i++) {
			const name = pick(SENLENDAT_CYCLE, (senlendatStart + i) % 7);
			out[`daySenlen${i + 1}`] = name;
			out[`daySenlendatStart${i + 1}`] = fmt24Plus(refHours + i * dayLen);
			out[`daySenlendatEnd${i + 1}`] = fmt24Plus(refHours + (i + 1) * dayLen);
			out[`daySenlenT${i + 1}`] = fmtRange(refHours + i * dayLen, refHours + (i + 1) * dayLen);
			out[`daySenlenResult${i + 1}`] = SENLENDAT_RESULTS[name];
		}
	}
	if (isFinite(nightDurationHours) && nightDurationHours > 0) {
		const nightLen = nightDurationHours / 12;
		const nightBase = refHours + (isFinite(dayDurationHours) ? dayDurationHours : 0);
		for (let i = 0; i < 12; i++) {
			const name = pick(SENLENDAT_CYCLE, (senlendatStart + 12 + i) % 7);
			out[`nightSenlen${i + 1}`] = name;
			out[`nightSenlendatStart${i + 1}`] = fmt24Plus(nightBase + i * nightLen);
			out[`nightSenlendatEnd${i + 1}`] = fmt24Plus(nightBase + (i + 1) * nightLen);
			out[`nightSenlenT${i + 1}`] = fmtRange(nightBase + i * nightLen, nightBase + (i + 1) * nightLen);
			out[`nightSenlenResult${i + 1}`] = SENLENDAT_RESULTS[name];
		}
	}

	// Yenyem — 8 Day (+1 step) + 8 Night (+5 step) slots
	const yenyemDayStart = (weekdayIdx * 3) % 7;
	const yenyemNightStart = (yenyemDayStart + 5) % 7;
	if (isFinite(dayDurationHours) && dayDurationHours > 0) {
		const dayLen = dayDurationHours / 8;
		for (let i = 0; i < 8; i++) {
			const name = pick(YENYEM_CYCLE, (yenyemDayStart + i) % 7);
			const info = YENYEM_INFO[name] ?? { meaning: "", result: "" };
			out[`dayYemY${i + 1}`] = name;
			out[`dayYemyEng${i + 1}`] = `(${info.meaning})`;
			out[`dayYemYT${i + 1}`] = fmtRange(refHours + i * dayLen, refHours + (i + 1) * dayLen);
			out[`dayYemyResult${i + 1}`] = info.result;
		}
	}
	if (isFinite(nightDurationHours) && nightDurationHours > 0) {
		const nightLen = nightDurationHours / 8;
		const nightBase = refHours + (isFinite(dayDurationHours) ? dayDurationHours : 0);
		for (let i = 0; i < 8; i++) {
			const name = pick(YENYEM_CYCLE, (yenyemNightStart + 5 * i) % 7);
			const info = YENYEM_INFO[name] ?? { meaning: "", result: "" };
			out[`nightYemY${i + 1}`] = name;
			out[`nightYemyEng${i + 1}`] = `(${info.meaning})`;
			out[`nightYemYT${i + 1}`] = fmtRange(nightBase + i * nightLen, nightBase + (i + 1) * nightLen);
			out[`nightYemyResult${i + 1}`] = info.result;
		}
	}

	return out;
}
