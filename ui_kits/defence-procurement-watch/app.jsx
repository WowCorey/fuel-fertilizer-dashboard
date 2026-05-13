const SERIES = [
  'defence_japan_warship_procurement_source_gate',
  'defence_frigate_procurement_status',
  'defence_naval_logistics_fuel_implication',
  'defence_surface_fleet_procurement_pathway',
  'defence_shipbuilding_industry_content_gate',
  'defence_procurement_delivery_timeline_gate',
  'defence_procurement_contract_value_gate',
  'defence_procurement_public_boundary_gate',
  'defence_sovereign_industry_context',
  'defence_public_capability_assets',
  'defence_readiness_gap',
  'strategic_resources_critical_minerals_context',
];

const QUICK_GUIDE = [
  ['1', 'Procurement pathway', 'Start with whether an official procurement pathway has been loaded.'],
  ['2', 'Contract and delivery status', 'Treat supplier, value, class, count and delivery rows as unavailable until official source material exists.'],
  ['3', 'Australian industry content', 'Keep industry-content questions separate from procurement facts.'],
  ['4', 'Logistics and fuel implications', 'Do not convert procurement discussion into fuel or sustainment metrics.'],
  ['5', 'Strategic dependencies', 'Link procurement questions to resources, manufacturing and infrastructure only as context.'],
  ['6', 'What still needs publishing', 'Use missing rows as source requests, not as dashboard values.'],
];

const PROCUREMENT_STATUS_LEGEND = [
  ['observed', 'Verified', 'Source-backed and current enough for its cadence.'],
  ['partial', 'Partial', 'Source-backed, but incomplete by procurement stage, project, contract field, delivery milestone or update cadence.'],
  ['stale', 'Stale', 'Source-backed, but outside its expected cadence window.'],
  ['manual', 'Manual', 'Hand-keyed from a named public source or held as a manual snapshot pending a verified row.'],
  ['derived', 'Derived', 'Calculated or selected from a named source envelope.'],
  ['source-gated', 'Source-gated', 'Waiting for a verified source, field, period, unit and reuse rights.'],
  ['unavailable', 'Unavailable', 'No public source-safe feed is loaded.'],
  ['roadmap', 'Roadmap', 'Planned dashboard area, not yet populated.'],
];

const PROCUREMENT_EVIDENCE_BOUNDARY = [
  {
    title: 'Unavailable does not mean zero',
    copy: 'Unavailable means no public source-safe feed has been loaded yet. It is not a statement that contracts, suppliers, delivery milestones, vessel numbers, industry content, logistics demand or capability implications are zero or absent.',
  },
  {
    title: 'Source-gated requires publisher verification',
    copy: 'Source-gated means the dashboard still needs a verified public source, exact field, period, unit and reuse boundary before a procurement value can be published.',
  },
  {
    title: 'Procurement signals are not capability proof',
    copy: 'Public procurement discussion is not treated as proof of capability, readiness, delivery certainty or operational outcome unless a named public source explicitly supports that link.',
  },
  {
    title: 'No classified inference',
    copy: 'This page does not infer classified or non-public information from procurement, industrial, logistics, sustainment, fuel or posture context.',
  },
  {
    title: 'No estimates fill procurement gaps',
    copy: 'This page does not estimate missing contract values, supplier pathways, delivery dates, vessel class, fleet count, sustainment burden, fuel demand, industry content or operational capability.',
  },
  {
    title: 'Visibility gap, not misconduct proof',
    copy: 'A missing public feed is a public visibility gap. It is not proof of wrongdoing, and likely holder or publisher fields are starting points for verification, not custody assertions.',
  },
];

