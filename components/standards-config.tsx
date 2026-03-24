"use client";

import { useState } from "react";
import { CheckCircle, Circle, ArrowLeftRight } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { STANDARDS, getStandard, IEC, MNRE, BIS, IEC62915_RETEST_MATRIX, BOM_COMPONENT_INFO } from "@/lib/standards";
import { getChamber, CHAMBER_CATEGORIES } from "@/lib/chambers";
import type { StandardId, IEC62915Edition } from "@/lib/types";
import { cn } from "@/lib/utils";

type TabId = StandardId | 'IEC62915';

interface TabDef {
  id: TabId;
  label: string;
}

const TABS: TabDef[] = [
  { id: 'IEC', label: 'IEC 61215 / 61730' },
  { id: 'MNRE', label: 'MNRE ALMM' },
  { id: 'BIS', label: 'BIS IS 14286' },
  { id: 'IEC62915', label: 'IEC 62915 Retesting' },
  { id: 'Custom', label: 'Custom Profile' },
];

export default function StandardsConfig() {
  const { selectedStandard, setSelectedStandard } = useAppStore();
  const [activeTab, setActiveTab] = useState<TabId>(selectedStandard);
  const [showComparison, setShowComparison] = useState(false);
  const [showMatrix, setShowMatrix] = useState(false);
  const [retestEdition, setRetestEdition] = useState<IEC62915Edition>('2023');

  const isRetestTab = activeTab === 'IEC62915';
  const standard = isRetestTab ? getStandard('IEC') : getStandard(activeTab);

  const handleTabClick = (id: TabId) => {
    setActiveTab(id);
    if (id !== 'IEC62915') {
      setSelectedStandard(id as StandardId);
    }
  };

  // Compliance checklist
  const [checkedTests, setCheckedTests] = useState<Set<string>>(new Set());
  const toggleCheck = (testId: string) => {
    setCheckedTests((prev) => {
      const next = new Set(prev);
      if (next.has(testId)) next.delete(testId); else next.add(testId);
      return next;
    });
  };
  const progress = standard.tests.length > 0
    ? Math.round((checkedTests.size / standard.tests.length) * 100)
    : 0;

  // Comparison data (IEC, MNRE, BIS)
  const compStandards = [IEC, MNRE, BIS];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-slate-100 dark:bg-slate-800 p-1 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={cn(
              "flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap",
              activeTab === tab.id
                ? "bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Standard info */}
      {isRetestTab ? (
        <div className="rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 px-4 py-3">
          <h3 className="font-semibold text-purple-900 dark:text-purple-200">IEC TS 62915 — Retesting Guidelines</h3>
          <p className="mt-0.5 text-sm text-purple-700 dark:text-purple-400">
            Retest requirements for modifications to type-approved PV modules.
            Select edition to compare 2018 vs 2023 requirements.
          </p>
        </div>
      ) : (
        <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 px-4 py-3">
          <h3 className="font-semibold text-blue-900 dark:text-blue-200">{standard.name}</h3>
          <p className="mt-0.5 text-sm text-blue-700 dark:text-blue-400">{standard.description}</p>
        </div>
      )}

      {/* IEC 62915 Retesting Tab */}
      {isRetestTab && (
        <div className="space-y-4">
          {/* Edition Toggle */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Edition:</span>
            <div className="flex gap-1 rounded-lg bg-slate-100 dark:bg-slate-800 p-1">
              <button
                onClick={() => setRetestEdition('2018')}
                className={cn(
                  "rounded-md px-4 py-1.5 text-sm font-medium transition-all",
                  retestEdition === '2018'
                    ? "bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
                )}
              >
                2018
              </button>
              <button
                onClick={() => setRetestEdition('2023')}
                className={cn(
                  "rounded-md px-4 py-1.5 text-sm font-medium transition-all",
                  retestEdition === '2023'
                    ? "bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
                )}
              >
                2023
              </button>
            </div>
          </div>

          {/* Retest Matrix Table */}
          <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">Component</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">Change Type</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">Retest Level</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">Required Tests ({retestEdition})</th>
                </tr>
              </thead>
              <tbody>
                {IEC62915_RETEST_MATRIX.map((entry, i) => {
                  const tests = retestEdition === '2018' ? entry.testsRequired2018 : entry.testsRequired2023;
                  const compInfo = BOM_COMPONENT_INFO.find((c) => c.id === entry.component);
                  const inEdition = retestEdition === '2018' ? compInfo?.in2018 : compInfo?.in2023;
                  if (!inEdition && tests.length === 0) return null;
                  return (
                    <tr key={i} className="border-b border-slate-100 dark:border-slate-700">
                      <td className="px-4 py-2.5 font-medium text-slate-800 dark:text-slate-200">
                        {compInfo?.name ?? entry.component}
                      </td>
                      <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">
                        {entry.changeType.replace(/([A-Z])/g, ' $1').trim()}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={cn(
                          "rounded px-2 py-0.5 text-xs font-medium",
                          entry.retestLevel === 'full' ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" :
                          entry.retestLevel === 'partial' ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" :
                          "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
                        )}>
                          {entry.retestLevel}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">
                        {tests.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {tests.map((t) => (
                              <span key={t} className="rounded bg-blue-50 dark:bg-blue-900/20 px-1.5 py-0.5 text-xs text-blue-700 dark:text-blue-300">
                                {getChamber(t)?.name ?? t}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500 text-xs">N/A in {retestEdition}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Non-retest tabs content */}
      {!isRetestTab && (
        <>
          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowComparison(!showComparison)}
              className={cn("btn-secondary text-xs", showComparison && "bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700")}
            >
              <ArrowLeftRight size={14} />
              {showComparison ? "Hide" : "Show"} Comparison
            </button>
            <button
              onClick={() => setShowMatrix(!showMatrix)}
              className={cn("btn-secondary text-xs", showMatrix && "bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700")}
            >
              {showMatrix ? "Hide" : "Show"} Test Matrix
            </button>
          </div>

          {/* Side-by-side Comparison */}
          {showComparison && (
            <div className="card">
              <h3 className="mb-4 text-base font-semibold text-slate-900 dark:text-white">Standards Comparison</h3>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50">
                      <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">Attribute</th>
                      {compStandards.map((s) => (
                        <th key={s.id} className={cn(
                          "px-4 py-3 text-center font-semibold",
                          s.id === activeTab ? "text-blue-700 dark:text-blue-300 bg-blue-50/50 dark:bg-blue-900/20" : "text-slate-700 dark:text-slate-300"
                        )}>
                          {s.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100 dark:border-slate-700">
                      <td className="px-4 py-2.5 font-medium text-slate-800 dark:text-slate-200">Total Tests</td>
                      {compStandards.map((s) => (
                        <td key={s.id} className="px-4 py-2.5 text-center text-slate-600 dark:text-slate-400">{s.tests.length}</td>
                      ))}
                    </tr>
                    <tr className="border-b border-slate-100 dark:border-slate-700">
                      <td className="px-4 py-2.5 font-medium text-slate-800 dark:text-slate-200">Total Test Hours</td>
                      {compStandards.map((s) => (
                        <td key={s.id} className="px-4 py-2.5 text-center text-slate-600 dark:text-slate-400">
                          {s.tests.reduce((sum, t) => sum + t.testHours, 0).toLocaleString()}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-slate-100 dark:border-slate-700">
                      <td className="px-4 py-2.5 font-medium text-slate-800 dark:text-slate-200">Sequences</td>
                      {compStandards.map((s) => (
                        <td key={s.id} className="px-4 py-2.5 text-center text-slate-600 dark:text-slate-400">{s.sequences.length}</td>
                      ))}
                    </tr>
                    <tr className="border-b border-slate-100 dark:border-slate-700">
                      <td className="px-4 py-2.5 font-medium text-slate-800 dark:text-slate-200">Max Test Duration</td>
                      {compStandards.map((s) => (
                        <td key={s.id} className="px-4 py-2.5 text-center text-slate-600 dark:text-slate-400">
                          {s.tests.length > 0 ? Math.max(...s.tests.map((t) => t.testHours)).toLocaleString() + 'h' : '-'}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-slate-100 dark:border-slate-700">
                      <td className="px-4 py-2.5 font-medium text-slate-800 dark:text-slate-200">Avg Samples/Test</td>
                      {compStandards.map((s) => {
                        const avg = s.tests.length > 0 ? (s.tests.reduce((sum, t) => sum + t.samplesRequired, 0) / s.tests.length).toFixed(1) : "0";
                        return <td key={s.id} className="px-4 py-2.5 text-center text-slate-600 dark:text-slate-400">{avg}</td>;
                      })}
                    </tr>
                    {CHAMBER_CATEGORIES.slice(0, 5).map((cat) => (
                      <tr key={cat} className="border-b border-slate-100 dark:border-slate-700">
                        <td className="px-4 py-2.5 font-medium text-slate-800 dark:text-slate-200">{cat} Tests</td>
                        {compStandards.map((s) => {
                          const count = s.tests.filter((t) => t.chamberType.startsWith(cat)).length;
                          return (
                            <td key={s.id} className={cn(
                              "px-4 py-2.5 text-center",
                              count > 0 ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-slate-400 dark:text-slate-500"
                            )}>
                              {count > 0 ? count : "-"}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Test Mapping Matrix */}
          {showMatrix && (
            <div className="card">
              <h3 className="mb-4 text-base font-semibold text-slate-900 dark:text-white">BoM &rarr; Test Mapping Matrix</h3>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50">
                      <th className="px-3 py-2 text-left font-semibold text-slate-700 dark:text-slate-300 sticky left-0 bg-slate-50 dark:bg-slate-800/50 z-10">Component</th>
                      {CHAMBER_CATEGORIES.map((cat) => (
                        <th key={cat} className="px-2 py-2 text-center font-semibold text-slate-700 dark:text-slate-300">{cat}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(Object.keys(standard.bomTestMapping) as Array<keyof typeof standard.bomTestMapping>).map((comp) => {
                      const compInfo = BOM_COMPONENT_INFO.find((c) => c.id === comp);
                      return (
                        <tr key={comp} className="border-b border-slate-100 dark:border-slate-700">
                          <td className="px-3 py-2 font-medium text-slate-800 dark:text-slate-200 sticky left-0 bg-white dark:bg-slate-800/50 z-10">
                            {compInfo?.name ?? comp}
                          </td>
                          {CHAMBER_CATEGORIES.map((cat) => {
                            const has = standard.bomTestMapping[comp]?.some((c) => c.startsWith(cat));
                            return (
                              <td key={cat} className="px-2 py-2 text-center">
                                {has ? (
                                  <span className="inline-block h-4 w-4 rounded-full bg-blue-500/20 dark:bg-blue-400/20 text-blue-600 dark:text-blue-400 text-[10px] leading-4 font-bold">
                                    &#10003;
                                  </span>
                                ) : (
                                  <span className="text-slate-300 dark:text-slate-600">-</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tests with Compliance Checklist */}
          {standard.tests.length > 0 ? (
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  Compliance Checklist
                </h3>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{progress}%</span>
                </div>
              </div>

              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50">
                      <th className="w-10 px-3 py-3" />
                      <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">Test</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">Chamber</th>
                      <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-300">Duration</th>
                      <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-300">Samples</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standard.tests.map((test) => (
                      <tr
                        key={test.id}
                        className={cn(
                          "border-b border-slate-100 dark:border-slate-700 transition-colors cursor-pointer",
                          checkedTests.has(test.id)
                            ? "bg-emerald-50/50 dark:bg-emerald-900/10"
                            : "hover:bg-slate-50 dark:hover:bg-slate-800/30"
                        )}
                        onClick={() => toggleCheck(test.id)}
                      >
                        <td className="px-3 py-3 text-center">
                          {checkedTests.has(test.id) ? (
                            <CheckCircle size={16} className="text-emerald-500" />
                          ) : (
                            <Circle size={16} className="text-slate-300 dark:text-slate-600" />
                          )}
                        </td>
                        <td className={cn(
                          "px-4 py-3 font-medium",
                          checkedTests.has(test.id)
                            ? "text-emerald-800 dark:text-emerald-300 line-through"
                            : "text-slate-800 dark:text-slate-200"
                        )}>{test.name}</td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{getChamber(test.chamberType)?.name ?? test.chamberType}</td>
                        <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">{test.testHours}h</td>
                        <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">{test.samplesRequired}</td>
                        <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">{test.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700 px-6 py-12 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No tests configured for custom profile. Use the other tabs as a starting point.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
