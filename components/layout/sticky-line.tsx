'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, ArrowUp } from 'lucide-react';

export function StickyLine() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {showTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          className="cursor-pointer h-12 w-12 rounded-full bg-white border border-line shadow-lg text-ink hover:text-primary hover:border-primary flex items-center justify-center transition-colors duration-200"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
      <a
        href="https://line.me/R/ti/p/@gotravel"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact on LINE"
        className="cursor-pointer h-14 w-14 rounded-full shadow-2xl flex items-center justify-center text-white transition-transform duration-200 hover:scale-110"
        style={{ background: 'linear-gradient(135deg, #06c755 0%, #04a648 100%)' }}
      >
        <MessageCircle className="h-7 w-7" />
      </a>
    </div>
  );
}
