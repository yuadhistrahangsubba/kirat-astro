import { DEFAULT_PLACE } from "../engine";

/**
 * Today's calendar date at the calendar's reference place (Thimphu), as a
 * local-midnight Date. The calendar works in Y/M/D of that place, so the
 * visitor's own zone must not decide which day is "today" — someone in New
 * York would otherwise see yesterday for most of Bhutan's morning.
 */
export function todayInZone(timeZone: string = DEFAULT_PLACE.timezone, now: Date = new Date()): Date {
	const parts = new Intl.DateTimeFormat("en-US", {
		timeZone,
		year: "numeric",
		month: "numeric",
		day: "numeric",
	}).formatToParts(now);
	const get = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((p) => p.type === type)?.value);
	return new Date(get("year"), get("month") - 1, get("day"));
}
