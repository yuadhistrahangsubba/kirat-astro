"use client";

import { motion } from "motion/react";

import styles from "../kirat-calendar.module.css";

interface ActionBarProps {
	view: "month" | "year";
	onSelectMonth: () => void;
	onGoToday: () => void;
	onSelectYear: () => void;
}

/** Month | Today | Year pill switch — the active view renders as a filled gold pill. */
export function ActionBar({ view, onSelectMonth, onGoToday, onSelectYear }: ActionBarProps) {
	return (
		<div className={styles.actionBar}>
			<motion.button
				whileTap={{ scale: 0.94 }}
				className={`${styles.viewSwitchBtn} ${view === "month" ? styles.viewSwitchActive : ""}`}
				onClick={onSelectMonth}
			>
				Month
			</motion.button>
			<motion.button whileTap={{ scale: 0.94 }} className={styles.viewSwitchBtn} onClick={onGoToday}>
				Today
			</motion.button>
			<motion.button
				whileTap={{ scale: 0.94 }}
				className={`${styles.viewSwitchBtn} ${view === "year" ? styles.viewSwitchActive : ""}`}
				onClick={onSelectYear}
			>
				Year
			</motion.button>
		</div>
	);
}
