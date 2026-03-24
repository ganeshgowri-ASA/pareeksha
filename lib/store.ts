'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  AppState,
  BoMChange,
  BoMComponent,
  CalculationInput,
  ChangeType,
  Department,
  StandardId,
} from './types';
import { DEFAULT_DEPARTMENTS } from './departments';
import { DEFAULT_WORK_HOURS_PER_YEAR, DEFAULT_REALISATION_RATE } from './chambers';

interface StoreActions {
  setSelectedStandard: (id: StandardId) => void;
  setCalculationInput: (partial: Partial<CalculationInput>) => void;
  setDepartments: (depts: Department[]) => void;
  addDepartment: (dept: Department) => void;
  updateDepartment: (id: string, updates: Partial<Department>) => void;
  removeDepartment: (id: string) => void;
  toggleBoMChange: (component: BoMComponent, changeType: ChangeType) => void;
  reset: () => void;
}

const initialState: AppState = {
  selectedStandard: 'IEC',
  calculationInput: {
    projects: 10,
    boms: 4,
    modules: 8,
    realisationRate: DEFAULT_REALISATION_RATE,
    workHoursPerYear: DEFAULT_WORK_HOURS_PER_YEAR,
  },
  departments: DEFAULT_DEPARTMENTS,
  bomChanges: [],
};

export const useAppStore = create<AppState & StoreActions>()(
  persist(
    (set) => ({
      ...initialState,

      setSelectedStandard: (id) => set({ selectedStandard: id }),

      setCalculationInput: (partial) =>
        set((state) => ({
          calculationInput: { ...state.calculationInput, ...partial },
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

      toggleBoMChange: (component, changeType) =>
        set((state) => {
          const idx = state.bomChanges.findIndex(
            (b) => b.component === component && b.changeType === changeType
          );
          if (idx >= 0) {
            const updated = [...state.bomChanges];
            updated[idx] = { ...updated[idx], selected: !updated[idx].selected };
            return { bomChanges: updated };
          }
          return {
            bomChanges: [
              ...state.bomChanges,
              { component, changeType, selected: true } as BoMChange,
            ],
          };
        }),

      reset: () => set(initialState),
    }),
    {
      name: 'pareeksha-store',
    }
  )
);

/** Backward-compatible alias */
export const useStore = useAppStore;
