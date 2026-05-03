'use client';

import { useLocale } from 'next-intl';
import { Calendar, Users } from 'lucide-react';
import type { Tour, TripInstance } from '@/types';
import type { BookingDraft } from './booking-types';
import { formatDate } from '@/lib/i18n';
import { TourCounter } from '@/components/tour/tour-counter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function StepSelection({
  tour, trips, draft, onChange, onNext,
}: {
  tour: Tour;
  trips: TripInstance[];
  draft: BookingDraft;
  onChange: (patch: Partial<BookingDraft>) => void;
  onNext: () => void;
}) {
  const locale = useLocale();
  const minDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  })();

  if (draft.mode === 'join') {
    const trip = trips.find((t) => t.id === draft.tripId);
    if (!trip) return <p className="text-pastel-pink-ink">Trip not found.</p>;
    return (
      <section>
        <h2 className="text-xl font-bold mb-4">
          {locale === 'en' ? 'Confirm departure' : 'ยืนยันรอบเดินทาง'}
        </h2>
        <div className="bg-pastel-blue rounded-xl p-5 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-primary" />
            <div>
              <div className="font-bold">{formatDate(trip.departDate, locale)} – {formatDate(trip.returnDate, locale)}</div>
              <div className="text-sm text-ink-muted">Join Group · {tour.duration.days} {locale === 'en' ? 'days' : 'วัน'}</div>
            </div>
          </div>
          <TourCounter tripId={trip.id} />
        </div>
        <Button className="bg-primary hover:bg-primary-dark" onClick={onNext}>
          {locale === 'en' ? 'Continue' : 'ถัดไป'}
        </Button>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-xl font-bold mb-4">
        {locale === 'en' ? 'Choose your dates' : 'เลือกวันเดินทาง'}
      </h2>
      <div className="space-y-4 max-w-md">
        <div>
          <Label>{locale === 'en' ? 'Departure date' : 'วันเริ่มเดินทาง'}</Label>
          <Input
            type="date"
            min={minDate}
            value={draft.privateDate ?? ''}
            onChange={(e) => onChange({ privateDate: e.target.value })}
          />
          <p className="text-xs text-ink-muted mt-1">
            {locale === 'en' ? 'Min 14 days from today' : 'อย่างน้อย 14 วันจากวันนี้'}
          </p>
        </div>
        <div className="bg-pastel-amber/40 rounded-lg p-3 text-sm text-pastel-amber-ink">
          <Users className="h-4 w-4 inline mr-1" />
          {locale === 'en' ? 'Private group requires 4-16 travelers' : 'ไพรเวทต้องมี 4-16 ท่าน'}
        </div>
      </div>
      <Button
        className="mt-6 bg-primary hover:bg-primary-dark"
        disabled={!draft.privateDate}
        onClick={onNext}
      >
        {locale === 'en' ? 'Continue' : 'ถัดไป'}
      </Button>
    </section>
  );
}
