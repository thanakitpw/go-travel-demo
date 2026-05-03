# Go Travel — Demo Website Design Spec

**Date**: 2026-05-03
**Owner**: best solutions (agency)
**Repo**: https://github.com/thanakitpw/go-travel-demo
**Reference site**: https://hongkongmode.com (client's example)

## 1. Goal & Strategy

Build a demo tour-booking website for two purposes:

1. **Pitch tool** — present to a prospective tour-business client
2. **Portfolio asset** — showcase agency capability for future tour-industry clients

**Phase strategy** (incremental):

| Phase | Scope | Trigger |
|---|---|---|
| **1 (this spec)** | Clickable mockup with mock API + in-memory state. Full booking flow with fake payment. Bilingual TH/EN. | Build now |
| **B** | Add real persistence (Postgres + Prisma) + email notifications | After client signs |
| **C** | Add real payment (Stripe/Omise) + admin panel + auth | Production launch |

Architecture is designed so Phase B/C requires no UI re-architecture — only swapping `lib/store.ts`.

## 2. Decisions Summary

| Topic | Decision |
|---|---|
| Brand | Generic "Go Travel" (multi-destination, not Hong Kong–specific) |
| Stack | Next.js 15 (App Router) + TypeScript + Tailwind + shadcn/ui |
| Booking depth | Full checkout + fake payment screen (QR PromptPay / credit card / bank transfer) |
| User accounts | None — guest checkout only |
| Counter ("7/29") | Live, shared across visitors via in-memory store + SWR polling |
| Languages | Thai (default) + English |
| Visual | Royal blue `#2563eb` primary + pastel accents + white cards |
| Layout | Desktop-first (responsive but not mobile-first) |
| Fonts | Inter (EN) + Noto Sans Thai (TH) — Google Fonts |
| Icons | `lucide-react` only — **no emoji ever** |
| Hosting | Vercel via GitHub integration |

## 3. Sitemap & Routes

```
/  (default = TH; /en for English)
│
├── /                          Home (Hero + Search + Quick categories + Featured tours)
├── /tours                     All programs (filter by destination/month/price/mode)
├── /tours/[slug]              Program detail + open trips + Join/Private mode selector
│
├── /trips                     Annual schedule (timeline view of 7-8 programs)
└── /trips/[id]                Trip detail + live counter "7/29" + book button
│
├── /private                   Private group landing page
├── /car-rental                Car rental form (size/date/pickup, no model)
│
├── /booking
│   ├── /booking/checkout      Multi-step checkout (6 steps)
│   └── /booking/success/[id]  Confirmation + downloadable booking slip
│
├── /about
└── /contact
```

**API routes** (Phase 1 = in-memory):

```
GET  /api/tours                 List all tours
GET  /api/tours/[slug]          Tour detail + open trips
GET  /api/trips/[id]/counter    Current registered count (polled every 10s)
POST /api/bookings              Create booking + increment counter
GET  /api/bookings/[id]         Fetch for success page
POST /api/car-rentals           Submit car rental request
```

## 4. Data Model

All content fields are i18n-aware via `{ th, en }` shape.

```ts
type I18n = { th: string; en: string }
type I18nArray = { th: string[]; en: string[] }

// Tour template
type Tour = {
  slug: string                       // "hokkaido-autumn-5d"
  name: I18n
  destination: I18n
  destinationCode: string            // "JP" — for filter
  summary: I18n
  duration: { days: number; nights: number }
  coverImage: string
  gallery: string[]
  highlights: I18nArray
  itinerary: Array<{
    day: number
    title: I18n
    activities: I18nArray
  }>
  includes: I18nArray
  excludes: I18nArray
  groupPricing: { perPerson: number }
  privatePricing: Array<{ minPax: number; maxPax: number; perPerson: number }>
  joinMaxCapacity: number            // e.g., 29 (counter cap)
  joinMinToDepart: number            // e.g., 4
  tags?: string[]
}

// Scheduled departure
type TripInstance = {
  id: string                         // "trip-hokkaido-202611"
  tourSlug: string
  departDate: string                 // ISO date
  returnDate: string
  registeredCount: number            // counter
  status: "open" | "closing-soon" | "full" | "departed"
}

// Tour booking
type Booking = {
  id: string                         // "GT-2026-000123"
  mode: "join" | "private"
  tourSlug: string
  tripId?: string                    // join only
  privateDate?: string               // private only
  travelers: { adults: number; children: number; infants: number }
  contact: { name: string; email: string; phone: string; lineId?: string; note?: string }
  carRentalAddon?: {
    vehicleSize: 4 | 8 | 12 | 16
    days: number
    pickupLocation: string
  }
  payment: { method: "qr" | "card" | "transfer"; amount: number }
  status: "pending" | "confirmed"
  createdAt: string
}

// Standalone car rental
type CarRental = {
  id: string                         // "CAR-2026-000045"
  vehicleSize: 4 | 8 | 12 | 16
  pickupDate: string
  returnDate: string
  pickupLocation: string
  destination: string
  contact: { name: string; email: string; phone: string }
  estimatedPrice: number
  createdAt: string
}
```

