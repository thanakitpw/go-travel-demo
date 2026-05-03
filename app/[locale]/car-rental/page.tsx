import { useLocale } from 'next-intl';
import { CarRentalForm } from '@/components/car-rental/car-rental-form';

export default async function CarRentalPage({ params }: { params: Promise<{ locale: string }> }) {
  await params;
  return <CarRentalContent />;
}

function CarRentalContent() {
  const locale = useLocale();
  return (
    <div className="py-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-extrabold tracking-tight mb-2">
        {locale === 'en' ? 'Car + Driver Rental' : 'เช่ารถ + คนขับ'}
      </h1>
      <p className="text-ink-muted mb-8">
        {locale === 'en' ? 'Pick a vehicle size, dates, and route. We handle the rest.' : 'เลือกขนาดรถ วันที่ และเส้นทาง — เราจัดการที่เหลือ'}
      </p>
      <CarRentalForm />
    </div>
  );
}
