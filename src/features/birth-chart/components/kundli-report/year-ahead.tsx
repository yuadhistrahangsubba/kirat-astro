"use client";

import { CalendarRange, ChevronDown, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import type { AnnualForecast, AnnualForecastSegment } from "@/services/astrology/interpretation";

const FADE_UP = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 130, damping: 18 } },
};

export function YearAhead({ forecast }: { forecast: AnnualForecast }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
    >
      <motion.div variants={FADE_UP} className="flex items-center justify-center gap-2 text-gold">
        <CalendarRange className="size-4" aria-hidden="true" />
        <span className="font-dense text-[11px] tracking-[0.25em] uppercase">{forecast.windowLabel}</span>
      </motion.div>

      <motion.p variants={FADE_UP} className="mx-auto mt-3 max-w-2xl text-center text-sm text-foreground/90">
        {forecast.summary}
      </motion.p>

      {/* Chronological timeline — the sub-periods run in date order down a gold
          rail, the way an annual reading walks you through the year month by month. */}
      <motion.ol variants={FADE_UP} className="mt-8 space-y-3 border-l border-border/60 pl-5 sm:pl-6">
        {forecast.segments.map((segment, i) => (
          <SegmentCard key={segment.antardasha + i} segment={segment} />
        ))}
      </motion.ol>

      {forecast.sadesatiNote && (
        <motion.p
          variants={FADE_UP}
          className="mt-5 rounded-xl border border-accent/30 bg-accent/10 p-4 text-sm text-foreground/90"
        >
          {forecast.sadesatiNote}
        </motion.p>
      )}

      <motion.p
        variants={FADE_UP}
        className="mt-5 flex items-center justify-center gap-2 text-center text-sm font-medium text-gold"
      >
        <Sparkles className="size-4" aria-hidden="true" />
        {forecast.guidance}
      </motion.p>
    </motion.div>
  );
}

function SegmentCard({ segment }: { segment: AnnualForecastSegment }) {
  const [open, setOpen] = useState(false);
  // A single sub-sub-period (the Antardasha's own Pratyantar) adds no extra
  // timing detail, so only offer the breakdown when it genuinely subdivides.
  const canExpand = segment.detail.length > 1;

  return (
    <motion.li variants={FADE_UP} className="relative">
      <span
        aria-hidden="true"
        className={cn(
          "absolute top-1.5 size-2.5 rounded-full ring-4 ring-background -left-[27px] sm:-left-[31px]",
          segment.dominant ? "bg-gold" : "bg-border",
        )}
      />
      <div
        className={cn(
          "rounded-2xl border p-5",
          segment.dominant ? "border-gold/45 bg-gold/5" : "border-border/60 bg-card/50",
        )}
      >
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <p className="font-dense text-xs font-semibold tracking-[0.15em] text-gold uppercase">{segment.rangeLabel}</p>
          {segment.dominant && (
            <span className="rounded-full bg-gold/15 px-2 py-0.5 font-dense text-[9px] tracking-[0.15em] text-gold uppercase">
              Strongest stretch
            </span>
          )}
        </div>
        <h4 className="mt-1.5 font-sans text-base font-bold tracking-wide">
          {segment.antardasha} sub-period
          {segment.houseLabel && (
            <span className="font-normal text-muted-foreground">
              {" "}· {segment.antardasha} in your {segment.houseLabel} house
            </span>
          )}
        </h4>
        <p className="mt-2.5 text-sm text-muted-foreground">{segment.theme}</p>

        {canExpand && (
          <>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              className="mt-3 flex items-center gap-1 font-dense text-[11px] font-semibold tracking-[0.15em] text-gold uppercase transition-colors hover:text-gold/80"
            >
              {open ? "Hide month-by-month" : "Show month-by-month"}
              <ChevronDown className={cn("size-3.5 transition-transform", open && "rotate-180")} aria-hidden="true" />
            </button>

            <AnimatePresence initial={false}>
              {open && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="mt-3 space-y-2 overflow-hidden border-l border-border/50 pl-4"
                >
                  {segment.detail.map((sub, j) => (
                    <li key={sub.planet + j} className="text-sm">
                      <span className="font-dense text-[10px] tracking-[0.15em] text-muted-foreground uppercase">
                        {sub.rangeLabel}
                      </span>
                      <p className="text-foreground/90">
                        <span className="font-semibold">{sub.planet}</span>
                        {sub.houseLabel && <span className="text-muted-foreground"> · {sub.houseLabel} house</span>}
                        <span className="text-muted-foreground"> — {sub.focus}</span>
                      </p>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </motion.li>
  );
}