**Storage (Phase 1)**:

- `data/tours.ts` — Tour[] (~7-8 programs hardcoded with full TH/EN content)
- `data/trips.ts` — TripInstance[] (2-3 departures per tour)
- `data/car-rental-pricing.ts` — base rates per vehicle size
- `lib/store.ts` — in-memory `Map<id, Booking>` + `Map<tripId, count>`. **Phase B/C: swap to Prisma client here only.**
- `public/images/` — all assets

## 5. Booking Flow

**3 entry points**:

1. From `/trips/[id]` — mode = `join`, date locked
2. From `/tours/[slug]` — user picks Join Group or Private mode
3. From `/private` — pick a program, mode = `private`

**6 steps** (same shell, content varies by mode):

| Step | Purpose | Notes |
|---|---|---|
| 1. Selection | Lock date (Join) or pick date + group size (Private) | Shows live counter |
| 2. Travelers | Adults (12+) / Children (4-11) / Infants (<4) | Validate against capacity |
| 3. Add-on | Optional: add private car (size 4/8/12/16 + pickup) | Skippable |
| 4. Contact | Name, email, phone, LINE ID, note | Lead traveler info |
| 5. Review | Full summary + price breakdown + T&C checkbox | |
| 6. Payment | Tabs: QR PromptPay / Credit card / Bank transfer | Mockup — confirm = success |

**Pricing logic** (`lib/pricing.ts`):

- **Join**: `total = (adults × perPerson) + (children × perPerson × 0.7)`
  — Child rate = 70% of adult rate (age 4-11). Infants (<4) are free and excluded from totals.
- **Private**: count `paxForTier = adults + children` (infants excluded), find tier where `minPax ≤ paxForTier ≤ maxPax`, then `total = (adults × tier.perPerson) + (children × tier.perPerson × 0.7)`
- **Car add-on**: `vehicleRate × days`. `days` is auto-derived from tour duration (`tour.duration.days`) — user does not enter it manually in the add-on step. The standalone `/car-rental` form computes days from pickup/return dates user enters.
- **All amounts in THB only** (Phase 1, no multi-currency)

**On Confirm**:

