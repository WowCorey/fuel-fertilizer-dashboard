# Remaining Data Gaps

Last reviewed: 2026-05-06

This register records the known dashboard gaps that should not be filled with
estimates. A gap can move to "ready to populate" only when a named public source
contains the exact field, reporting period, unit, and reuse rights needed for a
JSON envelope.

The public missing-data scoreboard lives at
`ui_kits/missing-data-scoreboard/index.html`. It does not add new values; it
turns the gaps below into a visible public-policy view of what is verified,
partial, stale, unavailable, source-gated or roadmap-only. The scoreboard also
uses this register to build a national readiness priority matrix and action
queue.

Priority bands in the public scoreboard are editorial/product triage only. They
are not official risk ratings, not numeric scores, and not a substitute for
verified source data. No value moves out of unavailable, stale or source-gated
status until a named public source provides the exact field, reporting period,
unit and reuse boundary.

## Status legend

| Status | Meaning |
|---|---|
| Verified | Source-backed and current enough for its cadence. |
| Partial | Source-backed, but incomplete by geography, product, timing or concept. |
| Stale | Source-backed, but outside its expected cadence window. |
| Manual | Hand-keyed from a named public source. |
| Derived | Calculated or selected from a named source envelope. |
| Unavailable | No public source-safe feed is loaded. |
| Source-gated | Waiting for a verified source, field, period, unit and reuse rights. |
| Roadmap | Planned dashboard area, not yet populated. |

Unavailable and source-gated data is not a dashboard failure. It is evidence of
a public-data gap that should remain visible until an official/public source can
support an exact field, period, unit and reuse boundary.

## Next data priorities

These are roadmap gaps only. They should stay unavailable or source-gated until
a named public source provides the exact field, period, unit and reuse rights.

### Fuel strategy / national fuel security policy

| Gap | Current status | Why not filled yet | Next action |
|---|---|---|---|
| Latest official Australian fuel strategy release | source-gated | The roadmap needs the current official strategy/policy source before it can become a dashboard envelope. | Verify the official Commonwealth source and only then add a source registry entry such as `aus_fuel_strategy_latest`. |
| National liquid fuel security strategy | source-gated | Strategy documents, operational feeds and emergency policy settings are not interchangeable metrics. | Verify the exact official publication and boundary before adding `aus_national_liquid_fuel_security_strategy`. |
| Petrol/diesel/jet days-cover by product | partial | Product days-cover exists in the PM&C/DCCEEW public snapshot, but a latest machine-readable product feed is not loaded. | Keep derived product-day cards source-linked to the PM&C/DCCEEW snapshot. Add `pmc_product_days_cover_latest` only if a stable official endpoint is verified. |
| MSO reserves and commitments | partial | MSO reserve context is hand-keyed/derived from public source material; it is not a live reserve feed. | Add or replace `pmc_mso_reserves_latest` only if an official source publishes exact current reserve rows. |
| Public vs security-sensitive fuel data boundary | source-gated | Government may withhold operational detail for security or commercial reasons; the dashboard should not infer hidden values. | Document explicit public/non-public boundaries when official guidance is available. |

### Queensland fuel sovereignty follow-up

| Gap | Current status | Why not filled yet | Next action |
|---|---|---|---|
| AFIP EOI updates and proponents | source-gated | The public pathway and EOI form are visible, but submissions, proponents, shortlists and contract awards are not published as reusable data. | Re-check official Queensland pages for updated EOI status before adding values. |
| Six-port project status | partial | The six named hubs are source-linked, but project status, capacity, land parcels and approvals are not published. | Keep hub rows contextual until an official project table exists. |
| Storage/refining capacity and state-owned land parcels | unavailable | No public source-safe parcel, capacity, readiness or ownership table is loaded. | Add only from official Queensland or port authority registers with units and dates. |
| Taroom Trough approvals status | partial | Public pages verify the pathway context, not project-level approval completion or production relevance. | Keep neutral wording until official approval registers support exact status fields. |
| Federal/state approval duplication updates | source-gated | Policy discussion is not a structured approvals dataset. | Add rows only from official approvals or policy implementation sources. |

