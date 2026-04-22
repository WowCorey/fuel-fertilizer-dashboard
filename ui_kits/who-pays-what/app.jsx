// Companies appear in a fixed order so the table is stable run-to-run.
const COMPANIES = [
  { id: 'company_exxonmobil_au', short: 'ExxonMobil Australia' },
  { id: 'company_chevron_au',    short: 'Chevron Australia' },
  { id: 'company_viva_energy',   short: 'Viva Energy (ASX:VEA)' },
  { id: 'company_ampol',         short: 'Ampol (ASX:ALD)' },
  { id: 'company_bp_au',         short: 'BP Australia' },
  { id: 'company_shell_au',      short: 'Shell Australia' },
  { id: 'company_woodside',      short: 'Woodside Energy (ASX:WDS)' },
  { id: 'company_santos',        short: 'Santos (ASX:STO)' },
];

const SERIES = [
  'ato_corporate_tax',
  'accc_petroleum_monitoring',
  'accc_petrol_mogas95_component',
  'accc_petrol_tax_component',
  'accc_petrol_other_costs_margins_component',
  'accc_petrol_gird_component',
  'accc_petrol_breakdown_series',
  ...COMPANIES.map(c => c.id),
];

const TAX_FIELDS = ['fiscal_year', 'total_income', 'taxable_income', 'income_tax_paid', 'net_profit'];
const PUMP_COMPONENTS = [
  {
    id: 'accc_petrol_mogas95_component',
    eyebrow: 'Pump $',
    label: 'International refined petrol cost',
    plain: 'Mogas 95 component in the ACCC December quarter 2025 pump-price split.',
  },
  {
    id: 'accc_petrol_tax_component',
    eyebrow: 'Pump $',
    label: 'Excise and GST',
    plain: 'Combined excise and goods and services tax component reported by the ACCC.',
  },
  {
    id: 'accc_petrol_other_costs_margins_component',
    eyebrow: 'Pump $',
    label: 'Other costs and margins',
    plain: 'Other wholesale and retail costs and margins in the ACCC petrol snapshot.',
  },
  {
    id: 'accc_petrol_gird_component',
    eyebrow: 'Pump $',
    label: 'Gross indicative retail difference',
    plain: 'Broad retail costs and margins indicator; not pure retailer profit.',
  },
];

// Extract a named scalar from an envelope. Manual company records use the
// validator-approved typed shape: extra.schema + extra.fields.
function pick(env, key) {
  if (!env || env.status !== 'ok') return null;
  if (env.extra && env.extra.fields && !Array.isArray(env.extra.fields) && env.extra.fields[key] != null) {
    return env.extra.fields[key];
  }
  if (env.extra && env.extra[key] != null) return env.extra[key];
  if (Array.isArray(env.values)) {
    const hit = env.values.find(p => p.t === key);
    if (hit) return hit.v;
  }
  return null;
}

function money(v, unit = 'A$m') {
  if (v == null) return null;
  if (typeof v === 'number') {
    const sign = v < 0 ? '-' : '';
    const abs = Math.abs(v);
    if (unit === 'A$m') return sign + 'A$' + abs.toLocaleString('en-AU', { maximumFractionDigits: 1 }) + 'm';
    if (unit === 'US$m') return sign + 'US$' + abs.toLocaleString('en-AU', { maximumFractionDigits: 1 }) + 'm';
    if (unit === '%')   return v.toFixed(1) + '%';
    if (unit === 'A$/L') return 'A$' + v.toFixed(3);
    return String(v);
  }
  return String(v);
}

// A cell that, when populated, wraps its value in a link to the source
// document. ATO fields point at the ATO Corporate Tax Transparency release;
// net_profit points at the company's own annual report. When no value is
// hand-keyed, the cell reads "—" and carries no link.
function Cell({ env, fieldKey, unit, atoEnv }) {
  const v = pick(env, fieldKey);
  if (v == null) {
    return <td className="unavail" aria-label="Source unavailable">—</td>;
  }
  const atoFields = new Set(['total_income', 'taxable_income', 'income_tax_paid', 'fiscal_year']);
  const linkEnv = atoFields.has(fieldKey) ? (atoEnv || env) : env;
  const href = linkEnv && linkEnv.source_url;
  const displayUnit = fieldKey === 'net_profit' ? (pick(env, 'net_profit_unit') || unit) : unit;
  return (
    <td>
      {href
        ? <a href={href} rel="noopener" title={`Source: ${linkEnv.source_name}`}>{money(v, displayUnit)}</a>
        : money(v, displayUnit)}
    </td>
  );
}

