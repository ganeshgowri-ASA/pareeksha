import { create } from 'zustand';
import { Department, Standard, CalculationResult, BomChange } from './types';
import { DEFAULT_DEPARTMENTS } from './departments';
import { STANDARDS } from './standards';
import { calcAllDepartments } from './formulas';
import { DEFAULT_REALISATION_RATE } from './chambers';

interface AppState {
  selectedStandard: Standard;
  departments: Department[];
  bomChanges: BomChange[];
  results: CalculationResult[];
  realizationRate: number;
  setStandard: (id: string) => void;
  addDepartment: (dept: Department) => void;
  updateDepartment: (id: string, updates: Partial<Department>) => void;
  removeDepartment: (id: string) => void;
  setBomChanges: (changes: BomChange[]) => void;
  setRealizationRate: (rate: number) => void;
  calculateAll: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  selectedStandard: STANDARDS[0],
  departments: DEFAULT_DEPARTMENTS,
  bomChanges: [],
  results: [],
  realizationRate: DEFAULT_REALISATION_RATE,

  setStandard: (id: string) => {
    const std = STANDARDS.find((s) => s.id === id);
    if (std) {
      set({ selectedStandard: std });
      get().calculateAll();
    }
  },

  addDepartment: (dept: Department) => {
    set((s) => ({ departments: [...s.departments, dept] }));
    get().calculateAll();
  },

  updateDepartment: (id: string, updates: Partial<Department>) => {
    set((s) => ({
      departments: s.departments.map((d) =>
        d.id === id ? { ...d, ...updates } : d
      ),
    }));
    get().calculateAll();
  },

  removeDepartment: (id: string) => {
    set((s) => ({ departments: s.departments.filter((d) => d.id !== id) }));
    get().calculateAll();
  },

  setBomChanges: (changes: BomChange[]) => {
    set({ bomChanges: changes });
    get().calculateAll();
  },

  setRealizationRate: (rate: number) => {
    set({ realizationRate: rate });
    get().calculateAll();
  },

  calculateAll: () => {
    const { departments, selectedStandard, realizationRate } = get();
    const results = calcAllDepartments(departments, selectedStandard, realizationRate);
    set({ results });
  },
}));
