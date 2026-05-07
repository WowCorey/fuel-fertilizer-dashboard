const SERIES = [
  'olympics_2032_infrastructure_delivery',
  'olympics_2032_venue_readiness',
  'olympics_2032_transport_capacity',
  'olympics_2032_accommodation_pressure',
  'olympics_2032_tourism_pressure',
  'olympics_2032_power_reliability',
  'olympics_2032_fuel_logistics',
  'olympics_2032_supply_chain_readiness',
  'olympics_2032_public_safety_readiness',
  'olympics_2032_emergency_logistics',
  'bitre_public_transport_patronage',
  'bitre_airport_passenger_movements',
  'bitre_freight_volumes',
  'aemo_nem_total_demand',
  'aemo_nem_average_wholesale_price',
  'aemo_nem_fuel_mix',
  'pmc_retail_stockouts',
  'qld_fuel_security_unavailable_reports',
  'fuel_security_live_station_outage_feed',
  'fuel_security_terminal_capacity',
  'abs_population_quarterly',
  'nhsac_housing_target_progress',
];

const QUICK_GUIDE = [
  ['1', 'Infrastructure and venue delivery', 'Start with what is source-gated before reading any delivery claim.'],
  ['2', 'Transport and movement capacity', 'Use BITRE transport rows as historical context only, not Games capacity.'],
  ['3', 'Accommodation and tourism pressure', 'Do not infer hotel rooms, price pressure or visitor demand from housing context.'],
  ['4', 'Power, fuel and supply chains', 'Use power and fuel pages as context while event-specific resilience rows stay gated.'],
  ['5', 'Public safety and emergency logistics', 'Ask for safe aggregate indicators, not sensitive operational detail.'],
  ['6', 'What still needs publishing', 'Treat every unavailable row as a public-source request, not a value to estimate.'],
];

const INFRA_VENUE_ROWS = [
  ['Major venue delivery', 'olympics_2032_venue_readiness', 'No venue-by-venue delivery table is loaded.', 'Venue status, milestone, cost and completion claims are not published here.', 'Delivery authority / Queensland Government', 'Load official project fields with dates, scope and update cadence.'],
  ['Transport infrastructure', 'olympics_2032_infrastructure_delivery', 'Infrastructure context exists on other dashboards, but no Olympics delivery row is loaded.', 'Road, rail and venue-link project status is source-gated.', 'Queensland Government / infrastructure delivery bodies', 'Publish a machine-readable delivery tracker.'],
  ['Road / rail project readiness', 'olympics_2032_infrastructure_delivery', 'No road or rail Games-readiness status is loaded.', 'No capacity, completion, delay or risk row is inferred.', 'Transport and infrastructure agencies', 'Load official milestone rows only.'],
  ['Airport access', 'olympics_2032_transport_capacity', 'BITRE passenger movement context exists, but not event-day airport access capacity.', 'No event access, crowd or peak movement capacity is loaded.', 'Airport / transport agencies / operators', 'Publish safe capacity and readiness indicators.'],
  ['Utilities readiness', 'olympics_2032_power_reliability', 'Power grid context exists separately.', 'No event-specific utilities readiness or redundancy row is loaded.', 'Utilities / Queensland Government / AEMO where relevant', 'Publish safe aggregate reliability and readiness indicators.'],
  ['Project cost visibility', 'olympics_2032_infrastructure_delivery', 'No cost table is loaded.', 'No costs, overruns, budget risk or funding model is asserted.', 'Delivery authority / budgets / public project reports', 'Publish official cost and scope fields.'],
  ['Delivery timetable visibility', 'olympics_2032_infrastructure_delivery', 'No reusable timetable is loaded.', 'No milestone status or delivery confidence is inferred.', 'Delivery authority', 'Publish timetable and milestone update cadence.'],
  ['Public reporting cadence', 'olympics_2032_infrastructure_delivery', 'No dashboard-readable reporting cadence is loaded.', 'No current/stale reporting claim is made.', 'Delivery authority', 'Publish an update schedule and source file.'],
];

