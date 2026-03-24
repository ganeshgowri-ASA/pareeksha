"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle, Info, ChevronDown, ChevronUp } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { getStandard, BOM_COMPONENT_INFO, BOM_CATEGORIES, getComponentsByEdition } from "@/lib/standards";
import { getChamber } from "@/lib/chambers";
import type { BoMComponent, BoMCategory, ChangeType, ChamberTypeId, IEC62915Edition } from "@/lib/types";
import { cn } from "@/lib/utils";

const CHANGE_TYPES: ChangeType[] = [
  "NewSupplier", "MaterialChange", "NewFactory",
  "DesignChange", "BOMUpgrade", "Requalification",
  "ThicknessChange", "DimensionChange", "ProcessChange",
];

const CHANGE_LABELS: Record<ChangeType, string> = {
  NewSupplier: "New Supplier",
  MaterialChange: "Material Change",
  NewFactory: "New Factory",
  DesignChange: "Design Change",
  BOMUpgrade: "BOM Upgrade",
  Requalification: "Requalification",
  ThicknessChange: "Thickness Change",
  DimensionChange: "Dimension Change",
  ProcessChange: "Process Change",
};

const SEVERITY: Record<ChangeType, { level: "low" | "medium" | "high"; color: string; label: string }> = {
  NewSupplier: { level: "medium", color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300", label: "Medium" },
  MaterialChange: { level: "high", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300", label: "High" },
  NewFactory: { level: "medium", color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300", label: "Medium" },
  DesignChange: { level: "high", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300", label: "High" },
  BOMUpgrade: { level: "medium", color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300", label: "Medium" },
  Requalification: { level: "high", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300", label: "High" },
  ThicknessChange: { level: "medium", color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300", label: "Medium" },
  DimensionChange: { level: "medium", color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300", label: "Medium" },
  ProcessChange: { level: "low", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300", label: "Low" },
};

const CATEGORY_COLORS: Record<BoMCategory, string> = {
  Frontsheet: "bg-sky-50 dark:bg-sky-900/10 border-sky-200 dark:border-sky-800",
  Encapsulation: "bg-violet-50 dark:bg-violet-900/10 border-violet-200 dark:border-violet-800",
  CellAssembly: "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800",
  Backside: "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800",
  Electrical: "bg-rose-50 dark:bg-rose-900/10 border-rose-200 dark:border-rose-800",
  Mechanical: "bg-slate-50 dark:bg-slate-900/10 border-slate-200 dark:border-slate-700",
  DesignLayout: "bg-indigo-50 dark:bg-indigo-900/10 border-indigo-200 dark:border-indigo-800",
};

export default function BoMChangeMatrix() {
  const { bomChanges, toggleBoMChange, selectedStandard } = useAppStore();
  const [showSequences, setShowSequences] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [editionFilter, setEditionFilter] = useState<IEC62915Edition | 'all'>('all');

  useEffect(() => setMounted(true), []);

  const standard = getStandard(selectedStandard);

  // Filter components by edition if applicable
  const visibleComponents: BoMComponent[] = editionFilter === 'all'
    ? BOM_COMPONENT_INFO.map((c) => c.id)
    : getComponentsByEdition(editionFilter).map((c) => c.id);

  const isSelected = (component: BoMComponent, changeType: ChangeType) =>
    bomChanges.find(
      (bc) => bc.component === component && bc.changeType === changeType
    )?.selected ?? false;

  const selectedCount = bomChanges.filter((bc) => bc.selected).length;

  // Determine required tests from selected BoM changes
  const selectedComponents = new Set<BoMComponent>();
  const requiredChamberIds = new Set<ChamberTypeId>();
  bomChanges.filter((bc) => bc.selected).forEach((bc) => {
    selectedComponents.add(bc.component);
    const chambers = standard.bomTestMapping[bc.component] ?? [];
    chambers.forEach((c) => requiredChamberIds.add(c));
  });

  const requiredTests = standard.tests.filter((t) =>
    requiredChamberIds.has(t.chamberType)
  );

  const totalTestHours = requiredTests.reduce((s, t) => s + t.testHours, 0);
  const totalSamples = requiredTests.reduce((s, t) => s + t.samplesRequired, 0);

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Select BoM changes that require qualification testing
        </p>
        <div className="flex items-center gap-3">
          {/* Edition filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Edition:</span>
            <div className="flex gap-0.5 rounded-md bg-slate-100 dark:bg-slate-800 p-0.5">
              {(['all', '2018', '2023'] as const).map((ed) => (
                <button
                  key={ed}
                  onClick={() => setEditionFilter(ed)}
                  className={cn(
                    "rounded px-2 py-1 text-[11px] font-medium transition-all",
                    editionFilter === ed
                      ? "bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-800"
                  )}
                >
                  {ed === 'all' ? 'All' : ed}
                </button>
              ))}
            </div>
          </div>
          {/* Severity legend */}
          <div className="hidden sm:flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 rounded px-2 py-0.5 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
              <AlertTriangle size={10} /> High
            </span>
            <span className="flex items-center gap-1 rounded px-2 py-0.5 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
              <Info size={10} /> Medium
            </span>
          </div>
          <span className="rounded-full bg-blue-50 dark:bg-blue-900/30 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
            {selectedCount} selected
          </span>
        </div>
      </div>

      {/* Matrix Table - Grouped by Category */}
      <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50">
              <th className="sticky left-0 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300 z-10">
                Component
              </th>
              {CHANGE_TYPES.map((ct) => (
                <th key={ct} className="px-3 py-3 text-center font-semibold text-slate-700 dark:text-slate-300">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs">{CHANGE_LABELS[ct]}</span>
                    <span className={cn("text-[10px] rounded px-1.5 py-0.5", SEVERITY[ct].color)}>
                      {SEVERITY[ct].label}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BOM_CATEGORIES.map((category) => {
              const categoryComponents = BOM_COMPONENT_INFO
                .filter((c) => c.category === category && visibleComponents.includes(c.id));
              if (categoryComponents.length === 0) return null;
              return [
                <tr key={`cat-${category}`} className={cn("border-b", CATEGORY_COLORS[category])}>
                  <td colSpan={CHANGE_TYPES.length + 1} className="px-4 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    {category}
                  </td>
                </tr>,
                ...categoryComponents.map((compInfo) => {
                  const comp = compInfo.id;
                  const compSelected = bomChanges.some(
                    (bc) => bc.component === comp && bc.selected
                  );
                  return (
                    <tr
                      key={comp}
                      className={cn(
                        "border-b border-slate-100 dark:border-slate-700 transition-colors",
                        compSelected
                          ? "bg-blue-50/50 dark:bg-blue-900/10"
                          : "hover:bg-slate-50 dark:hover:bg-slate-800/30"
                      )}
                    >
                      <td className={cn(
                        "sticky left-0 px-4 py-3 font-medium z-10",
                        compSelected
                          ? "bg-blue-50/50 dark:bg-blue-900/10 text-blue-900 dark:text-blue-200"
                          : "bg-white dark:bg-slate-800/50 text-slate-800 dark:text-slate-200"
                      )}>
                        <div className="flex items-center gap-2">
                          {compSelected && <CheckCircle size={14} className="text-blue-500" />}
                          <span>{compInfo.name}</span>
                          {!compInfo.in2018 && (
                            <span className="text-[9px] rounded bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 px-1 py-0.5">
                              2023+
                            </span>
                          )}
                        </div>
                      </td>
                      {CHANGE_TYPES.map((ct) => (
                        <td key={ct} className="px-3 py-3 text-center">
                          <label className="inline-flex cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isSelected(comp, ct)}
                              onChange={() => toggleBoMChange(comp, ct)}
                              className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                          </label>
                        </td>
                      ))}
                    </tr>
                  );
                }),
              ];
            })}
          </tbody>
        </table>
      </div>

      {/* Required Test Sequences */}
      {selectedCount > 0 && (
        <div className="space-y-4">
          <button
            onClick={() => setShowSequences(!showSequences)}
            className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            {showSequences ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            Required Test Sequences ({requiredTests.length} tests)
          </button>

          {showSequences && (
            <>
              {/* Summary panel */}
              <div className="grid gap-3 sm:grid-cols-4">
                <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3 text-center">
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{requiredTests.length}</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">Total Tests</p>
                </div>
                <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-3 text-center">
                  <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{totalTestHours.toLocaleString()}</p>
                  <p className="text-xs text-amber-600 dark:text-amber-400">Total Test Hours</p>
                </div>
                <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-3 text-center">
                  <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{totalSamples}</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">Total Samples</p>
                </div>
                <div className="rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 p-3 text-center">
                  <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{selectedComponents.size}</p>
                  <p className="text-xs text-purple-600 dark:text-purple-400">Components Affected</p>
                </div>
              </div>

              {/* Tests table */}
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50">
                      <th className="px-4 py-2.5 text-left font-semibold text-slate-700 dark:text-slate-300">Test</th>
                      <th className="px-4 py-2.5 text-left font-semibold text-slate-700 dark:text-slate-300">Chamber</th>
                      <th className="px-4 py-2.5 text-right font-semibold text-slate-700 dark:text-slate-300">Duration (hrs)</th>
                      <th className="px-4 py-2.5 text-right font-semibold text-slate-700 dark:text-slate-300">Samples</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requiredTests.map((test) => (
                      <tr key={test.id} className="border-b border-slate-100 dark:border-slate-700">
                        <td className="px-4 py-2.5 font-medium text-slate-800 dark:text-slate-200">{test.name}</td>
                        <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">
                          {getChamber(test.chamberType)?.name ?? test.chamberType}
                        </td>
                        <td className="px-4 py-2.5 text-right text-slate-600 dark:text-slate-400">{test.testHours.toLocaleString()}</td>
                        <td className="px-4 py-2.5 text-right text-slate-600 dark:text-slate-400">{test.samplesRequired}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
