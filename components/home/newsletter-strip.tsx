import { useTranslations } from 'next-intl';
import { MessageCircle, Phone } from 'lucide-react';

export function NewsletterStrip() {
  const t = useTranslations('newsletter');
  return (
    <section className="mb-20 -mx-8 px-8">
      <div
        className="mx-auto max-w-7xl rounded-3xl px-10 py-12 md:px-16 md:py-14 text-white"
        style={{
          background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">{t('title')}</h2>
            <p className="opacity-95 max-w-md">{t('subtitle')}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 md:justify-end">
            <a
              href="https://line.me/R/ti/p/@gotravel"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer inline-flex items-center justify-center gap-2 bg-white text-primary px-6 py-3.5 rounded-xl font-bold hover:bg-pastel-blue transition-colors duration-200"
            >
              <MessageCircle className="h-5 w-5" />
              {t('lineButton')}
            </a>
            <a
              href="tel:020000000"
              className="cursor-pointer inline-flex items-center justify-center gap-2 bg-primary-dark/40 text-white border border-white/30 px-6 py-3.5 rounded-xl font-bold hover:bg-primary-dark/60 transition-colors duration-200"
            >
              <Phone className="h-5 w-5" />
              {t('callButton')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
