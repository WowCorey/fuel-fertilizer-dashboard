const SERIES = [
  'rba_cash_rate_latest',
  'rba_cash_rate',
  'rba_household_debt_to_income',
  'rba_standard_variable_mortgage_rate',
  'rba_credit_card_debt_accruing_interest',
  'abs_cpi_inflation',
  'abs_unemployment_rate',
  'abs_residential_dwelling_stock',
  'nhsac_housing_target_progress',
];

const QUICK_GUIDE = [
  ['1', 'Interest-rate signal', 'Start with the latest official RBA cash-rate target and its monthly history.'],
  ['2', 'Household-debt pressure', 'Read RBA household debt and mortgage-rate context before any stress interpretation.'],
  ['3', 'Housing market source gaps', 'Check which housing indicators are source-backed, partial or still gated.'],
  ['4', 'Policy/model gaps', 'Do not treat repayment, rental stress or negative-gearing claims as observed data.'],
  ['5', 'What still needs publishing', 'Use the missing-feed list as a public-data request, not an estimate prompt.'],
];

const HOUSING_GAPS = [
  {
    label: 'Mortgage repayment pressure',
    status: 'source-gated',
    why: 'Repayment pressure is what many households feel, but it depends on loan size, rate type, term, offset balances and income.',
    blocker: 'No named source and method are loaded for a national repayment-pressure model.',
    action: 'Load source-backed loan, rate, term and income assumptions before publishing a model.',
  },
  {
    label: 'First-home buyer indicators',
    status: 'roadmap',
    why: 'First-home buyer access shows whether new households can enter the market.',
    blocker: 'No clean first-home buyer source row is loaded on this page.',
    action: 'Scope ABS, APRA or official housing finance rows with period, unit and geography.',
  },
  {
    label: 'Investor ownership / investor lending',
    status: 'roadmap',
    why: 'Investor activity affects competition for housing and policy debate.',
    blocker: 'Investor lending, ownership and tax concepts are different datasets.',
    action: 'Keep ownership, lending and tax rows separate until exact official fields are verified.',
  },
  {
    label: 'Rental stress',
    status: 'source-gated',
    why: 'Rent stress requires rent, income and geography definitions.',
    blocker: 'No official/public rent-to-income stress series is loaded.',
    action: 'Use safe aggregate rental stress indicators only after source and method are explicit.',
  },
  {
    label: 'Dwelling approvals / housing supply',
    status: 'partial',
    why: 'Supply pressure needs both stock and pipeline views.',
    blocker: 'National dwelling stock and NHSAC target progress are loaded, but approvals/completions by region are not.',
    action: 'Add approvals, completions or pipeline rows only from named ABS/NHSAC/state sources.',
  },
  {
    label: 'Negative gearing model',
    status: 'roadmap',
    why: 'Negative gearing claims need tax data, ownership structure, income bands and a transparent method.',
    blocker: 'No tax model or assumptions are loaded.',
    action: 'Keep as methodology-gated until source fields and model assumptions are public.',
  },
  {
    label: 'Household debt expansion',
    status: 'partial',
    why: 'RBA household debt-to-income is loaded, but it is not a full housing stress model.',
    blocker: 'Debt-to-income does not include repayment burden, arrears or regional distribution.',
    action: 'Extend only with verified RBA, ABS, APRA or other official rows.',
  },
];

const PUBLISH_ROWS = [
  ['Machine-readable first-home buyer indicators', 'Safe public rows with period, geography, unit and source rights.'],
  ['Investor lending / investor ownership fields', 'Separate lending flow, ownership stock and tax concepts.'],
  ['Rental stress by region', 'Safe aggregate rent/income definitions without identifying households.'],
  ['Dwelling approvals / completions by region', 'Comparable approvals, completions and pipeline status.'],
  ['Mortgage arrears / hardship where public and safe', 'Aggregate hardship indicators with privacy boundaries.'],
  ['Negative gearing tax data by region/income band if publicly available', 'Tax model inputs need source fields and assumptions.'],
  ['Household debt and repayment pressure inputs', 'Loan balance, rate, term and income assumptions for any model.'],
  ['Housing supply pipeline status', 'Public project/status fields that can be tracked over time.'],
  ['Public boundary for what cannot be published', 'Clear privacy and sensitivity rules for housing finance data.'],
];

