const SERIES = [
  'abs_fertiliser_imports',
  'abs_fertiliser_imports_urea',
  'abs_fertiliser_imports_potash',
  'abs_fertiliser_imports_phosphate',
  'abs_fertiliser_imports_compound',
  'abs_fertiliser_source_concentration',
  'abares_fertiliser_price',
  'abares_fertiliser_stock_cover',
  'abares_agricultural_exports',
  'abares_agricultural_commodities_wheat',
  'abares_agricultural_commodities_beef',
  'abs_food_imports',
  'abs_agricultural_exports',
  'bom_rainfall_deficiency',
  'bom_water_storage',
  'mdba_water_storage',
  'daff_agricultural_trade',
];

const latestPoint = env => env?.values?.length ? env.values.at(-1) : null;
const fmtNumber = value => (
  typeof value === 'number' ? new Intl.NumberFormat('en-AU').format(value) : 'Awaiting data'
);
const latestValue = env => {
  const point = latestPoint(env);
  return point ? fmtNumber(point.v) : 'Unavailable';
};
const latestPeriod = env => latestPoint(env)?.t || env?.last_data_point || 'Awaiting verified source data';

function SourceStatusCard({ env, title, plain, status = 'Awaiting source data' }) {
  return (
    <article className={`source-card ${env?.status === 'ok' ? '' : 'metric-card--unavailable'}`}>
      <div className="card-status-row">
        <span className="eyebrow">{status}</span>
        {window.EnvTrustBadges ? <EnvTrustBadges env={env}/> : null}
      </div>
      <h4>{title}</h4>
      <p className="body-sm">{plain}</p>
      <p className="caption"><b>Envelope:</b> <span className="mono">{env?.series_id || 'not loaded'}</span></p>
      <p className="caption mono">Latest period: {latestPeriod(env)}</p>
      {env?.source_url && (
        <a href={env.source_url}>{env.source_name || 'Source'} <Icon name="external" size={12}/></a>
      )}
    </article>
  );
}

