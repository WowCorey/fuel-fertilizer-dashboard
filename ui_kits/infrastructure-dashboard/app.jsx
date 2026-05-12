const SERIES = [
  'abs_population_quarterly',
  'abs_population_growth_rate',
  'abs_residential_dwelling_stock',
  'nhsac_housing_target_progress',
  'bitre_public_transport_patronage',
  'bitre_airport_passenger_movements',
  'bitre_freight_volumes',
  'infrastructure_australia_priority_list',
  'accc_nbn_broadband_speeds',
  'au_data_centre_capacity_register',
];

const INFRASTRUCTURE_STATUS_LEGEND = [
  ['observed', 'Verified', 'Source-backed and current enough for its cadence.'],
  ['partial', 'Partial', 'Source-backed, but incomplete by geography, project, mode, corridor, concept or update cadence.'],
  ['stale', 'Stale', 'Source-backed, but outside its expected cadence window.'],
  ['manual', 'Manual', 'Hand-keyed from a named public source or held as a manual snapshot pending a verified row.'],
  ['derived', 'Derived', 'Calculated or selected from a named source envelope.'],
  ['source-gated', 'Source-gated', 'Waiting for a verified source, field, period, unit and reuse rights.'],
  ['unavailable', 'Unavailable', 'No public source-safe feed is loaded.'],
  ['roadmap', 'Roadmap', 'Planned dashboard area, not yet populated.'],
];

const INFRASTRUCTURE_EVIDENCE_BOUNDARY = [
  {
    title: 'Unavailable does not mean zero',
    copy: 'Unavailable means no public source-safe feed has been loaded yet. It is not a statement that project delays, logistics constraints, cost overruns, transport limits, grid constraints or readiness gaps are zero, low or negligible.',
  },
  {
    title: 'Source-gated requires publisher verification',
    copy: 'Source-gated means the dashboard still needs a verified public source, exact field, period, unit and reuse boundary before a project-delivery or logistics value can be published.',
  },
  {
    title: 'Infrastructure signals are not readiness proof',
    copy: 'Observed infrastructure indicators are not treated as proof of delivery readiness unless a named source explicitly supports that link.',
  },
  {
    title: 'No estimates fill delivery gaps',
    copy: 'This page does not estimate missing project timelines, cost overruns, completion dates, logistics capacity, freight throughput, grid constraints, construction workforce capacity or readiness scores.',
  },
  {
    title: 'Priority is product triage',
    copy: 'Priority language on this page is editorial/product triage only. It is not an official risk rating, Infrastructure Stress Index, Project Delivery Risk Index, Logistics Risk Index or Brisbane 2032 Readiness Index.',
  },
  {
    title: 'Visibility gap, not misconduct proof',
    copy: 'A missing public feed is a public visibility gap. It is not proof of wrongdoing, and likely holder or publisher fields are starting points for verification, not custody assertions.',
  },
];

