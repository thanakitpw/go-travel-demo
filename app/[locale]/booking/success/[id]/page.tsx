import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { useLocale } from 'next-intl';
import { store } from '@/lib/store';
import { getTour } from '@/data/tours';
import type { Booking, Tour } from '@/types';
import { pickLocale, formatPrice, formatDate } from '@/lib/i18n';
import { PrintButton } from '@/components/booking/print-button';

export default async function BookingSuccessPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;
  const booking = store.getBooking(id);
  if (!booking) notFound();
  const tour = getTour(booking.tourSlug);
  if (!tour) notFound();
  return <SuccessContent booking={booking} tour={tour} />;
}

function SuccessContent({ booking, tour }: { booking: Booking; tour: Tour }) {
  const locale = useLocale();
  const prefix = locale === 'en' ? '/en' : '';
  return (
    <div className="py-12 max-w-2xl mx-auto">
      <div className="bg-white border border-line rounded-2xl p-10 text-center">
        <div className="mx-auto h-16 w-16 rounded-full bg-pastel-green-ink/10 text-pastel-green-ink flex items-center justify-center mb-4">
          <Check className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">
          {locale === 'en' ? 'Booking confirmed!' : 'จองสำเร็จ!'}
        </h1>
        <p className="text-ink-muted mb-6">
          {locale === 'en' ? 'A confirmation has been sent to' : 'อีเมลยืนยันส่งไปที่'} <strong>{booking.contact.email}</strong>
        </p>
        <div className="bg-pastel-blue rounded-xl p-5 mb-6 text-left space-y-2">
          <div className="flex justify-between text-sm"><span className="text-ink-muted">{locale === 'en' ? 'Booking ID' : 'หมายเลขจอง'}</span><span className="font-bold">{booking.id}</span></div>
          <div className="flex justify-between text-sm"><span className="text-ink-muted">{locale === 'en' ? 'Tour' : 'โปรแกรม'}</span><span className="font-semibold">{pickLocale(tour.name, locale)}</span></div>
          {booking.privateDate && (
            <div className="flex justify-between text-sm"><span className="text-ink-muted">{locale === 'en' ? 'Departure' : 'วันเดินทาง'}</span><span>{formatDate(booking.privateDate, locale)}</span></div>
          )}
          <div className="flex justify-between text-sm border-t border-white pt-2"><span className="text-ink-muted">{locale === 'en' ? 'Total paid' : 'ยอดชำระ'}</span><span className="font-extrabold text-primary">{formatPrice(booking.payment.amount, locale)}</span></div>
        </div>
        <div className="flex gap-2 justify-center">
          <PrintButton label={locale === 'en' ? 'Print booking' : 'พิมพ์ใบจอง'} />
          <Link href={`${prefix}/`} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold">
            {locale === 'en' ? 'Back to home' : 'กลับหน้าแรก'}
          </Link>
        </div>
      </div>
    </div>
  );
}
