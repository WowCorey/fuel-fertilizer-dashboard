# Fuel Security Source Investigation

Last reviewed: 2026-04-23

This note records the source checks behind the fuel-security dashboard. It is
not a wish list. A source moves into the dashboard only when the exact field,
date, unit, scope and reuse path are defensible.

## PM&C / DCCEEW Public Snapshot

Source checked:
https://www.pmc.gov.au/domestic-policy/fuel-supply-taskforce/public-information-fuel-supply

Decision: manual.

Reason:

- The browser-visible PM&C page publishes the current public fuel-supply
  snapshot: National Fuel Security Plan level, prices, MSO days, MSO reserves,
  ships on water, forward import orders and retail stock-outs.
- Local pipeline requests on 2026-04-23 returned a short Incapsula challenge
  HTML page, not the public table content.
- The public page does not expose a stable linked CSV, JSON or XLSX data file
  for these values.
- Hand-keying the public page remains safer than scraping a protected HTML
  page that may change shape.

Unlock condition:

- PM&C or DCCEEW publishes a stable machine-readable endpoint or static data
  file with clear reuse terms for the public fuel-supply snapshot.

## Station Outage / Stock-Out Coverage

Loaded source:
`pmc_retail_stockouts`

Decision: partial coverage.

What is covered:

- State and territory petrol and diesel stock-out counts.
- Seven-day changes.
- Australia-wide diesel stock-out count.

What is not covered:

- Station-level live dry-site records.
- Regional outage polygons or alerts.
- Australia-wide petrol total in the current PM&C table.
- A reusable public national API for live station availability.

Dashboard rule:

- Display PM&C stock-outs as a dated public snapshot.
- Keep `fuel_security_live_station_outage_feed` unavailable.
- Do not present state retail price feeds as outage feeds.

## Shipping / Import Visibility

Loaded sources:

- `pmc_tankers_on_water`
- `pmc_forward_import_orders`
- APS product import envelopes
- `abs_petroleum_imports`

Decision: partial coverage.

What is covered:

- Aggregate crude-oil tanker count.
- Aggregate clean refined-product tanker count.
- Equivalent days for those aggregate groups.
- Four-week forward import-order volume.
- Monthly APS product import context.
- Monthly ABS petroleum import value.

What is not covered:

- Vessel identities.
- AIS positions.
- Port-call ETAs.
- Shipment-level cargo/product assignments.
- Direct Kpler data access or redistribution.

Dashboard rule:

- Route graphics may be illustrative context only.
- No vessel name, IMO/MMSI, ETA, live position or inferred cargo appears unless
  a source-safe vessel feed and schema are added.

## Terminal / Storage Visibility

Loaded sources:

- `pmc_mso_fuel_reserves`
- `aps_stocks_petrol`
- `aps_stocks_diesel`

Investigated source:
https://data.gov.au/data/dataset/au-govt-ga-national-liquid-fuel-terminals-2015-na

Decision: capacity unavailable.

Reason:

- The Geoscience Australia National Liquid Fuel Terminals 2015 dataset describes
  terminal locations.
- It does not provide terminal-by-terminal storage capacity, product stock,
  outage status or live inventory.
- The direct AURIN download path did not provide a simple reproducible static
  dataset during this review.

Dashboard rule:

- Show national and product stock context from PM&C and APS.
- Keep `fuel_security_terminal_capacity` unavailable until a public reusable
  capacity dataset with date and units is verified.

## Status Model

Decision: unavailable.

Reason:

- PM&C Level 2 is an observed government status, but the project does not have
  enough complete operational coverage to publish its own Stable/Tight/
  Disrupted/Critical model.
- Missing inputs include a live station outage feed, live vessel/shipment feed,
  terminal capacity/inventory feed, programmatic PM&C/DCCEEW snapshot access,
  and documented thresholds for the status bands.

Dashboard rule:

- Show the official PM&C level.
- Keep `fuel_security_status_model` unavailable.
- List blockers beside the unavailable state.

