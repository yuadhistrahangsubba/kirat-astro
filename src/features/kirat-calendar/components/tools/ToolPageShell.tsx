"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

import styles from "../../kirat-calendar.module.css";

/**
 * Card wrapper for the tool pages ported from the reference app: section
 * title, an explanatory note, the tool body, and a back-to-calendar button.
 */
export function ToolPageShell({
	title,
	note,
	onBack,
	children,
}: {
	title: string;
	note?: string;
	onBack: () => void;
	children: ReactNode;
}) {
	return (
		<div className={styles.container}>
			<div className="mt-4 rounded-2xl border border-border/60 bg-card/60 px-5 py-5 shadow-[0_8px_24px_-12px_rgba(0,0,0,.25)] backdrop-blur-xl">
				<motion.button
					whileTap={{ scale: 0.96 }}
					className={styles.backBtn}
					onClick={onBack}
					style={{ marginBottom: 12 }}
				>
					◀ Back to Calendar
				</motion.button>

				<h2 className="text-center font-sans text-xl font-bold text-primary">{title}</h2>
				{note && <p className="mt-2 text-center text-sm text-foreground/75">{note}</p>}

				<div className="mt-4">{children}</div>
			</div>
		</div>
	);
}
