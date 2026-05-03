import type { Metadata } from 'next';
import { Inter, Noto_Sans_Thai } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n/request';
import { Nav } from '@/components/layout/nav';
import { Footer } from '@/components/layout/footer';
import '../globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const notoThai = Noto_Sans_Thai({
  subsets: ['thai'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-noto-thai',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Go Travel — Tours, Trips, Private Groups',
  description: 'Curated tours across Asia. Book online with ease.',
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} ${notoThai.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Nav />
          <main className="mx-auto max-w-7xl px-8">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
