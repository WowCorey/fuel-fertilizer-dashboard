const SERIES = [
  'state_resource_contribution_profiles',
  'resource_state_production_aes',
  'resource_gas_origin_aecr',
  'resource_oil_origin_aecr',
  'resource_wa_petroleum_royalty_receipts',
  'resource_qld_petroleum_royalty_receipts',
  'state_nsw_minerals_petroleum_royalty_context',
  'state_nt_mining_petroleum_royalty_context',
  'state_petroleum_ledger_source_gates',
  'state_petroleum_nopta_counts',
  'state_petroleum_production_licence_map',
  'state_oil_gas_major_projects_remp',
  'state_operating_refinery_counts',
  'resource_resource_rent_tax_receipts_budget',
  'resource_prrt_policy',
  'resource_company_tax_rate',
];

const STATE_ORDER = ['WA', 'QLD', 'VIC', 'SA', 'NT', 'NSW', 'TAS', 'ACT'];

function fields(env) {
  return env?.extra?.fields || {};
}

function latestValue(env) {
  if (!env || env.status !== 'ok' || !env.values?.length) return null;
  return env.values.at(-1).v;
}

function valuePeriod(env) {
  return env?.values?.at(-1)?.t || env?.last_data_point || '-';
}

function hasNumber(value) {
  return value !== null && value !== undefined && Number.isFinite(Number(value));
}

function sumLoaded(values) {
  const loaded = values.filter(hasNumber).map(Number);
  return loaded.length ? loaded.reduce((sum, value) => sum + value, 0) : null;
}

function formatNumber(value, digits = 1) {
  if (!hasNumber(value)) return 'Unavailable';
  return Number(value).toLocaleString('en-AU', { maximumFractionDigits: digits });
}

function formatProduction(value, unit) {
  if (!hasNumber(value)) return 'Not loaded';
  return `${formatNumber(value)} ${unit}`;
}

function formatRoyalty(env) {
  const value = latestValue(env);
  if (!hasNumber(value)) return 'Unavailable';
  return `A$${Number(value).toLocaleString('en-AU', { maximumFractionDigits: 1 })}m`;
}

function formatRoyaltyContext(env) {
  const value = latestValue(env);
  if (!hasNumber(value)) return 'Unavailable';
  const scope = fields(env).reported_scope || 'combined context';
  return `A$${Number(value).toLocaleString('en-AU', { maximumFractionDigits: 1 })}m ${scope}`;
}

function coverageKind(label) {
  return String(label || '').toLowerCase().includes('limited') ? 'unavailable' : 'partial';
}

function sourceStatus(env) {
  if (!env || env.status !== 'ok') return 'Awaiting a verified method or value before publication.';
  return `Verified envelope. ${env.values?.length || 0} data point${env.values?.length === 1 ? '' : 's'}; latest ${env.last_data_point || 'unknown'}.`;
}

function productionFor(profile, aesRows) {
  const row = aesRows.find(item => item.state === profile.state_name);
  if (!row) return {
    gasPj: null,
    liquidsMl: null,
    naturalGasMcm: null,
    summary: 'No loaded AES state production row.',
  };
  const gasPj = sumLoaded([row.conventional_gas_pj, row.coal_seam_gas_pj]);
  const liquidsMl = sumLoaded([row.crude_oil_and_ngl_ml, row.naturally_occurring_lpg_ml]);
  const naturalGasMcm = hasNumber(row.natural_gas_mcm) ? Number(row.natural_gas_mcm) : null;
  const bits = [];
  if (hasNumber(gasPj)) bits.push(`${formatNumber(gasPj)} PJ gas`);
  if (hasNumber(liquidsMl)) bits.push(`${formatNumber(liquidsMl)} ML crude/NGL/LPG`);
  return {
    gasPj,
    liquidsMl,
    naturalGasMcm,
    summary: bits.length ? bits.join('; ') : 'No loaded petroleum production value.',
  };
}

function royaltyEnv(profile, data) {
  return profile.royalty_source_id ? data[profile.royalty_source_id] : null;
}

function royaltyContextEnv(profile, data) {
  return profile.royalty_context_source_id ? data[profile.royalty_context_source_id] : null;
}

