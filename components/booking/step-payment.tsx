'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { QrCode, CreditCard, Building2 } from 'lucide-react';
import type { Tour, PaymentMethod } from '@/types';
import type { BookingDraft } from './booking-types';
import { Button } from '@/components/ui/button';
import { calculateJoinTotal, calculatePrivateTotal, calculateCarAddon } from '@/lib/pricing';
import { formatPrice } from '@/lib/i18n';

export function StepPayment({
  tour, draft, onSubmit, onBack,
}: {
  tour: Tour;
  draft: BookingDraft;
  onSubmit: (method: PaymentMethod) => void | Promise<void>;
  onBack: () => void;
}) {
  const locale = useLocale();
  const [method, setMethod] = useState<PaymentMethod>('qr');
  const [submitting, setSubmitting] = useState(false);

  let tourTotal = 0;
  try {
    tourTotal =
      draft.mode === 'join'
        ? calculateJoinTotal(tour, draft.travelers)
        : calculatePrivateTotal(tour, draft.travelers);
  } catch {
    tourTotal = 0;
  }
  const addonTotal = draft.carRentalAddon
    ? calculateCarAddon(draft.carRentalAddon.vehicleSize, tour.duration.days)
    : 0;
  const total = tourTotal + addonTotal;

  async function handleConfirm() {
    setSubmitting(true);
    await onSubmit(method);
    setSubmitting(false);
  }

  const methods: Array<{ k: PaymentMethod; icon: typeof QrCode; label: string }> = [
    { k: 'qr', icon: QrCode, label: 'QR PromptPay' },
    { k: 'card', icon: CreditCard, label: locale === 'en' ? 'Credit card' : 'บัตรเครดิต' },
    { k: 'transfer', icon: Building2, label: locale === 'en' ? 'Bank transfer' : 'โอนผ่านธนาคาร' },
  ];

  return (
    <section>
      <h2 className="text-xl font-bold mb-4">{locale === 'en' ? 'Choose payment method' : 'เลือกวิธีชำระเงิน'}</h2>
      <div className="grid grid-cols-3 gap-2 mb-6">
        {methods.map(({ k, icon: Icon, label }) => (
          <button
            type="button"
            key={k}
            onClick={() => setMethod(k)}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition ${method === k ? 'border-primary bg-primary-50' : 'border-line bg-white'}`}
          >
            <Icon className={`h-5 w-5 ${method === k ? 'text-primary' : 'text-ink-muted'}`} />
            <span className="text-xs font-semibold">{label}</span>
          </button>
        ))}
      </div>

      <div className="bg-white border border-line rounded-xl p-6 mb-4 text-center">
        {method === 'qr' && (
          <div
            className="mx-auto rounded-lg"
            style={{
              width: 180, height: 180,
              background: 'repeating-conic-gradient(#0f172a 0% 25%, #ffffff 0% 50%) 50%/20px 20px',
            }}
            aria-label="QR PromptPay placeholder"
          />
        )}
        {method === 'card' && (
          <div className="text-sm text-ink-muted">
            {locale === 'en' ? 'Card form (mock — no charge)' : 'ฟอร์มบัตรเครดิต (mock — ไม่ตัดเงินจริง)'}
          </div>
        )}
        {method === 'transfer' && (
          <div className="text-sm">
            <p className="text-ink-muted mb-1">{locale === 'en' ? 'Transfer to' : 'โอนเข้าบัญชี'}</p>
            <p className="font-bold">SCB · 123-4-56789-0 · Go Travel Co., Ltd.</p>
          </div>
        )}
        <div className="mt-5 text-xs uppercase tracking-wider text-ink-muted">{locale === 'en' ? 'Total' : 'ยอดรวม'}</div>
        <div className="text-3xl font-extrabold text-primary">{formatPrice(total, locale)}</div>
      </div>

      <div className="bg-pastel-amber/40 text-pastel-amber-ink text-xs rounded-md p-2.5 mb-4">
        DEMO: {locale === 'en' ? 'Click "Confirm" to simulate payment success.' : 'กดยืนยันเพื่อจำลองการชำระเงิน'}
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onBack} disabled={submitting}>{locale === 'en' ? 'Back' : 'ย้อนกลับ'}</Button>
        <Button className="bg-primary hover:bg-primary-dark" disabled={submitting} onClick={handleConfirm}>
          {submitting ? (locale === 'en' ? 'Processing...' : 'กำลังประมวลผล...') : (locale === 'en' ? 'Confirm payment' : 'ยืนยันการชำระ')}
        </Button>
      </div>
    </section>
  );
}
