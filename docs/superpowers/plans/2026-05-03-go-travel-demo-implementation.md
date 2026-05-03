# Go Travel Demo — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a clickable demo tour-booking website (Phase 1 from spec) with full booking flow, live counter, and bilingual TH/EN content — deployable to Vercel via GitHub.

**Architecture:** Next.js 15 App Router with `[locale]` segment for i18n. All tour content hardcoded in TypeScript files. In-memory store for bookings/counter (single migration point at `lib/store.ts` for Phase B/C). Server components by default; client components only where interactive. Pure functions for pricing — unit-tested via vitest.

**Tech Stack:** Next.js 15 · TypeScript · Tailwind CSS · shadcn/ui · next-intl · react-hook-form + zod · SWR · lucide-react · vitest

**Spec:** `docs/superpowers/specs/2026-05-03-go-travel-demo-design.md`

**Non-negotiables (from user):**
- NO emoji ever — every icon must come from `lucide-react`
- Inter (EN) + Noto Sans Thai (TH) via Google Fonts only
- Royal blue `#2563eb` primary + pastel accents
- Desktop-first responsive (not mobile-first)
- `lib/store.ts` is the SINGLE migration point for Phase B/C — all bookings/counter data goes through it

---

## Task 1: Initialize Next.js Project + Git

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `app/layout.tsx`, `app/page.tsx`, `.gitignore`, `README.md`

- [ ] **Step 1: Initialize Next.js project with create-next-app**

Run from `/Users/thanakitchaithong/Developer/bestsolutions/demo-website/tour/go-travel`:

```bash
npx create-next-app@latest . --typescript --tailwind --app --src-dir=false --import-alias="@/*" --no-eslint --use-npm --turbopack
```

When prompted "would you like to use ESLint?" — choose **No** (we'll configure later if needed).
When prompted "would you like to customize import alias?" — accept default `@/*`.

Expected: directory now has `app/`, `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `.gitignore`.

- [ ] **Step 2: Verify dev server starts**

```bash
npm run dev
```

Expected: server listens on http://localhost:3000 with default Next.js page. Stop with Ctrl+C.

- [ ] **Step 3: Initialize git and create .gitignore additions**

```bash
git init
git branch -M main
```

Append to `.gitignore`:

```
# Project additions
.superpowers/
.vercel/
.env*.local
*.log
```

- [ ] **Step 4: First commit**

```bash
git add .
git commit -m "chore: initialize Next.js 15 with App Router + TypeScript + Tailwind"
```

Expected: commit succeeds.

---

## Task 2: Install Runtime Dependencies

**Files:** `package.json` (modify)

- [ ] **Step 1: Install runtime libraries**

```bash
npm install next-intl@^3 swr@^2 react-hook-form@^7 zod@^3 @hookform/resolvers@^3 lucide-react@latest clsx tailwind-merge class-variance-authority
```

- [ ] **Step 2: Install dev dependencies (testing + lint)**

```bash
npm install -D vitest@^2 @vitest/ui jsdom @testing-library/react @testing-library/jest-dom @types/node
```

- [ ] **Step 3: Add npm scripts**

Edit `package.json` `"scripts"` block to read:

```json
"scripts": {
  "dev": "next dev --turbopack",
  "build": "next build",
  "start": "next start",
  "test": "vitest run",
  "test:watch": "vitest",
  "typecheck": "tsc --noEmit"
}
```

- [ ] **Step 4: Create vitest config**

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
```

Create `vitest.setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 5: Verify typecheck and test runner**

```bash
npm run typecheck
npm test
```

Expected: typecheck passes; `npm test` reports "no test files found" (zero tests so far is OK).

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json vitest.config.ts vitest.setup.ts
git commit -m "chore: add runtime + testing dependencies"
```

---

## Task 3: Configure Tailwind Theme + Fonts

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Replace tailwind.config.ts with theme**

```ts
import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'var(--font-noto-thai)', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#2563eb',
          dark: '#1e40af',
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
        },
        pastel: {
          blue: '#dbeafe',
          'blue-ink': '#2563eb',
          green: '#dcfce7',
          'green-ink': '#16a34a',
          amber: '#fef3c7',
          'amber-ink': '#d97706',
          pink: '#fce7f3',
          'pink-ink': '#db2777',
        },
        ink: {
          DEFAULT: '#0f172a',
          muted: '#64748b',
        },
        line: '#e2e8f0',
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
} satisfies Config;
```

- [ ] **Step 2: Replace app/globals.css**

```css
@import 'tailwindcss';

@layer base {
  html {
    font-family: var(--font-inter), var(--font-noto-thai), system-ui, sans-serif;
  }
  body {
    background: #f8fafc;
    color: #0f172a;
  }
}
```

- [ ] **Step 3: Replace app/layout.tsx with font loaders**

```tsx
import type { Metadata } from 'next';
import { Inter, Noto_Sans_Thai } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const notoThai = Noto_Sans_Thai({
  subsets: ['thai'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-noto-thai',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Go Travel',
  description: 'Tour booking made simple.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={`${inter.variable} ${notoThai.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 4: Configure next.config.ts for image formats**

Replace `next.config.ts`:

```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
```

- [ ] **Step 5: Verify build**

```bash
npm run build
```

Expected: build succeeds. Inter + Noto Sans Thai are downloaded by Next.js font system.

- [ ] **Step 6: Commit**

```bash
git add tailwind.config.ts app/globals.css app/layout.tsx next.config.ts
git commit -m "feat: configure Tailwind theme + Inter/Noto Sans Thai fonts"
```

---

## Task 4: Set Up shadcn/ui

**Files:**
- Create: `components.json`
- Create: `lib/utils.ts`
- Create: `components/ui/{button,card,input,label,select,dialog,form,tabs,radio-group,separator,checkbox}.tsx` (via shadcn CLI)

- [ ] **Step 1: Initialize shadcn**

```bash
npx shadcn@latest init
```

When prompted, choose:
- TypeScript: Yes
- Style: Default
- Base color: Slate
- CSS variables: Yes
- Tailwind config: `tailwind.config.ts`
- Components alias: `@/components`
- Utils alias: `@/lib/utils`

- [ ] **Step 2: Add base components**

```bash
npx shadcn@latest add button card input label select dialog form tabs radio-group separator checkbox badge dropdown-menu sheet
```

Expected: files appear in `components/ui/`.

- [ ] **Step 3: Verify build still passes**

```bash
npm run build
```

Expected: success.

- [ ] **Step 4: Commit**

```bash
git add components.json components/ui lib/utils.ts app/globals.css
git commit -m "feat: add shadcn/ui base components"
```

---

## Task 5: Configure next-intl + Locale Routing

**Files:**
- Create: `i18n.ts`, `middleware.ts`, `messages/th.json`, `messages/en.json`
- Move: `app/layout.tsx` → `app/[locale]/layout.tsx`
- Move: `app/page.tsx` → `app/[locale]/page.tsx`

- [ ] **Step 1: Create i18n.ts (next-intl request config)**

Create `i18n.ts`:

```ts
import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = ['th', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'th';

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as Locale)) notFound();
  return {
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
```

- [ ] **Step 2: Create middleware.ts**

Create `middleware.ts`:

```ts
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
});

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
```

- [ ] **Step 3: Update next.config.ts to register next-intl plugin**

```ts
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default withNextIntl(nextConfig);
```

- [ ] **Step 4: Move app/layout.tsx and app/page.tsx into [locale] segment**

```bash
mkdir -p app/[locale]
git mv app/layout.tsx app/[locale]/layout.tsx
git mv app/page.tsx app/[locale]/page.tsx
```

- [ ] **Step 5: Update app/[locale]/layout.tsx to use next-intl provider**

Replace `app/[locale]/layout.tsx`:

```tsx
import type { Metadata } from 'next';
import { Inter, Noto_Sans_Thai } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n';
import '../globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const notoThai = Noto_Sans_Thai({
  subsets: ['thai'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-noto-thai',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Go Travel',
  description: 'Tour booking made simple.',
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} ${notoThai.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 6: Create initial message catalogs**

Create `messages/th.json`:

```json
{
  "nav": {
    "home": "หน้าแรก",
    "tours": "โปรแกรมทัวร์",
    "trips": "ตารางทริป",
    "private": "ไพรเวทกรุ๊ป",
    "carRental": "เช่ารถ + คนขับ",
    "about": "เกี่ยวกับเรา",
    "contact": "ติดต่อเรา",
    "bookNow": "จองทัวร์"
  },
  "common": {
    "perPerson": "/ท่าน",
    "currency": "฿",
    "viewAll": "ดูทั้งหมด",
    "loading": "กำลังโหลด...",
    "back": "ย้อนกลับ",
    "next": "ถัดไป",
    "confirm": "ยืนยัน"
  },
  "home": {
    "heroTitle": "ออกเดินทาง.\nเก็บความทรงจำ.",
    "heroSub": "โปรแกรมทัวร์คุณภาพ จัดเองทุกรอบ จองง่าย เริ่มต้น 4 ท่านก็ออกเดินทางได้",
    "heroCta": "ดูโปรแกรมทั้งหมด",
    "categoriesTitle": "บริการของเรา",
    "featuredTitle": "โปรแกรมแนะนำ"
  },
  "booking": {
    "step1": "เลือกรอบ",
    "step2": "ผู้เดินทาง",
    "step3": "เพิ่มเติม",
    "step4": "ติดต่อ",
    "step5": "ตรวจสอบ",
    "step6": "ชำระเงิน",
    "joinGroup": "Join Group",
    "private": "Private",
    "addCar": "เพิ่มรถส่วนตัว + คนขับ?",
    "skip": "ข้าม",
    "totalPrice": "ยอดรวม",
    "agreeTerms": "ฉันยอมรับข้อกำหนดและเงื่อนไข"
  },
  "tour": {
    "duration": "{days} วัน {nights} คืน",
    "registered": "{count}/{max} ท่าน",
    "highlights": "ไฮไลท์",
    "itinerary": "รายละเอียดการเดินทาง",
    "includes": "รวมในแพ็กเกจ",
    "excludes": "ไม่รวม"
  }
}
```

Create `messages/en.json`:

```json
{
  "nav": {
    "home": "Home",
    "tours": "Tours",
    "trips": "Schedule",
    "private": "Private Group",
    "carRental": "Car + Driver",
    "about": "About",
    "contact": "Contact",
    "bookNow": "Book Now"
  },
  "common": {
    "perPerson": "/person",
    "currency": "THB",
    "viewAll": "View all",
    "loading": "Loading...",
    "back": "Back",
    "next": "Next",
    "confirm": "Confirm"
  },
  "home": {
    "heroTitle": "Travel light.\nLive bright.",
    "heroSub": "Curated tours across Asia. Easy booking — depart with as few as 4 travelers.",
    "heroCta": "See all programs",
    "categoriesTitle": "Our Services",
    "featuredTitle": "Featured Tours"
  },
  "booking": {
    "step1": "Selection",
    "step2": "Travelers",
    "step3": "Add-on",
    "step4": "Contact",
    "step5": "Review",
    "step6": "Payment",
    "joinGroup": "Join Group",
    "private": "Private",
    "addCar": "Add a private car + driver?",
    "skip": "Skip",
    "totalPrice": "Total",
    "agreeTerms": "I agree to the terms and conditions"
  },
  "tour": {
    "duration": "{days} days {nights} nights",
    "registered": "{count}/{max} travelers",
    "highlights": "Highlights",
    "itinerary": "Itinerary",
    "includes": "What's included",
    "excludes": "Not included"
  }
}
```

- [ ] **Step 7: Update app/[locale]/page.tsx to use translations**

Replace `app/[locale]/page.tsx`:

```tsx
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('home');
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold">{t('heroTitle')}</h1>
      <p className="mt-4 text-ink-muted">{t('heroSub')}</p>
    </main>
  );
}
```

- [ ] **Step 8: Verify dev server**

```bash
npm run dev
```

Visit:
- http://localhost:3000 — Thai page (default)
- http://localhost:3000/en — English page

Expected: both pages render with translated text.

- [ ] **Step 9: Commit**

```bash
git add i18n.ts middleware.ts next.config.ts messages app
git commit -m "feat: add next-intl with TH/EN subpath routing"
```

---

## Task 6: i18n Helpers + Tests

**Files:**
- Create: `lib/i18n.ts`
- Create: `lib/i18n.test.ts`

- [ ] **Step 1: Write failing tests**

Create `lib/i18n.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { pickLocale, formatPrice, formatDate, formatPaxCount } from './i18n';

describe('pickLocale', () => {
  it('returns th value for th locale', () => {
    expect(pickLocale({ th: 'สวัสดี', en: 'Hello' }, 'th')).toBe('สวัสดี');
  });
  it('returns en value for en locale', () => {
    expect(pickLocale({ th: 'สวัสดี', en: 'Hello' }, 'en')).toBe('Hello');
  });
  it('falls back to th when locale unknown', () => {
    expect(pickLocale({ th: 'A', en: 'B' }, 'fr' as never)).toBe('A');
  });
});

describe('formatPrice', () => {
  it('formats THB for th locale', () => {
    expect(formatPrice(59800, 'th')).toBe('฿59,800');
  });
  it('formats THB for en locale', () => {
    expect(formatPrice(59800, 'en')).toBe('THB 59,800');
  });
  it('handles zero', () => {
    expect(formatPrice(0, 'th')).toBe('฿0');
  });
});

describe('formatDate', () => {
  it('formats th date with Buddhist year', () => {
    const result = formatDate('2026-11-12', 'th');
    expect(result).toMatch(/2569/);
  });
  it('formats en date as DD MMM YYYY', () => {
    const result = formatDate('2026-11-12', 'en');
    expect(result).toMatch(/12.*Nov.*2026/);
  });
});

describe('formatPaxCount', () => {
  it('formats single pax', () => {
    expect(formatPaxCount(1, 'th')).toBe('1 ท่าน');
    expect(formatPaxCount(1, 'en')).toBe('1 person');
  });
  it('formats multiple pax', () => {
    expect(formatPaxCount(5, 'th')).toBe('5 ท่าน');
    expect(formatPaxCount(5, 'en')).toBe('5 people');
  });
});
```

- [ ] **Step 2: Run test — expect failure**

```bash
npm test
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement lib/i18n.ts**

Create `lib/i18n.ts`:

```ts
import type { Locale } from '@/i18n';

export type I18n = { th: string; en: string };
export type I18nArray = { th: string[]; en: string[] };

export function pickLocale(field: I18n, locale: Locale | string): string {
  if (locale === 'en') return field.en;
  return field.th;
}

export function pickLocaleArray(field: I18nArray, locale: Locale | string): string[] {
  if (locale === 'en') return field.en;
  return field.th;
}

export function formatPrice(amount: number, locale: Locale | string): string {
  if (locale === 'en') {
    return `THB ${amount.toLocaleString('en-US')}`;
  }
  return `฿${amount.toLocaleString('en-US')}`;
}

export function formatDate(isoDate: string, locale: Locale | string): string {
  const date = new Date(isoDate);
  if (locale === 'en') {
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  }
  return new Intl.DateTimeFormat('th-TH-u-ca-buddhist', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function formatPaxCount(count: number, locale: Locale | string): string {
  if (locale === 'en') {
    return count === 1 ? `${count} person` : `${count} people`;
  }
  return `${count} ท่าน`;
}
```

