'use client';

import { useState, useMemo } from 'react';
import { Box, RotateCcw } from 'lucide-react';

/* ───── Types ───── */
interface ChamberConfig {
  id: string;
  label: string;
  slotsPerChamber: number;
  referenceChambers: number;
  cycleTimeHrs: number;
  numberOfCycles: number;
  color: string;        // tailwind bg class
  colorHex: string;     // for gradient
  colorLight: string;   // lighter variant
}

/* ───── Defaults ───── */
const DEFAULT_CHAMBERS: ChamberConfig[] = [
  { id: 'DH1000', label: 'DH1000', slotsPerChamber: 20, referenceChambers: 4, cycleTimeHrs: 1050, numberOfCycles: 1, color: 'bg-blue-500', colorHex: '#3b82f6', colorLight: 'bg-blue-100 dark:bg-blue-900/40' },
  { id: 'TC50', label: 'TC50', slotsPerChamber: 20, referenceChambers: 5, cycleTimeHrs: 5, numberOfCycles: 50, color: 'bg-emerald-500', colorHex: '#10b981', colorLight: 'bg-emerald-100 dark:bg-emerald-900/40' },
  { id: 'HF10', label: 'HF10', slotsPerChamber: 10, referenceChambers: 5, cycleTimeHrs: 26, numberOfCycles: 10, color: 'bg-orange-500', colorHex: '#f97316', colorLight: 'bg-orange-100 dark:bg-orange-900/40' },
  { id: 'PID108', label: 'PID108', slotsPerChamber: 20, referenceChambers: 1, cycleTimeHrs: 108, numberOfCycles: 1, color: 'bg-purple-500', colorHex: '#a855f7', colorLight: 'bg-purple-100 dark:bg-purple-900/40' },
  { id: 'UV15', label: 'UV15', slotsPerChamber: 2, referenceChambers: 2, cycleTimeHrs: 80, numberOfCycles: 1, color: 'bg-yellow-500', colorHex: '#eab308', colorLight: 'bg-yellow-100 dark:bg-yellow-900/40' },
];

const DEFAULT_PROJECTS_PER_DEPT = 10;
const DEFAULT_BOMS_PER_PROJECT = 4;
const DEFAULT_MODULES_PER_BOM = 8;

/* ───── Derived calc result ───── */
interface ChamberResult {
  config: ChamberConfig;
  moduleWorkingHrs: number;
  testTimeline: number;
  totalTestHrs: number;
  effectiveHrs: number;
  exactChambers: number;
  roundedChambers: number;
  utilization: number;
}

