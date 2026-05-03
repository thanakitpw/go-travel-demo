'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import type { Tour } from '@/types';
import type { BookingDraft } from './booking-types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

export function StepReview({
  tour: _tour, draft: _draft, onNext, onBack,
}: {
  tour: Tour;
  draft: BookingDraft;
  onNext: () => void;
  onBack: () => void;
}) {
  const locale = useLocale();
  const [agreed, setAgreed] = useState(false);

  return (
    <section>
      <h2 className="text-xl font-bold mb-4">{locale === 'en' ? 'Review & confirm' : 'ตรวจสอบและยืนยัน'}</h2>
      <p className="text-sm text-ink-muted mb-4">
        {locale === 'en' ? 'Please verify the details on the right before continuing.' : 'กรุณาตรวจสอบรายละเอียดด้านขวามือก่อนดำเนินการต่อ'}
      </p>

      <label className="flex items-start gap-2 bg-pastel-amber/40 rounded-lg p-3 mb-6 cursor-pointer">
        <Checkbox checked={agreed} onCheckedChange={(v) => setAgreed(v === true)} />
        <span className="text-sm">
          {locale === 'en' ? 'I agree to the terms and cancellation policy.' : 'ฉันยอมรับข้อกำหนดและเงื่อนไขการยกเลิก'}
        </span>
      </label>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onBack}>{locale === 'en' ? 'Back' : 'ย้อนกลับ'}</Button>
        <Button className="bg-primary hover:bg-primary-dark" disabled={!agreed} onClick={onNext}>
          {locale === 'en' ? 'Proceed to payment' : 'ไปยังการชำระเงิน'}
        </Button>
      </div>
    </section>
  );
}
