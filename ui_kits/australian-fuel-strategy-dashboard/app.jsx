const SERIES = [
  'pmc_fuel_security_level',
  'pmc_mso_days_cover',
  'pmc_mso_fuel_reserves',
  'fuel_security_petrol_days_remaining',
  'fuel_security_diesel_days_remaining',
  'fuel_security_jet_days_remaining',
  'fuel_security_payment',
  'pmc_forward_import_orders',
  'pmc_tankers_on_water',
  'fuel_forward_contract_coverage',
  'fuel_security_terminal_capacity',
  'fuel_security_live_station_outage_feed',
  'fuel_security_live_vessel_tracking',
];

const QUICK_GUIDE = [
  ['1', 'Official strategy and policy documents', 'Start with which fuel-security policy documents are verified, partial or still source-gated.'],
  ['2', 'Public reserve and MSO indicators', 'Read PM&C/DCCEEW reserve and days-cover rows with stale/manual labels intact.'],
  ['3', 'Product-level days-cover signals', 'Separate petrol, diesel and jet fuel visibility from any broader fuel-security claim.'],
  ['4', 'Emergency response and public/private boundary', 'Check what can be public as safe aggregates and what may need protection.'],
  ['5', 'What government still needs to publish', 'Use the gaps as source requests, not prompts for estimates.'],
];

const POLICY_ROWS = [
  {
    policy: 'Latest national fuel strategy',
    publisher: 'Commonwealth source required',
    date: 'Source-gated',
    status: 'source-gated',
    machineReadable: 'Not loaded',
    covers: 'Would identify the current national policy document and its update cadence.',
    notPublish: 'No latest-strategy claim is made until an official source is loaded.',
    citation: null,
  },
  {
    policy: 'National liquid fuel security policy',
    publisher: 'Commonwealth source required',
    date: 'Source-gated',
    status: 'source-gated',
    machineReadable: 'Not loaded',
    covers: 'Would define the public policy boundary for liquid fuel security.',
    notPublish: 'No policy settings, emergency powers or reserve commitments are inferred.',
    citation: null,
  },
  {
    policy: 'Fuel security services/payment scheme',
    sourceId: 'fuel_security_payment',
    publisher: 'DCCEEW',
    status: 'manual',
    machineReadable: 'Manual public page/table',
    covers: 'Public FSSP payment disclosure rows where the named source provides them.',
    notPublish: 'Does not reveal contracts, refinery operations or forward fuel coverage.',
  },
  {
    policy: 'Minimum Stockholding Obligation / MSO',
    sourceId: 'pmc_mso_days_cover',
    publisher: 'PM&C / DCCEEW',
    status: 'manual',
    machineReadable: 'Manual public table',
    covers: 'Published product days of coverage under the MSO table.',
    notPublish: 'Does not publish terminal-level stock, full national emergency stock depth or private contracts.',
  },
  {
    policy: 'Emergency fuel response settings',
    publisher: 'Commonwealth source required',
    date: 'Source-gated',
    status: 'source-gated',
    machineReadable: 'Not loaded',
    covers: 'Would describe public emergency fuel response settings and their safe publication boundary.',
    notPublish: 'No emergency release powers or operational trigger settings are inferred here.',
    citation: null,
  },
  {
    policy: 'Public/private data boundary',
    publisher: 'Commonwealth / industry source required',
    date: 'Source-gated',
    status: 'source-gated',
    machineReadable: 'Not loaded',
    covers: 'Would separate safe public aggregates from protected operational detail.',
    notPublish: 'No terminal, cargo, vessel, contract or security-sensitive holdings are invented.',
    citation: null,
  },
];

