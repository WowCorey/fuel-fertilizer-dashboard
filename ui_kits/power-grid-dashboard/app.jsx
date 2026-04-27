const SERIES = [
  'aemo_nem_average_wholesale_price',
  'aemo_nem_total_demand',
  'aemo_nem_fuel_mix',
  'aemo_generation_information_register',
  'aemo_coal_retirement_timeline',
  'cer_renewable_energy_target_progress',
  'dcceew_electricity_emissions',
  'aemo_2024_isp_summary',
  'aemo_wem_summary',
];

function App() {
  const [data, setData] = React.useState(null);
  React.useEffect(() => { window.FR.load(SERIES).then(setData); }, []);

  if (!data) {
    return (
      <div className="page">
        <Header active="power_grid"/>
        <main id="main"><div className="loading-wrap">Loading source envelopes...</div></main>
      </div>
    );
  }

  const latestRetrieved = window.FR.latestVerifiedRetrieved(data);
  const updatedDisplay = window.FR.fmtVerifiedUpdated(latestRetrieved);

  const priceFields = (data.aemo_nem_average_wholesale_price && data.aemo_nem_average_wholesale_price.extra && data.aemo_nem_average_wholesale_price.extra.fields) || {};
  const demandFields = (data.aemo_nem_total_demand && data.aemo_nem_total_demand.extra && data.aemo_nem_total_demand.extra.fields) || {};

  const region = (key) => {
    const px = priceFields[`region_${key}_latest`];
    const dx = demandFields[`region_${key}_latest`];
    return { price: typeof px === 'number' ? px : null, demand: typeof dx === 'number' ? dx : null };
  };
  const NSW = region('nsw1');
  const VIC = region('vic1');
  const QLD = region('qld1');
  const SA  = region('sa1');
  const TAS = region('tas1');
  const fmt = (n, dp) => (n === null ? '—' : n.toLocaleString('en-AU', { minimumFractionDigits: dp, maximumFractionDigits: dp }));
  const haveRegional = priceFields.latest_month && Object.keys(priceFields).length > 1;

  return (
    <div className="page">
      <Header active="power_grid" updated={latestRetrieved ? updatedDisplay : ''}/>

      <main id="main">
        {/* INTRO */}
        <section className="intro" id="power-grid">
          <div>
            <span className="eyebrow">Power grid · v1.0</span>
            <h1 style={{ marginTop: 12 }}>Australia's power grid, in plain English.</h1>
            <p className="intro__lede">
              How much electricity Australia uses, what it costs at the wholesale level, what
              fuels generate it, where the plants are, and which ones are scheduled to retire.
              The National Electricity Market (NEM) covers the eastern states and South
              Australia; Western Australia runs its own separate market (the WEM).
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
                Wholesale electricity prices flow through to retail bills with a lag of months
                to a year. The fuel mix decides emissions, vulnerability to coal-plant outages,
                and how much firming the grid needs as more solar and wind come on. Coal
                retirement timing drives every transmission and battery decision in the AEMO
                Integrated System Plan.
              </p>
              <p>
                This page tracks the public numbers behind those choices: NEM-wide and
                per-state wholesale price, total operational demand, fuel mix, the AEMO
                Generation Information register (every plant in the country with capacity
                and expected closure year), and headline forecasts from AEMO's Integrated
                System Plan. Values appear only when the named publisher has been verified.
              </p>
              <p className="body-sm" style={{ color: 'var(--ink-3)', marginTop: 12 }}>
                Acronyms used here: <b>NEM</b> = National Electricity Market (NSW, VIC, QLD, SA, TAS).
                <b> WEM</b> = Wholesale Electricity Market (Western Australia, separate).
                <b> RRP</b> = Regional Reference Price (wholesale price per region).
                <b> AEMO</b> = Australian Energy Market Operator.
                <b> AER</b> = Australian Energy Regulator.
                <b> CER</b> = Clean Energy Regulator.
                <b> ISP</b> = Integrated System Plan.
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
              eyebrow="Wholesale price"
              label="NEM average wholesale price"
              plain="Mean of the five NEM regional reference prices, computed from 5-minute TRADE intervals across the latest full month."
              fromEnvelope={data.aemo_nem_average_wholesale_price}
              unit=" AUD per MWh"
              highlight
            />
            <MetricCard
              eyebrow="Demand"
              label="NEM total operational demand"
              plain="Sum of mean operational demand across NSW, VIC, QLD, SA and TAS for the latest full month."
              fromEnvelope={data.aemo_nem_total_demand}
              unit=" MW"
            />
            <MetricCard
              eyebrow="Fuel mix"
              label="Latest published NEM fuel mix"
              plain="Share of generation by black coal, brown coal, gas, hydro, wind, solar and battery, from the latest AEMO Quarterly Energy Dynamics report."
              fromEnvelope={data.aemo_nem_fuel_mix}
              unit=""
            />
            <MetricCard
              eyebrow="Renewables"
              label="CER Renewable Energy Target progress"
              plain="Annual achieved-vs-target percentage from the Clean Energy Regulator's RET administrative report."
              fromEnvelope={data.cer_renewable_energy_target_progress}
              unit="%"
            />
          </div>

          <div style={{ height: 16 }}/>

          <div className="metric-grid metric-grid--4">
            <MetricCard
              eyebrow="Capacity"
              label="NEM Generation Information register - total"
              plain="Total capacity (MW) across every existing, committed and proposed generator listed in the AEMO Generation Information workbook."
              fromEnvelope={data.aemo_generation_information_register}
              unit=" MW"
            />
            <MetricCard
              eyebrow="Coal retirement"
              label="Scheduled coal retirements"
              plain="Capacity (MW) of coal plants with announced closure dates in the AEMO Generation Information register."
              fromEnvelope={data.aemo_coal_retirement_timeline}
              unit=" MW"
            />
            <MetricCard
              eyebrow="Emissions"
              label="Electricity sector emissions"
              plain="Quarterly electricity-sector emissions in megatonnes of CO2-equivalent, DCCEEW national greenhouse accounts."
              fromEnvelope={data.dcceew_electricity_emissions}
              unit=" Mt CO2-e"
            />
            <MetricCard
              eyebrow="WA"
              label="WEM headline (Western Australia)"
              plain="Latest published WA Wholesale Electricity Market capacity or wholesale-price headline. WA is not part of the NEM."
              fromEnvelope={data.aemo_wem_summary}
              unit=""
            />
          </div>

          <div style={{ height: 16 }}/>

          <div className="metric-grid metric-grid--4">
            <MetricCard
              eyebrow="Forecast"
              label="AEMO Integrated System Plan headline"
              plain="Headline figure from the latest biennial Integrated System Plan, e.g. 2050 generation capacity by source under the optimal development path."
              fromEnvelope={data.aemo_2024_isp_summary}
              unit=""
            />
          </div>

          <div className="pending-list" aria-label="Pending power-grid source coverage">
            <article className="source-card">
              <h4>Pending source coverage</h4>
              <p className="body-sm">
                Fuel mix, generation register totals, coal retirement schedule, RET progress,
                emissions, ISP forecast and WEM summary stay on manual until each AEMO,
                AER, CER or DCCEEW publication is verified by a human. Programmatic access
                is wired for the AEMO NEM regional price and demand series only.
              </p>
            </article>
          </div>
        </section>

        {/* PER-STATE TABLE */}
        {haveRegional && (
        <section className="section" aria-labelledby="per-state-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">By state</span>
              <h2 id="per-state-h">Wholesale price and demand, per NEM region</h2>
              <p className="section__lede">Mean of all 5-minute TRADE intervals in the latest full month, per region. Western Australia (WEM) is a separate market and is not in this table.</p>
            </div>
          </div>
          <div className="table-wrap">
            <table className="ledger">
              <thead>
                <tr>
                  <th>Region</th>
                  <th style={{ textAlign: 'right' }}>Wholesale price (AUD/MWh)</th>
                  <th style={{ textAlign: 'right' }}>Operational demand (MW)</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>New South Wales (NSW1)</td><td style={{ textAlign: 'right' }}>{fmt(NSW.price, 2)}</td><td style={{ textAlign: 'right' }}>{fmt(NSW.demand, 0)}</td></tr>
                <tr><td>Victoria (VIC1)</td><td style={{ textAlign: 'right' }}>{fmt(VIC.price, 2)}</td><td style={{ textAlign: 'right' }}>{fmt(VIC.demand, 0)}</td></tr>
                <tr><td>Queensland (QLD1)</td><td style={{ textAlign: 'right' }}>{fmt(QLD.price, 2)}</td><td style={{ textAlign: 'right' }}>{fmt(QLD.demand, 0)}</td></tr>
                <tr><td>South Australia (SA1)</td><td style={{ textAlign: 'right' }}>{fmt(SA.price, 2)}</td><td style={{ textAlign: 'right' }}>{fmt(SA.demand, 0)}</td></tr>
                <tr><td>Tasmania (TAS1)</td><td style={{ textAlign: 'right' }}>{fmt(TAS.price, 2)}</td><td style={{ textAlign: 'right' }}>{fmt(TAS.demand, 0)}</td></tr>
              </tbody>
            </table>
          </div>
          <p className="caption" style={{ marginTop: 8 }}>Latest month: <span className="mono">{priceFields.latest_month || '—'}</span></p>
        </section>
        )}

        {/* CHARTS */}
        <section className="section" aria-labelledby="charts-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">How it's changed</span>
              <h2 id="charts-h">NEM-wide price and demand over time</h2>
              <p className="section__lede">Charts populate when verified source data is available. Hover any point — or use arrow keys — to read the value.</p>
            </div>
          </div>

          <div className="charts-grid">
            <ChartCard
              eyebrow="Wholesale price"
              title="NEM average wholesale price, monthly"
              unit="AUD per MWh"
              fromEnvelope={data.aemo_nem_average_wholesale_price}
              ranges={['1Y']}
              defaultRange="1Y"
              accent="#1F3A8A"
              takeaway="Mean of the five NEM regional reference prices, computed from 5-minute TRADE intervals."
              yAxisLabel="Wholesale price (AUD/MWh)"
            />
            <ChartCard
              eyebrow="Demand"
              title="NEM total operational demand, monthly"
              unit="MW"
              fromEnvelope={data.aemo_nem_total_demand}
              ranges={['1Y']}
              defaultRange="1Y"
              accent="#0F766E"
              takeaway="Sum of mean operational demand across NSW, VIC, QLD, SA and TAS."
              yAxisLabel="Total operational demand (MW)"
            />
          </div>
        </section>

        {/* WHAT CHANGED */}
        <section className="section">
          <InsightFeed
            items={[]}
            title="What changed"
            lede="Populated from AEMO / AER / CER / DCCEEW release notes as verified data arrives."
            emptyMessage="Awaiting verified release notes for the loaded power-grid source envelopes."
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
              <dt>NEM average wholesale price</dt>
              <dd>For each of the five NEM regions (NSW1, VIC1, QLD1, SA1, TAS1), the AEMO Price and Demand monthly archive is fetched from <span className="mono">aemo.com.au/aemo/data/nem/priceanddemand/PRICE_AND_DEMAND_YYYYMM_REGION.csv</span>. All 5-minute TRADE intervals in each month are averaged to a regional monthly mean, then the five regional means are averaged to a NEM-wide series. Per-region latest-month values are kept in extra.fields.</dd>
              <dt>NEM total operational demand</dt>
              <dd>Same source files; TOTALDEMAND (MW) is averaged within each region-month, then summed across regions to a NEM-wide monthly mean total operational demand.</dd>
              <dt>NEM fuel mix</dt>
              <dd>Hand-keyed from the latest AEMO Quarterly Energy Dynamics summary tables, which publish the percentage share of generation by black coal, brown coal, gas, hydro, wind, solar and battery for the previous quarter.</dd>
              <dt>NEM Generation Information register</dt>
              <dd>Hand-keyed from the latest monthly AEMO Generation Information workbook, which lists every existing, committed and proposed NEM generator with name, fuel type, region, MW capacity and expected closure year.</dd>
              <dt>Scheduled coal retirements</dt>
              <dd>Subset of the NEM Generation Information register where fuel type is coal and an expected closure year is listed.</dd>
              <dt>RET progress</dt>
              <dd>Annual achieved-vs-target percentage from the Clean Energy Regulator's Renewable Energy Target administrative report.</dd>
              <dt>Electricity sector emissions</dt>
              <dd>Quarterly electricity-sector emissions in megatonnes of CO2-equivalent from the DCCEEW National Greenhouse Gas Inventory Quarterly Update, hand-keyed from the named PDF.</dd>
              <dt>AEMO ISP headline</dt>
              <dd>Hand-keyed from the latest biennial AEMO Integrated System Plan; only headline scenario figures (e.g. 2050 generation capacity by source under the optimal development path) are recorded.</dd>
              <dt>WEM summary</dt>
              <dd>Hand-keyed from named AEMO Wholesale Electricity Market monthly reports for Western Australia. The WEM is a separate market and is not part of the NEM.</dd>
            </dl>
          </div>
        </section>

        <Footer updated={latestRetrieved ? updatedDisplay : ''}/>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
