"use client";

import { useState } from "react";

import { gregorianToKirat, kiratToGregorian } from "../../engine";
import { KIRAT_YELE_MONTHS } from "../../engine/yele";
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

const tabStyle = (active: boolean): React.CSSProperties => ({
	padding: "8px 18px",
	borderRadius: 999,
	fontSize: 13.5,
	fontWeight: 700,
	cursor: "pointer",
	border: "1px solid var(--primary)",
	background: active ? "var(--primary)" : "transparent",
	color: active ? "var(--primary-foreground, #fff)" : "var(--primary)",
});

function fmtLong(d: Date): string {
	return d.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

/**
 * Kirat Yele — Gregorian ⇄ Kirat solar-calendar date converter, ported
 * from the reference app. Dataset covers AD 2000–2100.
 */
export function YeleConverterPage({ onBack }: { onBack: () => void }) {
	const [tab, setTab] = useState<"ad2k" | "k2ad">("ad2k");

	const now = new Date();
	const todayKirat = gregorianToKirat(now.getFullYear(), now.getMonth() + 1, now.getDate());

	// Gregorian → Kirat
	const [adDate, setAdDate] = useState(`${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`);
	const adMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(adDate);
	const ad2k = adMatch ? gregorianToKirat(Number(adMatch[1]), Number(adMatch[2]), Number(adMatch[3])) : null;

	// Kirat → Gregorian
	const [kYear, setKYear] = useState(todayKirat ? String(todayKirat.kiratYear) : "5087");
	const [kMonth, setKMonth] = useState(todayKirat ? todayKirat.kiratMonth : 1);
	const [kDay, setKDay] = useState(todayKirat ? String(todayKirat.kiratDay) : "1");
	const k2ad =
		/^\d+$/.test(kYear) && /^\d+$/.test(kDay) ? kiratToGregorian(Number(kYear), kMonth, Number(kDay)) : null;

	return (
		<ToolPageShell
			title="Kirat Yele — Date Converter"
			note="Convert between the Gregorian (AD) calendar and the Kirat Yele Solar calendar — the twelve-month reckoning that begins each year at Makara Saṅkrānti (mid-January). Dataset covers AD 2000–2100."
			onBack={onBack}
		>
			{todayKirat && (
				<p style={{ textAlign: "center", fontSize: 14, marginBottom: 12 }}>
					Today: <b>{fmtLong(now)}</b> (AD) ·{" "}
					<b>
						{todayKirat.monthName} {todayKirat.kiratDay}, {todayKirat.kiratYear}
					</b>{" "}
					(Kirat Yele)
				</p>
			)}

			<div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 16 }}>
				<button type="button" style={tabStyle(tab === "ad2k")} onClick={() => setTab("ad2k")}>
					Gregorian → Kirat
				</button>
				<button type="button" style={tabStyle(tab === "k2ad")} onClick={() => setTab("k2ad")}>
					Kirat → Gregorian
				</button>
			</div>

			{tab === "ad2k" ? (
				<div style={{ textAlign: "center" }}>
					<label style={{ fontSize: 13 }}>
						Gregorian date{" "}
						<input type="date" value={adDate} onChange={(e) => setAdDate(e.target.value)} style={inputStyle} />
					</label>
					<div style={{ marginTop: 14, fontSize: 16 }}>
						{ad2k ? (
							<>
								<b>
									{ad2k.monthName} {ad2k.kiratDay}, {ad2k.kiratYear}
								</b>{" "}
								(Kirat Yele)
							</>
						) : (
							<span style={{ opacity: 0.7 }}>Enter a date between AD 2000 and 2100.</span>
						)}
					</div>
				</div>
			) : (
				<div style={{ textAlign: "center" }}>
					<div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
						<label style={{ fontSize: 13 }}>
							Kirat year{" "}
							<input
								type="number"
								value={kYear}
								onChange={(e) => setKYear(e.target.value)}
								placeholder="e.g. 5087"
								style={{ ...inputStyle, width: 110 }}
							/>
						</label>
						<label style={{ fontSize: 13 }}>
							Kirat month{" "}
							<select value={kMonth} onChange={(e) => setKMonth(Number(e.target.value))} style={inputStyle}>
								{KIRAT_YELE_MONTHS.map((name, i) => (
									<option key={name} value={i + 1}>
										{name}
									</option>
								))}
							</select>
						</label>
						<label style={{ fontSize: 13 }}>
							Kirat day{" "}
							<input
								type="number"
								value={kDay}
								onChange={(e) => setKDay(e.target.value)}
								placeholder="1–32"
								style={{ ...inputStyle, width: 90 }}
							/>
						</label>
					</div>
					<div style={{ marginTop: 14, fontSize: 16 }}>
						{k2ad ? (
							<>
								<b>{fmtLong(k2ad.adDate)}</b> (AD)
								<p style={{ fontSize: 13, opacity: 0.75, marginTop: 4 }}>
									{KIRAT_YELE_MONTHS[kMonth - 1]} in that year has {k2ad.maxDay} days.
								</p>
							</>
						) : (
							<span style={{ opacity: 0.7 }}>
								Enter a Kirat year between 5061 and 5161 and a valid day for the chosen month.
							</span>
						)}
					</div>
				</div>
			)}
		</ToolPageShell>
	);
}
