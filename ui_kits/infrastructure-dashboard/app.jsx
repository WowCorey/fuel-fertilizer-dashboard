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

function latest(env) {
  if (!env || env.status !== 'ok' || !env.values?.length) return null;
  return env.values.at(-1);
}

function App() {
  const [data, setData] = React.useState(null);
  React.useEffect(() => { window.FR.load(SERIES).then(setData); }, []);

  if (!data) {
    return (
      <div className="page">
        <Header active="infrastructure"/>
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
      <Header active="infrastructure" updated={latestRetrieved ? updatedDisplay : ''}/>

      <main id="main">
        {/* INTRO */}
        <section className="intro" id="infrastructure">
          <div>
            <span className="eyebrow">Infrastructure · v1.0</span>
            <h1 style={{ marginTop: 12 }}>Australia's infrastructure, in plain English.</h1>
            <p className="intro__lede">
              How fast Australia's population is growing, how many homes there are, how many
              people we move on public transport and through airports, how much freight we shift,
              how fast our internet runs, and what major projects are on the official pipeline.
              The headline numbers come straight from ABS, BITRE, ACCC and Infrastructure Australia.
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
                Population growth, not population size, is what stresses infrastructure. Australia
                is among the fastest-growing wealthy countries — driven mostly by net overseas
                migration — and the housing stock, urban transport, freight system and digital
                network all have to keep up. They mostly haven't.
              </p>
              <p>
                The headline pairing on this page is <b>persons per dwelling</b>: total population
                divided by total residential dwelling count. This is a structural measure of
                housing pressure that does not depend on price. We pair it with progress against
                the Commonwealth's 1.2 million-new-homes target, BITRE transport and freight
                statistics, and the ACCC's measured NBN performance.
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
                Cards marked "Source unavailable" are waiting on a verifiable figure from the
                named source. We do not estimate.
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
              <p className="section__lede">Charts populate when verified source data is available. Hover any point — or use arrow keys — to read the value.</p>
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
            </dl>
          </div>
        </section>

        <Footer updated={latestRetrieved ? updatedDisplay : ''}/>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
