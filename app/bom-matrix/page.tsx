"use client";

import BoMChangeMatrix from "@/components/bom-change-matrix";

export default function BoMMatrixPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">BoM Change Matrix</h1>
        <p className="mt-1 text-sm text-slate-500">
          Map bill-of-material changes to required qualification tests
        </p>
      </div>
      <div className="card">
        <BoMChangeMatrix />
      </div>
    </div>
  );
}