function revenueDisplay(profile, data) {
  const royalty = royaltyEnv(profile, data);
  const royaltyValue = latestValue(royalty);
  if (hasNumber(royaltyValue)) {
    return {
      text: `${formatRoyalty(royalty)} (${valuePeriod(royalty)})`,
      className: '',
      badge: <TrustBadge kind="observed">Petroleum receipt</TrustBadge>,
    };
  }
  const context = royaltyContextEnv(profile, data);
  const contextValue = latestValue(context);
  if (hasNumber(contextValue)) {
    return {
      text: `${formatRoyaltyContext(context)} (${valuePeriod(context)})`,
      className: '',
      badge: <TrustBadge kind="partial">Combined context</TrustBadge>,
    };
  }
  return {
    text: profile.royalties_label || 'Unavailable',
    className: 'unavail',
    badge: <TrustBadge kind="unavailable"/>,
  };
}

function noptaCoverage(profile, data) {
  const rows = fields(data.state_petroleum_nopta_counts).state_rows || [];
  return rows.find(row => row.state_code === profile.state_code) || null;
}

function refineryCoverage(profile, data) {
  const rows = fields(data.state_operating_refinery_counts).states || [];
  return rows.find(row => row.state_code === profile.state_code) || null;
}

function integerCount(value) {
  if (!hasNumber(value)) return 'Unavailable';
  return Number(value).toLocaleString('en-AU', { maximumFractionDigits: 0 });
}

function objectCoverage(profile, data) {
  const nopta = noptaCoverage(profile, data);
  const refinery = refineryCoverage(profile, data);
  return {
    activeTitles: nopta?.title_records?.active ?? null,
    pendingTitles: nopta?.title_records?.pending_application ?? null,
    productionLicences: (nopta?.title_records?.by_title_type || [])
      .find(row => row.title_type === 'Production Licence')?.count ?? null,
    infrastructureLicences: (nopta?.title_records?.by_title_type || [])
      .find(row => row.title_type === 'Infrastructure Licence')?.count ?? null,
    wellLayerRecords: nopta?.well_records?.total_layer_records ?? null,
    knownPetroleumWellRecords: nopta?.well_records?.known_petroleum_type_records ?? null,
    refineryCount: refinery?.count ?? 0,
    refineryFacilities: refinery?.facilities || [],
  };
}

function productionLicenceSummary(profile, data) {
  const rows = fields(data.state_petroleum_production_licence_map).state_rows || [];
  return rows.find(row => row.state_code === profile.state_code) || null;
}

function rempProjectSummary(profile, data) {
  const rows = fields(data.state_oil_gas_major_projects_remp).state_rows || [];
  return rows.find(row => row.state_code === profile.state_code) || null;
}

function productionMappingRows(data) {
  const noptaRows = fields(data.state_petroleum_production_licence_map).production_licence_rows || [];
  const rempRows = fields(data.state_oil_gas_major_projects_remp).project_rows || [];
  const mappedNopta = noptaRows.map(row => ({
    key: `nopta-${row.title}-${row.field_name || ''}`,
    source: 'NOPTA production licence',
    state_code: row.state_code,
    state_name: row.state_name,
    basin_name: row.basin_name,
    project_name: row.field_name || row.title,
    field_name: row.field_name,
    operator_name: row.title_operator,
    company_name: row.title_holders_raw,
    product_class: row.product_class || 'petroleum',
    metric: 'Active production licence record',
    period: row.production_period || fields(data.state_petroleum_production_licence_map).as_at,
    status: row.status,
    trust: 'Observed',
    caveat: 'Offshore regulatory title mapping; no production volume.',
  }));
  const mappedRemp = rempRows.map(row => ({
    key: `remp-${row.state_code}-${row.project_name}`,
    source: 'REMP oil & gas project',
    state_code: row.state_code,
    state_name: row.state_name,
    basin_name: row.basin_name,
    project_name: row.project_name,
    field_name: row.field_name,
    operator_name: row.operator_name,
    company_name: row.company_name,
    product_class: row.product_class || row.resource,
    metric: hasNumber(row.production_metric_value)
      ? `${formatNumber(row.production_metric_value, 1)} ${row.production_unit || ''} estimated new capacity`
      : 'Estimated new capacity unavailable',
    period: row.production_period,
    status: row.status,
    trust: 'Partial coverage',
    caveat: 'Major-project/development row; not current production.',
  }));
  return [...mappedNopta, ...mappedRemp].filter(row => row.state_code);
}

