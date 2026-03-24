import { CalculationResult, Department, TestProfile } from "./types";
import { WORK_HOURS_PER_YEAR, DEFAULT_REALISATION_RATE } from "./chambers";

export function calculateChamberCount(
  projects: number,
  boms: number,
  modules: number,
  testHours: number,
  slots: number,
  workHours: number = WORK_HOURS_PER_YEAR,
  realisationRate: number = DEFAULT_REALISATION_RATE
): number {
  const denominator = slots * workHours * realisationRate;
  if (denominator === 0) return 0;
  return (projects * boms * modules * testHours) / denominator;
}

export function calculateUtilization(
  chambersRequired: number,
  chambersAvailable: number
): number {
  if (chambersAvailable === 0) return 0;
  return Math.min((chambersRequired / chambersAvailable) * 100, 100);
}

export function calculateResults(
  departments: Department[],
  tests: TestProfile[],
  realisationRate: number = DEFAULT_REALISATION_RATE
): CalculationResult[] {
  const totalProjects = departments.reduce((sum, d) => sum + d.projectsPerYear, 0);
  const avgBoms = departments.reduce((sum, d) => sum + d.bomsPerProject, 0) / Math.max(departments.length, 1);

  return tests.map((test) => {
    const totalTestHours = totalProjects * avgBoms * test.modulesRequired * test.testHours;
    const chambersRequired = calculateChamberCount(
      totalProjects,
      avgBoms,
      test.modulesRequired,
      test.testHours,
      getChamberSlots(test.chamberType),
      WORK_HOURS_PER_YEAR,
      realisationRate
    );

    return {
      chamberType: test.chamberType,
      chamberName: test.name,
      totalTestHours,
      chambersRequired: Math.ceil(chambersRequired),
      utilization: Math.min((chambersRequired / Math.max(Math.ceil(chambersRequired), 1)) * 100, 100),
      slots: getChamberSlots(test.chamberType),
    };
  });
}

function getChamberSlots(type: string): number {
  const slotMap: Record<string, number> = {
    DH: 20, TC: 20, HF: 10, PID: 20, UV: 2,
    SaltMist: 8, SandDust: 4, MechLoad: 1, Hail: 1,
  };
  return slotMap[type] ?? 10;
}