### Live / near-live fuel operations

| Gap | Current status | Why not filled yet | Next action |
|---|---|---|---|
| Live station availability and town-level outage feeds | unavailable | No national public live dry-site/station-level API is loaded. | Add only with stable public rights, geography, product, timestamp and coverage fields. |
| Terminal inventory and constraints | unavailable | Public APS/MSO stock context does not publish terminal-level live inventory/capacity. | Keep terminal feeds unavailable until an official or licence-safe source exists. |
| Product cargo, port destination and tanker ETA visibility | unavailable | Aggregate tanker counts are not vessel names, cargo assignments, destinations or ETAs. | Do not infer from AIS or port calls. Add only with source-safe public feed rights. |
| Contract-backed deliveries | unavailable | Forward import orders and shipments are not contracts. | Keep contract coverage source-gated unless government or industry publishes periods, products, volumes and counterparties. |

### Food / farms / water

| Gap | Current status | Why not filled yet | Next action |
|---|---|---|---|
| Fertiliser stock cover and forward contracts | unavailable | Import value is loaded, but stock cover and contract coverage are not public source-safe. | Add only after named government/industry sources publish exact coverage fields. |
| Farm diesel risk and farm-gate fertiliser prices | source-gated | No source-safe national/regional farm diesel availability or farm-gate input-price row is loaded. | Verify official/industry public sources before publishing any value. |
| Water allocation by food-producing region | unavailable | Water storage/allocation sources have not been mapped to food-producing regions with a safe method. | Load one geography and concept at a time from BOM/MDBA/state sources. |
| Drought/rainfall agricultural pressure | unavailable | Visual maps and narrative reports are not dashboard values. | Add exact rainfall-deficiency, drought class or storage rows only when table/API fields are verified. |
| Crop planting decision pressure and freight disruption | source-gated | No crop-window or freight-risk metric is loaded. | Keep as planning questions until official/public datasets are verified. |

### Defence / naval procurement

| Gap | Current status | Why not filled yet | Next action |
|---|---|---|---|
| Japan/Australia warship procurement pathway | source-gated | Source-gated: pending official Defence/public procurement source verification. No current procurement fact is asserted here. | If official Defence material is verified, add a source gate such as `defence_japan_warship_procurement_source_gate`. |
| Frigate/general-purpose vessel contract status and delivery timeline | source-gated | No source-safe contract row, delivery schedule or industry-content field has been loaded. | Add `defence_frigate_procurement_status` only from official procurement or Defence sources. |
| Naval logistics/fuel implication | source-gated | Procurement discussion is not itself a fuel/logistics metric. | Add `defence_naval_logistics_fuel_implication` only if an official source links the procurement path to logistics or fuel posture. |

### Housing / economy

| Gap | Current status | Why not filled yet | Next action |
|---|---|---|---|
| Housing and Economic Pressure page | partial | The page now reuses existing source-backed RBA, ABS and NHSAC envelopes for latest cash rate, monthly cash-rate history, household debt, mortgage-rate context, CPI, unemployment, dwelling stock and housing-target progress. | Keep the page as observed indicators plus source gates until housing model inputs are verified. |
| Mortgage repayment pressure and first-home buyer indicators | source-gated / roadmap | Official rate and debt signals are loaded, but repayment pressure needs loan-size, rate, term and income assumptions. No first-home buyer source row is loaded on the new page. | Scope official ABS/RBA/APRA/state sources before adding cards or modelling assumptions. |
| Investor ownership, investor lending, negative gearing and rental stress | source-gated / roadmap | Concepts differ across tax, tenancy, ownership, lending, supply and affordability datasets. | Do not combine them until each source boundary and method is defined. |
| Dwelling approvals / housing supply pipeline | partial | ABS residential dwelling stock and NHSAC Accord progress are loaded, but regional approvals/completions and pipeline status are not. | Add approvals, completions or pipeline rows only from named ABS/NHSAC/state sources with exact period, unit and geography. |
| Household debt expansion | partial | RBA household debt-to-income is loaded, but not every housing stress signal. | Extend only with verified RBA/ABS/APRA rows. |

