import { Standard, TestProfile } from "./types";

const iecTests: TestProfile[] = [
  { id: "iec-dh1000", name: "Damp Heat 1000h", chamberType: "DH1000", testHours: 1000, samplesRequired: 8, description: "MQT 13 - DH 1000h" },
  { id: "iec-tc200", name: "Thermal Cycling 200", chamberType: "TC200", testHours: 800, samplesRequired: 8, description: "MQT 11 - TC 200 cycles" },
  { id: "iec-tc50", name: "Thermal Cycling 50", chamberType: "TC50", testHours: 200, samplesRequired: 8, description: "MQT 11 - TC 50 cycles" },
  { id: "iec-hf10", name: "Humidity Freeze 10", chamberType: "HF10", testHours: 240, samplesRequired: 8, description: "MQT 12 - HF 10 cycles" },
  { id: "iec-uv15", name: "UV Preconditioning 15kWh", chamberType: "UV15", testHours: 360, samplesRequired: 8, description: "MQT 10 - UV 15kWh" },
  { id: "iec-pid108", name: "PID 108h", chamberType: "PID108", testHours: 108, samplesRequired: 4, description: "PID resistance test" },
  { id: "iec-hail", name: "Hail Impact", chamberType: "Hail", testHours: 4, samplesRequired: 4, description: "MQT 17 - Hail test" },
  { id: "iec-mechload", name: "Mechanical Load", chamberType: "MechLoad", testHours: 8, samplesRequired: 4, description: "MQT 16 - Mech load" },
];

const mnreTests: TestProfile[] = [
  ...iecTests,
  { id: "mnre-dh2000", name: "Damp Heat 2000h", chamberType: "DH2000", testHours: 2000, samplesRequired: 8, description: "ALMM extended DH" },
  { id: "mnre-tc400", name: "Thermal Cycling 400", chamberType: "TC400", testHours: 1600, samplesRequired: 8, description: "ALMM extended TC" },
  { id: "mnre-pid288", name: "PID 288h", chamberType: "PID288", testHours: 288, samplesRequired: 4, description: "ALMM extended PID" },
  { id: "mnre-salt", name: "Salt Mist Corrosion", chamberType: "SaltMist", testHours: 96, samplesRequired: 4, description: "ALMM salt mist" },
];

const recTests: TestProfile[] = [
  ...iecTests,
  { id: "rec-dh3000", name: "Damp Heat 3000h", chamberType: "DH3000", testHours: 3000, samplesRequired: 8, description: "REC extended DH" },
  { id: "rec-tc600", name: "Thermal Cycling 600", chamberType: "TC600", testHours: 2400, samplesRequired: 8, description: "REC extended TC" },
  { id: "rec-hf40", name: "Humidity Freeze 40", chamberType: "HF40", testHours: 960, samplesRequired: 8, description: "REC extended HF" },
  { id: "rec-uv60", name: "UV Extended 60kWh", chamberType: "UV60", testHours: 1440, samplesRequired: 4, description: "REC extended UV" },
  { id: "rec-sand", name: "Sand & Dust", chamberType: "SandDust", testHours: 24, samplesRequired: 4, description: "REC sand/dust test" },
];

export const STANDARDS: Record<string, Standard> = {
  IEC: { id: "IEC", name: "IEC 61215/61730", description: "International standard for PV module qualification", tests: iecTests },
  MNRE: { id: "MNRE", name: "MNRE ALMM", description: "India mandatory ALMM qualification", tests: mnreTests },
  REC: { id: "REC", name: "REC Certification", description: "Regional/export certification standard", tests: recTests },
  Custom: { id: "Custom", name: "Custom Profile", description: "User-defined test profile", tests: [] },
};

export const STANDARD_LIST = Object.values(STANDARDS);
