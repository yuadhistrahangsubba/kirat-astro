"use client";

import { motion } from "motion/react";

import type { ChartResult } from "@/services/astrology";

type Seal = { glyph: string; label: string; sign: string; sub: string | null };

const SEALS = (result: ChartResult): Seal[] =>
  [
    { glyph: "☉", label: "Sun", sign: result.sun.rashi.signName, sub: result.sun.nakshatra.name },
    { glyph: "☽", label: "Moon", sign: result.moon.rashi.signName, sub: result.moon.nakshatra.name },
    result.ascendant ? { glyph: "↑", label: "Ascendant", sign: result.ascendant.rashi.signName, sub: null } : null,
  ].filter((seal): seal is Seal => seal !== null);

/**
 * At-a-glance Sun/Moon/Ascendant summary that opens the full report — the
 * three placements most people recognise, shown as gold seals before the
 * detailed tables below.
 */
export function KundliSeals({ result }: { result: ChartResult }) {
  const seals = SEALS(result);

  return (
    <div className="relative mx-auto max-w-md overflow-hidden rounded-xl border border-gold/25 bg-gradient-to-b from-gold/10 to-transparent p-5">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,color-mix(in_oklch,var(--color-gold)_18%,transparent),transparent)]"
      />
      <p className="text-center font-dense text-[11px] tracking-[0.25em] text-gold uppercase">Your Kundli</p>

      <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-4">
        {seals.map((seal, i) => (
          <motion.div
            key={seal.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 + i * 0.12, type: "spring", stiffness: 210, damping: 16 }}
            className="flex flex-col items-center text-center"
          >
            <div className="flex size-12 items-center justify-center rounded-full border-2 border-gold/40 bg-background text-xl text-primary shadow-[0_0_20px_-6px_var(--color-gold)]">
              {seal.glyph}
            </div>
            <p className="mt-2 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">{seal.label}</p>
            <p className="text-sm font-bold">{seal.sign}</p>
            {seal.sub && <p className="text-[11px] text-muted-foreground">{seal.sub}</p>}
          </motion.div>
        ))}
      </div>

      {!result.ascendant && (
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Ascendant needs an exact birth time — add one to your birth details to see it.
        </p>
      )}
    </div>
  );
}
