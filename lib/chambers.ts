import { Chamber, ChamberType } from "./types";

export const CHAMBERS: Record<ChamberType, Chamber> = {
  DH1000: { id: "DH1000", category: "DH", name: "Damp Heat 1000h", slots: 20, testHours: 1000, description: "IEC 61215 standard DH test" },
  DH2000: { id: "DH2000", category: "DH", name: "Damp Heat 2000h", slots: 20, testHours: 2000, description: "Extended DH for MNRE" },
  DH3000: { id: "DH3000", category: "DH", name: "Damp Heat 3000h", slots: 20, testHours: 3000, description: "Extended DH for reliability" },
  TC50: { id: "TC50", category: "TC", name: "Thermal Cycling 50", slots: 20, testHours: 200, description: "50 cycles thermal test" },
  TC200: { id: "TC200", category: "TC", name: "Thermal Cycling 200", slots: 20, testHours: 800, description: "200 cycles IEC standard" },
  TC400: { id: "TC400", category: "TC", name: "Thermal Cycling 400", slots: 20, testHours: 1600, description: "400 cycles extended" },
  TC600: { id: "TC600", category: "TC", name: "Thermal Cycling 600", slots: 20, testHours: 2400, description: "600 cycles reliability" },
  HF10: { id: "HF10", category: "HF", name: "Humidity Freeze 10", slots: 10, testHours: 240, description: "10 cycles HF test" },
  HF20: { id: "HF20", category: "HF", name: "Humidity Freeze 20", slots: 10, testHours: 480, description: "20 cycles HF extended" },
  HF40: { id: "HF40", category: "HF", name: "Humidity Freeze 40", slots: 10, testHours: 960, description: "40 cycles HF reliability" },
  PID108: { id: "PID108", category: "PID", name: "PID 108h", slots: 20, testHours: 108, description: "PID standard test" },
  PID288: { id: "PID288", category: "PID", name: "PID 288h", slots: 20, testHours: 288, description: "PID extended test" },
  UV15: { id: "UV15", category: "UV", name: "UV 15 kWh", slots: 2, testHours: 360, description: "UV preconditioning 15 kWh" },
  UV60: { id: "UV60", category: "UV", name: "UV 60 kWh", slots: 2, testHours: 1440, description: "UV extended 60 kWh" },
  SaltMist: { id: "SaltMist", category: "SaltMist", name: "Salt Mist Corrosion", slots: 10, testHours: 96, description: "IEC 61701 salt mist" },
  SandDust: { id: "SandDust", category: "SandDust", name: "Sand & Dust", slots: 4, testHours: 24, description: "Sand/dust ingress test" },
  MechLoad: { id: "MechLoad", category: "MechLoad", name: "Mechanical Load", slots: 1, testHours: 8, description: "Static/dynamic load test" },
  Hail: { id: "Hail", category: "Hail", name: "Hail Impact", slots: 1, testHours: 4, description: "Hail impact resistance" },
};

export const CHAMBER_LIST = Object.values(CHAMBERS);

export const CHAMBER_CATEGORIES = Array.from(new Set(CHAMBER_LIST.map((c) => c.category)));
