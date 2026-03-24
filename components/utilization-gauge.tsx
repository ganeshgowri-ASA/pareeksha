"use client";

interface UtilizationGaugeProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export function UtilizationGauge({
  value,
  size = 120,
  strokeWidth = 10,
  label,
}: UtilizationGaugeProps) {
  const clampedValue = Math.min(Math.max(value, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedValue / 100) * circumference;

  const getColor = (v: number): string => {
    if (v <= 65) return "#22c55e";
    if (v <= 85) return "#f59e0b";
    return "#ef4444";
  };

  const getLabel = (v: number): string => {
    if (v <= 65) return "Normal";
    if (v <= 85) return "High";
    return "Critical";
  };

  const color = getColor(clampedValue);
  const center = size / 2;

  return (
    <div className="inline-flex flex-col items-center gap-1">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        {/* Background track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
        />
        {/* Value arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      {/* Center text overlay */}
      <div
        className="absolute flex flex-col items-center justify-center"
        style={{ width: size, height: size }}
      >
        <span className="text-sm font-bold" style={{ color }}>
          {clampedValue.toFixed(0)}%
        </span>
      </div>
      {label !== undefined ? (
        <span className="text-xs text-slate-500">{label}</span>
      ) : size >= 80 ? (
        <span className="text-xs font-medium" style={{ color }}>
          {getLabel(clampedValue)}
        </span>
      ) : null}
    </div>
  );
}
