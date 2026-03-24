export type ChamberCategory =
  | 'DH'
  | 'TC'
  | 'HF'
  | 'PID'
  | 'UV'
  | 'SaltMist'
  | 'SandDust'
  | 'MechLoad'
  | 'Hail'
  | 'BDT'
  | 'IPTest';

export interface ChamberType {
  id: string;
  category: ChamberCategory;
  name: string;
  label: string;
  slots: number;
  durationHours: number;
  description?: string;
}

export type BoMComponent =
  | 'Glass'
  | 'Encapsulant'
  | 'Cell'
  | 'Frame'
  | 'JunctionBox'
  | 'Backsheet'
  | 'Foil'
  | 'Wafer'
  | 'Ribbon'
  | 'Sealant'
  | 'Potting';

export type ChangeType =
  | 'NewSupplier'
  | 'MaterialChange'
  | 'NewFactory'
  | 'DesignChange'
  | 'BOMUpgrade'
  | 'Requalification';

export interface TestRequirement {
  chamberId: string;
  quantity: number;
}

export interface TestProfile {
  id: string;
  name: string;
  tests: TestRequirement[];
}

export interface BoMTestMapping {
  component: BoMComponent;
  changeType: ChangeType;
  requiredTests: string[];
}

export interface Standard {
  id: string;
  name: string;
  shortName: string;
  description: string;
  testProfiles: TestProfile[];
  bomTestMappings: BoMTestMapping[];
}

export interface Department {
  id: string;
  name: string;
  shortName: string;
  description: string;
  defaultProjects: number;
  defaultBomsPerProject: number;
  defaultModulesPerBom: number;
}

export interface CalculationInput {
  projects: number;
  bomsPerProject: number;
  modulesPerBom: number;
  standardId: string;
  departmentId?: string;
  realisationRate?: number;
  workHoursPerYear?: number;
}

export interface ChamberResult {
  chamberId: string;
  chamberName: string;
  category: ChamberCategory;
  testHours: number;
  slots: number;
  chambersNeeded: number;
  utilization: number;
}

export interface CalculationResult {
  input: CalculationInput;
  chambers: ChamberResult[];
  totalChambers: number;
  totalTestHours: number;
  averageUtilization: number;
  bottleneck: ChamberResult | null;
}

export interface BoMChange {
  component: BoMComponent;
  changeType: ChangeType;
  count: number;
}

export interface AppState {
  selectedStandardId: string;
  departments: Department[];
  bomChanges: BoMChange[];
  calculationInputs: CalculationInput;
  results: CalculationResult | null;
  setSelectedStandard: (id: string) => void;
  setDepartments: (depts: Department[]) => void;
  setBomChanges: (changes: BoMChange[]) => void;
  setCalculationInputs: (inputs: CalculationInput) => void;
  setResults: (results: CalculationResult | null) => void;
  resetAll: () => void;
}
