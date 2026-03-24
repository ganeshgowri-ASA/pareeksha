import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pareeksha - Chamber Estimation Tool",
  description: "Environmental chamber quantity estimation for solar PV manufacturing",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50">
        <div className="flex min-h-screen">
          <nav className="sidebar w-64 bg-slate-900 text-white p-4 flex-shrink-0 no-print">
            <div className="mb-8">
              <h1 className="text-xl font-bold text-sky-400">Pareeksha</h1>
              <p className="text-xs text-slate-400 mt-1">Chamber Estimation Tool</p>
            </div>
            <ul className="space-y-1">
              {[
                { href: "/", label: "Dashboard" },
                { href: "/bom-matrix", label: "BoM Matrix" },
                { href: "/calculator", label: "Calculator" },
                { href: "/reliability", label: "Reliability" },
                { href: "/departments", label: "Departments" },
                { href: "/standards", label: "Standards" },
                { href: "/export", label: "Export" },
              ].map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="block px-3 py-2 rounded-md text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-all-smooth focus-ring"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <main className="flex-1 p-6 overflow-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
