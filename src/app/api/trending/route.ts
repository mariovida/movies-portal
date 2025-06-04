import { NextRequest, NextResponse } from 'next/server';
import { fetchFromTMDb } from '@/lib/tmdb';

export async function GET(req: NextRequest) {
  const period = req.nextUrl.searchParams.get('period') || 'day';
  const page = req.nextUrl.searchParams.get('page') || '1';

  const data = await fetchFromTMDb(`/trending/all/${period}`, `page=${page}`);
  return NextResponse.json(data);
}
