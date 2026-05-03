import { useLocale } from 'next-intl';

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  await params;
  return <AboutContent />;
}

function AboutContent() {
  const locale = useLocale();
  return (
    <div className="py-12 max-w-3xl mx-auto">
      <h1 className="text-3xl font-extrabold tracking-tight mb-4">
        {locale === 'en' ? 'About Go Travel' : 'เกี่ยวกับ Go Travel'}
      </h1>
      <p className="text-ink-muted">
        {locale === 'en'
          ? 'Go Travel curates small-group tours across Asia with a focus on local culture and seasonal experiences. Every trip is designed and led by our in-house team.'
          : 'Go Travel จัดทัวร์กลุ่มเล็กทั่วเอเชีย เน้นวัฒนธรรมท้องถิ่นและประสบการณ์ตามฤดูกาล ทุกทริปออกแบบและนำเที่ยวโดยทีมงานของเราเอง'}
      </p>
    </div>
  );
}
