"use client";

import { FileDown, Printer } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { calculateAllChambers, totalChambersNeeded, averageUtilization } from "@/lib/formulas";
import { formatNumber, exportCSV } from "@/lib/utils";

export default function ExportPage() {
  const { calculationInput, departments, selectedStandard } = useAppStore();
  const results = calculateAllChambers(calculationInput);
  const activeResults = results.filter((r) => r.chambersRequired > 0);
  const total = totalChambersNeeded(results);
  const avgUtil = averageUtilization(results);

  const handleExportCSV = () => {
    const headers = ["Chamber", "Slots", "Total Test Hours", "Chambers Needed", "Utilization %"];
    const rows = activeResults.map((r) => [
      r.chamberName,
      String(r.slots),
      String(r.totalTestHours),
      String(r.chambersRequired),
      String(r.utilization),
    ]);
    rows.push(["TOTAL", "", "", String(total), String(avgUtil)]);
    exportCSV(headers, rows, "pareeksha-chamber-report.csv");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="no-print flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Export Report</h1>
          <p className="mt-1 text-sm text-slate-500">
            Download or print your chamber estimation report
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExportCSV} className="btn-primary">
            <FileDown size={16} /> Export CSV
          </button>
          <button onClick={handlePrint} className="btn-secondary">
            <Printer size={16} /> Print
          </button>
        </div>
      </div>

      {/* Print-friendly report */}
      <div className="card">
        <div className="mb-6 border-b border-slate-200 pb-4">
          <h2 className="text-xl font-bold text-slate-900">Pareeksha - Chamber Estimation Report</h2>
          <p className="mt-1 text-sm text-slate-500">
            Standard: {selectedStandard} | Generated: {new Date().toLocaleDateString("en-IN")}
          </p>
        </div>

        {/* Summary */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg bg-slate-50 p-3 text-center">
            <p className="text-2xl font-bold text-blue-600">{total}</p>
            <p className="text-xs text-slate-500">Total Chambers</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3 text-center">
            <p className="text-2xl font-bold text-emerald-600">{avgUtil}%</p>
            <p className="text-xs text-slate-500">Avg Utilization</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3 text-center">
            <p className="text-2xl font-bold text-amber-600">{activeResults.length}</p>
            <p className="text-xs text-slate-500">Chamber Types</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3 text-center">
            <p className="text-2xl font-bold text-rose-600">{departments.length}</p>
            <p className="text-xs text-slate-500">Departments</p>
          </div>
        </div>

        {/* Inputs */}
        <div className="mb-6">
          <h3 className="mb-2 font-semibold text-slate-800">Input Parameters</h3>
          <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
            <div><span className="text-slate-500">Projects:</span> <strong>{calculationInput.projects}</strong></div>
            <div><span className="text-slate-500">BoMs/Project:</span> <strong>{calculationInput.boms}</strong></div>
            <div><span className="text-slate-500">Modules/BoM:</span> <strong>{calculationInput.modules}</strong></div>
            <div><span className="text-slate-500">Realisation:</span> <strong>{Math.round(calculationInput.realisationRate * 100)}%</strong></div>
          </div>
        </div>

        {/* Results table */}
        <h3 className="mb-2 font-semibold text-slate-800">Chamber Requirements</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="px-3 py-2 text-left font-semibold text-slate-700">Chamber</th>
              <th className="px-3 py-2 text-right font-semibold text-slate-700">Slots</th>
              <th className="px-3 py-2 text-right font-semibold text-slate-700">Test Hours</th>
              <th className="px-3 py-2 text-right font-semibold text-slate-700">Chambers</th>
              <th className="px-3 py-2 text-right font-semibold text-slate-700">Utilization</th>
            </tr>
          </thead>
          <tbody>
            {activeResults.map((r) => (
              <tr key={r.chamberType} className="border-b border-slate-100">
                <td className="px-3 py-2 text-slate-800">{r.chamberName}</td>
                <td className="px-3 py-2 text-right text-slate-600">{r.slots}</td>
                <td className="px-3 py-2 text-right text-slate-600">{formatNumber(r.totalTestHours)}</td>
                <td className="px-3 py-2 text-right font-semibold text-slate-900">{r.chambersRequired}</td>
                <td className="px-3 py-2 text-right text-slate-600">{r.utilization}%</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-slate-300">
              <td className="px-3 py-2 font-bold text-slate-900" colSpan={3}>Total</td>
              <td className="px-3 py-2 text-right font-bold text-slate-900">{total}</td>
              <td className="px-3 py-2 text-right font-bold text-slate-900">{avgUtil}%</td>
            </tr>
          </tfoot>
        </table>

        {/* Departments summary */}
        <h3 className="mb-2 mt-6 font-semibold text-slate-800">Department Demand</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="px-3 py-2 text-left font-semibold text-slate-700">Department</th>
              <th className="px-3 py-2 text-right font-semibold text-slate-700">Projects/yr</th>
              <th className="px-3 py-2 text-right font-semibold text-slate-700">BoMs/proj</th>
              <th className="px-3 py-2 text-right font-semibold text-slate-700">Modules/BoM</th>
              <th className="px-3 py-2 text-right font-semibold text-slate-700">Total Modules</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr key={dept.id} className="border-b border-slate-100">
                <td className="px-3 py-2 text-slate-800">{dept.name}</td>
                <td className="px-3 py-2 text-right text-slate-600">{dept.projectsPerYear}</td>
                <td className="px-3 py-2 text-right text-slate-600">{dept.bomsPerProject}</td>
                <td className="px-3 py-2 text-right text-slate-600">{dept.modulesPerBom}</td>
                <td className="px-3 py-2 text-right font-semibold text-slate-900">
                  {dept.projectsPerYear * dept.bomsPerProject * dept.modulesPerBom}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
