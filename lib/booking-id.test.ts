import { describe, it, expect, beforeEach } from 'vitest';
import { generateBookingId, generateCarRentalId, _resetCounters } from './booking-id';

beforeEach(() => _resetCounters());

describe('generateBookingId', () => {
  it('produces format GT-YYYY-NNNNNN', () => {
    const id = generateBookingId(new Date('2026-05-03'));
    expect(id).toMatch(/^GT-2026-\d{6}$/);
  });
  it('increments per call within same year', () => {
    const a = generateBookingId(new Date('2026-05-03'));
    const b = generateBookingId(new Date('2026-05-03'));
    expect(a).toBe('GT-2026-000001');
    expect(b).toBe('GT-2026-000002');
  });
  it('starts a new sequence per year', () => {
    generateBookingId(new Date('2026-12-31'));
    const next = generateBookingId(new Date('2027-01-01'));
    expect(next).toBe('GT-2027-000001');
  });
});

describe('generateCarRentalId', () => {
  it('produces format CAR-YYYY-NNNNNN', () => {
    const id = generateCarRentalId(new Date('2026-05-03'));
    expect(id).toBe('CAR-2026-000001');
  });
});
