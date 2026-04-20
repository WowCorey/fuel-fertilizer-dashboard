// Footer.jsx - shared footer across all dashboards.
function Footer({ updated = '' }) {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__col">
          <span className="eyebrow">About</span>
          <p className="body-sm">
            Fuel Resilience AU is a public-interest dashboard. Not affiliated with any
            government department or industry body. Project code, prose and metadata are
            maintained here; upstream source data remains under the rights and terms listed
            in data/sources.yml.
          </p>
        </div>
        <div className="site-footer__col">
          <span className="eyebrow">Dashboards</span>
          <ul>
            <li><a href="../wallboard/index.html">Wallboard</a></li>
            <li><a href="../fuel-dashboard/index.html">Fuel</a></li>
            <li><a href="../fertilizer-dashboard/index.html">Fertilizer</a></li>
            <li><a href="../oil-and-production/index.html">Oil &amp; production</a></li>
            <li><a href="../who-pays-what/index.html">Who pays what</a></li>
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
        <span className="caption">Code MIT · Project metadata/prose CC BY 4.0 · Upstream data rights remain with publishers</span>
        {updated && <span className="caption mono">Last updated {updated}</span>}
      </div>
    </footer>
  );
}

Object.assign(window, { Footer });
