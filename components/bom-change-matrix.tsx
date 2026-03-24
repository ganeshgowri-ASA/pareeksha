"use client";

import { useAppStore } from "@/lib/store";
import type { BoMComponent, ChangeType } from "@/lib/types";

const BOM_COMPONENTS: BoMComponent[] = [
  "Glass", "Encapsulant", "Cell", "Frame", "JunctionBox",
  "Backsheet", "Foil", "Wafer", "Ribbon", "Sealant", "Potting",
];

const CHANGE_TYPES: ChangeType[] = [
  "NewSupplier", "MaterialChange", "NewFactory",
  "DesignChange", "BOMUpgrade", "Requalification",
];

const CHANGE_LABELS: Record<string, string> = {
  NewSupplier: "New Supplier",
  MaterialChange: "Material Change",
  NewFactory: "New Factory",
  DesignChange: "Design Change",
  BOMUpgrade: "BOM Upgrade",
  Requalification: "Requalification",
};

export default function BoMChangeMatrix() {
  const { bomChanges, toggleBoMChange } = useAppStore();

  const isSelected = (component: BoMComponent, changeType: ChangeType) =>
    bomChanges.find(
      (bc) => bc.component === component && bc.changeType === changeType
    )?.selected ?? false;

  const selectedCount = bomChanges.filter((bc) => bc.selected).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Select BoM changes that require qualification testing
        </p>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
          {selectedCount} selected
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="sticky left-0 bg-white px-4 py-3 text-left font-semibold text-slate-700">
                Component
              </th>
              {CHANGE_TYPES.map((ct) => (
                <th
                  key={ct}
                  className="px-3 py-3 text-center font-semibold text-slate-700"
                >
                  {CHANGE_LABELS[ct]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BOM_COMPONENTS.map((comp) => (
              <tr
                key={comp}
                className="border-b border-slate-100 hover:bg-slate-50"
              >
                <td className="sticky left-0 bg-white px-4 py-3 font-medium text-slate-800">
                  {comp === "JunctionBox" ? "Junction Box" : comp}
                </td>
                {CHANGE_TYPES.map((ct) => (
                  <td key={ct} className="px-3 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected(comp, ct)}
                      onChange={() => toggleBoMChange(comp, ct)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
