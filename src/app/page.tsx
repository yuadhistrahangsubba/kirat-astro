import type { Metadata } from "next";
import { Suspense } from "react";

import { KiratCalendar } from "@/features/kirat-calendar/components/KiratCalendar";

export const metadata: Metadata = {
  title: "Kirat Khaik Mundhum Calendar",
  description:
    "Kirat Khaik Mundhum calendar for Bhutan and the Himalaya — daily Kirat dates, Mangyuk and Lamikkhok, panchanga, sunrise and festival timing.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <Suspense>
      <KiratCalendar />
    </Suspense>
  );
}
