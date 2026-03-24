'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  Grid3X3,
  Calculator,
  Shield,
  Building2,
  BookOpen,
  Download,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/bom-matrix', label: 'BoM Matrix', icon: Grid3X3 },
  { href: '/calculator', label: 'Calculator', icon: Calculator },
  { href: '/reliability', label: 'Reliability', icon: Shield },
  { href: '/departments', label: 'Departments', icon: Building2 },
  { href: '/standards', label: 'Standards', icon: BookOpen },
  { href: '/export', label: 'Export', icon: Download },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 md:hidden rounded-lg bg-white p-2 shadow-md focus-ring"
        onClick={() => setOpen(!open)}
        aria-label="Toggle navigation"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={cn(
          'sidebar fixed top-0 left-0 z-40 h-full w-64 bg-surface-900 text-white flex flex-col transition-transform duration-200',
          'md:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="p-6 border-b border-surface-700">
          <h1 className="text-xl font-bold tracking-tight">Pareeksha</h1>
          <p className="text-xs text-surface-400 mt-1">Chamber Estimation Tool</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-smooth focus-ring',
                  isActive
                    ? 'bg-primary-600 text-white'
                    : 'text-surface-300 hover:bg-surface-800 hover:text-white'
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-surface-700 text-xs text-surface-500">
          v0.1.0
        </div>
      </aside>
    </>
  );
}
