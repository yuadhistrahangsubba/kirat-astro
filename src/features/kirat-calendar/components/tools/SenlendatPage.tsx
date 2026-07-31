"use client";

import { useEffect, useMemo, useState } from "react";

import {
	computeSenlendatSlots,
	computeYenlonDetail,
	DEFAULT_PLACE,
	formatEndingTime,
	getNowInPlaceHours,
	type Slot,
	type TimeFormatMode,
} from "../../engine";
import styles from "../../kirat-calendar.module.css";
import { DateNavBar } from "./DateNavBar";
import { TimeFormatBar } from "./TimeFormatBar";
import { ToolPageShell } from "./ToolPageShell";

/**
 * Senlendat — Kirat planetary hours, ported from the reference app: a
 * Current Senlendat card (live), date navigation, and the 12 Day + 12
 * Night slot tables with the active slot highlighted.
 */
export function SenlendatPage({ onBack }: { onBack: () => void }) {
	const [date, setDate] = useState(new Date());
	const [timeMode, setTimeMode] = useState<TimeFormatMode>("12h");
	const [nowHours, setNowHours] = useState<number>(NaN);

	const baseYMD = { y: date.getFullYear(), mo: date.getMonth() + 1, d: date.getDate() };

	const data = useMemo(() => {
		try {
			const detail = computeYenlonDetail(baseYMD.y, baseYMD.mo, baseYMD.d, DEFAULT_PLACE);
			const slots = computeSenlendatSlots(
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
					<th>Senlendat</th>
					<th>Start Time</th>
					<th>End Time</th>
				</tr>
				{entries.map((s) => {
					const isCurrent = current !== null && s === current;
					return (
						<tr
							key={`${title}-${s.no}`}
							style={isCurrent ? { background: "color-mix(in oklch, var(--color-gold) 26%, transparent)", fontWeight: 700 } : undefined}
						>
							<th>{s.name}</th>
							<td>🕒 {fmt(s.startHours)}</td>
							<td>🕒 {fmt(s.endHours)}</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	);

	return (
		<ToolPageShell
			title="Senlendat — Kirat Planetary Hours"
			note="12 Day Senlendats (sunrise → sunset) and 12 Night Senlendats (sunset → next sunrise), cycling Thung, Tung, Saya, Singla, Pung, Payang, Khawa."
			onBack={onBack}
		>
			<div className={styles.infoBox} style={{ textAlign: "center", padding: 16 }}>
				<p style={{ fontWeight: 700, color: "var(--primary)" }}>Current Senlendat</p>
				{current ? (
					<>
						<p style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>{current.name}</p>
						<p style={{ fontSize: 13, marginTop: 2 }}>{current.result}</p>
						<p style={{ fontSize: 13, marginTop: 4 }}>
							Start: <b>{fmt(current.startHours)}</b> · End: <b>{fmt(current.endHours)}</b>
						</p>
						<p style={{ fontSize: 13 }}>
							Remaining: <b>{remainingLabel(current.endHours - nowHours)}</b>
						</p>
					</>
				) : (
					<p style={{ marginTop: 4, fontSize: 13 }}>
						The selected date&apos;s Kirat day isn&apos;t active right now — pick Today to follow the live Senlendat.
					</p>
				)}
			</div>

			<DateNavBar date={date} onChange={setDate} />
			<TimeFormatBar value={timeMode} onChange={setTimeMode} />

			{data ? (
				<div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
					{slotTable("Day Senlendat", data.slots.dayEntries)}
					{slotTable("Night Senlendat", data.slots.nightEntries)}
				</div>
			) : (
				<p style={{ textAlign: "center" }}>Not available for this date.</p>
			)}
		</ToolPageShell>
	);
}

export function remainingLabel(hours: number): string {
	if (!isFinite(hours) || hours < 0) return "—";
	const totalSec = Math.floor(hours * 3600);
	const h = Math.floor(totalSec / 3600);
	const m = Math.floor((totalSec % 3600) / 60);
	const s = totalSec % 60;
	const pad2 = (n: number) => String(n).padStart(2, "0");
	return `${h > 0 ? `${h}h ` : ""}${pad2(m)}m ${pad2(s)}s`;
}
