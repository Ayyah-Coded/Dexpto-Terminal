import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import { fetcher, getPools } from '@/lib/coingecko.actions';
import { formatCurrency } from '@/lib/utils';

import LiveDataWrapper from '@/components/LiveDataWrapper';
import Converter from '@/components/Converter';



const Page = async ({ params }: NextPageProps) => {
  const { id } = await params;

  let coinData: CoinDetailsData;
  let coinOHLCData: OHLCData[];

  try {
    [coinData, coinOHLCData] = await Promise.all([
      fetcher<CoinDetailsData>(`/coins/${id}`, {
        dex_pair_format: 'contract_address',
      }),
      fetcher<OHLCData[]>(`/coins/${id}/ohlc`, {
        vs_currency: 'usd',
        days: 1,
        interval: 'hourly',
        precision: 'full',
      }),
    ]);
  } catch (error) {
    console.error(`Failed to fetch coin details for ${id}:`, error);

    return (
      <main className="mx-auto flex min-h-100 max-w-360 items-center justify-center px-4 sm:px-6">
        <div className="max-w-md rounded-lg bg-dark-500 p-6 text-center">
          <h1 className="text-xl font-semibold">Coin data is temporarily unavailable</h1>
          <p className="mt-2 text-purple-100">
            CoinGecko is rate-limiting requests. Please try again in a minute.
          </p>
          <Link className="mt-5 inline-block text-green-500 hover:underline" href="/coins">
            Back to all coins
          </Link>
        </div>
      </main>
    );
  }

  const platform = coinData.asset_platform_id
    ? coinData.detail_platforms?.[coinData.asset_platform_id]
    : null;
  const network = platform?.geckoterminal_url.split('/')[3] || null;
  const contractAddress = platform?.contract_address || null;

  const pool = await getPools(id, network, contractAddress);

  const coinDetails = [
    {
      label: 'Market Cap',
      value: formatCurrency(coinData.market_data.market_cap.usd),
    },
    {
      label: 'Market Cap Rank',
      value: `# ${coinData.market_cap_rank}`,
    },
    {
      label: 'Total Volume',
      value: formatCurrency(coinData.market_data.total_volume.usd),
    },
    {
      label: 'Website',
      value: '-',
      link: coinData.links.homepage[0],
      linkText: 'Homepage',
    },
    {
      label: 'Explorer',
      value: '-',
      link: coinData.links.blockchain_site[0],
      linkText: 'Explorer',
    },
    {
      label: 'Community',
      value: '-',
      link: coinData.links.subreddit_url,
      linkText: 'Community',
    },
  ];

  return (
    <main id="coin-details-page">
      <section className="primary">
        <LiveDataWrapper coinId={id} poolId={pool.id} coin={coinData} coinOHLCData={coinOHLCData}>
          <h4>Exchange Listings</h4>
        </LiveDataWrapper>
      </section>

      <section className="secondary">
        <Converter
          symbol={coinData.symbol}
          icon={coinData.image.small}
          priceList={coinData.market_data.current_price}
        />

        <div className="details">
          <h4>Coin Details</h4>

          <ul className="details-grid">
            {coinDetails.map(({ label, value, link, linkText }, index) => (
              <li key={index}>
                <p className={label}>{label}</p>

                {link ? (
                  <div className="link">
                    <Link href={link} target="_blank">
                      {linkText || label}
                    </Link>
                    <ArrowUpRight size={16} />
                  </div>
                ) : (
                  <p className="text-base font-medium">{value}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
};
export default Page;
