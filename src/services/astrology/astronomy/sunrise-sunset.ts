import * as Astronomy from "astronomy-engine";

import { toJulianDay } from "./julian-date";
import { localToUtc } from "./timezone";

const J2000_JULIAN_DAY = 2451545.0;

export interface SunriseSunset {
  sunrise?: Date;
  sunset?: Date;
}

/**
 * Sunrise and sunset (UTC instants) for the observer's local calendar
 * day the birth date falls on. Delegates the rise/set search itself to
 * astronomy-engine (`SearchRiseSet`) rather than hand-deriving the
 * hour-angle formula — this package has no existing sunrise/sunset
 * primitive to build on, and getting atmospheric refraction / the
 * body's angular radius right is exactly the kind of detail a
 * maintained library already handles correctly.
 */
export function calculateSunriseSunset(
  birthDateISO: string,
  timezone: string,
  latitude: number,
  longitude: number,
): SunriseSunset {
  const localMidnightUtc = localToUtc(birthDateISO, "00:00", timezone);
  const startUt = toJulianDay(localMidnightUtc) - J2000_JULIAN_DAY;
  const observer = new Astronomy.Observer(latitude, longitude, 0);

  const sunrise = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, 1, startUt, 1);
  const sunset = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, -1, startUt, 1);

  return {
    sunrise: sunrise?.date,
    sunset: sunset?.date,
  };
}
