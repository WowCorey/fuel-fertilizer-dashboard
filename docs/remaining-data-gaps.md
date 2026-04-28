# Remaining Data Gaps

Last reviewed: 2026-04-28

This register records the known dashboard gaps that should not be filled with
estimates. A gap can move to "ready to populate" only when a named public source
contains the exact field, reporting period, unit, and reuse rights needed for a
JSON envelope.

## National status

| Gap | Current status | Why not filled yet | Next action |
|---|---|---|---|
| Programmatic PM&C/DCCEEW public fuel-supply snapshot | deferred | Rechecked 2026-04-23: the PM&C public fuel-supply page is readable in a browser, but local pipeline requests return an Incapsula challenge page and the page exposes no stable CSV, JSON or XLSX download. DCCEEW/energy.gov.au publication pages remain unreliable from the local pipeline environment. | Keep the PM&C snapshot manual and source-linked. Move to `fetch: programmatic` only if PM&C/DCCEEW publishes a stable machine-readable endpoint or an accessible static data file. |
| Vessel-level tanker movements | intentionally not published | The public PM&C page reports aggregate tanker counts and equivalent days only. It does not publish vessel identities or live AIS movements. | Keep aggregate "ships on water" counts only. Do not add vessel-level movement displays without a public, licence-compatible source and clear public-interest rationale. |
| Daily stock-out updates | partial | The current PM&C stock-out table is a dated public snapshot with seven-day changes. The WA weekly fuel update adds a WA-only dated statewide count and station denominator. Queensland Open Data now adds a monthly programmatic count of unavailable fuel-type reports where `Price = 9999`. None of these sources is a daily national API, and the PM&C table does not publish an Australia-wide petrol total. | Hand-key dated PM&C/WA snapshots when reviewed. Add further state/territory ingestion only when a stable source exposes outage or availability status with clear reuse terms. |

## Fuel security

| Gap | Current status | Why not filled yet | Next action |
|---|---|---|---|
| Fuel Security Status model | unavailable by design | The new fuel-security page shows official public snapshot fields and derived product-day cards, but it does not have enough complete, fresh operational coverage to publish a Stable/Tight/Disrupted/Critical model. Live station outages, live vessel tracking and terminal-level capacity are not loaded. | Keep `fuel_security_status_model` unavailable until the methodology has explicit coverage thresholds and every contributing input can be shown beside the output. |
| Product days remaining | populated as derived | PM&C/DCCEEW publish product-specific days in the public fuel-supply snapshot. The dashboard stores each product as a derived envelope selected from the typed PM&C parent envelope so each card can carry its own status and source line. | Keep these visibly labelled as derived from the PM&C/DCCEEW snapshot, not independently calculated from hidden assumptions. |
| Live national station outage feed | unavailable, with WA and QLD partial layers | The current public material exposes dated stock-out counts by state/territory. The WA weekly update provides one state-level dated snapshot. Queensland Open Data provides monthly unavailable fuel-type report rows. These sources do not expose a live national station outage API with station-level status. | Keep `fuel_security_live_station_outage_feed` unavailable. Add more partial state modules only when a public source exposes outage status with stable terms. |
| Live vessel/shipment tracking | unavailable | PM&C publishes aggregate tanker counts and equivalent days. It does not publish vessel identities, ETA-level flows or a licence-safe live AIS feed. The fuel-security page now uses a shipping-visibility layout for aggregate counts only; route lines are contextual, not live tracks. | Keep `fuel_security_live_vessel_tracking` unavailable and use aggregate PM&C tanker counts only. Add vessel data only after redistribution rights, API credentials, schema, confidence labels and cargo-inference rules are documented. |
| Terminal-level storage/capacity | unavailable | APS and MSO sources support national/product stock context. Geoscience Australia's National Liquid Fuel Terminals 2015 dataset was investigated on 2026-04-23; it is a terminal-location snapshot, not a capacity or live-inventory dataset. | Keep `fuel_security_terminal_capacity` unavailable. Add terminal capacity only from an official or clearly reusable source with units and date. |

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

## State Petroleum Ledger

