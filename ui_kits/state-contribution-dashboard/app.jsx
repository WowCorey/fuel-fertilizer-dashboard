const SERIES = [
  'state_resource_contribution_profiles',
  'resource_state_production_aes',
  'resource_gas_origin_aecr',
  'resource_oil_origin_aecr',
  'resource_wa_petroleum_royalty_receipts',
  'resource_qld_petroleum_royalty_receipts',
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

function StateSummaryCard({ profile, production, royalty }) {
  const royaltyValue = latestValue(royalty);
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
            <tr><td>State revenue</td><td className={hasNumber(royaltyValue) ? '' : 'unavail'}>{formatRoyalty(royalty)}</td></tr>
            <tr><td>Federal attribution</td><td className="unavail">{profile.federal_tax_attribution_status}</td></tr>
          </tbody>
        </table>
      </div>
      <footer className="metric-card__foot">
        <span className="metric-card__source">{profile.notes}</span>
      </footer>
    </article>
  );
}

function StateDetailPanel({ profile, production, royalty }) {
  const royaltyValue = latestValue(royalty);
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
      <p className="body-sm"><b>State revenue:</b> {hasNumber(royaltyValue) ? `${formatRoyalty(royalty)} (${valuePeriod(royalty)})` : profile.royalties_label}</p>
      <p className="body-sm"><b>Commonwealth revenue:</b> {profile.federal_tax_note}</p>
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
            <th>Coverage</th>
          </tr>
        </thead>
        <tbody>
          {profiles.map(profile => {
            const production = productionFor(profile, aesRows);
            const royalty = royaltyEnv(profile, data);
            const royaltyValue = latestValue(royalty);
            return (
              <tr key={profile.state_code}>
                <td><b>{profile.state_code}</b><br/>{profile.state_name}</td>
                <td>Crude: {profile.crude_relevance}<br/>Gas: {profile.gas_relevance}<br/>LNG: {profile.lng_relevance}</td>
                <td>{profile.refining_role}<br/>{profile.import_role}</td>
                <td>{production.summary}</td>
                <td className={hasNumber(royaltyValue) ? '' : 'unavail'}>{hasNumber(royaltyValue) ? `${formatRoyalty(royalty)} (${valuePeriod(royalty)})` : profile.royalties_label}</td>
                <td className="unavail">{profile.federal_tax_attribution_status}</td>
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

  return (
    <div className="page">
      <Header active="state_contribution" updated={latestRetrieved ? updatedDisplay : ''}/>

      <main id="main">
        <section className="intro" id="state-contribution">
          <div>
            <span className="eyebrow">State fuel & resource contribution</span>
            <h1 style={{ marginTop: 12 }}>What each state contributes to Australia's fuel and resource system.</h1>
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
                royalty={royaltyEnv(profile, data)}
              />
            ))}
          </div>
        </section>

        <section className="section" aria-labelledby="comparison-h">
          <div className="section__head">
            <div>
              <span className="eyebrow">Comparison table</span>
              <h2 id="comparison-h">State contribution matrix</h2>
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
                royalty={royaltyEnv(profile, data)}
              />
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
                See <a href="../../docs/state-contribution-methodology.md">state contribution methodology</a>
                for the data contract, attribution rules and current source gaps.
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