### AI automation / workforce displacement

| Gap | Current status | Why not filled yet | Next action |
|---|---|---|---|
| Sector automation exposure and displacement risk | unavailable | No source-safe Australian exposure score is loaded, and the Employment & Automation page does not assert AI causation. | Add only from named Australian official/public sources. |
| Productivity upside/downside and retraining capacity | source-gated | Productivity and retraining metrics require separate official concepts and periods. | Keep context separate from labour-market outcomes. |
| Regional workforce exposure | source-gated | No regional automation-exposure dataset is loaded. | Add only with geography, occupation/industry mapping and caveats. |

### Olympics readiness

| Gap | Current status | Why not filled yet | Next action |
|---|---|---|---|
| Brisbane 2032 infrastructure delivery | roadmap | No Olympics readiness dashboard surface exists yet. | Scope official delivery authority, transport and infrastructure sources first. |
| Transport, accommodation, power, tourism and emergency logistics pressure | roadmap | These are separate datasets and cannot be rolled into a single readiness score without a documented method. | Add source-safe indicators one at a time and keep missing feeds visible. |

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

## Queensland fuel sovereignty / Premier interview gap list

| Gap | Current status | Why not filled yet | Next action |
|---|---|---|---|
| Six-port hub official list | partial, official list loaded | Queensland Government material names Brisbane, Townsville, Mackay, Gladstone, Abbot Point and Bundaberg for the Accelerating Fuel Infrastructure Program. This is a hub list, not a capacity, project or land-parcel dataset. | Keep `qld_fuel_hub_six_ports_official_list` as public context only. Add site-level rows only if government publishes port/site status, land boundary, use and approval fields. |
| State-owned land availability | source-gated | The Coordinator-General page says a state-wide audit of suitable government-owned industrial and port land is underway, but it does not publish parcel IDs, hectares, tenure or site readiness. | Keep `qld_fuel_hub_state_owned_land` partial/contextual. Add parcels only from an official register or program table. |
| EOI/bids and private-sector proposals | mostly unavailable | The Stage 1 EOI pathway and form are public, but submission counts, proponent names, proposal categories, shortlist and award/contract status are not published as reusable data. | Keep `qld_fuel_security_private_proposals` and `qld_fuel_security_bid_status` unavailable until the Coordinator-General publishes a public status table. |
| Refining/storage project pipeline | source-gated | Public material describes a policy pathway and market engagement process. It does not publish refinery/storage capacity, final investment decisions, approved projects or build dates. | Keep `qld_refining_capacity_source_gate` and `qld_refinery_option_status` unavailable. Do not derive capacity from APS production. |
| Taroom Trough / drilling approvals pathway | partial | Official pages verify the Taroom Trough name and a Development Plan/works regulation pathway. They do not publish reserves, commercial production status, project-level approvals or federal approval completion. | Keep `qld_taroom_trough_source_gate` and `qld_drilling_approvals_pathway` as partial context. Add project-level fields only from official approvals or project registers. |
| Forward fuel/fertiliser contract coverage | unavailable | Forward import orders and aggregate tankers are not contracts. No public government/industry feed publishes coverage periods, counterparties, volumes or product-specific contracted deliveries. | Keep `fuel_forward_contract_coverage`, product-level contract gates and `fertiliser_forward_contract_coverage` unavailable. Do not infer contracts from shipments or prices. |
| Product-specific cargo horizon and port destinations | unavailable | PM&C aggregate tanker counts do not publish vessel names, product cargo assignment, ETA or destination port. | Keep this as an evidence board/horizon table only. Add cargo rows only with a licence-safe official feed. |
| Farmer decision inputs | source-gated | Fertiliser import value is loaded, but farm diesel, fertiliser cover, planting-window pressure, water allocation by food region, drought pressure and freight disruption are not loaded as public source-safe data. | Keep farmer decision-pressure rows on the Food, farms & water page as unavailable/source-gated until named sources publish exact fields. |
| Small business planning indicators | source-gated | Fuel price pressure and outage visibility are partial. Freight disruption, tourism route pressure, supply-chain delay and hiring/workforce planning feeds are not loaded. | Add only official/public rows with geography, date, unit and reuse rights. |
| New Zealand comparison | partial | MBIE publishes New Zealand fuel-security, minimum stockholding and fuel-stock update material. This does not prove an equivalent Queensland dashboard model. | Keep NZ comparison rows as context. Add stock values or model comparison only if MBIE/public sources support exact fields and rights. |

