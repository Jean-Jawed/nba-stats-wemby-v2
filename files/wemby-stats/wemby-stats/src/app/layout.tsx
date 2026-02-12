import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "Victor Wembanyama - L'Alien",
  description: "Stats et performances de Victor Wembanyama avec les San Antonio Spurs",
  icons: {
    icon: '/assets/images/logo.jpg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
