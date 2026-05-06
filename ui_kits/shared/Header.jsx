// Header.jsx - shared masthead across dashboard pages.
// Cross-links to sibling dashboards so every page has the same nav.
function Header({ active = 'fuel', updated = '', refreshStatus = null }) {
  const nav = [
    { id: 'national_status', label: 'National status',      href: '../national-status-dashboard/index.html' },
    { id: 'fuel_security',   label: 'National fuel security', href: '../fuel-security-dashboard/index.html' },
    { id: 'resource_value',  label: 'Resource value',       href: '../resource-value-dashboard/index.html' },
    { id: 'state_contribution', label: 'State ledger', href: '../state-contribution-dashboard/index.html' },
    { id: 'strategic_resources', label: 'Strategic resources', href: '../strategic-resources-dashboard/index.html' },
    { id: 'defence_posture', label: 'Defence posture', href: '../defence-alliances-dashboard/index.html' },
    { id: 'fuel',          label: 'Fuel',                  href: '../fuel-dashboard/index.html' },
    { id: 'fertilizer',    label: 'Food & farms',          href: '../fertilizer-dashboard/index.html' },
    { id: 'oil',           label: 'Oil & production',      href: '../oil-and-production/index.html' },
    { id: 'who_pays_what', label: 'Who pays what',         href: '../who-pays-what/index.html' },
    { id: 'au_economics',  label: 'AU economics',          href: '../au-economics-dashboard/index.html' },
    { id: 'manufacturing', label: 'Manufacturing',         href: '../manufacturing-dashboard/index.html' },
    { id: 'power_grid',    label: 'Power grid',            href: '../power-grid-dashboard/index.html' },
    { id: 'infrastructure',label: 'Infrastructure',        href: '../infrastructure-dashboard/index.html' },
    { id: 'employment_automation', label: 'Employment', href: '../employment-automation-dashboard/index.html' },
    { id: 'missing_data', label: 'Missing data', href: '../missing-data-scoreboard/index.html' },
    { id: 'sources',       label: 'Sources & methodology', href: '#sources' },
  ];
  const siteRefresh = window.FR?.fmtRefreshStatus ? window.FR.fmtRefreshStatus(refreshStatus) : '';
  const hasSiteRefresh = refreshStatus?.status === 'success' && refreshStatus?.refreshed_at;
  const stampLabel = refreshStatus
    ? (hasSiteRefresh ? `Refreshed ${siteRefresh}` : siteRefresh)
    : (updated ? `Page data retrieved ${updated}` : '');
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a href="../../index.html" className="brand" aria-label="Fuel Resilience AU home">
          <span className="brand__name">Fuel Resilience AU</span>
        </a>
        <nav className="site-nav" aria-label="Primary">
          {nav.map(n => (
            <a key={n.id} href={n.href}
               className={n.id === active ? 'active' : ''}
               aria-current={n.id === active ? 'page' : undefined}>
              {n.label}
            </a>
          ))}
        </nav>
        <div className="site-header__right">
          {stampLabel && <span className="stamp" aria-label="Refresh status">{stampLabel}</span>}
        </div>
      </div>
    </header>
  );
}

// Shared icon set - Lucide-style, 1.5px stroke, currentColor.
function Icon({ name, size = 20 }) {
  const paths = {
    download: <path d="M12 5v14M5 12l7 7 7-7"/>,
    external: <><path d="M7 17L17 7"/><path d="M7 7h10v10"/></>,
    info:     <><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/></>,
    chevron:  <path d="M7 10l5 5 5-5"/>,
    up:       <path d="M12 19V5M5 12l7-7 7 7"/>,
    down:     <path d="M12 5v14M5 12l7 7 7-7"/>,
    minus:    <path d="M5 12h14"/>,
    alert:    <><path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18h.01"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {paths[name]}
    </svg>
  );
}

Object.assign(window, { Header, Icon });
