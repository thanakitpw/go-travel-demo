import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('home');
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold whitespace-pre-line">{t('heroTitle')}</h1>
      <p className="mt-4 text-ink-muted">{t('heroSub')}</p>
    </main>
  );
}
