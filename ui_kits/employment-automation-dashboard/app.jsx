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
            <span className="eyebrow">Employment & Automation · v0.5</span>
            <h1 style={{ marginTop: 12 }}>Australia's labour market during the AI rollout era.</h1>
            <p className="intro__lede">
              This page tracks Australian labour-market change since around the public AI
              rollout era (ChatGPT public launch, late 2022) using official ABS labour-market
              series. It does <b>not</b> claim AI caused these movements. Timing is context, not
              causation.
            </p>
          </div>
          <aside className="intro__meta" aria-label="Publication details">
            <strong>Verified data retrieved</strong>
            <span className="mono">{updatedDisplay}</span>
            <div style={{ height: 12 }}/>
            <strong>Rule</strong>
            <span>Labour-market data is observed. AI-causation claims are not made.</span>
          </aside>
        </section>

        <DataCoverage data={data} refreshStatus={refreshStatus}/>

        {/* CAVEAT — read this first */}
        <section className="section section--why" aria-labelledby="why">
          <div className="why-grid">
            <div>
              <span className="eyebrow">Read this first</span>
              <h2 id="why" style={{ marginTop: 8 }}>What this page measures and what it does not</h2>
            </div>
            <div className="why-body">
              <p>
                This page shows two separate things side by side: (1) official Australian
                labour-market indicators from the ABS, and (2) a contextual timeline of public
                AI-product rollout milestones. The two are not joined by a causal claim.
              </p>
              <p>
                There is no current Australian government dataset of automation/AI labour-market
                exposure that is source-safe to publish without estimation. International
                "occupational exposure" studies cannot be silently mapped to Australian rows
                because their methodology and concept boundaries differ. Where a clean row does
                not exist, this page leaves it unavailable rather than guessing.
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
                Cards marked "Source unavailable" are waiting on a verified key combination from
                the named ABS dataflow. We do not estimate.
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
              <span className="eyebrow">AI rollout timeline · context only</span>
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
                          : '—'}
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
              <p className="section__lede">All sources are public. Cards marked "Source unavailable" are awaiting verified values — we do not estimate, and we do not assert AI causation.</p>
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
                <p className="caption mono">Retrieved: {env.retrieved_at ? window.FR.fmtRetrieved(env.retrieved_at) : '—'}</p>
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
