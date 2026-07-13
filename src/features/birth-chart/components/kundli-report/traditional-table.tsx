import { ascLord, rasiLord, starLord, type ChartResult } from "@/services/astrology";

import { degreesToClockTime, formatDateInZone, formatLatitude, formatLongitude, formatTimeInZone } from "./format";

interface TraditionalTableProps {
  result: ChartResult;
  name: string;
  gender: "male" | "female";
  placeName: string;
  birthUtc: Date;
  timezone: string;
  latitude: number;
  longitude: number;
}

interface Field {
  label: string;
  value: string;
}

export function TraditionalTable({
  result,
  name,
  gender,
  placeName,
  birthUtc,
  timezone,
  latitude,
  longitude,
}: TraditionalTableProps) {
  const asc = result.ascendant;
  const firstMahadasha = result.vimshottariDasha[0];
  const balance = result.dashaBalanceAtBirth;

  const fields: Field[] = [
    { label: "Name", value: name },
    { label: "Sex", value: gender === "male" ? "Male" : "Female" },
    { label: "Date", value: formatDateInZone(birthUtc, timezone) },
    { label: "Time of Birth", value: result.timeConfidence === "exact" ? formatTimeInZone(birthUtc, timezone) : "Unknown" },
    { label: "Place", value: placeName },
    { label: "Latitude", value: formatLatitude(latitude) },
    { label: "Longitude", value: formatLongitude(longitude) },
    { label: "Julian Day", value: String(Math.round(result.julianDayUtc)) },
    { label: "Ayanamsa", value: formatDegreesOnly(result.ayanamsaDegrees) },
    { label: "Ayanamsa Type", value: result.ayanamsaName },
    ...(result.siderealTimeDegrees !== undefined
      ? [{ label: "SID", value: degreesToClockTime(result.siderealTimeDegrees) }]
      : []),
    ...(result.sunrise ? [{ label: "Sunrise", value: formatTimeInZone(result.sunrise, timezone) }] : []),
    ...(result.sunset ? [{ label: "Sunset", value: formatTimeInZone(result.sunset, timezone) }] : []),
    { label: "Tithi", value: result.panchang.tithi.name },
    { label: "Yoga", value: result.panchang.yoga.name },
    { label: "Karana", value: result.panchang.karana.name },
    ...(asc ? [{ label: "Ascendant", value: asc.rashi.signName }, { label: "Asc Lord", value: ascLord(asc.rashi) }] : []),
    { label: "Rasi", value: result.moon.rashi.signName },
    { label: "Rasi Lord", value: rasiLord(result.moon.rashi) },
    { label: "Star - Pada", value: `${result.moon.nakshatra.name} - ${result.moon.nakshatra.pada}` },
    { label: "Star Lord", value: starLord(result.moon.nakshatra) },
    ...(firstMahadasha
      ? [{ label: "Bal. Dasha", value: `${firstMahadasha.planet}  ${balance.years}Y ${balance.months}M ${balance.days}D` }]
      : []),
  ];

  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border/60 bg-border/40 sm:grid-cols-3">
      {fields.map((field) => (
        <div key={field.label} className="bg-card/70 px-4 py-3">
          <p className="font-dense text-[10px] tracking-[0.15em] text-muted-foreground/70 uppercase">{field.label}</p>
          <p className="mt-0.5 truncate text-sm font-semibold text-foreground" title={field.value}>
            {field.value}
          </p>
        </div>
      ))}
    </div>
  );
}

function formatDegreesOnly(decimalDegrees: number): string {
  const totalMinutes = Math.round(decimalDegrees * 60);
  const degrees = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${degrees}° ${minutes}'`;
}
