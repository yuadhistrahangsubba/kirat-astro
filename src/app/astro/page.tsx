import type { Metadata } from "next";

import { CalendarThemedShell } from "@/features/kirat-calendar/components/CalendarThemedShell";
import { AstroPageContent } from "./astro-page-content";

export const metadata: Metadata = {
  title: "Astro",
  description:
    "Free sidereal Vedic birth chart (Kundli) with Lagna and Navamsa charts, Vimshottari Dasha, doshas and Sadesati timeline.",
  alternates: { canonical: "/astro" },
};

export default function AstroPage() {
  return (
    <CalendarThemedShell>
      <AstroPageContent />
    </CalendarThemedShell>
  );
}
