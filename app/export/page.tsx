"use client";

import { useRef } from "react";
import { FileDown, Printer, FileSpreadsheet, FileText } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { calculateAllChambers, totalChambersNeeded, averageUtilization } from "@/lib/formulas";
import { formatNumber, exportCSV } from "@/lib/utils";
import { useToast } from "@/components/toast";

const COLORS = ["#3b82f6","#8b5cf6","#06b6d4","#f59e0b","#ef4444","#10b981","#ec4899","#f97316"];

function BarChartSVG({ items }: { items: { name: string; val: number; col: string }[] }) {
  const max = Math.max(...items.map(d => d.val), 1);
  const W = 520, H = 180, pad = 44, bw = Math.min(36, (W - pad * 2) / items.length - 6);
  const g = (W - pad * 2) / items.length;
  return (
    <svg width={W} height={H} style={{ background: "#f8fafc", borderRadius: 8, display: "block" }}>
      <text x={W / 2} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#1e293b">Chambers by Type</text>
      <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke="#e2e8f0" />
      {items.map((d, i) => {
        const bH = Math.max(2, (d.val / max) * (H - pad - 34));
        const x = pad + i * g + (g - bw) / 2;
        return (<g key={i}><rect x={x} y={H - pad - bH} width={bw} height={bH} rx={4} fill={d.col} /><text x={x + bw / 2} y={H - pad - bH - 4} textAnchor="middle" fontSize={10} fill="#334155">{d.val}</text><text x={x + bw / 2} y={H - pad + 14} textAnchor="middle" fontSize={8} fill="#64748b">{d.name.slice(0, 10)}</text></g>);
      })}
    </svg>
  );
}

function PieChartSVG({ items }: { items: { name: string; val: number; col: string }[] }) {
  const tot = items.reduce((s, d) => s + d.val, 0) || 1;
  const R = 60, cx = 80, cy = 86;
  let a = -Math.PI / 2;
  return (
    <svg width={340} height={180} style={{ background: "#f8fafc", borderRadius: 8, display: "block" }}>
      <text x={cx} y={16} textAnchor="middle" fontSize={12} fontWeight={700} fill="#1e293b">Test Hours</text>
      {items.map((d, i) => {
        const p = d.val / tot;
        const e = a + p * 2 * Math.PI;
        const x1 = cx + R * Math.cos(a), y1 = cy + R * Math.sin(a);
        const x2 = cx + R * Math.cos(e), y2 = cy + R * Math.sin(e);
        const lf = p > 0.5 ? 1 : 0;
        const path = `M${cx},${cy} L${x1},${y1} A${R},${R} 0 ${lf},1 ${x2},${y2} Z`;
        a = e;
        return (<g key={i}><path d={path} fill={d.col} /><rect x={165} y={24 + i * 18} width={10} height={10} rx={2} fill={d.col} /><text x={180} y={33 + i * 18} fontSize={9} fill="#475569">{d.name.slice(0, 12)} {(p * 100).toFixed(0)}%</text></g>);
      })}
    </svg>
  );
}

function UtilBarsSVG({ items }: { items: { name: string; util: number }[] }) {
  const W = 520, rH = 20, top = 28;
  return (
    <svg width={W} height={top + items.length * rH + 8} style={{ background: "#f8fafc", borderRadius: 8, display: "block" }}>
      <text x={W / 2} y={16} textAnchor="middle" fontSize={12} fontWeight={700} fill="#1e293b">Utilization</text>
      {items.map((d, i) => {
        const y = top + i * rH;
        const w = (d.util / 100) * (W - 140);
        const c = d.util > 85 ? "#ef4444" : d.util > 65 ? "#f59e0b" : "#10b981";
        return (<g key={i}><text x={86} y={y + 13} textAnchor="end" fontSize={9} fill="#475569">{d.name.slice(0, 11)}</text><rect x={90} y={y + 1} width={W - 140} height={15} rx={3} fill="#e2e8f0" /><rect x={90} y={y + 1} width={w} height={15} rx={3} fill={c} /><text x={90 + w + 4} y={y + 13} fontSize={9} fill="#334155">{d.util}%</text></g>);
      })}
    </svg>
  );
}

