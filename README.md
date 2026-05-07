# Fuel Resilience AU

[![Deploy GitHub Pages](https://github.com/WowCorey/fuel-fertilizer-dashboard/actions/workflows/pages.yml/badge.svg)](https://github.com/WowCorey/fuel-fertilizer-dashboard/actions/workflows/pages.yml)

A neutral, public-interest dashboard for everyday Australians — tracking the
bits of the energy and agricultural supply chain that most shape prices at the
pump and at the farm gate. Written in plain English, sourced from named public
Australian and international sources, and explicit when data is unavailable.

**Status:** Nineteen dashboard surfaces plus a missing-data scoreboard read from
a shared JSON-envelope data pipeline. Programmatic live sources now include ABS
petroleum imports and YoY,
ABS fertiliser imports, food/farm/water source gates, APS net-import cover, APS refinery production series,
AIP terminal gate prices, RBA AUD/USD, EIA/FRED crude and refined-fuel series,
and the multi-state retail fuel average. The national status page adds a
manually verified PM&C/DCCEEW public fuel-supply snapshot. The resource value
page adds official tax, PRRT, WA/NWS and Queensland royalty receipts,
export-value and Norway comparison envelopes, while leaving unsupported leakage and price-comparison claims
unavailable. The state petroleum ledger separates state production,
infrastructure roles, revenue context and source gates. The strategic resources
page adds DISR REQ export rows, Geoscience Australia AIMR production/reserve rows
and GA/Digital Atlas operating-mines footprint context, while leaving rare-earth
individual export value and sulphur unavailable. The defence posture page adds
public Defence budget, workforce, selected capability, alliance/framework and
sovereign-industry context, while leaving readiness-sensitive and unsupported
fields unavailable. The fuel-security page reuses the public PM&C/DCCEEW snapshot,
APS product-flow envelopes and ABS import data to show what is observable,
derived, partial or unavailable. It also tracks Queensland fuel-sovereignty
planning gaps: official six-port, EOI and Taroom pathway context is visible,
while land parcels, bid counts, contracts, capacity, approvals and live feeds
remain source-gated. The former fertiliser page is now framed as
Food, farms & water security: it keeps verified fertiliser import coverage and
adds explicit agricultural production, food trade, farmer decision-pressure and
water-pressure source gates.
Other sources remain manual or unavailable
until a named public source can support the value.

## What this is

Australia imports around 90% of its refined fuel and the majority of its
fertiliser. When overseas supply wobbles, it shows up domestically within days
to weeks. Most of the raw numbers are public but scattered across government
reports and trade databases. This project pulls the source references into one
place, fetches the sources that are safe to fetch, and leaves every unverified
figure visibly unavailable.

The dashboards have no publisher brand, no sponsors, and no affiliation with
any government department or industry body. The project does not fabricate,
interpolate or estimate missing numbers.

The homepage now opens with a plain-English national dashboard summary and
best-first-click links for fuel security, fuel strategy, Queensland fuel delivery,
missing data, readiness triage, food and farms, housing pressure, defence procurement
and AU economics. It also links to a missing-data scoreboard that
shows where a feed is verified, partial, stale, manual, derived, unavailable,
source-gated or roadmap only. The scoreboard includes a national readiness
priority matrix and action queue. Priority bands are categorical
editorial/product triage only, not numeric risk scores or official ratings.
Unavailable and source-gated rows are treated as public-data gaps, not as
permission to estimate.

## Dashboards

| Page | Version | What it covers | Current data state |
|---|---|---|---|
| [National status](ui_kits/national-status-dashboard/index.html) | v1.4 | National Fuel Security Plan level, MSO reserves, ships on water and retail stock-outs | PM&C/DCCEEW public fuel-supply snapshot hand-keyed; direct scripted access is blocked/deferred until a stable machine-readable endpoint exists |
| [Fuel security](ui_kits/fuel-security-dashboard/index.html) | v1.7 | Product days remaining, PM&C/DCCEEW fuel-supply snapshot, APS stocks/sales/imports, import/shipping risk context, WA weekly stockout context, QLD monthly unavailable-fuel reports, Queensland fuel-sovereignty pathway gaps and unavailable operational feeds | Product days are derived from the named PM&C/DCCEEW snapshot; APS/ABS, public retail feeds, a WA-only weekly stockout snapshot and QLD Open Data unavailable-fuel reports are loaded where available. Queensland Government sources verify the six named ports, Stage 1 EOI pathway and Taroom Trough pathway as public context only. Land parcels, bid counts, forward contracts, project approvals, refinery/storage capacity, live national station outage, vessel tracking, terminal capacity and status-score feeds remain unavailable/source-gated. |
| [Fuel strategy](ui_kits/australian-fuel-strategy-dashboard/index.html) | v0.1 | Australian fuel strategy, reserve/MSO indicators, product-level days-cover visibility, emergency-response boundaries and missing public policy feeds | Reuses existing PM&C/DCCEEW fuel-security envelopes for MSO days cover, MSO reserve volumes, product-level derived days and Fuel Security Services Payment context. Latest strategy, national liquid fuel security policy, emergency response settings, terminal/storage visibility and forward contract coverage remain source-gated; no fuel strategy facts, reserve values or emergency settings are invented. |
| [QLD fuel sovereignty](ui_kits/qld-fuel-sovereignty-dashboard/index.html) | v0.1 | Queensland six-port AFIP delivery pathway, state-owned land audit, EOI/private-sector proposals, storage/refining pathway, Taroom Trough approvals and missing delivery feeds | Reuses existing Queensland Government / Coordinator-General envelopes. Six-port list, AFIP/EOI context, state-owned land audit context, domestic fuel pathway and Taroom Trough/approvals pathway are source-linked where available; capacity, land parcels, proponents, bid counts, contracts/awards, project delivery status and approval completion remain unavailable/source-gated. |
| [Resource value](ui_kits/resource-value-dashboard/index.html) | v1.5 | Company tax, PRRT, petroleum royalties, LNG/oil export value, gas origin, export destinations, domestic-vs-netback context and Norway comparison | Official receipt, export, production, destination and gas-price comparison envelopes are hand-keyed from named public sources, including WA/NWS and Queensland petroleum royalty receipt context; value-leakage estimate remains unavailable until a documented denominator and method exist |
| [State petroleum ledger](ui_kits/state-contribution-dashboard/index.html) | v1.3 | State/territory petroleum and gas production roles, defined object counts, partial project/operator mapping, infrastructure context, state royalty receipts, combined royalty context and source gates | AES state production rows, NOPTA offshore title/well-layer counts, NOPTA active production-licence field/operator rows, REMP oil/gas major-project rows, QLD/VIC operating refinery counts, WA/NWS and Queensland petroleum receipts, NSW/NT combined royalty context and source-gate workstreams are loaded; Commonwealth tax attribution by state, current project/company production volumes, terminal capacity, LNG train counts and raw site totals remain unavailable |
| [Strategic resources](ui_kits/strategic-resources-dashboard/index.html) | v1.0 | Iron ore, coal, uranium, bauxite/alumina, copper, nickel, lithium, rare earths, gold, zinc and sulphur source-gate context | DISR REQ export rows, GA AIMR 2025 production/reserve/resource rows and GA/Digital Atlas operating-mines footprint rows are loaded where source-safe; rare-earth individual export value and sulphur production/export/reserve rows remain unavailable |
| [Defence posture](ui_kits/defence-alliances-dashboard/index.html) | v1.1 | Defence spending, selected public ADF capability rows, force-structure context, uncrewed systems and counter-drone, alliances/frameworks and sovereign defence-industry context | 2026 NDS budget rows, Defence Annual Report workforce rows, selected Navy/Air Force/Army public capability rows, selected uncrewed-systems rows (Triton, Ghost Bat, Integrator, LAND 156 counter-small UAS, Ghost Shark, SDIP autonomous systems, RAN maritime autonomous context), ANZUS/AUKUS/Five Eyes/Quad/AUSMIN/PNG framework profiles and SDIP/GWEO industry context are loaded; readiness, mission-capable rates, live availability, munitions stockpile depth, classified posture, GDP-share fields and a clean drone-only budget remain unavailable |
| [Defence procurement](ui_kits/defence-procurement-watch/index.html) | v0.1 | Public-source procurement watch for source-gated contract pathways, delivery timelines, industry-content questions, logistics implications and public/private defence-data boundaries | Adds source-gated procurement envelopes and reuses existing defence posture / strategic-resource context. No Japan/Australia warship fact, vessel class, supplier, contract, value, delivery timeline, industry-content claim, fuel/logistics metric or operational posture is asserted without official source material. |
| [Fuel](ui_kits/fuel-dashboard/index.html) | v1.0 | Imports, prices, days of net import cover | ABS imports, ABS YoY, APS net-import cover, AIP TGP and public-feed retail averages for ULP 91, diesel, premium 95 and E10 fetched; AIP national retail reports remain manual |
| [Food, farms & water security](ui_kits/fertilizer-dashboard/index.html) | v1.3 | Food-system visibility, fertiliser and farm inputs, farmer decision-pressure, agricultural production/export source gates, food import source gates, water and seasonal pressure | ABS SITC 562 total fertiliser imports and source-country top-3 concentration are loaded; agricultural production, food imports, agricultural exports, farm diesel risk, crop planting-window pressure, water storage/allocation, rainfall/drought pressure, freight disruption, nutrient subseries, ABARES price and stock cover remain unavailable placeholders until source-safe values are wired |
| [Oil & production](ui_kits/oil-and-production/index.html) | v1.2 | Brent/WTI/Tapis, domestic refining, IEA gap, Fuel Security payments | Brent/WTI, AUD conversions, EIA diesel/jet, APS production and APS product-flow series fetched; DCCEEW FSSP/offshore disclosures are hand-keyed; Tapis and refinery utilisation remain unavailable |
| [Who pays what](ui_kits/who-pays-what/index.html) | v1.3 | Revenue, tax paid and effective tax rates for major energy companies, plus retail-price breakdown | ATO 2023-24 corporate tax fields, five company profit rows and ACCC December quarter 2025 petrol components are hand-keyed; remaining private Australian subsidiary profit stays unavailable until source filings are verified |
| [AU economics](ui_kits/au-economics-dashboard/index.html) | v1.2 | RBA cash rate, household and government debt, mortgages, unemployment and inflation, plus a state/territory debt summary (8/8 values loaded, no aggregate) | RBA cash-rate headline now loads the latest official RBA decision-table target while the chart keeps the F1.1 monthly-average history; household debt-to-income (E2), standard variable mortgage rate (F5), credit-card balances accruing interest (C1.1), ABS real GDP growth, unemployment and CPI load from verified RBA/ABS endpoints; AOFM AGS face value is hand-keyed from official stock_ags.csv; state-level net debt now has 8 of 8 jurisdiction values verified from official Budget Paper PDFs: NSW A$120.3b GGS, VIC A$167.6b GGS, QLD A$41.8b GGS, SA A$25.2b GGS, TAS A$7.1b GGS, ACT A$11.0b GGS excluding superannuation, WA A$39.0b Total Public Sector and NT A$12.2b Non Financial Public Sector. WA and NT remain Partial coverage concept caveats, and no national aggregate is published. |
| [Housing pressure](ui_kits/housing-economic-pressure-dashboard/index.html) | v0.1 | Housing and economic pressure, including latest RBA cash-rate target, cash-rate history, household debt, mortgage-rate context, inflation, unemployment, dwelling stock, NHSAC housing target progress and source-gated housing model gaps | Reuses existing source-backed RBA, ABS and NHSAC envelopes. Mortgage repayments, rental stress, first-home buyer indicators, investor ownership/lending and negative-gearing effects remain source-gated; no housing stress score or repayment model is invented. |
| [Manufacturing](ui_kits/manufacturing-dashboard/index.html) | v1.0 | Manufacturing share of GDP, employment, sales, exports, capex and food/beverage subsector | ABS Labour Force Detailed industry employment, Business Indicators manufacturing sales, International Trade SITC 5-8 manufactured exports, Private New Capex (Cat. 5625.0) and food/beverage employment now load from verified ABS latest-release XLSX tables; manufacturing GDP share and the Department of Industry profile stay unavailable until exact source-safe mappings are verified |
| [Power grid](ui_kits/power-grid-dashboard/index.html) | v1.0 | NEM wholesale price and demand by state, fuel mix, generation register, coal retirement timeline, emissions and ISP forecasts | AEMO NEM regional wholesale price and total operational demand are fetched programmatically from the AEMO 5-minute Price and Demand archive across NSW1, VIC1, QLD1, SA1 and TAS1; Q4 2025 AEMO QED fuel mix and WEM price, January 2026 AEMO Generation Information totals and explicit coal closure-date capacity, CER 2024 NEM+SWIS renewable share, DCCEEW year-to-September 2025 electricity emissions and the 2024 ISP transmission headline are hand-keyed from named official publications |
| [Infrastructure](ui_kits/infrastructure-dashboard/index.html) | v1.0 | Population vs dwellings, housing target progress, public transport, airports, freight, NBN busy-hour performance and the major-project pipeline | ABS quarterly population (ERP_Q), year-on-year growth rate and residential dwelling stock (RES_DWELL_ST) fetched programmatically from the ABS Data API; NHSAC Accord progress, BITRE public transport / airports / freight and ACCC Measuring Broadband Australia busy-hour performance are now hand-keyed from named official sources; Infrastructure Australia proposal count remains unavailable until a clean official extract is verified; Australian data centre capacity stays intentionally unavailable as no canonical public register exists |
| [Employment & Automation](ui_kits/employment-automation-dashboard/index.html) | v0.5 | Australian labour-market change during the AI rollout era - unemployment, participation, employment-to-population, job vacancies, wages, plus context-only AI rollout milestones | ABS LF unemployment / participation / employment-to-population, ABS Job Vacancies (JV) and ABS Wage Price Index (WPI) annual % change fetched programmatically from the ABS Data API; underemployment rate and monthly hours worked stay on manual (LF dataflow standard headline keys returned 404 in initial probing); AI rollout timeline carries dated public milestone events from named publishers as context only; Australian automation/AI labour-market exposure remains intentionally unavailable as no source-safe Australian dataset has been identified. Page rule: timing is not causation. |
| [Missing data scoreboard](ui_kits/missing-data-scoreboard/index.html) | v0.2 | Public-policy view of verified, partial, stale, unavailable, source-gated and roadmap-only dashboard gaps, plus a national readiness priority matrix | No new source values. The page maps missing feeds, likely data holders, why each gap matters, next source actions and affected dashboard surfaces; it adds categorical priority bands and an action queue without numeric scores or official risk ratings. Roadmap areas remain source-gated until exact public fields, dates, units and reuse rights are verified. |

Every page cross-links to the others in the header nav.

Known missing data is tracked in
[`docs/remaining-data-gaps.md`](docs/remaining-data-gaps.md). Those gaps stay
unavailable until a named public source supports the exact value.
Fuel-security source investigations are recorded in
[`docs/fuel-security-source-investigation.md`](docs/fuel-security-source-investigation.md),
including the current PM&C/DCCEEW access result, station-outage limits,
shipping limits and terminal-capacity decision. Issue-ready source gates are in
[`docs/fuel-security-backlog.md`](docs/fuel-security-backlog.md).
State petroleum ledger attribution rules are documented in
[`docs/state-contribution-methodology.md`](docs/state-contribution-methodology.md),
with source-gate decisions in
[`docs/petroleum-ledger-source-gates.md`](docs/petroleum-ledger-source-gates.md).
Strategic resources methodology is documented in
[`docs/strategic-resources-methodology.md`](docs/strategic-resources-methodology.md),
with source decisions in
[`docs/strategic-resources-source-audit.md`](docs/strategic-resources-source-audit.md).
Defence, alliances and strategic posture methodology is documented in
[`docs/defence-alliances-methodology.md`](docs/defence-alliances-methodology.md),
with source decisions in
[`docs/defence-alliances-source-audit.md`](docs/defence-alliances-source-audit.md).

## Next data priorities

The next public-source work is to turn roadmap gaps into named, source-safe
envelopes without inventing values. Current priorities are:

- Australian fuel strategy and fuel-security policy: latest official fuel
  strategy, product days-cover updates, MSO reserve commitments and public vs
  security-sensitive data boundaries.
- Queensland fuel sovereignty: AFIP EOI updates, six-port project status,
  storage/refining capacity, state-owned land parcels, proponents, contracts,
  Taroom Trough approvals and federal/state approval pathways.
- Live fuel operations: station availability, regional outage feeds, terminal
  inventory, port-destination visibility, tanker ETAs and contract-backed
  delivery visibility.
- Food, farms and water: fertiliser cover and contracts, farm diesel risk,
  farm-gate fertiliser prices, water allocation by food-producing region,
  drought/rainfall pressure, planting decision pressure and freight disruption.
- Defence procurement watch items: source-gated Japan/Australia warship or
  frigate procurement pathway, contract status, delivery timeline, Australian
  industry content and logistics/fuel implications. Pending official Defence or
  procurement source verification.
- Housing and economy: interest rates, mortgage pressure, first-home buyers,
  investor ownership, negative-gearing modelling, rental stress, supply and
  household debt.
- AI automation and workforce: sector exposure, displacement risk,
  productivity effects, regional workforce exposure and retraining capacity.
- Brisbane 2032 readiness: infrastructure delivery, transport capacity,
  accommodation pressure, power reliability, tourism pressure, supply-chain
  readiness, public safety and emergency logistics.

## Run locally

The committed site can be served as static files because the dashboard JSX is
precompiled. Serve the repo root with any static server - `fetch()` of the JSON
envelopes does not work from `file://`, so you must use a server.

```sh
python3 -m http.server 8000
# then visit:
#   http://localhost:8000/ui_kits/national-status-dashboard/index.html
#   http://localhost:8000/ui_kits/fuel-security-dashboard/index.html
#   http://localhost:8000/ui_kits/australian-fuel-strategy-dashboard/index.html
#   http://localhost:8000/ui_kits/qld-fuel-sovereignty-dashboard/index.html
#   http://localhost:8000/ui_kits/resource-value-dashboard/index.html
#   http://localhost:8000/ui_kits/state-contribution-dashboard/index.html
#   http://localhost:8000/ui_kits/strategic-resources-dashboard/index.html
#   http://localhost:8000/ui_kits/defence-alliances-dashboard/index.html
#   http://localhost:8000/ui_kits/defence-procurement-watch/index.html
#   http://localhost:8000/ui_kits/fuel-dashboard/index.html
#   http://localhost:8000/ui_kits/fertilizer-dashboard/index.html
#   http://localhost:8000/ui_kits/oil-and-production/index.html
#   http://localhost:8000/ui_kits/who-pays-what/index.html
#   http://localhost:8000/ui_kits/au-economics-dashboard/index.html
#   http://localhost:8000/ui_kits/manufacturing-dashboard/index.html
#   http://localhost:8000/ui_kits/power-grid-dashboard/index.html
#   http://localhost:8000/ui_kits/infrastructure-dashboard/index.html
#   http://localhost:8000/ui_kits/employment-automation-dashboard/index.html
#   http://localhost:8000/ui_kits/missing-data-scoreboard/index.html
```

## Data pipeline

Every series shown on the site lives as a JSON envelope on disk. Envelopes are
produced by `scripts/fetch_data.py` for programmatic sources or hand-keyed into
`data/manual/` for PDFs, paywalls, JS-rendered tables and sources that require a
human check. The dashboards read those JSON files via
`ui_kits/shared/data-loader.js`.

```
data/
  sources.yml              master registry — every dataset used, with
                           publisher, URLs, cadence, rights and fetch mode
  source_manifest.json     browser manifest that tells dashboards whether to
                           look in generated/ or manual/ first
  generated/*.json         produced by scripts/fetch_data.py
  manual/*.json            hand-keyed from the named public document
```

### Source registry contract

Each source in `data/sources.yml` must have:

- `id`, `human_name`, `publisher`, `format`, `update_cadence`, `last_verified`
- `url` and `canonical_url` for the human-facing publisher page
- `fetch` set to `programmatic`, `derived`, `manual` or `unavailable`
- `fetch_url` only when `fetch: programmatic`
- `rights`, `rights_url`, `citation` and `reuse_notes` describing upstream source rights
- `used_by` listing the dashboard surfaces that depend on it

`url` remains for compatibility with existing scripts; new code should prefer
`canonical_url` for citations and `fetch_url` for machine retrieval. Sources may
also include fetcher-specific keys such as ABS SDMX parameters or APS workbook
sheet/column names.

### Envelope schema

A successful envelope uses `status: "ok"` and must carry a real retrieval time,
a latest data point and either numeric `values` or a structured `extra` block.

```json
{
  "series_id": "eia_brent",
  "source_id": "eia_brent",
  "source_name": "Brent crude spot price (EIA)",
  "source_url": "https://www.eia.gov/dnav/pet/pet_pri_spt_s1_d.htm",
  "unit": "USD per barrel",
  "retrieved_at": "2026-04-18T00:00:00+00:00",
  "last_data_point": "2026-04-01",
  "values": [{"t": "2026-04", "v": 66.42}],
  "notes": "Monthly average from published daily observations.",
  "status": "ok",
  "manual_entry": false
}
```

An unavailable stub must not look freshly retrieved:

```json
{
  "series_id": "aps_monthly",
  "source_id": "aps_monthly",
  "retrieved_at": null,
  "stub_created_at": "2026-04-18T12:27:44+00:00",
  "last_data_point": null,
  "values": [],
  "notes": "Awaiting hand-keyed values from the named public source.",
  "status": "unavailable",
  "manual_entry": true
}
```

Dashboard dates are deliberately split:

- `Refreshed` is the last successful automated pipeline run recorded in
  `data/last_successful_refresh.json`.
- `Page data retrieved` is the newest `retrieved_at` timestamp among verified
  envelopes loaded by that dashboard page.
- `Latest source data point` is the newest reporting period in those envelopes.

This means a dashboard can refresh today while still showing an older monthly,
quarterly or annual government source period. If a page has no verified loaded
data, it says so instead of showing a stub timestamp.

When `status` is anything other than `"ok"`, the dashboard shows a
**"Source unavailable — awaiting data"** placeholder instead of a value. We
never estimate.

## Validation and CI

Run the validator before opening or merging a PR:

```sh
pip install -r requirements.txt
npm ci
npm run check:ui
npm run smoke:ui
python3 scripts/validate_data.py
python3 scripts/validate_data.py --json
python3 scripts/build_source_manifest.py --check
python3 scripts/review_due.py
python3 -m unittest discover -s tests
```

The validator checks `data/sources.yml`, all generated/manual envelopes and the
source IDs referenced by dashboard pages. It rejects duplicate IDs, missing
registry entries, invalid status/timestamp semantics, inconsistent manual-entry
flags, malformed values and unstructured `extra` data.

`.github/workflows/ci.yml` runs on pull requests and pushes. It installs the
minimal Python dependencies in `requirements.txt` and the pinned Node build
dependencies in `package-lock.json`, checks that compiled dashboard JS is fresh,
compile-checks scripts, runs the data validator, checks the browser source
manifest, and runs unit tests for the fetch/data-entry transforms.

`.github/workflows/manual-data-review.yml` runs weekly and on demand. It runs
the validator, writes a `scripts/review_due.py` summary to the Actions job
summary, and uploads JSON/text review artifacts. The workflow is advisory: a
source can be due or intentionally unavailable without inventing a replacement
number.

## Run the pipeline locally

```sh
pip install -r requirements.txt
python3 scripts/fetch_data.py                 # pull every programmatic source
python3 scripts/fetch_data.py --only eia_brent
python3 scripts/fetch_data.py --check         # blocking check: programmatic fetch URLs only
python3 scripts/fetch_data.py --check-all-links  # broad link-health check for canonical pages
python3 scripts/init_manual_stubs.py          # create missing manual stubs
python3 scripts/build_source_manifest.py      # update browser loader manifest
python3 scripts/validate_data.py              # validate registry and envelopes
```

### Weekly refresh

`.github/workflows/refresh-data.yml` runs every Monday at 02:00 AEST
(`cron: "0 16 * * 0"`). It:

1. Checks only programmatic `fetch_url` endpoints as a blocking preflight.
2. Runs broad canonical/manual link health as a non-blocking diagnostic.
3. Refreshes programmatic JSON envelopes.
4. Creates any missing manual stubs.
5. Rebuilds `data/source_manifest.json`.
6. Runs `scripts/validate_data.py` before committing.
7. Writes `data/last_successful_refresh.json` only after successful refresh and
   validation.
8. Commits changed data files to the repository only after validation passes.

Manual and canonical publisher pages should not block a valid programmatic data
refresh; broken programmatic fetch URLs should fail loudly.

To run the scheduled refresh manually, open the repository on GitHub, go to
Actions, choose **Weekly data refresh**, then use **Run workflow** on `main`.
That refresh only updates programmatic envelopes and stubs. Manual public
snapshot sources, such as PM&C national status, FSSP disclosures, company
profits and resource-value receipts, still need a human review before changing
their JSON.

The site header uses the refresh marker for the top-level `Refreshed` date.
Page-level coverage panels and footers continue to show the latest verified
retrieval date among the source envelopes loaded by that page.

To run the manual review report from GitHub, open Actions, choose
**Manual data review**, then use **Run workflow** on `main`. Read the summary
before editing manual JSON; stale and unavailable items are prompts for review,
not permission to estimate.

### Add or update a source

1. Add or edit an entry in `data/sources.yml` with the full source registry contract above.
2. If `fetch: programmatic`, register a fetcher in `FETCHERS` inside
   `scripts/fetch_data.py` that returns `{unit, values, last_data_point, notes}`.
3. If `fetch: manual`, run `python3 scripts/init_manual_stubs.py` to create
   the placeholder, then use `python3 scripts/enter_manual.py` after verifying
   the named publisher document. Time-series values use `--point
   YYYY-MM=123.4 --unit <unit>`. Scalar records, such as company tax table
   fields, use typed `extra.fields`, for example `--field
   fiscal_year=2023-24 --field total_income=1234 --last-data-point
   2024-06-30`.
   Use `python3 scripts/enter_manual.py --examples` for source-specific command
   templates and review `docs/manual-entry-templates.md` before updating public
   snapshot sources.
4. When manual values are verified, set `status` to `"ok"`, set `retrieved_at`
   to the data-entry timestamp, set `last_data_point`, and keep
   `manual_entry: true`.
5. If `fetch: unavailable`, leave the stub unavailable until a named public
   source can support the figure.
6. Reference the envelope from one of the dashboard pages by adding its ID to
   the page's `SERIES` array and passing `fromEnvelope={data.<id>}` to
   `<MetricCard>` or `<ChartCard>`.
7. Run `python3 scripts/build_source_manifest.py` and
   `python3 scripts/validate_data.py` before committing.

### Manual review due report

Run this when checking whether hand-keyed sources need attention:

```sh
python3 scripts/review_due.py
python3 scripts/review_due.py --used-by national_status
python3 scripts/review_due.py --used-by resource_value --json
```

The report uses the same freshness windows as the validator and flags missing,
unavailable or stale manual envelopes. It does not fail CI by default because
some public sources legitimately lag; use `--fail-on-due` only for an
intentional manual-data review workflow.

## Fuel Stress Index gate

The Fuel Stress Index has not been implemented. Its input, exclusion,
freshness, confidence and coverage rules are locked in
`docs/fuel-stress-index-spec.md`. Do not add scoring code or public labels until
the score can show missing inputs, stale/manual status and component coverage
beside the number. The fuel-security dashboard is not the Fuel Stress Index; its
methodology and unavailable operational feeds are documented in
`docs/fuel-security-methodology.md`.

## Repo layout

```
README.md                      This file
SKILL.md                       Agent Skill front-matter
colors_and_type.css            Design tokens (color, type, spacing, motion)
assets/                        Logo mark, Australia outline
preview/                       Small HTML reference cards for each token group

data/
  sources.yml                  Master source registry
  generated/                   JSON produced by fetch_data.py
  manual/                      Hand-keyed JSON for sources we can't fetch
  source_manifest.json         Browser loader manifest

scripts/
  build_source_manifest.py     Builds data/source_manifest.json
  enter_manual.py              Safer manual data-entry helper
  fetch_data.py                Pipeline entry point
  init_manual_stubs.py         Creates missing data/manual/*.json stubs
  review_due.py                Reports manual sources that need review
  validate_data.py             Validates registry, envelopes and dashboard refs
  write_refresh_status.py      Writes data/last_successful_refresh.json after refresh

tests/
  test_fetch_transforms.py     Fetch/derivation transform coverage
  test_enter_manual.py         Manual-entry helper coverage
  ui-smoke.spec.js             Playwright smoke tests for every dashboard route

.github/workflows/
  ci.yml                       PR/push validation
  manual-data-review.yml       Weekly/manual advisory stale-source report
  refresh-data.yml             Weekly Monday 02:00 AEST data refresh

ui_kits/
  shared/                      Header, Footer, MetricCard, ChartCard,
                               InsightFeed, data-loader, styles — used by
                               every dashboard
  national-status-dashboard/   v1.4 — public fuel-status snapshot
  fuel-security-dashboard/     v1.7 — fuel-security visibility and gaps
  australian-fuel-strategy-dashboard/ v0.1 - fuel strategy and MSO policy source gates
  qld-fuel-sovereignty-dashboard/ v0.1 - Queensland AFIP delivery tracker and source gates
  resource-value-dashboard/    v1.5 — tax, PRRT, royalties, export value
    state-contribution-dashboard/ v1.3 - state petroleum ledger, source gates, defined object counts and partial production mapping
  strategic-resources-dashboard/ v1.0 - critical minerals and strategic resource context
  defence-alliances-dashboard/ v1.0 - public defence posture, alliances and capability context
  defence-procurement-watch/    v0.1 - source-gated defence procurement accountability tracker
  fuel-dashboard/              v1.0 — liquid fuel
  fertilizer-dashboard/        v1.2 - food, farms and water security
  oil-and-production/          v1.2 — crude, refining, government spending
  who-pays-what/               v1.3 — tax vs consumer price vs profit
```

## Accessibility

- WCAG AA contrast on all text and data colours
- Skip link on every page
- Keyboard-navigable charts (arrow keys scrub; Escape clears)
- ARIA labels on all non-text affordances
- `prefers-reduced-motion` honoured

## Editorial rules

- Plain English. Any acronym expanded on first use.
- Every chart has a one-line plain-English takeaway above it, units on axes,
  and a source line below it.
- No fonts, colours or tokens outside `colors_and_type.css`.
- No dark mode. No emojis. No gradients.
- No made-up data. Ever. If a number cannot be sourced from a named public
  document, the card renders "Source unavailable" — never an estimate.
- Do not describe a page as live or current unless the referenced envelopes have
  `status: "ok"` and valid freshness metadata.
- On the fuel-security surfaces, "shipping" means aggregate public PM&C tanker
  counts unless a future source-safe vessel feed is explicitly registered.

## Deployment (suggested, not configured)

Either option works — both are free for public static sites and trigger on
push to `main`:

- **GitHub Pages** — simplest. Settings → Pages → Build from branch `main`,
  folder `/`. Note that GitHub Pages serves the entire repo, so the JSON
  envelopes under `data/` are fetched the same way the dev server resolves
  them.
- **Cloudflare Pages** — more control. Connect the repo, set build command
  to none and output directory to `/`.

## License and source rights

Project code is MIT licensed. Project-authored prose and metadata are released
under CC BY 4.0 unless a file states otherwise.

Upstream source data remains under the rights, terms and citation requirements
of each publisher. Those publisher rights are tracked per source in
`data/sources.yml` through `rights`, `rights_url`, `citation` and
`reuse_notes`. Do not assume this repository can relicense upstream source data.
