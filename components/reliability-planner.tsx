"use client";

import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line,
} from "recharts";
import { Lightbulb, TrendingDown } from "lucide-react";
import { getStandard } from "@/lib/standards";
import { getChamber } from "@/lib/chambers";
import { useAppStore } from "@/lib/store";
import type { ReliabilityTest } from "@/lib/types";
import { cn } from "@/lib/utils";

// Weibull CDF
function weibullCDF(t: number, beta: number, eta: number): number {
  return 1 - Math.exp(-Math.pow(t / eta, beta));
}

export default function ReliabilityPlanner() {
  const { selectedStandard, calculationInput } = useAppStore();
  const standard = getStandard(selectedStandard);

  const [tests, setTests] = useState<ReliabilityTest[]>(() =>
    standard.tests.map((t) => ({
      id: t.id,
      name: t.name,
      chamberType: t.chamberType,
      testHours: t.testHours,
      samplesRequired: t.samplesRequired,
      annualDemand: 4,
      chambersNeeded: 0,
    }))
  );

  const [weibullBeta, setWeibullBeta] = useState(2.5);
  const [weibullEta, setWeibullEta] = useState(5000);

  const computedTests = tests.map((t) => {
    const chamber = getChamber(t.chamberType);
    if (!chamber) return { ...t, chambersNeeded: 0 };
    const totalHours = t.annualDemand * t.samplesRequired * t.testHours;
    const capacity =
      chamber.slotsFullSize * calculationInput.workHoursPerYear * calculationInput.realisationRate;
    const needed = capacity > 0 ? Math.ceil(totalHours / capacity) : 0;
    return { ...t, chambersNeeded: needed };
  });

  const totalChambers = computedTests.reduce((s, t) => s + t.chambersNeeded, 0);
  const totalTestHours = computedTests.reduce((s, t) => s + t.annualDemand * t.samplesRequired * t.testHours, 0);

  // MTBF/MTTF calculations
  const mtbf = weibullEta * (1 + 1 / weibullBeta); // Gamma(1+1/beta) approximation
  const mttf = mtbf; // For non-repairable systems

  // Weibull curve data
  const weibullData = useMemo(() => {
    const points = [];
    const maxT = weibullEta * 2;
    for (let i = 0; i <= 50; i++) {
      const t = (i / 50) * maxT;
      points.push({
        hours: Math.round(t),
        failure: Math.round(weibullCDF(t, weibullBeta, weibullEta) * 1000) / 10,
        reliability: Math.round((1 - weibullCDF(t, weibullBeta, weibullEta)) * 1000) / 10,
      });
    }
    return points;
  }, [weibullBeta, weibullEta]);

  // Gantt chart data
  const ganttData = computedTests
    .filter((t) => t.chambersNeeded > 0)
    .map((t) => {
      const chamber = getChamber(t.chamberType);
      const monthsNeeded = chamber ? Math.ceil(t.testHours / (24 * 30)) : 1;
      return {
        name: t.name.length > 20 ? t.name.slice(0, 18) + "..." : t.name,
        fullName: t.name,
        start: 0,
        duration: Math.max(1, monthsNeeded),
        chambers: t.chambersNeeded,
        hours: t.testHours,
      };
    });

  // Optimization suggestions
  const suggestions = useMemo(() => {
    const tips: string[] = [];
    const highUtil = computedTests.filter((t) => t.chambersNeeded > 2);
    if (highUtil.length > 0) {
      tips.push(`Consider batch scheduling for ${highUtil.map((t) => t.name).join(", ")} to reduce idle time.`);
    }
    const uvTests = computedTests.filter((t) => t.chamberType.startsWith("UV"));
    if (uvTests.length > 1) {
      tips.push("UV chambers have low slot count (2). Consider running UV tests in parallel with other test sequences.");
    }
    if (totalChambers > 10) {
      tips.push("High chamber count detected. Evaluate staggering test schedules across quarters to optimize loading.");
    }
    if (calculationInput.realisationRate < 0.6) {
      tips.push("Low realisation rate. Improving maintenance schedules could increase effective chamber capacity.");
    }
    if (tips.length === 0) {
      tips.push("Chamber loading appears well-optimized for the current demand profile.");
    }
    return tips;
  }, [computedTests, totalChambers, calculationInput.realisationRate]);

  const updateDemand = (id: string, value: number) => {
    setTests((prev) =>
      prev.map((t) => (t.id === id ? { ...t, annualDemand: value } : t))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Standard: <strong className="text-slate-800 dark:text-slate-200">{standard.name}</strong> &mdash; {standard.tests.length} tests
        </p>
        <span className="rounded-full bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
          {totalChambers} chambers total
        </span>
      </div>

      {/* Test demand table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50">
              <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">Test</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">Chamber</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-300">Hours</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-300">Modules</th>
              <th className="px-4 py-3 text-center font-semibold text-slate-700 dark:text-slate-300">Annual Demand</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-300">Chambers</th>
            </tr>
          </thead>
          <tbody>
            {computedTests.map((t) => (
              <tr key={t.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">{t.name}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{getChamber(t.chamberType)?.name ?? t.chamberType}</td>
                <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">{t.testHours}</td>
                <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">{t.samplesRequired}</td>
                <td className="px-4 py-3 text-center">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={t.annualDemand}
                    onChange={(e) => updateDemand(t.id, Math.max(0, Number(e.target.value)))}
                    className="w-20 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 py-1 text-center text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:text-slate-200"
                  />
                </td>
                <td className="px-4 py-3 text-right">
                  <span className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                    t.chambersNeeded > 2
                      ? "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                      : t.chambersNeeded > 0
                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                  )}>
                    {t.chambersNeeded}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50">
              <td className="px-4 py-3 font-bold text-slate-900 dark:text-white" colSpan={5}>Total Chambers</td>
              <td className="px-4 py-3 text-right">
                <span className="rounded-full bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-0.5 text-sm font-bold text-emerald-700 dark:text-emerald-300">
                  {totalChambers}
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Weibull Distribution */}
      <div className="card">
        <h3 className="mb-4 text-base font-semibold text-slate-900 dark:text-white">Weibull Distribution Analysis</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">Shape (Beta)</label>
            <input
              type="range" min={50} max={500} value={weibullBeta * 100}
              onChange={(e) => setWeibullBeta(Number(e.target.value) / 100)}
              className="w-full accent-blue-600"
            />
            <span className="text-xs text-slate-500">{weibullBeta.toFixed(2)}</span>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">Scale (Eta, hrs)</label>
            <input
              type="number" min={100} value={weibullEta}
              onChange={(e) => setWeibullEta(Number(e.target.value) || 1000)}
              className="input-field"
            />
          </div>
          <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3 text-center">
            <p className="text-xl font-bold text-blue-700 dark:text-blue-300">{Math.round(mtbf).toLocaleString()}</p>
            <p className="text-xs text-blue-600 dark:text-blue-400">MTBF (hrs)</p>
          </div>
          <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-3 text-center">
            <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300">{Math.round(mttf).toLocaleString()}</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400">MTTF (hrs)</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={weibullData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
            <XAxis dataKey="hours" tick={{ fontSize: 11, fill: "#64748b" }} label={{ value: "Hours", position: "insideBottom", offset: -5, fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11, fill: "#64748b" }} label={{ value: "%", angle: -90, position: "insideLeft", fontSize: 11 }} />
            <Tooltip />
            <Line type="monotone" dataKey="failure" name="Failure %" stroke="#ef4444" strokeWidth={2} dot={false} animationDuration={1000} />
            <Line type="monotone" dataKey="reliability" name="Reliability %" stroke="#10b981" strokeWidth={2} dot={false} animationDuration={1000} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Gantt Chart */}
      <div className="card">
        <h3 className="mb-4 text-base font-semibold text-slate-900 dark:text-white">Test Schedule Gantt Chart</h3>
        <div className="space-y-2">
          <div className="flex text-xs text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 pb-2">
            <div className="w-48 shrink-0 font-semibold">Test</div>
            <div className="flex-1 grid grid-cols-12 gap-px">
              {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m) => (
                <div key={m} className="text-center text-[10px]">{m}</div>
              ))}
            </div>
          </div>
          {ganttData.map((item, idx) => {
            const colors = ["bg-blue-500", "bg-emerald-500", "bg-purple-500", "bg-amber-500", "bg-rose-500", "bg-cyan-500"];
            const color = colors[idx % colors.length];
            return (
              <div key={idx} className="flex items-center text-xs group">
                <div className="w-48 shrink-0 font-medium text-slate-700 dark:text-slate-300 truncate pr-2" title={item.fullName}>
                  {item.name}
                  <span className="ml-1 text-slate-400">(x{item.chambers})</span>
                </div>
                <div className="flex-1 grid grid-cols-12 gap-px h-6">
                  {Array.from({ length: 12 }).map((_, m) => (
                    <div key={m} className="relative rounded-sm bg-slate-100 dark:bg-slate-700/50">
                      {m < item.duration && (
                        <div className={cn("absolute inset-0.5 rounded-sm", color, "opacity-80 group-hover:opacity-100 transition-opacity")} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Optimization Suggestions */}
      <div className="card border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb size={18} className="text-amber-600 dark:text-amber-400" />
          <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-200">Chamber Loading Optimization</h3>
        </div>
        <ul className="space-y-2">
          {suggestions.map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-amber-800 dark:text-amber-300">
              <TrendingDown size={14} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
