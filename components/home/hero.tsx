import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { ArrowRight, Star } from 'lucide-react';

export function Hero() {
  const t = useTranslations('home');
  const locale = useLocale();
  const prefix = locale === 'en' ? '/en' : '';
  return (
    <section
      className="relative -mx-8 mb-16 h-[420px] overflow-hidden flex items-center"
      style={{
        backgroundImage:
          "linear-gradient(135deg, rgba(37,99,235,0.85), rgba(30,64,175,0.6) 70%, rgba(15,23,42,0.4)), url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&q=80')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="mx-auto max-w-7xl px-8 text-white">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest opacity-90 mb-4">
          <Star className="h-3 w-3" />
          {locale === 'en' ? 'Curated · 8 Asian destinations' : 'ทัวร์คัดสรร · 8 ปลายทางในเอเชีย'}
        </div>
        <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tight whitespace-pre-line max-w-2xl">
          {t('heroTitle')}
        </h1>
        <p className="mt-4 max-w-md opacity-95">{t('heroSub')}</p>
        <Link
          href={`${prefix}/tours`}
          className="mt-7 inline-flex items-center gap-2 bg-white text-ink rounded-xl px-6 py-3.5 font-semibold shadow-xl"
        >
          {t('heroCta')}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
