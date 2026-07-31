"use client";

import type { ReactNode } from "react";

import { SunlitBackground } from "@/components/marketing/sunlit-background";
import styles from "../kirat-calendar.module.css";
import { CalendarHeader } from "./CalendarHeader";

/**
 * The calendar's own chrome (gold header + hamburger menu + footer),
 * reused as-is on non-calendar pages (Astro, FAQ) so they read as part of
 * the same site instead of a separate marketing sub-site. `CalendarHeader`
 * renders its Home/info-panel menu items as real links when it isn't
 * given onSelectHome/onSelectInfoPage — see HamburgerMenu.
 */
export function CalendarThemedShell({ children }: { children: ReactNode }) {
  return (
    <div className={`${styles.calendarRoot} light`}>
      <SunlitBackground />
      <CalendarHeader />
      {children}
      <footer className={styles.footer}>Kirat Khaik Mundhum Paturo © {new Date().getFullYear()}</footer>
    </div>
  );
}