const INDICATOR_ROWS = [
  {
    id: 'pmc_mso_days_cover',
    name: 'MSO days of cover',
    why: 'Shows public product days coverage under the MSO table.',
    action: 'Verify whether PM&C/DCCEEW has advanced the table or published a stable machine-readable feed.',
  },
  {
    id: 'pmc_mso_fuel_reserves',
    name: 'MSO fuel reserves',
    why: 'Shows public reserve volume context for petrol, diesel and jet fuel.',
    action: 'Keep reserve volumes as source-linked public aggregates; do not infer terminal inventories.',
  },
  {
    id: 'fuel_security_payment',
    name: 'Fuel Security Services Payment',
    why: 'Shows public payment-disclosure context for the scheme, not a contract or supply-coverage feed.',
    action: 'Review the DCCEEW table on its quarterly cadence and leave stale warnings visible if it has not advanced.',
  },
  {
    id: 'fuel_security_petrol_days_remaining',
    name: 'Petrol days cover',
    why: 'Derived by selecting the petrol field from the PM&C MSO days table.',
    action: 'Refresh only when the parent PM&C table is verified.',
  },
  {
    id: 'fuel_security_diesel_days_remaining',
    name: 'Diesel days cover',
    why: 'Derived by selecting the diesel field from the PM&C MSO days table.',
    action: 'Refresh only when the parent PM&C table is verified.',
  },
  {
    id: 'fuel_security_jet_days_remaining',
    name: 'Jet fuel days cover',
    why: 'Derived by selecting the jet fuel field from the PM&C MSO days table.',
    action: 'Refresh only when the parent PM&C table is verified.',
  },
];

const PRODUCT_ROWS = [
  ['Petrol', 'fuel_security_petrol_days_remaining', 'Public MSO product field reshaped from PM&C/DCCEEW.'],
  ['Diesel', 'fuel_security_diesel_days_remaining', 'Public MSO product field reshaped from PM&C/DCCEEW.'],
  ['Jet fuel', 'fuel_security_jet_days_remaining', 'Public MSO product field reshaped from PM&C/DCCEEW.'],
  ['Aggregate petroleum / total fuel', null, 'No separate aggregate days-cover row is published here unless a named source provides the exact concept.'],
];

const BOUNDARY_ROWS = [
  ['Reserve commitments', 'Aggregated commitments can be public if official source defines them.', 'Possible', 'Partial / source-gated', 'Use official reserve/MSO rows only; do not infer holdings.'],
  ['Emergency release powers', 'Exact operational triggers may be sensitive.', 'Possible summary', 'Source-gated', 'Needs official public policy source before display.'],
  ['Industry-held stock obligations', 'Exact holdings may be commercially or security sensitive.', 'Possible aggregate', 'Partial', 'MSO public aggregates exist; firm-level detail is not loaded.'],
  ['Government-held reserves', 'Exact location and release detail may be sensitive.', 'Possible aggregate', 'Partial / source-gated', 'Use only public reserve disclosures or government summary rows.'],
  ['Terminal inventory', 'Exact terminal stocks can be sensitive.', 'Possible aggregate', 'Unavailable', 'No reusable public terminal-inventory feed is loaded.'],
  ['Contracted supply', 'Counterparties, prices and schedules may be commercial-in-confidence.', 'Possible aggregate', 'Unavailable', 'No public forward contract coverage is loaded.'],
  ['Vessel/cargo visibility', 'Vessel names and port-call detail may be operational.', 'Possible aggregate', 'Partial', 'Aggregate tanker counts are visible; no live AIS, cargo or ETA layer is loaded.'],
  ['Retail station availability', 'Station-level availability is public-useful but currently fragmented.', 'Possible', 'Unavailable / partial', 'PM&C/WA/QLD public rows exist; no national live station feed is loaded.'],
  ['Regional outage reporting', 'Useful for travellers, freight and emergency planning.', 'Possible', 'Partial', 'State/territory public rows are incomplete and not a live national coverage layer.'],
];

const IMPLEMENTATION_ROWS = [
  ['Policy document published', 'source-gated', 'No current national strategy document is asserted on this page.', 'Official source not loaded.', 'Verify official fuel strategy source before naming it current.'],
  ['Machine-readable data feeds available', 'partial', 'Programmatic and manual envelopes exist for selected fuel data.', 'MSO tables remain manual and some operational feeds are unavailable.', 'Prioritise stable CSV/JSON/XLSX endpoints for public indicators.'],
  ['Product-level days-cover updated', 'stale', 'Petrol, diesel and jet fuel days are derived from the loaded PM&C table.', 'Parent public table has not been advanced in the loaded envelope.', 'Recheck and update only from named PM&C/DCCEEW source material.'],
  ['MSO reserve data updated', 'stale', 'PM&C reserve volume row is loaded as a manual public aggregate.', 'Loaded period is outside weekly cadence.', 'Recheck official table; keep stale labels if source remains unchanged.'],
  ['Emergency fuel response explained', 'source-gated', 'No emergency response setting is asserted.', 'Official public source and sensitivity boundary not loaded.', 'Load official public policy source before describing settings.'],
  ['State/territory integration visible', 'partial', 'Retail stock-out and Queensland public rows exist on National Fuel Security.', 'Coverage is not a national live operational feed.', 'Keep state rows labelled partial until coverage is complete.'],
  ['Queensland fuel sovereignty linked', 'partial', 'Queensland pathway sections exist on National Fuel Security.', 'Delivery, bid, capacity, land and contract fields remain mostly source-gated.', 'Re-check official AFIP and Coordinator-General sources.'],
  ['Forward supply/contracts visible', 'unavailable', 'Forward import orders and aggregate tanker counts are separate from contracts.', 'Contract coverage is not public.', 'Keep as government/industry data-access request.'],
  ['Public dashboard exists', 'roadmap', 'This is an independent prototype, not government infrastructure.', 'Official ownership, maintenance and feed publishing are not loaded.', 'Publish official feed ownership, cadence and reuse boundaries.'],
];

