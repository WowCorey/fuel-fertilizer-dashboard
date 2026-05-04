# National Petroleum Ledger Source Gates

Last reviewed: 2026-04-23

This document records the source decisions behind the state petroleum ledger
program. It exists to stop the public page from implying that blocked source
paths are solved.

## Gate summary

| Workstream | Current result | Trust label |
|---|---|---|
| A. State-by-state petroleum ledger | Implemented as partial coverage using loaded production, revenue-context and source-gate envelopes. | Partial coverage |
| B. Royalty and receipt coverage by state | WA and Queensland petroleum receipt rows are loaded. NSW and NT combined royalty context is loaded with non-petroleum-only caveats. | Partial coverage |
| C. Project/site/permit counts by state | Implemented as partial coverage. NOPTA current offshore title/permit records and Petroleum Wells layer records are loaded as separate object classes; operating refinery counts are loaded for QLD/VIC. | Partial coverage |
| D. Project/company production mapping | Implemented as partial coverage. NOPTA active offshore production licences map basin/field/title operator/title holders; REMP oil-and-gas rows map major projects to company/proponent text and estimated new capacity. Current production volumes remain unavailable. | Partial coverage |
| E. Live or near-live national outage coverage | Partial. WA weekly manual and QLD monthly programmatic layers exist; no national live feed. | Partial coverage |
| F. Terminal and shipping visibility | Partial. PM&C aggregate tanker counts and APS/MSO stock context exist; no terminal capacity or live vessel layer. | Partial coverage |
| G. Defensible national status model | Blocked. The gate exists, but source coverage and thresholds are not sufficient. | Unavailable |

## Source decisions

### Usable

- Australian Energy Statistics 2025: state/territory production rows.
- Geoscience Australia AECR 2025 gas and oil: national and basin context.
- NOPTA spatial data FeatureServers: current offshore petroleum title/permit
  records, Petroleum Wells feature-layer records, and active production-licence
  field/operator mapping.
- Resources and Energy Major Projects 2024 data workbook: oil-and-gas project,
  company/proponent, state, resource, status and estimated-new-capacity rows.
- DCCEEW ministerial release "Securing Australia's fuel sovereignty": official
  operating refinery count and named QLD/VIC refinery locations.
- WA Overview of State Taxes and Royalties 2025-26: WA petroleum state
  component royalties plus North West Shelf grants.
- Queensland Budget BP2 Revenue 2025-26: Queensland petroleum royalty receipts.

### Usable as context only

- NSW Resources royalties page: official combined minerals-and-petroleum
  royalty context and petroleum royalty rate. It is not petroleum-only revenue.
- Northern Territory Budget 2025-26 BP2: official combined mining-and-petroleum
  royalty context and petroleum royalty rate. It is not petroleum-only revenue.

### Blocked for dashboard counts or live layers

- Producing-field counts by state: no loaded source currently defines a clean
  count separate from title records and field-name text.
- Current project/company production volumes: NOPTA production licences publish
  title metadata, not production volume. REMP publishes major-project estimated
  new capacity, not current production.
- LNG plant/train counts by state: no loaded official current state/trains table.
- Gas-processing plant counts by state: no loaded official current state/facility
  table.
- Import/storage terminal counts by state: no loaded source with current
  licence-safe terminal records, product scope and state classification.
- Petroleum Titles, Australia 2016: old title-location dataset; data.gov.au
  lists the dataset licence as not specified.
- Geoscience Australia National Liquid Fuel Terminals 2015: location snapshot,
  not terminal capacity, live inventory, outage status or shipping visibility.
- Private AIS/vessel feeds: not used unless redistribution rights, API access,
  cargo-inference rules and confidence labels are documented.

## Status model gate

Stable/Tight/Disrupted/Critical remains unpublished until the repo has:

- current product-day inputs,
- visible stock and import freshness,
- national or threshold-sufficient outage coverage,
- shipping/terminal visibility rules,
- documented geographic coverage thresholds,
- tests for each status transition,
- an explicit missing-data behaviour.

Until then, the status model must render unavailable.
