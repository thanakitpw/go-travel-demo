import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Plane, Calendar, Users, Car } from 'lucide-react';

export function QuickCategories() {
  const locale = useLocale();
  const prefix = locale === 'en' ? '/en' : '';
  const items = [
    { href: `${prefix}/tours`, icon: Plane, bg: 'bg-pastel-blue', ink: 'text-pastel-blue-ink',
      title: locale === 'en' ? '1-3 Day Trips' : 'ทัวร์ 1-3 วัน',
      desc: locale === 'en' ? 'Quick getaways' : 'ทริปสั้น เริ่มได้ทันที' },
    { href: `${prefix}/trips`, icon: Calendar, bg: 'bg-pastel-green', ink: 'text-pastel-green-ink',
      title: locale === 'en' ? 'Annual Schedule' : 'ตารางทริปทั้งปี',
      desc: locale === 'en' ? '8 yearly programs' : '8 โปรแกรมประจำปี' },
    { href: `${prefix}/private`, icon: Users, bg: 'bg-pastel-amber', ink: 'text-pastel-amber-ink',
      title: locale === 'en' ? 'Private Group' : 'ไพรเวทกรุ๊ป',
      desc: locale === 'en' ? '4-16 travelers' : '4-16 ท่าน' },
    { href: `${prefix}/car-rental`, icon: Car, bg: 'bg-pastel-pink', ink: 'text-pastel-pink-ink',
      title: locale === 'en' ? 'Car + Driver' : 'เช่ารถ + คนขับ',
      desc: locale === 'en' ? 'Private transport' : 'รถส่วนตัว' },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
      {items.map(({ href, icon: Icon, bg, ink, title, desc }) => (
        <Link
          key={href}
          href={href}
          className="bg-white rounded-2xl border border-line p-6 hover:-translate-y-0.5 hover:shadow-lg transition"
        >
          <div className={`h-12 w-12 rounded-xl ${bg} ${ink} flex items-center justify-center mb-4`}>
            <Icon className="h-5 w-5" />
          </div>
          <h3 className="font-bold mb-1">{title}</h3>
          <p className="text-xs text-ink-muted">{desc}</p>
        </Link>
      ))}
    </section>
  );
}
