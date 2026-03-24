"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { STANDARDS_MAP } from "@/lib/standards";
import { CHAMBERS } from "@/lib/chambers";
import type { StandardId } from "@/lib/types";
import { cn } from "@/lib/utils";

const TABS: { id: StandardId; label: string }[] = [
  { id: "IEC", label: "IEC 61215" },
  { id: "MNRE", label: "MNRE ALMM" },
  { id: "REC", label: "REC" },
  { id: "Custom", label: "Custom" },
];

export default function StandardsConfig() {
  const { selectedStandard, setSelectedStandard } = useAppStore();
  const [activeTab, setActiveTab] = useState<StandardId>(selectedStandard);
  const standard = STANDARDS_MAP[activeTab];

  const handleTabClick = (id: StandardId) => {
    setActiveTab(id);
    setSelectedStandard(id);
  };

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={cn(
              "flex-1 rounded-md px-3 py-2 text-sm font-medium transition",
              activeTab === tab.id
                ? "bg-white text-blue-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Standard info */}
      <div className="rounded-lg bg-blue-50 px-4 py-3">
        <h3 className="font-semibold text-blue-900">{standard.name}</h3>
        <p className="mt-0.5 text-sm text-blue-700">{standard.description}</p>
      </div>

      {/* Tests table */}
      {standard.tests.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Test</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Chamber</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-700">Duration (hrs)</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-700">Samples</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Description</th>
              </tr>
            </thead>
            <tbody>
              {standard.tests.map((test) => (
                <tr key={test.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{test.name}</td>
                  <td className="px-4 py-3 text-slate-600">{CHAMBERS.find((c) => c.id === test.chamberType)?.name ?? test.chamberType}</td>
                  <td className="px-4 py-3 text-right text-slate-600">{test.testHours}</td>
                  <td className="px-4 py-3 text-right text-slate-600">{test.samplesRequired}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{test.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-lg border-2 border-dashed border-slate-200 px-6 py-12 text-center">
          <p className="text-sm text-slate-500">
            No tests configured for custom profile. Use the other tabs as a starting point.
          </p>
        </div>
      )}
    </div>
  );
}
