// DataCoverage.jsx - per-page source coverage summary.
function DataCoverage({ data, refreshStatus = null }) {
  const c = window.FR.coverage(data);
  const verifiedTotal = c.verified + c.derived;
  const siteRefresh = window.FR.fmtRefreshStatus(refreshStatus);
  const pageRetrieved = window.FR.fmtVerifiedUpdated(window.FR.latestPageRetrieved(data));
  const latestDataPoint = window.FR.latestPageDataPoint(data) || 'No verified source data point loaded yet';
  return (
    <>
      <section className="coverage-strip" aria-label="Data coverage summary">
        <div className="coverage-strip__inner">
          <div>
            <span className="eyebrow">Data coverage</span>
            <p>
              {verifiedTotal} of {c.total} loaded envelopes are verified or derived. {c.awaiting} await source data.
              {' '}Manual means copied from a named public source; derived means calculated or selected from verified envelopes;
              stale means the latest source period is outside its cadence window.
            </p>
          </div>
          <div className="coverage-badges">
            <span className="status-pill status-pill--verified">Verified {c.verified}</span>
            <span className="status-pill status-pill--derived">Derived {c.derived}</span>
            <span className="status-pill status-pill--manual">Manual {c.manual}</span>
            <span className="status-pill status-pill--stale">Stale {c.stale}</span>
            <span className="status-pill status-pill--awaiting">Awaiting {c.awaiting}</span>
          </div>
        </div>
      </section>
      <section className="data-currency" aria-label="Data currency summary">
        <div>
          <span className="eyebrow">Data currency</span>
          <p>
            Refreshed means the automated pipeline last ran successfully. Page data retrieved means the newest
            source envelope loaded by this page. Latest source data point may be older because many government
            datasets are monthly, quarterly or annual.
          </p>
        </div>
        <dl className="data-currency__list">
          <div>
            <dt>Site refreshed</dt>
            <dd>{siteRefresh}</dd>
          </div>
          <div>
            <dt>Page data retrieved</dt>
            <dd>{pageRetrieved}</dd>
          </div>
          <div>
            <dt>Latest source data point</dt>
            <dd>{latestDataPoint}</dd>
          </div>
        </dl>
      </section>
    </>
  );
}

function StatusPill({ env }) {
  const f = window.FR.freshness(env);
  return (
    <span className={`status-pill status-pill--${f.state}`} aria-label={`Data status: ${f.label}`}>
      {f.label}
    </span>
  );
}

Object.assign(window, { DataCoverage, StatusPill });
