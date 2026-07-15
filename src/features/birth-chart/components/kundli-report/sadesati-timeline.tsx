"use client";

import { useState } from "react";

import { ZODIAC_SIGNS } from "@/services/astrology";
import type { ChartResult } from "@/services/astrology";

import { formatDateUtc } from "./format";

const PHASE_LABEL: Record<ChartResult["sadesatiPeriods"][number]["phase"], string> = {
  rising: "Sade Sati · Rising",
  peak: "Sade Sati · Peak",
  setting: "Sade Sati · Setting",
  "dhaiya-4th": "Small Panoti",
  "dhaiya-8th": "Small Panoti",
};

const VISIBLE_WHEN_COLLAPSED = 5;

interface SadesatiTimelineProps {
  periods: ChartResult["sadesatiPeriods"];
}

export function SadesatiTimeline({ periods }: SadesatiTimelineProps) {
  const [showAll, setShowAll] = useState(false);
  const now = new Date();

  const currentIndex = periods.findIndex((period) => period.startDate <= now && now < period.endDate);
  const nextIndex = periods.findIndex((period) => period.startDate > now);
  const startIndex = currentIndex >= 0 ? currentIndex : nextIndex >= 0 ? nextIndex : 0;

  const visible = showAll ? periods : periods.slice(startIndex, startIndex + VISIBLE_WHEN_COLLAPSED);
  const current = currentIndex >= 0 ? periods[currentIndex] : undefined;

  return (
    <div className="rounded-2xl border border-border/60 bg-card/50 p-5">
      {current ? (
        <p className="text-sm">
          <span className="font-dense text-[10px] tracking-[0.15em] text-gold uppercase">Currently active</span>
          <br />
          <span className="text-foreground">
            {PHASE_LABEL[current.phase]} in {ZODIAC_SIGNS[current.shaniRashiSignIndex]}
          </span>
          , through {formatDateUtc(current.endDate)}.
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">No Sadesati or Panoti period is active right now.</p>
      )}

      <div className="mt-4 grid gap-2">
        {visible.length === 0 && <p className="text-sm text-muted-foreground">No Sadesati or Panoti periods fall in this window.</p>}
        {visible.map((period) => {
          const isCurrent = period === current;
          return (
            <div
              key={period.startDate.getTime()}
              className={`flex flex-wrap items-center justify-between gap-2 rounded-lg border px-3.5 py-2.5 text-sm ${
                isCurrent ? "border-gold/50 bg-gold/5" : "border-border/50"
              }`}
            >
              <span className="font-medium">
                {PHASE_LABEL[period.phase]} <span className="text-muted-foreground">in {ZODIAC_SIGNS[period.shaniRashiSignIndex]}</span>
                {isCurrent && (
                  <span className="ml-2 rounded-full bg-gold/15 px-2 py-0.5 font-dense text-[9px] tracking-[0.15em] text-gold uppercase">
                    Current
                  </span>
                )}
              </span>
              <span className="text-xs text-muted-foreground tabular-nums">
                {formatDateUtc(period.startDate)} &ndash; {formatDateUtc(period.endDate)}
              </span>
            </div>
          );
        })}
      </div>

      {periods.length > VISIBLE_WHEN_COLLAPSED && (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="mt-4 text-xs font-medium text-gold hover:underline"
        >
          {showAll ? "Show current & upcoming only" : `Show full ~100-year timeline (${periods.length} periods)`}
        </button>
      )}
    </div>
  );
}
