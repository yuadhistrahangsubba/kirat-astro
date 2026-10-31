import { z } from "zod";

// Native number inputs yield "" when empty and z.coerce turns "" into 0
// — which would silently make an empty Day field mean "day zero".
// Preprocess empties to undefined so required fields actually error.
function numeric<T extends z.ZodTypeAny>(schema: T) {
  return z.preprocess(
    (value) => (value === "" || value === null || (typeof value === "number" && Number.isNaN(value)) ? undefined : value),
    schema,
  );
}

export function isValidTimeZone(tz: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

const CURRENT_YEAR = new Date().getFullYear();

export const birthChartSchema = z
  .object({
    name: z.string().trim().min(1, "Enter a name").max(80),
    gender: z.enum(["male", "female"], { required_error: "Select one" }),

    day: numeric(z.coerce.number({ required_error: "Required" }).int().min(1, "1–31").max(31, "1–31")),
    month: numeric(z.coerce.number({ required_error: "Required" }).int().min(1, "1–12").max(12, "1–12")),
    year: numeric(
      z.coerce.number({ required_error: "Required" }).int().min(1800, "After 1800").max(CURRENT_YEAR, "In the past"),
    ),

    birthTimeUnknown: z.boolean(),
    hour: numeric(z.coerce.number().int().min(0, "0–23").max(23, "0–23").optional()),
    minute: numeric(z.coerce.number().int().min(0, "0–59").max(59, "0–59").optional()),
    second: numeric(z.coerce.number().int().min(0, "0–59").max(59, "0–59").optional()),

    placeName: z.string().trim().min(2, "Enter a birth place"),
    // Filled by picking a place, using current location, or Advanced —
    // requiring them here would surface errors inside a collapsed
    // section, so the superRefine below reports on placeName instead.
    latitude: numeric(z.coerce.number().min(-90).max(90).optional()),
    longitude: numeric(z.coerce.number().min(-180).max(180).optional()),
    timezone: z
      .string()
      .trim()
      .optional()
      .transform((tz) => tz || undefined)
      .refine((tz) => tz === undefined || isValidTimeZone(tz), "Unknown timezone — use an IANA name like Asia/Thimphu"),
  })
  .superRefine((values, ctx) => {
    // Reject impossible calendar dates (Feb 30, Apr 31…) that the
    // per-field ranges can't catch.
    if (values.day !== undefined && values.month !== undefined && values.year !== undefined) {
      const roundTrip = new Date(Date.UTC(values.year, values.month - 1, values.day));
      if (roundTrip.getUTCMonth() !== values.month - 1 || roundTrip.getUTCDate() !== values.day) {
        ctx.addIssue({ code: "custom", path: ["day"], message: "That day doesn't exist in this month" });
      }
    }

    if (!values.birthTimeUnknown) {
      if (values.hour === undefined)
        ctx.addIssue({ code: "custom", path: ["hour"], message: "Required — or tick “time unknown”" });
      if (values.minute === undefined) ctx.addIssue({ code: "custom", path: ["minute"], message: "Required" });
    }

    if (values.latitude === undefined || values.longitude === undefined || !values.timezone) {
      ctx.addIssue({
        code: "custom",
        path: ["placeName"],
        message: "Pick a place from the list, use current location, or set coordinates under Advanced",
      });
    }
  });

/**
 * Server-side guard for the engine input. Server Actions are public POST
 * endpoints, so the client-side form validation can't be trusted.
 */
export const birthInputSchema = z
  .object({
    birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    birthTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/)
      .optional(),
    timezone: z.string().refine(isValidTimeZone),
    latitude: z.number().finite().min(-90).max(90),
    longitude: z.number().finite().min(-180).max(180),
  })
  .refine(({ birthDate }) => {
    const [y, m, d] = birthDate.split("-").map(Number) as [number, number, number];
    const date = new Date(Date.UTC(y, m - 1, d));
    return y >= 1800 && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
  });

export type BirthChartFormValues = z.infer<typeof birthChartSchema>;

/** Compose the validated form values into the engine's BirthInput shape. */
export function toBirthInput(values: BirthChartFormValues) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return {
    birthDate: `${values.year}-${pad(values.month)}-${pad(values.day)}`,
    birthTime: values.birthTimeUnknown
      ? undefined
      : `${pad(values.hour!)}:${pad(values.minute!)}:${pad(values.second ?? 0)}`,
    timezone: values.timezone!,
    latitude: values.latitude!,
    longitude: values.longitude!,
  };
}
