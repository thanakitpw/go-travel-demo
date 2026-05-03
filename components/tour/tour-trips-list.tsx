import Link from 'next/link';
import { useLocale } from 'next-intl';
import type { TripInstance } from '@/types';
import { formatDate } from '@/lib/i18n';
import { TourCounter } from './tour-counter';
import { Calendar, ArrowRight } from 'lucide-react';

export function TourTripsList({ trips }: { trips: TripInstance[] }) {
  const locale = useLocale();
  const prefix = locale === 'en' ? '/en' : '';
  return (
    <div className="bg-white border border-line rounded-xl p-5">
      <h3 className="font-bold mb-3">{locale === 'en' ? 'Open departures (Join Group)' : 'รอบเดินทางที่เปิดจอง (Join Group)'}</h3>
      <ul className="space-y-2">
        {trips.map((trip) => (
          <li key={trip.id} className="flex items-center justify-between bg-pastel-green/40 rounded-lg px-4 py-3 text-sm">
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4 text-pastel-green-ink" />
              {formatDate(trip.departDate, locale)} – {formatDate(trip.returnDate, locale)}
            </span>
            <span className="flex items-center gap-3">
              <TourCounter tripId={trip.id} />
              <Link
                href={`${prefix}/booking/checkout?mode=join&tripId=${trip.id}`}
                className="inline-flex items-center gap-1 bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-semibold"
              >
                {locale === 'en' ? 'Book' : 'จอง'}
                <ArrowRight className="h-3 w-3" />
              </Link>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
