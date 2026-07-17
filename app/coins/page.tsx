import Image from 'next/image';
import Link from 'next/link';

import { fetcher } from '@/lib/coingecko.actions';
import { cn, formatCurrency, formatPercentage } from '@/lib/utils';

import DataTable from '@/components/DataTable';
import CoinsPagination from '@/components/CoinsPagination';

import { CoinsFallback } from '../../components/home/fallback';



const PER_PAGE = 10;

const getCoinsData = async (currentPage: number): Promise<CoinMarketData[] | null> => {
  try {
    const coinsData = await fetcher<CoinMarketData[]>('/coins/markets', {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: PER_PAGE,
      page: currentPage,
      sparkline: 'false',
      price_change_percentage: '24h',
    });

    return coinsData;
  } catch (error) {
    console.error('Error fetching coins:', error);
    return null;
  }
};

const columns: DataTableColumn<CoinMarketData>[] = [
  {
    header: 'Rank',
    cellClassName: 'rank-cell',
    cell: (coin) => (
      <>
        #{coin.market_cap_rank}
        <Link href={`/coins/${coin.id}`} aria-label="View coin" />
      </>
    ),
  },
  {
    header: 'Token',
    cellClassName: 'token-cell',
    cell: (coin) => (
      <div className="token-info">
        <Image src={coin.image} alt={coin.name} width={36} height={36} />
        <p>
          {coin.name} ({coin.symbol.toUpperCase()})
        </p>
      </div>
    ),
  },
  {
    header: 'Price',
    cellClassName: 'price-cell',
    cell: (coin) => formatCurrency(coin.current_price),
  },
  {
    header: '24h Change',
    cellClassName: 'change-cell',
    cell: (coin) => {
      const change = coin.price_change_percentage_24h;
      const isTrendingUp = change > 0;
      const isTrendingDown = change < 0;

      return (
        <span
          className={cn('change-value', {
            'text-green-600': isTrendingUp,
            'text-red-500': isTrendingDown,
          })}
        >
          {isTrendingUp && '+'}
          {formatPercentage(change)};
        </span>
      );
    },
  },
  {
    header: 'Market Cap',
    cellClassName: 'market-cap-cell',
    cell: (coin) => formatCurrency(coin.market_cap),
  },
];

const Coins = async ({ searchParams }: NextPageProps) => {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;

  const coinsData = await getCoinsData(currentPage);

  if (!coinsData) {
    return <CoinsFallback />;
  }

  const hasMorePages = coinsData.length === PER_PAGE;
  const estimatedTotalPages = currentPage >= 100 ? Math.ceil(currentPage / 100) * 100 + 100 : 100;

  return (
    <main id="coins-page">
      <div className="content">
        <h4>All Coins</h4>

        <DataTable
          tableClassName="coins-table"
          columns={columns}
          data={coinsData}
          rowKey={(coin) => coin.id}
        />

        <CoinsPagination
          currentPage={currentPage}
          totalPages={estimatedTotalPages}
          hasMorePages={hasMorePages}
        />
      </div>
    </main>
  );
};

export default Coins;