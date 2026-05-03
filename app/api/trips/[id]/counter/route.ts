import { NextResponse } from 'next/server';
import { getTrip } from '@/data/trips';
import { getTour } from '@/data/tours';
import { store } from '@/lib/store';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const trip = getTrip(id);
  if (!trip) return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });
  const tour = getTour(trip.tourSlug);
  const max = tour?.joinMaxCapacity ?? 0;
  const count = store.getCounter(id);
  return NextResponse.json({ count, max, remaining: max - count });
}