const PUBLISH_ROWS = [
  ['Latest official fuel strategy in dashboard-readable form', 'Identifies what policy document is current and what period it covers.', 'Commonwealth', 'Source-gated', 'Load official source, publication date, status and reuse terms.'],
  ['Product-level petrol/diesel/jet days-cover', 'Supports product-specific fuel-security visibility.', 'PM&C / DCCEEW', 'Stale / partial', 'Advance the manual MSO table or publish a stable machine-readable feed.'],
  ['MSO reserves and obligations', 'Separates reserve obligations from live operational inventory.', 'PM&C / DCCEEW', 'Stale / partial', 'Publish current public aggregate reserve rows and definitions.'],
  ['Fuel security payment status', 'Shows public payment-scheme disclosures without implying supply contracts.', 'DCCEEW', 'Stale / manual', 'Update the table or confirm no new quarter is published.'],
  ['Safe aggregate terminal/storage visibility', 'Shows resilience without exposing sensitive site-level data.', 'Commonwealth / industry', 'Unavailable', 'Define safe aggregate indicators and cadence.'],
  ['Fuel emergency response settings', 'Explains public settings and sensitivity boundaries.', 'Commonwealth', 'Source-gated', 'Publish source-safe summary fields.'],
  ['Public/private data boundary', 'Stops dashboards from either hiding everything or publishing unsafe detail.', 'Commonwealth / industry', 'Source-gated', 'State what can be safely public as aggregate indicators.'],
  ['Regional fuel outage indicators', 'Helps travellers, freight, communities and emergency planning.', 'States / industry', 'Partial', 'Publish reusable regional outage rows with product and timestamp.'],
  ['Forward supply/contract coverage', 'Shows what is committed beyond the month.', 'Government / industry', 'Unavailable', 'Publish safe aggregate coverage without counterparties if needed.'],
  ['Update cadence for fuel security indicators', 'Lets stale/current labels be interpreted correctly.', 'Publishing agency', 'Partial', 'Publish cadence and last-updated metadata with each feed.'],
];

