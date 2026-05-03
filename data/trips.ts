import type { TripInstance } from '@/types';

// 2-3 departures per tour. Counter values are starting seeds — store will track live counts.
export const trips: TripInstance[] = [
  // Hokkaido
  { id: 'trip-hokkaido-202611', tourSlug: 'hokkaido-autumn-5d', departDate: '2026-11-12', returnDate: '2026-11-16', registeredCount: 12, status: 'open' },
  { id: 'trip-hokkaido-202612', tourSlug: 'hokkaido-autumn-5d', departDate: '2026-12-03', returnDate: '2026-12-07', registeredCount: 4, status: 'open' },

  // Korea
  { id: 'trip-korea-202609', tourSlug: 'seoul-busan-6d', departDate: '2026-09-05', returnDate: '2026-09-10', registeredCount: 26, status: 'closing-soon' },
  { id: 'trip-korea-202610', tourSlug: 'seoul-busan-6d', departDate: '2026-10-15', returnDate: '2026-10-20', registeredCount: 8, status: 'open' },

  // Hong Kong
  { id: 'trip-hk-202606', tourSlug: 'hongkong-macau-3d', departDate: '2026-06-14', returnDate: '2026-06-16', registeredCount: 7, status: 'open' },
  { id: 'trip-hk-202608', tourSlug: 'hongkong-macau-3d', departDate: '2026-08-09', returnDate: '2026-08-11', registeredCount: 0, status: 'open' },

  // Bali
  { id: 'trip-bali-202607', tourSlug: 'bali-paradise-5d', departDate: '2026-07-20', returnDate: '2026-07-24', registeredCount: 14, status: 'open' },

  // Taiwan
  { id: 'trip-taiwan-202611', tourSlug: 'taiwan-taipei-4d', departDate: '2026-11-22', returnDate: '2026-11-25', registeredCount: 5, status: 'open' },

  // Vietnam
  { id: 'trip-vietnam-202609', tourSlug: 'vietnam-hanoi-halong-4d', departDate: '2026-09-17', returnDate: '2026-09-20', registeredCount: 11, status: 'open' },

  // Singapore
  { id: 'trip-sg-202610', tourSlug: 'singapore-mbs-3d', departDate: '2026-10-03', returnDate: '2026-10-05', registeredCount: 9, status: 'open' },

  // Osaka
  { id: 'trip-osaka-202604', tourSlug: 'osaka-kyoto-5d', departDate: '2026-04-08', returnDate: '2026-04-12', registeredCount: 29, status: 'full' },
  { id: 'trip-osaka-202605', tourSlug: 'osaka-kyoto-5d', departDate: '2026-05-22', returnDate: '2026-05-26', registeredCount: 18, status: 'open' },
];

export function getTrip(id: string): TripInstance | undefined {
  return trips.find((t) => t.id === id);
}

export function getTripsForTour(tourSlug: string): TripInstance[] {
  return trips.filter((t) => t.tourSlug === tourSlug);
}
