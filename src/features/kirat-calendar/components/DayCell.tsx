"use client";

import { motion } from "motion/react";

import styles from "../kirat-calendar.module.css";

interface DayCellProps {
  day: number;
  kiratDate: number | "";
  mangyukName?: string;
  lamikkhokName?: string;
  isToday: boolean;
  isSelected: boolean;
  onClick: () => void;
}

/**
 * One month-view day cell, following the reference app's layout: Mangyuk
 * name on top, the Gregorian date centered, the Kirat day number beside
 * it, and the Lamikkhok name along the bottom.
 */
export function DayCell({ day, kiratDate, mangyukName, lamikkhokName, isToday, isSelected, onClick }: DayCellProps) {
  const className = [styles.day, isToday && styles.today, isSelected && styles.selected]
    .filter(Boolean)
    .join(" ");

  return (
    <motion.div
      className={className}
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 24 }}
    >
      <div className={styles.dayMangyuk}>{mangyukName ?? ""}</div>
      <div className={styles.adDate}>{day}</div>
      <div className={styles.kiratDate}>{kiratDate}</div>
      <div className={styles.dayLamikkhok}>{lamikkhokName ?? ""}</div>
    </motion.div>
  );
}