const TRANSPORT_ROWS = [
  ['Passenger movement capacity', 'source-gated', 'Visitors, workers and residents need confidence that movement demand can be absorbed.', 'Historical public transport and airport rows are context only; no Games capacity is loaded.', 'Publish official peak capacity indicators.'],
  ['Rail capacity', 'source-gated', 'Rail will carry large visitor and workforce movement loads.', 'No event-day rail capacity, service frequency or crowding metric is loaded.', 'Publish source-safe rail capacity/readiness rows.'],
  ['Bus capacity', 'source-gated', 'Bus and shuttle plans affect regional and venue access.', 'No official bus fleet, route or capacity row is loaded.', 'Publish aggregate event transport plan indicators.'],
  ['Airport capacity', 'source-gated', 'Inbound visitors affect terminals, ground transport and accommodation demand.', 'BITRE airport passenger movements are annual context only.', 'Publish official airport readiness and access fields.'],
  ['Road congestion pressure', 'source-gated', 'Road pressure affects residents, freight and tourism routes.', 'No event-day road disruption or congestion model is loaded.', 'Publish safe corridor-level indicators.'],
  ['Regional visitor movement', 'source-gated', 'Regional tourism overflow depends on transport and fuel availability.', 'No source-safe regional movement forecast is loaded.', 'Publish official regional movement assumptions.'],
  ['Event-day disruption planning', 'source-gated', 'Operators need to know what disruption planning is public.', 'No source-backed disruption feed is loaded.', 'Publish public disruption readiness indicators.'],
  ['Accessible transport readiness', 'source-gated', 'Accessibility determines whether the event can serve all users.', 'No official accessibility capacity/readiness row is loaded.', 'Publish safe accessibility indicators.'],
];

const ACCOMMODATION_ROWS = [
  ['Hotel room supply', 'source-gated', 'Accommodation supply affects tourists, workers and price pressure.', 'No official hotel-room supply or Games allocation row is loaded.', 'Scope official tourism/accommodation source.'],
  ['Short-stay accommodation pressure', 'source-gated', 'Short-stay demand can affect residents and visitors.', 'No source-safe short-stay pressure indicator is loaded.', 'Publish aggregate pressure indicators if public and safe.'],
  ['Regional visitor overflow', 'source-gated', 'Visitor overflow can shift pressure into regional centres.', 'No regional overflow forecast is loaded.', 'Publish official regional visitor assumptions.'],
  ['Tourism-route fuel risk', 'partial', 'Visitors and operators need fuel availability along travel routes.', 'Fuel pages show partial public fuel/outage context, not route-specific readiness.', 'Publish source-safe route fuel indicators.'],
  ['Price pressure', 'source-gated', 'Accommodation and tourism price pressure affects affordability and planning.', 'No price-pressure metric is loaded.', 'Publish official/public aggregate price-pressure indicators.'],
  ['Workforce availability', 'source-gated', 'Tourism, hospitality, transport and events need workforce planning.', 'No Games workforce availability row is loaded.', 'Publish workforce readiness indicators.'],
  ['Visitor demand forecasting', 'source-gated', 'Demand assumptions drive transport, accommodation and emergency planning.', 'No official visitor forecast row is loaded.', 'Publish assumptions and update cadence.'],
];

const POWER_FUEL_ROWS = [
  ['Power reliability', 'olympics_2032_power_reliability', 'Power Grid', 'Event pressure needs reliable electricity.', 'No Games-specific reliability value is loaded.', 'Publish safe reliability/readiness indicators.'],
  ['Peak event demand', 'olympics_2032_power_reliability', 'Power Grid', 'Peak demand affects venues, transport and accommodation.', 'AEMO demand context is not event-demand modelling.', 'Publish event peak-demand assumptions.'],
  ['Backup generation / resilience', 'olympics_2032_power_reliability', 'Power Grid', 'Backup resilience matters for venues and emergency services.', 'No backup/resilience row is loaded.', 'Publish safe aggregate backup readiness.'],
  ['Fuel availability for tourism routes', 'olympics_2032_fuel_logistics', 'National Fuel Security', 'Tourists and operators need fuel certainty.', 'No live route or station-level feed is loaded.', 'Publish route-level or safe regional availability indicators.'],
  ['Emergency fuel logistics', 'olympics_2032_emergency_logistics', 'Fuel Strategy / National Fuel Security', 'Emergency response depends on fuel and logistics capacity.', 'No operational fuel logistics capacity is loaded.', 'Publish safe aggregate emergency logistics indicators.'],
  ['Freight and supply-chain readiness', 'olympics_2032_supply_chain_readiness', 'Infrastructure / Food, Farms & Water', 'Food, equipment and venue supplies depend on freight resilience.', 'No event-specific supply-chain readiness row is loaded.', 'Publish official supply-chain readiness fields.'],
  ['Food/water supply pressure', 'olympics_2032_supply_chain_readiness', 'Food, Farms & Water', 'Event demand may add pressure to food and water systems.', 'No event-specific food/water pressure indicator is loaded.', 'Publish safe aggregate demand and supply indicators.'],
  ['Infrastructure dependencies', 'olympics_2032_infrastructure_delivery', 'Infrastructure', 'Project dependencies determine readiness.', 'No dependency map or status table is loaded.', 'Publish dependency and milestone table.'],
];

