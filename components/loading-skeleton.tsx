"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn("skeleton", className)} />;
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div>
        <div className="skeleton h-8 w-48 mb-2" />
        <div className="skeleton h-4 w-64" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card flex items-start gap-4">
            <div className="skeleton h-12 w-12 rounded-xl" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-4 w-24" />
              <div className="skeleton h-7 w-16" />
              <div className="skeleton h-3 w-20" />
            </div>
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <div className="skeleton h-5 w-40 mb-4" />
          <div className="skeleton h-[300px] w-full" />
        </div>
        <div className="card">
          <div className="skeleton h-5 w-40 mb-4" />
          <div className="skeleton h-[300px] w-full" />
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="skeleton h-4 w-64" />
        <div className="skeleton h-8 w-24 rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="skeleton h-10 w-full" />
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="skeleton h-12 w-full" />
        ))}
      </div>
    </div>
  );
}
