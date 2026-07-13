"use client";

import { Clock } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { BirthChartFormValues } from "../schema";
import { FieldError } from "./field-error";

export function BirthDateTimeFields() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<BirthChartFormValues>();
  const timeUnknown = watch("birthTimeUnknown");

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

  return (
    <fieldset className="grid gap-3">
      <div className="flex items-center justify-between">
        <legend className="text-sm leading-none font-medium select-none">Birth date & time</legend>
        <Button type="button" variant="ghost" size="sm" onClick={fillNow} className="h-7 gap-1.5 text-xs">
          <Clock className="size-3.5" aria-hidden="true" />
          Now
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="grid gap-1.5">
          <Label htmlFor="day" className="text-xs text-muted-foreground">
            Day
          </Label>
          <Input id="day" type="number" inputMode="numeric" placeholder="15" {...register("day")} />
          <FieldError message={errors.day?.message} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="month" className="text-xs text-muted-foreground">
            Month
          </Label>
          <Input id="month" type="number" inputMode="numeric" placeholder="8" {...register("month")} />
          <FieldError message={errors.month?.message} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="year" className="text-xs text-muted-foreground">
            Year
          </Label>
          <Input id="year" type="number" inputMode="numeric" placeholder="1995" {...register("year")} />
          <FieldError message={errors.year?.message} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="grid gap-1.5">
          <Label htmlFor="hour" className="text-xs text-muted-foreground">
            Hrs (0–23)
          </Label>
          <Input id="hour" type="number" inputMode="numeric" placeholder="08" disabled={timeUnknown} {...register("hour")} />
          <FieldError message={errors.hour?.message} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="minute" className="text-xs text-muted-foreground">
            Min
          </Label>
          <Input id="minute" type="number" inputMode="numeric" placeholder="30" disabled={timeUnknown} {...register("minute")} />
          <FieldError message={errors.minute?.message} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="second" className="text-xs text-muted-foreground">
            Sec
          </Label>
          <Input id="second" type="number" inputMode="numeric" placeholder="00" disabled={timeUnknown} {...register("second")} />
          <FieldError message={errors.second?.message} />
        </div>
      </div>

      <label className="flex w-fit cursor-pointer items-center gap-2 text-xs text-muted-foreground">
        <input type="checkbox" className="size-3.5 accent-[var(--color-gold)]" {...register("birthTimeUnknown")} />
        I don&apos;t know my birth time — most placements still resolve
      </label>
    </fieldset>
  );
}
