const SERIES = [
  'eia_brent',
  'eia_wti',
  'eia_diesel_retail_us',
  'eia_jet_spot_usgc',
  'aps_production_petrol',
  'aps_production_diesel',
  'aps_production_jet',
  'aps_production_fuel_oil',
  'iea_90day',
  'fuel_security_payment',
  'offshore_ticket_volumes',
  'rba_aud_usd',
];

// Transform a USD/bbl envelope into AUD/bbl using the AUD/USD series, if both
// are available and populated. Falls back to "unavailable" if either is missing.
function toAud(usdEnv, fxEnv) {
  if (!usdEnv || usdEnv.status !== 'ok' || !usdEnv.values?.length) return { ...usdEnv, status: 'unavailable', values: [] };
  if (!fxEnv  || fxEnv.status  !== 'ok' || !fxEnv.values?.length)  return { ...usdEnv, status: 'unavailable', values: [], notes: 'AUD/USD series unavailable; AUD conversion pending.' };
  const fxByMonth = Object.fromEntries(fxEnv.values.map(p => [p.t, p.v]));
  const values = usdEnv.values
    .map(p => {
      const fx = fxByMonth[p.t];
      return fx ? { t: p.t, v: +(p.v / fx).toFixed(2) } : null;
    })
    .filter(Boolean);
  return {
    ...usdEnv,
    unit: 'AUD per barrel',
    values,
    notes: 'Converted from USD using RBA monthly AUD/USD.',
  };
}

