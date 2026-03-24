import { Standard, TestProfile } from "./types";

const iecTests: TestProfile[] = [
  { id: "iec-tc200", name: "TC 200", chamberType: "TC", testHours: 800, modulesRequired: 8, standard: "IEC" },
  { id: "iec-tc400", name: "TC 400", chamberType: "TC", testHours: 1600, modulesRequired: 8, standard: "IEC" },
  { id: "iec-dh1000", name: "DH 1000", chamberType: "DH", testHours: 1000, modulesRequired: 8, standard: "IEC" },
  { id: "iec-hf10", name: "HF 10", chamberType: "HF", testHours: 240, modulesRequired: 8, standard: "IEC" },
  { id: "iec-pid96", name: "PID 96", chamberType: "PID", testHours: 96, modulesRequired: 4, standard: "IEC" },
  { id: "iec-uv15", name: "UV 15kWh", chamberType: "UV", testHours: 15, modulesRequired: 4, standard: "IEC" },
  { id: "iec-uv60", name: "UV 60kWh", chamberType: "UV", testHours: 60, modulesRequired: 4, standard: "IEC" },
  { id: "iec-salt", name: "Salt Mist", chamberType: "SaltMist", testHours: 96, modulesRequired: 4, standard: "IEC" },
  { id: "iec-hail", name: "Hail", chamberType: "Hail", testHours: 4, modulesRequired: 4, standard: "IEC" },
  { id: "iec-mech", name: "Mechanical Load", chamberType: "MechLoad", testHours: 8, modulesRequired: 4, standard: "IEC" },
];

const mnreTests: TestProfile[] = [
  { id: "mnre-tc200", name: "TC 200", chamberType: "TC", testHours: 800, modulesRequired: 10, standard: "MNRE" },
  { id: "mnre-tc400", name: "TC 400", chamberType: "TC", testHours: 1600, modulesRequired: 10, standard: "MNRE" },
  { id: "mnre-tc600", name: "TC 600", chamberType: "TC", testHours: 2400, modulesRequired: 10, standard: "MNRE" },
  { id: "mnre-dh1000", name: "DH 1000", chamberType: "DH", testHours: 1000, modulesRequired: 10, standard: "MNRE" },
  { id: "mnre-dh2000", name: "DH 2000", chamberType: "DH", testHours: 2000, modulesRequired: 10, standard: "MNRE" },
  { id: "mnre-hf10", name: "HF 10", chamberType: "HF", testHours: 240, modulesRequired: 10, standard: "MNRE" },
  { id: "mnre-pid96", name: "PID 96", chamberType: "PID", testHours: 96, modulesRequired: 6, standard: "MNRE" },
  { id: "mnre-pid288", name: "PID 288", chamberType: "PID", testHours: 288, modulesRequired: 6, standard: "MNRE" },
  { id: "mnre-uv15", name: "UV 15kWh", chamberType: "UV", testHours: 15, modulesRequired: 6, standard: "MNRE" },
  { id: "mnre-salt", name: "Salt Mist", chamberType: "SaltMist", testHours: 96, modulesRequired: 6, standard: "MNRE" },
  { id: "mnre-sand", name: "Sand Dust", chamberType: "SandDust", testHours: 24, modulesRequired: 4, standard: "MNRE" },
  { id: "mnre-hail", name: "Hail", chamberType: "Hail", testHours: 4, modulesRequired: 6, standard: "MNRE" },
  { id: "mnre-mech", name: "Mechanical Load", chamberType: "MechLoad", testHours: 8, modulesRequired: 6, standard: "MNRE" },
];

const recTests: TestProfile[] = [
  { id: "rec-tc200", name: "TC 200", chamberType: "TC", testHours: 800, modulesRequired: 8, standard: "REC" },
  { id: "rec-tc600", name: "TC 600", chamberType: "TC", testHours: 2400, modulesRequired: 8, standard: "REC" },
  { id: "rec-dh1000", name: "DH 1000", chamberType: "DH", testHours: 1000, modulesRequired: 8, standard: "REC" },
  { id: "rec-dh2000", name: "DH 2000", chamberType: "DH", testHours: 2000, modulesRequired: 8, standard: "REC" },
  { id: "rec-dh3000", name: "DH 3000", chamberType: "DH", testHours: 3000, modulesRequired: 8, standard: "REC" },
  { id: "rec-hf10", name: "HF 10", chamberType: "HF", testHours: 240, modulesRequired: 8, standard: "REC" },
  { id: "rec-hf20", name: "HF 20", chamberType: "HF", testHours: 480, modulesRequired: 8, standard: "REC" },
  { id: "rec-pid96", name: "PID 96", chamberType: "PID", testHours: 96, modulesRequired: 4, standard: "REC" },
  { id: "rec-uv60", name: "UV 60kWh", chamberType: "UV", testHours: 60, modulesRequired: 4, standard: "REC" },
  { id: "rec-salt", name: "Salt Mist", chamberType: "SaltMist", testHours: 96, modulesRequired: 4, standard: "REC" },
  { id: "rec-hail", name: "Hail", chamberType: "Hail", testHours: 4, modulesRequired: 4, standard: "REC" },
  { id: "rec-mech", name: "Mechanical Load", chamberType: "MechLoad", testHours: 8, modulesRequired: 4, standard: "REC" },
];

export const STANDARDS: Standard[] = [
  { id: "iec", name: "IEC 61215/61730", code: "IEC", tests: iecTests, required: true },
  { id: "mnre", name: "MNRE ALMM", code: "MNRE", tests: mnreTests, required: true },
  { id: "rec", name: "REC (Regional/Export)", code: "REC", tests: recTests, required: false },
];

export function getStandardByCode(code: string): Standard | undefined {
  return STANDARDS.find((s) => s.code === code);
}

export function getAllTestTypes(): string[] {
  const types = new Set<string>();
  STANDARDS.forEach((s) => s.tests.forEach((t) => types.add(t.name)));
  return Array.from(types).sort();
}
