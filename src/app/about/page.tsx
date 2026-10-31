import type { Metadata } from "next";

import { CalendarThemedShell } from "@/features/kirat-calendar/components/CalendarThemedShell";
import { AboutPageContent } from "./about-page-content";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Why Kirat Khaik Mundhum Paturo exists, what the Kirat calendar and astrology tools show, and how every date and position is calculated.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <CalendarThemedShell>
      <AboutPageContent />
    </CalendarThemedShell>
  );
}
