import { CalculationInput, CalculationResult } from './types';
import { CHAMBERS, DEFAULT_WORK_HOURS_PER_YEAR, DEFAULT_REALISATION_RATE } from './chambers';

/**
 * Calculate chamber requirements for all chamber types.
 * Formula: Chambers = (Projects x BoMs x Modules x TestHrs) / (Slots x WorkHrs x RealisationRate)
 */
export function calculateAllChambers(input: CalculationInput): CalculationResult[] {
  const { projects, boms, modules, realisationRate, workHoursPerYear } = input;

  return CHAMBERS.map((chamber) => {
    const totalTestHours = projects * boms * modules * chamber.testDurationHrs;
    const slots = chamber.slotsFullSize;
    const denominator = slots * workHoursPerYear * realisationRate;
    const raw = denominator > 0 ? totalTestHours / denominator : 0;
    const chambersRequired = Math.ceil(raw);

    const capacity = chambersRequired * slots * workHoursPerYear * realisationRate;
    const utilization = capacity > 0
      ? Math.round((totalTestHours / capacity) * 1000) / 10
      : 0;

    return {
      chamberType: chamber.id,
      chamberName: chamber.name,
      slots,
      totalTestHours,
      totalTestHrs: totalTestHours,
      chambersRequired,
      chambersNeeded: chambersRequired,
      utilization,
      utilizationPct: utilization,
      bottleneck: false,
    };
  });
}

/** Total chambers needed across all results */
export function totalChambersNeeded(results: CalculationResult[]): number {
  return results.reduce((sum, r) => sum + r.chambersRequired, 0);
}

/** Average utilization of active (non-zero) chambers */
export function averageUtilization(results: CalculationResult[]): number {
  const active = results.filter((r) => r.chambersRequired > 0);
  if (active.length === 0) return 0;
  return Math.round(active.reduce((sum, r) => sum + r.utilization, 0) / active.length);
}

/** Mark bottleneck chamber (highest utilization) */
export function markBottlenecks(results: CalculationResult[]): CalculationResult[] {
  const active = results.filter((r) => r.chambersRequired > 0);
  if (active.length === 0) return results;
  const maxUtil = Math.max(...active.map((r) => r.utilization));
  return results.map((r) => ({
    ...r,
    bottleneck: r.utilization === maxUtil && r.chambersRequired > 0,
  }));
}
