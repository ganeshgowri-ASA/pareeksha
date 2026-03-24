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

/** Export data as CSV (headers + rows variant used by SHILPA export page) */
export function exportCSV(
  headers: string[],
  rows: string[][],
  filename: string = 'export.csv'
): void {
  const csvRows = [
    headers.join(','),
    ...rows.map((row) =>
      row
        .map((val) => {
          const str = String(val ?? '');
          if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        })
        .join(',')
    ),
  ];

  const csvString = csvRows.join('\n');
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

/** Export data as CSV (record variant used by DARSHANA export panel) */
export function exportToCSV(
  headersOrData: string[] | Record<string, string | number>[],
  rowsOrFilename?: string[][] | string,
  filename?: string
): void {
  // If first arg is an array of strings (headers), use headers+rows format
  if (
    Array.isArray(headersOrData) &&
    headersOrData.length > 0 &&
    typeof headersOrData[0] === 'string'
  ) {
    exportCSV(
      headersOrData as string[],
      (rowsOrFilename as string[][]) || [],
      filename || 'export.csv'
    );
    return;
  }

  // Otherwise treat as record-based format
  const data = headersOrData as Record<string, string | number>[];
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const rows = data.map((row) =>
    headers.map((h) => String(row[h] ?? ''))
  );
  exportCSV(headers, rows, (rowsOrFilename as string) || 'export.csv');
}
