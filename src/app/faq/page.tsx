import type { Metadata } from "next";

import { CalendarThemedShell } from "@/features/kirat-calendar/components/CalendarThemedShell";
import { FAQS } from "./faq-data";
import { Faq } from "./faq-section";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers about the Vedic birth chart calculator, birth time accuracy, privacy, and the Kirat Khaik Mundhum Calendar.",
  alternates: { canonical: "/faq" },
};

// FAQPage structured data for search rich results (schema.org).
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

export default function FaqPage() {
  return (
    <CalendarThemedShell>
      <script
        type="application/ld+json"
        // Static, developer-authored content; escape "<" so no string can close the tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }}
      />
      <main id="main">
        <Faq />
      </main>
    </CalendarThemedShell>
  );
}
