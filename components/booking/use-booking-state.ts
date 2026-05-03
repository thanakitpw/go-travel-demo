'use client';

import { useState, useEffect, useCallback } from 'react';
import type { BookingDraft, StepKey } from './booking-types';
import { STEPS } from './booking-types';

const STORAGE_KEY = 'go-travel-booking-draft';

export function useBookingState(initial: BookingDraft) {
  const [draft, setDraft] = useState<BookingDraft>(() => {
    if (typeof window === 'undefined') return initial;
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as BookingDraft;
        if (parsed.tourSlug === initial.tourSlug) return { ...initial, ...parsed };
      } catch {}
    }
    return initial;
  });
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }, [draft]);

  const update = useCallback((patch: Partial<BookingDraft>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  }, []);

  const next = useCallback(() => setStepIdx((i) => Math.min(i + 1, STEPS.length - 1)), []);
  const back = useCallback(() => setStepIdx((i) => Math.max(i - 1, 0)), []);
  const goTo = useCallback((step: StepKey) => setStepIdx(STEPS.indexOf(step)), []);
  const reset = useCallback(() => sessionStorage.removeItem(STORAGE_KEY), []);

  return { draft, update, stepIdx, step: STEPS[stepIdx], next, back, goTo, reset };
}
