import {
  Standard,
  BoMComponent,
  ChamberTypeId,
  TestProfile,
  TestSequence,
  RetestRequirement,
  BoMComponentInfo,
  BoMCategory,
  IEC62915Edition,
} from './types';

function tp(
  id: string,
  name: string,
  chamberType: ChamberTypeId,
  testHours: number,
  samplesRequired: number,
  description: string
): TestProfile {
  return {
    id,
    name,
    chamberType,
    testHours,
    samplesRequired,
    description,
    durationHrs: testHours,
    modulesRequired: samplesRequired,
  };
}

/** BoM component metadata for IEC 62915 grouping */
export const BOM_COMPONENT_INFO: BoMComponentInfo[] = [
  { id: 'Glass', name: 'Glass', category: 'Frontsheet', description: 'Front glass cover', in2018: true, in2023: true },
  { id: 'Encapsulant', name: 'Encapsulant', category: 'Encapsulation', description: 'Encapsulant material (EVA, POE, etc.)', in2018: true, in2023: true },
  { id: 'Cell', name: 'Cell', category: 'CellAssembly', description: 'Solar cell', in2018: true, in2023: true },
  { id: 'Frame', name: 'Frame', category: 'Mechanical', description: 'Module frame', in2018: true, in2023: true },
  { id: 'JunctionBox', name: 'Junction Box', category: 'Electrical', description: 'Junction box assembly', in2018: true, in2023: true },
  { id: 'Backsheet', name: 'Backsheet', category: 'Backside', description: 'Back surface material (polymer)', in2018: true, in2023: true },
  { id: 'Foil', name: 'Foil', category: 'Backside', description: 'Back surface foil (glass-glass modules)', in2018: true, in2023: true },
  { id: 'Wafer', name: 'Wafer', category: 'CellAssembly', description: 'Silicon wafer substrate', in2018: true, in2023: true },
  { id: 'Ribbon', name: 'Ribbon', category: 'CellAssembly', description: 'Cell interconnect ribbon', in2018: true, in2023: true },
  { id: 'Sealant', name: 'Sealant', category: 'Encapsulation', description: 'Edge sealant', in2018: true, in2023: true },
  { id: 'Potting', name: 'Potting', category: 'Electrical', description: 'Junction box potting compound', in2018: true, in2023: true },
  { id: 'Interconnect', name: 'Interconnect', category: 'CellAssembly', description: 'Cell-to-cell interconnect (wire, foil)', in2018: false, in2023: true },
  { id: 'Busbar', name: 'Busbar', category: 'CellAssembly', description: 'String busbar / bus ribbon', in2018: false, in2023: true },
  { id: 'EdgeSeal', name: 'Edge Seal', category: 'Encapsulation', description: 'Edge seal / perimeter seal', in2018: false, in2023: true },
  { id: 'BypassDiode', name: 'Bypass Diode', category: 'Electrical', description: 'Bypass diode in junction box', in2018: true, in2023: true },
  { id: 'Connector', name: 'Connector', category: 'Electrical', description: 'Cable connector (MC4 etc.)', in2018: true, in2023: true },
  { id: 'PottingMaterial', name: 'Potting Material', category: 'Electrical', description: 'Potting compound for electrical components', in2018: false, in2023: true },
  { id: 'Adhesive', name: 'Adhesive', category: 'Mechanical', description: 'Structural adhesive (frameless mounting)', in2018: false, in2023: true },
  { id: 'StructuralMember', name: 'Structural Member', category: 'Mechanical', description: 'Structural support elements', in2018: false, in2023: true },
  { id: 'CellLayout', name: 'Cell Layout', category: 'DesignLayout', description: 'Cell arrangement / string design change', in2018: true, in2023: true },
  { id: 'ModuleDimension', name: 'Module Dimension', category: 'DesignLayout', description: 'Overall module dimensions change', in2018: true, in2023: true },
];

/** Get components by category */
export function getComponentsByCategory(category: BoMCategory): BoMComponentInfo[] {
  return BOM_COMPONENT_INFO.filter((c) => c.category === category);
}

/** Get components by IEC 62915 edition */
export function getComponentsByEdition(edition: IEC62915Edition): BoMComponentInfo[] {
  return BOM_COMPONENT_INFO.filter((c) => edition === '2018' ? c.in2018 : c.in2023);
}

