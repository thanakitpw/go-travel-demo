import type { VehicleSize } from '@/types';

export const carRentalRates: Record<VehicleSize, { perDay: number; label: { th: string; en: string } }> = {
  4: { perDay: 2500, label: { th: 'รถเก๋ง 4 ที่นั่ง', en: 'Sedan (4 seats)' } },
  8: { perDay: 3800, label: { th: 'รถตู้ 8 ที่นั่ง', en: 'Van (8 seats)' } },
  12: { perDay: 4900, label: { th: 'รถตู้ 12 ที่นั่ง', en: 'Van (12 seats)' } },
  16: { perDay: 6500, label: { th: 'รถมินิบัส 16 ที่นั่ง', en: 'Mini-bus (16 seats)' } },
};
