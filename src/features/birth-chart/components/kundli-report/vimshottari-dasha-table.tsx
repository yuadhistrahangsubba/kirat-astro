"use client";

import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import type { MahadashaWithAntardasha } from "@/services/astrology";

import { formatDateUtc } from "./format";

interface VimshottariDashaTableProps {
  periods: readonly MahadashaWithAntardasha[];
}

export function VimshottariDashaTable({ periods }: VimshottariDashaTableProps) {
  const now = new Date();
  const currentIndex = periods.findIndex((p) => p.startDate <= now && now < p.endDate);
  const [openIndex, setOpenIndex] = useState(currentIndex >= 0 ? currentIndex : 0);

  return (
    <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
      {periods.map((period, i) => {
        const isOpen = openIndex === i;
        const isCurrent = i === currentIndex;
        return (
          <div
            key={period.planet + i}
            className={cn(
              "overflow-hidden rounded-xl border bg-card/60 transition-colors",
              isOpen ? "border-gold/50" : "border-border/60",
            )}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? -1 : i)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-sans text-sm font-bold tracking-wide">{period.planet}</p>
                  {isCurrent && (
                    <span className="rounded-full bg-gold/15 px-2 py-0.5 font-dense text-[9px] tracking-[0.15em] text-gold uppercase">
                      Current
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {formatDateUtc(period.startDate)} &ndash; {formatDateUtc(period.endDate)} &middot; {period.durationYears.toFixed(1)}y
                </p>
              </div>
              <ChevronDown
                className={cn("size-4 shrink-0 text-muted-foreground transition-transform", isOpen && "rotate-180")}
                aria-hidden="true"
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 divide-y divide-border/40 border-t border-border/40">
                    {period.antardasha.map((sub, j) => (
                      <div key={sub.planet + j} className="flex items-center justify-between px-4 py-2 text-xs">
                        <span className="font-medium text-foreground">{sub.planet}</span>
                        <span className="text-muted-foreground">{formatDateUtc(sub.endDate)}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