/** All BoM categories in display order */
export const BOM_CATEGORIES: BoMCategory[] = [
  'Frontsheet', 'Encapsulation', 'CellAssembly', 'Backside',
  'Electrical', 'Mechanical', 'DesignLayout',
];

const defaultBomTestMapping: Record<BoMComponent, ChamberTypeId[]> = {
  Glass: ['DH1000', 'TC200', 'HF10', 'UV15', 'Hail', 'MechLoad'],
  Encapsulant: ['DH1000', 'TC200', 'HF10', 'UV15', 'PID108'],
  Cell: ['DH1000', 'TC200', 'HF10', 'UV15', 'PID108', 'MechLoad'],
  Frame: ['DH1000', 'TC200', 'HF10', 'MechLoad', 'SaltMist'],
  JunctionBox: ['DH1000', 'TC200', 'HF10', 'BDT', 'IPTest'],
  Backsheet: ['DH1000', 'TC200', 'HF10', 'UV15'],
  Foil: ['DH1000', 'TC200', 'HF10', 'UV15'],
  Wafer: ['DH1000', 'TC200', 'HF10', 'PID108'],
  Ribbon: ['DH1000', 'TC200', 'HF10'],
  Sealant: ['DH1000', 'TC200', 'HF10', 'IPTest'],
  Potting: ['DH1000', 'TC200', 'HF10', 'BDT'],
  Interconnect: ['DH1000', 'TC200', 'HF10', 'MechLoad'],
  Busbar: ['DH1000', 'TC200', 'HF10'],
  EdgeSeal: ['DH1000', 'TC200', 'HF10', 'IPTest'],
  BypassDiode: ['DH1000', 'TC200', 'HF10', 'BDT', 'HotSpot'],
  Connector: ['DH1000', 'TC200', 'HF10', 'IPTest'],
  PottingMaterial: ['DH1000', 'TC200', 'HF10', 'BDT'],
  Adhesive: ['DH1000', 'TC200', 'HF10', 'MechLoad', 'DynMechLoad'],
  StructuralMember: ['DH1000', 'TC200', 'HF10', 'MechLoad', 'DynMechLoad'],
  CellLayout: ['DH1000', 'TC200', 'HF10', 'MechLoad', 'HotSpot'],
  ModuleDimension: ['DH1000', 'TC200', 'HF10', 'MechLoad', 'DynMechLoad'],
};

const iecTests: TestProfile[] = [
  tp('uv_pre', 'UV Preconditioning', 'UV15', 120, 2, 'UV exposure 15 kWh/m²'),
  tp('tc50', 'Thermal Cycling 50', 'TC50', 500, 2, '-40°C to +85°C, 50 cycles'),
  tp('hf10', 'Humidity Freeze 10', 'HF10', 500, 2, '-40°C to +85°C/85% RH, 10 cycles'),
  tp('tc200', 'Thermal Cycling 200', 'TC200', 1600, 2, '-40°C to +85°C, 200 cycles'),
  tp('dh1000', 'Damp Heat 1000h', 'DH1000', 1050, 2, '85°C/85% RH for 1000 hours'),
  tp('uv60', 'UV Exposure 60kWh', 'UV60', 480, 2, 'UV exposure 60 kWh/m²'),
  tp('mech', 'Mechanical Load', 'MechLoad', 8, 2, 'Static/dynamic mechanical load'),
  tp('hail', 'Hail Impact', 'Hail', 4, 2, 'Hail impact test'),
  tp('pid108', 'PID 108h', 'PID108', 108, 2, 'Potential Induced Degradation 108h'),
];

