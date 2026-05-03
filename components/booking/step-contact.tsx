'use client';

import { useLocale } from 'next-intl';
import type { BookingDraft } from './booking-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function StepContact({
  draft, onChange, onNext, onBack,
}: {
  draft: BookingDraft;
  onChange: (patch: Partial<BookingDraft>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const locale = useLocale();
  const c = draft.contact;
  const set = (k: keyof typeof c, v: string) => onChange({ contact: { ...c, [k]: v } });
  const valid = c.name && /\S+@\S+\.\S+/.test(c.email) && c.phone.length >= 8;

  return (
    <section>
      <h2 className="text-xl font-bold mb-4">{locale === 'en' ? 'Lead traveler info' : 'ข้อมูลหัวหน้ากลุ่ม'}</h2>
      <div className="space-y-4 max-w-lg">
        <div>
          <Label htmlFor="name">{locale === 'en' ? 'Full name' : 'ชื่อ-นามสกุล'}</Label>
          <Input id="name" value={c.name} onChange={(e) => set('name', e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={c.email} onChange={(e) => set('email', e.target.value)} />
          </div>
          <div>
            <Label htmlFor="phone">{locale === 'en' ? 'Phone' : 'เบอร์โทร'}</Label>
            <Input id="phone" value={c.phone} onChange={(e) => set('phone', e.target.value)} />
          </div>
        </div>
        <div>
          <Label htmlFor="line">LINE ID ({locale === 'en' ? 'optional' : 'ไม่บังคับ'})</Label>
          <Input id="line" value={c.lineId ?? ''} onChange={(e) => set('lineId', e.target.value)} />
        </div>
        <div>
          <Label htmlFor="note">{locale === 'en' ? 'Note (allergies, requests)' : 'หมายเหตุ (อาหาร, อื่นๆ)'}</Label>
          <textarea id="note" value={c.note ?? ''} onChange={(e) => set('note', e.target.value)} className="w-full border border-line rounded-md px-3 py-2 text-sm min-h-[80px]" />
        </div>
      </div>
      <div className="flex gap-2 mt-6">
        <Button variant="outline" onClick={onBack}>{locale === 'en' ? 'Back' : 'ย้อนกลับ'}</Button>
        <Button className="bg-primary hover:bg-primary-dark" disabled={!valid} onClick={onNext}>
          {locale === 'en' ? 'Continue' : 'ถัดไป'}
        </Button>
      </div>
    </section>
  );
}
