import { NextResponse } from 'next/server';
import { z } from 'zod';
import { store } from '@/lib/store';
import { generateBookingId } from '@/lib/booking-id';
import { calculateJoinTotal, calculatePrivateTotal, calculateCarAddon } from '@/lib/pricing';
import { getTour } from '@/data/tours';
import type { Booking } from '@/types';

const bookingInput = z.object({
  mode: z.enum(['join', 'private']),
  tourSlug: z.string(),
  tripId: z.string().optional(),
  privateDate: z.string().optional(),
  travelers: z.object({
    adults: z.number().int().min(0),
    children: z.number().int().min(0),
    infants: z.number().int().min(0),
  }),
  contact: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1),
    lineId: z.string().optional(),
    note: z.string().optional(),
  }),
  carRentalAddon: z
    .object({
      vehicleSize: z.union([z.literal(4), z.literal(8), z.literal(12), z.literal(16)]),
      days: z.number().int().min(1),
      pickupLocation: z.string().min(1),
    })
    .optional(),
  payment: z.object({
    method: z.enum(['qr', 'card', 'transfer']),
  }),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = bookingInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'INVALID_INPUT', issues: parsed.error.issues }, { status: 400 });
  }
  const input = parsed.data;
  const tour = getTour(input.tourSlug);
  if (!tour) return NextResponse.json({ error: 'TOUR_NOT_FOUND' }, { status: 404 });

  // Compute total
  const tourTotal =
    input.mode === 'join'
      ? calculateJoinTotal(tour, input.travelers)
      : calculatePrivateTotal(tour, input.travelers);
  const addonTotal = input.carRentalAddon
    ? calculateCarAddon(input.carRentalAddon.vehicleSize, input.carRentalAddon.days)
    : 0;
  const amount = tourTotal + addonTotal;

  const booking: Booking = {
    id: generateBookingId(),
    mode: input.mode,
    tourSlug: input.tourSlug,
    tripId: input.tripId,
    privateDate: input.privateDate,
    travelers: input.travelers,
    contact: input.contact,
    carRentalAddon: input.carRentalAddon,
    payment: { method: input.payment.method, amount },
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };

  try {
    store.createBooking(booking);
  } catch (err) {
    if (err instanceof Error && err.message === 'CAPACITY_EXCEEDED') {
      return NextResponse.json({ error: 'CAPACITY_EXCEEDED' }, { status: 409 });
    }
    throw err;
  }

  return NextResponse.json({ booking }, { status: 201 });
}
