const SERIES = [
  'abs_manufacturing_gdp_share',
  'abs_manufacturing_employment',
  'abs_manufacturing_output_index',
  'abs_manufactured_exports_total',
  'abs_manufacturing_capex',
  'abs_food_beverage_employment',
  'doe_industry_growth_centres_summary',
];

const MANUFACTURING_STATUS_LEGEND = [
  ['observed', 'Verified', 'Source-backed and current enough for its cadence.'],
  ['partial', 'Partial', 'Source-backed, but incomplete by geography, industry, product, supply chain or concept.'],
  ['stale', 'Stale', 'Source-backed, but outside its expected cadence window.'],
  ['manual', 'Manual', 'Hand-keyed from a named public source or held as a manual snapshot pending a verified row.'],
  ['derived', 'Derived', 'Calculated or selected from a named source envelope.'],
  ['source-gated', 'Source-gated', 'Waiting for a verified source, field, period, unit and reuse rights.'],
  ['unavailable', 'Unavailable', 'No public source-safe feed is loaded.'],
  ['roadmap', 'Roadmap', 'Planned dashboard area, not yet populated.'],
];

const MANUFACTURING_EVIDENCE_BOUNDARY = [
  {
    title: 'Unavailable does not mean zero',
    copy: 'Unavailable means no public source-safe feed has been loaded yet. It is not a statement that factory capacity, sovereign capability, defence-production depth, supply-chain depth or industrial-input pressure is zero, low or negligible.',
  },
  {
    title: 'Source-gated requires publisher verification',
    copy: 'Source-gated means the dashboard still needs a verified public source, exact field, period, unit and reuse boundary before a value can be published.',
  },
  {
    title: 'Industrial signals are not capability proof',
    copy: 'Observed manufacturing signals are not treated as proof of sovereign capability unless a named source explicitly supports that link.',
  },
  {
    title: 'No estimates fill capacity gaps',
    copy: 'This page does not estimate missing factory capacity, sovereign capability, defence-production output, supply-chain depth, workforce availability, energy exposure or input-cost values.',
  },
  {
    title: 'Priority is product triage',
    copy: 'Priority language on this page is editorial/product triage only. It is not an official risk rating, manufacturing-stress index, sovereign-capability index or industrial-risk index.',
  },
  {
    title: 'Visibility gap, not misconduct proof',
    copy: 'A missing public feed is a public visibility gap. It is not proof of wrongdoing, and likely holder or publisher fields are starting points for verification, not custody assertions.',
  },
];

