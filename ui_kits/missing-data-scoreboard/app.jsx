const STATUS_LEGEND = [
  ['observed', 'Verified', 'Source-backed and current enough for its cadence.'],
  ['partial', 'Partial', 'Source-backed, but incomplete by geography, product, timing or concept.'],
  ['stale', 'Stale', 'Source-backed, but outside its expected cadence window.'],
  ['manual', 'Manual', 'Hand-keyed from a named public source.'],
  ['derived', 'Derived', 'Calculated or selected from a named source envelope.'],
  ['unavailable', 'Unavailable', 'No public source-safe feed is loaded.'],
  ['source-gated', 'Source-gated', 'Waiting for a verified source, field, period, unit and reuse rights.'],
  ['roadmap', 'Roadmap', 'Planned dashboard area, not yet populated.'],
];

const SCOREBOARD_ROWS = [
  {
    area: 'Fuel security',
    status: 'partial',
    gap: 'Station availability, terminal inventory, vessel ETA/cargo/product and forward contracts',
    holder: 'Commonwealth, state/territory agencies, industry and private operators',
    why: 'Fuel affects tourism, freight, farms, emergency services, defence posture and regional resilience.',
    action: 'Publish source-safe station, terminal, cargo and contract fields with product, date, geography and reuse terms.',
    page: 'National fuel security',
  },
  {
    area: 'Queensland fuel sovereignty',
    status: 'source-gated',
    gap: 'Land parcels, EOI/bid counts, proponents, contracts, storage/refining capacity and approvals completion',
    holder: 'Queensland Government, port corporations, proponents and approval agencies',
    why: 'Public debate now includes delivery tracking, not only national fuel status.',
    action: 'Publish official AFIP delivery tables with hub, land, capacity, approval, proponent and contract status fields.',
    page: 'National fuel security',
  },
  {
    area: 'Food, farms and water',
    status: 'partial',
    gap: 'Farm diesel, fertiliser cover, water allocations by food region, drought pressure and freight disruption',
    holder: 'Commonwealth, states, water authorities, industry and logistics operators',
    why: 'Fuel, fertiliser and water determine whether farms can produce and move food.',
    action: 'Wire one exact public dataset at a time; do not infer drought, allocations or cover from maps or commentary.',
    page: 'Food, farms & water security',
  },
  {
    area: 'Economy and housing',
    status: 'source-gated',
    gap: 'Housing affordability model, investor ownership, first-home buyers, negative gearing and rental stress',
    holder: 'ABS, RBA, APRA, ATO, state agencies and housing authorities',
    why: 'Rates, debt, rents and housing supply shape cost of living and social stability.',
    action: 'Separate official cash-rate/debt signals from future housing model inputs before publishing any model.',
    page: 'AU economics',
  },
  {
    area: 'Defence and procurement',
    status: 'source-gated',
    gap: 'Japan/warship procurement source verification, contract status, delivery timelines and logistics/fuel implications',
    holder: 'Defence, procurement agencies and official program sources',
    why: 'Ships, fuel logistics, industry content and delivery schedules are national-security issues.',
    action: 'Load only official Defence or procurement source material before asserting supplier, contract or delivery status.',
    page: 'Defence posture',
  },
  {
    area: 'Brisbane 2032 readiness',
    status: 'roadmap',
    gap: 'Infrastructure delivery, transport, accommodation, power, tourism pressure and emergency logistics',
    holder: 'Delivery authority, Queensland agencies, councils, utilities and operators',
    why: 'The Olympics will stress transport, accommodation, power, tourism and emergency systems.',
    action: 'Scope official delivery and capacity sources before creating readiness indicators.',
    page: 'Roadmap',
  },
  {
    area: 'AI and workforce',
    status: 'roadmap',
    gap: 'Sector exposure, displacement risk, retraining capacity and regional workforce exposure',
    holder: 'ABS, Jobs and Skills Australia, Treasury, Productivity Commission and education agencies',
    why: 'AI may reshape productivity, jobs, skills and government service demand, but timing is not causation.',
    action: 'Do not publish AI displacement scores until an Australian source-safe methodology exists.',
    page: 'Employment & Automation',
  },
];

const ROADMAP_SECTIONS = [
  {
    title: 'Australian fuel strategy tracker',
    status: 'source-gated',
    fields: ['latest official fuel strategy release', 'national liquid fuel security policy', 'reserve commitments', 'MSO commitments', 'product-level days cover', 'emergency fuel response settings', 'public vs security-sensitive data boundary', 'next update due'],
    note: 'Official source required before any latest-strategy claim is made.',
  },
  {
    title: 'Housing and economic pressure',
    status: 'source-gated',
    fields: ['RBA cash rate', 'mortgage pressure', 'household debt', 'first-home buyers', 'investor loans/ownership', 'rental stress', 'dwelling approvals / housing supply', 'negative gearing modelling'],
    note: 'The RBA latest cash-rate target is loaded elsewhere; housing model inputs remain gated.',
  },
  {
    title: 'Defence procurement watch',
    status: 'source-gated',
    fields: ['procurement pathway', 'vessel/frigate/general-purpose ship program', 'supplier nation', 'contract status', 'delivery timeline', 'Australian industry content', 'logistics/fuel implication', 'defence posture impact'],
    note: 'Pending official Defence or procurement source verification. No contract, delivery or supplier-pathway fact is asserted here.',
  },
  {
    title: 'Brisbane 2032 readiness',
    status: 'roadmap',
    fields: ['infrastructure delivery', 'transport capacity', 'accommodation pressure', 'power reliability', 'tourism pressure', 'supply-chain readiness', 'public safety and emergency logistics'],
    note: 'Roadmap only until official delivery authority and public capacity sources are wired.',
  },
  {
    title: 'AI automation and workforce pressure',
    status: 'roadmap',
    fields: ['sector automation exposure', 'displacement risk', 'productivity upside/downside', 'retraining capacity', 'regional workforce exposure', 'labour market indicators'],
    note: 'No AI causation or fake exposure score is published.',
  },
];

