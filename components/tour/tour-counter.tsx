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
