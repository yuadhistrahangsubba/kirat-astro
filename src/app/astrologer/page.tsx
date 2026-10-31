import type { Metadata } from "next";

import { CalendarThemedShell } from "@/features/kirat-calendar/components/CalendarThemedShell";
import { AstrologerPageContent } from "./astrologer-page-content";

export const metadata: Metadata = {
  title: "Astrologer",
  description:
    "Find astrologers for Vedic and Kirat readings.",
  alternates: { canonical: "/astrologer" },
};

export default function AstrologerPage() {
  return (
    <CalendarThemedShell>
      <AstrologerPageContent />
    </CalendarThemedShell>
  );
}
