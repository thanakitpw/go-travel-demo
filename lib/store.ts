import type { Booking, CarRental } from '@/types';
import { trips } from '@/data/trips';
import { getTour } from '@/data/tours';

class Store {
  private bookings = new Map<string, Booking>();
  private carRentals = new Map<string, CarRental>();
  private counters = new Map<string, number>(); // tripId -> count
  private seeded = false;

  private seed(): void {
    if (this.seeded) return;
    for (const trip of trips) this.counters.set(trip.id, trip.registeredCount);
    this.seeded = true;
  }

  getCounter(tripId: string): number {
    this.seed();
    return this.counters.get(tripId) ?? 0;
  }

  createBooking(booking: Booking): Booking {
    this.seed();
    if (booking.mode === 'join' && booking.tripId) {
      const tour = getTour(booking.tourSlug);
      const max = tour?.joinMaxCapacity ?? 0;
      const current = this.counters.get(booking.tripId) ?? 0;
      const adding = booking.travelers.adults + booking.travelers.children;
      if (current + adding > max) {
        throw new Error('CAPACITY_EXCEEDED');
      }
      this.counters.set(booking.tripId, current + adding);
    }
    this.bookings.set(booking.id, booking);
    return booking;
  }

  getBooking(id: string): Booking | undefined {
    return this.bookings.get(id);
  }

  createCarRental(cr: CarRental): CarRental {
    this.carRentals.set(cr.id, cr);
    return cr;
  }

  getCarRental(id: string): CarRental | undefined {
    return this.carRentals.get(id);
  }

  /** Test-only: reset everything */
  _reset(): void {
    this.bookings.clear();
    this.carRentals.clear();
    this.counters.clear();
    this.seeded = false;
  }
}

// PHASE B/C MIGRATION POINT:
// Replace this in-memory implementation with a Prisma-backed store.
// Keep the same public API (getCounter, createBooking, getBooking, createCarRental, getCarRental).
// All callers (API routes, components) depend ONLY on this surface.
//
// Use globalThis to ensure a single shared instance across Next.js server
// bundles (route handlers and server components are bundled separately and
// would otherwise each get their own Store instance, defeating the singleton).
const globalForStore = globalThis as unknown as { __goTravelStore?: Store };
export const store = globalForStore.__goTravelStore ?? new Store();
if (!globalForStore.__goTravelStore) globalForStore.__goTravelStore = store;
