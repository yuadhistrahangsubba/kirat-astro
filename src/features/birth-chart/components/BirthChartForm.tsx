"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { PrayerFlagAccent } from "@/components/marketing/prayer-flag-accent";
import { Button } from "@/components/ui/button";
import { computeChart, type ChartResult } from "@/services/astrology";

import { birthChartSchema, toBirthInput, type BirthChartFormValues } from "../schema";
import { useBirthChartWizard } from "../store";
import { BirthDateTimeFields } from "./birth-datetime-fields";
import { IdentityFields } from "./identity-fields";
import { PlaceFields } from "./place-fields";

export function BirthChartForm() {
  const setDraft = useBirthChartWizard((s) => s.setDraft);
  const [engineMessage, setEngineMessage] = useState<string | null>(null);
  const [result, setResult] = useState<ChartResult | null>(null);

  const form = useForm<BirthChartFormValues>({
    resolver: zodResolver(birthChartSchema),
    defaultValues: { birthTimeUnknown: false, second: 0 },
  });

  function onSubmit(values: BirthChartFormValues) {
    setDraft(values);
    setEngineMessage(null);
    setResult(null);
    try {
      setResult(computeChart(toBirthInput(values)));
    } catch (err) {
      setEngineMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <div>
      <PrayerFlagAccent className="mb-4" />
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-serif text-xl">Get your Kundli</h3>
        <span lang="dz" className="font-dzongkha text-sm text-gold/80">
          སྐར་རྩིས
        </span>
      </div>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Enter your birth details — place and time as precisely as you know them.
      </p>

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 grid gap-5">
          <IdentityFields />
          <BirthDateTimeFields />
          <PlaceFields />

          {engineMessage && (
            <div className="flex items-start gap-2 rounded-md border border-accent/30 bg-accent/10 p-3 text-sm text-foreground">
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-accent" />
              <span>{engineMessage}</span>
            </div>
          )}

          {result && <ChartSummary result={result} />}

          <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
            {form.formState.isSubmitting ? <Loader2 className="animate-spin" /> : <Sparkles />}
            Show Kundli
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}

function ChartSummary({ result }: { result: ChartResult }) {
  return (
    <div className="grid gap-1.5 rounded-md border border-border bg-secondary/40 p-3 text-sm">
      <p>
        <span className="text-muted-foreground">Sun:</span> {result.sun.rashi.signName} ·{" "}
        {result.sun.nakshatra.name}
      </p>
      <p>
        <span className="text-muted-foreground">Moon:</span> {result.moon.rashi.signName} ·{" "}
        {result.moon.nakshatra.name}
      </p>
      {result.ascendant ? (
        <p>
          <span className="text-muted-foreground">Ascendant:</span> {result.ascendant.rashi.signName}
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">
          Ascendant needs an exact birth time — add one above to see it.
        </p>
      )}
      <p className="text-xs text-muted-foreground">
        Mercury through Pluto aren&apos;t placed yet — this engine only has verified Sun/Moon positions so far.
      </p>
    </div>
  );
}
