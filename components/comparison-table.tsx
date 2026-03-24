"use client";

import { STANDARDS } from "@/lib/standards";
import { getAllTestTypes } from "@/lib/standards";

export function ComparisonTable() {
  const standards = STANDARDS;
  const allTests = getAllTestTypes();

  const getTestForStandard = (standardCode: string, testName: string) => {
    const standard = standards.find((s) => s.code === standardCode);
    return standard?.tests.find((t) => t.name === testName);
  };

  const standardCodes = standards.map((s) => s.code);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm print-no-break">
        <thead>
          <tr className="border-b-2 border-slate-200">
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Test
            </th>
            {standards.map((s) => (
              <th key={s.code} className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <div>{s.code}</div>
                <div className="text-[10px] font-normal text-slate-400 normal-case">{s.name}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {allTests.map((testName) => (
            <tr key={testName} className="hover:bg-slate-50 transition-all-smooth">
              <td className="px-4 py-3 font-medium text-slate-700">{testName}</td>
              {standardCodes.map((code) => {
                const test = getTestForStandard(code, testName);
                return (
                  <td key={code} className="px-4 py-3 text-center">
                    {test ? (
                      <div>
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-100 text-green-600 text-xs">
                          &#10003;
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {test.testHours}h / {test.modulesRequired} mod
                        </div>
                      </div>
                    ) : (
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-300 text-xs">
                        &mdash;
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-slate-300 font-semibold">
            <td className="px-4 py-3 text-slate-800">Total Tests</td>
            {standards.map((s) => (
              <td key={s.code} className="px-4 py-3 text-center text-slate-800">
                {s.tests.length}
              </td>
            ))}
          </tr>
          <tr className="font-semibold">
            <td className="px-4 py-3 text-slate-800">Total Hours</td>
            {standards.map((s) => (
              <td key={s.code} className="px-4 py-3 text-center text-slate-800">
                {s.tests.reduce((sum, t) => sum + t.testHours, 0).toLocaleString()}
              </td>
            ))}
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
