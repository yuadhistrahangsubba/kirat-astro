"use client";

import { useMemo, useState } from "react";

import {
	computeYenlonDetail,
	DEFAULT_PLACE,
	formatEndingTime,
	KIRAT_TITLUM_NAMES,
	SINGLABAMUK_RESULT_MAP,
	singlabamukCount,
	ZODIAC,
	ZODIAC_SYMBOLS,
	type TimeFormatMode,
} from "../../engine";
import styles from "../../kirat-calendar.module.css";
import { DateNavBar } from "./DateNavBar";
import { TimeFormatBar } from "./TimeFormatBar";
import { ToolPageShell } from "./ToolPageShell";
import { todayInZone } from "../../lib/today";

const pad2 = (n: number) => String(n).padStart(2, "0");

/**
 * Singlabamuk — Moon Titlum evaluation, ported from the reference app: the
 * Moon's current Titlum (Kirat zodiac sign, ~2.5 days each) and its result
 * relative to every possible Birth Titlum.
 */
export function SinglabamukPage({ onBack }: { onBack: () => void }) {
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
			<ToolPageShell title="Singlabamuk — Moon Titlum Evaluation" onBack={onBack}>
				<p style={{ textAlign: "center" }}>Not available for this date.</p>
			</ToolPageShell>
		);
	}

	const fmt = (endingMomentHours: number) => formatEndingTime(detail.refHours, endingMomentHours, baseYMD, timeMode);

	const currentIdx = detail.moonSign.idx + 1; // 1-based, 1=Anam … 12=Chakla
	const nextIdx = (currentIdx % 12) + 1;
	const hasTransition = detail.moonSign.changes;

	return (
		<ToolPageShell
			title="Singlabamuk — Moon Titlum Evaluation"
			note="The Moon's current Titlum (Kirat zodiac sign) — changes roughly every 2.5 days — and its Singlabamuk result relative to every possible Birth Titlum."
			onBack={onBack}
		>
			<div className={styles.infoBox} style={{ textAlign: "center", padding: 16 }}>
				<p style={{ fontWeight: 700, color: "var(--primary)" }}>Current Titlum</p>
				<p style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>
					({pad2(currentIdx)}) {detail.moonSign.symbol} {detail.moonSign.kiratName} - {detail.moonSign.westernName}
				</p>
				<p style={{ fontSize: 13, marginTop: 4 }}>
					{hasTransition ? (
						<>
							Ends: <b>{fmt(detail.moonSign.endingMomentHours)}</b> · Next:{" "}
							<b>
								({pad2(nextIdx)}) {KIRAT_TITLUM_NAMES[nextIdx - 1]}
							</b>
						</>
					) : (
						<>Continues past the next sunrise</>
					)}
				</p>
			</div>

			<DateNavBar date={date} onChange={setDate} />
			<TimeFormatBar value={timeMode} onChange={setTimeMode} />

			<table className={styles.senlendatDetailsTable} style={{ width: "100%", borderCollapse: "collapse", textAlign: "center" }}>
				<tbody>
					<tr>
						<th colSpan={2} style={{ fontSize: 14, color: "var(--primary)", textAlign: "center" }}>
							Singlabamuk Results — by Birth Titlum
						</th>
					</tr>
					<tr>
						<th>Birth Titlum</th>
						<th>Result</th>
					</tr>
					{KIRAT_TITLUM_NAMES.map((name, i) => {
						const rowIdx = i + 1;
						const result = SINGLABAMUK_RESULT_MAP[singlabamukCount(rowIdx, currentIdx)];
						const nextResult = hasTransition ? SINGLABAMUK_RESULT_MAP[singlabamukCount(rowIdx, nextIdx)] : null;
						return (
							<tr key={name}>
								<th>
									({pad2(rowIdx)}) {ZODIAC_SYMBOLS[i]} {name} - {ZODIAC[i]}
								</th>
								<td>
									{result}
									{nextResult && (
										<p style={{ fontSize: 12 }}>
											from {fmt(detail.moonSign.endingMomentHours)}: {nextResult}
										</p>
									)}
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>

			<p className="mt-3 text-sm leading-relaxed text-foreground/75">
				Singlabamuk counts inclusively from a Birth Titlum to today&apos;s Moon Titlum (wrapping after 12) and maps
				that number to a result — Auspicious, Sewa Needed, or Inauspicious. Find your own Birth Titlum&apos;s row for
				today&apos;s reading.
			</p>
		</ToolPageShell>
	);
}
