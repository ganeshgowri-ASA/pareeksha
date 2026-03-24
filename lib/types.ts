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
  slots?: number;
  slotsFullSize: number;
  slotsMiniModule: number;
  testDurationHrs: number;
}

/** BoM component identifiers */
export type BoMComponent =
  | 'Glass' | 'Encapsulant' | 'Cell' | 'Frame' | 'JunctionBox'
  | 'Backsheet' | 'Foil' | 'Wafer' | 'Ribbon' | 'Sealant' | 'Potting';

/** Change type identifiers */
export type ChangeType =
  | 'NewSupplier' | 'MaterialChange' | 'NewFactory'
  | 'DesignChange' | 'BOMUpgrade' | 'Requalification';

/** Standard identifiers */
export type StandardId = 'IEC' | 'MNRE' | 'REC' | 'Custom';

/** Test profile within a standard */
export interface TestProfile {
  id: string;
  name: string;
  chamberType: ChamberTypeId;
  testHours: number;
  samplesRequired: number;
  description: string;
  /** Alias for testHours (DARSHANA compat) */
  durationHrs: number;
  /** Alias for samplesRequired (DARSHANA compat) */
  modulesRequired: number;
}

/** Test sequence grouping */
export interface TestSequence {
  id: string;
  name: string;
  tests: { id: string; name: string; chamberTypeId: ChamberTypeId; modulesRequired: number }[];
}

/** Standard profile with test mappings */
export interface Standard {
  id: StandardId;
  code: string;
  name: string;
  description: string;
  tests: TestProfile[];
  /** Alias for tests (DARSHANA compat) */
  testProfiles: TestProfile[];
  sequences: TestSequence[];
  bomTestMapping: Record<BoMComponent, ChamberTypeId[]>;
}

/** Department definition */
export interface Department {
  id: string;
  name: string;
  description: string;
  projectsPerYear: number;
  bomsPerProject: number;
  modulesPerBom: number;
  standardId: StandardId;
  color?: string;
}

/** BoM change entry */
export interface BoMChange {
  component: BoMComponent;
  changeType: ChangeType;
  selected: boolean;
}

/** Calculation input */
export interface CalculationInput {
  projects: number;
  boms: number;
  modules: number;
  realisationRate: number;
  workHoursPerYear: number;
}

/** Unified calculation result */
export interface CalculationResult {
  chamberType: ChamberTypeId;
  chamberName: string;
  slots: number;
  totalTestHours: number;
  /** Alias for totalTestHours (DARSHANA compat) */
  totalTestHrs: number;
  chambersRequired: number;
  /** Alias for chambersRequired (DARSHANA compat) */
  chambersNeeded: number;
  utilization: number;
  /** Alias for utilization (DARSHANA compat) */
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

/** Reliability test entry */
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
  bomChanges: BoMChange[];
}
