"use client";

import { SkeletonLines, WidgetCard } from "./widget-card";
import type { SkyNow } from "../hooks/use-sky-now";
import { formatDegrees } from "../lib/format";

const PENDING_BODIES = ["Mercury", "Venus", "Mars", "Jupiter", "Saturn"] as const;

export function PlanetaryPositionsWidget({ sky, className }: { sky?: SkyNow; className?: string }) {
  return (
    <WidgetCard
      label="Planetary Positions · Sidereal"
      live={Boolean(sky)}
      className={className}
      footnote="Mercury–Saturn await a full ephemeris — shown blank, never guessed."
    >
      {!sky ? (
        <SkeletonLines count={6} />
      ) : (
        <table className="w-full font-mono text-xs tabular-nums">
          <caption className="sr-only">Current planetary positions</caption>
          <thead>
            <tr className="text-left text-[10px] tracking-wider text-muted-foreground uppercase">
              <th scope="col" className="pb-2 font-normal">Body</th>
              <th scope="col" className="pb-2 font-normal">Position</th>
              <th scope="col" className="pb-2 text-right font-normal">Nakshatra</th>
            </tr>
          </thead>
          <tbody className="text-foreground/90">
            {[
              { name: "Sun", body: sky.snapshot.sun },
              { name: "Moon", body: sky.snapshot.moon },
            ].map(({ name, body }) => (
              <tr key={name} className="border-t border-white/6">
                <td className="py-1.5 text-gold">{name}</td>
                <td className="py-1.5">
                  {formatDegrees(body.rashi.degreesInSign)} {body.rashi.signName}
                </td>
                <td className="py-1.5 text-right text-muted-foreground">{body.nakshatra.name}</td>
              </tr>
            ))}
            {PENDING_BODIES.map((name) => (
              <tr key={name} className="border-t border-white/6 text-muted-foreground/40">
                <td className="py-1.5">{name}</td>
                <td className="py-1.5">—</td>
                <td className="py-1.5 text-right">—</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </WidgetCard>
  );
}
