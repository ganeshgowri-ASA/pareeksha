"use client";

import { useState } from "react";
import { CalculationResult } from "@/lib/types";
import { exportCSV } from "@/lib/utils";

interface ExportPanelProps {
  results: CalculationResult[];
  title?: string;
}

const ALL_COLUMNS = [
  { key: "chamberType", label: "Chamber Type" },
  { key: "chamberName", label: "Test Name" },
  { key: "totalTestHours", label: "Total Test Hours" },
  { key: "chambersRequired", label: "Chambers Required" },
  { key: "utilization", label: "Utilization %" },
  { key: "slots", label: "Slots/Chamber" },
] as const;

type ColumnKey = (typeof ALL_COLUMNS)[number]["key"];

export function ExportPanel({ results, title = "Chamber Estimation Report" }: ExportPanelProps) {
  const [selectedColumns, setSelectedColumns] = useState<Set<ColumnKey>>(
    new Set(ALL_COLUMNS.map((c) => c.key))
  );

  const toggleColumn = (key: ColumnKey) => {
    setSelectedColumns((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        if (next.size > 1) next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const activeColumns = ALL_COLUMNS.filter((c) => selectedColumns.has(c.key));

  const handleExportCSV = () => {
    const headers = activeColumns.map((c) => c.label);
    const rows = results.map((r) =>
      activeColumns.map((c) => {
        const val = r[c.key];
        return typeof val === "number" ? val.toFixed(c.key === "utilization" ? 1 : 0) : String(val);
      })
    );
    exportCSV(headers, rows, "pareeksha-report.csv");
  };

  const handlePrint = () => {
    window.print();
  };

  if (results.length === 0) {
    return (
      <div className="empty-state">
        <p className="text-lg font-medium">No data to export</p>
        <p className="text-sm mt-1">Run calculations first to generate exportable data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Column selector */}
      <div className="no-print">
        <h3 className="text-sm font-semibold text-slate-600 mb-2">Select Columns</h3>
        <div className="flex flex-wrap gap-2">
          {ALL_COLUMNS.map((col) => (
            <button
              key={col.key}
              onClick={() => toggleColumn(col.key)}
              className={`px-3 py-1.5 text-xs rounded-full border transition-all-smooth focus-ring ${
                selectedColumns.has(col.key)
                  ? "bg-sky-50 border-sky-300 text-sky-700"
                  : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
              }`}
            >
              {col.label}
            </button>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 no-print">
        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-sky-500 text-white text-sm font-medium rounded-lg hover:bg-sky-600 transition-all-smooth focus-ring"
        >
          Download CSV
        </button>
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-all-smooth focus-ring"
        >
          Print View
        </button>
      </div>

      {/* Preview table */}
      <div className="print-no-break">
        <h2 className="text-lg font-semibold text-slate-800 mb-3 hidden print:block">{title}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-slate-200">
                {activeColumns.map((col) => (
                  <th key={col.key} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {results.map((r, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-all-smooth">
                  {activeColumns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-slate-700">
                      {col.key === "utilization"
                        ? `${r.utilization.toFixed(1)}%`
                        : col.key === "totalTestHours"
                        ? r.totalTestHours.toLocaleString()
                        : r[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-300 font-semibold">
                <td className="px-4 py-3 text-slate-800" colSpan={activeColumns.findIndex((c) => c.key === "totalTestHours")}>
                  Totals
                </td>
                {activeColumns.slice(activeColumns.findIndex((c) => c.key === "totalTestHours")).map((col) => (
                  <td key={col.key} className="px-4 py-3 text-slate-800">
                    {col.key === "totalTestHours"
                      ? results.reduce((s, r) => s + r.totalTestHours, 0).toLocaleString()
                      : col.key === "chambersRequired"
                      ? results.reduce((s, r) => s + r.chambersRequired, 0)
                      : col.key === "utilization"
                      ? `${(results.reduce((s, r) => s + r.utilization, 0) / results.length).toFixed(1)}%`
                      : ""}
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
