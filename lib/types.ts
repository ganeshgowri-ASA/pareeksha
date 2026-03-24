// Stub types for UI compilation - Session A (Neeti) owns the real implementations

export type ChamberType =
  | "DH1000" | "DH2000" | "DH3000"
  | "TC50" | "TC200" | "TC400" | "TC600"
  | "HF10" | "HF20" | "HF40"
  | "PID108" | "PID288"
  | "UV15" | "UV60"
  | "SaltMist" | "SandDust" | "MechLoad" | "Hail";

export type ChamberCategory = "DH" | "TC" | "HF" | "PID" | "UV" | "SaltMist" | "SandDust" | "MechLoad" | "Hail";

export interface Chamber {
  id: ChamberType;
  category: ChamberCategory;
  name: string;
  slots: number;
  testHours: number;
  description: string;
}

export type BoMComponent =
  | "Glass" | "Encapsulant" | "Cell" | "Frame" | "JunctionBox"
  | "Backsheet" | "Foil" | "Wafer" | "Ribbon" | "Sealant" | "Potting";

export type ChangeType =
  | "NewSupplier" | "MaterialChange" | "NewFactory"
  | "DesignChange" | "BOMUpgrade" | "Requalification";

export interface BoMChange {
  component: BoMComponent;
  changeType: ChangeType;
  selected: boolean;
}

export interface TestProfile {
  id: string;
  name: string;
  chamberType: ChamberType;
  testHours: number;
  samplesRequired: number;
  description: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  projectsPerYear: number;
  bomsPerProject: number;
  modulesPerBom: number;
  color: string;
}

export type StandardId = "IEC" | "MNRE" | "REC" | "Custom";

export interface Standard {
  id: StandardId;
  name: string;
  description: string;
  tests: TestProfile[];
}

export interface CalculationInput {
  projects: number;
  boms: number;
  modules: number;
  realisationRate: number;
  workHoursPerYear: number;
}

export interface CalculationResult {
  chamberType: ChamberType;
  chamberName: string;
  totalTestHours: number;
  chambersRequired: number;
  utilization: number;
  slots: number;
}

export interface ReliabilityTest {
  id: string;
  name: string;
  chamberType: ChamberType;
  testHours: number;
  samplesRequired: number;
  annualDemand: number;
  chambersNeeded: number;
}
