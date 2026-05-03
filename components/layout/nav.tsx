import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LangSwitcher } from './lang-switcher';

export function Nav() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const prefix = locale === 'en' ? '/en' : '';

  const links = [
    { href: `${prefix}/`, label: t('home') },
    { href: `${prefix}/tours`, label: t('tours') },
    { href: `${prefix}/trips`, label: t('trips') },
    { href: `${prefix}/private`, label: t('private') },
    { href: `${prefix}/car-rental`, label: t('carRental') },
    { href: `${prefix}/about`, label: t('about') },
  ];

  return (
    <header className="border-b border-line bg-white sticky top-0 z-50">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-8 py-4">
        <Link href={`${prefix}/`} className="flex items-center gap-2 text-primary font-extrabold text-xl tracking-tight">
          <Plane className="h-5 w-5" />
          Go Travel
        </Link>

        <nav className="hidden md:flex gap-7 text-sm font-medium">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-primary transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LangSwitcher />
          <Button asChild className="bg-primary hover:bg-primary-dark">
            <Link href={`${prefix}/tours`}>{t('bookNow')}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
