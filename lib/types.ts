/** Chamber type identifiers */
export type ChamberTypeId =
  | 'DH1000' | 'DH2000' | 'DH3000'
  | 'TC50' | 'TC200' | 'TC400' | 'TC600'
  | 'HF10' | 'HF20' | 'HF40'
  | 'PID108' | 'PID288' | 'PID96'
  | 'UV15' | 'UV60'
  | 'SaltMist' | 'SandDust' | 'MechLoad' | 'DynMechLoad' | 'Hail'
  | 'BDT' | 'IPTest'
  | 'HotSpot' | 'ReverseCurrentOverload';

/** Chamber category */
export type ChamberCategory =
  | 'DH' | 'TC' | 'HF' | 'PID' | 'UV'
  | 'SaltMist' | 'SandDust' | 'MechLoad' | 'DynMechLoad' | 'Hail'
  | 'BDT' | 'IPTest'
  | 'HotSpot' | 'ReverseCurrentOverload';

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

/**
 * BoM component identifiers per IEC TS 62915
 * Expanded to include sub-elements for retesting matrix
 */
export type BoMComponent =
  | 'Glass' | 'Encapsulant' | 'Cell' | 'Frame' | 'JunctionBox'
  | 'Backsheet' | 'Foil' | 'Wafer' | 'Ribbon' | 'Sealant' | 'Potting'
  | 'Interconnect' | 'Busbar' | 'EdgeSeal' | 'BypassDiode'
  | 'Connector' | 'PottingMaterial' | 'Adhesive'
  | 'StructuralMember' | 'CellLayout' | 'ModuleDimension';

/** BoM component category for grouping in UI */
export type BoMCategory =
  | 'Frontsheet' | 'Encapsulation' | 'CellAssembly' | 'Backside'
  | 'Electrical' | 'Mechanical' | 'DesignLayout';

/** BoM component metadata for IEC 62915 */
export interface BoMComponentInfo {
  id: BoMComponent;
  name: string;
  category: BoMCategory;
  description: string;
  /** Sub-elements per IEC 62915 */
  subElements?: string[];
  /** Whether this component exists in 2018 edition */
  in2018: boolean;
  /** Whether this component exists in 2023 edition */
  in2023: boolean;
}

/** Change type identifiers */
export type ChangeType =
  | 'NewSupplier' | 'MaterialChange' | 'NewFactory'
  | 'DesignChange' | 'BOMUpgrade' | 'Requalification'
  | 'ThicknessChange' | 'DimensionChange' | 'ProcessChange';

/** Standard identifiers - Generic (no REC) */
export type StandardId = 'IEC' | 'IEC62915_2018' | 'IEC62915_2023' | 'MNRE' | 'BIS' | 'Custom';

/** IEC 62915 edition */
export type IEC62915Edition = '2018' | '2023';

/** Retest requirement level */
export type RetestLevel = 'full' | 'partial' | 'none' | 'engineering_judgment';

/** IEC 62915 Retest matrix entry */
export interface RetestRequirement {
  component: BoMComponent;
  changeType: ChangeType;
  /** Tests required per IEC 62915:2018 */
  testsRequired2018: ChamberTypeId[];
  /** Tests required per IEC 62915:2023 */
  testsRequired2023: ChamberTypeId[];
  retestLevel: RetestLevel;
  notes?: string;
}

/** Test profile within a standard */
export interface TestProfile {
  id: string;
  name: string;
  chamberType: ChamberTypeId;
  testHours: number;
  samplesRequired: number;
  description: string;
  /** MQT reference number per IEC 61215/61730 */
  mqtRef?: string;
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
  /** Selected IEC 62915 edition for comparison */
  iec62915Edition?: IEC62915Edition;
}
