"use client";

import { useRef } from "react";
import { FileDown, Printer, FileSpreadsheet, FileText } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { calculateAllChambers, totalChambersNeeded, averageUtilization } from "@/lib/formulas";
import { formatNumber, exportCSV } from "@/lib/utils";
import { useToast } from "@/components/toast";

export default function ExportPage() {
  const { calculationInput, departments, selectedStandard } = useAppStore();
  const { toast } = useToast();
  const reportRef = useRef<HTMLDivElement>(null);
  const results = calculateAllChambers(calculationInput);
  const activeResults = results.filter((r) => r.chambersRequired > 0);
  const total = totalChambersNeeded(results);
  const avgUtil = averageUtilization(results);

  const handleExportCSV = () => {
    const headers = ["Chamber", "Slots", "Total Test Hours", "Chambers Needed", "Utilization %"];
    const rows = activeResults.map((r) => [
      r.chamberName,
      String(r.slots),
      String(r.totalTestHours),
      String(r.chambersRequired),
      String(r.utilization),
    ]);
    rows.push(["TOTAL", "", "", String(total), String(avgUtil)]);
    exportCSV(headers, rows, "pareeksha-chamber-report.csv");
    toast("CSV exported successfully", "success");
  };

  const handleExportExcel = async () => {
    try {
      const XLSX = await import("xlsx");
      const wb = XLSX.utils.book_new();

      // Chamber data sheet
      const chamberData = activeResults.map((r) => ({
        "Chamber": r.chamberName,
        "Slots": r.slots,
        "Total Test Hours": r.totalTestHours,
        "Chambers Needed": r.chambersRequired,
        "Utilization %": r.utilization,
      }));
      chamberData.push({
        "Chamber": "TOTAL",
        "Slots": 0,
        "Total Test Hours": 0,
        "Chambers Needed": total,
        "Utilization %": avgUtil,
      });
      const ws1 = XLSX.utils.json_to_sheet(chamberData);
      XLSX.utils.book_append_sheet(wb, ws1, "Chamber Requirements");

      // Department data sheet
      const deptData = departments.map((dept) => ({
        "Department": dept.name,
        "Projects/Year": dept.projectsPerYear,
        "BoMs/Project": dept.bomsPerProject,
        "Modules/BoM": dept.modulesPerBom,
        "Total Modules": dept.projectsPerYear * dept.bomsPerProject * dept.modulesPerBom,
        "Standard": dept.standardId,
      }));
      const ws2 = XLSX.utils.json_to_sheet(deptData);
      XLSX.utils.book_append_sheet(wb, ws2, "Departments");

      // Parameters sheet
      const paramData = [
        { "Parameter": "Projects/Year", "Value": calculationInput.projects },
        { "Parameter": "BoMs/Project", "Value": calculationInput.boms },
        { "Parameter": "Modules/BoM", "Value": calculationInput.modules },
        { "Parameter": "Realisation Rate", "Value": `${Math.round(calculationInput.realisationRate * 100)}%` },
        { "Parameter": "Work Hours/Year", "Value": calculationInput.workHoursPerYear },
        { "Parameter": "Standard", "Value": selectedStandard },
        { "Parameter": "Generated", "Value": new Date().toLocaleDateString("en-IN") },
      ];
      const ws3 = XLSX.utils.json_to_sheet(paramData);
      XLSX.utils.book_append_sheet(wb, ws3, "Parameters");

      XLSX.writeFile(wb, "pareeksha-report.xlsx");
      toast("Excel report exported", "success");
    } catch {
      toast("Failed to export Excel", "error");
    }
  };

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    try {
      toast("Generating PDF...", "info");
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = pdfHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();

      while (heightLeft > 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }

      pdf.save("pareeksha-report.pdf");
      toast("PDF exported successfully", "success");
    } catch {
      toast("Failed to generate PDF", "error");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="no-print flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Export Report</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Download or print your chamber estimation report
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleExportCSV} className="btn-primary">
            <FileDown size={16} /> CSV
          </button>
          <button onClick={handleExportExcel} className="btn-primary bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600">
            <FileSpreadsheet size={16} /> Excel
          </button>
          <button onClick={handleExportPDF} className="btn-primary bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600">
            <FileText size={16} /> PDF
          </button>
          <button onClick={handlePrint} className="btn-secondary">
            <Printer size={16} /> Print
          </button>
        </div>
      </div>

      {/* Report template */}
      <div ref={reportRef} className="card bg-white dark:bg-white text-slate-900" style={{ color: "#0f172a" }}>
        {/* Company branding placeholder */}
        <div className="mb-6 border-b-2 border-blue-600 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-lg font-bold text-white">
                  P
                </div>
                <div>
                  <h2 className="text-xl font-bold" style={{ color: "#0f172a" }}>Pareeksha - Chamber Estimation Report</h2>
                  <p className="text-sm" style={{ color: "#64748b" }}>Environmental Chamber Quantity Estimator v1.0.0</p>
                </div>
              </div>
            </div>
            <div className="text-right text-sm" style={{ color: "#64748b" }}>
              <p>Standard: <strong>{selectedStandard}</strong></p>
              <p>Date: {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</p>
              <p className="text-xs mt-1" style={{ color: "#94a3b8" }}>[Company Logo Placeholder]</p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg p-3 text-center" style={{ backgroundColor: "#eff6ff" }}>
            <p className="text-2xl font-bold" style={{ color: "#2563eb" }}>{total}</p>
            <p className="text-xs" style={{ color: "#64748b" }}>Total Chambers</p>
          </div>
          <div className="rounded-lg p-3 text-center" style={{ backgroundColor: "#ecfdf5" }}>
            <p className="text-2xl font-bold" style={{ color: "#059669" }}>{avgUtil}%</p>
            <p className="text-xs" style={{ color: "#64748b" }}>Avg Utilization</p>
          </div>
          <div className="rounded-lg p-3 text-center" style={{ backgroundColor: "#fffbeb" }}>
            <p className="text-2xl font-bold" style={{ color: "#d97706" }}>{activeResults.length}</p>
            <p className="text-xs" style={{ color: "#64748b" }}>Chamber Types</p>
          </div>
          <div className="rounded-lg p-3 text-center" style={{ backgroundColor: "#fef2f2" }}>
            <p className="text-2xl font-bold" style={{ color: "#dc2626" }}>{departments.length}</p>
            <p className="text-xs" style={{ color: "#64748b" }}>Departments</p>
          </div>
        </div>

        {/* Inputs */}
        <div className="mb-6">
          <h3 className="mb-2 font-semibold" style={{ color: "#0f172a" }}>Input Parameters</h3>
          <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
            <div><span style={{ color: "#64748b" }}>Projects:</span> <strong>{calculationInput.projects}</strong></div>
            <div><span style={{ color: "#64748b" }}>BoMs/Project:</span> <strong>{calculationInput.boms}</strong></div>
            <div><span style={{ color: "#64748b" }}>Modules/BoM:</span> <strong>{calculationInput.modules}</strong></div>
            <div><span style={{ color: "#64748b" }}>Realisation:</span> <strong>{Math.round(calculationInput.realisationRate * 100)}%</strong></div>
          </div>
        </div>

        {/* Results table */}
        <h3 className="mb-2 font-semibold" style={{ color: "#0f172a" }}>Chamber Requirements</h3>
        <table className="w-full text-sm mb-6" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
              <th className="px-3 py-2 text-left font-semibold" style={{ color: "#334155" }}>Chamber</th>
              <th className="px-3 py-2 text-right font-semibold" style={{ color: "#334155" }}>Slots</th>
              <th className="px-3 py-2 text-right font-semibold" style={{ color: "#334155" }}>Test Hours</th>
              <th className="px-3 py-2 text-right font-semibold" style={{ color: "#334155" }}>Chambers</th>
              <th className="px-3 py-2 text-right font-semibold" style={{ color: "#334155" }}>Utilization</th>
            </tr>
          </thead>
          <tbody>
            {activeResults.map((r) => (
              <tr key={r.chamberType} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td className="px-3 py-2" style={{ color: "#0f172a" }}>{r.chamberName}</td>
                <td className="px-3 py-2 text-right" style={{ color: "#64748b" }}>{r.slots}</td>
                <td className="px-3 py-2 text-right" style={{ color: "#64748b" }}>{formatNumber(r.totalTestHours)}</td>
                <td className="px-3 py-2 text-right font-semibold" style={{ color: "#0f172a" }}>{r.chambersRequired}</td>
                <td className="px-3 py-2 text-right">
                  <span style={{
                    color: r.utilization > 85 ? "#dc2626" : r.utilization > 65 ? "#d97706" : "#059669",
                    fontWeight: 600,
                  }}>
                    {r.utilization}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ borderTop: "2px solid #cbd5e1" }}>
              <td className="px-3 py-2 font-bold" colSpan={3} style={{ color: "#0f172a" }}>Total</td>
              <td className="px-3 py-2 text-right font-bold" style={{ color: "#0f172a" }}>{total}</td>
              <td className="px-3 py-2 text-right font-bold" style={{ color: "#0f172a" }}>{avgUtil}%</td>
            </tr>
          </tfoot>
        </table>

        {/* Departments summary */}
        <h3 className="mb-2 font-semibold" style={{ color: "#0f172a" }}>Department Demand</h3>
        <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
              <th className="px-3 py-2 text-left font-semibold" style={{ color: "#334155" }}>Department</th>
              <th className="px-3 py-2 text-right font-semibold" style={{ color: "#334155" }}>Projects/yr</th>
              <th className="px-3 py-2 text-right font-semibold" style={{ color: "#334155" }}>BoMs/proj</th>
              <th className="px-3 py-2 text-right font-semibold" style={{ color: "#334155" }}>Modules/BoM</th>
              <th className="px-3 py-2 text-right font-semibold" style={{ color: "#334155" }}>Total Modules</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr key={dept.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td className="px-3 py-2" style={{ color: "#0f172a" }}>{dept.name}</td>
                <td className="px-3 py-2 text-right" style={{ color: "#64748b" }}>{dept.projectsPerYear}</td>
                <td className="px-3 py-2 text-right" style={{ color: "#64748b" }}>{dept.bomsPerProject}</td>
                <td className="px-3 py-2 text-right" style={{ color: "#64748b" }}>{dept.modulesPerBom}</td>
                <td className="px-3 py-2 text-right font-semibold" style={{ color: "#0f172a" }}>
                  {dept.projectsPerYear * dept.bomsPerProject * dept.modulesPerBom}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer */}
        <div className="mt-8 pt-4" style={{ borderTop: "1px solid #e2e8f0" }}>
          <div className="flex items-center justify-between text-xs" style={{ color: "#94a3b8" }}>
            <span>Generated by Pareeksha v1.0.0</span>
            <span>Confidential - For internal use only</span>
          </div>
        </div>
      </div>
    </div>
  );
}
