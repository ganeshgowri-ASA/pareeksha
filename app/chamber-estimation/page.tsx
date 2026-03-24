'use client';

import ChamberEstimation from '@/components/chamber-estimation';

export default function ChamberEstimationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Qualification Chambers Quantity Estimation &amp; Optimization
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Module tests only (no coupons) — 1 slot = 1 full-size module
        </p>
      </div>
      <ChamberEstimation />
    </div>
  );
}