const PROCUREMENT_ROWS = [
  ['Japan/Australia warship procurement pathway', 'defence_japan_warship_procurement_source_gate', 'No official pathway row loaded.', 'Program, supplier pathway, contract status and delivery timeline are not asserted.', 'Official Defence or public procurement source with exact row and date.'],
  ['Frigate / general-purpose vessel pathway', 'defence_frigate_procurement_status', 'No source-safe contract or program row loaded.', 'Vessel class, number, delivery schedule and in-service target remain source-gated.', 'Load only official Defence/procurement material.'],
  ['Surface fleet procurement context', 'defence_surface_fleet_procurement_pathway', 'Source-gated pathway placeholder only.', 'No decision, supplier, fleet count or readiness implication is published.', 'Verify official public pathway source before display.'],
  ['Contracting stage', 'defence_frigate_procurement_status', 'No contract-stage row loaded.', 'No award, shortlist, negotiation or procurement-stage claim is made.', 'Publish official stage/status field.'],
  ['Supplier / partner nation', 'defence_japan_warship_procurement_source_gate', 'No supplier or partner-nation procurement row loaded.', 'No Japan/Australia supplier pathway is asserted.', 'Use official source material only.'],
  ['Decision status', 'defence_surface_fleet_procurement_pathway', 'No decision-status field loaded.', 'No decision, selection or approval is inferred.', 'Load official decision announcement if published.'],
  ['Public announcement status', 'defence_surface_fleet_procurement_pathway', 'No reusable announcement table loaded.', 'Media discussion or political commentary is not treated as a procurement row.', 'Create row only from official/public procurement source.'],
];

const CONTRACT_ROWS = [
  ['Contract awarded?', 'defence_frigate_procurement_status', 'Unavailable', 'No official contract-award row is loaded.', 'Do not infer from media discussion or broad procurement interest.'],
  ['Contract value', 'defence_procurement_contract_value_gate', 'Source-gated', 'No public value row is loaded.', 'Requires official value, currency, period and scope.'],
  ['Supplier / prime contractor', 'defence_japan_warship_procurement_source_gate', 'Source-gated', 'No supplier row is loaded.', 'Requires official supplier/procurement source.'],
  ['Vessel class / program', 'defence_frigate_procurement_status', 'Source-gated', 'No class or program row is loaded.', 'Do not publish class/program unless official.'],
  ['Number of vessels', 'defence_frigate_procurement_status', 'Unavailable', 'No vessel-count row is loaded.', 'Requires official quantity and scope.'],
  ['Delivery schedule', 'defence_procurement_delivery_timeline_gate', 'Source-gated', 'No delivery schedule row is loaded.', 'Requires official milestone/date fields.'],
  ['In-service target', 'defence_procurement_delivery_timeline_gate', 'Source-gated', 'No in-service target row is loaded.', 'Requires official public target.'],
  ['Sustainment arrangement', 'defence_shipbuilding_industry_content_gate', 'Source-gated', 'No sustainment row is loaded.', 'Requires official sustainment or industry-content source.'],
  ['Australian industry content', 'defence_shipbuilding_industry_content_gate', 'Source-gated', 'No project-specific industry-content row is loaded.', 'Requires official local-content or procurement source.'],
];

const INDUSTRY_ROWS = [
  ['Australian shipbuilding contribution', 'defence_sovereign_industry_context', 'Public industrial priority context is loaded, but no project-specific shipbuilding contribution row is loaded.', 'Current blocker: procurement-specific local-content source not loaded.', 'Manufacturing / Strategic resources'],
  ['Local sustainment', 'defence_shipbuilding_industry_content_gate', 'No sustainment arrangement row is loaded.', 'Current blocker: official sustainment scope and location not loaded.', 'Manufacturing / Infrastructure'],
  ['Supply-chain readiness', 'defence_shipbuilding_industry_content_gate', 'No supply-chain depth or readiness metric is loaded.', 'Current blocker: no public source-safe capacity field.', 'Manufacturing / Strategic resources'],
  ['Workforce / skills pressure', 'defence_shipbuilding_industry_content_gate', 'No procurement-specific workforce row is loaded.', 'Current blocker: no official workforce/skills denominator loaded.', 'Employment / Manufacturing'],
  ['Steel / critical materials', 'strategic_resources_critical_minerals_context', 'Strategic resources context exists, but no procurement bill-of-materials or supplier dependency is loaded.', 'Current blocker: no official project material dependency row.', 'Strategic resources'],
  ['Electronics / systems integration', 'defence_shipbuilding_industry_content_gate', 'No systems-integration capacity row is loaded.', 'Current blocker: no public project-specific integration source.', 'Manufacturing / Defence posture'],
  ['Port / dockyard infrastructure', 'defence_shipbuilding_industry_content_gate', 'No dockyard or port readiness row is loaded.', 'Current blocker: no official infrastructure dependency row.', 'Infrastructure'],
];

