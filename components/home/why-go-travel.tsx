import { useTranslations } from 'next-intl';
import { BadgeCheck, Shield, Users, BadgeDollarSign } from 'lucide-react';

export function WhyGoTravel() {
  const t = useTranslations('why');
  const pillars = [
    { icon: BadgeCheck, bg: 'bg-pastel-blue', ink: 'text-pastel-blue-ink', title: t('p1Title'), desc: t('p1Desc') },
    { icon: Shield, bg: 'bg-pastel-green', ink: 'text-pastel-green-ink', title: t('p2Title'), desc: t('p2Desc') },
    { icon: Users, bg: 'bg-pastel-amber', ink: 'text-pastel-amber-ink', title: t('p3Title'), desc: t('p3Desc') },
    { icon: BadgeDollarSign, bg: 'bg-pastel-pink', ink: 'text-pastel-pink-ink', title: t('p4Title'), desc: t('p4Desc') },
  ];

  return (
    <section className="mb-20">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold tracking-tight mb-2">{t('title')}</h2>
        <p className="text-ink-muted">{t('subtitle')}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {pillars.map(({ icon: Icon, bg, ink, title, desc }) => (
          <div key={title} className="bg-white border border-line rounded-2xl p-6 text-center">
            <div className={`mx-auto h-14 w-14 rounded-2xl ${bg} ${ink} flex items-center justify-center mb-4`}>
              <Icon className="h-7 w-7" />
            </div>
            <h3 className="font-bold mb-2">{title}</h3>
            <p className="text-sm text-ink-muted leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
