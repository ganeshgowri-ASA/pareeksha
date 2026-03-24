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

export interface BoMComponent {
  id: string;
  name: string;
  category: string;
}

export interface ChangeType {
  id: string;
  name: string;
  testsRequired: string[];
}

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
  departments: Department[];
  bomChanges: Record<string, string[]>;
  standard: Standard;
  realizationRate: number;
}

export interface CalculationResult {
  chamberType: string;
  chambersNeeded: number;
  utilizationPct: number;
  totalTestHrs: number;
  bottleneck: boolean;
}

export interface BomChange {
  componentId: string;
  changeTypeId: string;
  selected: boolean;
}
