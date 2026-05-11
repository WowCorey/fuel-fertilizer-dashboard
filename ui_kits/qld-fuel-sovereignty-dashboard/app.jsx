const SERIES = [
  'qld_fuel_hub_six_ports_official_list',
  'qld_fuel_hub_state_owned_land',
  'qld_fuel_security_eoi_portal',
  'qld_fuel_security_private_proposals',
  'qld_fuel_security_bid_status',
  'qld_refining_capacity_source_gate',
  'qld_refinery_option_status',
  'qld_domestic_fuel_production_pathway',
  'qld_taroom_trough_source_gate',
  'qld_drilling_approvals_pathway',
];

const QUICK_GUIDE = [
  ['1', 'Six-port pathway', 'Start with the public AFIP hub list and the boundary around what it does not prove.'],
  ['2', 'AFIP / EOI status', 'Separate the public program and form from unpublished bids, proponents and awards.'],
  ['3', 'State-owned land and industrial hubs', 'Treat the land audit as context until parcel-level or aggregate site-readiness rows are published.'],
  ['4', 'Storage and refining pathway', 'Keep policy pathway context separate from capacity, FID, build or operating claims.'],
  ['5', 'Taroom Trough and approvals', 'Use official naming and pathway context only; do not infer production, volumes or approval completion.'],
  ['6', 'Delivery blockers and missing feeds', 'Use the gaps as source requests for Queensland, ports, proponents and industry.'],
];

const AFIP_ROWS = [
  ['AFIP program page', 'qld_fuel_hub_six_ports_official_list', 'Six-port AFIP context and program scope are public.', 'Capacity, project status, land parcels and approvals are not published.', 'Queensland Government / Coordinator-General', 'Keep monitoring the official AFIP page for delivery tables.'],
  ['Stage 1 EOI portal/form', 'qld_fuel_security_eoi_portal', 'Public EOI pathway and proposal scope are visible.', 'Submission count, proponents, categories and shortlist are not published.', 'Queensland Government / Coordinator-General', 'Publish EOI status table with date, stage and proposal category.'],
  ['Submission counts', 'qld_fuel_security_private_proposals', 'No reusable public count is loaded.', 'Number of submissions and market-response depth remain unavailable.', 'Queensland Government', 'Publish aggregate submission count if source-safe.'],
  ['Proponent names', 'qld_fuel_security_private_proposals', 'No proponent row is loaded.', 'Company names, locations and proposals remain government-held or unpublished.', 'Queensland Government / proponents', 'Publish proponents only if official and commercially safe.'],
  ['Proposal categories', 'qld_fuel_security_private_proposals', 'No category table is loaded.', 'Storage/refining/import/fuel-security categories are not public as reusable data.', 'Queensland Government / proponents', 'Publish safe aggregate categories before dashboard display.'],
  ['Shortlist status', 'qld_fuel_security_bid_status', 'No shortlist row is loaded.', 'Assessment stage and shortlist status remain unavailable.', 'Queensland Government', 'Publish stage/status fields with update dates.'],
  ['Contract / award status', 'qld_fuel_security_bid_status', 'No contract or award row is loaded.', 'Awards, contract values, counterparties and delivery terms remain unavailable.', 'Queensland Government / proponents', 'Publish contract status only if official and safe.'],
  ['Public delivery timetable', 'qld_fuel_security_bid_status', 'No reusable timetable is loaded.', 'Milestones and expected decisions remain source-gated.', 'Queensland Government', 'Publish milestone dates, cadence and source rights.'],
];

