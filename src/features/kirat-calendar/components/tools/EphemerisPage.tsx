"use client";

import { useMemo, useState } from "react";

import {
	AYANAMSHA_SYSTEMS,
	ayanamshaSystem,
	computeBodyPositions,
	formatRA,
	formatSiderealLon,
	jdAtUtMidnight,
	type AyanamshaKey,
} from "../../engine";
import styles from "../../kirat-calendar.module.css";
import { DateNavBar } from "./DateNavBar";
import { ToolPageShell } from "./ToolPageShell";

const selectStyle: React.CSSProperties = {
	padding: "8px 12px",
	borderRadius: 10,
	border: "1px solid color-mix(in oklch, var(--color-gold) 55%, transparent)",
	background: "color-mix(in oklch, var(--card) 80%, transparent)",
	color: "var(--foreground)",
	fontSize: 14,
};

function formatLatSigned(deg: number): string {
	const sign = deg < 0 ? "-" : "+";
	const abs = Math.abs(deg);
	const totalSec = Math.round(abs * 3600);
	const d = Math.floor(totalSec / 3600);
	const m = Math.floor((totalSec % 3600) / 60);
	const s = totalSec % 60;
	const pad2 = (n: number) => String(n).padStart(2, "0");
	return `${sign}${pad2(d)}° ${pad2(m)}′ ${pad2(s)}″`;
}

/**
 * Kirat Ephemeris — sidereal longitudes (and latitude/RA/distance) of all
 * ten bodies at 00:00 Universal Time on the selected date, ported from the
 * reference app's Ephemeris section.
 */
export function EphemerisPage({ onBack }: { onBack: () => void }) {
	const [date, setDate] = useState(new Date());
	const [ayanamshaKey, setAyanamshaKey] = useState<AyanamshaKey>("lahiri");

	const rows = useMemo(() => {
		try {
			const jd = jdAtUtMidnight(date.getFullYear(), date.getMonth() + 1, date.getDate());
			const ayanamshaDeg = ayanamshaSystem(ayanamshaKey).calc(jd);
			return computeBodyPositions(jd, ayanamshaDeg);
		} catch {
			return null;
		}
	}, [date, ayanamshaKey]);

	return (
		<ToolPageShell
			title="Kirat Ephemeris"
			note="Sidereal longitude of the ten bodies, calculated for 00:00 Universal Time (UT) on the selected date — tropical apparent geocentric coordinates, converted to sidereal via the Ayanamsha below."
			onBack={onBack}
		>
			<div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
				<label style={{ fontSize: 13 }}>
					Ayanamsha{" "}
					<select
						value={ayanamshaKey}
						onChange={(e) => setAyanamshaKey(e.target.value as AyanamshaKey)}
						style={selectStyle}
					>
						{AYANAMSHA_SYSTEMS.map((s) => (
							<option key={s.key} value={s.key}>
								{s.label}
							</option>
						))}
					</select>
				</label>
			</div>

			<DateNavBar date={date} onChange={setDate} />

			{rows ? (
				<div style={{ overflowX: "auto" }}>
					<table
						className={styles.senlendatDetailsTable}
						style={{ width: "100%", borderCollapse: "collapse", textAlign: "center", minWidth: 560 }}
					>
						<tbody>
							<tr>
								<th>Planet</th>
								<th>Sidereal Longitude</th>
								<th>Ecliptic Latitude</th>
								<th>Right Ascension</th>
								<th>Distance (AU)</th>
							</tr>
							{rows.map((b) => (
								<tr key={b.key}>
									<th>{b.label}</th>
									<td>{formatSiderealLon(b.siderealLon)}</td>
									<td>{formatLatSigned(b.eclipticLat)}</td>
									<td>{formatRA(b.raDeg)}</td>
									<td>{b.distanceAu.toFixed(6)}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			) : (
				<p style={{ textAlign: "center" }}>Not available for this date.</p>
			)}
		</ToolPageShell>
	);
}
