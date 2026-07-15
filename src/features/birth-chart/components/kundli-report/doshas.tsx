"use client";

import { AlertTriangle, CheckCircle2 } from "lucide-react";

import type { ChartResult } from "@/services/astrology";

interface DoshasProps {
  manglik: ChartResult["manglikDosha"];
  kalsarpa: ChartResult["kalsarpaDosha"];
}

const SCOPE_LABEL: Record<ChartResult["manglikDosha"]["presentIn"][number], string> = {
  moon: "Moon",
  lagna: "Lagna",
};

export function Doshas({ manglik, kalsarpa }: DoshasProps) {
  const manglikFrames = manglik.presentIn.map((scope) => SCOPE_LABEL[scope]).join(" and ");
  const manglikDetail = manglik.isManglik
    ? `Mars sits in a Manglik house from the ${manglikFrames} ${manglik.presentIn.length > 1 ? "frames" : "frame"} — house ${manglik.marsHouseFromMoon} from the Moon${
        manglik.marsHouseFromLagna ? `, house ${manglik.marsHouseFromLagna} from the Lagna` : ""
      }.`
    : "Mars doesn't fall in a Manglik house from either the Moon or the Lagna.";

  const kalsarpaDetail = kalsarpa.isKalsarpa
    ? `Every classical graha sits within one arc of the Rahu-Ketu axis${
        kalsarpa.typeName ? ` — traditionally named ${kalsarpa.typeName} Kalsarpa Yoga` : ""
      }.`
    : "Your chart is free of Kalsarpa Yoga — the classical grahas aren't confined to one side of the Rahu-Ketu axis.";

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <DoshaCard title="Manglik (Kuja) Dosha" present={manglik.isManglik} detail={manglikDetail} />
      <DoshaCard title="Kalsarpa Dosh" present={kalsarpa.isKalsarpa} detail={kalsarpaDetail} />
    </div>
  );
}

function DoshaCard({ title, present, detail }: { title: string; present: boolean; detail: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/50 p-5">
      <div className="flex items-center justify-between gap-3">
        <h4 className="font-sans text-sm font-bold tracking-wide">{title}</h4>
        <span
          className={`flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 font-dense text-[10px] tracking-[0.1em] uppercase ${
            present ? "bg-destructive/10 text-destructive" : "bg-gold/10 text-gold"
          }`}
        >
          {present ? <AlertTriangle className="size-3" aria-hidden="true" /> : <CheckCircle2 className="size-3" aria-hidden="true" />}
          {present ? "Present" : "Not Present"}
        </span>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{detail}</p>
    </div>
  );
}
