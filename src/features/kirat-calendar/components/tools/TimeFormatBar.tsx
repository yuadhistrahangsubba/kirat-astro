"use client";

import type { TimeFormatMode } from "../../engine";

const TIME_MODES: { mode: TimeFormatMode; label: string }[] = [
	{ mode: "12h", label: "12-Hour" },
	{ mode: "24h", label: "24-Hour" },
	{ mode: "24plus", label: "24+ Hour" },
];

/** The 12h / 24h / 24+ ending-time format toggle from the reference app. */
export function TimeFormatBar({
	value,
	onChange,
}: {
	value: TimeFormatMode;
	onChange: (mode: TimeFormatMode) => void;
}) {
	return (
		<div style={{ display: "flex", justifyContent: "center", gap: 8, margin: "12px 0" }}>
			{TIME_MODES.map(({ mode, label }) => (
				<button
					key={mode}
					type="button"
					aria-pressed={value === mode}
					onClick={() => onChange(mode)}
					style={{
						padding: "6px 14px",
						borderRadius: 999,
						fontSize: 13,
						fontWeight: 600,
						cursor: "pointer",
						border: "1px solid var(--primary)",
						background: value === mode ? "var(--primary)" : "transparent",
						color: value === mode ? "var(--primary-foreground, #fff)" : "var(--primary)",
					}}
				>
					{label}
				</button>
			))}
		</div>
	);
}
