'use client';

import { useState } from 'react';
import { Download, Printer, FileText } from 'lucide-react';
import { CalculationResult } from '@/lib/types';
import { CHAMBERS } from '@/lib/chambers';
import { exportCSV } from '@/lib/utils';

const ALL_COLUMNS = [
  { key: 'chamberType', label: 'Chamber Type' },
  { key: 'chambersNeeded', label: 'Chambers Needed' },
  { key: 'utilizationPct', label: 'Utilization %' },
  { key: 'totalTestHrs', label: 'Total Test Hours' },
  { key: 'bottleneck', label: 'Bottleneck' },
] as const;

type ColumnKey = (typeof ALL_COLUMNS)[number]['key'];

interface ExportPanelProps {
  results: CalculationResult[];
  standardName: string;
}

export default function ExportPanel({ results, standardName }: ExportPanelProps) {
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

  const handleExportCSV = () => {
    const cols = ALL_COLUMNS.filter((c) => selectedColumns.has(c.key));
    const headers = cols.map((c) => c.label);
    const rows = results.map((r) =>
      cols.map((c) => {
        if (c.key === 'chamberType') {
          const ch = CHAMBERS.find((ch) => ch.id === r.chamberType);
          return ch?.name || r.chamberType;
        }
        if (c.key === 'bottleneck') return r.bottleneck ? 'Yes' : 'No';
        return String(r[c.key]);
      })
    );
    exportCSV(headers, rows, `pareeksha-${standardName}-results.csv`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSummary = () => {
    const totalChambers = results.reduce((s, r) => s + r.chambersNeeded, 0);
    const totalHours = results.reduce((s, r) => s + r.totalTestHrs, 0);
    const bottleneck = results.find((r) => r.bottleneck);
    const bnName = bottleneck
      ? CHAMBERS.find((c) => c.id === bottleneck.chamberType)?.name || bottleneck.chamberType
      : 'None';

    const summary = [
      `Pareeksha Chamber Estimation Report`,
      `Standard: ${standardName}`,
      `Date: ${new Date().toLocaleDateString()}`,
      ``,
      `Total Chambers Required: ${totalChambers}`,
      `Total Test Hours: ${totalHours.toLocaleString()}`,
      `Bottleneck Chamber: ${bnName}`,
      ``,
      `Breakdown:`,
      ...results.map((r) => {
        const ch = CHAMBERS.find((c) => c.id === r.chamberType);
        return `  ${ch?.name || r.chamberType}: ${r.chambersNeeded} chambers, ${r.utilizationPct}% utilization, ${r.totalTestHrs.toLocaleString()} hrs`;
      }),
    ].join('\n');

    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pareeksha-summary-${standardName}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Column selection */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-2">Select Columns</h3>
        <div className="flex flex-wrap gap-2">
          {ALL_COLUMNS.map((col) => (
            <button
              key={col.key}
              onClick={() => toggleColumn(col.key)}
              className={`px-3 py-1.5 text-xs rounded-full font-medium transition ${
                selectedColumns.has(col.key)
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {col.label}
            </button>
          ))}
        </div>
      </div>

      {/* Export buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleExportCSV}
          className="btn-primary"
        >
          <Download size={16} />
          Export CSV
        </button>
        <button
          onClick={handlePrint}
          className="btn-secondary"
        >
          <Printer size={16} />
          Print View
        </button>
        <button
          onClick={handleSummary}
          className="btn-secondary"
        >
          <FileText size={16} />
          Download Summary
        </button>
      </div>

      {/* Preview table */}
      {results.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50">
                {ALL_COLUMNS.filter((c) => selectedColumns.has(c.key)).map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-3 text-left font-semibold text-slate-600"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {results.map((r) => (
                <tr key={r.chamberType} className="hover:bg-slate-50 transition">
                  {selectedColumns.has('chamberType') && (
                    <td className="px-4 py-3 font-medium">
                      {CHAMBERS.find((c) => c.id === r.chamberType)?.name || r.chamberType}
                    </td>
                  )}
                  {selectedColumns.has('chambersNeeded') && (
                    <td className="px-4 py-3">{r.chambersNeeded}</td>
                  )}
                  {selectedColumns.has('utilizationPct') && (
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                          r.utilizationPct > 85
                            ? 'bg-red-100 text-red-700'
                            : r.utilizationPct > 65
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {r.utilizationPct}%
                      </span>
                    </td>
                  )}
                  {selectedColumns.has('totalTestHrs') && (
                    <td className="px-4 py-3">{r.totalTestHrs.toLocaleString()}</td>
                  )}
                  {selectedColumns.has('bottleneck') && (
                    <td className="px-4 py-3">
                      {r.bottleneck && (
                        <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          Bottleneck
                        </span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {results.length === 0 && (
        <div className="empty-state">
          <Download size={32} className="text-slate-300 mb-2" />
          <p className="text-sm">No results to export.</p>
          <p className="text-xs mt-1">Run calculations first to generate exportable data.</p>
        </div>
      )}
    </div>
  );
}
