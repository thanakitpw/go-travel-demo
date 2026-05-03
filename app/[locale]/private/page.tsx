import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Users, ArrowRight } from 'lucide-react';
import { tours } from '@/data/tours';
import { pickLocale, formatPrice } from '@/lib/i18n';

export default async function PrivatePage({ params }: { params: Promise<{ locale: string }> }) {
  await params;
  return <PrivateContent />;
}

function PrivateContent() {
  const locale = useLocale();
  const prefix = locale === 'en' ? '/en' : '';
  return (
    <div className="py-8">
      <div className="bg-pastel-amber rounded-2xl p-8 mb-8 flex items-start gap-4">
        <div className="h-12 w-12 rounded-xl bg-white text-pastel-amber-ink flex items-center justify-center flex-shrink-0">
          <Users className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">
            {locale === 'en' ? 'Private Group Tours' : 'ทัวร์ไพรเวทกรุ๊ป'}
          </h1>
          <p className="text-ink-muted">
            {locale === 'en'
              ? '4-16 travelers · book any program on your own dates · 3 group-size pricing tiers.'
              : '4-16 ท่าน · เลือกโปรแกรมและวันเดินทางเอง · 3 ระดับราคาตามขนาดกลุ่ม'}
          </p>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">{locale === 'en' ? 'Pick a program' : 'เลือกโปรแกรม'}</h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tours.map((tour) => (
          <li key={tour.slug} className="bg-white border border-line rounded-xl p-5 flex items-center justify-between gap-4">
            <div>
              <div className="font-bold mb-1">{pickLocale(tour.name, locale)}</div>
              <div className="text-sm text-ink-muted">
                {locale === 'en' ? 'From' : 'เริ่มต้น'} {formatPrice(tour.privatePricing[2].perPerson, locale)} {locale === 'en' ? '/person (12-16)' : '/ท่าน (12-16 คน)'}
              </div>
            </div>
            <Link
              href={`${prefix}/booking/checkout?mode=private&tourSlug=${tour.slug}`}
              className="inline-flex items-center gap-1 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold"
            >
              {locale === 'en' ? 'Book' : 'จอง'}
              <ArrowRight className="h-3 w-3" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
