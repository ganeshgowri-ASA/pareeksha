"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { CalculationResult } from "@/lib/types";

const COLORS = [
  "#0ea5e9", "#8b5cf6", "#22c55e", "#f59e0b", "#ef4444",
  "#ec4899", "#14b8a6", "#f97316", "#6366f1", "#a855f7",
];

interface ChartProps {
  results: CalculationResult[];
}

export function ChamberBarChart({ results }: ChartProps) {
  const aggregated = Object.values(
    results.reduce<Record<string, { type: string; chambers: number; hours: number }>>(
      (acc, r) => {
        if (!acc[r.chamberType]) {
          acc[r.chamberType] = { type: r.chamberType, chambers: 0, hours: 0 };
        }
        acc[r.chamberType].chambers += r.chambersRequired;
        acc[r.chamberType].hours += r.totalTestHours;
        return acc;
      },
      {}
    )
  );

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={aggregated} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="type" tick={{ fontSize: 12, fill: "#64748b" }} />
        <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
          }}
        />
        <Legend />
        <Bar dataKey="chambers" name="Chambers Required" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function TestHoursPieChart({ results }: ChartProps) {
  const data = results
    .filter((r) => r.totalTestHours > 0)
    .map((r) => ({
      name: r.chamberName,
      value: r.totalTestHours,
    }));

  if (data.length === 0) {
    return <div className="empty-state h-[300px]"><p>No test data available</p></div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          labelLine={true}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => [`${value.toLocaleString()} hrs`, "Test Hours"]}
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

interface RadarData {
  test: string;
  IEC: number;
  MNRE: number;
  REC: number;
}

export function StandardComparisonRadar({ data }: { data: RadarData[] }) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
        <PolarGrid stroke="#e2e8f0" />
        <PolarAngleAxis dataKey="test" tick={{ fontSize: 11, fill: "#64748b" }} />
        <PolarRadiusAxis tick={{ fontSize: 10, fill: "#94a3b8" }} />
        <Radar name="IEC" dataKey="IEC" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.15} />
        <Radar name="MNRE" dataKey="MNRE" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.15} />
        <Radar name="REC" dataKey="REC" stroke="#22c55e" fill="#22c55e" fillOpacity={0.15} />
        <Legend />
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}

export function UtilizationBarChart({ results }: ChartProps) {
  const data = results.map((r) => ({
    name: r.chamberName,
    utilization: Number(r.utilization.toFixed(1)),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 80, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: "#64748b" }} unit="%" />
        <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "#64748b" }} width={75} />
        <Tooltip
          formatter={(value: number) => [`${value}%`, "Utilization"]}
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
          }}
        />
        <Bar dataKey="utilization" name="Utilization %" radius={[0, 4, 4, 0]}>
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.utilization > 85 ? "#ef4444" : entry.utilization > 65 ? "#f59e0b" : "#22c55e"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
