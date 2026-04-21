const SERIES = [
  'resource_company_tax_rate',
  'resource_prrt_policy',
  'resource_wa_petroleum_royalties',
  'resource_lng_export_value_req',
  'resource_oil_export_value_req',
  'resource_lng_export_destinations_req',
  'resource_gas_origin_aecr',
  'resource_domestic_gas_prices_accc',
  'resource_state_production_aes',
  'resource_norway_petroleum_tax_model',
  'resource_norway_state_revenue_model',
  'resource_value_leakage_model',
];

function latestValue(env) {
  if (!env || env.status !== 'ok' || !env.values?.length) return null;
  return env.values.at(-1).v;
}

function fields(env) {
  return env?.extra?.fields || {};
}

function audBillions(valueAm) {
  if (valueAm == null) return '-';
  return 'A$' + (Number(valueAm) / 1000).toLocaleString('en-AU', { maximumFractionDigits: 1 }) + 'b';
}

function oneDecimal(value) {
  if (value == null) return '-';
  return Number(value).toLocaleString('en-AU', { maximumFractionDigits: 1 });
}

function ScenarioCard({ lngEnv, oilEnv }) {
  const lng = latestValue(lngEnv);
  const oil = latestValue(oilEnv);
  const canCompute = lng != null && oil != null;
  const value = canCompute ? (lng + oil) * 0.25 : null;
  return (
    <article className={`metric-card ${canCompute ? '' : 'metric-card--unavailable'}`}>
      <div className="card-status-row">
        <span className="eyebrow">Scenario only</span>
        <span className="status-pill status-pill--derived">Method</span>
      </div>
      <h3 className="metric-card__label">25% gross export-value scenario</h3>
      <p className="metric-card__plain">
        Hypothetical 25% levy on the currently loaded LNG plus oil export earnings. This is not current law and not a PRRT estimate.
      </p>
      {canCompute ? (
        <div className="metric-card__row">
          <span className="metric-numeral">{oneDecimal(value / 1000)}</span>
          <span className="metric-unit">A$b</span>
        </div>
      ) : (
        <div className="metric-card__unavail">
          <Icon name="alert" size={18}/>
          <span>Scenario hidden until both LNG and oil export-value envelopes are verified.</span>
        </div>
      )}
      <footer className="metric-card__foot">
        <span className="metric-card__source">Method: (LNG export value + oil export value) x 25%.</span>
      </footer>
    </article>
  );
}

