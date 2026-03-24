import { ChamberType, ChamberCategory } from './types';

export const CHAMBERS: ChamberType[] = [
  // Damp Heat
  {
    id: 'DH1000',
    category: 'DH',
    name: 'Damp Heat 1000h',
    description: '85\u00b0C/85% RH for 1000 hours',
    slotsFullSize: 20,
    slotsMiniModule: 20,
    testDurationHrs: 1050,
  },
  {
    id: 'DH2000',
    category: 'DH',
    name: 'Damp Heat 2000h',
    description: '85\u00b0C/85% RH for 2000 hours',
    slotsFullSize: 20,
    slotsMiniModule: 20,
    testDurationHrs: 2100,
  },
  {
    id: 'DH3000',
    category: 'DH',
    name: 'Damp Heat 3000h',
    description: '85\u00b0C/85% RH for 3000 hours',
    slotsFullSize: 20,
    slotsMiniModule: 20,
    testDurationHrs: 3150,
  },
  // Thermal Cycling
  {
    id: 'TC50',
    category: 'TC',
    name: 'Thermal Cycling 50',
    description: '-40\u00b0C to +85\u00b0C, 50 cycles',
    slotsFullSize: 20,
    slotsMiniModule: 20,
    testDurationHrs: 500,
  },
  {
    id: 'TC200',
    category: 'TC',
    name: 'Thermal Cycling 200',
    description: '-40\u00b0C to +85\u00b0C, 200 cycles',
    slotsFullSize: 20,
    slotsMiniModule: 20,
    testDurationHrs: 1600,
  },
  {
    id: 'TC400',
    category: 'TC',
    name: 'Thermal Cycling 400',
    description: '-40\u00b0C to +85\u00b0C, 400 cycles',
    slotsFullSize: 20,
    slotsMiniModule: 20,
    testDurationHrs: 3200,
  },
  {
    id: 'TC600',
    category: 'TC',
    name: 'Thermal Cycling 600',
    description: '-40\u00b0C to +85\u00b0C, 600 cycles',
    slotsFullSize: 20,
    slotsMiniModule: 20,
    testDurationHrs: 4800,
  },
  // Humidity Freeze
  {
    id: 'HF10',
    category: 'HF',
    name: 'Humidity Freeze 10',
    description: '-40\u00b0C to +85\u00b0C/85% RH, 10 cycles',
    slotsFullSize: 10,
    slotsMiniModule: 20,
    testDurationHrs: 500,
  },
  {
    id: 'HF20',
    category: 'HF',
    name: 'Humidity Freeze 20',
    description: '-40\u00b0C to +85\u00b0C/85% RH, 20 cycles',
    slotsFullSize: 10,
    slotsMiniModule: 20,
    testDurationHrs: 1000,
  },
  {
    id: 'HF40',
    category: 'HF',
    name: 'Humidity Freeze 40',
    description: '-40\u00b0C to +85\u00b0C/85% RH, 40 cycles',
    slotsFullSize: 10,
    slotsMiniModule: 20,
    testDurationHrs: 2000,
  },
  // PID
  { id: 'PID108', category: 'PID', name: 'PID 108h', description: 'Potential Induced Degradation 108 hours', slots: 20, slotsFullSize: 20, slotsMiniModule: 20, testDurationHrs: 108 },
  { id: 'PID288', category: 'PID', name: 'PID 288h', description: 'Potential Induced Degradation 288 hours', slots: 20, slotsFullSize: 20, slotsMiniModule: 20, testDurationHrs: 288 },
  // UV
  {
    id: 'UV15',
    category: 'UV',
    name: 'UV Preconditioning 15kWh',
    description: 'UV exposure 15 kWh/m\u00b2',
    slotsFullSize: 2,
    slotsMiniModule: 2,
    testDurationHrs: 120,
  },
  {
    id: 'UV60',
    category: 'UV',
    name: 'UV Exposure 60kWh',
    description: 'UV exposure 60 kWh/m\u00b2',
    slotsFullSize: 2,
    slotsMiniModule: 2,
    testDurationHrs: 480,
  },
  // Salt Mist
  { id: 'SaltMist', category: 'SaltMist', name: 'Salt Mist Corrosion', description: 'IEC 61701 salt mist test', slots: 8, slotsFullSize: 8, slotsMiniModule: 8, testDurationHrs: 96 },
  // Sand Dust
  { id: 'SandDust', category: 'SandDust', name: 'Sand & Dust', description: 'IEC 60068 sand and dust ingress', slots: 4, slotsFullSize: 4, slotsMiniModule: 4, testDurationHrs: 24 },
  // Mechanical Load
  { id: 'MechLoad', category: 'MechLoad', name: 'Mechanical Load', description: 'IEC 62782 static/dynamic mechanical load', slots: 1, slotsFullSize: 1, slotsMiniModule: 1, testDurationHrs: 8 },
  // Hail
  { id: 'Hail', category: 'Hail', name: 'Hail Impact', description: 'IEC 61215 hail impact test', slots: 1, slotsFullSize: 1, slotsMiniModule: 1, testDurationHrs: 4 },
  // Dynamic Mechanical Load
  { id: 'DynMechLoad', category: 'DynMechLoad', name: 'Dynamic Mechanical Load', description: 'IEC 62782 dynamic mechanical load (1000 cycles)', slots: 1, slotsFullSize: 1, slotsMiniModule: 1, testDurationHrs: 24 },
  // Bypass Diode Test
  { id: 'BDT', category: 'BDT', name: 'Bypass Diode Thermal', description: 'Bypass diode thermal test', slots: 4, slotsFullSize: 4, slotsMiniModule: 4, testDurationHrs: 24 },
  // IP Test
  { id: 'IPTest', category: 'IPTest', name: 'IP Rating Test', description: 'Ingress protection rating test', slots: 2, slotsFullSize: 2, slotsMiniModule: 2, testDurationHrs: 8 },
  // PID 96h
  { id: 'PID96', category: 'PID', name: 'PID 96h', description: 'Potential Induced Degradation 96 hours', slots: 20, slotsFullSize: 20, slotsMiniModule: 20, testDurationHrs: 96 },
  // Hot Spot Endurance
  { id: 'HotSpot', category: 'HotSpot', name: 'Hot Spot Endurance', description: 'Hot-spot endurance test per MQT 09', slots: 1, slotsFullSize: 1, slotsMiniModule: 1, testDurationHrs: 5 },
  // Reverse Current Overload
  { id: 'ReverseCurrentOverload', category: 'ReverseCurrentOverload', name: 'Reverse Current Overload', description: 'Reverse current overload test per MQT 26', slots: 1, slotsFullSize: 1, slotsMiniModule: 1, testDurationHrs: 2 },
];

/** Unique chamber categories */
export const CHAMBER_CATEGORIES: ChamberCategory[] = [
  'DH', 'TC', 'HF', 'PID', 'UV', 'SaltMist', 'SandDust', 'MechLoad', 'DynMechLoad', 'Hail', 'BDT', 'IPTest', 'HotSpot', 'ReverseCurrentOverload',
];

/** Look up a chamber by ID */
export function getChamber(id: string): ChamberType | undefined {
  return CHAMBERS.find((c) => c.id === id);
}

/** Get all chambers of a given category */
export function getChambersByCategory(category: string): ChamberType[] {
  return CHAMBERS.filter((c) => c.category === category);
}

/** Default work hours per year: 300 days x 24 hrs */
export const DEFAULT_WORK_HOURS_PER_YEAR = 7200;
export const WORK_HRS_PER_YEAR = 7200;

/** Default realisation rate */
export const DEFAULT_REALISATION_RATE = 0.65;
