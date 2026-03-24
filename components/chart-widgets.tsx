'use client';

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
} from 'recharts';
import { CalculationResult } from '@/lib/types';
import { CHAMBERS } from '@/lib/chambers';
import { STANDARDS } from '@/lib/standards';

const COLORS = [
  '#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#6366f1',
];

interface ChamberBarChartProps {
  results: CalculationResult[];
}

export function ChamberBarChart({ results }: ChamberBarChartProps) {
  if (results.length === 0) {
    return (
      <div className="empty-state h-64">
        <p className="text-sm">No calculation data available.</p>
        <p className="text-xs mt-1">Run calculations to see chamber distribution.</p>
      </div>
    );
  }

  const data = results.map((r) => {
    const chamber = CHAMBERS.find((c) => c.id === r.chamberType);
    return {
      name: chamber?.name || r.chamberType,
      chambers: r.chambersNeeded,
      hours: r.totalTestHrs,
      fill: r.bottleneck ? '#ef4444' : '#2563eb',
    };
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-25} textAnchor="end" height={60} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '13px',
          }}
          formatter={(value: number, name: string) => [
            value.toLocaleString(),
            name === 'chambers' ? 'Chambers Needed' : 'Test Hours',
          ]}
        />
        <Legend />
        <Bar dataKey="chambers" name="Chambers Needed" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

interface TestHoursPieChartProps {
  results: CalculationResult[];
}

export function TestHoursPieChart({ results }: TestHoursPieChartProps) {
  if (results.length === 0) {
    return (
      <div className="empty-state h-64">
        <p className="text-sm">No test hour data available.</p>
      </div>
    );
  }

  const data = results
    .filter((r) => r.totalTestHrs > 0)
    .map((r) => {
      const chamber = CHAMBERS.find((c) => c.id === r.chamberType);
      return {
        name: chamber?.name || r.chamberType,
        value: r.totalTestHrs,
      };
    });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={3}
          dataKey="value"
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
          labelLine={false}
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => [value.toLocaleString() + ' hrs', 'Test Hours']}
          contentStyle={{
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '13px',
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function StandardComparisonRadar() {
  const chamberTypes = ['DH', 'TC', 'HF', 'UV', 'PID', 'SM', 'ML', 'Hail', 'BDT'];

  const data = chamberTypes.map((ct) => {
    const entry: Record<string, string | number> = { chamber: ct };
    for (const std of STANDARDS) {
      const profile = std.testProfiles.find((p) => p.chamberType === ct);
      entry[std.code] = profile ? profile.durationHrs : 0;
    }
    return entry;
  });

  return (
    <ResponsiveContainer width="100%" height={350}>
      <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
        <PolarGrid stroke="#e2e8f0" />
        <PolarAngleAxis dataKey="chamber" tick={{ fontSize: 11 }} />
        <PolarRadiusAxis tick={{ fontSize: 10 }} />
        <Radar name="IEC" dataKey="IEC" stroke="#2563eb" fill="#2563eb" fillOpacity={0.15} />
        <Radar name="MNRE" dataKey="MNRE" stroke="#10b981" fill="#10b981" fillOpacity={0.15} />
        <Radar name="REC" dataKey="REC" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.15} />
        <Tooltip
          contentStyle={{
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '13px',
          }}
        />
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  );
}

interface UtilizationBarChartProps {
  results: CalculationResult[];
}

export function UtilizationBarChart({ results }: UtilizationBarChartProps) {
  if (results.length === 0) {
    return (
      <div className="empty-state h-64">
        <p className="text-sm">No utilization data available.</p>
      </div>
    );
  }

  const data = results.map((r) => {
    const chamber = CHAMBERS.find((c) => c.id === r.chamberType);
    return {
      name: chamber?.name || r.chamberType,
      utilization: r.utilizationPct,
      fill:
        r.utilizationPct > 85
          ? '#ef4444'
          : r.utilizationPct > 65
            ? '#f59e0b'
            : '#10b981',
    };
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 80, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} unit="%" />
        <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={75} />
        <Tooltip
          formatter={(value: number) => [`${value.toFixed(1)}%`, 'Utilization']}
          contentStyle={{
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '13px',
          }}
        />
        <Bar dataKey="utilization" name="Utilization %" radius={[0, 4, 4, 0]}>
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
