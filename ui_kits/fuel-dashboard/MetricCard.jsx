// MetricCard.jsx — headline metric presentation
function MetricCard({
  eyebrow,
  label,
  value,
  unit,
  delta,          // { dir: 'up'|'down'|'flat', text: '...' }
  threshold,      // { state: 'below'|'above'|'near', text: '...' }
  source,         // '...'
  plain,          // plain-English one-liner, shown below label
  sample,         // true = watermark the card as "sample data — replace with live feed"
  highlight,
  jargonHint,     // { term, definition } — adds an info affordance on the term
}) {
  const glyph = delta?.dir === 'up' ? '▲' : delta?.dir === 'down' ? '▼' : '—';
  return (
    <article className={`metric-card ${highlight ? 'metric-card--highlight' : ''}`}
      aria-label={`${label}: ${value}${unit || ''}`}>
      {sample && <span className="sample-tag" aria-label="Sample data, replace with live feed">Sample data</span>}
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h3 className="metric-card__label">
        {jargonHint ? (
          <>
            {label.replace(jargonHint.term, '')}
            <span className="jargon" tabIndex="0" aria-label={`${jargonHint.term}: ${jargonHint.definition}`}>
              {jargonHint.term}
              <span className="jargon__tip" role="tooltip">{jargonHint.definition}</span>
            </span>
          </>
        ) : label}
      </h3>
      {plain && <p className="metric-card__plain">{plain}</p>}
      <div className="metric-card__row">
        <span className="metric-numeral">{value}</span>
        {unit && <span className="metric-unit">{unit}</span>}
      </div>
      {delta && (
        <div className={`delta ${delta.dir}`} aria-label={`Change: ${delta.text}`}>
          <span className="delta__glyph" aria-hidden>{glyph}</span>
          <span>{delta.text}</span>
        </div>
      )}
      <footer className="metric-card__foot">
        {threshold && (
          <span className={`threshold threshold--${threshold.state}`}>
            {threshold.text}
          </span>
        )}
        {source && <span className="metric-card__source">{source}</span>}
      </footer>
    </article>
  );
}

Object.assign(window, { MetricCard });
