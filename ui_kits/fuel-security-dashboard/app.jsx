const SERIES = [
  'pmc_fuel_security_level',
  'pmc_mso_days_cover',
  'pmc_mso_fuel_reserves',
  'fuel_security_petrol_days_remaining',
  'fuel_security_diesel_days_remaining',
  'fuel_security_jet_days_remaining',
  'pmc_forward_import_orders',
  'pmc_tankers_on_water',
  'pmc_retail_stockouts',
  'aps_monthly',
  'aps_stocks_petrol',
  'aps_stocks_diesel',
  'aps_sales_petrol',
  'aps_sales_diesel',
  'aps_sales_jet',
  'aps_imports_petrol',
  'aps_imports_diesel',
  'abs_petroleum_imports',
  'aus_retail_fuel_multistate',
  'fuel_security_status_model',
  'fuel_security_live_station_outage_feed',
  'fuel_security_live_vessel_tracking',
  'fuel_security_terminal_capacity',
];

const PRODUCTS = [
  {
    name: 'Petrol',
    daysId: 'fuel_security_petrol_days_remaining',
    reserveField: 'petrol_ml',
    stockId: 'aps_stocks_petrol',
    salesId: 'aps_sales_petrol',
    importId: 'aps_imports_petrol',
  },
  {
    name: 'Diesel',
    daysId: 'fuel_security_diesel_days_remaining',
    reserveField: 'diesel_ml',
    stockId: 'aps_stocks_diesel',
    salesId: 'aps_sales_diesel',
    importId: 'aps_imports_diesel',
  },
  {
    name: 'Jet fuel',
    daysId: 'fuel_security_jet_days_remaining',
    reserveField: 'jet_fuel_ml',
    stockId: null,
    salesId: 'aps_sales_jet',
    importId: null,
  },
];

function latest(env) {
  if (!env || env.status !== 'ok' || !env.values?.length) return null;
  return env.values.at(-1).v;
}

function fields(env) {
  return env?.extra?.fields || {};
}

function fmtNumber(value, digits = 0) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '-';
  return Number(value).toLocaleString('en-AU', {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });
}

function fmtMetric(value, unit, digits = 0) {
  if (value === null || value === undefined) return '-';
  return `${fmtNumber(value, digits)}${unit ? ` ${unit}` : ''}`;
}

function SecurityCard({ eyebrow, title, value, unit, env, children, partial = false, unavailable = false }) {
  const isUnavailable = unavailable || !env || env.status !== 'ok' || value === null || value === undefined;
  return (
    <article className={`metric-card ${isUnavailable ? 'metric-card--unavailable' : ''}`}>
      <div className="card-status-row">
        <span className="eyebrow">{eyebrow}</span>
        <EnvTrustBadges env={env} partial={partial}/>
      </div>
      <h3 className="metric-card__label">{title}</h3>
      {isUnavailable ? (
        <div className="metric-card__unavail">
          <Icon name="alert" size={18}/>
          <span>{children || 'No verified source is currently loaded for this metric.'}</span>
        </div>
      ) : (
        <>
          <div className="metric-card__row">
            <span className="metric-numeral">{value}</span>
            {unit && <span className="metric-unit">{unit}</span>}
          </div>
          {children && <p className="metric-card__plain">{children}</p>}
        </>
      )}
      <footer className="metric-card__foot">
        {env && <span className="metric-card__source">{window.FR.sourceLine(env)}</span>}
      </footer>
    </article>
  );
}

