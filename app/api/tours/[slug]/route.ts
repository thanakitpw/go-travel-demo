import { NextResponse } from 'next/server';
import { getTour } from '@/data/tours';
import { getTripsForTour } from '@/data/trips';
import { store } from '@/lib/store';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const tour = getTour(slug);
  if (!tour) return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });

  const trips = getTripsForTour(slug).map((trip) => ({
    ...trip,
    registeredCount: store.getCounter(trip.id),
  }));

  return NextResponse.json({ tour, trips });
}
