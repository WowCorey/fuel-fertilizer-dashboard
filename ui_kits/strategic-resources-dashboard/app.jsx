const SERIES = [
  'strategic_resources_profiles',
  'strategic_resources_req_dec2025',
  'strategic_resources_aimr_2025',
  'strategic_resources_operating_mines_2024',
  'strategic_resources_critical_minerals_context',
  'strategic_resources_sulphur_gap',
];

const RESOURCE_STATUS_LEGEND = [
  ['observed', 'Verified', 'Source-backed and current enough for its cadence.'],
  ['partial', 'Partial', 'Source-backed, but incomplete by resource, processing stage, export concept, state footprint or update cadence.'],
  ['stale', 'Stale', 'Source-backed, but outside its expected cadence window.'],
  ['manual', 'Manual', 'Hand-keyed from a named public source or held as a manual snapshot pending a verified row.'],
  ['derived', 'Derived', 'Calculated or selected from a named source envelope.'],
  ['source-gated', 'Source-gated', 'Waiting for a verified source, field, period, unit and reuse rights.'],
  ['unavailable', 'Unavailable', 'No public source-safe feed is loaded.'],
  ['roadmap', 'Roadmap', 'Planned dashboard area, not yet populated.'],
];

const RESOURCE_EVIDENCE_BOUNDARY = [
  {
    title: 'Unavailable does not mean zero',
    copy: 'Unavailable means no public source-safe feed has been loaded yet. It is not a statement that reserves, production, export exposure, processing capacity, supply risk or sovereign capability are zero, low or negligible.',
  },
  {
    title: 'Source-gated requires publisher verification',
    copy: 'Source-gated means the dashboard still needs a verified public source, exact field, period, unit and reuse boundary before a resource, processing, export or capability value can be published.',
  },
  {
    title: 'Resource signals are not capability proof',
    copy: 'Observed resource signals are not treated as proof of sovereign capability unless a named source explicitly supports that link.',
  },
  {
    title: 'No estimates fill resource gaps',
    copy: 'This page does not estimate missing reserves, production, export exposure, domestic processing capacity, project status, supply risk, defence relevance or sovereign-capability values.',
  },
  {
    title: 'Priority is product triage',
    copy: 'Priority language on this page is editorial/product triage only. It is not a Strategic Resources Stress Index, Sovereign Capability Index or official risk rating.',
  },
  {
    title: 'Visibility gap, not misconduct proof',
    copy: 'A missing public feed is a public visibility gap. It is not proof of wrongdoing, and likely holder or publisher fields are starting points for verification, not custody assertions.',
  },
];

