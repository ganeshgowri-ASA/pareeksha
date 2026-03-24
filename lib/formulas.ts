import {
  CalculationInput,
  CalculationResult,
  CalculationInputState,
  ChamberTypeId,
  Department,
  DepartmentResult,
  Standard,
} from './types';
import { CHAMBERS, DEFAULT_WORK_HOURS_PER_YEAR, DEFAULT_REALISATION_RATE } from './chambers';

/**
 * Calculate total test hours for a given configuration.
 */
export function calcTestHours(
  projects: number,
  bomsPerProject: number,
  modulesPerBom: number,
  testDurationHrs: number
): number {
  return projects * bomsPerProject * modulesPerBom * testDurationHrs;
}

/**
 * Core formula: Chambers = (Projects × BoMs × Modules × TestHrs) / (Slots × WorkHrs × RealisationRate)
 */
export function calcChambersNeeded(input: CalculationInput): number {
  const workHours = input.workHoursPerYear ?? DEFAULT_WORK_HOURS_PER_YEAR;
  const realisation = input.realisationRate ?? DEFAULT_REALISATION_RATE;

  const numerator = input.projects * input.bomsPerProject * input.modulesPerBom * input.testDurationHrs;
  const denominator = input.slotsPerChamber * workHours * realisation;

  if (denominator === 0) return 0;
  return numerator / denominator;
}

/**
 * Calculate utilization percentage for a given number of chambers.
 */
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

/**
 * Calculate yearly capacity in test-hours for a number of chambers.
 */
export function calcYearlyCapacity(
  chambers: number,
  slotsPerChamber: number,
  workHoursPerYear: number = DEFAULT_WORK_HOURS_PER_YEAR,
  realisationRate: number = DEFAULT_REALISATION_RATE
): number {
  return chambers * slotsPerChamber * workHoursPerYear * realisationRate;
}

/**
 * Calculate chamber requirements for all chamber types given a calculation input.
 * Used by dashboard, calculator, and export pages.
 */
export function calculateAllChambers(input: CalculationInputState): CalculationResult[] {
  const { projects, boms, modules, realisationRate, workHoursPerYear } = input;

  return CHAMBERS.map((chamber) => {
    const totalTestHrs = projects * boms * modules * chamber.testDurationHrs;
    const capacity = chamber.slotsFullSize * workHoursPerYear * realisationRate;
    const chambersNeeded = capacity > 0 ? Math.ceil(totalTestHrs / capacity) : 0;
    const utilizationPct =
      chambersNeeded > 0
        ? Math.round(
            (totalTestHrs / (chambersNeeded * chamber.slotsFullSize * workHoursPerYear * realisationRate)) * 10000
          ) / 100
        : 0;

    return {
      chamberType: chamber.id,
      chamberName: chamber.name,
      slots: chamber.slotsFullSize,
      chambersNeeded,
      chambersRequired: chambersNeeded,
      totalTestHrs,
      totalTestHours: totalTestHrs,
      utilizationPct,
      utilization: utilizationPct,
      bottleneck: utilizationPct > 85,
    };
  });
}

/**
 * Sum up total chambers from results.
 */
export function totalChambersNeeded(results: CalculationResult[]): number {
  return results.reduce((sum, r) => sum + r.chambersNeeded, 0);
}

/**
 * Average utilization across active chambers.
 */
export function averageUtilization(results: CalculationResult[]): number {
  const active = results.filter((r) => r.chambersNeeded > 0);
  if (active.length === 0) return 0;
  const avg = active.reduce((sum, r) => sum + r.utilizationPct, 0) / active.length;
  return Math.round(avg * 10) / 10;
}

/**
 * Calculate for a single chamber type.
 */
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

  const totalTestHrs = projects * bomsPerProject * modulesPerBom * chamber.testDurationHrs;
  const capacity = chamber.slotsFullSize * workHoursPerYear * realisationRate;
  const chambersNeeded = capacity > 0 ? Math.ceil(totalTestHrs / capacity) : 0;
  const utilizationPct =
    chambersNeeded > 0
      ? Math.round(
          (totalTestHrs / (chambersNeeded * chamber.slotsFullSize * workHoursPerYear * realisationRate)) * 10000
        ) / 100
      : 0;

  return {
    chamberType: chamber.id,
    chamberName: chamber.name,
    slots: chamber.slotsFullSize,
    chambersNeeded,
    chambersRequired: chambersNeeded,
    totalTestHrs,
    totalTestHours: totalTestHrs,
    utilizationPct,
    utilization: utilizationPct,
    bottleneck: utilizationPct > 85,
  };
}

/**
 * Calculate all chamber requirements for departments.
 */
export function calcAllDepartments(
  departments: Department[],
  standards: Standard[],
  workHoursPerYear: number = DEFAULT_WORK_HOURS_PER_YEAR,
  realisationRate: number = DEFAULT_REALISATION_RATE
): DepartmentResult[] {
  return departments.map((dept) => {
    const standard = standards.find((s) => s.id === dept.standardId);
    if (!standard) {
      return {
        departmentId: dept.id,
        departmentName: dept.name,
        results: [],
        totalChambers: 0,
      };
    }

    const chamberTypeIds = new Set<ChamberTypeId>();
    for (const seq of standard.sequences) {
      for (const test of seq.tests) {
        chamberTypeIds.add(test.chamberTypeId);
      }
    }

    const results: CalculationResult[] = [];
    for (const typeId of Array.from(chamberTypeIds)) {
      const result = calcForChamberType(
        typeId,
        dept.defaultProjectsPerYear,
        dept.defaultBomsPerProject,
        dept.defaultModulesPerBom,
        workHoursPerYear,
        realisationRate
      );
      if (result && result.chambersNeeded > 0) {
        results.push(result);
      }
    }

    const totalChambers = results.reduce((sum, r) => sum + r.chambersNeeded, 0);

    return {
      departmentId: dept.id,
      departmentName: dept.name,
      results,
      totalChambers,
    };
  });
}
