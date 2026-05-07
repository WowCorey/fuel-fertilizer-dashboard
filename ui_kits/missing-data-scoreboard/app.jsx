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
    gap: 'Latest fuel strategy source, station availability, terminal inventory, vessel ETA/cargo/product and forward contracts',
    holder: 'Commonwealth, state/territory agencies, industry and private operators',
    why: 'Fuel affects tourism, freight, farms, emergency services, defence posture and regional resilience.',
    action: 'Publish source-safe station, terminal, cargo and contract fields with product, date, geography and reuse terms.',
    page: 'Fuel strategy / National fuel security',
  },
  {
    area: 'Queensland fuel sovereignty',
    status: 'source-gated',
    gap: 'Land parcels, EOI/bid counts, proponents, contracts, storage/refining capacity and approvals completion',
    holder: 'Queensland Government, port corporations, proponents and approval agencies',
    why: 'Public debate now includes delivery tracking, not only national fuel status.',
    action: 'Publish official AFIP delivery tables with hub, land, capacity, approval, proponent and contract status fields.',
    page: 'QLD fuel sovereignty',
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
    page: 'Housing pressure',
  },
  {
    area: 'Defence and procurement',
    status: 'source-gated',
    gap: 'Japan/warship procurement source verification, contract status, delivery timelines and logistics/fuel implications',
    holder: 'Defence, procurement agencies and official program sources',
    why: 'Ships, fuel logistics, industry content and delivery schedules are national-security issues.',
    action: 'Load only official Defence or procurement source material before asserting supplier, contract or delivery status.',
    page: 'Defence procurement / Defence posture',
  },
  {
    area: 'Brisbane 2032 readiness',
    status: 'source-gated',
    gap: 'Infrastructure delivery, transport, accommodation, power, tourism pressure and emergency logistics',
    holder: 'Delivery authority, Queensland agencies, councils, utilities and operators',
    why: 'The Olympics will stress transport, accommodation, power, tourism and emergency systems.',
    action: 'Use the Brisbane 2032 Readiness page to keep official delivery, capacity and emergency-readiness source gates visible.',
    page: 'Brisbane 2032 readiness',
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
    status: 'partial',
    fields: ['latest official fuel strategy release', 'national liquid fuel security policy', 'reserve commitments', 'MSO commitments', 'product-level days cover', 'emergency fuel response settings', 'public vs security-sensitive data boundary', 'next update due'],
    note: 'A dedicated Fuel Strategy page now surfaces existing PM&C/DCCEEW indicators and keeps latest-strategy, emergency-setting, terminal, contract and public/private-boundary rows source-gated.',
  },
  {
    title: 'Housing and economic pressure',
    status: 'partial',
    fields: ['RBA cash rate', 'mortgage pressure', 'household debt', 'first-home buyers', 'investor loans/ownership', 'rental stress', 'dwelling approvals / housing supply', 'negative gearing modelling'],
    note: 'A dedicated Housing pressure page now reuses RBA, ABS and NHSAC envelopes while keeping repayment, rental, investor and negative-gearing model inputs gated.',
  },
  {
    title: 'Defence procurement watch',
    status: 'source-gated',
    fields: ['procurement pathway', 'vessel/frigate/general-purpose ship program', 'supplier nation', 'contract status', 'delivery timeline', 'Australian industry content', 'logistics/fuel implication', 'defence posture impact'],
    note: 'A dedicated Defence Procurement Watch page now surfaces these source gates. No contract, delivery or supplier-pathway fact is asserted until official Defence or public procurement source material is loaded.',
  },
  {
    title: 'Brisbane 2032 readiness',
    status: 'source-gated',
    fields: ['infrastructure delivery', 'transport capacity', 'accommodation pressure', 'power reliability', 'tourism pressure', 'supply-chain readiness', 'public safety and emergency logistics'],
    note: 'A dedicated Brisbane 2032 Readiness page now surfaces these source gates. No venue status, costs, capacity, tourism pressure, public-safety readiness or emergency-logistics values are asserted until official/public sources are loaded.',
  },
  {
    title: 'AI automation and workforce pressure',
    status: 'roadmap',
    fields: ['sector automation exposure', 'displacement risk', 'productivity upside/downside', 'retraining capacity', 'regional workforce exposure', 'labour market indicators'],
    note: 'No AI causation or fake exposure score is published.',
  },
];

