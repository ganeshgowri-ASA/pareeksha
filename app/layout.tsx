import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/sidebar';

export const metadata: Metadata = {
  title: 'Pareeksha - Chamber Estimation Tool',
  description: 'Environmental chamber quantity estimation for manufacturing units and labs',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Sidebar />
        <main className="md:ml-64 min-h-screen bg-surface-50 p-6 md:p-8">
          {children}
        </main>
      </body>
    </html>
  );
}
