"use client";

import { useFormContext } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import type { BirthChartFormValues } from "../schema";
import { errorAria, FieldError } from "./field-error";

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
        <Input
          id="name"
          autoComplete="name"
          aria-required="true"
          placeholder="Pema Dorji"
          {...errorAria("name", errors.name?.message)}
          {...register("name")}
        />
        <FieldError field="name" message={errors.name?.message} />
      </div>

      <fieldset className="grid gap-1.5">
        <legend className="flex items-center gap-2 text-sm leading-none font-medium select-none">Gender</legend>
        <div className="mt-1.5 grid h-10 grid-cols-2 overflow-hidden rounded-lg border border-border/70 bg-muted/40">
          {GENDERS.map((option) => (
            <label
              key={option.value}
              className={cn(
                "flex cursor-pointer items-center justify-center px-5 text-sm transition-all has-[:focus-visible]:outline-2 has-[:focus-visible]:-outline-offset-2 has-[:focus-visible]:outline-primary",
                selected === option.value
                  ? "bg-primary text-primary-foreground shadow-[0_0_16px_-4px_var(--color-gold)]"
                  : "text-muted-foreground hover:bg-gold/10 hover:text-foreground",
              )}
            >
              <input
                type="radio"
                value={option.value}
                className="sr-only"
                aria-describedby={errors.gender?.message ? "gender-error" : undefined}
                {...register("gender")}
              />
              {option.label}
            </label>
          ))}
        </div>
        <FieldError field="gender" message={errors.gender?.message} />
      </fieldset>
    </div>
  );
}