const LAND_ROWS = [
  ['State-owned land audit', 'qld_fuel_hub_state_owned_land', 'Public statement says a statewide audit is underway.', 'No parcel-level table is loaded.', 'Partial / contextual', 'Publish audit output with site, date, owner and readiness fields.'],
  ['Industrial land availability', 'qld_fuel_hub_state_owned_land', 'No reusable availability table is loaded.', 'Available hectares, ownership and tenure remain source-gated.', 'Source-gated', 'Publish aggregate or parcel-safe availability rows.'],
  ['Port-adjacent land', 'qld_fuel_hub_state_owned_land', 'No site-by-port land row is loaded.', 'Port-adjacent parcels and boundaries remain unavailable.', 'Source-gated', 'Publish hub-level land context without inferring from maps.'],
  ['Parcel IDs', 'qld_fuel_hub_state_owned_land', 'No parcel IDs are loaded.', 'Parcel identifiers are not inferred from maps or planning layers.', 'Unavailable', 'Publish official parcel IDs only if appropriate for public reuse.'],
  ['Hectares / area', 'qld_fuel_hub_state_owned_land', 'No area value is loaded.', 'No capacity or area denominator is source-safe.', 'Unavailable', 'Publish area units and definitions.'],
  ['Tenure / owner', 'qld_fuel_hub_state_owned_land', 'No parcel owner row is loaded.', 'Ownership is not inferred from authority names or maps.', 'Unavailable', 'Publish official owner or tenure fields.'],
  ['Permitted use', 'qld_fuel_hub_state_owned_land', 'No permitted-use table is loaded.', 'No planning approval or permitted use is asserted.', 'Source-gated', 'Publish planning-use categories if source-safe.'],
  ['Site readiness', 'qld_fuel_hub_state_owned_land', 'No readiness row is loaded.', 'Servicing, constraints and approvals remain unpublished.', 'Source-gated', 'Publish source-safe readiness status.'],
];

const STORAGE_REFINING_ROWS = [
  ['Public drill-refine-store pathway', 'qld_domestic_fuel_production_pathway', 'Official policy pathway context is loaded.', 'No delivery date, project status or capacity value is loaded.', 'Partial', 'Keep policy pathway context separate from project delivery.'],
  ['Storage capacity', 'qld_refining_capacity_source_gate', 'No site or hub storage capacity is loaded.', 'Capacity requires official unit, date, site and definition.', 'Unavailable', 'Publish safe aggregate or site-level capacity rows.'],
  ['Refinery capacity', 'qld_refining_capacity_source_gate', 'No refinery capacity denominator is loaded.', 'APS production is not a capacity or utilisation measure.', 'Unavailable', 'Load official capacity only if a source provides exact units and date.'],
  ['Proposed storage projects', 'qld_refinery_option_status', 'No proposed-project table is loaded.', 'No FID, proponent, location or build commitment is published here.', 'Source-gated', 'Publish project table with status, proponent and source date.'],
  ['Proposed refining projects', 'qld_refinery_option_status', 'No refining project row is loaded.', 'No refinery will be built claim is made.', 'Source-gated', 'Publish official project-status row before display.'],
  ['Final investment decisions', 'qld_refinery_option_status', 'No FID row is loaded.', 'FID status is not inferred from EOI or policy language.', 'Unavailable', 'Publish FID status with source date.'],
  ['Approvals', 'qld_drilling_approvals_pathway', 'Pathway context exists; approval completion does not.', 'Specific project approval status is unavailable.', 'Source-gated', 'Publish state/federal approval status by project.'],
  ['Build dates', 'qld_refinery_option_status', 'No build date is loaded.', 'No start, construction or commissioning date is inferred.', 'Unavailable', 'Publish official milestone dates.'],
  ['Operating dates', 'qld_refinery_option_status', 'No operating date is loaded.', 'No operating project status is asserted.', 'Unavailable', 'Publish commissioning/operation rows if official.'],
  ['Product type', 'qld_refinery_option_status', 'No product-specific project output is loaded.', 'Diesel/petrol/jet/crude/feedstock relevance is not inferred.', 'Source-gated', 'Publish product scope only from official project data.'],
];

const TAROOM_ROWS = [
  ['Official project/pathway name', 'qld_taroom_trough_source_gate', 'Taroom Trough official naming/context is loaded.', 'No individual project delivery status is loaded.', 'Partial', 'Keep official name; do not use unverified transcript spelling.'],
  ['Resource-development pathway', 'qld_taroom_trough_source_gate', 'Development Plan context is loaded.', 'No resource volume or commercial production status is loaded.', 'Partial', 'Publish official development milestones if available.'],
  ['EOI / market engagement', 'qld_domestic_fuel_production_pathway', 'Fuel-sovereignty pathway context is loaded.', 'No Taroom-specific EOI count or proponent row is loaded.', 'Source-gated', 'Publish market engagement table if official.'],
  ['State approvals', 'qld_drilling_approvals_pathway', 'State pathway context is loaded.', 'No approval completion row is loaded.', 'Source-gated', 'Publish project-level state approval status.'],
  ['Federal approvals', 'qld_drilling_approvals_pathway', 'Federal pathway is referenced only as context.', 'No federal approval completion row is loaded.', 'Source-gated', 'Publish EPBC or relevant federal status if official.'],
  ['Duplicated approval concern', 'qld_drilling_approvals_pathway', 'Policy concern is referenced as context.', 'No quantified duplication metric is loaded.', 'Source-gated', 'Publish a structured policy implementation update.'],
  ['Production relevance', 'qld_taroom_trough_source_gate', 'Onshore oil and gas context is loaded.', 'No production volume or date is loaded.', 'Unavailable', 'Do not infer production from resource context.'],
  ['Fuel-security relevance', 'qld_domestic_fuel_production_pathway', 'Fuel-sovereignty policy pathway context is loaded.', 'No direct fuel output or security impact is loaded.', 'Partial', 'Publish exact production, refining or storage linkage before claiming impact.'],
];

