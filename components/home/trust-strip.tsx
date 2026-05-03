import { useTranslations } from 'next-intl';
import { ShieldCheck, Users, Star, BadgeCheck } from 'lucide-react';

export function TrustStrip() {
  const t = useTranslations('trust_strip');
  const items = [
    { icon: BadgeCheck, label: t('licensed') },
    { icon: Users, label: t('travelers') },
    { icon: Star, label: t('rating') },
    { icon: ShieldCheck, label: t('safety') },
  ];
  return (
    <section className="mb-12">
      <div className="bg-white border border-line rounded-2xl px-8 py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary-50 text-primary flex items-center justify-center flex-shrink-0">
              <Icon className="h-5 w-5" />
            </div>
            <span className="text-sm font-semibold text-ink">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
