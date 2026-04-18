// InsightFeed.jsx — "What changed" column, shared across dashboards.
function InsightFeed({ items, title = 'What changed', lede }) {
  if (!items || items.length === 0) {
    return (
      <section className="insight-feed">
        <header className="insight-feed__head">
          <span className="eyebrow">This month</span>
          <h2>{title}</h2>
          <p className="body-sm insight-feed__lede">
            Nothing new to report from the publisher release notes this cycle.
          </p>
        </header>
      </section>
    );
  }
  return (
    <section className="insight-feed">
      <header className="insight-feed__head">
        <span className="eyebrow">This month</span>
        <h2>{title}</h2>
        {lede && <p className="body-sm insight-feed__lede">{lede}</p>}
      </header>
      <ol className="insight-list">
        {items.map((it, i) => (
          <li key={i} className="insight-item">
            <span className="insight-item__date">{it.date}</span>
            <span className="insight-item__body">
              {it.body}{' '}
              {it.link && <a href={it.link.href}>{it.link.text} <Icon name="external" size={14}/></a>}
            </span>
            {it.tag && (
              <span className={`insight-item__tag insight-item__tag--${it.tagKind || 'imports'}`}>{it.tag}</span>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}

Object.assign(window, { InsightFeed });
