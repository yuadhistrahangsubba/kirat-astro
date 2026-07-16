"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Clock, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { PrayerFlagAccent } from "@/components/marketing/prayer-flag-accent";
import { Button } from "@/components/ui/button";
import { computeChart, type ChartResult } from "@/services/astrology";

import { birthChartSchema, toBirthInput, type BirthChartFormValues } from "../schema";
import { useBirthChartWizard } from "../store";
import { BirthDateTimeFields } from "./birth-datetime-fields";
import { FormChapter } from "./form-chapter";
import { IdentityFields } from "./identity-fields";
import type { KundliSubject } from "./kundli-report/kundli-report";
import { PlaceFields } from "./place-fields";

const STAGGER = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const RISE = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 140, damping: 18 } },
};

interface BirthChartFormProps {
  /** Bubbles the computed chart (and the subject info the full report needs) up to the page, which renders the full-width Kundli report below this card. */
  onResult?: (payload: { result: ChartResult; subject: KundliSubject } | null) => void;
}

export function BirthChartForm({ onResult }: BirthChartFormProps) {
  const setDraft = useBirthChartWizard((s) => s.setDraft);
  const [engineMessage, setEngineMessage] = useState<string | null>(null);
  const [result, setResult] = useState<ChartResult | null>(null);

  const form = useForm<BirthChartFormValues>({
    resolver: zodResolver(birthChartSchema),
    defaultValues: { birthTimeUnknown: false, second: 0 },
    // Validate on blur (not just on submit) so an out-of-range value —
    // a negative day, an hour of 25 — is flagged as soon as the user
    // leaves the field, rather than only after they hit "Show Kundli".
    mode: "onBlur",
    reValidateMode: "onChange",
  });
  const { setValue, watch, formState } = form;
  const { errors } = formState;

  const name = watch("name");
  const gender = watch("gender");
  const day = watch("day");
  const month = watch("month");
  const year = watch("year");
  const birthTimeUnknown = watch("birthTimeUnknown");
  const hour = watch("hour");
  const minute = watch("minute");
  const placeName = watch("placeName");
  const latitude = watch("latitude");
  const longitude = watch("longitude");
  const timezone = watch("timezone");

  // "Done" means present AND valid — a value like day=-2 is truthy but
  // still invalid, and shouldn't light up the chapter's checkmark.
  const identityDone = Boolean(name?.toString().trim()) && !errors.name && Boolean(gender) && !errors.gender;
  const momentDone =
    Boolean(day) &&
    !errors.day &&
    Boolean(month) &&
    !errors.month &&
    Boolean(year) &&
    !errors.year &&
    (birthTimeUnknown || (Boolean(hour) && !errors.hour && minute !== undefined && !errors.minute));
  const placeDone =
    Boolean(placeName?.toString().trim()) &&
    !errors.placeName &&
    latitude !== undefined &&
    longitude !== undefined &&
    Boolean(timezone);

  function fillNow() {
    const now = new Date();
    setValue("day", now.getDate(), { shouldValidate: true });
    setValue("month", now.getMonth() + 1, { shouldValidate: true });
    setValue("year", now.getFullYear(), { shouldValidate: true });
    setValue("birthTimeUnknown", false);
    setValue("hour", now.getHours(), { shouldValidate: true });
    setValue("minute", now.getMinutes(), { shouldValidate: true });
    setValue("second", now.getSeconds(), { shouldValidate: true });
  }

  function onSubmit(values: BirthChartFormValues) {
    setDraft(values);
    setEngineMessage(null);
    setResult(null);
    onResult?.(null);
    try {
      const computed = computeChart(toBirthInput(values));
      setResult(computed);
      onResult?.({
        result: computed,
        subject: {
          name: values.name,
          gender: values.gender,
          placeName: values.placeName,
          timezone: values.timezone!,
          latitude: values.latitude!,
          longitude: values.longitude!,
        },
      });
    } catch (err) {
      setEngineMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 90, damping: 18 }}
      className="relative w-full max-w-md"
    >
      <div
        aria-hidden="true"
        className="absolute -inset-px rounded-[calc(var(--radius-2xl)+1px)] bg-gradient-to-br from-gold/50 via-gold/10 to-transparent"
      />
      <div className="relative rounded-2xl border border-border/60 bg-card/90 p-6 shadow-[0_30px_80px_-30px_rgba(0,0,0,.35)] backdrop-blur-xl sm:p-8">
        <div className="flex items-center justify-between">
          <span className="font-dense text-[11px] tracking-[0.25em] text-gold uppercase">Vedic Birth Chart</span>
          <span lang="dz" className="font-dzongkha text-sm text-gold/70">
            སྐར་རྩིས
          </span>
        </div>
        <h3 className="mt-2 font-sans text-2xl font-bold tracking-wide">Get your Kundli</h3>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Enter your birth details — place and time as precisely as you know them.
        </p>
        <PrayerFlagAccent className="mt-5 mb-7 opacity-70" />

        <FormProvider {...form}>
          <motion.form
            onSubmit={form.handleSubmit(onSubmit)}
            initial="hidden"
            animate="visible"
            variants={STAGGER}
            className="grid gap-1"
          >
            <motion.div variants={RISE}>
              <FormChapter numeral="01" title="Who you are" complete={identityDone}>
                <IdentityFields />
              </FormChapter>
            </motion.div>

            <motion.div variants={RISE}>
              <FormChapter
                numeral="02"
                title="Your birth moment"
                complete={momentDone}
                action={
                  <Button type="button" variant="ghost" size="sm" onClick={fillNow} className="h-7 gap-1.5 text-xs">
                    <Clock className="size-3.5" aria-hidden="true" />
                    Now
                  </Button>
                }
              >
                <BirthDateTimeFields />
              </FormChapter>
            </motion.div>

            <motion.div variants={RISE}>
              <FormChapter numeral="03" title="Where you were born" complete={placeDone} isLast>
                <PlaceFields />
              </FormChapter>
            </motion.div>

            {engineMessage && (
              <motion.div
                variants={RISE}
                className="flex items-start gap-2 rounded-md border border-accent/30 bg-accent/10 p-3 text-sm text-foreground"
              >
                <AlertCircle className="mt-0.5 size-4 shrink-0 text-accent" />
                <span>{engineMessage}</span>
              </motion.div>
            )}

            {result && <ChartSummary result={result} />}

            <motion.div variants={RISE} className="mt-5">
              <Button type="submit" disabled={formState.isSubmitting} breathing className="w-full">
                {formState.isSubmitting ? <Loader2 className="animate-spin" /> : <Sparkles />}
                Show Kundli
              </Button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[11px] text-muted-foreground/80">
                <ShieldCheck className="size-3.5 text-gold" aria-hidden="true" />
                Calculated privately — your birth details are never shared.
              </p>
            </motion.div>
          </motion.form>
        </FormProvider>
      </div>
    </motion.div>
  );
}

