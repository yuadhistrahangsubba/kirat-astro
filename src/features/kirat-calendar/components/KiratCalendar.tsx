"use client";

import { AnimatePresence, motion } from "motion/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { SunlitBackground } from "@/components/marketing/sunlit-background";
import styles from "../kirat-calendar.module.css";
import type { InfoPageKey, ToolPageKey, ViewMode } from "../types";
import { ActionBar } from "./ActionBar";
import { CalendarGrid } from "./CalendarGrid";
import { CalendarHeader } from "./CalendarHeader";
import { InfoPage } from "./InfoPage";
import { MonthYearControls } from "./MonthYearControls";
import { TodayInfoBar } from "./TodayInfoBar";
import { AyanamshaPage } from "./tools/AyanamshaPage";
import { EphemerisPage } from "./tools/EphemerisPage";
import { KhesemukPage } from "./tools/KhesemukPage";
import { PlanetsPage } from "./tools/PlanetsPage";
import { SenlendatPage } from "./tools/SenlendatPage";
import { SinglabamukPage } from "./tools/SinglabamukPage";
import { YeleConverterPage } from "./tools/YeleConverterPage";
import { YenyemdatPage } from "./tools/YenyemdatPage";
import { YearView } from "./YearView";
import { YenlonDetails } from "./YenlonDetails";
import { todayInZone } from "../lib/today";

const INFO_PAGE_KEYS: InfoPageKey[] = ["about"];
const TOOL_PAGE_KEYS: ToolPageKey[] = [
  "senlendat",
  "yenyemdat",
  "khesemuk",
  "singlabamuk",
  "planets",
  "ephemeris",
  "ayanamsha",
  "yeleconverter",
];

