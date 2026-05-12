const SERIES = [
  'rba_cash_rate',
  'rba_cash_rate_latest',
  'rba_household_debt_to_income',
  'rba_standard_variable_mortgage_rate',
  'rba_credit_card_debt_accruing_interest',
  'aofm_gov_gross_debt',
  'state_government_debt_summary',
  'abs_gdp_real_growth',
  'abs_unemployment_rate',
  'abs_cpi_inflation',
];

const ECON_STATUS_LEGEND = [
  ['observed', 'Verified', 'Source-backed and current enough for its cadence.'],
  ['partial', 'Partial', 'Source-backed, but incomplete by geography, household group, macro concept or update cadence.'],
  ['stale', 'Stale', 'Source-backed, but outside its expected cadence window.'],
  ['manual', 'Manual', 'Hand-keyed from a named public source or held as a manual snapshot pending a verified row.'],
  ['derived', 'Derived', 'Calculated or selected from a named source envelope.'],
  ['source-gated', 'Source-gated', 'Waiting for a verified source, field, period, unit and reuse rights.'],
  ['unavailable', 'Unavailable', 'No public source-safe feed is loaded.'],
  ['roadmap', 'Roadmap', 'Planned dashboard area, not yet populated.'],
];

const ECON_EVIDENCE_BOUNDARY = [
  {
    title: 'Unavailable does not mean zero',
    copy: 'Unavailable means no public source-safe feed has been loaded yet. It is not a statement that inflation pressure, wage pressure, debt stress, business conditions, arrears, hardship or household stress are zero, low or negligible.',
  },
  {
    title: 'Source-gated requires publisher verification',
    copy: 'Source-gated means the dashboard still needs a verified public source, exact field, period, unit and reuse boundary before an economic or household-stress value can be published.',
  },
  {
    title: 'Economic movement is not causation proof',
    copy: 'Observed economic movement is not treated as proof of policy, rate, labour-market, housing, fuel, energy or food-system causation unless a named source explicitly supports that link.',
  },
  {
    title: 'No estimates fill economic gaps',
    copy: 'This page does not estimate missing inflation, wage, debt, GDP, household-stress, business-condition, forecast, recession or causal values.',
  },
  {
    title: 'Priority is product triage',
    copy: 'Priority language on this page is editorial/product triage only. It is not an Economics Stress Index, recession probability model, official risk rating or forecast.',
  },
  {
    title: 'Visibility gap, not misconduct proof',
    copy: 'A missing public feed is a public visibility gap. It is not proof of wrongdoing, and likely holder or publisher fields are starting points for verification, not custody assertions.',
  },
];

