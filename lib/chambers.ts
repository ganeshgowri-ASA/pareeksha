import { Chamber } from "./types";

export const CHAMBERS: Chamber[] = [
  { id: "dh1000", name: "DH 1000", type: "DH", slots: 20, testHours: 1000, description: "Damp Heat 1000h" },
  { id: "dh2000", name: "DH 2000", type: "DH", slots: 20, testHours: 2000, description: "Damp Heat 2000h" },
  { id: "dh3000", name: "DH 3000", type: "DH", slots: 20, testHours: 3000, description: "Damp Heat 3000h" },
  { id: "tc200", name: "TC 200", type: "TC", slots: 20, testHours: 800, description: "Thermal Cycling 200 cycles" },
  { id: "tc400", name: "TC 400", type: "TC", slots: 20, testHours: 1600, description: "Thermal Cycling 400 cycles" },
  { id: "tc600", name: "TC 600", type: "TC", slots: 20, testHours: 2400, description: "Thermal Cycling 600 cycles" },
  { id: "hf10", name: "HF 10", type: "HF", slots: 10, testHours: 240, description: "Humidity Freeze 10 cycles" },
  { id: "hf20", name: "HF 20", type: "HF", slots: 10, testHours: 480, description: "Humidity Freeze 20 cycles" },
  { id: "pid96", name: "PID 96", type: "PID", slots: 20, testHours: 96, description: "PID 96h" },
  { id: "pid288", name: "PID 288", type: "PID", slots: 20, testHours: 288, description: "PID 288h" },
  { id: "uv15", name: "UV 15", type: "UV", slots: 2, testHours: 15, description: "UV Preconditioning 15kWh" },
  { id: "uv60", name: "UV 60", type: "UV", slots: 2, testHours: 60, description: "UV Exposure 60kWh" },
  { id: "salt", name: "Salt Mist", type: "SaltMist", slots: 8, testHours: 96, description: "Salt Mist Corrosion" },
  { id: "sand", name: "Sand Dust", type: "SandDust", slots: 4, testHours: 24, description: "Sand/Dust Ingress" },
  { id: "mech", name: "Mechanical Load", type: "MechLoad", slots: 1, testHours: 8, description: "Mechanical Load Test" },
  { id: "hail", name: "Hail Impact", type: "Hail", slots: 1, testHours: 4, description: "Hail Impact Test" },
];

export const WORK_HOURS_PER_YEAR = 7200;
export const DEFAULT_REALISATION_RATE = 0.65;

export function getChambersByType(type: string): Chamber[] {
  return CHAMBERS.filter((c) => c.type === type);
}
