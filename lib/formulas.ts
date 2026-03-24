import { CalculationInput, CalculationResult, ChamberTypeId } from './types';
import { CHAMBERS, DEFAULT_WORK_HOURS_PER_YEAR, DEFAULT_REALISATION_RATE } from './chambers';

/**
 * Calculate all chamber requirements based on calculation input.
 * Returns a CalculationResult for every chamber type.
 */
export function calculateAllChambers(input: CalculationInput): CalculationResult[] {
  const { projects, boms, modules, realisationRate, workHoursPerYear } = input;

  return CHAMBERS.map((chamber) => {
    const totalTestHours = projects * boms * modules * chamber.testDurationHrs;
    const capacity = chamber.slots * workHoursPerYear * realisationRate;
    const chambersExact = capacity > 0 ? totalTestHours / capacity : 0;
    const chambersNeeded = Math.ceil(chambersExact);
    const actualCapacity = chambersNeeded * chamber.slots * workHoursPerYear * realisationRate;
    const utilization = actualCapacity > 0 ? Math.round((totalTestHours / actualCapacity) * 100) : 0;

    return {
      chamberType: chamber.id,
      chamberName: chamber.name,
      slots: chamber.slots,
      totalTestHours,
      totalTestHrs: totalTestHours,
      chambersRequired: chambersNeeded,
      chambersNeeded,
      utilization,
      utilizationPct: utilization,
      bottleneck: utilization > 85,
    };
  });
}

/** Sum total chambers needed from a set of results */
export function totalChambersNeeded(results: CalculationResult[]): number {
  return results.reduce((sum, r) => sum + r.chambersNeeded, 0);
}

/** Calculate average utilization across active chambers */
export function averageUtilization(results: CalculationResult[]): number {
  const active = results.filter((r) => r.chambersNeeded > 0);
  if (active.length === 0) return 0;
  const total = active.reduce((sum, r) => sum + r.utilization, 0);
  return Math.round(total / active.length);
}

/**
 * Core formula: Chambers = (Projects x BoMs x Modules x TestHrs) / (Slots x WorkHrs x RealisationRate)
 */
export function calcChambersNeeded(
  projects: number,
  bomsPerProject: number,
  modulesPerBom: number,
  testDurationHrs: number,
  slotsPerChamber: number,
  workHoursPerYear: number = DEFAULT_WORK_HOURS_PER_YEAR,
  realisationRate: number = DEFAULT_REALISATION_RATE
): number {
  const numerator = projects * bomsPerProject * modulesPerBom * testDurationHrs;
  const denominator = slotsPerChamber * workHoursPerYear * realisationRate;
  if (denominator === 0) return 0;
  return numerator / denominator;
}

/** Calculate test hours */
export function calcTestHours(
  projects: number,
  bomsPerProject: number,
  modulesPerBom: number,
  testDurationHrs: number
): number {
  return projects * bomsPerProject * modulesPerBom * testDurationHrs;
}

/** Calculate utilization percentage */
export function calcUtilization(
  totalTestHours: number,
  chambers: number,
  slotsPerChamber: number,
  workHoursPerYear: number = DEFAULT_WORK_HOURS_PER_YEAR,
  realisationRate: number = DEFAULT_REALISATION_RATE
): number {
  const capacity = chambers * slotsPerChamber * workHoursPerYear * realisationRate;
  if (capacity === 0) return 0;
  return (totalTestHours / capacity) * 100;
}

/** Calculate for a specific chamber type */
export function calcForChamberType(
  chamberTypeId: ChamberTypeId,
  projects: number,
  bomsPerProject: number,
  modulesPerBom: number,
  workHoursPerYear: number = DEFAULT_WORK_HOURS_PER_YEAR,
  realisationRate: number = DEFAULT_REALISATION_RATE
): CalculationResult | null {
  const chamber = CHAMBERS.find((c) => c.id === chamberTypeId);
  if (!chamber) return null;

  const totalTestHours = projects * bomsPerProject * modulesPerBom * chamber.testDurationHrs;
  const capacity = chamber.slots * workHoursPerYear * realisationRate;
  const chambersExact = capacity > 0 ? totalTestHours / capacity : 0;
  const chambersNeeded = Math.ceil(chambersExact);
  const actualCapacity = chambersNeeded * chamber.slots * workHoursPerYear * realisationRate;
  const utilization = actualCapacity > 0 ? Math.round((totalTestHours / actualCapacity) * 100) : 0;

  return {
    chamberType: chamber.id,
    chamberName: chamber.name,
    slots: chamber.slots,
    totalTestHours,
    totalTestHrs: totalTestHours,
    chambersRequired: chambersNeeded,
    chambersNeeded,
    utilization,
    utilizationPct: utilization,
    bottleneck: utilization > 85,
  };
}
