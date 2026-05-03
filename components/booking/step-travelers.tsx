'use client';

import { useLocale } from 'next-intl';
import { Minus, Plus } from 'lucide-react';
import type { Tour } from '@/types';
import type { BookingDraft } from './booking-types';
import { Button } from '@/components/ui/button';

export function StepTravelers({
  tour, draft, onChange, onNext, onBack,
}: {
  tour: Tour;
  draft: BookingDraft;
  onChange: (patch: Partial<BookingDraft>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const locale = useLocale();
  const t = draft.travelers;
  const setKey = (k: keyof typeof t, v: number) => onChange({ travelers: { ...t, [k]: Math.max(0, v) } });

  const totalPax = t.adults + t.children;
  const valid =
    draft.mode === 'private'
      ? totalPax >= 4 && totalPax <= 16
      : totalPax > 0 && totalPax <= tour.joinMaxCapacity;

  const rows: Array<{ key: 'adults' | 'children' | 'infants'; label: string; sub: string }> = [
    { key: 'adults', label: locale === 'en' ? 'Adults' : 'ผู้ใหญ่', sub: locale === 'en' ? '12+ years' : 'อายุ 12+' },
    { key: 'children', label: locale === 'en' ? 'Children' : 'เด็ก', sub: locale === 'en' ? '4-11 (70% rate)' : 'อายุ 4-11 (70%)' },
    { key: 'infants', label: locale === 'en' ? 'Infants' : 'ทารก', sub: locale === 'en' ? '<4 (free)' : 'อายุ <4 (ฟรี)' },
  ];

  return (
    <section>
      <h2 className="text-xl font-bold mb-4">{locale === 'en' ? 'How many travelers?' : 'จำนวนผู้เดินทาง'}</h2>
      <div className="space-y-3 max-w-md">
        {rows.map(({ key, label, sub }) => (
          <div key={key} className="flex items-center justify-between bg-white border border-line rounded-xl p-4">
            <div>
              <div className="font-semibold">{label}</div>
              <div className="text-xs text-ink-muted">{sub}</div>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setKey(key, t[key] - 1)} className="h-8 w-8 rounded-full border border-line flex items-center justify-center">
                <Minus className="h-3 w-3" />
              </button>
              <span className="w-6 text-center font-bold">{t[key]}</span>
              <button type="button" onClick={() => setKey(key, t[key] + 1)} className="h-8 w-8 rounded-full border border-line flex items-center justify-center">
                <Plus className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
      {draft.mode === 'private' && (
        <p className="text-xs text-pastel-amber-ink mt-3">{locale === 'en' ? 'Private group: 4-16 travelers' : 'ไพรเวทต้องมี 4-16 ท่าน'}</p>
      )}
      <div className="flex gap-2 mt-6">
        <Button variant="outline" onClick={onBack}>{locale === 'en' ? 'Back' : 'ย้อนกลับ'}</Button>
        <Button className="bg-primary hover:bg-primary-dark" disabled={!valid} onClick={onNext}>
          {locale === 'en' ? 'Continue' : 'ถัดไป'}
        </Button>
      </div>
    </section>
  );
}
