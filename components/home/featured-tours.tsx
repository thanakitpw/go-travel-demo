import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { tours } from '@/data/tours';
import { trips } from '@/data/trips';
import { TourCard } from '@/components/tour/tour-card';

export function FeaturedTours() {
  const t = useTranslations('home');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const prefix = locale === 'en' ? '/en' : '';

  // Pick first 3 tours with their earliest open trip
  const featured = tours.slice(0, 3).map((tour) => {
    const trip = trips
      .filter((tr) => tr.tourSlug === tour.slug && tr.status !== 'departed')
      .sort((a, b) => a.departDate.localeCompare(b.departDate))[0];
    return { tour, trip };
  });

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-extrabold tracking-tight">{t('featuredTitle')}</h2>
        <Link href={`${prefix}/tours`} className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
          {tCommon('viewAll')}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {featured.map(({ tour, trip }) => (
          <TourCard key={tour.slug} tour={tour} trip={trip} />
        ))}
      </div>
    </section>
  );
}
