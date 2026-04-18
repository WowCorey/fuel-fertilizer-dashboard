// ChartCard.jsx — framed time-series container with takeaway, range toggles, hover tooltip, a11y
function ChartCard({
  title, eyebrow, unit, series, baseline, baselineLabel,
  ranges = ['1Y','5Y','Max'], defaultRange = '5Y',
  accent = '#1F3A8A',
  takeaway,        // plain-English one-liner above chart
  sourceLine,      // source + last-updated, below chart
  sample = false,  // true = badge the chart as sample data
  yAxisLabel,      // e.g. "Millions of litres per month (ML)"
  description,     // longer a11y description for screen readers
}) {
  const [range, setRange] = React.useState(defaultRange);
  const [hoverIdx, setHoverIdx] = React.useState(null);

  const data = React.useMemo(() => {
    if (range === '1Y') return series.slice(-12);
    if (range === '5Y') return series.slice(-60);
    return series;
  }, [range, series]);

  const W = 640, H = 240, padL = 56, padR = 16, padT = 24, padB = 36;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;

  const ys = data.map(d => d.v);
  const yMin = Math.min(...ys, baseline ?? Infinity) * 0.95;
  const yMax = Math.max(...ys, baseline ?? -Infinity) * 1.05;

  const x = i => padL + (i / (data.length - 1)) * innerW;
  const y = v => padT + innerH - ((v - yMin) / (yMax - yMin)) * innerH;

  const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i)},${y(d.v)}`).join(' ');
  const areaPath = `${linePath} L${x(data.length - 1)},${padT + innerH} L${padL},${padT + innerH} Z`;

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

  return (
    <article className="chart-card" aria-labelledby={`ch-${title.replace(/\s+/g,'-')}`}>
      <header className="chart-card__head">
        <div>
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h3 id={`ch-${title.replace(/\s+/g,'-')}`} className="chart-card__title">{title}</h3>
        </div>
        <div className="chart-card__toggles" role="group" aria-label="Time range">
          {ranges.map(r => (
            <button key={r} type="button" className={`pill ${r === range ? 'active' : ''}`}
              onClick={() => setRange(r)} aria-pressed={r === range}>{r}</button>
          ))}
        </div>
      </header>

      {takeaway && (
        <p className="chart-card__takeaway">{takeaway}</p>
      )}

      <div className="chart-card__svgwrap"
        onMouseLeave={() => setHoverIdx(null)}
        onKeyDown={onKey}
        tabIndex="0"
        role="img"
        aria-label={description || `${title}. ${takeaway || ''}`}>
        {sample && <span className="sample-tag sample-tag--chart">Sample data</span>}
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
          <path d={areaPath} fill={accent} opacity="0.08" />
          <path d={linePath} fill="none" stroke={accent} strokeWidth="1.75" />
          {[0, Math.floor(data.length / 2), data.length - 1].map(i => (
            <text key={i} x={x(i)} y={H - 10} textAnchor="middle" className="chart-tick">{data[i].t}</text>
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
            <div className="chart-tooltip__t">{hover.t}</div>
            <div className="chart-tooltip__v">{fmt(hover.v, unit)}</div>
          </div>
        )}
      </div>

      {yAxisLabel && <p className="chart-card__axislabel">Y-axis: {yAxisLabel}</p>}
      {sourceLine && <p className="chart-card__source">{sourceLine}</p>}
    </article>
  );
}

function fmt(v, unit) {
  if (unit === '/L') return 'A$' + v.toFixed(2);
  if (unit === ' ML') return v.toFixed(0) + ' ML';
  if (unit === ' days') return Math.round(v) + 'd';
  if (unit === '%') return v.toFixed(1) + '%';
  return v.toFixed(1) + (unit || '');
}

Object.assign(window, { ChartCard });
