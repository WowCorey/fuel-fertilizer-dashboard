// Header.jsx — thin fixed masthead with section nav + download
function Header({ active = 'fuel' }) {
  const nav = [
    { id: 'fuel', label: 'Fuel' },
    { id: 'fert', label: 'Fertilizer', soon: true },
    { id: 'sources', label: 'Sources & methodology' },
  ];
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a href="#" className="brand" aria-label="Fuel Resilience AU — home">
          <span className="brand__name">Fuel Resilience AU</span>
        </a>
        <nav className="site-nav" aria-label="Primary">
          {nav.map(n => (
            <a key={n.id} href={`#${n.id}`} className={n.id === active ? 'active' : ''} aria-current={n.id === active ? 'page' : undefined}>
              {n.label}{n.soon && <span className="site-nav__soon">v1.1</span>}
            </a>
          ))}
        </nav>
        <div className="site-header__right">
          <span className="stamp" aria-label="Last updated">Updated 18 Apr 2026 · 09:00 AEST</span>
          <button className="btn btn-secondary" type="button">
            <Icon name="download" size={16} /> Download data
          </button>
        </div>
      </div>
    </header>
  );
}

// Icon.jsx — inline Lucide-style paths, 1.5px stroke, currentColor
function Icon({ name, size = 20 }) {
  const paths = {
    download: <path d="M12 5v14M5 12l7 7 7-7"/>,
    external: <><path d="M7 17L17 7"/><path d="M7 7h10v10"/></>,
    info:     <><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/></>,
    filter:   <path d="M3 6h18M6 12h12M10 18h4"/>,
    chevron:  <path d="M7 10l5 5 5-5"/>,
    search:   <><circle cx="11" cy="11" r="7"/><path d="M21 21l-5-5"/></>,
    up:       <path d="M12 19V5M5 12l7-7 7 7"/>,
    down:     <path d="M12 5v14M5 12l7 7 7-7"/>,
    minus:    <path d="M5 12h14"/>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {paths[name]}
    </svg>
  );
}

Object.assign(window, { Header, Icon });
