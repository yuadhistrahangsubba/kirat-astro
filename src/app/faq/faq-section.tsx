"use client";

import { ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import { useId, useState } from "react";

const FAQS = [
  {
    question: "Is this Vedic (sidereal) or Western (tropical) astrology?",
    answer:
      "Sidereal — every chart uses the Lahiri (Chitrapaksha) ayanamsa, the standard reference for Vedic astrology across the Himalayan region and India.",
  },
  {
    question: "Do I need to know my exact birth time?",
    answer:
      "It helps, but it's optional. Every planet's sign and nakshatra resolve correctly either way — only your Ascendant, house placements, and time-sensitive readings like Manglik Dosha from the Lagna need an exact birth time to appear.",
  },
  {
    question: "Who is the birth chart calculator for?",
    answer:
      "Anyone, anywhere. Vedic astrology works the same way for any birth date, time, and place worldwide — all the calculator needs is your coordinates and time zone, and the same real planetary positions get computed no matter where you were born.",
  },
  {
    question: "Is the Kirat Calendar the same thing as the astrology calculator?",
    answer:
      "No, they're separate. The birth chart calculator is Vedic astrology and works globally. The Kirat Khaik Mundhum Calendar is specific to the Kirat (Kiranti) community's own lunar-solar reckoning and festivals — Sakela, Chasok Tangnam, and the rest — followed mainly across Bhutan, Nepal, and the wider Himalayan Kirat diaspora.",
  },
  {
    question: "What's included in my Kundli report?",
    answer:
      "Your Lagna and Navamsa charts, a full Vimshottari Dasha timeline with sub-periods, Manglik and Kalsarpa Dosha checks, a Sadesati transit timeline, and a planetary strength breakdown — all calculated from real astronomical positions, not templated text.",
  },
  {
    question: "Is my birth data private?",
    answer:
      "Yes. Your chart is calculated entirely in your browser — your birth details are never sent to or stored on any server.",
  },
  {
    question: "Is this free to use?",
    answer: "Yes — no account, no payment, and no limit on how many charts you generate.",
  },
] as const;

function FaqItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const contentId = useId();

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ type: "spring", stiffness: 120, damping: 18, delay: index * 0.06 }}
      className="border-b border-border py-5"
    >
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={() => setIsOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 text-left"
      >
        <span className="font-sans text-lg font-semibold tracking-wide">{question}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
        >
          <ChevronDown className="size-5 shrink-0 text-gold" aria-hidden="true" />
        </motion.span>
      </button>
      <motion.div
        id={contentId}
        role="region"
        initial={false}
        animate={{ height: isOpen ? "auto" : 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 26 }}
        style={{ overflow: "hidden" }}
      >
        <p className="pt-3 text-sm text-muted-foreground">{answer}</p>
      </motion.div>
    </motion.div>
  );
}

export function Faq() {
  return (
    <section className="relative mx-auto max-w-2xl px-6 py-28 sm:py-36">
      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ type: "spring", stiffness: 110, damping: 16 }}
        className="text-center font-sans text-3xl font-bold tracking-wide sm:text-4xl"
      >
        Questions, answered
      </motion.h1>

      <div className="mt-12">
        {FAQS.map((faq, index) => (
          <FaqItem key={faq.question} question={faq.question} answer={faq.answer} index={index} />
        ))}
      </div>
    </section>
  );
}
