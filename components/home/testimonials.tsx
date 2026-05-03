import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Star, Quote } from 'lucide-react';
import { testimonials } from '@/data/testimonials';
import { tours } from '@/data/tours';
import { pickLocale } from '@/lib/i18n';

export function Testimonials() {
  const t = useTranslations('testimonials');
  const locale = useLocale();

  return (
    <section className="mb-20 -mx-8 bg-pastel-blue/40 py-16 px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold tracking-tight mb-2">{t('title')}</h2>
          <p className="text-ink-muted">{t('subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonials.map((tm) => {
            const tour = tours.find((tt) => tt.slug === tm.tourSlug);
            return (
              <article key={tm.id} className="bg-white rounded-2xl border border-line p-6 flex flex-col">
                <Quote className="h-5 w-5 text-primary opacity-40 mb-3" />
                <p className="text-sm text-ink leading-relaxed flex-1 mb-4">
                  &ldquo;{pickLocale(tm.quote, locale)}&rdquo;
                </p>
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < tm.rating ? 'fill-pastel-amber-ink text-pastel-amber-ink' : 'text-line'}`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-line">
                  <Image
                    src={tm.avatar}
                    alt={tm.name}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <div className="text-sm font-bold truncate">{tm.name}</div>
                    {tour && <div className="text-xs text-ink-muted truncate">{pickLocale(tour.name, locale)}</div>}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
