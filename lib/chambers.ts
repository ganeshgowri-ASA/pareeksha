import { ChamberType } from './types';

export const CHAMBERS: ChamberType[] = [
  {
    id: 'DH',
    name: 'Damp Heat',
    category: 'Climatic',
    slotsFS: 20,
    slotsMM: 20,
    variants: [
      { name: 'DH1000', durationHrs: 1050 },
      { name: 'DH2000', durationHrs: 2100 },
      { name: 'DH3000', durationHrs: 3150 },
    ],
  },
  {
    id: 'TC',
    name: 'Thermal Cycling',
    category: 'Climatic',
    slotsFS: 20,
    slotsMM: 20,
    variants: [
      { name: 'TC50', durationHrs: 500, cycles: 50 },
      { name: 'TC200', durationHrs: 1600, cycles: 200 },
      { name: 'TC400', durationHrs: 3200, cycles: 400 },
      { name: 'TC600', durationHrs: 4800, cycles: 600 },
    ],
  },
  {
    id: 'HF',
    name: 'Humidity Freeze',
    category: 'Climatic',
    slotsFS: 10,
    slotsMM: 20,
    variants: [
      { name: 'HF10', durationHrs: 500, cycles: 10 },
      { name: 'HF20', durationHrs: 1000, cycles: 20 },
      { name: 'HF40', durationHrs: 2000, cycles: 40 },
    ],
  },
  {
    id: 'PID',
    name: 'PID Testing',
    category: 'Electrical',
    slotsFS: 20,
    slotsMM: 20,
    variants: [
      { name: 'PID108', durationHrs: 108 },
      { name: 'PID288', durationHrs: 288 },
    ],
  },
  {
    id: 'UV',
    name: 'UV Exposure',
    category: 'Radiation',
    slotsFS: 2,
    slotsMM: 2,
    variants: [
      { name: 'UV15', durationHrs: 120 },
      { name: 'UV60', durationHrs: 480 },
    ],
  },
  {
    id: 'SM',
    name: 'Salt Mist',
    category: 'Environmental',
    slotsFS: 4,
    slotsMM: 4,
    variants: [{ name: 'SM', durationHrs: 96 }],
  },
  {
    id: 'ML',
    name: 'Mechanical Load',
    category: 'Mechanical',
    slotsFS: 1,
    slotsMM: 1,
    variants: [{ name: 'ML', durationHrs: 24 }],
  },
  {
    id: 'Hail',
    name: 'Hail Impact',
    category: 'Mechanical',
    slotsFS: 1,
    slotsMM: 1,
    variants: [{ name: 'Hail', durationHrs: 2 }],
  },
  {
    id: 'BDT',
    name: 'Bypass Diode',
    category: 'Electrical',
    slotsFS: 5,
    slotsMM: 5,
    variants: [{ name: 'BDT', durationHrs: 4 }],
  },
  {
    id: 'IP',
    name: 'IP Protection',
    category: 'Environmental',
    slotsFS: 2,
    slotsMM: 2,
    variants: [{ name: 'IP', durationHrs: 24 }],
  },
];

export const WORK_HRS_PER_YEAR = 7200;
export const DEFAULT_REALISATION_RATE = 0.65;