function ManufacturingStatusLegend() {
  return (
    <section className="section" aria-labelledby="manufacturing-status-legend-h">
      <div className="section__head">
        <div>
          <span className="eyebrow">Status legend</span>
          <h2 id="manufacturing-status-legend-h">Status labels used on this industrial-capacity page</h2>
          <p className="section__lede">
            These labels match the Missing Data Scoreboard, Employment &amp; Automation and National Fuel Security.
            They are part of the evidence, not decoration.
          </p>
        </div>
      </div>
      <div className="confidence-legend" aria-label="Manufacturing and industrial-capacity status legend">
        <span className="confidence-legend__label">Legend</span>
        <dl>
          {MANUFACTURING_STATUS_LEGEND.map(([kind, label, copy]) => (
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

function ManufacturingAuditSummary() {
  const cards = [
    {
      title: 'Publicly visible industrial-capacity signals',
      eyebrow: 'Source-backed indicator',
      copy: 'ABS manufacturing employment, sales, exports, private capex and food/beverage employment are loaded where verified. These are manufacturing signals, not a complete sovereign-capability model.',
      href: '#metrics-h',
    },
    {
      title: 'Partial and manual manufacturing feeds',
      eyebrow: 'Partial feed / manual snapshot',
      copy: 'Manufacturing GDP share and Department of Industry profile rows remain unavailable or manual until exact source tables, fields and factual rows are verified.',
      href: '#sources',
    },
    {
      title: 'Source-gated supply-chain or defence-production feeds',
      eyebrow: 'Requires publisher verification',
      copy: 'Factory capacity, defence-production depth, supply-chain depth, industrial-input exposure, workforce availability and procurement status are not inferred from broad manufacturing indicators.',
      href: '#sources',
    },
    {
      title: 'Highest-priority manufacturing visibility gaps',
      eyebrow: 'Editorial/product triage only',
      copy: 'The most useful next feeds would separate capacity, product class, inputs, energy exposure, workforce skills, defence relevance and critical supply-chain dependencies without inventing capability claims.',
      href: '#sources',
    },
  ];

  return (
    <section className="section" aria-labelledby="manufacturing-summary-h">
      <div className="section__head">
        <div>
          <span className="eyebrow">30-second manufacturing summary</span>
          <h2 id="manufacturing-summary-h">What the industrial-capacity audit can and cannot show</h2>
          <p className="section__lede">
            These cards use categorical summaries rather than invented counts. They explain what is verifiable,
            what is partial, and what readers should not infer about sovereign capability.
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

function ManufacturingEvidenceBoundary() {
  return (
    <section className="section section--why" aria-labelledby="manufacturing-evidence-boundary-h">
      <div className="section__head">
        <div>
          <span className="eyebrow">Evidence boundary</span>
          <h2 id="manufacturing-evidence-boundary-h">What readers should not assume from missing or partial industrial data</h2>
          <p className="section__lede">
            Read these statements before interpreting any manufacturing, supply-chain or sovereign-capability gap.
            They define how this public-source audit treats unavailable and source-gated information.
          </p>
        </div>
      </div>
      <div className="source-grid">
        {MANUFACTURING_EVIDENCE_BOUNDARY.map(item => (
          <article className="source-card" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ManufacturingRelatedSurfaces() {
  const links = [
    {
      title: 'Missing Data Scoreboard',
      copy: 'Open the national audit of public-data gaps, likely publishers and next source actions.',
      href: '../missing-data-scoreboard/index.html',
      label: 'Open Missing Data Scoreboard',
    },
    {
      title: 'Employment & Automation',
      copy: 'Labour-market and workforce-transition signals that shape industrial capacity.',
      href: '../employment-automation-dashboard/index.html',
      label: 'Open Employment & Automation',
    },
    {
      title: 'Defence Procurement Watch',
      copy: 'Procurement and industry-content source gates that must stay separate from operational capability claims.',
      href: '../defence-procurement-watch/index.html',
      label: 'Open Defence Procurement Watch',
    },
    {
      title: 'Strategic Resources',
      copy: 'Critical materials, resource profiles and gaps that affect manufacturing input visibility.',
      href: '../strategic-resources-dashboard/index.html',
      label: 'Open Strategic Resources',
    },
    {
      title: 'Infrastructure',
      copy: 'Freight, transport and project-delivery context for industrial resilience.',
      href: '../infrastructure-dashboard/index.html',
      label: 'Open Infrastructure',
    },
    {
      title: 'National Fuel Security',
      copy: 'Fuel availability, supply-chain and energy exposure context for manufacturing continuity.',
      href: '../fuel-security-dashboard/index.html',
      label: 'Open National Fuel Security',
    },
    {
      title: 'Sources and methodology',
      copy: 'Jump to the source envelopes loaded by this page and the no-capability-claim methodology.',
      href: '#sources',
      label: 'Open manufacturing methodology',
    },
  ];

  return (
    <section className="section" aria-labelledby="manufacturing-related-h">
      <div className="section__head">
        <div>
          <span className="eyebrow">Audit navigation</span>
          <h2 id="manufacturing-related-h">Open related public-data surfaces</h2>
          <p className="section__lede">
            Manufacturing capacity depends on workforce, fuel, inputs, infrastructure, procurement and strategic resources.
            These links keep observed manufacturing data separate from unsupported capability claims.
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
        <Header active="manufacturing" refreshStatus={refreshStatus}/>
        <main id="main"><div className="loading-wrap">Loading source envelopes...</div></main>
      </div>
    );
  }

  const latestRetrieved = window.FR.latestVerifiedRetrieved(data);
  const updatedDisplay = window.FR.fmtVerifiedUpdated(latestRetrieved);

  return (
    <div className="page">
      <Header active="manufacturing" refreshStatus={refreshStatus} updated={latestRetrieved ? updatedDisplay : ''}/>

      <main id="main">
        {/* INTRO */}
        <section className="intro" id="manufacturing">
          <div>
            <span className="eyebrow">Manufacturing and industrial capacity audit prototype</span>
            <h1 style={{ marginTop: 12 }}>What Australia&rsquo;s public manufacturing-capacity data can verify &mdash; and what remains source-gated</h1>
            <p className="intro__lede">
              This dashboard separates source-backed manufacturing and industrial-capacity
              indicators from partial, manual and source-gated feeds so readers can see sovereign
              capability signals without invented certainty.
            </p>
            <p className="intro__lede">
              Manufacturing feeds, fuels and equips parts of the country, but broad ABS industry
              signals are not the same as verified factory capacity, supply-chain depth,
              defence-production capability or procurement status.
            </p>
          </div>
          <aside className="intro__meta" aria-label="Publication details">
            <strong>Verified data retrieved</strong>
            <span className="mono">{updatedDisplay}</span>
            <div style={{ height: 12 }}/>
            <strong>Boundary</strong>
            <span>Independent public-source prototype. No sovereign-capability claim is invented from partial manufacturing data.</span>
            <div style={{ height: 12 }}/>
            <strong>Last reviewed</strong>
            <span>metadata pending</span>
          </aside>
        </section>

        <ManufacturingStatusLegend/>
        <ManufacturingAuditSummary/>
        <ManufacturingEvidenceBoundary/>
        <ManufacturingRelatedSurfaces/>

        <DataCoverage data={data} refreshStatus={refreshStatus}/>

        {/* WHY THIS MATTERS */}
        <section className="section section--why" aria-labelledby="why">
          <div className="why-grid">
            <div>
              <span className="eyebrow">What this is</span>
              <h2 id="why" style={{ marginTop: 8 }}>Industrial-capacity source status comes first</h2>
            </div>
            <div className="why-body">
              <p>
                A country that can make things has more options when overseas supply gets
                disrupted. Manufacturing also pays measurable wages and produces measurable
                exports. The ABS publishes headline manufacturing signals: value added,
                employment, sales, exports and private capex by industry division (ANZSIC C is
                manufacturing) and subdivision (food, beverages, machinery, transport
                equipment, chemicals).
              </p>
              <p>
                This page collects the named sources for each of those measures. Values
                appear only when the named publisher has been verified. Anything we can't
                verify shows up as source-gated or unavailable, never an estimate.
              </p>
              <p>
                A missing supply-chain, defence-production, workforce or industrial-input feed is
                a public visibility gap. It is not evidence that Australia has or lacks a specific
                sovereign manufacturing capability.
              </p>
              <p className="body-sm" style={{ color: 'var(--ink-3)', marginTop: 12 }}>
                Acronyms used here: <b>ABS</b> = Australian Bureau of Statistics.
                <b> ANZSIC</b> = Australian and New Zealand Standard Industrial Classification.
                <b> SITC</b> = Standard International Trade Classification.
                <b> GVA</b> = Gross Value Added (industry contribution to GDP).
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
              eyebrow="Share of GDP"
              label="Manufacturing share of GDP"
              plain="ANZSIC division C (manufacturing) gross value added as a share of total industry GVA, ABS quarterly National Accounts."
              fromEnvelope={data.abs_manufacturing_gdp_share}
              unit="%"
              highlight
            />
            <MetricCard
              eyebrow="Jobs"
              label="Manufacturing employment"
              plain="Employed persons in ANZSIC division C (manufacturing), ABS Labour Force Detailed release, quarterly."
              fromEnvelope={data.abs_manufacturing_employment}
              unit=" thousand persons"
            />
            <MetricCard
              eyebrow="Output"
              label="Manufacturing sales (chain volume)"
              plain="ABS Business Indicators income from sales of goods and services for manufacturing, chain volume measures, seasonally adjusted, quarterly."
              fromEnvelope={data.abs_manufacturing_output_index}
              unit=" chain volume $m"
            />
            <MetricCard
              eyebrow="Exports"
              label="Manufactured exports"
              plain="Combined SITC sections 5-8 (chemicals, manufactured materials, machinery, miscellaneous manufactures) export value."
              fromEnvelope={data.abs_manufactured_exports_total}
              unit=" AUD millions"
            />
          </div>

          <div style={{ height: 16 }}/>

          <div className="metric-grid metric-grid--4">
            <MetricCard
              eyebrow="Investment"
              label="Manufacturing private new capex"
              plain="ABS Cat. 5625.0 actual private new capital expenditure for ANZSIC division C, quarterly."
              fromEnvelope={data.abs_manufacturing_capex}
              unit=" AUD millions"
            />
            <MetricCard
              eyebrow="Food sector"
              label="Food and beverage manufacturing employment"
              plain="Employed persons in ANZSIC subdivisions 11 (food product manufacturing) and 12 (beverage and tobacco)."
              fromEnvelope={data.abs_food_beverage_employment}
              unit=" thousand persons"
            />
            <MetricCard
              eyebrow="Industry profile"
              label="Industry profile (DoIS)"
              plain="Department of Industry, Science and Resources published manufacturing industry profiles. Hand-keyed when verified factual headcounts or revenue values are available."
              fromEnvelope={data.doe_industry_growth_centres_summary}
              unit=""
            />
          </div>

          <div className="pending-list" aria-label="Pending manufacturing source coverage">
            <article className="source-card">
              <h4>Pending source coverage</h4>
              <p className="body-sm">
                Five ABS manufacturing series now load from verified ABS latest-release XLSX
                tables. Manufacturing GDP share remains unavailable until the exact National
                Accounts table/API mapping is verified. The Department of Industry profile slot
                also stays unavailable until a named factual publication is loaded.
              </p>
            </article>
          </div>
        </section>

        {/* CHARTS */}
        <section className="section" aria-labelledby="charts-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">How it's changed</span>
              <h2 id="charts-h">Manufacturing's share, employment, output and exports over time</h2>
              <p className="section__lede">Charts populate when verified source data is available. Hover any point, or use arrow keys, to read the value.</p>
            </div>
          </div>

          <div className="charts-grid charts-grid--full">
            <ChartCard
              eyebrow="Share of GDP"
              title="Manufacturing share of total industry GVA, quarterly"
              unit="%"
              fromEnvelope={data.abs_manufacturing_gdp_share}
              ranges={['3Y','5Y']}
              defaultRange="5Y"
              accent="#1F3A8A"
              takeaway="ANZSIC division C (manufacturing) gross value added as a percentage of total industry GVA, ABS National Accounts."
              yAxisLabel="Manufacturing share of total GVA (%)"
            />
          </div>

          <div style={{ height: 24 }}/>

          <div className="charts-grid">
            <ChartCard
              eyebrow="Jobs"
              title="Manufacturing employment, quarterly"
              unit="thousand persons"
              fromEnvelope={data.abs_manufacturing_employment}
              ranges={['3Y','5Y']}
              defaultRange="5Y"
              accent="#0F766E"
              takeaway="Employed persons in ANZSIC division C, ABS Labour Force Detailed."
              yAxisLabel="Employed persons (thousand)"
            />
            <ChartCard
              eyebrow="Output"
              title="Manufacturing sales, chain volume, quarterly"
              unit="chain volume $m"
              fromEnvelope={data.abs_manufacturing_output_index}
              ranges={['3Y','5Y']}
              defaultRange="5Y"
              accent="#B45309"
              takeaway="Seasonally adjusted manufacturing income from sales of goods and services, chain volume measures, ABS Business Indicators."
              yAxisLabel="Manufacturing sales (chain volume $m)"
            />
          </div>

          <div style={{ height: 24 }}/>

          <div className="charts-grid">
            <ChartCard
              eyebrow="Exports"
              title="Manufactured exports, monthly"
              unit="AUD millions"
              fromEnvelope={data.abs_manufactured_exports_total}
              ranges={['1Y','3Y']}
              defaultRange="3Y"
              accent="#1F3A8A"
              takeaway="Total export value across SITC sections 5-8 (chemicals, manufactured materials, machinery, miscellaneous manufactures)."
              yAxisLabel="Export value (AUD millions per month)"
            />
            <ChartCard
              eyebrow="Investment"
              title="Manufacturing private new capex, quarterly"
              unit="AUD millions"
              fromEnvelope={data.abs_manufacturing_capex}
              ranges={['3Y','5Y']}
              defaultRange="5Y"
              accent="#6B7280"
              takeaway="Actual private new capital expenditure for ANZSIC division C (manufacturing), ABS Cat. 5625.0."
              yAxisLabel="Manufacturing capex (AUD millions)"
            />
          </div>
        </section>

        {/* WHAT CHANGED */}
        <section className="section">
          <InsightFeed
            items={[]}
            title="What changed"
            lede="Populated from ABS / DoIS release notes as verified data arrives."
            emptyMessage="Awaiting verified release notes for the loaded manufacturing source envelopes."
          />
        </section>

        {/* SOURCES & METHODOLOGY */}
        <section className="section section--sources" id="sources">
          <div className="section__head">
            <div>
              <span className="eyebrow">Sources & methodology</span>
              <h2>Every dataset used on this page</h2>
              <p className="section__lede">All sources are public. Cards marked source-gated, manual or unavailable are awaiting verified values. We do not estimate, and we do not invent sovereign-capability claims.</p>
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
              <dt>Manufacturing share of GDP</dt>
              <dd>ANZSIC division C (manufacturing) gross value added expressed as a percentage of total industry gross value added (chain volume measure), from ABS quarterly National Accounts (Cat. 5206.0). This remains unavailable until the exact source table or API mapping for the share calculation is verified.</dd>
              <dt>Manufacturing employment</dt>
              <dd>Employed persons (full-time and part-time, both sexes) in ANZSIC division C, from ABS Labour Force Detailed (Cat. 6291.0.55.001) Table 04, seasonally adjusted, quarterly.</dd>
              <dt>Manufacturing sales</dt>
              <dd>Seasonally adjusted manufacturing income from sales of goods and services, chain volume measures, from ABS Business Indicators Australia (Cat. 5676.0) Table 4, quarterly. This is a source-backed sales/output proxy, not a separate production-index series.</dd>
              <dt>Manufactured exports</dt>
              <dd>Combined original FOB export value for SITC sections 5 (chemicals), 6 (manufactured goods classified by material), 7 (machinery and transport equipment) and 8 (miscellaneous manufactured articles), from ABS International Trade in Goods Table 12a. The ABS workbook unit is AUD millions.</dd>
              <dt>Manufacturing private new capex</dt>
              <dd>Actual total private new capital expenditure for ANZSIC division C (manufacturing), current prices, from ABS Private New Capital Expenditure (Cat. 5625.0) Table 4, seasonally adjusted, quarterly.</dd>
              <dt>Food and beverage manufacturing employment</dt>
              <dd>Sum of original employed-persons series for ANZSIC subdivisions 11 (food product manufacturing) and 12 (beverage and tobacco product manufacturing), from ABS Labour Force Detailed Table 06, quarterly.</dd>
              <dt>Industry profile (DoIS)</dt>
              <dd>Hand-keyed factual headcounts and revenue values from named publications by the Department of Industry, Science and Resources. This remains unavailable until a named publication supports a clean factual row; aggregated estimates are never published.</dd>
              <dt>What this does not prove</dt>
              <dd>These indicators do not prove factory capacity, supply-chain depth, defence-production capability, procurement status or sovereign capability. A capability row requires a named public source with a field, period, unit and reuse boundary.</dd>
            </dl>
          </div>
        </section>

        <Footer refreshStatus={refreshStatus} updated={latestRetrieved ? updatedDisplay : ''}/>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
