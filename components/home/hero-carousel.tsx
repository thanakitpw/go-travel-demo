'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Slide = {
  src: string;
  alt: string;
  destination: { th: string; en: string };
};

const SLIDES: Slide[] = [
  {
    src: 'https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=2400&q=85',
    alt: 'Hokkaido autumn lake reflection',
    destination: { th: 'ฮอกไกโด ญี่ปุ่น', en: 'Hokkaido, Japan' },
  },
  {
    src: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=2400&q=85',
    alt: 'Bali rice terraces in Ubud',
    destination: { th: 'อูบุด บาหลี', en: 'Ubud, Bali' },
  },
  {
    src: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=2400&q=85',
    alt: 'Seoul Gyeongbokgung palace at night',
    destination: { th: 'พระราชวังเคียงบกกุง โซล', en: 'Gyeongbokgung, Seoul' },
  },
];

const AUTOPLAY_MS = 5000;

export function HeroCarousel({ locale }: { locale: 'th' | 'en' }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setIndex((i) => (i + 1) % SLIDES.length), []);
  const prev = useCallback(() => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, next]);

  return (
    <div
      className="relative w-screen left-1/2 -translate-x-1/2 h-[560px] overflow-hidden bg-ink"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {SLIDES.map((slide, i) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${i === index ? 'opacity-100' : 'opacity-0'}`}
          aria-hidden={i !== index}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            sizes="100vw"
            priority={i === 0}
            className="object-cover"
          />
        </div>
      ))}

      {/* Destination caption (bottom-left, no overlay film) */}
      <div className="absolute bottom-8 left-8 md:bottom-10 md:left-12 z-10">
        <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur px-4 py-2.5 rounded-full text-sm font-semibold text-ink shadow-lg">
          <span className="h-2 w-2 rounded-full bg-pastel-green-ink" />
          {SLIDES[index].destination[locale]}
        </div>
      </div>

      {/* Arrow controls */}
      <button
        type="button"
        aria-label="Previous slide"
        onClick={prev}
        className="cursor-pointer absolute top-1/2 -translate-y-1/2 left-4 md:left-6 h-12 w-12 rounded-full bg-white/90 hover:bg-white text-ink flex items-center justify-center shadow-lg transition-colors duration-200 z-10"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        type="button"
        aria-label="Next slide"
        onClick={next}
        className="cursor-pointer absolute top-1/2 -translate-y-1/2 right-4 md:right-6 h-12 w-12 rounded-full bg-white/90 hover:bg-white text-ink flex items-center justify-center shadow-lg transition-colors duration-200 z-10"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`cursor-pointer h-2.5 rounded-full transition-all duration-300 ${i === index ? 'w-10 bg-white' : 'w-2.5 bg-white/60 hover:bg-white/80'}`}
          />
        ))}
      </div>
    </div>
  );
}
