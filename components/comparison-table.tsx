'use client';

import { STANDARDS } from '@/lib/standards';
import { CHAMBERS } from '@/lib/chambers';
import { Check, X } from 'lucide-react';

export default function ComparisonTable() {
  // Collect all unique chamber types across all standards
  const allChamberTypes = Array.from(
    new Set(STANDARDS.flatMap((s) => s.testProfiles.map((p) => p.chamberType)))
  );

  // Build lookup: standard -> chamberType -> profile
  const lookup = new Map<string, Map<string, { durationHrs: number; modulesRequired: number }>>();
  for (const std of STANDARDS) {
    const map = new Map<string, { durationHrs: number; modulesRequired: number }>();
    for (const p of std.testProfiles) {
      map.set(p.chamberType, { durationHrs: p.durationHrs, modulesRequired: p.modulesRequired });
    }
    lookup.set(std.id, map);
  }

  // Calculate totals
  const totals = new Map<string, number>();
  for (const std of STANDARDS) {
    const total = std.testProfiles.reduce((sum, p) => sum + p.durationHrs, 0);
    totals.set(std.id, total);
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-surface-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-surface-50">
            <th className="px-4 py-3 text-left font-semibold text-surface-600 min-w-[140px]">
              Test Type
            </th>
            {STANDARDS.map((std) => (
              <th
                key={std.id}
                className="px-4 py-3 text-center font-semibold text-surface-600 min-w-[150px]"
              >
                <div>{std.name}</div>
                <div className="text-xs font-normal text-surface-400 mt-0.5">{std.code}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-100">
          {allChamberTypes.map((ct) => {
            const chamber = CHAMBERS.find((c) => c.id === ct);
            const chamberName = chamber?.name || ct;

            // Check if there are differences across standards
            const values = STANDARDS.map((s) => lookup.get(s.id)?.get(ct)?.durationHrs || 0);
            const hasDifference = new Set(values).size > 1;

            return (
              <tr
                key={ct}
                className={`hover:bg-surface-50 transition-smooth ${
                  hasDifference ? 'bg-amber-50/50' : ''
                }`}
              >
                <td className="px-4 py-3 font-medium text-surface-700">{chamberName}</td>
                {STANDARDS.map((std) => {
                  const profile = lookup.get(std.id)?.get(ct);
                  return (
                    <td key={std.id} className="px-4 py-3 text-center">
                      {profile ? (
                        <div className="flex flex-col items-center gap-1">
                          <Check size={16} className="text-emerald-500" />
                          <span className="text-xs text-surface-500">
                            {profile.durationHrs.toLocaleString()} hrs
                          </span>
                          <span className="text-xs text-surface-400">
                            {profile.modulesRequired} modules
                          </span>
                        </div>
                      ) : (
                        <X size={16} className="text-surface-300 mx-auto" />
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="bg-surface-100 font-semibold">
            <td className="px-4 py-3 text-surface-700">Total Test Hours</td>
            {STANDARDS.map((std) => (
              <td key={std.id} className="px-4 py-3 text-center text-surface-700">
                {(totals.get(std.id) || 0).toLocaleString()} hrs
              </td>
            ))}
          </tr>
          <tr className="bg-surface-100">
            <td className="px-4 py-3 text-surface-600 text-xs">Tests Required</td>
            {STANDARDS.map((std) => (
              <td key={std.id} className="px-4 py-3 text-center text-surface-600 text-xs">
                {std.testProfiles.length} tests
              </td>
            ))}
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