function StatusBadge({ status }) {
  return <TrustBadge kind={status}>{status === 'source-gated' ? 'Source-gated' : status.charAt(0).toUpperCase() + status.slice(1)}</TrustBadge>;
}

function App() {
  const [refreshStatus, setRefreshStatus] = React.useState(null);
  React.useEffect(() => {
    window.FR.loadRefreshStatus().then(setRefreshStatus);
  }, []);

  return (
    <div className="page">
      <Header active="missing_data" refreshStatus={refreshStatus}/>
      <main id="main">
        <section className="intro">
          <div>
            <span className="eyebrow">Missing data scoreboard</span>
            <h1>What Australia can see, and what is still missing.</h1>
            <p className="lede">
              This page turns dashboard gaps into a public-policy product. It separates verified data,
              partial coverage, stale sources, unavailable feeds, source-gated work and roadmap-only
              areas without inventing values.
            </p>
          </div>
          <aside className="intro-card">
            <strong>Boundary</strong>
            <span>Independent public-source prototype</span>
            <div style={{ height: 12 }}/>
            <strong>No estimate-first scoring</strong>
            <span>Missing data stays visible until source-safe</span>
          </aside>
        </section>

        <section className="data-currency" aria-label="Data currency summary">
          <div>
            <span className="eyebrow">Data currency</span>
            <p>
              Refreshed means the automated pipeline last ran successfully. This scoreboard does not publish
              new data values; it maps public-data gaps and the likely source owner.
            </p>
          </div>
          <dl className="data-currency__list">
            <div>
              <dt>Site refreshed</dt>
              <dd>{window.FR.fmtRefreshStatus(refreshStatus)}</dd>
            </div>
            <div>
              <dt>Page data retrieved</dt>
              <dd>No source envelopes loaded on this scoreboard page</dd>
            </div>
            <div>
              <dt>Latest source data point</dt>
              <dd>Not applicable</dd>
            </div>
          </dl>
        </section>

        <section className="section section--why" aria-labelledby="legend-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Unified confidence legend</span>
              <h2 id="legend-h">Unavailable data is evidence of a public-data gap</h2>
              <p className="section__lede">
                These labels are used across the dashboard surfaces and the roadmap. They are categorical,
                not numeric scores.
              </p>
            </div>
          </div>
          <div className="source-grid">
            {STATUS_LEGEND.map(([kind, label, copy]) => (
              <article className="source-card" key={kind}>
                <StatusBadge status={kind}/>
                <h3>{label}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section" aria-labelledby="scoreboard-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Public-data scoreboard</span>
              <h2 id="scoreboard-h">Missing data scoreboard</h2>
              <p className="section__lede">
                Each row names the gap, the likely holder or publisher, why the gap matters, the next source action
                and the dashboard surface affected.
              </p>
            </div>
          </div>
          <div className="data-table-wrap">
            <table className="data-table data-table--plain">
              <thead>
                <tr>
                  <th>Area</th>
                  <th>Status</th>
                  <th>Missing feed or source gate</th>
                  <th>Likely holder / publisher</th>
                  <th>Why it matters</th>
                  <th>Next source action</th>
                  <th>Dashboard</th>
                </tr>
              </thead>
              <tbody>
                {SCOREBOARD_ROWS.map(row => (
                  <tr key={row.area}>
                    <td>{row.area}</td>
                    <td><StatusBadge status={row.status}/></td>
                    <td>{row.gap}</td>
                    <td>{row.holder}</td>
                    <td>{row.why}</td>
                    <td>{row.action}</td>
                    <td>{row.page}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="section" aria-labelledby="roadmap-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Roadmap source gates</span>
              <h2 id="roadmap-h">Next national dashboard areas</h2>
              <p className="section__lede">
                These areas are useful, but they stay source-gated or roadmap-only until public sources support
                exact fields, dates, units and reuse rights.
              </p>
            </div>
          </div>
          <div className="source-grid">
            {ROADMAP_SECTIONS.map(section => (
              <article className="source-card" key={section.title}>
                <StatusBadge status={section.status}/>
                <h3>{section.title}</h3>
                <ul className="gap-list">
                  {section.fields.map(field => <li key={field}>{field}</li>)}
                </ul>
                <p>{section.note}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section section--why" aria-labelledby="truth-h">
          <div className="why-grid">
            <div>
              <span className="eyebrow">Truth boundary</span>
              <h2 id="truth-h">What this scoreboard does not do</h2>
            </div>
            <div className="why-body">
              <p>
                It does not invent government strategy facts, Defence procurement facts, Olympics delivery status,
                housing model values, AI displacement scores, live fuel availability, vessel ETAs, port cargo data
                or private contract coverage.
              </p>
              <p>
                It makes the missing public feeds visible so policy staff, journalists, operators and citizens can see
                which national resilience questions still need official or industry data.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer refreshStatus={refreshStatus}/>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
