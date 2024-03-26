import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import ChartExplorer from './components/ChartExplorer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'iron vision',
  description: 'the path to iron',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <ChartExplorer />
      </body>
    </html>
  );
}
