'use client';

import StandardsConfig from '@/components/standards-config';
import ComparisonTable from '@/components/comparison-table';

export default function StandardsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Standards Configurator</h1>
        <p className="text-sm text-surface-500 mt-1">
          Configure test profiles for IEC, MNRE, and REC standards
        </p>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-surface-200">
        <StandardsConfig />
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-surface-200">
        <h2 className="text-lg font-semibold text-surface-800 mb-4">Standards Comparison</h2>
        <ComparisonTable />
      </div>
    </div>
  );
}