## AU Economics

| Gap | Current status | Why not filled yet | Next action |
|---|---|---|---|
| State and territory net debt | partial (8/8 values loaded; no aggregate) | Pass 2C populated SA A$25.2b GGS, TAS A$7.1b GGS, ACT A$11.0b GGS excluding superannuation and NT A$12.2b Non Financial Public Sector net debt from official 2025-26 Budget Paper sources. NSW/VIC/QLD/SA/TAS/ACT are GGS or ACT-specific GGS rows. WA remains A$39.0b Total Public Sector and NT remains NFPS, so the table is useful but not conceptually uniform. | Keep the national aggregate withheld. A future pass may replace WA/NT with clean GGS rows only if official budget papers expose a single-year value with row label, period and unit. |
| AOFM monthly AGS face value | deferred | AOFM's settlement workbook supports a richer monthly face-value series, but repeated read timeouts made it unsuitable for a programmatic fetch in this pass. The dashboard instead uses the smaller official annual `stock_ags.csv` face-value file. | Retry the settlement workbook later or add a cached/manual monthly row only after the workbook can be fetched reliably and the AOFM boundary note is preserved. |

## Fuel

| Gap | Current status | Why not filled yet | Next action |
|---|---|---|---|
| AIP national average retail petrol/diesel | deferred after re-check | Existing live fuel page has AIP terminal gate price plus public-feed retail averages by product. AIP retail reports remain PDF/report oriented; no stable public historical CSV/XLSX/JSON feed with verified reuse terms has been confirmed. | Keep manual. Populate only from a reviewed AIP report or add a fetcher if AIP publishes a deterministic reusable data file. |
| IEA obligation/current compliance distinction | deferred | The dashboard has APS net-import cover and an IEA 90-day benchmark constant. It does not yet publish a current official compliance-gap series. | Keep showing APS cover vs 90-day benchmark unless DCCEEW publishes a current compliance series. |

## Food, farms & water security

