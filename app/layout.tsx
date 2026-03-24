import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pareeksha - Chamber Estimation Tool',
  description: 'Environmental chamber quantity estimation for PV module testing',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
