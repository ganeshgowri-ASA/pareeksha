'use client';

import { CalculationResult } from '@/lib/types';
import { CHAMBERS, WORK_HRS_PER_YEAR } from '@/lib/chambers';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const CHAMBER_COLORS: Record<string, string> = {
  DH: 'bg-blue-500',
  TC: 'bg-emerald-500',
  HF: 'bg-cyan-500',
  PID: 'bg-purple-500',
  UV: 'bg-amber-500',
  SM: 'bg-rose-500',
  ML: 'bg-indigo-500',
  Hail: 'bg-orange-500',
  BDT: 'bg-teal-500',
  IP: 'bg-pink-500',
};

interface GanttScheduleProps {
  results: CalculationResult[];
}

export default function GanttSchedule({ results }: GanttScheduleProps) {
  if (results.length === 0) {
    return (
      <div className="empty-state h-48">
        <p className="text-sm">No schedule data available.</p>
        <p className="text-xs mt-1">Run calculations to see the test schedule.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Header */}
        <div className="grid grid-cols-[160px_repeat(12,1fr)] gap-px bg-surface-200 rounded-t-lg">
          <div className="bg-surface-100 p-2 text-xs font-semibold text-surface-600">
            Chamber Type
          </div>
          {MONTHS.map((m) => (
            <div key={m} className="bg-surface-100 p-2 text-xs font-semibold text-surface-600 text-center">
              {m}
            </div>
          ))}
        </div>

        {/* Rows */}
        {results.map((result) => {
          const chamber = CHAMBERS.find((c) => c.id === result.chamberType);
          if (!chamber) return null;

          // Calculate which months are occupied based on utilization
          const monthsOccupied = Math.round((result.totalTestHrs / WORK_HRS_PER_YEAR) * 12);
          const occupiedMonths = Math.min(monthsOccupied, 12);
          const colorClass = CHAMBER_COLORS[result.chamberType] || 'bg-gray-500';

          return (
            <div
              key={result.chamberType}
              className="grid grid-cols-[160px_repeat(12,1fr)] gap-px bg-surface-200"
            >
              <div className="bg-white p-2 text-sm font-medium text-surface-700 flex items-center">
                {chamber.name}
                <span className="ml-auto text-xs text-surface-400">
                  x{result.chambersNeeded}
                </span>
              </div>
              {MONTHS.map((_, monthIdx) => {
                const isOccupied = monthIdx < occupiedMonths;
                return (
                  <div
                    key={monthIdx}
                    className="bg-white p-1 flex items-center justify-center"
                  >
                    {isOccupied && (
                      <div
                        className={`${colorClass} rounded h-6 w-full opacity-80 hover:opacity-100 transition-opacity cursor-default`}
                        title={`${chamber.name}: ${Math.round(result.totalTestHrs / 12)} hrs/month`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* Legend */}
        <div className="bg-white p-3 rounded-b-lg border-t border-surface-200">
          <div className="flex flex-wrap gap-3">
            {results.map((r) => {
              const chamber = CHAMBERS.find((c) => c.id === r.chamberType);
              const colorClass = CHAMBER_COLORS[r.chamberType] || 'bg-gray-500';
              return (
                <div key={r.chamberType} className="flex items-center gap-1.5 text-xs">
                  <div className={`w-3 h-3 rounded-sm ${colorClass}`} />
                  <span className="text-surface-600">{chamber?.name || r.chamberType}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
