// The typed seam between validated user input and the future calculation
// engine. Everything upstream (forms, API routes) should depend on these
// types, not on whichever ephemeris library eventually implements them.

export interface BirthInput {
  birthDate: string; // ISO date, e.g. "1998-04-12"
  birthTime?: string; // "HH:mm", 24-hour, local to `timezone`. Omitted = unknown birth time.
  timezone: string; // IANA tz, e.g. "Asia/Thimphu"
  latitude: number;
  longitude: number;
}

export interface PlanetPosition {
  planet: string;
  signIndex: number; // 0-11, sidereal
  degreesInSign: number;
  isRetrograde: boolean;
}

export interface ChartResult {
  ascendantSignIndex: number;
  planets: PlanetPosition[];
  ayanamsa: number; // degrees, sidereal correction applied
}