const LOGISTICS_ROWS = [
  ['Fuel type / logistics demand', 'Source-gated', 'No fuel type, demand or consumption row is loaded.', 'Official logistics/fuel basis required.'],
  ['Refuelling / sustainment burden', 'Source-gated', 'No sustainment burden metric is loaded.', 'Do not infer from ship type or procurement discussion.'],
  ['Port infrastructure requirement', 'Source-gated', 'No port requirement row is loaded.', 'Requires official infrastructure/logistics source.'],
  ['Supply-chain resilience', 'Source-gated', 'No supply-chain resilience metric is loaded.', 'Requires public aggregate indicator.'],
  ['Allied interoperability', 'Source-gated', 'No procurement-specific interoperability row is loaded.', 'Requires official program source.'],
  ['Fuel-security relevance', 'Source-gated', 'No direct fuel-security implication is loaded.', 'Use only official linkage.'],
  ['Emergency logistics relevance', 'Source-gated', 'No emergency logistics row is loaded.', 'Do not infer operational posture.'],
];

const DEPENDENCY_ROWS = [
  ['Regional posture relevance', 'defence_readiness_gap', 'Readiness and live posture stay unavailable.', 'Defence posture', 'No classified posture or readiness asserted.'],
  ['Maritime security relevance', 'defence_surface_fleet_procurement_pathway', 'Source-gated until official procurement pathway is loaded.', 'Defence posture', 'No operational capability claim.'],
  ['Critical mineral / strategic resource dependency', 'strategic_resources_critical_minerals_context', 'Resource context can inform dependency questions only.', 'Strategic resources', 'No procurement material dependency row loaded.'],
  ['Manufacturing readiness', 'defence_shipbuilding_industry_content_gate', 'No procurement-specific readiness row loaded.', 'Manufacturing', 'No industrial capacity inferred.'],
  ['Infrastructure readiness', 'defence_shipbuilding_industry_content_gate', 'No dockyard, port or infrastructure readiness row loaded.', 'Infrastructure', 'No facility capability inferred.'],
  ['Fuel/logistics dependency', 'defence_naval_logistics_fuel_implication', 'Source-gated until official fuel/logistics basis is loaded.', 'Fuel strategy / National fuel security', 'No fuel requirement inferred.'],
  ['Public-source confidence', 'defence_procurement_public_boundary_gate', 'Boundary source gate records what can and cannot be treated as a public row.', 'Missing Data Scoreboard', 'No sensitive operational detail requested.'],
];

const BOUNDARY_ROWS = [
  ['Procurement announcement', 'Yes', 'Source-gated', 'Safe to publish when official; no row loaded here yet.', 'Load official announcement.'],
  ['Contract value', 'Yes, if officially released', 'Source-gated', 'May require scope and currency boundaries.', 'Load official value row only.'],
  ['Delivery schedule', 'Yes, if officially released', 'Source-gated', 'Milestones should be official and dated.', 'Load official delivery timeline.'],
  ['Industry content', 'Yes, if officially released', 'Source-gated', 'Should avoid unsupported local-content claims.', 'Load official industry-content source.'],
  ['Operational readiness', 'No exact live detail', 'Unavailable', 'Readiness may be sensitive and is not inferred.', 'Keep unavailable unless safe aggregate is officially published.'],
  ['Live vessel movement', 'No', 'Unavailable', 'Live operational movement is outside this public prototype.', 'Do not add live movement feeds.'],
  ['Fuel logistics detail', 'Aggregate only if official', 'Source-gated', 'Exact fuel holdings or vulnerabilities may be sensitive.', 'Ask for safe aggregate indicators only.'],
  ['Sustainment risk', 'Aggregate only if official', 'Source-gated', 'Risk models require method and source boundary.', 'Do not create fake risk scores.'],
];