function SourceSummary({ id, env }) {
  const meta = env?._meta || {};
  const status = env?.status === 'ok'
    ? `Verified envelope. ${env.values?.length || 0} data point${env.values?.length === 1 ? '' : 's'}; latest ${env.last_data_point || 'unknown'}.`
    : 'Awaiting a verified method or value before publication.';
  return (
    <article className="source-card">
      <h4>{env.source_name}</h4>
      <p className="body-sm">{status}</p>
      <p className="caption"><b>Envelope:</b> <span className="mono">{id}</span></p>
      {meta.rights && <p className="caption"><b>Rights:</b> {meta.rights}</p>}
      {meta.citation && <p className="caption"><b>Citation:</b> {meta.citation}</p>}
      {env.source_url && <a href={env.source_url}>{env.source_url.replace(/^https?:\/\//,'')} <Icon name="external" size={12}/></a>}
      <p className="caption mono">Retrieved: {env.retrieved_at ? window.FR.fmtRetrieved(env.retrieved_at) : '-'}</p>
    </article>
  );
}

function PhaseTable() {
  const rows = [
    ['Phase 1', 'Tax, royalty and PRRT explainer', 'Added here with official source envelopes.'],
    ['Phase 2', 'Production and export-flow maps/tables', 'Started with national gas origin and LNG destination envelopes; full state/basin flow map still pending.'],
    ['Phase 3', 'Domestic vs export price comparison', 'Source registered; no comparison published until the exact ACCC price measure and export benchmark are selected.'],
    ['Phase 4', '25% export-tax scenario calculator', 'Method card added as a transparent scenario, using loaded export-value envelopes only.'],
    ['Phase 5', 'Norway comparison and value retained/leaked', 'Norway comparison sources added; leakage estimate remains unavailable until Australian receipt inputs and method exist.'],
  ];
  return (
    <div className="data-table-wrap">
      <table className="data-table">
        <thead>
          <tr><th>Phase</th><th>Scope</th><th>Current status</th></tr>
        </thead>
        <tbody>
          {rows.map(row => <tr key={row[0]}><td><b>{row[0]}</b></td><td>{row[1]}</td><td>{row[2]}</td></tr>)}
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
        <Header active="resource_value"/>
        <main id="main"><div className="loading-wrap">Loading source envelopes...</div></main>
      </div>
    );
  }

  const latestRetrieved = window.FR.latestVerifiedRetrieved(data);
  const updatedDisplay = window.FR.fmtVerifiedUpdated(latestRetrieved);
  const royaltyFields = fields(data.resource_wa_petroleum_royalties);
  const gasFields = fields(data.resource_gas_origin_aecr);
  const norwayRevenue = fields(data.resource_norway_state_revenue_model);
  const destinations = fields(data.resource_lng_export_destinations_req).destinations || [];

  return (
    <div className="page">
      <Header active="resource_value" updated={latestRetrieved ? updatedDisplay : ''}/>

      <main id="main">
        <section className="intro" id="resource-value">
          <div>
            <span className="eyebrow">Resource value</span>
            <h1 style={{ marginTop: 12 }}>Who captures Australian oil and gas value?</h1>
            <p className="intro__lede">
              This page separates the resource-value question from the company-tax dashboard. It shows
              official policy rates, export-value context and comparison sources without turning them into
              a leakage claim until the receipts and methodology are verified.
            </p>
          </div>
          <aside className="intro__meta" aria-label="Publication details">
            <strong>Verified data retrieved</strong>
            <span className="mono">{updatedDisplay}</span>
            <div style={{ height: 12 }}/>
            <strong>Rule</strong>
            <span>No leakage estimate is published yet.</span>
          </aside>
        </section>

        <DataCoverage data={data}/>

        <section className="section section--why">
          <div className="why-grid">
            <div>
              <span className="eyebrow">Start here</span>
              <h2 style={{ marginTop: 8 }}>What this page does and does not claim</h2>
            </div>
            <div className="why-body">
              <p>
                <b>Company tax</b>, <b>PRRT</b> and <b>royalties</b> are different capture channels.
                A policy rate is not the same thing as cash received by government.
              </p>
              <p>
                The 25% export-tax card is a transparent scenario using the currently loaded export
                value envelopes. It is not current law, not a PRRT model and not a recommendation.
              </p>
              <p>
                "Value leaked" stays blank until the repo has verified Australian royalty receipts,
                PRRT receipts, export values, company profit data and a documented denominator.
              </p>
            </div>
          </div>
        </section>

        <section className="section" aria-labelledby="headline-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Headline figures</span>
              <h2 id="headline-h">Policy rates and export-value context</h2>
              <p className="section__lede">
                Values are copied from official sources or calculated transparently from loaded envelopes.
              </p>
            </div>
          </div>
          <div className="metric-grid">
            <MetricCard
              eyebrow="Company tax"
              label="Full company tax rate"
              plain="Policy rate only; actual paid tax is handled on the Who pays what page."
              fromEnvelope={data.resource_company_tax_rate}
              unit="%"
            />
            <MetricCard
              eyebrow="PRRT"
              label="Petroleum Resource Rent Tax rate"
              plain="Applies to taxable petroleum-project profit, not gross export value."
              fromEnvelope={data.resource_prrt_policy}
              unit="%"
            />
            <MetricCard
              eyebrow="Royalty"
              label="WA Barrow Island RRR"
              plain="Resource Rent Royalty on net cash flow; not total Australian royalty receipts."
              fromEnvelope={data.resource_wa_petroleum_royalties}
              unit="%"
            />
            <MetricCard
              eyebrow="Exports"
              label="LNG export earnings"
              plain="REQ December 2025 value for 2024-25."
              fromEnvelope={data.resource_lng_export_value_req}
              valueFn={env => audBillions(latestValue(env))}
              unitFn={() => ''}
            />
            <MetricCard
              eyebrow="Exports"
              label="Oil export earnings"
              plain="REQ December 2025 value for 2024-25."
              fromEnvelope={data.resource_oil_export_value_req}
              valueFn={env => audBillions(latestValue(env))}
              unitFn={() => ''}
            />
            <ScenarioCard lngEnv={data.resource_lng_export_value_req} oilEnv={data.resource_oil_export_value_req}/>
            <MetricCard
              eyebrow="Norway comparison"
              label="Marginal petroleum tax rate"
              plain="Comparison source only; Norway also uses direct state ownership and dividends."
              fromEnvelope={data.resource_norway_petroleum_tax_model}
              unit="%"
            />
            <MetricCard
              eyebrow="Not published"
              label="Value retained vs leaked"
              fromEnvelope={data.resource_value_leakage_model}
            />
          </div>
        </section>

        <section className="section" aria-labelledby="capture-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Capture channels</span>
              <h2 id="capture-h">What exists now</h2>
              <p className="section__lede">
                This table describes the channel. It does not claim how much cash each channel captured.
              </p>
            </div>
          </div>
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>Channel</th><th>Basis</th><th>Current envelope</th><th>Missing before full value analysis</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td>Company income tax</td>
                  <td>Taxable income at the company level.</td>
                  <td>{latestValue(data.resource_company_tax_rate)}% full company tax rate.</td>
                  <td>Already separate from company-level ATO values on Who pays what.</td>
                </tr>
                <tr>
                  <td>PRRT</td>
                  <td>Taxable profit of petroleum projects.</td>
                  <td>{latestValue(data.resource_prrt_policy)}% policy rate.</td>
                  <td>Official PRRT receipts by year/project scope, deductions and uplift treatment.</td>
                </tr>
                <tr>
                  <td>Petroleum royalties</td>
                  <td>Field-specific royalty systems such as wellhead value or net cash flow.</td>
                  <td>Barrow Island {latestValue(data.resource_wa_petroleum_royalties)}% RRR; NWS {royaltyFields.north_west_shelf_primary_production_licence_rate_percent}% / {royaltyFields.north_west_shelf_secondary_production_licence_rate_percent}% royalty rates.</td>
                  <td>Total royalty receipts and field/state coverage.</td>
                </tr>
                <tr>
                  <td>Direct state ownership</td>
                  <td>Norway comparison channel through SDFI and Equinor shareholding.</td>
                  <td>Norway source lists taxes, SDFI, dividends, fees and environmental taxes.</td>
                  <td>Australian equivalent does not exist at the same scale; comparison needs careful framing.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="section" aria-labelledby="flows-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Production and buyers</span>
              <h2 id="flows-h">Where the gas comes from and where LNG goes</h2>
              <p className="section__lede">
                Phase 2 starts with national gas-origin context and the latest verified full LNG destination split.
              </p>
            </div>
          </div>
          <div className="sources-grid">
            <article className="source-card">
              <h4>Gas origin snapshot</h4>
              <p className="body-sm">
                Australia produced {oneDecimal(gasFields.raw_gas_production_pj)} PJ of gas in {gasFields.year};
                {` ${oneDecimal(gasFields.lng_exports_pj)} PJ was exported as LNG.`}
              </p>
              <p className="caption">
                About {oneDecimal(gasFields.conventional_resource_north_west_shelf_share_percent)}% of conventional gas resources are on the North West Shelf, across {Array.isArray(gasFields.north_west_shelf_basins) ? gasFields.north_west_shelf_basins.join(', ') : 'listed basins'}.
              </p>
              <p className="caption mono">{window.FR.sourceLine(data.resource_gas_origin_aecr)}</p>
            </article>

            <article className="source-card">
              <h4>Norway capture-channel comparison</h4>
              <p className="body-sm">
                Norway's 2025 estimated petroleum net government cash flow is {oneDecimal(norwayRevenue.net_government_cashflow_nok_billion)} NOK billion.
              </p>
              <p className="caption">
                It combines taxes, SDFI, Equinor dividends, fees and environmental taxes. Australia cannot be compared honestly until those channels are mapped separately.
              </p>
              <p className="caption mono">{window.FR.sourceLine(data.resource_norway_state_revenue_model)}</p>
            </article>
          </div>

          <div style={{ height: 24 }}/>
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>LNG destination</th><th>Export value</th><th>Share of listed total</th></tr>
              </thead>
              <tbody>
                {destinations.map(row => (
                  <tr key={row.destination}>
                    <td>{row.destination}</td>
                    <td>{audBillions(row.value)}</td>
                    <td>{((row.value / fields(data.resource_lng_export_destinations_req).total) * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="caption mono">{window.FR.sourceLine(data.resource_lng_export_destinations_req)}</p>
        </section>

        <section className="section" aria-labelledby="roadmap-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Build phases</span>
              <h2 id="roadmap-h">What still needs to be done</h2>
            </div>
          </div>
          <PhaseTable/>
        </section>

        <section className="section section--sources" id="sources">
          <div className="section__head">
            <div>
              <span className="eyebrow">Sources & methodology</span>
              <h2>Every source used on this page</h2>
              <p className="section__lede">
                Source envelopes separate verified official facts from future-phase placeholders.
              </p>
            </div>
          </div>
          <div className="sources-grid">
            {Object.entries(data).map(([id, env]) => <SourceSummary key={id} id={id} env={env}/>)}
          </div>
          <div className="methodology">
            <h3>Method rules</h3>
            <dl>
              <dt>Tax and royalty rates</dt>
              <dd>Policy rates are shown only as rates. Cash received by government needs separate official receipts.</dd>
              <dt>25% export-tax scenario</dt>
              <dd>Computed as 25% of the loaded LNG plus oil export-value envelopes. It is a gross scenario, not a profits-based tax model.</dd>
              <dt>Value leakage</dt>
              <dd>Not published. It remains unavailable until the denominator, Australian receipt channels and Norway comparison are documented from source envelopes.</dd>
            </dl>
          </div>
        </section>

        <Footer updated={latestRetrieved ? updatedDisplay : ''}/>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
