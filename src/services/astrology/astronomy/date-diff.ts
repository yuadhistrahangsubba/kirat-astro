/**
 * Calendar-accurate Years/Months/Days between two UTC instants — used
 * for "Dasha balance at birth" style reporting, where the traditional
 * convention is a calendar Y/M/D count rather than a fractional-year
 * decimal. `end` must be at or after `start`.
 */
export function calendarDateDiff(start: Date, end: Date): { years: number; months: number; days: number } {
  let years = end.getUTCFullYear() - start.getUTCFullYear();
  let months = end.getUTCMonth() - start.getUTCMonth();
  let days = end.getUTCDate() - start.getUTCDate();

  if (days < 0) {
    months -= 1;
    const daysInPrevMonth = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), 0)).getUTCDate();
    days += daysInPrevMonth;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months, days };
}
