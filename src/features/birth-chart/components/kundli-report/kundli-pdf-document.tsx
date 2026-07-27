import { Document, Line, Page, Rect, StyleSheet, Svg, Text as SvgText, Text, View } from "@react-pdf/renderer";

import { ascLord, rasiLord, starLord, type ChartResult } from "@/services/astrology";
import type { AnnualForecast, DomainInterpretation } from "@/services/astrology/interpretation";

import { layoutNorthIndianChart, NORTH_INDIAN_LINES, type ChartPlacement } from "./chart-geometry";
import { degreesToClockTime, formatDateInZone, formatDateUtc, formatLatitude, formatLongitude, formatTimeInZone } from "./format";
import type { KundliSubject } from "./kundli-report";

const INK = "#2b241a";
const MUTED = "#8a7f6c";
const GOLD = "#9a7327";
const LINE = "#d9cdb0";

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 10, color: INK, fontFamily: "Helvetica" },
  eyebrow: { fontSize: 8, letterSpacing: 2, color: GOLD, textTransform: "uppercase", marginBottom: 4 },
  h1: { fontSize: 18, fontFamily: "Helvetica-Bold", marginBottom: 12 },
  h2: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginTop: 18,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottom: `1px solid ${LINE}`,
  },
  headlineRow: { flexDirection: "row", gap: 8, marginBottom: 10 },
  headlineCard: { flex: 1, border: `1px solid ${GOLD}`, borderRadius: 4, padding: 8, backgroundColor: "#fbf3e2" },
  headlineLabel: { fontSize: 6.5, letterSpacing: 1, color: GOLD, textTransform: "uppercase", marginBottom: 3 },
  headlineValue: { fontSize: 11, fontFamily: "Helvetica-Bold", color: INK },
  headlineSub: { fontSize: 7, color: MUTED, marginTop: 2 },
  groupsRow: { flexDirection: "row", gap: 10 },
  groupCard: { flex: 1, border: `1px solid ${LINE}`, borderRadius: 4, padding: 10 },
  groupTitle: { fontSize: 7.5, fontFamily: "Helvetica-Bold", color: MUTED, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 },
  groupFieldRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 2.5 },
  groupFieldLabel: { fontSize: 7.5, color: MUTED },
  groupFieldValue: { fontSize: 8.5, fontFamily: "Helvetica-Bold", color: INK },
  chartsRow: { flexDirection: "row", gap: 24, marginTop: 4 },
  chartBlock: { flex: 1, alignItems: "center" },
  chartCaption: { fontSize: 8, letterSpacing: 1.5, color: MUTED, textTransform: "uppercase", marginTop: 6 },
  mahadashaCard: { border: `1px solid ${LINE}`, borderRadius: 4, padding: 8, marginBottom: 8, width: "32%" },
  mahadashaRow: { flexDirection: "row", flexWrap: "wrap", gap: "2%" },
  mahadashaTitle: { fontSize: 10, fontFamily: "Helvetica-Bold" },
  mahadashaDates: { fontSize: 7.5, color: MUTED, marginTop: 1, marginBottom: 4 },
  antardashaRow: { flexDirection: "row", justifyContent: "space-between", fontSize: 7.5, paddingVertical: 1.5 },
  domainBlock: { marginBottom: 12 },
  domainTitle: { fontSize: 11, fontFamily: "Helvetica-Bold", marginBottom: 3 },
  domainSummary: { fontSize: 9, fontStyle: "italic", marginBottom: 3, lineHeight: 1.4 },
  domainFlavor: { fontSize: 9, color: "#4a4030", lineHeight: 1.4 },
  forecastWindow: { fontSize: 9, letterSpacing: 1.5, color: GOLD, textTransform: "uppercase", marginBottom: 6 },
  forecastSummary: { fontSize: 9.5, fontStyle: "italic", lineHeight: 1.45, marginBottom: 12 },
  segmentBlock: { border: `1px solid ${LINE}`, borderRadius: 4, padding: 10, marginBottom: 8 },
  segmentBlockDominant: { border: `1px solid ${GOLD}`, borderRadius: 4, padding: 10, marginBottom: 8, backgroundColor: "#fbf3e2" },
  segmentHeaderRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  segmentRange: { fontSize: 8, fontFamily: "Helvetica-Bold", color: GOLD, letterSpacing: 1, textTransform: "uppercase" },
  segmentTitle: { fontSize: 10, fontFamily: "Helvetica-Bold", marginBottom: 3 },
  segmentHouse: { fontSize: 8, color: MUTED, fontStyle: "italic" },
  segmentTheme: { fontSize: 9, color: "#4a4030", lineHeight: 1.4, marginTop: 3 },
  pratyantarWrap: { marginTop: 6, paddingLeft: 8, borderLeft: `1px solid ${LINE}` },
  pratyantarLabel: { fontSize: 6.5, letterSpacing: 1, color: MUTED, textTransform: "uppercase", marginBottom: 3 },
  pratyantarRow: { flexDirection: "row", marginBottom: 2 },
  pratyantarRange: { fontSize: 7.5, color: GOLD, width: 96 },
  pratyantarText: { fontSize: 7.5, color: INK, flex: 1 },
  forecastNote: { fontSize: 9, color: INK, lineHeight: 1.4, marginTop: 4, marginBottom: 8, padding: 8, border: `1px solid ${LINE}`, borderRadius: 4, backgroundColor: "#faf6ec" },
  forecastGuidance: { fontSize: 9.5, fontFamily: "Helvetica-Bold", color: GOLD, marginTop: 4 },
  footer: { position: "absolute", bottom: 20, left: 32, right: 32, fontSize: 7, color: MUTED, textAlign: "center" },
});