const PRIORITY_MATRIX_ROWS = [
  {
    band: 'Immediate',
    statusKind: 'stale',
    status: 'Stale / partial',
    gap: 'Product-level fuel days cover and MSO reserves',
    affected: 'tourism, freight, emergency planning, government',
    holder: 'Commonwealth / PM&C / DCCEEW',
    decision: 'national fuel risk visibility',
    blocker: 'latest machine-readable/public feed not loaded',
    action: 'verify latest official source and update or automate envelope',
    page: 'Fuel strategy / National fuel security',
  },
  {
    band: 'Immediate',
    statusKind: 'unavailable',
    status: 'Unavailable / partial',
    gap: 'Live or near-live station availability and regional stock-outs',
    affected: 'travellers, tourism operators, regional communities',
    holder: 'industry / states / fuel retailers / government',
    decision: 'travel and refuelling planning',
    blocker: 'no national public live station outage API',
    action: 'identify public state feeds or industry/government publication pathway',
    page: 'National fuel security',
  },
  {
    band: 'Immediate',
    statusKind: 'unavailable',
    status: 'Unavailable',
    gap: 'Forward fuel/fertiliser contract coverage',
    affected: 'farms, freight, tourism, government planners',
    holder: 'government / industry',
    decision: 'supply certainty beyond the month',
    blocker: 'contracts are not public',
    action: 'keep as government/industry feed request',
    page: 'National fuel security / Food farms water',
  },
  {
    band: 'Immediate',
    statusKind: 'source-gated',
    status: 'Partial / source-gated',
    gap: 'Queensland AFIP EOI / six-port delivery status',
    affected: 'Queensland communities, industry, tourism, government',
    holder: 'Queensland Government / Coordinator-General / port authorities',
    decision: 'fuel sovereignty delivery tracking',
    blocker: 'public context exists, but proponents/capacity/land/status are not published',
    action: 're-check official AFIP/Coordinator-General pages for update tables',
    page: 'QLD fuel sovereignty',
  },
  {
    band: 'High',
    statusKind: 'unavailable',
    status: 'Unavailable / source-gated',
    gap: 'Fertiliser stock cover and farm diesel risk',
    affected: 'farmers, freight, regional communities',
    holder: 'government / industry / farm-input suppliers',
    decision: 'planting and input-purchase planning',
    blocker: 'import value is loaded, but cover, contracts and farm diesel availability are not public',
    action: 'verify whether official or industry public stock-cover and farm-diesel feeds exist',
    page: 'Food, farms & water security',
  },
  {
    band: 'High',
    statusKind: 'unavailable',
    status: 'Unavailable',
    gap: 'Water allocation by food-producing region',
    affected: 'farmers, processors, regional communities',
    holder: 'states, water authorities, MDBA/BOM candidate sources',
    decision: 'crop, irrigation and regional production planning',
    blocker: 'storage/allocation sources have not been mapped to food-producing regions with a safe method',
    action: 'scope one official geography and water concept before publishing values',
    page: 'Food, farms & water security',
  },
  {
    band: 'High',
    statusKind: 'source-gated',
    status: 'Source-gated',
    gap: 'Housing pressure indicators beyond RBA cash rate',
    affected: 'households, renters, first-home buyers, policy staff',
    holder: 'ABS / RBA / APRA / ATO / state agencies',
    decision: 'cost-of-living and housing-pressure interpretation',
    blocker: 'housing stress concepts differ across debt, rents, tax, approvals and ownership datasets',
    action: 'separate each official indicator before creating any housing pressure view',
    page: 'Housing pressure',
  },
  {
    band: 'High',
    statusKind: 'source-gated',
    status: 'Source-gated',
    gap: 'Defence/naval procurement verification',
    affected: 'defence planners, industry, national-security readers',
    holder: 'Defence / official procurement sources',
    decision: 'procurement pathway and logistics context',
    blocker: 'no official procurement row is loaded for supplier, contract, delivery or logistics implication',
    action: 'load only official Defence/procurement material before asserting pathway facts',
    page: 'Defence procurement / Defence posture',
  },
  {
    band: 'High',
    statusKind: 'partial',
    status: 'Partial / source-gated',
    gap: 'Power/infrastructure resilience bottlenecks',
    affected: 'households, industry, operators, government',
    holder: 'AEMO, regulators, infrastructure agencies, utilities',
    decision: 'outage resilience, delivery risk and logistics planning',
    blocker: 'existing pages show selected public signals, not complete bottleneck or delivery-status feeds',
    action: 'scope official outage, constraint and project-delivery datasets one at a time',
    page: 'Power grid / Infrastructure',
  },
  {
    band: 'Medium',
    statusKind: 'roadmap',
    status: 'Roadmap',
    gap: 'AI workforce exposure',
    affected: 'workers, employers, training providers, policy staff',
    holder: 'ABS / Jobs and Skills Australia / Productivity Commission / Treasury',
    decision: 'skills, retraining and regional workforce planning',
    blocker: 'no source-safe Australian automation exposure score is loaded',
    action: 'identify official Australian exposure or skills datasets before publishing any exposure view',
    page: 'Employment & Automation',
  },
  {
    band: 'Medium',
    statusKind: 'source-gated',
    status: 'Source-gated',
    gap: 'Olympics readiness',
    affected: 'tourism operators, residents, infrastructure planners, emergency services',
    holder: 'delivery authority, Queensland agencies, councils, utilities and operators',
    decision: 'transport, accommodation, power, tourism and emergency logistics readiness',
    blocker: 'readiness categories are not yet wired to official delivery/capacity sources',
    action: 'use the dedicated Brisbane 2032 Readiness page to track official/public source gates',
    page: 'Brisbane 2032 readiness',
  },
  {
    band: 'Medium',
    statusKind: 'source-gated',
    status: 'Source-gated',
    gap: 'Manufacturing bottlenecks',
    affected: 'manufacturers, suppliers, workforce planners, government',
    holder: 'ABS / Department of Industry / industry and logistics sources',
    decision: 'industrial capacity and supply-chain pressure interpretation',
    blocker: 'current manufacturing page loads core ABS rows, not bottleneck, logistics or input-constraint feeds',
    action: 'verify official bottleneck or constraint datasets before adding rows',
    page: 'Manufacturing',
  },
  {
    band: 'Medium',
    statusKind: 'source-gated',
    status: 'Source-gated',
    gap: 'Strategic resources project readiness',
    affected: 'industry, defence, manufacturers, trade planners',
    holder: 'DISR / Geoscience Australia / state resources departments',
    decision: 'critical-mineral and strategic-resource readiness context',
    blocker: 'resource production/export/reserve rows are separate from project readiness and delivery status',
    action: 'add project-readiness rows only from official project tables with clear period and scope',
    page: 'Strategic resources',
  },
];