/* ───── Component ───── */
export default function ChamberEstimation() {
  // Input parameters
  const [workingDays, setWorkingDays] = useState(300);
  const [workingHoursPerDay, setWorkingHoursPerDay] = useState(24);
  const [realisationRate, setRealisationRate] = useState(65);
  const [projectsPerYear, setProjectsPerYear] = useState(DEFAULT_PROJECTS_PER_DEPT);
  const [bomsPerProject, setBomsPerProject] = useState(DEFAULT_BOMS_PER_PROJECT);
  const [modulesPerBom, setModulesPerBom] = useState(DEFAULT_MODULES_PER_BOM);

  // Chamber configs (editable)
  const [chambers, setChambers] = useState<ChamberConfig[]>(DEFAULT_CHAMBERS);

  const workingHoursPerYear = workingDays * workingHoursPerDay;
  const rate = realisationRate / 100;

  const updateChamber = (idx: number, field: keyof ChamberConfig, value: number) => {
    setChambers(prev => prev.map((c, i) => i === idx ? { ...c, [field]: value } : c));
  };

  // Calculate results for each chamber type
  const results: ChamberResult[] = useMemo(() => {
    return chambers.map(config => {
      const moduleWorkingHrs = config.slotsPerChamber * workingHoursPerYear;
      const testTimeline = config.cycleTimeHrs * config.numberOfCycles;
      const totalTestHrs = projectsPerYear * bomsPerProject * modulesPerBom * testTimeline;
      const effectiveHrs = totalTestHrs / rate;
      const exactChambers = effectiveHrs / moduleWorkingHrs;
      const roundedChambers = Math.ceil(exactChambers);
      const capacity = roundedChambers * moduleWorkingHrs * rate;
      const utilization = capacity > 0 ? (totalTestHrs / capacity) * 100 : 0;
      return { config, moduleWorkingHrs, testTimeline, totalTestHrs, effectiveHrs, exactChambers, roundedChambers, utilization };
    });
  }, [chambers, workingHoursPerYear, rate, projectsPerYear, bomsPerProject, modulesPerBom]);

  const totalChambers = results.reduce((s, r) => s + r.roundedChambers, 0);
  const totalTestHours = results.reduce((s, r) => s + r.totalTestHrs, 0);
  const totalSlots = results.reduce((s, r) => s + r.config.slotsPerChamber * r.roundedChambers, 0);
  const avgUtilization = results.length > 0
    ? results.reduce((s, r) => s + r.utilization, 0) / results.length
    : 0;

  const resetAll = () => {
    setWorkingDays(300);
    setWorkingHoursPerDay(24);
    setRealisationRate(65);
    setProjectsPerYear(DEFAULT_PROJECTS_PER_DEPT);
    setBomsPerProject(DEFAULT_BOMS_PER_PROJECT);
    setModulesPerBom(DEFAULT_MODULES_PER_BOM);
    setChambers(DEFAULT_CHAMBERS);
  };

  return (
    <div className="space-y-8">
      {/* ─── Optimization Summary Cards ─── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <SummaryCard label="Total Chambers Required" value={totalChambers} accent="blue" big />
        <SummaryCard label="Total Test Hours/Year" value={totalTestHours.toLocaleString()} accent="emerald" />
        <SummaryCard label="Total Module Slots" value={totalSlots} accent="orange" />
        <SummaryCard label="Average Utilization" value={`${avgUtilization.toFixed(1)}%`} accent="purple" />
        <SummaryCard label="Working Hours/Year" value={workingHoursPerYear.toLocaleString()} accent="yellow" />
      </div>

      {/* ─── Input Parameters ─── */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Input Parameters</h2>
          <button onClick={resetAll} className="btn-secondary text-xs gap-1">
            <RotateCcw size={14} /> Reset
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <InputCard label="Working days/year" value={workingDays} onChange={setWorkingDays} />
          <InputCard label="Working hours/day" value={workingHoursPerDay} onChange={setWorkingHoursPerDay} />
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Working hours/year</label>
            <div className="input-field bg-slate-50 dark:bg-slate-700/50 font-semibold text-blue-600 dark:text-blue-400 cursor-default">
              {workingHoursPerYear.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-400">auto-calculated</span>
          </div>
          <InputCard label="Realisation rate (%)" value={realisationRate} onChange={setRealisationRate} min={1} max={100} />
          <InputCard label="Projects/year/dept" value={projectsPerYear} onChange={setProjectsPerYear} />
          <InputCard label="BoMs per project" value={bomsPerProject} onChange={setBomsPerProject} />
        </div>
        <div className="mt-3">
          <InputCard label="Modules per BoM" value={modulesPerBom} onChange={setModulesPerBom} inline />
        </div>
      </div>

      {/* ─── Chamber Types Table ─── */}
      <div className="card overflow-x-auto">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Chamber Types Configuration</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700 text-left">
              <th className="pb-3 pr-4 font-medium text-slate-500 dark:text-slate-400">Parameter</th>
              {chambers.map(c => (
                <th key={c.id} className="pb-3 px-3 text-center font-medium">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-white text-xs font-semibold ${c.color}`}>
                    <ChamberIcon size={14} />
                    {c.label}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            <tr>
              <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">Modules/slots per chamber</td>
              {chambers.map((c, i) => (
                <td key={c.id} className="py-3 px-3 text-center">
                  <input type="number" min={1} value={c.slotsPerChamber}
                    onChange={e => updateChamber(i, 'slotsPerChamber', +e.target.value || 1)}
                    className="input-field w-20 mx-auto text-center" />
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">Reference chambers</td>
              {chambers.map((c, i) => (
                <td key={c.id} className="py-3 px-3 text-center">
                  <input type="number" min={0} value={c.referenceChambers}
                    onChange={e => updateChamber(i, 'referenceChambers', +e.target.value || 0)}
                    className="input-field w-20 mx-auto text-center" />
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">Cycle time (hrs)</td>
              {chambers.map((c, i) => (
                <td key={c.id} className="py-3 px-3 text-center">
                  <input type="number" min={0} value={c.cycleTimeHrs}
                    onChange={e => updateChamber(i, 'cycleTimeHrs', +e.target.value || 0)}
                    className="input-field w-20 mx-auto text-center" />
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">No of cycles</td>
              {chambers.map((c, i) => (
                <td key={c.id} className="py-3 px-3 text-center">
                  <input type="number" min={1} value={c.numberOfCycles}
                    onChange={e => updateChamber(i, 'numberOfCycles', +e.target.value || 1)}
                    className="input-field w-20 mx-auto text-center" />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* ─── Derivation Section ─── */}
      <div className="card">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Step-by-Step Derivation</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {results.map(r => (
            <DerivationCard key={r.config.id} result={r} workingHoursPerYear={workingHoursPerYear} realisationRate={rate} projectsPerYear={projectsPerYear} bomsPerProject={bomsPerProject} modulesPerBom={modulesPerBom} />
          ))}
        </div>
      </div>

      {/* ─── Visual Chamber Summary ─── */}
      <div className="card">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Visual Chamber Summary</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          Total chambers: <span className="font-bold text-slate-900 dark:text-white">{totalChambers}</span>
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {results.map(r => (
            <ChamberBox key={r.config.id} result={r} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ───── Sub-Components ───── */

function SummaryCard({ label, value, accent, big }: { label: string; value: string | number; accent: string; big?: boolean }) {
  const borderColor: Record<string, string> = {
    blue: 'border-l-blue-500',
    emerald: 'border-l-emerald-500',
    orange: 'border-l-orange-500',
    purple: 'border-l-purple-500',
    yellow: 'border-l-yellow-500',
  };
  return (
    <div className={`card border-l-4 ${borderColor[accent] || 'border-l-blue-500'}`}>
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{label}</p>
      <p className={`font-bold text-slate-900 dark:text-white ${big ? 'text-3xl' : 'text-xl'}`}>{value}</p>
    </div>
  );
}

function InputCard({ label, value, onChange, min, max, inline }: {
  label: string; value: number; onChange: (v: number) => void; min?: number; max?: number; inline?: boolean;
}) {
  return (
    <div className={`space-y-1.5 ${inline ? 'max-w-[200px]' : ''}`}>
      <label className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</label>
      <input
        type="number"
        min={min ?? 0}
        max={max}
        value={value}
        onChange={e => onChange(+e.target.value || 0)}
        className="input-field"
      />
    </div>
  );
}

function ChamberIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function DerivationCard({ result: r, workingHoursPerYear, realisationRate, projectsPerYear, bomsPerProject, modulesPerBom }: {
  result: ChamberResult; workingHoursPerYear: number; realisationRate: number; projectsPerYear: number; bomsPerProject: number; modulesPerBom: number;
}) {
  return (
    <div className={`rounded-xl border border-slate-200 dark:border-slate-700 p-4 ${r.config.colorLight}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-white text-xs font-bold ${r.config.color}`}>
          <ChamberIcon size={12} /> {r.config.label}
        </span>
      </div>
      <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
        <Step n={1} label="Module working hrs/year" formula={`${r.config.slotsPerChamber} × ${workingHoursPerYear.toLocaleString()}`} result={r.moduleWorkingHrs.toLocaleString()} />
        <Step n={2} label="Test timeline" formula={`${r.config.cycleTimeHrs} × ${r.config.numberOfCycles}`} result={`${r.testTimeline.toLocaleString()} hrs`} />
        <Step n={3} label="Total test hours" formula={`${projectsPerYear} × ${bomsPerProject} × ${modulesPerBom} × ${r.testTimeline.toLocaleString()}`} result={`${r.totalTestHrs.toLocaleString()} hrs`} />
        <Step n={4} label="Effective hours" formula={`${r.totalTestHrs.toLocaleString()} / ${realisationRate}`} result={r.effectiveHrs.toLocaleString(undefined, { maximumFractionDigits: 0 })} />
        <Step n={5} label="Actual chambers" formula={`${r.effectiveHrs.toLocaleString(undefined, { maximumFractionDigits: 0 })} / ${r.moduleWorkingHrs.toLocaleString()}`} result={`${r.exactChambers.toFixed(2)} → ${r.roundedChambers}`} />
      </div>
    </div>
  );
}

function Step({ n, label, formula, result }: { n: number; label: string; formula: string; result: string }) {
  return (
    <div>
      <span className="font-semibold text-slate-500 dark:text-slate-400">Step {n}:</span>{' '}
      <span className="font-medium text-slate-700 dark:text-slate-200">{label}</span>
      <div className="mt-0.5 pl-4 font-mono text-[11px] text-slate-500 dark:text-slate-400">
        = {formula} = <span className="font-bold text-slate-900 dark:text-white">{result}</span>
      </div>
    </div>
  );
}

function ChamberBox({ result: r }: { result: ChamberResult }) {
  return (
    <div className="flex flex-col items-center gap-2">
      {/* 3D Chamber Box */}
      <div className="relative w-24 h-28 group">
        {/* Box shadow / depth */}
        <div
          className="absolute inset-0 rounded-lg opacity-30 translate-x-1 translate-y-1"
          style={{ background: r.config.colorHex }}
        />
        {/* Main face */}
        <div
          className="absolute inset-0 rounded-lg flex flex-col items-center justify-center text-white font-bold shadow-lg transition-transform group-hover:scale-105"
          style={{
            background: `linear-gradient(135deg, ${r.config.colorHex}, ${r.config.colorHex}dd)`,
          }}
        >
          <ChamberIcon size={20} />
          <span className="text-2xl mt-1">{r.roundedChambers}</span>
          <span className="text-[10px] font-medium opacity-80">{r.config.label}</span>
        </div>
        {/* Top face illusion */}
        <div
          className="absolute -top-1 left-1 right-1 h-3 rounded-t-lg opacity-40"
          style={{ background: `linear-gradient(180deg, white, ${r.config.colorHex})` }}
        />
      </div>
      {/* Label */}
      <div className="text-center">
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{r.config.label}</p>
        <p className="text-[10px] text-slate-500 dark:text-slate-400">
          Utilization: {r.utilization.toFixed(1)}%
        </p>
      </div>
    </div>
  );
}