- [ ] **Step 4: Run tests — expect pass**

```bash
npm test
```

Expected: 11 tests pass.

- [ ] **Step 5: Commit**

```bash
git add lib/i18n.ts lib/i18n.test.ts
git commit -m "feat: add i18n helpers (pickLocale, formatPrice, formatDate)"
```

---

## Task 7: Domain Types

**Files:**
- Create: `types/index.ts`

- [ ] **Step 1: Create types/index.ts**

```ts
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
```

- [ ] **Step 2: Verify typecheck**

```bash
npm run typecheck
```

Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add types/index.ts
git commit -m "feat: add domain types (Tour, TripInstance, Booking, CarRental)"
```

---

## Task 8: Tour Content Data

**Files:**
- Create: `data/tours.ts`
- Create: `public/images/tours/` (download images)

- [ ] **Step 1: Create data/tours.ts with the full tour catalog**

Create exactly **8 tours** with bilingual content. Below is the full file template with **2 fully-fleshed examples** plus a checklist of the 6 additional tours to create using the same shape.

Create `data/tours.ts`:

```ts
import type { Tour } from '@/types';

export const tours: Tour[] = [
  {
    slug: 'hokkaido-autumn-5d',
    name: { th: 'ฮอกไกโด ใบไม้แดง 5 วัน', en: 'Hokkaido Autumn 5D' },
    destination: { th: 'ญี่ปุ่น', en: 'Japan' },
    destinationCode: 'JP',
    summary: {
      th: 'ดื่มด่ำใบไม้แดงที่ฮอกไกโด เก็บภาพสวนสนาม Onuma + อาบน้ำพุร้อน Noboribetsu',
      en: 'Soak in autumn colors across Hokkaido — Onuma park + Noboribetsu hot springs.',
    },
    duration: { days: 5, nights: 4 },
    coverImage: '/images/tours/hokkaido-cover.jpg',
    gallery: [
      '/images/tours/hokkaido-1.jpg',
      '/images/tours/hokkaido-2.jpg',
      '/images/tours/hokkaido-3.jpg',
    ],
    highlights: {
      th: [
        'ชมใบไม้แดงที่อุทยานโอนุมะ',
        'แช่ออนเซ็นที่โนโบริเบ็ตสึ',
        'เที่ยวเมืองโอตารุ คลองคลาสสิก',
        'ตลาดปลาฮาโกดาเตะ ของสด',
      ],
      en: [
        'Maple leaves at Onuma Park',
        'Onsen bath at Noboribetsu',
        'Otaru canal town stroll',
        'Hakodate morning fish market',
      ],
    },
    itinerary: [
      {
        day: 1,
        title: { th: 'กรุงเทพฯ → ซัปโปโร', en: 'Bangkok → Sapporo' },
        activities: {
          th: ['เช็คอินสนามบินสุวรรณภูมิ', 'บินสู่นิวชิโตเสะ', 'เข้าที่พักใจกลางซัปโปโร'],
          en: ['Check in at Suvarnabhumi', 'Fly to New Chitose', 'Hotel check-in central Sapporo'],
        },
      },
      {
        day: 2,
        title: { th: 'ซัปโปโร – โอตารุ', en: 'Sapporo – Otaru' },
        activities: {
          th: ['เดินคลองโอตารุ', 'ลองเป่าแก้ว Glass Studio', 'พิพิธภัณฑ์กล่องดนตรี'],
          en: ['Otaru canal walk', 'Glass-blowing studio', 'Music box museum'],
        },
      },
      {
        day: 3,
        title: { th: 'โนโบริเบ็ตสึ ออนเซ็น', en: 'Noboribetsu Onsen' },
        activities: {
          th: ['หุบเขานรกจิโกกุดานิ', 'ออนเซ็นเรียวกัง', 'ดินเนอร์ไคเซกิ'],
          en: ['Jigokudani Hell Valley', 'Ryokan onsen stay', 'Kaiseki dinner'],
        },
      },
      {
        day: 4,
        title: { th: 'โอนุมะ – ฮาโกดาเตะ', en: 'Onuma – Hakodate' },
        activities: {
          th: ['สวนกึ่งแห่งชาติโอนุมะ ใบไม้แดง', 'ขึ้นเขาฮาโกดาเตะดูวิวกลางคืน'],
          en: ['Onuma Quasi-National Park autumn colors', 'Mt. Hakodate night view'],
        },
      },
      {
        day: 5,
        title: { th: 'ฮาโกดาเตะ → กรุงเทพฯ', en: 'Hakodate → Bangkok' },
        activities: {
          th: ['ตลาดปลาเช้าฮาโกดาเตะ', 'เก็บของกลับโรงแรม', 'บินกลับกรุงเทพฯ'],
          en: ['Hakodate morning market', 'Hotel checkout', 'Flight back to Bangkok'],
        },
      },
    ],
    includes: {
      th: ['ตั๋วเครื่องบินไป-กลับ', 'โรงแรม 4 คืน (4 ดาว)', 'อาหารตามรายการ', 'รถบัสปรับอากาศ', 'ไกด์ภาษาไทย'],
      en: ['Round-trip flights', '4 nights at 4-star hotels', 'Meals as listed', 'A/C coach', 'Thai-speaking guide'],
    },
    excludes: {
      th: ['ค่าวีซ่าญี่ปุ่น', 'ค่าทิปไกด์ ฿1,500', 'ประกันการเดินทางส่วนบุคคล'],
      en: ['Japan visa fee', 'Guide tip THB 1,500', 'Personal travel insurance'],
    },
    groupPricing: { perPerson: 39900 },
    privatePricing: [
      { minPax: 4, maxPax: 7, perPerson: 52900 },
      { minPax: 8, maxPax: 11, perPerson: 47900 },
      { minPax: 12, maxPax: 16, perPerson: 43900 },
    ],
    joinMaxCapacity: 29,
    joinMinToDepart: 4,
    tags: ['ใบไม้แดง', 'ออนเซ็น', 'ครอบครัว'],
  },
  {
    slug: 'seoul-busan-6d',
    name: { th: 'เกาหลี โซล–ปูซาน 6 วัน', en: 'Korea Seoul–Busan 6D' },
    destination: { th: 'เกาหลีใต้', en: 'South Korea' },
    destinationCode: 'KR',
    summary: {
      th: 'เที่ยวเกาหลี 2 เมือง โซลตึกสูงทันสมัย ปูซานทะเลและตลาดอาหารเย็น',
      en: 'Two-city Korea: bustling Seoul and seaside Busan with night-market eats.',
    },
    duration: { days: 6, nights: 5 },
    coverImage: '/images/tours/korea-cover.jpg',
    gallery: ['/images/tours/korea-1.jpg', '/images/tours/korea-2.jpg', '/images/tours/korea-3.jpg'],
    highlights: {
      th: ['พระราชวังเคียงบกกุง', 'หมู่บ้านบุกชอนฮันอก', 'ตลาดจากัลชี ปูซาน', 'ชายหาดแฮอุนแด'],
      en: ['Gyeongbokgung Palace', 'Bukchon Hanok Village', 'Jagalchi market Busan', 'Haeundae beach'],
    },
    itinerary: [
      {
        day: 1,
        title: { th: 'กรุงเทพฯ → โซล', en: 'Bangkok → Seoul' },
        activities: { th: ['บินสู่อินชอน', 'เช็คอินโรงแรมเมียงดง'], en: ['Fly to Incheon', 'Hotel check-in Myeongdong'] },
      },
      {
        day: 2,
        title: { th: 'โซลคลาสสิก', en: 'Classic Seoul' },
        activities: {
          th: ['เคียงบกกุง ใส่ฮันบก', 'หมู่บ้านบุกชอน', 'ตลาดควังจาง'],
          en: ['Gyeongbokgung in hanbok', 'Bukchon village', 'Gwangjang market'],
        },
      },
      {
        day: 3,
        title: { th: 'โซล ช้อปปิ้ง + N Tower', en: 'Seoul shopping + N Tower' },
        activities: {
          th: ['ถนนฮงแด', 'N Seoul Tower ตอนเย็น', 'ตลาดมยองดงกลางคืน'],
          en: ['Hongdae street', 'N Seoul Tower at sunset', 'Myeongdong night market'],
        },
      },
      {
        day: 4,
        title: { th: 'KTX สู่ปูซาน', en: 'KTX to Busan' },
        activities: { th: ['นั่งรถไฟความเร็วสูง KTX', 'เช็คอินโรงแรมแฮอุนแด'], en: ['KTX bullet train', 'Hotel check-in Haeundae'] },
      },
      {
        day: 5,
        title: { th: 'ปูซานครบรส', en: 'Busan day' },
        activities: {
          th: ['หมู่บ้านวัฒนธรรมคัมชอน', 'วัดแฮดงยงกุง', 'ตลาดจากัลชี'],
          en: ['Gamcheon culture village', 'Haedong Yonggungsa temple', 'Jagalchi market'],
        },
      },
      {
        day: 6,
        title: { th: 'ปูซาน → กรุงเทพฯ', en: 'Busan → Bangkok' },
        activities: { th: ['ช้อปปิ้งของฝาก', 'บินกลับกรุงเทพฯ'], en: ['Souvenir shopping', 'Fly back to Bangkok'] },
      },
    ],
    includes: {
      th: ['ตั๋วเครื่องบิน', 'โรงแรม 5 คืน', 'KTX โซล-ปูซาน', 'อาหารตามรายการ', 'ไกด์ท้องถิ่น'],
      en: ['Flights', '5 nights hotel', 'KTX Seoul-Busan', 'Meals as listed', 'Local guide'],
    },
    excludes: {
      th: ['ค่าทิปไกด์', 'ค่าใช้จ่ายส่วนตัว'],
      en: ['Guide tip', 'Personal expenses'],
    },
    groupPricing: { perPerson: 28900 },
    privatePricing: [
      { minPax: 4, maxPax: 7, perPerson: 38900 },
      { minPax: 8, maxPax: 11, perPerson: 34900 },
      { minPax: 12, maxPax: 16, perPerson: 31900 },
    ],
    joinMaxCapacity: 29,
    joinMinToDepart: 4,
    tags: ['เมือง', 'ช้อปปิ้ง', 'อาหาร'],
  },
  // === ADD 6 MORE TOURS BELOW USING THE SAME SHAPE ===
  // Required additional tours (use Unsplash images for /public/images/tours/<slug>-*.jpg):
  //
  // 3. slug: 'hongkong-macau-3d' — destination: ฮ่องกง/Hong Kong (HK), 3D2N, ฿18,900 group
  // 4. slug: 'bali-paradise-5d' — destination: บาหลี อินโดนีเซีย/Bali Indonesia (ID), 5D4N, ฿24,900
  // 5. slug: 'taiwan-taipei-4d' — destination: ไต้หวัน/Taiwan (TW), 4D3N, ฿21,900
  // 6. slug: 'vietnam-hanoi-halong-4d' — destination: เวียดนาม/Vietnam (VN), 4D3N, ฿16,900
  // 7. slug: 'singapore-mbs-3d' — destination: สิงคโปร์/Singapore (SG), 3D2N, ฿22,900
  // 8. slug: 'osaka-kyoto-5d' — destination: ญี่ปุ่น/Japan (JP), 5D4N, ฿42,900
  //
  // For each: 3-4 highlights, 5 itinerary days (or fewer for 3D), includes/excludes,
  // privatePricing 3-tier (4-7/8-11/12-16) with +30%/+20%/+10% over group rate,
  // joinMaxCapacity 29, joinMinToDepart 4, 2-3 tags.
];

export function getTour(slug: string): Tour | undefined {
  return tours.find((t) => t.slug === slug);
}
```

- [ ] **Step 2: Add the remaining 6 tours**

Following the schema and shape of tours #1 and #2 above, add the other 6 entries to the `tours` array. Each entry must have all required fields (no optional skipping). Reuse `joinMaxCapacity: 29`, `joinMinToDepart: 4` for all. For `privatePricing`, the formula relative to `groupPricing.perPerson` is:

```
4-7 pax:   round(group × 1.30 / 100) × 100
8-11 pax:  round(group × 1.20 / 100) × 100
12-16 pax: round(group × 1.10 / 100) × 100
```

E.g., for `hongkong-macau-3d` with `groupPricing: 18900`: tier 1 = 24600, tier 2 = 22700, tier 3 = 20800.

- [ ] **Step 3: Download placeholder images**

For each tour, save 4 Unsplash images (one cover + three gallery) to `public/images/tours/`:

```bash
mkdir -p public/images/tours
# Example for hokkaido — use your browser to grab high-quality royalty-free images.
# Suggested searches: "Hokkaido autumn", "Sapporo", "Korea Seoul", "Hong Kong skyline",
# "Bali rice fields", "Taipei night", "Halong bay", "Marina Bay Sands", "Kyoto Fushimi"
# Save as: <slug>-cover.jpg, <slug>-1.jpg, <slug>-2.jpg, <slug>-3.jpg
```

Acceptable alternative: use Unsplash hotlinking via `https://images.unsplash.com/...` URLs in the `coverImage`/`gallery` fields and add `images.remotePatterns` to `next.config.ts`. Update `next.config.ts`:

```ts
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
  },
};

export default withNextIntl(nextConfig);
```

- [ ] **Step 4: Verify typecheck and build**

```bash
npm run typecheck && npm run build
```

Expected: passes.

- [ ] **Step 5: Commit**

```bash
git add data/tours.ts public/images next.config.ts
git commit -m "feat: add 8 tour entries with bilingual content + images"
```

---

## Task 9: Trip Instances + Car Rental Pricing

**Files:**
- Create: `data/trips.ts`
- Create: `data/car-rental-pricing.ts`

- [ ] **Step 1: Create data/trips.ts**

