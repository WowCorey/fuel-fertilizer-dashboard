const SERIES = [
  'defence_posture_profiles',
  'defence_budget_2026_nds',
  'defence_workforce_annual_report_2024_25',
  'defence_public_capability_assets',
  'defence_alliance_frameworks',
  'defence_sovereign_industry_context',
  'defence_uncrewed_systems',
  'defence_readiness_gap',
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

function SourceAnchor({ href, children }) {
  if (!href) return <span>{children || 'No source URL loaded'}</span>;
  return (
    <a href={href}>
      {children || href.replace(/^https?:\/\//, '')} <Icon name="external" size={12}/>
    </a>
  );
}

function MetricStatus({ label }) {
  return (
    <div className="trust-badges">
      <TrustBadge kind={trustKind(label)}>{label || 'Observed'}</TrustBadge>
    </div>
  );
}

function ProfileCard({ item, data }) {
  return (
    <article className="source-card">
      <div className="card-status-row">
        <h4>{item.title}</h4>
        <MetricStatus label={item.trust_label}/>
      </div>
      <p className="body-sm">{item.text}</p>
      <p className="caption mono">{sourceLineFor(data, item.source_id)}</p>
    </article>
  );
}

function BudgetMetricCard({ metric, data }) {
  const unavailable = metric.source_coverage_label === 'Unavailable';
  return (
    <article className={`metric-card ${unavailable ? 'metric-card--unavailable' : ''}`}>
      <div className="card-status-row">
        <span className="eyebrow">{metric.category}</span>
        <MetricStatus label={metric.trust_label}/>
      </div>
      <h3 className="metric-card__label">{metric.metric_name}</h3>
      <p className="metric-card__plain">{metric.notes}</p>
      {unavailable ? (
        <div className="metric-card__unavail">
          <Icon name="alert" size={18}/>
          <span>{metric.metric_display}</span>
        </div>
      ) : (
        <div className="metric-card__row">
          <span className="metric-numeral">{metric.metric_display}</span>
        </div>
      )}
      <footer className="metric-card__foot">
        <span className="metric-card__source">
          {metric.metric_period}. {sourceLineFor(data, metric.source_id)}
        </span>
      </footer>
    </article>
  );
}

function BudgetTable({ rows, data }) {
  return (
    <div className="data-table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Metric</th>
            <th>Period</th>
            <th>Value</th>
            <th>Type</th>
            <th>Status</th>
            <th>Boundary</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.metric_id}>
              <td><b>{row.metric_name}</b><br/><span className="caption mono">{row.metric_id}</span></td>
              <td>{row.metric_period}</td>
              <td className={row.source_coverage_label === 'Unavailable' ? 'unavail' : ''}>{row.metric_display}</td>
              <td>{row.category}</td>
              <td><MetricStatus label={row.trust_label}/></td>
              <td>{row.notes}<br/><span className="caption mono">{sourceLineFor(data, row.source_id)}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ForceStructureTable({ rows, data }) {
  return (
    <div className="data-table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Row</th>
            <th>Type</th>
            <th>What the public source supports</th>
            <th>Status</th>
            <th>Boundary</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.name}>
              <td><b>{row.name}</b></td>
              <td>{row.type}</td>
              <td>{row.summary}<br/><SourceAnchor href={row.source_url}/></td>
              <td><MetricStatus label={row.trust_label}/></td>
              <td>{row.notes}<br/><span className="caption mono">{sourceLineFor(data, row.source_id)}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CapabilitySection({ rows }) {
  const groups = ['Navy', 'Air Force', 'Army', 'Joint'];
  return (
    <div className="sources-grid">
      {groups.map(branch => {
        const branchRows = rows.filter(row => row.branch === branch);
        if (!branchRows.length) return null;
        return (
          <article className="source-card" key={branch}>
            <div className="card-status-row">
              <h4>{branch}</h4>
              <TrustBadge kind={branch === 'Joint' ? 'unavailable' : 'partial'}>{branch === 'Joint' ? 'Unavailable' : 'Partial coverage'}</TrustBadge>
            </div>
            <div className="data-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Capability</th>
                    <th>Public row</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {branchRows.map(row => (
                    <tr key={row.capability_id}>
                      <td><b>{row.capability_name}</b><br/><span className="caption">{row.capability_type}</span></td>
                      <td className={row.trust_label === 'Unavailable' ? 'unavail' : ''}>
                        {row.quantity_or_status}<br/>
                        <span className="caption">{row.notes}</span><br/>
                        <SourceAnchor href={row.source_url}/>
                      </td>
                      <td><MetricStatus label={row.trust_label}/></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function AllianceSection({ frameworks }) {
  return (
    <div className="data-table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Framework</th>
            <th>Type</th>
            <th>Members</th>
            <th>Public status</th>
            <th>Purpose</th>
            <th>Trust</th>
          </tr>
        </thead>
        <tbody>
          {frameworks.map(row => (
            <tr key={row.framework_id}>
              <td><b>{row.framework_name}</b><br/><SourceAnchor href={row.source_url}/></td>
              <td>{row.framework_type}</td>
              <td>{row.member_countries.join(', ')}</td>
              <td>{row.formal_status}</td>
              <td>{row.purpose_summary}<br/><span className="caption">{row.notes}</span></td>
              <td><MetricStatus label={row.trust_label}/></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UncrewedSystemsTable({ rows, data }) {
  if (!rows.length) return null;
  return (
    <div className="data-table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>System</th>
            <th>Domain</th>
            <th>Public status</th>
            <th>Operator / program</th>
            <th>Status</th>
            <th>Boundary</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.system_id}>
              <td><b>{row.system_name}</b><br/><span className="caption">{row.capability_type}</span></td>
              <td>{row.domain}</td>
              <td>{row.public_status}<br/>
                <span className="caption">{row.quantity_or_status}</span><br/>
                <SourceAnchor href={row.source_url}/>
              </td>
              <td>{row.operator_or_program}</td>
              <td><MetricStatus label={row.trust_label}/></td>
              <td>{row.notes}<br/><span className="caption mono">{sourceLineFor(data, row.source_id)}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UncrewedProgramsTable({ rows, data }) {
  if (!rows.length) return null;
  return (
    <div className="data-table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Program</th>
            <th>Type</th>
            <th>Public headline</th>
            <th>Status</th>
            <th>Boundary</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.program_id}>
              <td><b>{row.program_name}</b><br/><SourceAnchor href={row.source_url}/></td>
              <td>{row.program_type}</td>
              <td>{row.headline}</td>
              <td><MetricStatus label={row.trust_label}/></td>
              <td>{row.notes}<br/><span className="caption mono">{sourceLineFor(data, row.source_id)}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UncrewedFundingTable({ rows, data }) {
  if (!rows.length) return null;
  return (
    <div className="data-table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Funding row</th>
            <th>Status</th>
            <th>Value</th>
            <th>Period</th>
            <th>Boundary</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.funding_id}>
              <td><b>{row.program_name}</b><br/><SourceAnchor href={row.source_url}/></td>
              <td><MetricStatus label={row.trust_label}/></td>
              <td className={row.funding_status === 'Unavailable' ? 'unavail' : ''}>
                {row.funding_value == null
                  ? 'Not separately published'
                  : `${row.funding_value} ${row.funding_unit || ''}`.trim()}
              </td>
              <td>{row.funding_period || '—'}</td>
              <td>{row.boundary_note}<br/><span className="caption mono">{sourceLineFor(data, row.source_id)}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function IndustrySection({ fields }) {
  const programRows = fields.program_rows || [];
  return (
    <div>
      <div className="sources-grid">
        <article className="source-card">
          <div className="card-status-row">
            <h4>Sovereign Defence Industrial Priorities</h4>
            <TrustBadge kind="observed">Observed</TrustBadge>
          </div>
          <p className="body-sm">
            Defence lists {fields.sdip_count} Sovereign Defence Industrial Priorities.
            The page treats them as industrial capability categories, not readiness.
          </p>
          <ul className="gap-list">
            {(fields.sdip_priorities || []).map(item => <li key={item}>{item}</li>)}
          </ul>
        </article>
        {programRows.map(row => (
          <article className="source-card" key={row.program_id}>
            <div className="card-status-row">
              <h4>{row.name}</h4>
              <MetricStatus label={row.trust_label}/>
            </div>
            <p className="body-sm">{row.headline}</p>
            <p className="caption"><b>Boundary:</b> {row.boundary}</p>
            <SourceAnchor href={row.source_url}/>
          </article>
        ))}
      </div>
      <p className="caption">{fields.boundary}</p>
    </div>
  );
}

function CoverageTable({ rows }) {
  return (
    <div className="data-table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Section</th>
            <th>Coverage</th>
            <th>What that means</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.section}>
              <td><b>{row.section}</b></td>
              <td><MetricStatus label={row.coverage}/></td>
              <td>{row.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
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
          : 'Source gate intentionally unavailable until a public, source-safe field exists.'}
      </p>
      <p className="caption"><b>Envelope:</b> <span className="mono">{id}</span></p>
      {meta.rights && <p className="caption"><b>Rights:</b> {meta.rights}</p>}
      {meta.citation && <p className="caption"><b>Citation:</b> {meta.citation}</p>}
      {env?.notes && <p className="caption">{env.notes}</p>}
      {env?.source_url && <SourceAnchor href={env.source_url}/>}
    </article>
  );
}

function App() {
  const [data, setData] = React.useState(null);
  React.useEffect(() => { window.FR.load(SERIES).then(setData); }, []);

  if (!data) {
    return (
      <div className="page">
        <Header active="defence_posture"/>
        <main id="main"><div className="loading-wrap">Loading source envelopes...</div></main>
      </div>
    );
  }

  const profile = fields(data.defence_posture_profiles);
  const budget = profile.budget_metrics || [];
  const forceStructure = profile.force_structure || [];
  const capabilityRows = fields(data.defence_public_capability_assets).capability_rows || [];
  const frameworks = fields(data.defence_alliance_frameworks).frameworks || [];
  const industry = fields(data.defence_sovereign_industry_context);
  const uncrewed = fields(data.defence_uncrewed_systems);
  const uncrewedSystems = uncrewed.systems_rows || [];
  const uncrewedPrograms = uncrewed.program_rows || [];
  const uncrewedFunding = uncrewed.funding_rows || [];
  const uncrewedCaveats = uncrewed.methodology_caveats || [];
  const takeaways = hasRows(data.defence_posture_profiles) ? (profile.takeaways || []) : [];
  const latestRetrieved = window.FR.latestVerifiedRetrieved(data);
  const updatedDisplay = window.FR.fmtVerifiedUpdated(latestRetrieved);
  const strongCoverage = (profile.section_coverage || []).filter(row => row.coverage === 'Strong coverage').length;
  const partialCoverage = (profile.section_coverage || []).filter(row => String(row.coverage).includes('Partial')).length;
  const unavailableCoverage = (profile.section_coverage || []).filter(row => String(row.coverage).includes('Unavailable')).length;

  return (
    <div className="page">
      <Header active="defence_posture" updated={latestRetrieved ? updatedDisplay : ''}/>

      <main id="main">
        <section className="intro" id="defence-posture">
          <div>
            <span className="eyebrow">Defence, alliances and strategic posture</span>
            <h1 style={{ marginTop: 12 }}>Australia's defence posture, in plain English.</h1>
            <p className="intro__lede">
              This page puts public defence spending, selected ADF capability rows,
              force-structure context, alliances, strategic frameworks and sovereign
              industry in one place. It does not publish secret, live or readiness-sensitive data.
            </p>
          </div>
          <aside className="intro__meta" aria-label="Publication details">
            <strong>Verified data retrieved</strong>
            <span className="mono">{updatedDisplay}</span>
            <div style={{ height: 12 }}/>
            <strong>Rule</strong>
            <span>Budget, public assets, alliances and readiness are separate fields.</span>
          </aside>
        </section>

        <DataCoverage data={data}/>

        <section className="section section--why">
          <div className="why-grid">
            <div>
              <span className="eyebrow">Read this first</span>
              <h2 style={{ marginTop: 8 }}>What this page measures</h2>
            </div>
            <div className="why-body">
              <p>
                Defence capability and alliances are shown together because Australia's posture
                depends on both public force structure and formal or practical international
                arrangements. The page keeps those concepts separate instead of turning them
                into one score.
              </p>
              <p>
                Budget rows describe money and planned expenditure. Capability rows describe
                selected public counts or acquisition statuses. Alliance rows describe framework
                type and purpose. No readiness, mission-capable or live operational availability metric is loaded.
              </p>
              <p>
                The page avoids secret, live and operationally sensitive data. It also avoids
                "Australia can beat X" framing and does not rank adversaries or predict conflict
                outcomes.
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
              {takeaways.map(item => <ProfileCard key={item.title} item={item} data={data}/>)}
            </div>
          </section>
        )}

        <section className="section" aria-labelledby="budget-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Defence spending</span>
              <h2 id="budget-h">Budget rows stay money rows</h2>
              <p className="section__lede">
                The strongest current coverage is the public 2026 National Defence Strategy
                budget factsheet. Spending as share of GDP is left unavailable until a source-safe
                official row or denominator is loaded.
              </p>
            </div>
          </div>
          <div className="metric-grid">
            {budget.slice(0, 3).map(metric => <BudgetMetricCard key={metric.metric_id} metric={metric} data={data}/>)}
          </div>
          <div style={{ height: 24 }}/>
          <BudgetTable rows={budget} data={data}/>
        </section>

        <section className="section" aria-labelledby="force-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Force structure</span>
              <h2 id="force-h">Public structure and workforce context</h2>
              <p className="section__lede">
                These rows explain high-level public structure and workforce reporting. They
                are not deployable strength or readiness rows.
              </p>
            </div>
          </div>
          <ForceStructureTable rows={forceStructure} data={data}/>
        </section>

        <section className="section" aria-labelledby="capability-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Capabilities and assets</span>
              <h2 id="capability-h">Selected public capability rows</h2>
              <p className="section__lede">
                The first pass loads selected official public rows across Navy, Air Force and
                Army. This is not a complete inventory, and it does not show readiness.
              </p>
            </div>
          </div>
          <CapabilitySection rows={capabilityRows}/>
        </section>

        <section className="section" aria-labelledby="uncrewed-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Uncrewed systems and counter-drone</span>
              <h2 id="uncrewed-h">Drones, autonomous systems and counter-drone, kept separate</h2>
              <p className="section__lede">
                {uncrewed.section_intro || 'Selected publicly stated uncrewed-systems rows. In-service, acquisition, development, sovereign program and counter-drone rows are kept separate. This page does not publish a complete ADF drone inventory or readiness data.'}
              </p>
            </div>
          </div>
          <UncrewedSystemsTable rows={uncrewedSystems} data={data}/>
          {uncrewedPrograms.length > 0 && (
            <>
              <div style={{ height: 24 }}/>
              <h3>Domestic / sovereign programs and strategy context</h3>
              <UncrewedProgramsTable rows={uncrewedPrograms} data={data}/>
            </>
          )}
          {uncrewedFunding.length > 0 && (
            <>
              <div style={{ height: 24 }}/>
              <h3>Funding boundaries</h3>
              <UncrewedFundingTable rows={uncrewedFunding} data={data}/>
            </>
          )}
          {uncrewedCaveats.length > 0 && (
            <p className="caption" style={{ marginTop: 16 }}>
              <b>Boundary:</b> {uncrewed.boundary || ''}{' '}
              {uncrewedCaveats.join(' ')}
            </p>
          )}
        </section>

        <section className="section" aria-labelledby="industry-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Sovereign capability and industry</span>
              <h2 id="industry-h">Official industrial resilience context</h2>
              <p className="section__lede">
                These rows show public program and industrial-priority context. They do not
                publish private supply-chain depth, stockpile adequacy or classified facilities.
              </p>
            </div>
          </div>
          <IndustrySection fields={industry}/>
        </section>

        <section className="section" aria-labelledby="alliances-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Alliances and strategic commitments</span>
              <h2 id="alliances-h">Treaties, partnerships and forums are separate</h2>
              <p className="section__lede">
                ANZUS, AUKUS, Five Eyes, Quad and AUSMIN are deliberately not collapsed into
                one alliance blob. Quad is shown as a diplomatic partnership, not a formal alliance.
              </p>
            </div>
          </div>
          <AllianceSection frameworks={frameworks}/>
        </section>

        <section className="section" aria-labelledby="coverage-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Coverage result</span>
              <h2 id="coverage-h">Strong, partial and unavailable areas</h2>
              <p className="section__lede">
                The page is useful where official public sources are strong, and explicit where
                public coverage is partial or blocked.
              </p>
            </div>
          </div>
          <div className="metric-grid metric-grid--3">
            <MetricCard
              eyebrow="Coverage"
              label="Strong sections"
              value={`${strongCoverage}`}
              plain="Budget and alliance/framework rows have the clearest first-pass coverage."
              source="Computed from section_coverage labels in the compiled defence posture envelope."
            />
            <MetricCard
              eyebrow="Coverage"
              label="Partial sections"
              value={`${partialCoverage}`}
              plain="Force structure, selected capabilities and industry context have useful but incomplete public coverage."
              source="Computed from explicit section coverage labels."
            />
            <MetricCard
              eyebrow="Coverage"
              label="Unavailable sections"
              value={`${unavailableCoverage}`}
              plain="Readiness and live posture fields are intentionally unavailable."
              source="No readiness source envelope carries display values."
            />
          </div>
          <div style={{ height: 24 }}/>
          <CoverageTable rows={profile.section_coverage || []}/>
        </section>

        <section className="section section--why" aria-labelledby="method-h">
          <div className="why-grid">
            <div>
              <span className="eyebrow">Methodology</span>
              <h2 id="method-h" style={{ marginTop: 8 }}>Why the page is fail-closed</h2>
            </div>
            <div className="why-body">
              <p>
                Budget, assets, force structure, alliances and sovereign industry are different
                evidence types. A dollar value is not a platform count, a platform count is not
                readiness, and a diplomatic forum is not a mutual defence treaty.
              </p>
              <p>
                Framework rows preserve formal status: treaty, intelligence partnership,
                security and technology partnership, diplomatic forum, or consultation process.
                That prevents vague alliance/treaty mixing.
              </p>
              <p>
                Readiness-sensitive and unavailable fields stay unavailable. The dashboard does
                not estimate mission-capable rates, stockpile depth, classified basing posture
                or live operational availability from public budget or asset rows.
              </p>
              <ul className="gap-list">
                {(profile.methodology_caveats || []).map(item => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </div>
        </section>

        <section className="section section--sources" id="sources" aria-labelledby="sources-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Sources & methodology</span>
              <h2 id="sources-h">Every source envelope used on this page</h2>
              <p className="section__lede">
                Source cards show envelope status, rights and citation. Candidate or sensitive
                areas are documented as gaps instead of being converted into values.
              </p>
            </div>
          </div>
          <div className="sources-grid">
            <SourceSummary id="defence_posture_profiles" env={data.defence_posture_profiles} partial/>
            <SourceSummary id="defence_budget_2026_nds" env={data.defence_budget_2026_nds}/>
            <SourceSummary id="defence_workforce_annual_report_2024_25" env={data.defence_workforce_annual_report_2024_25}/>
            <SourceSummary id="defence_public_capability_assets" env={data.defence_public_capability_assets} partial/>
            <SourceSummary id="defence_alliance_frameworks" env={data.defence_alliance_frameworks} partial/>
            <SourceSummary id="defence_sovereign_industry_context" env={data.defence_sovereign_industry_context} partial/>
            <SourceSummary id="defence_uncrewed_systems" env={data.defence_uncrewed_systems} partial/>
            <SourceSummary id="defence_readiness_gap" env={data.defence_readiness_gap}/>
          </div>
        </section>

        <Footer updated={latestRetrieved ? updatedDisplay : ''}/>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
