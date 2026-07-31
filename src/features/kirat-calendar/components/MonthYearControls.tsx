"use client";

import { motion } from "motion/react";

import { MONTHS } from "../data/months";
import styles from "../kirat-calendar.module.css";
import { Dropdown } from "./Dropdown";

const MONTH_OPTIONS = MONTHS.map((m, i) => ({ value: i, label: m }));
// 2000-2100 — the range the engine's Yele dataset covers
const YEAR_OPTIONS = Array.from({ length: 2100 - 2000 + 1 }, (_, i) => {
  const y = 2000 + i;
  return { value: y, label: String(y) };
});

interface MonthYearControlsProps {
  month: number;
  year: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSelectMonth: (month: number) => void;
  onSelectYear: (year: number) => void;
}

export function MonthYearControls({
  month,
  year,
  onPrevMonth,
  onNextMonth,
  onSelectMonth,
  onSelectYear,
}: MonthYearControlsProps) {
  return (
    <div className={styles.controls}>
      <motion.button whileTap={{ scale: 0.9 }} onClick={onPrevMonth} aria-label="Previous month">
        ◀
      </motion.button>

      <Dropdown value={month} options={MONTH_OPTIONS} onChange={onSelectMonth} ariaLabel="Select month" />
      <Dropdown value={year} options={YEAR_OPTIONS} onChange={onSelectYear} ariaLabel="Select year" />

      <motion.button whileTap={{ scale: 0.9 }} onClick={onNextMonth} aria-label="Next month">
        ▶
      </motion.button>
    </div>
  );
}
