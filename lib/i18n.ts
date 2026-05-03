import type { Locale } from '@/i18n/request';

export type I18n = { th: string; en: string };
export type I18nArray = { th: string[]; en: string[] };

export function pickLocale(field: I18n, locale: Locale | string): string {
  if (locale === 'en') return field.en;
  return field.th;
}

export function pickLocaleArray(field: I18nArray, locale: Locale | string): string[] {
  if (locale === 'en') return field.en;
  return field.th;
}

export function formatPrice(amount: number, locale: Locale | string): string {
  if (locale === 'en') {
    return `THB ${amount.toLocaleString('en-US')}`;
  }
  return `฿${amount.toLocaleString('en-US')}`;
}

export function formatDate(isoDate: string, locale: Locale | string): string {
  const date = new Date(isoDate);
  if (locale === 'en') {
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  }
  return new Intl.DateTimeFormat('th-TH-u-ca-buddhist', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function formatPaxCount(count: number, locale: Locale | string): string {
  if (locale === 'en') {
    return count === 1 ? `${count} person` : `${count} people`;
  }
  return `${count} ท่าน`;
}
