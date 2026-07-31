import { PANCHANGA_DATA } from "../data/panchanga-data";
import type { PanchangaDay } from "../types";
import { computePanchangaDay } from "./panchanga";
import { DEFAULT_PLACE } from "./sunrise";
import { YELE_MAX_AD_YEAR, YELE_MIN_AD_YEAR } from "./yele";

export { formatClock12, formatDMSPlain, formatDurationHM, formatEndingTime, type TimeFormatMode } from "./format";
export {
	computeDayCellInfo,
	computeYenlonDetail,
	type DayCellInfo,
	type LimbDetail,
	type ResidenceDetail,
	type SignDetail,
	type YenlonDetail,
} from "./panchanga";
export { DEFAULT_PLACE } from "./sunrise";
export {
	getKiratDayNumber,
	getKiratMonthHeaderText,
	getKiratMonthYearLabel,
	gregorianToKirat,
	kiratToGregorian,
} from "./yele";

const cache = new Map<string, PanchangaDay | undefined>();

/**
 * Panchanga for a "YYYY-MM-DD" key: computed live by the ported engine,
 * with the hand-authored static dataset merged on top (it carries the
 * Kirat-script K* fields and traditional values the engine can't derive —
 * Wanma, HangHangwa, era years, …). Memoized per date key.
 */
export function getPanchanga(dateKey: string): PanchangaDay | undefined {
	if (cache.has(dateKey)) return cache.get(dateKey);

	const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateKey);
	const staticDay = PANCHANGA_DATA[dateKey];
	let result: PanchangaDay | undefined;

	if (m) {
		const y = Number(m[1]);
		const mo = Number(m[2]);
		const d = Number(m[3]);
		if (y >= YELE_MIN_AD_YEAR && y <= YELE_MAX_AD_YEAR) {
			const computed = computePanchangaDay(y, mo, d, DEFAULT_PLACE);
			result = staticDay ? mergePreferringStatic(computed, staticDay) : computed;
		} else {
			result = staticDay;
		}
	} else {
		result = staticDay;
	}

	cache.set(dateKey, result);
	return result;
}

/** Static values win, but empty-string placeholders fall back to computed ones. */
function mergePreferringStatic(computed: PanchangaDay, staticDay: PanchangaDay): PanchangaDay {
	const merged: PanchangaDay = { ...computed };
	for (const [key, value] of Object.entries(staticDay)) {
		if (value !== undefined && value !== "") merged[key] = value;
	}
	return merged;
}
