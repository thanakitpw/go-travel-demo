'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { tours } from '@/data/tours';
import { trips } from '@/data/trips';
import { TourCard } from '@/components/tour/tour-card';
import { pickLocale } from '@/lib/i18n';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export function ToursByCountry() {
  const t = useTranslations('by_country');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const prefix = locale === 'en' ? '/en' : '';

  const countries = useMemo(() => {
    const map = new Map<string, string>();
    for (const tour of tours) {
      map.set(tour.destinationCode, pickLocale(tour.destination, locale));
    }
    return Array.from(map.entries());
  }, [locale]);

  const [active, setActive] = useState<string>(countries[0]?.[0] ?? '');

  const toursForCountry = (code: string) => tours.filter((t) => t.destinationCode === code);
  const tripFor = (slug: string) =>
    trips.filter((tr) => tr.tourSlug === slug && tr.status !== 'departed').sort((a, b) => a.departDate.localeCompare(b.departDate))[0];

  return (
    <section className="mb-20">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight mb-1">{t('title')}</h2>
          <p className="text-sm text-ink-muted">{t('subtitle')}</p>
        </div>
        <Link href={`${prefix}/tours`} className="hidden md:inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark cursor-pointer">
          {tCommon('viewAll')}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <Tabs value={active} onValueChange={setActive}>
        <TabsList className="flex flex-wrap h-auto bg-transparent gap-2 p-0 mb-6">
          {countries.map(([code, label]) => (
            <TabsTrigger
              key={code}
              value={code}
              className="cursor-pointer rounded-full px-5 py-2 text-sm font-semibold border border-line bg-white data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:border-primary transition-colors duration-200"
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {countries.map(([code]) => {
          const list = toursForCountry(code);
          return (
            <TabsContent key={code} value={code} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {list.map((tour) => (
                  <TourCard key={tour.slug} tour={tour} trip={tripFor(tour.slug)} />
                ))}
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </section>
  );
}
