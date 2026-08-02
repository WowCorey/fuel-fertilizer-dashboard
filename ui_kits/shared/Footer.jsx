// Footer.jsx - shared footer across all dashboards.
function Footer({ updated = '', refreshStatus = null }) {
  const siteRefresh = window.FR?.fmtRefreshStatus ? window.FR.fmtRefreshStatus(refreshStatus) : 'Refresh status unavailable';
  const pageRetrieved = updated || 'No verified page data loaded yet';
  const dashboardRoutes = (window.SITE_ROUTES?.routes || [])
    .filter(route => route.public && route.id !== 'home');
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__col">
          <span className="eyebrow">About</span>
          <p className="site-footer__disclaimer">
            <strong>Independent public-source prototype. Not an official government dashboard.</strong>
            {' '}Fuel Resilience AU is built from public data and is not affiliated with any
            government department or industry body. Project code, prose and metadata are
            maintained in this repository; upstream source data remains under the rights and
            terms listed in <a href="../../data/sources.yml">data/sources.yml</a>.
          </p>
        </div>
        <div className="site-footer__col">
          <span className="eyebrow">Dashboards</span>
          <ul>
            {dashboardRoutes.map(route => (
              <li key={route.id}><a href={`../../${route.relative_url}`}>{route.nav_label}</a></li>
            ))}
          </ul>
        </div>
        <div className="site-footer__col">
          <span className="eyebrow">Data</span>
          <ul>
            <li><a href="#sources">All sources &amp; methodology</a></li>
            <li><a href="../../data/sources.yml">Source registry (YAML)</a></li>
          </ul>
        </div>
        <div className="site-footer__col">
          <span className="eyebrow">Contact</span>
          <ul>
            <li><a href="https://github.com/WowCorey/fuel-fertilizer-dashboard/issues">Report an error</a></li>
            <li><a href="https://github.com/WowCorey/fuel-fertilizer-dashboard/issues">Suggest a dataset</a></li>
          </ul>
        </div>
      </div>
      <div className="site-footer__base">
        <span className="caption">Code MIT - Project metadata/prose CC BY 4.0 - Upstream data rights remain with publishers</span>
        <span className="caption mono">Site refresh: {siteRefresh} - Page data retrieved: {pageRetrieved}</span>
      </div>
    </footer>
  );
}

Object.assign(window, { Footer });
