'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import ExportPanel from '@/components/export-panel';
import ComparisonTable from '@/components/comparison-table';
import { StandardComparisonRadar } from '@/components/chart-widgets';

export default function ExportPage() {
  const { results, selectedStandard, calculateAll } = useAppStore();

  useEffect(() => {
    calculateAll();
  }, [calculateAll]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Export & Reports</h1>
        <p className="text-sm text-surface-500 mt-1">
          Export calculation results and compare standards
        </p>
      </div>

      {/* Export panel */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-surface-200">
        <h2 className="text-lg font-semibold text-surface-800 mb-4">Export Results</h2>
        <ExportPanel results={results} standardName={selectedStandard.name} />
      </div>

      {/* Standards comparison */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-surface-200">
        <h2 className="text-lg font-semibold text-surface-800 mb-4">
          Standards Comparison: IEC vs MNRE vs REC
        </h2>
        <ComparisonTable />
      </div>

      {/* Radar chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-surface-200">
        <h2 className="text-lg font-semibold text-surface-800 mb-4">
          Test Requirements Comparison
        </h2>
        <StandardComparisonRadar />
      </div>
    </div>
  );
}
