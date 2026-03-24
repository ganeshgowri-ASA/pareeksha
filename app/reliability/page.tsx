"use client";

import ReliabilityPlanner from "@/components/reliability-planner";

export default function ReliabilityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reliability Planner</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Plan annual test demand and auto-calculate chamber requirements per test
        </p>
      </div>
      <div className="card">
        <ReliabilityPlanner />
      </div>
    </div>
  );
}