const PUBLISH_ROWS = [
  ['Official procurement pathway', 'Defence / official procurement sources', 'Shows whether the pathway is real and current.', 'Source-gated', 'Publish official pathway and update cadence.'],
  ['Contract status', 'Defence / procurement agency', 'Separates discussion from awarded commitments.', 'Unavailable', 'Publish award/status row if public.'],
  ['Delivery timeline', 'Defence / supplier if officially released', 'Shows delivery accountability.', 'Source-gated', 'Publish dated milestones and scope.'],
  ['Australian industry content', 'Defence / industry portfolio / prime contractor if official', 'Shows local work, sustainment and workforce implications.', 'Source-gated', 'Publish local-content fields only from official sources.'],
  ['Sustainment plan summary', 'Defence', 'Shows long-term capability support without live operational detail.', 'Source-gated', 'Publish safe public sustainment summary.'],
  ['Public cost/value range', 'Defence / budget papers / procurement notices', 'Shows fiscal scale and accountability.', 'Source-gated', 'Publish official value and scope.'],
  ['Shipbuilding workforce readiness', 'Defence / Jobs and Skills / industry', 'Shows whether workforce is a delivery constraint.', 'Source-gated', 'Publish safe workforce indicators.'],
  ['Infrastructure dependency', 'Defence / infrastructure agencies', 'Shows dockyard, port and sustainment needs.', 'Source-gated', 'Publish non-sensitive aggregate dependency rows.'],
  ['Logistics/fuel public aggregate', 'Defence / fuel policy agencies', 'Connects procurement to national fuel resilience only where safe.', 'Source-gated', 'Publish aggregate public indicator if appropriate.'],
  ['Procurement update cadence', 'Defence / procurement agency', 'Prevents stale procurement claims.', 'Source-gated', 'Publish update cadence and latest status.'],
];

function fields(env) {
  return env?.extra?.fields || {};
}

function trustKind(label) {
  const text = String(label || '').toLowerCase();
  if (text.includes('unavailable')) return 'unavailable';
  if (text.includes('partial')) return 'partial';
  if (text.includes('manual')) return 'manual';
  if (text.includes('stale')) return 'stale';
  if (text.includes('roadmap')) return 'roadmap';
  if (text.includes('source')) return 'source-gated';
  return 'observed';
}

function GateStatus({ env, fallback = 'Source-gated' }) {
  if (env?.status === 'ok') {
    return (
      <div className="trust-badges">
        <EnvTrustBadges env={env} partial/>
      </div>
    );
  }
  return (
    <div className="trust-badges">
      <TrustBadge kind={trustKind(fallback)}>{fallback}</TrustBadge>
    </div>
  );
}

