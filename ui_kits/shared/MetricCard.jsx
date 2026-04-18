// MetricCard.jsx — shared headline metric, now with envelope-aware variant.
//
// Two call styles:
//   <MetricCard label=".." value=".." unit=".." source=".."/>
//   <MetricCard fromEnvelope={env} label=".." plain=".." valueFn={e => e.values.at(-1).v}/>
//
// If the envelope is unavailable (status !== 'ok' or values empty), the card
// automatically renders a "Source unavailable — awaiting data" placeholder
// pointing at the publisher URL.
function MetricCard({
  eyebrow, label, value, unit, delta, threshold, source,
  plain, highlight, jargonHint,
  fromEnvelope, valueFn, unitFn,
}) {
  // Envelope-aware path — resolves value/source from the JSON envelope.
  if (fromEnvelope !== undefined) {
    const env = fromEnvelope;
    const unavailable = !env || env.status !== 'ok' || !env.values || env.values.length === 0;
    if (unavailable) {
      return (
        <article className="metric-card metric-card--unavailable"
          aria-label={`${label}: source unavailable`}>
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h3 className="metric-card__label">{label}</h3>
          <p className="metric-card__plain">Source unavailable — awaiting data.</p>
          <div className="metric-card__unavail">
            <Icon name="alert" size={18}/>
            <span>We will not publish a number here until it can be verified from the named source.</span>
          </div>
          <footer className="metric-card__foot">
            {env && env.source_url && (
              <a href={env.source_url} className="metric-card__source">
                {env.source_name || 'Publisher'} <Icon name="external" size={12}/>
              </a>
            )}
          </footer>
        </article>
      );
    }
    value = valueFn ? valueFn(env) : env.values.at(-1).v;
    unit  = unitFn  ? unitFn(env)  : unit || '';
    source = window.FR.sourceLine(env);
  }

  const glyph = delta?.dir === 'up' ? '▲' : delta?.dir === 'down' ? '▼' : '—';
  return (
    <article className={`metric-card ${highlight ? 'metric-card--highlight' : ''}`}
      aria-label={`${label}: ${value}${unit || ''}`}>
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
