import type { Metadata } from 'next';
import '../src/index.css';

export const metadata: Metadata = {
  title: 'MeeChain Dashboard',
  description: 'Live MeeChain node telemetry, Magic Orb resonance, bridge operations, verification, and production code.',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'MeeChain Dashboard',
    description: 'Live blockchain operations and production verification console.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}