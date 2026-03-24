'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  AppState,
  BoMChangeEntry,
  Department,
  DepartmentResult,
  StandardId,
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
  setRealisationRate: (rate: number) => void;
  setWorkHoursPerYear: (hours: number) => void;
  setResults: (results: DepartmentResult[]) => void;
  reset: () => void;
}

const initialState: AppState = {
  selectedStandard: 'IEC_61215',
  departments: DEFAULT_DEPARTMENTS,
  bomChanges: [],
  realisationRate: DEFAULT_REALISATION_RATE,
  workHoursPerYear: DEFAULT_WORK_HOURS_PER_YEAR,
  results: [],
};

export const useStore = create<AppState & StoreActions>()(
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

      setRealisationRate: (rate) => set({ realisationRate: rate }),

      setWorkHoursPerYear: (hours) => set({ workHoursPerYear: hours }),

      setResults: (results) => set({ results }),

      reset: () => set(initialState),
    }),
    {
      name: 'pareeksha-store',
    }
  )
);
