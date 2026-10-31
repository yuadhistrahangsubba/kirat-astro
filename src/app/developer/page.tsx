import type { Metadata } from "next";

import { CalendarThemedShell } from "@/features/kirat-calendar/components/CalendarThemedShell";
import { DeveloperPageContent } from "./developer-page-content";

export const metadata: Metadata = {
  title: "Developer",
  description:
    "Who designed and built Kirat Khaik Mundhum Paturo.",
  alternates: { canonical: "/developer" },
};

export default function DeveloperPage() {
  return (
    <CalendarThemedShell>
      <DeveloperPageContent />
    </CalendarThemedShell>
  );
}
