import type { BookingMode, PaymentMethod, VehicleSize } from '@/types';

export type BookingDraft = {
  mode: BookingMode;
  tourSlug: string;
  tripId?: string;
  privateDate?: string;
  travelers: { adults: number; children: number; infants: number };
  contact: { name: string; email: string; phone: string; lineId?: string; note?: string };
  carRentalAddon?: { vehicleSize: VehicleSize; pickupLocation: string };
  payment?: { method: PaymentMethod };
};

export const STEPS = ['selection', 'travelers', 'addon', 'contact', 'review', 'payment'] as const;
export type StepKey = (typeof STEPS)[number];
