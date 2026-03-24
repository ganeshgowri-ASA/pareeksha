import { create } from "zustand";
import { AppState, BoMChange, CalculationResult, Department } from "./types";
import { DEFAULT_DEPARTMENTS } from "./departments";
import { STANDARDS } from "./standards";
import { calculateResults } from "./formulas";
import { DEFAULT_REALISATION_RATE, WORK_HOURS_PER_YEAR } from "./chambers";

interface StoreActions {
  setSelectedStandard: (code: string) => void;
  setDepartments: (departments: Department[]) => void;
  setBomChanges: (changes: BoMChange[]) => void;
  setRealisationRate: (rate: number) => void;
  recalculate: () => void;
}

export const useAppStore = create<AppState & StoreActions>((set, get) => ({
  selectedStandard: "IEC",
  departments: DEFAULT_DEPARTMENTS,
  bomChanges: [],
  results: [],
  realisationRate: DEFAULT_REALISATION_RATE,
  workHoursPerYear: WORK_HOURS_PER_YEAR,

  setSelectedStandard: (code) => {
    set({ selectedStandard: code });
    get().recalculate();
  },

  setDepartments: (departments) => {
    set({ departments });
    get().recalculate();
  },

  setBomChanges: (changes) => set({ bomChanges: changes }),

  setRealisationRate: (rate) => {
    set({ realisationRate: rate });
    get().recalculate();
  },

  recalculate: () => {
    const state = get();
    const standard = STANDARDS.find((s) => s.code === state.selectedStandard);
    if (!standard) return;
    const results = calculateResults(state.departments, standard.tests, state.realisationRate);
    set({ results });
  },
}));
