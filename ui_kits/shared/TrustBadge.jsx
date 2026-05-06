// TrustBadge.jsx - explicit provenance/status labels for public-facing panels.
function TrustBadge({ kind, children }) {
  const key = String(kind || 'observed').toLowerCase().replace(/\s+/g, '-');
  const labels = {
    observed: 'Observed',
    derived: 'Derived',
    scenario: 'Scenario',
    estimated: 'Estimated',
    manual: 'Manual',
    stale: 'Stale',
    unavailable: 'Unavailable',
    partial: 'Partial coverage',
    'source-gated': 'Source-gated',
    roadmap: 'Roadmap',
  };
  return (
    <span className={`trust-badge trust-badge--${key}`}>
      {children || labels[key] || kind}
    </span>
  );
}

function EnvTrustBadges({ env, partial = false }) {
  if (!env || env.status !== 'ok') {
    return <div className="trust-badges"><TrustBadge kind="unavailable"/></div>;
  }
  const f = window.FR.freshness(env);
  const badges = [];
  if (env._meta?.fetch === 'derived') {
    badges.push(<TrustBadge key="derived" kind="derived"/>);
  } else {
    badges.push(<TrustBadge key="observed" kind="observed"/>);
  }
  if (env.manual_entry || env.extra?.fields?.parent_manual_entry) badges.push(<TrustBadge key="manual" kind="manual"/>);
  if (f.state === 'stale') badges.push(<TrustBadge key="stale" kind="stale"/>);
  if (partial) badges.push(<TrustBadge key="partial" kind="partial"/>);
  return <div className="trust-badges">{badges}</div>;
}

Object.assign(window, { TrustBadge, EnvTrustBadges });
