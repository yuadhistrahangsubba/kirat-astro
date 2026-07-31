import { getKiratDayNumber } from "../engine/yele";

/**
 * Legacy seam kept for existing callers/tests. The per-year {start, reset}
 * table that used to live here (2000-2051) was superseded by the engine's
 * KIRAT_YELE_DATA (2000-2100, identical values, same formula) — see
 * ../engine/yele.ts.
 */
export function getKiratDate(y: number, m: number, d: number): number | "" {
	return getKiratDayNumber(y, m, d);
}
