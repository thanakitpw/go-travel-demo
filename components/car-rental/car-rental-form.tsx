'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Car, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { carRentalRates } from '@/data/car-rental-pricing';
import { formatPrice, pickLocale } from '@/lib/i18n';
import type { VehicleSize } from '@/types';

const schema = z.object({
  vehicleSize: z.union([z.literal(4), z.literal(8), z.literal(12), z.literal(16)]),
  pickupDate: z.string().min(1),
  returnDate: z.string().min(1),
  pickupLocation: z.string().min(1),
  destination: z.string().min(1),
  contact: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(8),
  }),
});

type FormData = z.infer<typeof schema>;

export function CarRentalForm() {
  const locale = useLocale();
  const [success, setSuccess] = useState<{ id: string; price: number } | null>(null);

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { vehicleSize: 4 },
  });
  const size = watch('vehicleSize') as VehicleSize;

  async function onSubmit(data: FormData) {
    const res = await fetch('/api/car-rentals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) return;
    const json = await res.json();
    setSuccess({ id: json.carRental.id, price: json.carRental.estimatedPrice });
  }

  if (success) {
    return (
      <div className="bg-pastel-green/40 border border-pastel-green-ink/30 rounded-xl p-8 text-center">
        <div className="h-14 w-14 rounded-full bg-pastel-green-ink/10 text-pastel-green-ink mx-auto mb-4 flex items-center justify-center">
          <Check className="h-7 w-7" />
        </div>
        <h3 className="text-xl font-extrabold mb-1">
          {locale === 'en' ? 'Request received' : 'ส่งคำขอเรียบร้อย'}
        </h3>
        <p className="text-sm text-ink-muted">
          {locale === 'en' ? 'Booking ID' : 'หมายเลขจอง'}: <strong>{success.id}</strong>
        </p>
        <p className="text-sm text-ink-muted mt-1">
          {locale === 'en' ? 'Estimated' : 'ราคาประมาณ'}: <strong>{formatPrice(success.price, locale)}</strong>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-line rounded-2xl p-6 space-y-5">
      <div>
        <Label className="mb-2 block">{locale === 'en' ? 'Vehicle size' : 'ขนาดรถ'}</Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(Object.keys(carRentalRates) as unknown as VehicleSize[]).map((s) => {
            const k = Number(s) as VehicleSize;
            const rate = carRentalRates[k];
            const selected = size === k;
            return (
              <button
                type="button"
                key={k}
                onClick={() => setValue('vehicleSize', k)}
                className={`text-left p-4 rounded-xl border-2 transition ${selected ? 'border-primary bg-primary-50' : 'border-line bg-white hover:border-primary/40'}`}
              >
                <Car className={`h-5 w-5 mb-2 ${selected ? 'text-primary' : 'text-ink-muted'}`} />
                <div className="text-sm font-bold">{pickLocale(rate.label, locale)}</div>
                <div className="text-xs text-ink-muted mt-1">{formatPrice(rate.perDay, locale)}/{locale === 'en' ? 'day' : 'วัน'}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="pickupDate">{locale === 'en' ? 'Pickup date' : 'วันรับรถ'}</Label>
          <Input id="pickupDate" type="date" {...register('pickupDate')} />
          {errors.pickupDate && <p className="text-xs text-pastel-pink-ink mt-1">required</p>}
        </div>
        <div>
          <Label htmlFor="returnDate">{locale === 'en' ? 'Return date' : 'วันคืนรถ'}</Label>
          <Input id="returnDate" type="date" {...register('returnDate')} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="pickupLocation">{locale === 'en' ? 'Pickup location' : 'จุดรับรถ'}</Label>
          <Input id="pickupLocation" placeholder="BKK Airport" {...register('pickupLocation')} />
        </div>
        <div>
          <Label htmlFor="destination">{locale === 'en' ? 'Destination' : 'ปลายทาง'}</Label>
          <Input id="destination" placeholder="Pattaya" {...register('destination')} />
        </div>
      </div>

      <div className="border-t border-line pt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="name">{locale === 'en' ? 'Name' : 'ชื่อ'}</Label>
          <Input id="name" {...register('contact.name')} />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register('contact.email')} />
        </div>
        <div>
          <Label htmlFor="phone">{locale === 'en' ? 'Phone' : 'เบอร์โทร'}</Label>
          <Input id="phone" {...register('contact.phone')} />
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary-dark">
        {isSubmitting ? (locale === 'en' ? 'Sending...' : 'กำลังส่ง...') : (locale === 'en' ? 'Request booking' : 'ส่งคำขอจอง')}
      </Button>
    </form>
  );
}
