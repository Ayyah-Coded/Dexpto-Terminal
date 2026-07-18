import { NextRequest, NextResponse } from 'next/server';

import { searchCoins } from '@/lib/coingecko.actions';

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('query')?.trim() ?? '';

  if (!query) {
    return NextResponse.json([]);
  }

  try {
    const coins = await searchCoins(query);

    return NextResponse.json(coins);
  } catch (error) {
    console.error('Failed to search coins:', error);
    return NextResponse.json({ error: 'Unable to search coins.' }, { status: 502 });
  }
}
