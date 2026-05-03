import { NextResponse } from 'next/server';
import { tours } from '@/data/tours';

export async function GET() {
  return NextResponse.json({ tours });
}
