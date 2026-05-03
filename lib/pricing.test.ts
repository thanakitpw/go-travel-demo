import { describe, it, expect } from 'vitest';
import { calculateJoinTotal, calculatePrivateTotal, calculateCarAddon, findPrivateTier } from './pricing';
import type { Tour } from '@/types';

const tour: Tour = {
  slug: 'test', name: { th: '', en: '' }, destination: { th: '', en: '' }, destinationCode: 'XX',
  summary: { th: '', en: '' }, duration: { days: 5, nights: 4 }, coverImage: '', gallery: [],
  highlights: { th: [], en: [] }, itinerary: [], includes: { th: [], en: [] }, excludes: { th: [], en: [] },
  groupPricing: { perPerson: 10000 },
  privatePricing: [
    { minPax: 4, maxPax: 7, perPerson: 13000 },
    { minPax: 8, maxPax: 11, perPerson: 12000 },
    { minPax: 12, maxPax: 16, perPerson: 11000 },
  ],
  joinMaxCapacity: 29, joinMinToDepart: 4,
};

describe('calculateJoinTotal', () => {
  it('charges full rate for adults', () => {
    expect(calculateJoinTotal(tour, { adults: 2, children: 0, infants: 0 })).toBe(20000);
  });
  it('charges 70% for children', () => {
    expect(calculateJoinTotal(tour, { adults: 1, children: 1, infants: 0 })).toBe(17000);
  });
  it('infants are free', () => {
    expect(calculateJoinTotal(tour, { adults: 1, children: 0, infants: 3 })).toBe(10000);
  });
});

describe('findPrivateTier', () => {
  it('finds 4-7 tier for 5 pax', () => {
    expect(findPrivateTier(tour, 5)).toEqual({ minPax: 4, maxPax: 7, perPerson: 13000 });
  });
  it('finds 8-11 tier for 10 pax', () => {
    expect(findPrivateTier(tour, 10)).toEqual({ minPax: 8, maxPax: 11, perPerson: 12000 });
  });
  it('finds 12-16 tier for 16 pax', () => {
    expect(findPrivateTier(tour, 16)).toEqual({ minPax: 12, maxPax: 16, perPerson: 11000 });
  });
  it('returns null for out-of-range pax', () => {
    expect(findPrivateTier(tour, 3)).toBeNull();
    expect(findPrivateTier(tour, 17)).toBeNull();
  });
});

describe('calculatePrivateTotal', () => {
  it('uses 4-7 tier with adult+child(0.7)', () => {
    // 4 adults + 1 child = 5 pax → tier 13000
    // total = 4*13000 + 1*13000*0.7 = 52000 + 9100 = 61100
    expect(calculatePrivateTotal(tour, { adults: 4, children: 1, infants: 0 })).toBe(61100);
  });
  it('infants ignored both for tier and total', () => {
    expect(calculatePrivateTotal(tour, { adults: 5, children: 0, infants: 3 })).toBe(65000);
  });
  it('throws if pax outside tiers', () => {
    expect(() => calculatePrivateTotal(tour, { adults: 2, children: 0, infants: 0 })).toThrow('NO_MATCHING_TIER');
  });
});

describe('calculateCarAddon', () => {
  it('multiplies vehicle rate by days', () => {
    expect(calculateCarAddon(8, 3)).toBe(11400); // 3800 * 3
  });
  it('handles all sizes', () => {
    expect(calculateCarAddon(4, 1)).toBe(2500);
    expect(calculateCarAddon(12, 2)).toBe(9800);
    expect(calculateCarAddon(16, 4)).toBe(26000);
  });
});
