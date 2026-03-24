'use client';

import { STANDARDS } from '@/lib/standards';
import { CHAMBERS, getChamber } from '@/lib/chambers';
import { ChamberTypeId } from '@/lib/types';
import { Check, X } from 'lucide-react';

interface TestProfile {
  chamberType: ChamberTypeId;
  durationHrs: number;
  modulesRequired: number;
}

/** Extract flat test profiles from a standard's sequences */
function getTestProfiles(standard: typeof STANDARDS[number]): TestProfile[] {
  const profiles: TestProfile[] = [];
  for (const seq of standard.sequences) {
    for (const test of seq.tests) {
      const chamber = getChamber(test.chamberTypeId);
      profiles.push({
        chamberType: test.chamberTypeId,
        durationHrs: chamber?.testDurationHrs ?? 0,
        modulesRequired: test.modulesRequired,
      });
    }
  }
  return profiles;
}

export default function ComparisonTable() {
  const standardProfiles = STANDARDS.map((s) => ({
    ...s,
    profiles: getTestProfiles(s),
  }));

  // Collect all unique chamber types across all standards
  const allChamberTypes = Array.from(
    new Set(standardProfiles.flatMap((s) => s.profiles.map((p) => p.chamberType)))
  );

  // Build lookup: standard -> chamberType -> profile
  const lookup = new Map<string, Map<string, TestProfile>>();
  for (const std of standardProfiles) {
    const map = new Map<string, TestProfile>();
    for (const p of std.profiles) {
      map.set(p.chamberType, p);
    }
    lookup.set(std.id, map);
  }

  // Calculate totals
  const totals = new Map<string, number>();
  for (const std of standardProfiles) {
    const total = std.profiles.reduce((sum, p) => sum + p.durationHrs, 0);
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
            {standardProfiles.map((std) => (
              <th
                key={std.id}
                className="px-4 py-3 text-center font-semibold text-slate-600 min-w-[150px]"
              >
                <div>{std.name}</div>
                <div className="text-xs font-normal text-slate-400 mt-0.5">{std.id}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {allChamberTypes.map((ct) => {
            const chamber = CHAMBERS.find((c) => c.id === ct);
            const chamberName = chamber?.name || ct;

            const values = standardProfiles.map((s) => lookup.get(s.id)?.get(ct)?.durationHrs || 0);
            const hasDifference = new Set(values).size > 1;

            return (
              <tr
                key={ct}
                className={`hover:bg-slate-50 transition-all ${
                  hasDifference ? 'bg-amber-50/50' : ''
                }`}
              >
                <td className="px-4 py-3 font-medium text-slate-700">{chamberName}</td>
                {standardProfiles.map((std) => {
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
            {standardProfiles.map((std) => (
              <td key={std.id} className="px-4 py-3 text-center text-slate-700">
                {(totals.get(std.id) || 0).toLocaleString()} hrs
              </td>
            ))}
          </tr>
          <tr className="bg-slate-100">
            <td className="px-4 py-3 text-slate-600 text-xs">Tests Required</td>
            {standardProfiles.map((std) => (
              <td key={std.id} className="px-4 py-3 text-center text-slate-600 text-xs">
                {std.profiles.length} tests
              </td>
            ))}
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
