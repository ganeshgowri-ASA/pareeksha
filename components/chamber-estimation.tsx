"use client";

import { useState, useMemo, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { CHAMBERS, getChamber, DEFAULT_WORK_HOURS_PER_YEAR, DEFAULT_REALISATION_RATE } from "@/lib/chambers";
import { getStandard } from "@/lib/standards";
import { cn } from "@/lib/utils";
import type { ChamberTypeId, ChamberCategory, IEC62915Edition } from "@/lib/types";

const CHAMBER_COSTS: Record<string, number> = {
  DH: 85000, TC: 95000, HF: 75000, PID: 45000, UV: 120000,
  SaltMist: 60000, SandDust: 40000, MechLoad: 150000, DynMechLoad: 180000,
  Hail: 35000, BDT: 25000, IPTest: 30000, HotSpot: 20000, ReverseCurrentOverload: 15000,
};

const CATEGORY_LABELS: Record<string, string> = {
  DH: "Damp Heat", TC: "Thermal Cycling", HF: "Humidity Freeze",
  PID: "PID", UV: "UV Exposure", SaltMist: "Salt Mist",
  SandDust: "Sand & Dust", MechLoad: "Mechanical Load",
  DynMechLoad: "Dynamic Mech Load", Hail: "Hail Impact",
  BDT: "Bypass Diode", IPTest: "IP Rating",
  HotSpot: "Hot Spot", ReverseCurrentOverload: "Reverse Current",
};

interface EstimationRow {
  chamberType: ChamberTypeId;
  chamberName: string;
  category: ChamberCategory;
  slots: number;
  testDurationHrs: number;
  totalTestHrs: number;
  chambersNeeded: number;
  utilization: number;
  estimatedCost: number;
}

export default function ChamberEstimation() {
  const { selectedStandard, bomChanges, calculationInput } = useAppStore();
  const [edition, setEdition] = useState<IEC62915Edition>("2023");
  const [mounted, setMounted] = useState(false);
  const [optimizeMode, setOptimizeMode] = useState<"cost" | "utilization" | "time">("utilization");

  useEffect(() => setMounted(true), []);

  const standard = getStandard(selectedStandard);
  const { projects, boms, modules, realisationRate, workHoursPerYear } = calculationInput;

  const selectedBomChanges = bomChanges.filter((bc) => bc.selected);

  const requiredChamberIds = useMemo(() => {
    const ids = new Set<ChamberTypeId>();
    selectedBomChanges.forEach((bc) => {
      const chambers = standard.bomTestMapping[bc.component] ?? [];
      chambers.forEach((c) => ids.add(c));
    });
    return ids;
  }, [selectedBomChanges, standard]);

  const estimationRows: EstimationRow[] = useMemo(() => {
    return CHAMBERS.filter((ch) => requiredChamberIds.has(ch.id)).map((ch) => {
      const totalTestHrs = projects * boms * modules * ch.testDurationHrs;
      const slots = ch.slotsFullSize;
      const denom = slots * workHoursPerYear * realisationRate;
      const raw = denom > 0 ? totalTestHrs / denom : 0;
      const chambersNeeded = Math.ceil(raw);
      const capacity = chambersNeeded * slots * workHoursPerYear * realisationRate;
      const utilization = capacity > 0 ? Math.round((totalTestHrs / capacity) * 1000) / 10 : 0;
      const costPerUnit = CHAMBER_COSTS[ch.category] ?? 50000;
      return {
        chamberType: ch.id,
        chamberName: ch.name,
        category: ch.category,
        slots,
        testDurationHrs: ch.testDurationHrs,
        totalTestHrs,
        chambersNeeded,
        utilization,
        estimatedCost: chambersNeeded * costPerUnit,
      };
    });
  }, [requiredChamberIds, projects, boms, modules, realisationRate, workHoursPerYear]);

  const sortedRows = useMemo(() => {
    const rows = [...estimationRows];
    if (optimizeMode === "cost") rows.sort((a, b) => b.estimatedCost - a.estimatedCost);
    else if (optimizeMode === "utilization") rows.sort((a, b) => b.utilization - a.utilization);
    else rows.sort((a, b) => b.totalTestHrs - a.totalTestHrs);
    return rows;
  }, [estimationRows, optimizeMode]);

  const totalChambers = estimationRows.reduce((s, r) => s + r.chambersNeeded, 0);
  const totalCost = estimationRows.reduce((s, r) => s + r.estimatedCost, 0);
  const totalTestHours = estimationRows.reduce((s, r) => s + r.totalTestHrs, 0);
  const avgUtilization = estimationRows.length > 0
    ? Math.round(estimationRows.reduce((s, r) => s + r.utilization, 0) / estimationRows.length)
    : 0;
  const bottleneck = estimationRows.reduce<EstimationRow | null>(
    (prev, curr) => (!prev || curr.utilization > prev.utilization ? curr : prev), null
  );

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      {/* Header controls */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Chamber estimation based on selected BoM changes &amp; test requirements
        </p>
        <div className="flex items-center gap-3">
          <div className="flex gap-1 rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5">
            {(["2018", "2023"] as IEC62915Edition[]).map((ed) => (
              <button
                key={ed}
                onClick={() => setEdition(ed)}
                className={cn(
                  "rounded-md px-3 py-1 text-xs font-medium transition-all",
                  edition === ed
                    ? "bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-sm"
                    : "text-slate-500 dark:text-slate-400"
                )}
              >
                IEC 62915:{ed}
              </button>
            ))}
          </div>
          <select
            value={optimizeMode}
            onChange={(e) => setOptimizeMode(e.target.value as "cost" | "utilization" | "time")}
            className="rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-xs"
          >
            <option value="utilization">Sort: Utilization</option>
            <option value="cost">Sort: Cost</option>
            <option value="time">Sort: Test Hours</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      {estimationRows.length > 0 ? (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3 text-center">
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{totalChambers}</p>
              <p className="text-xs text-blue-600 dark:text-blue-400">Total Chambers</p>
            </div>
            <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-3 text-center">
              <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{avgUtilization}%</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400">Avg Utilization</p>
            </div>
            <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-3 text-center">
              <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{totalTestHours.toLocaleString()}</p>
              <p className="text-xs text-amber-600 dark:text-amber-400">Total Test Hours</p>
            </div>
            <div className="rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 p-3 text-center">
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">${(totalCost / 1000).toFixed(0)}K</p>
              <p className="text-xs text-purple-600 dark:text-purple-400">Est. CAPEX</p>
            </div>
            <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 text-center">
              <p className="text-lg font-bold text-red-700 dark:text-red-300 truncate">{bottleneck?.chamberName ?? "—"}</p>
              <p className="text-xs text-red-600 dark:text-red-400">Bottleneck</p>
            </div>
          </div>

          {/* Estimation Table */}
          <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">Chamber</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">Category</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-300">Slots</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-300">Test Hrs/Unit</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-300">Total Hrs</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-300">Chambers</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-300">Utilization</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-300">Est. Cost</th>
                </tr>
              </thead>
              <tbody>
                {sortedRows.map((row) => (
                  <tr
                    key={row.chamberType}
                    className={cn(
                      "border-b border-slate-100 dark:border-slate-700 transition-colors",
                      row.utilization >= 90
                        ? "bg-red-50/50 dark:bg-red-900/10"
                        : row.utilization >= 70
                        ? "bg-amber-50/30 dark:bg-amber-900/10"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/30"
                    )}
                  >
                    <td className="px-4 py-2.5 font-medium text-slate-800 dark:text-slate-200">{row.chamberName}</td>
                    <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">
                      <span className="rounded px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-800">
                        {CATEGORY_LABELS[row.category] ?? row.category}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right text-slate-600 dark:text-slate-400">{row.slots}</td>
                    <td className="px-4 py-2.5 text-right text-slate-600 dark:text-slate-400">{row.testDurationHrs.toLocaleString()}</td>
                    <td className="px-4 py-2.5 text-right text-slate-600 dark:text-slate-400">{row.totalTestHrs.toLocaleString()}</td>
                    <td className="px-4 py-2.5 text-right font-semibold text-slate-800 dark:text-slate-200">{row.chambersNeeded}</td>
                    <td className="px-4 py-2.5 text-right">
                      <span className={cn(
                        "rounded px-2 py-0.5 text-xs font-medium",
                        row.utilization >= 90 ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                          : row.utilization >= 70 ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                          : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                      )}>
                        {row.utilization}%
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right text-slate-600 dark:text-slate-400">${row.estimatedCost.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50 dark:bg-slate-800/50 font-semibold">
                  <td className="px-4 py-2.5 text-slate-800 dark:text-slate-200" colSpan={5}>Total</td>
                  <td className="px-4 py-2.5 text-right text-slate-800 dark:text-slate-200">{totalChambers}</td>
                  <td className="px-4 py-2.5 text-right text-slate-800 dark:text-slate-200">{avgUtilization}%</td>
                  <td className="px-4 py-2.5 text-right text-slate-800 dark:text-slate-200">${totalCost.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </>
      ) : (
        <div className="rounded-lg border border-dashed border-slate-300 dark:border-slate-600 p-8 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No BoM changes selected. Go to the BoM Change Matrix tab to select components for estimation.
          </p>
        </div>
      )}
    </div>
  );
}
