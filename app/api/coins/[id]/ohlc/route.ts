import { NextRequest, NextResponse } from 'next/server';

import { fetcher } from '@/lib/coingecko.actions';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const days = request.nextUrl.searchParams.get('days') ?? '1';

  try {
    const data = await fetcher<OHLCData[]>(`/coins/${id}/ohlc`, {
      vs_currency: 'usd',
      days,
      precision: 'full',
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error(`Failed to fetch OHLC data for ${id}:`, error);
    return NextResponse.json({ error: 'Unable to fetch OHLC data.' }, { status: 502 });
  }
}
