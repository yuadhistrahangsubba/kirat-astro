import { z } from "zod";

export const birthChartSchema = z.object({
  label: z
    .string()
    .trim()
    .min(1, "Give this chart a name, e.g. \"Myself\" or \"Pema\"")
    .max(60),
  birthDate: z
    .string()
    .refine((v) => !Number.isNaN(Date.parse(v)), "Enter a valid date"),
  birthTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Use 24-hour HH:mm")
    .optional()
    .or(z.literal("")),
  placeName: z.string().trim().min(2, "Enter a birth place"),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  timezone: z.string().min(1, "Timezone is required"),
});

export type BirthChartFormValues = z.infer<typeof birthChartSchema>;
