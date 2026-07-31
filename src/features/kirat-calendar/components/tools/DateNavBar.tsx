"use client";

import { motion } from "motion/react";

/** ‹ Previous | date label | Today | Next › — the reference app's date nav. */
export function DateNavBar({ date, onChange }: { date: Date; onChange: (next: Date) => void }) {
	function shift(days: number) {
		const next = new Date(date);
		next.setDate(next.getDate() + days);
		onChange(next);
	}

	const label = date.toLocaleDateString("en-US", {
		weekday: "short",
		day: "numeric",
		month: "short",
		year: "numeric",
	});

	const btnStyle: React.CSSProperties = {
		padding: "8px 14px",
		borderRadius: 999,
		fontSize: 13,
		fontWeight: 600,
		cursor: "pointer",
		border: "1px solid color-mix(in oklch, var(--color-gold) 60%, transparent)",
		background: "color-mix(in oklch, var(--card) 72%, transparent)",
		color: "var(--foreground)",
	};

	return (
		<div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, flexWrap: "wrap", margin: "12px 0" }}>
			<motion.button whileTap={{ scale: 0.94 }} style={btnStyle} onClick={() => shift(-1)}>
				‹ Previous
			</motion.button>
			<span style={{ fontWeight: 700, fontSize: 14, minWidth: 150, textAlign: "center" }}>{label}</span>
			<motion.button whileTap={{ scale: 0.94 }} style={btnStyle} onClick={() => onChange(new Date())}>
				Today
			</motion.button>
			<motion.button whileTap={{ scale: 0.94 }} style={btnStyle} onClick={() => shift(1)}>
				Next ›
			</motion.button>
		</div>
	);
}
