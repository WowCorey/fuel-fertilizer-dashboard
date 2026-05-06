function App() {
  const [data, setData] = React.useState(null);
  const [refreshStatus, setRefreshStatus] = React.useState(null);
  React.useEffect(() => {
    window.FR.load(window.FUEL_SERIES).then(setData);
    window.FR.loadRefreshStatus().then(setRefreshStatus);
  }, []);

  if (!data) {
    return (
      <div className="page">
        <Header active="fuel" refreshStatus={refreshStatus}/>
        <main id="main"><div className="loading-wrap">Loading source envelopes...</div></main>
      </div>
    );
  }

  const latestRetrieved = window.FR.latestVerifiedRetrieved(data);
  const updatedDisplay = window.FR.fmtVerifiedUpdated(latestRetrieved);
  const retailPlainFor = (env, fallbackLabel) => {
    const fields = env?.extra?.fields || {};
    const states = fields.states?.map(state => state.state)?.join(', ');
    const label = fields.label || fallbackLabel;
    return states
      ? `${states} ${label} average weighted by station count.`
      : `${fallbackLabel} from public state feeds where available.`;
  };

  // Build insight feed from release-note style notes on verified envelopes that have them.
  const insights = [];
  for (const [id, env] of Object.entries(data)) {
    if (env.status === 'ok' && env.last_data_point) {
      insights.push({
        date: env.last_data_point,
        body: `${env.source_name} — latest observation ${env.last_data_point}, ${env.values.length} data points available.`,
        tag: 'Data', tagKind: 'imports',
        link: env.source_url ? { href: env.source_url, text: 'Publisher page' } : null,
      });
    }
  }

  return (
    <div className="page">
      <Header active="fuel" refreshStatus={refreshStatus} updated={latestRetrieved ? updatedDisplay : ''}/>

      <main id="main">
        {/* INTRO */}
        <section className="intro" id="fuel">
          <div>
            <span className="eyebrow">Fuel</span>
            <h1 style={{ marginTop: 12 }}>Australia's liquid fuel, in plain English.</h1>
            <p className="intro__lede">
              Petrol, diesel and jet fuel power almost every truck, tractor and aircraft in the country.
              Most of it is imported. This page tracks how much we bring in, what it costs at the pump,
              and how long our stockpile would last if imports stopped.
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

        <DataCoverage data={data} refreshStatus={refreshStatus}/>

        {/* WHY THIS MATTERS */}
        <section className="section section--why" aria-labelledby="why">
          <div className="why-grid">
            <div>
              <span className="eyebrow">What this is</span>
              <h2 id="why" style={{ marginTop: 8 }}>Why this matters to you</h2>
            </div>
            <div className="why-body">
              <p>
                Australia imports around 90% of its refined fuel. When overseas supply wobbles — a refinery outage,
                a shipping disruption, a price spike in Asia — it shows up at our pumps within days.
              </p>
              <p>
                This dashboard exists because most of the raw numbers are public, but scattered across government reports
                and trade databases. It loads verified source envelopes where available and leaves unavailable values visible,
                rather than filling gaps with estimates.
              </p>
              <p className="body-sm" style={{ color: 'var(--ink-3)', marginTop: 12 }}>
                Acronyms used here: <b>ABS</b> = Australian Bureau of Statistics. <b>APS</b> = Australian Petroleum Statistics.
                <b> IEA</b> = International Energy Agency. <b>AIP</b> = Australian Institute of Petroleum.
              </p>
            </div>
          </div>
        </section>

        {/* HEADLINE METRICS */}
        <section className="section" aria-labelledby="metrics-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Four headline numbers</span>
              <h2 id="metrics-h">As of the latest publisher update</h2>
              <p className="section__lede">
                Any card marked "Source unavailable" is waiting on a verifiable figure from the named source.
                We do not estimate.
              </p>
            </div>
          </div>
          <div className="metric-grid metric-grid--4">
            <MetricCard
              eyebrow="Most watched"
              label="Days of Net Import Cover"
              jargonHint={{ term: 'Days of Net Import Cover', definition: 'How many days Australia could keep going on its fuel stockpile if imports stopped today.' }}
              plain="If imports stopped today, how long the national stockpile would last."
              fromEnvelope={data.aps_monthly}
              unit=" days"
              threshold={{ state:'below', text:'IEA benchmark: 90 days' }}
              highlight
            />
            <MetricCard
              eyebrow="Pump"
              label="Retail pump price - ULP 91"
              plain={retailPlainFor(data.aus_retail_fuel_multistate, 'ULP 91')}
              fromEnvelope={data.aus_retail_fuel_multistate}
              unit=" c/L"
            />
            <MetricCard
              eyebrow="Wholesale"
              label="Terminal gate price"
              plain="AIP national average unleaded petrol terminal gate price."
              fromEnvelope={data.aip_tgp}
              unit=" c/L"
            />
            <MetricCard
              eyebrow="Trade"
              label="Monthly Imports (year-on-year)"
              plain="How the latest month compared to the same month a year earlier."
              fromEnvelope={data.abs_petroleum_imports_yoy}
              valueFn={env => {
                const v = env.values.at(-1).v;
                return `${v > 0 ? '+' : ''}${v}`;
              }}
              unit="%"
            />
          </div>
          <div style={{ height: 24 }}/>
          <div className="metric-grid metric-grid--3">
            <MetricCard
              eyebrow="Pump"
              label="Retail diesel"
              plain={retailPlainFor(data.aus_retail_fuel_multistate_diesel, 'diesel')}
              fromEnvelope={data.aus_retail_fuel_multistate_diesel}
              unit=" c/L"
            />
            <MetricCard
              eyebrow="Pump"
              label="Retail premium 95"
              plain={retailPlainFor(data.aus_retail_fuel_multistate_premium95, 'premium 95')}
              fromEnvelope={data.aus_retail_fuel_multistate_premium95}
              unit=" c/L"
            />
            <MetricCard
              eyebrow="Pump"
              label="Retail E10"
              plain={retailPlainFor(data.aus_retail_fuel_multistate_e10, 'E10')}
              fromEnvelope={data.aus_retail_fuel_multistate_e10}
              unit=" c/L"
            />
          </div>
        </section>

        {/* CHARTS */}
        <section className="section" aria-labelledby="charts-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">How it's changed</span>
              <h2 id="charts-h">Imports, prices and stockpile over time</h2>
              <p className="section__lede">Hover any point — or use arrow keys — to read the value.</p>
            </div>
          </div>

          <div className="charts-grid">
            <ChartCard
              eyebrow="Volume"
              title="Monthly petroleum imports"
              unit="AUD thousands"
              fromEnvelope={data.abs_petroleum_imports}
              ranges={['1Y','3Y']}
              defaultRange="3Y"
              accent="#1F3A8A"
              takeaway="Monthly petroleum imports from ABS International Merchandise Trade. Chart populates when the latest month is verified."
              yAxisLabel="Import value (AUD thousands per month)"
            />
            <ChartCard
              eyebrow="Wholesale"
              title="Terminal gate price"
              unit="cents per litre"
              fromEnvelope={data.aip_tgp}
              ranges={['1Y','3Y']}
              defaultRange="3Y"
              accent="#0F766E"
              takeaway="Monthly mean of AIP daily national average unleaded petrol terminal gate prices."
              yAxisLabel="Cents per litre (c/L)"
            />
          </div>

          <div style={{ height: 24 }}/>
          <div className="charts-grid charts-grid--full">
            <ChartCard
              eyebrow="Resilience"
              title="Days of Net Import Cover vs. 90-day benchmark"
              unit=" days"
              fromEnvelope={data.aps_monthly}
              baseline={90}
              baselineLabel="IEA 90-day benchmark"
              ranges={['1Y','3Y']}
              defaultRange="3Y"
              accent="#1F3A8A"
              takeaway="Days of cover = petroleum stocks on land and in transit divided by average net imports. The 90-day benchmark is an IEA obligation for member countries."
              yAxisLabel="Days of cover"
            />
          </div>
        </section>

        {/* WHAT CHANGED */}
        <section className="section">
          <InsightFeed
            items={insights}
            lede="Notes synthesised from the envelope metadata on each source. Populated as verified data arrives."
            emptyMessage="Awaiting verified publisher release notes for the loaded source envelopes."
          />
        </section>

        {/* SOURCES & METHODOLOGY */}
        <section className="section section--sources" id="sources">
          <div className="section__head">
            <div>
              <span className="eyebrow">Sources & methodology</span>
              <h2>Every dataset used on this page</h2>
              <p className="section__lede">All sources are public. When a figure cannot yet be verified, the card reads "Source unavailable" — we do not fill in estimates.</p>
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
                <p className="caption mono">
                  Retrieved: {env.retrieved_at ? window.FR.fmtRetrieved(env.retrieved_at) : '—'}
                </p>
              </article>
            ))}
          </div>

          <div className="methodology">
            <h3>How we calculate the numbers</h3>
            <dl>
              <dt>Days of Net Import Cover</dt>
              <dd>Total petroleum stocks (on land and in transit) divided by the prior 12-month average of net imports, expressed in days. Follows the IEA methodology used by DCCEEW.</dd>
              <dt>Retail pump prices</dt>
              <dd>Average across the public state feeds that returned usable observations for each product, weighted by station count. NSW contributes only when the FuelCheck secret is configured; WA does not expose E10 through the active public RSS product-code list.</dd>
              <dt>Terminal gate price</dt>
              <dd>Monthly mean of AIP daily national average unleaded petrol terminal gate prices from the historical TGP workbook.</dd>
              <dt>Monthly Imports (year-on-year)</dt>
              <dd>Percent change in petroleum import value vs. the same calendar month one year earlier, derived from ABS International Merchandise Trade.</dd>
            </dl>
          </div>
        </section>

        <Footer refreshStatus={refreshStatus} updated={latestRetrieved ? updatedDisplay : ''}/>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
