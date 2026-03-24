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
  CalculationInput,
} from './types';
import { DEFAULT_DEPARTMENTS } from './departments';
import { DEFAULT_WORK_HOURS_PER_YEAR, DEFAULT_REALISATION_RATE } from './chambers';

interface StoreActions {
  setSelectedStandard: (id: StandardId) => void;
  setCalculationInput: (updates: Partial<CalculationInput>) => void;
  setDepartments: (depts: Department[]) => void;
  addDepartment: (dept: Department) => void;
  updateDepartment: (id: string, updates: Partial<Department>) => void;
  removeDepartment: (id: string) => void;
  setBomChanges: (changes: BoMChangeEntry[]) => void;
  toggleBoMChange: (component: BoMComponent, changeType: ChangeType) => void;
  setResults: (results: DepartmentResult[]) => void;
  reset: () => void;
}

const initialState: AppState = {
  selectedStandard: 'IEC',
  calculationInput: {
    projects: 10,
    boms: 3,
    modules: 8,
    realisationRate: DEFAULT_REALISATION_RATE,
    workHoursPerYear: DEFAULT_WORK_HOURS_PER_YEAR,
  },
  departments: DEFAULT_DEPARTMENTS,
  bomChanges: [],
  results: [],
};

export const useAppStore = create<AppState & StoreActions>()(
  persist(
    (set) => ({
      ...initialState,

      setSelectedStandard: (id) => set({ selectedStandard: id }),

      setCalculationInput: (updates) =>
        set((state) => ({
          calculationInput: { ...state.calculationInput, ...updates },
        })),

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
              { component, changeType, selected: true },
            ],
          };
        }),

      setResults: (results) => set({ results }),

      reset: () => set(initialState),
    }),
    {
      name: 'pareeksha-store',
    }
  )
);

/** Alias for backward compatibility */
export const useStore = useAppStore;
