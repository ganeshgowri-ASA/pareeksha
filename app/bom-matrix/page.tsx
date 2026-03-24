'use client';

export default function BomMatrixPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">BoM Change Matrix</h1>
        <p className="text-sm text-surface-500 mt-1">
          Map bill-of-material changes to required test sequences
        </p>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-surface-200 empty-state">
        <p className="text-sm text-surface-500">BoM Change Matrix will be integrated after merge with Session B.</p>
      </div>
    </div>
  );
}
