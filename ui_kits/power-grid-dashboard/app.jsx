const SERIES = [
  'aemo_nem_average_wholesale_price',
  'aemo_nem_total_demand',
  'aemo_nem_fuel_mix',
  'aemo_generation_information_register',
  'aemo_coal_retirement_timeline',
  'cer_renewable_energy_target_progress',
  'dcceew_electricity_emissions',
  'aemo_2024_isp_summary',
  'aemo_wem_summary',
];

const POWER_STATUS_LEGEND = [
  ['observed', 'Verified', 'Source-backed and current enough for its cadence.'],
  ['partial', 'Partial', 'Source-backed, but incomplete by region, market, asset class, reliability concept or update cadence.'],
  ['stale', 'Stale', 'Source-backed, but outside its expected cadence window.'],
  ['manual', 'Manual', 'Hand-keyed from a named public source or held as a manual snapshot pending a verified row.'],
  ['derived', 'Derived', 'Calculated or selected from a named source envelope.'],
  ['source-gated', 'Source-gated', 'Waiting for a verified source, field, period, unit and reuse rights.'],
  ['unavailable', 'Unavailable', 'No public source-safe feed is loaded.'],
  ['roadmap', 'Roadmap', 'Planned dashboard area, not yet populated.'],
];

const POWER_EVIDENCE_BOUNDARY = [
  {
    title: 'Unavailable does not mean zero',
    copy: 'Unavailable means no public source-safe feed has been loaded yet. It is not a statement that outages, generation constraints, reserve-margin pressure, storage limits, transmission issues or reliability problems are zero, low or negligible.',
  },
  {
    title: 'Source-gated requires publisher verification',
    copy: 'Source-gated means the dashboard still needs a verified public source, exact field, period, unit and reuse boundary before a grid, reliability or transmission value can be published.',
  },
  {
    title: 'Grid signals are not reliability proof',
    copy: 'Observed grid signals are not treated as proof of reliability or failure unless a named source explicitly supports that link.',
  },
  {
    title: 'No estimates fill reliability gaps',
    copy: 'This page does not estimate missing generation, outage, reserve-margin, transmission, storage, coal/gas availability, renewable output, project readiness, cost-impact or reliability values.',
  },
  {
    title: 'Priority is product triage',
    copy: 'Priority language on this page is editorial/product triage only. It is not an official risk rating, Power Grid Stress Index or reliability score.',
  },
  {
    title: 'Visibility gap, not misconduct proof',
    copy: 'A missing public feed is a public visibility gap. It is not proof of wrongdoing, and likely holder or publisher fields are starting points for verification, not custody assertions.',
  },
];

function PowerStatusLegend() {
  return (
    <section className="section" aria-labelledby="power-status-legend-h">
      <div className="section__head">
        <div>
          <span className="eyebrow">Status legend</span>
          <h2 id="power-status-legend-h">Status labels used on this energy-reliability page</h2>
          <p className="section__lede">
            These labels match the Missing Data Scoreboard, Infrastructure, Manufacturing and National Fuel Security.
            They are part of the evidence, not decoration.
          </p>
        </div>
      </div>
      <div className="confidence-legend" aria-label="Power-grid and energy-reliability status legend">
        <span className="confidence-legend__label">Legend</span>
        <dl>
          {POWER_STATUS_LEGEND.map(([kind, label, copy]) => (
            <React.Fragment key={kind}>
              <dt><TrustBadge kind={kind}>{label}</TrustBadge></dt>
              <dd>{copy}</dd>
            </React.Fragment>
          ))}
        </dl>
      </div>
    </section>
  );
}

