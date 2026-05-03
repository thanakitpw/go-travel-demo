import type { Metadata } from 'next';
import { Inter, Noto_Sans_Thai } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const notoThai = Noto_Sans_Thai({
  subsets: ['thai'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-noto-thai',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Go Travel',
  description: 'Tour booking made simple.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={`${inter.variable} ${notoThai.variable}`}>
      <body>{children}</body>
    </html>
  );
}
