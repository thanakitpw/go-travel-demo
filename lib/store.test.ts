import { describe, it, expect, beforeEach } from 'vitest';
import { store } from './store';
import type { Booking, CarRental } from '@/types';
import { trips } from '@/data/trips';

const sampleBooking = (overrides: Partial<Booking> = {}): Booking => ({
  id: 'GT-2026-000001',
  mode: 'join',
  tourSlug: 'hokkaido-autumn-5d',
  tripId: 'trip-hokkaido-202611',
  travelers: { adults: 2, children: 0, infants: 0 },
  contact: { name: 'Test', email: 'a@b.c', phone: '0812345678' },
  payment: { method: 'qr', amount: 79800 },
  status: 'confirmed',
  createdAt: '2026-05-03T00:00:00Z',
  ...overrides,
});

beforeEach(() => store._reset());

describe('store.getCounter', () => {
  it('returns seeded count from trips data on first read', () => {
    const seeded = trips.find((t) => t.id === 'trip-hokkaido-202611')!.registeredCount;
    expect(store.getCounter('trip-hokkaido-202611')).toBe(seeded);
  });
  it('returns 0 for unknown trip', () => {
    expect(store.getCounter('unknown')).toBe(0);
  });
});

describe('store.createBooking (join mode)', () => {
  it('saves booking and increments counter by adults+children', () => {
    const before = store.getCounter('trip-hokkaido-202611');
    const created = store.createBooking(sampleBooking({ travelers: { adults: 2, children: 1, infants: 1 } }));
    expect(created.id).toBe('GT-2026-000001');
    expect(store.getCounter('trip-hokkaido-202611')).toBe(before + 3);
  });
  it('infants do not count toward capacity', () => {
    const before = store.getCounter('trip-hokkaido-202611');
    store.createBooking(sampleBooking({ travelers: { adults: 0, children: 0, infants: 2 } }));
    expect(store.getCounter('trip-hokkaido-202611')).toBe(before);
  });
});

describe('store.createBooking (capacity guard)', () => {
  it('throws CAPACITY_EXCEEDED if increment would exceed joinMaxCapacity', () => {
    // Hokkaido capacity = 29, seeded at 12. Try to add 18 — exceeds 29.
    expect(() =>
      store.createBooking(sampleBooking({ travelers: { adults: 18, children: 0, infants: 0 } })),
    ).toThrow('CAPACITY_EXCEEDED');
  });
});

describe('store.createBooking (private mode)', () => {
  it('does not touch any counter', () => {
    const before = store.getCounter('trip-hokkaido-202611');
    store.createBooking(sampleBooking({ mode: 'private', tripId: undefined, privateDate: '2026-12-01' }));
    expect(store.getCounter('trip-hokkaido-202611')).toBe(before);
  });
});

describe('store.getBooking', () => {
  it('retrieves a saved booking', () => {
    const created = store.createBooking(sampleBooking());
    expect(store.getBooking(created.id)).toEqual(created);
  });
});

describe('store car rentals', () => {
  it('saves and retrieves a car rental', () => {
    const cr: CarRental = {
      id: 'CAR-2026-000001',
      vehicleSize: 8,
      pickupDate: '2026-06-01',
      returnDate: '2026-06-03',
      pickupLocation: 'BKK Airport',
      destination: 'Pattaya',
      contact: { name: 'X', email: 'x@y.z', phone: '0800000000' },
      estimatedPrice: 7600,
      createdAt: '2026-05-03T00:00:00Z',
    };
    store.createCarRental(cr);
    expect(store.getCarRental('CAR-2026-000001')).toEqual(cr);
  });
});
