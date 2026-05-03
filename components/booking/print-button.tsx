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
