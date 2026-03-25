"use client";

import { useRef, useMemo } from "react";
import { FileDown, Printer, FileSpreadsheet, FileText } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { calculateAllChambers, totalChambersNeeded, averageUtilization } from "@/lib/formulas";
import { formatNumber, exportCSV } from "@/lib/utils";
import { useToast } from "@/components/toast";

/* ── inline SVG chart components (render inside reportRef so html2canvas captures them) ── */
function BarChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const maxVal = Math.max(...data.map(d => d.value), 1);
  const W = 520, H = 180, pad = 44, barW = Math.min(40, (W - pad * 2) / data.length - 8);
  const gap = (W - pad * 2) / data.length;
  return (
    <svg width={W} height={H} style={{ display: 'block', borderRadius: 8, background: '#f8fafc' }}>
      <text x={W / 2} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#1e293b">Chambers Required by Type</text>
      <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke="#e2e8f0" />
      {data.map((d, i) => {
        const bH = Math.max(2, (d.value / maxVal) * (H - pad - 34));
        const x = pad + i * gap + (gap - barW) / 2;
        const y = H - pad - bH;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={bH} rx={4} fill={d.color} />
            <text x={x + barW / 2} y={y - 5} textAnchor="middle" fontSize={10} fill="#334155">{d.value}</text>
            <text x={x + barW / 2} y={H - pad + 14} textAnchor="middle" fontSize={8} fill="#64748b">{d.label.slice(0, 11)}</text>
          </g>
        );
      })}
    </svg>
  );
}

function PieChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const R = 65, cx = 85, cy = 90;
  let angle = -Math.PI / 2;
  const slices = data.map((d, i) => {
    const pct = d.value / total;
    const end = angle + pct * 2 * Math.PI;
    const x1 = cx + R * Math.cos(angle), y1 = cy + R * Math.sin(angle);
    const x2 = cx + R * Math.cos(end), y2 = cy + R * Math.sin(end);
    const large = pct > 0.5 ? 1 : 0;
    const path = `M${cx},${cy} L${x1},${y1} A${R},${R} 0 ${large},1 ${x2},${y2} Z`;
    angle = end;
    return { path, color: d.color, label: d.label, pct: (pct * 100).toFixed(0) };
  });
  return (
    <svg width={300} height={180} style={{ display: 'block', borderRadius: 8, background: '#f8fafc' }}>
      <text x={85} y={16} textAnchor="middle" fontSize={12} fontWeight={700} fill="#1e293b">Test Hours %</text>
      {slices.map((s, i) => <path key={i} d={s.path} fill={s.color} />)}
      {slices.map((s, i) => (
        <g key={i}>
          <rect x={170} y={24 + i * 20} width={10} height={10} rx={2} fill={s.color} />
          <text x={184} y={33 + i * 20} fontSize={9} fill="#475569">{s.label.slice(0, 13)} {s.pct}%</text>
        </g>
      ))}
    </svg>
  );
}

function UtilBars({ data }: { data: { label: string; util: number }[] }) {
  const W = 520, rowH = 22, top = 26;
  const color = (u: number) => u > 85 ? '#ef4444' : u > 65 ? '#f59e0b' : '#10b981';
  const barMax = W - 130;
  return (
    <svg width={W} height={top + data.length * rowH + 10} style={{ display: 'block', borderRadius: 8, background: '#f8fafc' }}>
      <text x={W / 2} y={16} textAnchor="middle" fontSize={12} fontWeight={700} fill="#1e293b">Chamber Utilization</text>
      {data.map((d, i) => {
        const y = top + i * rowH;
        const w = (d.util / 100) * barMax;
        return (
          <g key={i}>
            <text x={88} y={y + 14} textAnchor="end" fontSize={9} fill="#475569">{d.label.slice(0, 12)}</text>
            <rect x={92} y={y + 2} width={barMax} height={16} rx={4} fill="#e2e8f0" />
            <rect x={92} y={y + 2} width={w} height={16} rx={4} fill={color(d.util)} />
            <text x={92 + w + 4} y={y + 14} fontSize={9} fill="#334155">{d.util}%</text>
          </g>
        );
      })}
    </svg>
  );
}

const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#f59e0b', '#ef4444', '#10b981', '#ec4899', '#f97316'];

