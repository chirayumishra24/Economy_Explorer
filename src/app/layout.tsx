import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Economy Explorer | NCERT Grade 6 Social Science Chapter 14',
  description: 'A complete, interactive digital learning experience for NCERT Grade 6 Social Science Chapter 14: Economic Activities Around Us.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-ncert-warm-bg text-gray-900 antialiased font-sans flex flex-col">
        {children}
      </body>
    </html>
  );
}
