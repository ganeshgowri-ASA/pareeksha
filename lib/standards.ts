import { Standard, TestDefinition, BoMComponent, ChamberTypeId } from './types';

function makeTest(
  id: string,
  name: string,
  chamberType: ChamberTypeId,
  testHours: number,
  samplesRequired: number,
  description?: string
): TestDefinition {
  return {
    id,
    name,
    chamberType,
    chamberTypeId: chamberType,
    testHours,
    durationHrs: testHours,
    samplesRequired,
    modulesRequired: samplesRequired,
    description,
  };
}

/** BoM-to-test mapping: which chamber tests are needed when a component changes */
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

const iecTests: TestDefinition[] = [
  makeTest('uv_pre', 'UV Preconditioning', 'UV15', 120, 2, 'UV exposure 15 kWh/m² preconditioning'),
  makeTest('tc50', 'Thermal Cycling 50', 'TC50', 500, 2, '50 thermal cycles -40°C to +85°C'),
  makeTest('hf10', 'Humidity Freeze 10', 'HF10', 500, 2, '10 humidity freeze cycles'),
  makeTest('tc200', 'Thermal Cycling 200', 'TC200', 1600, 2, '200 thermal cycles'),
  makeTest('dh1000', 'Damp Heat 1000h', 'DH1000', 1050, 2, '1000h at 85°C/85% RH'),
  makeTest('uv60', 'UV Exposure 60kWh', 'UV60', 480, 2, 'UV exposure 60 kWh/m²'),
  makeTest('mech', 'Mechanical Load', 'MechLoad', 8, 2, 'Static/dynamic mechanical load'),
  makeTest('hail', 'Hail Impact', 'Hail', 4, 2, 'Hail impact test'),
  makeTest('pid108', 'PID 108h', 'PID108', 108, 2, 'PID test 108 hours'),
];

const mnreTests: TestDefinition[] = [
  makeTest('dh2000', 'Damp Heat 2000h', 'DH2000', 2100, 4, 'Extended damp heat 2000h'),
  makeTest('tc400', 'Thermal Cycling 400', 'TC400', 3200, 4, '400 thermal cycles'),
  makeTest('hf20', 'Humidity Freeze 20', 'HF20', 1000, 4, '20 humidity freeze cycles'),
  makeTest('pid288', 'PID 288h', 'PID288', 288, 4, 'PID test 288 hours'),
  makeTest('uv_pre', 'UV Preconditioning', 'UV15', 120, 4, 'UV preconditioning'),
  makeTest('dh3000', 'Damp Heat 3000h', 'DH3000', 3150, 2, 'Extended damp heat 3000h'),
  makeTest('tc600', 'Thermal Cycling 600', 'TC600', 4800, 2, '600 thermal cycles'),
  makeTest('hf40', 'Humidity Freeze 40', 'HF40', 2000, 2, '40 humidity freeze cycles'),
  makeTest('salt', 'Salt Mist Corrosion', 'SaltMist', 96, 2, 'Salt mist corrosion test'),
];

const recTests: TestDefinition[] = [
  makeTest('dh1000', 'Damp Heat 1000h', 'DH1000', 1050, 2, '1000h at 85°C/85% RH'),
  makeTest('tc200', 'Thermal Cycling 200', 'TC200', 1600, 2, '200 thermal cycles'),
  makeTest('hf10', 'Humidity Freeze 10', 'HF10', 500, 2, '10 humidity freeze cycles'),
  makeTest('pid108', 'PID 108h', 'PID108', 108, 2, 'PID 108 hours'),
  makeTest('uv_pre', 'UV Preconditioning', 'UV15', 120, 2, 'UV preconditioning'),
  makeTest('mech', 'Mechanical Load', 'MechLoad', 8, 2, 'Mechanical load test'),
  makeTest('hail', 'Hail Impact', 'Hail', 4, 2, 'Hail impact test'),
  makeTest('dh2000', 'Damp Heat 2000h', 'DH2000', 2100, 2, 'Extended damp heat'),
  makeTest('tc400', 'Thermal Cycling 400', 'TC400', 3200, 2, '400 thermal cycles'),
  makeTest('salt', 'Salt Mist', 'SaltMist', 96, 2, 'Salt mist corrosion'),
  makeTest('sand', 'Sand & Dust', 'SandDust', 24, 2, 'Sand and dust ingress'),
];

export const IEC_61215: Standard = {
  id: 'IEC',
  code: 'IEC',
  name: 'IEC 61215 / 61730',
  description: 'International standard for terrestrial PV module design qualification and type approval',
  tests: iecTests,
  testProfiles: iecTests,
  sequences: [
    { id: 'seq_a', name: 'Sequence A - UV + TC50 + HF10', tests: iecTests.slice(0, 3) },
    { id: 'seq_b', name: 'Sequence B - TC200', tests: [iecTests[3]] },
    { id: 'seq_c', name: 'Sequence C - DH1000', tests: [iecTests[4]] },
    { id: 'seq_d', name: 'Sequence D - Outdoor Exposure', tests: [iecTests[5]] },
    { id: 'seq_e', name: 'Sequence E - Mechanical', tests: iecTests.slice(6, 8) },
    { id: 'seq_pid', name: 'PID Test', tests: [iecTests[8]] },
  ],
  bomTestMapping: defaultBomTestMapping,
};

export const MNRE_ALMM: Standard = {
  id: 'MNRE',
  code: 'MNRE',
  name: 'MNRE ALMM',
  description: 'Approved List of Models and Manufacturers (India - mandatory for DCR projects)',
  tests: mnreTests,
  testProfiles: mnreTests,
  sequences: [
    { id: 'almm_qual', name: 'ALMM Qualification', tests: mnreTests.slice(0, 5) },
    { id: 'almm_extended', name: 'ALMM Extended', tests: mnreTests.slice(5) },
  ],
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

export const REC: Standard = {
  id: 'REC',
  code: 'REC',
  name: 'REC Certification',
  description: 'Regional/Export certification for renewable energy modules',
  tests: recTests,
  testProfiles: recTests,
  sequences: [
    { id: 'rec_base', name: 'REC Base Qualification', tests: recTests.slice(0, 7) },
    { id: 'rec_extended', name: 'REC Extended Reliability', tests: recTests.slice(7) },
  ],
  bomTestMapping: defaultBomTestMapping,
};

const CUSTOM: Standard = {
  id: 'Custom',
  code: 'Custom',
  name: 'Custom Profile',
  description: 'User-defined test profile',
  tests: [],
  testProfiles: [],
  sequences: [],
  bomTestMapping: defaultBomTestMapping,
};

/** Array of all standards (for iteration) */
export const STANDARDS: Standard[] = [IEC_61215, MNRE_ALMM, REC, CUSTOM];

/** Record-based lookup by StandardId (for bracket access) */
export const STANDARDS_MAP: Record<string, Standard> = {
  IEC: IEC_61215,
  MNRE: MNRE_ALMM,
  REC: REC,
  Custom: CUSTOM,
};

export function getStandard(id: string): Standard | undefined {
  return STANDARDS_MAP[id] || STANDARDS.find((s) => s.id === id);
}
