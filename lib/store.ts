'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, BoMChange, CalculationInput, CalculationResult, Department } from './types';
import { DEFAULT_DEPARTMENTS } from './departments';

const defaultCalculationInputs: CalculationInput = {
  projects: 5,
  bomsPerProject: 3,
  modulesPerBom: 8,
  standardId: 'IEC_61215',
  realisationRate: 0.65,
  workHoursPerYear: 7200,
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      selectedStandardId: 'IEC_61215',
      departments: DEFAULT_DEPARTMENTS,
      bomChanges: [],
      calculationInputs: defaultCalculationInputs,
      results: null,

      setSelectedStandard: (id: string) =>
        set({ selectedStandardId: id, calculationInputs: { ...defaultCalculationInputs, standardId: id } }),

      setDepartments: (depts: Department[]) =>
        set({ departments: depts }),

      setBomChanges: (changes: BoMChange[]) =>
        set({ bomChanges: changes }),

      setCalculationInputs: (inputs: CalculationInput) =>
        set({ calculationInputs: inputs }),

      setResults: (results: CalculationResult | null) =>
        set({ results }),

      resetAll: () =>
        set({
          selectedStandardId: 'IEC_61215',
          departments: DEFAULT_DEPARTMENTS,
          bomChanges: [],
          calculationInputs: defaultCalculationInputs,
          results: null,
        }),
    }),
    {
      name: 'pareeksha-store',
    }
  )
);
