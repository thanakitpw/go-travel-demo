import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Calendar, ArrowRight } from 'lucide-react';
import { tours } from '@/data/tours';
import { trips } from '@/data/trips';
import { pickLocale, formatDate } from '@/lib/i18n';
import { TourCounter } from '@/components/tour/tour-counter';

export default async function TripsPage({ params }: { params: Promise<{ locale: string }> }) {
  await params;
  return <TripsList />;
}

function TripsList() {
  const locale = useLocale();
  const prefix = locale === 'en' ? '/en' : '';
  const sorted = [...trips]
    .filter((t) => t.status !== 'departed')
    .sort((a, b) => a.departDate.localeCompare(b.departDate));

  // Group by month-year string
  const groups = new Map<string, typeof trips>();
  for (const t of sorted) {
    const key = formatDate(t.departDate, locale).split(' ').slice(1).join(' ');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(t);
  }

  return (
    <div className="py-8">
      <h1 className="text-3xl font-extrabold tracking-tight mb-2">
        {locale === 'en' ? 'Annual Trip Schedule' : 'ตารางทริปประจำปี'}
      </h1>
      <p className="text-ink-muted mb-8">
        {locale === 'en' ? 'All scheduled departures across our 8 programs.' : 'รอบเดินทางทั้งหมดของ 8 โปรแกรม'}
      </p>

      {Array.from(groups.entries()).map(([month, monthTrips]) => (
        <section key={month} className="mb-10">
          <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-3">{month}</h2>
          <ul className="space-y-3">
            {monthTrips.map((trip) => {
              const tour = tours.find((t) => t.slug === trip.tourSlug)!;
              return (
                <li key={trip.id} className="bg-white border border-line rounded-xl p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <div className="font-bold">{pickLocale(tour.name, locale)}</div>
                      <div className="text-sm text-ink-muted">
                        {formatDate(trip.departDate, locale)} – {formatDate(trip.returnDate, locale)} · {pickLocale(tour.destination, locale)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <TourCounter tripId={trip.id} />
                    <Link
                      href={`${prefix}/trips/${trip.id}`}
                      className="inline-flex items-center gap-1 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold"
                    >
                      {locale === 'en' ? 'Details' : 'รายละเอียด'}
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
