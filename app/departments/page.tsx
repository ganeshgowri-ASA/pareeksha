'use client';

import DepartmentManager from '@/components/department-manager';

export default function DepartmentsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Department Manager</h1>
        <p className="text-sm text-surface-500 mt-1">
          Manage departments and their project allocations
        </p>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-surface-200">
        <DepartmentManager />
      </div>
    </div>
  );
}
