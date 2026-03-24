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
  slots: number;
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
  | 'DesignChange'
  | 'BOMUpgrade'
  | 'Requalification';

/** Standard identifiers */
export type StandardId = 'IEC' | 'MNRE' | 'REC' | 'Custom';

/** Test definition within a standard */
export interface TestDefinition {
  id: string;
  name: string;
  chamberType: ChamberTypeId;
  chamberTypeId: ChamberTypeId;
  testHours: number;
  samplesRequired: number;
  modulesRequired: number;
  durationHrs: number;
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
  code: string;
  name: string;
  description: string;
  tests: TestDefinition[];
  testProfiles: TestDefinition[];
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
  projectsPerYear: number;
  bomsPerProject: number;
  modulesPerBom: number;
  defaultProjectsPerYear: number;
  defaultBomsPerProject: number;
  defaultModulesPerBom: number;
  standardId: StandardId;
  color: string;
}

/** Calculation input parameters */
export interface CalculationInput {
  projects: number;
  boms: number;
  modules: number;
  realisationRate: number;
  workHoursPerYear: number;
}

/** Result of chamber calculation - unified for all consumers */
export interface CalculationResult {
  chamberType: ChamberTypeId;
  chamberName: string;
  slots: number;
  totalTestHours: number;
  totalTestHrs: number;
  chambersRequired: number;
  chambersNeeded: number;
  utilization: number;
  utilizationPct: number;
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
  component: BoMComponent;
  changeType: ChangeType;
  selected: boolean;
}

/** Reliability test for planner */
export interface ReliabilityTest {
  id: string;
  name: string;
  chamberType: ChamberTypeId;
  testHours: number;
  samplesRequired: number;
  annualDemand: number;
  chambersNeeded: number;
}

/** Global app state */
export interface AppState {
  selectedStandard: StandardId;
  calculationInput: CalculationInput;
  departments: Department[];
  bomChanges: BoMChangeEntry[];
  results: DepartmentResult[];
}
