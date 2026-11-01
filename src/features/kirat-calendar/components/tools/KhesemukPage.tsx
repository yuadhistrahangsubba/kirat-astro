"use client";

import { useMemo, useState } from "react";

import {
	computeYenlonDetail,
	DEFAULT_PLACE,
	formatEndingTime,
	KHESE_MAP,
	khesemukInclusiveCount,
	khesemukIndexFromCount,
	MANGYUK,
	type TimeFormatMode,
} from "../../engine";
import styles from "../../kirat-calendar.module.css";
import { DateNavBar } from "./DateNavBar";
import { TimeFormatBar } from "./TimeFormatBar";
import { ToolPageShell } from "./ToolPageShell";
import { todayInZone } from "../../lib/today";

const pad2 = (n: number) => String(n).padStart(2, "0");

/**
 * Khesemuk — Moon Mangyuk strength (Tarabala), ported from the reference
 * app: the current Moon Mangyuk (reused straight from the Panchanga) and
 * its Khesemuk result relative to every possible Birth Mangyuk.
 */
export function KhesemukPage() {
	const [date, setDate] = useState(() => todayInZone());
	const [timeMode, setTimeMode] = useState<TimeFormatMode>("12h");

	const baseYMD = { y: date.getFullYear(), mo: date.getMonth() + 1, d: date.getDate() };

	const detail = useMemo(() => {
		try {
			return computeYenlonDetail(baseYMD.y, baseYMD.mo, baseYMD.d, DEFAULT_PLACE);
		} catch {
			return null;
		}
	}, [baseYMD.y, baseYMD.mo, baseYMD.d]);

	if (!detail) {
		return (
			<ToolPageShell title="Khesemuk — Moon Mangyuk Strength (Tarabala)">
				<p style={{ textAlign: "center" }}>Not available for this date.</p>
			</ToolPageShell>
		);
	}

	const fmt = (endingMomentHours: number) => formatEndingTime(detail.refHours, endingMomentHours, baseYMD, timeMode);

	const currentIdx = detail.nak.serial;
	const nextIdx = detail.nak.nextSerial;
	const hasTransition =
		isFinite(detail.nak.endingMomentHours) && detail.nak.endingMomentHours <= detail.totalKiratDayHours;

	return (
		<ToolPageShell
			title="Khesemuk — Moon Mangyuk Strength (Tarabala)"
			note="The Moon's current Mangyuk (Kirat Nakshatra) — reused directly from the Panchanga — and its Khesemuk (Tarabala) result relative to every possible Birth Mangyuk."
		>
			<div className={styles.infoBox} style={{ textAlign: "center", padding: 16 }}>
				<p style={{ fontWeight: 700, color: "var(--primary)" }}>Current Mangyuk</p>
				<p style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>
					({pad2(currentIdx)}) {detail.nak.name}
				</p>
				<p style={{ fontSize: 13, marginTop: 4 }}>
					Ends: <b>{fmt(detail.nak.endingMomentHours)}</b> · Next:{" "}
					<b>
						({pad2(nextIdx)}) {detail.nak.nextName}
					</b>
				</p>
			</div>

			<DateNavBar date={date} onChange={setDate} />
			<TimeFormatBar value={timeMode} onChange={setTimeMode} />

			<table className={styles.senlendatDetailsTable} style={{ width: "100%", borderCollapse: "collapse", textAlign: "center" }}>
				<tbody>
					<tr>
						<th colSpan={3} style={{ fontSize: 14, color: "var(--primary)", textAlign: "center" }}>
							Khesemuk Results — by Birth Mangyuk
						</th>
					</tr>
					<tr>
						<th>Birth Mangyuk</th>
						<th>Khese</th>
						<th>Result</th>
					</tr>
					{MANGYUK.map((row) => {
						const khese = KHESE_MAP[khesemukIndexFromCount(khesemukInclusiveCount(row.n, currentIdx))];
						const nextKhese = hasTransition
							? KHESE_MAP[khesemukIndexFromCount(khesemukInclusiveCount(row.n, nextIdx))]
							: null;
						return (
							<tr key={row.n}>
								<th>
									({pad2(row.n)}) {row.name}
								</th>
								<td>
									{khese?.name}
									{nextKhese && <p style={{ fontSize: 12 }}>from {fmt(detail.nak.endingMomentHours)}: {nextKhese.name}</p>}
								</td>
								<td>
									{khese?.result}
									{nextKhese && <p style={{ fontSize: 12 }}>{nextKhese.result}</p>}
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>

			<p className="mt-3 text-sm leading-relaxed text-foreground/75">
				Khesemuk counts inclusively from a Birth Mangyuk to today&apos;s Moon Mangyuk (wrapping after 27), divides by
				9, and uses the remainder (0 treated as 9) to look up a Khese and its result. Find your own Birth
				Mangyuk&apos;s row for today&apos;s reading; when the Moon changes Mangyuk before the next sunrise, the &quot;from&quot;
				sub-rows show the updated results after the transition.
			</p>
		</ToolPageShell>
	);
}
