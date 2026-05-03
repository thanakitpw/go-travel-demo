import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Calendar, ArrowRight } from 'lucide-react';
import { tours } from '@/data/tours';
import { trips } from '@/data/trips';
import { pickLocale, formatDate } from '@/lib/i18n';
import { TourCounter } from '@/components/tour/tour-counter';

export function SchedulePreview() {
  const t = useTranslations('schedule_preview');
  const locale = useLocale();
  const prefix = locale === 'en' ? '/en' : '';

  const upcoming = [...trips]
    .filter((tr) => tr.status !== 'departed')
    .sort((a, b) => a.departDate.localeCompare(b.departDate))
    .slice(0, 6);

  return (
    <section className="mb-20">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight mb-1">{t('title')}</h2>
          <p className="text-sm text-ink-muted">{t('subtitle')}</p>
        </div>
        <Link href={`${prefix}/trips`} className="hidden md:inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark cursor-pointer">
          {t('viewAll')}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="bg-white border border-line rounded-2xl divide-y divide-line">
        {upcoming.map((trip) => {
          const tour = tours.find((tt) => tt.slug === trip.tourSlug);
          if (!tour) return null;
          return (
            <Link
              key={trip.id}
              href={`${prefix}/trips/${trip.id}`}
              className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-primary-50 transition-colors duration-200 cursor-pointer"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="h-10 w-10 rounded-xl bg-pastel-green text-pastel-green-ink flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold truncate">{pickLocale(tour.name, locale)}</div>
                  <div className="text-xs text-ink-muted">
                    {formatDate(trip.departDate, locale)} – {formatDate(trip.returnDate, locale)} · {pickLocale(tour.destination, locale)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <TourCounter tripId={trip.id} />
                <ArrowRight className="h-4 w-4 text-ink-muted" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