| Gap | Current status | Why not filled yet | Next action |
|---|---|---|---|
| State petroleum royalty coverage beyond WA and Queensland | partial | WA/North West Shelf and Queensland petroleum receipt envelopes are loaded. NSW and NT combined minerals/mining plus petroleum royalty context is loaded, but these rows are not petroleum-only amounts. Other state budget material has not yet been reduced to exact petroleum-only receipt rows with period, unit and source notes. | Add one state at a time only when the petroleum-specific revenue row is verified. Keep combined minerals/resource rows visibly separated as context, not petroleum-only receipts. |
| State-level Commonwealth tax attribution | unavailable by design | Loaded PRRT, company tax, excise/GST and Commonwealth resource-rent sources do not publish defensible state-attributable receipt rows. | Keep federal tax attribution unavailable by state. Add only if an official source publishes a state split or a separately documented model is approved as a scenario, not observed data. |
| Terminal, pipeline and storage capacity by state | unavailable | Fuel-security work confirmed that terminal-location snapshots are not the same as live capacity or inventory. No official state capacity dataset with units and date is loaded. | Keep infrastructure role notes qualitative until a source publishes capacity or inventory fields. |
| Current petroleum permit/title counts | partial | NOPTA public ArcGIS FeatureServers now load current offshore non-GHG title/permit records, title types and status. This does not cover every state/onshore title system and does not turn pending applications into active titles. | Keep object classes separate. Add state/onshore title systems only when an official reusable source defines the counted object and period. |
| Petroleum Wells layer counts | partial | NOPTA Petroleum Wells feature-layer records are loaded by OffshoreArea, but the layer is not an active-producing-well inventory and includes typed and untyped records. | Keep labelled as feature-layer records. Do not present as active, producing or currently operating wells. |
| Operating refinery count by state | partial | DCCEEW official ministerial material identifies two operating refineries: Ampol in Brisbane and Viva in Geelong. The source does not provide capacity, utilisation or outage status. | Keep as facility count only. Use APS/FSSP data for production/payment context, not facility throughput by site. |
| Producing fields, LNG trains, gas-processing plants and import/storage terminal counts | unavailable | No loaded official source currently defines these objects cleanly by state with current count, period, unit and reuse rights. Geoscience Australia's 2015 liquid fuel terminals dataset remains a location snapshot with licence limitations and no capacity/live inventory. | Add only from official/current source rows that define the object class. Do not count from company pages or media lists. |
| Project/company production by state | partial | NOPTA active offshore production-licence rows now map basin, field/title, title operator and title holders where published. REMP 2024 oil-and-gas rows now map major projects to company/proponent text, resource, status and estimated new capacity. Neither source publishes current production volumes by project/company, and REMP does not publish basin names or legal operator roles. | Keep the loaded mapping visible as partial. Add current production values only from a public source with exact product, location, period, unit and reuse terms. |
| Raw resource/fuel site counts | intentionally avoided | A raw site count is misleading unless a source defines whether it counts titles, fields, wells, terminals, plants, storage assets or licences. | Keep separate columns for title records, well-layer records, refinery facilities and any future defined class. Never roll them into one site total. |

## Strategic Resources

| Gap | Current status | Why not filled yet | Next action |
|---|---|---|---|
| Rare earths individual export value | unavailable | The December 2025 REQ page discusses other critical minerals and rare earth production context, but the loaded source set does not provide an individual rare-earth export value row with period and unit. | Keep rare earth export value unavailable. Add only if DISR, ABS or another official source publishes a source-safe individual value/volume row. |
| Sulphur production/export/reserve metric | unavailable | No official national sulphur production, export, reserve/resource or state-footprint row is loaded. | Leave `strategic_resources_sulphur_gap` unavailable. Add sulphur only after a named public source supports the exact metric, unit and period. |
| Alumina refinery footprint by state | partial | The GA operating-mines layer supports bauxite mine footprint rows, not alumina refinery counts or capacities. | Keep bauxite mine footprint separate from alumina export rows. Add refinery footprint only from an official source defining facilities, state, period and capacity/count. |
| Production/export value by state | unavailable | GA operating-mines rows are feature counts, not production tonnes or export values by state. REQ export rows are national. | Do not allocate national production or export values to states by mine count. Add state splits only if an official source publishes them. |
| Underground resource wealth estimate | intentionally unavailable | AIMR reserves/resources are physical inventory concepts. Multiplying tonnes by prices would mix reserve/resource definitions, quality, recoverability, cost, timing and price assumptions. | Do not publish a national underground-wealth number. Keep reserve/resource rows physical and source-labelled. |

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
