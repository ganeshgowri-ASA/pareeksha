import { Standard, BoMComponent, ChamberTypeId, TestProfile, TestSequence } from './types';

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
};

const iecTests: TestProfile[] = [
  tp('uv_pre', 'UV Preconditioning', 'UV15', 120, 2, 'UV exposure 15 kWh/m\u00b2'),
  tp('tc50', 'Thermal Cycling 50', 'TC50', 500, 2, '-40\u00b0C to +85\u00b0C, 50 cycles'),
  tp('hf10', 'Humidity Freeze 10', 'HF10', 500, 2, '-40\u00b0C to +85\u00b0C/85% RH, 10 cycles'),
  tp('tc200', 'Thermal Cycling 200', 'TC200', 1600, 2, '-40\u00b0C to +85\u00b0C, 200 cycles'),
  tp('dh1000', 'Damp Heat 1000h', 'DH1000', 1050, 2, '85\u00b0C/85% RH for 1000 hours'),
  tp('uv60', 'UV Exposure 60kWh', 'UV60', 480, 2, 'UV exposure 60 kWh/m\u00b2'),
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
  tp('dh2000', 'Damp Heat 2000h', 'DH2000', 2100, 4, '85\u00b0C/85% RH for 2000 hours'),
  tp('tc400', 'Thermal Cycling 400', 'TC400', 3200, 4, '-40\u00b0C to +85\u00b0C, 400 cycles'),
  tp('hf20', 'Humidity Freeze 20', 'HF20', 1000, 4, '-40\u00b0C to +85\u00b0C/85% RH, 20 cycles'),
  tp('pid288', 'PID 288h', 'PID288', 288, 4, 'Potential Induced Degradation 288h'),
  tp('uv_pre', 'UV Preconditioning', 'UV15', 120, 4, 'UV exposure 15 kWh/m\u00b2'),
  tp('dh3000', 'Damp Heat 3000h', 'DH3000', 3150, 2, '85\u00b0C/85% RH for 3000 hours'),
  tp('tc600', 'Thermal Cycling 600', 'TC600', 4800, 2, '-40\u00b0C to +85\u00b0C, 600 cycles'),
  tp('hf40', 'Humidity Freeze 40', 'HF40', 2000, 2, '-40\u00b0C to +85\u00b0C/85% RH, 40 cycles'),
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

const recTests: TestProfile[] = [
  tp('dh1000', 'Damp Heat 1000h', 'DH1000', 1050, 2, '85\u00b0C/85% RH for 1000 hours'),
  tp('tc200', 'Thermal Cycling 200', 'TC200', 1600, 2, '-40\u00b0C to +85\u00b0C, 200 cycles'),
  tp('hf10', 'Humidity Freeze 10', 'HF10', 500, 2, '-40\u00b0C to +85\u00b0C/85% RH, 10 cycles'),
  tp('pid108', 'PID 108h', 'PID108', 108, 2, 'Potential Induced Degradation 108h'),
  tp('uv_pre', 'UV Preconditioning', 'UV15', 120, 2, 'UV exposure 15 kWh/m\u00b2'),
  tp('mech', 'Mechanical Load', 'MechLoad', 8, 2, 'Static/dynamic mechanical load'),
  tp('hail', 'Hail Impact', 'Hail', 4, 2, 'Hail impact test'),
  tp('dh2000', 'Damp Heat 2000h', 'DH2000', 2100, 2, '85\u00b0C/85% RH for 2000 hours'),
  tp('tc400', 'Thermal Cycling 400', 'TC400', 3200, 2, '-40\u00b0C to +85\u00b0C, 400 cycles'),
  tp('salt', 'Salt Mist Corrosion', 'SaltMist', 96, 2, 'IEC 61701 salt mist test'),
  tp('sand', 'Sand & Dust', 'SandDust', 24, 2, 'IEC 60068 sand and dust ingress'),
];

const recSequences: TestSequence[] = [
  {
    id: 'rec_base',
    name: 'REC Base Qualification',
    tests: [
      { id: 'dh1000', name: 'Damp Heat 1000h', chamberTypeId: 'DH1000', modulesRequired: 2 },
      { id: 'tc200', name: 'Thermal Cycling 200', chamberTypeId: 'TC200', modulesRequired: 2 },
      { id: 'hf10', name: 'Humidity Freeze 10', chamberTypeId: 'HF10', modulesRequired: 2 },
      { id: 'pid108', name: 'PID 108h', chamberTypeId: 'PID108', modulesRequired: 2 },
      { id: 'uv_pre', name: 'UV Preconditioning', chamberTypeId: 'UV15', modulesRequired: 2 },
      { id: 'mech', name: 'Mechanical Load', chamberTypeId: 'MechLoad', modulesRequired: 2 },
      { id: 'hail', name: 'Hail Impact', chamberTypeId: 'Hail', modulesRequired: 2 },
    ],
  },
  {
    id: 'rec_extended',
    name: 'REC Extended Reliability',
    tests: [
      { id: 'dh2000', name: 'Damp Heat 2000h', chamberTypeId: 'DH2000', modulesRequired: 2 },
      { id: 'tc400', name: 'Thermal Cycling 400', chamberTypeId: 'TC400', modulesRequired: 2 },
      { id: 'salt', name: 'Salt Mist Corrosion', chamberTypeId: 'SaltMist', modulesRequired: 2 },
      { id: 'sand', name: 'Sand & Dust', chamberTypeId: 'SandDust', modulesRequired: 2 },
    ],
  },
];

export const REC: Standard = {
  id: 'REC',
  code: 'REC',
  name: 'REC Certification',
  description: 'Regional/Export certification for renewable energy modules',
  tests: recTests,
  testProfiles: recTests,
  sequences: recSequences,
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

export const STANDARDS: Standard[] = [IEC, MNRE, REC, customStandard];

export function getStandard(id: string): Standard {
  return STANDARDS.find((s) => s.id === id) ?? customStandard;
}
