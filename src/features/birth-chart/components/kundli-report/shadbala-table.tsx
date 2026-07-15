"use client";

import type { ChartResult } from "@/services/astrology";

const GRAHA_ORDER = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"] as const;

interface ShadbalaTableProps {
  basicShadbala: ChartResult["basicShadbala"];
}

export function ShadbalaTable({ basicShadbala }: ShadbalaTableProps) {
  const rows = GRAHA_ORDER.map((planet) => ({ planet, ...basicShadbala[planet] })).sort(
    (a, b) => b.totalShashtiamsa - a.totalShashtiamsa,
  );

  return (
    <div className="overflow-x-auto rounded-2xl border border-border/60 bg-card/50">
      <table className="w-full min-w-[440px] text-sm">
        <thead>
          <tr className="border-b border-border/60 text-left text-[11px] tracking-wide text-muted-foreground uppercase">
            <th className="px-4 py-3 font-medium">Graha</th>
            <th className="px-4 py-3 font-medium">Uccha</th>
            <th className="px-4 py-3 font-medium">Dig</th>
            <th className="px-4 py-3 font-medium">Naisargika</th>
            <th className="px-4 py-3 font-medium">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/40">
          {rows.map((row, i) => (
            <tr key={row.planet}>
              <td className="px-4 py-2.5 font-semibold">
                {row.planet}
                {i === 0 && (
                  <span className="ml-2 rounded-full bg-gold/15 px-2 py-0.5 font-dense text-[9px] tracking-[0.15em] text-gold uppercase">
                    Strongest
                  </span>
                )}
              </td>
              <td className="px-4 py-2.5 text-muted-foreground tabular-nums">{row.uchchaBala}</td>
              <td className="px-4 py-2.5 text-muted-foreground tabular-nums">{row.digBala}</td>
              <td className="px-4 py-2.5 text-muted-foreground tabular-nums">{row.naisargikaBala}</td>
              <td className="px-4 py-2.5 font-semibold tabular-nums">{row.totalShashtiamsa}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="border-t border-border/40 px-4 py-3 text-[11px] text-muted-foreground/80">
        A partial Shadbala — exaltation, directional, and natural strength only. Kala Bala (time-based) and Chesta Bala (motion-based) aren&apos;t included yet.
      </p>
    </div>
  );
}