| Gap | Current status | Why not filled yet | Next action |
|---|---|---|---|
| Agricultural production rows | unavailable source gates | ABARES/ABS/DAFF candidate sources are registered, but no exact crop or livestock production row has been hand-keyed with period, unit and concept boundary. | Populate wheat, beef and other commodity rows only after the exact publisher table supports production, exports, stocks or prices as separate fields. |
| Food imports | unavailable source gate | ABS International Trade in Goods is registered as the candidate source, but the food-import category boundary has not been verified for a dashboard-safe monthly or annual value. | Wire or hand-key only after the ABS commodity grouping, value basis, period and unit are confirmed. |
| Agricultural exports | unavailable source gates | ABARES/DAFF and ABS trade sources are registered, but no aggregate export value is loaded because narrative summaries must not be converted into dashboard values. | Add a value only from a named table/figure with period, unit and scope. Keep ABS goods exports separate from ABARES production and forecast rows. |
| Water/rainfall/drought pressure | unavailable source gates | BOM and MDBA candidate sources are registered, but no source-safe national agricultural pressure metric, rainfall-deficiency row, water-storage row or irrigation allocation row is wired. | Populate only after the exact product, geography, period, unit/class and reuse terms are verified. Do not infer values visually from maps. |
| Farmer decision pressure | source-gated | The page now lists the farm-planning questions, but fertiliser stock cover by region, farm diesel risk, crop planting-window pressure, water allocation by food region, drought pressure by agriculture region and freight disruption by farm region are not loaded. | Populate one row at a time only from official/public sources with exact geography, period, units and reuse terms. |
| Urea, potash, phosphate, compound subseries | investigated, still deferred | The live ABS API returned no usable monthly series for the checked HS 3102/3103/3104/3105 and SITC 5621/5622/5623/5629 paths. A scan of the ABS latest-release International Trade in Goods workbooks found aggregate SITC 562 and country-origin data, but no dashboard-safe monthly nutrient-level value table. | Keep these cards unavailable. Re-check ABS Data Explorer or a custom ABS TableBuilder/export path before publishing any nutrient values. |
| Supplier concentration | populated | ABS MERCH_IMP exposes SITC 562 monthly import value by country of origin. The dashboard now computes the top-3 non-total source-country share against total SITC 562 imports and stores the latest country breakdown in typed `extra.fields`. | Keep the aggregation method in `data/sources.yml` and the fertiliser methodology copy aligned if the formula changes. |
| ABARES fertiliser price index | deferred | ABARES appears to publish this through quarterly workbook/report outputs rather than a stable JSON/CSV API. | Add XLSX ingestion or hand-key values from the named ABARES release table. |
| Fertiliser stock cover | unavailable | No named public source has been verified for an Australian fertiliser stock-cover indicator. | Leave unavailable unless ABARES, DCCEEW, or another named public source publishes stock and usage inputs or a direct cover figure. |

## Employment & Automation

| Gap | Current status | Why not filled yet | Next action |
|---|---|---|---|
| Underemployment rate | manual stub | ABS LF dataflow MEASURE M23 (Underemployment rate, proportion of labour force) was probed at the standard headline shape (`M23.3.1599.20.AUS.M` and several variants). All returned 404 from the live ABS Data API. The dataflow does not expose the headline underemployment series at the standard sex/age/TSEST combination used for unemployment and participation. | Investigate alternative LF subdomain dataflows or hand-key the headline figure from the named Cat. 6202.0 workbook before promoting to programmatic. |
| Monthly hours worked in all jobs | manual stub | ABS LF dataflow MEASURE M18 and M43 were probed at the standard headline shape and returned 404. | Investigate alternative LF subdomain dataflows or hand-key the headline value from the named Cat. 6202.0 workbook before promoting to programmatic. |
| Australian automation/AI labour-market exposure | intentionally unavailable | No source-safe Australian official dataset of automation or AI exposure by occupation or industry has been identified. International "occupational exposure" methodologies (e.g. OECD/Frey-Osborne) cannot be silently mapped to Australian rows because their concept boundaries differ. | Load only when a named Australian publisher (Productivity Commission, DEWR, DISR or ABS) releases a directly comparable Australian indicator. |
| Causal AI rollout attribution | not in scope | The page tracks Australian labour-market change during the AI rollout era using ABS series, paired with a context-only AI rollout timeline. It does NOT assert AI caused any labour-market movement. | Continue to refuse causal labels. The AI timeline is a list of dated, named events from the listed organisations and is not a causal explanation. |

## Manufacturing

| Gap | Current status | Why not filled yet | Next action |
|---|---|---|---|
| Manufacturing share of GDP | unavailable | The page defines the intended concept as ANZSIC division C gross value added as a share of total industry GVA, but the exact ABS National Accounts table/API mapping for a repeatable calculation has not been verified in this pass. | Keep `abs_manufacturing_gdp_share` unavailable until the source table, denominator, period and unit are verified together. |
| Department of Industry profile row | unavailable | No named Department of Industry, Science and Resources publication has been loaded that supports a clean dashboard row with exact period, unit and factual scope. | Keep `doe_industry_growth_centres_summary` unavailable. Add only a named factual row, not a narrative or promotional summary. |
| Manufacturing sales wording | populated with caveat | ABS Business Indicators Table 4 supports manufacturing income from sales of goods and services, chain volume measures. This is a sales/output proxy, not a separate production-index series. | Keep the card and methodology labelled as sales/income from sales of goods and services. Do not relabel it as a production index unless a source-safe production index is added. |
| Manufactured exports unit | resolved | ABS International Trade Table 12a values for SITC sections 5-8 are published in AUD millions. | Keep generated `abs_manufactured_exports_total` in AUD millions; do not convert as if the source values were AUD thousands. |