function PowerAuditSummary() {
  const cards = [
    {
      title: 'Publicly visible grid signals',
      eyebrow: 'Source-backed indicator',
      copy: 'AEMO NEM price and demand are fetched where verified. Fuel mix, generation-register totals, coal closure rows, RET context, emissions, ISP and WEM rows are loaded as named public snapshots.',
      href: '#metrics-h',
    },
    {
      title: 'Partial and manual reliability feeds',
      eyebrow: 'Partial feed / manual snapshot',
      copy: 'Manual rows provide official context, but they are not live outage feeds, reserve margins, unit availability, project-readiness values or transmission constraint datasets.',
      href: '#sources',
    },
    {
      title: 'Source-gated transmission or generation feeds',
      eyebrow: 'Requires publisher verification',
      copy: 'Generation availability, outage totals, reserve margins, storage availability, transmission constraints, coal/gas availability, renewable output and project readiness are not inferred from broad grid indicators.',
      href: '#sources',
    },
    {
      title: 'Highest-priority grid visibility gaps',
      eyebrow: 'Editorial/product triage only',
      copy: 'The most useful next feeds would separate live/near-live outage visibility, reserve margin, transmission constraints, storage availability, generation availability, fuel dependency and event-readiness boundaries.',
      href: '#sources',
    },
  ];

  return (
    <section className="section" aria-labelledby="power-summary-h">
      <div className="section__head">
        <div>
          <span className="eyebrow">30-second power-grid summary</span>
          <h2 id="power-summary-h">What the energy-reliability audit can and cannot show</h2>
          <p className="section__lede">
            These cards use categorical summaries rather than invented counts. They explain what is verifiable,
            what is partial, and what readers should not infer about reliability or collapse.
          </p>
        </div>
      </div>
      <div className="quick-link-grid quick-link-grid--4">
        {cards.map(card => (
          <article className="quick-link-card" key={card.title}>
            <span className="eyebrow">{card.eyebrow}</span>
            <h3>{card.title}</h3>
            <p>{card.copy}</p>
            <a href={card.href}>Jump to evidence</a>
            <span className="audit-stamp">Last reviewed: metadata pending</span>
          </article>
        ))}
      </div>
    </section>
  );
}