function latest(env) {
  if (!env || env.status !== 'ok' || !env.values?.length) return null;
  return env.values.at(-1);
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

function GatedCard({ row }) {
  return (
    <article className="source-card">
      <div className="card-status-row">
        <span className="eyebrow">{row.label}</span>
        <TrustBadge kind={row.status}/>
      </div>
      <h4>{row.label}</h4>
      <p className="body-sm">{row.why}</p>
      <p className="caption"><b>Current blocker:</b> {row.blocker}</p>
      <p className="caption"><b>Next source action:</b> {row.action}</p>
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
        <Header active="housing_pressure" refreshStatus={refreshStatus}/>
        <main id="main"><div className="loading-wrap">Loading source envelopes...</div></main>
      </div>
    );
  }

  const latestRetrieved = window.FR.latestVerifiedRetrieved(data);
  const updatedDisplay = window.FR.fmtVerifiedUpdated(latestRetrieved);
  const cashFields = data.rba_cash_rate_latest?.extra?.fields || {};
  const dwellLatest = latest(data.abs_residential_dwelling_stock);
  const nhsacFields = data.nhsac_housing_target_progress?.extra?.fields || {};

  return (
    <div className="page">
      <Header active="housing_pressure" refreshStatus={refreshStatus} updated={latestRetrieved ? updatedDisplay : ''}/>

      <main id="main">
        <section className="intro" id="housing-pressure">
          <div>
            <span className="eyebrow">Housing and economic pressure - v0.1</span>
            <h1 style={{ marginTop: 12 }}>Housing and economic pressure</h1>
            <p className="intro__lede">
              Tracks source-backed interest-rate, household-debt and housing-pressure signals while
              keeping mortgage stress, investor ownership, rental stress, first-home buyer and
              negative-gearing gaps visible until official/public sources are loaded.
            </p>
            <p className="body-sm" style={{ marginTop: 16, color: 'var(--ink-2)' }}>
              This page is an independent public-source prototype. It does not estimate household
              repayments, rental stress, negative-gearing effects or housing affordability unless a
              named source and transparent method are loaded.
            </p>
          </div>
          <aside className="intro__meta" aria-label="Publication details">
            <strong>Verified data retrieved</strong>
            <span className="mono">{updatedDisplay}</span>
            <div style={{ height: 12 }}/>
            <strong>Boundary</strong>
            <span>Observed indicators only - no repayment, rental or tax model</span>
          </aside>
        </section>

        <DataCoverage data={data} refreshStatus={refreshStatus}/>

        <section className="section section--why" aria-labelledby="guide-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Use this page in order</span>
              <h2 id="guide-h">Read indicators before interpreting pressure</h2>
              <p className="section__lede">
                The strongest rows are official interest-rate and macro indicators. The housing stress
                rows are deliberately source-gated until the source and method are explicit.
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

        <section className="section" aria-labelledby="signals-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Source-backed signals</span>
              <h2 id="signals-h">Official indicators loaded now</h2>
              <p className="section__lede">
                These cards reuse existing RBA, ABS and NHSAC source envelopes. They are not converted
                into a housing stress score.
              </p>
            </div>
          </div>
          <div className="metric-grid metric-grid--4">
            <MetricCard
              eyebrow="Interest-rate signal"
              label="Latest RBA cash-rate target"
              plain={`Latest official cash-rate decision row. Effective date: ${cashFields.latest_observation_date || data.rba_cash_rate_latest?.last_data_point || 'unknown'}.`}
              fromEnvelope={data.rba_cash_rate_latest}
              unit="%"
              delta={cashRateDelta(data.rba_cash_rate_latest)}
              highlight
            />
            <MetricCard
              eyebrow="Mortgage rate context"
              label="Standard variable owner-occupier rate"
              plain="RBA indicator standard variable owner-occupier housing loan rate. This is a rate signal, not a repayment model."
              fromEnvelope={data.rba_standard_variable_mortgage_rate}
              unit="%"
            />
            <MetricCard
              eyebrow="Household debt pressure"
              label="Household debt to disposable income"
              plain="RBA household debt as a per cent of annualised household disposable income. This is partial pressure context, not a stress score."
              fromEnvelope={data.rba_household_debt_to_income}
              unit="%"
              partial
            />
            <MetricCard
              eyebrow="Card debt context"
              label="Credit-card balances accruing interest"
              plain="RBA card balances accruing interest. Useful cost-of-living context, but not a housing-specific repayment metric."
              fromEnvelope={data.rba_credit_card_debt_accruing_interest}
              unit=" AUD millions"
            />
          </div>

          <div style={{ height: 16 }}/>

          <div className="metric-grid metric-grid--4">
            <MetricCard
              eyebrow="Inflation context"
              label="CPI inflation, annual"
              plain="ABS all-groups CPI annual percentage change. This gives cost-of-living context, not housing causation."
              fromEnvelope={data.abs_cpi_inflation}
              unit="%"
            />
            <MetricCard
              eyebrow="Labour context"
              label="Unemployment rate"
              plain="ABS headline seasonally adjusted unemployment rate. Labour-market context only."
              fromEnvelope={data.abs_unemployment_rate}
              unit="%"
            />
            <MetricCard
              eyebrow="Housing stock"
              label="Residential dwellings"
              plain="ABS national residential dwelling stock, in thousands. This is stock context, not approvals or affordability."
              fromEnvelope={data.abs_residential_dwelling_stock}
              unit=" thousand dwellings"
            />
            <MetricCard
              eyebrow="Housing supply target"
              label="National Housing Accord progress"
              plain={`NHSAC progress against the 1.2 million homes target${nhsacFields.completion_period ? `, ${nhsacFields.completion_period}` : ''}.`}
              fromEnvelope={data.nhsac_housing_target_progress}
              unit="% of target built to date"
              partial
            />
          </div>

          <div className="pending-list" aria-label="Loaded housing source boundaries">
            <article className="source-card">
              <h4>What is real here</h4>
              <p className="body-sm">
                The latest RBA target, monthly cash-rate history, RBA mortgage-rate context,
                RBA household debt, CPI, unemployment, residential dwelling stock and NHSAC
                housing-target progress are loaded from existing source envelopes. No repayment,
                rental stress, investor ownership, first-home buyer or negative-gearing value is
                created from these inputs.
              </p>
            </article>
            <article className="source-card">
              <h4>Housing stock context</h4>
              <p className="body-sm">
                {dwellLatest
                  ? `The loaded ABS dwelling-stock envelope latest value is ${dwellLatest.v.toLocaleString('en-AU')} thousand dwellings for ${dwellLatest.t}.`
                  : 'The dwelling-stock card will populate only when the ABS envelope is verified.'}
                {' '}This remains separate from regional approvals, completions, rents and prices.
              </p>
            </article>
          </div>
        </section>

        <section className="section" aria-labelledby="charts-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">History</span>
              <h2 id="charts-h">Cash-rate history and pressure context</h2>
              <p className="section__lede">
                The headline cash-rate card uses the latest official decision row. The chart keeps
                the existing monthly mean/history series.
              </p>
            </div>
          </div>
          <div className="charts-grid charts-grid--full">
            <ChartCard
              eyebrow="Interest-rate history"
              title="RBA cash-rate target, monthly history"
              unit="%"
              fromEnvelope={data.rba_cash_rate}
              ranges={['1Y','3Y','5Y']}
              defaultRange="5Y"
              accent="#1F3A8A"
              takeaway="Monthly-average cash-rate target history from RBA Statistical Table F1.1. The latest decision headline is shown above."
              yAxisLabel="Cash-rate target (%)"
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
              takeaway="Quarter-end household debt-to-income from RBA Table E2."
              yAxisLabel="Household debt to income (%)"
            />
            <ChartCard
              eyebrow="Mortgage rate context"
              title="Standard variable owner-occupier rate"
              unit="%"
              fromEnvelope={data.rba_standard_variable_mortgage_rate}
              ranges={['1Y','3Y','5Y']}
              defaultRange="5Y"
              accent="#B45309"
              takeaway="RBA indicator lending rate for standard variable owner-occupier housing loans. No repayment assumptions are added."
              yAxisLabel="Indicator rate (%)"
            />
          </div>
          <div style={{ height: 24 }}/>
          <div className="charts-grid">
            <ChartCard
              eyebrow="Inflation"
              title="CPI inflation, annual"
              unit="%"
              fromEnvelope={data.abs_cpi_inflation}
              ranges={['3Y','5Y']}
              defaultRange="5Y"
              accent="#6B7280"
              takeaway="ABS all-groups CPI annual percentage change."
              yAxisLabel="Annual change (%)"
            />
            <ChartCard
              eyebrow="Housing stock"
              title="Residential dwelling stock"
              unit="thousand dwellings"
              fromEnvelope={data.abs_residential_dwelling_stock}
              ranges={['3Y','5Y']}
              defaultRange="5Y"
              accent="#1F3A8A"
              takeaway="ABS national residential dwelling stock, quarterly."
              yAxisLabel="Dwellings (thousands)"
            />
          </div>
        </section>

        <section className="section" aria-labelledby="gaps-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Housing pressure gaps</span>
              <h2 id="gaps-h">What remains source-gated</h2>
              <p className="section__lede">
                These are not hidden calculations. They stay visible as public-data and methodology gaps.
              </p>
            </div>
          </div>
          <div className="source-grid">
            {HOUSING_GAPS.map(row => <GatedCard key={row.label} row={row}/>)}
          </div>
        </section>

        <section className="section section--why" aria-labelledby="boundary-h">
          <div className="why-grid">
            <div>
              <span className="eyebrow">Policy and model boundary</span>
              <h2 id="boundary-h" style={{ marginTop: 8 }}>Official indicators are not models</h2>
            </div>
            <div className="why-body">
              <p>
                RBA cash rate is a source-backed official policy signal. Mortgage repayment pressure
                requires loan-size, rate, term and household-income assumptions. Rental stress requires
                rent, income and geography definitions. Investor ownership and negative gearing require
                tax/housing datasets and a documented method.
              </p>
              <p>
                This dashboard separates official indicators from models. A model can be useful, but it
                must be labelled as a model, show its assumptions, and avoid pretending to be observed data.
              </p>
              <p className="body-sm" style={{ color: 'var(--ink-3)', marginTop: 12 }}>
                The page will not combine these rows into a stress score until the method and sources are explicit.
              </p>
            </div>
          </div>
        </section>

        <section className="section" aria-labelledby="publish-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">What government still needs to publish</span>
              <h2 id="publish-h">Safe aggregate indicators, not private household detail</h2>
              <p className="section__lede">
                Some finance and tax data is privacy-sensitive. The useful public request is for
                safe aggregate indicators with dates, definitions, units and reuse terms.
              </p>
            </div>
          </div>
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Missing feed</th>
                  <th>What would make it publishable</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {PUBLISH_ROWS.map(([gap, action]) => (
                  <tr key={gap}>
                    <td><b>{gap}</b></td>
                    <td>{action}</td>
                    <td><TrustBadge kind="source-gated"/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="section section--sources" id="sources">
          <div className="section__head">
            <div>
              <span className="eyebrow">Sources & methodology</span>
              <h2>Every dataset used on this page</h2>
              <p className="section__lede">
                All loaded values come from existing source envelopes. Cards marked source-gated do
                not have a value until a named public source and method are loaded.
              </p>
            </div>
          </div>
          <div className="sources-grid">
            {Object.entries(data).map(([id, env]) => (
              <article key={id} className="source-card">
                <h4>{env.source_name}</h4>
                <p className="body-sm">
                  {env.status === 'ok'
                    ? `Verified. ${env.values.length} data points; latest ${env.last_data_point || 'unknown'}.`
                    : 'Awaiting values from the named public source.'}
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
            <h3>How to read the housing page</h3>
            <dl>
              <dt>Latest RBA cash-rate target</dt>
              <dd>Headline value from `rba_cash_rate_latest`, the official RBA cash-rate decisions table. Previous target and change direction are source fields from that envelope.</dd>
              <dt>Cash-rate history</dt>
              <dd>Historical chart from `rba_cash_rate`, the existing RBA F1.1 monthly-average cash-rate target series.</dd>
              <dt>Household debt pressure</dt>
              <dd>RBA household debt-to-disposable-income is an observed ratio. It is not a repayment-burden or stress model.</dd>
              <dt>Mortgage rate context</dt>
              <dd>RBA standard variable owner-occupier indicator rate gives rate pressure context only. No loan-size, term, offset or repayment calculation is added.</dd>
              <dt>Housing stock and supply context</dt>
              <dd>ABS residential dwelling stock and NHSAC Accord progress are source-backed supply context. They are not rental stress, affordability or regional supply pipeline models.</dd>
              <dt>No-estimate rule</dt>
              <dd>Mortgage repayments, rental stress, investor ownership, first-home buyer access and negative-gearing effects remain source-gated until source fields and methods are explicit.</dd>
            </dl>
          </div>
        </section>

        <Footer refreshStatus={refreshStatus} updated={latestRetrieved ? updatedDisplay : ''}/>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
