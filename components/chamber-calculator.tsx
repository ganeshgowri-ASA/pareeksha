"use client";

import { useAppStore } from "@/lib/store";
import { calculateAllChambers, totalChambersNeeded } from "@/lib/formulas";
import { formatNumber } from "@/lib/utils";

export default function ChamberCalculator() {
  const { calculationInput, setCalculationInput } = useAppStore();
  const results = calculateAllChambers(calculationInput);
  const activeResults = results.filter((r) => r.chambersNeeded > 0);
  const total = totalChambersNeeded(results);

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Projects / Year
          </label>
          <input
            type="number"
            min={1}
            value={calculationInput.projects}
            onChange={(e) =>
              setCalculationInput({ projects: Number(e.target.value) || 1 })
            }
            className="input-field"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            BoMs / Project
          </label>
          <input
            type="number"
            min={1}
            value={calculationInput.boms}
            onChange={(e) =>
              setCalculationInput({ boms: Number(e.target.value) || 1 })
            }
            className="input-field"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Modules / BoM
          </label>
          <input
            type="number"
            min={1}
            value={calculationInput.modules}
            onChange={(e) =>
              setCalculationInput({ modules: Number(e.target.value) || 1 })
            }
            className="input-field"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Realisation Rate: {Math.round(calculationInput.realisationRate * 100)}%
          </label>
          <input
            type="range"
            min={30}
            max={95}
            value={Math.round(calculationInput.realisationRate * 100)}
            onChange={(e) =>
              setCalculationInput({
                realisationRate: Number(e.target.value) / 100,
              })
            }
            className="mt-2 w-full accent-blue-600"
          />
          <div className="mt-1 flex justify-between text-xs text-slate-400">
            <span>30%</span>
            <span>95%</span>
          </div>
        </div>
      </div>

      {/* Formula */}
      <div className="rounded-lg bg-slate-50 px-4 py-3 text-xs text-slate-500">
        <strong>Formula:</strong> Chambers = (Projects &times; BoMs &times; Modules &times; TestHrs) / (Slots &times; WorkHrs &times; RealisationRate)
        &nbsp;|&nbsp; Work Hours = {formatNumber(calculationInput.workHoursPerYear)} hrs/year
      </div>

      {/* Results table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Chamber</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-700">Slots</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-700">Total Test Hrs</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-700">Chambers Needed</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-700">Utilization</th>
            </tr>
          </thead>
          <tbody>
            {activeResults.map((r) => (
              <tr key={r.chamberType} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-800">{r.chamberName}</td>
                <td className="px-4 py-3 text-right text-slate-600">{r.slots}</td>
                <td className="px-4 py-3 text-right text-slate-600">{formatNumber(r.totalTestHrs)}</td>
                <td className="px-4 py-3 text-right">
                  <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                    {r.chambersNeeded}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-slate-600">{r.utilizationPct}%</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-slate-300 bg-slate-50">
              <td className="px-4 py-3 font-bold text-slate-900" colSpan={3}>Total</td>
              <td className="px-4 py-3 text-right">
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-sm font-bold text-emerald-700">
                  {total}
                </span>
              </td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
