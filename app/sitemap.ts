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
