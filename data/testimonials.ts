import type { I18n } from '@/lib/i18n';

export type Testimonial = {
  id: string;
  name: string;          // person name (transliterated, same in TH/EN)
  avatar: string;        // unsplash portrait
  tourSlug: string;      // which tour they took
  quote: I18n;
  rating: number;        // 1-5
  date: string;          // ISO
};

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'คุณวรรณา ศรีสวัสดิ์',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
    tourSlug: 'hokkaido-autumn-5d',
    quote: {
      th: 'ทริปฮอกไกโดสมบูรณ์มาก ใบไม้แดงสวยจริงๆ ไกด์ดูแลดี อาหารอร่อย จะมาอีกแน่นอน',
      en: 'My Hokkaido trip was perfect. The autumn leaves were stunning, our guide was attentive, and the food was incredible. Definitely coming back.',
    },
    rating: 5,
    date: '2026-03-12',
  },
  {
    id: 't2',
    name: 'คุณภูริพงษ์ จันทร์เจริญ',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
    tourSlug: 'seoul-busan-6d',
    quote: {
      th: 'ไป 4 คนแบบ Private กับ Go Travel จัดทริปเกาหลีให้เราได้ตามใจ ราคาเหมาะสม คุ้มมาก',
      en: 'Booked the private package for 4 of us. Korea exactly the way we wanted, fair pricing, totally worth it.',
    },
    rating: 5,
    date: '2026-02-28',
  },
  {
    id: 't3',
    name: 'คุณสุพิชชา อินทรประเสริฐ',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80',
    tourSlug: 'bali-paradise-5d',
    quote: {
      th: 'รีสอร์ทบาหลีดีกว่าที่คาด ทุกอย่างจัดได้ลื่น พนักงานช่วยเหลือดี แนะนำเลย',
      en: 'Bali resort exceeded expectations. Everything ran smoothly, staff super helpful, would recommend.',
    },
    rating: 5,
    date: '2026-04-05',
  },
  {
    id: 't4',
    name: 'คุณธนกฤต พงษ์เจริญ',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80',
    tourSlug: 'hongkong-macau-3d',
    quote: {
      th: 'ทริป 3 วันสั้นแต่คุ้ม เห็นไฮไลท์ครบทุกที่ทั้งฮ่องกงและมาเก๊า ใช้เวลาคุ้มค่ามาก',
      en: 'Short 3-day trip but packed with highlights across both HK and Macau. Time well spent.',
    },
    rating: 4,
    date: '2026-01-18',
  },
];
