/**
 * Time/angle formatting helpers for the Yenlon details view, ported from
 * the reference Kirat Calendar app. All "ending moment" values are hours
 * from the Kirat day's sunrise; formatting resolves them to a wall clock
 * in the selected mode.
 */

export type TimeFormatMode = "12h" | "24h" | "24plus";

export interface BaseYMD {
	y: number;
	mo: number;
	d: number;
}

const pad2 = (n: number) => String(n).padStart(2, "0");

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Adds calendar days to a y/mo/d triple. */
export function addDaysYMD(y: number, mo: number, d: number, offset: number): BaseYMD & { monthName: string } {
	const dt = new Date(Date.UTC(y, mo - 1, d));
	dt.setUTCDate(dt.getUTCDate() + offset);
	return {
		y: dt.getUTCFullYear(),
		mo: dt.getUTCMonth() + 1,
		d: dt.getUTCDate(),
		monthName: MONTH_NAMES[dt.getUTCMonth()] as string,
	};
}

/**
 * Formats a Panchanga element's ending moment (refHours + endingMomentHours,
 * both hours-from-midnight of baseYMD) per the selected time-format mode.
 * 12h/24h append a ", Mon D" date suffix when the moment rolls past
 * midnight; 24plus keeps counting (e.g. "28:30").
 */
export function formatEndingTime(
	refHours: number,
	endingMomentHours: number,
	baseYMD: BaseYMD,
	mode: TimeFormatMode,
): string {
	if (!isFinite(endingMomentHours)) return "—";
	const totalHours = refHours + endingMomentHours;

	if (mode === "24plus") {
		const totalSec = Math.round(totalHours * 3600);
		const hh = Math.floor(totalSec / 3600);
		const mm = Math.floor((totalSec % 3600) / 60);
		return `${pad2(hh)}:${pad2(mm)}`;
	}

	let dayOffset = Math.floor(totalHours / 24);
	const clockHours = totalHours - dayOffset * 24;
	const totalMin = Math.round(clockHours * 60);
	let hh = Math.floor(totalMin / 60);
	const mm = totalMin % 60;
	if (hh === 24) {
		hh = 0;
		dayOffset += 1;
	}

	let dateSuffix = "";
	if (dayOffset !== 0) {
		const nd = addDaysYMD(baseYMD.y, baseYMD.mo, baseYMD.d, dayOffset);
		dateSuffix = `, ${nd.monthName} ${nd.d}`;
	}

	if (mode === "24h") {
		return `${pad2(hh)}:${pad2(mm)}${dateSuffix}`;
	}
	const ampm = hh >= 12 ? "PM" : "AM";
	let hh12 = hh % 12;
	if (hh12 === 0) hh12 = 12;
	return `${pad2(hh12)}:${pad2(mm)} ${ampm}${dateSuffix}`;
}

/** Fraction-of-day (0–1) → "hh:mm:ss AM/PM" local clock string. */
export function formatClock12(frac: number): string {
	const wrapped = ((frac % 1) + 1) % 1;
	const totalSec = Math.round(wrapped * 86400);
	const hh24 = Math.floor(totalSec / 3600);
	const mm = Math.floor((totalSec % 3600) / 60);
	const ss = totalSec % 60;
	const ampm = hh24 >= 12 ? "PM" : "AM";
	let hh12 = hh24 % 12;
	if (hh12 === 0) hh12 = 12;
	return `${pad2(hh12)}:${pad2(mm)}:${pad2(ss)} ${ampm}`;
}

/** Decimal hours → "Hh MMm". */
export function formatDurationHM(hoursDecimal: number): string {
	if (!isFinite(hoursDecimal)) return "—";
	const totalMin = Math.round(hoursDecimal * 60);
	const h = Math.floor(totalMin / 60);
	const m = totalMin % 60;
	return `${h}h ${pad2(m)}m`;
}

/** Plain degrees → "24° 10′ 30″". */
export function formatDMSPlain(deg: number): string {
	const totalSec = Math.round(deg * 3600);
	const d = Math.floor(totalSec / 3600);
	const m = Math.floor((totalSec % 3600) / 60);
	const s = totalSec % 60;
	return `${d}° ${pad2(m)}′ ${pad2(s)}″`;
}
