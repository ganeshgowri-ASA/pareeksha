"use client";

import ChamberCalculator from "@/components/chamber-calculator";

export default function CalculatorPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Chamber Calculator</h1>
        <p className="mt-1 text-sm text-slate-500">
          Estimate environmental chamber requirements based on project demand
        </p>
      </div>
      <div className="card">
        <ChamberCalculator />
      </div>
    </div>
  );
}
