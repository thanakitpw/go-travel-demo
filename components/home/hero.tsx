import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Star, MapPin, Calendar, Users, Search, Award, Shield } from 'lucide-react';

export function Hero() {
  const t = useTranslations('home');
  const tHero = useTranslations('home_hero');
  const locale = useLocale();
  const prefix = locale === 'en' ? '/en' : '';

  return (
    <section className="relative -mx-8 mb-24">
      <div
        className="relative h-[520px] overflow-hidden flex items-center"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(37,99,235,0.85), rgba(30,64,175,0.65) 70%, rgba(15,23,42,0.5)), url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="mx-auto max-w-7xl px-8 text-white w-full">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest opacity-90 mb-4">
            <Star className="h-3 w-3" />
            {locale === 'en' ? 'Curated · 8 Asian destinations' : 'ทัวร์คัดสรร · 8 ปลายทางในเอเชีย'}
          </div>
          <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tight whitespace-pre-line max-w-2xl">
            {t('heroTitle')}
          </h1>
          <p className="mt-4 max-w-md opacity-95 text-lg">{t('heroSub')}</p>

          {/* Stats row */}
          <div className="mt-8 flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              <span><strong>5,000+</strong> {tHero('statHappy')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-current" />
              <span><strong>4.9</strong> {tHero('statRating')}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span><strong>8</strong> {tHero('statDest')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span><strong>100%</strong> {tHero('statSafety')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search bar overlapping the hero */}
      <div className="mx-auto max-w-6xl px-8 -mt-12 relative z-10">
        <form
          action={`${prefix}/tours`}
          className="bg-white rounded-2xl shadow-2xl border border-line p-3 grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_auto] gap-2"
        >
          <label className="flex items-center gap-3 px-4 py-3 border-r border-line cursor-pointer">
            <MapPin className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <div className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider">{tHero('searchDestLabel')}</div>
              <div className="text-sm font-semibold text-ink">{locale === 'en' ? 'All destinations' : 'ทุกปลายทาง'}</div>
            </div>
          </label>

          <label className="flex items-center gap-3 px-4 py-3 border-r border-line cursor-pointer">
            <Calendar className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <div className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider">{tHero('searchDateLabel')}</div>
              <div className="text-sm font-semibold text-ink">{locale === 'en' ? 'Any month' : 'ทุกเดือน'}</div>
            </div>
          </label>

          <label className="flex items-center gap-3 px-4 py-3 cursor-pointer">
            <Users className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <div className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider">{tHero('searchPaxLabel')}</div>
              <div className="text-sm font-semibold text-ink">{locale === 'en' ? '2 adults' : '2 ผู้ใหญ่'}</div>
            </div>
          </label>

          <button
            type="submit"
            className="cursor-pointer bg-primary hover:bg-primary-dark text-white rounded-xl px-6 font-semibold inline-flex items-center justify-center gap-2 transition-colors duration-200"
          >
            <Search className="h-4 w-4" />
            {tHero('searchButton')}
          </button>
        </form>
      </div>
    </section>
  );
}
