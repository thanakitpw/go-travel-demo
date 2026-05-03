import { useTranslations } from 'next-intl';
import { Check } from 'lucide-react';
import { STEPS, type StepKey } from './booking-types';

export function StepRail({ current }: { current: StepKey }) {
  const t = useTranslations('booking');
  const currentIdx = STEPS.indexOf(current);
  const labels: Record<StepKey, string> = {
    selection: t('step1'),
    travelers: t('step2'),
    addon: t('step3'),
    contact: t('step4'),
    review: t('step5'),
    payment: t('step6'),
  };

  return (
    <ol className="flex items-center gap-2 mb-8 overflow-x-auto">
      {STEPS.map((s, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx;
        return (
          <li key={s} className="flex items-center gap-2 flex-shrink-0">
            <div
              className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${
                done ? 'bg-primary text-white' : active ? 'bg-primary text-white' : 'bg-line text-ink-muted'
              }`}
            >
              {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </div>
            <span className={`text-sm font-semibold ${active ? 'text-primary' : 'text-ink-muted'}`}>
              {labels[s]}
            </span>
            {i < STEPS.length - 1 && <span className="h-px w-6 bg-line ml-1" />}
          </li>
        );
      })}
    </ol>
  );
}
