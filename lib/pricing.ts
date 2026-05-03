import type { Tour, VehicleSize } from '@/types';
import { carRentalRates } from '@/data/car-rental-pricing';

const CHILD_RATE = 0.7;

type Travelers = { adults: number; children: number; infants: number };

export function calculateJoinTotal(tour: Tour, t: Travelers): number {
  const adultsTotal = t.adults * tour.groupPricing.perPerson;
  const childrenTotal = t.children * tour.groupPricing.perPerson * CHILD_RATE;
  return Math.round(adultsTotal + childrenTotal);
}

export function findPrivateTier(tour: Tour, pax: number) {
  return tour.privatePricing.find((tier) => pax >= tier.minPax && pax <= tier.maxPax) ?? null;
}

export function calculatePrivateTotal(tour: Tour, t: Travelers): number {
  const pax = t.adults + t.children;
  const tier = findPrivateTier(tour, pax);
  if (!tier) throw new Error('NO_MATCHING_TIER');
  const adultsTotal = t.adults * tier.perPerson;
  const childrenTotal = t.children * tier.perPerson * CHILD_RATE;
  return Math.round(adultsTotal + childrenTotal);
}

export function calculateCarAddon(size: VehicleSize, days: number): number {
  return carRentalRates[size].perDay * days;
}
