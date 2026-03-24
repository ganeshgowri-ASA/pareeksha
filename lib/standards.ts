import { Standard, BoMComponent, ChamberTypeId } from './types';

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

export const IEC_61215: Standard = {
  id: 'IEC_61215',
  name: 'IEC 61215 / 61730',
  description: 'International standard for terrestrial PV module design qualification and type approval',
  sequences: [
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
  ],
  bomTestMapping: defaultBomTestMapping,
};

export const MNRE_ALMM: Standard = {
  id: 'MNRE_ALMM',
  name: 'MNRE ALMM',
  description: 'Approved List of Models and Manufacturers (India - mandatory for DCR projects)',
  sequences: [
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
  name: 'REC Certification',
  description: 'Regional/Export certification for renewable energy modules',
  sequences: [
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
  ],
  bomTestMapping: defaultBomTestMapping,
};

export const STANDARDS: Standard[] = [IEC_61215, MNRE_ALMM, REC];

export function getStandard(id: string): Standard | undefined {
  return STANDARDS.find((s) => s.id === id);
}

/** Get all unique tests from a standard's sequences, flattened */
export function getStandardTests(standard: Standard) {
  return standard.sequences.flatMap((seq) =>
    seq.tests.map((t) => ({
      id: t.id,
      name: t.name,
      chamberType: t.chamberTypeId,
      testHours: 0, // filled from chamber lookup
      samplesRequired: t.modulesRequired,
      description: t.description || seq.name,
    }))
  );
}