const BLOCKER_ROWS = [
  ['Data access', 'source-gated', 'Queensland Government / industry', 'Turns public debate into reusable delivery evidence.', 'Publish machine-readable AFIP delivery tables.', 'Source-gated'],
  ['State-owned land detail', 'source-gated', 'Queensland Government / port authorities', 'Shows where storage/refining could actually be delivered.', 'Publish parcel-safe land and readiness rows.', 'Source-gated'],
  ['EOI transparency', 'unavailable', 'Queensland Government', 'Shows whether private-sector interest has moved beyond a portal.', 'Publish counts, stages and safe category summaries.', 'Unavailable'],
  ['Approval duplication', 'source-gated', 'Queensland and Commonwealth approval agencies', 'Shows whether the policy blocker is being resolved.', 'Publish structured state/federal approval pathway updates.', 'Source-gated'],
  ['Project capacity', 'unavailable', 'Government / proponents / operators', 'Separates real delivery from policy language.', 'Publish storage/refining capacity with units and definitions.', 'Unavailable'],
  ['Contracts / awards', 'unavailable', 'Queensland Government / proponents', 'Shows whether proposals have become commitments.', 'Publish awards or contract status if public and safe.', 'Unavailable'],
  ['Federal policy alignment', 'source-gated', 'Commonwealth / Queensland Government', 'Connects state delivery to national fuel strategy.', 'Publish alignment status and public/private data boundary.', 'Source-gated'],
  ['Environmental approvals', 'source-gated', 'Approval agencies', 'Shows whether project pathways are blocked, pending or approved.', 'Publish project-level approval status from official registers.', 'Source-gated'],
  ['Security/public boundary', 'source-gated', 'Commonwealth / Queensland Government / industry', 'Defines what can be public without exposing sensitive fuel infrastructure.', 'Publish safe aggregate indicators and excluded detail.', 'Source-gated'],
  ['Industry willingness', 'source-gated', 'Industry / Queensland Government', 'Shows whether market interest is real and current.', 'Publish safe aggregate EOI category/status rows.', 'Source-gated'],
];

const PUBLISH_ROWS = [
  ['Public AFIP delivery table', 'Queensland Government / Coordinator-General', 'Turns the pathway into accountable project tracking.', 'Source-gated', 'Publish hub, stage, source date and delivery status.'],
  ['Six-port hub project status', 'Queensland Government / port authorities', 'Separates official hub names from actual projects.', 'Partial', 'Publish per-hub status rows.'],
  ['State-owned land parcels or aggregate site-readiness table', 'Queensland Government / port authorities', 'Shows where storage/refining can physically happen.', 'Source-gated', 'Publish parcel-safe fields or aggregate readiness by hub.'],
  ['Storage/refining capacity by hub', 'Queensland Government / proponents / operators', 'Shows delivery scale and product relevance.', 'Unavailable', 'Publish capacity, unit, date, site and definition.'],
  ['EOI submission count and category', 'Queensland Government', 'Shows market response without needing commercial detail.', 'Unavailable', 'Publish aggregate count and safe categories.'],
  ['Shortlisted proponents, if public', 'Queensland Government', 'Shows who is moving through delivery process.', 'Unavailable', 'Publish only if official and commercially safe.'],
  ['Award/contract status, if public', 'Queensland Government / proponents', 'Shows whether commitments exist.', 'Unavailable', 'Publish stage, award status and date.'],
  ['Approval status and duplicated-approval resolution', 'Queensland and Commonwealth agencies', 'Shows whether approval blockers are current or resolved.', 'Source-gated', 'Publish structured approvals update.'],
  ['Taroom Trough approval pathway update', 'Queensland Government / approval agencies', 'Shows pathway status without inferring production.', 'Partial', 'Publish official approval and milestone fields.'],
  ['Safe public dashboard boundary', 'Queensland Government / Commonwealth / industry', 'Protects sensitive details while enabling public accountability.', 'Source-gated', 'Publish what can be safely aggregated.'],
];

