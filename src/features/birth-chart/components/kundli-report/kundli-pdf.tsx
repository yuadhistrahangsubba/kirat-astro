"use client";

import { Download, Loader2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { ChartResult } from "@/services/astrology";
import type { AnnualForecast, DomainInterpretation } from "@/services/astrology/interpretation";

import { lagnaPlacements, navamsaPlacements } from "./chart-geometry";
import type { KundliSubject } from "./kundli-report";

interface KundliPdfButtonProps extends KundliSubject {
  result: ChartResult;
  domains: readonly DomainInterpretation[];
  annualForecast: AnnualForecast | null;
  birthUtc: Date;
}

export function KundliPdfButton({ result, domains, annualForecast, birthUtc, ...subject }: KundliPdfButtonProps) {
  const [status, setStatus] = useState<"idle" | "generating" | "error">("idle");

  async function handleDownload() {
    setStatus("generating");
    try {
      const [{ pdf }, { KundliPdfDocument }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("./kundli-pdf-document"),
      ]);

      const doc = (
        <KundliPdfDocument
          result={result}
          domains={domains}
          annualForecast={annualForecast}
          birthUtc={birthUtc}
          lagnaPlacements={lagnaPlacements(result)}
          navamsaPlacements={navamsaPlacements(result)}
          {...subject}
        />
      );
      const blob = await pdf(doc).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${subject.name.trim().replace(/\s+/g, "-")}-kundli.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setStatus("idle");
    } catch (err) {
      console.error("Failed to generate Kundli PDF", err);
      setStatus("error");
    }
  }

  return (
    <div className="flex flex-col items-center gap-1.5">
      <Button type="button" variant="outline" size="sm" onClick={handleDownload} disabled={status === "generating"} className="gap-2">
        {status === "generating" ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
        {status === "generating" ? "Preparing PDF…" : "Download full report as PDF"}
      </Button>
      {status === "error" && <p className="text-xs text-destructive">Couldn&apos;t generate the PDF — please try again.</p>}
    </div>
  );
}
