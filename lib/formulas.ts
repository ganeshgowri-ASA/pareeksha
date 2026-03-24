import { CalculationInput, CalculationResult, ChamberResult } from './types';
import { CHAMBERS, getChamberById } from './chambers';
import { getStandardById } from './standards';

const DEFAULT_WORK_HOURS_PER_YEAR = 7200; // 300 days x 24 hrs
const DEFAULT_REALISATION_RATE = 0.65;

/**
 * Calculate total test hours for a given chamber and number of modules.
 * TestHrs = durationHours × quantity (from test profile)
 */
export function calcTestHours(
  chamberDurationHours: number,
  quantity: number
): number {
  return chamberDurationHours * quantity;
}

/**
 * Core formula:
 * Chambers = (Projects × BoMs × Modules × TestHrs) / (Slots × WorkHrs × RealisationRate)
 */
export function calcChambersNeeded(
  projects: number,
  boms: number,
  modules: number,
  testHours: number,
  slots: number,
  workHoursPerYear: number = DEFAULT_WORK_HOURS_PER_YEAR,
  realisationRate: number = DEFAULT_REALISATION_RATE
): number {
  const denominator = slots * workHoursPerYear * realisationRate;
  if (denominator === 0) return 0;
  const raw = (projects * boms * modules * testHours) / denominator;
  return Math.ceil(raw * 100) / 100; // Round to 2 decimal places
}

/**
 * Calculate utilization percentage for a chamber setup.
 * Utilization = actual demand hours / (chambers × slots × workHours × realisationRate)
 */
export function calcUtilization(
  demandHours: number,
  chambers: number,
  slots: number,
  workHoursPerYear: number = DEFAULT_WORK_HOURS_PER_YEAR,
  realisationRate: number = DEFAULT_REALISATION_RATE
): number {
  const capacity = chambers * slots * workHoursPerYear * realisationRate;
  if (capacity === 0) return 0;
  return Math.min((demandHours / capacity) * 100, 100);
}

/**
 * Calculate yearly capacity in module-tests for a given chamber configuration.
 */
export function calcYearlyCapacity(
  chambers: number,
  slots: number,
  testDurationHours: number,
  workHoursPerYear: number = DEFAULT_WORK_HOURS_PER_YEAR,
  realisationRate: number = DEFAULT_REALISATION_RATE
): number {
  if (testDurationHours === 0) return 0;
  const availableHours = chambers * slots * workHoursPerYear * realisationRate;
  return Math.floor(availableHours / testDurationHours);
}

/**
 * Run full calculation for all chambers needed based on a standard's test profile.
 */
export function calcAllDepartments(input: CalculationInput): CalculationResult {
  const {
    projects,
    bomsPerProject,
    modulesPerBom,
    standardId,
    realisationRate = DEFAULT_REALISATION_RATE,
    workHoursPerYear = DEFAULT_WORK_HOURS_PER_YEAR,
  } = input;

  const standard = getStandardById(standardId);
  if (!standard) {
    return {
      input,
      chambers: [],
      totalChambers: 0,
      totalTestHours: 0,
      averageUtilization: 0,
      bottleneck: null,
    };
  }

  // Use first test profile (full qualification) by default
  const profile = standard.testProfiles[0];
  const chamberResults: ChamberResult[] = [];

  for (const test of profile.tests) {
    const chamber = getChamberById(test.chamberId);
    if (!chamber) continue;

    const testHours = calcTestHours(chamber.durationHours, test.quantity);
    const chambersNeeded = calcChambersNeeded(
      projects,
      bomsPerProject,
      modulesPerBom,
      chamber.durationHours,
      chamber.slots,
      workHoursPerYear,
      realisationRate
    );

    const ceilChambers = Math.ceil(chambersNeeded);
    const utilization = calcUtilization(
      projects * bomsPerProject * modulesPerBom * chamber.durationHours,
      ceilChambers,
      chamber.slots,
      workHoursPerYear,
      realisationRate
    );

    chamberResults.push({
      chamberId: chamber.id,
      chamberName: chamber.label,
      category: chamber.category,
      testHours,
      slots: chamber.slots,
      chambersNeeded: ceilChambers,
      utilization: Math.round(utilization * 10) / 10,
    });
  }

  const totalChambers = chamberResults.reduce((sum, r) => sum + r.chambersNeeded, 0);
  const totalTestHours = chamberResults.reduce((sum, r) => sum + r.testHours, 0);
  const averageUtilization =
    chamberResults.length > 0
      ? Math.round(
          (chamberResults.reduce((sum, r) => sum + r.utilization, 0) / chamberResults.length) * 10
        ) / 10
      : 0;

  const bottleneck = chamberResults.reduce<ChamberResult | null>(
    (max, r) => (!max || r.chambersNeeded > max.chambersNeeded ? r : max),
    null
  );

  return {
    input,
    chambers: chamberResults,
    totalChambers,
    totalTestHours,
    averageUtilization,
    bottleneck,
  };
}