const iecSequences: TestSequence[] = [
  {
    id: 'seq_a',
    name: 'Sequence A - UV + TC50 + HF10',
    tests: [
      { id: 'uv_pre', name: 'UV Preconditioning', chamberTypeId: 'UV15', modulesRequired: 2 },
      { id: 'tc50', name: 'Thermal Cycling 50', chamberTypeId: 'TC50', modulesRequired: 2 },
      { id: 'hf10', name: 'Humidity Freeze 10', chamberTypeId: 'HF10', modulesRequired: 2 },
    ],
  },
  {
    id: 'seq_b',
    name: 'Sequence B - TC200',
    tests: [
      { id: 'tc200', name: 'Thermal Cycling 200', chamberTypeId: 'TC200', modulesRequired: 2 },
    ],
  },
  {
    id: 'seq_c',
    name: 'Sequence C - DH1000',
    tests: [
      { id: 'dh1000', name: 'Damp Heat 1000h', chamberTypeId: 'DH1000', modulesRequired: 2 },
    ],
  },
  {
    id: 'seq_d',
    name: 'Sequence D - Outdoor Exposure',
    tests: [
      { id: 'uv60', name: 'UV Exposure 60kWh', chamberTypeId: 'UV60', modulesRequired: 2 },
    ],
  },
  {
    id: 'seq_e',
    name: 'Sequence E - Mechanical',
    tests: [
      { id: 'mech', name: 'Mechanical Load', chamberTypeId: 'MechLoad', modulesRequired: 2 },
      { id: 'hail', name: 'Hail Impact', chamberTypeId: 'Hail', modulesRequired: 2 },
    ],
  },
  {
    id: 'seq_pid',
    name: 'PID Test',
    tests: [
      { id: 'pid108', name: 'PID 108h', chamberTypeId: 'PID108', modulesRequired: 2 },
    ],
  },
];

export const IEC: Standard = {
  id: 'IEC',
  code: 'IEC',
  name: 'IEC 61215 / 61730',
  description: 'International standard for terrestrial PV module design qualification and type approval',
  tests: iecTests,
  testProfiles: iecTests,
  sequences: iecSequences,
  bomTestMapping: defaultBomTestMapping,
};

const mnreTests: TestProfile[] = [
  tp('dh2000', 'Damp Heat 2000h', 'DH2000', 2100, 4, '85°C/85% RH for 2000 hours'),
  tp('tc400', 'Thermal Cycling 400', 'TC400', 3200, 4, '-40°C to +85°C, 400 cycles'),
  tp('hf20', 'Humidity Freeze 20', 'HF20', 1000, 4, '-40°C to +85°C/85% RH, 20 cycles'),
  tp('pid288', 'PID 288h', 'PID288', 288, 4, 'Potential Induced Degradation 288h'),
  tp('uv_pre', 'UV Preconditioning', 'UV15', 120, 4, 'UV exposure 15 kWh/m²'),
  tp('dh3000', 'Damp Heat 3000h', 'DH3000', 3150, 2, '85°C/85% RH for 3000 hours'),
  tp('tc600', 'Thermal Cycling 600', 'TC600', 4800, 2, '-40°C to +85°C, 600 cycles'),
  tp('hf40', 'Humidity Freeze 40', 'HF40', 2000, 2, '-40°C to +85°C/85% RH, 40 cycles'),
  tp('salt', 'Salt Mist Corrosion', 'SaltMist', 96, 2, 'IEC 61701 salt mist test'),
];

const mnreSequences: TestSequence[] = [
  {
    id: 'almm_qual',
    name: 'ALMM Qualification',
    tests: [
      { id: 'dh2000', name: 'Damp Heat 2000h', chamberTypeId: 'DH2000', modulesRequired: 4 },
      { id: 'tc400', name: 'Thermal Cycling 400', chamberTypeId: 'TC400', modulesRequired: 4 },
      { id: 'hf20', name: 'Humidity Freeze 20', chamberTypeId: 'HF20', modulesRequired: 4 },
      { id: 'pid288', name: 'PID 288h', chamberTypeId: 'PID288', modulesRequired: 4 },
      { id: 'uv_pre', name: 'UV Preconditioning', chamberTypeId: 'UV15', modulesRequired: 4 },
    ],
  },
  {
    id: 'almm_extended',
    name: 'ALMM Extended',
    tests: [
      { id: 'dh3000', name: 'Damp Heat 3000h', chamberTypeId: 'DH3000', modulesRequired: 2 },
      { id: 'tc600', name: 'Thermal Cycling 600', chamberTypeId: 'TC600', modulesRequired: 2 },
      { id: 'hf40', name: 'Humidity Freeze 40', chamberTypeId: 'HF40', modulesRequired: 2 },
      { id: 'salt', name: 'Salt Mist Corrosion', chamberTypeId: 'SaltMist', modulesRequired: 2 },
    ],
  },
];

