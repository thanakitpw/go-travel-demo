import { useTranslations } from 'next-intl';
import { tours } from '@/data/tours';
import { trips } from '@/data/trips';
import { ToursFilter } from '@/components/tour/tours-filter';

export default async function ToursPage({ params }: { params: Promise<{ locale: string }> }) {
  await params;
  return <ToursContent />;
}

function ToursContent() {
  const t = useTranslations('nav');
  return (
    <div className="py-8">
      <h1 className="text-3xl font-extrabold tracking-tight mb-6">{t('tours')}</h1>
      <ToursFilter tours={tours} trips={trips} />
    </div>
  );
}