const SEALS = (result: ChartResult) =>
  [
    { glyph: "☉", label: "Sun", sign: result.sun.rashi.signName, sub: result.sun.nakshatra.name },
    { glyph: "☽", label: "Moon", sign: result.moon.rashi.signName, sub: result.moon.nakshatra.name },
    result.ascendant ? { glyph: "↑", label: "Ascendant", sign: result.ascendant.rashi.signName, sub: null } : null,
  ].filter((seal): seal is { glyph: string; label: string; sign: string; sub: string | null } => seal !== null);

function ChartSummary({ result }: { result: ChartResult }) {
  const seals = SEALS(result);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
      className="relative mt-2 overflow-hidden rounded-xl border border-gold/25 bg-gradient-to-b from-gold/10 to-transparent p-5"
    >
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
            <p className="mt-2 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
              {seal.label}
            </p>
            <p className="text-sm font-bold">{seal.sign}</p>
            {seal.sub && <p className="text-[11px] text-muted-foreground">{seal.sub}</p>}
          </motion.div>
        ))}
      </div>

      {!result.ascendant && (
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Ascendant needs an exact birth time — add one above to see it.
        </p>
      )}
      <p className="mt-3 text-center text-[11px] text-muted-foreground/70">
        Scroll down for your full report — traditional table, Lagna &amp; Navamsa charts, and Vimshottari Dasha.
      </p>
    </motion.div>
  );
}
