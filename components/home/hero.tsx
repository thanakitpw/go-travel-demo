import { useTranslations, useLocale } from 'next-intl';
import { Star, MapPin, Calendar, Users, Search, Award, Shield } from 'lucide-react';
import { HeroCarousel } from './hero-carousel';

export function Hero() {
  const t = useTranslations('home');
  const tHero = useTranslations('home_hero');
  const locale = useLocale();
  const prefix = locale === 'en' ? '/en' : '';

  return (
    <section className="relative -mx-8 mb-20">
      {/* Full-bleed carousel */}
      <HeroCarousel locale={locale === 'en' ? 'en' : 'th'} />

      {/* Headline + stats + search bar — sits below carousel in normal container */}
      <div className="mx-auto max-w-6xl px-8 -mt-16 relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl border border-line p-8 md:p-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary mb-4">
            <Star className="h-3 w-3" />
            {locale === 'en' ? 'Curated · 8 Asian destinations' : 'ทัวร์คัดสรร · 8 ปลายทางในเอเชีย'}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-8 items-end mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-[1.1] tracking-tight whitespace-pre-line text-ink">
                {t('heroTitle')}
              </h1>
              <p className="mt-4 max-w-md text-ink-muted text-base md:text-lg">{t('heroSub')}</p>
            </div>

            {/* Stats column */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-pastel-blue rounded-xl p-3 flex items-center gap-2">
                <Award className="h-5 w-5 text-pastel-blue-ink flex-shrink-0" />
                <div className="text-xs">
                  <div className="font-extrabold text-ink">5,000+</div>
                  <div className="text-ink-muted">{tHero('statHappy')}</div>
                </div>
              </div>
              <div className="bg-pastel-amber rounded-xl p-3 flex items-center gap-2">
                <Star className="h-5 w-5 text-pastel-amber-ink fill-current flex-shrink-0" />
                <div className="text-xs">
                  <div className="font-extrabold text-ink">4.9</div>
                  <div className="text-ink-muted">{tHero('statRating')}</div>
                </div>
              </div>
              <div className="bg-pastel-green rounded-xl p-3 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-pastel-green-ink flex-shrink-0" />
                <div className="text-xs">
                  <div className="font-extrabold text-ink">8</div>
                  <div className="text-ink-muted">{tHero('statDest')}</div>
                </div>
              </div>
              <div className="bg-pastel-pink rounded-xl p-3 flex items-center gap-2">
                <Shield className="h-5 w-5 text-pastel-pink-ink flex-shrink-0" />
                <div className="text-xs">
                  <div className="font-extrabold text-ink">100%</div>
                  <div className="text-ink-muted">{tHero('statSafety')}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Search bar */}
          <form
            action={`${prefix}/tours`}
            className="border-t border-line pt-6 grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_auto] gap-2"
          >
            <label className="flex items-center gap-3 px-4 py-3 border border-line rounded-xl cursor-pointer hover:border-primary transition-colors">
              <MapPin className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <div className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider">{tHero('searchDestLabel')}</div>
                <div className="text-sm font-semibold text-ink">{locale === 'en' ? 'All destinations' : 'ทุกปลายทาง'}</div>
              </div>
            </label>

            <label className="flex items-center gap-3 px-4 py-3 border border-line rounded-xl cursor-pointer hover:border-primary transition-colors">
              <Calendar className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <div className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider">{tHero('searchDateLabel')}</div>
                <div className="text-sm font-semibold text-ink">{locale === 'en' ? 'Any month' : 'ทุกเดือน'}</div>
              </div>
            </label>

            <label className="flex items-center gap-3 px-4 py-3 border border-line rounded-xl cursor-pointer hover:border-primary transition-colors">
              <Users className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <div className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider">{tHero('searchPaxLabel')}</div>
                <div className="text-sm font-semibold text-ink">{locale === 'en' ? '2 adults' : '2 ผู้ใหญ่'}</div>
              </div>
            </label>

            <button
              type="submit"
              className="cursor-pointer bg-primary hover:bg-primary-dark text-white rounded-xl px-6 py-3 font-semibold inline-flex items-center justify-center gap-2 transition-colors duration-200"
            >
              <Search className="h-4 w-4" />
              {tHero('searchButton')}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
