import { notFound, redirect } from 'next/navigation';
import { getTrip } from '@/data/trips';

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const trip = getTrip(id);
  if (!trip) notFound();
  const prefix = locale === 'en' ? '/en' : '';
  redirect(`${prefix}/tours/${trip.tourSlug}#trip-${trip.id}`);
}
