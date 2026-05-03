import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Check, X, MapPin, Clock } from 'lucide-react';
import type { Metadata } from 'next';
import { getTour } from '@/data/tours';
import { getTripsForTour } from '@/data/trips';
import { pickLocale, pickLocaleArray, formatPrice } from '@/lib/i18n';
import type { Tour, TripInstance } from '@/types';
import { TourItinerary } from '@/components/tour/tour-itinerary';
import { TourPricingTiers } from '@/components/tour/tour-pricing-tiers';
import { TourTripsList } from '@/components/tour/tour-trips-list';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const tour = getTour(slug);
  if (!tour) return { title: 'Not found' };
  const name = locale === 'en' ? tour.name.en : tour.name.th;
  const summary = locale === 'en' ? tour.summary.en : tour.summary.th;
  return {
    title: `${name} | Go Travel`,
    description: summary,
    openGraph: { title: name, description: summary, images: [tour.coverImage] },
    twitter: { card: 'summary_large_image', title: name, description: summary, images: [tour.coverImage] },
  };
}

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const tour = getTour(slug);
  if (!tour) notFound();
  const tourTrips = getTripsForTour(slug).filter((t) => t.status !== 'departed');
  return <TourDetail tour={tour} trips={tourTrips} />;
}

function TourDetail({ tour, trips }: { tour: Tour; trips: TripInstance[] }) {
  const t = useTranslations('tour');
  const locale = useLocale();
  const prefix = locale === 'en' ? '/en' : '';

  return (
    <article className="py-8">
      {/* Hero */}
      <div className="relative h-72 -mx-8 mb-8">
        <Image src={tour.coverImage} alt={pickLocale(tour.name, locale)} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent flex items-end p-8">
          <div className="text-white">
            <div className="flex items-center gap-3 text-sm mb-2 opacity-90">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {pickLocale(tour.destination, locale)}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {t('duration', { days: tour.duration.days, nights: tour.duration.nights })}
              </span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight">{pickLocale(tour.name, locale)}</h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <p className="text-base text-ink-muted mb-8">{pickLocale(tour.summary, locale)}</p>

          <section className="mb-10">
            <h2 className="text-xl font-bold mb-3">{t('highlights')}</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {pickLocaleArray(tour.highlights, locale).map((h, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-pastel-green-ink mt-0.5 flex-shrink-0" />
                  {h}
                </li>
              ))}
            </ul>
          </section>

          <TourItinerary tour={tour} />

          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            <div className="bg-white border border-line rounded-xl p-5">
              <h3 className="font-bold mb-3">{t('includes')}</h3>
              <ul className="text-sm text-ink-muted space-y-1.5">
                {pickLocaleArray(tour.includes, locale).map((it, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-pastel-green-ink mt-0.5 flex-shrink-0" />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white border border-line rounded-xl p-5">
              <h3 className="font-bold mb-3">{t('excludes')}</h3>
              <ul className="text-sm text-ink-muted space-y-1.5">
                {pickLocaleArray(tour.excludes, locale).map((it, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <X className="h-4 w-4 text-pastel-pink-ink mt-0.5 flex-shrink-0" />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <div className="bg-white border border-line rounded-xl p-5 sticky top-24">
            <div className="text-xs text-ink-muted uppercase tracking-wider mb-1">
              {locale === 'en' ? 'Join group from' : 'Join Group เริ่มต้น'}
            </div>
            <div className="text-3xl font-extrabold text-primary mb-1">{formatPrice(tour.groupPricing.perPerson, locale)}</div>
            <div className="text-xs text-ink-muted mb-4">{locale === 'en' ? 'per person' : 'ต่อท่าน'}</div>
            <Link
              href={`${prefix}/booking/checkout?mode=private&tourSlug=${tour.slug}`}
              className="block w-full text-center bg-primary text-white rounded-xl px-4 py-3 font-semibold hover:bg-primary-dark"
            >
              {locale === 'en' ? 'Book private trip' : 'จองไพรเวท'}
            </Link>
          </div>

          <TourTripsList trips={trips} />
          <TourPricingTiers tour={tour} />
        </aside>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TouristTrip',
            name: pickLocale(tour.name, locale),
            description: pickLocale(tour.summary, locale),
            image: tour.coverImage,
            offers: {
              '@type': 'Offer',
              price: tour.groupPricing.perPerson,
              priceCurrency: 'THB',
            },
          }),
        }}
      />
    </article>
  );
}
