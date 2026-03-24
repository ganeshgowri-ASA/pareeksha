'use client';

import { useEffect, useState } from 'react';
import { Boxes, Gauge, AlertTriangle, FolderOpen } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { CHAMBERS } from '@/lib/chambers';
import { StatCard, SkeletonCard } from '@/components/dashboard-cards';
import { ChamberBarChart, TestHoursPieChart, UtilizationBarChart } from '@/components/chart-widgets';

export default function DashboardPage() {
  const { results, departments, calculateAll } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    calculateAll();
    setLoading(false);
  }, [calculateAll]);

  const totalChambers = results.reduce((s, r) => s + r.chambersNeeded, 0);
  const avgUtilization = results.length > 0
    ? Math.round(results.reduce((s, r) => s + r.utilizationPct, 0) / results.length)
    : 0;
  const bottleneck = results.find((r) => r.bottleneck);
  const bottleneckName = bottleneck
    ? CHAMBERS.find((c) => c.id === bottleneck.chamberType)?.name || bottleneck.chamberType
    : 'None';
  const totalProjects = departments.reduce((s, d) => s + d.projectsPerYear, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Dashboard</h1>
        <p className="text-sm text-surface-500 mt-1">
          Chamber estimation overview across all departments
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <StatCard
              title="Total Chambers"
              value={totalChambers}
              subtitle="Across all types"
              icon={Boxes}
              color="blue"
            />
            <StatCard
              title="Avg Utilization"
              value={`${avgUtilization}%`}
              subtitle="Chamber usage rate"
              icon={Gauge}
              color="green"
            />
            <StatCard
              title="Bottleneck"
              value={bottleneckName}
              subtitle="Highest demand chamber"
              icon={AlertTriangle}
              color="red"
            />
            <StatCard
              title="Active Projects"
              value={totalProjects}
              subtitle={`${departments.length} departments`}
              icon={FolderOpen}
              color="purple"
            />
          </>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-surface-200">
          <h2 className="text-lg font-semibold text-surface-800 mb-4">Chambers by Type</h2>
          <ChamberBarChart results={results} />
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-surface-200">
          <h2 className="text-lg font-semibold text-surface-800 mb-4">Test Hours Distribution</h2>
          <TestHoursPieChart results={results} />
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-surface-200">
        <h2 className="text-lg font-semibold text-surface-800 mb-4">Chamber Utilization</h2>
        <UtilizationBarChart results={results} />
      </div>
    </div>
  );
}