function SourceCard({ id, env, partial = false }) {
  const f = window.FR.freshness(env);
  return (
    <article className="source-card">
      <div className="card-status-row">
        <h4>{env.source_name}</h4>
        <EnvTrustBadges env={env} partial={partial}/>
      </div>
      <p className="body-sm">
        {env.status === 'ok'
          ? `Loaded envelope. Latest data point ${env.last_data_point || 'unknown'}; status ${f.label.toLowerCase()}.`
          : env.notes}
      </p>
      <p className="caption"><b>Envelope:</b> <span className="mono">{id}</span></p>
      {env.source_url && <a href={env.source_url}>{env.source_url.replace(/^https?:\/\//,'')} <Icon name="external" size={12}/></a>}
    </article>
  );
}

function App() {
  const [data, setData] = React.useState(null);
  React.useEffect(() => { window.FR.load(SERIES).then(setData); }, []);

  if (!data) {
    return (
      <div className="page">
        <Header active="fuel_security"/>
        <main id="main"><div className="loading-wrap">Loading source envelopes...</div></main>
      </div>
    );
  }

  const latestRetrieved = window.FR.latestVerifiedRetrieved(data);
  const updatedDisplay = window.FR.fmtVerifiedUpdated(latestRetrieved);
  const level = data.pmc_fuel_security_level;
  const levelFields = fields(level);
  const reserves = fields(data.pmc_mso_fuel_reserves);
  const tankers = fields(data.pmc_tankers_on_water);
  const stockouts = fields(data.pmc_retail_stockouts);
  const officialLevel = levelFields.level_label || (latest(level) ? `Level ${latest(level)}` : 'Unavailable');
  const coreOk = [
    'pmc_fuel_security_level',
    'pmc_mso_days_cover',
    'pmc_mso_fuel_reserves',
    'pmc_forward_import_orders',
    'pmc_tankers_on_water',
    'pmc_retail_stockouts',
  ].every(id => data[id]?.status === 'ok');
  const modelUnavailableReason = coreOk
    ? 'Official snapshots are loaded, but live national outage, vessel-level shipment and terminal-capacity feeds are not. The dashboard therefore does not publish its own Stable/Tight/Disrupted/Critical status.'
    : 'Core public-source coverage is incomplete, so the dashboard status model is unavailable.';

  const stockoutRows = [
    ['ACT', stockouts.act_petrol, stockouts.act_diesel],
    ['NSW', stockouts.nsw_petrol, stockouts.nsw_diesel],
    ['VIC', stockouts.vic_petrol, stockouts.vic_diesel],
    ['QLD', stockouts.qld_petrol, stockouts.qld_diesel],
    ['SA', stockouts.sa_petrol, stockouts.sa_diesel],
    ['TAS', stockouts.tas_petrol, stockouts.tas_diesel],
    ['NT', stockouts.nt_petrol, stockouts.nt_diesel],
    ['WA', stockouts.wa_petrol, stockouts.wa_diesel],
    ['Australia', stockouts.australia_petrol, stockouts.australia_diesel],
  ];

  return (
    <div className="page">
      <Header active="fuel_security" updated={latestRetrieved ? updatedDisplay : ''}/>

      <main id="main">
        <section className="intro" id="fuel-security">
          <div>
            <span className="eyebrow">Australia fuel security dashboard</span>
            <h1 style={{ marginTop: 12 }}>What Australia can see from public fuel-security data.</h1>
            <p className="intro__lede">
              This page separates observed public signals from derived, partial and unavailable
              operational layers. It shows PM&C/DCCEEW status, product days, stock context,
              import/shipping context and the blind spots that are not yet public-source safe.
            </p>
          </div>
          <aside className="intro__meta" aria-label="Fuel security status">
            <strong>Official public level</strong>
            <span className="mono">{officialLevel}</span>
            <div style={{ height: 12 }}/>
            <strong>Dashboard status model</strong>
            <span className="mono">Status unavailable</span>
          </aside>
        </section>

        <DataCoverage data={data}/>

        <section className="section section--why">
          <div className="why-grid">
            <div>
              <span className="eyebrow">Fail-closed status engine</span>
              <h2 style={{ marginTop: 8 }}>No national status score yet</h2>
            </div>
            <div className="why-body">
              <p>{modelUnavailableReason}</p>
              <p>
                The page keeps the observed PM&C level visible and labels the missing operational
                layers instead of collapsing weak evidence into a score.
              </p>
              <div className="trust-badges" aria-label="Trust label examples">
                <TrustBadge kind="observed"/>
                <TrustBadge kind="derived"/>
                <TrustBadge kind="manual"/>
                <TrustBadge kind="partial"/>
                <TrustBadge kind="unavailable"/>
              </div>
            </div>
          </div>
        </section>

        <section className="section" aria-labelledby="national-summary">
          <div className="section__head">
            <div>
              <span className="eyebrow">1. National status</span>
              <h2 id="national-summary">Public national fuel signals</h2>
              <p className="section__lede">
                These are observed public snapshot values. Manual means the page value was copied
                from a named public page because no stable machine-readable endpoint is loaded.
              </p>
            </div>
          </div>
          <div className="metric-grid">
            <SecurityCard eyebrow="Observed" title="PM&C National Fuel Security Plan" value={officialLevel} env={level}>
              Official public level. This dashboard does not reinterpret the level into its own risk score.
            </SecurityCard>
            <SecurityCard eyebrow="Observed" title="MSO fuel reserves" value={fmtNumber(latest(data.pmc_mso_fuel_reserves))} unit="ML" env={data.pmc_mso_fuel_reserves}>
              Petrol, diesel and jet fuel reserves summed from the PM&C/DCCEEW table.
            </SecurityCard>
            <SecurityCard eyebrow="Unavailable" title="Dashboard status model" env={data.fuel_security_status_model} unavailable>
              {data.fuel_security_status_model.notes}
            </SecurityCard>
          </div>
        </section>

        <section className="section" aria-labelledby="days-remaining">
          <div className="section__head">
            <div>
              <span className="eyebrow">2. Days remaining</span>
              <h2 id="days-remaining">Product days from the public MSO table</h2>
              <p className="section__lede">
                These cards are derived by reshaping the product-specific PM&C/DCCEEW MSO days
                table into first-class envelopes. They are not independently calculated from
                private terminal stocks or hidden demand assumptions.
              </p>
            </div>
          </div>
          <div className="metric-grid">
            <SecurityCard eyebrow="Derived" title="Petrol days remaining" value={fmtNumber(latest(data.fuel_security_petrol_days_remaining))} unit="days" env={data.fuel_security_petrol_days_remaining}>
              Derived from the PM&C petrol MSO days field.
            </SecurityCard>
            <SecurityCard eyebrow="Derived" title="Diesel days remaining" value={fmtNumber(latest(data.fuel_security_diesel_days_remaining))} unit="days" env={data.fuel_security_diesel_days_remaining}>
              Derived from the PM&C diesel MSO days field.
            </SecurityCard>
            <SecurityCard eyebrow="Derived" title="Jet fuel days remaining" value={fmtNumber(latest(data.fuel_security_jet_days_remaining))} unit="days" env={data.fuel_security_jet_days_remaining}>
              Derived from the PM&C jet fuel MSO days field.
            </SecurityCard>
          </div>
        </section>

        <section className="section" aria-labelledby="product-position">
          <div className="section__head">
            <div>
              <span className="eyebrow">3. Product supply position</span>
              <h2 id="product-position">Stocks and demand context</h2>
              <p className="section__lede">
                PM&C gives product MSO reserve volumes. APS gives monthly stock, sales and import
                context where the workbook exposes those product series.
              </p>
            </div>
          </div>
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Days remaining</th>
                  <th>PM&C MSO reserves</th>
                  <th>APS stocks</th>
                  <th>APS sales/demand context</th>
                  <th>APS imports</th>
                </tr>
              </thead>
              <tbody>
                {PRODUCTS.map(product => (
                  <tr key={product.name}>
                    <td>{product.name}</td>
                    <td>{fmtMetric(latest(data[product.daysId]), 'days')}</td>
                    <td>{fmtMetric(reserves[product.reserveField], 'ML')}</td>
                    <td className={product.stockId ? '' : 'unavail'}>{product.stockId ? fmtMetric(latest(data[product.stockId]), 'ML', 1) : '-'}</td>
                    <td>{fmtMetric(latest(data[product.salesId]), 'ML', 1)}</td>
                    <td className={product.importId ? '' : 'unavail'}>{product.importId ? fmtMetric(latest(data[product.importId]), 'ML', 1) : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="caption mono">
            Derived days: PM&C MSO table. APS context: monthly public APS workbook. Blank cells mean no loaded defensible product series.
          </p>
        </section>

        <section className="section" aria-labelledby="import-risk">
          <div className="section__head">
            <div>
              <span className="eyebrow">4. Inbound fuel visibility</span>
              <h2 id="import-risk">Aggregate shipping context, no fake vessel layer</h2>
              <p className="section__lede">
                This section borrows the readable shape of a ship-tracking dashboard, but only
                uses source-safe aggregate public data. It does not plot live AIS, vessel ETAs
                or shipment-level Kpler records.
              </p>
            </div>
          </div>
          <ShippingVisibility
            tankersEnv={data.pmc_tankers_on_water}
            forwardOrdersEnv={data.pmc_forward_import_orders}
            importsEnv={data.abs_petroleum_imports}
            liveVesselEnv={data.fuel_security_live_vessel_tracking}
          />
        </section>

        <section className="section" aria-labelledby="outages">
          <div className="section__head">
            <div>
              <span className="eyebrow">5. Outage and disruption visibility</span>
              <h2 id="outages">Retail stock-outs are a dated partial snapshot</h2>
              <p className="section__lede">
                PM&C publishes state/territory retail stock-out counts. This is not a live national
                dry-station feed and it does not publish an Australia-wide petrol total in the current table.
              </p>
            </div>
          </div>
          <div className="metric-grid">
            <SecurityCard eyebrow="Partial coverage" title="Australia diesel stock-outs" value={fmtNumber(latest(data.pmc_retail_stockouts))} unit="sites" env={data.pmc_retail_stockouts} partial>
              Australia-wide diesel stock-out count from the PM&C table.
            </SecurityCard>
            <SecurityCard eyebrow="Unavailable" title="Live national outage feed" env={data.fuel_security_live_station_outage_feed} unavailable>
              {data.fuel_security_live_station_outage_feed.notes}
            </SecurityCard>
          </div>
          <div style={{ height: 24 }}/>
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>State</th>
                  <th>Petrol stock-outs</th>
                  <th>Diesel stock-outs</th>
                </tr>
              </thead>
              <tbody>
                {stockoutRows.map(row => (
                  <tr key={row[0]}>
                    <td>{row[0]}</td>
                    <td className={row[1] === null || row[1] === undefined ? 'unavail' : ''}>{fmtNumber(row[1])}</td>
                    <td className={row[2] === null || row[2] === undefined ? 'unavail' : ''}>{fmtNumber(row[2])}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="section" aria-labelledby="storage">
          <div className="section__head">
            <div>
              <span className="eyebrow">6. Storage and terminal visibility</span>
              <h2 id="storage">National stock context, not terminal telemetry</h2>
              <p className="section__lede">
                The dashboard can show national/product stock context from PM&C and APS. It does
                not show terminal-by-terminal capacity because no defensible public dataset is loaded.
              </p>
            </div>
          </div>
          <div className="metric-grid">
            <SecurityCard eyebrow="Observed" title="APS net-import cover" value={fmtNumber(latest(data.aps_monthly))} unit="days" env={data.aps_monthly}>
              Monthly APS IEA days of net import coverage. Different concept from PM&C MSO product days.
            </SecurityCard>
            <SecurityCard eyebrow="Observed" title="Petrol APS stocks" value={fmtNumber(latest(data.aps_stocks_petrol), 1)} unit="ML" env={data.aps_stocks_petrol}>
              Monthly APS automotive gasoline stock volume.
            </SecurityCard>
            <SecurityCard eyebrow="Observed" title="Diesel APS stocks" value={fmtNumber(latest(data.aps_stocks_diesel), 1)} unit="ML" env={data.aps_stocks_diesel}>
              Monthly APS diesel stock volume.
            </SecurityCard>
            <SecurityCard eyebrow="Unavailable" title="Terminal-level capacity" env={data.fuel_security_terminal_capacity} unavailable>
              {data.fuel_security_terminal_capacity.notes}
            </SecurityCard>
          </div>
        </section>

        <section className="section section--sources" id="sources">
          <div className="section__head">
            <div>
              <span className="eyebrow">7. Source coverage and caveats</span>
              <h2>Every envelope used on this page</h2>
              <p className="section__lede">
                Observed means copied or fetched from a named public source. Derived means reshaped
                from a verified envelope. Partial coverage and unavailable labels are intentionally visible.
              </p>
            </div>
          </div>
          <div className="sources-grid">
            {Object.entries(data).map(([id, env]) => (
              <SourceCard
                key={id}
                id={id}
                env={env}
                partial={['pmc_tankers_on_water', 'pmc_retail_stockouts', 'pmc_forward_import_orders'].includes(id)}
              />
            ))}
          </div>
          <div className="methodology">
            <h3>What this dashboard does not currently know</h3>
            <dl>
              <dt>Live station outages</dt>
              <dd>No public national live dry-site feed is loaded. PM&C stock-outs are a dated public snapshot.</dd>
              <dt>Shipment-level visibility</dt>
              <dd>No source-safe live vessel or ETA feed is loaded. PM&C tanker numbers are aggregate counts.</dd>
              <dt>Terminal capacity</dt>
              <dd>No terminal-by-terminal public capacity dataset is loaded. The page uses national/product stock context only.</dd>
              <dt>Status score</dt>
              <dd>No Stable/Tight/Disrupted/Critical label is published until the status method has enough observed coverage.</dd>
            </dl>
          </div>
        </section>

        <Footer updated={latestRetrieved ? updatedDisplay : ''}/>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
