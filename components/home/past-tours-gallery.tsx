import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { pastTours } from '@/data/past-tours-gallery';
import { pickLocale } from '@/lib/i18n';

export function PastToursGallery() {
  const t = useTranslations('gallery');
  const locale = useLocale();

  return (
    <section className="mb-20">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold tracking-tight mb-2">{t('title')}</h2>
        <p className="text-ink-muted">{t('subtitle')}</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {pastTours.map((g, i) => (
          <div
            key={g.id}
            className={`relative rounded-2xl overflow-hidden group cursor-pointer ${
              i % 4 === 0 ? 'aspect-[3/4]' : i % 4 === 3 ? 'aspect-[3/4]' : 'aspect-square'
            }`}
          >
            <Image
              src={g.image}
              alt={pickLocale(g.caption, locale)}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
              <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">{pickLocale(g.destination, locale)}</div>
              <div className="text-sm font-semibold">{pickLocale(g.caption, locale)}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
