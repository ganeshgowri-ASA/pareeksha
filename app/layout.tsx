import type { Metadata } from "next";
import Sidebar from "@/components/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/components/toast";
import Breadcrumb from "@/components/breadcrumb";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pareeksha v1.0 - Chamber Estimation Tool",
  description: "Environmental chamber quantity estimation for PV module qualification testing",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased transition-colors duration-300">
        <ThemeProvider>
          <ToastProvider>
            <Sidebar />
            <main className="min-h-screen lg:pl-[260px]">
              <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <Breadcrumb />
                {children}
              </div>
            </main>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
