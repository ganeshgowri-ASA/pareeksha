import { CHAMBERS, WORK_HRS_PER_YEAR, DEFAULT_REALISATION_RATE } from './chambers';
import { Department, Standard, CalculationResult } from './types';

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
      chambersNeeded: needed,
      utilizationPct: Math.round(util * 10) / 10,
      totalTestHrs: testHrs,
      bottleneck: false,
    });
  }

  for (const r of results) {
    if (r.chamberType === bottleneckType) {
      r.bottleneck = true;
    }
  }

  return results;
}
