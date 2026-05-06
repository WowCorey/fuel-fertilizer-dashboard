const SERIES = [
  'abs_manufacturing_gdp_share',
  'abs_manufacturing_employment',
  'abs_manufacturing_output_index',
  'abs_manufactured_exports_total',
  'abs_manufacturing_capex',
  'abs_food_beverage_employment',
  'doe_industry_growth_centres_summary',
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
            <span className="eyebrow">Manufacturing · v1.0</span>
            <h1 style={{ marginTop: 12 }}>What Australia still makes, in plain English.</h1>
            <p className="intro__lede">
              Manufacturing is a smaller share of the Australian economy than it used to be,
              but it still feeds, fuels and equips the country. This page tracks the public
              numbers that show how much value, employment and exports come from Australian
              factories, and where new capital is being spent.
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
                A country that can make things has more options when overseas supply gets
                disrupted. Manufacturing also pays measurable wages and produces measurable
                exports. The ABS publishes the headline numbers — value added, employment,
                sales, exports and private capex — by industry division (ANZSIC C is
                manufacturing) and subdivision (food, beverages, machinery, transport
                equipment, chemicals).
              </p>
              <p>
                This page collects the named sources for each of those measures. Values
                appear only when the named publisher has been verified. Anything we can't
                verify shows up as "Source unavailable" — never an estimate.
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
                Cards marked "Source unavailable" are waiting on a verifiable figure from the
                named source. We do not estimate.
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
              <p className="section__lede">Charts populate when verified source data is available. Hover any point — or use arrow keys — to read the value.</p>
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
            </dl>
          </div>
        </section>

        <Footer refreshStatus={refreshStatus} updated={latestRetrieved ? updatedDisplay : ''}/>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
