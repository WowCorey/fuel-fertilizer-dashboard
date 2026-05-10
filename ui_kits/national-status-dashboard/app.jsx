const SERIES = [
  'pmc_fuel_security_level',
  'pmc_mso_days_cover',
  'pmc_mso_fuel_reserves',
  'pmc_forward_import_orders',
  'pmc_tankers_on_water',
  'pmc_retail_stockouts',
  'aps_monthly',
  'aus_retail_fuel_multistate',
];

function latestValue(env) {
  if (!env || env.status !== 'ok' || !env.values?.length) return null;
  return env.values.at(-1).v;
}

function fields(env) {
  return env?.extra?.fields || {};
}

function fmtInt(value) {
  if (value === null || value === undefined) return '-';
  return Number(value).toLocaleString('en-AU', { maximumFractionDigits: 0 });
}

function fmtChange(value) {
  if (value === null || value === undefined) return '-';
  if (value === 0) return 'no change';
  return `${value > 0 ? '+' : ''}${value}`;
}

function MetricValue({ value, unit }) {
  return (
    <span>
      <span className="metric-numeral">{value}</span>
      {unit && <span className="metric-unit">{unit}</span>}
    </span>
  );
}

function SourceTable({ title, source, children }) {
  return (
    <article className="source-card">
      <h4>{title}</h4>
      <div className="data-table-wrap">
        <table className="data-table data-table--sticky">
          {children}
        </table>
      </div>
      <p className="caption mono">{source}</p>
    </article>
  );
}

