"use client";

import DepartmentManager from "@/components/department-manager";

export default function DepartmentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Departments</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage departments and their project loads for chamber demand estimation
        </p>
      </div>
      <DepartmentManager />
    </div>
  );
}
