import { useTranslations } from 'next-intl';
import { Plane, Mail, Phone, MessageCircle } from 'lucide-react';

export function Footer() {
  const t = useTranslations('nav');
  return (
    <footer className="border-t border-line bg-white mt-16">
      <div className="mx-auto max-w-7xl px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="flex items-center gap-2 text-primary font-extrabold text-lg">
            <Plane className="h-5 w-5" />
            Go Travel
          </div>
          <p className="text-ink-muted mt-2">Tour booking made simple.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">{t('tours')}</h4>
          <ul className="space-y-1 text-ink-muted">
            <li>{t('trips')}</li>
            <li>{t('private')}</li>
            <li>{t('carRental')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">{t('contact')}</h4>
          <ul className="space-y-2 text-ink-muted">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> 02-000-0000</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> hello@gotravel.demo</li>
            <li className="flex items-center gap-2"><MessageCircle className="h-4 w-4" /> @gotravel</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">{t('about')}</h4>
          <p className="text-ink-muted">© 2026 Go Travel Demo.</p>
        </div>
      </div>
    </footer>
  );
}