function InfrastructureStatusLegend() {
  return (
    <section className="section" aria-labelledby="infrastructure-status-legend-h">
      <div className="section__head">
        <div>
          <span className="eyebrow">Status legend</span>
          <h2 id="infrastructure-status-legend-h">Status labels used on this infrastructure page</h2>
          <p className="section__lede">
            These labels match the Missing Data Scoreboard, Manufacturing, Employment &amp; Automation and National Fuel Security.
            They are part of the evidence, not decoration.
          </p>
        </div>
      </div>
      <div className="confidence-legend" aria-label="Infrastructure and project-delivery status legend">
        <span className="confidence-legend__label">Legend</span>
        <dl>
          {INFRASTRUCTURE_STATUS_LEGEND.map(([kind, label, copy]) => (
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

function InfrastructureAuditSummary() {
  const cards = [
    {
      title: 'Publicly visible infrastructure signals',
      eyebrow: 'Source-backed indicator',
      copy: 'ABS population and dwelling stock, BITRE patronage, airport and freight rows, ACCC NBN performance and NHSAC housing-target progress are loaded where verified.',
      href: '#metrics-h',
    },
    {
      title: 'Partial and manual project-delivery feeds',
      eyebrow: 'Partial feed / manual snapshot',
      copy: 'Transport, freight, airport, NBN and housing-target rows are scoped public snapshots. They are useful context, not complete delivery-readiness or corridor-capacity measures.',
      href: '#sources',
    },
    {
      title: 'Source-gated logistics or readiness feeds',
      eyebrow: 'Requires publisher verification',
      copy: 'Project timelines, cost status, delivery milestones, transport capacity, freight bottlenecks, grid constraints, construction workforce capacity and 2032 readiness are not inferred from broad infrastructure context.',
      href: '#sources',
    },
    {
      title: 'Highest-priority infrastructure visibility gaps',
      eyebrow: 'Editorial/product triage only',
      copy: 'The most useful next feeds would separate project milestone status, budget status, corridor capacity, port/rail/road throughput, freight constraints, power reliability and event-readiness boundaries.',
      href: '#sources',
    },
  ];

  return (
    <section className="section" aria-labelledby="infrastructure-summary-h">
      <div className="section__head">
        <div>
          <span className="eyebrow">30-second infrastructure summary</span>
          <h2 id="infrastructure-summary-h">What the infrastructure audit can and cannot show</h2>
          <p className="section__lede">
            These cards use categorical summaries rather than invented counts. They explain what is verifiable,
            what is partial, and what readers should not infer about project readiness.
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

function InfrastructureEvidenceBoundary() {
  return (
    <section className="section section--why" aria-labelledby="infrastructure-evidence-boundary-h">
      <div className="section__head">
        <div>
          <span className="eyebrow">Evidence boundary</span>
          <h2 id="infrastructure-evidence-boundary-h">What readers should not assume from missing or partial infrastructure data</h2>
          <p className="section__lede">
            Read these statements before interpreting any infrastructure, project-delivery,
            logistics or readiness gap. They define how this public-source audit treats
            unavailable and source-gated information.
          </p>
        </div>
      </div>
      <div className="source-grid">
        {INFRASTRUCTURE_EVIDENCE_BOUNDARY.map(item => (
          <article className="source-card" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function InfrastructureRelatedSurfaces() {
  const links = [
    {
      title: 'Missing Data Scoreboard',
      copy: 'Open the national audit of public-data gaps, likely publishers and next source actions.',
      href: '../missing-data-scoreboard/index.html',
      label: 'Open Missing Data Scoreboard',
    },
    {
      title: 'Manufacturing',
      copy: 'Industrial-capacity signals that depend on transport, freight, energy and project-delivery visibility.',
      href: '../manufacturing-dashboard/index.html',
      label: 'Open Manufacturing',
    },
    {
      title: 'National Fuel Security',
      copy: 'Fuel availability and missing live operational feeds that affect logistics, tourism, freight and emergency planning.',
      href: '../fuel-security-dashboard/index.html',
      label: 'Open National Fuel Security',
    },
    {
      title: 'Food, Farms & Water',
      copy: 'Food-system and farm-input signals that depend on freight, water, ports, fuel and regional logistics.',
      href: '../fertilizer-dashboard/index.html',
      label: 'Open Food, Farms & Water',
    },
    {
      title: 'Housing Pressure',
      copy: 'Housing and household-pressure signals that overlap with population, dwelling stock and construction delivery.',
      href: '../housing-economic-pressure-dashboard/index.html',
      label: 'Open Housing Pressure',
    },
    {
      title: 'Brisbane 2032 Readiness',
      copy: 'Olympic delivery and event-pressure gaps that must stay separate from general infrastructure context.',
      href: '../brisbane-2032-readiness-dashboard/index.html',
      label: 'Open Brisbane 2032 Readiness',
    },
    {
      title: 'Power Grid',
      copy: 'Energy reliability and demand context that shapes infrastructure and logistics resilience.',
      href: '../power-grid-dashboard/index.html',
      label: 'Open Power Grid',
    },
    {
      title: 'Sources and methodology',
      copy: 'Jump to the source envelopes loaded by this page and the no-readiness-claim methodology.',
      href: '#sources',
      label: 'Open infrastructure methodology',
    },
  ];

  return (
    <section className="section" aria-labelledby="infrastructure-related-h">
      <div className="section__head">
        <div>
          <span className="eyebrow">Audit navigation</span>
          <h2 id="infrastructure-related-h">Open related public-data surfaces</h2>
          <p className="section__lede">
            Infrastructure readiness depends on manufacturing, workforce, fuel, food systems,
            housing pressure, power reliability, logistics and project delivery. These links keep
            observed infrastructure data separate from unsupported readiness claims.
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

function latest(env) {
  if (!env || env.status !== 'ok' || !env.values?.length) return null;
  return env.values.at(-1);
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
        <Header active="infrastructure" refreshStatus={refreshStatus}/>
        <main id="main"><div className="loading-wrap">Loading source envelopes...</div></main>
      </div>
    );
  }

  const latestRetrieved = window.FR.latestVerifiedRetrieved(data);
  const updatedDisplay = window.FR.fmtVerifiedUpdated(latestRetrieved);

  // Derived: persons per dwelling (national)
  const popLatest = latest(data.abs_population_quarterly);
  const dwellLatest = latest(data.abs_residential_dwelling_stock); // values in thousands
  const personsPerDwelling = (popLatest && dwellLatest && dwellLatest.v)
    ? popLatest.v / (dwellLatest.v * 1000)
    : null;

  return (
    <div className="page">
      <Header active="infrastructure" refreshStatus={refreshStatus} updated={latestRetrieved ? updatedDisplay : ''}/>

      <main id="main">
        {/* INTRO */}
        <section className="intro" id="infrastructure">
          <div>
            <span className="eyebrow">Infrastructure, project delivery and logistics audit prototype</span>
            <h1 style={{ marginTop: 12 }}>What Australia&rsquo;s public infrastructure-delivery data can verify - and what remains source-gated</h1>
            <p className="intro__lede">
              This dashboard separates source-backed infrastructure, logistics and
              project-delivery indicators from partial, manual and source-gated feeds so readers
              can see delivery-readiness signals without invented certainty.
            </p>
            <p className="intro__lede">
              How fast Australia's population is growing, how many homes there are, how many
              people we move on public transport and through airports, how much freight we shift,
              how fast our internet runs, and what major project context is source-backed. These
              broad signals are not verified project readiness, delivery milestones, transport
              capacity, freight throughput, cost status or Brisbane 2032 readiness.
            </p>
          </div>
          <aside className="intro__meta" aria-label="Publication details">
            <strong>Verified data retrieved</strong>
            <span className="mono">{updatedDisplay}</span>
            <div style={{ height: 12 }}/>
            <strong>Boundary</strong>
            <span>Independent public-source prototype. No project-readiness claim is invented from partial infrastructure data.</span>
            <div style={{ height: 12 }}/>
            <strong>Last reviewed</strong>
            <span>metadata pending</span>
          </aside>
        </section>

        <InfrastructureStatusLegend/>
        <InfrastructureAuditSummary/>
        <InfrastructureEvidenceBoundary/>
        <InfrastructureRelatedSurfaces/>

        <DataCoverage data={data} refreshStatus={refreshStatus}/>

        {/* WHY THIS MATTERS */}
        <section className="section section--why" aria-labelledby="why">
          <div className="why-grid">
            <div>
              <span className="eyebrow">What this is</span>
              <h2 id="why" style={{ marginTop: 8 }}>Infrastructure source status comes first</h2>
            </div>
            <div className="why-body">
              <p>
                Population growth, not population size, is what stresses infrastructure. Australia
                is among the faster-growing wealthy countries, driven mostly by net overseas
                migration, and the housing stock, urban transport, freight system and digital
                network all have to keep up. This page shows public infrastructure signals only
                where the underlying source envelope is loaded.
              </p>
              <p>
                The headline pairing on this page is <b>persons per dwelling</b>: total population
                divided by total residential dwelling count. This is a structural measure of
                housing pressure that does not depend on price. We pair it with progress against
                the Commonwealth's 1.2 million-new-homes target, BITRE transport and freight
                statistics, and the ACCC's measured NBN performance.
              </p>
              <p>
                A missing project-delivery, logistics, corridor-capacity, power-reliability or
                readiness feed is a public visibility gap. It is not evidence that a project is
                late, ready, over budget, under capacity or nationally critical.
              </p>
              <p className="body-sm" style={{ color: 'var(--ink-3)', marginTop: 12 }}>
                Acronyms used here: <b>ABS</b> = Australian Bureau of Statistics.
                <b> ERP</b> = Estimated Resident Population.
                <b> BITRE</b> = Bureau of Infrastructure and Transport Research Economics.
                <b> NHSAC</b> = National Housing Supply and Affordability Council.
                <b> ACCC</b> = Australian Competition and Consumer Commission.
                <b> NBN</b> = National Broadband Network.
                <b> IA</b> = Infrastructure Australia.
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
              eyebrow="Population"
              label="Estimated Resident Population"
              plain="National headline ERP, all ages, both sexes, latest published quarter, from the ABS Data API."
              fromEnvelope={data.abs_population_quarterly}
              unit=" persons"
              highlight
            />
            <MetricCard
              eyebrow="Growth"
              label="Population growth, year-on-year"
              plain="ERP percentage change over previous year, from the ABS Data API."
              fromEnvelope={data.abs_population_growth_rate}
              unit="%"
            />
            <MetricCard
              eyebrow="Housing stock"
              label="Residential dwellings"
              plain="Number of residential dwellings nationally, in thousands, ABS Total Value of Dwellings (Cat. 6432.0)."
              fromEnvelope={data.abs_residential_dwelling_stock}
              unit=" thousand dwellings"
            />
            {personsPerDwelling != null
              ? (
                <MetricCard
                  eyebrow="Pressure"
                  label="Persons per dwelling"
                  plain="National ERP divided by national residential dwelling count. A structural measure of how tightly the housing stock fits the population."
                  value={personsPerDwelling.toFixed(2)}
                  unit=" persons/dwelling"
                  source="Derived: ABS ERP_Q + ABS RES_DWELL_ST"
                />
              )
              : (
                <MetricCard
                  eyebrow="Pressure"
                  label="Persons per dwelling"
                  plain="National ERP divided by national residential dwelling count. Computed when both source envelopes are status: ok."
                  fromEnvelope={{ status: 'unavailable', source_name: 'ABS ERP_Q + ABS RES_DWELL_ST', source_url: '' }}
                />
              )
            }
          </div>

          <div style={{ height: 16 }}/>

          <div className="metric-grid metric-grid--4">
            <MetricCard
              eyebrow="Housing target"
              label="National Housing Accord progress"
              plain="Share of the Commonwealth's 1.2 million new homes target built to date, from NHSAC's March 2026 quarterly report."
              fromEnvelope={data.nhsac_housing_target_progress}
              unit="% of target built to date"
            />
            <MetricCard
              eyebrow="Public transport"
              label="Public transport patronage"
              plain="Annual public transport patronage by capital city (rail, bus, ferry, light rail), BITRE Australian Infrastructure and Transport Statistics Yearbook."
              fromEnvelope={data.bitre_public_transport_patronage}
              unit=" million passenger trips"
              partial
            />
            <MetricCard
              eyebrow="Aviation"
              label="Airport passenger movements"
              plain="Annual passenger movements at the eight capital city airports, from BITRE Airport Traffic Data."
              fromEnvelope={data.bitre_airport_passenger_movements}
              unit=" million passenger movements"
              partial
            />
            <MetricCard
              eyebrow="Freight"
              label="Freight volumes by mode"
              plain="Annual domestic freight task by mode (road, rail, coastal shipping, domestic air), from BITRE freight statistics."
              fromEnvelope={data.bitre_freight_volumes}
              unit=" billion tonne-kilometres"
              partial
            />
          </div>

          <div style={{ height: 16 }}/>

          <div className="metric-grid metric-grid--4">
            <MetricCard
              eyebrow="Digital"
              label="NBN busy-hour download performance"
              plain="State and territory range for average NBN fixed-line download performance during busy hours, reported as a percentage of plan speed. This is not a median Mbps figure."
              fromEnvelope={data.accc_nbn_broadband_speeds}
              valueFn={(env) => {
                const range = env.extra?.fields?.download_busy_hour_percent_of_plan_speed_range;
                return range ? `${range.min}-${range.max}` : env.values.at(-1).v;
              }}
              unit="% of plan speed"
              partial
            />
            <MetricCard
              eyebrow="Major projects"
              label="Infrastructure Australia priority list"
              plain="Count of nationally significant priority projects on the latest Infrastructure Australia Priority List, with headline aggregate capital cost."
              fromEnvelope={data.infrastructure_australia_priority_list}
              unit=" projects"
            />
            <MetricCard
              eyebrow="Compute"
              label="Australian data centre capacity"
              plain="No public Australian government register of data centre capacity exists. This card stays unavailable until a verifiable named public source publishes one."
              fromEnvelope={data.au_data_centre_capacity_register}
              unit=""
            />
          </div>

          <div className="pending-list" aria-label="Pending infrastructure source coverage">
            <article className="source-card">
              <h4>Pending source coverage</h4>
              <p className="body-sm">
                NHSAC target progress, BITRE transport, airport and freight statistics, and
                ACCC NBN busy-hour performance are now manual, source-backed rows. The
                Infrastructure Australia priority-list count remains unavailable until a clean
                extractable proposal count is verified. Programmatic access is wired for ABS
                population, population growth and residential dwelling stock only. The data
                centre card is intentionally unavailable: there is no canonical public Australian
                register comparable to the AEMO Generation Information register.
              </p>
            </article>
          </div>
        </section>

        {/* CHARTS */}
        <section className="section" aria-labelledby="charts-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">How it's changed</span>
              <h2 id="charts-h">Population, growth rate and housing stock over time</h2>
              <p className="section__lede">Charts populate when verified source data is available. Hover any point, or use arrow keys, to read the value.</p>
            </div>
          </div>

          <div className="charts-grid charts-grid--full">
            <ChartCard
              eyebrow="Population"
              title="Australian Estimated Resident Population, quarterly"
              unit="persons"
              fromEnvelope={data.abs_population_quarterly}
              ranges={['3Y','5Y']}
              defaultRange="5Y"
              accent="#1F3A8A"
              takeaway="Quarterly headline national ERP, both sexes, all ages, from ABS dataflow ERP_Q."
              yAxisLabel="Estimated Resident Population (persons)"
            />
          </div>

          <div style={{ height: 24 }}/>

          <div className="charts-grid">
            <ChartCard
              eyebrow="Growth"
              title="Population growth rate, year-on-year"
              unit="%"
              fromEnvelope={data.abs_population_growth_rate}
              ranges={['3Y','5Y']}
              defaultRange="5Y"
              accent="#0F766E"
              takeaway="Quarterly year-on-year national population growth rate from ABS ERP_Q."
              yAxisLabel="Year-on-year change (%)"
            />
            <ChartCard
              eyebrow="Housing stock"
              title="Residential dwelling stock, quarterly"
              unit="thousand dwellings"
              fromEnvelope={data.abs_residential_dwelling_stock}
              ranges={['3Y','5Y']}
              defaultRange="5Y"
              accent="#B45309"
              takeaway="Quarterly count of residential dwellings nationally, ABS Total Value of Dwellings."
              yAxisLabel="Number of dwellings (thousands)"
            />
          </div>
        </section>

        {/* WHAT CHANGED */}
        <section className="section">
          <InsightFeed
            items={[]}
            title="What changed"
            lede="Populated from ABS / BITRE / ACCC / NHSAC / Infrastructure Australia release notes as verified data arrives."
            emptyMessage="Awaiting verified release notes for the loaded infrastructure source envelopes."
          />
        </section>

        <section className="section section--why" aria-labelledby="brisbane-2032-link-h">
          <div className="why-grid">
            <div>
              <span className="eyebrow">Brisbane 2032</span>
              <h2 id="brisbane-2032-link-h" style={{ marginTop: 8 }}>For Olympic readiness gaps</h2>
            </div>
            <div className="why-body">
              <p>
                This Infrastructure page provides population, housing, transport, freight and
                digital context. Brisbane 2032 Readiness keeps Olympic venue delivery,
                event transport capacity, accommodation, power, fuel and emergency-logistics
                rows source-gated until official public fields are loaded.
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
              <p className="section__lede">All sources are public. Cards marked source-gated, manual or unavailable are awaiting verified values. We do not estimate, and we do not invent project-readiness claims.</p>
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
              <dt>Estimated Resident Population</dt>
              <dd>Fetched live from the ABS Data API ERP_Q dataflow with key 1.3.TOT.AUS.Q (MEASURE Estimated Resident Population, SEX Persons, AGE all, REGION Australia, FREQ Quarterly).</dd>
              <dt>Population growth rate</dt>
              <dd>Fetched live from ABS ERP_Q with key 3.3.TOT.AUS.Q (MEASURE ERP percentage change over previous year). Year-on-year national growth.</dd>
              <dt>Residential dwelling stock</dt>
              <dd>Fetched live from the ABS RES_DWELL_ST dataflow with key 4.AUS.Q (MEASURE Number of residential dwellings, REGION Australia, FREQ Quarterly). Reported in thousands.</dd>
              <dt>Persons per dwelling (derived)</dt>
              <dd>National ERP divided by national residential dwelling count, computed in the dashboard from the two source envelopes. A structural measure of housing pressure that does not depend on price.</dd>
              <dt>National Housing Accord progress</dt>
              <dd>Hand-keyed from the National Housing Supply and Affordability Council Quarterly Report - March 2026. Shows Australia's share of the 1.2 million Accord target built to date, using completion data to the September 2025 quarter.</dd>
              <dt>Public transport, airports, freight</dt>
              <dd>Hand-keyed from BITRE workbooks: Yearbook 2025 Table 2.5i for capital-city public transport patronage, Airport Traffic Data financial-year workbook for the eight capital city airports, and Yearbook 2025 Table 1.1c for domestic freight task. These are scoped measures, not all possible passenger or freight movements.</dd>
              <dt>NBN typical speeds</dt>
              <dd>Hand-keyed from ACCC Measuring Broadband Australia Report 32 and appendix tables. The loaded metric is the state/territory range for average NBN fixed-line busy-hour download performance as a percentage of plan speed. It is not a median Mbps speed.</dd>
              <dt>Infrastructure Australia priority projects</dt>
              <dd>Unavailable in this pass. The 2026 Infrastructure Priority List overview is public, but the searchable proposal list is rendered through a dynamic endpoint that could not be cleanly extracted here; no count or aggregate capital cost is published until a source-safe extract is verified.</dd>
              <dt>Australian data centre capacity</dt>
              <dd>Intentionally unavailable: there is no canonical Australian government register of data centre capacity. Industry datasets such as DCD or 451 Research are gated and do not consistently publish per-site MW figures with reuse rights. Will not estimate.</dd>
              <dt>What this does not prove</dt>
              <dd>These indicators do not prove project delivery readiness, completion dates, cost status, transport capacity, freight throughput, grid constraints, construction workforce capacity, Brisbane 2032 readiness or logistics resilience. A readiness row requires a named public source with a field, period, unit and reuse boundary.</dd>
            </dl>
          </div>
        </section>

        <Footer refreshStatus={refreshStatus} updated={latestRetrieved ? updatedDisplay : ''}/>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
