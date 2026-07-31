import { motion } from "motion/react";

import { MONTHS } from "../data/months";
import { computeDayCellInfo, DEFAULT_PLACE, getKiratDayNumber, getKiratMonthHeaderText } from "../engine";
import styles from "../kirat-calendar.module.css";

const WEEKDAYS = [
  { kirat: "ᤋᤧᤏᤧ", en: "Sun" },
  { kirat: "ᤑᤥᤖᤠ", en: "Mon" },
  { kirat: "ᤔᤡᤰ", en: "Tue" },
  { kirat: "ᤂᤧᤰ", en: "Wed" },
  { kirat: "ᤁᤢᤖᤢ", en: "Thu" },
  { kirat: "ᤑᤛᤢᤵ", en: "Fri" },
  { kirat: "ᤛᤧᤴ", en: "Sat" },
];

interface YearGridProps {
  year: number;
  today: Date;
  onJumpToDate?: (year: number, month: number, day: number) => void;
  /**
   * Set false for the hidden PDF-export clone. Framer Motion leaves an
   * inline `transform`/`opacity` style on every `motion.*` element even
   * after its animation has long settled, and html2canvas-pro can render
   * an element carrying a lingering `transform` as a solid black box
   * instead of its real content — exactly the artifact that showed up
   * across a couple of month cards in exported PDFs. The visible,
   * on-screen grid keeps its entrance animation; the export-only clone
   * renders fully static, transform-free markup instead.
   */
  animate?: boolean;
}

/** The 12-month grid itself — pulled out of YearView so the PDF export's
 * hidden clone can render just the grid under a static banner, without
 * the interactive nav controls (prev/next year, back, save) that don't
 * mean anything inside an exported document. */
export function YearGrid({ year, today, onJumpToDate, animate = true }: YearGridProps) {
  return (
    <div className={styles.yearGrid}>
      {MONTHS.map((monthName, m) => {
        const card = (
          <YearMonthCard
            monthName={monthName}
            month={m}
            year={year}
            today={today}
            onJumpToDate={onJumpToDate ?? (() => {})}
            animate={animate}
          />
        );
        return animate ? (
          <motion.div
            key={monthName}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: m * 0.03, ease: "easeOut" }}
          >
            {card}
          </motion.div>
        ) : (
          <div key={monthName}>{card}</div>
        );
      })}
    </div>
  );
}

function YearMonthCard({
  monthName,
  month,
  year,
  today,
  onJumpToDate,
  animate,
}: {
  monthName: string;
  month: number;
  year: number;
  today: Date;
  onJumpToDate: (year: number, month: number, day: number) => void;
  animate: boolean;
}) {
  const firstWeekday = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const kiratMonth = getKiratMonthHeaderText(year, month + 1);

  return (
    <div className={styles.yearMonthCard}>
      <div className={styles.yearMonthTitle}>
        {monthName}
        <br />
        <small>{kiratMonth}</small>
      </div>
      <div className={styles.yearMonthWeekdays}>
        {WEEKDAYS.map((wd) => (
          <span key={wd.en}>
            <p style={{ fontFamily: "'XenoType LIF Ilam'" }}>{wd.kirat}</p>
            {wd.en}
          </span>
        ))}
      </div>
      <div className={styles.yearMonthDays}>
        {Array.from({ length: firstWeekday }, (_, i) => (
          <span key={`empty-${i}`} className={styles.yvEmpty} />
        ))}
        {Array.from({ length: totalDays }, (_, i) => {
          const day = i + 1;
          const kiratDate = getKiratDayNumber(year, month + 1, day);
          const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
          const cellInfo = computeDayCellInfo(year, month + 1, day, DEFAULT_PLACE);
          const className = [styles.yvDay, isToday && styles.yvToday].filter(Boolean).join(" ");
          const content = (
            <>
              <span className={styles.yvMangyuk}>{cellInfo?.mangyukName || ""}</span>
              <span className={styles.yvAd}>{day}</span>
              <span className={styles.yvKirat}>{kiratDate}</span>
              <span className={styles.yvLamikkhok}>{cellInfo?.lamikkhokName || ""}</span>
            </>
          );
          return animate ? (
            <motion.span
              key={day}
              className={className}
              whileTap={{ scale: 0.88 }}
              onClick={() => onJumpToDate(year, month, day)}
            >
              {content}
            </motion.span>
          ) : (
            <span key={day} className={className} onClick={() => onJumpToDate(year, month, day)}>
              {content}
            </span>
          );
        })}
      </div>
    </div>
  );
}