function SourceCell({ env }) {
  if (!env || !env.source_url) {
    return <td className="unavail">—</td>;
  }
  const label = env.source_name.length > 34 ? env.source_name.slice(0, 32) + '…' : env.source_name;
  return (
    <td>
      <a href={env.source_url} rel="noopener">{label}</a>
      {env.status !== 'ok' && <div className="caption">pending</div>}
    </td>
  );
}

// Effective tax rate = income_tax_paid / taxable_income, as a %.
// Only computed when both numbers are present in the envelope's extra block;
// otherwise the cell reads "—" and we never synthesize it.
function effectiveRate(env) {
  const paid = pick(env, 'income_tax_paid');
  const taxable = pick(env, 'taxable_income');
  if (paid == null || taxable == null || !taxable) return null;
  return (paid / taxable) * 100;
}

function sourceSummary(env) {
  if (!env || env.status !== 'ok') {
    return 'Awaiting hand-keyed values from the named public source.';
  }
  const fields = env.extra && env.extra.fields && !Array.isArray(env.extra.fields)
    ? Object.keys(env.extra.fields).length
    : 0;
  if (fields) {
    return `Verified. ${fields} fields; latest ${env.last_data_point || 'unknown'}.`;
  }
  return `Verified. ${env.values.length} data points; latest ${env.last_data_point || 'unknown'}.`;
}

