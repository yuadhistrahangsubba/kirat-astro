import type { Metadata } from "next";

import { CalendarThemedShell } from "@/features/kirat-calendar/components/CalendarThemedShell";
import { Faq } from "./faq-section";

export const metadata: Metadata = {
  title: "FAQ",
};

export default function FaqPage() {
  return (
    <CalendarThemedShell>
      <main id="main">
        <Faq />
      </main>
    </CalendarThemedShell>
  );
}
