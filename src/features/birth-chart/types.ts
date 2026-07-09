import type { BirthChartFormValues } from "./schema";

export type BirthChartDraft = Partial<BirthChartFormValues>;

export type WizardStep = "subject" | "review";
