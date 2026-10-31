"use client";

import { useMemo, useState } from "react";

import {
	computeYenlonDetail,
	DEFAULT_PLACE,
	formatClock12,
	formatDMSPlain,
	formatDurationHM,
	formatEndingTime,
	getPanchanga,
	type LimbDetail,
	type ResidenceDetail,
	type TimeFormatMode,
	type YenlonDetail,
} from "../engine";
import styles from "../kirat-calendar.module.css";

const pad2 = (n: number) => String(n).padStart(2, "0");

const TIME_MODES: { mode: TimeFormatMode; label: string }[] = [
	{ mode: "12h", label: "12-Hour" },
	{ mode: "24h", label: "24-Hour" },
	{ mode: "24plus", label: "24+ Hour" },
];

interface YenlonDetailsProps {
	year: number;
	month: number; // 0-based, as KiratCalendar tracks it
	day: number;
}

/**
 * The Kirat Yenlon daily view, following the reference app's "Kirat Yenlon"
 * section: Panchanga limbs with ending times and next values, astronomical
 * information/data, Moon Mangyuk Padas, inauspicious timings (incl. Tong,
 * Saran, Nganet) and Yangdhok residences — all live-computed by the engine
 * for the selected date, with the same 12h/24h/24+ time-format toggle.
 */
