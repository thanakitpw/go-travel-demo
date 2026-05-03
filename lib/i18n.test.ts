import { describe, it, expect } from 'vitest';
import { pickLocale, formatPrice, formatDate, formatPaxCount } from './i18n';

describe('pickLocale', () => {
  it('returns th value for th locale', () => {
    expect(pickLocale({ th: 'สวัสดี', en: 'Hello' }, 'th')).toBe('สวัสดี');
  });
  it('returns en value for en locale', () => {
    expect(pickLocale({ th: 'สวัสดี', en: 'Hello' }, 'en')).toBe('Hello');
  });
  it('falls back to th when locale unknown', () => {
    expect(pickLocale({ th: 'A', en: 'B' }, 'fr' as never)).toBe('A');
  });
});

describe('formatPrice', () => {
  it('formats THB for th locale', () => {
    expect(formatPrice(59800, 'th')).toBe('฿59,800');
  });
  it('formats THB for en locale', () => {
    expect(formatPrice(59800, 'en')).toBe('THB 59,800');
  });
  it('handles zero', () => {
    expect(formatPrice(0, 'th')).toBe('฿0');
  });
});

describe('formatDate', () => {
  it('formats th date with Buddhist year', () => {
    const result = formatDate('2026-11-12', 'th');
    expect(result).toMatch(/2569/);
  });
  it('formats en date as DD MMM YYYY', () => {
    const result = formatDate('2026-11-12', 'en');
    expect(result).toMatch(/12.*Nov.*2026/);
  });
});

describe('formatPaxCount', () => {
  it('formats single pax', () => {
    expect(formatPaxCount(1, 'th')).toBe('1 ท่าน');
    expect(formatPaxCount(1, 'en')).toBe('1 person');
  });
  it('formats multiple pax', () => {
    expect(formatPaxCount(5, 'th')).toBe('5 ท่าน');
    expect(formatPaxCount(5, 'en')).toBe('5 people');
  });
});
