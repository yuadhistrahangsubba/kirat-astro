import { create } from "zustand";

import type { BirthChartDraft, WizardStep } from "./types";

interface BirthChartWizardState {
  step: WizardStep;
  draft: BirthChartDraft;
  setDraft: (patch: BirthChartDraft) => void;
  goTo: (step: WizardStep) => void;
  reset: () => void;
}

const initialDraft: BirthChartDraft = {};

// Holds in-progress wizard state across steps so partial input survives
// step navigation. Scoped per-form-mount — not persisted across sessions.
export const useBirthChartWizard = create<BirthChartWizardState>((set) => ({
  step: "subject",
  draft: initialDraft,
  setDraft: (patch) => set((s) => ({ draft: { ...s.draft, ...patch } })),
  goTo: (step) => set({ step }),
  reset: () => set({ step: "subject", draft: initialDraft }),
}));
