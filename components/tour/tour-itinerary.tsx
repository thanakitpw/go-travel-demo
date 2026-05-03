import { useLocale, useTranslations } from 'next-intl';
import type { Tour } from '@/types';
import { pickLocale, pickLocaleArray } from '@/lib/i18n';

export function TourItinerary({ tour }: { tour: Tour }) {
  const t = useTranslations('tour');
  const locale = useLocale();
  return (
    <section className="mb-12">
      <h2 className="text-xl font-bold mb-4">{t('itinerary')}</h2>
      <ol className="space-y-4">
        {tour.itinerary.map((day) => (
          <li key={day.day} className="bg-white border border-line rounded-xl p-5">
            <div className="text-xs font-bold text-primary uppercase tracking-wider mb-1">
              {locale === 'en' ? `Day ${day.day}` : `วันที่ ${day.day}`}
            </div>
            <h3 className="font-bold mb-2">{pickLocale(day.title, locale)}</h3>
            <ul className="text-sm text-ink-muted space-y-1 list-disc pl-5">
              {pickLocaleArray(day.activities, locale).map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  );
}
