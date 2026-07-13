import type { Metadata } from "next";

import { CalendarThemedShell } from "@/features/kirat-calendar/components/CalendarThemedShell";
import { ContactPageContent } from "./contact-page-content";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <CalendarThemedShell>
      <ContactPageContent />
    </CalendarThemedShell>
  );
}
