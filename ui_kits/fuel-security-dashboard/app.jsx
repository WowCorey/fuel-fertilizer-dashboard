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
  'qld_fuel_hub_six_ports_official_list',
  'qld_fuel_hub_state_owned_land',
  'qld_fuel_security_eoi_portal',
  'qld_fuel_security_private_proposals',
  'qld_fuel_security_bid_status',
  'qld_refining_capacity_source_gate',
  'qld_refinery_option_status',
  'qld_domestic_fuel_production_pathway',
  'qld_taroom_trough_source_gate',
  'qld_drilling_approvals_pathway',
  'fuel_forward_contract_coverage',
  'diesel_forward_contract_coverage',
  'petrol_forward_contract_coverage',
  'jet_forward_contract_coverage',
  'emergency_reserve_contracts',
  'small_business_freight_disruption',
  'small_business_energy_price_pressure',
  'small_business_tourism_route_pressure',
  'small_business_supply_chain_delay',
  'small_business_confidence_source_gate',
  'nz_fuel_security_dashboard_source_gate',
  'nz_fuel_security_stockholding',
  'nz_fuel_import_supply_visibility',
  'nz_fuel_resilience_model_comparison',
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

function GateStatus({ env, partial = false }) {
  return <EnvTrustBadges env={env} partial={partial}/>;
}

function textOrUnavailable(value) {
  return value === null || value === undefined || value === '' ? 'Unavailable' : value;
}