function fields(env) {
  return env?.extra?.fields || {};
}

function freshnessKind(env, fallback = 'source-gated') {
  if (!env || env.status !== 'ok') return fallback;
  const f = window.FR.freshness(env);
  if (f.state === 'stale') return 'stale';
  if (env.manual_entry) return 'manual';
  return 'observed';
}

function statusLabel(env, fallback = 'Source-gated') {
  if (!env || env.status !== 'ok') return fallback;
  const f = window.FR.freshness(env);
  if (f.state === 'stale') return 'Stale';
  if (env.manual_entry) return 'Manual public source';
  return f.label;
}

function GateStatus({ env, kind = null, label = null, partial = false }) {
  if (env && env.status === 'ok') {
    return (
      <div className="trust-badges">
        <EnvTrustBadges env={env} partial={partial}/>
      </div>
    );
  }
  return (
    <div className="trust-badges">
      <TrustBadge kind={kind || 'source-gated'}>{label || (kind === 'unavailable' ? 'Unavailable' : 'Source-gated')}</TrustBadge>
    </div>
  );
}

function SourceLink({ env }) {
  if (!env?.source_url) return <span className="unavail">Source-gated</span>;
  return <a href={env.source_url}>{env.source_name || env.source_id} <Icon name="external" size={12}/></a>;
}