function DatasetTable({ rows }) {
  return (
    <div className="data-table-wrap">
      <table className="data-table data-table--plain">
        <thead>
          <tr>
            <th>Signal</th>
            <th>Current page status</th>
            <th>Envelope</th>
            <th>What it means</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.id}>
              <td>{row.label}</td>
              <td>{window.EnvTrustBadges ? <EnvTrustBadges env={row.env} partial={row.partial}/> : row.status}</td>
              <td className="mono">{row.env?.series_id || row.id}</td>
              <td>{row.meaning}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ChecklistTable({ rows }) {
  return (
    <div className="data-table-wrap">
      <table className="data-table data-table--plain">
        <thead>
          <tr>
            <th>Missing feed</th>
            <th>Why it matters</th>
            <th>Current status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.item}>
              <td>{row.item}</td>
              <td>{row.why}</td>
              <td>
                <div className="trust-badges">
                  <TrustBadge kind={row.kind}>{row.status}</TrustBadge>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function App() {
  const [data, setData] = React.useState(null);
  React.useEffect(() => { window.FR.load(SERIES).then(setData); }, []);

  if (!data) {
    return (
      <div className="page">
        <Header active="fertilizer"/>
        <main id="main"><div className="loading-wrap">Loading source envelopes...</div></main>
      </div>
    );
  }

  const latestRetrieved = window.FR.latestVerifiedRetrieved(data);
  const updatedDisplay = window.FR.fmtVerifiedUpdated(latestRetrieved);
  const refreshHeading = latestRetrieved ? `Verified data retrieved ${updatedDisplay}` : 'Programmatic refresh not recorded yet';

  const overviewRows = [
    {
      id: 'abares_agricultural_exports',
      label: 'Major agricultural exports',
      env: data.abares_agricultural_exports,
      meaning: 'A source-safe national agricultural export row is registered, but no value is published until the exact ABARES table and period are wired.',
    },
    {
      id: 'abs_food_imports',
      label: 'Major food imports',
      env: data.abs_food_imports,
      meaning: 'Food-import exposure needs a verified ABS trade concept before a dashboard value is shown.',
    },
    {
      id: 'abs_fertiliser_imports',
      label: 'Fertiliser import value',
      env: data.abs_fertiliser_imports,
      partial: true,
      meaning: 'Loaded from ABS SITC 562 manufactured fertiliser imports. This is a farm-input signal, not total food-system import dependence.',
    },
    {
      id: 'bom_rainfall_deficiency',
      label: 'Water and rainfall pressure',
      env: data.bom_rainfall_deficiency,
      meaning: 'Rainfall deficiency is registered as a public-source candidate, but no national agricultural-pressure metric is wired yet.',
    },
    {
      id: 'abares_fertiliser_price',
      label: 'Farm input cost pressure',
      env: data.abares_fertiliser_price,
      meaning: 'ABARES fertiliser price coverage remains unavailable until a named table is hand-keyed or parsed safely.',
    },
  ];

  const growsRows = [
    {
      id: 'abares_agricultural_commodities_wheat',
      label: 'Wheat production and trade context',
      env: data.abares_agricultural_commodities_wheat,
      meaning: 'Awaiting a verified ABARES commodity table with period, unit and whether the row is production, exports or stocks.',
    },
    {
      id: 'abares_agricultural_commodities_beef',
      label: 'Beef production and trade context',
      env: data.abares_agricultural_commodities_beef,
      meaning: 'Awaiting a verified ABARES commodity table. Development-program or forecast numbers are not treated as current production.',
    },
    {
      id: 'daff_agricultural_trade',
      label: 'Broader farm-sector trade context',
      env: data.daff_agricultural_trade,
      meaning: 'Registered for DAFF/ABARES trade publications, but no aggregate is displayed until the exact concept is loaded.',
    },
  ];

  const buysRows = [
    {
      id: 'abs_food_imports',
      label: 'Food import value',
      env: data.abs_food_imports,
      meaning: 'Awaiting a verified ABS import grouping. This avoids mixing grocery, agricultural input and broader merchandise concepts.',
    },
    {
      id: 'abs_fertiliser_imports',
      label: 'Manufactured fertiliser imports',
      env: data.abs_fertiliser_imports,
      partial: true,
      meaning: 'Verified monthly ABS SITC 562 import value. Shown as a farm-input dependency signal.',
    },
    {
      id: 'abs_fertiliser_source_concentration',
      label: 'Fertiliser source-country concentration',
      env: data.abs_fertiliser_source_concentration,
      partial: true,
      meaning: 'Top-3 source-country share for manufactured fertiliser import value, not a complete nutrient-level dependency model.',
    },
  ];

  const sellsRows = [
    {
      id: 'abares_agricultural_exports',
      label: 'Agricultural export value',
      env: data.abares_agricultural_exports,
      meaning: 'Awaiting a verified ABARES source row. No export-value total is invented from narrative summaries.',
    },
    {
      id: 'abs_agricultural_exports',
      label: 'ABS agricultural goods exports',
      env: data.abs_agricultural_exports,
      meaning: 'Awaiting an ABS trade grouping with clear commodity scope and units.',
    },
    {
      id: 'daff_agricultural_trade',
      label: 'DAFF agricultural trade context',
      env: data.daff_agricultural_trade,
      meaning: 'Awaiting a hand-keyed row from a named DAFF/ABARES trade publication.',
    },
  ];

  const waterRows = [
    {
      id: 'bom_rainfall_deficiency',
      label: 'Rainfall deficiency or drought signal',
      env: data.bom_rainfall_deficiency,
      meaning: 'Awaiting a source-safe national or agricultural-region indicator. This page does not infer drought from a map by eye.',
    },
    {
      id: 'bom_water_storage',
      label: 'National water storage context',
      env: data.bom_water_storage,
      meaning: 'Awaiting a verified public water-storage row with unit, period and geography.',
    },
    {
      id: 'mdba_water_storage',
      label: 'Murray-Darling Basin storage context',
      env: data.mdba_water_storage,
      meaning: 'Awaiting a source-safe MDBA storage or allocation row. No irrigation allocation value is guessed.',
    },
  ];

  const governmentNeeds = [
    {
      item: 'National food import and export exposure by category',
      why: 'Shows which food categories are domestically secure, import-dependent or export-exposed.',
      status: 'Awaiting source-safe feed',
      kind: 'unavailable',
    },
    {
      item: 'Fertiliser stock or cover by nutrient type',
      why: 'Shows whether urea, phosphate, potash and compound fertiliser have enough cover for a disruption.',
      status: 'Unavailable',
      kind: 'unavailable',
    },
    {
      item: 'Farm diesel exposure',
      why: 'Connects fuel-security pressure to planting, harvesting, freight and irrigation pumping.',
      status: 'Awaiting method',
      kind: 'partial',
    },
    {
      item: 'Water allocation and storage by food-producing region',
      why: 'National averages are not enough for irrigated production or regional planning.',
      status: 'Awaiting verified datasets',
      kind: 'unavailable',
    },
    {
      item: 'Drought and rainfall stress by agricultural region',
      why: 'Makes seasonal production pressure visible without implying a farm-level forecast.',
      status: 'Awaiting verified datasets',
      kind: 'unavailable',
    },
    {
      item: 'Cold-chain and logistics disruption indicators',
      why: 'Food availability depends on transport, storage and refrigeration as well as production.',
      status: 'Not wired',
      kind: 'unavailable',
    },
    {
      item: 'Critical grocery availability or reserve data',
      why: 'A public food-security dashboard needs transparent availability coverage if such data exists.',
      status: 'No source loaded',
      kind: 'unavailable',
    },
    {
      item: 'Price pressure from farm gate to supermarket shelf',
      why: 'Helps separate farm-input pressure, processor margins, logistics and retail effects.',
      status: 'Partial only',
      kind: 'partial',
    },
  ];

  return (
    <div className="page">
      <Header active="fertilizer" updated={latestRetrieved ? updatedDisplay : ''}/>

      <main id="main">
        <section className="intro" id="fertilizer">
          <div>
            <span className="eyebrow">Food, farms &amp; water security - prototype</span>
            <h1 style={{ marginTop: 12 }}>Australia's food, farm inputs and water pressure, in plain English.</h1>
            <p className="intro__lede">
              Australia grows and exports huge volumes of food, but farms still depend on imported fertiliser,
              fuel, water availability, seasonal rainfall and global markets. This page tracks the public-source
              signals that show whether the food system is under pressure, and what government still does not
              publish clearly enough.
            </p>
          </div>
          <aside className="intro__meta" aria-label="Publication details">
            <strong>Boundary</strong>
            <span>This is an independent public-source prototype, not an official government dashboard, live farm forecast, live water-allocation service or commodity-trading tool.</span>
            <div style={{ height: 12 }}/>
            <strong>Refresh</strong>
            <span>{latestRetrieved ? updatedDisplay : 'No verified retrieval recorded'}</span>
          </aside>
        </section>

        <section className="freshness-notice" aria-labelledby="freshness-title">
          <div className="freshness-notice__inner">
            <div>
              <span className="eyebrow">Refresh and freshness</span>
              <h2 id="freshness-title">{refreshHeading}</h2>
              <p>
                This page may include programmatic, manual, stale, partial and unavailable public-source envelopes.
                Check the source cards below before treating any value as current. No workflow timestamp is invented here.
              </p>
            </div>
            <div className="trust-badges">
              <TrustBadge kind={latestRetrieved ? 'observed' : 'unavailable'}>{latestRetrieved ? 'Verified retrieval found' : 'No recorded refresh'}</TrustBadge>
            </div>
          </div>
        </section>

        <DataCoverage data={data}/>

        <section className="section section--why" aria-labelledby="read-page">
          <div className="why-grid">
            <div>
              <span className="eyebrow">How to read this page</span>
              <h2 id="read-page" style={{ marginTop: 8 }}>Source status comes first</h2>
            </div>
            <div className="why-body">
              <p>
                Verified means the number is backed by a loaded JSON envelope. Manual means it was hand-keyed
                from a named public source. Derived means the page calculated or selected a value from verified
                envelopes. Stale means the latest source period is outside its cadence window.
              </p>
              <p>
                Unavailable means a source has not been safely wired or the public source does not publish the
                exact field needed. This page leaves those gaps visible instead of filling them with estimates.
              </p>
            </div>
          </div>
        </section>

        <section className="section" aria-labelledby="overview-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Food system overview</span>
              <h2 id="overview-h">What is visible now, and what is still missing</h2>
              <p className="section__lede">
                The first pass keeps real fertiliser import coverage and registers the broader food, farm and water signals as explicit source gaps.
              </p>
            </div>
          </div>
          <div className="metric-grid metric-grid--4">
            <MetricCard
              eyebrow="Farm inputs"
              label="Monthly fertiliser imports"
              plain="ABS SITC 562 manufactured fertiliser import value in the latest loaded month."
              fromEnvelope={data.abs_fertiliser_imports}
              valueFn={env => fmtNumber(latestPoint(env)?.v)}
              unit=" AUD thousands"
              highlight
              partial
            />
            <MetricCard
              eyebrow="Supplier exposure"
              label="Top-3 fertiliser source countries"
              plain="Share of manufactured fertiliser import value from the three largest non-total source countries."
              fromEnvelope={data.abs_fertiliser_source_concentration}
              valueFn={env => fmtNumber(latestPoint(env)?.v)}
              unit="%"
              partial
            />
            <MetricCard
              eyebrow="Food imports"
              label="Food import value"
              plain="Awaiting a verified ABS food-import grouping."
              fromEnvelope={data.abs_food_imports}
            />
            <MetricCard
              eyebrow="Water pressure"
              label="Rainfall deficiency"
              plain="Awaiting a verified BOM drought or rainfall-deficiency indicator."
              fromEnvelope={data.bom_rainfall_deficiency}
            />
          </div>
          <div style={{ height: 24 }}/>
          <DatasetTable rows={overviewRows}/>
        </section>

        <section className="section" aria-labelledby="grows-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Agricultural production</span>
              <h2 id="grows-h">What Australia grows</h2>
              <p className="section__lede">
                Wheat, beef and broader commodity rows are ready as source gates. They remain unavailable until the exact public table, period and unit are loaded.
              </p>
            </div>
          </div>
          <DatasetTable rows={growsRows}/>
        </section>

        <section className="section" aria-labelledby="buys-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Import exposure</span>
              <h2 id="buys-h">What Australia buys</h2>
              <p className="section__lede">
                Fertiliser imports are loaded. Food imports remain unavailable until a clean ABS category is wired without mixing concepts.
              </p>
            </div>
          </div>
          <DatasetTable rows={buysRows}/>
        </section>

        <section className="section" aria-labelledby="sells-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Export exposure</span>
              <h2 id="sells-h">What Australia sells</h2>
              <p className="section__lede">
                Export rows need exact source boundaries. The page does not convert narrative trade summaries into dashboard values.
              </p>
            </div>
          </div>
          <DatasetTable rows={sellsRows}/>
        </section>

        <section className="section" aria-labelledby="inputs-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Original verified coverage</span>
              <h2 id="inputs-h">Fertiliser and farm inputs</h2>
              <p className="section__lede">
                The verified coverage remains monthly manufactured fertiliser import value and source-country concentration. Nutrient-level, price-index and stock-cover fields stay unavailable until source-safe.
              </p>
            </div>
          </div>
          <div className="metric-grid metric-grid--4">
            <MetricCard
              eyebrow="Value"
              label="Monthly fertiliser imports"
              plain="Total value of manufactured fertiliser (SITC 562) cleared into Australia in the latest month."
              fromEnvelope={data.abs_fertiliser_imports}
              valueFn={env => fmtNumber(latestPoint(env)?.v)}
              unit=" AUD thousands"
              highlight
              partial
            />
            <MetricCard
              eyebrow="Concentration"
              label="Top-3 source countries"
              plain="Share of monthly SITC 562 manufactured fertiliser import value from the three largest source countries."
              fromEnvelope={data.abs_fertiliser_source_concentration}
              valueFn={env => fmtNumber(latestPoint(env)?.v)}
              unit="%"
              partial
            />
            <MetricCard
              eyebrow="Price"
              label="Fertiliser price index"
              plain="ABARES price coverage is not wired to a source-safe table yet."
              fromEnvelope={data.abares_fertiliser_price}
            />
            <MetricCard
              eyebrow="Stock cover"
              label="Fertiliser stock cover"
              plain="No public Australian fertiliser cover row is loaded."
              fromEnvelope={data.abares_fertiliser_stock_cover}
            />
          </div>
          <div className="pending-list" aria-label="Pending fertiliser source coverage">
            <article className="source-card">
              <h4>Pending nutrient-level coverage</h4>
              <p className="body-sm">
                Urea, potash, phosphate and compound fertiliser subseries remain unavailable because the checked ABS API paths did not expose verified monthly nutrient-level value rows.
              </p>
              <div className="trust-badges"><TrustBadge kind="unavailable"/></div>
            </article>
            <article className="source-card">
              <h4>Fertiliser stock-cover boundary</h4>
              <p className="body-sm">
                No public Australian fertiliser cover row is loaded. Stock cover stays unavailable until a named source publishes stock and usage inputs or a direct cover figure.
              </p>
              <div className="trust-badges"><TrustBadge kind="unavailable"/></div>
            </article>
          </div>
        </section>

        <section className="section" aria-labelledby="charts-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Verified charts</span>
              <h2 id="charts-h">Fertiliser import value and supplier concentration over time</h2>
              <p className="section__lede">
                Charts only render where verified monthly source envelopes are loaded.
              </p>
            </div>
          </div>
          <div className="charts-grid charts-grid--full">
            <ChartCard
              eyebrow="Value"
              title="Monthly fertiliser imports"
              unit="AUD thousands"
              fromEnvelope={data.abs_fertiliser_imports}
              ranges={['1Y','3Y']}
              defaultRange="3Y"
              accent="#1F3A8A"
              takeaway="Monthly value of manufactured fertiliser (SITC 562) cleared into Australia, from ABS International Merchandise Trade."
              yAxisLabel="Import value (AUD thousands per month)"
            />
          </div>
          <div style={{ height: 24 }}/>
          <div className="charts-grid charts-grid--full">
            <ChartCard
              eyebrow="Supplier mix"
              title="Top-3 source countries' combined share, over time"
              unit="%"
              fromEnvelope={data.abs_fertiliser_source_concentration}
              ranges={['1Y','3Y']}
              defaultRange="3Y"
              accent="#6B7280"
              takeaway="Share of monthly SITC 562 manufactured fertiliser import value from the three largest non-total source countries."
              yAxisLabel="Top-3 share of SITC 562 import value (%)"
            />
          </div>
        </section>

        <section className="section" aria-labelledby="water-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Awaiting verified public water datasets</span>
              <h2 id="water-h">Water and seasonal pressure</h2>
              <p className="section__lede">
                The page does not publish a drought, allocation or water-storage number until the source, geography, unit and period are wired.
              </p>
            </div>
          </div>
          <DatasetTable rows={waterRows}/>
        </section>

        <section className="section" aria-labelledby="publish-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Public data gaps</span>
              <h2 id="publish-h">What government still needs to publish</h2>
              <p className="section__lede">
                A useful national food-security dashboard needs more than commodity headlines. These feeds stay visible as gaps until public data can support them.
              </p>
            </div>
          </div>
          <ChecklistTable rows={governmentNeeds}/>
        </section>

        <section className="section section--sources" id="sources">
          <div className="section__head">
            <div>
              <span className="eyebrow">Sources &amp; methodology</span>
              <h2>Every dataset used on this page</h2>
              <p className="section__lede">
                All sources are public. Cards marked unavailable are awaiting verified values. Production, imports, exports, water pressure and price indicators are not mixed into one number.
              </p>
            </div>
          </div>
          <div className="sources-grid">
            {Object.entries(data).map(([id, env]) => (
              <article key={id} className="source-card">
                <h4>{env.source_name}</h4>
                <p className="body-sm">
                  {env.status === 'ok'
                    ? `Verified. ${env.values.length} data points; latest ${env.last_data_point || 'unknown'}.`
                    : 'Awaiting verified values from the named public source or source gate.'}
                </p>
                <div className="trust-badges">
                  {window.EnvTrustBadges ? <EnvTrustBadges env={env}/> : null}
                </div>
                <p className="caption"><b>Envelope:</b> <span className="mono">{id}</span></p>
                {env.source_url && (
                  <a href={env.source_url}>{env.source_url.replace(/^https?:\/\//,'')} <Icon name="external" size={12}/></a>
                )}
                <p className="caption mono">Retrieved: {env.retrieved_at ? window.FR.fmtRetrieved(env.retrieved_at) : '-'}</p>
              </article>
            ))}
          </div>
          <div className="methodology">
            <h3>How we separate the numbers</h3>
            <dl>
              <dt>Fertiliser imports</dt>
              <dd>Total import value (AUD thousands) of manufactured fertilisers, fetched from the ABS Data API MERCH_IMP dataflow using SITC 562. This is not HS 31 and is not a nutrient-level stock-cover measure.</dd>
              <dt>Supplier concentration</dt>
              <dd>Top-3 non-total source-country share of monthly SITC 562 import value divided by total SITC 562 import value for the same month. It is a concentration signal, not an import-dependency score.</dd>
              <dt>Agricultural production</dt>
              <dd>Crop and livestock rows remain unavailable until a named ABARES or ABS table supports the exact production period, unit and commodity boundary.</dd>
              <dt>Agricultural exports and food imports</dt>
              <dd>Trade rows must distinguish imports from exports, food from farm inputs, and merchandise value from production volume. No broad food-trade total is published until the category boundary is source-safe.</dd>
              <dt>Water, rainfall and drought</dt>
              <dd>Rainfall deficiency, water storage and irrigation allocation indicators are separate concepts. This page does not infer drought or farm-level water availability from maps or commentary.</dd>
              <dt>No-estimate rule</dt>
              <dd>If a value cannot be verified from a named public source, this dashboard labels it unavailable, partial or stale rather than filling the gap with estimates.</dd>
            </dl>
          </div>
        </section>

        <Footer updated={latestRetrieved ? updatedDisplay : ''}/>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
