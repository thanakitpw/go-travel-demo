import { NextResponse } from 'next/server';
import { z } from 'zod';
import { store } from '@/lib/store';
import { generateCarRentalId } from '@/lib/booking-id';
import { carRentalRates } from '@/data/car-rental-pricing';
import type { CarRental } from '@/types';

const input = z.object({
  vehicleSize: z.union([z.literal(4), z.literal(8), z.literal(12), z.literal(16)]),
  pickupDate: z.string(),
  returnDate: z.string(),
  pickupLocation: z.string().min(1),
  destination: z.string().min(1),
  contact: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1),
  }),
});

function dayDiff(start: string, end: string): number {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  return Math.max(1, Math.ceil(ms / 86_400_000));
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = input.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'INVALID_INPUT', issues: parsed.error.issues }, { status: 400 });
  }
  const data = parsed.data;
  const days = dayDiff(data.pickupDate, data.returnDate);
  const estimatedPrice = carRentalRates[data.vehicleSize].perDay * days;

  const cr: CarRental = {
    id: generateCarRentalId(),
    ...data,
    estimatedPrice,
    createdAt: new Date().toISOString(),
  };
  store.createCarRental(cr);
  return NextResponse.json({ carRental: cr }, { status: 201 });
}
