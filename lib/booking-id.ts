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
