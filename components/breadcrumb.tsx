"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

const PAGE_NAMES: Record<string, string> = {
  "/": "Dashboard",
  "/bom-matrix": "BoM Matrix",
  "/calculator": "Calculator",
  "/reliability": "Reliability",
  "/departments": "Departments",
  "/standards": "Standards",
  "/export": "Export",
};

export default function Breadcrumb() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  const pageName = PAGE_NAMES[pathname] ?? pathname.slice(1);

  return (
    <nav className="mb-4 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
      <Link href="/" className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition">
        <Home size={14} />
        <span>Home</span>
      </Link>
      <ChevronRight size={14} className="text-slate-300 dark:text-slate-600" />
      <span className="font-medium text-slate-800 dark:text-slate-200">{pageName}</span>
    </nav>
  );
}
