# Fuel dashboard (v1)

Main entry: `index.html`. Serve the project root with `python -m http.server`
and open `http://localhost:8000/ui_kits/fuel-dashboard/index.html`.

Reads JSON envelopes produced by `scripts/fetch_data.py` from
`data/generated/*.json`, falling back to `data/manual/*.json` for sources
that can't be fetched programmatically. Shared components live in
`../shared/`.

## Files

- `index.html` — page shell + React app
- `data.js` — list of source ids this dashboard consumes (`window.FUEL_SERIES`)

## Series consumed

See `data/sources.yml` for each:

- `aps_monthly` — Days of Net Import Cover, cover chart
- `abs_petroleum_imports` — Monthly imports card & chart
- `aip_retail` — National fuel price card & chart
- `aip_tgp` — Reserved for terminal-gate price series
- `iea_90day` — 90-day benchmark line

Any envelope with `status !== "ok"` renders as a "Source unavailable —
awaiting data" placeholder. We never estimate.
