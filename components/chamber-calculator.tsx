"use client";

import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import { useAppStore } from "@/lib/store";
import { calculateAllChambers, totalChambersNeeded, averageUtilization } from "@/lib/formulas";
import { formatNumber } from "@/lib/utils";
import { useToast } from "@/components/toast";
import { cn } from "@/lib/utils";

const CHAMBER_COSTS: Record<string, number> = {
  DH: 85000, TC: 95000, HF: 75000, PID: 45000, UV: 120000,
  SaltMist: 55000, SandDust: 40000, MechLoad: 150000, Hail: 60000,
  BDT: 25000, IPTest: 20000,
};

const PIE_COLORS = ["#2563eb", "#7c3aed", "#059669", "#d97706", "#dc2626", "#0891b2", "#be185d", "#4f46e5"];

export default function ChamberCalculator() {
  const { calculationInput, setCalculationInput } = useAppStore();
  const { toast } = useToast();
  const [sensitivityFactor, setSensitivityFactor] = useState(1.0);
  const [showCosts, setShowCosts] = useState(true);
  const [customCosts, setCustomCosts] = useState(CHAMBER_COSTS);

  const adjustedInput = useMemo(() => ({
    ...calculationInput,
    projects: Math.round(calculationInput.projects * sensitivityFactor),
  }), [calculationInput, sensitivityFactor]);

  const results = calculateAllChambers(adjustedInput);
  const activeResults = results.filter((r) => r.chambersRequired > 0);
  const total = totalChambersNeeded(results);
  const avgUtil = averageUtilization(results);

  // Chart data
  const barData = activeResults.map((r) => ({
    name: r.chamberName.length > 15 ? r.chamberType : r.chamberName,
    chambers: r.chambersRequired,
    utilization: r.utilization,
  }));

  const pieData = activeResults.map((r, i) => ({
    name: r.chamberType,
    value: r.totalTestHours,
    color: PIE_COLORS[i % PIE_COLORS.length],
  }));

  // Cost calculations
  const costData = activeResults.map((r) => {
    const cat = r.chamberType.replace(/[0-9]/g, "");
    const unitCost = customCosts[cat] ?? 50000;
    return {
      type: r.chamberType,
      name: r.chamberName,
      count: r.chambersRequired,
      unitCost,
      totalCost: r.chambersRequired * unitCost,
    };
  });
  const grandTotalCost = costData.reduce((s, c) => s + c.totalCost, 0);

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Projects / Year
          </label>
          <input
            type="number"
            min={1}
            value={calculationInput.projects}
            onChange={(e) => setCalculationInput({ projects: Number(e.target.value) || 1 })}
            className="input-field"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            BoMs / Project
          </label>
          <input
            type="number"
            min={1}
            value={calculationInput.boms}
            onChange={(e) => setCalculationInput({ boms: Number(e.target.value) || 1 })}
            className="input-field"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Modules / BoM
          </label>
          <input
            type="number"
            min={1}
            value={calculationInput.modules}
            onChange={(e) => setCalculationInput({ modules: Number(e.target.value) || 1 })}
            className="input-field"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Realisation Rate: {Math.round(calculationInput.realisationRate * 100)}%
          </label>
          <input
            type="range"
            min={30}
            max={95}
            value={Math.round(calculationInput.realisationRate * 100)}
            onChange={(e) => setCalculationInput({ realisationRate: Number(e.target.value) / 100 })}
            className="mt-2 w-full accent-blue-600"
          />
          <div className="mt-1 flex justify-between text-xs text-slate-400">
            <span>30%</span>
            <span>95%</span>
          </div>
        </div>
      </div>

      {/* Sensitivity Analysis */}
      <div className="card bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/10 dark:to-blue-900/10 border-purple-200 dark:border-purple-800">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-purple-900 dark:text-purple-200">
            Sensitivity Analysis
          </h3>
          <span className="text-xs font-medium text-purple-700 dark:text-purple-300">
            Demand multiplier: {sensitivityFactor.toFixed(1)}x
          </span>
        </div>
        <input
          type="range"
          min={50}
          max={200}
          value={sensitivityFactor * 100}
          onChange={(e) => setSensitivityFactor(Number(e.target.value) / 100)}
          className="w-full accent-purple-600"
        />
        <div className="mt-1 flex justify-between text-xs text-purple-600 dark:text-purple-400">
          <span>0.5x (Low)</span>
          <span>1.0x (Baseline)</span>
          <span>2.0x (High)</span>
        </div>
      </div>

      {/* Formula */}
      <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
        <strong>Formula:</strong> Chambers = (Projects &times; BoMs &times; Modules &times; TestHrs) / (Slots &times; WorkHrs &times; RealisationRate)
        &nbsp;|&nbsp; Work Hours = {formatNumber(calculationInput.workHoursPerYear)} hrs/year
        {sensitivityFactor !== 1.0 && (
          <span className="ml-2 text-purple-600 dark:text-purple-400">
            | Effective Projects = {adjustedInput.projects} (x{sensitivityFactor.toFixed(1)})
          </span>
        )}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h3 className="mb-3 text-sm font-semibold text-slate-800 dark:text-slate-200">Chamber Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <defs>
                <linearGradient id="calcBarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} angle={-30} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
              <Tooltip />
              <Bar dataKey="chambers" fill="url(#calcBarGrad)" radius={[6, 6, 0, 0]} animationDuration={1000} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h3 className="mb-3 text-sm font-semibold text-slate-800 dark:text-slate-200">Test Hours Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={2} dataKey="value" animationDuration={1000}>
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: "0.7rem" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Results table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50">
              <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">Chamber</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-300">Slots</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-300">Total Test Hrs</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-300">Chambers</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-300">Utilization</th>
            </tr>
          </thead>
          <tbody>
            {activeResults.map((r) => (
              <tr key={r.chamberType} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">{r.chamberName}</td>
                <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">{r.slots}</td>
                <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">{formatNumber(r.totalTestHours)}</td>
                <td className="px-4 py-3 text-right">
                  <span className="rounded-full bg-blue-50 dark:bg-blue-900/30 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-300">
                    {r.chambersRequired}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                    r.utilization > 85
                      ? "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                      : r.utilization > 65
                      ? "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                      : "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                  )}>
                    {r.utilization}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50">
              <td className="px-4 py-3 font-bold text-slate-900 dark:text-white" colSpan={3}>Total</td>
              <td className="px-4 py-3 text-right">
                <span className="rounded-full bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-0.5 text-sm font-bold text-emerald-700 dark:text-emerald-300">
                  {total}
                </span>
              </td>
              <td className="px-4 py-3 text-right text-sm font-semibold text-slate-600 dark:text-slate-400">{avgUtil}%</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Cost Estimation */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">Cost Estimation</h3>
          <button
            onClick={() => setShowCosts(!showCosts)}
            className="btn-secondary text-xs"
          >
            {showCosts ? "Hide" : "Show"} Details
          </button>
        </div>

        {showCosts && (
          <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <th className="px-4 py-2.5 text-left font-semibold text-slate-700 dark:text-slate-300">Chamber</th>
                  <th className="px-4 py-2.5 text-right font-semibold text-slate-700 dark:text-slate-300">Qty</th>
                  <th className="px-4 py-2.5 text-right font-semibold text-slate-700 dark:text-slate-300">Unit Cost (USD)</th>
                  <th className="px-4 py-2.5 text-right font-semibold text-slate-700 dark:text-slate-300">Total Cost</th>
                </tr>
              </thead>
              <tbody>
                {costData.map((c) => (
                  <tr key={c.type} className="border-b border-slate-100 dark:border-slate-700">
                    <td className="px-4 py-2.5 text-slate-800 dark:text-slate-200">{c.name}</td>
                    <td className="px-4 py-2.5 text-right text-slate-600 dark:text-slate-400">{c.count}</td>
                    <td className="px-4 py-2.5 text-right">
                      <input
                        type="number"
                        value={c.unitCost}
                        onChange={(e) => {
                          const cat = c.type.replace(/[0-9]/g, "");
                          setCustomCosts({ ...customCosts, [cat]: Number(e.target.value) });
                        }}
                        className="w-24 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 py-1 text-right text-sm dark:text-slate-200"
                      />
                    </td>
                    <td className="px-4 py-2.5 text-right font-medium text-slate-900 dark:text-white">
                      ${c.totalCost.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-bold text-slate-900 dark:text-white" colSpan={3}>Grand Total</td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
                      ${grandTotalCost.toLocaleString()}
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