const SAFETY_ROWS = [
  ['Emergency service capacity', 'Safe aggregate only', 'Source-gated', 'Exact deployment detail may be sensitive.', 'Publish aggregate readiness indicators if safe.'],
  ['Hospital / health surge readiness', 'Safe aggregate only', 'Source-gated', 'Health surge planning can be sensitive and privacy-linked.', 'Publish safe capacity/readiness indicators.'],
  ['Public safety staffing', 'Safe aggregate only', 'Source-gated', 'Exact staffing deployments may be sensitive.', 'Publish aggregate staffing readiness if appropriate.'],
  ['Crowd movement', 'Safe aggregate only', 'Source-gated', 'Detailed crowd movement plans may be operationally sensitive.', 'Publish public movement readiness boundaries.'],
  ['Heat / weather risk', 'Yes, if official', 'Source-gated', 'No Games-specific heat/weather risk row is loaded.', 'Publish official risk and response indicators.'],
  ['Flood / disaster contingency', 'Safe aggregate only', 'Source-gated', 'Exact contingency operations may be sensitive.', 'Publish public aggregate preparedness indicators.'],
  ['Communications resilience', 'Safe aggregate only', 'Source-gated', 'Network resilience detail may include private/operator data.', 'Publish safe aggregate service readiness.'],
  ['Fuel / logistics support', 'Safe aggregate only', 'Source-gated', 'Exact emergency fuel holdings or routes may be sensitive.', 'Publish safe aggregate logistics indicators.'],
];

const BLOCKER_ROWS = [
  ['Project delivery visibility', 'source-gated', 'Delivery authority / Queensland Government', 'Shows whether venues and infrastructure are on track.', 'Publish delivery table with milestone dates.', 'Source-gated'],
  ['Cost transparency', 'source-gated', 'Delivery authority / budgets', 'Shows public accountability without inventing project cost.', 'Publish official cost and scope rows.', 'Source-gated'],
  ['Transport capacity', 'source-gated', 'Transport agencies / operators', 'Supports event movement and disruption planning.', 'Publish capacity/readiness indicators.', 'Source-gated'],
  ['Accommodation pressure', 'source-gated', 'Tourism agencies / industry / government', 'Supports visitor, worker and resident planning.', 'Publish safe aggregate supply/pressure rows.', 'Source-gated'],
  ['Power resilience', 'source-gated', 'Utilities / AEMO / Queensland Government', 'Supports venue, transport and public safety readiness.', 'Publish safe aggregate reliability/readiness indicators.', 'Source-gated'],
  ['Tourism route fuel certainty', 'partial', 'Government / fuel industry / retailers', 'Supports travel and regional tourism planning.', 'Publish route or regional fuel availability indicators.', 'Partial'],
  ['Emergency logistics', 'source-gated', 'Emergency agencies / government / operators', 'Supports public safety and continuity planning.', 'Publish safe aggregate logistics indicators.', 'Source-gated'],
  ['Supply-chain readiness', 'source-gated', 'Government / industry / freight operators', 'Supports food, equipment and venue operations.', 'Publish supply-chain readiness fields.', 'Source-gated'],
  ['Public reporting cadence', 'source-gated', 'Delivery authority', 'Prevents stale delivery claims.', 'Publish update cadence and latest status date.', 'Source-gated'],
  ['Government / industry coordination', 'source-gated', 'Commonwealth, Queensland, councils, utilities and operators', 'Shows who owns the missing data path.', 'Publish public boundary and source ownership.', 'Source-gated'],
];

