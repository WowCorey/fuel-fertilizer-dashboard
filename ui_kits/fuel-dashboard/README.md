# Fuel Dashboard UI kit

A high-fidelity recreation of the Fuel Resilience AU homepage.

## Files

- `index.html` — live, interactive homepage
- `Header.jsx` — sticky masthead + section nav + download action (`Header`, `Icon`)
- `MetricCard.jsx` — headline metric card (`MetricCard`)
- `ChartCard.jsx` — time-series chart container with range toggles and hover tooltip (`ChartCard`)
- `InsightFeed.jsx` — "What changed this month" list + `Footer`
- `styles.css` — layout + component styles (tokens come from `../../colors_and_type.css`)

## Surfaces covered

1. Intro band — title, lede, reporting period
2. Headline metrics — 3-card row
3. Time-series charts — imports, prices, days-of-cover with 90-day threshold line
4. "What changed" insight feed
5. Footer with sources, methodology, data links

## Notes

- Chart data is synthetic — real series should be wired via the existing `series` prop shape `{ t, v }[]`.
- Tooltip and range toggles work out of the box.
- No icon library is bundled — the handful of icons used are inline SVG paths in `Icon`, matching Lucide's 1.5px stroke. Swap to CDN Lucide if needed.