export const MNRE: Standard = {
  id: 'MNRE',
  code: 'MNRE',
  name: 'MNRE ALMM',
  description: 'Approved List of Models and Manufacturers (India - mandatory for DCR projects)',
  tests: mnreTests,
  testProfiles: mnreTests,
  sequences: mnreSequences,
  bomTestMapping: {
    ...defaultBomTestMapping,
    Glass: ['DH2000', 'TC400', 'HF20', 'UV15', 'Hail', 'MechLoad'],
    Encapsulant: ['DH2000', 'TC400', 'HF20', 'UV15', 'PID288'],
    Cell: ['DH2000', 'TC400', 'HF20', 'UV15', 'PID288', 'MechLoad'],
    Frame: ['DH2000', 'TC400', 'HF20', 'MechLoad', 'SaltMist'],
    JunctionBox: ['DH2000', 'TC400', 'HF20', 'BDT', 'IPTest'],
    Backsheet: ['DH2000', 'TC400', 'HF20', 'UV15'],
    Foil: ['DH2000', 'TC400', 'HF20', 'UV15'],
    Wafer: ['DH2000', 'TC400', 'HF20', 'PID288'],
    Ribbon: ['DH2000', 'TC400', 'HF20'],
    Sealant: ['DH2000', 'TC400', 'HF20', 'IPTest'],
    Potting: ['DH2000', 'TC400', 'HF20', 'BDT'],
  },
};

// --- IEC 62915 Retesting Standards ---

const iec62915_2018Tests: TestProfile[] = [
  tp('dh1000_rt', 'Damp Heat 1000h (Retest)', 'DH1000', 1050, 2, 'IEC 62915:2018 retest - DH 1000h'),
  tp('tc200_rt', 'Thermal Cycling 200 (Retest)', 'TC200', 1600, 2, 'IEC 62915:2018 retest - TC 200'),
  tp('hf10_rt', 'Humidity Freeze 10 (Retest)', 'HF10', 500, 2, 'IEC 62915:2018 retest - HF 10'),
  tp('pid108_rt', 'PID 108h (Retest)', 'PID108', 108, 2, 'IEC 62915:2018 retest - PID 108h'),
  tp('uv_pre_rt', 'UV Preconditioning (Retest)', 'UV15', 120, 2, 'IEC 62915:2018 retest - UV'),
  tp('mech_rt', 'Mechanical Load (Retest)', 'MechLoad', 8, 2, 'IEC 62915:2018 retest - Mech Load'),
  tp('hotspot_rt', 'Hot Spot (Retest)', 'HotSpot', 5, 2, 'IEC 62915:2018 retest - Hot Spot'),
];

const iec62915_2023Tests: TestProfile[] = [
  ...iec62915_2018Tests,
  tp('pid96_rt', 'PID 96h (Retest)', 'PID96', 96, 2, 'IEC 62915:2023 retest - PID 96h'),
  tp('dynmech_rt', 'Dynamic Mech Load (Retest)', 'DynMechLoad', 8, 2, 'IEC 62915:2023 retest - Dynamic Mech'),
  tp('revoc_rt', 'Reverse Current Overload (Retest)', 'ReverseCurrentOverload', 4, 2, 'IEC 62915:2023 retest - Reverse Current'),
];

export const IEC62915_2018: Standard = {
  id: 'IEC62915_2018',
  code: 'IEC62915',
  name: 'IEC TS 62915:2018',
  description: 'Photovoltaic modules — Type approval, design and safety qualification — Retesting',
  tests: iec62915_2018Tests,
  testProfiles: iec62915_2018Tests,
  sequences: [],
  bomTestMapping: defaultBomTestMapping,
};

export const IEC62915_2023: Standard = {
  id: 'IEC62915_2023',
  code: 'IEC62915',
  name: 'IEC TS 62915:2023',
  description: 'Photovoltaic modules — Type approval, design and safety qualification — Retesting (2nd edition)',
  tests: iec62915_2023Tests,
  testProfiles: iec62915_2023Tests,
  sequences: [],
  bomTestMapping: defaultBomTestMapping,
};

// --- IEC 62915 Retest Matrix ---

