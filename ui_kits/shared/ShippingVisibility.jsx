// ShippingVisibility.jsx - public-source shipping context without fake vessel tracking.
function ShippingVisibility({ tankersEnv, forwardOrdersEnv, importsEnv, liveVesselEnv }) {
  const [filter, setFilter] = React.useState('all');

  function latest(env) {
    if (!env || env.status !== 'ok' || !env.values?.length) return null;
    return env.values.at(-1).v;
  }

  function fields(env) {
    return env?.extra?.fields || {};
  }

  function fmt(value, digits = 0) {
    if (value === null || value === undefined || Number.isNaN(Number(value))) return '-';
    return Number(value).toLocaleString('en-AU', {
      maximumFractionDigits: digits,
      minimumFractionDigits: digits,
    });
  }

  function fmtAudThousands(value) {
    if (value === null || value === undefined || Number.isNaN(Number(value))) return '-';
    return `A$${(Number(value) / 1000000).toLocaleString('en-AU', {
      maximumFractionDigits: 1,
      minimumFractionDigits: 1,
    })}bn`;
  }

  const tankerFields = fields(tankersEnv);
  const groups = [
    {
      key: 'crude',
      label: 'Crude oil',
      shortLabel: 'Crude',
      count: tankerFields.crude_oil_tankers,
      previous: tankerFields.previous_crude_oil_tankers,
      days: tankerFields.crude_oil_equivalent_days,
      route: 'Overseas crude supply -> Australian refining system',
      note: 'Aggregate PM&C count. No vessel identities or ETAs are loaded.',
    },
    {
      key: 'clean',
      label: 'Clean refined products',
      shortLabel: 'Clean products',
      count: tankerFields.clean_refined_product_tankers,
      previous: tankerFields.previous_clean_refined_product_tankers,
      days: tankerFields.clean_refined_product_equivalent_days,
      route: 'Regional product supply -> Australian terminals',
      note: 'Aggregate PM&C count covering refined-product tankers.',
    },
  ];
  const visibleGroups = filter === 'all' ? groups : groups.filter(group => group.key === filter);
  const totalTankers = latest(tankersEnv);
  const filterButtons = [
    ['all', `All (${fmt(totalTankers)})`],
    ['crude', `Crude (${fmt(tankerFields.crude_oil_tankers)})`],
    ['clean', `Clean (${fmt(tankerFields.clean_refined_product_tankers)})`],
  ];

  return (
    <div className="shipping-visibility">
      <div className="shipping-visibility__summary" aria-label="Inbound fuel summary">
        <div>
          <span className="eyebrow">Inbound fuel visibility</span>
          <h3>Australia supply inbound, shown only at aggregate level.</h3>
          <p>
            PM&C publishes tanker counts and equivalent days. This layout makes that flow easier
            to read without inventing vessel identities, live positions or cargo assignments.
          </p>
        </div>
        <div className="shipping-stats">
          <div className="shipping-stat">
            <span>{fmt(totalTankers)}</span>
            <small>reported tankers</small>
          </div>
          <div className="shipping-stat">
            <span>{fmt(latest(forwardOrdersEnv), 1)}</span>
            <small>billion L ordered</small>
          </div>
          <div className="shipping-stat">
            <span>{fmt(latest(importsEnv))}</span>
            <small>ABS imports, AUD thousands</small>
          </div>
          <div className="shipping-stat">
            <span>{fmtAudThousands(latest(importsEnv))}</span>
            <small>same value rounded to A$bn</small>
          </div>
          <div className="shipping-stat shipping-stat--unavailable">
            <span>0</span>
            <small>live vessel feeds</small>
          </div>
        </div>
      </div>

      <div className="shipping-tabs" role="tablist" aria-label="Inbound fuel visibility filters">
        {filterButtons.map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={filter === key ? 'is-active' : ''}
            aria-pressed={filter === key}
            onClick={() => setFilter(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="shipping-visibility__body">
        <div className="shipping-list" aria-label="Aggregate tanker groups">
          {visibleGroups.map(group => (
            <article key={group.key} className="shipping-row">
              <div className="shipping-row__head">
                <div>
                  <span className="eyebrow">{group.shortLabel}</span>
                  <h4>{group.label}</h4>
                </div>
                <EnvTrustBadges env={tankersEnv} partial/>
              </div>
              <dl className="shipping-row__facts">
                <div>
                  <dt>Current</dt>
                  <dd>{fmt(group.count)} tankers</dd>
                </div>
                <div>
                  <dt>Previous</dt>
                  <dd>{fmt(group.previous)} tankers</dd>
                </div>
                <div>
                  <dt>Equivalent</dt>
                  <dd>{fmt(group.days)} days</dd>
                </div>
              </dl>
              <p className="shipping-route">{group.route}</p>
              <p className="caption">{group.note}</p>
            </article>
          ))}
          <article className="shipping-row shipping-row--unavailable">
            <div className="shipping-row__head">
              <div>
                <span className="eyebrow">Vessel layer</span>
                <h4>Live vessel identities and ETAs</h4>
              </div>
              <EnvTrustBadges env={liveVesselEnv}/>
            </div>
            <p>{liveVesselEnv?.notes || 'No source-safe live vessel feed is loaded.'}</p>
          </article>
        </div>

        <div className="shipping-map" aria-label="Illustrative aggregate fuel supply lane map">
          <div className="shipping-map__canvas">
            <svg viewBox="0 0 720 420" role="img" aria-labelledby="shipping-map-title shipping-map-desc">
              <title id="shipping-map-title">Aggregate inbound fuel lane context</title>
              <desc id="shipping-map-desc">Illustrative Indo-Pacific fuel supply lanes into Australia. No live vessel positions are plotted.</desc>
              <rect x="0" y="0" width="720" height="420" rx="8"/>
              <path className="shipping-grid" d="M60 80H660M60 160H660M60 240H660M60 320H660M120 40V380M240 40V380M360 40V380M480 40V380M600 40V380"/>
              <path className="shipping-lane shipping-lane--crude" d="M96 116 C220 80 340 112 466 210 C508 244 540 270 592 286"/>
              <path className="shipping-lane shipping-lane--clean" d="M136 238 C246 202 358 216 484 272 C524 290 552 306 612 318"/>
              <path className="shipping-lane shipping-lane--context" d="M198 312 C320 282 424 306 578 342"/>
              <circle className="shipping-origin" cx="96" cy="116" r="6"/>
              <circle className="shipping-origin" cx="136" cy="238" r="6"/>
              <circle className="shipping-origin" cx="198" cy="312" r="6"/>
              <path className="shipping-australia" d="M536 242 L602 230 L650 260 L666 314 L622 358 L556 344 L510 302 Z"/>
              <circle className="shipping-port" cx="592" cy="286" r="5"/>
              <circle className="shipping-port" cx="612" cy="318" r="5"/>
              <circle className="shipping-port" cx="578" cy="342" r="5"/>
              <text x="80" y="96">Crude supply</text>
              <text x="118" y="220">Refined-product hubs</text>
              <text x="188" y="296">Regional context</text>
              <text x="528" y="222">Australia</text>
            </svg>
          </div>
          <div className="shipping-map__legend">
            <span><i className="lane-key lane-key--crude"/>Crude aggregate</span>
            <span><i className="lane-key lane-key--clean"/>Clean-product aggregate</span>
            <span><i className="lane-key lane-key--context"/>Context only</span>
          </div>
          <p className="caption mono">
            Illustrative route context only. No AIS positions, vessel names, port-call ETAs or live tracks are loaded.
          </p>
        </div>
      </div>

      <p className="shipping-source mono">{window.FR.sourceLine(tankersEnv)}</p>
    </div>
  );
}

Object.assign(window, { ShippingVisibility });
