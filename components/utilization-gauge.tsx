'use client';

interface UtilizationGaugeProps {
  value: number;
  label: string;
  size?: number;
}

export default function UtilizationGauge({
  value,
  label,
  size = 140,
}: UtilizationGaugeProps) {
  const clampedValue = Math.min(100, Math.max(0, value));
  const strokeWidth = size * 0.1;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (clampedValue / 100) * circumference;
  const center = size / 2;

  const color =
    clampedValue > 85
      ? '#ef4444'
      : clampedValue > 65
        ? '#f59e0b'
        : '#10b981';

  const bgColor =
    clampedValue > 85
      ? '#fef2f2'
      : clampedValue > 65
        ? '#fffbeb'
        : '#ecfdf5';

  return (
    <div className="flex flex-col items-center gap-2">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <div
        className="absolute flex flex-col items-center justify-center rounded-full"
        style={{
          width: size - strokeWidth * 3,
          height: size - strokeWidth * 3,
          backgroundColor: bgColor,
        }}
      >
        <span className="text-2xl font-bold" style={{ color }}>
          {clampedValue.toFixed(0)}%
        </span>
      </div>
      <span className="text-sm font-medium text-surface-600 mt-1">{label}</span>
    </div>
  );
}