## Infrastructure

| Gap | Current status | Why not filled yet | Next action |
|---|---|---|---|
| Infrastructure Australia priority-list count and capital cost | unavailable | The 2026 Infrastructure Priority List overview is public, but the proposal-count view is rendered through a dynamic search endpoint. Direct endpoint checks in this pass returned a request-blocked page, and the static overview did not expose a clean count or aggregate capital-cost row. | Keep `infrastructure_australia_priority_list` unavailable until an official export, static table or publication row is verified. Do not count navigation items or scrape blocked output. |
| Australian data centre capacity | intentionally unavailable | No canonical public Australian government register of data centre capacity, MW load or AI-cluster capacity was identified. Vendor, consultancy and private market datasets are not source-safe public register inputs for this dashboard. | Keep `au_data_centre_capacity_register` unavailable unless a named public source publishes comparable capacity fields with date, unit and reuse terms. |
| ACCC NBN speed concept | populated with caveat | ACCC Report 32 supports a state/territory range for average NBN fixed-line busy-hour download performance as a percentage of plan speed. It does not provide the page with a single source-safe median Mbps figure. | Keep the card labelled as percentage-of-plan busy-hour performance. Add Mbps only if the ACCC source publishes a clean comparable Mbps row. |
| BITRE passenger and freight coverage | populated with caveat | BITRE public transport is capital-city patronage, airport movements are the eight capital city airports, and freight is domestic freight task in tonne-kilometres. These are scoped indicators, not full national mobility, all-airport or tonnes measures. | Keep partial-coverage trust labels visible and do not merge these concepts into broader totals. |

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

## Power Grid

| Gap | Current status | Why not filled yet | Next action |
|---|---|---|---|
| AEMO NEM price and demand | populated programmatically | The public AEMO Price and Demand CSV archive now fetches successfully for NSW1, VIC1, QLD1, SA1 and TAS1. The dashboard stores monthly mean RRP and operational demand plus latest-month region values. | Keep the fetcher on the static AEMO CSV pattern. Do not replace monthly means with live dispatch data unless methodology and freshness labels change. |
| Fuel mix, WEM and ISP fields | populated manually | AEMO QED Q4 2025 and the 2024 ISP provide source-safe headline rows, but the repo has not added stable programmatic ingestion for those reports. | Refresh by manual review after each named AEMO release, or add a parser only when the workbook/PDF layout is stable enough to validate. |
| Generation register and coal retirement timeline | populated manually with caveats | January 2026 AEMO workbooks support listed capacity and explicit coal closure-date capacity. Listed capacity includes anticipated and publicly announced projects, and explicit closure-date capacity excludes expected-year-only coal rows. | Keep those concepts separate. Do not present listed capacity as available capacity, or expected-year-only rows as scheduled closure-date capacity. |
| DCCEEW electricity emissions | populated manually as annual sector emissions | DCCEEW September 2025 Table 3 supports Energy - Electricity annual emissions for the year to September 2025. It does not make this card a single-quarter electricity emissions value. | Refresh from the next DCCEEW quarterly update only when the annual sector table is verified. Keep preliminary values separate if added later. |

## Strategic Resources