function App() {
  const [data, setData] = React.useState(null);
  const [refreshStatus, setRefreshStatus] = React.useState(null);
  React.useEffect(() => {
    window.FR.load(SERIES).then(setData);
    window.FR.loadRefreshStatus().then(setRefreshStatus);
  }, []);

  if (!data) {
    return (
      <div className="page">
        <Header active="national_status" refreshStatus={refreshStatus}/>
        <main id="main"><div className="loading-wrap">Loading source envelopes...</div></main>
      </div>
    );
  }

  const latestRetrieved = window.FR.latestVerifiedRetrieved(data);
  const updatedDisplay = window.FR.fmtVerifiedUpdated(latestRetrieved);

  const levelFields = fields(data.pmc_fuel_security_level);
  const days = fields(data.pmc_mso_days_cover);
  const reserves = fields(data.pmc_mso_fuel_reserves);
  const tankers = fields(data.pmc_tankers_on_water);
  const stockouts = fields(data.pmc_retail_stockouts);

  const stockoutRows = [
    ['ACT', stockouts.act_petrol, stockouts.act_petrol_change_7d, stockouts.act_diesel, stockouts.act_diesel_change_7d],
    ['NSW', stockouts.nsw_petrol, stockouts.nsw_petrol_change_7d, stockouts.nsw_diesel, stockouts.nsw_diesel_change_7d],
    ['VIC', stockouts.vic_petrol, stockouts.vic_petrol_change_7d, stockouts.vic_diesel, stockouts.vic_diesel_change_7d],
    ['QLD', stockouts.qld_petrol, stockouts.qld_petrol_change_7d, stockouts.qld_diesel, stockouts.qld_diesel_change_7d],
    ['SA', stockouts.sa_petrol, stockouts.sa_petrol_change_7d, stockouts.sa_diesel, stockouts.sa_diesel_change_7d],
    ['TAS', stockouts.tas_petrol, stockouts.tas_petrol_change_7d, stockouts.tas_diesel, stockouts.tas_diesel_change_7d],
    ['NT', stockouts.nt_petrol, stockouts.nt_petrol_change_7d, stockouts.nt_diesel, stockouts.nt_diesel_change_7d],
    ['WA', stockouts.wa_petrol, stockouts.wa_petrol_change_7d, stockouts.wa_diesel, stockouts.wa_diesel_change_7d],
    ['Australia', stockouts.australia_petrol, null, stockouts.australia_diesel, stockouts.australia_diesel_change_7d],
  ];

  const sourceCards = Object.entries(data).map(([id, env]) => (
    <article key={id} className="source-card">
      <div className="card-status-row">
        <h4>{env.source_name}</h4>
        <EnvTrustBadges
          env={env}
          partial={['pmc_tankers_on_water', 'pmc_retail_stockouts', 'pmc_forward_import_orders'].includes(id)}
        />
      </div>
      <p className="body-sm">
        {env.status === 'ok'
          ? `Verified envelope. ${env.values.length} data point${env.values.length === 1 ? '' : 's'}; latest ${env.last_data_point || 'unknown'}.`
          : 'Awaiting verified values from the named public source.'}
      </p>
      <p className="caption"><b>Envelope:</b> <span className="mono">{id}</span></p>
      {env.source_url && <a href={env.source_url}>{env.source_url.replace(/^https?:\/\//,'')} <Icon name="external" size={12}/></a>}
      <p className="caption mono">Retrieved: {env.retrieved_at ? window.FR.fmtRetrieved(env.retrieved_at) : '-'}</p>
    </article>
  ));

  return (
    <div className="page">
      <Header active="national_status" refreshStatus={refreshStatus} updated={latestRetrieved ? updatedDisplay : ''}/>

      <main id="main">
        <section className="intro" id="national-status">
          <div>
            <span className="eyebrow">National fuel status</span>
            <h1 style={{ marginTop: 12 }}>A single public snapshot of Australian fuel resilience.</h1>
            <p className="intro__lede">
              This page pulls the public emergency-status, stockholding, tanker-arrival and stock-out
              signals into one source-linked view. The PM&C fuel-supply page is currently hand-keyed
              because it blocks direct scripted fetches; no values are estimated.
            </p>
          </div>
          <aside className="intro__meta" aria-label="Publication details">
            <strong>Verified data retrieved</strong>
            <span className="mono">{updatedDisplay}</span>
            <div style={{ height: 12 }}/>
            <strong>Coverage</strong>
            <span>Manual public snapshot plus live APS and retail feeds</span>
          </aside>
        </section>

        <DataCoverage data={data} refreshStatus={refreshStatus}/>

        <section className="section section--why">
          <div className="why-grid">
            <div>
              <span className="eyebrow">What this is</span>
              <h2 style={{ marginTop: 8 }}>What "national status" means here</h2>
            </div>
            <div className="why-body">
              <p>
                This is not private operational intelligence. It is a public-source summary of the
                figures the Australian Government has chosen to publish: National Fuel Security Plan
                level, MSO stock coverage, expected arrivals and retail stock-outs.
              </p>
              <p>
                Tanker counts are aggregate counts from the PM&C page. They are not live AIS tracking
                and they do not identify individual vessels.
              </p>
              <div className="trust-badges" aria-label="Trust labels used on this page">
                <TrustBadge kind="observed"/>
                <TrustBadge kind="manual"/>
                <TrustBadge kind="partial"/>
                <TrustBadge kind="unavailable"/>
              </div>
            </div>
          </div>
        </section>

        <section className="section" aria-labelledby="status-cards">
          <div className="section__head">
            <div>
              <span className="eyebrow">Current public snapshot</span>
              <h2 id="status-cards">Headline indicators</h2>
              <p className="section__lede">
                PM&C/DCCEEW values are hand-keyed from the public fuel supply page. Live programmatic
                sources remain programmatic on the underlying fuel and oil pages.
              </p>
            </div>
          </div>
          <div className="metric-grid">
            <MetricCard
              eyebrow="Plan level"
              label="National Fuel Security Plan"
              plain="Public status level from the PM&C fuel supply page."
              fromEnvelope={data.pmc_fuel_security_level}
              valueFn={() => levelFields.level_label || `Level ${latestValue(data.pmc_fuel_security_level)}`}
              unitFn={() => ''}
              highlight
            />
            <MetricCard
              eyebrow="Lowest cover"
              label="MSO days cover"
              plain="Lowest current product coverage across petrol, diesel and jet fuel."
              fromEnvelope={data.pmc_mso_days_cover}
              valueFn={env => fmtInt(latestValue(env))}
              unit=" days"
            />
            <MetricCard
              eyebrow="Bulk stocks"
              label="MSO reserves"
              plain="Published petrol, diesel and jet fuel reserve volumes summed."
              fromEnvelope={data.pmc_mso_fuel_reserves}
              valueFn={env => fmtInt(latestValue(env))}
              unit=" ML"
            />
            <MetricCard
              eyebrow="Imports"
              label="Forward import orders"
              plain="Reported overseas arrivals scheduled for the next four weeks."
              fromEnvelope={data.pmc_forward_import_orders}
              valueFn={env => latestValue(env)}
              unit=" billion L"
              partial
            />
            <MetricCard
              eyebrow="On water"
              label="Ships on water"
              plain="Crude and clean-product tankers reported on the public PM&C page."
              fromEnvelope={data.pmc_tankers_on_water}
              valueFn={env => fmtInt(latestValue(env))}
              unit=" tankers"
              partial
            />
            <MetricCard
              eyebrow="Retail supply"
              label="Diesel stock-outs"
              plain="Australia-wide diesel stock-out count; petrol national total is not published."
              fromEnvelope={data.pmc_retail_stockouts}
              valueFn={env => fmtInt(latestValue(env))}
              unit=" sites"
              partial
            />
          </div>
        </section>

        <section className="section" aria-labelledby="tables-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Breakdowns</span>
              <h2 id="tables-h">What sits behind the headline cards</h2>
            </div>
          </div>
          <div className="sources-grid">
            <SourceTable title="MSO cover and reserves" source={window.FR.sourceLine(data.pmc_mso_fuel_reserves)}>
              <thead>
                <tr>
                  <th>Fuel</th>
                  <th>Days cover</th>
                  <th>Current reserves</th>
                  <th>Dec qtr avg</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Petrol</td><td>{fmtInt(days.petrol_days)}</td><td>{fmtInt(reserves.petrol_ml)} ML</td><td>{fmtInt(reserves.december_quarter_2025_petrol_average_ml)} ML</td></tr>
                <tr><td>Diesel</td><td>{fmtInt(days.diesel_days)}</td><td>{fmtInt(reserves.diesel_ml)} ML</td><td>{fmtInt(reserves.december_quarter_2025_diesel_average_ml)} ML</td></tr>
                <tr><td>Jet fuel</td><td>{fmtInt(days.jet_fuel_days)}</td><td>{fmtInt(reserves.jet_fuel_ml)} ML</td><td>{fmtInt(reserves.december_quarter_2025_jet_fuel_average_ml)} ML</td></tr>
              </tbody>
            </SourceTable>

            <SourceTable title="Ships on water" source={window.FR.sourceLine(data.pmc_tankers_on_water)}>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Tankers</th>
                  <th>Equivalent days</th>
                  <th>Prior week</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Crude oil</td><td>{fmtInt(tankers.crude_oil_tankers)}</td><td>{fmtInt(tankers.crude_oil_equivalent_days)}</td><td>{fmtInt(tankers.previous_crude_oil_tankers)} tankers</td></tr>
                <tr><td>Clean refined products</td><td>{fmtInt(tankers.clean_refined_product_tankers)}</td><td>{fmtInt(tankers.clean_refined_product_equivalent_days)}</td><td>{fmtInt(tankers.previous_clean_refined_product_tankers)} tankers</td></tr>
              </tbody>
            </SourceTable>
          </div>

          <div style={{ height: 24 }}/>
          <div className="data-table-wrap">
            <table className="data-table data-table--sticky">
              <thead>
                <tr>
                  <th>State</th>
                  <th>Petrol stock-outs</th>
                  <th>7-day change</th>
                  <th>Diesel stock-outs</th>
                  <th>7-day change</th>
                </tr>
              </thead>
              <tbody>
                {stockoutRows.map(row => (
                  <tr key={row[0]}>
                    <td>{row[0]}</td>
                    <td className={row[1] === null || row[1] === undefined ? 'unavail' : ''}>{fmtInt(row[1])}</td>
                    <td className={row[2] === null || row[2] === undefined ? 'unavail' : ''}>{fmtChange(row[2])}</td>
                    <td className={row[3] === null || row[3] === undefined ? 'unavail' : ''}>{fmtInt(row[3])}</td>
                    <td className={row[4] === null || row[4] === undefined ? 'unavail' : ''}>{fmtChange(row[4])}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="caption mono">{window.FR.sourceLine(data.pmc_retail_stockouts)}</p>
        </section>

        <section className="section section--sources" id="sources">
          <div className="section__head">
            <div>
              <span className="eyebrow">Sources & methodology</span>
              <h2>Every dataset used on this page</h2>
              <p className="section__lede">
                Public status values are manually entered from the named source page. The source registry
                records why these are not yet marked programmatic.
              </p>
            </div>
          </div>
          <div className="sources-grid">{sourceCards}</div>
          <div className="methodology">
            <h3>Rules for this page</h3>
            <dl>
              <dt>MSO</dt>
              <dd>Minimum Stockholding Obligation. The PM&C page reports product-specific days and reserve volumes; this page does not convert them into a single resilience score.</dd>
              <dt>Ships on water</dt>
              <dd>Aggregate tanker counts and equivalent days as published. No vessel tracking, port-call prediction or private logistics data is inferred.</dd>
              <dt>Retail stock-outs</dt>
              <dd>State and territory counts copied from the PM&C table. Missing national petrol total remains blank because the source table does not publish it.</dd>
            </dl>
          </div>
        </section>

        <Footer refreshStatus={refreshStatus} updated={latestRetrieved ? updatedDisplay : ''}/>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
