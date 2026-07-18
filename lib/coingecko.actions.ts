import qs from 'query-string';

const BASE_URL = process.env.COINGECKO_BASE_URL;
const API_KEY = process.env.COINGECKO_API_KEY;
const DEFAULT_REVALIDATE_SECONDS = 300;

if (!BASE_URL) throw new Error('Could not get base url');
if (!API_KEY) throw new Error('Could not get api key');



export async function fetcher<T>(
  endpoint: string,
  params?: QueryParams,
  revalidate = DEFAULT_REVALIDATE_SECONDS,
  options?: Pick<RequestInit, 'signal'>,
): Promise<T> {
  const url = qs.stringifyUrl(
    {
      url: `${BASE_URL}/${endpoint}`,
      query: params,
    },
    { skipEmptyString: true, skipNull: true },
  );

  const res = await fetch(url, {
    signal: options?.signal,
    headers: {
      'x-cg-api-key': API_KEY,
      'Content-Type': 'application/json',
    } as Record<string, string>,
    cache: 'force-cache',
    next: { revalidate },
  });

  if (!res.ok) {
    const errorBody: CoinGeckoErrorBody = await res.json().catch(() => ({}));

    throw new Error(`API Error: ${res.status}: ${errorBody.error || res.statusText} `);
  }

  return res.json();
};

export async function searchCoins(query: string): Promise<SearchCoin[]> {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) return [];

  const searchResult = await fetcher<{ coins: Omit<SearchCoin, 'data'>[] }>('/search', {
    query: normalizedQuery,
  });
  const matchedCoins = searchResult.coins.slice(0, 10);

  if (!matchedCoins.length) return [];

  const marketData = await fetcher<CoinMarketData[]>('/coins/markets', {
    vs_currency: 'usd',
    ids: matchedCoins.map(({ id }) => id).join(','),
    order: 'market_cap_desc',
    per_page: matchedCoins.length,
    page: 1,
    sparkline: 'false',
    price_change_percentage: '24h',
  });
  const marketsById = new Map(marketData.map((coin) => [coin.id, coin]));

  return matchedCoins.map((coin) => {
    const market = marketsById.get(coin.id);

    return {
      ...coin,
      data: {
        price: market?.current_price,
        price_change_percentage_24h: market?.price_change_percentage_24h ?? 0,
      },
    };
  });
}


export async function getPools(
  id: string,
  network?: string | null,
  contractAddress?: string | null,
): Promise<PoolData> {
  const fallback: PoolData = {
    id: '',
    address: '',
    name: '',
    network: '',
  };

  if (network && contractAddress) {
    try {
      const poolData = await fetcher<{ data: PoolData[] }>(
        `/onchain/networks/${network}/tokens/${contractAddress}/pools`,
      );

      return poolData.data?.[0] ?? fallback;
    } catch (e) {
      return fallback;
    }
  }

  try {
    const poolData = await fetcher<{ data: PoolData[] }>('/onchain/search/pools', { query: id });

    return poolData.data?.[0] ?? fallback;
  } catch {
    return fallback;
  }
}