function EconomicsStatusLegend() {
  return (
    <section className="section" aria-labelledby="economics-status-legend-h">
      <div className="section__head">
        <div>
          <span className="eyebrow">Status legend</span>
          <h2 id="economics-status-legend-h">Status labels used on this macroeconomic page</h2>
          <p className="section__lede">
            These labels match the Missing Data Scoreboard, Employment & Automation, Housing Pressure,
            Infrastructure and Power Grid. They are part of the evidence, not decoration.
          </p>
        </div>
      </div>
      <div className="confidence-legend" aria-label="Macroeconomic and household-stress status legend">
        <span className="confidence-legend__label">Legend</span>
        <dl>
          {ECON_STATUS_LEGEND.map(([kind, label, copy]) => (
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

function EconomicsAuditSummary() {
  const cards = [
    {
      title: 'Publicly visible economic signals',
      eyebrow: 'Source-backed indicator',
      copy: 'RBA cash-rate, mortgage-rate, household-debt and credit-card series are loaded where verified. ABS GDP, unemployment and CPI, plus AOFM Commonwealth securities and state debt context, remain separate source-backed signals.',
      href: '#metrics-h',
    },
    {
      title: 'Partial and manual macroeconomic feeds',
      eyebrow: 'Partial feed / manual snapshot',
      copy: 'State and territory debt rows are hand-keyed from named Treasury budget papers, with concept differences kept visible. AOFM securities outstanding is not treated as Budget Paper gross debt.',
      href: '#sources',
    },
    {
      title: 'Source-gated household-stress or business-condition feeds',
      eyebrow: 'Requires publisher verification',
      copy: 'Mortgage stress, rental stress, arrears, hardship, business conditions, regional household stress, policy effects and recession probability are not inferred from headline economic indicators.',
      href: '#sources',
    },
    {
      title: 'Highest-priority economic visibility gaps',
      eyebrow: 'Editorial/product triage only',
      copy: 'The most useful next feeds would separate safe aggregate mortgage pressure, arrears/hardship, rental stress, wages, business conditions, regional household stress and method-labelled housing models.',
      href: '../missing-data-scoreboard/index.html',
    },
  ];

  return (
    <section className="section" aria-labelledby="economics-summary-h">
      <div className="section__head">
        <div>
          <span className="eyebrow">30-second macroeconomic summary</span>
          <h2 id="economics-summary-h">What the macroeconomic resilience audit can and cannot show</h2>
          <p className="section__lede">
            These cards use categorical summaries rather than invented counts. They explain what is verifiable,
            what is partial, and what readers should not infer about causation, forecasts or economic collapse.
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

function EconomicsEvidenceBoundary() {
  return (
    <section className="section section--why" aria-labelledby="economics-evidence-boundary-h">
      <div className="section__head">
        <div>
          <span className="eyebrow">Evidence boundary</span>
          <h2 id="economics-evidence-boundary-h">What readers should not assume from missing or partial economic data</h2>
          <p className="section__lede">
            Read these statements before interpreting any macroeconomic, household-stress,
            inflation, debt, business-condition or resilience gap. They define how this
            public-source audit treats unavailable and source-gated information.
          </p>
        </div>
      </div>
      <div className="source-grid">
        {ECON_EVIDENCE_BOUNDARY.map(item => (
          <article className="source-card" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function EconomicsRelatedSurfaces() {
  const links = [
    {
      title: 'Missing Data Scoreboard',
      copy: 'Open the national audit of public-data gaps, likely publishers and next source actions.',
      href: '../missing-data-scoreboard/index.html',
      label: 'Open Missing Data Scoreboard',
    },
    {
      title: 'Employment & Automation',
      copy: 'Observed labour-market and workforce-transition signals that should not be turned into unsupported causation claims.',
      href: '../employment-automation-dashboard/index.html',
      label: 'Open Employment & Automation',
    },
    {
      title: 'Housing Pressure',
      copy: 'Source-backed housing-pressure signals and source-gated mortgage, rental, ownership and policy-model gaps.',
      href: '../housing-economic-pressure-dashboard/index.html',
      label: 'Open Housing Pressure',
    },
    {
      title: 'Infrastructure',
      copy: 'Project-delivery, logistics and readiness signals that shape economic capacity and cost pressure.',
      href: '../infrastructure-dashboard/index.html',
      label: 'Open Infrastructure',
    },
    {
      title: 'Power Grid',
      copy: 'Energy-reliability and wholesale power signals that feed into household, business and industrial pressure.',
      href: '../power-grid-dashboard/index.html',
      label: 'Open Power Grid',
    },
    {
      title: 'Food, Farms & Water',
      copy: 'Food-system, fertiliser, water and farm-input gaps that can affect prices, production and regional resilience.',
      href: '../fertilizer-dashboard/index.html',
      label: 'Open Food, Farms & Water',
    },
    {
      title: 'Sources and methodology',
      copy: 'Jump to the source envelopes loaded by this page and the no-causation-claim methodology.',
      href: '#sources',
      label: 'Open AU Economics methodology',
    },
  ];

  return (
    <section className="section" aria-labelledby="economics-related-h">
      <div className="section__head">
        <div>
          <span className="eyebrow">Audit navigation</span>
          <h2 id="economics-related-h">Open related public-data surfaces</h2>
          <p className="section__lede">
            Macroeconomic resilience connects to jobs, housing, infrastructure, energy, food,
            household stress, business conditions and public finance. These links keep observed
            economic indicators separate from unsupported causal claims.
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

function cashRateDelta(env) {
  const fields = env?.extra?.fields || {};
  const change = fields.target_change_percentage_points;
  const previous = fields.previous_target_value;
  if (typeof change !== 'number' || typeof previous !== 'number') return null;
  const direction = fields.change_direction === 'down' ? 'down' : fields.change_direction === 'up' ? 'up' : 'flat';
  const verb = direction === 'up' ? 'up' : direction === 'down' ? 'down' : 'unchanged';
  const pp = Math.abs(change).toLocaleString('en-AU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const prevText = previous.toLocaleString('en-AU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const dateText = fields.previous_observation_date ? ` from ${fields.previous_observation_date}` : '';
  return {
    dir: direction,
    text: `${verb} ${pp} pp vs previous RBA decision target (${prevText}%)${dateText}`,
  };
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
        <Header active="au_economics" refreshStatus={refreshStatus}/>
        <main id="main"><div className="loading-wrap">Loading source envelopes...</div></main>
      </div>
    );
  }

  const latestRetrieved = window.FR.latestVerifiedRetrieved(data);
  const updatedDisplay = window.FR.fmtVerifiedUpdated(latestRetrieved);

  return (
    <div className="page">
      <Header active="au_economics" refreshStatus={refreshStatus} updated={latestRetrieved ? updatedDisplay : ''}/>

      <main id="main">
        {/* INTRO */}
        <section className="intro" id="au-economics">
          <div>
            <span className="eyebrow">Macroeconomic resilience audit prototype</span>
            <h1 style={{ marginTop: 12 }}>What Australia&rsquo;s public economic data can verify - and what remains source-gated</h1>
            <p className="intro__lede">
              This dashboard separates source-backed macroeconomic and household-stress indicators
              from partial, manual and source-gated feeds so readers can see economic resilience
              signals without invented certainty.
            </p>
            <p className="intro__lede">
              It tracks interest rates, debt, activity, unemployment and inflation where public
              sources support them. It does not estimate missing wages, household stress,
              business conditions, forecasts, recession probability or causal claims.
            </p>
          </div>
          <aside className="intro__meta" aria-label="Publication details">
            <strong>Boundary</strong>
            <span>Independent public-source prototype. No economic cause, stress score or forecast is invented from partial data.</span>
            <div style={{ height: 12 }}/>
            <strong>Last reviewed</strong>
            <span>metadata pending</span>
          </aside>
        </section>

        <EconomicsStatusLegend/>
        <EconomicsAuditSummary/>
        <EconomicsEvidenceBoundary/>
        <EconomicsRelatedSurfaces/>
        <DataCoverage data={data} refreshStatus={refreshStatus}/>

        {/* WHY THIS MATTERS */}
        <section className="section section--why" aria-labelledby="why">
          <div className="why-grid">
            <div>
              <span className="eyebrow">What this is</span>
              <h2 id="why" style={{ marginTop: 8 }}>Macroeconomic source status comes first</h2>
            </div>
            <div className="why-body">
              <p>
                The cash rate set by the Reserve Bank flows through to every variable mortgage,
                every business loan, and every credit card balance accruing interest. When debt
                is high relative to income - for households, for the federal government, or for
                the states - even small moves in the cash rate change a lot of household budgets
                and a lot of public budgets.
              </p>
              <p>
                This page tracks the public numbers that drive those decisions: the RBA cash
                rate, household debt-to-income, headline mortgage rates, credit card balances,
                Commonwealth and state debt, GDP growth, unemployment and CPI. Values appear
                only when the named publisher has been verified.
              </p>
              <p>
                A missing wage, household-stress, arrears, hardship, business-condition or
                recession-probability feed is a public visibility gap. It is not evidence that
                pressure is zero, that the economy is collapsing, or that any single policy,
                sector or source caused a movement.
              </p>
              <p className="body-sm" style={{ color: 'var(--ink-3)', marginTop: 12 }}>
                Acronyms used here: <b>RBA</b> = Reserve Bank of Australia.
                <b> AOFM</b> = Australian Office of Financial Management (issues Commonwealth debt).
                <b> ABS</b> = Australian Bureau of Statistics.
                <b> CPI</b> = Consumer Price Index.
                <b> GDP</b> = Gross Domestic Product.
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
                Cards marked source-gated, manual, partial, stale or unavailable are waiting on
                a verified publisher field, table, factual row or cadence update. We do not estimate.
              </p>
            </div>
          </div>
          <div className="metric-grid metric-grid--4">
            <MetricCard
              eyebrow="Interest rate"
              label="RBA cash rate target"
              plain="Latest official cash-rate target decision published by the RBA. No forecast or estimate is used."
              fromEnvelope={data.rba_cash_rate_latest}
              unit="%"
              delta={cashRateDelta(data.rba_cash_rate_latest)}
              highlight
            />
            <MetricCard
              eyebrow="Mortgages"
              label="Standard variable home loan rate"
              plain="The indicator standard variable owner-occupier rate published by the RBA in Statistical Table F5."
              fromEnvelope={data.rba_standard_variable_mortgage_rate}
              unit="%"
            />
            <MetricCard
              eyebrow="Household debt"
              label="Household debt to disposable income"
              plain="Total household debt as a per cent of household disposable income, RBA Statistical Table E2."
              fromEnvelope={data.rba_household_debt_to_income}
              unit="%"
            />
            <MetricCard
              eyebrow="Credit cards"
              label="Card balances accruing interest"
              plain="Total credit and charge card balances on which households are paying interest, RBA Table C1.1."
              fromEnvelope={data.rba_credit_card_debt_accruing_interest}
              unit=" AUD millions"
            />
          </div>

          <div style={{ height: 16 }}/>

          <div className="metric-grid metric-grid--4">
            <MetricCard
              eyebrow="Federal debt"
              label="Australian Government Securities outstanding"
              plain="Annual face value of Australian Government Securities outstanding, from AOFM stock_ags.csv. This is not Budget Paper gross debt."
              fromEnvelope={data.aofm_gov_gross_debt}
              unit=" AUD billions"
            />
            <MetricCard
              eyebrow="State debt"
              label="State & territory net debt"
              plain={(() => {
                const f = data.state_government_debt_summary?.extra?.fields || {};
                const loaded = f.jurisdictions_loaded;
                const total = f.jurisdictions_total;
                const sources = f.rows_with_named_source;
                if (typeof loaded === 'number' && typeof total === 'number') {
                  return `Coverage: ${loaded}/${total} jurisdiction values populated, ${sources}/${total} named Treasury source URLs identified. ${f.national_aggregate_status === 'Not published' ? 'No national aggregate published - rows are not safe to sum.' : ''}`;
                }
                return 'General government net debt by state and territory, hand-keyed from each Treasury budget paper.';
              })()}
              value={(() => {
                const f = data.state_government_debt_summary?.extra?.fields || {};
                if (typeof f.jurisdictions_total === 'number') return `${f.jurisdictions_loaded || 0}/${f.jurisdictions_total}`;
                return null;
              })()}
              unit=" jurisdictions populated"
              source={data.state_government_debt_summary?.source_name || 'State and territory budget papers'}
            />
            <MetricCard
              eyebrow="Activity"
              label="Real GDP growth"
              plain="Quarterly seasonally adjusted change in real Gross Domestic Product, ABS National Accounts."
              fromEnvelope={data.abs_gdp_real_growth}
              unit="%"
            />
            <MetricCard
              eyebrow="Jobs"
              label="Unemployment rate"
              plain="Monthly seasonally adjusted unemployment rate, ABS Labour Force release."
              fromEnvelope={data.abs_unemployment_rate}
              unit="%"
            />
          </div>

          <div style={{ height: 16 }}/>

          <div className="metric-grid metric-grid--4">
            <MetricCard
              eyebrow="Prices"
              label="CPI inflation, annual"
              plain="All-groups Consumer Price Index annual percentage change, ABS Cat. 6401.0."
              fromEnvelope={data.abs_cpi_inflation}
              unit="%"
            />
          </div>

          {(() => {
            const stateRows = data.state_government_debt_summary?.extra?.fields?.rows || [];
            const stateFields = data.state_government_debt_summary?.extra?.fields || {};
            if (!stateRows.length) return null;
            return (
              <section style={{ marginTop: 24 }}>
                <h3 style={{ marginBottom: 8 }}>State and territory government net debt - coverage table</h3>
                <p className="caption" style={{ marginBottom: 12 }}>
                  Eight jurisdiction values are hand-keyed from official Treasury Budget Paper PDFs.
                  Rows shown as Partial coverage are verified but use a different public-sector
                  boundary from the preferred GGS concept. <b>No national aggregate is published</b> -
                  rows are not safe to sum (definitions, scope, and rounding differ between jurisdictions;
                  ACT and NT have smaller jurisdictional scope than mainland states). Commonwealth AOFM
                  debt is shown separately above.
                </p>
                <div className="data-table-wrap">
                  <table className="data-table data-table--sticky">
                    <thead>
                      <tr>
                        <th>Jurisdiction</th>
                        <th>Concept</th>
                        <th>Budget year</th>
                        <th style={{ textAlign: 'right' }}>Value</th>
                        <th>Coverage</th>
                        <th>Source / caveat</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stateRows.map(row => (
                        <tr key={row.jurisdiction}>
                          <td><b>{row.jurisdiction}</b></td>
                          <td>{row.debt_concept}</td>
                          <td className="mono">{row.budget_year}<br/><span className="caption">{row.period}</span></td>
                          <td style={{ textAlign: 'right' }} className={row.value == null ? 'unavail' : ''}>
                            {row.value == null
                              ? '-'
                              : `A$${row.value.toLocaleString('en-AU', { maximumFractionDigits: 1 })}b`}
                          </td>
                          <td><span className="caption">{row.coverage_label}</span></td>
                          <td>
                            <span className="caption">{row.comparability_note}</span><br/>
                            {row.source_url && (
                              <a href={row.source_url}>{row.source_url.replace(/^https?:\/\//,'').slice(0, 50)} <Icon name="external" size={12}/></a>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="caption" style={{ marginTop: 12 }}>
                  <b>Aggregate boundary:</b> {stateFields.national_aggregate_note || ''}
                </p>
              </section>
            );
          })()}

          <div className="pending-list" aria-label="Pending economics source coverage">
            <article className="source-card">
              <h4>Source coverage</h4>
              <p className="body-sm">
                State and territory net debt now has official Treasury budget-paper values for
                all 8 jurisdictions, with WA and NT kept as Partial coverage because their loaded
                concepts are not the preferred GGS measure. No national aggregate is published because
                the rows are not safe to sum across jurisdictions. The RBA cash-rate headline uses
                the latest official RBA decision-table row while the chart keeps the F1.1 monthly-average history.
                Household debt, mortgage-rate and credit-card series load from verified RBA CSVs. ABS GDP, unemployment and CPI load
                from verified ABS Data API keys. AOFM federal securities outstanding is hand-keyed
                from the official annual stock CSV. Commonwealth AOFM debt and state/territory debt
                stay clearly separate.
              </p>
            </article>
          </div>
        </section>

        {/* CHARTS */}
        <section className="section" aria-labelledby="charts-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">How it's changed</span>
              <h2 id="charts-h">The cash rate, debt and prices over time</h2>
              <p className="section__lede">Charts populate when verified source data is available. Hover any point, or use arrow keys, to read the value.</p>
            </div>
          </div>

          <div className="charts-grid charts-grid--full">
            <ChartCard
              eyebrow="Interest rate"
              title="RBA cash rate target"
              unit="%"
              fromEnvelope={data.rba_cash_rate}
              ranges={['1Y','3Y','5Y']}
              defaultRange="5Y"
              accent="#1F3A8A"
              takeaway="Monthly-average RBA cash-rate target history from Statistical Table F1.1. The headline card above uses the latest official decision-table row instead."
              yAxisLabel="Cash rate target (%)"
            />
          </div>

          <div style={{ height: 24 }}/>

          <div className="charts-grid">
            <ChartCard
              eyebrow="Household debt"
              title="Household debt to disposable income"
              unit="%"
              fromEnvelope={data.rba_household_debt_to_income}
              ranges={['3Y','5Y']}
              defaultRange="5Y"
              accent="#0F766E"
              takeaway="Quarter-end ratio of household debt to disposable income, from RBA Table E2."
              yAxisLabel="Household debt to income (%)"
            />
            <ChartCard
              eyebrow="Jobs"
              title="Unemployment rate, seasonally adjusted"
              unit="%"
              fromEnvelope={data.abs_unemployment_rate}
              ranges={['1Y','3Y','5Y']}
              defaultRange="3Y"
              accent="#B45309"
              takeaway="Headline seasonally adjusted unemployment rate from the ABS Labour Force release."
              yAxisLabel="Unemployment rate (%)"
            />
          </div>

          <div style={{ height: 24 }}/>

          <div className="charts-grid">
            <ChartCard
              eyebrow="Prices"
              title="CPI inflation, annual"
              unit="%"
              fromEnvelope={data.abs_cpi_inflation}
              ranges={['3Y','5Y']}
              defaultRange="5Y"
              accent="#6B7280"
              takeaway="Annual percentage change in the all-groups Consumer Price Index, ABS Cat. 6401.0."
              yAxisLabel="CPI annual change (%)"
            />
            <ChartCard
              eyebrow="Activity"
              title="Real GDP growth, quarterly"
              unit="%"
              fromEnvelope={data.abs_gdp_real_growth}
              ranges={['3Y','5Y']}
              defaultRange="5Y"
              accent="#1F3A8A"
              takeaway="Seasonally adjusted percentage change in real GDP, from the ABS quarterly National Accounts."
              yAxisLabel="Real GDP growth (%)"
            />
          </div>
        </section>

        {/* WHAT CHANGED */}
        <section className="section">
          <InsightFeed
            items={[]}
            title="What changed"
            lede="Populated from RBA / AOFM / ABS release notes as verified data arrives."
            emptyMessage="Awaiting verified release notes for the loaded economics source envelopes."
          />
        </section>

        {/* SOURCES & METHODOLOGY */}
        <section className="section section--sources" id="sources">
          <div className="section__head">
            <div>
              <span className="eyebrow">Sources & methodology</span>
              <h2>Every dataset used on this page</h2>
              <p className="section__lede">All sources are public. Cards marked source-gated, manual or unavailable are awaiting verified values. We do not estimate, and we do not invent causal claims.</p>
            </div>
          </div>
          <div className="sources-grid">
            {Object.entries(data).map(([id, env]) => (
              <article key={id} className="source-card">
                <h4>{env.source_name}</h4>
                <p className="body-sm">
                  {env.status === 'ok'
                    ? `Verified. ${env.values.length} data points; latest ${env.last_data_point || 'unknown'}.`
                    : 'Awaiting hand-keyed values from the named public source, or intentionally unavailable until publisher verification is complete.'}
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
              <dt>RBA cash rate target</dt>
              <dd>The headline card uses the latest official cash-rate target row from the RBA cash-rate decisions table. The chart preserves the F1.1 monthly-average cash-rate target history. No forecast, interpolation or estimate is used.</dd>
              <dt>Standard variable home loan rate</dt>
              <dd>Indicator standard variable owner-occupier rate from RBA Statistical Table F5. The fetcher selects the verified Table F5 CSV column whose title is "Lending rates; Housing loans; Banks; Variable; Standard; Owner-occupier".</dd>
              <dt>Household debt to disposable income</dt>
              <dd>Total household debt expressed as a per cent of household disposable income, from RBA Statistical Table E2 (Selected Household Finances Ratios). Quarter-end values.</dd>
              <dt>Credit card balances accruing interest</dt>
              <dd>Total credit and charge card balances on which interest is being charged, from the RBA Statistical Table C1.1 aggregate CSV column "Balances accruing interest". Values are AUD millions for larger Australian card issuers, preserving the RBA source boundary.</dd>
              <dt>Australian Government Securities outstanding</dt>
              <dd>Annual Australian Government Securities face value in AUD billions, hand-keyed from AOFM stock_ags.csv. This card is not Commonwealth general government gross debt from Budget Papers.</dd>
              <dt>State and territory net debt</dt>
              <dd>General government net debt for each state and territory, hand-keyed once a year from the named Budget Paper or Budget Statement (typically Budget Paper 2). No single Commonwealth dataset consolidates these on a comparable basis.</dd>
              <dt>Real GDP growth</dt>
              <dd>Seasonally adjusted percentage change in real Gross Domestic Product, from the ABS Data API ANA_AGG dataflow and the quarterly National Accounts release (Cat. 5206.0).</dd>
              <dt>Unemployment rate</dt>
              <dd>Headline monthly seasonally adjusted unemployment rate, from the ABS Data API LF dataflow and Labour Force Australia (Cat. 6202.0).</dd>
              <dt>CPI inflation</dt>
              <dd>All-groups Consumer Price Index annual percentage change, from the ABS Data API CPI dataflow and Consumer Price Index Australia (Cat. 6401.0).</dd>
              <dt>What this does not prove</dt>
              <dd>These indicators do not prove economic recovery, economic collapse, household stress, business conditions, wage pressure, mortgage hardship, rental stress, recession probability or policy causation. A causal or stress row requires a named public source with a field, period, unit, method and reuse boundary.</dd>
            </dl>
          </div>
        </section>

        <Footer refreshStatus={refreshStatus} updated={latestRetrieved ? updatedDisplay : ''}/>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
