import { CalculationInput, CalculationResult, ChamberType } from "./types";
import { CHAMBERS } from "./chambers";

const DEFAULT_WORK_HOURS = 7200; // 300 days x 24 hrs

export function calculateChambers(
  input: CalculationInput,
  chamberType: ChamberType
): CalculationResult {
  const chamber = CHAMBERS[chamberType];
  const workHours = input.workHoursPerYear || DEFAULT_WORK_HOURS;
  const totalTestHours = input.projects * input.boms * input.modules * chamber.testHours;
  const capacity = chamber.slots * workHours * input.realisationRate;
  const chambersRequired = capacity > 0 ? Math.ceil(totalTestHours / capacity) : 0;
  const utilization = chambersRequired > 0
    ? (totalTestHours / (chambersRequired * capacity)) * 100
    : 0;

  return {
    chamberType,
    chamberName: chamber.name,
    totalTestHours,
    chambersRequired,
    utilization: Math.round(utilization * 10) / 10,
    slots: chamber.slots,
  };
}

export function calculateAllChambers(input: CalculationInput): CalculationResult[] {
  return (Object.keys(CHAMBERS) as ChamberType[]).map((ct) =>
    calculateChambers(input, ct)
  );
}

export function totalChambersNeeded(results: CalculationResult[]): number {
  return results.reduce((sum, r) => sum + r.chambersRequired, 0);
}

export function averageUtilization(results: CalculationResult[]): number {
  const active = results.filter((r) => r.chambersRequired > 0);
  if (active.length === 0) return 0;
  return Math.round(active.reduce((sum, r) => sum + r.utilization, 0) / active.length * 10) / 10;
}