const PUBLISH_ROWS = [
  ['Public venue/project delivery table', 'Delivery authority / Queensland Government', 'Separates delivery evidence from announcements.', 'Source-gated', 'Publish project, milestone, status, source date and cadence.'],
  ['Project timetable and milestone updates', 'Delivery authority', 'Shows accountable delivery without guessing dates.', 'Source-gated', 'Publish machine-readable milestone fields.'],
  ['Cost and budget status where public', 'Budgets / delivery authority', 'Shows public accountability.', 'Source-gated', 'Publish official cost, scope and date rows.'],
  ['Transport capacity and event-day readiness indicators', 'Transport agencies / operators', 'Supports movement planning.', 'Source-gated', 'Publish safe capacity and disruption indicators.'],
  ['Accommodation pressure indicators', 'Tourism agencies / industry / government', 'Supports visitors, workers and residents.', 'Source-gated', 'Publish safe aggregate accommodation indicators.'],
  ['Tourism-route fuel risk indicators', 'Fuel industry / government / tourism agencies', 'Supports regional travel planning.', 'Partial', 'Publish safe route or regional availability indicators.'],
  ['Power resilience and peak-demand readiness indicators', 'Utilities / AEMO / Queensland Government', 'Supports venues, transport and emergency services.', 'Source-gated', 'Publish safe aggregate power readiness rows.'],
  ['Emergency logistics aggregate indicators', 'Emergency agencies / government / operators', 'Supports public safety without exposing operations.', 'Source-gated', 'Publish safe aggregate indicators.'],
  ['Supply-chain readiness indicators', 'Government / freight / industry', 'Supports food, equipment and venue continuity.', 'Source-gated', 'Publish official supply-chain readiness rows.'],
  ['Update cadence and public dashboard boundary', 'Delivery authority / Queensland Government', 'Prevents stale or overbroad claims.', 'Source-gated', 'Publish cadence, scope and what cannot be public.'],
];

function fields(env) {
  return env?.extra?.fields || {};
}

function statusKind(label) {
  const text = String(label || '').toLowerCase();
  if (text.includes('unavailable')) return 'unavailable';
  if (text.includes('partial')) return 'partial';
  if (text.includes('manual')) return 'manual';
  if (text.includes('stale')) return 'stale';
  if (text.includes('roadmap')) return 'roadmap';
  if (text.includes('source')) return 'source-gated';
  return 'observed';
}

function GateStatus({ env, fallback = 'Source-gated', partial = false }) {
  if (env?.status === 'ok') {
    return (
      <div className="trust-badges">
        <EnvTrustBadges env={env} partial={partial}/>
      </div>
    );
  }
  return (
    <div className="trust-badges">
      <TrustBadge kind={statusKind(fallback)}>{fallback}</TrustBadge>
    </div>
  );
}

