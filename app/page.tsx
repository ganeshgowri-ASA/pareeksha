"use client";

import { useState, useEffect } from "react";
import { Boxes, Gauge, FlaskConical, Building2, TrendingUp, Activity } from "lucide-react";
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
} from "recharts";
import { StatCard } from "@/components/dashboard-cards";
import { DashboardSkeleton } from "@/components/loading-skeleton";
import { useAppStore } from "@/lib/store";
import { calculateAllChambers, totalChambersNeeded, averageUtilization } from "@/lib/formulas";
import { CHAMBER_CATEGORIES } from "@/lib/chambers";

const PIE_COLORS = ["#2563eb", "#7c3aed", "#059669", "#d97706", "#dc2626"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
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

  // Timeline data - simulated monthly trend
  const timelineData = MONTHS.map((month, i) => {
    const factor = 0.7 + Math.sin(i * 0.5) * 0.3;
    return {
      month,
      chambers: Math.round(total * factor),
      utilization: Math.round(avgUtil * (0.8 + Math.sin(i * 0.4) * 0.2)),
    };
  });

  // Utilization gauge data
  const gaugeData = [
    { name: "Utilization", value: avgUtil, fill: avgUtil > 85 ? "#ef4444" : avgUtil > 65 ? "#f59e0b" : "#10b981" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Chamber estimation overview &mdash; real-time insights
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Chambers"
          value={total}
          subtitle="Across all types"
          icon={Boxes}
          color="blue"
        />
        <StatCard
          title="Avg Utilization"
          value={`${avgUtil}%`}
          subtitle="Active chambers"
          icon={Gauge}
          color="emerald"
        />
        <StatCard
          title="Active Tests"
          value={activeTests}
          subtitle={`of ${results.length} test types`}
          icon={FlaskConical}
          color="amber"
        />
        <StatCard
          title="Departments"
          value={departments.length}
          subtitle="Contributing demand"
          icon={Building2}
          color="rose"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Chambers by Type - Bar Chart with gradient */}
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Chambers by Type
            </h2>
            <span className="rounded-full bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
              {barData.length} categories
            </span>
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
              <Tooltip
                contentStyle={{
                  borderRadius: "0.75rem",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  fontSize: "0.875rem",
                }}
              />
              <Bar
                dataKey="chambers"
                fill="url(#barGradient)"
                radius={[8, 8, 0, 0]}
                animationDuration={1200}
                animationEasing="ease-out"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Utilization Gauge */}
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Overall Utilization
            </h2>
            <Activity size={18} className="text-slate-400" />
          </div>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <RadialBarChart
                innerRadius="60%"
                outerRadius="90%"
                data={gaugeData}
                startAngle={180}
                endAngle={0}
                barSize={20}
              >
                <RadialBar
                  dataKey="value"
                  cornerRadius={10}
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
                <text
                  x="50%"
                  y="45%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-slate-900 dark:fill-white"
                  fontSize={36}
                  fontWeight={700}
                >
                  {avgUtil}%
                </text>
                <text
                  x="50%"
                  y="55%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-slate-500 dark:fill-slate-400"
                  fontSize={13}
                >
                  Avg Utilization
                </text>
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex justify-center gap-6 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> &lt;65% Optimal
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> 65-85% Warning
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500" /> &gt;85% Critical
            </span>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Department Breakdown Pie */}
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Department Breakdown
            </h2>
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
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                animationDuration={1200}
                animationEasing="ease-out"
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={`url(#pieGrad${i % PIE_COLORS.length})`} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: "0.75rem",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  fontSize: "0.875rem",
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: "0.75rem" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Timeline Trend */}
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Monthly Demand Trend
            </h2>
            <TrendingUp size={18} className="text-slate-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={timelineData}>
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="areaGradient2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748b" }} />
              <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
              <Tooltip
                contentStyle={{
                  borderRadius: "0.75rem",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  fontSize: "0.875rem",
                }}
              />
              <Area
                type="monotone"
                dataKey="chambers"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#areaGradient)"
                animationDuration={1500}
                animationEasing="ease-out"
              />
              <Area
                type="monotone"
                dataKey="utilization"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#areaGradient2)"
                animationDuration={1500}
                animationEasing="ease-out"
              />
              <Legend wrapperStyle={{ fontSize: "0.75rem" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