export function YenlonDetails({ year, month, day }: YenlonDetailsProps) {
	const [timeMode, setTimeMode] = useState<TimeFormatMode>("12h");

	const detail = useMemo<YenlonDetail | null>(() => {
		try {
			return computeYenlonDetail(year, month + 1, day, DEFAULT_PLACE);
		} catch {
			return null;
		}
	}, [year, month, day]);

	if (!detail) return null;

	const fmt = (endingMomentHours: number | undefined) =>
		endingMomentHours === undefined
			? "—"
			: formatEndingTime(detail.refHours, endingMomentHours, detail.baseYMD, timeMode);
	/** For values already in hours-from-midnight (inauspicious windows). */
	const fmtAbs = (absHours: number) => formatEndingTime(0, absHours, detail.baseYMD, timeMode);

	const limbLine = (limb: LimbDetail) => (
		<>
			({pad2(limb.serial)}) {limb.name} <span style={{ opacity: 0.65 }}>upto</span> {fmt(limb.endingMomentHours)}
			<p>
				({pad2(limb.nextSerial)}) {limb.nextName}
			</p>
		</>
	);

	const residenceRows = (label: string, r: ResidenceDetail) => (
		<tr>
			<th>{label}:</th>
			<td>
				{r.currentName}
				{r.result ? ` (${r.result})` : ""}
				{r.changes && (
					<p>
						<span style={{ opacity: 0.65 }}>upto</span> {fmt(r.endingMomentHours)} → {r.nextName}
						{r.nextResult ? ` (${r.nextResult})` : ""}
					</p>
				)}
			</td>
		</tr>
	);

	// The reference app leaves these as "Coming Soon"; the hand-authored
	// dataset fills them for a few days — show those when present.
	const staticDay = getPanchanga(
		`${year}-${pad2(month + 1)}-${pad2(day)}`,
	);

	const { tong, saran, nganet, yemPhakmura, gulakaiKala, yamagandaKala } = detail.inauspicious;

	return (
		<div className={styles.infoContainer}>
			<div className={styles.infoBox}>
				<h3 style={{ fontSize: 20, color: "var(--primary)", textAlign: "center" }}>Kirat Yenlon</h3>
				<p style={{ textAlign: "center", marginTop: 4 }}>
					{detail.englishDay}, {day} {new Date(year, month, day).toLocaleDateString("en-US", { month: "long" })}{" "}
					{year}
					{detail.kiratDate &&
						` · ${detail.kiratDate.monthName} ${detail.kiratDate.kiratDay}, ${detail.kiratDate.kiratYear}`}
				</p>
				<p style={{ textAlign: "center", opacity: 0.7, fontSize: 13 }}>
					{DEFAULT_PLACE.name} · {DEFAULT_PLACE.timezone} · {DEFAULT_PLACE.lat.toFixed(4)}°N{" "}
					{DEFAULT_PLACE.lon.toFixed(4)}°E
				</p>

				<div style={{ display: "flex", justifyContent: "center", gap: 8, margin: "12px 0" }}>
					{TIME_MODES.map(({ mode, label }) => (
						<button
							key={mode}
							type="button"
							aria-pressed={timeMode === mode}
							onClick={() => setTimeMode(mode)}
							style={{
								padding: "6px 14px",
								borderRadius: 999,
								fontSize: 13,
								fontWeight: 600,
								cursor: "pointer",
								border: "1px solid var(--primary)",
								background: timeMode === mode ? "var(--primary)" : "transparent",
								color: timeMode === mode ? "var(--primary-foreground, #fff)" : "var(--primary)",
							}}
						>
							{label}
						</button>
					))}
				</div>

				<table className={styles.detailsTable}>
					<tbody>
						<tr>
							<th colSpan={2} style={{ textAlign: "center", color: "var(--primary)" }}>
								Panchanga
							</th>
						</tr>
						<tr>
							<th>Lamikkhok:</th>
							<td>{limbLine(detail.tithi)}</td>
						</tr>
						<tr>
							<th>Mangyuk:</th>
							<td>{limbLine(detail.nak)}</td>
						</tr>
						<tr>
							<th>Samyuk:</th>
							<td>{limbLine(detail.yoga)}</td>
						</tr>
						<tr>
							<th>Khok:</th>
							<td>
								({pad2(detail.karana.serial)}) {detail.karana.name} <span style={{ opacity: 0.65 }}>upto</span>{" "}
								{fmt(detail.karana.endingMomentHours)}
								<p>
									({pad2(detail.karana2.serial)}) {detail.karana2.name} <span style={{ opacity: 0.65 }}>upto</span>{" "}
									{fmt(detail.karana2.endingMomentHours)}
								</p>
							</td>
						</tr>
						<tr>
							<th>Kirat Day:</th>
							<td>{detail.kiratDayName}</td>
						</tr>
					</tbody>
				</table>

				<table className={styles.detailsTable}>
					<tbody>
						<tr>
							<th colSpan={2} style={{ textAlign: "center", color: "var(--primary)" }}>
								Astronomical Information
							</th>
						</tr>
						<tr>
							<th>Labhrang:</th>
							<td>{detail.labhrang}</td>
						</tr>
						<tr>
							<th>Sun Mangyuk:</th>
							<td>
								({pad2(detail.sunMangyuk.serial)}) {detail.sunMangyuk.name}
							</td>
						</tr>
						<tr>
							<th>Moon Sign:</th>
							<td>
								{detail.moonSign.symbol} {detail.moonSign.kiratName} - {detail.moonSign.westernName} —{" "}
								{detail.moonSign.degInSign.toFixed(2)}° into sign
								{detail.moonSign.changes && (
									<p>
										<span style={{ opacity: 0.65 }}>upto</span> {fmt(detail.moonSign.endingMomentHours)}
									</p>
								)}
							</td>
						</tr>
						<tr>
							<th>Sun Sign:</th>
							<td>
								{detail.sunSign.symbol} {detail.sunSign.kiratName} - {detail.sunSign.westernName} —{" "}
								{detail.sunSign.degInSign.toFixed(2)}° into sign
							</td>
						</tr>
					</tbody>
				</table>

				<table className={styles.detailsTable}>
					<tbody>
						<tr>
							<th colSpan={2} style={{ textAlign: "center", color: "var(--primary)" }}>
								Moon Mangyuk Padas — this Kirat Day
							</th>
						</tr>
						{detail.moonPadas.length === 0 ? (
							<tr>
								<th>Padas:</th>
								<td>—</td>
							</tr>
						) : (
							detail.moonPadas.map((p, i) => (
								<tr key={i}>
									<th>
										({pad2(p.nakSerial)}) {p.nakName} — Pada {p.padaNum}
									</th>
									<td>
										<span style={{ opacity: 0.65 }}>upto</span> {fmt(p.endingMomentHours)}
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			<div className={styles.infoBox}>
				<table className={styles.detailsTable}>
					<tbody>
						<tr>
							<th colSpan={2} style={{ textAlign: "center", color: "var(--primary)" }}>
								Astronomical Data
							</th>
						</tr>
						<tr>
							<th>Sunrise:</th>
							<td>🕒 {detail.noSunrise ? "— (no sunrise)" : `${formatClock12(detail.sunriseFrac)} local`}</td>
						</tr>
						<tr>
							<th>Sunset:</th>
							<td>🕒 {detail.noSunset ? "— (no sunset)" : `${formatClock12(detail.sunsetFrac)} local`}</td>
						</tr>
						<tr>
							<th>Day Duration:</th>
							<td>{formatDurationHM(detail.dayDurationHours)}</td>
						</tr>
						<tr>
							<th>Night Duration:</th>
							<td>{formatDurationHM(detail.nightDurationHours)}</td>
						</tr>
						<tr>
							<th>Solar Noon:</th>
							<td>🕒 {formatClock12(detail.solarNoonFrac)} local</td>
						</tr>
						<tr>
							<th>Ayanamsha:</th>
							<td>{formatDMSPlain(detail.ayanamshaDeg)} (Lahiri)</td>
						</tr>
						<tr>
							<th>Julian Day:</th>
							<td>{detail.julianDay.toFixed(6)}</td>
						</tr>
					</tbody>
				</table>

				<table className={styles.detailsTable}>
					<tbody>
						<tr>
							<th colSpan={2} style={{ textAlign: "center", color: "var(--primary)" }}>
								Inauspicious Timing
							</th>
						</tr>
						<tr>
							<th>Yem Phakmura:</th>
							<td>{yemPhakmura ? `${fmtAbs(yemPhakmura.startHours)} to ${fmtAbs(yemPhakmura.endHours)}` : "—"}</td>
						</tr>
						<tr>
							<th>Gulakai Kala:</th>
							<td>{gulakaiKala ? `${fmtAbs(gulakaiKala.startHours)} to ${fmtAbs(gulakaiKala.endHours)}` : "—"}</td>
						</tr>
						<tr>
							<th>Yamaganda Kala:</th>
							<td>{yamagandaKala ? `${fmtAbs(yamagandaKala.startHours)} to ${fmtAbs(yamagandaKala.endHours)}` : "—"}</td>
						</tr>
						<tr>
							<th>Tong:</th>
							<td>
								{tong?.current
									? tong.current.state === "full"
										? `${tong.current.name} — all day`
										: tong.current.state === "upto"
											? `${tong.current.name} upto ${fmt(tong.current.momentHours)}`
											: `${tong.current.name} from ${fmt(tong.current.momentHours)}`
									: "None today"}
								{tong?.next && (
									<p>
										Next: {tong.next.name} from {fmt(tong.next.momentHours)}
									</p>
								)}
							</td>
						</tr>
						<tr>
							<th>Saran:</th>
							<td>
								{saran
									? saran.state === "full"
										? "All day"
										: `${saran.state} ${fmt(saran.momentHours)}`
									: "—"}
							</td>
						</tr>
						<tr>
							<th>Nganet:</th>
							<td>
								{nganet
									? nganet.state === "full"
										? "All day"
										: `${nganet.state} ${fmt(nganet.momentHours)}`
									: "—"}
							</td>
						</tr>
					</tbody>
				</table>

				<table className={styles.detailsTable}>
					<tbody>
						<tr>
							<th colSpan={2} style={{ textAlign: "center", color: "var(--primary)" }}>
								Residence and Direction
							</th>
						</tr>
						<tr>
							<th>Sammang Mura:</th>
							<td>{staticDay?.SammangMura || "Coming Soon"}</td>
						</tr>
						{residenceRows("Midhung Yangdhok", detail.residence.midhung)}
						{residenceRows("Hangsam Yangdhok", detail.residence.hangsam)}
						{residenceRows("Chrang Yangdhok", detail.residence.chrang)}
						{residenceRows("Singlaba Yangdhok", detail.residence.singlaba)}
						<tr>
							<th>Akwanma Pisang:</th>
							<td>{staticDay?.AkwanamangSikkum || "Coming Soon"}</td>
						</tr>
						<tr>
							<th>Nagamang Pisang:</th>
							<td>{staticDay?.NagaSikkum || "Coming Soon"}</td>
						</tr>
						<tr>
							<th>Sari Kap:</th>
							<td>{staticDay?.SariKap || "Coming Soon"}</td>
						</tr>
					</tbody>
				</table>

				<table className={styles.detailsTable}>
					<tbody>
						<tr>
							<td>
								<b>Notes:</b>
								<ol style={{ padding: 10 }}>
									<li>Kirat day is measured from one sunrise to the next sunrise.</li>
									<li>All Kirat Yenlon calculations are based on the sunrise of the selected date.</li>
								</ol>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
}
