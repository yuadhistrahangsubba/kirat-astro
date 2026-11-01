"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

import styles from "../kirat-calendar.module.css";

interface DayCellProps {
  day: number;
  kiratDate: number | "";
  mangyukName?: string;
  lamikkhokName?: string;
  isToday: boolean;
  isSelected: boolean;
  /** Full date, e.g. "Saturday 31 October 2026" — the cell's accessible name. */
  label: string;
  onClick: () => void;
  /** Bumped by the Today button; a non-zero value flashes the cell and scrolls it into view. */
  pulseKey?: number;
  onPulseEnd?: () => void;
}

/**
 * One month-view day cell, following the reference app's layout: Mangyuk
 * name on top, the Gregorian date centered, the Kirat day number beside
 * it, and the Lamikkhok name along the bottom.
 */
export function DayCell({
  day,
  kiratDate,
  mangyukName,
  lamikkhokName,
  isToday,
  isSelected,
  label,
  onClick,
  pulseKey = 0,
  onPulseEnd,
}: DayCellProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();

  // Without this the Today button looked dead when today was already shown.
  useEffect(() => {
    if (!pulseKey) return;
    ref.current?.scrollIntoView({ block: "nearest", behavior: reducedMotion ? "auto" : "smooth" });
  }, [pulseKey, reducedMotion]);

  const className = [styles.day, isToday && styles.today, isSelected && styles.selected]
    .filter(Boolean)
    .join(" ");

  return (
    <motion.button
      ref={ref}
      type="button"
      data-day={day}
      className={className}
      aria-label={kiratDate ? `${label}, Kirat day ${kiratDate}` : label}
      aria-pressed={isSelected}
      aria-current={isToday ? "date" : undefined}
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 24 }}
    >
      {pulseKey > 0 && (
        <motion.span
          key={pulseKey}
          aria-hidden="true"
          className={styles.dayPulse}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0, 1, 0] }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          onAnimationComplete={onPulseEnd}
        />
      )}
      <div className={styles.dayMangyuk} aria-hidden="true">{mangyukName ?? ""}</div>
      <div className={styles.adDate} aria-hidden="true">{day}</div>
      <div className={styles.kiratDate} aria-hidden="true">{kiratDate}</div>
      <div className={styles.dayLamikkhok} aria-hidden="true">{lamikkhokName ?? ""}</div>
    </motion.button>
  );
}
