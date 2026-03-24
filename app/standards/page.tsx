"use client";

import StandardsConfig from "@/components/standards-config";

export default function StandardsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Standards Configurator</h1>
        <p className="mt-1 text-sm text-slate-500">
          View and select qualification standards: IEC 61215, MNRE ALMM, or REC
        </p>
      </div>
      <div className="card">
        <StandardsConfig />
      </div>
    </div>
  );
}
