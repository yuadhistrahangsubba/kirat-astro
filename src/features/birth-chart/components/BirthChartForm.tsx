"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { computeChart } from "@/services/astrology";

import { birthChartSchema, type BirthChartFormValues } from "../schema";
import { useBirthChartWizard } from "../store";

export function BirthChartForm() {
  const setDraft = useBirthChartWizard((s) => s.setDraft);
  const [engineMessage, setEngineMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BirthChartFormValues>({
    resolver: zodResolver(birthChartSchema),
    defaultValues: { timezone: "Asia/Thimphu" },
  });

  async function onSubmit(values: BirthChartFormValues) {
    setDraft(values);
    setEngineMessage(null);
    try {
      await computeChart({
        birthDate: values.birthDate,
        birthTime: values.birthTime || undefined,
        timezone: values.timezone,
        latitude: values.latitude,
        longitude: values.longitude,
      });
    } catch (err) {
      setEngineMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <div>
      <h3 className="font-serif text-xl">Generate a birth chart</h3>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Enter birth details as precisely as you know them — an unknown
        birth time is fine, most placements still resolve.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="label">Chart name</Label>
          <Input id="label" placeholder="Myself" {...register("label")} />
          {errors.label && <FieldError message={errors.label.message} />}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="birthDate">Birth date</Label>
            <Input id="birthDate" type="date" {...register("birthDate")} />
            {errors.birthDate && <FieldError message={errors.birthDate.message} />}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="birthTime">Birth time (optional)</Label>
            <Input id="birthTime" type="time" {...register("birthTime")} />
            {errors.birthTime && <FieldError message={errors.birthTime.message} />}
          </div>
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="placeName">Birth place</Label>
          <Input id="placeName" placeholder="Thimphu, Bhutan" {...register("placeName")} />
          {errors.placeName && <FieldError message={errors.placeName.message} />}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="latitude">Latitude</Label>
            <Input id="latitude" type="number" step="any" placeholder="27.4712" {...register("latitude")} />
            {errors.latitude && <FieldError message={errors.latitude.message} />}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="longitude">Longitude</Label>
            <Input id="longitude" type="number" step="any" placeholder="89.6339" {...register("longitude")} />
            {errors.longitude && <FieldError message={errors.longitude.message} />}
          </div>
        </div>

        <input type="hidden" {...register("timezone")} />

        {engineMessage && (
          <div className="flex items-start gap-2 rounded-md border border-accent/30 bg-accent/10 p-3 text-sm text-foreground">
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-accent" />
            <span>{engineMessage}</span>
          </div>
        )}

        <Button type="submit" disabled={isSubmitting} className="mt-1 w-full">
          {isSubmitting ? <Loader2 className="animate-spin" /> : <Sparkles />}
          Calculate chart
        </Button>
      </form>
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-destructive text-xs">{message}</p>;
}
