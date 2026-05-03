import Image from 'next/image';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { ArrowRight, Clock } from 'lucide-react';
import { articles } from '@/data/articles';
import { pickLocale, formatDate } from '@/lib/i18n';

export function TravelArticles() {
  const t = useTranslations('articles');
  const locale = useLocale();

  return (
    <section className="mb-20">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight mb-2">{t('title')}</h2>
          <p className="text-ink-muted">{t('subtitle')}</p>
        </div>
        <Link href="#" className="hidden md:inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark cursor-pointer">
          {t('viewAll')}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {articles.map((a) => (
          <article key={a.slug} className="bg-white border border-line rounded-2xl overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow duration-200">
            <div className="relative h-44">
              <Image
                src={a.cover}
                alt={pickLocale(a.title, locale)}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute top-3 left-3 bg-white text-primary text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                {pickLocale(a.category, locale)}
              </span>
            </div>
            <div className="p-5">
              <h3 className="font-bold mb-2 leading-snug group-hover:text-primary transition-colors duration-200">
                {pickLocale(a.title, locale)}
              </h3>
              <p className="text-sm text-ink-muted leading-relaxed mb-4 line-clamp-2">
                {pickLocale(a.excerpt, locale)}
              </p>
              <div className="flex items-center justify-between text-xs text-ink-muted">
                <span>{formatDate(a.publishedAt, locale)}</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {a.readTimeMin} {t('minRead')}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
