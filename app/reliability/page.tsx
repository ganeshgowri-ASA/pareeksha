'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { CHAMBERS } from '@/lib/chambers';
import GanttSchedule from '@/components/gantt-schedule';
import UtilizationGauge from '@/components/utilization-gauge';

export default function ReliabilityPage() {
  const { results, selectedStandard, calculateAll } = useAppStore();

  useEffect(() => {
    calculateAll();
  }, [calculateAll]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Reliability Planner</h1>
        <p className="text-sm text-surface-500 mt-1">
          Test matrix and chamber demand analysis for {selectedStandard.name}
        </p>
      </div>

      {/* Test matrix table */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-surface-200 overflow-x-auto">
        <h2 className="text-lg font-semibold text-surface-800 mb-4">Test Sequence Matrix</h2>
        {selectedStandard.testProfiles.length === 0 ? (
          <div className="empty-state">
            <p className="text-sm">No test profiles defined for this standard.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-50">
                <th className="px-4 py-3 text-left font-semibold text-surface-600">Test Name</th>
                <th className="px-4 py-3 text-left font-semibold text-surface-600">Chamber Type</th>
                <th className="px-4 py-3 text-right font-semibold text-surface-600">Duration (hrs)</th>
                <th className="px-4 py-3 text-right font-semibold text-surface-600">Modules</th>
                <th className="px-4 py-3 text-right font-semibold text-surface-600">FS Slots</th>
                <th className="px-4 py-3 text-right font-semibold text-surface-600">MM Slots</th>
                <th className="px-4 py-3 text-right font-semibold text-surface-600">Chambers Needed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {selectedStandard.testProfiles.map((profile) => {
                const chamber = CHAMBERS.find((c) => c.id === profile.chamberType);
                const result = results.find((r) => r.chamberType === profile.chamberType);
                return (
                  <tr key={profile.id} className="hover:bg-surface-50 transition-smooth">
                    <td className="px-4 py-3 font-medium">{profile.id}</td>
                    <td className="px-4 py-3">{chamber?.name || profile.chamberType}</td>
                    <td className="px-4 py-3 text-right">{profile.durationHrs.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">{profile.modulesRequired}</td>
                    <td className="px-4 py-3 text-right">{chamber?.slotsFS || '-'}</td>
                    <td className="px-4 py-3 text-right">{chamber?.slotsMM || '-'}</td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {result?.chambersNeeded || 0}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-surface-100 font-semibold">
                <td className="px-4 py-3" colSpan={6}>Total Chambers</td>
                <td className="px-4 py-3 text-right">
                  {results.reduce((s, r) => s + r.chambersNeeded, 0)}
                </td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>

      {/* Utilization gauges */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-surface-200">
        <h2 className="text-lg font-semibold text-surface-800 mb-4">Chamber Utilization</h2>
        {results.length === 0 ? (
          <div className="empty-state h-32">
            <p className="text-sm">No utilization data. Run calculations first.</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-8 justify-center">
            {results.map((r) => {
              const chamber = CHAMBERS.find((c) => c.id === r.chamberType);
              return (
                <div key={r.chamberType} className="relative flex flex-col items-center">
                  <UtilizationGauge
                    value={r.utilizationPct}
                    label={chamber?.name || r.chamberType}
                    size={120}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Gantt schedule */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-surface-200">
        <h2 className="text-lg font-semibold text-surface-800 mb-4">Yearly Test Schedule</h2>
        <GanttSchedule results={results} />
      </div>
    </div>
  );
}