export default function ExportPage() {
  const { calculationInput, departments, selectedStandard } = useAppStore();
  const { toast } = useToast();
  const reportRef = useRef<HTMLDivElement>(null);
  const results = calculateAllChambers(calculationInput);
  const activeResults = results.filter((r) => r.chambersRequired > 0);
  const total = totalChambersNeeded(results);
  const avgUtil = averageUtilization(results);

  const barItems = activeResults.map((r, i) => ({ name: r.chamberName, val: r.chambersRequired, col: COLORS[i % COLORS.length] }));
  const pieItems = activeResults.map((r, i) => ({ name: r.chamberName, val: r.totalTestHours, col: COLORS[i % COLORS.length] }));
  const utilItems = activeResults.map(r => ({ name: r.chamberName, util: r.utilization }));

  const handleExportCSV = () => {
    const headers = ["Chamber","Slots","Total Test Hours","Chambers Needed","Utilization %"];
    const rows = activeResults.map(r => [r.chamberName, String(r.slots), String(r.totalTestHours), String(r.chambersRequired), String(r.utilization)]);
    rows.push(["TOTAL","","",String(total),String(avgUtil)]);
    exportCSV(headers, rows, "pareeksha-chamber-report.csv");
    toast("CSV exported", "success");
  };

  const handleExportExcel = async () => {
    try {
      const XLSX = await import("xlsx");
      const wb = XLSX.utils.book_new();
      const d1 = activeResults.map(r => ({ Chamber: r.chamberName, Slots: r.slots, TestHours: r.totalTestHours, Needed: r.chambersRequired, Utilization: r.utilization }));
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(d1), "Chambers");
      const d2 = departments.map(d => ({ Department: d.name, Projects: d.projectsPerYear, BoMs: d.bomsPerProject, Modules: d.modulesPerBom, Total: d.projectsPerYear * d.bomsPerProject * d.modulesPerBom }));
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(d2), "Departments");
      XLSX.writeFile(wb, "pareeksha-report.xlsx");
      toast("Excel exported", "success");
    } catch { toast("Excel export failed", "error"); }
  };

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    try {
      toast("Generating PDF...", "info");
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");
      const canvas = await html2canvas(reportRef.current, { scale: 2, useCORS: true, backgroundColor: "#ffffff", logging: false });
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pw = pdf.internal.pageSize.getWidth();
      const ph = pdf.internal.pageSize.getHeight();
      const ih = (canvas.height * pw) / canvas.width;
      let left = ih;
      let pos = 0;
      pdf.addImage(img, "PNG", 0, pos, pw, ih);
      left -= ph;
      while (left > 0) { pos -= ph; pdf.addPage(); pdf.addImage(img, "PNG", 0, pos, pw, ih); left -= ph; }
      pdf.save("pareeksha-report.pdf");
      toast("PDF exported", "success");
    } catch { toast("PDF failed", "error"); }
  };

  return (
    <div className="space-y-6">
      <div className="no-print flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Export Report</h1>
          <p className="mt-1 text-sm text-slate-500">Download or print with charts</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleExportCSV} className="btn-primary"><FileDown size={16} /> CSV</button>
          <button onClick={handleExportExcel} className="btn-primary bg-emerald-600 hover:bg-emerald-700"><FileSpreadsheet size={16} /> Excel</button>
          <button onClick={handleExportPDF} className="btn-primary bg-red-600 hover:bg-red-700"><FileText size={16} /> PDF</button>
          <button onClick={() => window.print()} className="btn-secondary"><Printer size={16} /> Print</button>
        </div>
      </div>

      <div ref={reportRef} className="card bg-white text-slate-900" style={{ color: "#0f172a", background: "#fff" }}>
        <div className="mb-6 border-b-2 border-blue-600 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-lg font-bold text-white">P</div>
            <div>
              <h2 className="text-xl font-bold" style={{ color: "#0f172a" }}>Pareeksha Chamber Estimation Report</h2>
              <p className="text-sm" style={{ color: "#64748b" }}>IEC 61215 / IEC 62915 | v1.0.0</p>
            </div>
          </div>
          <div className="text-right text-sm" style={{ color: "#64748b" }}>
            <p>Standard: <strong>{selectedStandard}</strong></p>
            <p>{new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</p>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-4 gap-3">
          {[{ v: total, l: "Total Chambers", bg: "#eff6ff", c: "#2563eb" }, { v: avgUtil + "%", l: "Avg Utilization", bg: "#ecfdf5", c: "#059669" }, { v: activeResults.length, l: "Chamber Types", bg: "#fffbeb", c: "#d97706" }, { v: departments.length, l: "Departments", bg: "#fef2f2", c: "#dc2626" }].map((k, i) => (
            <div key={i} className="rounded-xl p-3 text-center" style={{ background: k.bg }}>
              <p className="text-2xl font-bold" style={{ color: k.c }}>{k.v}</p>
              <p className="text-xs mt-1" style={{ color: "#64748b" }}>{k.l}</p>
            </div>
          ))}
        </div>

        <div className="mb-5">
          <h3 className="mb-2 text-sm font-semibold" style={{ color: "#0f172a" }}>Input Parameters</h3>
          <div className="grid grid-cols-4 gap-2 text-sm">
            <div><span style={{ color: "#64748b" }}>Projects: </span><strong>{calculationInput.projects}</strong></div>
            <div><span style={{ color: "#64748b" }}>BoMs: </span><strong>{calculationInput.boms}</strong></div>
            <div><span style={{ color: "#64748b" }}>Modules: </span><strong>{calculationInput.modules}</strong></div>
            <div><span style={{ color: "#64748b" }}>Realisation: </span><strong>{Math.round(calculationInput.realisationRate * 100)}%</strong></div>
          </div>
        </div>

        {activeResults.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-semibold" style={{ color: "#0f172a" }}>Visual Analysis</h3>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <BarChartSVG items={barItems} />
              <PieChartSVG items={pieItems} />
            </div>
            <div className="mt-3"><UtilBarsSVG items={utilItems} /></div>
          </div>
        )}

        <h3 className="mb-2 text-sm font-semibold" style={{ color: "#0f172a" }}>Chamber Requirements</h3>
        <table className="w-full text-sm mb-6" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#1e3a5f", color: "#fff" }}>
              <th className="px-3 py-2 text-left" style={{ fontWeight: 600 }}>Chamber</th>
              <th className="px-3 py-2 text-right" style={{ fontWeight: 600 }}>Slots</th>
              <th className="px-3 py-2 text-right" style={{ fontWeight: 600 }}>Test Hours</th>
              <th className="px-3 py-2 text-right" style={{ fontWeight: 600 }}>Chambers</th>
              <th className="px-3 py-2 text-right" style={{ fontWeight: 600 }}>Utilization</th>
            </tr>
          </thead>
          <tbody>
            {activeResults.map((r, i) => (
              <tr key={r.chamberType} style={{ borderBottom: "1px solid #f1f5f9", background: i % 2 ? "#f8fafc" : "#fff" }}>
                <td className="px-3 py-2">{r.chamberName}</td>
                <td className="px-3 py-2 text-right" style={{ color: "#64748b" }}>{r.slots}</td>
                <td className="px-3 py-2 text-right" style={{ color: "#64748b" }}>{formatNumber(r.totalTestHours)}</td>
                <td className="px-3 py-2 text-right font-semibold">{r.chambersRequired}</td>
                <td className="px-3 py-2 text-right"><span style={{ color: r.utilization > 85 ? "#dc2626" : r.utilization > 65 ? "#d97706" : "#059669", fontWeight: 600 }}>{r.utilization}%</span></td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ borderTop: "2px solid #cbd5e1", background: "#f1f5f9" }}>
              <td className="px-3 py-2 font-bold" colSpan={3}>Total</td>
              <td className="px-3 py-2 text-right font-bold">{total}</td>
              <td className="px-3 py-2 text-right font-bold">{avgUtil}%</td>
            </tr>
          </tfoot>
        </table>

        <h3 className="mb-2 text-sm font-semibold" style={{ color: "#0f172a" }}>Department Demand</h3>
        <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#1e3a5f", color: "#fff" }}>
              <th className="px-3 py-2 text-left" style={{ fontWeight: 600 }}>Department</th>
              <th className="px-3 py-2 text-right" style={{ fontWeight: 600 }}>Projects/yr</th>
              <th className="px-3 py-2 text-right" style={{ fontWeight: 600 }}>BoMs</th>
              <th className="px-3 py-2 text-right" style={{ fontWeight: 600 }}>Modules</th>
              <th className="px-3 py-2 text-right" style={{ fontWeight: 600 }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((d, i) => (
              <tr key={d.id} style={{ borderBottom: "1px solid #f1f5f9", background: i % 2 ? "#f8fafc" : "#fff" }}>
                <td className="px-3 py-2">{d.name}</td>
                <td className="px-3 py-2 text-right" style={{ color: "#64748b" }}>{d.projectsPerYear}</td>
                <td className="px-3 py-2 text-right" style={{ color: "#64748b" }}>{d.bomsPerProject}</td>
                <td className="px-3 py-2 text-right" style={{ color: "#64748b" }}>{d.modulesPerBom}</td>
                <td className="px-3 py-2 text-right font-semibold">{d.projectsPerYear * d.bomsPerProject * d.modulesPerBom}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-8 pt-4 flex items-center justify-between text-xs" style={{ borderTop: "1px solid #e2e8f0", color: "#94a3b8" }}>
          <span>Pareeksha v1.0.0 | {new Date().toLocaleString("en-IN")}</span>
          <span>Confidential</span>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `@media print { .no-print { display: none !important; } @page { size: A4 portrait; margin: 15mm; } table { page-break-inside: avoid; } thead { display: table-header-group; } tr { page-break-inside: avoid; } }` }} />
    </div>
  );
}