const ACTION_QUEUE = [
  {
    title: 'Source verification',
    status: 'source-gated',
    copy: 'Find the official source, exact field, period, unit and reuse boundary before a gap can become a dashboard value.',
  },
  {
    title: 'Data access request',
    status: 'unavailable',
    copy: 'Where public data is unavailable, this becomes a government/industry data request rather than a dashboard bug.',
  },
  {
    title: 'Automation candidate',
    status: 'derived',
    copy: 'Where a stable CSV/JSON/XLSX source exists, the next step is programmatic ingestion and envelope validation.',
  },
  {
    title: 'Methodology needed',
    status: 'manual',
    copy: 'Where multiple concepts must be combined, a transparent method is required before publishing an index or status model.',
  },
  {
    title: 'Public/private boundary needed',
    status: 'partial',
    copy: 'Some fuel, defence and supply-chain data may be sensitive. The dashboard should ask for safe aggregate indicators, not hidden operational detail.',
  },
  {
    title: 'Roadmap build',
    status: 'roadmap',
    copy: 'Future pages and source-gated areas such as AI workforce need source scoping before values are loaded; Brisbane 2032 readiness now has a dedicated source-gated tracker.',
  },
];

const DECISION_GROUPS = [
  ['Public / travellers', 'station availability, regional stock-outs, fuel price pressure, travel-route disruption visibility'],
  ['Farmers', 'fertiliser cover, farm diesel risk, water allocation, rainfall/drought pressure, freight disruption'],
  ['Small business', 'fuel and energy pressure, freight delays, tourism route pressure, workforce and demand signals'],
  ['Government / MPs', 'public-data gaps, source cadence, policy delivery status and missing operational feeds'],
  ['Defence / national security', 'fuel resilience, naval procurement source gates, strategic-resource readiness and logistics boundaries'],
  ['Industry / infrastructure', 'terminal, port, project delivery, manufacturing bottleneck and power resilience feeds'],
  ['Future pressure', 'housing, AI workforce, Olympics readiness and other source-scoping roadmap areas'],
];

const OPERATIONAL_CHECKLIST = [
  'machine-readable official/public feeds',
  'consistent update cadence',
  'clear product/geography definitions',
  'source rights and reuse terms',
  'public/private sensitivity boundary',
  'validation rules',
  'methodology for derived status models',
  'government/industry contact pathway',
  'maintenance and refresh ownership',
];

function StatusBadge({ status }) {
  return <TrustBadge kind={status}>{status === 'source-gated' ? 'Source-gated' : status.charAt(0).toUpperCase() + status.slice(1)}</TrustBadge>;
}

