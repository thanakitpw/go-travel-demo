import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { useLocale } from 'next-intl';
import type { Tour, TripInstance } from '@/types';
import { pickLocale, formatPrice, formatDate } from '@/lib/i18n';
import { TourCounter } from './tour-counter';

export function TourCard({ tour, trip }: { tour: Tour; trip?: TripInstance }) {
  const locale = useLocale();
  const prefix = locale === 'en' ? '/en' : '';

  const badgeClass =
    trip?.status === 'closing-soon'
      ? 'bg-pastel-amber text-pastel-amber-ink'
      : trip?.status === 'full'
      ? 'bg-pastel-pink text-pastel-pink-ink'
      : 'bg-white text-primary';
  const badgeLabel =
    trip?.status === 'closing-soon'
      ? locale === 'en' ? 'CLOSING SOON' : 'เกือบเต็ม'
      : trip?.status === 'full'
      ? locale === 'en' ? 'FULL' : 'เต็มแล้ว'
      : locale === 'en' ? 'OPEN' : 'เปิดจอง';

  return (
    <article className="bg-white rounded-2xl border border-line overflow-hidden hover:shadow-lg transition">
      <Link href={`${prefix}/tours/${tour.slug}`}>
        <div className="relative h-48">
          <Image src={tour.coverImage} alt={pickLocale(tour.name, locale)} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
          <span className={`absolute top-3 left-3 rounded-full px-2.5 py-1 text-[11px] font-bold ${badgeClass}`}>
            {badgeLabel}
          </span>
          {trip && (
            <div className="absolute top-3 right-3">
              <TourCounter tripId={trip.id} />
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <h3 className="font-bold text-base mb-1">
          <Link href={`${prefix}/tours/${tour.slug}`} className="hover:text-primary">
            {pickLocale(tour.name, locale)}
          </Link>
        </h3>
        <div className="flex gap-3 text-xs text-ink-muted mb-3">
          {trip && (
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(trip.departDate, locale)}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {pickLocale(tour.destination, locale)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-extrabold">{formatPrice(tour.groupPricing.perPerson, locale)}</span>
            <span className="text-xs text-ink-muted ml-1">{locale === 'en' ? '/person' : '/ท่าน'}</span>
          </div>
          <Link
            href={`${prefix}/tours/${tour.slug}`}
            className="inline-flex items-center gap-1 bg-primary-50 text-primary rounded-lg px-3 py-2 text-xs font-semibold"
          >
            {locale === 'en' ? 'Book' : 'จอง'}
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </article>
  );
}
