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
  const [refreshStatus, setRefreshStatus] = React.useState(null);
  React.useEffect(() => {
    window.FR.load(SERIES).then(setData);
    window.FR.loadRefreshStatus().then(setRefreshStatus);
  }, []);

  if (!data) {
    return (
      <div className="page">
        <Header active="power_grid" refreshStatus={refreshStatus}/>
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
  const cardNumber = (env, dp = 0) => env.values.at(-1).v.toLocaleString('en-AU', { minimumFractionDigits: dp, maximumFractionDigits: dp });
  const fmt = (n, dp) => (n === null ? '—' : n.toLocaleString('en-AU', { minimumFractionDigits: dp, maximumFractionDigits: dp }));
  const haveRegional = priceFields.latest_month && Object.keys(priceFields).length > 1;

  return (
    <div className="page">
      <Header active="power_grid" refreshStatus={refreshStatus} updated={latestRetrieved ? updatedDisplay : ''}/>

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
              label="NEM renewable share of supply mix"
              plain="Q4 2025 share of NEM supply from distributed PV, wind, grid solar, hydro, biomass and battery, from AEMO Quarterly Energy Dynamics Table 3."
              fromEnvelope={data.aemo_nem_fuel_mix}
              valueFn={(env) => cardNumber(env, 1)}
              unit="%"
            />
            <MetricCard
              eyebrow="Renewables"
              label="NEM+SWIS renewable generation share"
              plain="2024 renewable generation share across the NEM and Western Australia's SWIS from the Clean Energy Regulator's RET administrative report."
              fromEnvelope={data.cer_renewable_energy_target_progress}
              valueFn={(env) => cardNumber(env, 0)}
              unit="%"
            />
          </div>

          <div style={{ height: 16 }}/>

          <div className="metric-grid metric-grid--4">
            <MetricCard
              eyebrow="Capacity"
              label="AEMO Generation Information listed capacity"
              plain="Listed NEM existing and development capacity in the January 2026 workbook. Includes anticipated and publicly announced projects; it is not available capacity."
              fromEnvelope={data.aemo_generation_information_register}
              valueFn={(env) => cardNumber(env, 0)}
              unit=" MW"
            />
            <MetricCard
              eyebrow="Coal retirement"
              label="Coal capacity with explicit closure dates"
              plain="Coal capacity in the January 2026 AEMO workbooks with an explicit closure date. Expected-year-only coal rows are kept separate in the notes."
              fromEnvelope={data.aemo_coal_retirement_timeline}
              valueFn={(env) => cardNumber(env, 0)}
              unit=" MW"
            />
            <MetricCard
              eyebrow="Emissions"
              label="Electricity-sector annual emissions"
              plain="Actual Energy - Electricity emissions for the year to September 2025 from DCCEEW's National Greenhouse Gas Inventory quarterly update."
              fromEnvelope={data.dcceew_electricity_emissions}
              valueFn={(env) => cardNumber(env, 1)}
              unit=" Mt CO2-e"
            />
            <MetricCard
              eyebrow="WA"
              label="WEM quarterly average energy price"
              plain="Q4 2025 average energy price in Western Australia's separate Wholesale Electricity Market, from AEMO Quarterly Energy Dynamics."
              fromEnvelope={data.aemo_wem_summary}
              valueFn={(env) => cardNumber(env, 2)}
              unit=" AUD/MWh"
            />
          </div>

          <div style={{ height: 16 }}/>

          <div className="metric-grid metric-grid--4">
            <MetricCard
              eyebrow="Forecast"
              label="AEMO 2024 ISP transmission headline"
              plain="Rounded transmission need by 2050 under the 2024 ISP Step Change and Progressive Change scenarios. This is not current built transmission."
              fromEnvelope={data.aemo_2024_isp_summary}
              valueFn={(env) => cardNumber(env, 0)}
              unit=" km"
            />
          </div>

          <div className="pending-list" aria-label="Manual power-grid source coverage">
            <article className="source-card">
              <h4>Manual source coverage</h4>
              <p className="body-sm">
                Fuel mix, generation register totals, coal closure dates, RET context,
                emissions, ISP forecast and WEM summary are hand-keyed from named official
                publications. They remain manual because the page only has stable programmatic
                access for AEMO NEM regional price and demand.
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
              <dd>Hand-keyed from AEMO Quarterly Energy Dynamics Q4 2025 Table 3, which publishes NEM supply mix contributions by black coal, brown coal, gas, liquid fuel, distributed PV, wind, grid solar, hydro, biomass and battery. The headline card shows the renewable-plus-battery share; fossil-fuel shares remain separate in the envelope fields.</dd>
              <dt>NEM Generation Information register</dt>
              <dd>Hand-keyed from the January 2026 AEMO Generation Information workbook Summary table. The headline is listed nameplate capacity across existing and new-development rows, including anticipated and publicly announced projects. It is not available capacity, reliability or a construction guarantee.</dd>
              <dt>Scheduled coal retirements</dt>
              <dd>Subset of January 2026 AEMO coal rows with an explicit closure date. Coal units with an expected closure year but no explicit date are retained in the envelope notes rather than mixed into the headline.</dd>
              <dt>RET progress</dt>
              <dd>Hand-keyed from the Clean Energy Regulator's 2024 Renewable Energy Target Administrative Report. The headline is the reported 2024 renewable generation share across the NEM and Western Australia's SWIS, not an LRET compliance percentage.</dd>
              <dt>Electricity sector emissions</dt>
              <dd>Annual Energy - Electricity emissions in megatonnes of CO2-equivalent for the year to September 2025 from DCCEEW's National Greenhouse Gas Inventory Quarterly Update. It is not a single-quarter value.</dd>
              <dt>AEMO ISP headline</dt>
              <dd>Hand-keyed from the 2024 AEMO Integrated System Plan. The card shows the rounded transmission need by 2050 under Step Change and Progressive Change scenarios.</dd>
              <dt>WEM summary</dt>
              <dd>Hand-keyed from AEMO Quarterly Energy Dynamics Q4 2025 WEM market dynamics. The card shows Western Australia's quarterly average WEM energy price; the WEM is separate from the NEM.</dd>
            </dl>
          </div>
        </section>

        <Footer refreshStatus={refreshStatus} updated={latestRetrieved ? updatedDisplay : ''}/>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