function App() {
  const [data, setData] = React.useState(null);
  React.useEffect(() => { window.FR.load(SERIES).then(setData); }, []);

  if (!data) {
    return (
      <div className="page">
        <Header active="oil"/>
        <main id="main"><div className="loading-wrap">Loading source envelopes...</div></main>
      </div>
    );
  }

  const latestRetrieved = window.FR.latestVerifiedRetrieved(data);
  const updatedDisplay = window.FR.fmtVerifiedUpdated(latestRetrieved);

  const brentAud = toAud(data.eia_brent, data.rba_aud_usd);
  const wtiAud   = toAud(data.eia_wti,   data.rba_aud_usd);

  return (
    <div className="page">
      <Header active="oil" updated={latestRetrieved ? updatedDisplay : ''}/>

      <main id="main">
        {/* INTRO */}
        <section className="intro" id="oil">
          <div>
            <span className="eyebrow">Oil &amp; production · v1.2</span>
            <h1 style={{ marginTop: 12 }}>What crude costs, what we refine, and what the government pays.</h1>
            <p className="intro__lede">
              Three views: the global crude benchmarks that set the floor on pump prices; Australia's
              refined-fuel production; and the public stockholding benchmark. Values appear only when
              the named source envelope is verified.
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

        {/* WHAT THIS PAGE SHOWS */}
        <section className="section section--why">
          <div className="why-grid">
            <div>
              <span className="eyebrow">What this is</span>
              <h2 style={{ marginTop: 8 }}>What this page shows</h2>
            </div>
            <div className="why-body">
              <p>
                Crude oil is the raw input for petrol, diesel and jet fuel. Australia buys most of
                its crude on global markets, priced in US dollars per barrel. This page currently
                shows licence-compatible public series for <b>Brent</b> (North Sea) and <b>WTI</b>
                (US). Tapis remains pending until a reusable public series is identified.
              </p>
              <p>
                Australia still refines a share of the fuel it consumes, but refineries have closed
                steadily for 15 years. APS production series are loaded from the public workbook;
                DCCEEW payment and offshore stockholding disclosures are shown where verified.
                Refinery utilisation stays out of the main dashboard until exact public source
                fields are verified.
              </p>
              <p className="body-sm" style={{ color: 'var(--ink-3)', marginTop: 12 }}>
                Acronyms: <b>WTI</b> = West Texas Intermediate. <b>APS</b> = Australian Petroleum Statistics.
                <b> IEA</b> = International Energy Agency. <b>FSSP</b> = Fuel Security Services Payment.
              </p>
            </div>
          </div>
        </section>

        {/* 1 — CRUDE PRICES */}
        <section className="section" aria-labelledby="h-crude">
          <div className="section__head">
            <div>
              <span className="eyebrow">Section 1</span>
              <h2 id="h-crude">Crude oil price — the floor beneath the pump</h2>
              <p className="section__lede">
                Monthly averages over the last five years where verified public source envelopes are available.
                Brent and WTI each have US$ and A$ slots. Tapis is not charted until a
                licence-compatible public source is identified.
              </p>
            </div>
          </div>

          <div className="charts-grid">
            <ChartCard
              eyebrow="US$"
              title="Brent crude — US$/barrel"
              unit="USD per barrel"
              fromEnvelope={data.eia_brent}
              ranges={['1Y','3Y','5Y']}
              defaultRange="3Y"
              accent="#1F3A8A"
              takeaway="Brent is the North Sea benchmark and the most-quoted global crude price. Higher Brent, higher Australian pump prices — usually within 2–4 weeks."
              yAxisLabel="US dollars per barrel"
            />
            <ChartCard
              eyebrow="A$"
              title="Brent crude — A$/barrel"
              unit="AUD per barrel"
              fromEnvelope={brentAud}
              ranges={['1Y','3Y','5Y']}
              defaultRange="3Y"
              accent="#0F766E"
              takeaway="Same Brent series converted using the RBA monthly AUD/USD. A weakening Australian dollar makes crude more expensive even when the US$ price is flat."
              yAxisLabel="Australian dollars per barrel"
            />
          </div>
          <div style={{ height: 24 }}/>
          <div className="charts-grid">
            <ChartCard
              eyebrow="US$"
              title="WTI crude — US$/barrel"
              unit="USD per barrel"
              fromEnvelope={data.eia_wti}
              ranges={['1Y','3Y','5Y']}
              defaultRange="3Y"
              accent="#B45309"
              takeaway="WTI is the US benchmark. Shown here for comparison — Brent is the more relevant benchmark for Asian-sourced fuel."
              yAxisLabel="US dollars per barrel"
            />
            <ChartCard
              eyebrow="A$"
              title="WTI crude — A$/barrel"
              unit="AUD per barrel"
              fromEnvelope={wtiAud}
              ranges={['1Y','3Y','5Y']}
              defaultRange="3Y"
              accent="#0F766E"
              takeaway="Same WTI series converted using the RBA monthly AUD/USD where both source envelopes are verified."
              yAxisLabel="Australian dollars per barrel"
            />
          </div>
          {false && <>
          <div style={{ height: 24 }}/>
          <div className="charts-grid">
            <ChartCard
              eyebrow="US$"
              title="Tapis crude — US$/barrel"
              unit="USD per barrel"
              fromEnvelope={data.tapis_crude}
              ranges={['1Y','3Y','5Y']}
              defaultRange="3Y"
              accent="#6B7280"
              takeaway="Tapis is the Malaysian light-sweet crude benchmark most relevant to Asian refineries supplying Australia. This slot stays unavailable until a licence-compatible public source is identified."
              yAxisLabel="US dollars per barrel"
            />
            <ChartCard
              eyebrow="A$"
              title="Tapis crude — A$/barrel"
              unit="AUD per barrel"
              fromEnvelope={tapisAud}
              ranges={['1Y','3Y','5Y']}
              defaultRange="3Y"
              accent="#991B1B"
              takeaway="Tapis converted to A$ will populate only if both a licence-compatible Tapis series and the AUD/USD source envelope are verified."
              yAxisLabel="Australian dollars per barrel"
            />
          </div>
          </>}

          <div style={{ height: 32 }}/>
          <div className="section__head">
            <div>
              <span className="eyebrow">Refined benchmarks</span>
              <h3 id="h-refined-benchmarks">U.S. reference prices for diesel and jet fuel</h3>
              <p className="section__lede">
                Published U.S. reference prices for refined fuels. These are not Australian pump prices; they
                are the closest free public benchmarks for tracking refined-product markets that feed Australian
                import costs. Values are monthly means of the weekly (diesel) or daily (jet) observations
                mirrored by FRED from the U.S. Energy Information Administration.
              </p>
            </div>
          </div>
          <div className="charts-grid">
            <ChartCard
              eyebrow="US$"
              title="U.S. retail diesel — US$/gallon"
              unit="USD per gallon"
              fromEnvelope={data.eia_diesel_retail_us}
              ranges={['1Y','3Y','5Y']}
              defaultRange="3Y"
              accent="#1F3A8A"
              takeaway="U.S. weekly retail diesel price, all types. A reference for refined-product costs; Australian diesel is priced at the pump in cents per litre and is not directly comparable."
              yAxisLabel="US dollars per gallon"
            />
            <ChartCard
              eyebrow="US$"
              title="Jet fuel — U.S. Gulf Coast spot, US$/gallon"
              unit="USD per gallon"
              fromEnvelope={data.eia_jet_spot_usgc}
              ranges={['1Y','3Y','5Y']}
              defaultRange="3Y"
              accent="#B45309"
              takeaway="Daily kerosene-type jet fuel spot price at the U.S. Gulf Coast, aggregated to monthly means. A widely cited reference for refined-product cost feeding import parity."
              yAxisLabel="US dollars per gallon"
            />
          </div>
        </section>

        {/* 2 — REFINED PRODUCTION */}
        <section className="section" aria-labelledby="h-prod">
          <div className="section__head">
            <div>
              <span className="eyebrow">Section 2</span>
              <h2 id="h-prod">Australian refined fuel production</h2>
              <p className="section__lede">
                Monthly output of petrol, diesel, jet fuel and fuel oil from the public Australian
                Petroleum Statistics workbook. Refinery utilisation remains pending until the exact
                numerator and denominator can be sourced without assumptions.
              </p>
            </div>
          </div>
          <div className="metric-grid metric-grid--4">
            <MetricCard eyebrow="Petrol"   label="Motor spirit production" plain="Volume refined domestically in the latest month." fromEnvelope={data.aps_production_petrol}  unit=" ML"/>
            <MetricCard eyebrow="Diesel"   label="Diesel production"       plain="Volume refined domestically in the latest month." fromEnvelope={data.aps_production_diesel}  unit=" ML"/>
            <MetricCard eyebrow="Jet"      label="Jet fuel production"     plain="Volume refined domestically in the latest month." fromEnvelope={data.aps_production_jet}     unit=" ML"/>
            <MetricCard eyebrow="Fuel oil" label="Fuel oil production"     plain="Volume refined domestically in the latest month." fromEnvelope={data.aps_production_fuel_oil} unit=" ML"/>
          </div>
          {false && <>
          <div style={{ height: 24 }}/>
          <div className="charts-grid charts-grid--full">
            <ChartCard
              eyebrow="Utilisation"
              title="Refinery utilisation rate"
              unit="%"
              fromEnvelope={data.aps_refinery_utilisation}
              accent="#1F3A8A"
              takeaway="Share of installed capacity actually running. Falls during maintenance and when margins are thin."
              yAxisLabel="Percent of installed capacity"
            />
          </div>
          </>}
        </section>

        {/* 3 — GOVERNMENT PURCHASES */}
        <section className="section" aria-labelledby="h-gov">
          <div className="section__head">
            <div>
              <span className="eyebrow">Section 3</span>
              <h2 id="h-gov">Policy benchmark and government disclosures</h2>
              <p className="section__lede">
                Australia is an IEA member and is obliged to hold 90 days of net imports. The treaty
                benchmark is shown below alongside verified DCCEEW disclosures for the Fuel Security
                Services Payment and offshore stockholding arrangements.
              </p>
            </div>
          </div>
          <div className="metric-grid">
            <MetricCard
              eyebrow="IEA benchmark"
              label="Stockholding obligation"
              plain="Treaty benchmark for IEA members; this is not Australia's current compliance figure."
              fromEnvelope={data.iea_90day}
              unit=" days"
              threshold={{ state:'near', text:'Policy constant' }}
              highlight
            />
            <MetricCard
              eyebrow="Cost"
              label="Fuel Security Services Payment — latest quarter"
              plain="GST-exclusive quarterly amount disclosed by DCCEEW."
              fromEnvelope={data.fuel_security_payment}
              unit=" A$m"
            />
            <MetricCard
              eyebrow="Contracts"
              label="Offshore ticket volumes"
              plain="Public disclosure of oil stocks held overseas under Australian Government agreement."
              fromEnvelope={data.offshore_ticket_volumes}
              unit=" kL"
            />
          </div>
          <div className="pending-list" aria-label="Pending oil source coverage">
            <article className="source-card">
              <h4>Pending source coverage</h4>
              <p className="body-sm">Refinery utilisation and Tapis stay out of the main dashboard until their public source fields are verified without assumptions.</p>
            </article>
          </div>
        </section>

        {/* WHAT CHANGED */}
        <section className="section">
          <InsightFeed
            items={[]}
            title="What changed"
            lede="Populated as verified APS / IEA / DCCEEW releases land."
            emptyMessage="Awaiting verified release notes for the loaded oil and production source envelopes."
          />
        </section>

        {/* SOURCES */}
        <section className="section section--sources" id="sources">
          <div className="section__head">
            <div>
              <span className="eyebrow">Sources &amp; methodology</span>
              <h2>Every dataset used on this page</h2>
              <p className="section__lede">All sources are public. Cards marked "Source unavailable" are awaiting verified values.</p>
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
                {env.source_url && <a href={env.source_url}>{env.source_url.replace(/^https?:\/\//,'')} <Icon name="external" size={12}/></a>}
                <p className="caption mono">Retrieved: {env.retrieved_at ? window.FR.fmtRetrieved(env.retrieved_at) : '—'}</p>
              </article>
            ))}
          </div>
          <div className="methodology">
            <h3>How we calculate the numbers</h3>
            <dl>
              <dt>Crude A$ conversion</dt>
              <dd>USD-denominated monthly spot series divided by the RBA monthly average AUD/USD for the same month. No hedging or lag applied.</dd>
              <dt>Stockholding obligation</dt>
              <dd>The IEA treaty benchmark is 90 days of net imports. This dashboard does not present an Australian compliance gap unless a current public compliance series is wired into an envelope.</dd>
              <dt>Policy disclosures</dt>
              <dd>Fuel Security Services Payment values are GST-exclusive DCCEEW quarterly amounts converted to A$m. Offshore ticket volumes use the latest DCCEEW public disclosure of stocks held overseas under government agreement.</dd>
            </dl>
          </div>
        </section>

        <Footer updated={latestRetrieved ? updatedDisplay : ''}/>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
