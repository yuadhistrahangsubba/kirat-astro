"use client";

import { useFormContext } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { BirthChartFormValues } from "../schema";
import { errorAria, FieldError } from "./field-error";

export function BirthDateTimeFields() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<BirthChartFormValues>();
  const timeUnknown = watch("birthTimeUnknown");

  return (
    <fieldset className="grid gap-3">
      <legend className="sr-only">Birth date and time</legend>

      <div className="grid grid-cols-3 gap-3">
        <div className="grid gap-1.5">
          <Label htmlFor="day" className="text-xs text-muted-foreground">
            Day
          </Label>
          <Input id="day" type="number" inputMode="numeric" min={1} max={31} placeholder="15" autoComplete="bday-day" aria-required="true" {...errorAria("day", errors.day?.message)} {...register("day")} />
          <FieldError field="day" message={errors.day?.message} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="month" className="text-xs text-muted-foreground">
            Month
          </Label>
          <Input id="month" type="number" inputMode="numeric" min={1} max={12} placeholder="8" autoComplete="bday-month" aria-required="true" {...errorAria("month", errors.month?.message)} {...register("month")} />
          <FieldError field="month" message={errors.month?.message} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="year" className="text-xs text-muted-foreground">
            Year
          </Label>
          <Input
            id="year"
            type="number"
            inputMode="numeric"
            min={1800}
            max={new Date().getFullYear()}
            placeholder="1995"
            autoComplete="bday-year" aria-required="true" {...errorAria("year", errors.year?.message)} {...register("year")}
          />
          <FieldError field="year" message={errors.year?.message} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="grid gap-1.5">
          <Label htmlFor="hour" className="text-xs text-muted-foreground">
            Hrs (0–23)
          </Label>
          <Input
            id="hour"
            type="number"
            inputMode="numeric"
            min={0}
            max={23}
            placeholder="08"
            disabled={timeUnknown}
            {...errorAria("hour", errors.hour?.message)} {...register("hour")}
          />
          <FieldError field="hour" message={errors.hour?.message} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="minute" className="text-xs text-muted-foreground">
            Min
          </Label>
          <Input
            id="minute"
            type="number"
            inputMode="numeric"
            min={0}
            max={59}
            placeholder="30"
            disabled={timeUnknown}
            {...errorAria("minute", errors.minute?.message)} {...register("minute")}
          />
          <FieldError field="minute" message={errors.minute?.message} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="second" className="text-xs text-muted-foreground">
            Sec
          </Label>
          <Input
            id="second"
            type="number"
            inputMode="numeric"
            min={0}
            max={59}
            placeholder="00"
            disabled={timeUnknown}
            {...errorAria("second", errors.second?.message)} {...register("second")}
          />
          <FieldError field="second" message={errors.second?.message} />
        </div>
      </div>

      <label className="flex w-fit cursor-pointer items-center gap-2 text-xs text-muted-foreground">
        <input type="checkbox" className="size-3.5 accent-[var(--color-gold)]" {...register("birthTimeUnknown")} />
        I don&apos;t know my birth time — most placements still resolve
      </label>
    </fieldset>
  );
}
