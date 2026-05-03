import type { I18n, I18nArray } from '@/lib/i18n';

export type { I18n, I18nArray };

export type Tour = {
  slug: string;
  name: I18n;
  destination: I18n;
  destinationCode: string;
  summary: I18n;
  duration: { days: number; nights: number };
  coverImage: string;
  gallery: string[];
  highlights: I18nArray;
  itinerary: Array<{
    day: number;
    title: I18n;
    activities: I18nArray;
  }>;
  includes: I18nArray;
  excludes: I18nArray;
  groupPricing: { perPerson: number };
  privatePricing: Array<{ minPax: number; maxPax: number; perPerson: number }>;
  joinMaxCapacity: number;
  joinMinToDepart: number;
  tags?: string[];
};

export type TripStatus = 'open' | 'closing-soon' | 'full' | 'departed';

export type TripInstance = {
  id: string;
  tourSlug: string;
  departDate: string;
  returnDate: string;
  registeredCount: number;
  status: TripStatus;
};

export type BookingMode = 'join' | 'private';
export type PaymentMethod = 'qr' | 'card' | 'transfer';
export type BookingStatus = 'pending' | 'confirmed';
export type VehicleSize = 4 | 8 | 12 | 16;

export type Booking = {
  id: string;
  mode: BookingMode;
  tourSlug: string;
  tripId?: string;
  privateDate?: string;
  travelers: { adults: number; children: number; infants: number };
  contact: {
    name: string;
    email: string;
    phone: string;
    lineId?: string;
    note?: string;
  };
  carRentalAddon?: {
    vehicleSize: VehicleSize;
    days: number;
    pickupLocation: string;
  };
  payment: { method: PaymentMethod; amount: number };
  status: BookingStatus;
  createdAt: string;
};

export type CarRental = {
  id: string;
  vehicleSize: VehicleSize;
  pickupDate: string;
  returnDate: string;
  pickupLocation: string;
  destination: string;
  contact: { name: string; email: string; phone: string };
  estimatedPrice: number;
  createdAt: string;
};