function ProductionMappingMini({ profile, data }) {
  const licences = productionLicenceSummary(profile, data);
  const remp = rempProjectSummary(profile, data);
  return (
    <div className="caption">
      <b>Active production licence rows:</b> {integerCount(licences?.production_licence_records)}
      <br/>
      <b>REMP oil/gas project rows:</b> {integerCount(remp?.project_rows)}
      <br/>
      <b>Mapped companies/operators:</b> {integerCount((licences?.mapped_operator_records || 0) + (remp?.mapped_company_rows || 0))}
    </div>
  );
}

function ProductionMappingTable({ rows }) {
  return (
    <div className="data-table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>State</th>
            <th>Basin</th>
            <th>Project / field / title</th>
            <th>Operator / company</th>
            <th>Product class</th>
            <th>Metric / period</th>
            <th>Trust</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.key}>
              <td><b>{row.state_code}</b><br/>{row.source}</td>
              <td>{row.basin_name || <span className="unavail">Unavailable</span>}</td>
              <td>{row.project_name || <span className="unavail">Unavailable</span>}<br/><span className="caption">{row.status || ''}</span></td>
              <td>{row.operator_name || row.company_name || <span className="unavail">Unavailable</span>}</td>
              <td>{row.product_class || 'Unavailable'}</td>
              <td>{row.metric}<br/><span className="caption">{row.period || 'Period unavailable'}</span></td>
              <td><TrustBadge kind={row.trust === 'Observed' ? 'observed' : 'partial'}>{row.trust}</TrustBadge><br/><span className="caption">{row.caveat}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProductionMappingDetail({ profile, data }) {
  const rows = productionMappingRows(data).filter(row => row.state_code === profile.state_code);
  if (!rows.length) {
    return (
      <p className="body-sm unavail">
        <b>Production mapping:</b> No project, field or company row is loaded for this state.
      </p>
    );
  }
  return (
    <div style={{ marginTop: 12 }}>
      <p className="body-sm"><b>Loaded production mapping rows:</b> {rows.length}</p>
      <ProductionMappingTable rows={rows}/>
    </div>
  );
}

function ObjectCoverageMini({ profile, data }) {
  const counts = objectCoverage(profile, data);
  return (
    <div className="caption">
      <b>NOPTA active titles:</b> {integerCount(counts.activeTitles)}
      <br/>
      <b>Well-layer records:</b> {integerCount(counts.wellLayerRecords)}
      <br/>
      <b>Operating refineries:</b> {integerCount(counts.refineryCount)}
    </div>
  );
}

function ObjectCoverageDetail({ profile, data }) {
  const counts = objectCoverage(profile, data);
  return (
    <div className="data-table-wrap" style={{ marginTop: 12 }}>
      <table className="data-table">
        <tbody>
          <tr>
            <td>Active NOPTA title records</td>
            <td>{integerCount(counts.activeTitles)} <TrustBadge kind="observed">Observed</TrustBadge></td>
          </tr>
          <tr>
            <td>Pending title applications</td>
            <td>{integerCount(counts.pendingTitles)} <TrustBadge kind="partial">Separate from active</TrustBadge></td>
          </tr>
          <tr>
            <td>Production licence records</td>
            <td>{integerCount(counts.productionLicences)} <TrustBadge kind="observed">Title type</TrustBadge></td>
          </tr>
          <tr>
            <td>Infrastructure licence records</td>
            <td>{integerCount(counts.infrastructureLicences)} <TrustBadge kind="observed">Title type</TrustBadge></td>
          </tr>
          <tr>
            <td>Petroleum Wells layer records</td>
            <td>{integerCount(counts.wellLayerRecords)} <TrustBadge kind="partial">Not active wells</TrustBadge></td>
          </tr>
          <tr>
            <td>Known Type=Petroleum records</td>
            <td>{integerCount(counts.knownPetroleumWellRecords)} <TrustBadge kind="partial">Typed subset</TrustBadge></td>
          </tr>
          <tr>
            <td>Operating refinery count</td>
            <td>{integerCount(counts.refineryCount)} <TrustBadge kind={counts.refineryCount ? 'observed' : 'unavailable'}>{counts.refineryCount ? 'Observed' : 'Unavailable'}</TrustBadge></td>
          </tr>
        </tbody>
      </table>
      {counts.refineryFacilities.length > 0 && (
        <p className="caption"><b>Named refinery facilities:</b> {counts.refineryFacilities.join('; ')}</p>
      )}
    </div>
  );
}

function ObjectCoverageTable({ profiles, data }) {
  return (
    <div className="data-table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>State/territory</th>
            <th>NOPTA active titles</th>
            <th>Production licence records</th>
            <th>Infrastructure licence records</th>
            <th>Petroleum Wells layer records</th>
            <th>Operating refineries</th>
            <th>Unavailable classes</th>
          </tr>
        </thead>
        <tbody>
          {profiles.map(profile => {
            const counts = objectCoverage(profile, data);
            return (
              <tr key={profile.state_code}>
                <td><b>{profile.state_code}</b><br/>{profile.state_name}</td>
                <td>{integerCount(counts.activeTitles)}<br/><TrustBadge kind="observed">Observed</TrustBadge></td>
                <td>{integerCount(counts.productionLicences)}<br/><TrustBadge kind="observed">Title type</TrustBadge></td>
                <td>{integerCount(counts.infrastructureLicences)}<br/><TrustBadge kind="observed">Title type</TrustBadge></td>
                <td>{integerCount(counts.wellLayerRecords)}<br/><TrustBadge kind="partial">Not active wells</TrustBadge></td>
                <td>{integerCount(counts.refineryCount)}<br/><TrustBadge kind={counts.refineryCount ? 'observed' : 'unavailable'}>{counts.refineryCount ? 'Observed' : 'Unavailable'}</TrustBadge></td>
                <td className="unavail">Producing fields; LNG plants/trains; gas processing plants; import/storage terminal counts.</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function SourceCard({ id, env, partial = false }) {
  const meta = env?._meta || {};
  return (
    <article className="source-card">
      <div className="card-status-row">
        <h4>{env?.source_name || id}</h4>
        <EnvTrustBadges env={env} partial={partial}/>
      </div>
      <p className="body-sm">{sourceStatus(env)}</p>
      <p className="caption"><b>Envelope:</b> <span className="mono">{id}</span></p>
      {meta.rights && <p className="caption"><b>Rights:</b> {meta.rights}</p>}
      {meta.citation && <p className="caption"><b>Citation:</b> {meta.citation}</p>}
      {env?.source_url && <a href={env.source_url}>{env.source_url.replace(/^https?:\/\//, '')} <Icon name="external" size={12}/></a>}
    </article>
  );
}

function StateSummaryCard({ profile, production, data }) {
  const revenue = revenueDisplay(profile, data);
  return (
    <article className="metric-card">
      <div className="card-status-row">
        <span className="eyebrow">{profile.state_code}</span>
        <div className="trust-badges">
          <TrustBadge kind="manual"/>
          <TrustBadge kind={coverageKind(profile.source_coverage_label)}>{profile.source_coverage_label}</TrustBadge>
        </div>
      </div>
      <h3 className="metric-card__label">{profile.state_name}</h3>
      <p className="metric-card__plain">{profile.primary_role}</p>
      <div className="data-table-wrap" style={{ marginTop: 12 }}>
        <table className="data-table">
          <tbody>
            <tr><td>Loaded production</td><td>{production.summary}</td></tr>
            <tr><td>State revenue</td><td className={revenue.className}>{revenue.text}</td></tr>
            <tr><td>Federal attribution</td><td className="unavail">{profile.federal_tax_attribution_status}</td></tr>
            <tr><td>Project/company map</td><td className={String(profile.production_mapping_status || '').startsWith('Partial') ? '' : 'unavail'}>{profile.production_mapping_status || 'Unavailable'}</td></tr>
            <tr><td>Mapped production rows</td><td><ProductionMappingMini profile={profile} data={data}/></td></tr>
            <tr><td>Defined counts</td><td><ObjectCoverageMini profile={profile} data={data}/></td></tr>
          </tbody>
        </table>
      </div>
      <footer className="metric-card__foot">
        <span className="metric-card__source">{profile.notes}</span>
      </footer>
    </article>
  );
}

function StateDetailPanel({ profile, production, data }) {
  const revenue = revenueDisplay(profile, data);
  return (
    <article className="source-card">
      <div className="card-status-row">
        <h4>{profile.state_name}</h4>
        <div className="trust-badges">
          <TrustBadge kind="manual"/>
          <TrustBadge kind={coverageKind(profile.source_coverage_label)}>{profile.source_coverage_label}</TrustBadge>
        </div>
      </div>
      <p className="body-sm"><b>Production role:</b> {profile.production_role}</p>
      <p className="body-sm"><b>Loaded production:</b> {production.summary}</p>
      <p className="body-sm"><b>Refining/import role:</b> {profile.refining_role} {profile.import_role}</p>
      <p className="body-sm"><b>State revenue:</b> {revenue.text} {revenue.badge}</p>
      <p className="body-sm"><b>Commonwealth revenue:</b> {profile.federal_tax_note}</p>
      <p className="body-sm"><b>Permit/title counts:</b> {profile.permit_count_status || 'Unavailable'}</p>
      <p className="body-sm"><b>Project/company production:</b> {profile.production_mapping_status || 'Unavailable'}</p>
      <ProductionMappingDetail profile={profile} data={data}/>
      <ObjectCoverageDetail profile={profile} data={data}/>
      <ul className="gap-list">
        {(profile.infrastructure_summary || []).map(item => <li key={item}>{item}</li>)}
      </ul>
    </article>
  );
}

function ComparisonTable({ profiles, data, aesRows }) {
  return (
    <div className="data-table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>State/territory</th>
            <th>Crude/gas/LNG relevance</th>
            <th>Refining/import role</th>
            <th>Loaded production</th>
            <th>State royalties</th>
            <th>Federal revenue status</th>
            <th>Permit/project status</th>
            <th>Coverage</th>
          </tr>
        </thead>
        <tbody>
          {profiles.map(profile => {
            const production = productionFor(profile, aesRows);
            const revenue = revenueDisplay(profile, data);
            return (
              <tr key={profile.state_code}>
                <td><b>{profile.state_code}</b><br/>{profile.state_name}</td>
                <td>Crude: {profile.crude_relevance}<br/>Gas: {profile.gas_relevance}<br/>LNG: {profile.lng_relevance}</td>
                <td>{profile.refining_role}<br/>{profile.import_role}</td>
                <td>{production.summary}</td>
                <td className={revenue.className}>{revenue.text}<br/>{revenue.badge}</td>
                <td className="unavail">{profile.federal_tax_attribution_status}</td>
                <td>{profile.permit_count_status || 'Unavailable'}<br/>{profile.production_mapping_status || 'Unavailable'}</td>
                <td><TrustBadge kind={coverageKind(profile.source_coverage_label)}>{profile.source_coverage_label}</TrustBadge></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function App() {
  const [data, setData] = React.useState(null);
  React.useEffect(() => { window.FR.load(SERIES).then(setData); }, []);

  if (!data) {
    return (
      <div className="page">
        <Header active="state_contribution"/>
        <main id="main"><div className="loading-wrap">Loading source envelopes...</div></main>
      </div>
    );
  }

  const latestRetrieved = window.FR.latestVerifiedRetrieved(data);
  const updatedDisplay = window.FR.fmtVerifiedUpdated(latestRetrieved);
  const profiles = (fields(data.state_resource_contribution_profiles).states || [])
    .slice()
    .sort((a, b) => STATE_ORDER.indexOf(a.state_code) - STATE_ORDER.indexOf(b.state_code));
  const aesFields = fields(data.resource_state_production_aes);
  const aesRows = aesFields.state_rows || [];
  const waRoyalty = latestValue(data.resource_wa_petroleum_royalty_receipts);
  const qldRoyalty = latestValue(data.resource_qld_petroleum_royalty_receipts);
  const loadedRoyaltyTotal = hasNumber(waRoyalty) && hasNumber(qldRoyalty) ? waRoyalty + qldRoyalty : null;
  const statesWithLoadedProduction = profiles.filter(profile => hasNumber(productionFor(profile, aesRows).gasPj) || hasNumber(productionFor(profile, aesRows).liquidsMl)).length;
  const statesWithRoyalty = profiles.filter(profile => hasNumber(latestValue(royaltyEnv(profile, data)))).length;
  const statesWithRevenueContext = profiles.filter(profile => {
    const revenue = revenueDisplay(profile, data);
    return revenue.className !== 'unavail';
  }).length;
  const statesWithActiveTitleRecords = profiles.filter(profile => hasNumber(objectCoverage(profile, data).activeTitles) && objectCoverage(profile, data).activeTitles > 0).length;
  const statesWithWellLayerRecords = profiles.filter(profile => hasNumber(objectCoverage(profile, data).wellLayerRecords) && objectCoverage(profile, data).wellLayerRecords > 0).length;
  const statesWithRefineries = profiles.filter(profile => objectCoverage(profile, data).refineryCount > 0).length;
  const mappedRows = productionMappingRows(data);
  const productionLicenceFields = fields(data.state_petroleum_production_licence_map);
  const rempFields = fields(data.state_oil_gas_major_projects_remp);
  const statesWithProductionLicenceRows = profiles.filter(profile => (productionLicenceSummary(profile, data)?.production_licence_records || 0) > 0).length;
  const statesWithRempRows = profiles.filter(profile => (rempProjectSummary(profile, data)?.project_rows || 0) > 0).length;
  const gateFields = fields(data.state_petroleum_ledger_source_gates);
  const workstreamRows = gateFields.workstreams || [];
  const candidateSources = gateFields.candidate_sources || [];

  return (
    <div className="page">
      <Header active="state_contribution" updated={latestRetrieved ? updatedDisplay : ''}/>

      <main id="main">
        <section className="intro" id="state-contribution">
          <div>
            <span className="eyebrow">State petroleum ledger</span>
            <h1 style={{ marginTop: 12 }}>What each state contributes to Australia's petroleum system.</h1>
            <p className="intro__lede">
              This companion page separates state production and infrastructure roles from public revenue.
              State royalties are not the same as Commonwealth PRRT, company tax, excise or GST. Where a
              source does not publish a defensible state split, the field stays unavailable.
            </p>
          </div>
          <aside className="intro__meta" aria-label="Publication details">
            <strong>Verified data retrieved</strong>
            <span className="mono">{updatedDisplay}</span>
            <div style={{ height: 12 }}/>
            <strong>Rule</strong>
            <span>No state-level federal tax allocation is estimated.</span>
          </aside>
        </section>

        <DataCoverage data={data}/>

        <section className="section section--why">
          <div className="why-grid">
            <div>
              <span className="eyebrow">Read this first</span>
              <h2 style={{ marginTop: 8 }}>What the page shows and what it refuses to guess</h2>
            </div>
            <div className="why-body">
              <p>
                It shows loaded state/territory production rows, qualitative infrastructure roles and the
                state-collected royalty receipts that already exist as verified envelopes.
              </p>
              <p>
                It does not allocate PRRT, company tax, fuel excise or GST by state. Those are Commonwealth
                channels and the loaded sources do not publish a state-attributable receipt table.
              </p>
              <p>
                It also avoids raw "site counts" because that becomes misleading unless a public source defines
                exactly which title, field, terminal, facility or licence is being counted.
              </p>
            </div>
          </div>
        </section>

        <section className="section" aria-labelledby="headline-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Headline coverage</span>
              <h2 id="headline-h">Loaded state coverage, not a complete fiscal map</h2>
              <p className="section__lede">
                These cards summarise the data coverage on this page. They are not estimates of total public value.
              </p>
            </div>
          </div>
          <div className="metric-grid">
            <MetricCard
              eyebrow="Production"
              label="States with loaded petroleum production rows"
              value={`${statesWithLoadedProduction} / ${profiles.length}`}
              plain="AES state rows are loaded for gas and/or liquid petroleum products where the official table provides them."
              source={window.FR.sourceLine(data.resource_state_production_aes)}
            />
            <MetricCard
              eyebrow="State revenue"
              label="States with loaded petroleum royalty receipts"
              value={`${statesWithRoyalty} / ${profiles.length}`}
              plain="WA/North West Shelf and Queensland petroleum royalty receipt context is loaded. Other state revenue stays unavailable."
              source="Source envelopes: resource_wa_petroleum_royalty_receipts; resource_qld_petroleum_royalty_receipts."
            />
            <MetricCard
              eyebrow="Revenue context"
              label="States with any loaded revenue context"
              value={`${statesWithRevenueContext} / ${profiles.length}`}
              plain="Includes petroleum-only receipt envelopes plus clearly marked combined minerals/petroleum context for NSW and NT."
              source="Combined context is not petroleum-only revenue."
            />
            <MetricCard
              eyebrow="Loaded receipts"
              label="WA + Queensland petroleum receipt context"
              value={hasNumber(loadedRoyaltyTotal) ? formatNumber(loadedRoyaltyTotal, 1) : 'Unavailable'}
              unit={hasNumber(loadedRoyaltyTotal) ? 'A$m' : ''}
              plain="Mixed state/public receipt context only; periods and collection channels are shown in source lines."
              source="Not an all-Australia royalty total."
            />
            <MetricCard
              eyebrow="Commonwealth tax"
              label="State-level federal tax attribution"
              value="Unavailable"
              plain="PRRT, company tax, fuel excise and GST are not allocated by state in the loaded sources."
              source="No estimate is published."
            />
            <MetricCard
              eyebrow="Titles"
              label="States with active NOPTA petroleum title records"
              value={`${statesWithActiveTitleRecords} / ${profiles.length}`}
              plain="Counts are current NOPTA non-GHG offshore title/permit records. Pending applications stay separate."
              source={window.FR.sourceLine(data.state_petroleum_nopta_counts)}
            />
            <MetricCard
              eyebrow="Wells layer"
              label="States with Petroleum Wells layer records"
              value={`${statesWithWellLayerRecords} / ${profiles.length}`}
              plain="This is a public feature-layer record count, not an active-producing-well count."
              source="Source envelope: state_petroleum_nopta_counts."
            />
            <MetricCard
              eyebrow="Refineries"
              label="States with operating refinery count"
              value={`${statesWithRefineries} / ${profiles.length}`}
              plain="Official source identifies Ampol Brisbane/Lytton and Viva Energy Geelong as Australia's two operating refineries."
              source={window.FR.sourceLine(data.state_operating_refinery_counts)}
            />
            <MetricCard
              eyebrow="Production mapping"
              label="Mapped NOPTA active production licence rows"
              value={formatNumber(latestValue(data.state_petroleum_production_licence_map), 0)}
              plain={`${statesWithProductionLicenceRows} states/territories have active offshore production-licence rows with basin, field and title-operator metadata.`}
              source={window.FR.sourceLine(data.state_petroleum_production_licence_map)}
            />
            <MetricCard
              eyebrow="Major projects"
              label="Mapped REMP oil and gas project rows"
              value={formatNumber(latestValue(data.state_oil_gas_major_projects_remp), 0)}
              plain={`${statesWithRempRows} states have REMP oil/gas project-company rows. Capacity fields are not current production.`}
              source={window.FR.sourceLine(data.state_oil_gas_major_projects_remp)}
            />
          </div>
        </section>

        <section className="section" aria-labelledby="state-cards-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">State summaries</span>
              <h2 id="state-cards-h">Production, infrastructure and revenue boundaries</h2>
            </div>
          </div>
          <div className="metric-grid metric-grid--4">
            {profiles.map(profile => (
              <StateSummaryCard
                key={profile.state_code}
                profile={profile}
                production={productionFor(profile, aesRows)}
                data={data}
              />
            ))}
          </div>
        </section>

        <section className="section" aria-labelledby="mapping-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Production mapping</span>
              <h2 id="mapping-h">State to basin to project/company, where sources publish it</h2>
              <p className="section__lede">
                NOPTA rows map active offshore production licences to basin, field and title operator.
                REMP rows map oil and gas major projects to company, state, resource and estimated new capacity.
                Neither source is a complete company production-volume table.
              </p>
            </div>
          </div>
          <ProductionMappingTable rows={mappedRows}/>
          <p className="caption" style={{ marginTop: 12 }}>
            NOPTA source scope: {productionLicenceFields.source_scope}. REMP caveat: {rempFields.source_period_note}
          </p>
        </section>

        <section className="section" aria-labelledby="objects-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Defined object counts</span>
              <h2 id="objects-h">Separate petroleum object classes, not one vague site count</h2>
              <p className="section__lede">
                NOPTA title, licence and well-layer records are shown separately from refinery facilities.
                Producing fields, LNG trains, processing plants and terminal counts remain unavailable until
                a source defines those objects cleanly by state.
              </p>
            </div>
          </div>
          <ObjectCoverageTable profiles={profiles} data={data}/>
        </section>

        <section className="section" aria-labelledby="comparison-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Comparison table</span>
              <h2 id="comparison-h">State petroleum ledger matrix</h2>
              <p className="section__lede">
                The table keeps production, infrastructure context, state revenue and Commonwealth tax attribution
                in separate columns so the page does not blur collection channels.
              </p>
            </div>
          </div>
          <ComparisonTable profiles={profiles} data={data} aesRows={aesRows}/>
        </section>

        <section className="section" aria-labelledby="details-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">State detail</span>
              <h2 id="details-h">What is known, and what remains unavailable</h2>
            </div>
          </div>
          <div className="source-grid">
            {profiles.map(profile => (
              <StateDetailPanel
                key={profile.state_code}
                profile={profile}
                production={productionFor(profile, aesRows)}
                data={data}
              />
            ))}
          </div>
        </section>

        <section className="section" aria-labelledby="gates-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Source gates</span>
              <h2 id="gates-h">What the national petroleum ledger can and cannot publish yet</h2>
              <p className="section__lede">
                This table records the seven target workstreams. Blocked rows remain explicit instead of being turned
                into weak counts, live maps or status labels.
              </p>
            </div>
          </div>
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Workstream</th>
                  <th>Status</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {workstreamRows.map(row => (
                  <tr key={row.id}>
                    <td><b>{row.id}. {row.name}</b></td>
                    <td><TrustBadge kind={row.trust_label === 'Unavailable' ? 'unavailable' : 'partial'}>{row.trust_label}</TrustBadge><br/><span className="mono">{row.status}</span></td>
                    <td>{row.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="source-grid" style={{ marginTop: 20 }}>
            {candidateSources.map(source => (
              <article className="source-card" key={`${source.source}-${source.decision}`}>
                <div className="card-status-row">
                  <h4>{source.source}</h4>
                  <TrustBadge kind={String(source.decision).includes('blocked') ? 'unavailable' : 'partial'}>{source.decision}</TrustBadge>
                </div>
                <p className="body-sm"><b>Publisher:</b> {source.publisher}</p>
                <p className="body-sm"><b>Supports:</b> {source.supports}</p>
                <p className="caption">{source.caveat}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section section--why" aria-labelledby="method-h">
          <div className="why-grid">
            <div>
              <span className="eyebrow">Methodology</span>
              <h2 id="method-h" style={{ marginTop: 8 }}>Why federal tax stays national-only here</h2>
            </div>
            <div className="why-body">
              <p>
                Royalties are easier to attribute because state budget papers can publish named petroleum
                royalty or North West Shelf receipt lines. Commonwealth taxes are collected under different
                legal channels and are usually published nationally, by taxpayer, or by project concept.
              </p>
              <p>
                Allocating Commonwealth receipts to a state by production volume, company address, port,
                project geography or consumer spend would be a model. This first-pass page only publishes
                observed public rows and explicitly unavailable fields.
              </p>
              <p>
                See <a href="../../docs/state-contribution-methodology.md">state petroleum ledger methodology</a>
                for the data contract, source gates, attribution rules and current source gaps.
              </p>
            </div>
          </div>
        </section>

        <section className="section section--sources" id="sources" aria-labelledby="sources-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Sources & methodology</span>
              <h2 id="sources-h">Every source used on this page</h2>
              <p className="section__lede">
                Source cards show what is actually loaded. Unavailable rows remain unavailable until a named source
                publishes the exact field, period and unit needed.
              </p>
            </div>
          </div>
          <div className="source-grid">
            <SourceCard id="state_resource_contribution_profiles" env={data.state_resource_contribution_profiles} partial/>
            <SourceCard id="resource_state_production_aes" env={data.resource_state_production_aes} partial/>
            <SourceCard id="resource_gas_origin_aecr" env={data.resource_gas_origin_aecr} partial/>
            <SourceCard id="resource_oil_origin_aecr" env={data.resource_oil_origin_aecr} partial/>
            <SourceCard id="resource_wa_petroleum_royalty_receipts" env={data.resource_wa_petroleum_royalty_receipts} partial/>
            <SourceCard id="resource_qld_petroleum_royalty_receipts" env={data.resource_qld_petroleum_royalty_receipts} partial/>
            <SourceCard id="state_nsw_minerals_petroleum_royalty_context" env={data.state_nsw_minerals_petroleum_royalty_context} partial/>
            <SourceCard id="state_nt_mining_petroleum_royalty_context" env={data.state_nt_mining_petroleum_royalty_context} partial/>
            <SourceCard id="state_petroleum_ledger_source_gates" env={data.state_petroleum_ledger_source_gates} partial/>
            <SourceCard id="state_petroleum_nopta_counts" env={data.state_petroleum_nopta_counts} partial/>
            <SourceCard id="state_petroleum_production_licence_map" env={data.state_petroleum_production_licence_map} partial/>
            <SourceCard id="state_oil_gas_major_projects_remp" env={data.state_oil_gas_major_projects_remp} partial/>
            <SourceCard id="state_operating_refinery_counts" env={data.state_operating_refinery_counts} partial/>
            <SourceCard id="resource_resource_rent_tax_receipts_budget" env={data.resource_resource_rent_tax_receipts_budget}/>
            <SourceCard id="resource_prrt_policy" env={data.resource_prrt_policy}/>
            <SourceCard id="resource_company_tax_rate" env={data.resource_company_tax_rate}/>
          </div>
        </section>
      </main>
      <Footer/>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