function PowerEvidenceBoundary() {
  return (
    <section className="section section--why" aria-labelledby="power-evidence-boundary-h">
      <div className="section__head">
        <div>
          <span className="eyebrow">Evidence boundary</span>
          <h2 id="power-evidence-boundary-h">What readers should not assume from missing or partial grid data</h2>
          <p className="section__lede">
            Read these statements before interpreting any grid, reliability, transmission or
            readiness gap. They define how this public-source audit treats unavailable and
            source-gated information.
          </p>
        </div>
      </div>
      <div className="source-grid">
        {POWER_EVIDENCE_BOUNDARY.map(item => (
          <article className="source-card" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function PowerRelatedSurfaces() {
  const links = [
    {
      title: 'Missing Data Scoreboard',
      copy: 'Open the national audit of public-data gaps, likely publishers and next source actions.',
      href: '../missing-data-scoreboard/index.html',
      label: 'Open Missing Data Scoreboard',
    },
    {
      title: 'Infrastructure',
      copy: 'Project-delivery, transport and logistics signals that depend on reliable energy systems.',
      href: '../infrastructure-dashboard/index.html',
      label: 'Open Infrastructure',
    },
    {
      title: 'Manufacturing',
      copy: 'Industrial-capacity signals that depend on energy reliability and input visibility.',
      href: '../manufacturing-dashboard/index.html',
      label: 'Open Manufacturing',
    },
    {
      title: 'National Fuel Security',
      copy: 'Fuel availability, reserve context and missing operational feeds that shape backup and logistics resilience.',
      href: '../fuel-security-dashboard/index.html',
      label: 'Open National Fuel Security',
    },
    {
      title: 'Housing Pressure',
      copy: 'Household pressure context that overlaps with bills, rates, supply, construction and population growth.',
      href: '../housing-economic-pressure-dashboard/index.html',
      label: 'Open Housing Pressure',
    },
    {
      title: 'Brisbane 2032 Readiness',
      copy: 'Event power, backup, public-safety and emergency-logistics gaps that must stay separate from general grid context.',
      href: '../brisbane-2032-readiness-dashboard/index.html',
      label: 'Open Brisbane 2032 Readiness',
    },
    {
      title: 'Sources and methodology',
      copy: 'Jump to the source envelopes loaded by this page and the no-reliability-claim methodology.',
      href: '#sources',
      label: 'Open power-grid methodology',
    },
  ];

  return (
    <section className="section" aria-labelledby="power-related-h">
      <div className="section__head">
        <div>
          <span className="eyebrow">Audit navigation</span>
          <h2 id="power-related-h">Open related public-data surfaces</h2>
          <p className="section__lede">
            Power-grid reliability connects to infrastructure, manufacturing, fuel, housing
            pressure, event readiness, freight and logistics. These links keep observed grid
            data separate from unsupported reliability claims.
          </p>
        </div>
      </div>
      <div className="quick-link-grid quick-link-grid--4">
        {links.map(link => (
          <article className="quick-link-card" key={link.title}>
            <h3>{link.title}</h3>
            <p>{link.copy}</p>
            <a href={link.href}>{link.label}</a>
          </article>
        ))}
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
        <Header active="power_grid" refreshStatus={refreshStatus}/>
        <main id="main"><div className="loading-wrap">Loading source envelopes...</div></main>
      </div>
    );
  }

  const latestRetrieved = window.FR.latestVerifiedRetrieved(data);
  const updatedDisplay = window.FR.fmtVerifiedUpdated(latestRetrieved);

  const priceFields = (data.aemo_nem_average_wholesale_price && data.aemo_nem_average_wholesale_price.extra && data.aemo_nem_average_wholesale_price.extra.fields) || {};
  const demandFields = (data.aemo_nem_total_demand && data.aemo_nem_total_demand.extra && data.aemo_nem_total_demand.extra.fields) || {};

  const region = (key) => {
    const px = priceFields[`region_${key}_latest`];
    const dx = demandFields[`region_${key}_latest`];
    return { price: typeof px === 'number' ? px : null, demand: typeof dx === 'number' ? dx : null };
  };
  const NSW = region('nsw1');
  const VIC = region('vic1');
  const QLD = region('qld1');
  const SA  = region('sa1');
  const TAS = region('tas1');
  const cardNumber = (env, dp = 0) => env.values.at(-1).v.toLocaleString('en-AU', { minimumFractionDigits: dp, maximumFractionDigits: dp });
  const fmt = (n, dp) => (n === null ? '-' : n.toLocaleString('en-AU', { minimumFractionDigits: dp, maximumFractionDigits: dp }));
  const haveRegional = priceFields.latest_month && Object.keys(priceFields).length > 1;

  return (
    <div className="page">
      <Header active="power_grid" refreshStatus={refreshStatus} updated={latestRetrieved ? updatedDisplay : ''}/>

      <main id="main">
        {/* INTRO */}
        <section className="intro" id="power-grid">
          <div>
            <span className="eyebrow">Power grid and energy reliability audit prototype</span>
            <h1 style={{ marginTop: 12 }}>What Australia&rsquo;s public power-grid data can verify - and what remains source-gated</h1>
            <p className="intro__lede">
              This dashboard separates source-backed power-grid and energy-reliability indicators
              from partial, manual and source-gated feeds so readers can see grid-readiness
              signals without invented certainty.
            </p>
            <p className="intro__lede">
              How much electricity Australia uses, what it costs at the wholesale level, what
              fuels generate it, where the plants are, and which ones are scheduled to retire.
              The National Electricity Market (NEM) covers the eastern states and South
              Australia; Western Australia runs its own separate market (the WEM). These broad
              signals are not verified outage totals, reserve margins, transmission constraints,
              storage availability, project readiness or proof of reliability or failure.
            </p>
          </div>
          <aside className="intro__meta" aria-label="Publication details">
            <strong>Verified data retrieved</strong>
            <span className="mono">{updatedDisplay}</span>
            <div style={{ height: 12 }}/>
            <strong>Boundary</strong>
            <span>Independent public-source prototype. No reliability claim is invented from partial grid data.</span>
            <div style={{ height: 12 }}/>
            <strong>Last reviewed</strong>
            <span>metadata pending</span>
          </aside>
        </section>

        <PowerStatusLegend/>
        <PowerAuditSummary/>
        <PowerEvidenceBoundary/>
        <PowerRelatedSurfaces/>

        <DataCoverage data={data} refreshStatus={refreshStatus}/>

        {/* WHY THIS MATTERS */}
        <section className="section section--why" aria-labelledby="why">
          <div className="why-grid">
            <div>
              <span className="eyebrow">What this is</span>
              <h2 id="why" style={{ marginTop: 8 }}>Grid source status comes first</h2>
            </div>
            <div className="why-body">
              <p>
                Wholesale electricity prices flow through to retail bills with a lag of months
                to a year. The fuel mix decides emissions, vulnerability to coal-plant outages,
                and how much firming the grid needs as more solar and wind come on. Coal
                retirement timing drives every transmission and battery decision in the AEMO
                Integrated System Plan.
              </p>
              <p>
                This page tracks the public numbers behind those choices: NEM-wide and
                per-state wholesale price, total operational demand, fuel mix, the AEMO
                Generation Information register (every plant in the country with capacity
                and expected closure year), and headline forecasts from AEMO's Integrated
                System Plan. Values appear only when the named publisher has been verified.
              </p>
              <p>
                A missing outage, generation availability, reserve-margin, transmission,
                storage or reliability feed is a public visibility gap. It is not evidence that
                the grid is reliable, unreliable, collapsing, unconstrained or fully secure.
              </p>
              <p className="body-sm" style={{ color: 'var(--ink-3)', marginTop: 12 }}>
                Acronyms used here: <b>NEM</b> = National Electricity Market (NSW, VIC, QLD, SA, TAS).
                <b> WEM</b> = Wholesale Electricity Market (Western Australia, separate).
                <b> RRP</b> = Regional Reference Price (wholesale price per region).
                <b> AEMO</b> = Australian Energy Market Operator.
                <b> AER</b> = Australian Energy Regulator.
                <b> CER</b> = Clean Energy Regulator.
                <b> ISP</b> = Integrated System Plan.
              </p>
            </div>
          </div>
        </section>

        {/* HEADLINE METRICS */}
        <section className="section" aria-labelledby="metrics-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Headline numbers</span>
              <h2 id="metrics-h">As of the latest publisher update</h2>
              <p className="section__lede">
                Cards marked source-gated, manual or unavailable are waiting on a verified
                publisher field, table or factual row. We do not estimate.
              </p>
            </div>
          </div>
          <div className="metric-grid metric-grid--4">
            <MetricCard
              eyebrow="Wholesale price"
              label="NEM average wholesale price"
              plain="Mean of the five NEM regional reference prices, computed from 5-minute TRADE intervals across the latest full month."
              fromEnvelope={data.aemo_nem_average_wholesale_price}
              unit=" AUD per MWh"
              highlight
            />
            <MetricCard
              eyebrow="Demand"
              label="NEM total operational demand"
              plain="Sum of mean operational demand across NSW, VIC, QLD, SA and TAS for the latest full month."
              fromEnvelope={data.aemo_nem_total_demand}
              unit=" MW"
            />
            <MetricCard
              eyebrow="Fuel mix"
              label="NEM renewable share of supply mix"
              plain="Q4 2025 share of NEM supply from distributed PV, wind, grid solar, hydro, biomass and battery, from AEMO Quarterly Energy Dynamics Table 3."
              fromEnvelope={data.aemo_nem_fuel_mix}
              valueFn={(env) => cardNumber(env, 1)}
              unit="%"
            />
            <MetricCard
              eyebrow="Renewables"
              label="NEM+SWIS renewable generation share"
              plain="2024 renewable generation share across the NEM and Western Australia's SWIS from the Clean Energy Regulator's RET administrative report."
              fromEnvelope={data.cer_renewable_energy_target_progress}
              valueFn={(env) => cardNumber(env, 0)}
              unit="%"
            />
          </div>

          <div style={{ height: 16 }}/>

          <div className="metric-grid metric-grid--4">
            <MetricCard
              eyebrow="Capacity"
              label="AEMO Generation Information listed capacity"
              plain="Listed NEM existing and development capacity in the January 2026 workbook. Includes anticipated and publicly announced projects; it is not available capacity."
              fromEnvelope={data.aemo_generation_information_register}
              valueFn={(env) => cardNumber(env, 0)}
              unit=" MW"
            />
            <MetricCard
              eyebrow="Coal retirement"
              label="Coal capacity with explicit closure dates"
              plain="Coal capacity in the January 2026 AEMO workbooks with an explicit closure date. Expected-year-only coal rows are kept separate in the notes."
              fromEnvelope={data.aemo_coal_retirement_timeline}
              valueFn={(env) => cardNumber(env, 0)}
              unit=" MW"
            />
            <MetricCard
              eyebrow="Emissions"
              label="Electricity-sector annual emissions"
              plain="Actual Energy - Electricity emissions for the year to September 2025 from DCCEEW's National Greenhouse Gas Inventory quarterly update."
              fromEnvelope={data.dcceew_electricity_emissions}
              valueFn={(env) => cardNumber(env, 1)}
              unit=" Mt CO2-e"
            />
            <MetricCard
              eyebrow="WA"
              label="WEM quarterly average energy price"
              plain="Q4 2025 average energy price in Western Australia's separate Wholesale Electricity Market, from AEMO Quarterly Energy Dynamics."
              fromEnvelope={data.aemo_wem_summary}
              valueFn={(env) => cardNumber(env, 2)}
              unit=" AUD/MWh"
            />
          </div>

          <div style={{ height: 16 }}/>

          <div className="metric-grid metric-grid--4">
            <MetricCard
              eyebrow="Forecast"
              label="AEMO 2024 ISP transmission headline"
              plain="Rounded transmission need by 2050 under the 2024 ISP Step Change and Progressive Change scenarios. This is not current built transmission."
              fromEnvelope={data.aemo_2024_isp_summary}
              valueFn={(env) => cardNumber(env, 0)}
              unit=" km"
            />
          </div>

          <div className="pending-list" aria-label="Manual power-grid source coverage">
            <article className="source-card">
              <h4>Manual source coverage</h4>
              <p className="body-sm">
                Fuel mix, generation register totals, coal closure dates, RET context,
                emissions, ISP forecast and WEM summary are hand-keyed from named official
                publications. They remain manual because the page only has stable programmatic
                access for AEMO NEM regional price and demand.
              </p>
            </article>
          </div>
        </section>

        {/* PER-STATE TABLE */}
        {haveRegional && (
        <section className="section" aria-labelledby="per-state-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">By state</span>
              <h2 id="per-state-h">Wholesale price and demand, per NEM region</h2>
              <p className="section__lede">Mean of all 5-minute TRADE intervals in the latest full month, per region. Western Australia (WEM) is a separate market and is not in this table.</p>
            </div>
          </div>
          <div className="table-wrap">
            <table className="ledger">
              <thead>
                <tr>
                  <th>Region</th>
                  <th style={{ textAlign: 'right' }}>Wholesale price (AUD/MWh)</th>
                  <th style={{ textAlign: 'right' }}>Operational demand (MW)</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>New South Wales (NSW1)</td><td style={{ textAlign: 'right' }}>{fmt(NSW.price, 2)}</td><td style={{ textAlign: 'right' }}>{fmt(NSW.demand, 0)}</td></tr>
                <tr><td>Victoria (VIC1)</td><td style={{ textAlign: 'right' }}>{fmt(VIC.price, 2)}</td><td style={{ textAlign: 'right' }}>{fmt(VIC.demand, 0)}</td></tr>
                <tr><td>Queensland (QLD1)</td><td style={{ textAlign: 'right' }}>{fmt(QLD.price, 2)}</td><td style={{ textAlign: 'right' }}>{fmt(QLD.demand, 0)}</td></tr>
                <tr><td>South Australia (SA1)</td><td style={{ textAlign: 'right' }}>{fmt(SA.price, 2)}</td><td style={{ textAlign: 'right' }}>{fmt(SA.demand, 0)}</td></tr>
                <tr><td>Tasmania (TAS1)</td><td style={{ textAlign: 'right' }}>{fmt(TAS.price, 2)}</td><td style={{ textAlign: 'right' }}>{fmt(TAS.demand, 0)}</td></tr>
              </tbody>
            </table>
          </div>
          <p className="caption" style={{ marginTop: 8 }}>Latest month: <span className="mono">{priceFields.latest_month || '-'}</span></p>
        </section>
        )}

        {/* CHARTS */}
        <section className="section" aria-labelledby="charts-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">How it's changed</span>
              <h2 id="charts-h">NEM-wide price and demand over time</h2>
              <p className="section__lede">Charts populate when verified source data is available. Hover any point, or use arrow keys, to read the value.</p>
            </div>
          </div>

          <div className="charts-grid">
            <ChartCard
              eyebrow="Wholesale price"
              title="NEM average wholesale price, monthly"
              unit="AUD per MWh"
              fromEnvelope={data.aemo_nem_average_wholesale_price}
              ranges={['1Y']}
              defaultRange="1Y"
              accent="#1F3A8A"
              takeaway="Mean of the five NEM regional reference prices, computed from 5-minute TRADE intervals."
              yAxisLabel="Wholesale price (AUD/MWh)"
            />
            <ChartCard
              eyebrow="Demand"
              title="NEM total operational demand, monthly"
              unit="MW"
              fromEnvelope={data.aemo_nem_total_demand}
              ranges={['1Y']}
              defaultRange="1Y"
              accent="#0F766E"
              takeaway="Sum of mean operational demand across NSW, VIC, QLD, SA and TAS."
              yAxisLabel="Total operational demand (MW)"
            />
          </div>
        </section>

        {/* WHAT CHANGED */}
        <section className="section">
          <InsightFeed
            items={[]}
            title="What changed"
            lede="Populated from AEMO / AER / CER / DCCEEW release notes as verified data arrives."
            emptyMessage="Awaiting verified release notes for the loaded power-grid source envelopes."
          />
        </section>

        <section className="section section--why" aria-labelledby="brisbane-2032-link-h">
          <div className="why-grid">
            <div>
              <span className="eyebrow">Brisbane 2032</span>
              <h2 id="brisbane-2032-link-h" style={{ marginTop: 8 }}>For event power-readiness gaps</h2>
            </div>
            <div className="why-body">
              <p>
                This Power Grid page shows NEM price, demand, fuel-mix and planning context.
                It is not a Brisbane 2032 reliability or peak-event-demand model. The
                Brisbane 2032 Readiness page keeps event-specific power, backup and emergency
                logistics rows source-gated until official safe aggregate indicators are loaded.
              </p>
              <a href="../brisbane-2032-readiness-dashboard/index.html">Open Brisbane 2032 Readiness</a>
            </div>
          </div>
        </section>

        {/* SOURCES & METHODOLOGY */}
        <section className="section section--sources" id="sources">
          <div className="section__head">
            <div>
              <span className="eyebrow">Sources & methodology</span>
              <h2>Every dataset used on this page</h2>
              <p className="section__lede">All sources are public. Cards marked source-gated, manual or unavailable are awaiting verified values. We do not estimate, and we do not invent reliability claims.</p>
            </div>
          </div>
          <div className="sources-grid">
            {Object.entries(data).map(([id, env]) => (
              <article key={id} className="source-card">
                <h4>{env.source_name}</h4>
                <p className="body-sm">
                  {env.status === 'ok'
                    ? `Verified. ${env.values.length} data points; latest ${env.last_data_point || 'unknown'}.`
                    : 'Awaiting hand-keyed values from the named public source, or intentionally unavailable.'}
                </p>
                <p className="caption"><b>Envelope:</b> <span className="mono">{id}</span></p>
                {env.source_url && (
                  <a href={env.source_url}>{env.source_url.replace(/^https?:\/\//,'')} <Icon name="external" size={12}/></a>
                )}
                <p className="caption mono">Retrieved: {env.retrieved_at ? window.FR.fmtRetrieved(env.retrieved_at) : '-'}</p>
              </article>
            ))}
          </div>
          <div className="methodology">
            <h3>How we calculate the numbers, and what we do not claim</h3>
            <dl>
              <dt>NEM average wholesale price</dt>
              <dd>For each of the five NEM regions (NSW1, VIC1, QLD1, SA1, TAS1), the AEMO Price and Demand monthly archive is fetched from <span className="mono">aemo.com.au/aemo/data/nem/priceanddemand/PRICE_AND_DEMAND_YYYYMM_REGION.csv</span>. All 5-minute TRADE intervals in each month are averaged to a regional monthly mean, then the five regional means are averaged to a NEM-wide series. Per-region latest-month values are kept in extra.fields.</dd>
              <dt>NEM total operational demand</dt>
              <dd>Same source files; TOTALDEMAND (MW) is averaged within each region-month, then summed across regions to a NEM-wide monthly mean total operational demand.</dd>
              <dt>NEM fuel mix</dt>
              <dd>Hand-keyed from AEMO Quarterly Energy Dynamics Q4 2025 Table 3, which publishes NEM supply mix contributions by black coal, brown coal, gas, liquid fuel, distributed PV, wind, grid solar, hydro, biomass and battery. The headline card shows the renewable-plus-battery share; fossil-fuel shares remain separate in the envelope fields.</dd>
              <dt>NEM Generation Information register</dt>
              <dd>Hand-keyed from the January 2026 AEMO Generation Information workbook Summary table. The headline is listed nameplate capacity across existing and new-development rows, including anticipated and publicly announced projects. It is not available capacity, reliability or a construction guarantee.</dd>
              <dt>Scheduled coal retirements</dt>
              <dd>Subset of January 2026 AEMO coal rows with an explicit closure date. Coal units with an expected closure year but no explicit date are retained in the envelope notes rather than mixed into the headline.</dd>
              <dt>RET progress</dt>
              <dd>Hand-keyed from the Clean Energy Regulator's 2024 Renewable Energy Target Administrative Report. The headline is the reported 2024 renewable generation share across the NEM and Western Australia's SWIS, not an LRET compliance percentage.</dd>
              <dt>Electricity sector emissions</dt>
              <dd>Annual Energy - Electricity emissions in megatonnes of CO2-equivalent for the year to September 2025 from DCCEEW's National Greenhouse Gas Inventory Quarterly Update. It is not a single-quarter value.</dd>
              <dt>AEMO ISP headline</dt>
              <dd>Hand-keyed from the 2024 AEMO Integrated System Plan. The card shows the rounded transmission need by 2050 under Step Change and Progressive Change scenarios.</dd>
              <dt>WEM summary</dt>
              <dd>Hand-keyed from AEMO Quarterly Energy Dynamics Q4 2025 WEM market dynamics. The card shows Western Australia's quarterly average WEM energy price; the WEM is separate from the NEM.</dd>
              <dt>What this does not prove</dt>
              <dd>These indicators do not prove generation availability, outage totals, reserve margins, transmission constraints, storage availability, coal/gas availability, renewable output, project readiness, cost impacts, reliability or grid failure. A reliability row requires a named public source with a field, period, unit and reuse boundary.</dd>
            </dl>
          </div>
        </section>

        <Footer refreshStatus={refreshStatus} updated={latestRetrieved ? updatedDisplay : ''}/>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
