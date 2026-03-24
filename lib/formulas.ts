import { CHAMBERS, WORK_HRS_PER_YEAR, DEFAULT_REALISATION_RATE } from './chambers';
import { Department, Standard, CalculationResult, CalculationInput } from './types';

export function calcTestHoursPerChamber(
  standard: Standard,
  totalBomChanges: number
): Record<string, number> {
  const hours: Record<string, number> = {};
  for (const profile of standard.testProfiles) {
    const existing = hours[profile.chamberType] || 0;
    hours[profile.chamberType] = existing + profile.durationHrs * totalBomChanges;
  }
  return hours;
}

export function calcChambersNeeded(
  testHrs: number,
  slots: number,
  realizationRate: number = DEFAULT_REALISATION_RATE
): number {
  const capacity = slots * WORK_HRS_PER_YEAR * realizationRate;
  if (capacity <= 0) return 0;
  return Math.ceil(testHrs / capacity);
}

export function calcUtilization(
  testHrs: number,
  chambers: number,
  slots: number
): number {
  const capacity = chambers * slots * WORK_HRS_PER_YEAR;
  if (capacity <= 0) return 0;
  return Math.min(100, (testHrs / capacity) * 100);
}

export function calcAllDepartments(
  departments: Department[],
  standard: Standard,
  realizationRate: number = DEFAULT_REALISATION_RATE
): CalculationResult[] {
  const totalBomChanges = departments.reduce(
    (sum, d) => sum + d.projectsPerYear * d.bomsPerProject,
    0
  );

  const hoursPerChamber = calcTestHoursPerChamber(standard, totalBomChanges);

  const results: CalculationResult[] = [];
  let maxUtil = 0;
  let bottleneckType = '';

  for (const chamber of CHAMBERS) {
    const testHrs = hoursPerChamber[chamber.id] || 0;
    if (testHrs === 0) continue;

    const needed = calcChambersNeeded(testHrs, chamber.slotsFS, realizationRate);
    const util = calcUtilization(testHrs, needed, chamber.slotsFS);

    if (util > maxUtil) {
      maxUtil = util;
      bottleneckType = chamber.id;
    }

    results.push({
      chamberType: chamber.id,
      chamberName: chamber.name,
      chambersNeeded: needed,
      utilizationPct: Math.round(util * 10) / 10,
      totalTestHrs: testHrs,
      bottleneck: false,
      slots: chamber.slotsFS,
      totalTestHours: testHrs,
      chambersRequired: needed,
      utilization: Math.round(util * 10) / 10,
    });
  }

  for (const r of results) {
    if (r.chamberType === bottleneckType) {
      r.bottleneck = true;
    }
  }

  return results;
}

export function calculateAllChambers(input: CalculationInput): CalculationResult[] {
  const totalBomChanges = input.projects * input.boms;

  const results: CalculationResult[] = [];
  let maxUtil = 0;
  let bottleneckType = '';

  for (const chamber of CHAMBERS) {
    // Use a representative test duration per chamber type
    const variant = chamber.variants[0];
    if (!variant) continue;

    const testHrs = totalBomChanges * input.modules * variant.durationHrs;
    const capacity = chamber.slotsFS * input.workHoursPerYear * input.realisationRate;
    const needed = capacity > 0 ? Math.ceil(testHrs / capacity) : 0;
    const util = needed > 0
      ? Math.min(100, (testHrs / (needed * chamber.slotsFS * input.workHoursPerYear)) * 100)
      : 0;

    if (util > maxUtil) {
      maxUtil = util;
      bottleneckType = chamber.id;
    }

    results.push({
      chamberType: chamber.id,
      chamberName: chamber.name,
      chambersNeeded: needed,
      utilizationPct: Math.round(util * 10) / 10,
      totalTestHrs: testHrs,
      bottleneck: false,
      slots: chamber.slotsFS,
      totalTestHours: testHrs,
      chambersRequired: needed,
      utilization: Math.round(util * 10) / 10,
    });
  }

  for (const r of results) {
    if (r.chamberType === bottleneckType) {
      r.bottleneck = true;
    }
  }

  return results;
}

export function totalChambersNeeded(results: CalculationResult[]): number {
  return results.reduce((sum, r) => sum + r.chambersRequired, 0);
}
