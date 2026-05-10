// Header.jsx - shared masthead across dashboard pages.
// Cross-links to sibling dashboards so every page has the same nav.
// Nav is grouped into 6 civic categories so the header stays calm
// regardless of how many dashboards exist. Each top-level group has
// a button that toggles a dropdown panel of the dashboards in that
// category. On narrow viewports the same groups collapse into a
// right-edge drawer triggered by the "Menu" button.
function Header({ active = 'fuel', updated = '', refreshStatus = null }) {
  const groups = [
    {
      id: 'fuel_energy', label: 'Fuel & energy',
      items: [
        { id: 'national_status',         label: 'National status',         href: '../national-status-dashboard/index.html' },
        { id: 'fuel_security',           label: 'National fuel security',  href: '../fuel-security-dashboard/index.html' },
        { id: 'fuel_strategy',           label: 'Fuel strategy',           href: '../australian-fuel-strategy-dashboard/index.html' },
        { id: 'qld_fuel_sovereignty',    label: 'QLD fuel sovereignty',    href: '../qld-fuel-sovereignty-dashboard/index.html' },
        { id: 'fuel',                    label: 'Fuel',                    href: '../fuel-dashboard/index.html' },
        { id: 'oil',                     label: 'Oil & production',        href: '../oil-and-production/index.html' },
        { id: 'power_grid',              label: 'Power grid',              href: '../power-grid-dashboard/index.html' },
      ],
    },
    {
      id: 'food_farms', label: 'Food & farms',
      items: [
        { id: 'fertilizer',              label: 'Food & farms',            href: '../fertilizer-dashboard/index.html' },
      ],
    },
    {
      id: 'economy', label: 'Economy & households',
      items: [
        { id: 'who_pays_what',           label: 'Who pays what',           href: '../who-pays-what/index.html' },
        { id: 'au_economics',            label: 'AU economics',            href: '../au-economics-dashboard/index.html' },
        { id: 'housing_pressure',        label: 'Housing pressure',        href: '../housing-economic-pressure-dashboard/index.html' },
        { id: 'state_contribution',      label: 'State ledger',            href: '../state-contribution-dashboard/index.html' },
        { id: 'resource_value',          label: 'Resource value',          href: '../resource-value-dashboard/index.html' },
      ],
    },
    {
      id: 'defence', label: 'Defence & strategic',
      items: [
        { id: 'defence_posture',         label: 'Defence posture',         href: '../defence-alliances-dashboard/index.html' },
        { id: 'defence_procurement',     label: 'Defence procurement',     href: '../defence-procurement-watch/index.html' },
        { id: 'strategic_resources',     label: 'Strategic resources',     href: '../strategic-resources-dashboard/index.html' },
      ],
    },
    {
      id: 'infrastructure', label: 'Infrastructure & systems',
      items: [
        { id: 'infrastructure',          label: 'Infrastructure',          href: '../infrastructure-dashboard/index.html' },
        { id: 'manufacturing',           label: 'Manufacturing',           href: '../manufacturing-dashboard/index.html' },
        { id: 'brisbane_2032',           label: '2032 readiness',          href: '../brisbane-2032-readiness-dashboard/index.html' },
      ],
    },
    {
      id: 'workforce', label: 'Workforce & data',
      items: [
        { id: 'employment_automation',   label: 'Employment & automation', href: '../employment-automation-dashboard/index.html' },
        { id: 'missing_data',            label: 'Missing data scoreboard', href: '../missing-data-scoreboard/index.html' },
        { id: 'sources',                 label: 'Sources & methodology',   href: '#sources' },
      ],
    },
  ];

  const [openGroup, setOpenGroup] = React.useState(null);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const navRef = React.useRef(null);

  React.useEffect(() => {
    function onDocClick(ev) {
      if (!navRef.current) return;
      if (!navRef.current.contains(ev.target)) setOpenGroup(null);
    }
    function onKey(ev) {
      if (ev.key === 'Escape') { setOpenGroup(null); setSheetOpen(false); }
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  React.useEffect(() => {
    if (sheetOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [sheetOpen]);

  const siteRefresh = window.FR?.fmtRefreshStatus ? window.FR.fmtRefreshStatus(refreshStatus) : '';
  const hasSiteRefresh = refreshStatus?.status === 'success' && refreshStatus?.refreshed_at;
  const stampLabel = refreshStatus
    ? (hasSiteRefresh ? `Refreshed ${siteRefresh}` : siteRefresh)
    : (updated ? `Page data retrieved ${updated}` : '');

  const groupIsActive = (g) => g.items.some(it => it.id === active);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a href="../../index.html" className="brand" aria-label="Fuel Resilience AU home">
          <span className="brand__name">Fuel Resilience AU</span>
        </a>
        <nav ref={navRef} className="site-nav site-nav--grouped" aria-label="Primary">
          {groups.map(g => {
            const isOpen = openGroup === g.id;
            const isActive = groupIsActive(g);
            return (
              <div key={g.id} className={`nav-group${isActive ? ' nav-group--active' : ''}`}>
                <button
                  type="button"
                  className="nav-group__btn"
                  aria-expanded={isOpen ? 'true' : 'false'}
                  aria-haspopup="true"
                  onClick={() => setOpenGroup(isOpen ? null : g.id)}
                >
                  {g.label}
                  <span className="nav-group__caret" aria-hidden>{'▾'}</span>
                </button>
                {isOpen && (
                  <div className="nav-group__panel" role="menu">
                    {g.items.map(it => (
                      <a key={it.id} href={it.href} role="menuitem"
                         className={it.id === active ? 'active' : ''}
                         aria-current={it.id === active ? 'page' : undefined}
                         onClick={() => setOpenGroup(null)}>
                        {it.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        <button
          type="button"
          className="nav-toggle"
          aria-label="Open navigation"
          aria-expanded={sheetOpen ? 'true' : 'false'}
          onClick={() => setSheetOpen(true)}
        >
          Menu
        </button>
        <div className="site-header__right">
          {stampLabel && <span className="stamp" aria-label="Refresh status">{stampLabel}</span>}
        </div>
      </div>
      <div
        className="nav-sheet"
        data-open={sheetOpen ? 'true' : 'false'}
        aria-hidden={sheetOpen ? 'false' : 'true'}
        onClick={(ev) => { if (ev.target === ev.currentTarget) setSheetOpen(false); }}
      >
        <div className="nav-sheet__panel" role="dialog" aria-label="Site navigation">
          <div className="nav-sheet__head">
            <span className="brand__name">Fuel Resilience AU</span>
            <button type="button" className="nav-sheet__close" aria-label="Close navigation" onClick={() => setSheetOpen(false)}>{'×'}</button>
          </div>
          {groups.map(g => (
            <div key={g.id} className="nav-sheet__group">
              <span className="eyebrow">{g.label}</span>
              {g.items.map(it => (
                <a key={it.id} href={it.href}
                   className={it.id === active ? 'active' : ''}
                   aria-current={it.id === active ? 'page' : undefined}
                   onClick={() => setSheetOpen(false)}>
                  {it.label}
                </a>
              ))}
            </div>
          ))}
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
