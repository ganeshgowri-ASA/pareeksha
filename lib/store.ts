'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  AppState,
  BoMChangeEntry,
  BoMComponent,
  ChangeType,
  Department,
  DepartmentResult,
  StandardId,
  CalculationInputState,
} from './types';
import { DEFAULT_DEPARTMENTS } from './departments';
import { DEFAULT_WORK_HOURS_PER_YEAR, DEFAULT_REALISATION_RATE } from './chambers';

interface StoreActions {
  setSelectedStandard: (id: StandardId) => void;
  setDepartments: (depts: Department[]) => void;
  addDepartment: (dept: Department) => void;
  updateDepartment: (id: string, updates: Partial<Department>) => void;
  removeDepartment: (id: string) => void;
  setBomChanges: (changes: BoMChangeEntry[]) => void;
  addBomChange: (change: BoMChangeEntry) => void;
  removeBomChange: (id: string) => void;
  toggleBoMChange: (component: BoMComponent, changeType: ChangeType) => void;
  setRealisationRate: (rate: number) => void;
  setWorkHoursPerYear: (hours: number) => void;
  setResults: (results: DepartmentResult[]) => void;
  setCalculationInput: (updates: Partial<CalculationInputState>) => void;
  reset: () => void;
}

const defaultCalculationInput: CalculationInputState = {
  projects: 10,
  boms: 3,
  modules: 8,
  realisationRate: DEFAULT_REALISATION_RATE,
  workHoursPerYear: DEFAULT_WORK_HOURS_PER_YEAR,
};

const initialState: AppState = {
  selectedStandard: 'IEC_61215',
  departments: DEFAULT_DEPARTMENTS,
  bomChanges: [],
  realisationRate: DEFAULT_REALISATION_RATE,
  workHoursPerYear: DEFAULT_WORK_HOURS_PER_YEAR,
  results: [],
  calculationInput: defaultCalculationInput,
};

export const useAppStore = create<AppState & StoreActions>()(
  persist(
    (set) => ({
      ...initialState,

      setSelectedStandard: (id) => set({ selectedStandard: id }),

      setDepartments: (depts) => set({ departments: depts }),

      addDepartment: (dept) =>
        set((state) => ({ departments: [...state.departments, dept] })),

      updateDepartment: (id, updates) =>
        set((state) => ({
          departments: state.departments.map((d) =>
            d.id === id ? { ...d, ...updates } : d
          ),
        })),

      removeDepartment: (id) =>
        set((state) => ({
          departments: state.departments.filter((d) => d.id !== id),
        })),

      setBomChanges: (changes) => set({ bomChanges: changes }),

      addBomChange: (change) =>
        set((state) => ({ bomChanges: [...state.bomChanges, change] })),

      removeBomChange: (id) =>
        set((state) => ({
          bomChanges: state.bomChanges.filter((c) => c.id !== id),
        })),

      toggleBoMChange: (component, changeType) =>
        set((state) => {
          const existing = state.bomChanges.find(
            (bc) => bc.component === component && bc.changeType === changeType
          );
          if (existing) {
            return {
              bomChanges: state.bomChanges.map((bc) =>
                bc.component === component && bc.changeType === changeType
                  ? { ...bc, selected: !bc.selected }
                  : bc
              ),
            };
          }
          return {
            bomChanges: [
              ...state.bomChanges,
              {
                id: `${component}-${changeType}`,
                component,
                changeType,
                projectCount: 1,
                selected: true,
              },
            ],
          };
        }),

      setRealisationRate: (rate) => set({ realisationRate: rate }),

      setWorkHoursPerYear: (hours) => set({ workHoursPerYear: hours }),

      setResults: (results) => set({ results }),

      setCalculationInput: (updates) =>
        set((state) => ({
          calculationInput: { ...state.calculationInput, ...updates },
        })),

      reset: () => set(initialState),
    }),
    {
      name: 'pareeksha-store',
    }
  )
);

/** Alias for backward compatibility */
export const useStore = useAppStore;
