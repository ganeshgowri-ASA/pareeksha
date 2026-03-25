'use client';

import { useState } from 'react';
import { Download, Printer, FileText, BarChart3 } from 'lucide-react';
import { CalculationResult } from '@/lib/types';
import { CHAMBERS } from '@/lib/chambers';
import { exportToCSV } from '@/lib/utils';

const ALL_COLUMNS = [
  { key: 'chamberType', label: 'Chamber Type' },
  { key: 'chambersNeeded', label: 'Chambers Needed' },
  { key: 'utilizationPct', label: 'Utilization %' },
  { key: 'totalTestHrs', label: 'Total Test Hours' },
  { key: 'bottleneck', label: 'Bottleneck' },
] as const;

type ColumnKey = (typeof ALL_COLUMNS)[number]['key'];

interface ExportPanelProps {
  results: CalculationResult[];
  standardName: string;
}

/* ---- SVG chart helpers for PDF ---- */
function buildBarChartSVG(results: CalculationResult[]): string {
  const W = 560, H = 220, pad = 50, barW = 40;
  const maxVal = Math.max(...results.map(r => r.chambersNeeded), 1);
  const gap = results.length > 1 ? (W - pad * 2) / results.length : barW + 20;
  const colors = ['#3b82f6','#8b5cf6','#06b6d4','#f59e0b','#ef4444','#10b981','#ec4899'];
  let bars = '';
  results.forEach((r, i) => {
    const bH = ((r.chambersNeeded / maxVal) * (H - pad - 30));
    const x = pad + i * gap + (gap - barW) / 2;
    const y = H - pad - bH;
    const name = CHAMBERS.find(c => c.id === r.chamberType)?.name || r.chamberType;
    bars += `<rect x="${x}" y="${y}" width="${barW}" height="${bH}" rx="4" fill="${colors[i % colors.length]}" />`;
    bars += `<text x="${x + barW/2}" y="${y - 6}" text-anchor="middle" font-size="11" fill="#334155">${r.chambersNeeded}</text>`;
    bars += `<text x="${x + barW/2}" y="${H - pad + 16}" text-anchor="middle" font-size="9" fill="#64748b">${name.slice(0,12)}</text>`;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" style="background:#fff;border-radius:8px;">
    <text x="${W/2}" y="20" text-anchor="middle" font-size="13" font-weight="600" fill="#1e293b">Chambers Required by Type</text>
    <line x1="${pad}" y1="${H-pad}" x2="${W-pad}" y2="${H-pad}" stroke="#e2e8f0" stroke-width="1"/>
    ${bars}
  </svg>`;
}

function buildPieChartSVG(results: CalculationResult[]): string {
  const W = 300, H = 220, cx = 120, cy = 120, R = 80;
  const total = results.reduce((s, r) => s + r.totalTestHrs, 0) || 1;
  const colors = ['#3b82f6','#8b5cf6','#06b6d4','#f59e0b','#ef4444','#10b981','#ec4899'];
  let startAngle = -Math.PI / 2;
  let slices = '', legend = '';
  results.forEach((r, i) => {
    const pct = r.totalTestHrs / total;
    const endAngle = startAngle + pct * 2 * Math.PI;
    const large = pct > 0.5 ? 1 : 0;
    const x1 = cx + R * Math.cos(startAngle), y1 = cy + R * Math.sin(startAngle);
    const x2 = cx + R * Math.cos(endAngle), y2 = cy + R * Math.sin(endAngle);
    slices += `<path d="M${cx},${cy} L${x1},${y1} A${R},${R} 0 ${large},1 ${x2},${y2} Z" fill="${colors[i % colors.length]}" />`;
    const name = CHAMBERS.find(c => c.id === r.chamberType)?.name || r.chamberType;
    legend += `<rect x="230" y="${30 + i * 22}" width="12" height="12" rx="2" fill="${colors[i % colors.length]}"/>`;
    legend += `<text x="248" y="${41 + i * 22}" font-size="10" fill="#475569">${name.slice(0,14)} (${(pct*100).toFixed(0)}%)</text>`;
    startAngle = endAngle;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W + 100}" height="${H}" style="background:#fff;border-radius:8px;">
    <text x="${cx}" y="18" text-anchor="middle" font-size="13" font-weight="600" fill="#1e293b">Test Hours Distribution</text>
    ${slices}${legend}
  </svg>`;
}

function buildUtilGaugeSVG(results: CalculationResult[]): string {
  const W = 560, H = 120, pad = 50, barH = 18;
  const gap = results.length > 0 ? Math.min(28, (H - 30) / results.length) : 28;
  const colors = (u: number) => u > 85 ? '#ef4444' : u > 65 ? '#f59e0b' : '#10b981';
  let bars = '';
  results.forEach((r, i) => {
    const name = CHAMBERS.find(c => c.id === r.chamberType)?.name || r.chamberType;
    const y = 30 + i * gap;
    const w = ((r.utilizationPct / 100) * (W - pad - 120));
    bars += `<text x="${pad - 4}" y="${y + 13}" text-anchor="end" font-size="9" fill="#475569">${name.slice(0,10)}</text>`;
    bars += `<rect x="${pad}" y="${y}" width="${W - pad - 60}" height="${barH}" rx="4" fill="#f1f5f9" />`;
    bars += `<rect x="${pad}" y="${y}" width="${w}" height="${barH}" rx="4" fill="${colors(r.utilizationPct)}" />`;
    bars += `<text x="${pad + w + 6}" y="${y + 13}" font-size="10" fill="#334155">${r.utilizationPct}%</text>`;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${Math.max(H, 30 + results.length * gap + 10)}" style="background:#fff;border-radius:8px;">
    <text x="${W/2}" y="18" text-anchor="middle" font-size="13" font-weight="600" fill="#1e293b">Chamber Utilization</text>
    ${bars}
  </svg>`;

export default function ExportPanel({ results, standardName }: ExportPanelProps) {
  const [selectedColumns, setSelectedColumns] = useState<Set<ColumnKey>>(
    new Set(ALL_COLUMNS.map((c) => c.key))
  );
  const [pdfLoading, setPdfLoading] = useState(false);

  const toggleColumn = (key: ColumnKey) => {
    setSelectedColumns((prev) => {
      const next = new Set(prev);
      if (next.has(key)) { if (next.size > 1) next.delete(key); }
      else { next.add(key); }
      return next;
    });
  };

  const handleExportCSV = () => {
    const cols = ALL_COLUMNS.filter((c) => selectedColumns.has(c.key));
    const headers = cols.map((c) => c.label);
    const rows = results.map((r) =>
      cols.map((c) => {
        if (c.key === 'chamberType') {
          const ch = CHAMBERS.find((ch) => ch.id === r.chamberType);
          return ch?.name || r.chamberType;
        }
        if (c.key === 'bottleneck') return r.bottleneck ? 'Yes' : 'No';
        return String(r[c.key]);
      })
    );
    exportToCSV(headers, rows, `pareeksha-${standardName}-results.csv`);
  };

  const handlePrint = () => {
    const barSVG = buildBarChartSVG(results);
    const pieSVG = buildPieChartSVG(results);
    const utilSVG = buildUtilGaugeSVG(results);
    const totalChambers = results.reduce((s, r) => s + r.chambersNeeded, 0);
    const totalHours = results.reduce((s, r) => s + r.totalTestHrs, 0);
    const bottleneck = results.find((r) => r.bottleneck);
    const bnName = bottleneck ? CHAMBERS.find((c) => c.id === bottleneck.chamberType)?.name || bottleneck.chamberType : 'None';

    const tableRows = results.map((r) => {
      const ch = CHAMBERS.find((c) => c.id === r.chamberType);
      const util = r.utilizationPct;
      const badge = util > 85 ? 'background:#fee2e2;color:#b91c1c' : util > 65 ? 'background:#fef3c7;color:#92400e' : 'background:#d1fae5;color:#065f46';
      return `<tr>
        <td>${ch?.name || r.chamberType}</td>
        <td style="text-align:center">${r.chambersNeeded}</td>
        <td style="text-align:center"><span style="${badge};padding:2px 8px;border-radius:12px;font-size:11px;font-weight:600">${util}%</span></td>
        <td style="text-align:right">${r.totalTestHrs.toLocaleString()}</td>
        <td style="text-align:center">${r.bottleneck ? '<span style="background:#fee2e2;color:#b91c1c;padding:2px 8px;border-radius:12px;font-size:11px">Bottleneck</span>' : '—'}</td>
      </tr>`;
    }).join('');

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Pareeksha Report — ${standardName}</title>
  <style>
    @page { size: A4 landscape; margin: 18mm 15mm 18mm 15mm; }
    * { box-sizing: border-box; font-family: 'Segoe UI', Arial, sans-serif; }
    body { color: #1e293b; background: #fff; font-size: 12px; }
    .cover { text-align: center; padding: 40px 0 30px; border-bottom: 3px solid #3b82f6; margin-bottom: 28px; }
    .cover h1 { font-size: 26px; color: #1e3a5f; margin: 0 0 6px; }
    .cover p { color: #64748b; font-size: 13px; margin: 4px 0; }
    .section-title { font-size: 15px; font-weight: 700; color: #1e3a5f; border-left: 4px solid #3b82f6; padding-left: 10px; margin: 24px 0 12px; }
    .kpi-row { display: flex; gap: 16px; margin-bottom: 20px; }
    .kpi { flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 18px; }
    .kpi .val { font-size: 24px; font-weight: 700; color: #3b82f6; }
    .kpi .lbl { font-size: 11px; color: #64748b; margin-top: 2px; }
    .charts-row { display: flex; gap: 20px; align-items: flex-start; margin-bottom: 20px; page-break-inside: avoid; }
    .charts-row svg { border-radius: 8px; border: 1px solid #e2e8f0; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; page-break-inside: avoid; }
    thead { display: table-header-group; }
    thead tr { background: #1e3a5f; color: #fff; }
    thead th { padding: 9px 12px; text-align: left; font-weight: 600; }
    tbody tr { border-bottom: 1px solid #e2e8f0; }
    tbody tr:nth-child(even) { background: #f8fafc; }
    tbody td { padding: 8px 12px; vertical-align: middle; }
    .footer { text-align: center; font-size: 10px; color: #94a3b8; margin-top: 24px; padding-top: 12px; border-top: 1px solid #e2e8f0; }
    @media print { .no-print { display: none; } }
  </style>
</head>
<body>
  <div class="cover">
    <h1>Pareeksha Chamber Estimation Report</h1>
    <p><strong>Standard:</strong> ${standardName}</p>
    <p>Generated: ${new Date().toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' })}</p>
  </div>

  <div class="section-title">Executive Summary</div>
  <div class="kpi-row">
    <div class="kpi"><div class="val">${totalChambers}</div><div class="lbl">Total Chambers Required</div></div>
    <div class="kpi"><div class="val">${totalHours.toLocaleString()}</div><div class="lbl">Total Test Hours</div></div>
    <div class="kpi"><div class="val">${results.length}</div><div class="lbl">Chamber Types</div></div>
    <div class="kpi"><div class="val">${bnName}</div><div class="lbl">Bottleneck Chamber</div></div>
  </div>

  <div class="section-title">Visual Analysis</div>
  <div class="charts-row">
    ${barSVG}
    ${pieSVG}
  </div>
  <div style="margin-bottom:20px;page-break-inside:avoid">${utilSVG}</div>

  <div class="section-title">Detailed Chamber Breakdown</div>
  <table>
    <thead>
      <tr>
        <th>Chamber Type</th>
        <th style="text-align:center">Chambers Needed</th>
        <th style="text-align:center">Utilization</th>
        <th style="text-align:right">Total Test Hours</th>
        <th style="text-align:center">Status</th>
      </tr>
    </thead>
    <tbody>${tableRows}</tbody>
  </table>

  <div class="footer">Pareeksha v1.0 — Chamber Estimation Tool | IEC 61215 / IEC 62915 Standards | Confidential</div>
</body>
</html>`;

    const win = window.open('', '_blank', 'width=1100,height=800');
    if (win) {
      win.document.write(html);
      win.document.close();
      win.focus();
      setTimeout(() => win.print(), 800);
    }
  };

  return (
    <div className="space-y-6">
      {/* Column selection */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-2">Select Columns for CSV</h3>
        <div className="flex flex-wrap gap-2">
          {ALL_COLUMNS.map((col) => (
            <button
              key={col.key}
              onClick={() => toggleColumn(col.key)}
              className={`px-3 py-1.5 text-xs rounded-full font-medium transition-all ${
                selectedColumns.has(col.key)
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {col.label}
            </button>
          ))}
        </div>
      </div>

      {/* Export buttons */}
      <div className="flex flex-wrap gap-3">
        <button onClick={handleExportCSV} className="btn-primary">
          <Download size={16} />
          Export CSV
        </button>
        <button
          onClick={handlePrint}
          className="btn-primary"
          style={{ background: 'linear-gradient(135deg,#1e3a5f,#3b82f6)' }}
        >
          <Printer size={16} />
          Print / Save PDF
        </button>
        <button onClick={handlePrint} className="btn-secondary">
          <FileText size={16} />
          Full Report
        </button>
      </div>

      {/* Hint banner */}
      <div className="rounded-xl bg-blue-50 border border-blue-200 px-4 py-3 text-xs text-blue-700 flex gap-2 items-start">
        <BarChart3 size={14} className="mt-0.5 shrink-0" />
        <span><strong>Print / Save PDF</strong> opens a formatted report with bar chart, pie chart, utilization gauges, and data table — all on properly paged A4 landscape layout with no repeated headers.</span>
      </div>

      {/* Preview table */}
      {results.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50">
                {ALL_COLUMNS.filter((c) => selectedColumns.has(c.key)).map((col) => (
                  <th key={col.key} className="px-4 py-3 text-left font-semibold text-slate-600">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {results.map((r) => (
                <tr key={r.chamberType} className="hover:bg-slate-50 transition-all">
                  {selectedColumns.has('chamberType') && (
                    <td className="px-4 py-3 font-medium">
                      {CHAMBERS.find((c) => c.id === r.chamberType)?.name || r.chamberType}
                    </td>
                  )}
                  {selectedColumns.has('chambersNeeded') && (
                    <td className="px-4 py-3">{r.chambersNeeded}</td>
                  )}
                  {selectedColumns.has('utilizationPct') && (
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                          r.utilizationPct > 85
                            ? 'bg-red-100 text-red-700'
                            : r.utilizationPct > 65
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {r.utilizationPct}%
                      </span>
                    </td>
                  )}
                  {selectedColumns.has('totalTestHrs') && (
                    <td className="px-4 py-3">{r.totalTestHrs.toLocaleString()}</td>
                  )}
                  {selectedColumns.has('bottleneck') && (
                    <td className="px-4 py-3">
                      {r.bottleneck && (
                        <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          Bottleneck
                        </span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {results.length === 0 && (
        <div className="empty-state">
          <Download size={32} className="text-slate-300 mb-2" />
          <p className="text-sm">No results to export.</p>
          <p className="text-xs mt-1">Run calculations first to generate exportable data.</p>
        </div>
      )}
    </div>
  );
}
}
