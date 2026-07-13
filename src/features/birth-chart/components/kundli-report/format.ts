/** Shared formatting helpers for the Kundli report's traditional-table style output. */

export function formatDegreesMinutes(decimalDegrees: number): string {
  const totalMinutes = Math.round(decimalDegrees * 60);
  const degrees = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${degrees}° ${minutes}'`;
}

export function formatLatitude(decimalDegrees: number): string {
  const hemisphere = decimalDegrees >= 0 ? "N" : "S";
  return `${formatDegreesMinutes(Math.abs(decimalDegrees))} ${hemisphere}`;
}

export function formatLongitude(decimalDegrees: number): string {
  const hemisphere = decimalDegrees >= 0 ? "E" : "W";
  return `${formatDegreesMinutes(Math.abs(decimalDegrees))} ${hemisphere}`;
}

/** Degrees (0-360, e.g. sidereal time expressed as an angle) rendered as HH:MM:SS, 24 divided into 360. */
export function degreesToClockTime(decimalDegrees: number): string {
  const totalSeconds = Math.round(((decimalDegrees % 360) / 15) * 3600);
  const hours = Math.floor(totalSeconds / 3600) % 24;
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((n) => String(n).padStart(2, "0")).join(":");
}

export function formatTimeInZone(date: Date, timezone: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: timezone,
  }).format(date);
}

export function formatDateInZone(date: Date, timezone: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: timezone,
  }).format(date);
}

/** Dasha boundary dates are UTC calendar arithmetic (see `calendarDateDiff`) — format from the UTC fields, not the viewer's local timezone. */
export function formatDateUtc(date: Date): string {
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
}