```ts
import type { TripInstance } from '@/types';

// 2-3 departures per tour. Counter values are starting seeds — store will track live counts.
export const trips: TripInstance[] = [
  // Hokkaido
  { id: 'trip-hokkaido-202611', tourSlug: 'hokkaido-autumn-5d', departDate: '2026-11-12', returnDate: '2026-11-16', registeredCount: 12, status: 'open' },
  { id: 'trip-hokkaido-202612', tourSlug: 'hokkaido-autumn-5d', departDate: '2026-12-03', returnDate: '2026-12-07', registeredCount: 4, status: 'open' },

  // Korea
  { id: 'trip-korea-202609', tourSlug: 'seoul-busan-6d', departDate: '2026-09-05', returnDate: '2026-09-10', registeredCount: 26, status: 'closing-soon' },
  { id: 'trip-korea-202610', tourSlug: 'seoul-busan-6d', departDate: '2026-10-15', returnDate: '2026-10-20', registeredCount: 8, status: 'open' },

  // Hong Kong
  { id: 'trip-hk-202606', tourSlug: 'hongkong-macau-3d', departDate: '2026-06-14', returnDate: '2026-06-16', registeredCount: 7, status: 'open' },
  { id: 'trip-hk-202608', tourSlug: 'hongkong-macau-3d', departDate: '2026-08-09', returnDate: '2026-08-11', registeredCount: 0, status: 'open' },

  // Bali
  { id: 'trip-bali-202607', tourSlug: 'bali-paradise-5d', departDate: '2026-07-20', returnDate: '2026-07-24', registeredCount: 14, status: 'open' },

  // Taiwan
  { id: 'trip-taiwan-202611', tourSlug: 'taiwan-taipei-4d', departDate: '2026-11-22', returnDate: '2026-11-25', registeredCount: 5, status: 'open' },

  // Vietnam
  { id: 'trip-vietnam-202609', tourSlug: 'vietnam-hanoi-halong-4d', departDate: '2026-09-17', returnDate: '2026-09-20', registeredCount: 11, status: 'open' },

  // Singapore
  { id: 'trip-sg-202610', tourSlug: 'singapore-mbs-3d', departDate: '2026-10-03', returnDate: '2026-10-05', registeredCount: 9, status: 'open' },

  // Osaka
  { id: 'trip-osaka-202604', tourSlug: 'osaka-kyoto-5d', departDate: '2026-04-08', returnDate: '2026-04-12', registeredCount: 29, status: 'full' },
  { id: 'trip-osaka-202605', tourSlug: 'osaka-kyoto-5d', departDate: '2026-05-22', returnDate: '2026-05-26', registeredCount: 18, status: 'open' },
];

export function getTrip(id: string): TripInstance | undefined {
  return trips.find((t) => t.id === id);
}

export function getTripsForTour(tourSlug: string): TripInstance[] {
  return trips.filter((t) => t.tourSlug === tourSlug);
}
```

- [ ] **Step 2: Create data/car-rental-pricing.ts**

```ts
import type { VehicleSize } from '@/types';

export const carRentalRates: Record<VehicleSize, { perDay: number; label: { th: string; en: string } }> = {
  4: { perDay: 2500, label: { th: 'รถเก๋ง 4 ที่นั่ง', en: 'Sedan (4 seats)' } },
  8: { perDay: 3800, label: { th: 'รถตู้ 8 ที่นั่ง', en: 'Van (8 seats)' } },
  12: { perDay: 4900, label: { th: 'รถตู้ 12 ที่นั่ง', en: 'Van (12 seats)' } },
  16: { perDay: 6500, label: { th: 'รถมินิบัส 16 ที่นั่ง', en: 'Mini-bus (16 seats)' } },
};
```

- [ ] **Step 3: Commit**

```bash
git add data/trips.ts data/car-rental-pricing.ts
git commit -m "feat: add trip instances + car rental rates"
```

---

## Task 10: Booking ID Generator + Tests

**Files:**
- Create: `lib/booking-id.ts`
- Create: `lib/booking-id.test.ts`

- [ ] **Step 1: Write failing tests**

Create `lib/booking-id.test.ts`:

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { generateBookingId, generateCarRentalId, _resetCounters } from './booking-id';

beforeEach(() => _resetCounters());

describe('generateBookingId', () => {
  it('produces format GT-YYYY-NNNNNN', () => {
    const id = generateBookingId(new Date('2026-05-03'));
    expect(id).toMatch(/^GT-2026-\d{6}$/);
  });
  it('increments per call within same year', () => {
    const a = generateBookingId(new Date('2026-05-03'));
    const b = generateBookingId(new Date('2026-05-03'));
    expect(a).toBe('GT-2026-000001');
    expect(b).toBe('GT-2026-000002');
  });
  it('starts a new sequence per year', () => {
    generateBookingId(new Date('2026-12-31'));
    const next = generateBookingId(new Date('2027-01-01'));
    expect(next).toBe('GT-2027-000001');
  });
});

describe('generateCarRentalId', () => {
  it('produces format CAR-YYYY-NNNNNN', () => {
    const id = generateCarRentalId(new Date('2026-05-03'));
    expect(id).toBe('CAR-2026-000001');
  });
});
```

- [ ] **Step 2: Run tests — expect fail**

```bash
npm test
```

- [ ] **Step 3: Implement lib/booking-id.ts**

```ts
const counters: Record<string, number> = {};

function nextSeq(prefix: string, year: number): number {
  const key = `${prefix}-${year}`;
  counters[key] = (counters[key] ?? 0) + 1;
  return counters[key];
}

function pad(n: number): string {
  return n.toString().padStart(6, '0');
}

export function generateBookingId(now: Date = new Date()): string {
  const year = now.getFullYear();
  const seq = nextSeq('GT', year);
  return `GT-${year}-${pad(seq)}`;
}

export function generateCarRentalId(now: Date = new Date()): string {
  const year = now.getFullYear();
  const seq = nextSeq('CAR', year);
  return `CAR-${year}-${pad(seq)}`;
}

/** Test-only: clear counters between tests */
export function _resetCounters(): void {
  for (const key of Object.keys(counters)) delete counters[key];
}
```

- [ ] **Step 4: Run tests — expect pass**

```bash
npm test
```

- [ ] **Step 5: Commit**

```bash
git add lib/booking-id.ts lib/booking-id.test.ts
git commit -m "feat: add booking ID generator (GT-YYYY-NNNNNN)"
```

---

## Task 11: In-Memory Store + Tests

**Files:**
- Create: `lib/store.ts`
- Create: `lib/store.test.ts`

- [ ] **Step 1: Write failing tests**

Create `lib/store.test.ts`:

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { store } from './store';
import type { Booking, CarRental } from '@/types';
import { trips } from '@/data/trips';

const sampleBooking = (overrides: Partial<Booking> = {}): Booking => ({
  id: 'GT-2026-000001',
  mode: 'join',
  tourSlug: 'hokkaido-autumn-5d',
  tripId: 'trip-hokkaido-202611',
  travelers: { adults: 2, children: 0, infants: 0 },
  contact: { name: 'Test', email: 'a@b.c', phone: '0812345678' },
  payment: { method: 'qr', amount: 79800 },
  status: 'confirmed',
  createdAt: '2026-05-03T00:00:00Z',
  ...overrides,
});

beforeEach(() => store._reset());

describe('store.getCounter', () => {
  it('returns seeded count from trips data on first read', () => {
    const seeded = trips.find((t) => t.id === 'trip-hokkaido-202611')!.registeredCount;
    expect(store.getCounter('trip-hokkaido-202611')).toBe(seeded);
  });
  it('returns 0 for unknown trip', () => {
    expect(store.getCounter('unknown')).toBe(0);
  });
});

describe('store.createBooking (join mode)', () => {
  it('saves booking and increments counter by adults+children', () => {
    const before = store.getCounter('trip-hokkaido-202611');
    const created = store.createBooking(sampleBooking({ travelers: { adults: 2, children: 1, infants: 1 } }));
    expect(created.id).toBe('GT-2026-000001');
    expect(store.getCounter('trip-hokkaido-202611')).toBe(before + 3);
  });
  it('infants do not count toward capacity', () => {
    const before = store.getCounter('trip-hokkaido-202611');
    store.createBooking(sampleBooking({ travelers: { adults: 0, children: 0, infants: 2 } }));
    expect(store.getCounter('trip-hokkaido-202611')).toBe(before);
  });
});

describe('store.createBooking (capacity guard)', () => {
  it('throws CAPACITY_EXCEEDED if increment would exceed joinMaxCapacity', () => {
    // Hokkaido capacity = 29, seeded at 12. Try to add 18 — exceeds 29.
    expect(() =>
      store.createBooking(sampleBooking({ travelers: { adults: 18, children: 0, infants: 0 } })),
    ).toThrow('CAPACITY_EXCEEDED');
  });
});

describe('store.createBooking (private mode)', () => {
  it('does not touch any counter', () => {
    const before = store.getCounter('trip-hokkaido-202611');
    store.createBooking(sampleBooking({ mode: 'private', tripId: undefined, privateDate: '2026-12-01' }));
    expect(store.getCounter('trip-hokkaido-202611')).toBe(before);
  });
});

describe('store.getBooking', () => {
  it('retrieves a saved booking', () => {
    const created = store.createBooking(sampleBooking());
    expect(store.getBooking(created.id)).toEqual(created);
  });
});

describe('store car rentals', () => {
  it('saves and retrieves a car rental', () => {
    const cr: CarRental = {
      id: 'CAR-2026-000001',
      vehicleSize: 8,
      pickupDate: '2026-06-01',
      returnDate: '2026-06-03',
      pickupLocation: 'BKK Airport',
      destination: 'Pattaya',
      contact: { name: 'X', email: 'x@y.z', phone: '0800000000' },
      estimatedPrice: 7600,
      createdAt: '2026-05-03T00:00:00Z',
    };
    store.createCarRental(cr);
    expect(store.getCarRental('CAR-2026-000001')).toEqual(cr);
  });
});
```

- [ ] **Step 2: Run tests — expect fail**

```bash
npm test
```

- [ ] **Step 3: Implement lib/store.ts**

```ts
import type { Booking, CarRental } from '@/types';
import { trips } from '@/data/trips';
import { getTour } from '@/data/tours';

class Store {
  private bookings = new Map<string, Booking>();
  private carRentals = new Map<string, CarRental>();
  private counters = new Map<string, number>(); // tripId -> count
  private seeded = false;

  private seed(): void {
    if (this.seeded) return;
    for (const trip of trips) this.counters.set(trip.id, trip.registeredCount);
    this.seeded = true;
  }

  getCounter(tripId: string): number {
    this.seed();
    return this.counters.get(tripId) ?? 0;
  }

  createBooking(booking: Booking): Booking {
    this.seed();
    if (booking.mode === 'join' && booking.tripId) {
      const tour = getTour(booking.tourSlug);
      const max = tour?.joinMaxCapacity ?? 0;
      const current = this.counters.get(booking.tripId) ?? 0;
      const adding = booking.travelers.adults + booking.travelers.children;
      if (current + adding > max) {
        throw new Error('CAPACITY_EXCEEDED');
      }
      this.counters.set(booking.tripId, current + adding);
    }
    this.bookings.set(booking.id, booking);
    return booking;
  }

  getBooking(id: string): Booking | undefined {
    return this.bookings.get(id);
  }

  createCarRental(cr: CarRental): CarRental {
    this.carRentals.set(cr.id, cr);
    return cr;
  }

  getCarRental(id: string): CarRental | undefined {
    return this.carRentals.get(id);
  }

  /** Test-only: reset everything */
  _reset(): void {
    this.bookings.clear();
    this.carRentals.clear();
    this.counters.clear();
    this.seeded = false;
  }
}

// PHASE B/C MIGRATION POINT:
// Replace this in-memory implementation with a Prisma-backed store.
// Keep the same public API (getCounter, createBooking, getBooking, createCarRental, getCarRental).
// All callers (API routes, components) depend ONLY on this surface.
export const store = new Store();
```

- [ ] **Step 4: Run tests — expect pass**

```bash
npm test
```

- [ ] **Step 5: Commit**

```bash
git add lib/store.ts lib/store.test.ts
git commit -m "feat: add in-memory store with capacity guard (Phase 1 storage layer)"
```

---

## Task 12: Pricing Logic + Tests

**Files:**
- Create: `lib/pricing.ts`
- Create: `lib/pricing.test.ts`

- [ ] **Step 1: Write failing tests**

Create `lib/pricing.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { calculateJoinTotal, calculatePrivateTotal, calculateCarAddon, findPrivateTier } from './pricing';
import type { Tour } from '@/types';

const tour: Tour = {
  slug: 'test', name: { th: '', en: '' }, destination: { th: '', en: '' }, destinationCode: 'XX',
  summary: { th: '', en: '' }, duration: { days: 5, nights: 4 }, coverImage: '', gallery: [],
  highlights: { th: [], en: [] }, itinerary: [], includes: { th: [], en: [] }, excludes: { th: [], en: [] },
  groupPricing: { perPerson: 10000 },
  privatePricing: [
    { minPax: 4, maxPax: 7, perPerson: 13000 },
    { minPax: 8, maxPax: 11, perPerson: 12000 },
    { minPax: 12, maxPax: 16, perPerson: 11000 },
  ],
  joinMaxCapacity: 29, joinMinToDepart: 4,
};

describe('calculateJoinTotal', () => {
  it('charges full rate for adults', () => {
    expect(calculateJoinTotal(tour, { adults: 2, children: 0, infants: 0 })).toBe(20000);
  });
  it('charges 70% for children', () => {
    expect(calculateJoinTotal(tour, { adults: 1, children: 1, infants: 0 })).toBe(17000);
  });
  it('infants are free', () => {
    expect(calculateJoinTotal(tour, { adults: 1, children: 0, infants: 3 })).toBe(10000);
  });
});

describe('findPrivateTier', () => {
  it('finds 4-7 tier for 5 pax', () => {
    expect(findPrivateTier(tour, 5)).toEqual({ minPax: 4, maxPax: 7, perPerson: 13000 });
  });
  it('finds 8-11 tier for 10 pax', () => {
    expect(findPrivateTier(tour, 10)).toEqual({ minPax: 8, maxPax: 11, perPerson: 12000 });
  });
  it('finds 12-16 tier for 16 pax', () => {
    expect(findPrivateTier(tour, 16)).toEqual({ minPax: 12, maxPax: 16, perPerson: 11000 });
  });
  it('returns null for out-of-range pax', () => {
    expect(findPrivateTier(tour, 3)).toBeNull();
    expect(findPrivateTier(tour, 17)).toBeNull();
  });
});

describe('calculatePrivateTotal', () => {
  it('uses 4-7 tier with adult+child(0.7)', () => {
    // 4 adults + 1 child = 5 pax → tier 13000
    // total = 4*13000 + 1*13000*0.7 = 52000 + 9100 = 61100
    expect(calculatePrivateTotal(tour, { adults: 4, children: 1, infants: 0 })).toBe(61100);
  });
  it('infants ignored both for tier and total', () => {
    expect(calculatePrivateTotal(tour, { adults: 5, children: 0, infants: 3 })).toBe(65000);
  });
  it('throws if pax outside tiers', () => {
    expect(() => calculatePrivateTotal(tour, { adults: 2, children: 0, infants: 0 })).toThrow('NO_MATCHING_TIER');
  });
});

describe('calculateCarAddon', () => {
  it('multiplies vehicle rate by days', () => {
    expect(calculateCarAddon(8, 3)).toBe(11400); // 3800 * 3
  });
  it('handles all sizes', () => {
    expect(calculateCarAddon(4, 1)).toBe(2500);
    expect(calculateCarAddon(12, 2)).toBe(9800);
    expect(calculateCarAddon(16, 4)).toBe(26000);
  });
});
```

- [ ] **Step 2: Run tests — expect fail**

```bash
npm test
```

- [ ] **Step 3: Implement lib/pricing.ts**

