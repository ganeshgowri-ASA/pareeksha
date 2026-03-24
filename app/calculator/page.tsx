'use client';

import ChamberCalculator from '@/components/chamber-calculator';

export default function CalculatorPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Chamber Calculator</h1>
        <p className="text-sm text-surface-500 mt-1">
          Calculate chamber requirements based on project parameters
        </p>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-surface-200">
        <ChamberCalculator />
      </div>
    </div>
  );
}
