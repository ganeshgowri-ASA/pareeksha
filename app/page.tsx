"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { ChamberBarChart, TestHoursPieChart } from "@/components/chart-widgets";
import { UtilizationGauge } from "@/components/utilization-gauge";

export default function DashboardPage() {
  const { results, recalculate } = useAppStore();

  useEffect(() => {
    recalculate();
  }, [recalculate]);

  const totalChambers = results.reduce((sum, r) => sum + r.chambersRequired, 0);
  const totalTestHours = results.reduce((sum, r) => sum + r.totalTestHours, 0);
  const avgUtilization =
    results.length > 0 ? results.reduce((sum, r) => sum + r.utilization, 0) / results.length : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 stagger-children">
        <div className="card-hover bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Chambers Required</p>
          <p className="text-3xl font-bold text-slate-800 mt-1">{totalChambers}</p>
        </div>
        <div className="card-hover bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Test Hours</p>
          <p className="text-3xl font-bold text-slate-800 mt-1">{totalTestHours.toLocaleString()}</p>
        </div>
        <div className="card-hover bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <p className="text-sm text-slate-500">Avg Utilization</p>
          <div className="flex items-center gap-4 mt-1">
            <UtilizationGauge value={avgUtilization} size={64} />
            <p className="text-3xl font-bold text-slate-800">{avgUtilization.toFixed(1)}%</p>
          </div>
        </div>
      </div>

      {results.length === 0 ? (
        <div className="empty-state">
          <p className="text-lg font-medium">No results yet</p>
          <p className="text-sm mt-1">Configure departments and standards to see chamber calculations.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-700 mb-4">Chambers by Type</h2>
            <ChamberBarChart results={results} />
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-700 mb-4">Test Hours Distribution</h2>
            <TestHoursPieChart results={results} />
          </div>
        </div>
      )}
    </div>
  );
}