```ts
import type { Tour, VehicleSize } from '@/types';
import { carRentalRates } from '@/data/car-rental-pricing';

const CHILD_RATE = 0.7;

type Travelers = { adults: number; children: number; infants: number };

export function calculateJoinTotal(tour: Tour, t: Travelers): number {
  const adultsTotal = t.adults * tour.groupPricing.perPerson;
  const childrenTotal = t.children * tour.groupPricing.perPerson * CHILD_RATE;
  return Math.round(adultsTotal + childrenTotal);
}

export function findPrivateTier(tour: Tour, pax: number) {
  return tour.privatePricing.find((tier) => pax >= tier.minPax && pax <= tier.maxPax) ?? null;
}

export function calculatePrivateTotal(tour: Tour, t: Travelers): number {
  const pax = t.adults + t.children;
  const tier = findPrivateTier(tour, pax);
  if (!tier) throw new Error('NO_MATCHING_TIER');
  const adultsTotal = t.adults * tier.perPerson;
  const childrenTotal = t.children * tier.perPerson * CHILD_RATE;
  return Math.round(adultsTotal + childrenTotal);
}

export function calculateCarAddon(size: VehicleSize, days: number): number {
  return carRentalRates[size].perDay * days;
}
```

- [ ] **Step 4: Run tests — expect pass**

```bash
npm test
```

- [ ] **Step 5: Commit**

```bash
git add lib/pricing.ts lib/pricing.test.ts
git commit -m "feat: add pricing logic (join/private tiers + car add-on)"
```

---

## Task 13: API Routes — Tours

**Files:**
- Create: `app/api/tours/route.ts`
- Create: `app/api/tours/[slug]/route.ts`

- [ ] **Step 1: Implement GET /api/tours**

Create `app/api/tours/route.ts`:

```ts
import { NextResponse } from 'next/server';
import { tours } from '@/data/tours';

export async function GET() {
  return NextResponse.json({ tours });
}
```

- [ ] **Step 2: Implement GET /api/tours/[slug]**

Create `app/api/tours/[slug]/route.ts`:

```ts
import { NextResponse } from 'next/server';
import { getTour } from '@/data/tours';
import { getTripsForTour } from '@/data/trips';
import { store } from '@/lib/store';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const tour = getTour(slug);
  if (!tour) return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });

  const trips = getTripsForTour(slug).map((trip) => ({
    ...trip,
    registeredCount: store.getCounter(trip.id),
  }));

  return NextResponse.json({ tour, trips });
}
```

- [ ] **Step 3: Manual smoke test**

```bash
npm run dev
curl http://localhost:3000/api/tours | head -c 200
curl http://localhost:3000/api/tours/hokkaido-autumn-5d | head -c 400
```

Expected: JSON responses with tour data + 404 for unknown slugs.

- [ ] **Step 4: Commit**

```bash
git add app/api/tours
git commit -m "feat: add tours API routes (list + detail with live counts)"
```

---

## Task 14: API Routes — Trips Counter + Bookings

**Files:**
- Create: `app/api/trips/[id]/counter/route.ts`
- Create: `app/api/bookings/route.ts`
- Create: `app/api/bookings/[id]/route.ts`

- [ ] **Step 1: Implement GET /api/trips/[id]/counter**

Create `app/api/trips/[id]/counter/route.ts`:

```ts
import { NextResponse } from 'next/server';
import { getTrip } from '@/data/trips';
import { getTour } from '@/data/tours';
import { store } from '@/lib/store';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const trip = getTrip(id);
  if (!trip) return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });
  const tour = getTour(trip.tourSlug);
  const max = tour?.joinMaxCapacity ?? 0;
  const count = store.getCounter(id);
  return NextResponse.json({ count, max, remaining: max - count });
}
```

- [ ] **Step 2: Implement POST /api/bookings**

Create `app/api/bookings/route.ts`:

```ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { store } from '@/lib/store';
import { generateBookingId } from '@/lib/booking-id';
import { calculateJoinTotal, calculatePrivateTotal, calculateCarAddon } from '@/lib/pricing';
import { getTour } from '@/data/tours';
import type { Booking } from '@/types';

const bookingInput = z.object({
  mode: z.enum(['join', 'private']),
  tourSlug: z.string(),
  tripId: z.string().optional(),
  privateDate: z.string().optional(),
  travelers: z.object({
    adults: z.number().int().min(0),
    children: z.number().int().min(0),
    infants: z.number().int().min(0),
  }),
  contact: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1),
    lineId: z.string().optional(),
    note: z.string().optional(),
  }),
  carRentalAddon: z
    .object({
      vehicleSize: z.union([z.literal(4), z.literal(8), z.literal(12), z.literal(16)]),
      days: z.number().int().min(1),
      pickupLocation: z.string().min(1),
    })
    .optional(),
  payment: z.object({
    method: z.enum(['qr', 'card', 'transfer']),
  }),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = bookingInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'INVALID_INPUT', issues: parsed.error.issues }, { status: 400 });
  }
  const input = parsed.data;
  const tour = getTour(input.tourSlug);
  if (!tour) return NextResponse.json({ error: 'TOUR_NOT_FOUND' }, { status: 404 });

  // Compute total
  const tourTotal =
    input.mode === 'join'
      ? calculateJoinTotal(tour, input.travelers)
      : calculatePrivateTotal(tour, input.travelers);
  const addonTotal = input.carRentalAddon
    ? calculateCarAddon(input.carRentalAddon.vehicleSize, input.carRentalAddon.days)
    : 0;
  const amount = tourTotal + addonTotal;

  const booking: Booking = {
    id: generateBookingId(),
    mode: input.mode,
    tourSlug: input.tourSlug,
    tripId: input.tripId,
    privateDate: input.privateDate,
    travelers: input.travelers,
    contact: input.contact,
    carRentalAddon: input.carRentalAddon,
    payment: { method: input.payment.method, amount },
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };

  try {
    store.createBooking(booking);
  } catch (err) {
    if (err instanceof Error && err.message === 'CAPACITY_EXCEEDED') {
      return NextResponse.json({ error: 'CAPACITY_EXCEEDED' }, { status: 409 });
    }
    throw err;
  }

  return NextResponse.json({ booking }, { status: 201 });
}
```

- [ ] **Step 3: Implement GET /api/bookings/[id]**

Create `app/api/bookings/[id]/route.ts`:

```ts
import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const booking = store.getBooking(id);
  if (!booking) return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });
  return NextResponse.json({ booking });
}
```

- [ ] **Step 4: Manual smoke test**

```bash
npm run dev

# Counter
curl http://localhost:3000/api/trips/trip-hokkaido-202611/counter

# Create booking
curl -X POST http://localhost:3000/api/bookings -H 'Content-Type: application/json' -d '{
  "mode":"join",
  "tourSlug":"hokkaido-autumn-5d",
  "tripId":"trip-hokkaido-202611",
  "travelers":{"adults":2,"children":0,"infants":0},
  "contact":{"name":"Test","email":"a@b.c","phone":"0812345678"},
  "payment":{"method":"qr"}
}'
```

Expected: 201 with booking object including computed amount = 79800.

- [ ] **Step 5: Commit**

```bash
git add app/api/trips app/api/bookings
git commit -m "feat: add bookings + counter API routes with capacity guard"
```

---

## Task 15: API Route — Car Rentals

**Files:** `app/api/car-rentals/route.ts`

- [ ] **Step 1: Implement POST /api/car-rentals**

Create `app/api/car-rentals/route.ts`:

```ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { store } from '@/lib/store';
import { generateCarRentalId } from '@/lib/booking-id';
import { carRentalRates } from '@/data/car-rental-pricing';
import type { CarRental } from '@/types';

const input = z.object({
  vehicleSize: z.union([z.literal(4), z.literal(8), z.literal(12), z.literal(16)]),
  pickupDate: z.string(),
  returnDate: z.string(),
  pickupLocation: z.string().min(1),
  destination: z.string().min(1),
  contact: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1),
  }),
});

function dayDiff(start: string, end: string): number {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  return Math.max(1, Math.ceil(ms / 86_400_000));
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = input.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'INVALID_INPUT', issues: parsed.error.issues }, { status: 400 });
  }
  const data = parsed.data;
  const days = dayDiff(data.pickupDate, data.returnDate);
  const estimatedPrice = carRentalRates[data.vehicleSize].perDay * days;

  const cr: CarRental = {
    id: generateCarRentalId(),
    ...data,
    estimatedPrice,
    createdAt: new Date().toISOString(),
  };
  store.createCarRental(cr);
  return NextResponse.json({ carRental: cr }, { status: 201 });
}
```

- [ ] **Step 2: Smoke test**

```bash
curl -X POST http://localhost:3000/api/car-rentals -H 'Content-Type: application/json' -d '{
  "vehicleSize":8,
  "pickupDate":"2026-06-01",
  "returnDate":"2026-06-03",
  "pickupLocation":"BKK Airport",
  "destination":"Pattaya",
  "contact":{"name":"X","email":"x@y.z","phone":"0800000000"}
}'
```

Expected: 201 with `estimatedPrice: 7600`.

- [ ] **Step 3: Commit**

```bash
git add app/api/car-rentals
git commit -m "feat: add car rental API route"
```

---

## Task 16: Layout Shell — Nav, Footer, Lang Switcher

**Files:**
- Create: `components/layout/nav.tsx`
- Create: `components/layout/footer.tsx`
- Create: `components/layout/lang-switcher.tsx`
- Modify: `app/[locale]/layout.tsx`

- [ ] **Step 1: Create lang switcher**

Create `components/layout/lang-switcher.tsx`:

```tsx
'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function LangSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchTo = locale === 'th' ? 'en' : 'th';
  const targetPath =
    locale === 'th'
      ? `/en${pathname}`
      : pathname.replace(/^\/en/, '') || '/';

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => router.replace(targetPath)}
      className="gap-2"
    >
      <Globe className="h-4 w-4" />
      {switchTo.toUpperCase()}
    </Button>
  );
}
```

- [ ] **Step 2: Create nav**

Create `components/layout/nav.tsx`:

```tsx
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LangSwitcher } from './lang-switcher';

export function Nav() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const prefix = locale === 'en' ? '/en' : '';

  const links = [
    { href: `${prefix}/`, label: t('home') },
    { href: `${prefix}/tours`, label: t('tours') },
    { href: `${prefix}/trips`, label: t('trips') },
    { href: `${prefix}/private`, label: t('private') },
    { href: `${prefix}/car-rental`, label: t('carRental') },
    { href: `${prefix}/about`, label: t('about') },
  ];

  return (
    <header className="border-b border-line bg-white sticky top-0 z-50">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-8 py-4">
        <Link href={`${prefix}/`} className="flex items-center gap-2 text-primary font-extrabold text-xl tracking-tight">
          <Plane className="h-5 w-5" />
          Go Travel
        </Link>

        <nav className="hidden md:flex gap-7 text-sm font-medium">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-primary transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LangSwitcher />
          <Button asChild className="bg-primary hover:bg-primary-dark">
            <Link href={`${prefix}/tours`}>{t('bookNow')}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Create footer**

Create `components/layout/footer.tsx`:

```tsx
import { useTranslations } from 'next-intl';
import { Plane, Mail, Phone, MessageCircle } from 'lucide-react';

