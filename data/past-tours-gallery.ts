import type { I18n } from '@/lib/i18n';

export type GalleryItem = {
  id: string;
  image: string;
  destination: I18n;
  caption: I18n;
};

export const pastTours: GalleryItem[] = [
  { id: 'g1', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&q=80',
    destination: { th: 'ญี่ปุ่น', en: 'Japan' },
    caption: { th: 'ฮอกไกโด มี.ค. 2569', en: 'Hokkaido, Mar 2026' } },
  { id: 'g2', image: 'https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?w=600&q=80',
    destination: { th: 'เกาหลีใต้', en: 'South Korea' },
    caption: { th: 'โซล ก.พ. 2569', en: 'Seoul, Feb 2026' } },
  { id: 'g3', image: 'https://images.unsplash.com/photo-1503917988258-f87a78e3c995?w=600&q=80',
    destination: { th: 'บาหลี', en: 'Bali' },
    caption: { th: 'อูบุด เม.ย. 2569', en: 'Ubud, Apr 2026' } },
  { id: 'g4', image: 'https://images.unsplash.com/photo-1551918120-9739cb430c6d?w=600&q=80',
    destination: { th: 'ฮ่องกง', en: 'Hong Kong' },
    caption: { th: 'มาเก๊า ม.ค. 2569', en: 'Macau, Jan 2026' } },
  { id: 'g5', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=600&q=80',
    destination: { th: 'เวียดนาม', en: 'Vietnam' },
    caption: { th: 'ฮาลองเบย์ ธ.ค. 2568', en: 'Halong Bay, Dec 2025' } },
  { id: 'g6', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&q=80',
    destination: { th: 'สิงคโปร์', en: 'Singapore' },
    caption: { th: 'มารินาเบย์ พ.ย. 2568', en: 'Marina Bay, Nov 2025' } },
  { id: 'g7', image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&q=80',
    destination: { th: 'ไต้หวัน', en: 'Taiwan' },
    caption: { th: 'ไทเป ต.ค. 2568', en: 'Taipei, Oct 2025' } },
  { id: 'g8', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80',
    destination: { th: 'ญี่ปุ่น', en: 'Japan' },
    caption: { th: 'โอซาก้า ก.ย. 2568', en: 'Osaka, Sep 2025' } },
];
