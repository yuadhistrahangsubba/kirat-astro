"use client";

import { useMemo, useState } from "react";

import {
	AYANAMSHA_SYSTEMS,
	ayanamshaSystem,
	computeBodyPositions,
	DEFAULT_PLACE,
	formatSiderealLon,
	jdFromLocalDateTime,
	siderealToMangyukPada,
	type AyanamshaKey,
} from "../../engine";
import styles from "../../kirat-calendar.module.css";
import { ToolPageShell } from "./ToolPageShell";

const pad2 = (n: number) => String(n).padStart(2, "0");

const inputStyle: React.CSSProperties = {
	padding: "8px 12px",
	borderRadius: 10,
	border: "1px solid color-mix(in oklch, var(--color-gold) 55%, transparent)",
	background: "color-mix(in oklch, var(--card) 80%, transparent)",
	color: "var(--foreground)",
	fontSize: 14,
};

/**
 * Planets — sidereal longitude, Mangyuk and Mangyuk Pada for all ten
 * bodies at any local date & time, ported from the reference app's
 * "Astronomical Data" section.
 */
export function PlanetsPage({ onBack }: { onBack: () => void }) {
	const now = new Date();
	const [dateStr, setDateStr] = useState(
		`${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`,
	);
	const [timeStr, setTimeStr] = useState(`${pad2(now.getHours())}:${pad2(now.getMinutes())}`);
	const [ayanamshaKey, setAyanamshaKey] = useState<AyanamshaKey>("lahiri");

	const rows = useMemo(() => {
		const dm = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
		const tm = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(timeStr);
		if (!dm || !tm) return null;
		try {
			const jd = jdFromLocalDateTime(
				Number(dm[1]),
				Number(dm[2]),
				Number(dm[3]),
				Number(tm[1]),
				Number(tm[2]),
				Number(tm[3] ?? 0),
				DEFAULT_PLACE,
			);
			const ayanamshaDeg = ayanamshaSystem(ayanamshaKey).calc(jd);
			return computeBodyPositions(jd, ayanamshaDeg);
		} catch {
			return null;
		}
	}, [dateStr, timeStr, ayanamshaKey]);

	return (
		<ToolPageShell
			title="Planets — Astronomical Data"
			note={`Sidereal longitude, Mangyuk (Nakshatra) and Mangyuk Pada for all ten bodies at the selected local date & time (${DEFAULT_PLACE.name}).`}
			onBack={onBack}
		>
			<div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
				<label style={{ fontSize: 13 }}>
					Date{" "}
					<input type="date" value={dateStr} onChange={(e) => setDateStr(e.target.value)} style={inputStyle} />
				</label>
				<label style={{ fontSize: 13 }}>
					Time{" "}
					<input type="time" value={timeStr} onChange={(e) => setTimeStr(e.target.value)} style={inputStyle} />
				</label>
				<label style={{ fontSize: 13 }}>
					Ayanamsha{" "}
					<select
						value={ayanamshaKey}
						onChange={(e) => setAyanamshaKey(e.target.value as AyanamshaKey)}
						style={inputStyle}
					>
						{AYANAMSHA_SYSTEMS.map((s) => (
							<option key={s.key} value={s.key}>
								{s.label}
							</option>
						))}
					</select>
				</label>
			</div>

			{rows ? (
				<div style={{ overflowX: "auto" }}>
					<table
						className={styles.senlendatDetailsTable}
						style={{ width: "100%", borderCollapse: "collapse", textAlign: "center" }}
					>
						<tbody>
							<tr>
								<th>Planet</th>
								<th>Sidereal Longitude</th>
								<th>Mangyuk</th>
								<th>Mangyuk Pada</th>
							</tr>
							{rows.map((b) => {
								const mp = siderealToMangyukPada(b.siderealLon);
								return (
									<tr key={b.key}>
										<th>{b.label}</th>
										<td>{formatSiderealLon(b.siderealLon)}</td>
										<td>
											({pad2(mp.mangyukSerial)}) {mp.mangyukName}
										</td>
										<td>{mp.pada}</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			) : (
				<p style={{ textAlign: "center" }}>Enter a valid date and time.</p>
			)}
		</ToolPageShell>
	);
}
