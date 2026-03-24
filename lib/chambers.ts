import { ChamberType } from './types';

export const CHAMBERS: ChamberType[] = [
  // Damp Heat
  { id: 'DH1000', category: 'DH', name: 'DH1000', label: 'Damp Heat 1000h', slots: 20, durationHours: 1050 },
  { id: 'DH2000', category: 'DH', name: 'DH2000', label: 'Damp Heat 2000h', slots: 20, durationHours: 2100 },
  { id: 'DH3000', category: 'DH', name: 'DH3000', label: 'Damp Heat 3000h', slots: 20, durationHours: 3150 },

  // Thermal Cycling
  { id: 'TC50', category: 'TC', name: 'TC50', label: 'Thermal Cycling 50', slots: 20, durationHours: 500 },
  { id: 'TC200', category: 'TC', name: 'TC200', label: 'Thermal Cycling 200', slots: 20, durationHours: 1600 },
  { id: 'TC400', category: 'TC', name: 'TC400', label: 'Thermal Cycling 400', slots: 20, durationHours: 3200 },
  { id: 'TC600', category: 'TC', name: 'TC600', label: 'Thermal Cycling 600', slots: 20, durationHours: 4800 },

  // Humidity Freeze (using full-size slot count; mini-module uses 20)
  { id: 'HF10', category: 'HF', name: 'HF10', label: 'Humidity Freeze 10', slots: 10, durationHours: 500, description: 'FS=10 slots, MM=20 slots' },
  { id: 'HF20', category: 'HF', name: 'HF20', label: 'Humidity Freeze 20', slots: 10, durationHours: 1000, description: 'FS=10 slots, MM=20 slots' },
  { id: 'HF40', category: 'HF', name: 'HF40', label: 'Humidity Freeze 40', slots: 10, durationHours: 2000, description: 'FS=10 slots, MM=20 slots' },

  // PID
  { id: 'PID108', category: 'PID', name: 'PID108', label: 'PID 108h', slots: 20, durationHours: 108 },
  { id: 'PID288', category: 'PID', name: 'PID288', label: 'PID 288h', slots: 20, durationHours: 288 },

  // UV
  { id: 'UV15', category: 'UV', name: 'UV15', label: 'UV 15 kWh', slots: 2, durationHours: 120 },
  { id: 'UV60', category: 'UV', name: 'UV60', label: 'UV 60 kWh', slots: 2, durationHours: 480 },

  // Additional chamber types
  { id: 'SaltMist', category: 'SaltMist', name: 'SaltMist', label: 'Salt Mist', slots: 10, durationHours: 96 },
  { id: 'SandDust', category: 'SandDust', name: 'SandDust', label: 'Sand Dust', slots: 10, durationHours: 48 },
  { id: 'MechLoad', category: 'MechLoad', name: 'MechLoad', label: 'Mechanical Load', slots: 1, durationHours: 24 },
  { id: 'Hail', category: 'Hail', name: 'Hail', label: 'Hail Test', slots: 1, durationHours: 8 },
  { id: 'BDT', category: 'BDT', name: 'BDT', label: 'Bypass Diode Test', slots: 20, durationHours: 1 },
  { id: 'IPTest', category: 'IPTest', name: 'IPTest', label: 'IP Rating Test', slots: 5, durationHours: 4 },
];

export function getChamberById(id: string): ChamberType | undefined {
  return CHAMBERS.find((c) => c.id === id);
}

export function getChambersByCategory(category: string): ChamberType[] {
  return CHAMBERS.filter((c) => c.category === category);
}
