// Header.jsx — shared masthead across all four dashboards.
// Cross-links to sibling dashboards so every page has the same nav.
function Header({ active = 'fuel', updated = '' }) {
  const nav = [
    { id: 'wallboard',     label: 'Wallboard',             href: '../wallboard/index.html' },
    { id: 'fuel',          label: 'Fuel',                  href: '../fuel-dashboard/index.html' },
    { id: 'fertilizer',    label: 'Fertilizer',            href: '../fertilizer-dashboard/index.html' },
    { id: 'oil',           label: 'Oil & production',      href: '../oil-and-production/index.html' },
    { id: 'who_pays_what', label: 'Who pays what',         href: '../who-pays-what/index.html' },
    { id: 'sources',       label: 'Sources & methodology', href: '#sources' },
  ];
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a href="../fuel-dashboard/index.html" className="brand" aria-label="Fuel Resilience AU — home">
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
          {updated && <span className="stamp" aria-label="Last updated">Updated {updated}</span>}
        </div>
      </div>
    </header>
  );
}

// Shared icon set — Lucide-style, 1.5px stroke, currentColor.
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