function App() {
  const [data, setData] = React.useState(null);
  React.useEffect(() => { window.FR.load(SERIES).then(setData); }, []);

  if (!data) {
    return (
      <div className="page">
        <Header active="who_pays_what"/>
        <main id="main"><div className="loading-wrap">Loading source envelopes...</div></main>
      </div>
    );
  }

  const latestRetrieved = window.FR.latestVerifiedRetrieved(data);
  const updatedDisplay = window.FR.fmtVerifiedUpdated(latestRetrieved);
  const populatedCompanyCount = COMPANIES.filter(c => (
    TAX_FIELDS.some(field => pick(data[c.id], field) != null)
  )).length;
  const profitCompanyCount = COMPANIES.filter(c => pick(data[c.id], 'net_profit') != null).length;
  const verifiedPumpComponents = PUMP_COMPONENTS.filter(c => data[c.id]?.status === 'ok').length;
  const allPumpComponentsVerified = verifiedPumpComponents === PUMP_COMPONENTS.length;
  const pumpSeriesVerified = data.accc_petrol_breakdown_series?.status === 'ok';

  return (
    <div className="page">
      <Header active="who_pays_what" updated={latestRetrieved ? updatedDisplay : ''}/>

      <main id="main">
        {/* INTRO */}
        <section className="intro" id="who-pays-what">
          <div>
            <span className="eyebrow">Who pays what · v1.3</span>
            <h1 style={{ marginTop: 12 }}>What companies earn, what tax they pay, and what consumers pay.</h1>
            <p className="intro__lede">
              This page shows what major energy companies earn in Australia, what tax they pay,
              and what consumers pay at the pump — using figures filed with the ATO, ACCC and ASX.
              Nothing here is estimated. Populated numbers link to the document they came from.
            </p>
          </div>
          <aside className="intro__meta" aria-label="Publication details">
            <strong>Verified data retrieved</strong>
            <span className="mono">{updatedDisplay}</span>
            <div style={{ height: 12 }}/>
            <strong>Source check</strong>
            <span>Populated cells link to public reports.</span>
          </aside>
        </section>

        <DataCoverage data={data}/>

        {/* HOW TO READ THIS */}
        <section className="section section--why">
          <div className="why-grid">
            <div>
              <span className="eyebrow">Start here</span>
              <h2 style={{ marginTop: 8 }}>How to read this page</h2>
            </div>
            <div className="why-body">
              <p>
                <b>Total income</b> is the gross revenue a company declares to the ATO. It is not
                profit. A company can have billions in total income and still record a loss.
              </p>
              <p>
                <b>Taxable income</b> is what's left after the ATO lets the company deduct costs,
                depreciation, past losses and some concessions. Corporate tax is charged on this,
                not on total income.
              </p>
              <p>
                <b>Income tax paid</b> is what actually landed in Commonwealth coffers for that
                fiscal year. Zero is legal when taxable income is zero or there are carried-forward
                losses; it is still worth noting.
              </p>
              <p>
                <b>Net profit</b> comes from the company's own annual report and follows accounting
                standards, not tax law. It will usually differ from the ATO's taxable income, sometimes by a lot.
              </p>
              <p>
                <b>Effective tax rate</b> here = income tax paid ÷ taxable income. Australia's
                statutory rate is 30%. Lower effective rates typically reflect R&amp;D offsets, past
                losses, or the Petroleum Resource Rent Tax regime.
              </p>
            </div>
          </div>
        </section>

        {/* COMPANY TABLE */}
        <section className="section" aria-labelledby="h-tax">
          <div className="section__head">
            <div>
              <span className="eyebrow">Section 1 · Who pays</span>
              <h2 id="h-tax">Revenue, profit and tax — major energy companies in Australia</h2>
              <p className="section__lede">
                Figures are copied directly from ATO Corporate Tax Transparency, ASX annual reports
                and ASIC-lodged financial statements. Blank cells mean "Source unavailable" —
                we leave them empty rather than estimate.
              </p>
            </div>
          </div>

          <div className="pending-list" aria-label="Company tax source coverage">
            <article className="source-card">
              <h4>Company rows awaiting manual verification</h4>
              <p className="body-sm">
                {populatedCompanyCount} of {COMPANIES.length} company envelopes currently contain verified
                ATO tax fields. {profitCompanyCount} of {COMPANIES.length} contain verified net-profit
                fields. Values should be entered only after checking the ATO release and the company's
                annual report or ASIC-lodged statements.
              </p>
            </article>
          </div>

          <div className="data-table-wrap" role="region" aria-label="Company tax and profit table">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">Company</th>
                  <th scope="col">Fiscal year</th>
                  <th scope="col">Total income (ATO)</th>
                  <th scope="col">Taxable income (ATO)</th>
                  <th scope="col">Income tax paid (ATO)</th>
                  <th scope="col">Net profit (report)</th>
                  <th scope="col">Effective tax rate</th>
                  <th scope="col">Source</th>
                </tr>
              </thead>
              <tbody>
                {COMPANIES.map(c => {
                  const env = data[c.id];
                  const er = effectiveRate(env);
                  return (
                    <tr key={c.id}>
                      <td><b>{c.short}</b></td>
                      <Cell env={env} atoEnv={data.ato_corporate_tax} fieldKey="fiscal_year" />
                      <Cell env={env} atoEnv={data.ato_corporate_tax} fieldKey="total_income" unit="A$m" />
                      <Cell env={env} atoEnv={data.ato_corporate_tax} fieldKey="taxable_income" unit="A$m" />
                      <Cell env={env} atoEnv={data.ato_corporate_tax} fieldKey="income_tax_paid" unit="A$m" />
                      <Cell env={env} fieldKey="net_profit" unit="A$m" />
                      {er == null
                        ? <td className="unavail">—</td>
                        : <td>{er.toFixed(1)}%</td>}
                      <SourceCell env={env} />
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="caption" style={{ marginTop: 12 }}>
            "—" means the figure has not yet been hand-keyed from the company's latest filed
            report. Cross-check with the ATO Corporate Tax Transparency dataset before publishing:{' '}
            <a href={data.ato_corporate_tax.source_url}>{data.ato_corporate_tax.source_name}</a>.
          </p>
        </section>

        {/* CONSUMER SIDE */}
        <section className="section" aria-labelledby="h-consumer">
          <div className="section__head">
            <div>
              <span className="eyebrow">Section 2 · What consumers pay</span>
              <h2 id="h-consumer">Retail petrol price breakdown</h2>
              <p className="section__lede">
                Where each dollar at the pump goes — international refined petrol cost, taxes,
                other costs and margins, and the ACCC gross indicative retail difference.
              </p>
            </div>
          </div>

          {allPumpComponentsVerified ? (
            <div className="metric-grid metric-grid--4">
              {PUMP_COMPONENTS.map(component => (
                <MetricCard
                  key={component.id}
                  eyebrow={component.eyebrow}
                  label={component.label}
                  plain={component.plain}
                  fromEnvelope={data[component.id]}
                  unit=" A$/L"
                />
              ))}
            </div>
          ) : (
            <div className="pending-list" aria-label="Pending ACCC retail breakdown coverage">
              <article className="source-card">
                <h4>Retail breakdown pending</h4>
                <p className="body-sm">
                  {verifiedPumpComponents} of {PUMP_COMPONENTS.length} ACCC petrol-breakdown components are verified.
                  The component cards stay hidden until the ACCC December quarter 2025 petrol-price components
                  are all populated from the same report.
                </p>
                {data.accc_petroleum_monitoring?.source_url && (
                  <a href={data.accc_petroleum_monitoring.source_url}>
                    {data.accc_petroleum_monitoring.source_name} <Icon name="external" size={12}/>
                  </a>
                )}
              </article>
            </div>
          )}

          {pumpSeriesVerified && (
            <>
              <div style={{ height: 24 }}/>
              <div className="charts-grid charts-grid--full">
                <ChartCard
                  eyebrow="Trailing 12 months"
                  title="Monthly retail petrol price breakdown"
                  unit="A$/L"
                  fromEnvelope={data.accc_petrol_breakdown_series}
                  ranges={['1Y','3Y']}
                  defaultRange="1Y"
                  accent="#1F3A8A"
                  takeaway="Monthly ACCC retail petrol price breakdown from verified component series."
                  yAxisLabel="Australian dollars per litre (A$/L)"
                />
              </div>
            </>
          )}
        </section>

        {/* SOURCES */}
        <section className="section section--sources" id="sources">
          <div className="section__head">
            <div>
              <span className="eyebrow">Sources & methodology</span>
              <h2>Every source cited on this page</h2>
              <p className="section__lede">
                ATO Corporate Tax Transparency Report, ACCC Petroleum Monitoring Reports, and
                each company's latest annual report or ASIC-lodged financial statements.
              </p>
            </div>
          </div>
          <div className="sources-grid">
            {Object.entries(data).map(([id, env]) => (
              <article key={id} className="source-card">
                <h4>{env.source_name}</h4>
                <p className="body-sm">{sourceSummary(env)}</p>
                <p className="caption"><b>Envelope:</b> <span className="mono">{id}</span></p>
                {env.source_url && <a href={env.source_url}>{env.source_url.replace(/^https?:\/\//,'')} <Icon name="external" size={12}/></a>}
                <p className="caption mono">Retrieved: {env.retrieved_at ? window.FR.fmtRetrieved(env.retrieved_at) : '—'}</p>
              </article>
            ))}
          </div>
          <div className="methodology">
            <h3>How we calculate the numbers</h3>
            <dl>
              <dt>Total income / taxable income / income tax paid</dt>
              <dd>Copied from the ATO Corporate Tax Transparency Report for the relevant fiscal year. The ATO publishes these for every corporate entity with total income above A$100m.</dd>
              <dt>Net profit</dt>
              <dd>From the company's own annual report (ASX-listed) or ASIC-lodged financial statements (private Australian subsidiaries). Follows accounting standards, not tax law.</dd>
              <dt>Effective tax rate</dt>
              <dd>Income tax paid divided by taxable income, as a percentage. Australia's statutory rate is 30%. An effective rate below that is not by itself evidence of avoidance — it often reflects R&amp;D offsets, past losses, or PRRT. Zero is possible when taxable income is zero.</dd>
              <dt>Retail petrol breakdown</dt>
              <dd>From the ACCC Petroleum Monitoring Report's "Where does the money go?" breakdown, converted to Australian dollars per litre.</dd>
            </dl>
          </div>
        </section>

        <Footer updated={latestRetrieved ? updatedDisplay : ''}/>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