export const IEC62915_RETEST_MATRIX: RetestRequirement[] = [
  // Glass
  { component: 'Glass', changeType: 'NewSupplier', testsRequired2018: ['DH1000', 'TC200', 'HF10'], testsRequired2023: ['DH1000', 'TC200', 'HF10', 'DynMechLoad'], retestLevel: 'partial' },
  { component: 'Glass', changeType: 'MaterialChange', testsRequired2018: ['DH1000', 'TC200', 'HF10', 'UV15', 'Hail', 'MechLoad'], testsRequired2023: ['DH1000', 'TC200', 'HF10', 'UV15', 'Hail', 'MechLoad', 'DynMechLoad'], retestLevel: 'full' },
  { component: 'Glass', changeType: 'ThicknessChange', testsRequired2018: ['Hail', 'MechLoad'], testsRequired2023: ['Hail', 'MechLoad', 'DynMechLoad'], retestLevel: 'partial' },
  // Encapsulant
  { component: 'Encapsulant', changeType: 'NewSupplier', testsRequired2018: ['DH1000', 'TC200', 'HF10'], testsRequired2023: ['DH1000', 'TC200', 'HF10'], retestLevel: 'partial' },
  { component: 'Encapsulant', changeType: 'MaterialChange', testsRequired2018: ['DH1000', 'TC200', 'HF10', 'UV15', 'PID108'], testsRequired2023: ['DH1000', 'TC200', 'HF10', 'UV15', 'PID96'], retestLevel: 'full' },
  // Cell
  { component: 'Cell', changeType: 'NewSupplier', testsRequired2018: ['DH1000', 'TC200', 'HF10'], testsRequired2023: ['DH1000', 'TC200', 'HF10', 'HotSpot'], retestLevel: 'partial' },
  { component: 'Cell', changeType: 'MaterialChange', testsRequired2018: ['DH1000', 'TC200', 'HF10', 'UV15', 'PID108'], testsRequired2023: ['DH1000', 'TC200', 'HF10', 'UV15', 'PID96', 'HotSpot'], retestLevel: 'full' },
  // Frame
  { component: 'Frame', changeType: 'NewSupplier', testsRequired2018: ['DH1000', 'TC200', 'MechLoad'], testsRequired2023: ['DH1000', 'TC200', 'MechLoad', 'DynMechLoad'], retestLevel: 'partial' },
  { component: 'Frame', changeType: 'MaterialChange', testsRequired2018: ['DH1000', 'TC200', 'HF10', 'MechLoad', 'SaltMist'], testsRequired2023: ['DH1000', 'TC200', 'HF10', 'MechLoad', 'DynMechLoad', 'SaltMist'], retestLevel: 'full' },
  // JunctionBox
  { component: 'JunctionBox', changeType: 'NewSupplier', testsRequired2018: ['DH1000', 'TC200', 'BDT'], testsRequired2023: ['DH1000', 'TC200', 'BDT', 'ReverseCurrentOverload'], retestLevel: 'partial' },
  { component: 'JunctionBox', changeType: 'MaterialChange', testsRequired2018: ['DH1000', 'TC200', 'HF10', 'BDT', 'IPTest'], testsRequired2023: ['DH1000', 'TC200', 'HF10', 'BDT', 'IPTest', 'ReverseCurrentOverload'], retestLevel: 'full' },
  // Backsheet
  { component: 'Backsheet', changeType: 'NewSupplier', testsRequired2018: ['DH1000', 'TC200', 'HF10'], testsRequired2023: ['DH1000', 'TC200', 'HF10'], retestLevel: 'partial' },
  { component: 'Backsheet', changeType: 'MaterialChange', testsRequired2018: ['DH1000', 'TC200', 'HF10', 'UV15'], testsRequired2023: ['DH1000', 'TC200', 'HF10', 'UV15'], retestLevel: 'full' },
  // BypassDiode
  { component: 'BypassDiode', changeType: 'NewSupplier', testsRequired2018: ['BDT'], testsRequired2023: ['BDT', 'HotSpot', 'ReverseCurrentOverload'], retestLevel: 'partial' },
  { component: 'BypassDiode', changeType: 'MaterialChange', testsRequired2018: ['BDT', 'HotSpot'], testsRequired2023: ['BDT', 'HotSpot', 'ReverseCurrentOverload'], retestLevel: 'full' },
  // Connector
  { component: 'Connector', changeType: 'NewSupplier', testsRequired2018: ['IPTest'], testsRequired2023: ['IPTest'], retestLevel: 'partial' },
  // CellLayout
  { component: 'CellLayout', changeType: 'DesignChange', testsRequired2018: ['DH1000', 'TC200', 'HF10', 'MechLoad', 'HotSpot'], testsRequired2023: ['DH1000', 'TC200', 'HF10', 'MechLoad', 'DynMechLoad', 'HotSpot', 'ReverseCurrentOverload'], retestLevel: 'full' },
  // ModuleDimension
  { component: 'ModuleDimension', changeType: 'DimensionChange', testsRequired2018: ['MechLoad', 'Hail'], testsRequired2023: ['MechLoad', 'DynMechLoad', 'Hail'], retestLevel: 'partial' },
];