| Gap | Current status | Why not filled yet | Next action |
|---|---|---|---|
| Rare earths individual export value | unavailable | The December 2025 REQ page discusses other critical minerals and rare earth production context, but the loaded source set does not provide an individual rare-earth export value row with period and unit. | Keep rare earth export value unavailable. Add only if DISR, ABS or another official source publishes a source-safe individual value/volume row. |
| Sulphur production/export/reserve metric | unavailable | No official national sulphur production, export, reserve/resource or state-footprint row is loaded. | Leave `strategic_resources_sulphur_gap` unavailable. Add sulphur only after a named public source supports the exact metric, unit and period. |
| Alumina refinery footprint by state | partial | The GA operating-mines layer supports bauxite mine footprint rows, not alumina refinery counts or capacities. | Keep bauxite mine footprint separate from alumina export rows. Add refinery footprint only from an official source defining facilities, state, period and capacity/count. |
| Production/export value by state | unavailable | GA operating-mines rows are feature counts, not production tonnes or export values by state. REQ export rows are national. | Do not allocate national production or export values to states by mine count. Add state splits only if an official source publishes them. |
| Underground resource wealth estimate | intentionally unavailable | AIMR reserves/resources are physical inventory concepts. Multiplying tonnes by prices would mix reserve/resource definitions, quality, recoverability, cost, timing and price assumptions. | Do not publish a national underground-wealth number. Keep reserve/resource rows physical and source-labelled. |

## Defence, Alliances and Strategic Posture

| Gap | Current status | Why not filled yet | Next action |
|---|---|---|---|
| Mission-capable rates and live operational availability | intentionally unavailable | Public asset counts and acquisition announcements do not show readiness, serviceability, crewing, deployability or live availability. Publishing inferred readiness would be fabricated and may be sensitive. | Keep `defence_readiness_gap` unavailable. Add a metric only if a named public source publishes the exact field and the project decides it is source-safe to show. |
| Munitions stockpile size or adequacy | unavailable | Defence publishes GWEO funding and program context, but the loaded public sources do not publish stockpile depth or adequacy rows. | Keep stockpile size and adequacy out of the dashboard. Use GWEO only as industry/program context. |
| Classified basing posture or live deployments | intentionally unavailable | The page is public-facing and does not load classified, sensitive or live posture data. | Do not add live basing, deployment or classified posture rows. |
| Defence spending as share of GDP | unavailable in first pass | The page has not loaded a current official percentage row or a documented GDP denominator envelope. | Add only from an official row or from a documented derived method with the GDP denominator shown. |
| Complete ADF platform inventory | partial | The first pass loads selected official public rows across Navy, Air Force and Army. It is not a full equipment catalogue. | Add one capability class at a time from official public sources, preserving acquisition/current-count wording and readiness caveats. |
| Estate/base capacity | unavailable | No source-safe public estate-capacity table is loaded, and some basing detail can be sensitive. | Keep base/estate rows qualitative or unavailable until an official public source defines exact fields, units and periods. |
| Complete ADF uncrewed-systems inventory | partial | Selected official Defence project rows are loaded for in-service (Triton, Integrator), development (Ghost Bat, Ghost Shark), counter-drone (LAND 156) and sovereign-program (SDIP autonomous systems) categories. No public Defence page consolidates a complete uncrewed inventory with consistent fields. | Add further uncrewed rows one at a time from named Defence project pages, keeping in-service / acquisition / development / sovereign / counter-drone categories separate. |
| Drone-only Defence budget | unavailable | The 2024 Integrated Investment Program and the 2026 National Defence Strategy reference uncrewed and autonomous-systems lines inside broader capability investment envelopes. Neither publishes a clean drone-only line. Presenting a bundled IIP or NDS line as a drone budget would misrepresent the source. | Leave the drone-only budget row Unavailable until a public Defence document separates it cleanly. Use IIP / NDS rows only as envelope context, with explicit boundary text. |
| Uncrewed mission-capable rates, sortie rates and live availability | intentionally unavailable | Defence public project pages do not publish per-platform mission-capable rates, sortie rates or live availability for any uncrewed system. | Do not add. Keep readiness-sensitive uncrewed metrics out of the dashboard. |
| Classified or sensitive uncrewed systems | intentionally unavailable | Public-facing dashboard. Sensitive or classified uncrewed work is not in scope. | Do not add. |

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
