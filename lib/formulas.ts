import {
  CalculationInput,
  CalculationResult,
  ChamberTypeId,
  Department,
  DepartmentResult,
  Standard,
} from './types';
import { CHAMBERS, DEFAULT_WORK_HOURS_PER_YEAR, DEFAULT_REALISATION_RATE } from './chambers';

/**
 * Calculate total test hours for a given configuration.
 * TestHours = Projects × BoMs × Modules × ChamberTestDuration
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
 * Utilization = (TotalTestHours) / (Chambers × Slots × WorkHrs × RealisationRate) × 100
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
 * Calculate chamber requirements for a single chamber type.
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

  const input: CalculationInput = {
    projects,
    bomsPerProject,
    modulesPerBom,
    testDurationHrs: chamber.testDurationHrs,
    slotsPerChamber: chamber.slotsFullSize,
    workHoursPerYear,
    realisationRate,
  };

  const chambersNeeded = calcChambersNeeded(input);
  const chambersRounded = Math.ceil(chambersNeeded);
  const totalTestHours = calcTestHours(projects, bomsPerProject, modulesPerBom, chamber.testDurationHrs);
  const totalCapacity = calcYearlyCapacity(chambersRounded, chamber.slotsFullSize, workHoursPerYear, realisationRate);
  const utilization = chambersRounded > 0
    ? calcUtilization(totalTestHours, chambersRounded, chamber.slotsFullSize, workHoursPerYear, realisationRate)
    : 0;

  return {
    chamberTypeId,
    chamberName: chamber.name,
    chambersNeeded,
    chambersRounded,
    totalTestHours,
    totalCapacityHours: totalCapacity,
    utilizationPercent: Math.round(utilization * 100) / 100,
  };
}

/**
 * Calculate all chamber requirements for a department based on its standard's test sequences.
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

    // Collect unique chamber types from the standard's sequences
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
      if (result && result.chambersRounded > 0) {
        results.push(result);
      }
    }

    const totalChambers = results.reduce((sum, r) => sum + r.chambersRounded, 0);

    return {
      departmentId: dept.id,
      departmentName: dept.name,
      results,
      totalChambers,
    };
  });
}
