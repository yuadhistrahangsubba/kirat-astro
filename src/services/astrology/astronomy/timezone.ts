/**
 * Resolves a local wall-clock date/time in an IANA time zone to a UTC
 * instant, using only built-in Intl (no tz-database dependency).
 *
 * Technique: treat the wall-clock numbers as if they were UTC to get a
 * first guess, then ask Intl what that instant looks like when formatted
 * in the target zone. The difference between the two is the zone's
 * offset at that instant, which we subtract from the guess.
 *
 * The offset is measured twice: once at the first guess, then again at the
 * corrected instant. A single pass is off by the DST delta when the guess
 * and the true instant fall on opposite sides of a transition. Wall-clock
 * times that don't exist (skipped spring-forward hour) resolve to the
 * post-transition offset.
 */
export function localToUtc(dateISO: string, time: string, timeZone: string): Date {
  const [year, month, day] = dateISO.split("-").map(Number) as [number, number, number];
  // "HH:mm" or "HH:mm:ss" — seconds are below what any placement needs
  // (the fastest-moving angle, the ascendant, moves ~1° per 4 minutes),
  // but if the user knows them, honor them rather than silently drop.
  const [hour, minute, second = 0] = time.split(":").map(Number) as [number, number, number?];

  const guessUtc = new Date(Date.UTC(year, month - 1, day, hour, minute, second));

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });

  const offsetAt = (instant: Date) => {
    const parts = formatter.formatToParts(instant);
    const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
    const zonedAsUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"));
    return zonedAsUtc - instant.getTime();
  };

  const firstOffset = offsetAt(guessUtc);
  const secondOffset = offsetAt(new Date(guessUtc.getTime() - firstOffset));

  return new Date(guessUtc.getTime() - secondOffset);
}
