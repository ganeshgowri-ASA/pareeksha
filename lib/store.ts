"use client";

import { create } from "zustand";
import {
  BoMChange,
  BoMComponent,
  CalculationInput,
  ChangeType,
  Department,
  StandardId,
} from "./types";
import { DEFAULT_DEPARTMENTS } from "./departments";

const BOM_COMPONENTS: BoMComponent[] = [
  "Glass", "Encapsulant", "Cell", "Frame", "JunctionBox",
  "Backsheet", "Foil", "Wafer", "Ribbon", "Sealant", "Potting",
];

const CHANGE_TYPES: ChangeType[] = [
  "NewSupplier", "MaterialChange", "NewFactory",
  "DesignChange", "BOMUpgrade", "Requalification",
];

function createInitialBoMChanges(): BoMChange[] {
  const changes: BoMChange[] = [];
  for (const component of BOM_COMPONENTS) {
    for (const changeType of CHANGE_TYPES) {
      changes.push({ component, changeType, selected: false });
    }
  }
  return changes;
}

interface AppState {
  selectedStandard: StandardId;
  setSelectedStandard: (s: StandardId) => void;
  departments: Department[];
  setDepartments: (d: Department[]) => void;
  addDepartment: (d: Department) => void;
  removeDepartment: (id: string) => void;
  updateDepartment: (id: string, d: Partial<Department>) => void;
  bomChanges: BoMChange[];
  toggleBoMChange: (component: BoMComponent, changeType: ChangeType) => void;
  calculationInput: CalculationInput;
  setCalculationInput: (input: Partial<CalculationInput>) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedStandard: "IEC",
  setSelectedStandard: (s) => set({ selectedStandard: s }),
  departments: DEFAULT_DEPARTMENTS,
  setDepartments: (d) => set({ departments: d }),
  addDepartment: (d) =>
    set((state) => ({ departments: [...state.departments, d] })),
  removeDepartment: (id) =>
    set((state) => ({
      departments: state.departments.filter((dept) => dept.id !== id),
    })),
  updateDepartment: (id, updates) =>
    set((state) => ({
      departments: state.departments.map((dept) =>
        dept.id === id ? { ...dept, ...updates } : dept
      ),
    })),
  bomChanges: createInitialBoMChanges(),
  toggleBoMChange: (component, changeType) =>
    set((state) => ({
      bomChanges: state.bomChanges.map((bc) =>
        bc.component === component && bc.changeType === changeType
          ? { ...bc, selected: !bc.selected }
          : bc
      ),
    })),
  calculationInput: {
    projects: 10,
    boms: 4,
    modules: 8,
    realisationRate: 0.65,
    workHoursPerYear: 7200,
  },
  setCalculationInput: (input) =>
    set((state) => ({
      calculationInput: { ...state.calculationInput, ...input },
    })),
}));
