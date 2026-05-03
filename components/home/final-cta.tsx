import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { ArrowRight, Phone } from 'lucide-react';

export function FinalCta() {
  const t = useTranslations('final_cta');
  const locale = useLocale();
  const prefix = locale === 'en' ? '/en' : '';
  return (
    <section className="mb-20">
      <div className="bg-white border border-line rounded-3xl px-8 py-16 text-center max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">{t('title')}</h2>
        <p className="text-ink-muted text-lg mb-8 max-w-xl mx-auto">{t('subtitle')}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={`${prefix}/tours`}
            className="cursor-pointer inline-flex items-center justify-center gap-2 bg-primary text-white px-7 py-4 rounded-xl font-bold hover:bg-primary-dark transition-colors duration-200"
          >
            {t('browse')}
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href={`${prefix}/contact`}
            className="cursor-pointer inline-flex items-center justify-center gap-2 bg-white text-ink border border-line px-7 py-4 rounded-xl font-bold hover:border-primary hover:text-primary transition-colors duration-200"
          >
            <Phone className="h-5 w-5" />
            {t('contact')}
          </Link>
        </div>
      </div>
    </section>
  );
}
