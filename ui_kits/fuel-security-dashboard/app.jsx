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
  'wa_fuel_security_stockouts',
  'qld_fuel_security_unavailable_reports',
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

function fmtChange(value) {
  if (value === null || value === undefined) return '-';
  if (Number(value) === 0) return 'no change';
  return `${Number(value) > 0 ? '+' : ''}${value}`;
}

function StatusBlockers({ env }) {
  const blockers = env?.extra?.fields?.blockers || [];
  if (!blockers.length) return null;
  return (
    <ul className="gap-list">
      {blockers.map(blocker => (
        <li key={blocker}>{blocker}</li>
      ))}
    </ul>
  );
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

function SourceInvestigationSummary() {
  const rows = [
    {
      title: 'PM&C/DCCEEW snapshot',
      label: 'Manual',
      body: 'The public PM&C page is the authoritative public snapshot, but local pipeline requests return an Incapsula challenge and the page does not expose a CSV, JSON or XLSX data file. Manual review remains the safe mode.',
    },
    {
      title: 'Station outage visibility',
      label: 'Partial coverage',
      body: 'The loaded public sources are the PM&C dated stock-out table by state and territory, a WA-only weekly stockout snapshot, and QLD monthly Open Data rows where Price = 9999 means temporarily unavailable fuel stock. No national live dry-station API or reusable station-level availability feed is loaded.',
    },
    {
      title: 'Inbound vessels',
      label: 'Partial coverage',
      body: 'PM&C publishes aggregate tanker counts and equivalent days. The dashboard does not publish vessel names, AIS positions, ETAs or cargo inference.',
    },
    {
      title: 'Terminal storage',
      label: 'Unavailable',
      body: 'APS and PM&C support national/product stock context. A public terminal-location dataset was found, but it does not provide terminal-by-terminal capacity or live inventory for this dashboard.',
    },
  ];
  return (
    <div className="sources-grid">
      {rows.map(row => (
        <article key={row.title} className="source-card">
          <div className="card-status-row">
            <h4>{row.title}</h4>
            <TrustBadge kind={row.label.toLowerCase().replace(' coverage', '')}>{row.label}</TrustBadge>
          </div>
          <p className="body-sm">{row.body}</p>
        </article>
      ))}
    </div>
  );
}

const ANSWER_CARDS = [
  {
    title: 'National public fuel status',
    label: 'Observed',
    kind: 'observed',
    body: 'The official public PM&C/DCCEEW level remains visible and is not reinterpreted into a private risk score.',
  },
  {
    title: 'Petrol, diesel and jet fuel days remaining',
    label: 'Derived',
    kind: 'derived',
    body: 'Product-day cards are reshaped from the public MSO table rather than invented from hidden demand assumptions.',
  },
  {
    title: 'MSO reserves and APS stock context',
    label: 'Observed',
    kind: 'observed',
    body: 'The page separates MSO reserve volumes from APS monthly stocks, sales and import context.',
  },
  {
    title: 'Product imports and import dependency',
    label: 'Observed',
    kind: 'observed',
    body: 'APS product imports and ABS petroleum import value are shown as public context, with source boundaries intact.',
  },
  {
    title: 'Inbound tanker visibility',
    label: 'Partial coverage',
    kind: 'partial',
    body: 'Only aggregate public tanker and forward-order counts are shown. Live vessel names, AIS positions and ETAs remain unavailable.',
  },
  {
    title: 'Retail stock-out / outage visibility',
    label: 'Partial coverage',
    kind: 'partial',
    body: 'PM&C, WA and QLD public rows provide partial outage visibility. They are not a live national dry-station feed.',
  },
  {
    title: 'Retail price pressure where available',
    label: 'Partial coverage',
    kind: 'partial',
    body: 'Public-feed retail price rows are treated as price-pressure context, not complete national pump-price coverage.',
  },
  {
    title: 'Missing feeds',
    label: 'Unavailable',
    kind: 'unavailable',
    body: 'Live station outages, live vessel ETAs and terminal-level storage capacity stay labelled unavailable until a named public source is loaded.',
  },
];

function WhatThisPageAnswers() {
  return (
    <section className="section" aria-labelledby="answers-h">
      <div className="section__head">
        <div>
          <span className="eyebrow">What this page answers</span>
          <h2 id="answers-h">The national fuel dashboard structure</h2>
          <p className="section__lede">
            A public dashboard should show both the numbers that are visible and the feeds that are missing.
            Visibility language matters: partial public rows are not full national live coverage.
          </p>
        </div>
      </div>
      <div className="sources-grid">
        {ANSWER_CARDS.map(card => (
          <article key={card.title} className="source-card">
            <div className="card-status-row">
              <h4>{card.title}</h4>
              <TrustBadge kind={card.kind}>{card.label}</TrustBadge>
            </div>
            <p className="body-sm">{card.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function PublicRequestAlignment() {
  return (
    <section className="section section--why" aria-labelledby="public-request-h">
      <div className="why-grid">
        <div>
          <span className="eyebrow">Public dashboard request</span>
          <h2 id="public-request-h" style={{ marginTop: 8 }}>Certainty means more than a price board</h2>
        </div>
        <div className="why-body">
          <p>
            Public calls for a national fuel dashboard are about certainty: whether fuel is available,
            how many days of cover remain, what supply is inbound, where outages are visible, and
            which gaps government or industry still need to publish. This page shows that structure
            with public-source evidence only.
          </p>
          <p>
            If a value cannot be verified from a named public source, this dashboard labels it partial,
            unavailable or stale rather than filling the gap with estimates.
          </p>
        </div>
      </div>
    </section>
  );
}

function MoreThanPumpPrices() {
  return (
    <section className="section section--why" aria-labelledby="more-than-prices-h">
      <div className="why-grid">
        <div>
          <span className="eyebrow">More than pump prices</span>
          <h2 id="more-than-prices-h" style={{ marginTop: 8 }}>Supply resilience belongs beside price pressure</h2>
        </div>
        <div className="why-body">
          <p>
            A useful national fuel dashboard should not only show the price at the bowser. It should
            connect price pressure to supply resilience: stock cover, import reliance, inbound supply,
            outages, reserves, terminal visibility and known data gaps.
          </p>
          <p>
            Fuel Resilience AU also links this fuel-security view into broader national resilience
            dashboards covering fertiliser, oil production, resource value, strategic resources,
            defence posture, power, infrastructure, manufacturing and the Australian economy.
          </p>
        </div>
      </div>
    </section>
  );
}

function FreshnessNotice({ latestRetrieved, updatedDisplay }) {
  const hasRefresh = Boolean(latestRetrieved);
  return (
    <section className="freshness-notice" aria-labelledby="freshness-notice-h">
      <div className="freshness-notice__inner">
        <div>
          <span className="eyebrow">Refresh and freshness</span>
          <h2 id="freshness-notice-h">
            {hasRefresh ? `Last verified source retrieval: ${updatedDisplay}` : 'Programmatic refresh not recorded yet'}
          </h2>
          <p>
            {hasRefresh
              ? 'Some feeds may still be manual, partial or stale; check the source cards below before treating any value as current.'
              : 'Programmatic refresh is not recorded yet. This page may include manual or stale public-source data. Check the source cards below before treating any value as current.'}
          </p>
        </div>
        <div className="trust-badges" aria-label="Freshness caveat labels">
          <TrustBadge kind="manual"/>
          <TrustBadge kind="partial"/>
          <TrustBadge kind="stale"/>
          <TrustBadge kind="unavailable"/>
        </div>
      </div>
    </section>
  );
}

function HowToReadPage() {
  return (
    <section className="section section--why" aria-labelledby="how-read-h">
      <div className="why-grid">
        <div>
          <span className="eyebrow">How to read this page</span>
          <h2 id="how-read-h" style={{ marginTop: 8 }}>Public-source prototype, not a live fuel finder</h2>
        </div>
        <div className="why-body">
          <p>
            This independent page shows what Australia can currently see from public
            fuel-security data, and what remains hidden because government or industry
            feeds are not published. Treat it as a public-source prototype, not an
            official government dashboard or live service-station finder.
          </p>
          <div className="trust-badges" aria-label="How to read trust labels">
            <TrustBadge kind="observed"/>
            <TrustBadge kind="partial"/>
            <TrustBadge kind="unavailable"/>
            <TrustBadge kind="stale"/>
          </div>
        </div>
      </div>
    </section>
  );
}

function PublishingNeedsChecklist() {
  const rows = [
    {
      item: 'Live station fuel availability',
      why: 'Travellers and operators need to know where fuel is actually available.',
      label: 'Missing / unavailable',
      kind: 'unavailable',
    },
    {
      item: 'Station-level outage feed',
      why: 'Shows dry sites by region, product and time.',
      label: 'Missing / unavailable',
      kind: 'unavailable',
    },
    {
      item: 'Live tanker ETAs',
      why: 'Shows timing of inbound supply.',
      label: 'Missing / unavailable',
      kind: 'unavailable',
    },
    {
      item: 'Terminal capacity and inventory',
      why: 'Shows local storage resilience and supply pressure.',
      label: 'Missing / unavailable',
      kind: 'unavailable',
    },
    {
      item: 'Product-level national pump prices',
      why: 'Shows price pressure beyond one public ULP 91 context row.',
      label: 'Partial',
      kind: 'partial',
    },
    {
      item: 'Regional fuel risk zones',
      why: 'Helps tourism, freight and remote communities plan.',
      label: 'Not safe to publish yet',
      kind: 'unavailable',
    },
  ];

  return (
    <section className="section" aria-labelledby="publish-needed-h">
      <div className="section__head">
        <div>
          <span className="eyebrow">Missing public feeds</span>
          <h2 id="publish-needed-h">What government and industry still need to publish</h2>
          <p className="section__lede">
            This prototype shows what can be built from public-source data. A true national
            fuel dashboard would need several feeds that are not currently available as
            source-safe public data.
          </p>
        </div>
      </div>
      <div className="data-table-wrap">
        <table className="data-table data-table--plain">
          <thead>
            <tr>
              <th>Needed feed</th>
              <th>Why it matters</th>
              <th>Current status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.item}>
                <td>{row.item}</td>
                <td>{row.why}</td>
                <td><TrustBadge kind={row.kind}>{row.label}</TrustBadge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function TravellersAndTourismSection() {
  const rows = [
    {
      question: 'Can I see live station availability?',
      answer: 'Not yet. No national live dry-site feed is loaded.',
      label: 'Unavailable',
      kind: 'unavailable',
    },
    {
      question: 'Can I see state-level stock-outs?',
      answer: 'Partially. PM&C state/territory stock-out rows are loaded where available.',
      label: 'Partial',
      kind: 'partial',
    },
    {
      question: 'Can I see Queensland-specific unavailable reports?',
      answer: 'Partially. QLD Open Data unavailable-fuel rows are loaded monthly, but this is not live station availability.',
      label: 'Partial',
      kind: 'partial',
    },
    {
      question: 'Can I see inbound supply risk?',
      answer: 'Partially. Aggregate tanker counts and forward import orders are loaded, but no vessel ETAs or cargo-level live feed.',
      label: 'Partial',
      kind: 'partial',
    },
    {
      question: 'Can I use this as a trip-planning fuel finder?',
      answer: 'No. This dashboard is a public-source fuel-security prototype, not a live service-station finder.',
      label: 'Unavailable',
      kind: 'unavailable',
    },
  ];

  return (
    <section className="section" aria-labelledby="travellers-h">
      <div className="section__head">
        <div>
          <span className="eyebrow">Public use</span>
          <h2 id="travellers-h">For travellers and tourism operators</h2>
          <p className="section__lede">
            These are planning answers, not live operating instructions. The page is useful
            for seeing source-backed visibility and gaps, but it is not a service-station finder.
          </p>
        </div>
      </div>
      <div className="sources-grid sources-grid--compact">
        {rows.map(row => (
          <article className="source-card" key={row.question}>
            <div className="card-status-row">
              <h4>{row.question}</h4>
              <TrustBadge kind={row.kind}>{row.label}</TrustBadge>
            </div>
            <p className="body-sm">{row.answer}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function QueenslandVisibility({ stockoutsEnv, qldReportsEnv }) {
  const stockoutFields = fields(stockoutsEnv);
  const qldFields = fields(qldReportsEnv);

  return (
    <section className="section" aria-labelledby="qld-visibility-h">
      <div className="section__head">
        <div>
          <span className="eyebrow">Queensland visibility</span>
          <h2 id="qld-visibility-h">Partial Queensland fuel visibility, not live station coverage</h2>
          <p className="section__lede">
            Queensland is visible through partial public-source coverage: PM&C state/territory
            stock-out rows and monthly QLD Open Data unavailable-fuel reports. This does not
            replace a live station-level availability feed for tourists, freight or regional operators.
          </p>
        </div>
      </div>
      <div className="metric-grid metric-grid--4">
        <SecurityCard eyebrow="Partial coverage" title="QLD petrol stock-outs" value={fmtNumber(stockoutFields.qld_petrol)} unit="sites" env={stockoutsEnv} partial>
          PM&C Queensland petrol row. Seven-day change: {fmtChange(stockoutFields.qld_petrol_change_7d)}.
        </SecurityCard>
        <SecurityCard eyebrow="Partial coverage" title="QLD diesel stock-outs" value={fmtNumber(stockoutFields.qld_diesel)} unit="sites" env={stockoutsEnv} partial>
          PM&C Queensland diesel row. Seven-day change: {fmtChange(stockoutFields.qld_diesel_change_7d)}.
        </SecurityCard>
        <SecurityCard eyebrow="Partial coverage" title="QLD unavailable fuel reports" value={fmtNumber(latest(qldReportsEnv))} unit="reports" env={qldReportsEnv} partial>
          Monthly QLD Open Data rows where Price = 9999. Latest resource: {qldFields.latest_resource_name || 'not specified'}.
        </SecurityCard>
        <SecurityCard eyebrow="Unavailable" title="QLD live station availability" env={{ status: 'unavailable', source_name: 'No source-safe live Queensland station feed loaded' }} unavailable>
          No live station-level availability feed is loaded. No Queensland town, route or station coverage is inferred.
        </SecurityCard>
      </div>
      <div style={{ height: 20 }}/>
      <div className="data-table-wrap">
        <table className="data-table data-table--plain">
          <thead>
            <tr>
              <th>Queensland public signal</th>
              <th>Loaded value</th>
              <th>Source boundary</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>PM&C petrol stock-outs</td>
              <td>{fmtNumber(stockoutFields.qld_petrol)} sites; 7-day change {fmtChange(stockoutFields.qld_petrol_change_7d)}</td>
              <td>State-level row only; no station names, towns or live availability.</td>
            </tr>
            <tr>
              <td>PM&C diesel stock-outs</td>
              <td>{fmtNumber(stockoutFields.qld_diesel)} sites; 7-day change {fmtChange(stockoutFields.qld_diesel_change_7d)}</td>
              <td>State-level row only; no station names, towns or live availability.</td>
            </tr>
            <tr>
              <td>QLD unavailable fuel reports</td>
              <td>{fmtNumber(latest(qldReportsEnv))} monthly reports; latest unavailable report date {qldFields.latest_unavailable_report_date || '-'}</td>
              <td>Monthly change-report coverage where Price = 9999; not a current statewide dry-site count.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
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

  return (
    <div className="page">
      <Header active="fuel_security" updated={latestRetrieved ? updatedDisplay : ''}/>

      <main id="main">
        <section className="intro" id="fuel-security">
          <div>
            <span className="eyebrow">National fuel security dashboard</span>
            <h1 style={{ marginTop: 12 }}>What a transparent Australian fuel dashboard should show.</h1>
            <p className="intro__lede">
              This independent public-source prototype shows Australia's fuel security position using only
              source-linked data: official public status, days of cover, MSO reserves, product stocks,
              imports, inbound tanker visibility, retail stock-outs, price pressure and known missing
              feeds. It does not invent live values where government or industry data is not publicly
              available, and it is not an official government dashboard or live service-station finder.
            </p>
          </div>
          <aside className="intro__meta" aria-label="National fuel security status">
            <strong>Official public level</strong>
            <span className="mono">{officialLevel}</span>
            <div style={{ height: 12 }}/>
            <strong>Dashboard status model</strong>
            <span className="mono">Status unavailable</span>
          </aside>
        </section>

        <DataCoverage data={data}/>

        <FreshnessNotice latestRetrieved={latestRetrieved} updatedDisplay={updatedDisplay}/>

        <HowToReadPage/>

        <PublicRequestAlignment/>

        <WhatThisPageAnswers/>

        <PublishingNeedsChecklist/>

        <TravellersAndTourismSection/>

        <QueenslandVisibility
          stockoutsEnv={data.pmc_retail_stockouts}
          qldReportsEnv={data.qld_fuel_security_unavailable_reports}
        />

        <MoreThanPumpPrices/>

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
              <StatusBlockers env={data.fuel_security_status_model}/>
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
            <SecurityCard eyebrow="Partial coverage" title="Public-feed ULP 91 price pressure" value={fmtNumber(latest(data.aus_retail_fuel_multistate), 1)} unit="c/L" env={data.aus_retail_fuel_multistate} partial>
              Multi-state public-feed ULP 91 average. This is price-pressure context, not complete national all-product pump-price coverage.
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
              <h2 id="import-risk">Inbound fuel evidence board, not a live map</h2>
              <p className="section__lede">
                This section uses source-safe aggregate public data only. It does not plot
                ships, AIS positions, vessel names, port-call ETAs or shipment-level private
                logistics records.
              </p>
            </div>
          </div>
          <ShippingVisibility
            tankersEnv={data.pmc_tankers_on_water}
            forwardOrdersEnv={data.pmc_forward_import_orders}
            importsEnv={data.abs_petroleum_imports}
            liveVesselEnv={data.fuel_security_live_vessel_tracking}
          />
          <div className="methodology">
            <h3>Import visibility boundary</h3>
            <dl>
              <dt>Loaded</dt>
              <dd>PM&C aggregate tankers and four-week import orders, APS monthly product imports, and ABS petroleum import value.</dd>
              <dt>Not loaded</dt>
              <dd>Vessel names, AIS positions, ETA-level port calls, cargo inference, ports, terminals, shipping lanes or vessel locations.</dd>
            </dl>
          </div>
        </section>

        <section className="section" aria-labelledby="outages">
          <div className="section__head">
            <div>
              <span className="eyebrow">5. Outage and disruption visibility</span>
              <h2 id="outages">Retail stock-outs are a dated partial snapshot</h2>
              <p className="section__lede">
                PM&C publishes state/territory retail stock-out counts. WA publishes a weekly statewide
                stockout snapshot. QLD Open Data exposes monthly unavailable-fuel reports. None of
                these are a live national dry-station feed.
              </p>
            </div>
          </div>
          <div className="metric-grid">
            <SecurityCard eyebrow="Partial coverage" title="Australia diesel stock-outs" value={fmtNumber(latest(data.pmc_retail_stockouts))} unit="sites" env={data.pmc_retail_stockouts} partial>
              Australia-wide diesel stock-out count from the PM&C table.
            </SecurityCard>
            <SecurityCard eyebrow="Partial coverage" title="WA weekly stockouts" value={fmtNumber(latest(data.wa_fuel_security_stockouts))} unit="sites" env={data.wa_fuel_security_stockouts} partial>
              WA-only dated public update. The source reports 10 stockouts out of 771 stations statewide, not station-level live availability.
            </SecurityCard>
            <SecurityCard eyebrow="Partial coverage" title="QLD unavailable fuel reports" value={fmtNumber(latest(data.qld_fuel_security_unavailable_reports))} unit="reports" env={data.qld_fuel_security_unavailable_reports} partial>
              Monthly Queensland Open Data rows where Price = 9999. The source says this means temporarily unavailable fuel stock; it is not a live station outage count.
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
                  <th>7-day change</th>
                  <th>Diesel stock-outs</th>
                  <th>7-day change</th>
                </tr>
              </thead>
              <tbody>
                {stockoutRows.map(row => (
                  <tr key={row[0]}>
                    <td>{row[0]}</td>
                    <td className={row[1] === null || row[1] === undefined ? 'unavail' : ''}>{fmtNumber(row[1])}</td>
                    <td className={row[2] === null || row[2] === undefined ? 'unavail' : ''}>{fmtChange(row[2])}</td>
                    <td className={row[3] === null || row[3] === undefined ? 'unavail' : ''}>{fmtNumber(row[3])}</td>
                    <td className={row[4] === null || row[4] === undefined ? 'unavail' : ''}>{fmtChange(row[4])}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="caption mono">
            Geographic coverage: state and territory rows plus an Australia-wide diesel total from PM&C.
            The source table does not publish an Australia-wide petrol total, so that cell remains blank.
          </p>
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
          <div className="methodology">
            <h3>Terminal visibility boundary</h3>
            <dl>
              <dt>Loaded</dt>
              <dd>National and product stock context from PM&C MSO reserve volumes and APS stock series.</dd>
              <dt>Investigated but not loaded as capacity</dt>
              <dd>Geoscience Australia's National Liquid Fuel Terminals 2015 dataset describes terminal locations, not terminal-by-terminal capacity or live inventory.</dd>
            </dl>
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
                partial={['pmc_tankers_on_water', 'pmc_retail_stockouts', 'wa_fuel_security_stockouts', 'qld_fuel_security_unavailable_reports', 'pmc_forward_import_orders'].includes(id)}
              />
            ))}
          </div>
          <div className="methodology">
            <h3>Source investigation result</h3>
            <SourceInvestigationSummary/>
          </div>
          <div className="methodology">
            <h3>What this dashboard does not currently know</h3>
            <dl>
              <dt>Live station outages</dt>
              <dd>No public national live dry-site feed is loaded. PM&C stock-outs, the WA weekly update and QLD monthly unavailable-fuel reports are partial public coverage, not live national availability.</dd>
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