function SourceAnchor({ href, children }) {
  if (!href) return <span className="unavail">Source-gated</span>;
  return (
    <a href={href}>
      {children || href.replace(/^https?:\/\//, '')} <Icon name="external" size={12}/>
    </a>
  );
}

function SourceCard({ id, env, partial = false }) {
  const meta = env?._meta || {};
  const ok = env?.status === 'ok';
  return (
    <article className="source-card">
      <div className="card-status-row">
        <h4>{env?.source_name || meta.human_name || id}</h4>
        <EnvTrustBadges env={env} partial={partial}/>
      </div>
      <p className="body-sm">
        {ok
          ? `Loaded envelope. Latest data point ${env.last_data_point || 'not applicable'}.`
          : env?.notes || 'Source gate intentionally unavailable until a public, source-safe field exists.'}
      </p>
      <p className="caption"><b>Envelope:</b> <span className="mono">{id}</span></p>
      {meta.rights && <p className="caption"><b>Rights:</b> {meta.rights}</p>}
      {meta.citation && <p className="caption"><b>Citation:</b> {meta.citation}</p>}
      {env?.source_url && <SourceAnchor href={env.source_url}/>}
    </article>
  );
}

function ProcurementStatusLegend() {
  return (
    <section className="section" aria-labelledby="defence-procurement-status-legend-h">
      <div className="section__head">
        <div>
          <span className="eyebrow">Status legend</span>
          <h2 id="defence-procurement-status-legend-h">Status labels used on this defence-procurement page</h2>
          <p className="section__lede">
            These labels match the Missing Data Scoreboard, Strategic Resources, Manufacturing,
            Infrastructure and National Fuel Security. They define evidence status before
            procurement, delivery, contract or capability interpretation.
          </p>
        </div>
      </div>
      <div className="confidence-legend" aria-label="Defence-procurement status legend">
        <span className="confidence-legend__label">Legend</span>
        <dl>
          {PROCUREMENT_STATUS_LEGEND.map(([kind, label, copy]) => (
            <React.Fragment key={kind}>
              <dt><TrustBadge kind={kind}>{label}</TrustBadge></dt>
              <dd>{copy}</dd>
            </React.Fragment>
          ))}
        </dl>
      </div>
    </section>
  );
}

function ProcurementAuditSummary() {
  const cards = [
    {
      title: 'Publicly visible procurement signals',
      eyebrow: 'Source-backed indicator',
      copy: 'Loaded envelopes record public procurement source gates and related industrial, resource and capability-context sources where the repo has source-backed material.',
      href: '#pathway-h',
    },
    {
      title: 'Partial and manual delivery feeds',
      eyebrow: 'Partial feed / manual snapshot',
      copy: 'Some rows describe official context or public source gates, but they are not contract awards, delivery schedules, supplier commitments, vessel counts or industry-content values.',
      href: '#contract-h',
    },
    {
      title: 'Source-gated contract or project feeds',
      eyebrow: 'Requires publisher verification',
      copy: 'Contract value, supplier, class, delivery timeline, sustainment, local content, logistics/fuel implications and operational capability remain source-gated unless official public rows are loaded.',
      href: '#sources',
    },
    {
      title: 'Highest-priority procurement visibility gaps',
      eyebrow: 'Editorial/product triage only',
      copy: 'The most useful next feeds would separate official pathway, contract status, delivery timeline, industry content, sustainment, safe logistics aggregates and update cadence.',
      href: '../missing-data-scoreboard/index.html',
    },
  ];

  return (
    <section className="section" aria-labelledby="defence-procurement-summary-h">
      <div className="section__head">
        <div>
          <span className="eyebrow">30-second defence-procurement summary</span>
          <h2 id="defence-procurement-summary-h">What the defence-procurement audit can and cannot show</h2>
          <p className="section__lede">
            These cards use categorical summaries rather than invented counts. They explain what is
            verifiable, what is partial, and what readers should not infer about projects,
            contracts, delivery, capability or classified matters.
          </p>
        </div>
      </div>
      <div className="quick-link-grid quick-link-grid--4">
        {cards.map(card => (
          <article className="quick-link-card" key={card.title}>
            <span className="eyebrow">{card.eyebrow}</span>
            <h3>{card.title}</h3>
            <p>{card.copy}</p>
            <a href={card.href}>Jump to evidence</a>
            <span className="audit-stamp">Last reviewed: metadata pending</span>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProcurementEvidenceBoundary() {
  return (
    <section className="section section--why" aria-labelledby="defence-procurement-evidence-boundary-h">
      <div className="section__head">
        <div>
          <span className="eyebrow">Evidence boundary</span>
          <h2 id="defence-procurement-evidence-boundary-h">What readers should not assume from missing or partial procurement data</h2>
          <p className="section__lede">
            Read these statements before interpreting procurement pathways, delivery status,
            industry content, logistics implications or capability-related gaps.
          </p>
        </div>
      </div>
      <div className="source-grid">
        {PROCUREMENT_EVIDENCE_BOUNDARY.map(item => (
          <article className="source-card" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProcurementRelatedSurfaces() {
  const links = [
    ['Missing Data Scoreboard', 'Open the national audit of public-data gaps, likely publishers and next source actions.', '../missing-data-scoreboard/index.html', 'Open Missing Data Scoreboard'],
    ['Defence Posture', 'Public posture, alliance and selected capability context kept separate from procurement claims.', '../defence-alliances-dashboard/index.html', 'Open Defence Posture'],
    ['Strategic Resources', 'Resource and processing context that should not be converted into unsupported procurement dependency claims.', '../strategic-resources-dashboard/index.html', 'Open Strategic Resources'],
    ['Manufacturing', 'Industrial-capacity signals relevant to shipbuilding, sustainment and supply-chain questions.', '../manufacturing-dashboard/index.html', 'Open Manufacturing'],
    ['Infrastructure', 'Project-delivery and logistics signals that shape sustainment and delivery visibility.', '../infrastructure-dashboard/index.html', 'Open Infrastructure'],
    ['National Fuel Security', 'Fuel and logistics visibility that matters only where official public sources support the link.', '../fuel-security-dashboard/index.html', 'Open National Fuel Security'],
  ];

  return (
    <section className="section" aria-labelledby="defence-procurement-related-h">
      <div className="section__head">
        <div>
          <span className="eyebrow">Audit navigation</span>
          <h2 id="defence-procurement-related-h">Open related public-data surfaces</h2>
          <p className="section__lede">
            Defence procurement connects to posture, strategic resources, manufacturing,
            infrastructure, fuel and logistics. These links keep procurement visibility
            separate from unsupported capability or classified inference.
          </p>
        </div>
      </div>
      <div className="quick-link-grid quick-link-grid--3">
        {links.map(([title, copy, href, label]) => (
          <article className="quick-link-card" key={title}>
            <h3>{title}</h3>
            <p>{copy}</p>
            <a href={href}>{label}</a>
          </article>
        ))}
      </div>
    </section>
  );
}

function QuickGuide() {
  return (
    <section className="section section--why" aria-labelledby="guide-h">
      <div className="section__head">
        <div>
          <span className="eyebrow">Use this page in order</span>
          <h2 id="guide-h">Procurement evidence before procurement claims</h2>
          <p className="section__lede">
            This page separates public procurement evidence from source-gated contract,
            delivery, industry and logistics questions.
          </p>
        </div>
      </div>
      <div className="quick-link-grid quick-link-grid--3">
        {QUICK_GUIDE.map(([step, title, copy]) => (
          <article className="quick-link-card" key={title}>
            <span className="eyebrow">{step}</span>
            <h3>{title}</h3>
            <p>{copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProcurementTable({ rows, data }) {
  return (
    <div className="data-table-wrap">
      <table className="data-table data-table--plain">
        <thead>
          <tr>
            <th>Procurement row</th>
            <th>Current status</th>
            <th>What is verified</th>
            <th>What is not published</th>
            <th>Next source action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([name, sourceId, verified, unpublished, action]) => (
            <tr key={name}>
              <td>{name}</td>
              <td><GateStatus env={data[sourceId]} fallback="Source-gated"/></td>
              <td>{verified}</td>
              <td>{unpublished}</td>
              <td>{action}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ContractTable({ rows, data }) {
  return (
    <div className="data-table-wrap">
      <table className="data-table data-table--plain">
        <thead>
          <tr>
            <th>Contract field</th>
            <th>Status</th>
            <th>Publication state</th>
            <th>Boundary</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([field, sourceId, status, state, boundary]) => (
            <tr key={field}>
              <td>{field}</td>
              <td><GateStatus env={data[sourceId]} fallback={status}/></td>
              <td>{state}</td>
              <td>{boundary}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PlainTable({ columns, rows }) {
  return (
    <div className="data-table-wrap">
      <table className="data-table data-table--plain">
        <thead>
          <tr>{columns.map(col => <th key={col}>{col}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              {row.map((cell, cellIdx) => (
                <td key={`${idx}-${cellIdx}`}>
                  {cellIdx === 1 && ['verified', 'partial', 'stale', 'manual', 'unavailable', 'source-gated', 'roadmap'].includes(String(cell).toLowerCase())
                    ? <TrustBadge kind={trustKind(cell)}>{cell}</TrustBadge>
                    : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RelationshipSection() {
  return (
    <section className="section section--why" aria-labelledby="relationship-h">
      <div className="why-grid">
        <div>
          <span className="eyebrow">Connected dashboards</span>
          <h2 id="relationship-h" style={{ marginTop: 8 }}>How this connects to the national dashboard</h2>
        </div>
        <div className="why-body">
          <p>
            Defence Procurement Watch tracks public procurement and delivery accountability.
            Defence Posture tracks broader strategic posture. Strategic Resources tracks
            material and resource dependencies. Manufacturing and Infrastructure track
            industrial and delivery context. Fuel Strategy and National Fuel Security track
            energy and fuel resilience.
          </p>
          <div className="hero-actions" style={{ marginTop: 16 }}>
            <a className="hero-button" href="../defence-alliances-dashboard/index.html">Open Defence Posture</a>
            <a className="hero-button" href="../strategic-resources-dashboard/index.html">Open Strategic Resources</a>
            <a className="hero-button" href="../manufacturing-dashboard/index.html">Open Manufacturing</a>
            <a className="hero-button" href="../infrastructure-dashboard/index.html">Open Infrastructure</a>
            <a className="hero-button" href="../australian-fuel-strategy-dashboard/index.html">Open Fuel Strategy</a>
            <a className="hero-button" href="../fuel-security-dashboard/index.html">Open National Fuel Security</a>
            <a className="hero-button" href="../missing-data-scoreboard/index.html">Open Missing Data Scoreboard</a>
          </div>
        </div>
      </div>
    </section>
  );
}

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
        <Header active="defence_procurement" refreshStatus={refreshStatus}/>
        <main id="main"><div className="loading-wrap">Loading source envelopes...</div></main>
      </div>
    );
  }

  const latestRetrieved = window.FR.latestVerifiedRetrieved(data);
  const updatedDisplay = window.FR.fmtVerifiedUpdated(latestRetrieved);
  const latestDataPoint = window.FR.latestPageDataPoint(data);
  const industry = fields(data.defence_sovereign_industry_context);

  return (
    <div className="page">
      <Header active="defence_procurement" refreshStatus={refreshStatus} updated={latestRetrieved ? updatedDisplay : ''}/>

      <main id="main">
        <section className="intro" id="defence-procurement-watch">
          <div>
            <span className="eyebrow">Defence procurement public-data audit prototype</span>
            <h1 style={{ marginTop: 12 }}>What Australia's public defence-procurement data can verify - and what remains source-gated</h1>
            <p className="intro__lede">
              This dashboard separates source-backed procurement signals from partial,
              manual and source-gated feeds so readers can see public delivery visibility
              without invented project, contract or capability claims.
            </p>
            <p className="body-sm" style={{ marginTop: 16, color: 'var(--ink-2)' }}>
              This page is an independent public-source prototype. It does not infer
              contracts, prices, suppliers, delivery dates, vessel class, capability,
              fleet readiness, fuel requirements or operational posture unless a named
              official/public source provides the exact field, period, unit and reuse boundary.
            </p>
          </div>
          <aside className="intro__meta" aria-label="Publication details">
            <strong>Page data retrieved</strong>
            <span className="mono">{updatedDisplay}</span>
            <div style={{ height: 12 }}/>
            <strong>Latest source data point</strong>
            <span>{latestDataPoint || 'No source-backed procurement data point loaded'}</span>
            <div style={{ height: 12 }}/>
            <strong>Last reviewed</strong>
            <span>metadata pending</span>
            <div style={{ height: 12 }}/>
            <strong>Boundary</strong>
            <span>Independent public-source prototype. No project, contract, capability or classified inference is invented.</span>
          </aside>
        </section>

        <ProcurementStatusLegend/>
        <ProcurementAuditSummary/>
        <ProcurementEvidenceBoundary/>
        <ProcurementRelatedSurfaces/>

        <DataCoverage data={data} refreshStatus={refreshStatus}/>

        <QuickGuide/>

        <section className="section" aria-labelledby="pathway-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Procurement pathway</span>
              <h2 id="pathway-h">Procurement pathway</h2>
              <p className="section__lede">
                The dashboard records this as a source-gated procurement pathway until
                official Defence or public procurement sources verify the program,
                supplier pathway, contract status and delivery timeline.
              </p>
            </div>
          </div>
          <ProcurementTable rows={PROCUREMENT_ROWS} data={data}/>
        </section>

        <section className="section section--why" aria-labelledby="contract-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Contract evidence</span>
              <h2 id="contract-h">Contract and delivery status</h2>
              <p className="section__lede">
                Media discussion, political commentary or broad procurement interest is not
                treated as a contract row. A contract row requires official source material.
              </p>
            </div>
          </div>
          <ContractTable rows={CONTRACT_ROWS} data={data}/>
        </section>

        <section className="section" aria-labelledby="industry-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Industry content</span>
              <h2 id="industry-h">Industry content and manufacturing dependency</h2>
              <p className="section__lede">
                Defence industrial priority context is useful, but it is not the same as
                a project-specific shipbuilding, sustainment or local-content commitment.
              </p>
            </div>
          </div>
          <div className="metric-grid metric-grid--3">
            <MetricCard
              eyebrow="Public context"
              label="Sovereign industrial priorities"
              value={industry.sdip_count ? `${industry.sdip_count}` : 'Partial'}
              plain="Official industrial-priority context is loaded, but project-specific procurement local content is source-gated."
              source={window.FR.sourceLine(data.defence_sovereign_industry_context)}
            />
            <MetricCard
              eyebrow="Boundary"
              label="Procurement-specific local content"
              value="Source-gated"
              plain="No supplier, workshare, sustainment or workforce commitment is asserted."
              source={window.FR.sourceLine(data.defence_shipbuilding_industry_content_gate)}
            />
            <MetricCard
              eyebrow="Dependencies"
              label="Resources and infrastructure"
              value="Context only"
              plain="Strategic-resource and infrastructure pages are linked for dependency questions, not procurement conclusions."
              source={window.FR.sourceLine(data.strategic_resources_critical_minerals_context)}
            />
          </div>
          <div style={{ height: 24 }}/>
          <PlainTable
            columns={['Dependency', 'Source / status', 'Why it matters', 'Current blocker', 'Linked dashboard page']}
            rows={INDUSTRY_ROWS}
          />
        </section>

        <section className="section section--why" aria-labelledby="logistics-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Logistics boundary</span>
              <h2 id="logistics-h">Naval logistics and fuel implication</h2>
              <p className="section__lede">
                Procurement discussion is not itself a fuel/logistics metric. This page only
                links procurement to fuel security where official sources provide a clear public basis.
              </p>
            </div>
          </div>
          <PlainTable
            columns={['Logistics question', 'Status', 'Current publication state', 'Boundary']}
            rows={LOGISTICS_ROWS}
          />
        </section>

        <section className="section" aria-labelledby="dependency-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Strategic dependencies</span>
              <h2 id="dependency-h">Defence posture and strategic-resource dependency</h2>
              <p className="section__lede">
                Dependencies are shown as questions and links to existing dashboards. No classified
                posture, readiness or supplier dependency is asserted.
              </p>
            </div>
          </div>
          <PlainTable
            columns={['Dependency row', 'Source / status', 'What the public source supports', 'Linked page', 'Boundary']}
            rows={DEPENDENCY_ROWS}
          />
        </section>

        <section className="section section--why" aria-labelledby="boundary-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Public/private boundary</span>
              <h2 id="boundary-h">Public/private defence data boundary</h2>
              <p className="section__lede">
                Some procurement facts should be public, while some operational facts may be
                sensitive. The dashboard asks for safe public aggregate indicators, not sensitive
                operational detail.
              </p>
            </div>
          </div>
          <PlainTable
            columns={['Defence data row', 'Safe public aggregate possible?', 'Current publication status', 'Sensitivity note', 'Next action']}
            rows={BOUNDARY_ROWS}
          />
        </section>

        <section className="section" aria-labelledby="publish-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Missing public feeds</span>
              <h2 id="publish-h">What government still needs to publish</h2>
              <p className="section__lede">
                These rows are source requests. They do not imply the data exists publicly
                or should include sensitive operational detail.
              </p>
            </div>
          </div>
          <PlainTable
            columns={['Missing feed', 'Likely publisher', 'Why it matters', 'Current status', 'Next source action']}
            rows={PUBLISH_ROWS}
          />
        </section>

        <RelationshipSection/>

        <section className="section section--sources" id="sources" aria-labelledby="sources-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Sources and methodology</span>
              <h2 id="sources-h">Every envelope used on this page</h2>
              <p className="section__lede">
                This page deliberately loads source gates for procurement facts that are not
                yet verified. It adds no contract, supplier, delivery, vessel class, value,
                industry-content or fuel/logistics values, and it makes no classified inference.
              </p>
            </div>
          </div>
          <div className="sources-grid">
            {Object.entries(data).map(([id, env]) => (
              <SourceCard
                key={id}
                id={id}
                env={env}
                partial={[
                  'defence_sovereign_industry_context',
                  'defence_public_capability_assets',
                  'strategic_resources_critical_minerals_context',
                ].includes(id)}
              />
            ))}
          </div>
          <div className="methodology">
            <h3>No-estimate rule</h3>
            <p>
              No procurement fact is filled from media discussion, political commentary,
              inferred strategy, platform speculation or operational assumptions. A value
              stays unavailable or source-gated until a named official/public source provides
              the exact field, period, unit and reuse boundary.
            </p>
          </div>
        </section>
      </main>

      <Footer refreshStatus={refreshStatus} updated={latestRetrieved ? updatedDisplay : ''}/>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
