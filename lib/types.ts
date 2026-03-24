export interface ChamberVariant {
  name: string;
  durationHrs: number;
  cycles?: number;
}

export interface ChamberType {
  id: string;
  name: string;
  category: string;
  slotsFS: number;
  slotsMM: number;
  variants: ChamberVariant[];
}

// String literal types for BoM matrix UI
export type BoMComponentId =
  | 'Glass' | 'Encapsulant' | 'Cell' | 'Frame' | 'JunctionBox'
  | 'Backsheet' | 'Foil' | 'Wafer' | 'Ribbon' | 'Sealant' | 'Potting';

export type ChangeTypeId =
  | 'NewSupplier' | 'MaterialChange' | 'NewFactory'
  | 'DesignChange' | 'BOMUpgrade' | 'Requalification';

export interface TestProfile {
  id: string;
  chamberType: string;
  durationHrs: number;
  modulesRequired: number;
  standard: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  color?: string;
  projectsPerYear: number;
  bomsPerProject: number;
  modulesPerBom: number;
}

export interface Standard {
  id: string;
  name: string;
  code: string;
  testProfiles: TestProfile[];
}

export interface CalculationInput {
  projects: number;
  boms: number;
  modules: number;
  realisationRate: number;
  workHoursPerYear: number;
}

export interface CalculationResult {
  chamberType: string;
  chamberName: string;
  chambersNeeded: number;
  utilizationPct: number;
  totalTestHrs: number;
  bottleneck: boolean;
  slots: number;
  totalTestHours: number;
  chambersRequired: number;
  utilization: number;
}

export interface BomChange {
  component: BoMComponentId;
  changeType: ChangeTypeId;
  selected: boolean;
}