function PlainTable({ columns, rows }) {
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
                  {cellIdx === 1 && ['verified', 'partial', 'stale', 'manual', 'derived', 'unavailable', 'source-gated', 'roadmap'].includes(String(cell).toLowerCase())
                    ? <TrustBadge kind={statusKind(cell)}>{cell}</TrustBadge>
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

function GateTable({ columns, rows, data }) {
  return (
    <div className="data-table-wrap">
      <table className="data-table data-table--plain">
        <thead>
          <tr>{columns.map(col => <th key={col}>{col}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map(([name, sourceId, ...cells]) => (
            <tr key={name}>
              <td>{name}</td>
              <td><GateStatus env={data[sourceId]}/></td>
              {cells.map((cell, idx) => <td key={`${name}-${idx}`}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ContextCard({ env, label, eyebrow, copy, unit = '' }) {
  return (
    <MetricCard
      eyebrow={eyebrow}
      label={label}
      plain={copy}
      fromEnvelope={env}
      unit={unit}
      partial
    />
  );
}

function QuickGuide() {
  return (
    <section className="section section--why" aria-labelledby="guide-h">
      <div className="section__head">
        <div>
          <span className="eyebrow">Use this page in order</span>
          <h2 id="guide-h">Readiness evidence before readiness claims</h2>
          <p className="section__lede">
            Existing dashboards provide useful context, but this page keeps Brisbane 2032
            delivery, capacity, safety and logistics rows source-gated until official
            public fields are loaded.
          </p>
        </div>
      </div>
      <div className="quick-link-grid quick-link-grid--3">
        {QUICK_GUIDE.map(([step, title, copy]) => (
          <article className="quick-link-card" key={title}>
            <span className="eyebrow">{step}</span>
            <h3>{title}</h3>
            <p>{copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function SourceCard({ id, env, partial = false }) {
  const meta = env?._meta || {};
  return (
    <article className="source-card">
      <div className="card-status-row">
        <h4>{env?.source_name || meta.human_name || id}</h4>
        <EnvTrustBadges env={env} partial={partial}/>
      </div>
      <p className="body-sm">
        {env?.status === 'ok'
          ? `Loaded envelope. Latest data point ${env.last_data_point || 'not applicable'}.`
          : env?.notes || 'Source gate intentionally unavailable until a public, source-safe field exists.'}
      </p>
      <p className="caption"><b>Envelope:</b> <span className="mono">{id}</span></p>
      {meta.rights && <p className="caption"><b>Rights:</b> {meta.rights}</p>}
      {meta.citation && <p className="caption"><b>Citation:</b> {meta.citation}</p>}
      {env?.source_url && (
        <a href={env.source_url}>{env.source_url.replace(/^https?:\/\//, '')} <Icon name="external" size={12}/></a>
      )}
    </article>
  );
}

function RelationshipSection() {
  return (
    <section className="section section--why" aria-labelledby="relationship-h">
      <div className="why-grid">
        <div>
          <span className="eyebrow">Connected dashboards</span>
          <h2 id="relationship-h" style={{ marginTop: 8 }}>How this connects to the national dashboard</h2>
        </div>
        <div className="why-body">
          <p>
            Brisbane 2032 Readiness tracks Olympic delivery and event-pressure
            readiness. Infrastructure tracks broader national project and delivery
            context. Power Grid tracks energy reliability context. National Fuel
            Security tracks fuel availability and missing live feeds. Housing Pressure
            tracks accommodation and cost-pressure context. Missing Data Scoreboard
            tracks what is not yet published.
          </p>
          <div className="hero-actions" style={{ marginTop: 16 }}>
            <a className="hero-button" href="../infrastructure-dashboard/index.html">Open Infrastructure</a>
            <a className="hero-button" href="../power-grid-dashboard/index.html">Open Power Grid</a>
            <a className="hero-button" href="../fuel-security-dashboard/index.html">Open National Fuel Security</a>
            <a className="hero-button" href="../housing-economic-pressure-dashboard/index.html">Open Housing Pressure</a>
            <a className="hero-button" href="../missing-data-scoreboard/index.html">Open Missing Data Scoreboard</a>
            <a className="hero-button" href="../missing-data-scoreboard/index.html#priority-h">Open National Readiness Priority Matrix</a>
          </div>
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
        <Header active="brisbane_2032" refreshStatus={refreshStatus}/>
        <main id="main"><div className="loading-wrap">Loading source envelopes...</div></main>
      </div>
    );
  }

  const latestRetrieved = window.FR.latestVerifiedRetrieved(data);
  const updatedDisplay = window.FR.fmtVerifiedUpdated(latestRetrieved);
  const latestDataPoint = window.FR.latestPageDataPoint(data);
  const qldReportsFields = fields(data.qld_fuel_security_unavailable_reports);

  return (
    <div className="page">
      <Header active="brisbane_2032" refreshStatus={refreshStatus} updated={latestRetrieved ? updatedDisplay : ''}/>

      <main id="main">
        <section className="intro" id="brisbane-2032-readiness">
          <div>
            <span className="eyebrow">Brisbane 2032 readiness - source-gated tracker</span>
            <h1 style={{ marginTop: 12 }}>Brisbane 2032 readiness</h1>
            <p className="intro__lede">
              Tracks public-source readiness gaps for infrastructure, venues, transport,
              accommodation, tourism, power, fuel, supply chains and emergency logistics
              ahead of Brisbane 2032.
            </p>
            <p className="body-sm" style={{ marginTop: 16, color: 'var(--ink-2)' }}>
              This page is an independent public-source prototype. It does not infer venue
              delivery, project status, costs, transport capacity, accommodation pressure,
              power reliability, public safety or emergency logistics unless a named
              official/public source provides the exact field, period, unit and reuse boundary.
            </p>
          </div>
          <aside className="intro__meta" aria-label="Publication details">
            <strong>Verified data retrieved</strong>
            <span className="mono">{updatedDisplay}</span>
            <div style={{ height: 12 }}/>
            <strong>Latest source data point</strong>
            <span>{latestDataPoint || 'No source-backed readiness data point loaded'}</span>
            <div style={{ height: 12 }}/>
            <strong>Boundary</strong>
            <span>Readiness and public-delivery tracker, not an official Olympic operations dashboard.</span>
          </aside>
        </section>

        <DataCoverage data={data} refreshStatus={refreshStatus}/>

        <QuickGuide/>

        <section className="section" aria-labelledby="context-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Source-backed context</span>
              <h2 id="context-h">Existing public indicators used only as context</h2>
              <p className="section__lede">
                These envelopes are real, but none of them is treated as a Brisbane 2032
                readiness value. They explain why the missing Olympic-specific feeds matter.
              </p>
            </div>
          </div>
          <div className="metric-grid metric-grid--4">
            <ContextCard
              eyebrow="Transport context"
              label="Capital-city public transport patronage"
              env={data.bitre_public_transport_patronage}
              copy="BITRE annual patronage context only; not Games rail, bus or event-day movement capacity."
              unit=" million passenger trips"
            />
            <ContextCard
              eyebrow="Airport context"
              label="Capital-city airport movements"
              env={data.bitre_airport_passenger_movements}
              copy="BITRE annual airport movement context only; not Brisbane 2032 airport capacity."
              unit=" passenger movements"
            />
            <ContextCard
              eyebrow="Power context"
              label="NEM total operational demand"
              env={data.aemo_nem_total_demand}
              copy="AEMO NEM demand context only; not event-specific peak demand or power reliability."
              unit=" MW"
            />
            <ContextCard
              eyebrow="Fuel context"
              label="QLD unavailable fuel reports"
              env={data.qld_fuel_security_unavailable_reports}
              copy={`Monthly QLD fuel reporting context${qldReportsFields.latest_unavailable_report_date ? `; latest unavailable report date ${qldReportsFields.latest_unavailable_report_date}` : ''}. Not live route fuel readiness.`}
              unit=" reports"
            />
          </div>
        </section>

        <section className="section" aria-labelledby="infra-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Delivery source gates</span>
              <h2 id="infra-h">Infrastructure and venue delivery</h2>
              <p className="section__lede">
                A venue announcement is not the same as a machine-readable delivery tracker.
                This page keeps delivery status source-gated until official project fields are loaded.
              </p>
            </div>
          </div>
          <GateTable
            data={data}
            columns={['Delivery item', 'Current status', 'What is verified', 'What is not published', 'Likely holder / publisher', 'Next source action']}
            rows={INFRA_VENUE_ROWS}
          />
        </section>

        <section className="section section--why" aria-labelledby="transport-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Movement planning</span>
              <h2 id="transport-h">Transport and movement capacity</h2>
              <p className="section__lede">
                No transport capacity numbers are created. Historical infrastructure rows
                stay separate from Games transport planning fields.
              </p>
            </div>
          </div>
          <PlainTable
            columns={['Transport question', 'Status', 'Why it matters', 'Current blocker', 'Next source action']}
            rows={TRANSPORT_ROWS}
          />
        </section>

        <section className="section" aria-labelledby="accommodation-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Visitor pressure</span>
              <h2 id="accommodation-h">Accommodation and tourism pressure</h2>
              <p className="section__lede">
                Accommodation counts, price pressure and visitor-demand forecasts remain
                source-gated until official/public rows are loaded.
              </p>
            </div>
          </div>
          <PlainTable
            columns={['Pressure question', 'Status', 'Why it matters', 'What is missing', 'Next source action']}
            rows={ACCOMMODATION_ROWS}
          />
        </section>

        <section className="section section--why" aria-labelledby="power-fuel-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Resilience dependencies</span>
              <h2 id="power-fuel-h">Power, fuel and supply-chain readiness</h2>
              <p className="section__lede">
                Existing power, fuel, infrastructure and food-system pages provide context.
                Event-specific readiness, peak demand and logistics rows stay source-gated.
              </p>
            </div>
          </div>
          <GateTable
            data={data}
            columns={['Readiness row', 'Current status', 'Linked dashboard', 'Why it matters', 'Current blocker', 'Next source action']}
            rows={POWER_FUEL_ROWS}
          />
        </section>

        <section className="section" aria-labelledby="safety-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Safe public aggregates</span>
              <h2 id="safety-h">Public safety and emergency logistics</h2>
              <p className="section__lede">
                This dashboard asks for safe aggregate readiness indicators, not sensitive
                operational detail.
              </p>
            </div>
          </div>
          <PlainTable
            columns={['Emergency readiness row', 'Safe public aggregate possible?', 'Current publication status', 'Sensitivity note', 'Next action']}
            rows={SAFETY_ROWS}
          />
        </section>

        <section className="section section--why" aria-labelledby="blockers-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Delivery blockers</span>
              <h2 id="blockers-h">Brisbane 2032 delivery blockers matrix</h2>
              <p className="section__lede">
                Categorical blockers only. No numeric score, official risk rating or
                fake readiness model is added.
              </p>
            </div>
          </div>
          <PlainTable
            columns={['Blocker', 'Current status', 'Who likely controls it', 'Why it matters', 'Next action', 'Dashboard status']}
            rows={BLOCKER_ROWS}
          />
        </section>

        <section className="section" aria-labelledby="publish-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Missing public feeds</span>
              <h2 id="publish-h">What government still needs to publish</h2>
              <p className="section__lede">
                These are source requests. They do not imply that detailed operational
                data should be public or that missing values can be estimated.
              </p>
            </div>
          </div>
          <PlainTable
            columns={['Missing feed', 'Likely publisher', 'Why it matters', 'Current status', 'Next source action']}
            rows={PUBLISH_ROWS}
          />
        </section>

        <RelationshipSection/>

        <section className="section section--sources" id="sources" aria-labelledby="sources-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Sources and methodology</span>
              <h2 id="sources-h">Every envelope used on this page</h2>
              <p className="section__lede">
                This page deliberately loads source gates for Brisbane 2032 readiness
                fields that are not yet verified. It adds no venue status, project
                delivery status, costs, capacity, accommodation, power-reliability,
                tourism, public-safety or emergency-logistics values.
              </p>
            </div>
          </div>
          <div className="sources-grid">
            {Object.entries(data).map(([id, env]) => (
              <SourceCard
                key={id}
                id={id}
                env={env}
                partial={[
                  'bitre_public_transport_patronage',
                  'bitre_airport_passenger_movements',
                  'bitre_freight_volumes',
                  'aemo_nem_total_demand',
                  'aemo_nem_average_wholesale_price',
                  'aemo_nem_fuel_mix',
                  'pmc_retail_stockouts',
                  'qld_fuel_security_unavailable_reports',
                  'fuel_security_live_station_outage_feed',
                  'fuel_security_terminal_capacity',
                  'abs_population_quarterly',
                  'nhsac_housing_target_progress',
                ].includes(id)}
              />
            ))}
          </div>
          <div className="methodology">
            <h3>No-estimate rule</h3>
            <p>
              No Brisbane 2032 value is filled from announcements, commentary, inferred
              project status, tourism assumptions, transport assumptions, venue speculation
              or operational safety assumptions. A row stays unavailable or source-gated
              until a named official/public source provides the exact field, period, unit
              and reuse boundary.
            </p>
          </div>
        </section>
      </main>

      <Footer refreshStatus={refreshStatus} updated={latestRetrieved ? updatedDisplay : ''}/>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
