// InsightFeed.jsx — "What changed this month"
function InsightFeed({ items }) {
  return (
    <section className="insight-feed">
      <header className="insight-feed__head">
        <span className="eyebrow">This month</span>
        <h2>What changed</h2>
        <p className="body-sm insight-feed__lede">
          Plain-language notes on movements in the data, written by the research desk.
          Links lead to the underlying source.
        </p>
      </header>
      <ol className="insight-list">
        {items.map((it, i) => (
          <li key={i} className="insight-item">
            <span className="insight-item__date">{it.date}</span>
            <span className="insight-item__body">
              {it.body}{' '}
              {it.link && <a href={it.link.href}>{it.link.text} <Icon name="external" size={14}/></a>}
            </span>
            <span className={`insight-item__tag insight-item__tag--${it.tagKind}`}>{it.tag}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

// Footer.jsx — sources, methodology, links
function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__col">
          <span className="eyebrow">About</span>
          <p className="body-sm">
            Fuel Resilience AU is a public-interest dashboard. Not affiliated with any
            government department or industry body. Data is compiled from official
            Australian and international public sources and released under CC BY 4.0.
          </p>
        </div>
        <div className="site-footer__col">
          <span className="eyebrow">Data</span>
          <ul>
            <li><a href="#sources">All sources &amp; methodology</a></li>
            <li><a href="#">Download monthly data (CSV)</a></li>
            <li><a href="#">Changelog</a></li>
          </ul>
        </div>
        <div className="site-footer__col">
          <span className="eyebrow">Coming</span>
          <ul>
            <li>Fertilizer dashboard · v1.1</li>
            <li>Supply-chain indicators · later</li>
          </ul>
        </div>
        <div className="site-footer__col">
          <span className="eyebrow">Contact</span>
          <ul>
            <li><a href="#">Report an error</a></li>
            <li><a href="#">Suggest a dataset</a></li>
          </ul>
        </div>
      </div>
      <div className="site-footer__base">
        <span className="caption">© 2026 · Released under CC BY 4.0</span>
        <span className="caption mono">Last updated 18 Apr 2026 · 09:00 AEST</span>
      </div>
    </footer>
  );
}

Object.assign(window, { InsightFeed, Footer });
