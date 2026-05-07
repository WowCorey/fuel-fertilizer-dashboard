const SERIES = [
  'strategic_resources_profiles',
  'strategic_resources_req_dec2025',
  'strategic_resources_aimr_2025',
  'strategic_resources_operating_mines_2024',
  'strategic_resources_critical_minerals_context',
  'strategic_resources_sulphur_gap',
];

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
      <table className="data-table">
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
      <table className="data-table">
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
            <span className="eyebrow">Critical minerals and strategic resources</span>
            <h1 style={{ marginTop: 12 }}>Australia's strategic resources, in plain English.</h1>
            <p className="intro__lede">
              This page shows what Australia extracts from the ground that matters for trade,
              industry, defence and the energy transition. It separates mine production,
              export value, export volume, reserves/resources, state footprint and strategic
              role. No underground-wealth total is published.
            </p>
          </div>
          <aside className="intro__meta" aria-label="Publication details">
            <strong>Verified data retrieved</strong>
            <span className="mono">{updatedDisplay}</span>
            <div style={{ height: 12 }}/>
            <strong>Rule</strong>
            <span>Production, exports, reserves/resources and strategic role are separate fields.</span>
          </aside>
        </section>

        <DataCoverage data={data} refreshStatus={refreshStatus}/>

        <section className="section section--why">
          <div className="why-grid">
            <div>
              <span className="eyebrow">Read this first</span>
              <h2 style={{ marginTop: 8 }}>What this page measures</h2>
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
                Weaker rows stay partial or unavailable.
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
