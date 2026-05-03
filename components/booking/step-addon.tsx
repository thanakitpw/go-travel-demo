'use client';

import { useLocale } from 'next-intl';
import { Car } from 'lucide-react';
import type { BookingDraft } from './booking-types';
import type { VehicleSize } from '@/types';
import { carRentalRates } from '@/data/car-rental-pricing';
import { pickLocale, formatPrice } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function StepAddon({
  draft, onChange, onNext, onBack,
}: {
  draft: BookingDraft;
  onChange: (patch: Partial<BookingDraft>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const locale = useLocale();
  const enabled = !!draft.carRentalAddon;
  const size = draft.carRentalAddon?.vehicleSize;

  const toggle = () => {
    if (enabled) onChange({ carRentalAddon: undefined });
    else onChange({ carRentalAddon: { vehicleSize: 4, pickupLocation: '' } });
  };

  return (
    <section>
      <h2 className="text-xl font-bold mb-2">{locale === 'en' ? 'Add a private car?' : 'เพิ่มรถส่วนตัว?'}</h2>
      <p className="text-ink-muted mb-5 text-sm">{locale === 'en' ? 'Optional — you can skip this step.' : 'ไม่จำเป็น — ข้ามไปได้'}</p>

      <label className="flex items-center gap-3 bg-white border border-line rounded-xl p-4 cursor-pointer mb-4">
        <input type="checkbox" checked={enabled} onChange={toggle} />
        <Car className="h-5 w-5 text-primary" />
        <span className="font-semibold">{locale === 'en' ? 'Yes, add car + driver' : 'ใช่ เพิ่มรถ + คนขับ'}</span>
      </label>

      {enabled && (
        <div className="space-y-4 max-w-lg">
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(carRentalRates) as unknown as VehicleSize[]).map((s) => {
              const k = Number(s) as VehicleSize;
              const rate = carRentalRates[k];
              const selected = size === k;
              return (
                <button
                  type="button"
                  key={k}
                  onClick={() => onChange({ carRentalAddon: { ...draft.carRentalAddon!, vehicleSize: k } })}
                  className={`text-left p-3 rounded-xl border-2 ${selected ? 'border-primary bg-primary-50' : 'border-line bg-white'}`}
                >
                  <div className="text-sm font-bold">{pickLocale(rate.label, locale)}</div>
                  <div className="text-xs text-ink-muted mt-1">{formatPrice(rate.perDay, locale)}/{locale === 'en' ? 'day' : 'วัน'}</div>
                </button>
              );
            })}
          </div>
          <div>
            <Label htmlFor="pickup">{locale === 'en' ? 'Pickup location' : 'จุดรับรถ'}</Label>
            <Input id="pickup" value={draft.carRentalAddon?.pickupLocation ?? ''} onChange={(e) => onChange({ carRentalAddon: { ...draft.carRentalAddon!, pickupLocation: e.target.value } })} placeholder="BKK Airport" />
          </div>
        </div>
      )}

      <div className="flex gap-2 mt-6">
        <Button variant="outline" onClick={onBack}>{locale === 'en' ? 'Back' : 'ย้อนกลับ'}</Button>
        <Button className="bg-primary hover:bg-primary-dark" onClick={onNext}>
          {enabled ? (locale === 'en' ? 'Continue' : 'ถัดไป') : (locale === 'en' ? 'Skip' : 'ข้าม')}
        </Button>
      </div>
    </section>
  );
}