export default function ExportPage() {
  const { calculationInput, departments, selectedStandard } = useAppStore();
  const { toast } = useToast();
  const reportRef = useRef<HTMLDivElement>(null);
  const results = calculateAllChambers(calculationInput);
  const activeResults = results.filter((r) => r.chambersRequired > 0);
  const total = totalChambersNeeded(results);
  const avgUtil = averageUtilization(results);

  const barData = useMemo(() => activeResults.map((r, i) => ({ label: r.chamberName, value: r.chambersRequired, color: COLORS[i % COLORS.length] })), [activeResults]);
  const pieData = useMemo(() => activeResults.map((r, i) => ({ label: r.chamberName, value: r.totalTestHours, color: COLORS[i % COLORS.length] })), [activeResults]);
  const utilData = useMemo(() => activeResults.map(r => ({ label: r.chamberName, util: r.utilization })), [activeResults]);

  const handleExportCSV = () => {
    const headers = ["Chamber", "Slots", "Total Test Hours", "Chambers Needed", "Utilization %"];
    const rows = activeResults.map((r) => [r.chamberName, String(r.slots), String(r.totalTestHours), String(r.chambersRequired), String(r.utilization)]);
    rows.push(["TOTAL", "", "", String(total), String(avgUtil)]);
    exportCSV(headers, rows, "pareeksha-chamber-report.csv");
    toast("CSV exported successfully", "success");
  };

  const handleExportExcel = async () => {
    try {
      const XLSX = await import("xlsx");
      const wb = XLSX.utils.book_new();
      const chamberData = activeResults.map((r) => ({ "Chamber": r.chamberName, "Slots": r.slots, "Total Test Hours": r.totalTestHours, "Chambers Needed": r.chambersRequired, "Utilization %": r.utilization }));
      chamberData.push({ "Chamber": "TOTAL", "Slots": 0, "Total Test Hours": 0, "Chambers Needed": total, "Utilization %": avgUtil });
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(chamberData), "Chamber Requirements");
      const deptData = departments.map((d) => ({ "Department": d.name, "Projects/Year": d.projectsPerYear, "BoMs/Project": d.bomsPerProject, "Modules/BoM": d.modulesPerBom, "Total Modules": d.projectsPerYear * d.bomsPerProject * d.modulesPerBom, "Standard": d.standardId }));
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(deptData), "Departments");
      const paramData = [
        { "Parameter": "Projects/Year", "Value": calculationInput.projects },
        { "Parameter": "BoMs/Project", "Value": calculationInput.boms },
        { "Parameter": "Modules/BoM", "Value": calculationInput.modules },
        { "Parameter": "Realisation Rate", "Value": `${Math.round(calculationInput.realisationRate * 100)}%` },
        { "Parameter": "Work Hours/Year", "Value": calculationInput.workHoursPerYear },
        { "Parameter": "Standard", "Value": selectedStandard },
        { "Parameter": "Generated", "Value": new Date().toLocaleDateString("en-IN") },
      ];
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(paramData), "Parameters");
      XLSX.writeFile(wb, "pareeksha-report.xlsx");
      toast("Excel report exported", "success");
    } catch { toast("Failed to export Excel", "error"); }
  };

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    try {
      toast("Generating PDF...", "info");
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");
      const canvas = await html2canvas(reportRef.current, { scale: 2, useCORS: true, backgroundColor: "#ffffff", logging: false });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfPageH = pdf.internal.pageSize.getHeight();
      const imgH = (canvas.height * pdfW) / canvas.width;
      let heightLeft = imgH;
      let pos = 0;
      pdf.addImage(imgData, "PNG", 0, pos, pdfW, imgH);
      heightLeft -= pdfPageH;
      while (heightLeft > 0) {
        pos -= pdfPageH;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, pos, pdfW, imgH);
        heightLeft -= pdfPageH;
      }
      pdf.save("pareeksha-report.pdf");
      toast("PDF exported successfully", "success");
    } catch { toast("Failed to generate PDF", "error"); }
  };

  const handlePrint = () => window.print();

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="no-print flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Export Report</h1>
          <p className="mt-1 text-sm text-slate-500">Download or print your chamber estimation report with charts</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleExportCSV} className="btn-primary"><FileDown size={16} /> CSV</button>
          <button onClick={handleExportExcel} className="btn-primary bg-emerald-600 hover:bg-emerald-700"><FileSpreadsheet size={16} /> Excel</button>
          <button onClick={handleExportPDF} className="btn-primary bg-red-600 hover:bg-red-700"><FileText size={16} /> PDF</button>
          <button onClick={handlePrint} className="btn-secondary"><Printer size={16} /> Print</button>
        </div>
      </div>

      {/* ===== PRINTABLE / PDF REPORT ===== */}
      <div
        ref={reportRef}
        className="card bg-white text-slate-900 print:shadow-none print:border-0"
        style={{ color: '#0f172a', background: '#fff' }}
      >
        {/* Header */}
        <div className="mb-6 border-b-2 border-blue-600 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-lg font-bold text-white">P</div>
            <div>
              <h2 className="text-xl font-bold" style={{ color: '#0f172a' }}>Pareeksha — Chamber Estimation Report</h2>
              <p className="text-sm" style={{ color: '#64748b' }}>Environmental Chamber Quantity Estimator v1.0.0 | IEC 61215 / IEC 62915</p>
            </div>
          </div>
          <div className="text-right text-sm" style={{ color: '#64748b' }}>
            <p>Standard: <strong>{selectedStandard}</strong></p>
            <p>Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
          </div>
        </div>

        {/* KPI cards */}
        <div className="mb-6 grid grid-cols-4 gap-3">
          {[
            { val: total, lbl: 'Total Chambers', bg: '#eff6ff', col: '#2563eb' },
            { val: `${avgUtil}%`, lbl: 'Avg Utilization', bg: '#ecfdf5', col: '#059669' },
            { val: activeResults.length, lbl: 'Chamber Types', bg: '#fffbeb', col: '#d97706' },
            { val: departments.length, lbl: 'Departments', bg: '#fef2f2', col: '#dc2626' },
          ].map((k, i) => (
            <div key={i} className="rounded-xl p-3 text-center" style={{ background: k.bg }}>
              <p className="text-2xl font-bold" style={{ color: k.col }}>{k.val}</p>
              <p className="text-xs mt-1" style={{ color: '#64748b' }}>{k.lbl}</p>
            </div>
          ))}
        </div>

        {/* Input parameters */}
        <div className="mb-5">
          <h3 className="mb-2 text-sm font-semibold" style={{ color: '#0f172a' }}>Input Parameters</h3>
          <div className="grid grid-cols-4 gap-2 text-sm">
            <div><span style={{ color: '#64748b' }}>Projects: </span><strong>{calculationInput.projects}</strong></div>
            <div><span style={{ color: '#64748b' }}>BoMs/Project: </span><strong>{calculationInput.boms}</strong></div>
            <div><span style={{ color: '#64748b' }}>Modules/BoM: </span><strong>{calculationInput.modules}</strong></div>
            <div><span style={{ color: '#64748b' }}>Realisation: </span><strong>{Math.round(calculationInput.realisationRate * 100)}%</strong></div>
          </div>
        </div>

        {/* Charts row */}
        {activeResults.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-semibold" style={{ color: '#0f172a' }}>Visual Analysis</h3>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
              <BarChart data={barData} />
              <PieChart data={pieData} />
            </div>
            <div className="mt-3">
              <UtilBars data={utilData} />
            </div>
          </div>
        )}

        {/* Chamber table */}
        <h3 className="mb-2 text-sm font-semibold" style={{ color: '#0f172a' }}>Chamber Requirements</h3>
        <table className="w-full text-sm mb-6" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#1e3a5f', color: '#fff' }}>
              {['Chamber', 'Slots', 'Test Hours', 'Chambers', 'Utilization'].map((h, i) => (
                <th key={i} className="px-3 py-2" style={{ textAlign: i === 0 ? 'left' : 'right', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {activeResults.map((r, i) => (
              <tr key={r.chamberType} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                <td className="px-3 py-2">{r.chamberName}</td>
                <td className="px-3 py-2 text-right" style={{ color: '#64748b' }}>{r.slots}</td>
                <td className="px-3 py-2 text-right" style={{ color: '#64748b' }}>{formatNumber(r.totalTestHours)}</td>
                <td className="px-3 py-2 text-right font-semibold">{r.chambersRequired}</td>
                <td className="px-3 py-2 text-right">
                  <span style={{ color: r.utilization > 85 ? '#dc2626' : r.utilization > 65 ? '#d97706' : '#059669', fontWeight: 600 }}>
                    {r.utilization}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ borderTop: '2px solid #cbd5e1', background: '#f1f5f9' }}>
              <td className="px-3 py-2 font-bold" colSpan={3}>Total</td>
              <td className="px-3 py-2 text-right font-bold">{total}</td>
              <td className="px-3 py-2 text-right font-bold">{avgUtil}%</td>
            </tr>
          </tfoot>
        </table>

        {/* Departments table */}
        <h3 className="mb-2 text-sm font-semibold" style={{ color: '#0f172a' }}>Department Demand</h3>
        <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#1e3a5f', color: '#fff' }}>
              {['Department', 'Projects/yr', 'BoMs/proj', 'Modules/BoM', 'Total Modules'].map((h, i) => (
                <th key={i} className="px-3 py-2" style={{ textAlign: i === 0 ? 'left' : 'right', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {departments.map((dept, i) => (
              <tr key={dept.id} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                <td className="px-3 py-2">{dept.name}</td>
                <td className="px-3 py-2 text-right" style={{ color: '#64748b' }}>{dept.projectsPerYear}</td>
                <td className="px-3 py-2 text-right" style={{ color: '#64748b' }}>{dept.bomsPerProject}</td>
                <td className="px-3 py-2 text-right" style={{ color: '#64748b' }}>{dept.modulesPerBom}</td>
                <td className="px-3 py-2 text-right font-semibold">{dept.projectsPerYear * dept.bomsPerProject * dept.modulesPerBom}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer */}
        <div className="mt-8 pt-4 flex items-center justify-between text-xs" style={{ borderTop: '1px solid #e2e8f0', color: '#94a3b8' }}>
          <span>Generated by Pareeksha v1.0.0 — {new Date().toLocaleString('en-IN')}</span>
          <span>Confidential — For internal use only</span>
        </div>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; }
          @page { size: A4 portrait; margin: 15mm; }
          table { page-break-inside: avoid; }
          thead { display: table-header-group; }
          tr { page-break-inside: avoid; page-break-after: auto; }
          .card { box-shadow: none !important; border: none !important; }
        }
      `}</style>
    </div>
  );
}
