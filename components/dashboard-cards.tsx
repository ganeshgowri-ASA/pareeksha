'use client';

import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'red' | 'purple' | 'amber';
}

const COLOR_MAP = {
  blue: {
    bg: 'bg-blue-50',
    icon: 'bg-blue-100 text-blue-600',
    value: 'text-blue-700',
  },
  green: {
    bg: 'bg-emerald-50',
    icon: 'bg-emerald-100 text-emerald-600',
    value: 'text-emerald-700',
  },
  red: {
    bg: 'bg-red-50',
    icon: 'bg-red-100 text-red-600',
    value: 'text-red-700',
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'bg-purple-100 text-purple-600',
    value: 'text-purple-700',
  },
  amber: {
    bg: 'bg-amber-50',
    icon: 'bg-amber-100 text-amber-600',
    value: 'text-amber-700',
  },
};

export function StatCard({ title, value, subtitle, icon: Icon, color }: StatCardProps) {
  const colors = COLOR_MAP[color];

  return (
    <div
      className={cn(
        'rounded-xl p-5 hover-lift transition-smooth',
        colors.bg
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-surface-500">{title}</p>
          <p className={cn('text-2xl font-bold mt-1', colors.value)}>{value}</p>
          {subtitle && (
            <p className="text-xs text-surface-400 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={cn('p-2.5 rounded-lg', colors.icon)}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-xl p-5 bg-surface-100">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="skeleton h-4 w-24" />
          <div className="skeleton h-8 w-16" />
          <div className="skeleton h-3 w-32" />
        </div>
        <div className="skeleton h-10 w-10 rounded-lg" />
      </div>
    </div>
  );
}
