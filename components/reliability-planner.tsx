"use client";

import { useState } from "react";
import { STANDARDS_MAP } from "@/lib/standards";
import { CHAMBERS } from "@/lib/chambers";
import { useAppStore } from "@/lib/store";
import type { ReliabilityTest } from "@/lib/types";

export default function ReliabilityPlanner() {
  const { selectedStandard, calculationInput } = useAppStore();
  const standard = STANDARDS_MAP[selectedStandard] ?? STANDARDS_MAP.IEC;

  const [tests, setTests] = useState<ReliabilityTest[]>(() =>
    standard.tests.map((t) => ({
      id: t.id,
      name: t.name,
      chamberType: t.chamberType,
      testHours: t.testHours,
      samplesRequired: t.samplesRequired,
      annualDemand: 4,
      chambersNeeded: 0,
    }))
  );

  // Recalculate chambers for each test
  const computedTests = tests.map((t) => {
    const chamber = CHAMBERS.find((c) => c.id === t.chamberType);
    if (!chamber) return { ...t, chambersNeeded: 0 };
    const totalHours = t.annualDemand * t.samplesRequired * t.testHours;
    const capacity =
      chamber.slots * calculationInput.workHoursPerYear * calculationInput.realisationRate;
    const needed = capacity > 0 ? Math.ceil(totalHours / capacity) : 0;
    return { ...t, chambersNeeded: needed };
  });

  const totalChambers = computedTests.reduce((s, t) => s + t.chambersNeeded, 0);

  const updateDemand = (id: string, value: number) => {
    setTests((prev) =>
      prev.map((t) => (t.id === id ? { ...t, annualDemand: value } : t))
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Standard: <strong>{standard.name}</strong> &mdash; {computedTests.length} tests
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
              <th className="px-4 py-3 text-right font-semibold text-slate-700">Samples</th>
              <th className="px-4 py-3 text-center font-semibold text-slate-700">Annual Demand</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-700">Chambers</th>
            </tr>
          </thead>
          <tbody>
            {computedTests.map((t) => (
              <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-800">{t.name}</td>
                <td className="px-4 py-3 text-slate-600">{CHAMBERS.find((c) => c.id === t.chamberType)?.name ?? t.chamberType}</td>
                <td className="px-4 py-3 text-right text-slate-600">{t.testHours}</td>
                <td className="px-4 py-3 text-right text-slate-600">{t.samplesRequired}</td>
                <td className="px-4 py-3 text-center">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={t.annualDemand}
                    onChange={(e) =>
                      updateDemand(t.id, Math.max(0, Number(e.target.value)))
                    }
                    className="w-20 rounded border border-slate-300 px-2 py-1 text-center text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                    {t.chambersNeeded}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-slate-300 bg-slate-50">
              <td className="px-4 py-3 font-bold text-slate-900" colSpan={5}>Total Chambers</td>
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