function GateTable({ columns, rows }) {
  return (
    <div className="data-table-wrap">
      <table className="data-table data-table--plain data-table--sticky">
        <thead>
          <tr>{columns.map(col => <th key={col}>{col}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={row.key || idx}>
              {row.cells.map((cell, cellIdx) => (
                <td key={`${row.key || idx}-${cellIdx}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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

function FreshnessNotice({ refreshStatus, latestRetrieved, updatedDisplay }) {
  const hasSiteRefresh = refreshStatus?.status === 'success';
  const siteRefresh = window.FR?.fmtRefreshStatus ? window.FR.fmtRefreshStatus(refreshStatus) : 'Refresh status unavailable';
  const hasPageRetrieved = Boolean(latestRetrieved);
  return (
    <section className="freshness-notice" aria-labelledby="freshness-notice-h">
      <div className="freshness-notice__inner">
        <div>
          <span className="eyebrow">Refresh and freshness</span>
          <h2 id="freshness-notice-h">
            {hasSiteRefresh ? `Site refresh: ${siteRefresh}` : siteRefresh}
          </h2>
          <p>
            {hasPageRetrieved
              ? `Latest verified page data retrieved: ${updatedDisplay}. Some feeds may still be manual, partial or stale; check the source cards below before treating any value as current.`
              : 'No verified page data retrieval is recorded for these source envelopes yet. This page may include manual, partial, unavailable or stale public-source data.'}
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

function OperationalSummary30s({ data }) {
  const cov = window.FR.coverage(data);
  const verifiedCount = cov.verified;
  const derivedCount = cov.derived;
  const staleCount = cov.stale;
  const manualCount = cov.manual;
  const partialOrManual = manualCount + cov.programmatic - cov.verified - cov.derived;
  // Fall back to direct counts if math is off
  const awaitingCount = cov.awaiting;
  return (
    <section className="section" aria-labelledby="ops-30s-h">
      <div className="section__head">
        <div>
          <span className="eyebrow">30-second operational summary</span>
          <h2 id="ops-30s-h">What this page can verify in 30 seconds</h2>
          <p className="section__lede">
            Counts come from the page&rsquo;s loaded source envelopes via window.FR.coverage(). They
            describe what the dashboard tracks. They are not invented totals, risk ratings or official
            classifications.
          </p>
        </div>
      </div>
      <div className="quick-link-grid quick-link-grid--4">
        <article className="quick-link-card">
          <span className="eyebrow">Verified indicators</span>
          <span className="ops-30s__count">{verifiedCount}</span>
          <p>
            Source-backed envelopes currently fresh enough for their cadence (PM&amp;C/DCCEEW public
            level, MSO reserves and days, APS stocks/sales/imports, ABS petroleum imports).
          </p>
          <a href="#national-summary">Jump to public national signals</a>
          <span className="audit-stamp">Last reviewed: metadata pending</span>
        </article>
        <article className="quick-link-card">
          <span className="eyebrow">Derived feeds</span>
          <span className="ops-30s__count">{derivedCount}</span>
          <p>
            Reshaped from named envelopes (petrol, diesel and jet fuel days remaining, derived from
            the public MSO table; no hidden demand assumptions are introduced).
          </p>
          <a href="#days-remaining">Jump to days remaining</a>
          <span className="audit-stamp">Last reviewed: metadata pending</span>
        </article>
        <article className="quick-link-card">
          <span className="eyebrow">Partial / manual snapshots</span>
          <span className="ops-30s__count">{manualCount + (staleCount > 0 ? staleCount : 0)}</span>
          <p>
            Aggregate tanker counts, forward orders, PM&amp;C/WA/QLD retail stock-out rows and
            multi-state ULP 91 price pressure. These are manual or partial public-source snapshots,
            not live operational coverage.
          </p>
          <a href="#outages">Jump to outage visibility</a>
          <span className="audit-stamp">Last reviewed: metadata pending</span>
        </article>
        <article className="quick-link-card">
          <span className="eyebrow">Source-gated / unavailable</span>
          <span className="ops-30s__count">{awaitingCount}</span>
          <p>
            Live station availability, vessel-level shipment visibility, terminal-by-terminal
            capacity, forward fuel/fertiliser contract coverage and the dashboard status model
            stay labelled until a named public source is loaded.
          </p>
          <a href="#publish-needed-h">Jump to publishing needs</a>
          <span className="audit-stamp">Last reviewed: metadata pending</span>
        </article>
      </div>
    </section>
  );
}

const FUEL_STATUS_LEGEND = [
  ['observed', 'Verified', 'Source-backed and current enough for its cadence.'],
  ['partial', 'Partial', 'Source-backed, but incomplete by geography, product, timing or concept.'],
  ['stale', 'Stale', 'Source-backed, but outside its expected cadence window.'],
  ['manual', 'Manual', 'Hand-keyed from a named public source.'],
  ['derived', 'Derived', 'Calculated or selected from a named source envelope.'],
  ['unavailable', 'Unavailable', 'No public source-safe feed is loaded.'],
  ['source-gated', 'Source-gated', 'Waiting for a verified source, field, period, unit and reuse rights.'],
  ['roadmap', 'Roadmap', 'Planned dashboard area, not yet populated.'],
];

function StatusLegendAtGlance() {
  return (
    <section className="section section--why" aria-labelledby="legend-h">
      <div className="section__head">
        <div>
          <span className="eyebrow">Status legend</span>
          <h2 id="legend-h">Status labels used on this page</h2>
          <p className="section__lede">
            The same vocabulary is used across the Missing Data Scoreboard, this dashboard and every
            other surface in the audit. Status labels are categorical, not numeric scores.
          </p>
        </div>
      </div>
      <div className="source-grid">
        {FUEL_STATUS_LEGEND.map(([kind, label, copy]) => (
          <article className="source-card" key={kind}>
            <TrustBadge kind={kind}>{label}</TrustBadge>
            <h3>{label}</h3>
            <p>{copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

const FUEL_EVIDENCE_BOUNDARY = [
  {
    title: 'Unavailable does not mean zero',
    copy: 'Unavailable means no public source-safe feed is loaded yet. It is not a statement that fuel cover, stocks, reserves, imports, station availability or terminal capacity is zero, low or negligible.',
  },
  {
    title: 'Source-gated is a publishing boundary',
    copy: 'Source-gated means a verified source, exact field, period, unit and reuse-rights pathway has not been loaded. The dashboard does not estimate the value while the gate is open.',
  },
  {
    title: 'No estimates fill missing values',
    copy: 'The page does not invent fuel stockpile days, reserve levels, storage capacity, import dependence, refinery throughput, shipping metrics or risk ratings. Missing data stays visible until a named public source supports it.',
  },
  {
    title: 'No published status model',
    copy: 'The dashboard does not publish its own Stable / Tight / Disrupted / Critical national status until the underlying coverage is observed. The official PM&C/DCCEEW public level stays visible without being reinterpreted.',
  },
  {
    title: 'Priority bands are editorial triage',
    copy: 'Where the audit calls a gap immediate, high or medium priority, that is editorial/product triage only, not an official risk rating or government assessment.',
  },
  {
    title: 'A visibility gap is not proof of misconduct',
    copy: 'A missing public feed is a public visibility gap, not evidence of wrongdoing. Some data may be sensitive, in roll-out, or simply not yet published in a machine-readable form.',
  },
];

function EvidenceBoundary() {
  return (
    <section className="section section--why" aria-labelledby="evidence-boundary-h">
      <div className="section__head">
        <div>
          <span className="eyebrow">Evidence boundary</span>
          <h2 id="evidence-boundary-h">What this dashboard does, and does not, claim</h2>
          <p className="section__lede">
            Read these statements before interpreting any indicator, status or priority band on this
            page. They define how the audit treats missing public fuel-security data.
          </p>
        </div>
      </div>
      <div className="source-grid">
        {FUEL_EVIDENCE_BOUNDARY.map(item => (
          <article className="source-card" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function OpenRelatedSurfaces() {
  return (
    <section className="section" aria-labelledby="related-surfaces-h">
      <div className="section__head">
        <div>
          <span className="eyebrow">Where to go next</span>
          <h2 id="related-surfaces-h">Open related public-data surfaces</h2>
          <p className="section__lede">
            The audit splits operational fuel-security from the public-data scoreboard, Queensland
            delivery tracking and food-system feeds. These links open the related pages.
          </p>
        </div>
      </div>
      <div className="quick-link-grid quick-link-grid--4">
        <article className="quick-link-card">
          <span className="cta-card__title">Missing Data Scoreboard</span>
          <p>The flagship audit page. Names every public-data gap, the likely publisher and the next source action.</p>
          <a href="../missing-data-scoreboard/index.html">Open Missing Data Scoreboard</a>
        </article>
        <article className="quick-link-card">
          <span className="cta-card__title">Queensland Fuel Sovereignty</span>
          <p>Six-port AFIP pathway, state-owned land audit, EOI status and Taroom Trough context. Mostly source-gated.</p>
          <a href="../qld-fuel-sovereignty-dashboard/index.html">Open Queensland Fuel Sovereignty</a>
        </article>
        <article className="quick-link-card">
          <span className="cta-card__title">Food, Farms &amp; Water</span>
          <p>Fertiliser imports beside source-gated farm-diesel, water-allocation and drought feeds.</p>
          <a href="../fertilizer-dashboard/index.html">Open Food, Farms &amp; Water</a>
        </article>
        <article className="quick-link-card">
          <span className="cta-card__title">Source coverage</span>
          <p>Every envelope used on this page, with observed/partial/manual/unavailable labels and source links.</p>
          <a href="#sources">Open source coverage on this page</a>
        </article>
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
            This independent page shows what Australia can currently verify from public
            fuel-security data, and what is not yet supported by a named public source
            because the relevant government or industry feeds have not been published in
            a source-safe form. Treat it as a public-source prototype, not an official
            government dashboard or live service-station finder.
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
    {
      item: 'Six-port hub official status',
      why: 'Shows which Queensland ports are named publicly and what project status is actually verified.',
      label: 'Partial',
      kind: 'partial',
    },
    {
      item: 'State-owned land availability',
      why: 'Shows whether suitable industrial or port land is actually available for storage or refining.',
      label: 'Source-gated',
      kind: 'unavailable',
    },
    {
      item: 'EOI and private-sector bid status',
      why: 'Shows whether proposals exist, are shortlisted, assessed, awarded or contracted.',
      label: 'Mostly unavailable',
      kind: 'unavailable',
    },
    {
      item: 'Refining and storage project pipeline',
      why: 'Separates announced opportunity pathways from approved projects, capacity and delivery dates.',
      label: 'Source-gated',
      kind: 'unavailable',
    },
    {
      item: 'Drilling and approvals pathway',
      why: 'Shows what is state-approved, what needs federal approval and what remains planning context.',
      label: 'Partial',
      kind: 'partial',
    },
    {
      item: 'Forward fuel and fertiliser contracts',
      why: 'Shows whether supply is committed beyond the current month rather than inferred from shipments.',
      label: 'Unavailable',
      kind: 'unavailable',
    },
    {
      item: 'Product-specific cargo horizon',
      why: 'Shows petrol, diesel, jet fuel and fertiliser inbound visibility separately.',
      label: 'Unavailable',
      kind: 'unavailable',
    },
    {
      item: 'Port-destination visibility',
      why: 'Shows where inbound supply is expected to land without guessing from vessel movement.',
      label: 'Unavailable',
      kind: 'unavailable',
    },
    {
      item: 'Farmer decision inputs',
      why: 'Shows fertiliser cover, farm diesel risk, water allocation and freight pressure in planting windows.',
      label: 'Source-gated',
      kind: 'unavailable',
    },
    {
      item: 'Small-business planning indicators',
      why: 'Connects fuel pressure to freight, energy, tourism-route and hiring/workforce signals.',
      label: 'Source-gated',
      kind: 'unavailable',
    },
    {
      item: 'New Zealand comparison source mapping',
      why: 'Shows what NZ publishes and what Australia or Queensland would need for comparable visibility.',
      label: 'Partial',
      kind: 'partial',
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
        <table className="data-table data-table--plain data-table--sticky">
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
        <table className="data-table data-table--plain data-table--sticky">
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

function QueenslandFuelSovereigntySection({ data }) {
  const portsEnv = data.qld_fuel_hub_six_ports_official_list;
  const landEnv = data.qld_fuel_hub_state_owned_land;
  const eoiEnv = data.qld_fuel_security_eoi_portal;
  const proposalEnv = data.qld_fuel_security_private_proposals;
  const pathwayEnv = data.qld_domestic_fuel_production_pathway;
  const ports = fields(portsEnv).ports || [];
  return (
    <section className="section" aria-labelledby="qld-sovereignty-h">
      <div className="section__head">
        <div>
          <span className="eyebrow">Queensland fuel sovereignty</span>
          <h2 id="qld-sovereignty-h">Queensland fuel sovereignty and storage pathway</h2>
          <p className="section__lede">
            Queensland's public fuel-security discussion has moved beyond a dashboard alone. It now includes
            storage, refining, port infrastructure, state-owned land, drilling approvals, private-sector
            proposals and forward supply visibility. This section separates what is public, what is
            source-gated, and what government or industry would need to publish.
          </p>
        </div>
      </div>
      <div className="metric-grid metric-grid--4">
        <SecurityCard eyebrow="Observed public context" title="Official six-port pathway" value={ports.length ? ports.length : null} unit="named hubs" env={portsEnv} partial>
          Named by the Queensland Government source. No port capacity, project approval or land parcel is inferred.
        </SecurityCard>
        <SecurityCard eyebrow="Observed public context" title="State land audit" value={fields(landEnv).audit_status || null} env={landEnv} partial>
          State-wide audit is public context; parcel-level availability remains source-gated.
        </SecurityCard>
        <SecurityCard eyebrow="Observed public context" title="EOI pathway" value={fields(eoiEnv).stage || null} env={eoiEnv} partial>
          Stage and scope are public. Submission count, proponents and contracts remain unavailable.
        </SecurityCard>
        <SecurityCard eyebrow="Unavailable" title="Private bids / awards" env={proposalEnv} unavailable>
          Proposal counts, proponent names, shortlist and award status are not publicly loaded.
        </SecurityCard>
      </div>
      <div style={{ height: 20 }}/>
      <GateTable
        columns={['Variable', 'Current public evidence', 'Public confidence', 'What remains missing']}
        rows={[
          {
            key: 'ports',
            cells: [
              'Ports and hubs',
              ports.length ? ports.join(', ') : 'Awaiting official source confirmation',
              <GateStatus env={portsEnv} partial/>,
              'Site boundaries, terminal capacity, refinery capacity, land tenure and approved projects.',
            ],
          },
          {
            key: 'land',
            cells: [
              'State-owned land',
              textOrUnavailable(fields(landEnv).audit_status),
              <GateStatus env={landEnv} partial/>,
              'Public register of suitable parcels, owner/authority, availability and development constraints.',
            ],
          },
          {
            key: 'eoi',
            cells: [
              'EOI / market engagement',
              `${fields(eoiEnv).stage || 'EOI source gate'}; scope: ${fields(eoiEnv).proposal_scope || 'liquid fuel refining/storage'}`,
              <GateStatus env={eoiEnv} partial/>,
              'Number of submissions, proposal categories, proponents, shortlist and contract status.',
            ],
          },
          {
            key: 'pathway',
            cells: [
              'Drill-refine-store pathway',
              (fields(pathwayEnv).pathway_elements || ['drilling', 'refining', 'storage']).join(', '),
              <GateStatus env={pathwayEnv} partial/>,
              'Capacity, timing, delivery status, counterparties and approvals for specific projects.',
            ],
          },
        ]}
      />
    </section>
  );
}

function SixPortFuelHubPathway({ data }) {
  const portsEnv = data.qld_fuel_hub_six_ports_official_list;
  const ports = fields(portsEnv).ports || [];
  const rows = ports.length
    ? ports.map(port => ({
      key: port,
      cells: [
        port,
        'Queensland Government fuel storage/refining statement',
        'Named as a Government-owned site/port pathway; no specific capacity or project loaded.',
        'Source-gated; no parcel-level public row loaded.',
        'EOI pathway public; bid count unavailable.',
        <GateStatus env={portsEnv} partial/>,
        'Named hub only. Do not infer terminals, storage tanks, refinery works or approved proponents.',
      ],
    }))
    : [{
      key: 'unverified',
      cells: [
        'Six ports referenced publicly',
        'Awaiting official source confirmation',
        'Awaiting verified public source',
        'Unavailable',
        'Unavailable',
        <GateStatus env={portsEnv}/>,
        'No ports are guessed without an official list.',
      ],
    }];

  return (
    <section className="section" aria-labelledby="six-port-h">
      <div className="section__head">
        <div>
          <span className="eyebrow">Port pathway</span>
          <h2 id="six-port-h">Six-port fuel hub pathway</h2>
          <p className="section__lede">
            The official Queensland source names the six hubs, but this dashboard does not infer
            storage tanks, refinery capacity, state-owned land parcels, port destination flows or proposal status.
          </p>
        </div>
      </div>
      <GateTable
        columns={['Port / hub', 'Evidence source', 'Storage/refining relevance', 'State-owned land visibility', 'EOI/bid status', 'Public confidence', 'Current status']}
        rows={rows}
      />
    </section>
  );
}

function StateLandAndIndustrialHubs({ data }) {
  const landEnv = data.qld_fuel_hub_state_owned_land;
  return (
    <section className="section" aria-labelledby="state-land-h">
      <div className="section__head">
        <div>
          <span className="eyebrow">Industrial land</span>
          <h2 id="state-land-h">State-owned land and industrial fuel hubs</h2>
          <p className="section__lede">
            A land audit is visible as public context. The dashboard does not list parcels, infer ownership
            from maps or treat a port name as a confirmed storage site.
          </p>
        </div>
      </div>
      <GateTable
        columns={['Location / hub', 'Land owner / public authority', 'Intended use', 'Development status', 'Approval status', 'Source confidence', 'Notes']}
        rows={[
          {
            key: 'audit',
            cells: [
              'Queensland industrial and port land audit',
              'OCG / EDQ source gate',
              'Potential fuel refining and storage projects',
              textOrUnavailable(fields(landEnv).audit_status),
              'Unavailable by site',
              <GateStatus env={landEnv} partial/>,
              'No land parcels, hectares, tenure, constraints or shortlisted sites are loaded.',
            ],
          },
        ]}
      />
    </section>
  );
}

function PrivateSectorEOISection({ data }) {
  const eoiEnv = data.qld_fuel_security_eoi_portal;
  const proposalEnv = data.qld_fuel_security_private_proposals;
  const bidEnv = data.qld_fuel_security_bid_status;
  return (
    <section className="section" aria-labelledby="eoi-h">
      <div className="section__head">
        <div>
          <span className="eyebrow">Market engagement</span>
          <h2 id="eoi-h">Private-sector proposals and EOI status</h2>
          <p className="section__lede">
            The public EOI process is visible. Bid numbers, proponent identities, proposal categories,
            shortlist status and award/contract status remain government-held unless published.
          </p>
        </div>
      </div>
      <GateTable
        columns={['Field', 'Public availability', 'Coverage period', 'Volume / count visibility', 'Current status', 'Source confidence']}
        rows={[
          { key: 'portal', cells: ['EOI portal link', 'Public official page and form link', 'Stage 1', 'No submission count', fields(eoiEnv).stage || 'EOI open', <GateStatus env={eoiEnv} partial/>] },
          { key: 'proposals', cells: ['Proposal categories', 'Not publicly published as data', '-', 'Unavailable', 'Government-held feed required', <GateStatus env={proposalEnv}/>] },
          { key: 'bids', cells: ['Shortlist / award status', 'Not publicly published as data', '-', 'Unavailable', 'Government-held feed required', <GateStatus env={bidEnv}/>] },
        ]}
      />
    </section>
  );
}

function RefiningAndProductionPathway({ data }) {
  const pathwayEnv = data.qld_domestic_fuel_production_pathway;
  const capacityEnv = data.qld_refining_capacity_source_gate;
  const optionEnv = data.qld_refinery_option_status;
  return (
    <section className="section" aria-labelledby="refining-h">
      <div className="section__head">
        <div>
          <span className="eyebrow">Domestic capability</span>
          <h2 id="refining-h">Refining and domestic production pathway</h2>
          <p className="section__lede">
            This section connects the public Queensland pathway to existing source boundaries. APS refinery
            production remains separate from refinery capacity or utilisation, and no new refinery project is implied.
          </p>
        </div>
      </div>
      <GateTable
        columns={['Signal', 'Public source status', 'Fuel relevance', 'What is not loaded', 'Confidence']}
        rows={[
          { key: 'pathway', cells: ['Drill-refine-store pathway', (fields(pathwayEnv).pathway_elements || []).join(', ') || 'Policy pathway', 'Petrol, diesel and jet fuel resilience context', 'No delivery date, contract, capacity or approval value', <GateStatus env={pathwayEnv} partial/>] },
          { key: 'capacity', cells: ['Queensland refining capacity', 'No source-safe capacity denominator loaded', 'Potential refining context only', 'Capacity, utilisation and product yield', <GateStatus env={capacityEnv}/>] },
          { key: 'options', cells: ['Refinery option status', 'Source-gated', 'Potential project pipeline only', 'FID, build commitment, proponent and approvals', <GateStatus env={optionEnv}/>] },
        ]}
      />
    </section>
  );
}

function DrillingApprovalsPathway({ data }) {
  const taroomEnv = data.qld_taroom_trough_source_gate;
  const approvalsEnv = data.qld_drilling_approvals_pathway;
  const f = fields(taroomEnv);
  return (
    <section className="section" aria-labelledby="drilling-h">
      <div className="section__head">
        <div>
          <span className="eyebrow">Drilling and approvals</span>
          <h2 id="drilling-h">Drilling and approvals pathway</h2>
          <p className="section__lede">
            Public comments refer to a Queensland resource-development pathway linked to fuel sovereignty.
            This dashboard does not infer resource volume, commercial production or approval status without
            official source confirmation.
          </p>
        </div>
      </div>
      <GateTable
        columns={['Field', 'Public value', 'Status', 'Source confidence', 'Boundary']}
        rows={[
          { key: 'name', cells: ['Basin/trough/project name', f.official_name || 'Taroom Trough', 'Official name verified', <GateStatus env={taroomEnv} partial/>, 'This corrects the public-copy boundary without inferring volumes.'] },
          { key: 'resource', cells: ['Resource type', f.resource_type || 'oil and gas resources', 'Planning context', <GateStatus env={taroomEnv} partial/>, 'No reserve, production or commerciality claim is loaded.'] },
          { key: 'state', cells: ['State approval pathway', fields(approvalsEnv).state_pathway || 'Works regulation / Coordinator-General pathway', 'Partial public pathway', <GateStatus env={approvalsEnv} partial/>, 'Not a project-level approval for a named proponent.'] },
          { key: 'federal', cells: ['Federal approval pathway', fields(approvalsEnv).federal_pathway || 'EPBC pathway source-gated', 'Source-gated', <GateStatus env={approvalsEnv} partial/>, 'No federal approval completion is loaded.'] },
        ]}
      />
    </section>
  );
}

function ForwardContractsAndSupplyCoverage({ data }) {
  const rows = [
    ['Fuel import contracts', data.fuel_forward_contract_coverage, 'All products', 'Coverage period, volume and counterparties are not public.'],
    ['Diesel contract coverage', data.diesel_forward_contract_coverage, 'Diesel', 'No public diesel contract horizon is loaded.'],
    ['Petrol contract coverage', data.petrol_forward_contract_coverage, 'Petrol', 'No public petrol contract horizon is loaded.'],
    ['Jet fuel contract coverage', data.jet_forward_contract_coverage, 'Jet fuel', 'No public jet-fuel contract horizon is loaded.'],
    ['Fertiliser import contracts', data.fertiliser_forward_contract_coverage, 'Fertiliser', 'Fertiliser contracts are tracked on the food/farms page as source-gated.'],
    ['Emergency reserve contracts', data.emergency_reserve_contracts, 'Reserve arrangements', 'Counterparties and coverage period are unavailable unless published.'],
    ['Government-held supply agreements', data.fuel_forward_contract_coverage, 'Government-held', 'A public register or dashboard feed would be required.'],
    ['Industry-held supply agreements', data.fuel_forward_contract_coverage, 'Industry-held', 'A public, licence-safe industry feed would be required.'],
  ];
  return (
    <section className="section" aria-labelledby="contracts-h">
      <div className="section__head">
        <div>
          <span className="eyebrow">Forward coverage</span>
          <h2 id="contracts-h">Forward contracts and supply coverage</h2>
          <p className="section__lede">
            Forward import orders and tankers show aggregate public visibility. They are not contracts.
            This table keeps contract coverage unavailable until government or industry publishes it.
          </p>
        </div>
      </div>
      <GateTable
        columns={['Product', 'Public availability', 'Coverage period', 'Volume / counterparty visibility', 'Current status', 'What must be published']}
        rows={rows.map(([label, env, product, missing]) => ({
          key: label,
          cells: [product, 'Unavailable', '-', 'Unavailable', <GateStatus env={env}/>, missing],
        }))}
      />
    </section>
  );
}

function WhatIsOnItsWay({ data }) {
  return (
    <section className="section" aria-labelledby="horizon-h">
      <div className="section__head">
        <div>
          <span className="eyebrow">Supply horizon</span>
          <h2 id="horizon-h">What is on its way</h2>
          <p className="section__lede">
            The horizon view uses aggregate public data only. It does not become a live vessel map,
            port-destination tracker or cargo-level ETA feed.
          </p>
        </div>
      </div>
      <GateTable
        columns={['Supply horizon row', 'Visible / partial / unavailable', 'Source', 'What the public can know', 'What remains missing']}
        rows={[
          { key: 'tankers', cells: ['Aggregate fuel tankers', 'Partial', 'PM&C aggregate tanker counts', `${fmtMetric(latest(data.pmc_tankers_on_water), 'reported tankers')} plus crude/clean fields where loaded`, 'Vessel names, cargoes, port destinations and ETAs'] },
          { key: 'orders', cells: ['Forward import orders', 'Partial', 'PM&C forward import orders', `${fmtMetric(latest(data.pmc_forward_import_orders), 'billion L ordered', 1)} aggregate order visibility`, 'Contract terms, counterparties and product split beyond the public row'] },
          { key: 'imports', cells: ['ABS petroleum imports', 'Observed', 'ABS petroleum import value', `${fmtMetric(latest(data.abs_petroleum_imports), 'AUD thousands')}`, 'Cargo-level timing, contract status and destination ports'] },
          { key: 'diesel', cells: ['Diesel cargo visibility', 'Unavailable', 'No cargo-level public feed loaded', 'APS diesel imports are monthly historical context only', 'Inbound cargo identity, ETA and destination'] },
          { key: 'petrol', cells: ['Petrol cargo visibility', 'Unavailable', 'No cargo-level public feed loaded', 'APS petrol imports are monthly historical context only', 'Inbound cargo identity, ETA and destination'] },
          { key: 'jet', cells: ['Jet fuel cargo visibility', 'Unavailable', 'No cargo-level public feed loaded', 'No current cargo-level public feed', 'Inbound cargo identity, ETA and destination'] },
          { key: 'contracts', cells: ['Contract-backed deliveries', 'Unavailable', 'No public contract coverage feed loaded', 'No source-safe contract row', 'Coverage period, volume, counterparty and delivery schedule'] },
          { key: 'ports', cells: ['Port destination visibility', 'Unavailable', 'No live vessel or port-call feed loaded', 'No destination feed', 'Port-call ETAs and terminals'] },
          { key: 'etas', cells: ['ETA visibility', 'Unavailable', 'No live vessel feed loaded', 'No AIS/vessel layer', 'AIS positions, vessel names and ETAs'] },
        ]}
      />
    </section>
  );
}

function SmallBusinessPlanningSignals({ data }) {
  return (
    <section className="section" aria-labelledby="small-business-h">
      <div className="section__head">
        <div>
          <span className="eyebrow">Small business planning</span>
          <h2 id="small-business-h">Small business planning signals</h2>
          <p className="section__lede">
            This is a planning-gap view for small businesses deciding whether to hire, bunker down
            or work more hours. It does not turn weak signals into operating advice.
          </p>
        </div>
      </div>
      <GateTable
        columns={['Planning signal', 'Current dashboard status', 'Available public source', 'Missing source feed', 'Confidence']}
        rows={[
          { key: 'fuel', cells: ['Fuel price pressure', 'Partial', 'Public-feed retail fuel rows where available', 'Complete product-level regional pump prices', <GateStatus env={data.aus_retail_fuel_multistate} partial/>] },
          { key: 'outage', cells: ['Regional outage visibility', 'Partial', 'PM&C stock-out rows and QLD/WA partial feeds', 'Live station-level outage and route coverage', <GateStatus env={data.fuel_security_live_station_outage_feed}/>] },
          { key: 'freight', cells: ['Freight disruption indicators', 'Unavailable', 'No loaded public feed', 'Freight delay or route disruption indicator', <GateStatus env={data.small_business_freight_disruption}/>] },
          { key: 'energy', cells: ['Energy price pressure', 'Source-gated', 'Power grid dashboard separate from this page', 'Small-business energy price pressure feed', <GateStatus env={data.small_business_energy_price_pressure}/>] },
          { key: 'tourism', cells: ['Tourism route pressure', 'Unavailable', 'No route-level fuel feed', 'Tourism-route fuel availability and risk coverage', <GateStatus env={data.small_business_tourism_route_pressure}/>] },
          { key: 'supply', cells: ['Supply-chain delay indicators', 'Unavailable', 'No loaded public feed', 'Fuel-linked supply-chain delay indicator', <GateStatus env={data.small_business_supply_chain_delay}/>] },
          { key: 'confidence', cells: ['Hiring/workforce pressure', 'Unavailable', 'No loaded public feed', 'Official small-business planning/hiring indicator', <GateStatus env={data.small_business_confidence_source_gate}/>] },
        ]}
      />
    </section>
  );
}

function NewZealandComparison({ data }) {
  const stockFields = fields(data.nz_fuel_security_stockholding);
  return (
    <section className="section" aria-labelledby="nz-h">
      <div className="section__head">
        <div>
          <span className="eyebrow">New Zealand comparison</span>
          <h2 id="nz-h">New Zealand comparison</h2>
          <p className="section__lede">
            The Premier referenced New Zealand as having a version of fuel-security visibility. This comparison
            tracks what New Zealand publishes, what Australia publishes, and what Queensland would still need
            for a comparable public dashboard. It does not claim New Zealand has the same dashboard.
          </p>
        </div>
      </div>
      <GateTable
        columns={['NZ source / model', 'What NZ publishes', 'Australia equivalent', 'Queensland equivalent', 'Gap', 'Relevance']}
        rows={[
          { key: 'stockholding', cells: ['MBIE minimum stockholding obligation', `Petrol ${stockFields.petrol_days_cover || '-'} days, diesel ${stockFields.diesel_days_cover || '-'} days, jet fuel ${stockFields.jet_fuel_days_cover || '-'} days`, 'Australia has MSO/day-cover public rows but different legal design', 'No Queensland-specific equivalent loaded', 'Different law, scope and geography', <GateStatus env={data.nz_fuel_security_stockholding} partial/>] },
          { key: 'updates', cells: ['MBIE fuel supply update page', fields(data.nz_fuel_import_supply_visibility).published_update_cadence || 'Regular update cadence source-gated', 'PM&C public fuel security page and this prototype', 'QLD partial stock-out/open-data rows only', 'No Queensland daily stock dashboard loaded', <GateStatus env={data.nz_fuel_import_supply_visibility} partial/>] },
          { key: 'dashboard', cells: ['Dashboard equivalence', 'Not verified as equivalent', 'This site is independent, not official', 'No official Queensland dashboard loaded', 'Need official source mapping before comparing models', <GateStatus env={data.nz_fuel_security_dashboard_source_gate}/>] },
          { key: 'model', cells: ['Fuel resilience model comparison', 'Source-gated', 'No model-equivalence table', 'No model-equivalence table', 'Need official model/source mapping', <GateStatus env={data.nz_fuel_resilience_model_comparison}/>] },
        ]}
      />
    </section>
  );
}

function FuelPageQuickGuide() {
  const items = [
    {
      title: 'Public fuel dashboard basics',
      copy: 'Start with what the page can verify: days cover, public status, reserves, stocks, imports and stock-out visibility.',
      href: '#answers-h',
    },
    {
      title: 'Queensland visibility',
      copy: 'Use the Queensland section for partial PM&C and QLD Open Data visibility. It is not live station coverage.',
      href: '#qld-visibility-h',
    },
    {
      title: 'Fuel sovereignty pathway',
      copy: 'Use this cluster for six-port, land, EOI, refining and drilling source gates without assuming delivery status.',
      href: '#qld-sovereignty-h',
    },
    {
      title: 'What is on its way',
      copy: 'Use the horizon view for aggregate tankers and forward orders, not vessel names, ETAs or cargo-level tracking.',
      href: '#horizon-h',
    },
    {
      title: 'Missing feeds',
      copy: 'Use the publication checklist to see what government or industry would need to publish for operational certainty.',
      href: '#publish-needed-h',
    },
  ];
  return (
    <section className="section" aria-labelledby="fuel-quick-guide-h">
      <div className="section__head">
        <div>
          <span className="eyebrow">Best first clicks</span>
          <h2 id="fuel-quick-guide-h">Use this fuel page in order</h2>
          <p className="section__lede">
            The page is intentionally broader than pump prices, but it should not be read as live fuel certainty.
            Start with verified public signals, then read the missing feeds.
          </p>
        </div>
      </div>
      <div className="quick-link-grid quick-link-grid--5">
        {items.map(item => (
          <article className="quick-link-card" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.copy}</p>
            <a href={item.href}>Jump to section</a>
          </article>
        ))}
      </div>
    </section>
  );
}

function FuelStrategyCrossLink() {
  return (
    <section className="section section--why" aria-labelledby="fuel-strategy-link-h">
      <div className="why-grid">
        <div>
          <span className="eyebrow">Policy context</span>
          <h2 id="fuel-strategy-link-h">For policy, reserves and MSO context</h2>
        </div>
        <div className="why-body">
          <p>
            The National Fuel Security page shows the public dashboard structure. The Australian Fuel
            Strategy Tracker separates official policy documents, MSO/reserve indicators, product-level
            days-cover visibility, emergency-response source gates and public/private data boundaries.
          </p>
          <p>
            It does not infer strategy facts, contracts, cargoes, terminal inventories or emergency
            settings where an official/public source is not loaded.
          </p>
          <p>
            Defence procurement and naval logistics source gates are tracked separately so this
            operational fuel-security view does not imply military procurement or capability facts.
          </p>
          <p>
            Brisbane 2032 fuel and emergency-logistics questions are tracked separately so this
            national fuel page does not imply event route, venue or public-safety readiness.
          </p>
          <a href="../australian-fuel-strategy-dashboard/index.html">Open Australian Fuel Strategy Tracker</a>
          <br/>
          <a href="../defence-procurement-watch/index.html">Open Defence Procurement Watch</a>
          <br/>
          <a href="../brisbane-2032-readiness-dashboard/index.html">Open Brisbane 2032 Readiness</a>
        </div>
      </div>
    </section>
  );
}

function QueenslandDeliveryCrossLink() {
  return (
    <section className="section section--why" aria-labelledby="qld-delivery-link-h">
      <div className="why-grid">
        <div>
          <span className="eyebrow">Queensland delivery</span>
          <h2 id="qld-delivery-link-h">For Queensland delivery tracking</h2>
        </div>
        <div className="why-body">
          <p>
            For Queensland delivery tracking, see Queensland Fuel Sovereignty Delivery Tracker.
            It separates the six-port AFIP pathway, state-owned land audit, EOI status,
            storage/refining source gates and Taroom Trough approvals context from this
            operational fuel-security view.
          </p>
          <p>
            It does not infer land parcels, proponent names, bid counts, contracts, capacities
            or approval completion where a named official source is not loaded.
          </p>
          <a href="../qld-fuel-sovereignty-dashboard/index.html">Open Queensland Fuel Sovereignty Delivery Tracker</a>
        </div>
      </div>
    </section>
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
        <Header active="fuel_security" refreshStatus={refreshStatus}/>
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
      <Header active="fuel_security" refreshStatus={refreshStatus} updated={latestRetrieved ? updatedDisplay : ''}/>

      <main id="main">
        <section className="intro" id="fuel-security">
          <div>
            <span className="eyebrow">National fuel security audit</span>
            <h1 style={{ marginTop: 12 }}>What Australia&rsquo;s public fuel-security data can verify &mdash; and what it still cannot</h1>
            <p className="intro__lede">
              This dashboard separates source-backed fuel-security indicators from partial, stale,
              manual and source-gated feeds so readers can see the operational picture without
              invented certainty.
            </p>
            <p className="intro__lede" style={{ marginTop: 12 }}>
              It uses only source-linked public data: official public status, days of cover, MSO
              reserves, product stocks, imports, inbound tanker visibility, retail stock-outs, price
              pressure and known missing feeds. It does not invent live values where government or
              industry data is not publicly available, and it is not an official government
              dashboard or live service-station finder.
            </p>
          </div>
          <aside className="intro__meta" aria-label="National fuel security status">
            <strong>Official public level</strong>
            <span className="mono">{officialLevel}</span>
            <div style={{ height: 12 }}/>
            <strong>Dashboard status model</strong>
            <span className="mono">Status unavailable</span>
            <div style={{ height: 12 }}/>
            <strong>Last reviewed</strong>
            <span className="mono">metadata pending</span>
          </aside>
        </section>

        <DataCoverage data={data} refreshStatus={refreshStatus}/>

        <FreshnessNotice refreshStatus={refreshStatus} latestRetrieved={latestRetrieved} updatedDisplay={updatedDisplay}/>

        <OperationalSummary30s data={data}/>

        <StatusLegendAtGlance/>

        <EvidenceBoundary/>

        <OpenRelatedSurfaces/>

        <HowToReadPage/>

        <PublicRequestAlignment/>

        <FuelPageQuickGuide/>

        <FuelStrategyCrossLink/>

        <WhatThisPageAnswers/>

        <PublishingNeedsChecklist/>

        <TravellersAndTourismSection/>

        <QueenslandVisibility
          stockoutsEnv={data.pmc_retail_stockouts}
          qldReportsEnv={data.qld_fuel_security_unavailable_reports}
        />

        <QueenslandFuelSovereigntySection data={data}/>

        <QueenslandDeliveryCrossLink/>

        <SixPortFuelHubPathway data={data}/>

        <StateLandAndIndustrialHubs data={data}/>

        <PrivateSectorEOISection data={data}/>

        <RefiningAndProductionPathway data={data}/>

        <DrillingApprovalsPathway data={data}/>

        <ForwardContractsAndSupplyCoverage data={data}/>

        <WhatIsOnItsWay data={data}/>

        <SmallBusinessPlanningSignals data={data}/>

        <NewZealandComparison data={data}/>

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
            <table className="data-table data-table--sticky">
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

        <Footer refreshStatus={refreshStatus} updated={latestRetrieved ? updatedDisplay : ''}/>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
