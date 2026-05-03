import type { I18n } from '@/lib/i18n';

export type Article = {
  slug: string;
  title: I18n;
  excerpt: I18n;
  cover: string;        // unsplash
  category: I18n;
  publishedAt: string;
  readTimeMin: number;
};

export const articles: Article[] = [
  {
    slug: 'hokkaido-autumn-best-spots',
    title: {
      th: '5 จุดถ่ายใบไม้แดงที่ฮอกไกโดต้องไม่พลาด',
      en: '5 Must-Visit Autumn Leaf Spots in Hokkaido',
    },
    excerpt: {
      th: 'ฮอกไกโดในฤดูใบไม้แดงเป็นช่วงที่สวยที่สุด คัดสรร 5 จุดที่ถ่ายรูปออกมาสวยที่สุดให้คุณ',
      en: 'Hokkaido in autumn is at its peak — here are the 5 most photogenic spots we recommend.',
    },
    cover: 'https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=800&q=80',
    category: { th: 'ญี่ปุ่น', en: 'Japan' },
    publishedAt: '2026-03-15',
    readTimeMin: 6,
  },
  {
    slug: 'private-tour-vs-group',
    title: {
      th: 'ไพรเวทกรุ๊ป VS Join Group: เลือกแบบไหนดี?',
      en: 'Private Group vs Join Group: Which is Right for You?',
    },
    excerpt: {
      th: 'เปรียบเทียบข้อดี-ข้อเสียของทัวร์ 2 รูปแบบ พร้อมแนะนำว่าเหมาะกับใคร',
      en: 'Compare pros and cons of both tour styles, and learn which one suits your group.',
    },
    cover: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80',
    category: { th: 'คำแนะนำ', en: 'Tips' },
    publishedAt: '2026-04-02',
    readTimeMin: 4,
  },
  {
    slug: 'first-time-korea-tips',
    title: {
      th: '10 ทิปสำหรับมือใหม่ที่จะไปเกาหลีครั้งแรก',
      en: '10 Tips for First-Time Travelers to Korea',
    },
    excerpt: {
      th: 'ตั้งแต่วีซ่าจนถึงการใช้รถไฟใต้ดิน เตรียมตัวก่อนไปเกาหลีให้พร้อมเป๊ะ',
      en: 'From visas to subway hacks, get fully prepared before your first Korea trip.',
    },
    cover: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=800&q=80',
    category: { th: 'คำแนะนำ', en: 'Tips' },
    publishedAt: '2026-04-20',
    readTimeMin: 8,
  },
];