interface KundliPdfDocumentProps extends KundliSubject {
  result: ChartResult;
  domains: readonly DomainInterpretation[];
  annualForecast: AnnualForecast | null;
  birthUtc: Date;
  lagnaPlacements: ChartPlacement[];
  navamsaPlacements: ChartPlacement[];
}

export function KundliPdfDocument({
  result,
  domains,
  annualForecast,
  name,
  gender,
  placeName,
  birthUtc,
  timezone,
  latitude,
  longitude,
  lagnaPlacements,
  navamsaPlacements,
}: KundliPdfDocumentProps) {
  const asc = result.ascendant;
  const firstMahadasha = result.vimshottariDasha[0];
  const balance = result.dashaBalanceAtBirth;

  const headline: Array<{ label: string; value: string; sub: string }> = [
    ...(asc ? [{ label: "Ascendant", value: asc.rashi.signName, sub: `Lord ${ascLord(asc.rashi)}` }] : []),
    { label: "Rasi", value: result.moon.rashi.signName, sub: `Lord ${rasiLord(result.moon.rashi)}` },
    {
      label: "Nakshatra",
      value: `${result.moon.nakshatra.name} · Pada ${result.moon.nakshatra.pada}`,
      sub: `Lord ${starLord(result.moon.nakshatra)}`,
    },
    ...(firstMahadasha
      ? [{ label: "Dasha Balance", value: firstMahadasha.planet, sub: `${balance.years}y ${balance.months}m ${balance.days}d left` }]
      : []),
  ];

  const fieldGroups: Array<{ title: string; fields: Array<[string, string]> }> = [
    {
      title: "Birth Details",
      fields: [
        ["Name", name],
        ["Sex", gender === "male" ? "Male" : "Female"],
        ["Date", formatDateInZone(birthUtc, timezone)],
        ["Time of Birth", result.timeConfidence === "exact" ? formatTimeInZone(birthUtc, timezone) : "Unknown"],
        ["Place", placeName],
        ["Latitude", formatLatitude(latitude)],
        ["Longitude", formatLongitude(longitude)],
      ],
    },
    {
      title: "Panchanga",
      fields: [
        ["Tithi", result.panchang.tithi.name],
        ["Yoga", result.panchang.yoga.name],
        ["Karana", result.panchang.karana.name],
        ...(result.sunrise ? ([["Sunrise", formatTimeInZone(result.sunrise, timezone)]] as [string, string][]) : []),
        ...(result.sunset ? ([["Sunset", formatTimeInZone(result.sunset, timezone)]] as [string, string][]) : []),
      ],
    },
    {
      title: "Chart Technicals",
      fields: [
        ["Julian Day", String(Math.round(result.julianDayUtc))],
        ["Ayanamsa", `${result.ayanamsaDegrees.toFixed(2)}°`],
        ["Ayanamsa Type", result.ayanamsaName],
        ...(result.siderealTimeDegrees !== undefined
          ? ([["Sidereal Time", degreesToClockTime(result.siderealTimeDegrees)]] as [string, string][])
          : []),
      ],
    },
  ];

  return (
    <Document title={`${name} — Vedic Birth Chart`} author="Kirat Astro">
      <Page size="A4" style={styles.page}>
        <Text style={styles.eyebrow}>Kirat Astro — Full Vedic Report</Text>
        <Text style={styles.h1}>{name}&apos;s Kundli</Text>

        <Text style={styles.h2}>Traditional</Text>
        <View style={styles.headlineRow}>
          {headline.map((stat) => (
            <View key={stat.label} style={styles.headlineCard}>
              <Text style={styles.headlineLabel}>{stat.label}</Text>
              <Text style={styles.headlineValue}>{stat.value}</Text>
              <Text style={styles.headlineSub}>{stat.sub}</Text>
            </View>
          ))}
        </View>
        <View style={styles.groupsRow}>
          {fieldGroups.map((group) => (
            <View key={group.title} style={styles.groupCard}>
              <Text style={styles.groupTitle}>{group.title}</Text>
              {group.fields.map(([label, value]) => (
                <View key={label} style={styles.groupFieldRow}>
                  <Text style={styles.groupFieldLabel}>{label}</Text>
                  <Text style={styles.groupFieldValue}>{value}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        <Text style={styles.h2}>Lagna &amp; Navamsa Charts</Text>
        <View style={styles.chartsRow}>
          <View style={styles.chartBlock}>
            <PdfNorthIndianChart placements={lagnaPlacements} ascendantSignIndex={result.ascendant?.rashi.signIndex} />
            <Text style={styles.chartCaption}>Lagna Chart</Text>
          </View>
          <View style={styles.chartBlock}>
            <PdfNorthIndianChart placements={navamsaPlacements} ascendantSignIndex={result.navamsa.ascendant?.signIndex} />
            <Text style={styles.chartCaption}>Navamsa Chart</Text>
          </View>
        </View>

        <Text style={styles.footer}>Generated by Kirat Astro — calculated from real astronomical positions.</Text>
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.h2}>Vimshottari Dasha</Text>
        <View style={styles.mahadashaRow}>
          {result.vimshottariDasha.map((mahadasha, i) => (
            <View key={mahadasha.planet + i} style={styles.mahadashaCard}>
              <Text style={styles.mahadashaTitle}>{mahadasha.planet}</Text>
              <Text style={styles.mahadashaDates}>
                {formatDateUtc(mahadasha.startDate)} - {formatDateUtc(mahadasha.endDate)} · {mahadasha.durationYears.toFixed(1)}y
              </Text>
              {mahadasha.antardasha.map((sub, j) => (
                <View key={sub.planet + j} style={styles.antardashaRow}>
                  <Text>{sub.planet}</Text>
                  <Text>{formatDateUtc(sub.endDate)}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        <Text style={styles.footer}>Generated by Kirat Astro — calculated from real astronomical positions.</Text>
      </Page>

      {annualForecast && (
        <Page size="A4" style={styles.page}>
          <Text style={styles.h2}>Annual Forecast</Text>
          <Text style={styles.forecastWindow}>{annualForecast.windowLabel}</Text>
          <Text style={styles.forecastSummary}>{annualForecast.summary}</Text>
          {annualForecast.segments.map((segment, i) => (
            <View key={segment.antardasha + i} style={segment.dominant ? styles.segmentBlockDominant : styles.segmentBlock} wrap={false}>
              <View style={styles.segmentHeaderRow}>
                <Text style={styles.segmentRange}>{segment.rangeLabel}</Text>
                {segment.dominant && <Text style={styles.segmentRange}>Strongest stretch</Text>}
              </View>
              <Text style={styles.segmentTitle}>{segment.antardasha} sub-period</Text>
              {segment.houseLabel && (
                <Text style={styles.segmentHouse}>
                  {segment.antardasha} is in your {segment.houseLabel} house
                </Text>
              )}
              <Text style={styles.segmentTheme}>{segment.theme}</Text>
              {segment.detail.length > 1 && (
                <View style={styles.pratyantarWrap}>
                  <Text style={styles.pratyantarLabel}>Month by month</Text>
                  {segment.detail.map((sub, j) => (
                    <View key={sub.planet + j} style={styles.pratyantarRow}>
                      <Text style={styles.pratyantarRange}>{sub.rangeLabel}</Text>
                      <Text style={styles.pratyantarText}>
                        {sub.planet}
                        {sub.houseLabel ? ` (${sub.houseLabel} house)` : ""} — {sub.focus}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
          {annualForecast.sadesatiNote && <Text style={styles.forecastNote}>{annualForecast.sadesatiNote}</Text>}
          <Text style={styles.forecastGuidance}>{annualForecast.guidance}</Text>
          <Text style={styles.footer}>
            A rolling twelve-month outlook from your Vimshottari Dasha — interpretive guidance, not medical, legal, or financial advice.
          </Text>
        </Page>
      )}

      <Page size="A4" style={styles.page}>
        <Text style={styles.h2}>Life Predictions</Text>
        {domains.map((domain) => (
          <View key={domain.key} style={styles.domainBlock} wrap={false}>
            <Text style={styles.domainTitle}>{domain.title}</Text>
            <Text style={styles.domainSummary}>{domain.summary}</Text>
            <Text style={styles.domainFlavor}>{domain.flavor}</Text>
          </View>
        ))}
        <Text style={styles.footer}>
          Traditional interpretive guidance drawn from your chart — not medical, legal, or financial advice.
        </Text>
      </Page>
    </Document>
  );
}

function PdfNorthIndianChart({
  placements,
  ascendantSignIndex,
}: {
  placements: readonly ChartPlacement[];
  ascendantSignIndex?: number;
}) {
  const boxes = layoutNorthIndianChart(placements, ascendantSignIndex, 22);
  const label = (x: number, y: number, size: number, color: string, key: string, content: string) => (
    <SvgText key={key} x={x} y={y} textAnchor="middle" fill={color} style={svgStyle(size)}>
      {content}
    </SvgText>
  );

  return (
    <Svg width={220} height={220} viewBox="0 0 400 400">
      <Rect x={1} y={1} width={398} height={398} fill="none" stroke={LINE} strokeWidth={2} />
      {NORTH_INDIAN_LINES.map(([[x1, y1], [x2, y2]], i) => (
        <Line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={LINE} strokeWidth={1.5} />
      ))}
      {boxes.map(({ rashiNumber, numberPos }) =>
        label(numberPos[0], numberPos[1] + 3, 9, MUTED, `n${rashiNumber}`, String(rashiNumber)),
      )}
      {boxes.flatMap(({ rashiNumber, stackAnchor, firstLineY, bodies, isAscendant }) => [
        ...(isAscendant ? [label(stackAnchor[0], firstLineY - 22 * 0.9 + 3, 7, GOLD, `asc${rashiNumber}`, "ASC")] : []),
        ...bodies.map((body, i) =>
          label(stackAnchor[0], firstLineY + i * 22 + 4, 11, INK, `${rashiNumber}-${body.abbreviation}-${i}`, body.abbreviation),
        ),
      ])}
    </Svg>
  );
}

/** @react-pdf/renderer's SVGPresentationAttributes type omits fontSize even though the renderer supports it — narrow, deliberate cast. */
function svgStyle(fontSize: number) {
  return { fontSize } as unknown as Record<string, never>;
}
