// ChartCard.jsx — shared time-series card with takeaway, source line, a11y.
//
// Envelope-aware: pass {fromEnvelope: env} and the card will either plot
// env.values or render a "Source unavailable — awaiting data" placeholder.
function ChartCard({
  title, eyebrow, unit, series, baseline, baselineLabel,
  ranges = ['1Y','3Y','5Y','Max'], defaultRange = '3Y',
  accent = '#1F3A8A',
  takeaway,
  sourceLine,
  yAxisLabel,
  description,
  fromEnvelope,
  unitFormatter,  // (v) => string — custom axis label formatter
}) {
  // Envelope handling
  if (fromEnvelope !== undefined) {
    const env = fromEnvelope;
    const unavailable = !env || env.status !== 'ok' || !env.values || env.values.length === 0;
    if (unavailable) {
      return (
        <article className="chart-card chart-card--unavailable" aria-label={`${title}: source unavailable`}>
          <header className="chart-card__head">
            <div>
              <div className="card-status-row">
                {eyebrow && <span className="eyebrow">{eyebrow}</span>}
                {window.StatusPill && <StatusPill env={env}/>}
              </div>
              <h3 className="chart-card__title">{title}</h3>
            </div>
          </header>
          <p className="chart-card__takeaway">Source unavailable — awaiting data.</p>
          <div className="chart-unavail">
            <Icon name="alert" size={18}/>
            <span>This chart will be populated when values can be verified from the named source.</span>
          </div>
          {env && env.source_url && (
            <p className="chart-card__source">
              <a href={env.source_url}>{env.source_name || 'Publisher'} <Icon name="external" size={12}/></a>
            </p>
          )}
        </article>
      );
    }
    series = env.values;
    sourceLine = sourceLine || window.FR.sourceLine(env);
    unit = unit || env.unit || '';
  }

  const [range, setRange] = React.useState(defaultRange);
  const [hoverIdx, setHoverIdx] = React.useState(null);

  const data = React.useMemo(() => {
    if (!series) return [];
    if (range === '1Y') return series.slice(-12);
    if (range === '3Y') return series.slice(-36);
    if (range === '5Y') return series.slice(-60);
    return series;
  }, [range, series]);

  const W = 640, H = 240, padL = 64, padR = 16, padT = 24, padB = 36;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;

  const ys = data.map(d => d.v);
  const yMin = Math.min(...ys, baseline ?? Infinity) * 0.95;
  const yMax = Math.max(...ys, baseline ?? -Infinity) * 1.05;

  const x = i => data.length <= 1 ? padL : padL + (i / (data.length - 1)) * innerW;
  const y = v => padT + innerH - ((v - yMin) / (yMax - yMin || 1)) * innerH;

  const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i)},${y(d.v)}`).join(' ');
  const areaPath = data.length
    ? `${linePath} L${x(data.length - 1)},${padT + innerH} L${padL},${padT + innerH} Z`
    : '';

  const yTicks = 4;
  const yTickVals = Array.from({ length: yTicks + 1 }, (_, i) => yMin + ((yMax - yMin) * i) / yTicks);

  const svgRef = React.useRef(null);
  const onMove = e => {
    const r = svgRef.current.getBoundingClientRect();
    const mx = ((e.clientX - r.left) / r.width) * W;
    if (mx < padL || mx > W - padR) { setHoverIdx(null); return; }
    const i = Math.round(((mx - padL) / innerW) * (data.length - 1));
    setHoverIdx(Math.max(0, Math.min(data.length - 1, i)));
  };
  const onKey = e => {
    if (hoverIdx == null) { setHoverIdx(data.length - 1); return; }
    if (e.key === 'ArrowLeft')  { setHoverIdx(Math.max(0, hoverIdx - 1)); e.preventDefault(); }
    if (e.key === 'ArrowRight') { setHoverIdx(Math.min(data.length - 1, hoverIdx + 1)); e.preventDefault(); }
    if (e.key === 'Escape')     { setHoverIdx(null); }
  };

  const hover = hoverIdx != null ? data[hoverIdx] : null;
  const fmt = unitFormatter || defaultFmt;

  return (
    <article className="chart-card" aria-labelledby={`ch-${title.replace(/\s+/g,'-')}`}>
      <header className="chart-card__head">
        <div>
          <div className="card-status-row">
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            {fromEnvelope !== undefined && window.StatusPill && <StatusPill env={fromEnvelope}/>}
          </div>
          <h3 id={`ch-${title.replace(/\s+/g,'-')}`} className="chart-card__title">{title}</h3>
        </div>
        <div className="chart-card__toggles" role="group" aria-label="Time range">
          {ranges.map(r => (
            <button key={r} type="button" className={`pill ${r === range ? 'active' : ''}`}
              onClick={() => setRange(r)} aria-pressed={r === range}>{r}</button>
          ))}
        </div>
      </header>

      {takeaway && <p className="chart-card__takeaway">{takeaway}</p>}

      <div className="chart-card__svgwrap"
        onMouseLeave={() => setHoverIdx(null)}
        onKeyDown={onKey}
        tabIndex="0"
        role="img"
        aria-label={description || `${title}. ${takeaway || ''}`}>
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} width="100%" height={H} onMouseMove={onMove} focusable="false">
          {yTickVals.map((v, i) => (
            <g key={i}>
              <line x1={padL} x2={W - padR} y1={y(v)} y2={y(v)} stroke="#EFEDE6" strokeWidth="1" />
              <text x={padL - 8} y={y(v) + 4} textAnchor="end" className="chart-tick">{fmt(v, unit)}</text>
            </g>
          ))}
          {baseline != null && (
            <g>
              <line x1={padL} x2={W - padR} y1={y(baseline)} y2={y(baseline)} stroke="#B45309" strokeWidth="1" strokeDasharray="3 3"/>
              <text x={W - padR} y={y(baseline) - 6} textAnchor="end" className="chart-baseline">
                {baselineLabel || `threshold · ${baseline}${unit || ''}`}
              </text>
            </g>
          )}
          <line x1={padL} x2={W - padR} y1={padT + innerH} y2={padT + innerH} stroke="#C9C5B8" />
          {areaPath && <path d={areaPath} fill={accent} opacity="0.08" />}
          {linePath && <path d={linePath} fill="none" stroke={accent} strokeWidth="1.75" />}
          {data.length > 2 && [0, Math.floor(data.length / 2), data.length - 1].map(i => (
            <text key={i} x={x(i)} y={H - 10} textAnchor="middle" className="chart-tick">
              {window.FR.fmtMonth(data[i].t)}
            </text>
          ))}
          {hover && (
            <g>
              <line x1={x(hoverIdx)} x2={x(hoverIdx)} y1={padT} y2={padT + innerH} stroke="#14181F" strokeWidth="1" opacity="0.5"/>
              <circle cx={x(hoverIdx)} cy={y(hover.v)} r="3.5" fill={accent} stroke="#FFF" strokeWidth="1.5"/>
            </g>
          )}
        </svg>
        {hover && (
          <div className="chart-tooltip" style={{ left: `${(x(hoverIdx) / W) * 100}%` }} role="status">
            <div className="chart-tooltip__t">{window.FR.fmtMonth(hover.t)}</div>
            <div className="chart-tooltip__v">{fmt(hover.v, unit)}</div>
          </div>
        )}
      </div>

      {yAxisLabel && <p className="chart-card__axislabel">Y-axis: {yAxisLabel}</p>}
      {sourceLine && <p className="chart-card__source">{sourceLine}</p>}
    </article>
  );
}

function defaultFmt(v, unit) {
  if (unit === '/L' || unit === 'AUD/L') return 'A$' + v.toFixed(2);
  if (unit === ' ML' || unit === 'ML')   return Math.round(v) + ' ML';
  if (unit === ' kt' || unit === 'kt')   return Math.round(v) + ' kt';
  if (unit === ' days' || unit === 'days') return Math.round(v) + 'd';
  if (unit === '%')                      return v.toFixed(1) + '%';
  if (unit === 'USD per barrel' || unit === 'USD/bbl') return 'US$' + v.toFixed(0);
  if (unit === 'AUD per barrel' || unit === 'AUD/bbl') return 'A$' + v.toFixed(0);
  if (unit === 'index')                  return v.toFixed(0);
  return v.toFixed(1) + (unit ? ' ' + unit : '');
}

Object.assign(window, { ChartCard });
