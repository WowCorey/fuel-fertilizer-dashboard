const SERIES = [
  'rba_cash_rate',
  'rba_household_debt_to_income',
  'rba_standard_variable_mortgage_rate',
  'rba_credit_card_debt_accruing_interest',
  'aofm_gov_gross_debt',
  'state_government_debt_summary',
  'abs_gdp_real_growth',
  'abs_unemployment_rate',
  'abs_cpi_inflation',
];

function App() {
  const [data, setData] = React.useState(null);
  React.useEffect(() => { window.FR.load(SERIES).then(setData); }, []);

  if (!data) {
    return (
      <div className="page">
        <Header active="au_economics"/>
        <main id="main"><div className="loading-wrap">Loading source envelopes...</div></main>
      </div>
    );
  }

  const latestRetrieved = window.FR.latestVerifiedRetrieved(data);
  const updatedDisplay = window.FR.fmtVerifiedUpdated(latestRetrieved);

  return (
    <div className="page">
      <Header active="au_economics" updated={latestRetrieved ? updatedDisplay : ''}/>

      <main id="main">
        {/* INTRO */}
        <section className="intro" id="au-economics">
          <div>
            <span className="eyebrow">AU economics · v1.0</span>
            <h1 style={{ marginTop: 12 }}>Australia's economy, in plain English.</h1>
            <p className="intro__lede">
              The cost of money, the size of the debts the country and its households carry,
              and the rate at which people are working or losing work. These are the public
              numbers that decide how much your mortgage costs, how hard it is to get a job,
              and whether the government has room to spend.
            </p>
          </div>
          <aside className="intro__meta" aria-label="Publication details">
            <strong>Verified data retrieved</strong>
            <span className="mono">{updatedDisplay}</span>
            <div style={{ height: 12 }}/>
            <strong>Refresh</strong>
            <span>Live where fetched · manual only after verification</span>
          </aside>
        </section>

        <DataCoverage data={data}/>

        {/* WHY THIS MATTERS */}
        <section className="section section--why" aria-labelledby="why">
          <div className="why-grid">
            <div>
              <span className="eyebrow">What this is</span>
              <h2 id="why" style={{ marginTop: 8 }}>Why this matters to you</h2>
            </div>
            <div className="why-body">
              <p>
                The cash rate set by the Reserve Bank flows through to every variable mortgage,
                every business loan, and every credit card balance accruing interest. When debt
                is high relative to income — for households, for the federal government, or for
                the states — even small moves in the cash rate change a lot of household budgets
                and a lot of public budgets.
              </p>
              <p>
                This page tracks the public numbers that drive those decisions: the RBA cash
                rate, household debt-to-income, headline mortgage rates, credit card balances,
                Commonwealth and state debt, GDP growth, unemployment and CPI. Values appear
                only when the named publisher has been verified.
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
                Cards marked "Source unavailable" are waiting on a verifiable figure from the
                named source. We do not estimate.
              </p>
            </div>
          </div>
          <div className="metric-grid metric-grid--4">
            <MetricCard
              eyebrow="Interest rate"
              label="RBA cash rate target"
              plain="The headline policy interest rate set by the Reserve Bank, from RBA Statistical Table F1.1."
              fromEnvelope={data.rba_cash_rate}
              unit="%"
              highlight
            />
            <MetricCard
              eyebrow="Mortgages"
              label="Standard variable home loan rate"
              plain="The indicator standard variable owner-occupier rate published by the RBA in Tables F5/F6."
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
              plain="Face-value total of Treasury Bonds, Indexed Bonds and Treasury Notes on issue, from AOFM."
              fromEnvelope={data.aofm_gov_gross_debt}
              unit=" AUD billions"
            />
            <MetricCard
              eyebrow="State debt"
              label="State & territory net debt"
              plain="General government net debt by state and territory, hand-keyed from each Treasury's annual budget paper."
              fromEnvelope={data.state_government_debt_summary}
              unit=" AUD billions"
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

          <div className="pending-list" aria-label="Pending economics source coverage">
            <article className="source-card">
              <h4>Pending source coverage</h4>
              <p className="body-sm">
                Mortgage rate, credit card balances, AOFM federal debt, state net debt, GDP,
                unemployment and CPI sources stay on manual until each publisher endpoint or
                workbook column is verified by a human. Programmatic access is wired for the
                RBA cash rate and household debt-to-income series only.
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
              <p className="section__lede">Charts populate when verified source data is available. Hover any point — or use arrow keys — to read the value.</p>
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
              takeaway="Monthly mean of the daily RBA cash rate target, from Statistical Table F1.1."
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
              <p className="section__lede">All sources are public. Cards marked "Source unavailable" are awaiting verified values — we do not estimate.</p>
            </div>
          </div>
          <div className="sources-grid">
            {Object.entries(data).map(([id, env]) => (
              <article key={id} className="source-card">
                <h4>{env.source_name}</h4>
                <p className="body-sm">
                  {env.status === 'ok'
                    ? `Verified. ${env.values.length} data points; latest ${env.last_data_point || 'unknown'}.`
                    : 'Awaiting hand-keyed values from the named public source.'}
                </p>
                <p className="caption"><b>Envelope:</b> <span className="mono">{id}</span></p>
                {env.source_url && (
                  <a href={env.source_url}>{env.source_url.replace(/^https?:\/\//,'')} <Icon name="external" size={12}/></a>
                )}
                <p className="caption mono">Retrieved: {env.retrieved_at ? window.FR.fmtRetrieved(env.retrieved_at) : '—'}</p>
              </article>
            ))}
          </div>
          <div className="methodology">
            <h3>How we calculate the numbers</h3>
            <dl>
              <dt>RBA cash rate target</dt>
              <dd>Monthly mean of daily observations from RBA Statistical Table F1.1, fetched as CSV. The value is the headline policy interest rate the RBA Board sets at each Monetary Policy meeting.</dd>
              <dt>Standard variable home loan rate</dt>
              <dd>Indicator standard variable owner-occupier rate from RBA Statistical Tables F5 and F6. Manual entry until the column header in the latest CSV release is verified.</dd>
              <dt>Household debt to disposable income</dt>
              <dd>Total household debt expressed as a per cent of household disposable income, from RBA Statistical Table E2 (Selected Household Finances Ratios). Quarter-end values.</dd>
              <dt>Credit card balances accruing interest</dt>
              <dd>Total credit and charge card balances on which interest is being charged, from RBA Statistical Table C1.1. Manual entry until a stable CSV endpoint is confirmed.</dd>
              <dt>Australian Government Securities outstanding</dt>
              <dd>Face value of Treasury Bonds, Treasury Indexed Bonds and Treasury Notes on issue, from the Australian Office of Financial Management. Manual entry until a stable CSV endpoint is confirmed.</dd>
              <dt>State and territory net debt</dt>
              <dd>General government net debt for each state and territory, hand-keyed once a year from the named Budget Paper or Budget Statement (typically Budget Paper 2). No single Commonwealth dataset consolidates these on a comparable basis.</dd>
              <dt>Real GDP growth</dt>
              <dd>Seasonally adjusted percentage change in real Gross Domestic Product, from the ABS quarterly National Accounts release (Cat. 5206.0). Manual until the ABS SDMX dataflow key for this series is verified.</dd>
              <dt>Unemployment rate</dt>
              <dd>Headline monthly seasonally adjusted unemployment rate, from ABS Labour Force Australia (Cat. 6202.0). Manual until the ABS SDMX dataflow key for this series is verified.</dd>
              <dt>CPI inflation</dt>
              <dd>All-groups Consumer Price Index annual percentage change, from ABS Consumer Price Index Australia (Cat. 6401.0). Manual until the ABS SDMX dataflow key for this series is verified.</dd>
            </dl>
          </div>
        </section>

        <Footer updated={latestRetrieved ? updatedDisplay : ''}/>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