export function Footer() {
  const t = useTranslations('nav');
  return (
    <footer className="border-t border-line bg-white mt-16">
      <div className="mx-auto max-w-7xl px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="flex items-center gap-2 text-primary font-extrabold text-lg">
            <Plane className="h-5 w-5" />
            Go Travel
          </div>
          <p className="text-ink-muted mt-2">Tour booking made simple.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">{t('tours')}</h4>
          <ul className="space-y-1 text-ink-muted">
            <li>{t('trips')}</li>
            <li>{t('private')}</li>
            <li>{t('carRental')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">{t('contact')}</h4>
          <ul className="space-y-2 text-ink-muted">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> 02-000-0000</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> hello@gotravel.demo</li>
            <li className="flex items-center gap-2"><MessageCircle className="h-4 w-4" /> @gotravel</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">{t('about')}</h4>
          <p className="text-ink-muted">© 2026 Go Travel Demo.</p>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Wire nav + footer into [locale] layout**

Replace `app/[locale]/layout.tsx`:

```tsx
import type { Metadata } from 'next';
import { Inter, Noto_Sans_Thai } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n';
import { Nav } from '@/components/layout/nav';
import { Footer } from '@/components/layout/footer';
import '../globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const notoThai = Noto_Sans_Thai({
  subsets: ['thai'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-noto-thai',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Go Travel — Tours, Trips, Private Groups',
  description: 'Curated tours across Asia. Book online with ease.',
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} ${notoThai.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Nav />
          <main className="mx-auto max-w-7xl px-8">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Verify dev**

```bash
npm run dev
```

Visit `/` and `/en/` — both should render Nav (with TH/EN switcher), main slot, Footer. Lang switcher swaps locale.

- [ ] **Step 6: Commit**

```bash
git add components/layout app/[locale]/layout.tsx
git commit -m "feat: add Nav + Footer + LangSwitcher with lucide icons"
```

---

## Task 17: Tour Card + Tour Counter (Live)

**Files:**
- Create: `components/tour/tour-counter.tsx`
- Create: `components/tour/tour-card.tsx`

- [ ] **Step 1: Create tour-counter (client, SWR polling)**

Create `components/tour/tour-counter.tsx`:

```tsx
'use client';

import useSWR from 'swr';
import { Users } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function TourCounter({ tripId }: { tripId: string }) {
  const { data } = useSWR<{ count: number; max: number }>(
    `/api/trips/${tripId}/counter`,
    fetcher,
    { refreshInterval: 10_000 },
  );

  if (!data) return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-ink/70 backdrop-blur px-2.5 py-1 text-xs font-semibold text-white">
      <Users className="h-3 w-3" />
      {data.count}/{data.max}
    </span>
  );
}
```

- [ ] **Step 2: Create tour-card**

Create `components/tour/tour-card.tsx`:

```tsx
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { useLocale } from 'next-intl';
import type { Tour, TripInstance } from '@/types';
import { pickLocale, formatPrice, formatDate } from '@/lib/i18n';
import { TourCounter } from './tour-counter';

export function TourCard({ tour, trip }: { tour: Tour; trip?: TripInstance }) {
  const locale = useLocale();
  const prefix = locale === 'en' ? '/en' : '';

  const badgeClass =
    trip?.status === 'closing-soon'
      ? 'bg-pastel-amber text-pastel-amber-ink'
      : trip?.status === 'full'
      ? 'bg-pastel-pink text-pastel-pink-ink'
      : 'bg-white text-primary';
  const badgeLabel =
    trip?.status === 'closing-soon'
      ? locale === 'en' ? 'CLOSING SOON' : 'เกือบเต็ม'
      : trip?.status === 'full'
      ? locale === 'en' ? 'FULL' : 'เต็มแล้ว'
      : locale === 'en' ? 'OPEN' : 'เปิดจอง';

  return (
    <article className="bg-white rounded-2xl border border-line overflow-hidden hover:shadow-lg transition">
      <Link href={`${prefix}/tours/${tour.slug}`}>
        <div className="relative h-48">
          <Image src={tour.coverImage} alt={pickLocale(tour.name, locale)} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
          <span className={`absolute top-3 left-3 rounded-full px-2.5 py-1 text-[11px] font-bold ${badgeClass}`}>
            {badgeLabel}
          </span>
          {trip && (
            <div className="absolute top-3 right-3">
              <TourCounter tripId={trip.id} />
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <h3 className="font-bold text-base mb-1">
          <Link href={`${prefix}/tours/${tour.slug}`} className="hover:text-primary">
            {pickLocale(tour.name, locale)}
          </Link>
        </h3>
        <div className="flex gap-3 text-xs text-ink-muted mb-3">
          {trip && (
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(trip.departDate, locale)}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {pickLocale(tour.destination, locale)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-extrabold">{formatPrice(tour.groupPricing.perPerson, locale)}</span>
            <span className="text-xs text-ink-muted ml-1">{locale === 'en' ? '/person' : '/ท่าน'}</span>
          </div>
          <Link
            href={`${prefix}/tours/${tour.slug}`}
            className="inline-flex items-center gap-1 bg-primary-50 text-primary rounded-lg px-3 py-2 text-xs font-semibold"
          >
            {locale === 'en' ? 'Book' : 'จอง'}
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </article>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/tour
git commit -m "feat: add TourCard + live TourCounter components"
```

---

## Task 18: Homepage

**Files:**
- Create: `components/home/hero.tsx`
- Create: `components/home/quick-categories.tsx`
- Create: `components/home/featured-tours.tsx`
- Replace: `app/[locale]/page.tsx`

- [ ] **Step 1: Create hero**

Create `components/home/hero.tsx`:

```tsx
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { ArrowRight, Star } from 'lucide-react';

export function Hero() {
  const t = useTranslations('home');
  const locale = useLocale();
  const prefix = locale === 'en' ? '/en' : '';
  return (
    <section
      className="relative -mx-8 mb-16 h-[420px] overflow-hidden flex items-center"
      style={{
        backgroundImage:
          "linear-gradient(135deg, rgba(37,99,235,0.85), rgba(30,64,175,0.6) 70%, rgba(15,23,42,0.4)), url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&q=80')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="mx-auto max-w-7xl px-8 text-white">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest opacity-90 mb-4">
          <Star className="h-3 w-3" />
          {locale === 'en' ? 'Curated · 8 Asian destinations' : 'ทัวร์คัดสรร · 8 ปลายทางในเอเชีย'}
        </div>
        <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tight whitespace-pre-line max-w-2xl">
          {t('heroTitle')}
        </h1>
        <p className="mt-4 max-w-md opacity-95">{t('heroSub')}</p>
        <Link
          href={`${prefix}/tours`}
          className="mt-7 inline-flex items-center gap-2 bg-white text-ink rounded-xl px-6 py-3.5 font-semibold shadow-xl"
        >
          {t('heroCta')}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create quick categories**

Create `components/home/quick-categories.tsx`:

```tsx
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Plane, Calendar, Users, Car } from 'lucide-react';

export function QuickCategories() {
  const locale = useLocale();
  const prefix = locale === 'en' ? '/en' : '';
  const items = [
    {
      href: `${prefix}/tours`,
      icon: Plane,
      bg: 'bg-pastel-blue',
      ink: 'text-pastel-blue-ink',
      title: locale === 'en' ? '1-3 Day Trips' : 'ทัวร์ 1-3 วัน',
      desc: locale === 'en' ? 'Quick getaways' : 'ทริปสั้น เริ่มได้ทันที',
    },
    {
      href: `${prefix}/trips`,
      icon: Calendar,
      bg: 'bg-pastel-green',
      ink: 'text-pastel-green-ink',
      title: locale === 'en' ? 'Annual Schedule' : 'ตารางทริปทั้งปี',
      desc: locale === 'en' ? '8 yearly programs' : '8 โปรแกรมประจำปี',
    },
    {
      href: `${prefix}/private`,
      icon: Users,
      bg: 'bg-pastel-amber',
      ink: 'text-pastel-amber-ink',
      title: locale === 'en' ? 'Private Group' : 'ไพรเวทกรุ๊ป',
      desc: locale === 'en' ? '4-16 travelers' : '4-16 ท่าน',
    },
    {
      href: `${prefix}/car-rental`,
      icon: Car,
      bg: 'bg-pastel-pink',
      ink: 'text-pastel-pink-ink',
      title: locale === 'en' ? 'Car + Driver' : 'เช่ารถ + คนขับ',
      desc: locale === 'en' ? 'Private transport' : 'รถส่วนตัว',
    },
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
```

- [ ] **Step 3: Create featured tours**

Create `components/home/featured-tours.tsx`:

```tsx
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { tours } from '@/data/tours';
import { trips } from '@/data/trips';
import { TourCard } from '@/components/tour/tour-card';

export function FeaturedTours() {
  const t = useTranslations('home');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const prefix = locale === 'en' ? '/en' : '';

  // Pick first 3 tours with their earliest open trip
  const featured = tours.slice(0, 3).map((tour) => {
    const trip = trips
      .filter((tr) => tr.tourSlug === tour.slug && tr.status !== 'departed')
      .sort((a, b) => a.departDate.localeCompare(b.departDate))[0];
    return { tour, trip };
  });

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-extrabold tracking-tight">{t('featuredTitle')}</h2>
        <Link href={`${prefix}/tours`} className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
          {tCommon('viewAll')}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {featured.map(({ tour, trip }) => (
          <TourCard key={tour.slug} tour={tour} trip={trip} />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Wire homepage**

Replace `app/[locale]/page.tsx`:

```tsx
import { Hero } from '@/components/home/hero';
import { QuickCategories } from '@/components/home/quick-categories';
import { FeaturedTours } from '@/components/home/featured-tours';

export default function Home() {
  return (
    <>
      <Hero />
      <QuickCategories />
      <FeaturedTours />
    </>
  );
}
```

- [ ] **Step 5: Verify dev**

```bash
npm run dev
```

Visit `/` — Hero + 4 categories + 3 featured tour cards with live counter. Visit `/en/` — same in English.

- [ ] **Step 6: Commit**

```bash
git add components/home app/[locale]/page.tsx
git commit -m "feat: add homepage (hero, categories, featured tours)"
```

---

## Task 19: Tours List Page (with Filters)

**Files:**
- Create: `app/[locale]/tours/page.tsx`
- Create: `components/tour/tours-filter.tsx`

- [ ] **Step 1: Create filters component**

Create `components/tour/tours-filter.tsx`:

```tsx
'use client';

import { useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import type { Tour, TripInstance } from '@/types';
import { TourCard } from './tour-card';
import { pickLocale } from '@/lib/i18n';

export function ToursFilter({ tours, trips }: { tours: Tour[]; trips: TripInstance[] }) {
  const locale = useLocale();
  const [destCode, setDestCode] = useState<string>('');

  const destinations = useMemo(() => {
    const set = new Map<string, string>();
    for (const t of tours) set.set(t.destinationCode, pickLocale(t.destination, locale));
    return Array.from(set.entries());
  }, [tours, locale]);

  const filtered = destCode ? tours.filter((t) => t.destinationCode === destCode) : tours;

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setDestCode('')}
          className={`px-4 py-2 rounded-full text-sm font-semibold ${destCode === '' ? 'bg-primary text-white' : 'bg-white border border-line text-ink'}`}
        >
          {locale === 'en' ? 'All destinations' : 'ทุกปลายทาง'}
        </button>
        {destinations.map(([code, label]) => (
          <button
            key={code}
            onClick={() => setDestCode(code)}
            className={`px-4 py-2 rounded-full text-sm font-semibold ${destCode === code ? 'bg-primary text-white' : 'bg-white border border-line text-ink'}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {filtered.map((tour) => {
          const trip = trips
            .filter((tr) => tr.tourSlug === tour.slug && tr.status !== 'departed')
            .sort((a, b) => a.departDate.localeCompare(b.departDate))[0];
          return <TourCard key={tour.slug} tour={tour} trip={trip} />;
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create tours page**

Create `app/[locale]/tours/page.tsx`:

```tsx
import { tours } from '@/data/tours';
import { trips } from '@/data/trips';
import { ToursFilter } from '@/components/tour/tours-filter';

export default function ToursPage() {
  return (
    <div className="py-8">
      <h1 className="text-3xl font-extrabold tracking-tight mb-6">Tours</h1>
      <ToursFilter tours={tours} trips={trips} />
    </div>
  );
}
```

- [ ] **Step 3: Verify**

```bash
npm run dev
```

Visit `/tours` — see all 8 tours, filter by destination works.

- [ ] **Step 4: Commit**

```bash
git add app/[locale]/tours components/tour/tours-filter.tsx
git commit -m "feat: add tours list page with destination filter"
```

---

## Task 20: Tour Detail Page

**Files:**
- Create: `app/[locale]/tours/[slug]/page.tsx`
- Create: `components/tour/tour-itinerary.tsx`
- Create: `components/tour/tour-pricing-tiers.tsx`
- Create: `components/tour/tour-trips-list.tsx`

- [ ] **Step 1: Create itinerary component**

Create `components/tour/tour-itinerary.tsx`:

```tsx
import { useLocale, useTranslations } from 'next-intl';
import type { Tour } from '@/types';
import { pickLocale, pickLocaleArray } from '@/lib/i18n';

export function TourItinerary({ tour }: { tour: Tour }) {
  const t = useTranslations('tour');
  const locale = useLocale();
  return (
    <section className="mb-12">
      <h2 className="text-xl font-bold mb-4">{t('itinerary')}</h2>
      <ol className="space-y-4">
        {tour.itinerary.map((day) => (
          <li key={day.day} className="bg-white border border-line rounded-xl p-5">
            <div className="text-xs font-bold text-primary uppercase tracking-wider mb-1">
              {locale === 'en' ? `Day ${day.day}` : `วันที่ ${day.day}`}
            </div>
            <h3 className="font-bold mb-2">{pickLocale(day.title, locale)}</h3>
            <ul className="text-sm text-ink-muted space-y-1 list-disc pl-5">
              {pickLocaleArray(day.activities, locale).map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  );
}
```

- [ ] **Step 2: Create pricing tiers component**

Create `components/tour/tour-pricing-tiers.tsx`:

```tsx
import { useLocale } from 'next-intl';
import type { Tour } from '@/types';
import { formatPrice } from '@/lib/i18n';

export function TourPricingTiers({ tour }: { tour: Tour }) {
  const locale = useLocale();
  return (
    <div className="bg-white border border-line rounded-xl p-5">
      <h3 className="font-bold mb-3">{locale === 'en' ? 'Private group pricing' : 'ราคาไพรเวทกรุ๊ป'}</h3>
      <div className="space-y-2">
        {tour.privatePricing.map((tier) => (
          <div key={`${tier.minPax}-${tier.maxPax}`} className="flex items-center justify-between bg-pastel-blue rounded-lg px-4 py-3 text-sm">
            <span>
              {tier.minPax}-{tier.maxPax} {locale === 'en' ? 'travelers' : 'ท่าน'}
            </span>
            <span className="font-extrabold text-primary">
              {formatPrice(tier.perPerson, locale)}
              <span className="text-xs font-medium text-ink-muted ml-1">
                {locale === 'en' ? '/person' : '/ท่าน'}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create trips list component**

Create `components/tour/tour-trips-list.tsx`:

```tsx
import Link from 'next/link';
import { useLocale } from 'next-intl';
import type { TripInstance } from '@/types';
import { formatDate } from '@/lib/i18n';
import { TourCounter } from './tour-counter';
import { Calendar, ArrowRight } from 'lucide-react';

export function TourTripsList({ trips }: { trips: TripInstance[] }) {
  const locale = useLocale();
  const prefix = locale === 'en' ? '/en' : '';
  return (
    <div className="bg-white border border-line rounded-xl p-5">
      <h3 className="font-bold mb-3">{locale === 'en' ? 'Open departures (Join Group)' : 'รอบเดินทางที่เปิดจอง (Join Group)'}</h3>
      <ul className="space-y-2">
        {trips.map((trip) => (
          <li key={trip.id} className="flex items-center justify-between bg-pastel-green/40 rounded-lg px-4 py-3 text-sm">
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4 text-pastel-green-ink" />
              {formatDate(trip.departDate, locale)} – {formatDate(trip.returnDate, locale)}
            </span>
            <span className="flex items-center gap-3">
              <TourCounter tripId={trip.id} />
              <Link
                href={`${prefix}/booking/checkout?mode=join&tripId=${trip.id}`}
                className="inline-flex items-center gap-1 bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-semibold"
              >
                {locale === 'en' ? 'Book' : 'จอง'}
                <ArrowRight className="h-3 w-3" />
              </Link>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 4: Create tour detail page**

Create `app/[locale]/tours/[slug]/page.tsx`:

```tsx
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Check, X, MapPin, Clock } from 'lucide-react';
import { getTour } from '@/data/tours';
import { getTripsForTour } from '@/data/trips';
import { pickLocale, pickLocaleArray, formatPrice } from '@/lib/i18n';
import { TourItinerary } from '@/components/tour/tour-itinerary';
import { TourPricingTiers } from '@/components/tour/tour-pricing-tiers';
import { TourTripsList } from '@/components/tour/tour-trips-list';

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const tour = getTour(slug);
  if (!tour) notFound();
  const tourTrips = getTripsForTour(slug).filter((t) => t.status !== 'departed');

  return <TourDetail tour={tour} trips={tourTrips} />;
}

function TourDetail({ tour, trips }: { tour: ReturnType<typeof getTour> & object; trips: ReturnType<typeof getTripsForTour> }) {
  const t = useTranslations('tour');
  const locale = useLocale();
  const prefix = locale === 'en' ? '/en' : '';

  return (
    <article className="py-8">
      {/* Hero */}
      <div className="relative h-72 -mx-8 mb-8">
        <Image src={tour.coverImage} alt={pickLocale(tour.name, locale)} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent flex items-end p-8">
          <div className="text-white">
            <div className="flex items-center gap-3 text-sm mb-2 opacity-90">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {pickLocale(tour.destination, locale)}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {t('duration', { days: tour.duration.days, nights: tour.duration.nights })}
              </span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight">{pickLocale(tour.name, locale)}</h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <p className="text-base text-ink-muted mb-8">{pickLocale(tour.summary, locale)}</p>

          {/* Highlights */}
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-3">{t('highlights')}</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {pickLocaleArray(tour.highlights, locale).map((h, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-pastel-green-ink mt-0.5 flex-shrink-0" />
                  {h}
                </li>
              ))}
            </ul>
          </section>

          <TourItinerary tour={tour} />

          {/* Includes / Excludes */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            <div className="bg-white border border-line rounded-xl p-5">
              <h3 className="font-bold mb-3">{t('includes')}</h3>
              <ul className="text-sm text-ink-muted space-y-1.5">
                {pickLocaleArray(tour.includes, locale).map((it, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-pastel-green-ink mt-0.5 flex-shrink-0" />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white border border-line rounded-xl p-5">
              <h3 className="font-bold mb-3">{t('excludes')}</h3>
              <ul className="text-sm text-ink-muted space-y-1.5">
                {pickLocaleArray(tour.excludes, locale).map((it, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <X className="h-4 w-4 text-pastel-pink-ink mt-0.5 flex-shrink-0" />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="bg-white border border-line rounded-xl p-5 sticky top-24">
            <div className="text-xs text-ink-muted uppercase tracking-wider mb-1">
              {locale === 'en' ? 'Join group from' : 'Join Group เริ่มต้น'}
            </div>
            <div className="text-3xl font-extrabold text-primary mb-1">{formatPrice(tour.groupPricing.perPerson, locale)}</div>
            <div className="text-xs text-ink-muted mb-4">{locale === 'en' ? 'per person' : 'ต่อท่าน'}</div>
            <Link
              href={`${prefix}/booking/checkout?mode=private&tourSlug=${tour.slug}`}
              className="block w-full text-center bg-primary text-white rounded-xl px-4 py-3 font-semibold hover:bg-primary-dark"
            >
              {locale === 'en' ? 'Book private trip' : 'จองไพรเวท'}
            </Link>
          </div>

          <TourTripsList trips={trips} />
          <TourPricingTiers tour={tour} />
        </aside>
      </div>
    </article>
  );
}
```

- [ ] **Step 5: Verify**

```bash
npm run dev
```

Visit `/tours/hokkaido-autumn-5d` and `/en/tours/hokkaido-autumn-5d`. Confirm hero, itinerary, includes/excludes, sidebar with trips + pricing tiers.

- [ ] **Step 6: Commit**

```bash
git add app/[locale]/tours/\[slug\] components/tour
git commit -m "feat: add tour detail page (itinerary, includes, trips, pricing tiers)"
```

---

## Task 21: Trips Timeline + Trip Detail

**Files:**
- Create: `app/[locale]/trips/page.tsx`
- Create: `app/[locale]/trips/[id]/page.tsx`

- [ ] **Step 1: Create trips timeline page**

Create `app/[locale]/trips/page.tsx`:

```tsx
import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import { tours } from '@/data/tours';
import { trips } from '@/data/trips';
import { pickLocale, formatDate } from '@/lib/i18n';
import { TourCounter } from '@/components/tour/tour-counter';
import { useLocale } from 'next-intl';

export default async function TripsPage({ params }: { params: Promise<{ locale: string }> }) {
  await params;
  return <TripsList />;
}

function TripsList() {
  const locale = useLocale();
  const prefix = locale === 'en' ? '/en' : '';
  const sorted = [...trips]
    .filter((t) => t.status !== 'departed')
    .sort((a, b) => a.departDate.localeCompare(b.departDate));

  // Group by month-year string
  const groups = new Map<string, typeof trips>();
  for (const t of sorted) {
    const key = formatDate(t.departDate, locale).split(' ').slice(1).join(' '); // "Nov 2026"
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(t);
  }

  return (
    <div className="py-8">
      <h1 className="text-3xl font-extrabold tracking-tight mb-2">
        {locale === 'en' ? 'Annual Trip Schedule' : 'ตารางทริปประจำปี'}
      </h1>
      <p className="text-ink-muted mb-8">
        {locale === 'en' ? 'All scheduled departures across our 8 programs.' : 'รอบเดินทางทั้งหมดของ 8 โปรแกรม'}
      </p>

      {Array.from(groups.entries()).map(([month, monthTrips]) => (
        <section key={month} className="mb-10">
          <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-3">{month}</h2>
          <ul className="space-y-3">
            {monthTrips.map((trip) => {
              const tour = tours.find((t) => t.slug === trip.tourSlug)!;
              return (
                <li key={trip.id} className="bg-white border border-line rounded-xl p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <div className="font-bold">{pickLocale(tour.name, locale)}</div>
                      <div className="text-sm text-ink-muted">
                        {formatDate(trip.departDate, locale)} – {formatDate(trip.returnDate, locale)} · {pickLocale(tour.destination, locale)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <TourCounter tripId={trip.id} />
                    <Link
                      href={`${prefix}/trips/${trip.id}`}
                      className="inline-flex items-center gap-1 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold"
                    >
                      {locale === 'en' ? 'Details' : 'รายละเอียด'}
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Create trip detail page**

Create `app/[locale]/trips/[id]/page.tsx`:

```tsx
import { notFound, redirect } from 'next/navigation';
import { getTrip } from '@/data/trips';

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const trip = getTrip(id);
  if (!trip) notFound();
  // Trip detail = redirect to tour detail with trip context (simpler UX for Phase 1)
  const prefix = locale === 'en' ? '/en' : '';
  redirect(`${prefix}/tours/${trip.tourSlug}#trip-${trip.id}`);
}
```

- [ ] **Step 3: Verify**

Visit `/trips` — see all 12 trips grouped by month with live counters. Click a trip → redirects to its tour detail page.

- [ ] **Step 4: Commit**

```bash
git add app/[locale]/trips
git commit -m "feat: add annual trip schedule + trip detail redirect"
```

---

## Task 22: Private Landing + Car Rental Form + About + Contact

**Files:**
- Create: `app/[locale]/private/page.tsx`
- Create: `app/[locale]/car-rental/page.tsx`
- Create: `app/[locale]/about/page.tsx`
- Create: `app/[locale]/contact/page.tsx`
- Create: `components/car-rental/car-rental-form.tsx`

- [ ] **Step 1: Create private landing page**

Create `app/[locale]/private/page.tsx`:

```tsx
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
```

- [ ] **Step 2: Create car rental form (client)**

Create `components/car-rental/car-rental-form.tsx`:

```tsx
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
```

- [ ] **Step 3: Create car-rental page**

Create `app/[locale]/car-rental/page.tsx`:

```tsx
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
```

- [ ] **Step 4: Create about + contact pages**

Create `app/[locale]/about/page.tsx`:

```tsx
import { useLocale } from 'next-intl';

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  await params;
  return <AboutContent />;
}

function AboutContent() {
  const locale = useLocale();
  return (
    <div className="py-12 max-w-3xl mx-auto prose">
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
```

Create `app/[locale]/contact/page.tsx`:

```tsx
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
```

- [ ] **Step 5: Verify**

Visit `/private`, `/car-rental`, `/about`, `/contact` and `/en/...` versions. Submit the car rental form — should show success card with ID + price.

- [ ] **Step 6: Commit**

```bash
git add app/[locale]/private app/[locale]/car-rental app/[locale]/about app/[locale]/contact components/car-rental
git commit -m "feat: add private landing, car rental form, about, contact pages"
```

---

## Task 23: Booking Checkout — State + Step Rail + Selection Step

**Files:**
- Create: `components/booking/booking-types.ts`
- Create: `components/booking/use-booking-state.ts`
- Create: `components/booking/step-rail.tsx`
- Create: `components/booking/step-selection.tsx`
- Create: `app/[locale]/booking/checkout/page.tsx`
- Create: `components/booking/checkout-shell.tsx`

- [ ] **Step 1: Create booking-types.ts**

Create `components/booking/booking-types.ts`:

```ts
import type { BookingMode, PaymentMethod, VehicleSize } from '@/types';

export type BookingDraft = {
  mode: BookingMode;
  tourSlug: string;
  tripId?: string;
  privateDate?: string;
  travelers: { adults: number; children: number; infants: number };
  contact: { name: string; email: string; phone: string; lineId?: string; note?: string };
  carRentalAddon?: { vehicleSize: VehicleSize; pickupLocation: string };
  payment?: { method: PaymentMethod };
};

export const STEPS = ['selection', 'travelers', 'addon', 'contact', 'review', 'payment'] as const;
export type StepKey = (typeof STEPS)[number];
```

- [ ] **Step 2: Create state hook with sessionStorage mirror**

Create `components/booking/use-booking-state.ts`:

```ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { BookingDraft, StepKey } from './booking-types';
import { STEPS } from './booking-types';

const STORAGE_KEY = 'go-travel-booking-draft';

export function useBookingState(initial: BookingDraft) {
  const [draft, setDraft] = useState<BookingDraft>(() => {
    if (typeof window === 'undefined') return initial;
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as BookingDraft;
        // Restore only if for same tour
        if (parsed.tourSlug === initial.tourSlug) return { ...initial, ...parsed };
      } catch {}
    }
    return initial;
  });
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }, [draft]);

  const update = useCallback((patch: Partial<BookingDraft>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  }, []);

  const next = useCallback(() => setStepIdx((i) => Math.min(i + 1, STEPS.length - 1)), []);
  const back = useCallback(() => setStepIdx((i) => Math.max(i - 1, 0)), []);
  const goTo = useCallback((step: StepKey) => setStepIdx(STEPS.indexOf(step)), []);
  const reset = useCallback(() => sessionStorage.removeItem(STORAGE_KEY), []);

  return { draft, update, stepIdx, step: STEPS[stepIdx], next, back, goTo, reset };
}
```

- [ ] **Step 3: Create step-rail**

Create `components/booking/step-rail.tsx`:

```tsx
import { useTranslations } from 'next-intl';
import { Check } from 'lucide-react';
import { STEPS, type StepKey } from './booking-types';

export function StepRail({ current }: { current: StepKey }) {
  const t = useTranslations('booking');
  const currentIdx = STEPS.indexOf(current);
  const labels: Record<StepKey, string> = {
    selection: t('step1'),
    travelers: t('step2'),
    addon: t('step3'),
    contact: t('step4'),
    review: t('step5'),
    payment: t('step6'),
  };

  return (
    <ol className="flex items-center gap-2 mb-8 overflow-x-auto">
      {STEPS.map((s, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx;
        return (
          <li key={s} className="flex items-center gap-2 flex-shrink-0">
            <div
              className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${
                done ? 'bg-primary text-white' : active ? 'bg-primary text-white' : 'bg-line text-ink-muted'
              }`}
            >
              {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </div>
            <span className={`text-sm font-semibold ${active ? 'text-primary' : 'text-ink-muted'}`}>
              {labels[s]}
            </span>
            {i < STEPS.length - 1 && <span className="h-px w-6 bg-line ml-1" />}
          </li>
        );
      })}
    </ol>
  );
}
```

- [ ] **Step 4: Create step-selection**

Create `components/booking/step-selection.tsx`:

```tsx
'use client';

import { useLocale } from 'next-intl';
import { Calendar, Users } from 'lucide-react';
import type { Tour, TripInstance } from '@/types';
import type { BookingDraft } from './booking-types';
import { formatDate } from '@/lib/i18n';
import { TourCounter } from '@/components/tour/tour-counter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function StepSelection({
  tour,
  trips,
  draft,
  onChange,
  onNext,
}: {
  tour: Tour;
  trips: TripInstance[];
  draft: BookingDraft;
  onChange: (patch: Partial<BookingDraft>) => void;
  onNext: () => void;
}) {
  const locale = useLocale();
  const minDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  })();

  if (draft.mode === 'join') {
    const trip = trips.find((t) => t.id === draft.tripId);
    if (!trip) return <p className="text-pastel-pink-ink">Trip not found.</p>;
    return (
      <section>
        <h2 className="text-xl font-bold mb-4">
          {locale === 'en' ? 'Confirm departure' : 'ยืนยันรอบเดินทาง'}
        </h2>
        <div className="bg-pastel-blue rounded-xl p-5 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-primary" />
            <div>
              <div className="font-bold">{formatDate(trip.departDate, locale)} – {formatDate(trip.returnDate, locale)}</div>
              <div className="text-sm text-ink-muted">Join Group · {tour.duration.days} {locale === 'en' ? 'days' : 'วัน'}</div>
            </div>
          </div>
          <TourCounter tripId={trip.id} />
        </div>
        <Button className="bg-primary hover:bg-primary-dark" onClick={onNext}>
          {locale === 'en' ? 'Continue' : 'ถัดไป'}
        </Button>
      </section>
    );
  }

  // Private mode
  return (
    <section>
      <h2 className="text-xl font-bold mb-4">
        {locale === 'en' ? 'Choose your dates' : 'เลือกวันเดินทาง'}
      </h2>
      <div className="space-y-4 max-w-md">
        <div>
          <Label>{locale === 'en' ? 'Departure date' : 'วันเริ่มเดินทาง'}</Label>
          <Input
            type="date"
            min={minDate}
            value={draft.privateDate ?? ''}
            onChange={(e) => onChange({ privateDate: e.target.value })}
          />
          <p className="text-xs text-ink-muted mt-1">
            {locale === 'en' ? 'Min 14 days from today' : 'อย่างน้อย 14 วันจากวันนี้'}
          </p>
        </div>
        <div className="bg-pastel-amber/40 rounded-lg p-3 text-sm text-pastel-amber-ink">
          <Users className="h-4 w-4 inline mr-1" />
          {locale === 'en' ? 'Private group requires 4-16 travelers' : 'ไพรเวทต้องมี 4-16 ท่าน'}
        </div>
      </div>
      <Button
        className="mt-6 bg-primary hover:bg-primary-dark"
        disabled={!draft.privateDate}
        onClick={onNext}
      >
        {locale === 'en' ? 'Continue' : 'ถัดไป'}
      </Button>
    </section>
  );
}
```

- [ ] **Step 5: Create checkout-shell (orchestrates all steps)**

Create `components/booking/checkout-shell.tsx`:

```tsx
'use client';

import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import type { Tour, TripInstance } from '@/types';
import { useBookingState } from './use-booking-state';
import { StepRail } from './step-rail';
import { StepSelection } from './step-selection';
import { StepTravelers } from './step-travelers';
import { StepAddon } from './step-addon';
import { StepContact } from './step-contact';
import { StepReview } from './step-review';
import { StepPayment } from './step-payment';
import { BookingSummary } from './booking-summary';
import type { BookingDraft } from './booking-types';

export function CheckoutShell({
  tour,
  trips,
  initial,
}: {
  tour: Tour;
  trips: TripInstance[];
  initial: BookingDraft;
}) {
  const locale = useLocale();
  const router = useRouter();
  const { draft, update, step, next, back, reset } = useBookingState(initial);

  async function submitBooking(method: 'qr' | 'card' | 'transfer') {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: draft.mode,
        tourSlug: draft.tourSlug,
        tripId: draft.tripId,
        privateDate: draft.privateDate,
        travelers: draft.travelers,
        contact: draft.contact,
        carRentalAddon: draft.carRentalAddon
          ? { ...draft.carRentalAddon, days: tour.duration.days }
          : undefined,
        payment: { method },
      }),
    });
    if (res.status === 409) {
      alert(locale === 'en' ? 'Just sold out — sorry!' : 'เพิ่งเต็มไป ขออภัย');
      return;
    }
    if (!res.ok) {
      alert('Error');
      return;
    }
    const json = await res.json();
    reset();
    const prefix = locale === 'en' ? '/en' : '';
    router.push(`${prefix}/booking/success/${json.booking.id}`);
  }

  return (
    <div className="py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <StepRail current={step} />

        {step === 'selection' && (
          <StepSelection tour={tour} trips={trips} draft={draft} onChange={update} onNext={next} />
        )}
        {step === 'travelers' && (
          <StepTravelers tour={tour} draft={draft} onChange={update} onNext={next} onBack={back} />
        )}
        {step === 'addon' && <StepAddon draft={draft} onChange={update} onNext={next} onBack={back} />}
        {step === 'contact' && <StepContact draft={draft} onChange={update} onNext={next} onBack={back} />}
        {step === 'review' && (
          <StepReview tour={tour} draft={draft} onNext={next} onBack={back} />
        )}
        {step === 'payment' && (
          <StepPayment tour={tour} draft={draft} onSubmit={submitBooking} onBack={back} />
        )}
      </div>

      <BookingSummary tour={tour} draft={draft} />
    </div>
  );
}
```

- [ ] **Step 6: Create checkout page (server, parses query → builds initial draft)**

Create `app/[locale]/booking/checkout/page.tsx`:

```tsx
import { notFound } from 'next/navigation';
import { getTour } from '@/data/tours';
import { getTrip, getTripsForTour } from '@/data/trips';
import { CheckoutShell } from '@/components/booking/checkout-shell';
import type { BookingDraft } from '@/components/booking/booking-types';

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: 'join' | 'private'; tripId?: string; tourSlug?: string }>;
}) {
  const params = await searchParams;

  // Resolve tour from either tripId or tourSlug
  let tourSlug: string | undefined = params.tourSlug;
  if (!tourSlug && params.tripId) {
    const trip = getTrip(params.tripId);
    tourSlug = trip?.tourSlug;
  }
  if (!tourSlug) notFound();
  const tour = getTour(tourSlug);
  if (!tour) notFound();

  const mode = params.mode ?? 'join';
  const initial: BookingDraft = {
    mode,
    tourSlug: tour.slug,
    tripId: params.tripId,
    travelers: { adults: 2, children: 0, infants: 0 },
    contact: { name: '', email: '', phone: '' },
  };

  const trips = getTripsForTour(tour.slug);
  return <CheckoutShell tour={tour} trips={trips} initial={initial} />;
}
```

- [ ] **Step 7: Commit (partial — remaining step components in Task 24)**

```bash
git add components/booking/booking-types.ts components/booking/use-booking-state.ts components/booking/step-rail.tsx components/booking/step-selection.tsx components/booking/checkout-shell.tsx app/[locale]/booking/checkout/page.tsx
git commit -m "feat: scaffold booking checkout (state, step rail, selection step)"
```

Note: at this point the build will fail because checkout-shell imports step components not yet created. That's intentional — Task 24 finishes the remaining step components in one commit so the build comes back green.

---

## Task 24: Booking Steps 2-6 + Summary Sidebar

**Files:** all under `components/booking/`
- Create: `step-travelers.tsx`, `step-addon.tsx`, `step-contact.tsx`, `step-review.tsx`, `step-payment.tsx`, `booking-summary.tsx`

- [ ] **Step 1: Create step-travelers**

Create `components/booking/step-travelers.tsx`:

```tsx
'use client';

import { useLocale } from 'next-intl';
import { Minus, Plus } from 'lucide-react';
import type { Tour } from '@/types';
import type { BookingDraft } from './booking-types';
import { Button } from '@/components/ui/button';

export function StepTravelers({
  tour, draft, onChange, onNext, onBack,
}: {
  tour: Tour;
  draft: BookingDraft;
  onChange: (patch: Partial<BookingDraft>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const locale = useLocale();
  const t = draft.travelers;
  const setKey = (k: keyof typeof t, v: number) => onChange({ travelers: { ...t, [k]: Math.max(0, v) } });

  const totalPax = t.adults + t.children;
  const valid =
    draft.mode === 'private'
      ? totalPax >= 4 && totalPax <= 16
      : totalPax > 0 && totalPax <= tour.joinMaxCapacity;

  const rows: Array<{ key: 'adults' | 'children' | 'infants'; label: string; sub: string }> = [
    { key: 'adults', label: locale === 'en' ? 'Adults' : 'ผู้ใหญ่', sub: locale === 'en' ? '12+ years' : 'อายุ 12+' },
    { key: 'children', label: locale === 'en' ? 'Children' : 'เด็ก', sub: locale === 'en' ? '4-11 (70% rate)' : 'อายุ 4-11 (70%)' },
    { key: 'infants', label: locale === 'en' ? 'Infants' : 'ทารก', sub: locale === 'en' ? '<4 (free)' : 'อายุ <4 (ฟรี)' },
  ];

  return (
    <section>
      <h2 className="text-xl font-bold mb-4">{locale === 'en' ? 'How many travelers?' : 'จำนวนผู้เดินทาง'}</h2>
      <div className="space-y-3 max-w-md">
        {rows.map(({ key, label, sub }) => (
          <div key={key} className="flex items-center justify-between bg-white border border-line rounded-xl p-4">
            <div>
              <div className="font-semibold">{label}</div>
              <div className="text-xs text-ink-muted">{sub}</div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setKey(key, t[key] - 1)}
                className="h-8 w-8 rounded-full border border-line flex items-center justify-center"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="w-6 text-center font-bold">{t[key]}</span>
              <button
                type="button"
                onClick={() => setKey(key, t[key] + 1)}
                className="h-8 w-8 rounded-full border border-line flex items-center justify-center"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
      {draft.mode === 'private' && (
        <p className="text-xs text-pastel-amber-ink mt-3">{locale === 'en' ? 'Private group: 4-16 travelers' : 'ไพรเวทต้องมี 4-16 ท่าน'}</p>
      )}
      <div className="flex gap-2 mt-6">
        <Button variant="outline" onClick={onBack}>{locale === 'en' ? 'Back' : 'ย้อนกลับ'}</Button>
        <Button className="bg-primary hover:bg-primary-dark" disabled={!valid} onClick={onNext}>
          {locale === 'en' ? 'Continue' : 'ถัดไป'}
        </Button>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create step-addon**

Create `components/booking/step-addon.tsx`:

```tsx
'use client';

import { useLocale } from 'next-intl';
import { Car } from 'lucide-react';
import type { BookingDraft } from './booking-types';
import type { VehicleSize } from '@/types';
import { carRentalRates } from '@/data/car-rental-pricing';
import { pickLocale, formatPrice } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function StepAddon({
  draft, onChange, onNext, onBack,
}: {
  draft: BookingDraft;
  onChange: (patch: Partial<BookingDraft>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const locale = useLocale();
  const enabled = !!draft.carRentalAddon;
  const size = draft.carRentalAddon?.vehicleSize;

  const toggle = () => {
    if (enabled) onChange({ carRentalAddon: undefined });
    else onChange({ carRentalAddon: { vehicleSize: 4, pickupLocation: '' } });
  };

  return (
    <section>
      <h2 className="text-xl font-bold mb-2">{locale === 'en' ? 'Add a private car?' : 'เพิ่มรถส่วนตัว?'}</h2>
      <p className="text-ink-muted mb-5 text-sm">{locale === 'en' ? 'Optional — you can skip this step.' : 'ไม่จำเป็น — ข้ามไปได้'}</p>

      <label className="flex items-center gap-3 bg-white border border-line rounded-xl p-4 cursor-pointer mb-4">
        <input type="checkbox" checked={enabled} onChange={toggle} />
        <Car className="h-5 w-5 text-primary" />
        <span className="font-semibold">{locale === 'en' ? 'Yes, add car + driver' : 'ใช่ เพิ่มรถ + คนขับ'}</span>
      </label>

      {enabled && (
        <div className="space-y-4 max-w-lg">
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(carRentalRates) as unknown as VehicleSize[]).map((s) => {
              const k = Number(s) as VehicleSize;
              const rate = carRentalRates[k];
              const selected = size === k;
              return (
                <button
                  type="button"
                  key={k}
                  onClick={() => onChange({ carRentalAddon: { ...draft.carRentalAddon!, vehicleSize: k } })}
                  className={`text-left p-3 rounded-xl border-2 ${selected ? 'border-primary bg-primary-50' : 'border-line bg-white'}`}
                >
                  <div className="text-sm font-bold">{pickLocale(rate.label, locale)}</div>
                  <div className="text-xs text-ink-muted mt-1">{formatPrice(rate.perDay, locale)}/{locale === 'en' ? 'day' : 'วัน'}</div>
                </button>
              );
            })}
          </div>
          <div>
            <Label htmlFor="pickup">{locale === 'en' ? 'Pickup location' : 'จุดรับรถ'}</Label>
            <Input
              id="pickup"
              value={draft.carRentalAddon?.pickupLocation ?? ''}
              onChange={(e) => onChange({ carRentalAddon: { ...draft.carRentalAddon!, pickupLocation: e.target.value } })}
              placeholder="BKK Airport"
            />
          </div>
        </div>
      )}

      <div className="flex gap-2 mt-6">
        <Button variant="outline" onClick={onBack}>{locale === 'en' ? 'Back' : 'ย้อนกลับ'}</Button>
        <Button className="bg-primary hover:bg-primary-dark" onClick={onNext}>
          {enabled ? (locale === 'en' ? 'Continue' : 'ถัดไป') : (locale === 'en' ? 'Skip' : 'ข้าม')}
        </Button>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create step-contact**

Create `components/booking/step-contact.tsx`:

```tsx
'use client';

import { useLocale } from 'next-intl';
import type { BookingDraft } from './booking-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function StepContact({
  draft, onChange, onNext, onBack,
}: {
  draft: BookingDraft;
  onChange: (patch: Partial<BookingDraft>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const locale = useLocale();
  const c = draft.contact;
  const set = (k: keyof typeof c, v: string) => onChange({ contact: { ...c, [k]: v } });
  const valid = c.name && /\S+@\S+\.\S+/.test(c.email) && c.phone.length >= 8;

  return (
    <section>
      <h2 className="text-xl font-bold mb-4">{locale === 'en' ? 'Lead traveler info' : 'ข้อมูลหัวหน้ากลุ่ม'}</h2>
      <div className="space-y-4 max-w-lg">
        <div>
          <Label htmlFor="name">{locale === 'en' ? 'Full name' : 'ชื่อ-นามสกุล'}</Label>
          <Input id="name" value={c.name} onChange={(e) => set('name', e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={c.email} onChange={(e) => set('email', e.target.value)} />
          </div>
          <div>
            <Label htmlFor="phone">{locale === 'en' ? 'Phone' : 'เบอร์โทร'}</Label>
            <Input id="phone" value={c.phone} onChange={(e) => set('phone', e.target.value)} />
          </div>
        </div>
        <div>
          <Label htmlFor="line">LINE ID ({locale === 'en' ? 'optional' : 'ไม่บังคับ'})</Label>
          <Input id="line" value={c.lineId ?? ''} onChange={(e) => set('lineId', e.target.value)} />
        </div>
        <div>
          <Label htmlFor="note">{locale === 'en' ? 'Note (allergies, requests)' : 'หมายเหตุ (อาหาร, อื่นๆ)'}</Label>
          <textarea
            id="note"
            value={c.note ?? ''}
            onChange={(e) => set('note', e.target.value)}
            className="w-full border border-line rounded-md px-3 py-2 text-sm min-h-[80px]"
          />
        </div>
      </div>
      <div className="flex gap-2 mt-6">
        <Button variant="outline" onClick={onBack}>{locale === 'en' ? 'Back' : 'ย้อนกลับ'}</Button>
        <Button className="bg-primary hover:bg-primary-dark" disabled={!valid} onClick={onNext}>
          {locale === 'en' ? 'Continue' : 'ถัดไป'}
        </Button>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Create step-review**

Create `components/booking/step-review.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import type { Tour } from '@/types';
import type { BookingDraft } from './booking-types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

export function StepReview({
  tour, draft, onNext, onBack,
}: {
  tour: Tour;
  draft: BookingDraft;
  onNext: () => void;
  onBack: () => void;
}) {
  const locale = useLocale();
  const [agreed, setAgreed] = useState(false);

  return (
    <section>
      <h2 className="text-xl font-bold mb-4">{locale === 'en' ? 'Review & confirm' : 'ตรวจสอบและยืนยัน'}</h2>
      <p className="text-sm text-ink-muted mb-4">
        {locale === 'en' ? 'Please verify the details on the right before continuing.' : 'กรุณาตรวจสอบรายละเอียดด้านขวามือก่อนดำเนินการต่อ'}
      </p>

      <label className="flex items-start gap-2 bg-pastel-amber/40 rounded-lg p-3 mb-6 cursor-pointer">
        <Checkbox checked={agreed} onCheckedChange={(v) => setAgreed(v === true)} />
        <span className="text-sm">
          {locale === 'en' ? 'I agree to the terms and cancellation policy.' : 'ฉันยอมรับข้อกำหนดและเงื่อนไขการยกเลิก'}
        </span>
      </label>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onBack}>{locale === 'en' ? 'Back' : 'ย้อนกลับ'}</Button>
        <Button className="bg-primary hover:bg-primary-dark" disabled={!agreed} onClick={onNext}>
          {locale === 'en' ? 'Proceed to payment' : 'ไปยังการชำระเงิน'}
        </Button>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Create step-payment**

Create `components/booking/step-payment.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { QrCode, CreditCard, Building2 } from 'lucide-react';
import type { Tour, PaymentMethod } from '@/types';
import type { BookingDraft } from './booking-types';
import { Button } from '@/components/ui/button';
import { calculateJoinTotal, calculatePrivateTotal, calculateCarAddon } from '@/lib/pricing';
import { formatPrice } from '@/lib/i18n';

export function StepPayment({
  tour, draft, onSubmit, onBack,
}: {
  tour: Tour;
  draft: BookingDraft;
  onSubmit: (method: PaymentMethod) => void | Promise<void>;
  onBack: () => void;
}) {
  const locale = useLocale();
  const [method, setMethod] = useState<PaymentMethod>('qr');
  const [submitting, setSubmitting] = useState(false);

  const tourTotal =
    draft.mode === 'join'
      ? calculateJoinTotal(tour, draft.travelers)
      : calculatePrivateTotal(tour, draft.travelers);
  const addonTotal = draft.carRentalAddon
    ? calculateCarAddon(draft.carRentalAddon.vehicleSize, tour.duration.days)
    : 0;
  const total = tourTotal + addonTotal;

  async function handleConfirm() {
    setSubmitting(true);
    await onSubmit(method);
    setSubmitting(false);
  }

  const methods: Array<{ k: PaymentMethod; icon: typeof QrCode; label: string }> = [
    { k: 'qr', icon: QrCode, label: 'QR PromptPay' },
    { k: 'card', icon: CreditCard, label: locale === 'en' ? 'Credit card' : 'บัตรเครดิต' },
    { k: 'transfer', icon: Building2, label: locale === 'en' ? 'Bank transfer' : 'โอนผ่านธนาคาร' },
  ];

  return (
    <section>
      <h2 className="text-xl font-bold mb-4">{locale === 'en' ? 'Choose payment method' : 'เลือกวิธีชำระเงิน'}</h2>
      <div className="grid grid-cols-3 gap-2 mb-6">
        {methods.map(({ k, icon: Icon, label }) => (
          <button
            type="button"
            key={k}
            onClick={() => setMethod(k)}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition ${method === k ? 'border-primary bg-primary-50' : 'border-line bg-white'}`}
          >
            <Icon className={`h-5 w-5 ${method === k ? 'text-primary' : 'text-ink-muted'}`} />
            <span className="text-xs font-semibold">{label}</span>
          </button>
        ))}
      </div>

      <div className="bg-white border border-line rounded-xl p-6 mb-4 text-center">
        {method === 'qr' && (
          <div
            className="mx-auto rounded-lg"
            style={{
              width: 180,
              height: 180,
              background: 'repeating-conic-gradient(#0f172a 0% 25%, #ffffff 0% 50%) 50%/20px 20px',
            }}
            aria-label="QR PromptPay placeholder"
          />
        )}
        {method === 'card' && (
          <div className="text-sm text-ink-muted">
            {locale === 'en' ? 'Card form (mock — no charge)' : 'ฟอร์มบัตรเครดิต (mock — ไม่ตัดเงินจริง)'}
          </div>
        )}
        {method === 'transfer' && (
          <div className="text-sm">
            <p className="text-ink-muted mb-1">{locale === 'en' ? 'Transfer to' : 'โอนเข้าบัญชี'}</p>
            <p className="font-bold">SCB · 123-4-56789-0 · Go Travel Co., Ltd.</p>
          </div>
        )}
        <div className="mt-5 text-xs uppercase tracking-wider text-ink-muted">{locale === 'en' ? 'Total' : 'ยอดรวม'}</div>
        <div className="text-3xl font-extrabold text-primary">{formatPrice(total, locale)}</div>
      </div>

      <div className="bg-pastel-amber/40 text-pastel-amber-ink text-xs rounded-md p-2.5 mb-4">
        DEMO: {locale === 'en' ? 'Click "Confirm" to simulate payment success.' : 'กดยืนยันเพื่อจำลองการชำระเงิน'}
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onBack} disabled={submitting}>{locale === 'en' ? 'Back' : 'ย้อนกลับ'}</Button>
        <Button className="bg-primary hover:bg-primary-dark" disabled={submitting} onClick={handleConfirm}>
          {submitting ? (locale === 'en' ? 'Processing...' : 'กำลังประมวลผล...') : (locale === 'en' ? 'Confirm payment' : 'ยืนยันการชำระ')}
        </Button>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Create booking-summary sidebar**

Create `components/booking/booking-summary.tsx`:

```tsx
'use client';

import { useLocale } from 'next-intl';
import Image from 'next/image';
import type { Tour } from '@/types';
import type { BookingDraft } from './booking-types';
import { pickLocale, formatPrice, formatDate } from '@/lib/i18n';
import { calculateJoinTotal, calculatePrivateTotal, calculateCarAddon, findPrivateTier } from '@/lib/pricing';

export function BookingSummary({ tour, draft }: { tour: Tour; draft: BookingDraft }) {
  const locale = useLocale();
  const totalPax = draft.travelers.adults + draft.travelers.children;

  let tourTotal = 0;
  try {
    tourTotal =
      draft.mode === 'join'
        ? calculateJoinTotal(tour, draft.travelers)
        : findPrivateTier(tour, totalPax)
        ? calculatePrivateTotal(tour, draft.travelers)
        : 0;
  } catch {
    tourTotal = 0;
  }
  const addonTotal = draft.carRentalAddon ? calculateCarAddon(draft.carRentalAddon.vehicleSize, tour.duration.days) : 0;
  const total = tourTotal + addonTotal;

  const dateStr =
    draft.mode === 'join'
      ? draft.tripId
        ? formatDate(draft.privateDate ?? new Date().toISOString(), locale)
        : ''
      : draft.privateDate
      ? formatDate(draft.privateDate, locale)
      : '';

  return (
    <aside className="lg:sticky lg:top-24 self-start">
      <div className="bg-white border border-line rounded-2xl overflow-hidden">
        <div className="relative h-32">
          <Image src={tour.coverImage} alt={pickLocale(tour.name, locale)} fill className="object-cover" />
        </div>
        <div className="p-5 space-y-3 text-sm">
          <div>
            <div className="font-bold">{pickLocale(tour.name, locale)}</div>
            <div className="text-xs text-ink-muted">
              {pickLocale(tour.destination, locale)} · {tour.duration.days} {locale === 'en' ? 'days' : 'วัน'}
            </div>
          </div>
          {dateStr && <div className="text-xs">{dateStr}</div>}
          <div className="border-t border-line pt-3 space-y-1.5">
            <div className="flex justify-between"><span>{locale === 'en' ? 'Adults' : 'ผู้ใหญ่'}</span><span>{draft.travelers.adults}</span></div>
            <div className="flex justify-between"><span>{locale === 'en' ? 'Children' : 'เด็ก'}</span><span>{draft.travelers.children}</span></div>
            <div className="flex justify-between"><span>{locale === 'en' ? 'Infants' : 'ทารก'}</span><span>{draft.travelers.infants}</span></div>
            {draft.carRentalAddon && (
              <div className="flex justify-between text-pastel-pink-ink">
                <span>{locale === 'en' ? 'Car add-on' : 'รถ add-on'}</span>
                <span>+{formatPrice(addonTotal, locale)}</span>
              </div>
            )}
          </div>
          <div className="border-t border-line pt-3 flex items-center justify-between">
            <span className="text-xs uppercase text-ink-muted tracking-wider">{locale === 'en' ? 'Total' : 'ยอดรวม'}</span>
            <span className="text-xl font-extrabold text-primary">{formatPrice(total, locale)}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
```

- [ ] **Step 7: Verify build + dev**

```bash
npm run build && npm run dev
```

Visit `/tours/hokkaido-autumn-5d` → click a trip → step through all 6 steps → confirm payment → redirects to `/booking/success/GT-2026-XXXXXX`. Counter on tour detail page should increment after returning.

- [ ] **Step 8: Commit**

```bash
git add components/booking
git commit -m "feat: complete booking checkout (travelers, addon, contact, review, payment, summary)"
```

---

## Task 25: Booking Success Page

**Files:** `app/[locale]/booking/success/[id]/page.tsx`

- [ ] **Step 1: Create success page**

Create `app/[locale]/booking/success/[id]/page.tsx`:

```tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Check, Download } from 'lucide-react';
import { store } from '@/lib/store';
import { getTour } from '@/data/tours';
import { useLocale } from 'next-intl';
import { pickLocale, formatPrice, formatDate } from '@/lib/i18n';

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

function SuccessContent({
  booking, tour,
}: {
  booking: ReturnType<typeof store.getBooking> & object;
  tour: ReturnType<typeof getTour> & object;
}) {
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
          {booking.tripId && (
            <div className="flex justify-between text-sm"><span className="text-ink-muted">{locale === 'en' ? 'Departure' : 'วันเดินทาง'}</span><span>{formatDate(booking.privateDate ?? new Date().toISOString(), locale)}</span></div>
          )}
          <div className="flex justify-between text-sm border-t border-white pt-2"><span className="text-ink-muted">{locale === 'en' ? 'Total paid' : 'ยอดชำระ'}</span><span className="font-extrabold text-primary">{formatPrice(booking.payment.amount, locale)}</span></div>
        </div>
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 bg-white border border-line rounded-lg px-4 py-2 text-sm font-semibold"
          >
            <Download className="h-4 w-4" />
            {locale === 'en' ? 'Print booking' : 'พิมพ์ใบจอง'}
          </button>
          <Link href={`${prefix}/`} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold">
            {locale === 'en' ? 'Back to home' : 'กลับหน้าแรก'}
          </Link>
        </div>
      </div>
    </div>
  );
}
```

Note: `window.print()` requires a `'use client'` boundary on the print button. Wrap it:

Update the button to a small client component. Create `components/booking/print-button.tsx`:

```tsx
'use client';
import { Download } from 'lucide-react';

export function PrintButton({ label }: { label: string }) {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 bg-white border border-line rounded-lg px-4 py-2 text-sm font-semibold"
    >
      <Download className="h-4 w-4" />
      {label}
    </button>
  );
}
```

Then in `app/[locale]/booking/success/[id]/page.tsx`, replace the `<button onClick={...}>` JSX with `<PrintButton label={locale === 'en' ? 'Print booking' : 'พิมพ์ใบจอง'} />` and `import { PrintButton } from '@/components/booking/print-button';`.

- [ ] **Step 2: Verify**

After completing a booking checkout, success page should render with booking details + print button works.

- [ ] **Step 3: Commit**

```bash
git add app/[locale]/booking/success components/booking/print-button.tsx
git commit -m "feat: add booking success page with printable booking slip"
```

---

## Task 26: SEO — Metadata, Sitemap, Robots, JSON-LD

**Files:**
- Create: `app/sitemap.ts`
- Create: `app/robots.ts`
- Modify: `app/[locale]/tours/[slug]/page.tsx` (add metadata + JSON-LD)
- Modify: `app/[locale]/layout.tsx` (template title)

- [ ] **Step 1: Create sitemap**

Create `app/sitemap.ts`:

```ts
import type { MetadataRoute } from 'next';
import { tours } from '@/data/tours';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://go-travel-demo.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ['', '/tours', '/trips', '/private', '/car-rental', '/about', '/contact'];
  const tourPaths = tours.map((t) => `/tours/${t.slug}`);

  const urls: MetadataRoute.Sitemap = [];
  for (const locale of ['', '/en']) {
    for (const p of [...staticPaths, ...tourPaths]) {
      urls.push({ url: `${SITE}${locale}${p}`, lastModified: new Date() });
    }
  }
  return urls;
}
```

- [ ] **Step 2: Create robots**

Create `app/robots.ts`:

```ts
import type { MetadataRoute } from 'next';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://go-travel-demo.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/booking/'] }],
    sitemap: `${SITE}/sitemap.xml`,
  };
}
```

- [ ] **Step 3: Add per-tour metadata + JSON-LD**

Update `app/[locale]/tours/[slug]/page.tsx` — add at top after imports:

```tsx
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const tour = getTour(slug);
  if (!tour) return { title: 'Not found' };
  const name = locale === 'en' ? tour.name.en : tour.name.th;
  const summary = locale === 'en' ? tour.summary.en : tour.summary.th;
  return {
    title: `${name} | Go Travel`,
    description: summary,
    openGraph: { title: name, description: summary, images: [tour.coverImage] },
    twitter: { card: 'summary_large_image', title: name, description: summary, images: [tour.coverImage] },
  };
}
```

And add JSON-LD inside the returned `<article>` of `TourDetail`, just before the closing `</article>`:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'TouristTrip',
      name: pickLocale(tour.name, locale),
      description: pickLocale(tour.summary, locale),
      image: tour.coverImage,
      offers: {
        '@type': 'Offer',
        price: tour.groupPricing.perPerson,
        priceCurrency: 'THB',
      },
    }),
  }}
/>
```

- [ ] **Step 4: Update root metadata template**

In `app/[locale]/layout.tsx` change `metadata` to:

```ts
export const metadata: Metadata = {
  title: { default: 'Go Travel — Tours, Trips, Private Groups', template: '%s | Go Travel' },
  description: 'Curated tours across Asia. Book online with ease.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://go-travel-demo.vercel.app'),
};
```

- [ ] **Step 5: Build & verify**

```bash
npm run build
```

Verify `.next/server/app/sitemap.xml.body` and `.next/server/app/robots.txt.body` are generated.

- [ ] **Step 6: Commit**

```bash
git add app/sitemap.ts app/robots.ts app/[locale]
git commit -m "feat: add SEO (sitemap, robots, per-tour metadata + JSON-LD)"
```

---

## Task 27: Push to GitHub + Vercel Deploy

**This is the only task that affects external services. Confirm with user before each push.**

- [ ] **Step 1: Verify everything builds and tests pass**

```bash
npm run typecheck
npm test
npm run build
```

Expected: all green.

- [ ] **Step 2: Confirm with user before pushing**

Ask the user explicitly: "Ready to push to https://github.com/thanakitpw/go-travel-demo and trigger Vercel? This is the first remote push."

Wait for an explicit "yes" before continuing.

- [ ] **Step 3: Add remote + push**

```bash
git remote add origin https://github.com/thanakitpw/go-travel-demo.git
git push -u origin main
```

Expected: GitHub authentication may prompt. Push succeeds.

- [ ] **Step 4: User connects Vercel via dashboard**

Tell the user: open https://vercel.com/new, import `thanakitpw/go-travel-demo`, accept defaults (Vercel detects Next.js), click Deploy. No env vars needed for first deploy.

Wait for them to share the Vercel URL.

- [ ] **Step 5: Post-deploy smoke test**

Open the Vercel URL and verify:
- Homepage loads with Hero + categories + featured tours
- `/en` switches to English
- Tour detail page loads with itinerary + sidebar
- Booking flow completes end-to-end (try a Join Group booking)
- Counter increments visibly within 10s after booking

- [ ] **Step 6: Run Lighthouse**

In Chrome DevTools → Lighthouse → Desktop → Performance + SEO + Accessibility.

Expected from spec:
- Performance ≥ 95
- SEO 100
- Accessibility ≥ 95

If any metric falls short, file specific follow-up tasks rather than ad-hoc fixing now (e.g., if LCP > 2s, add `priority` to hero `<Image>`; if CLS > 0.1, set explicit dimensions on images).

- [ ] **Step 7: Final commit (if any post-deploy fixes)**

If you made adjustments based on Lighthouse:

```bash
git add .
git commit -m "perf: post-deploy Lighthouse adjustments"
git push
```

---

## Self-Review

**Spec coverage check:**

| Spec section | Covered by |
|---|---|
| 1. Goal & Strategy (Phase 1 mockup) | Whole plan |
| 2. Decisions (stack, fonts, icons, palette, desktop-first) | Tasks 1-4, 16, 17 |
| 3. Sitemap & routes | Tasks 18-23, 25, 26 |
| 4. Data model (Tour/TripInstance/Booking/CarRental) | Tasks 7-10 |
| 5. Booking flow (3 entries × 6 steps × 2 modes) | Tasks 23-25 |
| 6. i18n strategy (next-intl, subpath, helpers) | Tasks 5, 6 |
| 7. Project structure | Tasks 1-26 (all paths match spec) |
| 8. Hosting & deploy (Vercel via GitHub) | Task 27 |
| 9. Out of scope | Honored — no auth, no real payment, no admin, no DB, no cancellation |
| 10. Success criteria | Task 27 final smoke test |

**Placeholder check:** No "TBD/TODO/etc." markers in any task. The 6 additional tours in Task 8 are explicitly enumerated by slug, destination, duration, and group price — and the private pricing formula is given.

**Type consistency:** `BookingDraft.carRentalAddon` deliberately omits `days` (computed from `tour.duration.days` at submission time per spec). `Booking.carRentalAddon` includes `days`. Verified: `checkout-shell.tsx` adds `days` before POST; `step-payment.tsx` uses `tour.duration.days` for total preview; `lib/store.ts` and API routes use the full `Booking` type. Naming is consistent: `tripId`, `tourSlug`, `joinMaxCapacity`, `vehicleSize` used the same way everywhere.

---

## Execution Handoff

**Plan complete and saved to `docs/superpowers/plans/2026-05-03-go-travel-demo-implementation.md`.** Two execution options:

**1. Subagent-Driven (recommended)** — Dispatch a fresh subagent per task; review between tasks; fast iteration.

**2. Inline Execution** — Execute tasks in this session using executing-plans; batch execution with checkpoints.

**Which approach?**