1. `POST /api/bookings` creates booking with ID `GT-YYYY-NNNNNN`
2. If `mode = join`: increment `Map<tripId, count>` by `(adults + children)` (infants don't count toward capacity) and broadcast via SWR revalidation
3. If incrementing would exceed `joinMaxCapacity`: return 409 conflict; UI shows "เพิ่งเต็มไป" and refunds nothing (no money was taken — mockup)
4. Redirect to `/booking/success/[id]` with downloadable booking slip

**No cancellation flow in Phase 1** — counter only goes up, never down. (Cancellation/refund deferred to Phase B/C.)

**Private mode date**: user picks any date ≥ 14 days from today (validated client-side). No availability check — Phase 1 assumes all private dates are bookable.

**State persistence**: booking-flow state lives in React state inside the checkout client wrapper, mirrored to `sessionStorage` to survive accidental refresh.

## 6. i18n Strategy

**Library**: `next-intl` (App Router compatible, supports RSC)

**Routing**: subpath — `/` = TH, `/en` = EN, switcher in nav (top-right)

**String storage**:

1. UI strings → `messages/th.json` + `messages/en.json` (namespaced: `nav`, `booking`, `common`, ...)
2. Tour content → inline `{ th, en }` in `data/tours.ts`, accessed via `pickLocale(field, locale)` helper

**Locale detection chain**:

1. URL prefix
2. Cookie `NEXT_LOCALE`
3. `Accept-Language` header
4. Default: `th`

**Formatting helpers** (`lib/i18n.ts`):

- `formatPrice(amount, locale)` — `฿59,800` (TH) / `THB 59,800` (EN)
- `formatDate(date, locale)` — Buddhist calendar for TH (`Intl.DateTimeFormat('th-TH-u-ca-buddhist')`), Gregorian DD MMM YYYY for EN
- `formatPax(count, locale)` — pluralization via ICU MessageFormat (handled by `next-intl`)

**Image strategy**: prefer images without embedded text; if needed, supply parallel TH/EN versions in `/public/images/`.

## 7. Project Structure

```
go-travel/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx                # nav + footer + font loaders
│   │   ├── page.tsx
│   │   ├── tours/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── trips/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── private/page.tsx
│   │   ├── car-rental/page.tsx
│   │   ├── booking/
│   │   │   ├── checkout/page.tsx
│   │   │   └── success/[id]/page.tsx
│   │   ├── about/page.tsx
│   │   └── contact/page.tsx
│   └── api/
│       ├── tours/route.ts
│       ├── tours/[slug]/route.ts
│       ├── trips/[id]/counter/route.ts
│       ├── bookings/route.ts
│       ├── bookings/[id]/route.ts
│       └── car-rentals/route.ts
│
├── components/
│   ├── ui/                           # shadcn primitives
│   ├── layout/                       # nav, footer, lang-switcher
│   ├── home/                         # hero, search-bar, quick-categories, featured-tours
│   ├── tour/                         # tour-card, tour-counter, itinerary, pricing-tiers
│   ├── trip/                         # trip-timeline, trip-card
│   └── booking/                      # step-rail + 6 step components + summary-sidebar
│
├── data/                             # hardcoded TS content (Phase 1)
│   ├── tours.ts
│   ├── trips.ts
│   └── car-rental-pricing.ts
│
├── lib/
│   ├── store.ts                      # in-memory store — swap for Prisma in Phase B
│   ├── pricing.ts                    # pure functions, unit-testable
│   ├── i18n.ts                       # pickLocale, formatPrice, formatDate
│   ├── booking-id.ts                 # "GT-YYYY-NNNNNN" generator
│   └── utils.ts
│
├── messages/
│   ├── th.json
│   └── en.json
│
├── types/index.ts                    # all entity types
│
├── public/images/{tours,hero,og}/
│
├── i18n.ts                           # next-intl config
├── middleware.ts                     # locale routing
├── tailwind.config.ts                # theme: palette + fonts
├── components.json                   # shadcn config
├── next.config.ts                    # image formats avif/webp
└── docs/superpowers/specs/
    └── 2026-05-03-go-travel-demo-design.md
```

**Patterns**:

- **RSC by default**; `"use client"` only for interactive (booking, search, counter, lang switcher)
- **Counter live update**: `useSWR('/api/trips/:id/counter', { refreshInterval: 10000 })`
- **Forms**: `react-hook-form` + `zod` schemas (works with shadcn `<Form>`)
- **Pricing isolated**: `lib/pricing.ts` is pure functions; UI calls them — easy to unit test

## 8. Hosting & Deploy

**Provider**: Vercel via GitHub integration (auto-deploy on push to `main`, preview URL per PR)

**Domain Phase 1**: `go-travel-demo.vercel.app` (auto). Custom domain optional.

**Build**: standard Next.js (SSR + RSC + static where possible). No static export — API routes are required.

**Environment variables**:

- `NEXT_PUBLIC_SITE_URL` — for canonical + OG
- `NEXT_PUBLIC_LINE_ID` — if "Contact via LINE" button is added

**Image config** (`next.config.ts`):

```ts
images: { formats: ['image/avif', 'image/webp'] }
```

**SEO / Metadata**:

- Per-page `generateMetadata()`
- `app/sitemap.ts` + `app/robots.ts`
- JSON-LD `TouristTrip` schema on tour detail pages
- OG + Twitter Card tags

**Analytics (optional)**: Vercel Analytics (free tier, no cookies).

**Performance targets**:

- Lighthouse Desktop: Performance ≥ 95, SEO 100, A11y ≥ 95
- LCP < 2s, CLS < 0.1
- Initial JS bundle (home) < 150KB

**CI/CD**: Vercel handles build automatically. TypeScript + ESLint run on every build. Optional pre-commit hook later.

## 9. Out of Scope (Phase 1)

Explicitly NOT included in Phase 1, even if useful:

- User accounts / login
- Real payment processing
- Admin panel for managing tours/bookings
- Email/SMS notifications (mockup only)
- Database / persistent storage
- Reviews / ratings
- Blog / FAQ pages
- Wishlist / saved tours
- Search by date range with availability
- Multi-currency (THB only)
- Booking cancellation / refund flow (counter only increments)
- Real availability check for private mode dates

These are deferred to Phase B/C and explicitly excluded from this build.

## 10. Success Criteria (Phase 1)

The demo is "done" when:

1. All 7-8 mock tours render correctly in TH and EN with full content
2. Live counter updates within 10s when another browser books a trip
3. Full booking flow (6 steps) completes and produces a booking ID + slip
4. Private mode pricing tiers calculate correctly across all group sizes (4-16)
5. Car rental form submits and shows confirmation
6. All Lighthouse scores meet targets above
7. No emoji anywhere in the UI
8. Deploys cleanly to Vercel via GitHub integration with preview URLs working
