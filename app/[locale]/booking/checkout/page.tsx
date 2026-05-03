import { notFound } from 'next/navigation';
import { getTour } from '@/data/tours';
import { getTrip, getTripsForTour } from '@/data/trips';
import { CheckoutShell } from '@/components/booking/checkout-shell';
import type { BookingDraft } from '@/components/booking/booking-types';

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: 'join' | 'private'; tripId?: string; tourSlug?: string }>;
}) {
  const params = await searchParams;

  let tourSlug: string | undefined = params.tourSlug;
  if (!tourSlug && params.tripId) {
    const trip = getTrip(params.tripId);
    tourSlug = trip?.tourSlug;
  }
  if (!tourSlug) notFound();
  const tour = getTour(tourSlug);
  if (!tour) notFound();

  const mode = params.mode ?? 'join';
  const initial: BookingDraft = {
    mode,
    tourSlug: tour.slug,
    tripId: params.tripId,
    travelers: { adults: 2, children: 0, infants: 0 },
    contact: { name: '', email: '', phone: '' },
  };

  const trips = getTripsForTour(tour.slug);
  return <CheckoutShell tour={tour} trips={trips} initial={initial} />;
}
