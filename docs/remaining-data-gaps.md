# Remaining Data Gaps

Last reviewed: 2026-04-22

This register records the known dashboard gaps that should not be filled with
estimates. A gap can move to "ready to populate" only when a named public source
contains the exact field, reporting period, unit, and reuse rights needed for a
JSON envelope.

## National status

| Gap | Current status | Why not filled yet | Next action |
|---|---|---|---|
| Programmatic PM&C/DCCEEW public fuel-supply snapshot | deferred | The PM&C public fuel-supply page is readable in a browser, but direct pipeline requests return an Incapsula challenge. DCCEEW and energy.gov.au page requests currently time out from the local pipeline environment. | Keep the PM&C snapshot manual and source-linked. Move to `fetch: programmatic` only if PM&C/DCCEEW publishes a stable machine-readable endpoint or an accessible static data file. |
| Vessel-level tanker movements | intentionally not published | The public PM&C page reports aggregate tanker counts and equivalent days only. It does not publish vessel identities or live AIS movements. | Keep aggregate "ships on water" counts only. Do not add vessel-level movement displays without a public, licence-compatible source and clear public-interest rationale. |
| Daily stock-out updates | deferred | The current PM&C stock-out table is a dated public snapshot with seven-day changes. It is not a daily API. | Hand-key dated snapshots when reviewed, or add ingestion only when a stable state/territory or PM&C endpoint is found. |

## Fuel

| Gap | Current status | Why not filled yet | Next action |
|---|---|---|---|
| AIP national average retail petrol/diesel | deferred | Existing live fuel page already has AIP terminal gate price and multi-state public retail fuel. AIP retail needs a clean public workbook/table source before hand-entry or ingestion. | Verify AIP retail source format and licence, then either add a fetcher or populate with `scripts/enter_manual.py`. |
| IEA obligation/current compliance distinction | deferred | The dashboard has APS net-import cover and an IEA 90-day benchmark constant. It does not yet publish a current official compliance-gap series. | Keep showing APS cover vs 90-day benchmark unless DCCEEW publishes a current compliance series. |

## Fertiliser

| Gap | Current status | Why not filled yet | Next action |
|---|---|---|---|
| Urea, potash, phosphate, compound subseries | deferred | The live ABS Data API path used by the project exposes aggregate SITC 562 manufactured fertiliser imports. It does not expose verified monthly HS 3102/3103/3104/3105 nutrient series through the same clean API path. | Investigate ABS Data Explorer/download tables for HS-level monthly values. Populate only if the exact HS code, month, unit, and value are verified. |
| Supplier concentration | deferred | The registered envelope exists, but the concentration value requires country-by-country fertiliser import detail plus a documented aggregation method, such as top-3 share or HHI. | Fetch or hand-key country-origin detail, then document the aggregation method in `data/sources.yml` before publishing values. |
| ABARES fertiliser price index | deferred | ABARES appears to publish this through quarterly workbook/report outputs rather than a stable JSON/CSV API. | Add XLSX ingestion or hand-key values from the named ABARES release table. |
| Fertiliser stock cover | unavailable | No named public source has been verified for an Australian fertiliser stock-cover indicator. | Leave unavailable unless ABARES, DCCEEW, or another named public source publishes stock and usage inputs or a direct cover figure. |

## Oil & Production

| Gap | Current status | Why not filled yet | Next action |
|---|---|---|---|
| Tapis crude benchmark | deferred | No licence-compatible public reusable Tapis series has been verified. | Keep unavailable until a public source with acceptable reuse rights is found. |
| Refinery utilisation | deferred | APS exposes production/input fields, but not a direct utilisation percentage. Deriving utilisation would require capacity assumptions that are not yet sourced in the repo. | Populate only if APS or another public source provides utilisation directly, or if a documented capacity denominator is added and clearly labelled. |
| EIA jet fuel freshness | warning | The generated envelope is structurally valid, but the upstream daily mirror is lagging relative to the validator's daily freshness window. | Leave as warning unless the source refresh catches up or a better public refined-product benchmark is added. |
| FSSP freshness | warning | DCCEEW labels the FSSP table quarterly, but the latest public row is still 2025-26 Q1. | Keep the stale warning because it accurately tells users the verified public table has not advanced. |

## Who Pays What

| Gap | Current status | Why not filled yet | Next action |
|---|---|---|---|
| Company net profit | deferred | ATO tax fields are now populated, but net profit must come from each company's own annual report or ASIC-lodged statements and may not map one-to-one to the ATO entity. | Populate one company at a time with `scripts/enter_manual.py --field net_profit=...`, preserving fiscal year, entity scope, and source URL. |
| ACCC pure excise/GST/retailer-profit split | intentionally not published | The latest ACCC petrol snapshot publishes combined excise/GST, other costs and margins, and GIRD. It does not publish pure GST, pure excise, and pure retailer profit as separate dashboard-safe components. | Keep the current ACCC taxonomy unless a later report publishes more granular components. |

## Fuel Stress Index Gate

Do not start the Fuel Stress Index until:

- the public site is deployed and visible,
- every visible card has verified, stale, derived, or awaiting status,
- the deferred gaps above are either populated or intentionally excluded from
  the index formula,
- the index methodology includes component coverage and confidence.
