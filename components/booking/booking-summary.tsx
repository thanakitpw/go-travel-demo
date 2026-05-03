'use client';

import { useLocale } from 'next-intl';
import Image from 'next/image';
import type { Tour } from '@/types';
import type { BookingDraft } from './booking-types';
import { pickLocale, formatPrice, formatDate } from '@/lib/i18n';
import { calculateJoinTotal, calculatePrivateTotal, calculateCarAddon, findPrivateTier } from '@/lib/pricing';

export function BookingSummary({ tour, draft }: { tour: Tour; draft: BookingDraft }) {
  const locale = useLocale();
  const totalPax = draft.travelers.adults + draft.travelers.children;

  let tourTotal = 0;
  try {
    tourTotal =
      draft.mode === 'join'
        ? calculateJoinTotal(tour, draft.travelers)
        : findPrivateTier(tour, totalPax)
        ? calculatePrivateTotal(tour, draft.travelers)
        : 0;
  } catch {
    tourTotal = 0;
  }
  const addonTotal = draft.carRentalAddon ? calculateCarAddon(draft.carRentalAddon.vehicleSize, tour.duration.days) : 0;
  const total = tourTotal + addonTotal;

  const dateStr =
    draft.mode === 'private' && draft.privateDate
      ? formatDate(draft.privateDate, locale)
      : '';

  return (
    <aside className="lg:sticky lg:top-24 self-start">
      <div className="bg-white border border-line rounded-2xl overflow-hidden">
        <div className="relative h-32">
          <Image src={tour.coverImage} alt={pickLocale(tour.name, locale)} fill className="object-cover" />
        </div>
        <div className="p-5 space-y-3 text-sm">
          <div>
            <div className="font-bold">{pickLocale(tour.name, locale)}</div>
            <div className="text-xs text-ink-muted">
              {pickLocale(tour.destination, locale)} · {tour.duration.days} {locale === 'en' ? 'days' : 'วัน'}
            </div>
          </div>
          {dateStr && <div className="text-xs">{dateStr}</div>}
          <div className="border-t border-line pt-3 space-y-1.5">
            <div className="flex justify-between"><span>{locale === 'en' ? 'Adults' : 'ผู้ใหญ่'}</span><span>{draft.travelers.adults}</span></div>
            <div className="flex justify-between"><span>{locale === 'en' ? 'Children' : 'เด็ก'}</span><span>{draft.travelers.children}</span></div>
            <div className="flex justify-between"><span>{locale === 'en' ? 'Infants' : 'ทารก'}</span><span>{draft.travelers.infants}</span></div>
            {draft.carRentalAddon && (
              <div className="flex justify-between text-pastel-pink-ink">
                <span>{locale === 'en' ? 'Car add-on' : 'รถ add-on'}</span>
                <span>+{formatPrice(addonTotal, locale)}</span>
              </div>
            )}
          </div>
          <div className="border-t border-line pt-3 flex items-center justify-between">
            <span className="text-xs uppercase text-ink-muted tracking-wider">{locale === 'en' ? 'Total' : 'ยอดรวม'}</span>
            <span className="text-xl font-extrabold text-primary">{formatPrice(total, locale)}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
