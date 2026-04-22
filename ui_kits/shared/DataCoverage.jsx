// DataCoverage.jsx - per-page source coverage summary.
function DataCoverage({ data }) {
  const c = window.FR.coverage(data);
  const verifiedTotal = c.verified + c.derived;
  return (
    <section className="coverage-strip" aria-label="Data coverage summary">
      <div className="coverage-strip__inner">
        <div>
          <span className="eyebrow">Data coverage</span>
          <p>
            {verifiedTotal} of {c.total} loaded envelopes are verified or derived. {c.awaiting} await source data.
            {' '}Verified means copied or fetched from a named source; derived means calculated from verified envelopes;
            stale means the latest source period is outside its cadence window.
          </p>
        </div>
        <div className="coverage-badges">
          <span className="status-pill status-pill--verified">Verified {c.verified}</span>
          <span className="status-pill status-pill--derived">Derived {c.derived}</span>
          <span className="status-pill status-pill--stale">Stale {c.stale}</span>
          <span className="status-pill status-pill--awaiting">Awaiting {c.awaiting}</span>
        </div>
      </div>
    </section>
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
