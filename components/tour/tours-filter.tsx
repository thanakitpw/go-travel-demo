'use client';

import { useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import type { Tour, TripInstance } from '@/types';
import { TourCard } from './tour-card';
import { pickLocale } from '@/lib/i18n';

export function ToursFilter({ tours, trips }: { tours: Tour[]; trips: TripInstance[] }) {
  const locale = useLocale();
  const [destCode, setDestCode] = useState<string>('');

  const destinations = useMemo(() => {
    const set = new Map<string, string>();
    for (const t of tours) set.set(t.destinationCode, pickLocale(t.destination, locale));
    return Array.from(set.entries());
  }, [tours, locale]);

  const filtered = destCode ? tours.filter((t) => t.destinationCode === destCode) : tours;

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setDestCode('')}
          className={`px-4 py-2 rounded-full text-sm font-semibold ${destCode === '' ? 'bg-primary text-white' : 'bg-white border border-line text-ink'}`}
        >
          {locale === 'en' ? 'All destinations' : 'ทุกปลายทาง'}
        </button>
        {destinations.map(([code, label]) => (
          <button
            key={code}
            onClick={() => setDestCode(code)}
            className={`px-4 py-2 rounded-full text-sm font-semibold ${destCode === code ? 'bg-primary text-white' : 'bg-white border border-line text-ink'}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {filtered.map((tour) => {
          const trip = trips
            .filter((tr) => tr.tourSlug === tour.slug && tr.status !== 'departed')
            .sort((a, b) => a.departDate.localeCompare(b.departDate))[0];
          return <TourCard key={tour.slug} tour={tour} trip={trip} />;
        })}
      </div>
    </div>
  );
}
