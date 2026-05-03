import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const booking = store.getBooking(id);
  if (!booking) return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });
  return NextResponse.json({ booking });
}