export function KiratCalendar() {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [today, setToday] = useState(() => todayInZone());
  const [viewMode, setViewMode] = useState<ViewMode>("calendar");
  const [currentMonth, setCurrentMonth] = useState(0);
  const [currentYear, setCurrentYear] = useState(2000);
  const [selectedDate, setSelectedDate] = useState(() => todayInZone());

  const containerRef = useRef<HTMLDivElement>(null);

  // Defer "current time"-dependent rendering to the client only, avoiding
  // any risk of a server/client hydration mismatch across a day boundary.
  useEffect(() => {
    function init() {
      const now = todayInZone();
      setToday(now);
      setCurrentMonth(now.getMonth());
      setCurrentYear(now.getFullYear());
      setSelectedDate(now);
      setMounted(true);

      // Deep link from another page's menu, e.g. /?panel=senlendat.
      const panel = searchParams.get("panel");
      if (TOOL_PAGE_KEYS.includes(panel as ToolPageKey)) {
        setViewMode(panel as ToolPageKey);
      } else if (INFO_PAGE_KEYS.includes(panel as InfoPageKey)) {
        setViewMode(panel as InfoPageKey);
      }
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mounted) return null;

  function goToMonth(month: number, year: number) {
    setCurrentMonth(month);
    setCurrentYear(year);
  }

  function handlePrevMonth() {
    if (currentMonth === 0) goToMonth(11, currentYear - 1);
    else goToMonth(currentMonth - 1, currentYear);
  }

  function handleNextMonth() {
    if (currentMonth === 11) goToMonth(0, currentYear + 1);
    else goToMonth(currentMonth + 1, currentYear);
  }

  function handleDayClick(day: number) {
    setSelectedDate(new Date(currentYear, currentMonth, day));
  }

  function handleGoToday() {
    goToMonth(today.getMonth(), today.getFullYear());
    setSelectedDate(today);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleJumpToDate(year: number, month: number, day: number) {
    goToMonth(month, year);
    setSelectedDate(new Date(year, month, day));
    setViewMode("calendar");
  }

  function handleSelectInfoPage(key: InfoPageKey) {
    setViewMode(key);
  }

  const selectedKey = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(
    selectedDate.getDate(),
  ).padStart(2, "0")}`;

  const rootClassName = `${styles.calendarRoot} light`;
  const viewTransition = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: { duration: 0.25, ease: "easeOut" as const },
  };

  return (
    <div className={rootClassName}>
      <SunlitBackground />

      <CalendarHeader
        onSelectHome={() => setViewMode("calendar")}
        onSelectInfoPage={handleSelectInfoPage}
        onSelectTool={(key) => setViewMode(key)}
      />

      <main id="main">
        <h1 className="sr-only">Kirat Khaik Mundhum Calendar</h1>
        <AnimatePresence mode="wait">
          {viewMode === "calendar" && (
            <motion.div key="calendar" {...viewTransition} className={styles.container} ref={containerRef}>
              <TodayInfoBar selectedDate={selectedDate}>
                <MonthYearControls
                  month={currentMonth}
                  year={currentYear}
                  onPrevMonth={handlePrevMonth}
                  onNextMonth={handleNextMonth}
                  onSelectMonth={(m) => goToMonth(m, currentYear)}
                  onSelectYear={(y) => goToMonth(currentMonth, y)}
                />
                <ActionBar
                  view="month"
                  onSelectMonth={() => setViewMode("calendar")}
                  onGoToday={handleGoToday}
                  onSelectYear={() => setViewMode("year")}
                />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${currentYear}-${currentMonth}`}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <CalendarGrid
                      month={currentMonth}
                      year={currentYear}
                      today={today}
                      selectedDate={selectedDate}
                      onDayClick={handleDayClick}
                      onPrevMonth={handlePrevMonth}
                      onNextMonth={handleNextMonth}
                    />
                  </motion.div>
                </AnimatePresence>

                <p className="mt-4 border-t border-dashed border-gold/40 pt-3 text-left text-sm leading-relaxed text-foreground/80">
                  Tap any date to open its Kirat Yenlon page — this works the same way from both the Month view
                  and each mini-month in the Year view.
                </p>
              </TodayInfoBar>

              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedKey}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <YenlonDetails
                    year={selectedDate.getFullYear()}
                    month={selectedDate.getMonth()}
                    day={selectedDate.getDate()}
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}

          {viewMode === "year" && (
            <motion.div key="year" {...viewTransition}>
              <YearView
                year={currentYear}
                today={today}
                onPrevYear={() => setCurrentYear((y) => y - 1)}
                onNextYear={() => setCurrentYear((y) => y + 1)}
                onBack={() => setViewMode("calendar")}
                onJumpToDate={handleJumpToDate}
              />
            </motion.div>
          )}

          {viewMode === "senlendat" && (
            <motion.div key="senlendat" {...viewTransition}>
              <SenlendatPage onBack={() => setViewMode("calendar")} />
            </motion.div>
          )}
          {viewMode === "yenyemdat" && (
            <motion.div key="yenyemdat" {...viewTransition}>
              <YenyemdatPage onBack={() => setViewMode("calendar")} />
            </motion.div>
          )}
          {viewMode === "khesemuk" && (
            <motion.div key="khesemuk" {...viewTransition}>
              <KhesemukPage onBack={() => setViewMode("calendar")} />
            </motion.div>
          )}
          {viewMode === "singlabamuk" && (
            <motion.div key="singlabamuk" {...viewTransition}>
              <SinglabamukPage onBack={() => setViewMode("calendar")} />
            </motion.div>
          )}
          {viewMode === "planets" && (
            <motion.div key="planets" {...viewTransition}>
              <PlanetsPage onBack={() => setViewMode("calendar")} />
            </motion.div>
          )}
          {viewMode === "ephemeris" && (
            <motion.div key="ephemeris" {...viewTransition}>
              <EphemerisPage onBack={() => setViewMode("calendar")} />
            </motion.div>
          )}
          {viewMode === "ayanamsha" && (
            <motion.div key="ayanamsha" {...viewTransition}>
              <AyanamshaPage onBack={() => setViewMode("calendar")} />
            </motion.div>
          )}
          {viewMode === "yeleconverter" && (
            <motion.div key="yeleconverter" {...viewTransition}>
              <YeleConverterPage onBack={() => setViewMode("calendar")} />
            </motion.div>
          )}

          {viewMode === "about" && (
            <motion.div key={viewMode} {...viewTransition}>
              <InfoPage pageKey={viewMode} onBack={() => setViewMode("calendar")} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className={styles.footer}>Kirat Khaik Mundhum Paturo © {today.getFullYear()}</footer>
    </div>
  );
}
