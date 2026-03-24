"use client";

import { useAppStore } from "@/lib/store";
import { CHAMBERS } from "@/lib/chambers";

export default function ReliabilityPlanner() {
  const { selectedStandard, results } = useAppStore();

  const totalChambers = results.reduce((s, r) => s + r.chambersNeeded, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Standard: <strong>{selectedStandard.name}</strong> &mdash; {selectedStandard.testProfiles.length} tests
        </p>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          {totalChambers} chambers total
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Test</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Chamber</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-700">Hours</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-700">Modules</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-700">Chambers</th>
            </tr>
          </thead>
          <tbody>
            {selectedStandard.testProfiles.map((profile) => {
              const chamber = CHAMBERS.find((c) => c.id === profile.chamberType);
              const result = results.find((r) => r.chamberType === profile.chamberType);
              return (
                <tr key={profile.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{profile.id}</td>
                  <td className="px-4 py-3 text-slate-600">{chamber?.name || profile.chamberType}</td>
                  <td className="px-4 py-3 text-right text-slate-600">{profile.durationHrs}</td>
                  <td className="px-4 py-3 text-right text-slate-600">{profile.modulesRequired}</td>
                  <td className="px-4 py-3 text-right">
                    <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                      {result?.chambersNeeded || 0}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-slate-300 bg-slate-50">
              <td className="px-4 py-3 font-bold text-slate-900" colSpan={4}>Total Chambers</td>
              <td className="px-4 py-3 text-right">
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-sm font-bold text-emerald-700">
                  {totalChambers}
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
