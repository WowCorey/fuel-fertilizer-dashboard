// ShippingVisibility.jsx - evidence board for aggregate public inbound fuel data.
function ShippingVisibility({ tankersEnv, forwardOrdersEnv, importsEnv, liveVesselEnv }) {
  const [filter, setFilter] = React.useState('all');
  const notApplicable = () => <span className="unavail" aria-label="not applicable">&mdash;</span>;

  function latest(env) {
    if (!env || env.status !== 'ok' || !env.values?.length) return null;
    return env.values.at(-1).v;
  }

  function fields(env) {
    return env?.extra?.fields || {};
  }

  function isNumber(value) {
    return value !== null && value !== undefined && !Number.isNaN(Number(value));
  }

  function fmt(value, digits = 0) {
    if (!isNumber(value)) return '-';
    return Number(value).toLocaleString('en-AU', {
      maximumFractionDigits: digits,
      minimumFractionDigits: digits,
    });
  }

  function fmtAudThousands(value) {
    if (!isNumber(value)) return '-';
    return `A$${(Number(value) / 1000000).toLocaleString('en-AU', {
      maximumFractionDigits: 1,
      minimumFractionDigits: 1,
    })}bn`;
  }

  function fmtChange(current, previous) {
    if (!isNumber(current) || !isNumber(previous)) return notApplicable();
    const change = Number(current) - Number(previous);
    if (change === 0) return '0';
    return `${change > 0 ? '+' : ''}${fmt(change)}`;
  }

  function tankerCell(value) {
    return isNumber(value) ? `${fmt(value)} tankers` : notApplicable();
  }

  function daysCell(value) {
    return isNumber(value) ? `${fmt(value)} days` : notApplicable();
  }

  const tankerFields = fields(tankersEnv);
  const totalTankers = latest(tankersEnv);
  const forwardOrders = latest(forwardOrdersEnv);
  const importValue = latest(importsEnv);
  const liveVesselNotes = liveVesselEnv?.notes || 'No source-safe live vessel feed is loaded.';

  const rows = [
    {
      key: 'crude',
      filter: 'crude',
      supplyGroup: 'Crude oil',
      current: tankerCell(tankerFields.crude_oil_tankers),
      previous: tankerCell(tankerFields.previous_crude_oil_tankers),
      change: fmtChange(tankerFields.crude_oil_tankers, tankerFields.previous_crude_oil_tankers),
      equivalentDays: daysCell(tankerFields.crude_oil_equivalent_days),
      env: tankersEnv,
      partial: true,
      meaning: 'PM&C aggregate crude-oil tanker count and equivalent days only. No vessel names, AIS positions, cargo assignments or port-call ETAs are loaded.',
    },
    {
      key: 'clean',
      filter: 'clean',
      supplyGroup: 'Clean refined products',
      current: tankerCell(tankerFields.clean_refined_product_tankers),
      previous: tankerCell(tankerFields.previous_clean_refined_product_tankers),
      change: fmtChange(tankerFields.clean_refined_product_tankers, tankerFields.previous_clean_refined_product_tankers),
      equivalentDays: daysCell(tankerFields.clean_refined_product_equivalent_days),
      env: tankersEnv,
      partial: true,
      meaning: 'PM&C aggregate clean refined-product tanker count and equivalent days only. This is inbound supply visibility, not a live shipping layer.',
    },
    {
      key: 'total',
      filter: 'all',
      supplyGroup: 'Total reported tankers',
      current: tankerCell(totalTankers),
      previous: notApplicable(),
      change: notApplicable(),
      equivalentDays: notApplicable(),
      env: tankersEnv,
      partial: true,
      meaning: 'Latest PM&C aggregate total reported tanker count. It does not identify individual vessels, ports, terminals or cargoes.',
    },
    {
      key: 'orders',
      filter: 'all',
      supplyGroup: 'Forward import orders',
      current: notApplicable(),
      previous: notApplicable(),
      change: notApplicable(),
      equivalentDays: notApplicable(),
      env: forwardOrdersEnv,
      partial: true,
      meaning: `Latest PM&C forward import order visibility is ${fmt(forwardOrders, 1)} billion L ordered. This is aggregate public order visibility only.`,
    },
    {
      key: 'imports',
      filter: 'all',
      supplyGroup: 'ABS petroleum imports',
      current: notApplicable(),
      previous: notApplicable(),
      change: notApplicable(),
      equivalentDays: notApplicable(),
      env: importsEnv,
      partial: false,
      meaning: `Latest ABS petroleum import value is ${fmtAudThousands(importValue)} (${fmt(importValue)} AUD thousands). This is trade-value context, not tanker or vessel tracking.`,
    },
    {
      key: 'live',
      filter: 'all',
      supplyGroup: 'Live vessel identities / ETAs',
      current: notApplicable(),
      previous: notApplicable(),
      change: notApplicable(),
      equivalentDays: notApplicable(),
      env: liveVesselEnv,
      partial: false,
      meaning: `${liveVesselNotes} No AIS positions, vessel names, cargo assignments or port-call ETAs are plotted.`,
    },
  ];

  const cards = [
    {
      key: 'crude-card',
      filter: 'crude',
      title: 'Crude oil tankers',
      value: isNumber(tankerFields.crude_oil_tankers) ? fmt(tankerFields.crude_oil_tankers) : 'Unavailable',
      unit: isNumber(tankerFields.crude_oil_tankers) ? 'tankers' : '',
      subtext: `Previous: ${fmt(tankerFields.previous_crude_oil_tankers)} tankers; equivalent days: ${fmt(tankerFields.crude_oil_equivalent_days)}.`,
      env: tankersEnv,
      partial: true,
    },
    {
      key: 'clean-card',
      filter: 'clean',
      title: 'Clean refined-product tankers',
      value: isNumber(tankerFields.clean_refined_product_tankers) ? fmt(tankerFields.clean_refined_product_tankers) : 'Unavailable',
      unit: isNumber(tankerFields.clean_refined_product_tankers) ? 'tankers' : '',
      subtext: `Previous: ${fmt(tankerFields.previous_clean_refined_product_tankers)} tankers; equivalent days: ${fmt(tankerFields.clean_refined_product_equivalent_days)}.`,
      env: tankersEnv,
      partial: true,
    },
    {
      key: 'orders-card',
      filter: 'all',
      title: 'Forward import orders',
      value: isNumber(forwardOrders) ? fmt(forwardOrders, 1) : 'Unavailable',
      unit: isNumber(forwardOrders) ? 'billion L ordered' : '',
      subtext: 'Aggregate public order visibility only. No cargo-level or vessel-level allocation is loaded.',
      env: forwardOrdersEnv,
      partial: true,
    },
    {
      key: 'live-card',
      filter: 'all',
      title: 'Live vessel layer',
      value: 'Unavailable',
      unit: '',
      subtext: 'No source-safe live vessel names, AIS positions or port-call ETAs loaded.',
      env: liveVesselEnv,
      partial: false,
      unavailable: true,
    },
  ];

  const visibleRows = filter === 'all' ? rows : rows.filter(row => row.filter === filter);
  const visibleCards = filter === 'all' ? cards : cards.filter(card => card.filter === filter);
  const filterButtons = [
    ['all', `All (${fmt(totalTankers)})`],
    ['crude', `Crude (${fmt(tankerFields.crude_oil_tankers)})`],
    ['clean', `Clean (${fmt(tankerFields.clean_refined_product_tankers)})`],
  ];

  const sourceLines = [tankersEnv, forwardOrdersEnv, importsEnv, liveVesselEnv]
    .map(env => window.FR.sourceLine(env))
    .filter(Boolean);

  return (
    <div className="shipping-visibility">
      <div className="shipping-visibility__summary" aria-label="Inbound fuel summary">
        <div>
          <span className="eyebrow">Inbound fuel evidence board</span>
          <h3>Aggregate public data only, not a live map.</h3>
          <p>
            PM&C publishes aggregate tanker counts, equivalent days and forward import orders.
            ABS publishes petroleum import value. This board shows those loaded values directly
            and keeps live vessel identities, AIS positions and port-call ETAs unavailable.
          </p>
        </div>
        <div className="shipping-stats">
          <div className="shipping-stat">
            <span>{fmt(totalTankers)}</span>
            <small>PM&C aggregate reported tankers</small>
          </div>
          <div className="shipping-stat">
            <span>{fmt(forwardOrders, 1)}</span>
            <small>billion L ordered in PM&C forward import orders</small>
          </div>
          <div className="shipping-stat">
            <span>{fmtAudThousands(importValue)}</span>
            <small>ABS petroleum import value, rounded from AUD thousands</small>
          </div>
          <div className="shipping-stat shipping-stat--unavailable">
            <span>Unavailable</span>
            <small>No live vessel feed loaded</small>
          </div>
        </div>
      </div>

      <div className="shipping-tabs" role="tablist" aria-label="Inbound fuel evidence filters">
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
        <div className="shipping-evidence-main">
          <div className="data-table-wrap shipping-evidence-table" aria-label="Aggregate inbound supply comparison">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Supply group</th>
                  <th>Current tankers</th>
                  <th>Previous tankers</th>
                  <th>Change</th>
                  <th>Equivalent days</th>
                  <th>Source status</th>
                  <th>What it means</th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.map(row => (
                  <tr key={row.key}>
                    <td>{row.supplyGroup}</td>
                    <td>{row.current}</td>
                    <td>{row.previous}</td>
                    <td>{row.change}</td>
                    <td>{row.equivalentDays}</td>
                    <td className="shipping-status-cell"><EnvTrustBadges env={row.env} partial={row.partial}/></td>
                    <td className="shipping-meaning-cell">{row.meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="shipping-evidence-note">
            <span className="eyebrow">Evidence board, not live map</span>
            <p>
              This section does not plot ships. PM&C publishes aggregate tanker counts and
              equivalent days, not vessel names, AIS positions, cargo assignments or
              port-call ETAs. The dashboard therefore shows inbound supply as an evidence
              board rather than a live map.
            </p>
            <ul>
              <li>PM&C aggregate tanker counts only.</li>
              <li>No live vessel feed loaded.</li>
              <li>No AIS positions, vessel names or port-call ETAs.</li>
              <li>No invented ports, terminals, shipping lanes or vessel locations.</li>
            </ul>
          </div>
        </div>

        <div className="shipping-evidence-cards" aria-label="Inbound supply evidence cards">
          {visibleCards.map(card => (
            <article key={card.key} className={`shipping-evidence-card${card.unavailable ? ' shipping-evidence-card--unavailable' : ''}`}>
              <div className="shipping-evidence-card__head">
                <span className="eyebrow">{card.title}</span>
                <EnvTrustBadges env={card.env} partial={card.partial}/>
              </div>
              <div className="shipping-evidence-card__value">
                <span>{card.value}</span>
                {card.unit && <small>{card.unit}</small>}
              </div>
              <p>{card.subtext}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="shipping-source mono">
        {sourceLines.map((line, index) => <p key={`${line}-${index}`}>{line}</p>)}
      </div>
    </div>
  );
}

Object.assign(window, { ShippingVisibility });
