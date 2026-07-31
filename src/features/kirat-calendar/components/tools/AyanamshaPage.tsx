"use client";

import { useMemo } from "react";

import { AYANAMSHA_SYSTEMS, formatDMSPlain } from "../../engine";
import styles from "../../kirat-calendar.module.css";
import { ToolPageShell } from "./ToolPageShell";

/**
 * Ayanamsha — the major sidereal-zodiac reference systems and their
 * current values, ported from the reference app's Ayanamsha section.
 */
export function AyanamshaPage({ onBack }: { onBack: () => void }) {
	const rows = useMemo(() => {
		const now = new Date();
		const jd =
			Math.floor(
				new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).getTime() / 86400000,
			) +
			2440587.5 +
			(now.getUTCHours() + now.getUTCMinutes() / 60) / 24;
		return AYANAMSHA_SYSTEMS.map((s) => ({ label: s.label, value: s.calc(jd) }));
	}, []);

	return (
		<ToolPageShell
			title="Ayanamsha — Sidereal Zodiac Reference"
			note="The major Ayanamsha systems calculated in this app, and their current value in plain degrees, minutes and seconds."
			onBack={onBack}
		>
			<table
				className={styles.senlendatDetailsTable}
				style={{ width: "100%", borderCollapse: "collapse", textAlign: "center" }}
			>
				<tbody>
					<tr>
						<th>Ayanamsha</th>
						<th>Value</th>
					</tr>
					{rows.map((r) => (
						<tr key={r.label}>
							<th style={{ textAlign: "left" }}>{r.label}</th>
							<td>{formatDMSPlain(r.value)}</td>
						</tr>
					))}
				</tbody>
			</table>

			<p className="mt-3 text-sm leading-relaxed text-foreground/75">
				Each value is the Ayanamsha&apos;s own angular offset. Values are computed for the current moment and change
				extremely slowly — roughly one arcminute every 70–72 years — so they don&apos;t need their own date selector.
			</p>
		</ToolPageShell>
	);
}
