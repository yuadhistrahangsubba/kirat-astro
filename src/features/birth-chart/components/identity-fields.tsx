"use client";

import { useFormContext } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import type { BirthChartFormValues } from "../schema";
import { FieldError } from "./field-error";

const GENDERS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
] as const;

export function IdentityFields() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<BirthChartFormValues>();
  const selected = watch("gender");

  return (
    <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
      <div className="grid gap-1.5">
        <Label htmlFor="name">Name</Label>
        <Input id="name" autoComplete="name" placeholder="Pema Dorji" {...register("name")} />
        <FieldError message={errors.name?.message} />
      </div>

      <fieldset className="grid gap-1.5">
        <legend className="flex items-center gap-2 text-sm leading-none font-medium select-none">Gender</legend>
        <div
          className="mt-1.5 grid h-10 grid-cols-2 overflow-hidden rounded-lg border border-border/70 bg-muted/40"
          role="radiogroup"
        >
          {GENDERS.map((option) => (
            <label
              key={option.value}
              className={cn(
                "flex cursor-pointer items-center justify-center px-5 text-sm transition-all",
                selected === option.value
                  ? "bg-primary text-primary-foreground shadow-[0_0_16px_-4px_var(--color-gold)]"
                  : "text-muted-foreground hover:bg-gold/10 hover:text-foreground",
              )}
            >
              <input type="radio" value={option.value} className="sr-only" {...register("gender")} />
              {option.label}
            </label>
          ))}
        </div>
        <FieldError message={errors.gender?.message} />
      </fieldset>
    </div>
  );
}
