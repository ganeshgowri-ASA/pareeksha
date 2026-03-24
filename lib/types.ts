/** Chamber type identifiers */
export type ChamberTypeId =
  | 'DH1000' | 'DH2000' | 'DH3000'
  | 'TC50' | 'TC200' | 'TC400' | 'TC600'
  | 'HF10' | 'HF20' | 'HF40'
  | 'PID108' | 'PID288'
  | 'UV15' | 'UV60'
  | 'SaltMist' | 'SandDust' | 'MechLoad' | 'Hail'
  | 'BDT' | 'IPTest';

/** Chamber category */
export type ChamberCategory =
  | 'DH' | 'TC' | 'HF' | 'PID' | 'UV'
  | 'SaltMist' | 'SandDust' | 'MechLoad' | 'Hail'
  | 'BDT' | 'IPTest';

/** Chamber type definition */
export interface ChamberType {
  id: ChamberTypeId;
  category: ChamberCategory;
  name: string;
  description: string;
  slotsFullSize: number;
  slotsMiniModule: number;
  testDurationHrs: number;
}

/** BoM component identifiers */
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

/** Change type identifiers */
export type ChangeType =
  | 'NewSupplier'
  | 'MaterialChange'
  | 'NewFactory'
  | 'NewFactoryLine'
  | 'DesignChange'
  | 'BOMUpgrade'
  | 'Requalification';

/** Standard identifiers */
export type StandardId = 'IEC_61215' | 'MNRE_ALMM' | 'REC' | 'Custom';

/** Test definition within a standard */
export interface TestDefinition {
  id: string;
  name: string;
  chamberTypeId: ChamberTypeId;
  modulesRequired: number;
  description?: string;
}

/** Test sequence for a standard */
export interface TestSequence {
  id: string;
  name: string;
  tests: TestDefinition[];
}

/** Standard profile with test mappings */
export interface Standard {
  id: StandardId;
  name: string;
  description: string;
  sequences: TestSequence[];
  bomTestMapping: Record<BoMComponent, ChamberTypeId[]>;
}

/** Test profile (subset of tests for a specific purpose) */
export interface TestProfile {
  id: string;
  name: string;
  standardId: StandardId;
  selectedTests: string[];
  description?: string;
}

/** Department definition */
export interface Department {
  id: string;
  name: string;
  description: string;
  defaultProjectsPerYear: number;
  defaultBomsPerProject: number;
  defaultModulesPerBom: number;
  standardId: StandardId;
  color?: string;
}

/** Input for chamber calculation */
export interface CalculationInput {
  projects: number;
  bomsPerProject: number;
  modulesPerBom: number;
  testDurationHrs: number;
  slotsPerChamber: number;
  workHoursPerYear?: number;
  realisationRate?: number;
}

/** Unified calculation result used across all components */
export interface CalculationResult {
  chamberType: string;
  chamberName: string;
  slots: number;
  chambersNeeded: number;
  chambersRequired: number;
  totalTestHrs: number;
  totalTestHours: number;
  utilizationPct: number;
  utilization: number;
  bottleneck: boolean;
}

/** Department calculation result */
export interface DepartmentResult {
  departmentId: string;
  departmentName: string;
  results: CalculationResult[];
  totalChambers: number;
}

/** BoM change entry */
export interface BoMChangeEntry {
  id: string;
  component: BoMComponent;
  changeType: ChangeType;
  description?: string;
  projectCount: number;
  selected: boolean;
}

/** Reliability test entry for planner */
export interface ReliabilityTest {
  id: string;
  name: string;
  chamberType: string;
  testHours: number;
  samplesRequired: number;
  annualDemand: number;
  chambersNeeded: number;
}

/** Global calculation input state */
export interface CalculationInputState {
  projects: number;
  boms: number;
  modules: number;
  realisationRate: number;
  workHoursPerYear: number;
}

/** Global app state */
export interface AppState {
  selectedStandard: StandardId;
  departments: Department[];
  bomChanges: BoMChangeEntry[];
  realisationRate: number;
  workHoursPerYear: number;
  results: DepartmentResult[];
  calculationInput: CalculationInputState;
}
