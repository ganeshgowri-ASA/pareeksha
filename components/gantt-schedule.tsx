"use client";

import { useMemo } from "react";
import { CalculationResult } from "@/lib/types";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const TYPE_COLORS: Record<string, string> = {
  DH: "bg-sky-400",
  TC: "bg-violet-400",
  HF: "bg-teal-400",
  PID: "bg-amber-400",
  UV: "bg-rose-400",
  SaltMist: "bg-emerald-400",
  SandDust: "bg-orange-400",
  MechLoad: "bg-indigo-400",
  Hail: "bg-pink-400",
};

interface GanttScheduleProps {
  results: CalculationResult[];
}

interface ScheduleBlock {
  startMonth: number;
  durationMonths: number;
  label: string;
}

export function GanttSchedule({ results }: GanttScheduleProps) {
  const schedule = useMemo(() => {
    const rows: { type: string; name: string; blocks: ScheduleBlock[] }[] = [];
    let monthOffset = 0;

    const grouped = results.reduce<Record<string, CalculationResult[]>>((acc, r) => {
      if (!acc[r.chamberType]) acc[r.chamberType] = [];
      acc[r.chamberType].push(r);
      return acc;
    }, {});

    Object.entries(grouped).forEach(([type, tests]) => {
      const blocks: ScheduleBlock[] = [];
      let currentMonth = monthOffset % 12;

      tests.forEach((test) => {
        const hoursPerYear = 7200;
        const durationMonths = Math.max(1, Math.ceil((test.totalTestHours / hoursPerYear) * 12));
        blocks.push({
          startMonth: currentMonth,
          durationMonths: Math.min(durationMonths, 12 - currentMonth),
          label: test.chamberName,
        });
        currentMonth = (currentMonth + durationMonths) % 12;
      });

      rows.push({ type, name: type, blocks });
      monthOffset += 2;
    });

    return rows;
  }, [results]);

  if (results.length === 0) {
    return (
      <div className="empty-state">
        <p className="text-lg font-medium">No schedule data</p>
        <p className="text-sm mt-1">Run calculations to see the yearly test schedule.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Header */}
        <div className="flex border-b border-slate-200">
          <div className="w-28 flex-shrink-0 px-3 py-2 text-xs font-semibold text-slate-500 uppercase">
            Chamber
          </div>
          <div className="flex-1 grid grid-cols-12">
            {MONTHS.map((month) => (
              <div key={month} className="px-1 py-2 text-xs font-medium text-slate-500 text-center border-l border-slate-100">
                {month}
              </div>
            ))}
          </div>
        </div>

        {/* Rows */}
        {schedule.map((row) => (
          <div key={row.type} className="flex border-b border-slate-100 hover:bg-slate-50 transition-all-smooth">
            <div className="w-28 flex-shrink-0 px-3 py-3 text-sm font-medium text-slate-700">
              {row.name}
            </div>
            <div className="flex-1 relative h-10 my-auto">
              <div className="grid grid-cols-12 h-full absolute inset-0">
                {MONTHS.map((_, i) => (
                  <div key={i} className="border-l border-slate-100" />
                ))}
              </div>
              {row.blocks.map((block, i) => {
                const left = (block.startMonth / 12) * 100;
                const width = (block.durationMonths / 12) * 100;
                const colorClass = TYPE_COLORS[row.type] || "bg-slate-400";

                return (
                  <div
                    key={i}
                    className={`absolute top-1 bottom-1 rounded ${colorClass} opacity-80 hover:opacity-100 transition-opacity flex items-center justify-center`}
                    style={{ left: `${left}%`, width: `${Math.max(width, 3)}%` }}
                    title={`${block.label}: ${block.durationMonths} month(s)`}
                  >
                    <span className="text-[10px] text-white font-medium truncate px-1">
                      {block.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-4 px-3">
          {Object.entries(TYPE_COLORS).map(([type, color]) => (
            <div key={type} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded-sm ${color}`} />
              <span className="text-xs text-slate-600">{type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
