import { useLocale } from 'next-intl';
import { Phone, Mail, MessageCircle } from 'lucide-react';

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  await params;
  return <ContactContent />;
}

function ContactContent() {
  const locale = useLocale();
  const items = [
    { icon: Phone, label: '02-000-0000' },
    { icon: Mail, label: 'hello@gotravel.demo' },
    { icon: MessageCircle, label: '@gotravel' },
  ];
  return (
    <div className="py-12 max-w-2xl mx-auto">
      <h1 className="text-3xl font-extrabold tracking-tight mb-6">
        {locale === 'en' ? 'Contact Us' : 'ติดต่อเรา'}
      </h1>
      <ul className="space-y-3">
        {items.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-3 bg-white border border-line rounded-xl px-5 py-4">
            <Icon className="h-5 w-5 text-primary" />
            <span className="font-medium">{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
