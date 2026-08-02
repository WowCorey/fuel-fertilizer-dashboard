# Fuel Security Source Investigation

Last reviewed: 2026-08-03

This note records the source checks behind the fuel-security dashboard. It is
not a wish list. A source moves into the dashboard only when the exact field,
date, unit, scope and reuse path are defensible.

## PM&C / DCCEEW Public Snapshot

Sources checked:

- canonical: https://fuelplan.gov.au/fuel-statistics
- legacy: https://www.pmc.gov.au/domestic-policy/fuel-supply-taskforce/public-information-fuel-supply

Decision: manual.

Reason:

- The canonical Australian Government Fuel Plan page publishes the current
  public fuel-supply snapshot: National Fuel Security Plan level, prices, MSO
  days, MSO reserves, ships on water, forward import orders and retail
  stock-outs.
- Direct requests to the canonical page on 2026-08-03 returned the expected
  static HTML tables. The former PM&C URL can still return a short Incapsula
  incident page.
- The canonical page does not expose a stable linked CSV, JSON, XLSX, JSON:API
  or public API payload for these values.
- Hand-keying the official table remains safer than treating a mutable HTML
  layout as a production data contract. Issue #33 expressly excludes brittle
  HTML scraping.

Phase 5C re-check on 2026-08-03:

- The canonical page returned the expected semantic tables and both Australian
  petrol and diesel totals.
- Drupal JSON and JSON:API candidates returned `404` or `406`, and no official
  static data download was linked.
- The Fuel Plan sitemap confirms the page and its declared update frequency,
  but does not expose the table data.
- A successful HTML fetch does not prove a stable machine-readable contract.

Unlock condition:

- Fuel Plan, PM&C or DCCEEW publishes a stable machine-readable endpoint or
  static data file with clear reuse terms for the public fuel-supply snapshot;
  or issue #33 deliberately approves a strict HTML table contract with exact
  headings, headers, cardinality, units, dates, challenge-page rejection and
  fail-closed validation.

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
- Australia-wide petrol and diesel stock-out counts.
- WA Government weekly statewide stockout count and station denominator.
- Queensland monthly Open Data unavailable fuel-type reports where `Price = 9999`.

What is not covered:

- Station-level live dry-site records.
- Regional outage polygons or alerts.
- A reusable public national API for live station availability.

Dashboard rule:

- Display PM&C stock-outs as a dated public snapshot.
- Display the WA weekly update as a WA-only dated public snapshot.
- Display QLD unavailable fuel reports as monthly Open Data partial coverage.
- Keep `fuel_security_live_station_outage_feed` unavailable.
- Do not present state retail price feeds as outage feeds.

### State and territory source hunt

The complete access, field, unit, cadence and rights review is maintained in
[`docs/state-territory-fuel-coverage-matrix.md`](state-territory-fuel-coverage-matrix.md).

| Jurisdiction | Source checked | Classification | Result |
|---|---|---|---|
| ACT | ACT Government FuelCheck and fuel-supply pages | public UI only | The UI displays ACT/NSW prices and historical review material reports greater than 95% voluntary ACT participation. The published API NSW contract does not document ACT access, and no reusable ACT availability feed was verified. |
| NSW | API NSW Fuel API v2, support material and monthly FuelCheck history | price API key/secret gated; monthly history open | The current price API requires consumer-key/secret OAuth and exposes prices, not availability. Phase 5C corrects the repo client and keeps NSW absent unless both credentials and the full contract succeed. Do not reuse the old retailer write API's `isavailable` field as a public read claim. |
| NT | MyFuel NT public and retailer material | public UI only / reuse blocked | The mandatory UI removes out-of-stock products, but no documented public API or broad reuse licence was verified. Do not scrape the app or infer an aggregate outage feed. |
| QLD | Queensland Fuel Price Reporting 2026 Open Data and column explanation | usable public source | Added `qld_fuel_security_unavailable_reports`. The official column explanation says `Price = 9999` denotes fuel stock temporarily unavailable, such as a tank empty and awaiting new stock. The dashboard counts those rows by monthly Open Data resource and labels the result as QLD-only partial coverage, not a live station outage count. |
| SA | SA Fuel Pricing Information Scheme publisher API | viable but subscriber/terms gated | The documented publisher API exposes `9999` unavailability with site, product and timestamp fields. Registration, token access and contractual publication conditions must be completed before integration. |
| TAS | FuelCheck/API NSW v2, LIST and RecFIT weekly updates | price API gated; dated manual availability evidence | API NSW v2 supports Tasmania but exposes no availability field. LIST product presence is not outage status. RecFIT reports can support exact dated manual evidence, subject to explicit date and rights notes. |
| VIC | Service Victoria Servo Saver public API | viable but approval/key gated | The free, 24-hour-delayed API exposes price and `isAvailable` under CC BY 4.0 plus prescribed attribution. It remains unintegrated until credentials and a production response are verified. |
| WA | FuelWatch RSS and WA Government Weekly Fuel Update | price RSS plus manual qualitative/quantitative partial evidence | RSS reuse is documented but has no availability field. Preserve the exact Fuel Plan stock-out row separately from the WA Government qualitative update; never turn “stock-outs low” into a number. |

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
  terminal capacity/inventory feed, a stable machine-readable national
  snapshot, and one internally consistent set of source-specific freshness,
  coverage, missing-data and status-transition rules.

Dashboard rule:

- Show the official PM&C level.
- Keep `fuel_security_status_model` unavailable.
- List blockers beside the unavailable state.

