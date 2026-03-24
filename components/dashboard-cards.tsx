"use client";

import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: "blue" | "emerald" | "amber" | "rose";
  trend?: { value: number; label: string };
}

const colorMap = {
  blue: {
    bg: "bg-blue-50 dark:bg-blue-900/30",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-100 dark:border-blue-800",
    gradient: "from-blue-500 to-blue-600",
  },
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-900/30",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-100 dark:border-emerald-800",
    gradient: "from-emerald-500 to-emerald-600",
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-900/30",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-100 dark:border-amber-800",
    gradient: "from-amber-500 to-amber-600",
  },
  rose: {
    bg: "bg-rose-50 dark:bg-rose-900/30",
    text: "text-rose-600 dark:text-rose-400",
    border: "border-rose-100 dark:border-rose-800",
    gradient: "from-rose-500 to-rose-600",
  },
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "blue",
  trend,
}: StatCardProps) {
  const c = colorMap[color];
  return (
    <div className="card hover-lift flex items-start gap-4">
      <div className={cn("rounded-xl p-3", c.bg, c.text)}>
        <Icon size={22} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
        <div className="mt-0.5 flex items-center gap-2">
          {subtitle && (
            <p className="text-xs text-slate-400 dark:text-slate-500">{subtitle}</p>
          )}
          {trend && (
            <span className={cn(
              "text-xs font-medium",
              trend.value >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
            )}>
              {trend.value >= 0 ? "+" : ""}{trend.value}% {trend.label}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function UtilizationGauge({ value, size = 120 }: { value: number; size?: number }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  const color = value > 85 ? "#ef4444" : value > 65 ? "#f59e0b" : "#10b981";

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          className="text-slate-100 dark:text-slate-700"
          strokeWidth={8}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <div className="relative -mt-[calc(50%+8px)] flex h-full items-center justify-center" style={{ marginTop: -(size / 2 + 8) }}>
        <div className="text-center" style={{ marginTop: size / 2 + 8 }}>
          <span className="text-2xl font-bold text-slate-900 dark:text-white">{value}%</span>
          <p className="text-xs text-slate-500 dark:text-slate-400">Utilization</p>
        </div>
      </div>
    </div>
  );
}
