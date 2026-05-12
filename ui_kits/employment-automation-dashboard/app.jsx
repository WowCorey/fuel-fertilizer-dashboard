const SERIES = [
  'abs_unemployment_rate',
  'abs_underemployment_rate',
  'abs_participation_rate',
  'abs_employment_population_ratio',
  'abs_hours_worked',
  'abs_job_vacancies',
  'abs_wage_price_index',
  'ai_rollout_timeline_context',
  'automation_exposure_context',
];

const EMPLOYMENT_STATUS_LEGEND = [
  ['observed', 'Verified', 'Source-backed and current enough for its cadence.'],
  ['partial', 'Partial', 'Source-backed, but incomplete by geography, occupation, industry, timing or concept.'],
  ['stale', 'Stale', 'Source-backed, but outside its expected cadence window.'],
  ['manual', 'Manual', 'Hand-keyed from a named public source or held as a manual snapshot pending a verified key.'],
  ['derived', 'Derived', 'Calculated or selected from a named source envelope.'],
  ['source-gated', 'Source-gated', 'Waiting for a verified source, field, period, unit and reuse rights.'],
  ['unavailable', 'Unavailable', 'No public source-safe feed is loaded.'],
  ['roadmap', 'Roadmap', 'Planned dashboard area, not yet populated.'],
];

const EMPLOYMENT_EVIDENCE_BOUNDARY = [
  {
    title: 'Unavailable does not mean zero',
    copy: 'Unavailable means no public source-safe feed has been loaded yet. It is not a statement that job loss, automation exposure, AI displacement, retraining need or workforce-transition pressure is zero, low or negligible.',
  },
  {
    title: 'Source-gated requires publisher verification',
    copy: 'Source-gated means the dashboard still needs a verified public source, exact field, period, unit and reuse boundary before a value can be published.',
  },
  {
    title: 'Observed movement is not AI causation',
    copy: 'Official labour-market indicators can move for many reasons. This page does not treat observed labour-market movement as AI or automation causation unless a named source explicitly supports that link.',
  },
  {
    title: 'No estimates fill workforce gaps',
    copy: 'This page does not estimate missing job-loss, automation-exposure, AI-displacement, retraining, program-uptake, wage-impact or vacancy values.',
  },
  {
    title: 'Priority is product triage',
    copy: 'Priority language on this page is editorial/product triage only. It is not an official risk rating, forecast, employment-stress index, automation-risk index or AI-displacement index.',
  },
  {
    title: 'Visibility gap, not misconduct proof',
    copy: 'A missing public feed is a public visibility gap. It is not proof of wrongdoing, and likely holder or publisher fields are starting points for verification, not custody assertions.',
  },
];

