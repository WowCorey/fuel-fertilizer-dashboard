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

Pass 1 re-check on 2026-04-23:

- Browser and search-index views could see the current PM&C public snapshot.
- Direct local pipeline requests to the same page, `?_format=json`, JSON:API
  aliases, and search endpoints still returned the short Incapsula challenge
  HTML or unrelated HTML rather than a data payload.
- PM&C sitemap access worked, but it only confirmed page existence; it did not
  expose the table data.
- data.gov.au package searches for the public fuel-supply snapshot did not find
  a matching official dataset.

Unlock condition:

- PM&C or DCCEEW publishes a stable machine-readable endpoint or static data
  file with clear reuse terms for the public fuel-supply snapshot.

## Station Outage / Stock-Out Coverage

Loaded source:
`pmc_retail_stockouts`

Additional partial source:
`wa_fuel_security_stockouts`

Additional programmatic partial source:
`qld_fuel_security_unavailable_reports`

Decision: partial coverage.

What is covered:

- State and territory petrol and diesel stock-out counts.
- Seven-day changes.
- Australia-wide diesel stock-out count.
- WA Government weekly statewide stockout count and station denominator.
- Queensland monthly Open Data unavailable fuel-type reports where `Price = 9999`.

What is not covered:

- Station-level live dry-site records.
- Regional outage polygons or alerts.
- Australia-wide petrol total in the current PM&C table.
- A reusable public national API for live station availability.

Dashboard rule:

- Display PM&C stock-outs as a dated public snapshot.
- Display the WA weekly update as a WA-only dated public snapshot.
- Display QLD unavailable fuel reports as monthly Open Data partial coverage.
- Keep `fuel_security_live_station_outage_feed` unavailable.
- Do not present state retail price feeds as outage feeds.

### State and territory source hunt

| Jurisdiction | Source checked | Classification | Result |
|---|---|---|---|
| ACT | ACT Government fuel supply page and FuelCheck references | no useful source found | Page says ACT supply remains secure and notes occasional product unavailability at stations, but publishes no stock-out count or machine-readable availability feed. |
| NSW | NSW FuelCheck / OneGov API technical material | key-gated / rights-unclear | Technical material describes fuel-type availability fields and the existing repo already supports NSW FuelCheck for retail prices when `NSW_FUELCHECK_API_KEY` is present. No unauthenticated, rights-reviewed stock-out aggregate feed was verified in this pass. |
| NT | MyFuel NT retailer material | app-only / unsuitable | Retailer training material shows operators can mark a fuel type out of stock, but no public API or aggregate stock-out table was verified. |
| QLD | Queensland Fuel Price Reporting 2026 Open Data and column explanation | usable public source | Added `qld_fuel_security_unavailable_reports`. The official column explanation says `Price = 9999` denotes fuel stock temporarily unavailable, such as a tank empty and awaiting new stock. The dashboard counts those rows by monthly Open Data resource and labels the result as QLD-only partial coverage, not a live station outage count. |
| SA | SA fuel security page, SA Premier release, RAA fuel availability terms | useful but manual-only source | SA and RAA publish app/website fuel availability and dated stockout context. No stable public API or redistribution-safe endpoint was verified, so no envelope was added. |
| TAS | TasALERT and RecFIT fuel-supply updates | useful but manual-only source | Public updates describe fuel supply and link to PDF updates, but no station-level or aggregate stock-out feed suitable for the outage layer was verified. |
| VIC | vic.gov.au fuel supply page and Service Victoria Servo Saver help | app-only / unsuitable | Victoria says it monitors fuel availability using live Servo Saver data, but no public machine-readable reuse path was verified. |
| WA | WA Government Weekly Fuel Update | usable manual partial source | Added `wa_fuel_security_stockouts` as WA-only dated partial coverage from the official weekly update. FuelWatch stock-level enhancement is noted by WA, but no public stock-level API was verified. |

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

