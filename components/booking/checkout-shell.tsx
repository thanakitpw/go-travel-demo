'use client';

import type { Tour, TripInstance } from '@/types';
import { useBookingState } from './use-booking-state';
import { StepRail } from './step-rail';
import { StepSelection } from './step-selection';
import type { BookingDraft } from './booking-types';

export function CheckoutShell({
  tour, trips, initial,
}: {
  tour: Tour;
  trips: TripInstance[];
  initial: BookingDraft;
}) {
  const { draft, update, step, next } = useBookingState(initial);

  return (
    <div className="py-8">
      <StepRail current={step} />

      {step === 'selection' && (
        <StepSelection tour={tour} trips={trips} draft={draft} onChange={update} onNext={next} />
      )}

      {/* T24 will add the remaining 5 steps and a sidebar here */}
      {step !== 'selection' && (
        <div className="bg-pastel-blue/40 p-6 rounded-xl text-sm text-ink-muted">
          Step &quot;{step}&quot; — coming in T24.
        </div>
      )}
    </div>
  );
}
