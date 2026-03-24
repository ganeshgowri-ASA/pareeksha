export interface Chamber {
  id: string;
  name: string;
  type: ChamberType;
  slots: number;
  testHours: number;
  description: string;
}

export type ChamberType =
  | "DH"
  | "TC"
  | "HF"
  | "PID"
  | "UV"
  | "SaltMist"
  | "SandDust"
  | "MechLoad"
  | "Hail";

export interface BoMComponent {
  id: string;
  name: string;
  category: string;
}

export interface ChangeType {
  id: string;
  name: string;
  description: string;
}

export interface TestProfile {
  id: string;
  name: string;
  chamberType: ChamberType;
  testHours: number;
  modulesRequired: number;
  standard: string;
}

export interface Department {
  id: string;
  name: string;
  projectsPerYear: number;
  bomsPerProject: number;
  modulesPerTest: number;
}

export interface Standard {
  id: string;
  name: string;
  code: string;
  tests: TestProfile[];
  required: boolean;
}

export interface CalculationResult {
  chamberType: ChamberType;
  chamberName: string;
  totalTestHours: number;
  chambersRequired: number;
  utilization: number;
  slots: number;
}

export interface BoMChange {
  componentId: string;
  changeTypeId: string;
  selected: boolean;
}

export interface AppState {
  selectedStandard: string;
  departments: Department[];
  bomChanges: BoMChange[];
  results: CalculationResult[];
  realisationRate: number;
  workHoursPerYear: number;
}