function PriorityBand({ band }) {
  const key = String(band).toLowerCase();
  return <span className={`priority-band priority-band--${key}`}>{band}</span>;
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

        <section className="section" aria-labelledby="scoreboard-read-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">How to read this scoreboard</span>
              <h2 id="scoreboard-read-h">Start with the gap, then the action</h2>
              <p className="section__lede">
                The page is designed for quick triage: what is missing, why it matters,
                who likely holds it and what has to happen before it can become a dashboard value.
              </p>
            </div>
          </div>
          <div className="quick-link-grid quick-link-grid--4">
            <article className="quick-link-card">
              <h3>Scoreboard</h3>
              <p>Shows the public-data gaps and the dashboard pages affected.</p>
              <a href="#scoreboard-h">Go to scoreboard</a>
            </article>
            <article className="quick-link-card">
              <h3>Priority matrix</h3>
              <p>Groups the most decision-useful gaps into categorical triage bands.</p>
              <a href="#priority-h">Go to matrix</a>
            </article>
            <article className="quick-link-card">
              <h3>Action queue</h3>
              <p>Separates source checks, data requests, automation and methodology work.</p>
              <a href="#queue-h">Go to action queue</a>
            </article>
            <article className="quick-link-card">
              <h3>No-estimate rule</h3>
              <p>Explains why unavailable, stale and source-gated gaps stay visible.</p>
              <a href="#no-estimate-h">Go to rule</a>
            </article>
          </div>
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

        <section className="section" aria-labelledby="priority-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Decision-useful triage</span>
              <h2 id="priority-h">National readiness priority matrix</h2>
              <p className="section__lede">
                This matrix groups high-value missing, stale and partial feeds by decision need.
                Priority bands are editorial/product triage only, not official risk ratings or numeric scores.
              </p>
            </div>
          </div>
          <div className="data-table-wrap">
            <table className="data-table data-table--plain priority-matrix">
              <thead>
                <tr>
                  <th>Priority band</th>
                  <th>Data gap</th>
                  <th>Status</th>
                  <th>Affected users</th>
                  <th>Likely holder / publisher</th>
                  <th>Decision supported</th>
                  <th>Current blocker</th>
                  <th>Next action</th>
                  <th>Dashboard page</th>
                </tr>
              </thead>
              <tbody>
                {PRIORITY_MATRIX_ROWS.map(row => (
                  <tr key={`${row.band}-${row.gap}`}>
                    <td><PriorityBand band={row.band}/></td>
                    <td>{row.gap}</td>
                    <td><TrustBadge kind={row.statusKind}>{row.status}</TrustBadge></td>
                    <td>{row.affected}</td>
                    <td>{row.holder}</td>
                    <td>{row.decision}</td>
                    <td>{row.blocker}</td>
                    <td>{row.action}</td>
                    <td>{row.page}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="section section--why" aria-labelledby="queue-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Action queue</span>
              <h2 id="queue-h">Next action queue</h2>
              <p className="section__lede">
                The next action depends on the blocker. Some gaps need a source check, some need a data-access request,
                and some need methodology before they can become public dashboard values.
              </p>
            </div>
          </div>
          <div className="source-grid">
            {ACTION_QUEUE.map(item => (
              <article className="source-card" key={item.title}>
                <StatusBadge status={item.status}/>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section" aria-labelledby="decision-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Decision view</span>
              <h2 id="decision-h">Grouped by who needs the missing data</h2>
              <p className="section__lede">
                Static groupings are used instead of complex filters so the page stays robust as a static public site.
              </p>
            </div>
          </div>
          <div className="source-grid">
            {DECISION_GROUPS.map(([title, copy]) => (
              <article className="source-card" key={title}>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section section--why" aria-labelledby="operational-h">
          <div className="why-grid">
            <div>
              <span className="eyebrow">Pilot readiness</span>
              <h2 id="operational-h">What would make this operational?</h2>
            </div>
            <div className="why-body">
              <p>
                An operational public dashboard needs more than a page layout. It needs stable source access,
                clear public/private boundaries and ownership for the refresh cycle.
              </p>
              <ul className="gap-list">
                {OPERATIONAL_CHECKLIST.map(item => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </div>
        </section>

        <section className="section section--why" aria-labelledby="no-estimate-h">
          <div className="why-grid">
            <div>
              <span className="eyebrow">No-estimate rule</span>
              <h2 id="no-estimate-h">No-estimate rule</h2>
            </div>
            <div className="why-body">
              <p>
                This dashboard does not fill missing government or industry feeds with guesses. If a value is unavailable,
                stale or source-gated, it stays visible as a gap until a named source provides the exact field, period,
                unit and reuse boundary.
              </p>
            </div>
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
