'use client';

import { STANDARDS } from '@/lib/standards';
import { CHAMBERS } from '@/lib/chambers';
import { Check, X } from 'lucide-react';

export default function ComparisonTable() {
  const allChamberTypes = Array.from(
    new Set(STANDARDS.flatMap((s) => s.testProfiles.map((p) => p.chamberType)))
  );

  const lookup = new Map<string, Map<string, { durationHrs: number; modulesRequired: number }>>();
  for (const std of STANDARDS) {
    const map = new Map<string, { durationHrs: number; modulesRequired: number }>();
    for (const p of std.testProfiles) {
      map.set(p.chamberType, { durationHrs: p.durationHrs, modulesRequired: p.modulesRequired });
    }
    lookup.set(std.id, map);
  }

  const totals = new Map<string, number>();
  for (const std of STANDARDS) {
    const total = std.testProfiles.reduce((sum, p) => sum + p.durationHrs, 0);
    totals.set(std.id, total);
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50">
            <th className="px-4 py-3 text-left font-semibold text-slate-600 min-w-[140px]">
              Test Type
            </th>
            {STANDARDS.filter((s) => s.id !== 'Custom').map((std) => (
              <th
                key={std.id}
                className="px-4 py-3 text-center font-semibold text-slate-600 min-w-[150px]"
              >
                <div>{std.name}</div>
                <div className="text-xs font-normal text-slate-400 mt-0.5">{std.code}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {allChamberTypes.map((ct) => {
            const chamber = CHAMBERS.find((c) => c.id === ct);
            const chamberName = chamber?.name || ct;

            const stds = STANDARDS.filter((s) => s.id !== 'Custom');
            const values = stds.map((s) => lookup.get(s.id)?.get(ct)?.durationHrs || 0);
            const hasDifference = new Set(values).size > 1;

            return (
              <tr
                key={ct}
                className={`hover:bg-slate-50 transition-all ${
                  hasDifference ? 'bg-amber-50/50' : ''
                }`}
              >
                <td className="px-4 py-3 font-medium text-slate-700">{chamberName}</td>
                {stds.map((std) => {
                  const profile = lookup.get(std.id)?.get(ct);
                  return (
                    <td key={std.id} className="px-4 py-3 text-center">
                      {profile ? (
                        <div className="flex flex-col items-center gap-1">
                          <Check size={16} className="text-emerald-500" />
                          <span className="text-xs text-slate-500">
                            {profile.durationHrs.toLocaleString()} hrs
                          </span>
                          <span className="text-xs text-slate-400">
                            {profile.modulesRequired} modules
                          </span>
                        </div>
                      ) : (
                        <X size={16} className="text-slate-300 mx-auto" />
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="bg-slate-100 font-semibold">
            <td className="px-4 py-3 text-slate-700">Total Test Hours</td>
            {STANDARDS.filter((s) => s.id !== 'Custom').map((std) => (
              <td key={std.id} className="px-4 py-3 text-center text-slate-700">
                {(totals.get(std.id) || 0).toLocaleString()} hrs
              </td>
            ))}
          </tr>
          <tr className="bg-slate-100">
            <td className="px-4 py-3 text-slate-600 text-xs">Tests Required</td>
            {STANDARDS.filter((s) => s.id !== 'Custom').map((std) => (
              <td key={std.id} className="px-4 py-3 text-center text-slate-600 text-xs">
                {std.testProfiles.length} tests
              </td>
            ))}
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