function EmploymentStatusLegend() {
  return (
    <section className="section" aria-labelledby="employment-status-legend-h">
      <div className="section__head">
        <div>
          <span className="eyebrow">Status legend</span>
          <h2 id="employment-status-legend-h">Status labels used on this labour and automation page</h2>
          <p className="section__lede">
            These labels match the Missing Data Scoreboard, fuel-security cluster and Food/Farms/Water page.
            They are part of the evidence, not decoration.
          </p>
        </div>
      </div>
      <div className="confidence-legend" aria-label="Employment and automation status legend">
        <span className="confidence-legend__label">Legend</span>
        <dl>
          {EMPLOYMENT_STATUS_LEGEND.map(([kind, label, copy]) => (
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

function EmploymentAuditSummary() {
  const cards = [
    {
      title: 'Publicly visible labour-market signals',
      eyebrow: 'Source-backed indicator',
      copy: 'ABS unemployment, participation, employment-to-population, job vacancies and wage-price signals are loaded where verified. They are labour-market signals, not an AI-causation model.',
      href: '#metrics-h',
    },
    {
      title: 'Partial and manual workforce feeds',
      eyebrow: 'Partial feed / manual snapshot',
      copy: 'Underemployment and monthly hours worked remain manual or partial until a verified ABS key combination or named workbook row is loaded.',
      href: '#sources',
    },
    {
      title: 'Source-gated automation or AI-impact feeds',
      eyebrow: 'Requires publisher verification',
      copy: 'Australian automation exposure, AI displacement, retraining outcomes and sector-transition metrics remain source-gated unless a public Australian publisher provides a directly comparable method.',
      href: '#ai-h',
    },
    {
      title: 'Highest-priority workforce visibility gaps',
      eyebrow: 'Editorial/product triage only',
      copy: 'The most useful next feeds would separate occupation, industry, skills-shortage, retraining and automation-exposure signals without turning timing into causation.',
      href: '#sources',
    },
  ];

  return (
    <section className="section" aria-labelledby="employment-summary-h">
      <div className="section__head">
        <div>
          <span className="eyebrow">30-second employment summary</span>
          <h2 id="employment-summary-h">What the labour and automation audit can and cannot show</h2>
          <p className="section__lede">
            These cards use categorical summaries rather than invented counts. They explain what is verifiable,
            what is partial, what remains source-gated, and what readers should not infer about AI causation.
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

function EmploymentEvidenceBoundary() {
  return (
    <section className="section section--why" aria-labelledby="employment-evidence-boundary-h">
      <div className="section__head">
        <div>
          <span className="eyebrow">Evidence boundary</span>
          <h2 id="employment-evidence-boundary-h">What readers should not assume from missing or partial labour data</h2>
          <p className="section__lede">
            Read these statements before interpreting any employment, automation or AI-impact gap. They define how
            this public-source audit treats unavailable, source-gated and contextual information.
          </p>
        </div>
      </div>
      <div className="source-grid">
        {EMPLOYMENT_EVIDENCE_BOUNDARY.map(item => (
          <article className="source-card" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function EmploymentRelatedSurfaces() {
  const links = [
    {
      title: 'Missing Data Scoreboard',
      copy: 'Open the national audit of public-data gaps, likely publishers and next source actions.',
      href: '../missing-data-scoreboard/index.html',
      label: 'Open Missing Data Scoreboard',
    },
    {
      title: 'AU Economics',
      copy: 'Interest rates, inflation, wages, unemployment and macro context that sit beside labour-market pressure.',
      href: '../au-economics-dashboard/index.html',
      label: 'Open AU Economics',
    },
    {
      title: 'Housing Pressure',
      copy: 'Household debt, RBA cash-rate context and source-gated housing pressure models.',
      href: '../housing-economic-pressure-dashboard/index.html',
      label: 'Open Housing Pressure',
    },
    {
      title: 'Food, Farms & Water',
      copy: 'Farm-input, water and food-system pressure where workforce and regional exposure may intersect later.',
      href: '../fertilizer-dashboard/index.html',
      label: 'Open Food, Farms & Water',
    },
    {
      title: 'Sources and methodology',
      copy: 'Jump to the source envelopes loaded by this page and the no-causation methodology.',
      href: '#sources',
      label: 'Open labour methodology',
    },
  ];

  return (
    <section className="section" aria-labelledby="employment-related-h">
      <div className="section__head">
        <div>
          <span className="eyebrow">Audit navigation</span>
          <h2 id="employment-related-h">Open related public-data surfaces</h2>
          <p className="section__lede">
            Employment and automation interpretation depends on adjacent economic, household and regional context.
            These links keep observed labour data separate from unsupported automation claims.
          </p>
        </div>
      </div>
      <div className="quick-link-grid quick-link-grid--5">
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
        <Header active="employment_automation" refreshStatus={refreshStatus}/>
        <main id="main"><div className="loading-wrap">Loading source envelopes...</div></main>
      </div>
    );
  }

  const latestRetrieved = window.FR.latestVerifiedRetrieved(data);
  const updatedDisplay = window.FR.fmtVerifiedUpdated(latestRetrieved);
  const aiTimelineFields = (data.ai_rollout_timeline_context?.extra?.fields) || {};
  const aiEvents = aiTimelineFields.events || [];

  return (
    <div className="page">
      <Header active="employment_automation" refreshStatus={refreshStatus} updated={latestRetrieved ? updatedDisplay : ''}/>

      <main id="main">
        {/* INTRO */}
        <section className="intro" id="employment-automation">
          <div>
            <span className="eyebrow">Employment and Automation audit prototype</span>
            <h1 style={{ marginTop: 12 }}>What Australia&rsquo;s public employment and automation data can verify &mdash; and what remains source-gated</h1>
            <p className="intro__lede">
              This dashboard separates source-backed labour-market indicators from partial,
              manual and source-gated automation feeds so readers can see workforce-transition
              signals without invented causation.
            </p>
            <p className="intro__lede">
              It tracks Australian labour-market change during the public AI rollout era using
              official/public data where available. It does <b>not</b> claim AI caused these
              movements unless a named source explicitly supports that link.
            </p>
          </div>
          <aside className="intro__meta" aria-label="Publication details">
            <strong>Verified data retrieved</strong>
            <span className="mono">{updatedDisplay}</span>
            <div style={{ height: 12 }}/>
            <strong>Boundary</strong>
            <span>Independent public-source prototype. Labour-market data is observed; AI-causation claims are not invented.</span>
            <div style={{ height: 12 }}/>
            <strong>Last reviewed</strong>
            <span>metadata pending</span>
          </aside>
        </section>

        <EmploymentStatusLegend/>
        <EmploymentAuditSummary/>
        <EmploymentEvidenceBoundary/>
        <EmploymentRelatedSurfaces/>

        <DataCoverage data={data} refreshStatus={refreshStatus}/>

        {/* CAVEAT - read this first */}
        <section className="section section--why" aria-labelledby="why">
          <div className="why-grid">
            <div>
              <span className="eyebrow">Read this first</span>
              <h2 id="why" style={{ marginTop: 8 }}>Labour-market source status comes first</h2>
            </div>
            <div className="why-body">
              <p>
                This page shows two separate things side by side: (1) official Australian
                labour-market signals from the ABS, and (2) workforce-transition context and a
                public AI-product rollout timeline. The two are not joined by a causal claim.
              </p>
              <p>
                There is no current Australian government dataset of automation/AI labour-market
                exposure that is source-safe to publish without estimation. International
                "occupational exposure" studies cannot be silently mapped to Australian rows
                because their methodology and concept boundaries differ. Where a clean row does
                not exist, this page leaves it source-gated or unavailable rather than guessing.
              </p>
              <p>
                A missing automation, job-loss, retraining or occupation-impact feed is a public
                visibility gap. It is not evidence that AI caused a labour-market movement, and it
                is not proof of misconduct by a likely publisher or data holder.
              </p>
              <p className="body-sm" style={{ color: 'var(--ink-3)', marginTop: 12 }}>
                Acronyms used here: <b>ABS</b> = Australian Bureau of Statistics.
                <b> WPI</b> = Wage Price Index.
                <b> SA</b> = Seasonally Adjusted.
                <b> DISR</b> = Department of Industry, Science and Resources.
                <b> DEWR</b> = Department of Employment and Workplace Relations.
              </p>
            </div>
          </div>
        </section>

        {/* HEADLINE METRICS */}
        <section className="section" aria-labelledby="metrics-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Headline labour-market numbers</span>
              <h2 id="metrics-h">As of the latest ABS publication</h2>
              <p className="section__lede">
                Cards marked source-gated, manual or unavailable are waiting on a verified key
                combination, named workbook value or public Australian method. We do not estimate.
              </p>
            </div>
          </div>
          <div className="metric-grid metric-grid--4">
            <MetricCard
              eyebrow="Unemployment"
              label="Unemployment rate"
              plain="Headline national monthly seasonally adjusted unemployment rate, ABS LF dataflow MEASURE M13."
              fromEnvelope={data.abs_unemployment_rate}
              unit="%"
              highlight
            />
            <MetricCard
              eyebrow="Underemployment"
              label="Underemployment rate"
              plain="Underemployment rate (proportion of labour force), ABS LF dataflow MEASURE M23. Manual stub: the standard headline key combination returned 404 in initial probing; awaiting verified key or hand-keyed workbook value."
              fromEnvelope={data.abs_underemployment_rate}
              unit="%"
            />
            <MetricCard
              eyebrow="Participation"
              label="Participation rate"
              plain="Headline national monthly seasonally adjusted participation rate, ABS LF dataflow MEASURE M12."
              fromEnvelope={data.abs_participation_rate}
              unit="%"
            />
            <MetricCard
              eyebrow="Employment intensity"
              label="Employment-to-population ratio"
              plain="Share of the working-age population that is employed, seasonally adjusted, ABS LF dataflow MEASURE M16."
              fromEnvelope={data.abs_employment_population_ratio}
              unit="%"
            />
          </div>

          <div style={{ height: 16 }}/>

          <div className="metric-grid metric-grid--4">
            <MetricCard
              eyebrow="Hours"
              label="Monthly hours worked in all jobs"
              plain="Total monthly hours worked in all jobs, ABS LF dataflow. Manual stub: the standard headline key combination returned 404 in initial probing; awaiting verified key or hand-keyed workbook value."
              fromEnvelope={data.abs_hours_worked}
              unit=" hours"
            />
            <MetricCard
              eyebrow="Demand"
              label="Job vacancies"
              plain="Total job vacancies across all industries, private and public sectors, seasonally adjusted, ABS Job Vacancies Australia (Cat. 6354.0), quarterly."
              fromEnvelope={data.abs_job_vacancies}
              unit=" thousand vacancies"
            />
            <MetricCard
              eyebrow="Wages"
              label="Wage Price Index, year-on-year"
              plain="Annual percentage change in the ABS Wage Price Index (total hourly rates excluding bonuses, all sectors, all industries, SA), Cat. 6345.0, quarterly."
              fromEnvelope={data.abs_wage_price_index}
              unit="%"
            />
            <MetricCard
              eyebrow="Automation exposure"
              label="Australian automation/AI exposure"
              plain="No source-safe Australian official dataset of automation or AI exposure by occupation or industry has been identified. International methodologies cannot be silently mapped to Australian rows. Card stays unavailable."
              fromEnvelope={data.automation_exposure_context}
              unit=""
            />
          </div>

          <div className="pending-list" aria-label="Source coverage">
            <article className="source-card">
              <h4>Source coverage</h4>
              <p className="body-sm">
                Wired live from the ABS Data API: unemployment rate, participation rate,
                employment-to-population ratio (LF dataflow, monthly SA), job vacancies (JV
                dataflow, quarterly SA) and Wage Price Index annual % change (WPI dataflow,
                quarterly SA). Underemployment rate and monthly hours worked stay on manual
                because their standard headline key combinations returned 404 from the LF
                dataflow in initial probing; they will be promoted once a verified key or a
                hand-keyed workbook value is loaded. Australian automation/AI labour-market
                exposure stays unavailable: no source-safe official Australian dataset has been
                identified. The AI rollout timeline below is context, not causation.
              </p>
            </article>
          </div>
        </section>

        {/* CHARTS */}
        <section className="section" aria-labelledby="charts-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">How it's changed</span>
              <h2 id="charts-h">Labour-market trends since 2018</h2>
              <p className="section__lede">
                Charts populate from the live ABS series above. The ChatGPT public-launch month
                (November 2022) is shown only for time context, not as a cause.
              </p>
            </div>
          </div>

          <div className="charts-grid">
            <ChartCard
              eyebrow="Unemployment"
              title="Unemployment rate, monthly SA"
              unit="%"
              fromEnvelope={data.abs_unemployment_rate}
              ranges={['3Y','5Y']}
              defaultRange="5Y"
              accent="#1F3A8A"
              takeaway="Headline national monthly seasonally adjusted unemployment rate, ABS LF dataflow MEASURE M13."
              yAxisLabel="Unemployment rate (%)"
            />
            <ChartCard
              eyebrow="Participation"
              title="Participation rate, monthly SA"
              unit="%"
              fromEnvelope={data.abs_participation_rate}
              ranges={['3Y','5Y']}
              defaultRange="5Y"
              accent="#0F766E"
              takeaway="Headline national monthly seasonally adjusted participation rate, ABS LF dataflow MEASURE M12."
              yAxisLabel="Participation rate (%)"
            />
          </div>

          <div style={{ height: 24 }}/>

          <div className="charts-grid">
            <ChartCard
              eyebrow="Employment intensity"
              title="Employment-to-population ratio, monthly SA"
              unit="%"
              fromEnvelope={data.abs_employment_population_ratio}
              ranges={['3Y','5Y']}
              defaultRange="5Y"
              accent="#B45309"
              takeaway="Share of the working-age population that is employed, ABS LF dataflow MEASURE M16."
              yAxisLabel="Employment-to-population ratio (%)"
            />
            <ChartCard
              eyebrow="Wages"
              title="Wage Price Index, year-on-year"
              unit="%"
              fromEnvelope={data.abs_wage_price_index}
              ranges={['3Y','5Y']}
              defaultRange="5Y"
              accent="#6B7280"
              takeaway="Annual percentage change in the ABS Wage Price Index, Cat. 6345.0."
              yAxisLabel="WPI annual change (%)"
            />
          </div>

          <div style={{ height: 24 }}/>

          <div className="charts-grid charts-grid--full">
            <ChartCard
              eyebrow="Demand"
              title="Job vacancies, quarterly SA"
              unit="thousand vacancies"
              fromEnvelope={data.abs_job_vacancies}
              ranges={['3Y','5Y']}
              defaultRange="5Y"
              accent="#1F3A8A"
              takeaway="Total job vacancies across all industries, private and public sectors, ABS Cat. 6354.0."
              yAxisLabel="Vacancies (thousands)"
            />
          </div>
        </section>

        {/* AI ROLLOUT CONTEXT (NOT CAUSATION) */}
        <section className="section" aria-labelledby="ai-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">AI rollout timeline - context only</span>
              <h2 id="ai-h">Public AI milestone events, not a causal explanation</h2>
              <p className="section__lede">
                These are dated events published by the named organisation. They are shown so
                readers can place labour-market movements in time relative to the public AI
                rollout. <b>None of these events is asserted to have caused any labour-market
                movement on this page.</b>
              </p>
            </div>
          </div>
          {aiEvents.length > 0 ? (
            <div className="data-table-wrap">
              <table className="data-table data-table--sticky">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Event</th>
                    <th>Publisher</th>
                    <th>Trust</th>
                    <th>Source</th>
                  </tr>
                </thead>
                <tbody>
                  {aiEvents.map(ev => (
                    <tr key={ev.date + ev.title}>
                      <td className="mono">{ev.date}</td>
                      <td>{ev.title}</td>
                      <td>{ev.publisher}</td>
                      <td><span className="caption">{ev.trust_label || 'Manual'}</span></td>
                      <td>
                        {ev.url
                          ? <a href={ev.url}>{ev.url.replace(/^https?:\/\//,'').slice(0, 50)} <Icon name="external" size={12}/></a>
                          : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="caption">AI rollout timeline envelope not yet loaded.</p>
          )}
          <p className="caption" style={{ marginTop: 12 }}>
            <b>Boundary:</b> {aiTimelineFields.boundary || 'Timing is not causation. The dashboard does not assign cause to any of these events.'}
          </p>
        </section>

        {/* SOURCES & METHODOLOGY */}
        <section className="section section--sources" id="sources">
          <div className="section__head">
            <div>
              <span className="eyebrow">Sources & methodology</span>
              <h2>Every dataset used on this page</h2>
              <p className="section__lede">All sources are public. Cards marked source-gated, manual or unavailable are awaiting verified values. We do not estimate, and we do not assert AI causation.</p>
            </div>
          </div>
          <div className="sources-grid">
            {Object.entries(data).map(([id, env]) => (
              <article key={id} className="source-card">
                <h4>{env.source_name}</h4>
                <p className="body-sm">
                  {env.status === 'ok'
                    ? `Verified. ${env.values?.length || 0} data points; latest ${env.last_data_point || 'unknown'}.`
                    : 'Awaiting hand-keyed values from the named public source, or intentionally unavailable.'}
                </p>
                <p className="caption"><b>Envelope:</b> <span className="mono">{id}</span></p>
                {env.source_url && (
                  <a href={env.source_url}>{env.source_url.replace(/^https?:\/\//,'').slice(0, 60)} <Icon name="external" size={12}/></a>
                )}
                <p className="caption mono">Retrieved: {env.retrieved_at ? window.FR.fmtRetrieved(env.retrieved_at) : '-'}</p>
              </article>
            ))}
          </div>
          <div className="methodology">
            <h3>How we calculate the numbers, and what we do not do</h3>
            <dl>
              <dt>Strongest coverage</dt>
              <dd>The ABS labour-market series (unemployment, participation, employment-to-population, job vacancies and wages) are fetched live from the ABS Data API. Each card cites its dataflow + key.</dd>
              <dt>Weaker coverage</dt>
              <dd>Underemployment rate and monthly hours worked stay on manual because the standard headline key combination returned 404 from the LF dataflow in initial probing. They will be promoted to programmatic when a verified key or a hand-keyed workbook value is loaded.</dd>
              <dt>Why we do not publish an automation exposure score</dt>
              <dd>There is no current Australian government dataset of automation or AI labour-market exposure by occupation or industry that is source-safe to publish. International "occupational exposure" methodologies are not directly mappable to Australian rows because their concept boundaries differ. The exposure card stays Unavailable until a named Australian publisher (Productivity Commission, DEWR, DISR, ABS) releases a directly comparable Australian indicator.</dd>
              <dt>What the AI rollout timeline does NOT do</dt>
              <dd>The AI timeline is a list of dated, named events published by the listed organisations. It is shown so labour-market movements can be placed in time. <b>It is not a causal model.</b> No label, takeaway, table cell or chart annotation on this page asserts that an AI rollout event caused any labour-market change.</dd>
              <dt>What still requires human review</dt>
              <dd>Whenever an Australian publisher (PC, DEWR, DISR or ABS) releases an automation/AI exposure indicator with clear methodology, the unavailable card can be reviewed and populated. Until then, it stays unavailable.</dd>
            </dl>
          </div>
        </section>

        <Footer refreshStatus={refreshStatus} updated={latestRetrieved ? updatedDisplay : ''}/>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
