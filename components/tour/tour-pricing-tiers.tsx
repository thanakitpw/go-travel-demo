import { useLocale } from 'next-intl';
import type { Tour } from '@/types';
import { formatPrice } from '@/lib/i18n';

export function TourPricingTiers({ tour }: { tour: Tour }) {
  const locale = useLocale();
  return (
    <div className="bg-white border border-line rounded-xl p-5">
      <h3 className="font-bold mb-3">{locale === 'en' ? 'Private group pricing' : 'ราคาไพรเวทกรุ๊ป'}</h3>
      <div className="space-y-2">
        {tour.privatePricing.map((tier) => (
          <div key={`${tier.minPax}-${tier.maxPax}`} className="flex items-center justify-between bg-pastel-blue rounded-lg px-4 py-3 text-sm">
            <span>
              {tier.minPax}-{tier.maxPax} {locale === 'en' ? 'travelers' : 'ท่าน'}
            </span>
            <span className="font-extrabold text-primary">
              {formatPrice(tier.perPerson, locale)}
              <span className="text-xs font-medium text-ink-muted ml-1">
                {locale === 'en' ? '/person' : '/ท่าน'}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
