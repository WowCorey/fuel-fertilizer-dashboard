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
| AIP national average retail petrol/diesel | deferred after re-check | Existing live fuel page has AIP terminal gate price plus public-feed retail averages by product. AIP retail reports remain PDF/report oriented; no stable public historical CSV/XLSX/JSON feed with verified reuse terms has been confirmed. | Keep manual. Populate only from a reviewed AIP report or add a fetcher if AIP publishes a deterministic reusable data file. |
| IEA obligation/current compliance distinction | deferred | The dashboard has APS net-import cover and an IEA 90-day benchmark constant. It does not yet publish a current official compliance-gap series. | Keep showing APS cover vs 90-day benchmark unless DCCEEW publishes a current compliance series. |

## Fertiliser

| Gap | Current status | Why not filled yet | Next action |
|---|---|---|---|
| Urea, potash, phosphate, compound subseries | investigated, still deferred | The live ABS API returned no usable monthly series for the checked HS 3102/3103/3104/3105 and SITC 5621/5622/5623/5629 paths. A scan of the ABS latest-release International Trade in Goods workbooks found aggregate SITC 562 and country-origin data, but no dashboard-safe monthly nutrient-level value table. | Keep these cards unavailable. Re-check ABS Data Explorer or a custom ABS TableBuilder/export path before publishing any nutrient values. |
| Supplier concentration | populated | ABS MERCH_IMP exposes SITC 562 monthly import value by country of origin. The dashboard now computes the top-3 non-total source-country share against total SITC 562 imports and stores the latest country breakdown in typed `extra.fields`. | Keep the aggregation method in `data/sources.yml` and the fertiliser methodology copy aligned if the formula changes. |
| ABARES fertiliser price index | deferred | ABARES appears to publish this through quarterly workbook/report outputs rather than a stable JSON/CSV API. | Add XLSX ingestion or hand-key values from the named ABARES release table. |
| Fertiliser stock cover | unavailable | No named public source has been verified for an Australian fertiliser stock-cover indicator. | Leave unavailable unless ABARES, DCCEEW, or another named public source publishes stock and usage inputs or a direct cover figure. |

## Oil & Production

| Gap | Current status | Why not filled yet | Next action |
|---|---|---|---|
| Tapis crude benchmark | explicitly deferred | EIA's public spot-price table exposes WTI and Brent, but not Tapis. Public API vendors found during review require accounts or paid historical access and do not provide a licence-safe open Tapis time series for this repo. | Keep unavailable until an official or clearly reusable public Tapis source is confirmed. |
| Refinery utilisation | explicitly deferred | APS exposes refinery total input and production fields, but not a direct utilisation percentage or a refinery-capacity denominator. Deriving utilisation would require capacity assumptions that are not yet sourced in the repo. | Populate only if APS or another public source provides utilisation directly, or if a documented capacity denominator is added and clearly labelled. |
| EIA jet fuel freshness | resolved metadata issue | The raw FRED/EIA mirror is daily, but the dashboard envelope stores monthly means. The registry now assesses freshness as a monthly dashboard series while the source notes still identify the raw daily mirror. | Keep the source note explicit so users understand the stored value is a monthly mean, not a daily quote. |
| FSSP freshness | warning with manual workflow | DCCEEW labels the FSSP table quarterly. The public page was checked on 22 Apr 2026 and still ends at 2025-26 Q1, with the page last updated 28 Nov 2025. | Use `docs/manual-data-review-checklist.md` for quarterly review. Keep the stale warning when the verified public table has not advanced. |

## Who Pays What

| Gap | Current status | Why not filled yet | Next action |
|---|---|---|---|
| Company net profit | partial | ATO tax fields are populated. Ampol, Viva Energy, Woodside, Santos and Chevron Australia now have annual-report or audited-report-extract profit/loss fields. ExxonMobil Australia, BP Australia and Shell Australia remain blank because exact public subsidiary financial statements have not been verified for those rows. | Continue one company at a time with `scripts/enter_manual.py --field net_profit=...`, preserving fiscal year, entity scope, source URL and reported currency. |
| ACCC pure excise/GST/retailer-profit split | intentionally not published | The latest ACCC petrol snapshot publishes combined excise/GST, other costs and margins, and GIRD. It does not publish pure GST, pure excise, and pure retailer profit as separate dashboard-safe components. | Keep the current ACCC taxonomy unless a later report publishes more granular components. |

## Resource Value

| Gap | Current status | Why not filled yet | Next action |
|---|---|---|---|
| PRRT and royalty receipts | partial | The page now loads Commonwealth Budget "resource rent taxes", WA petroleum/North West Shelf receipt context, and Queensland petroleum royalty receipts. These are not project-level PRRT receipts and do not cover every Australian royalty channel. Quick checks of NT and SA budget material found combined mining/petroleum or all-resource royalty rows, not dashboard-safe petroleum-only receipts. | Keep receipt cards labelled as context. Add more state/Commonwealth receipt envelopes only when exact petroleum source rows, scope and periods are documented. |
| Production by state, basin and project | partial | The page now loads AES state/territory production rows plus AECR national/basin context. It is not yet a project-level or company-level production map. | Add project/company flow data only if a public source publishes exact fields with compatible units and reuse rights. |
| Domestic vs export price comparison | partial | ACCC domestic contract-price and LNG netback envelopes are shown side by side with a non-equivalence caveat. They are not delivered consumer prices and not a leakage calculation. | Keep the comparison contextual. Add more buyer segments or regional rows only when the ACCC source supports them cleanly. |
| 25% export-tax scenario | partial | The calculator now uses loaded LNG and oil export-value envelopes and shows loaded receipt context separately. It is not current law and not a PRRT model. | Keep the scenario labelled as a hypothetical gross-export calculation; do not expand it into policy analysis until receipt and incidence assumptions are documented. |
| Norway retained-value comparison | partial | Norway's official tax and state-revenue sources are registered, but Australia lacks a matched capture-channel denominator. | Add Australian receipts and export values on the same period basis before publishing a retained/leaked comparison. |
| Value leakage estimate | intentionally unavailable | The dashboard has no verified denominator or full receipt model. Publishing a leakage number now would be fabricated. | Keep `resource_value_leakage_model` unavailable until the methodology and all source envelopes exist. |

## Fuel Stress Index Gate

Do not start the Fuel Stress Index implementation until:

- the public site is deployed and visible,
- every visible card has verified, stale, derived, or awaiting status,
- the deferred gaps above are either populated or intentionally excluded from
  the index formula,
- the index methodology includes component coverage and confidence.

The locked methodology gate now lives in `docs/fuel-stress-index-spec.md`.

Locked candidate inputs before any scoring work:

- Include only verified envelopes for retail pump prices, ABS petroleum imports
  and YoY, APS net-import cover, APS stocks/imports/exports/production, and
  public national-status snapshot fields.
- Exclude fertiliser from a fuel-only score unless the index is explicitly
  renamed and the source coverage rules are expanded.
- Exclude Tapis, refinery utilisation, AIP national retail reports,
  project-level PRRT, "value leaked" and vessel-level tanker movement until
  each has a verified source and methodology.
- Treat manual sources as lower-confidence than programmatic sources unless
  the page is a dated public snapshot, such as PM&C national status.
- Treat stale sources as loaded but confidence-reducing, not as fresh signal.
- Publish no 0-100 score unless the visible page can show component coverage,
  missing inputs and stale/manual status beside the score.
