const SERIES = [
  'resource_company_tax_rate',
  'resource_prrt_policy',
  'resource_resource_rent_tax_receipts_budget',
  'resource_wa_petroleum_royalties',
  'resource_wa_petroleum_royalty_receipts',
  'resource_qld_petroleum_royalty_receipts',
  'resource_lng_export_value_req',
  'resource_oil_export_value_req',
  'resource_lng_export_destinations_req',
  'resource_gas_origin_aecr',
  'resource_oil_origin_aecr',
  'resource_domestic_gas_prices_accc',
  'resource_lng_netback_accc',
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

function withUnit(value, unit) {
  if (value == null) return 'na';
  return `${oneDecimal(value)} ${unit}`;
}

function audBillionsFromBillion(valueB) {
  if (valueB == null) return '-';
  return 'A$' + Number(valueB).toLocaleString('en-AU', { maximumFractionDigits: 1 }) + 'b';
}

function price(value) {
  if (value == null) return '-';
  return '$' + Number(value).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '/GJ';
}

function valuePeriod(env) {
  return env?.values?.at(-1)?.t || env?.last_data_point || '-';
}

function ScenarioCard({ lngEnv, oilEnv, rentTaxEnv, royaltyReceiptEnvs }) {
  const lng = latestValue(lngEnv);
  const oil = latestValue(oilEnv);
  const rentTax = latestValue(rentTaxEnv);
  const royaltyReceipts = (royaltyReceiptEnvs || []).map(env => latestValue(env));
  const royaltyReceipt = royaltyReceipts.every(v => v != null)
    ? royaltyReceipts.reduce((sum, v) => sum + v, 0)
    : null;
  const canCompute = lng != null && oil != null && rentTax != null && royaltyReceipt != null;
  const exportBase = lng != null && oil != null ? lng + oil : null;
  const scenario = exportBase != null ? exportBase * 0.25 : null;
  const loadedReceiptContext = rentTax != null && royaltyReceipt != null ? rentTax + royaltyReceipt : null;
  const difference = scenario != null && loadedReceiptContext != null ? scenario - loadedReceiptContext : null;
  return (
    <article className={`metric-card ${canCompute ? '' : 'metric-card--unavailable'}`}>
      <div className="card-status-row">
        <span className="eyebrow">Calculator</span>
        <span className="status-pill status-pill--derived">Method</span>
      </div>
      <h3 className="metric-card__label">25% gross export-value calculator</h3>
      <p className="metric-card__plain">
        Hypothetical 25% levy on loaded LNG plus oil export earnings, with loaded receipt context shown separately.
      </p>
      {canCompute ? (
        <div>
          <div className="metric-card__row">
            <span className="metric-numeral">{oneDecimal(scenario / 1000)}</span>
            <span className="metric-unit">A$b</span>
          </div>
          <div className="data-table-wrap" style={{ marginTop: 16 }}>
            <table className="data-table">
              <tbody>
                <tr><td>Loaded export base</td><td>{audBillions(exportBase)}</td></tr>
                <tr><td>25% gross scenario</td><td>{audBillions(scenario)}</td></tr>
                <tr><td>Loaded receipt context, mixed periods</td><td>{audBillions(loadedReceiptContext)}</td></tr>
                <tr><td>Difference before missing channels</td><td>{audBillions(difference)}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="metric-card__unavail">
          <Icon name="alert" size={18}/>
          <span>Calculator hidden until export-value and receipt-context envelopes are verified.</span>
        </div>
      )}
      <footer className="metric-card__foot">
        <span className="metric-card__source">Not a leakage estimate. Loaded receipt context is not period-aligned and excludes company tax, other royalty systems, timing effects, deductions, project boundaries and denominator choice.</span>
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
  const rentTaxFields = fields(data.resource_resource_rent_tax_receipts_budget);
  const qldRoyaltyReceiptFields = fields(data.resource_qld_petroleum_royalty_receipts);
  const gasFields = fields(data.resource_gas_origin_aecr);
  const oilFields = fields(data.resource_oil_origin_aecr);
  const stateFields = fields(data.resource_state_production_aes);
  const domesticGasFields = fields(data.resource_domestic_gas_prices_accc);
  const lngNetbackFields = fields(data.resource_lng_netback_accc);
  const norwayRevenue = fields(data.resource_norway_state_revenue_model);
  const destinations = fields(data.resource_lng_export_destinations_req).destinations || [];
  const gasBasinRows = gasFields.basin_rows || [];
  const gasFlowRows = gasFields.flow_rows || [];
  const stateProductionRows = stateFields.state_rows || [];
  const oilFlowRows = [
    ['AECR oil production', `${oneDecimal(oilFields.production_crude_condensate_lpg_pj)} PJ`, '2023 calendar-year headline; AECR notes LPG undercount on the North West Shelf.'],
    ['AECR oil exports', `${oneDecimal(oilFields.exports_crude_refinery_feedstocks_lpg_pj)} PJ`, 'Crude oil, refinery feedstocks and LPG exports in 2023.'],
    ['AECR oil export earnings', audBillionsFromBillion(oilFields.export_value_aud_billion), 'Crude oil, refinery feedstocks and LPG exports in 2023.'],
    ['AES crude/condensate/LPG production', `${oneDecimal(oilFields.aes_crude_condensate_lpg_production_pj)} PJ`, `${oilFields.aes_period} Australian Energy Statistics context.`],
    ['AES crude/condensate/LPG exports', `${oneDecimal(oilFields.aes_crude_condensate_lpg_exports_pj)} PJ`, `${oilFields.aes_period}; about ${oneDecimal(oilFields.aes_exported_domestic_oil_resources_share_percent)}% of domestically produced oil resources exported.`],
    ['Refined products and LPG imports', `${oneDecimal(oilFields.aes_refined_products_and_lpg_imports_pj)} PJ`, `${oilFields.aes_period}; Australia imports most refined petroleum product demand.`],
  ];
  const oilBasinRows = [
    ...(oilFields.crude_basin_rows || []).map(row => ({ product: 'Crude oil', ...row })),
    ...(oilFields.condensate_basin_rows || []).map(row => ({ product: 'Condensate', ...row })),
  ];
  const domesticRows = domesticGasFields.rows || [];
  const netbackRows = lngNetbackFields.annual_forward_short_term || [];
  const domesticProducer = latestValue(data.resource_domestic_gas_prices_accc);
  const netbackAverage = latestValue(data.resource_lng_netback_accc);
  const netbackGap = domesticProducer != null && netbackAverage != null ? netbackAverage - domesticProducer : null;
  const lngExportValue = latestValue(data.resource_lng_export_value_req);
  const oilExportValue = latestValue(data.resource_oil_export_value_req);
  const exportValueBase = lngExportValue != null && oilExportValue != null ? lngExportValue + oilExportValue : null;
  const grossScenario25 = exportValueBase != null ? exportValueBase * 0.25 : null;
  const loadedRoyaltyReceiptContext = latestValue(data.resource_wa_petroleum_royalty_receipts) != null && latestValue(data.resource_qld_petroleum_royalty_receipts) != null
    ? latestValue(data.resource_wa_petroleum_royalty_receipts) + latestValue(data.resource_qld_petroleum_royalty_receipts)
    : null;
  const loadedReceiptContext = latestValue(data.resource_resource_rent_tax_receipts_budget) != null && loadedRoyaltyReceiptContext != null
    ? latestValue(data.resource_resource_rent_tax_receipts_budget) + loadedRoyaltyReceiptContext
    : null;
  const scenarioLessLoadedReceipts = grossScenario25 != null && loadedReceiptContext != null ? grossScenario25 - loadedReceiptContext : null;

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
              official policy rates, receipt context, production and export flows, domestic gas-price
              context, a gross export-tax scenario and the Norway comparison without turning them into
              a leakage claim before the denominator and method are defensible.
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
                resource-rent receipts, export values, company profit data and a documented denominator.
              </p>
            </div>
          </div>
        </section>

        <section className="section" aria-labelledby="headline-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">1. Tax, royalty and PRRT</span>
              <h2 id="headline-h">Policy rates, receipts and export-value context</h2>
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
              eyebrow="Receipts"
              label="Budget resource rent taxes"
              plain="Commonwealth Budget receipt line; not project-level PRRT."
              fromEnvelope={data.resource_resource_rent_tax_receipts_budget}
              valueFn={env => audBillions(latestValue(env))}
              unitFn={() => ''}
            />
            <MetricCard
              eyebrow="Royalty"
              label="WA Barrow Island RRR"
              plain="Resource Rent Royalty on net cash flow; not total Australian royalty receipts."
              fromEnvelope={data.resource_wa_petroleum_royalties}
              unit="%"
            />
            <MetricCard
              eyebrow="Receipts"
              label="WA petroleum/NWS receipts"
              plain="WA petroleum state component plus North West Shelf grants."
              fromEnvelope={data.resource_wa_petroleum_royalty_receipts}
              valueFn={env => audBillions(latestValue(env))}
              unitFn={() => ''}
            />
            <MetricCard
              eyebrow="Receipts"
              label="Queensland petroleum royalties"
              plain="Queensland Budget petroleum royalty row; includes gas converted into LNG."
              fromEnvelope={data.resource_qld_petroleum_royalty_receipts}
              valueFn={env => audBillions(latestValue(env))}
              unitFn={() => ''}
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
            <MetricCard
              eyebrow="Domestic gas"
              label="Producer contract price"
              plain="ACCC east coast 2026 supply contracts agreed Oct-Dec 2025."
              fromEnvelope={data.resource_domestic_gas_prices_accc}
              valueFn={env => price(latestValue(env))}
              unitFn={() => ''}
            />
            <MetricCard
              eyebrow="Export parity"
              label="LNG netback 2026 average"
              plain="ACCC Wallumbilla LNG netback benchmark, 16 April 2026 update."
              fromEnvelope={data.resource_lng_netback_accc}
              valueFn={env => price(latestValue(env))}
              unitFn={() => ''}
            />
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
              <span className="eyebrow">1. Tax, royalty and PRRT</span>
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
                  <td>{latestValue(data.resource_prrt_policy)}% policy rate; Budget resource-rent tax receipts {audBillions(latestValue(data.resource_resource_rent_tax_receipts_budget))} for {rentTaxFields.latest_actual_period} actual.</td>
                  <td>Exact project-level PRRT receipts, company/project scope, deductions and uplift treatment.</td>
                </tr>
                <tr>
                  <td>Petroleum royalties</td>
                  <td>Field-specific royalty systems such as wellhead value or net cash flow.</td>
                  <td>Barrow Island {latestValue(data.resource_wa_petroleum_royalties)}% RRR; NWS {royaltyFields.north_west_shelf_primary_production_licence_rate_percent}% / {royaltyFields.north_west_shelf_secondary_production_licence_rate_percent}% royalty rates; WA petroleum/NWS receipt context {audBillions(latestValue(data.resource_wa_petroleum_royalty_receipts))}; Queensland petroleum royalty actual {audBillions(latestValue(data.resource_qld_petroleum_royalty_receipts))} for {qldRoyaltyReceiptFields.latest_actual_period}.</td>
                  <td>Other state/federal petroleum royalty receipts and field-level/project coverage.</td>
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
              <span className="eyebrow">2. Production and export flows</span>
              <h2 id="flows-h">Where oil and gas come from, and where exports go</h2>
              <p className="section__lede">
                National and basin context is loaded from AECR; buyer detail is currently limited to the latest verified full LNG destination split.
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
              <h4>Oil origin snapshot</h4>
              <p className="body-sm">
                AECR records {oneDecimal(oilFields.production_crude_condensate_lpg_pj)} PJ of oil production in {oilFields.year};
                {` ${oneDecimal(oilFields.exports_crude_refinery_feedstocks_lpg_pj)} PJ of crude oil, refinery feedstocks and LPG exports.`}
              </p>
              <p className="caption">
                AECR says nearly {oneDecimal(oilFields.north_west_shelf_production_share_percent)}% of oil production came from offshore North West Shelf fields in 2023.
              </p>
              <p className="caption mono">{window.FR.sourceLine(data.resource_oil_origin_aecr)}</p>
            </article>
          </div>

          <div style={{ height: 24 }}/>
          <h3>Gas production and export flow</h3>
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>Flow</th><th>Value</th><th>Context</th></tr>
              </thead>
              <tbody>
                {gasFlowRows.map(row => (
                  <tr key={`${row.flow}-${row.value_pj || row.value_mt || row.value_aud_billion}`}>
                    <td>{row.flow}</td>
                    <td>{row.value_pj != null ? `${oneDecimal(row.value_pj)} PJ` : row.value_mt != null ? `${oneDecimal(row.value_mt)} Mt` : audBillionsFromBillion(row.value_aud_billion)}</td>
                    <td>{gasFields.year}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="caption mono">{window.FR.sourceLine(data.resource_gas_origin_aecr)}</p>

          <div style={{ height: 24 }}/>
          <h3>Gas basin/source context</h3>
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>Group</th><th>Basins</th><th>Production</th><th>Source note</th></tr>
              </thead>
              <tbody>
                {gasBasinRows.map(row => (
                  <tr key={row.group}>
                    <td>{row.group}</td>
                    <td>{row.basins}</td>
                    <td>{oneDecimal(row.production_pj)} PJ</td>
                    <td>{row.share_note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ height: 24 }}/>
          <h3>State and territory production</h3>
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>State/territory</th><th>Conventional gas</th><th>Coal seam gas</th><th>Crude oil and NGL</th><th>LPG</th></tr>
              </thead>
              <tbody>
                {stateProductionRows.map(row => (
                  <tr key={row.state}>
                    <td>{row.state}</td>
                    <td>{withUnit(row.conventional_gas_pj, 'PJ')}</td>
                    <td>{withUnit(row.coal_seam_gas_pj, 'PJ')}</td>
                    <td>{withUnit(row.crude_oil_and_ngl_ml, 'ML')}</td>
                    <td>{withUnit(row.naturally_occurring_lpg_ml, 'ML')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="caption">Source units are mixed by product; this table does not add oil, LPG and gas together.</p>
          <p className="caption mono">{window.FR.sourceLine(data.resource_state_production_aes)}</p>

          <div style={{ height: 24 }}/>
          <h3>Oil production and trade flow</h3>
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>Measure</th><th>Value</th><th>Context</th></tr>
              </thead>
              <tbody>
                {oilFlowRows.map(row => (
                  <tr key={row[0]}>
                    <td>{row[0]}</td>
                    <td>{row[1]}</td>
                    <td>{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="caption mono">{window.FR.sourceLine(data.resource_oil_origin_aecr)}</p>

          <div style={{ height: 24 }}/>
          <h3>Oil basin context</h3>
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>Product</th><th>Basin</th><th>Annual production</th></tr>
              </thead>
              <tbody>
                {oilBasinRows.map(row => (
                  <tr key={`${row.product}-${row.basin}`}>
                    <td>{row.product}</td>
                    <td>{row.basin}</td>
                    <td>{oneDecimal(row.annual_production_pj)} PJ</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ height: 24 }}/>
          <h3>LNG export destinations</h3>
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

        <section className="section" aria-labelledby="gas-price-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">3. Domestic vs export price</span>
              <h2 id="gas-price-h">ACCC gas contract prices and LNG netback</h2>
              <p className="section__lede">
                This comparison is contextual only. Domestic long-term contract prices and LNG netback are related market signals, not identical products.
              </p>
            </div>
          </div>
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>Measure</th><th>Period</th><th>Value</th><th>Scope</th></tr>
              </thead>
              <tbody>
                {domesticRows.map(row => (
                  <tr key={`${row.segment}-${row.period}`}>
                    <td>{row.segment}</td>
                    <td>{row.period}</td>
                    <td>{price(row.volume_weighted_average)}</td>
                    <td>2026 east coast gas supply contracts; range {price(row.min_price)} to {price(row.max_price)}</td>
                  </tr>
                ))}
                {netbackRows.map(row => (
                  <tr key={row.period}>
                    <td>ACCC LNG netback</td>
                    <td>{row.period}</td>
                    <td>{price(row.value)}</td>
                    <td>Wallumbilla export-parity benchmark.</td>
                  </tr>
                ))}
                {netbackGap != null && (
                  <tr>
                    <td>Simple gap</td>
                    <td>2026 producer contract VWA vs 2026 netback average</td>
                    <td>{price(netbackGap)}</td>
                    <td>Arithmetic difference only; not a margin, leakage estimate or delivered customer bill.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <p className="caption mono">{window.FR.sourceLine(data.resource_domestic_gas_prices_accc)}</p>
          <p className="caption mono">{window.FR.sourceLine(data.resource_lng_netback_accc)}</p>
        </section>

        <section className="section" aria-labelledby="export-tax-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">4. Export-tax scenario</span>
              <h2 id="export-tax-h">25% gross export-value calculator</h2>
              <p className="section__lede">
                This is a transparent arithmetic scenario, not current law and not a PRRT model.
              </p>
            </div>
          </div>
          <div className="metric-grid metric-grid--3">
            <MetricCard
              eyebrow="Loaded base"
              label="LNG plus oil export earnings"
              plain={`${valuePeriod(data.resource_lng_export_value_req)} LNG plus ${valuePeriod(data.resource_oil_export_value_req)} oil export-value envelopes.`}
              fromEnvelope={data.resource_lng_export_value_req}
              valueFn={() => audBillions(exportValueBase)}
              unitFn={() => ''}
            />
            <MetricCard
              eyebrow="Scenario"
              label="25% of loaded export value"
              plain="Gross calculation before deductions, timing, incidence, project boundaries or trade effects."
              fromEnvelope={data.resource_oil_export_value_req}
              valueFn={() => audBillions(grossScenario25)}
              unitFn={() => ''}
            />
            <ScenarioCard
              lngEnv={data.resource_lng_export_value_req}
              oilEnv={data.resource_oil_export_value_req}
              rentTaxEnv={data.resource_resource_rent_tax_receipts_budget}
              royaltyReceiptEnvs={[
                data.resource_wa_petroleum_royalty_receipts,
                data.resource_qld_petroleum_royalty_receipts,
              ]}
            />
          </div>
          <div className="data-table-wrap" style={{ marginTop: 24 }}>
            <table className="data-table">
              <thead>
                <tr><th>Line</th><th>Loaded value</th><th>Period/source caveat</th></tr>
              </thead>
              <tbody>
                <tr><td>LNG export earnings</td><td>{audBillions(lngExportValue)}</td><td>{valuePeriod(data.resource_lng_export_value_req)} REQ envelope.</td></tr>
                <tr><td>Oil export earnings</td><td>{audBillions(oilExportValue)}</td><td>{valuePeriod(data.resource_oil_export_value_req)} REQ envelope.</td></tr>
                <tr><td>Loaded export base</td><td>{audBillions(exportValueBase)}</td><td>Only LNG and oil export-value envelopes currently loaded.</td></tr>
                <tr><td>25% gross scenario</td><td>{audBillions(grossScenario25)}</td><td>Gross export-value scenario, not profits-based tax law.</td></tr>
                <tr><td>Loaded receipt context</td><td>{audBillions(loadedReceiptContext)}</td><td>Mixed-period Budget resource-rent taxes plus WA petroleum/NWS and Queensland petroleum royalty receipts; not full Australian public capture.</td></tr>
                <tr><td>Scenario less loaded receipt context</td><td>{audBillions(scenarioLessLoadedReceipts)}</td><td>Displayed as a gap in loaded rows only. It is not value leaked.</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="section" aria-labelledby="norway-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">5. Norway comparison</span>
              <h2 id="norway-h">Value retained versus value leaked stays method-gated</h2>
              <p className="section__lede">
                Norway is shown as a capture-channel comparison. Australia does not yet have a complete matched
                receipt model, so this page does not publish a retained/leaked percentage.
              </p>
            </div>
          </div>
          <div className="metric-grid metric-grid--3">
            <MetricCard
              eyebrow="Norway"
              label="Net government cash flow"
              plain="Estimated 2025 net government cash flow from petroleum activities."
              fromEnvelope={data.resource_norway_state_revenue_model}
              valueFn={() => `${oneDecimal(norwayRevenue.net_government_cashflow_nok_billion)} NOKb`}
              unitFn={() => ''}
            />
            <MetricCard
              eyebrow="Australia"
              label="Loaded receipt context"
              plain="Only the loaded Budget resource-rent, WA petroleum/NWS and Queensland petroleum royalty rows."
              fromEnvelope={data.resource_resource_rent_tax_receipts_budget}
              valueFn={() => audBillions(loadedReceiptContext)}
              unitFn={() => ''}
            />
            <MetricCard
              eyebrow="Not published"
              label="Value retained vs leaked"
              fromEnvelope={data.resource_value_leakage_model}
            />
          </div>
          <div className="data-table-wrap" style={{ marginTop: 24 }}>
            <table className="data-table">
              <thead>
                <tr><th>Country/context</th><th>Loaded capture channels</th><th>What can be said now</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td>Norway</td>
                  <td>Taxes {oneDecimal(norwayRevenue.taxes_nok_billion)} NOKb; SDFI {oneDecimal(norwayRevenue.sdfi_net_cashflow_nok_billion)} NOKb; Equinor dividend {oneDecimal(norwayRevenue.equinor_dividend_nok_billion)} NOKb; fees/taxes {oneDecimal(norwayRevenue.environmental_taxes_and_area_fees_nok_billion)} NOKb.</td>
                  <td>Official comparison source shows multiple public capture channels, not just a tax rate.</td>
                </tr>
                <tr>
                  <td>Australia</td>
                  <td>Budget resource-rent tax actuals plus WA petroleum/NWS and Queensland petroleum royalty receipt context are loaded; company tax, all royalty channels and project-level PRRT are not complete here.</td>
                  <td>Enough for a structured explainer and scenario, not enough for a retained-value or leaked-value claim.</td>
                </tr>
                <tr>
                  <td>Method gate</td>
                  <td>Needs matched periods, full receipt channels, company profit scope, export denominator and domestic-price method.</td>
                  <td>Until those inputs exist, the dashboard will keep the leakage envelope unavailable.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="caption mono">{window.FR.sourceLine(data.resource_norway_state_revenue_model)}</p>
          <p className="caption mono">{window.FR.sourceLine(data.resource_value_leakage_model)}</p>
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
              <dd>Policy rates are shown separately from receipt envelopes. Loaded receipts are context only and do not yet cover every Australian capture channel.</dd>
              <dt>Domestic gas versus netback</dt>
              <dd>Domestic contract prices and LNG netback are shown side by side only as market context. They are not like-for-like delivered prices.</dd>
              <dt>25% export-tax scenario</dt>
              <dd>Computed as 25% of the loaded LNG plus oil export-value envelopes, then compared with loaded receipt context. It is a gross scenario, not a profits-based tax model.</dd>
              <dt>Value leakage</dt>
              <dd>Not published. It remains unavailable until the denominator, Australian receipt channels, company profit scope and comparison method are documented from source envelopes.</dd>
            </dl>
          </div>
        </section>

        <Footer updated={latestRetrieved ? updatedDisplay : ''}/>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
