/**
 * The reference panchanga dataset is sparse and inconsistently shaped — most
 * days only carry a handful of fields, others carry Kirat-script ("K"-prefixed)
 * counterparts of nearly every field, and the Yenyem/Senlendat time-division
 * fields are accessed dynamically as `${prefix}${n}` (n = 1..12). An index
 * signature reflects the data honestly instead of pretending it's uniform.
 */
export interface PanchangaDay {
  [key: string]: string | undefined;
}

export type InfoPageKey = "about";

/** Tool sections ported from the reference Kirat Calendar app. */
export type ToolPageKey =
	| "senlendat"
	| "yenyemdat"
	| "khesemuk"
	| "singlabamuk"
	| "planets"
	| "ephemeris"
	| "ayanamsha"
	| "yeleconverter";

export type ViewMode = "calendar" | "year" | InfoPageKey | ToolPageKey;

export type CalendarTheme = "day" | "night";