function SourceCard({ id, env, partial = false }) {
  const f = window.FR.freshness(env);
  return (
    <article className="source-card">
      <div className="card-status-row">
        <h4>{env?.source_name || id}</h4>
        <EnvTrustBadges env={env} partial={partial}/>
      </div>
      <p className="body-sm">
        {env?.status === 'ok'
          ? `Loaded envelope. Latest data point ${env.last_data_point || 'not applicable'}; status ${f.label.toLowerCase()}.`
          : env?.notes || 'No source-safe envelope is loaded.'}
      </p>
      <p className="caption"><b>Envelope:</b> <span className="mono">{id}</span></p>
      {env?.source_url && <a href={env.source_url}>{env.source_url.replace(/^https?:\/\//,'')} <Icon name="external" size={12}/></a>}
    </article>
  );
}

function DeliveryTable({ columns, rows, data }) {
  return (
    <div className="data-table-wrap">
      <table className="data-table data-table--plain">
        <thead>
          <tr>{columns.map(col => <th key={col}>{col}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map(row => {
            const [name, sourceId, ...cells] = row;
            const env = sourceId ? data[sourceId] : null;
            return (
              <tr key={name}>
                <td>{name}</td>
                <td><GateStatus env={env} partial={env?.status === 'ok'}/></td>
                {cells.map((cell, idx) => <td key={`${name}-${idx}`}>{cell}</td>)}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function SimpleStatusTable({ columns, rows }) {
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
                  {cellIdx === 1 && ['observed', 'verified', 'partial', 'stale', 'manual', 'derived', 'unavailable', 'source-gated', 'roadmap'].includes(String(cell).toLowerCase())
                    ? <TrustBadge kind={cell}/>
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

function SixPortDeliveryPathway({ data }) {
  const portsEnv = data.qld_fuel_hub_six_ports_official_list;
  const portFields = fields(portsEnv);
  const ports = portFields.ports || [];
  const relevance = portFields.storage_refining_relevance || 'Official AFIP storage/refining pathway context only.';

  return (
    <section className="section" aria-labelledby="six-port-h">
      <div className="section__head">
        <div>
          <span className="eyebrow">AFIP hubs</span>
          <h2 id="six-port-h">Six-port delivery pathway</h2>
          <p className="section__lede">
            The six-port list is public context. It is not itself a project-status,
            capacity, land-parcel or approval dataset.
          </p>
        </div>
      </div>
      <div className="data-table-wrap">
        <table className="data-table data-table--plain">
          <thead>
            <tr>
              <th>Hub / port name</th>
              <th>Official-list status</th>
              <th>Storage/refining relevance</th>
              <th>Public delivery status</th>
              <th>Capacity visibility</th>
              <th>Land parcel visibility</th>
              <th>Approval visibility</th>
              <th>Next source action</th>
            </tr>
          </thead>
          <tbody>
            {(ports.length ? ports : ['Awaiting official source confirmation']).map(port => (
              <tr key={port}>
                <td>{port}</td>
                <td><GateStatus env={portsEnv} partial/></td>
                <td>{relevance}</td>
                <td>Public context only; no project status loaded.</td>
                <td><TrustBadge kind="unavailable">Unavailable</TrustBadge></td>
                <td><TrustBadge kind="source-gated">Source-gated</TrustBadge></td>
                <td><TrustBadge kind="source-gated">Source-gated</TrustBadge></td>
                <td>Publish hub-level delivery table with status, capacity, land and approvals.</td>
              </tr>
            ))}
          </tbody>
        </table>
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
          <h2 id="guide-h">Delivery evidence before delivery claims</h2>
          <p className="section__lede">
            The tracker is built for accountability: what is public, what is only context,
            and what Queensland or industry would need to publish before a row becomes operational evidence.
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

function RelationshipSection() {
  return (
    <section className="section section--why" aria-labelledby="relationship-h">
      <div className="why-grid">
        <div>
          <span className="eyebrow">Policy and operations</span>
          <h2 id="relationship-h">How this connects to national fuel strategy</h2>
        </div>
        <div className="why-body">
          <p>
            Australian Fuel Strategy Tracker covers national policy, MSO, reserves,
            days-cover and emergency response boundaries. Queensland Fuel Sovereignty
            Tracker covers the state delivery pathway: ports, land, EOI, storage/refining
            opportunities and approvals. National Fuel Security covers public operational
            signals and missing live feeds.
          </p>
          <div className="hero-actions" style={{ marginTop: 16 }}>
            <a className="hero-button" href="../australian-fuel-strategy-dashboard/index.html">Open Australian Fuel Strategy Tracker</a>
            <a className="hero-button" href="../fuel-security-dashboard/index.html">Open National Fuel Security</a>
            <a className="hero-button" href="../missing-data-scoreboard/index.html">Open Missing Data Scoreboard</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function OperationalSummary30s({ data }) {
  const cov = window.FR.coverage(data);
  return (
    <section className="section" aria-labelledby="ops-30s-h">
      <div className="section__head">
        <div>
          <span className="eyebrow">30-second regional delivery summary</span>
          <h2 id="ops-30s-h">What this tracker can verify in 30 seconds</h2>
          <p className="section__lede">
            Counts come from the page&rsquo;s loaded source envelopes via window.FR.coverage(). They
            describe what the tracker is currently wired to read. They are not invented totals,
            risk ratings or official classifications.
          </p>
        </div>
      </div>
      <div className="quick-link-grid quick-link-grid--4">
        <article className="quick-link-card">
          <span className="eyebrow">Publicly visible delivery signals</span>
          <span className="ops-30s__count">{cov.verified + cov.derived}</span>
          <p>
            Source-backed envelopes currently fresh enough for their cadence: the official six-port
            AFIP list, the public EOI portal/form, the Taroom Trough naming/context and the
            domestic-fuel pathway context.
          </p>
          <a href="#six-port-h">Jump to six-port pathway</a>
          <span className="audit-stamp">Last reviewed: metadata pending</span>
        </article>
        <article className="quick-link-card">
          <span className="eyebrow">Partial / manual feeds</span>
          <span className="ops-30s__count">{cov.manual + cov.stale}</span>
          <p>
            Public statements and hand-keyed snapshots: the state-owned land audit statement, the
            public approvals pathway context and the AFIP program scope. These are partial public
            signals, not parcel-level or project-level coverage.
          </p>
          <a href="#land-h">Jump to land and hubs</a>
          <span className="audit-stamp">Last reviewed: metadata pending</span>
        </article>
        <article className="quick-link-card">
          <span className="eyebrow">Source-gated project feeds</span>
          <span className="ops-30s__count">{cov.awaiting}</span>
          <p>
            Project-level fields that need an official source, exact field, period, unit and reuse
            rights: refining/storage capacity, proposed projects, FIDs, bid status, contract awards
            and approval completion rows.
          </p>
          <a href="#storage-h">Jump to project pathway</a>
          <span className="audit-stamp">Last reviewed: metadata pending</span>
        </article>
        <article className="quick-link-card">
          <span className="eyebrow">Highest-priority visibility gaps</span>
          <span className="ops-30s__count">{BLOCKER_ROWS.length}</span>
          <p>
            Categorical delivery blockers tracked editorially: data access, state-owned land detail,
            EOI transparency, approval duplication, project capacity, contracts/awards and
            federal/state policy alignment.
          </p>
          <a href="#blockers-h">Jump to delivery blockers</a>
          <span className="audit-stamp">Last reviewed: metadata pending</span>
        </article>
      </div>
    </section>
  );
}

const QLD_STATUS_LEGEND = [
  ['observed', 'Verified', 'Source-backed and current enough for its cadence.'],
  ['partial', 'Partial', 'Source-backed, but incomplete by geography, product, timing or concept.'],
  ['stale', 'Stale', 'Source-backed, but outside its expected cadence window.'],
  ['manual', 'Manual', 'Hand-keyed from a named public source.'],
  ['derived', 'Derived', 'Calculated or selected from a named source envelope.'],
  ['unavailable', 'Unavailable', 'No public source-safe feed is loaded.'],
  ['source-gated', 'Source-gated', 'Waiting for a verified source, field, period, unit and reuse rights.'],
  ['roadmap', 'Roadmap', 'Planned dashboard area, not yet populated.'],
];

function StatusLegendAtGlance() {
  return (
    <section className="section section--why" aria-labelledby="legend-h">
      <div className="section__head">
        <div>
          <span className="eyebrow">Status legend</span>
          <h2 id="legend-h">Status labels used on this page</h2>
          <p className="section__lede">
            The same vocabulary is used across the Missing Data Scoreboard, the National Fuel
            Security dashboard and this tracker. Status labels are categorical, not numeric scores.
          </p>
        </div>
      </div>
      <div className="source-grid">
        {QLD_STATUS_LEGEND.map(([kind, label, copy]) => (
          <article className="source-card" key={kind}>
            <TrustBadge kind={kind}>{label}</TrustBadge>
            <h3>{label}</h3>
            <p>{copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

const QLD_EVIDENCE_BOUNDARY = [
  {
    title: 'Unavailable does not mean zero',
    copy: 'Unavailable means no public source-safe feed has been loaded yet. It is not a statement that storage, refining capacity, EOI activity, proponents, contracts, land parcels or approvals are zero, low or negligible.',
  },
  {
    title: 'Source-gated is a publishing boundary',
    copy: 'Source-gated means a verified source, exact field, period, unit and reuse-rights pathway has not been loaded. The tracker does not estimate the value while the gate is open.',
  },
  {
    title: 'No estimates fill missing delivery milestones',
    copy: 'The tracker does not invent delivery milestones, government commitments, EOI status, state-owned land audit results, Taroom Trough details or reserve/storage/refinery/pipeline metrics. Missing data stays visible until a named public source supports it.',
  },
  {
    title: 'Priority bands are editorial triage',
    copy: 'Where the audit calls a gap immediate, high or medium priority, that is editorial/product triage only, not an official risk rating or government assessment.',
  },
  {
    title: 'A visibility gap is not proof of misconduct',
    copy: 'A missing public feed is a public visibility gap, not evidence of wrongdoing. Some data may be sensitive, in roll-out or simply not yet published in a machine-readable form.',
  },
  {
    title: 'Holder fields are likely sources, not custody',
    copy: 'Likely holder/publisher entries name the agencies most plausibly responsible for the data based on existing public mandates. They are starting points for verification, not assertions of custody.',
  },
];

function EvidenceBoundary() {
  return (
    <section className="section section--why" aria-labelledby="evidence-boundary-h">
      <div className="section__head">
        <div>
          <span className="eyebrow">Evidence boundary</span>
          <h2 id="evidence-boundary-h">What this tracker does, and does not, claim</h2>
          <p className="section__lede">
            Read these statements before interpreting any row, status or priority band on this page.
            They define how the audit treats missing public Queensland fuel-sovereignty data.
          </p>
        </div>
      </div>
      <div className="source-grid">
        {QLD_EVIDENCE_BOUNDARY.map(item => (
          <article className="source-card" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function OpenRelatedSurfaces() {
  return (
    <section className="section" aria-labelledby="related-surfaces-h">
      <div className="section__head">
        <div>
          <span className="eyebrow">Where to go next</span>
          <h2 id="related-surfaces-h">Open related public-data surfaces</h2>
          <p className="section__lede">
            The audit splits regional delivery tracking from national fuel security, fuel strategy,
            the public-data scoreboard and food-system feeds. These links open the related pages.
          </p>
        </div>
      </div>
      <div className="quick-link-grid quick-link-grid--4">
        <article className="quick-link-card">
          <span className="cta-card__title">National Fuel Security</span>
          <p>Operational fuel-security audit: days cover, MSO context, aggregate import visibility and missing live feeds.</p>
          <a href="../fuel-security-dashboard/index.html">Open National Fuel Security</a>
        </article>
        <article className="quick-link-card">
          <span className="cta-card__title">Missing Data Scoreboard</span>
          <p>The flagship audit page. Names every public-data gap, the likely publisher and the next source action.</p>
          <a href="../missing-data-scoreboard/index.html">Open Missing Data Scoreboard</a>
        </article>
        <article className="quick-link-card">
          <span className="cta-card__title">Australian Fuel Strategy Tracker</span>
          <p>National policy, MSO and reserve indicators, with public/private boundary and source-gated emergency settings.</p>
          <a href="../australian-fuel-strategy-dashboard/index.html">Open Australian Fuel Strategy Tracker</a>
        </article>
        <article className="quick-link-card">
          <span className="cta-card__title">Food, Farms &amp; Water</span>
          <p>Fertiliser imports beside source-gated farm-diesel, water-allocation and drought feeds.</p>
          <a href="../fertilizer-dashboard/index.html">Open Food, Farms &amp; Water</a>
        </article>
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
        <Header active="qld_fuel_sovereignty" refreshStatus={refreshStatus}/>
        <main id="main"><div className="loading-wrap">Loading source envelopes...</div></main>
      </div>
    );
  }

  const latestRetrieved = window.FR.latestVerifiedRetrieved(data);
  const updatedDisplay = window.FR.fmtVerifiedUpdated(latestRetrieved);
  const ports = fields(data.qld_fuel_hub_six_ports_official_list).ports || [];
  const taroomName = fields(data.qld_taroom_trough_source_gate).official_name || 'Taroom Trough';

  return (
    <div className="page">
      <Header active="qld_fuel_sovereignty" refreshStatus={refreshStatus} updated={latestRetrieved ? updatedDisplay : ''}/>

      <main id="main">
        <section className="intro" id="qld-fuel-sovereignty">
          <div>
            <span className="eyebrow">Queensland fuel sovereignty delivery tracker</span>
            <h1 style={{ marginTop: 12 }}>What Queensland&rsquo;s public fuel-sovereignty data can verify &mdash; and what remains source-gated</h1>
            <p className="intro__lede">
              This tracker separates source-backed delivery signals from partial, manual and
              source-gated feeds so readers can see which Queensland fuel-sovereignty claims are
              publicly visible, and which still require publisher verification.
            </p>
            <p className="intro__lede" style={{ marginTop: 12 }}>
              It tracks the public fuel-sovereignty delivery pathway: six ports, AFIP, state-owned
              land, storage/refining opportunities, private-sector proposals, Taroom Trough
              approvals and what remains unpublished.
            </p>
            <p className="body-sm" style={{ marginTop: 16, color: 'var(--ink-2)' }}>
              This page is an independent public-source prototype. It does not infer land
              parcels, storage capacity, refinery capacity, proponents, bids, contracts,
              approvals or operational fuel holdings. If a delivery field is not published
              in a named official source, it remains marked as unavailable or source-gated.
            </p>
          </div>
          <aside className="intro__meta" aria-label="Publication details">
            <strong>Verified data retrieved</strong>
            <span className="mono">{updatedDisplay}</span>
            <div style={{ height: 12 }}/>
            <strong>Official list</strong>
            <span>{ports.length ? `${ports.length} AFIP hubs source-linked` : 'Awaiting official source confirmation'}</span>
            <div style={{ height: 12 }}/>
            <strong>Boundary</strong>
            <span>Delivery/accountability tracker, not an operational fuel dashboard.</span>
            <div style={{ height: 12 }}/>
            <strong>Last reviewed</strong>
            <span className="mono">metadata pending</span>
          </aside>
        </section>

        <DataCoverage data={data} refreshStatus={refreshStatus}/>

        <OperationalSummary30s data={data}/>

        <StatusLegendAtGlance/>

        <EvidenceBoundary/>

        <OpenRelatedSurfaces/>

        <QuickGuide/>

        <SixPortDeliveryPathway data={data}/>

        <section className="section" aria-labelledby="afip-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Market engagement</span>
              <h2 id="afip-h">AFIP and private-sector proposal status</h2>
              <p className="section__lede">
                Public AFIP context and an EOI pathway are visible. Submission counts,
                proponents, shortlists, awards and contracts are not published as reusable
                public data.
              </p>
            </div>
          </div>
          <DeliveryTable
            data={data}
            columns={['Delivery item', 'Current public status', 'What is visible', 'What is not published', 'Likely holder / publisher', 'Next source action']}
            rows={AFIP_ROWS}
          />
        </section>

        <section className="section section--why" aria-labelledby="land-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Land and hubs</span>
              <h2 id="land-h">State-owned land and industrial fuel hubs</h2>
              <p className="section__lede">
                A public statement that an audit is underway is not the same as a reusable
                land-register dataset.
              </p>
            </div>
          </div>
          <DeliveryTable
            data={data}
            columns={['Land / hub item', 'Current public status', 'What is visible', 'What is not published', 'Dashboard status', 'Next source action']}
            rows={LAND_ROWS}
          />
        </section>

        <section className="section" aria-labelledby="storage-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Project pathway</span>
              <h2 id="storage-h">Storage and refining project pathway</h2>
              <p className="section__lede">
                This tracker does not derive storage or refinery capacity from broader
                production datasets. Capacity requires an official source with unit, date,
                site and definition.
              </p>
            </div>
          </div>
          <DeliveryTable
            data={data}
            columns={['Pathway item', 'Current public status', 'What is verified', 'What is not published', 'Dashboard status', 'Next source action']}
            rows={STORAGE_REFINING_ROWS}
          />
        </section>

        <section className="section section--why" aria-labelledby="taroom-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Resource pathway</span>
              <h2 id="taroom-h">Taroom Trough and approvals pathway</h2>
              <p className="section__lede">
                Official wording is {taroomName}. The tracker does not infer production volume,
                approval completion, timelines or fuel-security impact unless an official source
                says so.
              </p>
            </div>
          </div>
          <DeliveryTable
            data={data}
            columns={['Pathway item', 'Current public status', 'What is verified', 'What is not published', 'Dashboard status', 'Next source action']}
            rows={TAROOM_ROWS}
          />
        </section>

        <section className="section" aria-labelledby="blockers-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Delivery blockers</span>
              <h2 id="blockers-h">Delivery blockers matrix</h2>
              <p className="section__lede">
                Categorical delivery blockers only. No numeric score, fake urgency rating
                or project-success claim is added.
              </p>
            </div>
          </div>
          <SimpleStatusTable
            columns={['Blocker', 'Current status', 'Who likely controls it', 'Why it matters', 'Next action', 'Dashboard status']}
            rows={BLOCKER_ROWS}
          />
        </section>

        <section className="section section--why" aria-labelledby="publish-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Missing public feeds</span>
              <h2 id="publish-h">What Queensland still needs to publish</h2>
              <p className="section__lede">
                These are source requests, not inferred values. The page keeps missing
                delivery fields visible until official/public sources provide exact fields,
                dates, units and reuse boundaries.
              </p>
            </div>
          </div>
          <SimpleStatusTable
            columns={['Missing feed', 'Likely publisher', 'Why it matters', 'Current status', 'Next source action']}
            rows={PUBLISH_ROWS}
          />
        </section>

        <RelationshipSection/>

        <section className="section section--sources" id="sources">
          <div className="section__head">
            <div>
              <span className="eyebrow">Sources and methodology</span>
              <h2>Every envelope used on this page</h2>
              <p className="section__lede">
                This tracker reuses existing Queensland fuel-sovereignty envelopes. It adds no
                new delivery values, capacities, land parcels, proponent names, bid counts,
                contract awards or approvals.
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
                  'qld_fuel_hub_six_ports_official_list',
                  'qld_fuel_hub_state_owned_land',
                  'qld_fuel_security_eoi_portal',
                  'qld_domestic_fuel_production_pathway',
                  'qld_taroom_trough_source_gate',
                  'qld_drilling_approvals_pathway',
                ].includes(id)}
              />
            ))}
          </div>
          <div className="methodology">
            <h3>No-estimate rule</h3>
            <p>
              No land parcel, capacity, proponent, bid, contract, approval-completion
              or operational fuel-holding value is inferred. Source-gated means this
              page is waiting for a verified official/public source, exact field,
              period, unit and reuse boundary.
            </p>
          </div>
        </section>
      </main>

      <Footer refreshStatus={refreshStatus} updated={latestRetrieved ? updatedDisplay : ''}/>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
