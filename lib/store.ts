import { create } from 'zustand';
import { Department, Standard, CalculationResult, BomChange, CalculationInput, BoMComponentId, ChangeTypeId } from './types';
import { DEFAULT_DEPARTMENTS } from './departments';
import { STANDARDS } from './standards';
import { calcAllDepartments } from './formulas';
import { DEFAULT_REALISATION_RATE, WORK_HRS_PER_YEAR } from './chambers';

interface AppState {
  selectedStandard: Standard;
  departments: Department[];
  bomChanges: BomChange[];
  results: CalculationResult[];
  realizationRate: number;
  calculationInput: CalculationInput;
  setStandard: (id: string) => void;
  setSelectedStandard: (id: string) => void;
  addDepartment: (dept: Department) => void;
  updateDepartment: (id: string, updates: Partial<Department>) => void;
  removeDepartment: (id: string) => void;
  setBomChanges: (changes: BomChange[]) => void;
  toggleBoMChange: (component: BoMComponentId, changeType: ChangeTypeId) => void;
  setRealizationRate: (rate: number) => void;
  setCalculationInput: (updates: Partial<CalculationInput>) => void;
  calculateAll: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  selectedStandard: STANDARDS[0],
  departments: DEFAULT_DEPARTMENTS,
  bomChanges: [],
  results: [],
  realizationRate: DEFAULT_REALISATION_RATE,
  calculationInput: {
    projects: 10,
    boms: 5,
    modules: 4,
    realisationRate: DEFAULT_REALISATION_RATE,
    workHoursPerYear: WORK_HRS_PER_YEAR,
  },

  setStandard: (id: string) => {
    const std = STANDARDS.find((s) => s.id === id);
    if (std) {
      set({ selectedStandard: std });
      get().calculateAll();
    }
  },

  setSelectedStandard: (id: string) => {
    get().setStandard(id);
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

  toggleBoMChange: (component: BoMComponentId, changeType: ChangeTypeId) => {
    set((s) => {
      const existing = s.bomChanges.find(
        (bc) => bc.component === component && bc.changeType === changeType
      );
      if (existing) {
        return {
          bomChanges: s.bomChanges.map((bc) =>
            bc.component === component && bc.changeType === changeType
              ? { ...bc, selected: !bc.selected }
              : bc
          ),
        };
      }
      return {
        bomChanges: [...s.bomChanges, { component, changeType, selected: true }],
      };
    });
  },

  setRealizationRate: (rate: number) => {
    set({ realizationRate: rate });
    get().calculateAll();
  },

  setCalculationInput: (updates: Partial<CalculationInput>) => {
    set((s) => ({
      calculationInput: { ...s.calculationInput, ...updates },
    }));
  },

  calculateAll: () => {
    const { departments, selectedStandard, realizationRate } = get();
    const results = calcAllDepartments(departments, selectedStandard, realizationRate);
    set({ results });
  },
}));
