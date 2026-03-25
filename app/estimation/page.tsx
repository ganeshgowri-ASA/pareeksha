"use client";

import ChamberEstimation from "@/components/chamber-estimation";

export default function EstimationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Chamber Estimation</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Estimate chamber requirements, costs, and optimization based on IEC 62915 BoM changes
        </p>
      </div>
      <div className="card">
        <ChamberEstimation />
      </div>
    </div>
  );
}
