"use client";

import { useRef } from "react";

import { MONTHS } from "../data/months";
import { computeDayCellInfo, DEFAULT_PLACE, getKiratDayNumber, getKiratMonthHeaderText } from "../engine";
import styles from "../kirat-calendar.module.css";
import { DayCell } from "./DayCell";

const WEEKDAYS = [
  { kirat: "ᤋᤧᤏᤧ", en: "Sun" },
  { kirat: "ᤑᤥᤖᤠᤠ", en: "Mon" },
  { kirat: "ᤔᤡᤰ", en: "Tue" },
  { kirat: "ᤂᤧᤰ", en: "Wed" },
  { kirat: "ᤁᤢᤖᤢᤵ", en: "Thu" },
  { kirat: "ᤑᤛᤢᤵ", en: "Fri" },
  { kirat: "ᤛᤧᤴ", en: "Sat" },
];

interface CalendarGridProps {
  month: number;
  year: number;
  today: Date;
  selectedDate: Date;
  onDayClick: (day: number) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

/** Only treat a touch gesture as a month-swipe if horizontal movement
 * dominates vertical movement, and it travels a decent distance. */
const SWIPE_MIN_DISTANCE = 50;
const SWIPE_DIRECTION_RATIO = 1.5;

export function CalendarGrid({
  month,
  year,
  today,
  selectedDate,
  onDayClick,
  onPrevMonth,
  onNextMonth,
}: CalendarGridProps) {
  const touchStart = useRef({ x: 0, y: 0 });

  function handleTouchStart(e: React.TouchEvent) {
    const touch = e.changedTouches[0];
    if (!touch) return;
    touchStart.current = { x: touch.screenX, y: touch.screenY };
  }

  function handleTouchEnd(e: React.TouchEvent) {
    const touch = e.changedTouches[0];
    if (!touch) return;
    const dx = touch.screenX - touchStart.current.x;
    const dy = touch.screenY - touchStart.current.y;
    if (Math.abs(dx) > SWIPE_MIN_DISTANCE && Math.abs(dx) > Math.abs(dy) * SWIPE_DIRECTION_RATIO) {
      if (dx < 0) onNextMonth();
      else onPrevMonth();
    }
  }

  const kiratMonth = getKiratMonthHeaderText(year, month + 1);

  const firstWeekday = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  return (
    <div className={styles.calendar} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <div className={styles.monthTitle}>
        <div className={styles.monthTitleMain}>
          {MONTHS[month]} {year}
        </div>
        {kiratMonth && <div className={styles.monthTitleSub}>{kiratMonth}</div>}
      </div>

      <div className={styles.weekdays}>
        {WEEKDAYS.map((wd) => (
          <div key={wd.en}>
            <span lang="lif">{wd.kirat}</span>
            <br />
            {wd.en}
          </div>
        ))}
      </div>

      <div className={styles.days}>
        {Array.from({ length: firstWeekday }, (_, i) => (
          <div key={`empty-${i}`} className={styles.empty} />
        ))}
        {Array.from({ length: totalDays }, (_, i) => {
          const day = i + 1;
          const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
          const isSelected =
            day === selectedDate.getDate() &&
            month === selectedDate.getMonth() &&
            year === selectedDate.getFullYear();
          const cellInfo = computeDayCellInfo(year, month + 1, day, DEFAULT_PLACE);
          return (
            <DayCell
              key={day}
              day={day}
              kiratDate={getKiratDayNumber(year, month + 1, day)}
              mangyukName={cellInfo?.mangyukName}
              lamikkhokName={cellInfo?.lamikkhokName}
              isToday={isToday}
              isSelected={isSelected}
              onClick={() => onDayClick(day)}
            />
          );
        })}
      </div>
    </div>
  );
}
