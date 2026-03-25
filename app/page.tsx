"use client";

import { useState, useEffect } from "react";
import { Boxes, Gauge, FlaskConical, Building2, TrendingUp, Activity, AlertTriangle, ArrowUp, ArrowDown } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
  ComposedChart,
  Line,
  ReferenceLine,
} from "recharts";
import { StatCard } from "@/components/dashboard-cards";
import { DashboardSkeleton } from "@/components/loading-skeleton";
import { useAppStore } from "@/lib/store";
import { calculateAllChambers, totalChambersNeeded, averageUtilization } from "@/lib/formulas";
import { CHAMBER_CATEGORIES } from "@/lib/chambers";
import { cn } from "@/lib/utils";

const PIE_COLORS = ["#2563eb", "#7c3aed", "#059669", "#d97706", "#dc2626"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Seasonal factors: higher demand in Q1 & Q2 (new product launches), dip in monsoon, recovery in Q4
const SEASONAL_FACTORS = [0.85, 0.95, 1.1, 1.15, 1.2, 1.05, 0.75, 0.7, 0.8, 0.85, 0.9, 0.95];

const CHAMBER_COLORS: Record<string, string> = {
  DH: "#3b82f6",
  TC: "#8b5cf6",
  HF: "#06b6d4",
  PID: "#f59e0b",
  UV: "#ef4444",
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string; dataKey: string }>;
  label?: string;
}

function DemandTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const total = payload.filter(p => p.dataKey !== "utilization" && p.dataKey !== "capacity").reduce((s, p) => s + p.value, 0);
  const utilEntry = payload.find(p => p.dataKey === "utilization");
  const capEntry = payload.find(p => p.dataKey === "capacity");
  return (
    <div className="rounded-xl border border-slate-200 bg-white/95 backdrop-blur-sm p-3 shadow-lg text-sm dark:bg-slate-800/95 dark:border-slate-700">
      <p className="font-semibold text-slate-900 dark:text-white mb-2">{label} 2025</p>
      <div className="space-y-1">
        {payload.filter(p => p.dataKey !== "utilization" && p.dataKey !== "capacity").map((entry, i) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: entry.color }} />
              <span className="text-slate-600 dark:text-slate-300">{entry.name}</span>
            </span>
            <span className="font-medium text-slate-900 dark:text-white">{entry.value}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700 space-y-1">
        <div className="flex justify-between">
          <span className="text-slate-500">Total Demand</span>
          <span className="font-bold text-slate-900 dark:text-white">{total} chambers</span>
        </div>
        {utilEntry && (
          <div className="flex justify-between">
            <span className="text-slate-500">Utilization</span>
            <span className={cn("font-bold", utilEntry.value > 85 ? "text-red-600" : utilEntry.value > 65 ? "text-amber-600" : "text-emerald-600")}>{utilEntry.value}%</span>
          </div>
        )}
        {capEntry && (
          <div className="flex justify-between">
            <span className="text-slate-500">Capacity</span>
            <span className="font-medium text-slate-700 dark:text-slate-300">{capEntry.value} chambers</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [activeMonth, setActiveMonth] = useState<string | null>(null);
  const { calculationInput, departments } = useAppStore();
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return <DashboardSkeleton />;
  }
  const results = calculateAllChambers(calculationInput);
  const total = totalChambersNeeded(results);
  const avgUtil = averageUtilization(results);
  const activeTests = results.filter((r) => r.chambersRequired > 0).length;
  // Aggregate chambers by category
  const barData = CHAMBER_CATEGORIES.map((cat) => {
    const catResults = results.filter((r) => r.chamberType.startsWith(cat));
    return {
      name: cat,
      chambers: catResults.reduce((s, r) => s + r.chambersRequired, 0),
      hours: catResults.reduce((s, r) => s + r.totalTestHours, 0),
    };
  }).filter((d) => d.chambers > 0);
  // Department pie data
  const pieData = departments.map((dept, i) => ({
    name: dept.name.length > 20 ? dept.name.slice(0, 18) + "..." : dept.name,
    value: dept.projectsPerYear * dept.bomsPerProject * dept.modulesPerBom,
    color: PIE_COLORS[i % PIE_COLORS.length],
  }));
  // Enhanced monthly demand data: stacked by chamber type + utilization line + capacity line
  const dhBase = Math.max(1, results.filter(r => r.chamberType.startsWith('DH')).reduce((s,r)=>s+r.chambersRequired,0));
  const tcBase = Math.max(1, results.filter(r => r.chamberType.startsWith('TC')).reduce((s,r)=>s+r.chambersRequired,0));
  const hfBase = Math.max(1, results.filter(r => r.chamberType.startsWith('HF')).reduce((s,r)=>s+r.chambersRequired,0));
  const pidBase = Math.max(1, results.filter(r => r.chamberType.startsWith('PID')).reduce((s,r)=>s+r.chambersRequired,0));
  const uvBase = Math.max(1, results.filter(r => r.chamberType.startsWith('UV')).reduce((s,r)=>s+r.chambersRequired,0));
  const capacity = total > 0 ? Math.ceil(total * 1.15) : 10;
  const timelineData = MONTHS.map((month, i) => {
    const f = SEASONAL_FACTORS[i];
    const dh = Math.max(1, Math.round(dhBase * f));
    const tc = Math.max(1, Math.round(tcBase * f));
    const hf = Math.max(1, Math.round(hfBase * f));
    const pid = Math.max(1, Math.round(pidBase * f));
    const uv = Math.max(1, Math.round(uvBase * f));
    const demand = dh + tc + hf + pid + uv;
    const util = Math.min(99, Math.round((demand / capacity) * 100));
    return { month, DH: dh, TC: tc, HF: hf, PID: pid, UV: uv, utilization: util, capacity };
  });
  const peakMonth = timelineData.reduce((a, b) => a.utilization > b.utilization ? a : b);
  const lowMonth = timelineData.reduce((a, b) => a.utilization < b.utilization ? a : b);
  // Utilization gauge data
  const gaugeData = [
    { name: "Utilization", value: avgUtil, fill: avgUtil > 85 ? "#ef4444" : avgUtil > 65 ? "#f59e0b" : "#10b981" },
  ];
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Chamber estimation overview — real-time insights
        </p>
      </div>
      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Chambers" value={total} subtitle="Across all types" icon={Boxes} color="blue" />
        <StatCard title="Avg Utilization" value={`${avgUtil}%`} subtitle="Active chambers" icon={Gauge} color="emerald" />
        <StatCard title="Active Tests" value={activeTests} subtitle={`of ${results.length} test types`} icon={FlaskConical} color="amber" />
        <StatCard title="Departments" value={departments.length} subtitle="Contributing demand" icon={Building2} color="rose" />
      </div>
      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Chambers by Type */}
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">Chambers by Type</h2>
            <span className="rounded-full bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">{barData.length} categories</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData} barCategoryGap="20%">
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                  <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} />
              <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
              <Tooltip contentStyle={{ borderRadius: "0.75rem", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", fontSize: "0.875rem" }} />
              <Bar dataKey="chambers" fill="url(#barGradient)" radius={[8, 8, 0, 0]} animationDuration={1200} animationEasing="ease-out" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Utilization Gauge */}
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">Overall Utilization</h2>
            <Activity size={18} className="text-slate-400" />
          </div>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <RadialBarChart innerRadius="60%" outerRadius="90%" data={gaugeData} startAngle={180} endAngle={0} barSize={20}>
                <RadialBar dataKey="value" cornerRadius={10} animationDuration={1500} animationEasing="ease-out" />
                <text x="50%" y="45%" textAnchor="middle" dominantBaseline="middle" className="fill-slate-900 dark:fill-white" fontSize={36} fontWeight={700}>{avgUtil}%</text>
                <text x="50%" y="55%" textAnchor="middle" dominantBaseline="middle" className="fill-slate-500 dark:fill-slate-400" fontSize={13}>Avg Utilization</text>
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex justify-center gap-6 text-xs">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> &lt;65% Optimal</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> 65-85% Warning</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-red-500" /> &gt;85% Critical</span>
          </div>
        </div>
      </div>
      {/* Charts Row 2 - Department Pie + Enhanced Monthly Demand */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Department Breakdown Pie */}
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">Department Breakdown</h2>
            <Building2 size={18} className="text-slate-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <defs>
                {PIE_COLORS.map((color, i) => (
                  <linearGradient key={i} id={`pieGrad${i}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={1} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.7} />
                  </linearGradient>
                ))}
              </defs>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value" animationDuration={1200} animationEasing="ease-out">
                {pieData.map((_, i) => (<Cell key={i} fill={`url(#pieGrad${i % PIE_COLORS.length})`} stroke="none" />))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: "0.75rem", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", fontSize: "0.875rem" }} />
              <Legend wrapperStyle={{ fontSize: "0.75rem" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* ENHANCED Monthly Demand Trend */}
        <div className="card">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">Monthly Demand Trend</h2>
              <p className="text-xs text-slate-400 mt-0.5">Chamber demand by type vs. available capacity — 2025</p>
            </div>
            <TrendingUp size={18} className="text-slate-400 mt-0.5" />
          </div>

          {/* Peak & Low callout pills */}
          <div className="flex gap-2 mb-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-2 py-0.5 text-xs font-medium text-red-700 dark:text-red-300">
              <ArrowUp size={11} />
              Peak: {peakMonth.month} ({peakMonth.utilization}%)
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
              <ArrowDown size={11} />
              Low: {lowMonth.month} ({lowMonth.utilization}%)
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-300">
              <AlertTriangle size={11} />
              Capacity: {capacity} chambers
            </span>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={timelineData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }} barCategoryGap="15%">
              <defs>
                {Object.entries(CHAMBER_COLORS).map(([key, color]) => (
                  <linearGradient key={key} id={`demand_${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.95} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.65} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} />
              <YAxis yAxisId="chambers" tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
              <YAxis yAxisId="util" orientation="right" domain={[0, 100]} tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} unit="%" />
              <Tooltip content={<DemandTooltip />} />

              {/* Stacked bars per chamber type */}
              <Bar yAxisId="chambers" dataKey="DH" name="Damp Heat" stackId="a" fill="url(#demand_DH)" radius={[0,0,0,0]} animationDuration={1000} />
              <Bar yAxisId="chambers" dataKey="TC" name="Thermal Cycling" stackId="a" fill="url(#demand_TC)" animationDuration={1100} />
              <Bar yAxisId="chambers" dataKey="HF" name="Humidity Freeze" stackId="a" fill="url(#demand_HF)" animationDuration={1200} />
              <Bar yAxisId="chambers" dataKey="PID" name="PID" stackId="a" fill="url(#demand_PID)" animationDuration={1300} />
              <Bar yAxisId="chambers" dataKey="UV" name="UV Exposure" stackId="a" fill="url(#demand_UV)" radius={[4,4,0,0]} animationDuration={1400} />

              {/* Capacity ceiling line */}
              <Line yAxisId="chambers" type="monotone" dataKey="capacity" name="capacity" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="5 3" dot={false} activeDot={false} animationDuration={1500} />

              {/* Utilization % line */}
              <Line
                yAxisId="util"
                type="monotone"
                dataKey="utilization"
                name="utilization"
                stroke="#f97316"
                strokeWidth={2.5}
                dot={(props: { cx?: number; cy?: number; payload?: { utilization: number } }) => {
                  const { cx, cy, payload } = props;
                  if (!payload) return <circle key="empty" r={0} />;
                  const u = payload.utilization;
                  const fill = u > 85 ? '#ef4444' : u > 65 ? '#f59e0b' : '#10b981';
                  return <circle key={`dot-${cx}`} cx={cx} cy={cy} r={4} fill={fill} stroke="white" strokeWidth={1.5} />;
                }}
                activeDot={{ r: 6, fill: '#f97316', stroke: 'white', strokeWidth: 2 }}
                animationDuration={1600}
              />

              {/* Reference lines */}
              <ReferenceLine yAxisId="util" y={85} stroke="#ef4444" strokeDasharray="4 3" strokeWidth={1} label={{ value: 'Critical 85%', position: 'insideTopRight', fontSize: 9, fill: '#ef4444' }} />
              <ReferenceLine yAxisId="util" y={65} stroke="#f59e0b" strokeDasharray="4 3" strokeWidth={1} label={{ value: 'Warning 65%', position: 'insideTopRight', fontSize: 9, fill: '#f59e0b' }} />

              <Legend
                wrapperStyle={{ fontSize: '0.7rem', paddingTop: '8px' }}
                formatter={(value) => value === 'capacity' ? 'Capacity' : value === 'utilization' ? 'Utilization %' : value}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
