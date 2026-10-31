import type { KeyboardEvent } from "react";

const STEP: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };

/**
 * Arrow-key movement between the day buttons of a 7-column date grid
 * (ARIA APG date-picker pattern): ←/→ one day, ↑/↓ one week, Home/End the
 * first/last day of the month. Attach to the grid container's onKeyDown.
 */
export function handleDayGridKeys(event: KeyboardEvent<HTMLElement>) {
	const days = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>("button[data-day]"));
	const current = days.indexOf(document.activeElement as HTMLButtonElement);
	if (current === -1) return;

	let next: number;
	if (event.key in STEP) next = current + STEP[event.key]!;
	else if (event.key === "Home") next = 0;
	else if (event.key === "End") next = days.length - 1;
	else return;

	event.preventDefault();
	days[Math.max(0, Math.min(days.length - 1, next))]?.focus();
}

/** "Saturday 31 October 2026" — accessible name for a day cell. */
export function dayLabel(year: number, month: number, day: number): string {
	return new Date(year, month, day).toLocaleDateString("en-GB", {
		weekday: "long",
		day: "numeric",
		month: "long",
		year: "numeric",
	});
}