function latestPoint(env) {
  if (!env || env.status !== 'ok' || !env.values?.length) return null;
  return env.values.at(-1);
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

function fmtEnvelopeValue(env) {
  const point = latestPoint(env);
  if (!point) return 'Unavailable';
  if (env.series_id === 'fuel_security_payment') {
    return `A$${fmtNumber(point.v, 2)}m`;
  }
  return `${fmtNumber(point.v, Number(point.v) % 1 === 0 ? 0 : 1)}${env.unit ? ` ${env.unit}` : ''}`;
}

function statusKind(env, fallback = 'source-gated') {
  if (!env || env.status !== 'ok') return fallback;
  const f = window.FR.freshness(env);
  if (f.state === 'stale') return 'stale';
  if (env.manual_entry || env.extra?.fields?.parent_manual_entry) return 'manual';
  if (env._meta?.fetch === 'derived') return 'derived';
  return 'observed';
}

function statusText(env, fallback = 'Source-gated') {
  if (!env || env.status !== 'ok') return fallback;
  const f = window.FR.freshness(env);
  return f.state === 'stale' ? 'Stale' : f.label;
}

function SourceLink({ env }) {
  if (!env?.source_url) return <span className="unavail">Source-gated</span>;
  return <a href={env.source_url}>{env.source_name || env.source_id} <Icon name="external" size={12}/></a>;
}

function FuelIndicatorBadges({ env, parentEnv = null, partial = false }) {
  const parentStale = parentEnv && window.FR.freshness(parentEnv).state === 'stale';
  return (
    <div className="trust-badges">
      <EnvTrustBadges env={env} partial={partial}/>
      {parentStale && <TrustBadge kind="stale">Parent table stale</TrustBadge>}
    </div>
  );
}

function PolicyDocumentsTable({ data }) {
  return (
    <div className="data-table-wrap">
      <table className="data-table data-table--plain">
        <thead>
          <tr>
            <th>Document / policy</th>
            <th>Publisher</th>
            <th>Publication date</th>
            <th>Current status</th>
            <th>Machine-readable data?</th>
            <th>What it covers</th>
            <th>What it does not publish</th>
            <th>Link / citation</th>
          </tr>
        </thead>
        <tbody>
          {POLICY_ROWS.map(row => {
            const env = row.sourceId ? data[row.sourceId] : null;
            return (
              <tr key={row.policy}>
                <td>{row.policy}</td>
                <td>{row.publisher}</td>
                <td>{env?.last_data_point || row.date || 'Unknown'}</td>
                <td><TrustBadge kind={statusKind(env, row.status)}>{statusText(env, row.status === 'source-gated' ? 'Source-gated' : undefined)}</TrustBadge></td>
                <td>{row.machineReadable}</td>
                <td>{row.covers}</td>
                <td>{row.notPublish}</td>
                <td>{env ? <SourceLink env={env}/> : <span className="unavail">Official source required</span>}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function IndicatorTable({ data }) {
  return (
    <div className="data-table-wrap">
      <table className="data-table data-table--plain">
        <thead>
          <tr>
            <th>Indicator</th>
            <th>Latest value</th>
            <th>Data period</th>
            <th>Status</th>
            <th>Source</th>
            <th>Why it matters</th>
            <th>Next source action</th>
          </tr>
        </thead>
        <tbody>
          {INDICATOR_ROWS.map(row => {
            const env = data[row.id];
            return (
              <tr key={row.id}>
                <td>{row.name}</td>
                <td>{fmtEnvelopeValue(env)}</td>
                <td>{env?.last_data_point || 'Unavailable'}</td>
                <td>
                  <FuelIndicatorBadges
                    env={env}
                    parentEnv={row.id.startsWith('fuel_security_') && row.id !== 'fuel_security_payment' ? data.pmc_mso_days_cover : null}
                    partial={row.id === 'fuel_security_payment'}
                  />
                </td>
                <td><SourceLink env={env}/></td>
                <td>{row.why}</td>
                <td>{row.action}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function ProductDaysPanel({ data }) {
  return (
    <div className="data-table-wrap">
      <table className="data-table data-table--plain">
        <thead>
          <tr>
            <th>Product</th>
            <th>Current public status</th>
            <th>Latest value</th>
            <th>Latest data point</th>
            <th>Source cadence</th>
            <th>What is missing</th>
          </tr>
        </thead>
        <tbody>
          {PRODUCT_ROWS.map(([product, id, note]) => {
            const env = id ? data[id] : null;
            return (
              <tr key={product}>
                <td>{product}</td>
                <td>{env ? <FuelIndicatorBadges env={env} parentEnv={data.pmc_mso_days_cover}/> : <TrustBadge kind="source-gated"/>}</td>
                <td>{env ? fmtEnvelopeValue(env) : 'Unavailable'}</td>
                <td>{env?.last_data_point || 'Unavailable'}</td>
                <td>{env?._meta?.update_cadence || 'Source-gated'}</td>
                <td>{note}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function SimpleStatusTable({ columns, rows }) {
  return (
    <div className="data-table-wrap">
      <table className="data-table data-table--plain">
        <thead>
          <tr>{columns.map(col => <th key={col}>{col}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              {row.map((cell, cellIdx) => (
                <td key={`${idx}-${cellIdx}`}>
                  {cellIdx === 1 && ['observed', 'verified', 'partial', 'stale', 'manual', 'derived', 'unavailable', 'source-gated', 'roadmap'].includes(String(cell).toLowerCase())
                    ? <TrustBadge kind={cell}/>
                    : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SourceCard({ id, env, partial = false }) {
  const f = window.FR.freshness(env);
  return (
    <article className="source-card">
      <div className="card-status-row">
        <h4>{env?.source_name || id}</h4>
        <EnvTrustBadges env={env} partial={partial}/>
      </div>
      <p className="body-sm">
        {env?.status === 'ok'
          ? `Loaded envelope. Latest data point ${env.last_data_point || 'unknown'}; status ${f.label.toLowerCase()}.`
          : env?.notes || 'No source-safe envelope is loaded.'}
      </p>
      <p className="caption"><b>Envelope:</b> <span className="mono">{id}</span></p>
      {env?.source_url && <a href={env.source_url}>{env.source_url.replace(/^https?:\/\//,'')} <Icon name="external" size={12}/></a>}
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
        <Header active="fuel_strategy" refreshStatus={refreshStatus}/>
        <main id="main"><div className="loading-wrap">Loading source envelopes...</div></main>
      </div>
    );
  }

  const latestRetrieved = window.FR.latestVerifiedRetrieved(data);
  const updatedDisplay = window.FR.fmtVerifiedUpdated(latestRetrieved);
  const msoFields = fields(data.pmc_mso_days_cover);
  const reservesFields = fields(data.pmc_mso_fuel_reserves);

  return (
    <div className="page">
      <Header active="fuel_strategy" refreshStatus={refreshStatus} updated={latestRetrieved ? updatedDisplay : ''}/>

      <main id="main">
        <section className="intro" id="fuel-strategy">
          <div>
            <span className="eyebrow">Fuel strategy - source tracker</span>
            <h1 style={{ marginTop: 12 }}>Australian fuel strategy tracker</h1>
            <p className="intro__lede">
              Tracks official fuel-security policy, reserve commitments, days-cover indicators and
              missing public feeds, while keeping security-sensitive or unpublished operational data
              clearly source-gated.
            </p>
            <p className="body-sm" style={{ marginTop: 16, color: 'var(--ink-2)' }}>
              This page is an independent public-source prototype. It does not infer fuel reserves,
              contracts, cargoes, emergency powers or security-sensitive holdings. If a fuel-security
              setting is not published in a named official source, it remains marked as unavailable or
              source-gated.
            </p>
          </div>
          <aside className="intro__meta" aria-label="Publication details">
            <strong>Verified data retrieved</strong>
            <span className="mono">{updatedDisplay}</span>
            <div style={{ height: 12 }}/>
            <strong>Boundary</strong>
            <span>No fuel reserves, contracts, cargoes or emergency powers are inferred.</span>
          </aside>
        </section>

        <DataCoverage data={data} refreshStatus={refreshStatus}/>

        <section className="section section--why" aria-labelledby="guide-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Use this page in order</span>
              <h2 id="guide-h">Policy evidence before operational claims</h2>
              <p className="section__lede">
                The strongest rows are existing PM&C/DCCEEW public indicators. Strategy status,
                emergency response settings, terminal inventories and contracts stay source-gated
                until official/public fields are loaded.
              </p>
            </div>
          </div>
          <div className="quick-link-grid quick-link-grid--5">
            {QUICK_GUIDE.map(([step, title, copy]) => (
              <article className="quick-link-card" key={title}>
                <span className="eyebrow">{step}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section" aria-labelledby="policy-docs-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Policy documents</span>
              <h2 id="policy-docs-h">Official strategy and policy documents</h2>
              <p className="section__lede">
                This table separates existing public scheme/MSO evidence from documents that still
                require official source verification. No latest-strategy claim is made without a named
                official source.
              </p>
            </div>
          </div>
          <PolicyDocumentsTable data={data}/>
        </section>

        <section className="section" aria-labelledby="reserve-indicators-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Reserve context</span>
              <h2 id="reserve-indicators-h">Public reserve and MSO indicators</h2>
              <p className="section__lede">
                These are the loaded public reserve and days-cover indicators. Stale labels remain
                visible where the latest source period is outside the cadence window.
              </p>
            </div>
          </div>
          <div className="metric-grid metric-grid--4">
            <MetricCard
              eyebrow="MSO table"
              label="Lowest product days cover"
              plain={`PM&C MSO table as at ${msoFields.as_at || data.pmc_mso_days_cover?.last_data_point || 'unknown'}.`}
              fromEnvelope={data.pmc_mso_days_cover}
              unit="days"
              partial
            />
            <MetricCard
              eyebrow="MSO reserve volume"
              label="Petrol, diesel and jet reserves"
              plain={reservesFields.includes || 'Public aggregate reserve volume from the PM&C/DCCEEW table.'}
              fromEnvelope={data.pmc_mso_fuel_reserves}
              unit="ML"
              partial
            />
            <MetricCard
              eyebrow="Product days"
              label="Diesel days cover"
              plain="Derived from the diesel field in the public PM&C MSO days table."
              fromEnvelope={data.fuel_security_diesel_days_remaining}
              unit="days"
            />
            <MetricCard
              eyebrow="Policy scheme"
              label="FSSP latest payment disclosure"
              plain="Public DCCEEW payment-disclosure context only; not a contract or supply-coverage feed."
              fromEnvelope={data.fuel_security_payment}
              valueFn={env => fmtNumber(latestPoint(env)?.v, 2)}
              unit="A$m"
              partial
            />
          </div>
          <div style={{ height: 'var(--s-5)' }}/>
          <IndicatorTable data={data}/>
        </section>

        <section className="section" aria-labelledby="product-days-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Product visibility</span>
              <h2 id="product-days-h">Product-level days-cover visibility</h2>
              <p className="section__lede">
                Product-level days-cover is one of the most important public fuel-security signals.
                If petrol, diesel or jet fuel coverage is stale or not machine-readable, the dashboard
                must show the gap rather than estimate the missing value.
              </p>
            </div>
          </div>
          <ProductDaysPanel data={data}/>
        </section>

        <section className="section section--why" aria-labelledby="boundary-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Security boundary</span>
              <h2 id="boundary-h">Emergency response and public/private boundary</h2>
              <p className="section__lede">
                A useful public dashboard should ask for safe aggregate indicators. It should not
                infer protected operational detail such as terminal inventories, cargo assignments,
                contract counterparties or emergency-release triggers.
              </p>
            </div>
          </div>
          <SimpleStatusTable
            columns={['Area', 'Should public see exact detail?', 'Safe public aggregate possible?', 'Current publication status', 'Sensitivity note']}
            rows={BOUNDARY_ROWS}
          />
        </section>

        <section className="section" aria-labelledby="implementation-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Implementation</span>
              <h2 id="implementation-h">Strategy implementation tracker</h2>
              <p className="section__lede">
                This is categorical tracking only. It does not score readiness, infer policy compliance
                or invent implementation status.
              </p>
            </div>
          </div>
          <SimpleStatusTable
            columns={['Milestone', 'Status', 'Evidence', 'Current blocker', 'Next action']}
            rows={IMPLEMENTATION_ROWS}
          />
        </section>

        <section className="section section--why" aria-labelledby="publish-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Missing public feeds</span>
              <h2 id="publish-h">What government still needs to publish</h2>
              <p className="section__lede">
                These rows are public-data requests. They are not back-filled with estimates or
                operational guesses.
              </p>
            </div>
          </div>
          <SimpleStatusTable
            columns={['Missing feed', 'Why it matters', 'Likely holder / publisher', 'Dashboard status', 'Next source action']}
            rows={PUBLISH_ROWS}
          />
        </section>

        <section className="section section--sources" id="sources">
          <div className="section__head">
            <div>
              <span className="eyebrow">Sources and methodology</span>
              <h2>Every envelope used on this page</h2>
              <p className="section__lede">
                This page reuses existing fuel-security envelopes. It adds no new fuel policy values,
                reserve figures, emergency settings, contract rows or terminal/storage data.
              </p>
            </div>
          </div>
          <div className="sources-grid">
            {Object.entries(data).map(([id, env]) => (
              <SourceCard
                key={id}
                id={id}
                env={env}
                partial={['fuel_security_payment', 'fuel_forward_contract_coverage', 'fuel_security_terminal_capacity', 'fuel_security_live_station_outage_feed', 'fuel_security_live_vessel_tracking'].includes(id)}
              />
            ))}
          </div>
          <div className="methodology">
            <h3>No-estimate rule</h3>
            <p>
              No fuel strategy facts, reserve values, days-cover values, emergency policy settings,
              contracts, cargoes, terminal inventories or live feeds are inferred. Source-gated means
              the page is waiting for a verified official/public source, exact field, period, unit and
              reuse boundary.
            </p>
          </div>
        </section>
      </main>

      <Footer refreshStatus={refreshStatus} updated={latestRetrieved ? updatedDisplay : ''}/>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
