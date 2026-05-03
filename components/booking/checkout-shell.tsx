'use client';

import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import type { Tour, TripInstance } from '@/types';
import { useBookingState } from './use-booking-state';
import { StepRail } from './step-rail';
import { StepSelection } from './step-selection';
import { StepTravelers } from './step-travelers';
import { StepAddon } from './step-addon';
import { StepContact } from './step-contact';
import { StepReview } from './step-review';
import { StepPayment } from './step-payment';
import { BookingSummary } from './booking-summary';
import type { BookingDraft } from './booking-types';

export function CheckoutShell({
  tour, trips, initial,
}: {
  tour: Tour;
  trips: TripInstance[];
  initial: BookingDraft;
}) {
  const locale = useLocale();
  const router = useRouter();
  const { draft, update, step, next, back, reset } = useBookingState(initial);

  async function submitBooking(method: 'qr' | 'card' | 'transfer') {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: draft.mode,
        tourSlug: draft.tourSlug,
        tripId: draft.tripId,
        privateDate: draft.privateDate,
        travelers: draft.travelers,
        contact: draft.contact,
        carRentalAddon: draft.carRentalAddon
          ? { ...draft.carRentalAddon, days: tour.duration.days }
          : undefined,
        payment: { method },
      }),
    });
    if (res.status === 409) {
      alert(locale === 'en' ? 'Just sold out — sorry!' : 'เพิ่งเต็มไป ขออภัย');
      return;
    }
    if (!res.ok) {
      alert('Error');
      return;
    }
    const json = await res.json();
    reset();
    const prefix = locale === 'en' ? '/en' : '';
    router.push(`${prefix}/booking/success/${json.booking.id}`);
  }

  return (
    <div className="py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <StepRail current={step} />

        {step === 'selection' && (
          <StepSelection tour={tour} trips={trips} draft={draft} onChange={update} onNext={next} />
        )}
        {step === 'travelers' && (
          <StepTravelers tour={tour} draft={draft} onChange={update} onNext={next} onBack={back} />
        )}
        {step === 'addon' && <StepAddon draft={draft} onChange={update} onNext={next} onBack={back} />}
        {step === 'contact' && <StepContact draft={draft} onChange={update} onNext={next} onBack={back} />}
        {step === 'review' && (
          <StepReview tour={tour} draft={draft} onNext={next} onBack={back} />
        )}
        {step === 'payment' && (
          <StepPayment tour={tour} draft={draft} onSubmit={submitBooking} onBack={back} />
        )}
      </div>

      <BookingSummary tour={tour} draft={draft} />
    </div>
  );
}
