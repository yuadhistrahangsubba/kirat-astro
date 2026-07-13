"use client";

import { ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import { useId, useState } from "react";

const FAQS = [
  {
    question: "Is this Vedic (sidereal) or Western (tropical) astrology?",
    answer:
      "Sidereal — every chart uses the Lahiri ayanamsa correction, the standard for Vedic astrology across the Himalayan region and India.",
  },
  {
    question: "Do I need to know my exact birth time?",
    answer:
      "It helps, but it's optional. Most planetary placements still resolve correctly without one — only a few fine details depend on exact time.",
  },
  {
    question: "Which regions is this built for?",
    answer:
      "Bhutan, Nepal, India, and the Himalayan diaspora specifically — but the underlying calculations work for any birth location worldwide.",
  },
  {
    question: "How is compatibility matching calculated?",
    answer:
      "Through traditional Guna Milan scoring, comparing two charts across the eight classical compatibility factors.",
  },
  {
    question: "Is my birth data private?",
    answer: "Yes. Your birth details are stored securely and are never sold to third parties.",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Billing is handled through Stripe, and you can cancel or change plans at any time.",
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
      <motion.h2
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ type: "spring", stiffness: 110, damping: 16 }}
        className="text-center font-sans text-3xl font-bold tracking-wide sm:text-4xl"
      >
        Questions, answered
      </motion.h2>

      <div className="mt-12">
        {FAQS.map((faq, index) => (
          <FaqItem key={faq.question} question={faq.question} answer={faq.answer} index={index} />
        ))}
      </div>
    </section>
  );
}
