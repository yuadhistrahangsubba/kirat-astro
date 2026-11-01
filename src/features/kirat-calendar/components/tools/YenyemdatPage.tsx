"use client";

import { useEffect, useMemo, useState } from "react";

import {
	computeYenlonDetail,
	computeYenyemSlots,
	DEFAULT_PLACE,
	formatEndingTime,
	getNowInPlaceHours,
	type Slot,
	type TimeFormatMode,
} from "../../engine";
import styles from "../../kirat-calendar.module.css";
import { DateNavBar } from "./DateNavBar";
import { remainingLabel } from "./SenlendatPage";
import { TimeFormatBar } from "./TimeFormatBar";
import { ToolPageShell } from "./ToolPageShell";
import { todayInZone } from "../../lib/today";

/**
 * Yenyem — Kirat eightfold time division, ported from the reference app:
 * a Current Yenyem card (live), date navigation, and the 8 Day + 8 Night
 * slot tables with meanings/results and the active slot highlighted.
 */
export function YenyemdatPage() {
	const [date, setDate] = useState(() => todayInZone());
	const [timeMode, setTimeMode] = useState<TimeFormatMode>("12h");
	const [nowHours, setNowHours] = useState<number>(NaN);

	const baseYMD = { y: date.getFullYear(), mo: date.getMonth() + 1, d: date.getDate() };

	const data = useMemo(() => {
		try {
			const detail = computeYenlonDetail(baseYMD.y, baseYMD.mo, baseYMD.d, DEFAULT_PLACE);
			const slots = computeYenyemSlots(
				detail.weekdayIdx,
				detail.refHours,
				detail.dayDurationHours,
				detail.nightDurationHours,
			);
			return { detail, slots };
		} catch {
			return null;
		}
	}, [baseYMD.y, baseYMD.mo, baseYMD.d]);

	const { y: baseY, mo: baseMo, d: baseD } = baseYMD;
	useEffect(() => {
		const tick = () => setNowHours(getNowInPlaceHours({ y: baseY, mo: baseMo, d: baseD }, DEFAULT_PLACE.timezone));
		tick();
		const interval = setInterval(tick, 1000);
		return () => clearInterval(interval);
	}, [baseY, baseMo, baseD]);

	const fmt = (absHours: number) => formatEndingTime(0, absHours, baseYMD, timeMode);

	const allSlots = data ? [...data.slots.dayEntries, ...data.slots.nightEntries] : [];
	const current = allSlots.find((s) => nowHours >= s.startHours && nowHours < s.endHours) ?? null;

	const slotTable = (title: string, entries: Slot[]) => (
		<table className={styles.senlendatDetailsTable} style={{ width: "100%", borderCollapse: "collapse", textAlign: "center" }}>
			<tbody>
				<tr>
					<th colSpan={3} style={{ fontSize: 14, color: "var(--primary)", textAlign: "center" }}>
						{title}
					</th>
				</tr>
				<tr>
					<th>Yenyem</th>
					<th>Timing</th>
					<th>Result</th>
				</tr>
				{entries.map((s) => {
					const isCurrent = current !== null && s === current;
					return (
						<tr
							key={`${title}-${s.no}`}
							style={isCurrent ? { background: "color-mix(in oklch, var(--color-gold) 26%, transparent)", fontWeight: 700 } : undefined}
						>
							<th>
								{s.name}
								<p style={{ fontWeight: 400 }}>({s.meaning})</p>
							</th>
							<td>
								🕒 {fmt(s.startHours)} to {fmt(s.endHours)}
							</td>
							<td>{s.result}</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	);

	return (
		<ToolPageShell
			title="Yenyem — Kirat Time Division"
			note="8 Day Yenyems (sunrise → sunset) and 8 Night Yenyems (sunset → next sunrise), cycling Mudo, Membupek, Labo, Mangghu, Siya, Pano, Tung."
		>
			<div className={styles.infoBox} style={{ textAlign: "center", padding: 16 }}>
				<p style={{ fontWeight: 700, color: "var(--primary)" }}>Current Yenyem</p>
				{current ? (
					<>
						<p style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>{current.name}</p>
						<p style={{ fontSize: 13 }}>
							English Meaning: <b>{current.meaning}</b> · Result: <b>{current.result}</b>
						</p>
						<p style={{ fontSize: 13, marginTop: 4 }}>
							Start: <b>{fmt(current.startHours)}</b> · End: <b>{fmt(current.endHours)}</b>
						</p>
						<p style={{ fontSize: 13 }}>
							Remaining: <b>{remainingLabel(current.endHours - nowHours)}</b>
						</p>
					</>
				) : (
					<p style={{ marginTop: 4, fontSize: 13 }}>
						The selected date&apos;s Kirat day isn&apos;t active right now — pick Today to follow the live Yenyem.
					</p>
				)}
			</div>

			<DateNavBar date={date} onChange={setDate} />
			<TimeFormatBar value={timeMode} onChange={setTimeMode} />

			{data ? (
				<div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
					{slotTable("Day Yenyem", data.slots.dayEntries)}
					{slotTable("Night Yenyem", data.slots.nightEntries)}
				</div>
			) : (
				<p style={{ textAlign: "center" }}>Not available for this date.</p>
			)}
		</ToolPageShell>
	);
}
