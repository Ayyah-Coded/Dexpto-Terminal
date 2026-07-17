import DataTable from '@/components/DataTable';


export const CoinOverviewFallback = () => {
  return (
    <div id="coin-overview-fallback">
      <div className="header pt-2">
        <div className="header-image skeleton" />
        <div className="info">
          <div className="header-line-sm skeleton" />
          <div className="header-line-lg skeleton" />
        </div>
      </div>
      <div className="chart">
        <div className="chart-skeleton skeleton" />
      </div>
    </div>
  );
};

export const TrendingCoinsFallback = () => {
  const columns = [
    {
      header: 'Name',
      cell: () => (
        <div className="name-link">
          <div className="name-image skeleton" />
          <div className="name-line skeleton" />
        </div>
      ),
    },
    {
      header: '24h Change',
      cell: () => (
        <div className="price-change">
          <div className="change-icon skeleton" />
          <div className="change-line skeleton" />
        </div>
      ),
    },
    {
      header: 'Price',
      cell: () => <div className="price-line skeleton" />,
    },
  ];

  const dummyData = Array.from({ length: 6 }, (_, i) => ({ id: i }));

  return (
    <div id="trending-coins-fallback">
      <h4>Trending Coins</h4>
      <DataTable
        data={dummyData}
        columns={columns}
        rowKey={(item) => item.id}
        tableClassName="trending-coins-table"
      />
    </div>
  );
};

export const CategoriesFallback = () => {
  const columns = [
    {
      header: 'Category',
      cellClassName: 'category-cell',
      cell: () => <div className="category-line skeleton" />,
    },
    {
      header: 'Top Gainers',
      cellClassName: 'top-gainers-cell',
      cell: () => (
        <div className="flex gap-1">
          <div className="gainer-image skeleton" />
          <div className="gainer-image skeleton" />
          <div className="gainer-image skeleton" />
        </div>
      ),
    },
    {
      header: '24h Change',
      cellClassName: 'change-header-cell',
      cell: () => (
        <div className="change-cell">
          <div className="change-icon skeleton" />
          <div className="change-line skeleton" />
        </div>
      ),
    },
    {
      header: 'Market Cap',
      cellClassName: 'market-cap-cell',
      cell: () => <div className="value-skeleton-lg skeleton" />,
    },
    {
      header: '24h Volume',
      cellClassName: 'volume-cell',
      cell: () => <div className="value-skeleton-md skeleton" />,
    },
  ];

  const dummyData = Array.from({ length: 10 }, (_, i) => ({ id: i }));

  return (
    <div id="categories-fallback">
      <h4>Top Categories</h4>
      <DataTable
        data={dummyData}
        columns={columns}
        rowKey={(item) => item.id}
        tableClassName="mt-3"
      />
    </div>
  );
};


export const CoinsFallback = () => {
  const columns = [
    {
      header: 'Rank',
      cellClassName: 'rank-cell',
      cell: () => <div className="rank-line skeleton" />,
    },
    {
      header: 'Token',
      cellClassName: 'token-cell',
      cell: () => (
        <div className="token-info">
          <div className="token-image skeleton" />
          <div className="token-line skeleton" />
        </div>
      ),
    },
    {
      header: 'Price',
      cellClassName: 'price-cell',
      cell: () => <div className="price-line skeleton" />,
    },
    {
      header: '24h Change',
      cellClassName: 'change-cell',
      cell: () => (
        <div className="change-cell">
          <div className="change-icon skeleton" />
          <div className="change-line skeleton" />
        </div>
      ),
    },
    {
      header: 'Market Cap',
      cellClassName: 'market-cap-cell',
      cell: () => <div className="value-skeleton-lg skeleton" />,
    },
  ];

  const dummyData = Array.from({ length: 10 }, (_, i) => ({ id: i }));

  return (
    <main id="coins-page-fallback">
      <div className="content">
        <h4>All Coins</h4>
        <DataTable
          tableClassName="coins-table"
          data={dummyData}
          columns={columns}
          rowKey={(item) => item.id}
        />

        <div id="coins-pagination" className="pagination-fallback">
          <div className="pagination-content">
            <div className="pagination-control prev">
              <div className="control-button skeleton" />
            </div>

            <div className="pagination-pages">
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="page-link skeleton" />
              ))}
            </div>

            <div className="pagination-control next">
              <div className="control-button skeleton" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};