function ResourceStatusLegend() {
  return (
    <section className="section" aria-labelledby="resource-status-legend-h">
      <div className="section__head">
        <div>
          <span className="eyebrow">Status legend</span>
          <h2 id="resource-status-legend-h">Status labels used on this resource-resilience page</h2>
          <p className="section__lede">
            These labels match the Missing Data Scoreboard, Manufacturing, Infrastructure, Power Grid
            and National Fuel Security. They are part of the evidence, not decoration.
          </p>
        </div>
      </div>
      <div className="confidence-legend" aria-label="Strategic-resource and processing status legend">
        <span className="confidence-legend__label">Legend</span>
        <dl>
          {RESOURCE_STATUS_LEGEND.map(([kind, label, copy]) => (
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

function ResourceAuditSummary() {
  const cards = [
    {
      title: 'Publicly visible resource signals',
      eyebrow: 'Source-backed indicator',
      copy: 'Loaded source envelopes separate mine production, exports, reserve/resource context, state footprint and strategic role where named public sources support those fields.',
      href: '#headline-h',
    },
    {
      title: 'Partial and manual processing feeds',
      eyebrow: 'Partial feed / manual snapshot',
      copy: 'Some rows provide official context or feature counts, but they are not domestic processing capacity, project readiness, supply-chain depth or defence-production capability datasets.',
      href: '#sources',
    },
    {
      title: 'Source-gated production or export feeds',
      eyebrow: 'Requires publisher verification',
      copy: 'Missing reserves, production, export concentration, processing capacity, project status, domestic use, supply risk and sovereign-capability rows are not inferred from broader resource indicators.',
      href: '#sources',
    },
    {
      title: 'Highest-priority resource visibility gaps',
      eyebrow: 'Editorial/product triage only',
      copy: 'The most useful next feeds would separate domestic processing capacity, export exposure, reserve/resource updates, project readiness, defence relevance, supply-chain dependency and safe public capability boundaries.',
      href: '../missing-data-scoreboard/index.html',
    },
  ];

  return (
    <section className="section" aria-labelledby="resource-summary-h">
      <div className="section__head">
        <div>
          <span className="eyebrow">30-second strategic-resource summary</span>
          <h2 id="resource-summary-h">What the resource-resilience audit can and cannot show</h2>
          <p className="section__lede">
            These cards use categorical summaries rather than invented counts. They explain what is verifiable,
            what is partial, and what readers should not infer about sovereign capability or strategic certainty.
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

function ResourceEvidenceBoundary() {
  return (
    <section className="section section--why" aria-labelledby="resource-evidence-boundary-h">
      <div className="section__head">
        <div>
          <span className="eyebrow">Evidence boundary</span>
          <h2 id="resource-evidence-boundary-h">What readers should not assume from missing or partial resource data</h2>
          <p className="section__lede">
            Read these statements before interpreting any strategic-resource, processing,
            export, supply-risk or sovereign-capability gap. They define how this public-source
            audit treats unavailable and source-gated information.
          </p>
        </div>
      </div>
      <div className="source-grid">
        {RESOURCE_EVIDENCE_BOUNDARY.map(item => (
          <article className="source-card" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ResourceRelatedSurfaces() {
  const links = [
    {
      title: 'Missing Data Scoreboard',
      copy: 'Open the national audit of public-data gaps, likely publishers and next source actions.',
      href: '../missing-data-scoreboard/index.html',
      label: 'Open Missing Data Scoreboard',
    },
    {
      title: 'Manufacturing',
      copy: 'Industrial-capacity signals that depend on source-backed resource and processing visibility.',
      href: '../manufacturing-dashboard/index.html',
      label: 'Open Manufacturing',
    },
    {
      title: 'Infrastructure',
      copy: 'Project-delivery and logistics signals that shape mine, processing and export capability.',
      href: '../infrastructure-dashboard/index.html',
      label: 'Open Infrastructure',
    },
    {
      title: 'Power Grid',
      copy: 'Energy-reliability signals that matter for processing, manufacturing and resource logistics.',
      href: '../power-grid-dashboard/index.html',
      label: 'Open Power Grid',
    },
    {
      title: 'National Fuel Security',
      copy: 'Fuel and logistics visibility that affects mining, processing, freight and strategic resilience.',
      href: '../fuel-security-dashboard/index.html',
      label: 'Open National Fuel Security',
    },
    {
      title: 'Defence Procurement Watch',
      copy: 'Procurement pathways and public/private boundaries that must not be inferred from resource context alone.',
      href: '../defence-procurement-watch/index.html',
      label: 'Open Defence Procurement Watch',
    },
    {
      title: 'Sources and methodology',
      copy: 'Jump to the source envelopes loaded by this page and the no-capability-claim methodology.',
      href: '#sources',
      label: 'Open Strategic Resources methodology',
    },
  ];

  return (
    <section className="section" aria-labelledby="resource-related-h">
      <div className="section__head">
        <div>
          <span className="eyebrow">Audit navigation</span>
          <h2 id="resource-related-h">Open related public-data surfaces</h2>
          <p className="section__lede">
            Strategic resources connect to manufacturing, infrastructure, energy, fuel,
            defence procurement, exports, sovereign capability and macroeconomic resilience.
            These links keep observed resource indicators separate from unsupported capability claims.
          </p>
        </div>
      </div>
      <div className="quick-link-grid quick-link-grid--4">
        {links.map(link => (
          <article className="quick-link-card" key={link.title}>
            <h3>{link.title}</h3>
            <p>{link.copy}</p>
            <a href={link.href}>{link.label}</a>
          </article>
        ))}
      </div>
    </section>
  );
}

function fields(env) {
  return env?.extra?.fields || {};
}

function hasRows(env) {
  return env && env.status === 'ok' && env.extra?.fields;
}

function trustKind(label) {
  const text = String(label || '').toLowerCase();
  if (text.includes('unavailable')) return 'unavailable';
  if (text.includes('partial')) return 'partial';
  if (text.includes('derived')) return 'derived';
  if (text.includes('manual')) return 'manual';
  if (text.includes('stale')) return 'stale';
  return 'observed';
}

function sourceLineFor(data, sourceId) {
  const env = data?.[sourceId];
  return env ? window.FR.sourceLine(env) : `Source id not loaded: ${sourceId}.`;
}

function SourceLink({ data, sourceId }) {
  const env = data?.[sourceId];
  if (!env?.source_url) return <span>{sourceId || 'No source id'}</span>;
  return (
    <a href={env.source_url}>
      {sourceId} <Icon name="external" size={12}/>
    </a>
  );
}

function MetricStatus({ metric }) {
  const label = metric?.trust_label || metric?.status || 'Observed';
  return (
    <div className="trust-badges">
      <TrustBadge kind={trustKind(label)}>{label}</TrustBadge>
    </div>
  );
}

function ResourceCard({ row, data }) {
  const metric = row.headline_metric || {};
  const unavailable = metric.status === 'unavailable';
  return (
    <article className={`metric-card ${unavailable ? 'metric-card--unavailable' : ''}`}>
      <div className="card-status-row">
        <span className="eyebrow">{metric.metric_type || row.resource_type}</span>
        <MetricStatus metric={metric}/>
      </div>
      <h3 className="metric-card__label">{row.resource_name}</h3>
      <p className="metric-card__plain">{row.strategic_role_line}</p>
      {unavailable ? (
        <div className="metric-card__unavail">
          <Icon name="alert" size={18}/>
          <span>{metric.notes || 'No verified metric is loaded.'}</span>
        </div>
      ) : (
        <div className="metric-card__row">
          <span className="metric-numeral">{metric.value_display}</span>
          {metric.unit && <span className="metric-unit">{metric.unit}</span>}
        </div>
      )}
      <footer className="metric-card__foot">
        <span className="metric-card__source">
          {metric.period ? `${metric.metric_name}; ${metric.period}. ` : ''}
          {sourceLineFor(data, metric.source_id)}
        </span>
      </footer>
    </article>
  );
}

function ComparisonTable({ rows, data }) {
  return (
    <div className="data-table-wrap">
      <table className="data-table data-table--sticky">
        <thead>
          <tr>
            <th>Resource</th>
            <th>Production status</th>
            <th>Export status</th>
            <th>State footprint</th>
            <th>Strategic role</th>
            <th>Source coverage</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => {
            const production = row.production || {};
            const exports = row.exports || [];
            const reserve = row.reserve_or_resource || {};
            return (
              <tr key={row.resource_id}>
                <td><b>{row.resource_name}</b><br/><span className="caption">{row.resource_type}</span></td>
                <td className={production.status === 'unavailable' ? 'unavail' : ''}>
                  {production.status === 'unavailable' ? production.notes : production.summary}
                  <br/><TrustBadge kind={trustKind(production.trust_label)}>{production.trust_label}</TrustBadge>
                  {reserve.summary && <><br/><span className="caption">{reserve.summary}</span></>}
                </td>
                <td className={exports.every(item => item.status === 'unavailable') ? 'unavail' : ''}>
                  {exports.map(item => (
                    <div key={item.metric_name}>
                      {item.status === 'unavailable' ? item.notes : item.summary}
                      <br/><TrustBadge kind={trustKind(item.trust_label)}>{item.trust_label}</TrustBadge>
                    </div>
                  ))}
                </td>
                <td>{row.state_footprint_summary}</td>
                <td>{row.strategic_role_line}</td>
                <td>
                  <TrustBadge kind={trustKind(row.source_coverage_label)}>{row.source_coverage_label}</TrustBadge>
                  <br/><span className="caption">{row.coverage_notes}</span>
                  <br/><SourceLink data={data} sourceId={row.primary_source_id}/>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function StateFootprint({ rows, data }) {
  const loaded = rows.filter(row => row.state_footprint?.length);
  return (
    <div className="data-table-wrap">
      <table className="data-table data-table--sticky">
        <thead>
          <tr>
            <th>Resource</th>
            <th>States with operating rows</th>
            <th>Developing/care rows</th>
            <th>Boundary</th>
          </tr>
        </thead>
        <tbody>
          {loaded.map(row => {
            const operating = row.state_footprint
              .filter(item => item.operating > 0)
              .map(item => `${item.state}: ${item.operating}`)
              .join('; ');
            const other = row.state_footprint
              .filter(item => (item.developing || item.care_and_maintenance) > 0)
              .map(item => `${item.state}: ${item.developing || 0} developing, ${item.care_and_maintenance || 0} care`)
              .join('; ');
            return (
              <tr key={row.resource_id}>
                <td><b>{row.resource_name}</b></td>
                <td>{operating || <span className="unavail">No operating row loaded.</span>}</td>
                <td>{other || <span className="caption">No developing or care rows in loaded subset.</span>}</td>
                <td>{row.state_footprint_boundary}<br/><span className="caption mono">{sourceLineFor(data, 'strategic_resources_operating_mines_2024')}</span></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function RelevanceSection({ relevance }) {
  return (
    <div className="sources-grid">
      {(relevance || []).map(item => (
        <article className="source-card" key={item.group}>
          <div className="card-status-row">
            <h4>{item.group}</h4>
            <TrustBadge kind="manual">Manual</TrustBadge>
          </div>
          <p className="body-sm">{item.summary}</p>
          <p className="caption"><b>Resources:</b> {item.resources.join(', ')}</p>
          <p className="caption"><b>Source boundary:</b> {item.boundary}</p>
        </article>
      ))}
    </div>
  );
}

function SourceSummary({ id, env, partial = false }) {
  const meta = env?._meta || {};
  const ok = env?.status === 'ok';
  return (
    <article className="source-card">
      <div className="card-status-row">
        <h4>{env?.source_name || id}</h4>
        <EnvTrustBadges env={env} partial={partial}/>
      </div>
      <p className="body-sm">
        {ok
          ? `Verified envelope. ${env.values?.length || 0} headline point${env.values?.length === 1 ? '' : 's'}; latest ${env.last_data_point || 'source period listed in notes'}.`
          : 'Awaiting a verified public source before publication.'}
      </p>
      <p className="caption"><b>Envelope:</b> <span className="mono">{id}</span></p>
      {meta.rights && <p className="caption"><b>Rights:</b> {meta.rights}</p>}
      {meta.citation && <p className="caption"><b>Citation:</b> {meta.citation}</p>}
      {env?.notes && <p className="caption">{env.notes}</p>}
      {env?.source_url && <a href={env.source_url}>{env.source_url.replace(/^https?:\/\//, '')} <Icon name="external" size={12}/></a>}
    </article>
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
        <Header active="strategic_resources" refreshStatus={refreshStatus}/>
        <main id="main"><div className="loading-wrap">Loading source envelopes...</div></main>
      </div>
    );
  }

  const profileFields = fields(data.strategic_resources_profiles);
  const resources = profileFields.resources || [];
  const takeaways = hasRows(data.strategic_resources_profiles) ? (profileFields.takeaways || []) : [];
  const latestRetrieved = window.FR.latestVerifiedRetrieved(data);
  const updatedDisplay = window.FR.fmtVerifiedUpdated(latestRetrieved);
  const strongCoverage = resources.filter(row => row.source_coverage_label === 'Strong coverage').length;
  const partialCoverage = resources.filter(row => String(row.source_coverage_label).includes('Partial')).length;
  const unavailable = resources.filter(row => String(row.source_coverage_label).includes('Unavailable')).length;

  return (
    <div className="page">
      <Header active="strategic_resources" refreshStatus={refreshStatus} updated={latestRetrieved ? updatedDisplay : ''}/>

      <main id="main">
        <section className="intro" id="strategic-resources">
          <div>
            <span className="eyebrow">Strategic resource resilience audit prototype</span>
            <h1 style={{ marginTop: 12 }}>What Australia&rsquo;s public strategic-resource data can verify - and what remains source-gated</h1>
            <p className="intro__lede">
              This dashboard separates source-backed strategic-resource and processing indicators
              from partial, manual and source-gated feeds so readers can see resilience signals
              without invented certainty.
            </p>
            <p className="intro__lede">
              It keeps mine production, export value, export volume, reserves/resources,
              state footprint and strategic role separate. It does not estimate missing reserves,
              processing capacity, export exposure, project status, supply risk or sovereign capability.
            </p>
          </div>
          <aside className="intro__meta" aria-label="Publication details">
            <strong>Boundary</strong>
            <span>Independent public-source prototype. No sovereign capability, supply-risk or project-status claim is invented from partial data.</span>
            <div style={{ height: 12 }}/>
            <strong>Last reviewed</strong>
            <span>metadata pending</span>
          </aside>
        </section>

        <ResourceStatusLegend/>
        <ResourceAuditSummary/>
        <ResourceEvidenceBoundary/>
        <ResourceRelatedSurfaces/>
        <DataCoverage data={data} refreshStatus={refreshStatus}/>

        <section className="section section--why">
          <div className="why-grid">
            <div>
              <span className="eyebrow">Read this first</span>
              <h2 style={{ marginTop: 8 }}>Resource source status comes first</h2>
            </div>
            <div className="why-body">
              <p>
                Strategic resources are minerals and energy commodities that matter beyond
                a mine gate: they feed steel, batteries, power systems, defence supply chains,
                manufacturing and export income.
              </p>
              <p>
                Australia matters globally because official Geoscience Australia material
                identifies top-five supplier roles across several commodities, while DISR's
                Resources and Energy Quarterly tracks export volumes and values for major
                commodities.
              </p>
              <p>
                This page does not value everything still in the ground. Reserve and resource
                rows are shown only when Geoscience Australia publishes a clear unit and date,
                and they are not combined with production or exports.
              </p>
              <p>
                A missing reserve, production, processing, export exposure, project-status,
                defence relevance or supply-risk feed is a public visibility gap. It is not
                evidence that Australia has or lacks sovereign capability unless a named
                public source supports that specific claim.
              </p>
            </div>
          </div>
        </section>

        {takeaways.length > 0 && (
          <section className="section" aria-labelledby="takeaway-h">
            <div className="section__head">
              <div>
                <span className="eyebrow">If you only read one thing</span>
                <h2 id="takeaway-h">Loaded source takeaways</h2>
              </div>
            </div>
            <div className="sources-grid">
              {takeaways.map(item => (
                <article className="source-card" key={item.title}>
                  <div className="card-status-row">
                    <h4>{item.title}</h4>
                    <TrustBadge kind={trustKind(item.trust_label)}>{item.trust_label}</TrustBadge>
                  </div>
                  <p className="body-sm">{item.text}</p>
                  <p className="caption mono">{sourceLineFor(data, item.source_id)}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="section" aria-labelledby="headline-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Summary cards</span>
              <h2 id="headline-h">A first-pass subset, not every mineral</h2>
              <p className="section__lede">
                Each card shows one headline metric with its own type and source boundary.
                Weaker rows stay partial, source-gated or unavailable. We do not estimate.
              </p>
            </div>
          </div>
          <div className="metric-grid">
            {resources.map(row => <ResourceCard key={row.resource_id} row={row} data={data}/>)}
          </div>
        </section>

        <section className="section" aria-labelledby="comparison-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Comparison</span>
              <h2 id="comparison-h">Resource comparison table</h2>
              <p className="section__lede">
                Production, export and reserve/resource rows remain separate so the dashboard
                does not blur different economic concepts.
              </p>
            </div>
          </div>
          <ComparisonTable rows={resources} data={data}/>
        </section>

        <section className="section" aria-labelledby="state-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">State footprint</span>
              <h2 id="state-h">Where the loaded operating-mines source places activity</h2>
              <p className="section__lede">
                These are mine/deposit feature counts from the Geoscience Australia/Digital Atlas
                operating mines layer. They are not production volumes by state.
              </p>
            </div>
          </div>
          <StateFootprint rows={resources} data={data}/>
        </section>

        <section className="section" aria-labelledby="relevance-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Strategic relevance</span>
              <h2 id="relevance-h">Why these resources matter</h2>
              <p className="section__lede">
                Strategic role is framed from official public strategy and commodity sources.
                It is not investment advice and not a company promotion.
              </p>
            </div>
          </div>
          <RelevanceSection relevance={profileFields.strategic_relevance}/>
        </section>

        <section className="section" aria-labelledby="coverage-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Coverage result</span>
              <h2 id="coverage-h">Strong, partial and unavailable rows</h2>
            </div>
          </div>
          <div className="metric-grid metric-grid--3">
            <MetricCard
              eyebrow="Coverage"
              label="Strong resource rows"
              value={`${strongCoverage}`}
              plain="Production, export and state-footprint context are all defensibly loaded."
              source="Computed from the compiled strategic resources profile envelope."
            />
            <MetricCard
              eyebrow="Coverage"
              label="Partial resource rows"
              value={`${partialCoverage}`}
              plain="One or more major fields are source-safe, but others stay caveated or unavailable."
              source="Computed from explicit per-resource coverage labels."
            />
            <MetricCard
              eyebrow="Coverage"
              label="Unavailable resource rows"
              value={`${unavailable}`}
              plain="No dashboard-safe national metric is loaded yet."
              source="Sulphur is intentionally left unavailable."
            />
          </div>
        </section>

        <section className="section section--why" aria-labelledby="method-h">
          <div className="why-grid">
            <div>
              <span className="eyebrow">Methodology</span>
              <h2 id="method-h" style={{ marginTop: 8 }}>Why the page is fail-closed</h2>
            </div>
            <div className="why-body">
              <p>
                Mine production is the amount produced in a period. Export value is money
                earned from exports in a period. Export volume is a traded physical quantity.
                Ore Reserves and Mineral Resources are in-ground economic or geological
                inventory concepts as at a date. The dashboard never adds these into one number.
              </p>
              <p>
                State footprint uses the GA/Digital Atlas operating mines layer as a structured
                qualitative footprint. It counts source rows by status and state; it does not
                allocate national production or export value to states.
              </p>
              <p>
                Resources with weak source coverage are left partial or unavailable. Sulphur is
                included as a source-gate row only: no official national sulphur production or
                export row is loaded.
              </p>
              <p>
                These indicators do not prove sovereign capability, domestic processing depth,
                supply risk, defence relevance, project status, export exposure or strategic
                certainty. A capability row requires a named public source with a field, period,
                unit, method and reuse boundary.
              </p>
            </div>
          </div>
        </section>

        <section className="section section--why" aria-labelledby="procurement-link-h">
          <div className="why-grid">
            <div>
              <span className="eyebrow">Procurement dependencies</span>
              <h2 id="procurement-link-h" style={{ marginTop: 8 }}>Procurement claims need their own source gate</h2>
            </div>
            <div className="why-body">
              <p>
                Strategic resource rows can show production, export, reserve/resource and
                footprint context. They do not prove a defence procurement supplier pathway,
                contract status, material bill, delivery timeline or logistics implication.
              </p>
              <p>
                For procurement dependencies and public/private boundaries, see Defence
                Procurement Watch.
              </p>
              <a className="hero-button" href="../defence-procurement-watch/index.html">Open Defence Procurement Watch</a>
            </div>
          </div>
        </section>

        <section className="section section--sources" id="sources" aria-labelledby="sources-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Sources & methodology</span>
              <h2 id="sources-h">Every source used on this page</h2>
              <p className="section__lede">
                Source cards show the envelope status, rights and citation. Candidate or weak
                sources are documented in the methodology instead of being converted into numbers.
                We do not estimate, and we do not invent capability claims.
              </p>
            </div>
          </div>
          <div className="sources-grid">
            <SourceSummary id="strategic_resources_profiles" env={data.strategic_resources_profiles} partial/>
            <SourceSummary id="strategic_resources_req_dec2025" env={data.strategic_resources_req_dec2025}/>
            <SourceSummary id="strategic_resources_aimr_2025" env={data.strategic_resources_aimr_2025}/>
            <SourceSummary id="strategic_resources_operating_mines_2024" env={data.strategic_resources_operating_mines_2024} partial/>
            <SourceSummary id="strategic_resources_critical_minerals_context" env={data.strategic_resources_critical_minerals_context} partial/>
            <SourceSummary id="strategic_resources_sulphur_gap" env={data.strategic_resources_sulphur_gap}/>
          </div>
        </section>

        <Footer refreshStatus={refreshStatus} updated={latestRetrieved ? updatedDisplay : ''}/>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
