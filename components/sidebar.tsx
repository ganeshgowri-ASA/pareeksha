"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Grid3X3,
  Calculator,
  ShieldCheck,
  Building2,
  BookOpen,
  FileDown,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "./theme-provider";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/bom-matrix", label: "BoM Matrix", icon: Grid3X3 },
  { href: "/calculator", label: "Calculator", icon: Calculator },
  { href: "/reliability", label: "Reliability", icon: ShieldCheck },
  { href: "/departments", label: "Departments", icon: Building2 },
  { href: "/standards", label: "Standards", icon: BookOpen },
  { href: "/export", label: "Export", icon: FileDown },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed left-4 top-4 z-50 rounded-lg bg-white dark:bg-slate-800 p-2 shadow-md lg:hidden"
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-full w-[260px] flex-col border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 transition-transform lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center gap-3 border-b border-slate-200 dark:border-slate-700 px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-sm font-bold text-white shadow-sm">
            P
          </div>
          <div>
            <span className="text-lg font-semibold text-slate-900 dark:text-white">
              Pareeksha
            </span>
            <span className="ml-2 rounded bg-blue-100 dark:bg-blue-900 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 dark:text-blue-300">
              v1.0
            </span>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                <Icon size={18} />
                {label}
                {isActive && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 dark:border-slate-700 p-4 space-y-3">
          <button
            onClick={toggleTheme}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>
          <p className="text-xs text-slate-400 dark:text-slate-500 px-3">
            Chamber Estimation Tool v1.0.0
          </p>
        </div>
      </aside>
    </>
  );
}
