import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes with clsx */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Format a number with locale-aware separators */
export function formatNumber(value: number, decimals: number = 0): string {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/** Format a percentage */
export function formatPercent(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/** Escape a CSV value */
function escapeCSV(val: string): string {
  if (val.includes(',') || val.includes('"') || val.includes('\n')) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}

/** Trigger download of a CSV string */
function downloadCSV(csvString: string, filename: string): void {
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/** Export data as CSV (object array format) and trigger download */
export function exportToCSV(
  headersOrData: string[] | Record<string, string | number>[],
  rowsOrFilename?: string[][] | string,
  filename?: string
): void {
  // Overload: exportToCSV(headers: string[], rows: string[][], filename: string)
  if (Array.isArray(headersOrData) && typeof headersOrData[0] === 'string' && Array.isArray(rowsOrFilename)) {
    const headers = headersOrData as string[];
    const rows = rowsOrFilename as string[][];
    const csvRows = [
      headers.map(escapeCSV).join(','),
      ...rows.map((row) => row.map(escapeCSV).join(',')),
    ];
    downloadCSV(csvRows.join('\n'), filename || 'export.csv');
    return;
  }

  // Original: exportToCSV(data: Record[], filename: string)
  const data = headersOrData as Record<string, string | number>[];
  const fname = (rowsOrFilename as string) || 'export.csv';
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map((row) =>
      headers.map((h) => escapeCSV(String(row[h] ?? ''))).join(',')
    ),
  ];
  downloadCSV(csvRows.join('\n'), fname);
}

/** Alias for components that import as exportCSV */
export const exportCSV = exportToCSV;
