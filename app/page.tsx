"use client";

import { Boxes, Gauge, FlaskConical, Building2 } from "lucide-react";
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
} from "recharts";
import { StatCard } from "@/components/dashboard-cards";
import { useAppStore } from "@/lib/store";
import { calculateAllChambers, totalChambersNeeded, averageUtilization } from "@/lib/formulas";
import { CHAMBER_CATEGORIES } from "@/lib/chambers";

const PIE_COLORS = ["#2563eb", "#7c3aed", "#059669", "#d97706", "#dc2626"];

export default function DashboardPage() {
  const { calculationInput, departments } = useAppStore();
  const results = calculateAllChambers(calculationInput);
  const total = totalChambersNeeded(results);
  const avgUtil = averageUtilization(results);

  // Aggregate chambers by category
  const barData = CHAMBER_CATEGORIES.map((cat) => {
    const catResults = results.filter((r) => r.chamberType.startsWith(cat));
    return {
      name: cat,
      chambers: catResults.reduce((s, r) => s + r.chambersNeeded, 0),
      hours: catResults.reduce((s, r) => s + r.totalTestHrs, 0),
    };
  }).filter((d) => d.chambers > 0);

  // Department hours pie data
  const pieData = departments.map((dept, i) => ({
    name: dept.name.length > 20 ? dept.name.slice(0, 18) + "..." : dept.name,
    value: dept.defaultProjectsPerYear * dept.defaultBomsPerProject * dept.defaultModulesPerBom,
    color: PIE_COLORS[i % PIE_COLORS.length],
  }));

  const activeTests = results.filter((r) => r.chambersNeeded > 0).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Chamber estimation overview
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

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h2 className="mb-4 text-base font-semibold text-slate-900">
            Chambers by Type
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="chambers" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="mb-4 text-base font-semibold text-slate-900">
            Test Demand by Department
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name }) => name}
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