// --- BIS (IS 14286:2023) ---

const bisTests: TestProfile[] = [
  tp('dh1000_bis', 'Damp Heat 1000h', 'DH1000', 1050, 2, 'IS 14286 - DH 1000h (aligned with IEC 61215)'),
  tp('tc200_bis', 'Thermal Cycling 200', 'TC200', 1600, 2, 'IS 14286 - TC 200 cycles'),
  tp('hf10_bis', 'Humidity Freeze 10', 'HF10', 500, 2, 'IS 14286 - HF 10 cycles'),
  tp('pid96_bis', 'PID 96h', 'PID96', 96, 2, 'IS 14286 - PID 96h per IEC 62804'),
  tp('uv_pre_bis', 'UV Preconditioning', 'UV15', 120, 2, 'IS 14286 - UV 15 kWh/m²'),
  tp('mech_bis', 'Mechanical Load', 'MechLoad', 8, 2, 'IS 14286 - Mechanical load test'),
  tp('hail_bis', 'Hail Impact', 'Hail', 4, 2, 'IS 14286 - Hail impact'),
  tp('hotspot_bis', 'Hot Spot Endurance', 'HotSpot', 5, 2, 'IS 14286 - Hot spot endurance test'),
  tp('salt_bis', 'Salt Mist Corrosion', 'SaltMist', 96, 2, 'IS 14286 - Salt mist (tropical climate)'),
];

const bisSequences: TestSequence[] = [
  {
    id: 'bis_type_approval',
    name: 'BIS Type Approval',
    tests: [
      { id: 'dh1000_bis', name: 'Damp Heat 1000h', chamberTypeId: 'DH1000', modulesRequired: 2 },
      { id: 'tc200_bis', name: 'Thermal Cycling 200', chamberTypeId: 'TC200', modulesRequired: 2 },
      { id: 'hf10_bis', name: 'Humidity Freeze 10', chamberTypeId: 'HF10', modulesRequired: 2 },
      { id: 'pid96_bis', name: 'PID 96h', chamberTypeId: 'PID96', modulesRequired: 2 },
      { id: 'uv_pre_bis', name: 'UV Preconditioning', chamberTypeId: 'UV15', modulesRequired: 2 },
      { id: 'mech_bis', name: 'Mechanical Load', chamberTypeId: 'MechLoad', modulesRequired: 2 },
      { id: 'hail_bis', name: 'Hail Impact', chamberTypeId: 'Hail', modulesRequired: 2 },
      { id: 'hotspot_bis', name: 'Hot Spot Endurance', chamberTypeId: 'HotSpot', modulesRequired: 2 },
    ],
  },
];

export const BIS: Standard = {
  id: 'BIS',
  code: 'BIS',
  name: 'BIS IS 14286:2023',
  description: 'Bureau of Indian Standards — Crystalline silicon terrestrial PV modules (IS 14286:2023, aligned with IEC 61215)',
  tests: bisTests,
  testProfiles: bisTests,
  sequences: bisSequences,
  bomTestMapping: defaultBomTestMapping,
};

const customStandard: Standard = {
  id: 'Custom',
  code: 'Custom',
  name: 'Custom Profile',
  description: 'User-defined test profile. Use the other standards as a starting point.',
  tests: [],
  testProfiles: [],
  sequences: [],
  bomTestMapping: defaultBomTestMapping,
};

export const STANDARDS: Standard[] = [IEC, MNRE, IEC62915_2018, IEC62915_2023, BIS, customStandard];

export function getStandard(id: string): Standard {
  return STANDARDS.find((s) => s.id === id) ?? customStandard;
}
